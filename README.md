# DevSecOps Pipeline Generator Platform

## Overview

The DevSecOps Pipeline Generator Platform is a web-based application designed to empower developers by simplifying the creation of custom DevSecOps CI/CD pipelines. This platform allows users to build secure, automated, and efficient pipelines tailored to their project requirements by selecting preferred tools, platforms, and technologies. With a user-friendly interface, the platform guides users through the process of integrating security and development tools, ultimately improving the software development lifecycle. It is particularly aimed at supporting new developers in adopting DevSecOps practices by providing predefined configurations and a streamlined workflow for pipeline generation.

This application was developed as part of a thesis project to demonstrate the integration of security practices into the DevOps workflow. It combines user management, a blogging system for knowledge sharing, and advanced pipeline generation features to foster learning and collaboration within the DevSecOps community.

## Key Features

### Basic Features
- **User Management**:
  - Login, Registration, and Forgot Password functionality for secure user access.
  - Admin capabilities to manage users (e.g., delete user accounts).
- **Blogging System**:
  - Write and delete blogs to share knowledge about DevSecOps tools and practices.
  - Comment on blogs and delete comments to facilitate community interaction.
- **Search and Filter**:
  - Search blogs by keywords.
  - Filter blogs by tags, tools, or other criteria to find relevant content easily.

### Advanced Features (Generator Template Pipeline)
- **Define Pipeline**:
  - Select predefined tools, platforms, and pipeline stages (e.g., SCA, SAST, DAST) to customize the DevSecOps workflow.
- **Configure Tools**:
  - Drag-and-drop interface for selecting and configuring tools for each pipeline stage.
- **Pipeline Generation**:
  - Generate a YAML configuration file containing the project setup, dependencies, and pipeline stages based on user selections.

### User Roles
- **User**: Can register, log in, write and delete blogs, comment on blogs, search/filter blogs, and generate pipeline templates.
- **Contributor**: Inherits all User permissions and additionally can define new tools, platforms, and pipeline stages to enrich the platform’s customization options.
- **Admin**: Inherits all User permissions and can manage users (e.g., delete accounts) and oversee system-level configurations.

## Architecture and Workflow

The platform is built as a web application hosted on an AWS EC2 instance, utilizing Docker for consistent deployment of services like DefectDojo and SonarQube. The pipeline generation workflow follows these steps:

1. **Platform and Language Selection**: Users choose their preferred development platform (e.g., GitLab, Jenkins) and programming language (e.g., Java, Python).
2. **Tool Selection**: Users select tools for each pipeline stage (e.g., Dependency-Check for SCA, SonarQube for SAST) using a drag-and-drop interface.
3. **YAML Generation**: The platform generates a YAML configuration file (e.g., `.gitlab-ci.yml`) containing the pipeline setup, which users can download and integrate into their CI/CD environment.

This workflow ensures consistency by using predefined components, preventing invalid configurations, and guiding users through standardized setup options. Contributors can add new tools and platforms to expand the platform’s offerings.


## Usage

### Generating a DevSecOps Pipeline Template
1. **Log In or Register**:
   - Access the platform and log in or create a new account.
2. **Navigate to Pipeline Generator**:
   - From the dashboard, select the "Generate Pipeline" option.
3. **Select Platform and Language**:
   - Choose your development platform (e.g., GitLab) and programming language (e.g., Python).
4. **Configure Tools**:
   - Use the drag-and-drop interface to select tools for each pipeline stage (e.g., GitLeaks for pre-commit, Dependency-Check for SCA).
5. **Generate YAML File**:
   - Click "Generate Template" to create a `.gitlab-ci.yml` file.
   - Download the file and add it to your GitLab repository to enable the pipeline.

### Writing and Sharing Blogs
- Navigate to the "Blog" section to write and publish blogs about DevSecOps tools and practices.
- Use the search and filter options to find relevant blogs.
- Comment on blogs to engage with the community.

### Contributing as a Contributor
- To become a Contributor, contact an Admin to upgrade your account.
- As a Contributor, you can define new tools, platforms, and pipeline stages to enhance the platform’s offerings.

## Contributing

We welcome contributions to improve the DevSecOps Pipeline Generator Platform! To contribute:

1. **Fork the Repository**:
   Fork the project on Github and clone your fork:
   ```bash
   git clone https://github.com/NguyenVanHung24/Gen-Pipeline
   ```

2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**:
   - Add new tools, platforms, or pipeline stages.
   - Improve the UI/UX of the drag-and-drop interface.
   - Fix bugs or enhance documentation.

4. **Test Your Changes**:
   Ensure all features work as expected by running the application locally with Docker Compose.

5. **Submit a Merge Request**:
   Push your changes and create a merge request on GitLab. An Admin or Contributor will review your contribution.

**Note**: To define new tools or platforms, you must be a Contributor. Contact an Admin to request Contributor access.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For questions, support, or to request Contributor access, please contact the project maintainers at `vanhungvtbn24@gmail.comcom`.

---
