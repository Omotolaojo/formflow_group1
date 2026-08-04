# Deployment Guide

## Cloud & DevOps Bootcamp Capstone Project

---

# 1. Introduction

This document provides a step-by-step guide for deploying the FormFlow application to a Linux Virtual Machine using Docker, Docker Compose, Docker Hub, and GitHub Actions.

The deployment process is fully automated through a Continuous Integration and Continuous Deployment (CI/CD) pipeline. Once configured, every successful code change automatically builds new Docker images, publishes them to Docker Hub, and deploys the latest version to the production server.

This guide also covers deployment verification and common troubleshooting steps.

---

# 2. Deployment Overview

The deployment workflow consists of the following stages:

```
Developer

    │

    ▼

Push Code to GitHub

    │

    ▼

GitHub Actions Pipeline

    │

    ▼

Build Docker Images

    │

    ▼

Push Images to Docker Hub

    │

    ▼

SSH into Linux VM

    │

    ▼

Pull Updated Images

    │

    ▼

Restart Containers

    │

    ▼

Deployment Verification
```

---

# 3. Prerequisites

Before deployment, ensure the following requirements have been completed.

## Local Machine

- Git installed
- Docker Desktop installed
- Docker Compose available
- GitHub account
- Docker Hub account

---

## Linux Virtual Machine

Provision a Linux Virtual Machine with:

- Ubuntu Server (or another supported Linux distribution)
- Public IP Address
- SSH access
- Internet connectivity
- Docker installed
- Docker Compose installed

---

## GitHub Repository

The repository should contain:

- Frontend source code
- Backend source code
- Dockerfiles
- docker-compose.yml
- GitHub Actions workflow
- Deployment scripts

---

# 4. Linux VM Preparation

After creating the virtual machine, connect via SSH.

```bash
ssh <username>@<public-ip>
```

Update the operating system.

```bash
sudo apt update
sudo apt upgrade -y
```

Install Docker.

```bash
sudo apt install docker.io -y
```

Enable Docker.

```bash
sudo systemctl enable docker
sudo systemctl start docker
```

Verify Docker installation.

```bash
docker --version
```

---

# 5. Install Docker Compose

Install Docker Compose if it is not already available.

Verify installation.

```bash
docker compose version
```

---

# 6. Clone the Repository

Clone the project repository onto the Linux Virtual Machine.

```bash
git clone <repository-url>
```

Navigate into the project directory.

```bash
cd formflow-tracker
```

---

# 7. Configure Environment Variables

Create the application environment file.

```bash
nano .env
```

Configure the required variables.

Example:

```env
IMAGE_TAG=v1.0.0

DATABASE_URL=<database-url>

POSTGRES_DB=<database-name>

POSTGRES_USER=<database-user>

POSTGRES_PASSWORD=<database-password>

NODE_ENV=production

PORT=5000
```

Never commit this file to GitHub.

---

# 8. GitHub Secrets Configuration

The following secrets must be configured in the GitHub repository.

| Secret             | Purpose                     |
| ------------------ | --------------------------- |
| DOCKERHUB_USERNAME | Docker Hub authentication   |
| DOCKERHUB_TOKEN    | Push Docker images          |
| VM_HOST            | Linux VM Public IP          |
| VM_USERNAME        | SSH username                |
| VM_SSH_KEY         | SSH private key             |
| DATABASE_URL       | Runtime database connection |
| API Keys           | Application authentication  |

These secrets allow GitHub Actions to deploy securely without exposing credentials.

---

# 9. Docker Image Build

Frontend and Backend images are built automatically.

Typical Docker build commands:

```bash
docker build -t frontend .
```

```bash
docker build -t backend .
```

GitHub Actions performs these steps automatically during every deployment.

---

# 10. Push Images to Docker Hub

After successful image creation, GitHub Actions authenticates with Docker Hub and publishes versioned images.

Example:

```bash
docker push username/formflow-frontend:v1.0.0
```

```bash
docker push username/formflow-backend:v1.0.0
```

Every image is tagged using Semantic Versioning.

---

# 11. Automated Deployment

Once the images have been published, GitHub Actions connects to the Linux VM via SSH.

Deployment tasks include:

- Pull latest versioned images
- Update Docker Compose services
- Restart containers
- Verify deployment

This process eliminates manual deployment steps.

---

# 12. Docker Compose Deployment

Docker Compose orchestrates the deployment of all services.

Typical deployment command:

```bash
docker compose pull
```

Followed by:

```bash
docker compose up -d
```

Docker Compose automatically starts:

- Frontend
- Backend
- PostgreSQL Database

---

# 13. Verify Running Containers

Confirm all services are running.

```bash
docker compose ps
```

Expected output should show:

- Frontend (Running)
- Backend (Running)
- PostgreSQL (Running)

---

# 14. Verify Docker Images

Confirm the deployed image versions.

```bash
docker images
```

Verify the expected Semantic Version tags are present.

Example:

```
frontend:v1.0.0

backend:v1.0.0
```

---

# 15. Verify Application Availability

Open a browser.

Navigate to:

```
http://<Public-IP>
```

The FormFlow application should load successfully without specifying any additional port.

This confirms that deployment was successful.

---

# 16. Health Checks

Application health can be verified using:

```bash
docker compose ps
```

Inspect logs when necessary.

```bash
docker compose logs
```

Inspect a specific service.

```bash
docker logs <container-name>
```

---

# 17. Deployment Verification Checklist

Deployment is considered successful when all of the following conditions are met.

| Verification                          | Status |
| ------------------------------------- | ------ |
| GitHub Actions completed successfully | ✅     |
| Docker images published               | ✅     |
| Containers running                    | ✅     |
| Application accessible                | ✅     |
| Correct image version deployed        | ✅     |
| No container restart failures         | ✅     |

---

# 18. Common Deployment Issues

## Docker Image Pull Failure

Possible causes:

- Incorrect image tag
- Docker Hub authentication failure
- Network connectivity issues

---

## Container Startup Failure

Possible causes:

- Missing environment variables
- Incorrect Docker Compose configuration
- Database connection failure

---

## Application Not Accessible

Possible causes:

- Firewall restrictions
- Incorrect port mapping
- Docker service not running

---

## GitHub Actions Failure

Possible causes:

- Invalid GitHub Secrets
- Docker Hub authentication failure
- SSH authentication failure

---

# 19. Deployment Best Practices

During deployment, the following best practices were observed.

- Use Semantic Versioning.
- Never deploy using the `latest` tag.
- Keep secrets outside the repository.
- Verify deployments after every release.
- Test rollback procedures regularly.
- Maintain deployment documentation.
- Keep Docker images lightweight.
- Remove unused images periodically.

---

# 20. Deployment Summary

The deployment process successfully automates the delivery of the FormFlow application from source code to production.

Using Docker, Docker Compose, GitHub Actions, Docker Hub, and a Linux Virtual Machine provides a repeatable and reliable deployment workflow that minimizes manual intervention while improving deployment consistency and version traceability.

This automated approach significantly reduces deployment risk and establishes a solid foundation for future cloud-native enhancements.
