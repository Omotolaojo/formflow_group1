# Incident Report

## Cloud & DevOps Bootcamp Capstone Project

---

# 1. Incident Overview

## Incident Title

Deployment Failure Due to Insufficient Disk Space on the Linux Virtual Machine

---

## Date

> _Replace with the actual date the incident occurred._

---

## Environment

Production

---

## Severity

Medium

The issue prevented a successful deployment of the latest application version but did not result in permanent data loss. The service was restored after corrective actions were taken.

---

# 2. Incident Summary

During the deployment of a new application version through the GitHub Actions CI/CD pipeline, the deployment process failed while attempting to recreate the application containers on the production Linux Virtual Machine.

Although the Docker images had been built successfully and published to Docker Hub, the deployment did not complete because the virtual machine had exhausted its available disk space.

The deployment pipeline reported repeated failures during the application's health check phase, preventing the new release from becoming operational.

---

# 3. Symptom

The following symptoms were observed:

- GitHub Actions completed the image build successfully.
- Docker images were successfully pushed to Docker Hub.
- Deployment to the Linux Virtual Machine started successfully.
- Docker Compose repeatedly failed to start the updated containers.
- Automated health checks continued to fail.
- The deployment script exceeded its retry attempts.

Evidence included:

- GitHub Actions workflow logs.
- Deployment logs.
- Docker Compose output.
- Docker container logs.
- Linux Virtual Machine terminal output.

Screenshots captured during the incident are included in the project documentation.

---

# 4. Investigation Trail

The investigation followed a structured troubleshooting approach.

## Step 1 — Review GitHub Actions Logs

The first step was to confirm whether the CI pipeline completed successfully.

Result:

- Docker images were built successfully.
- Docker images were pushed successfully.
- SSH connection to the Linux VM succeeded.

Conclusion:

The issue did not originate from GitHub Actions.

---

## Step 2 — Verify Docker Compose Status

The status of running containers was inspected.

Command used:

```bash
docker compose ps
```

Result:

Some containers failed to start correctly.

Conclusion:

The deployment problem occurred on the production server rather than during image creation.

---

## Step 3 — Inspect Container Logs

Container logs were examined.

Command used:

```bash
docker compose logs
```

Result:

The logs indicated that container initialization was unsuccessful.

Further investigation was required.

---

## Step 4 — Check Docker Images

Existing Docker images on the virtual machine were inspected.

Command used:

```bash
docker images
```

Result:

Numerous historical Docker images from previous deployments were still present.

Conclusion:

The server had accumulated a significant number of unused images.

---

## Step 5 — Check Available Disk Space

Available storage on the Linux VM was examined.

Command used:

```bash
df -h
```

Result:

The root filesystem was almost completely full.

Conclusion:

Insufficient storage prevented Docker from creating and starting new containers.

---

# 5. Root Cause

The deployment failure was caused by insufficient available disk space on the Linux Virtual Machine.

Repeated deployments had accumulated unused Docker images, consuming the majority of the available storage. As a result, Docker could not create the new containers required for the updated application release.

The CI/CD pipeline itself functioned correctly; the failure occurred within the production environment due to inadequate disk capacity.

---

# 6. Resolution

To resolve the incident, the following corrective actions were performed:

1. Removed unused Docker images.
2. Removed obsolete Docker resources.
3. Verified available disk space.
4. Pulled the required application images again.
5. Restarted the deployment.
6. Verified successful container startup.

Example cleanup commands:

```bash
docker image prune -a
```

```bash
docker system prune
```

Following cleanup, the deployment completed successfully.

---

# 7. Verification

The following checks confirmed that the issue had been resolved.

| Verification Item              | Status |
| ------------------------------ | ------ |
| Containers running             | ✅     |
| Docker Compose healthy         | ✅     |
| Application accessible         | ✅     |
| Correct image version deployed | ✅     |
| Health checks passed           | ✅     |

The application became accessible through the Linux Virtual Machine's public IP address, confirming a successful deployment.

---

# 8. Preventive Measures

To reduce the likelihood of similar incidents in future deployments, several improvements were implemented.

### Docker Image Cleanup

Unused Docker images should be removed regularly.

---

### Automated Cleanup

The deployment workflow was updated to remove obsolete Docker images after successful deployments.

---

### Storage Monitoring

Available disk space should be monitored before each deployment.

---

### Operational Documentation

Deployment and maintenance procedures were documented to improve consistency across team members.

---

# 9. Lessons Learned

This incident highlighted several important operational lessons.

- Successful image builds do not guarantee successful deployments.
- Production infrastructure should be monitored continuously.
- Storage management is an essential part of containerized environments.
- Deployment verification is just as important as deployment automation.
- Preventive maintenance reduces operational risk.

The experience reinforced the importance of monitoring infrastructure health alongside application health.

---

# 10. Design Reflection

The original system design significantly reduced the impact of the incident.

Because the deployment process was fully automated through GitHub Actions and Docker Compose, troubleshooting could focus on the production environment rather than the build process.

The use of Semantic Versioning ensured that deployment history remained intact, making rollback possible if required.

One improvement identified during this incident was the need for automated housekeeping. Future iterations of the deployment pipeline should include scheduled cleanup of unused Docker images, storage monitoring, and alerting before available disk space becomes critically low.

While the failure interrupted deployment, the underlying architecture made diagnosis straightforward and recovery relatively quick.

---

# 11. Conclusion

The deployment failure was successfully resolved after identifying insufficient storage as the root cause.

By following a structured investigation process, the team restored the production environment without modifying application code or rebuilding Docker images.

The incident reinforced the importance of infrastructure maintenance, monitoring, and operational automation. The improvements introduced following the incident have strengthened the overall reliability of the deployment process and reduced the likelihood of similar failures in future releases.
