const requests = {
    // Platform CRUD Operations
    platform: {
        create: {
            method: 'POST',
            url: 'http://localhost:3001/api/platforms',
            body: {
                name: "GitHub",
                supported_languages: ["JavaScript", "Python", "Java", "Go", "Ruby"],
                config: {
                    api_url: "https://api.github.com",
                    webhook_enabled: true,
                    scan_frequency: "daily"
                }
            }
        },
        getAll: {
            method: 'GET',
            url: 'http://localhost:3001/api/platforms'
        },
        getById: {
            method: 'GET',
            url: 'http://localhost:3001/api/platforms/{platformId}'
        },
        update: {
            method: 'PUT',
            url: 'http://localhost:3001/api/platforms/{platformId}',
            body: {
                name: "GitHub Enterprise",
                supported_languages: ["JavaScript", "Python", "Java", "Go", "Ruby", "PHP"],
                config: {
                    api_url: "https://github.enterprise.com/api",
                    webhook_enabled: true,
                    scan_frequency: "hourly"
                }
            }
        },
        delete: {
            method: 'DELETE',
            url: 'http://localhost:3001/api/platforms/{platformId}'
        }
    },

    // Tool CRUD Operations
    tool: {
        create: {
            method: 'POST',
            url: 'http://localhost:3001/api/tools',
            body: {
                name: "Git-leak",
                version: "8.15.2",
                config: {
                    severity_levels: ["HIGH", "CRITICAL"],
                    scan_timeout: 300,
                    exclude_patterns: [".env", "*.log"],
                    type: "Secret Scanner",
                    target: "Git History",
                    analytics: 85
                }
            }
        },
        getAll: {
            method: 'GET',
            url: 'http://localhost:3001/api/tools'
        },
        getById: {
            method: 'GET',
            url: 'http://localhost:3001/api/tools/{toolId}'
        },
        update: {
            method: 'PUT',
            url: 'http://localhost:3001/api/tools/{toolId}',
            body: {
                version: "8.16.0",
                config: {
                    severity_levels: ["HIGH", "CRITICAL", "MEDIUM"],
                    scan_timeout: 600,
                    exclude_patterns: [".env", "*.log", "node_modules"],
                    type: "Secret Scanner",
                    target: "Git History",
                    analytics: 90
                }
            }
        },
        delete: {
            method: 'DELETE',
            url: 'http://localhost:3001/api/tools/{toolId}'
        }
    },

    // Pipeline CRUD Operations
    pipeline: {
        create: {
            method: 'POST',
            url: 'http://localhost:3001/api/pipelines',
            body: {
                name: "Security Scan Pipeline",
                tools: ["{toolId1}", "{toolId2}"],
                platform: "{platformId}",
                language: "javascript",
                stage: "security",
                yaml_content: `
name: Security Scan Pipeline
on:
  push:
    branches: [ main ]
jobs:
  security_scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Security Scan
        uses: security/scan-action@v1
`
            }
        },
        getAll: {
            method: 'GET',
            url: 'http://localhost:3001/api/pipelines'
        },
        getById: {
            method: 'GET',
            url: 'http://localhost:3001/api/pipelines/{pipelineId}'
        },
        update: {
            method: 'PUT',
            url: 'http://localhost:3001/api/pipelines/{pipelineId}',
            body: {
                name: "Enhanced Security Scan Pipeline",
                tools: ["{toolId1}", "{toolId2}", "{toolId3}"],
                language: "javascript",
                stage: "security",
                yaml_content: `
name: Enhanced Security Scan Pipeline
on:
  push:
    branches: [ main, develop ]
jobs:
  security_scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Enhanced Security Scan
        uses: security/enhanced-scan@v2
`
            }
        },
        delete: {
            method: 'DELETE',
            url: 'http://localhost:3001/api/pipelines/{pipelineId}'
        },
        search: {
            method: 'GET',
            url: 'http://localhost:3001/api/pipelines/search',
            queries: {
                simple: '?platform=github&language=javascript',
                advanced: '?platform=github&language=javascript&toolType=Secret Scanner&severity=HIGH&analytics=85&toolCount=2'
            }
        },
        generateYaml: {
            method: 'POST',
            url: 'http://localhost:3001/api/generate-yaml',
            body: {
                name: "Custom Pipeline",
                tools: ["{toolId1}", "{toolId2}"],
                platform: "{platformId}",
                language: "javascript"
            }
        }
    },

    // Development Operations
    dev: {
        cleanDatabase: {
            method: 'POST',
            url: 'http://localhost:3001/api/dev/clean-database'
        }
    }
};

// CURL command examples
const curlCommands = {
    platform: {
        create: `curl -X POST http://localhost:3001/api/platforms \\
-H "Content-Type: application/json" \\
-d '{
    "name": "GitHub",
    "supported_languages": ["JavaScript", "Python", "Java"],
    "config": {
        "api_url": "https://api.github.com",
        "webhook_enabled": true
    }
}'`,
        getAll: 'curl http://localhost:3001/api/platforms',
        getById: 'curl http://localhost:3001/api/platforms/{platformId}',
        update: `curl -X PUT http://localhost:3001/api/platforms/{platformId} \\
-H "Content-Type: application/json" \\
-d '{
    "name": "GitHub Enterprise",
    "supported_languages": ["JavaScript", "Python", "Java", "PHP"]
}'`,
        delete: 'curl -X DELETE http://localhost:3001/api/platforms/{platformId}'
    },

    tool: {
        create: `curl -X POST http://localhost:3001/api/tools \\
-H "Content-Type: application/json" \\
-d '{
    "name": "Git-leak",
    "version": "8.15.2",
    "config": {
        "severity_levels": ["HIGH", "CRITICAL"],
        "scan_timeout": 300
    }
}'`,
        getAll: 'curl http://localhost:3001/api/tools',
        getById: 'curl http://localhost:3001/api/tools/{toolId}',
        update: `curl -X PUT http://localhost:3001/api/tools/{toolId} \\
-H "Content-Type: application/json" \\
-d '{
    "version": "8.16.0",
    "config": {
        "severity_levels": ["HIGH", "CRITICAL", "MEDIUM"]
    }
}'`,
        delete: 'curl -X DELETE http://localhost:3001/api/tools/{toolId}'
    },

    pipeline: {
        create: `curl -X POST http://localhost:3001/api/pipelines \\
-H "Content-Type: application/json" \\
-d '{
    "name": "Security Scan Pipeline",
    "tools": ["toolId1", "toolId2"],
    "platform": "platformId",
    "language": "javascript",
    "stage": "security",
    "yaml_content": "name: Security Scan Pipeline\\non:\\n  push:\\n    branches: [ main ]"
}'`,
        search: 'curl "http://localhost:3001/api/pipelines/search?platform=github&language=javascript&toolType=Secret%20Scanner"',
        generateYaml: `curl -X POST http://localhost:3001/api/generate-yaml \\
-H "Content-Type: application/json" \\
-d '{
    "name": "Custom Pipeline",
    "tools": ["toolId1", "toolId2"],
    "platform": "platformId",
    "language": "javascript"
}'`
    },

    dev: {
        cleanDatabase: 'curl -X POST http://localhost:3001/api/dev/clean-database'
    }
};

module.exports = {
    requests,
    curlCommands
};
