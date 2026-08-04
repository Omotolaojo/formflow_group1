# Design Worksheet

## Cloud & DevOps Bootcamp Capstone Project

---

# 1. Introduction

Before implementing any infrastructure or writing deployment scripts, it is important to establish a clear design that addresses the client's business requirements. This document outlines the architectural decisions made for the FormFlow application, explains the reasoning behind each decision, and demonstrates how the proposed solution satisfies the project objectives.

Rather than simply building a working system, this design focuses on creating a deployment process that is repeatable, secure, maintainable, and capable of supporting continuous software delivery.

---

# 2. Client Requirements

The client outlined several key requirements:

- Release new application updates frequently.
- Know exactly which application version is running in production.
- Roll back quickly if a deployment introduces issues.
- Avoid maintaining an expensive staging environment.
- Reduce manual deployment tasks.
- Secure application credentials.
- Keep infrastructure costs low.

Several of these requirements compete with one another. For example, deploying changes rapidly can increase the likelihood of deployment failures, while maintaining a separate staging environment would increase infrastructure costs.

Our design therefore focuses on balancing speed, reliability, security, and cost.

---

# 3. Tier Boundaries

The application follows a **three-tier architecture**, where each tier is responsible for a specific function within the system.

## Frontend Tier

### Responsibility

The Frontend provides the graphical user interface through which users interact with the application.

Its responsibilities include:

- Rendering pages
- Displaying forms
- Collecting user input
- Communicating with the Backend through HTTP requests

The Frontend does **not** contain business logic or communicate directly with the database.

---

## Backend Tier

### Responsibility

The Backend acts as the core processing layer of the application.

Its responsibilities include:

- Processing client requests
- Business logic
- Authentication and authorization
- Input validation
- Database operations
- API responses

The Backend is the **only component permitted to communicate with the database**.

---

## Database Tier

### Responsibility

The PostgreSQL database stores all persistent application data.

Its responsibilities include:

- Data storage
- Data retrieval
- Data integrity
- Transaction management

The database is isolated from external users and is only accessible by the Backend service through the internal Docker network.

---

# 4. Why Separate the Application into Three Containers?

Each application tier is deployed in its own Docker container.

This separation provides several advantages:

| Benefit                  | Explanation                                                |
| ------------------------ | ---------------------------------------------------------- |
| Separation of Concerns   | Each service performs a single responsibility.             |
| Independent Updates      | One service can be updated without rebuilding the others.  |
| Easier Troubleshooting   | Problems can be isolated to individual containers.         |
| Improved Maintainability | Smaller, focused services are easier to manage.            |
| Better Scalability       | Individual services can be scaled independently in future. |
| Consistent Deployments   | Containers ensure identical runtime environments.          |

Combining all components into a single container would make deployments more difficult to manage and would violate containerization best practices.

---

# 5. Infrastructure Design Decision

## Selected Design

A **single Linux Virtual Machine** hosts all application containers using Docker Compose.

```
                     Internet
                         │
                         ▼
               Linux Virtual Machine
        ┌────────────────────────────────┐
        │ Docker Engine                  │
        │                                │
        │  Frontend Container            │
        │           │                    │
        │           ▼                    │
        │  Backend Container             │
        │           │                    │
        │           ▼                    │
        │ PostgreSQL Database Container  │
        └────────────────────────────────┘
```

---

## Why One Linux VM?

The project requirements only specify the provisioning of **one Linux Virtual Machine**.

Deploying all three services on a single VM offers several advantages:

- Lower infrastructure cost.
- Simpler deployment process.
- Easier management.
- Reduced operational complexity.
- Suitable for demonstration environments.

Although separate virtual machines could improve isolation, they would introduce unnecessary complexity and additional costs without providing significant value for this project.

---

# 6. Container Communication

The containers communicate through Docker Compose's internal networking.

```
Browser

    │

    ▼

Frontend

    │

HTTP API

    │

    ▼

Backend

    │

PostgreSQL Connection

    │

    ▼

Database
```

External users can only access the Frontend.

The database is never exposed directly to the Internet.

---

# 7. Image Versioning Strategy

To ensure deployment traceability, every Docker image is tagged using **Semantic Versioning (SemVer)**.

Example tags:

```
v1.0.0
v1.0.1
v1.1.0
v2.0.0
```

The `latest` tag is intentionally avoided because it does not uniquely identify a deployment.

Using Semantic Versioning provides:

- Unique image identification
- Deployment traceability
- Easier rollback
- Predictable releases

---

# 8. Production Version Tracking

At any point, the team can determine the exact version running in production by checking:

- Docker image tags
- Docker Compose configuration
- Deployment logs
- GitHub Release tags
- GitHub Actions workflow history

This satisfies the client's requirement to know exactly which version is deployed.

---

# 9. Rollback Strategy

A rollback process was designed before deployment to ensure rapid recovery from failed releases.

The rollback procedure consists of the following steps:

1. Identify the last known stable image tag.
2. Update the deployment configuration to reference that tag.
3. Pull the required Docker images from Docker Hub.
4. Restart the affected containers using Docker Compose.
5. Verify that all services are healthy.
6. Confirm the correct application version is running.

This approach minimizes downtime while maintaining deployment consistency.

---

# 10. Secrets Handling Plan

Sensitive credentials are never hardcoded into application source code, Dockerfiles, or committed to the GitHub repository.

Instead, secrets are stored securely using GitHub Secrets and environment variables.

| Secret                     | Storage Location  |
| -------------------------- | ----------------- |
| Docker Hub Username        | GitHub Secrets    |
| Docker Hub Access Token    | GitHub Secrets    |
| SSH Private Key            | GitHub Secrets    |
| VM Host Address            | GitHub Secrets    |
| Database Password          | `.env` file on VM |
| Database Connection String | `.env` file on VM |
| Application API Keys       | GitHub Secrets    |

This approach protects sensitive information while allowing automated deployments.

---

# 11. CI/CD Design

The deployment pipeline follows the workflow below:

```
Developer

      │

      ▼

Git Push

      │

      ▼

GitHub Actions

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

Docker Compose Pull

      │

      ▼

Docker Compose Up

      │

      ▼

Running Application
```

This automation eliminates manual deployments and ensures every release follows the same repeatable process.

---

# 12. Design Trade-offs

During the design process, several trade-offs were considered.

| Decision            | Benefit                            | Trade-off                                    |
| ------------------- | ---------------------------------- | -------------------------------------------- |
| Single Linux VM     | Lower cost and simpler management  | Limited infrastructure isolation             |
| Docker Compose      | Easy multi-container orchestration | Less scalable than Kubernetes                |
| Semantic Versioning | Reliable rollback and traceability | Requires disciplined version management      |
| Docker Hub          | Central image repository           | Requires authentication and image management |
| GitHub Actions      | Fully automated deployment         | Dependent on GitHub availability             |

These trade-offs were considered acceptable given the project scope and client requirements.

---

# 13. Design Summary

The proposed architecture successfully balances the client's requirements for rapid software delivery, deployment reliability, version traceability, and cost efficiency.

By separating the application into three Docker containers, automating deployments through GitHub Actions, versioning every release, and implementing a tested rollback procedure, the solution provides a modern DevOps workflow that is secure, maintainable, and easy to operate.

The design also establishes a solid foundation for future enhancements such as Kubernetes orchestration, monitoring, infrastructure as code, and production-grade scalability.
