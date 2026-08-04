# CI/CD Pipeline Documentation

## Cloud & DevOps Bootcamp Capstone Project

---

# 1. Introduction

One of the primary objectives of this project was to eliminate manual deployments by implementing a fully automated Continuous Integration and Continuous Deployment (CI/CD) pipeline.

Prior to automation, application deployments required manually connecting to the production server using SSH, copying files, rebuilding containers, and restarting services. This process was time-consuming, error-prone, and provided no reliable mechanism for tracking deployed versions or recovering from failed deployments.

To address these challenges, we implemented a GitHub Actions pipeline that automatically builds, versions, publishes, and deploys the application whenever approved changes are merged into the repository.

The automated pipeline provides consistency, repeatability, version traceability, and significantly reduces the risk of deployment errors.

---

# 2. CI/CD Objectives

The pipeline was designed to achieve the following objectives:

- Automate Docker image builds.
- Enforce Semantic Versioning.
- Publish Docker images to Docker Hub.
- Deploy automatically to the Linux Virtual Machine.
- Eliminate manual deployment steps.
- Reduce deployment time.
- Ensure deployment consistency.
- Support rapid rollback to previous versions.
- Secure deployment credentials.

---

# 3. CI/CD Architecture

The overall deployment workflow is illustrated below.

```
Developer

      │

      ▼

Git Commit

      │

      ▼

GitHub Repository

      │

      ▼

GitHub Actions

      │

 ┌───────────────┬────────────────┐

 ▼               ▼                ▼

Build Images  Push Images   Deployment

      │               │

      ▼               ▼

Docker Hub Registry

      │

      ▼

SSH into Linux VM

      │

      ▼

Docker Compose Pull

      │

      ▼

Docker Compose Up

      │

      ▼

Health Check

      │

      ▼

Production Environment
```

---

# 4. Pipeline Workflow

The pipeline is triggered automatically whenever code is pushed to the configured GitHub branch.

Each execution follows the same sequence of operations.

### Stage 1

Source code is retrieved from the GitHub repository.

---

### Stage 2

Docker images are built for:

- Frontend
- Backend

Each image is tagged using Semantic Versioning.

---

### Stage 3

GitHub Actions authenticates with Docker Hub using encrypted credentials stored as GitHub Secrets.

---

### Stage 4

Versioned Docker images are pushed to Docker Hub.

---

### Stage 5

GitHub Actions establishes a secure SSH connection to the Linux Virtual Machine.

---

### Stage 6

Docker Compose pulls the latest versioned images.

---

### Stage 7

Application containers are recreated.

---

### Stage 8

Health checks verify that deployment completed successfully.

---

# 5. GitHub Actions Workflows

The project uses GitHub Actions to automate the software delivery lifecycle.

The workflows are stored in:

```
.github/workflows/
```

Typical workflow files include:

```
ci.yml

release.yml

deploy.yml
```

Each workflow performs a specific responsibility within the deployment pipeline.

---

# 6. Continuous Integration

Continuous Integration focuses on validating every code change before deployment.

Typical CI tasks include:

- Checking out repository code
- Building Docker images
- Validating Dockerfiles
- Verifying Docker Compose configuration
- Tagging Docker images
- Preparing deployment artifacts

This ensures that only successfully built images proceed to deployment.

---

# 7. Continuous Deployment

Once Docker images have been published successfully, the deployment workflow automatically begins.

Deployment includes:

- Connecting to the Linux VM
- Pulling updated images
- Updating the running application
- Performing health verification

No manual file copying is required.

---

# 8. Docker Image Versioning

The pipeline uses Semantic Versioning instead of relying on Docker's `latest` tag.

Example image versions:

```
v1.0.0

v1.0.1

v1.1.0

v2.0.0
```

Every deployment references a specific version, making it easy to identify exactly what is running in production.

---

# 9. Docker Hub Integration

Docker Hub serves as the project's container registry.

After each successful build:

- Frontend image is pushed.
- Backend image is pushed.
- Tagged images become available for deployment.

Example image names:

```
dockerhub-user/formflow-frontend:v1.2.3

dockerhub-user/formflow-backend:v2.0.1
```

Versioned images provide reliable deployment history and simplify rollback operations.

---

# 10. GitHub Secrets

