# System Architecture

## Cloud & DevOps Bootcamp Capstone Project

---

# 1. Introduction

This document describes the architecture of the FormFlow application and explains how its components interact to deliver a reliable, secure, and maintainable deployment.

The application follows a **three-tier architecture**, where each layer is deployed as an independent Docker container on a Linux Virtual Machine. The deployment process is fully automated using GitHub Actions, while Docker Hub serves as the central image registry.

This architecture was selected to satisfy the client's requirements for continuous software delivery, deployment consistency, version traceability, and rapid rollback.

---

# 2. High-Level Architecture

The overall solution consists of four major components:

- Source Code Repository
- Continuous Integration & Deployment Pipeline
- Container Registry
- Production Environment

```
                    Developer

                        │

                        ▼

               GitHub Repository

                        │

                        ▼

              GitHub Actions CI/CD

                        │

        ┌───────────────┴───────────────┐

        ▼                               ▼

 Build Docker Images             Pipeline Validation

        │

        ▼

      Docker Hub

        │

        ▼

 Linux Virtual Machine

        │

        ▼

 Docker Compose

        │

 ┌──────┼──────────┐

 ▼      ▼          ▼

Frontend Backend PostgreSQL
```

---

# 3. Infrastructure Architecture

The production environment consists of a single Linux Virtual Machine hosting three Docker containers managed by Docker Compose.

```
                    Internet

                        │

                        ▼

                Public IP Address

                        │

                        ▼

         Linux Virtual Machine (Ubuntu)

        ┌────────────────────────────────────┐

        │ Docker Engine                      │

        │                                    │

        │ Docker Compose                     │

        │                                    │

        │ Frontend Container                 │

        │ Backend Container                  │

        │ PostgreSQL Container               │

        └────────────────────────────────────┘
```

Using a single Linux VM keeps infrastructure costs low while satisfying all project requirements.

---

# 4. Three-Tier Architecture

The application follows a classic three-tier architecture.

```
                 Browser

                    │

                    ▼

             Frontend Layer

                    │

            REST API Calls

                    │

                    ▼

             Backend Layer

                    │

          SQL Database Queries

                    │

                    ▼

             Database Layer
```

Each layer has a clearly defined responsibility.

---

# 5. Frontend Architecture

The Frontend serves as the presentation layer.

Responsibilities include:

- Rendering user interfaces
- Displaying application data
- Accepting user input
- Calling Backend APIs
- Displaying API responses

The Frontend never communicates directly with the database.

```
Browser

   │

   ▼

Frontend Container

   │

HTTP Requests

   ▼

Backend
```

---

# 6. Backend Architecture

The Backend acts as the application's processing layer.

Responsibilities include:

- Business logic
- Authentication
- API processing
- Validation
- Database access
- Error handling

Only the Backend can communicate with the PostgreSQL database.

```
Frontend

     │

REST API

     ▼

Backend

     │

SQL Queries

     ▼

Database
```

---

# 7. Database Architecture

The PostgreSQL container provides persistent storage for the application.

Responsibilities include:

- Storing application data
- Data retrieval
- Transaction management
- Data integrity

The database is isolated from the Internet and only accepts requests originating from the Backend container through Docker's internal network.

---

# 8. Docker Architecture

Each application component runs inside its own Docker container.

```
Docker Engine

│

├───────────────┐

│ Frontend      │

├───────────────┤

│ Backend       │

├───────────────┤

│ PostgreSQL    │

└───────────────┘
```

Containerization provides:

- Environment consistency
- Simplified deployments
- Easier maintenance
- Independent updates
- Better portability

---

# 9. Docker Compose Architecture

Docker Compose orchestrates the three application containers.

```
docker-compose.yml

        │

        ▼

Frontend Service

Backend Service

Database Service

        │

Shared Docker Network

        │

Running Application
```

Docker Compose also manages:

- Container startup order
- Networking
- Environment variables
- Restart policies
- Volumes

---

# 10. Network Architecture

The containers communicate over Docker's private bridge network.

```
Internet

    │

    ▼

Frontend Container

    │

Docker Network

    ▼

Backend Container

    │

Docker Network

    ▼

PostgreSQL Container
```

The PostgreSQL service is never exposed publicly.

---

# 11. CI/CD Architecture

Deployment automation is handled entirely through GitHub Actions.

