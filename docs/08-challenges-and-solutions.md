# Challenges and Solutions

## Cloud & DevOps Bootcamp Capstone Project

---

# 1. Introduction

Every engineering project presents challenges that require investigation, troubleshooting, and problem-solving. Throughout the implementation of the FormFlow deployment platform, our team encountered several technical issues involving Docker, GitHub Actions, Docker Hub, Linux, and deployment automation.

Rather than treating these challenges as setbacks, we used them as opportunities to improve the overall reliability, security, and maintainability of the solution.

This document summarizes the major issues encountered, how they were investigated, and the solutions that were implemented.

---

# Challenge 1

## Docker Build Failure

### Problem

The backend Docker image failed to build successfully.

Docker reported missing project files during the image build process.

---

### Investigation

The Docker build logs were reviewed to determine where the build process failed.

Inspection of the Dockerfile showed that not all required application files were being copied into the Docker build context.

---

### Root Cause

The required project configuration files were missing from the Docker image during the build stage.

---

### Solution

The Dockerfile was updated to include all required project files before the build process began.

The image was rebuilt successfully.

---

### Lesson Learned

Always verify that every required application file is copied into the Docker build context.

---

# Challenge 2

## GitHub Actions Failed Due to Missing Secrets

### Problem

The CI/CD workflow failed before Docker images could be published.

---

### Investigation

GitHub Actions logs were examined.

The workflow reported missing repository secrets.

---

### Root Cause

Required deployment secrets had not yet been configured in the GitHub repository.

---

### Solution

The required GitHub Secrets were created.

Examples included:

- Docker Hub Username
- Docker Hub Token
- VM Host
- VM Username
- SSH Private Key

The workflow completed successfully after the missing secrets were added.

---

### Lesson Learned

Always verify repository secrets before running deployment pipelines.

---

# Challenge 3

## Docker Hub Authentication Failure

### Problem

Docker images could not be pushed to Docker Hub.

Authentication failed during the pipeline.

---

### Investigation

The GitHub Actions logs showed authentication errors during the Docker login step.

---

### Root Cause

The Docker Hub Personal Access Token did not have the required permissions.

---

### Solution

A new Docker Hub Personal Access Token was generated with the appropriate access scopes and updated in GitHub Secrets.

The pipeline successfully authenticated and pushed the images.

---

### Lesson Learned

Authentication tokens should always be verified before integrating them into automated workflows.

---

# Challenge 4

## Linux VM Storage Exhaustion

### Problem

Application deployment failed even though Docker images had been built successfully.

Containers repeatedly failed during startup.

---

### Investigation

The Linux Virtual Machine was inspected.

Commands such as:

```bash
df -h
```

and

```bash
docker images
```

were used to examine available storage.

---

### Root Cause

Old Docker images from previous deployments had accumulated and consumed the majority of the available disk space.

---

### Solution

Unused Docker images were removed.

Example commands:

```bash
docker image prune -a
```

```bash
docker system prune
```

Deployment was then repeated successfully.

---

### Lesson Learned

Routine maintenance of Docker images is essential for production systems.

---

# Challenge 5

## Image Version Management

### Problem

Early deployments relied on manually tracking image versions.

Determining the exact production version became increasingly difficult.

---

### Investigation

Deployment history and Docker image tags were reviewed.

---

### Root Cause

A standardized versioning strategy had not yet been implemented.

---

### Solution

Semantic Versioning was adopted.

Examples:

```
v1.0.0

v1.0.1

v1.1.0

v2.0.0
```

Each deployment became uniquely identifiable.

---

### Lesson Learned

Consistent image versioning simplifies deployment tracking and rollback.

---

# Challenge 6

## Manual Deployment Process

### Problem

Manual deployments required SSH access and several repetitive commands.

The process was time-consuming and susceptible to human error.

---

### Investigation

The existing deployment workflow was reviewed.

Several manual tasks were identified.

---

### Root Cause

No deployment automation existed.

---

### Solution

GitHub Actions was introduced to automate:

- Docker image builds
- Docker Hub publishing
- SSH deployment
- Container updates
- Health verification

Deployments became consistent and repeatable.

---

### Lesson Learned

Automation significantly reduces deployment risk.

---

# Challenge 7

## Rollback Planning

### Problem

The client required the ability to recover quickly from failed deployments.

---

### Investigation

Different rollback strategies were evaluated.

---

### Root Cause

Using Docker's `latest` tag would not allow reliable recovery to a previous release.

---

### Solution

The deployment process was redesigned around immutable, versioned Docker images.

Previous releases remained available in Docker Hub, enabling rapid restoration of a known-good version.

---

### Lesson Learned

Rollback should be designed before the first production deployment.

---

# Challenge 8

## Secure Secret Management

### Problem

Sensitive deployment credentials were required throughout the CI/CD process.

---

### Investigation

The deployment pipeline was reviewed to identify all credentials required during build and deployment.

---

### Root Cause

Hardcoding credentials would expose sensitive information and create unnecessary security risks.

---

### Solution

All secrets were stored securely using GitHub Secrets and runtime environment variables.

No passwords, tokens, or private keys were committed to the GitHub repository.

---

### Lesson Learned

Security should be integrated into the deployment process from the beginning.

---

# Summary of Challenges

| Challenge                 | Resolution                         |
| ------------------------- | ---------------------------------- |
| Docker build failure      | Updated Docker build context       |
| Missing GitHub Secrets    | Configured required secrets        |
| Docker Hub authentication | Generated new access token         |
| VM storage exhaustion     | Cleaned unused Docker images       |
| Image version tracking    | Adopted Semantic Versioning        |
| Manual deployment         | Automated with GitHub Actions      |
| Rollback strategy         | Implemented version-based rollback |
| Secret management         | Used GitHub Secrets                |

---

# Overall Reflection

The challenges encountered throughout this project provided valuable practical experience with Docker, Linux administration, CI/CD automation, cloud deployment, and operational troubleshooting.

Each issue strengthened our understanding of modern DevOps practices and reinforced the importance of planning, automation, documentation, and continuous improvement.

Rather than viewing deployment failures as obstacles, we treated them as learning opportunities that ultimately resulted in a more robust and reliable deployment platform.
