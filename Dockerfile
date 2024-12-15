image: docker:24.0.7

services:
  - docker:24.0.7-dind

stages:
  - dependencycheck
  - sonarqube-check
  - sonarqube-vulnerability-report
  - build
  - test
  - trivy-scan
  - release
  - deploy
  - test-zap

variables:
  SONAR_USER_HOME: "${CI_PROJECT_DIR}/.sonar"
  GIT_DEPTH: "0"
  NODE_VERSION: "16"
  PROJECT_KEY: "${CI_PROJECT_PATH_SLUG}"

# Dependency Check job using Snyk
dependency-check:
  stage: dependencycheck
  allow_failure: true
  image: 
    name: node:${NODE_VERSION}
  before_script:
    - npm install -g snyk
  script:
    - npm install
    - snyk auth $SNYK_TOKEN
    - snyk test --file=./package.json --sarif-file-output=snyk.json || true
    - snyk monitor || true
  artifacts:
    paths:
      - ./snyk.json
    when: always
    expire_in: 1 week
  cache:
    key: ${CI_COMMIT_REF_SLUG}
    paths:
      - node_modules/
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
    - if: $CI_COMMIT_TAG
    - if: $CI_COMMIT_BRANCH == "develop"

# SonarQube Analysis
sonarqube-check:
  stage: sonarqube-check
  image: 
    name: sonarsource/sonar-scanner-cli:latest
    entrypoint: [""]
  script: 
    - sonar-scanner \
        -Dsonar.projectKey=${PROJECT_KEY} \
        -Dsonar.sources=. \
        -Dsonar.host.url=${SONAR_HOST_URL} \
        -Dsonar.login=${SONAR_TOKEN} \
        -Dsonar.nodejs.executable=/usr/bin/node \
        -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
  allow_failure: true
  rules:
    - if: $CI_PIPELINE_SOURCE == 'merge_request_event'
    - if: $CI_COMMIT_BRANCH == 'main'
    - if: $CI_COMMIT_BRANCH == 'develop'

# SonarQube Vulnerability Report
sonarqube-vulnerability-report:
  stage: sonarqube-vulnerability-report
  image: 
    name: curlimages/curl:latest
  script:
    - curl -u "${SONAR_TOKEN}:" "${SONAR_HOST_URL}/api/issues/search?componentKeys=${PROJECT_KEY}&branch=${CI_COMMIT_BRANCH}" > sonar-report.json
  artifacts:
    paths:
      - sonar-report.json
    expire_in: 1 week
  rules:
    - if: $CI_COMMIT_BRANCH == 'main'
    - if: $CI_COMMIT_BRANCH == 'develop'

# Build Docker Image
build:
  stage: build
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker pull $CI_REGISTRY_IMAGE:latest || true
    - docker build --cache-from $CI_REGISTRY_IMAGE:latest 
      --build-arg NODE_VERSION=${NODE_VERSION}
      --tag $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

# Run Tests
test:
  stage: test
  image: node:${NODE_VERSION}
  script:
    - npm install
    - npm run test
    - npm run coverage
  coverage: '/Lines\s*:\s*([0-9.]+)%/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
    paths:
      - coverage/
  cache:
    key: ${CI_COMMIT_REF_SLUG}
    paths:
      - node_modules/

# Trivy Security Scan
trivy-scan:
  stage: trivy-scan
  allow_failure: true
  image:
    name: aquasec/trivy:latest
    entrypoint: [""]
  variables:
    GIT_STRATEGY: none
    TRIVY_USERNAME: "$CI_REGISTRY_USER"
    TRIVY_PASSWORD: "$CI_REGISTRY_PASSWORD"
    TRIVY_AUTH_URL: "$CI_REGISTRY"
    FULL_IMAGE_NAME: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  script:
    - trivy image --exit-code 0 -f json -o trivy-report.json ${FULL_IMAGE_NAME}
    - trivy image --exit-code 1 --severity CRITICAL ${FULL_IMAGE_NAME}
  artifacts:
    paths:
      - trivy-report.json
    expire_in: 1 week

# Release Image
release:
  stage: release
  variables:
    GIT_STRATEGY: none
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker pull $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - docker tag $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA $CI_REGISTRY_IMAGE:latest
    - docker push $CI_REGISTRY_IMAGE:latest
  only:
    - main
    - tags

# Deploy to Production
deploy:
  stage: deploy
  image: alpine:latest
  variables:
    GIT_STRATEGY: none
  only:
    - main
  before_script:
    - apk update && apk add openssh-client bash
  script:
    - eval $(ssh-agent -s)
    - bash -c 'ssh-add <(echo "$SSH_PRIVATE_KEY")'
    - mkdir -p ~/.ssh
    - ssh-keyscan -H $SSH_SERVER_IP >> ~/.ssh/known_hosts
    - chmod 644 ~/.ssh/known_hosts
    - >
      ssh $SSH_USER@$SSH_SERVER_IP
      "docker login -u ${CI_REGISTRY_USER} -p ${CI_REGISTRY_PASSWORD} ${CI_REGISTRY};
      cd ${PATH_TO_PROJECT};
      docker compose down;
      docker pull ${CI_REGISTRY_IMAGE}:latest;
      docker compose up -d;
      docker image prune -f;"

# ZAP Security Scan
test-zap:       
  image: zaproxy/zap-stable
  stage: test-zap
  allow_failure: true
  needs: ['deploy']
  script:
    - mkdir /zap/wrk
    - /zap/zap-baseline.py -t http://$SSH_SERVER_IP:8080/ -g gen.conf -x report_xml 
  artifacts:
    when: always
    expire_in: 30 days
    paths:
      - report_xml