```
Developer

     │

Git Push

     ▼

GitHub Repository

     ▼

GitHub Actions

     │

Build Docker Images

     │

Push Images

     ▼

Docker Hub

     │

SSH Deployment

     ▼

Linux VM

     │

Docker Compose Pull

     │

Docker Compose Up

     ▼

Production
```

Every deployment follows this same automated workflow.

---

# 12. Deployment Architecture

Deployment begins when new code is committed to GitHub.

```
Code Commit

      │

      ▼

GitHub Actions

      │

Build Images

      │

Version Images

      │

Push Images

      │

SSH to VM

      │

Pull Images

      │

Restart Containers

      │

Health Check

      ▼

Deployment Complete
```

---

# 13. Request Flow

The following diagram illustrates how a user request travels through the application.

```
User

 │

 ▼

Browser

 │

 ▼

Frontend

 │

HTTP Request

 ▼

Backend

 │

SQL Query

 ▼

Database

 │

Result

 ▲

Backend

 ▲

Frontend

 ▲

Browser

 ▲

User
```

---

# 14. Security Architecture

Security was incorporated throughout the deployment process.

Key security measures include:

- GitHub Secrets for sensitive credentials
- Environment variables for runtime configuration
- No hardcoded passwords
- Private Docker networking
- SSH authentication
- Version-controlled deployments

The PostgreSQL database is isolated from direct Internet access.

---

# 15. Versioning Architecture

Each Docker image is assigned a Semantic Version.

Example:

```
Frontend

v1.0.0

v1.0.1

v1.1.0

Backend

v2.0.0

v2.0.1
```

Versioning enables:

- Traceable deployments
- Reliable rollback
- Deployment history
- Controlled releases

---

# 16. Rollback Architecture

If a deployment fails, the system can quickly revert to a previous stable image.

```
Deployment Failure

        │

        ▼

Identify Previous Tag

        ▼

Pull Previous Image

        ▼

Restart Containers

        ▼

Health Check

        ▼

Production Restored
```

This process minimizes downtime while maintaining deployment consistency.

---

# 17. Design Benefits

The selected architecture provides several advantages.

| Feature             | Benefit                      |
| ------------------- | ---------------------------- |
| Docker Containers   | Environment consistency      |
| Docker Compose      | Simplified orchestration     |
| Linux VM            | Cost-effective hosting       |
| GitHub Actions      | Automated deployments        |
| Docker Hub          | Central image registry       |
| Semantic Versioning | Reliable rollback            |
| GitHub Secrets      | Secure credential management |

---

# 18. Future Enhancements

Although the current solution satisfies the project requirements, several improvements could be introduced in future iterations.

Potential enhancements include:

- Reverse Proxy (Nginx)
- HTTPS using Let's Encrypt
- Monitoring with Prometheus and Grafana
- Centralized Logging
- Kubernetes Migration
- Blue-Green Deployments
- Infrastructure as Code (Terraform or Bicep)
- Auto Scaling
- Load Balancing
- Separate Staging Environment

---

# 19. Architecture Summary

The architecture successfully satisfies the client's functional and operational requirements by combining Docker, Docker Compose, GitHub Actions, Docker Hub, and a Linux Virtual Machine into a cohesive deployment platform.

By separating the application into independent containers, automating deployments, implementing Semantic Versioning, and securing sensitive information, the solution provides a reliable foundation for modern cloud-native application delivery while remaining simple enough for demonstration purposes.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           GITHUB REPOSITORY                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐    │
│  │  Frontend   │  │   Backend   │  │  Dockerfiles│  │  docker-compose  │    │
│  │    Code     │  │    Code     │  │             │  │       .yml       │    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └──────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        GITHUB ACTIONS (CI/CD)                               │
│                                                                             │
│  1. Build Frontend Image    2. Build Backend Image    3. Push to Docker Hub │
│     (versioned tag)             (versioned tag)          (with tags)        │
│                                                                             │
│  4. SSH into VM    5. Pull images    6. Update docker-compose    7. Deploy  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          LINUX VM (Ubuntu)                                  │
│                                                                             │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐  │
│  │  formflow-frontend  │  │  formflow-backend   │  │   formflow-db       │  │
│  │  (NextJS + Nginx)   │  │  (Node.js/Express)  │  │   (PostgreSQL)      │  │
│  │    Port 80          │  │    Port 5000        │  │    Port 5432        │  │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        Docker Network: formflow-net                 │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        Persistent Volume: pgdata                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                          Public IP:Port 80 (External Access)
```