Sensitive deployment credentials are stored securely using GitHub Secrets.

| Secret             | Purpose                    |
| ------------------ | -------------------------- |
| DOCKERHUB_USERNAME | Docker Hub login           |
| DOCKERHUB_TOKEN    | Docker Hub authentication  |
| VM_HOST            | Linux VM Public IP         |
| VM_USERNAME        | SSH user                   |
| VM_SSH_KEY         | SSH private key            |
| IMAGE_TAG          | Deployment version         |
| API Keys           | Application authentication |

Using GitHub Secrets prevents sensitive information from being exposed within the repository.

---

# 11. Deployment Process

After successful authentication, GitHub Actions connects to the Linux Virtual Machine using SSH.

The deployment process performs the following tasks:

1. Navigate to the application directory.
2. Update the deployment version.
3. Pull Docker images.
4. Restart application containers.
5. Verify successful deployment.

This entire process is completed without manual intervention.

---

# 12. Docker Compose Deployment

Docker Compose manages all application services.

Deployment typically consists of:

```
docker compose pull
```

followed by:

```
docker compose up -d
```

Docker Compose ensures:

- Updated containers are created.
- Existing services are replaced.
- Internal networking remains unchanged.

---

# 13. Health Verification

Once deployment completes, the pipeline verifies that the application is operational.

Typical verification includes:

- Docker containers running.
- No container failures.
- Application responding successfully.
- Correct image versions deployed.

Example commands:

```
docker compose ps
```

```
docker compose logs
```

Health verification ensures production stability before considering deployment complete.

---

# 14. Rollback Support

One of the client's primary requirements was the ability to quickly recover from failed deployments.

The implemented versioning strategy makes rollback straightforward.

Rollback procedure:

1. Select the previous stable image tag.
2. Pull the required Docker images.
3. Restart Docker Compose.
4. Verify application health.

Because every deployment references a unique image tag, previous versions remain available for recovery.

---

# 15. Pipeline Benefits

The implemented CI/CD pipeline provides several operational advantages.

| Feature             | Benefit                             |
| ------------------- | ----------------------------------- |
| GitHub Actions      | Fully automated workflow            |
| Docker Images       | Consistent runtime environment      |
| Docker Hub          | Centralized image repository        |
| Semantic Versioning | Deployment traceability             |
| GitHub Secrets      | Secure credential management        |
| Docker Compose      | Reliable multi-container deployment |
| SSH Automation      | No manual server access required    |
| Rollback Strategy   | Faster incident recovery            |

---

# 16. Challenges Encountered

During implementation, several issues were encountered and resolved.

### Docker Build Failures

Some Docker builds initially failed because required project files were not included in the Docker build context.

---

### Docker Hub Authentication

Image pushes failed due to insufficient access token permissions.

Generating a new Docker Hub Personal Access Token with the correct scopes resolved the issue.

---

### GitHub Secrets

Several workflow failures occurred because required GitHub Secrets were missing or incorrectly configured.

Adding the required secrets restored successful pipeline execution.

---

### Linux VM Storage

Repeated deployments consumed significant disk space due to unused Docker images.

A cleanup step was introduced to remove obsolete images after successful deployments.

---

### Version Tracking

Early deployments relied on manually managed image tags.

Adopting Semantic Versioning and maintaining the `IMAGE_TAG` variable simplified deployment management and rollback.

---

# 17. Best Practices Adopted

The following best practices were applied throughout pipeline development:

- Automate repetitive tasks.
- Store secrets securely.
- Use Semantic Versioning.
- Avoid Docker's `latest` tag.
- Verify every deployment.
- Keep deployment scripts idempotent.
- Test rollback procedures.
- Clean unused Docker images regularly.
- Maintain deployment documentation.

---

# 18. Pipeline Summary

The implemented CI/CD pipeline successfully transforms the deployment process from a manual, error-prone workflow into an automated and repeatable delivery pipeline.

By integrating GitHub Actions, Docker Hub, Docker Compose, and a Linux Virtual Machine, every deployment follows the same tested process, ensuring consistency, version traceability, and rapid recovery from deployment failures.

The resulting solution aligns with modern DevOps practices and satisfies the client's requirements for continuous delivery, deployment reliability, and operational efficiency.
