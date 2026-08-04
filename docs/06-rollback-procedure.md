# Rollback Procedure

## Cloud & DevOps Bootcamp Capstone Project

---

# 1. Introduction

This document describes the rollback strategy implemented for the FormFlow application.

A rollback is the process of restoring a previously deployed, stable version of an application after a deployment failure or when a newly released version introduces unexpected issues.

One of the client's primary requirements was the ability to quickly recover from failed deployments without manually rebuilding the application. To satisfy this requirement, the deployment process was designed around immutable Docker images and Semantic Versioning.

By retaining previously deployed image versions in Docker Hub, the team can restore a known-good application version within minutes.

---

# 2. Rollback Objectives

The rollback procedure was designed to achieve the following objectives:

- Restore application availability quickly.
- Minimize production downtime.
- Avoid rebuilding Docker images.
- Maintain deployment consistency.
- Preserve deployment history.
- Reduce operational risk.
- Support reliable recovery during production incidents.

---

# 3. Rollback Strategy

Every application release is assigned a unique Semantic Version.

Examples include:

```
v1.0.0
v1.0.1
v1.1.0
v2.0.0
```

Instead of relying on Docker's `latest` tag, each deployment references a specific version.

Because previous versions remain stored in Docker Hub, any stable release can be redeployed when necessary.

---

# 4. When to Perform a Rollback

A rollback should be considered when any of the following conditions occur:

- Application becomes unavailable after deployment.
- Health checks repeatedly fail.
- Containers fail to start.
- Critical bugs are discovered in production.
- Database connectivity fails after deployment.
- Performance degrades significantly.
- The deployed version does not meet functional expectations.

---

# 5. Rollback Architecture

```
Deployment Failure

        │

        ▼

Identify Last Stable Version

        │

        ▼

Pull Previous Docker Images

        │

        ▼

Update Deployment Version

        │

        ▼

Restart Docker Compose

        │

        ▼

Run Health Checks

        │

        ▼

Production Restored
```

---

# 6. Rollback Prerequisites

Before beginning a rollback, ensure the following are available:

- SSH access to the Linux Virtual Machine.
- Access to Docker Hub.
- Previous Docker image versions.
- Docker Compose configuration.
- Deployment logs.
- Health check commands.

---

# 7. Rollback Procedure

## Step 1 — Connect to the Production Server

Connect to the Linux Virtual Machine using SSH.

```bash
ssh <username>@<public-ip>
```

---

## Step 2 — Navigate to the Project Directory

Move into the application directory.

```bash
cd formflow-tracker
```

---

## Step 3 — Identify the Previous Stable Version

List available Docker images.

```bash
docker images
```

Determine the last known-good image tag.

Example:

```
Frontend  v1.0.0

Frontend  v1.0.1

Frontend  v1.1.0
```

Suppose `v1.0.1` is the last stable release.

---

## Step 4 — Update the Deployment Version

Modify the deployment configuration to reference the required image tag.

Example:

```env
IMAGE_TAG=v1.0.1
```

This ensures Docker Compose deploys the selected version rather than the latest release.

---

## Step 5 — Pull the Required Images

Retrieve the specified version from Docker Hub.

```bash
docker compose pull
```

Docker downloads the required versioned images.

---

## Step 6 — Restart the Application

Redeploy the containers.

```bash
docker compose up -d
```

Docker Compose recreates the affected services using the selected image version.

---

## Step 7 — Verify Container Status

Confirm that all services are running.

```bash
docker compose ps
```

Expected services:

- Frontend
- Backend
- PostgreSQL

All containers should report a healthy running state.

---

## Step 8 — Verify Application Availability

Open a web browser and navigate to the application's public IP address.

```
http://<Public-IP>
```

Confirm that:

- The application loads successfully.
- All critical features function correctly.
- No deployment errors are present.

---

# 8. Post-Rollback Validation

After completing the rollback, perform the following validation checks.

| Validation            | Expected Result      |
| --------------------- | -------------------- |
| Containers Running    | All services healthy |
| Frontend Accessible   | Yes                  |
| Backend Responding    | Yes                  |
| Database Connected    | Yes                  |
| Correct Image Version | Verified             |
| Health Checks         | Passed               |

Only after these checks pass should the rollback be considered successful.

---

# 9. Rollback Verification Commands

Useful commands during rollback include:

Check container status.

```bash
docker compose ps
```

Inspect container logs.

```bash
docker compose logs
```

Inspect a specific service.

```bash
docker logs <container-name>
```

Verify available Docker images.

```bash
docker images
```

Check disk usage.

```bash
df -h
```

---

# 10. Rollback Best Practices

The following practices improve rollback reliability:

- Always deploy versioned images.
- Never rely solely on the `latest` Docker tag.
- Test rollback procedures before production releases.
- Keep previous Docker images available.
- Verify application health after every rollback.
- Document every rollback event.
- Monitor deployment logs throughout the process.

---

# 11. Limitations

The rollback process restores the application containers to a previous version but does not automatically reverse any database schema changes that may have been introduced by the failed deployment.

If future releases include database migrations, an appropriate database rollback strategy should also be implemented.

---

# 12. Future Improvements

Future versions of the deployment platform could enhance rollback capabilities through:

- Automated rollback triggered by failed health checks.
- Blue-Green deployments.
- Canary deployments.
- Kubernetes rolling updates.
- Automated deployment approval gates.
- Infrastructure monitoring with alerting.
- Database migration version control.
- Backup and restore automation.

These improvements would further reduce downtime and increase deployment resilience.

---

# 13. Conclusion

The rollback strategy provides a reliable mechanism for recovering from failed deployments while maintaining service continuity.

By combining Semantic Versioning, Docker Hub image storage, Docker Compose orchestration, and automated deployment practices, the team can quickly restore a previously stable application version without rebuilding images or manually copying application files.

This approach satisfies the client's requirement for fast, dependable recovery and strengthens the overall reliability of the deployment process.
