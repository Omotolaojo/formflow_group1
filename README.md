# FormFlow Application - Dockerized 3-Tier Application with CI/CD Pipeline

> A production-ready demonstration of a Dockerized three-tier application with automated Continuous Integration and Continuous Deployment (CI/CD) using GitHub Actions, Docker Hub, and a Linux Virtual Machine.

---

## 📖 Project Overview

FormFlow is a cloud-native web application deployed using a modern DevOps workflow. The project demonstrates how a three-tier application can be containerized, versioned, automatically built, deployed, and rolled back using industry-standard DevOps tools and best practices.

The project was completed as part of the **Cloud & DevOps Bootcamp Capstone Project**, with emphasis on infrastructure design, automation, deployment consistency, version traceability, and disaster recovery.

Rather than manually copying files to servers, every deployment is fully automated through GitHub Actions, ensuring consistency, repeatability, and reliability.

---

## 🎯 Project Objectives

The primary objectives of this project were to:

- Containerize a three-tier web application
- Separate the application into Frontend, Backend, and Database services
- Automate image builds using Docker
- Push versioned images to Docker Hub
- Implement a complete CI/CD pipeline using GitHub Actions
- Deploy automatically to a Linux Virtual Machine
- Implement Semantic Versioning for image management
- Support quick rollback to previous stable versions
- Secure sensitive credentials using GitHub Secrets
- Document the complete deployment process

---

## 🏗 Project Architecture

```text
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

The application follows a **3-tier architecture**, where each component performs a dedicated responsibility:

| Tier     | Responsibility          |
| -------- | ----------------------- |
| Frontend | User Interface          |
| Backend  | Business Logic & API    |
| Database | Persistent Data Storage |

---

## 🚀 Technology Stack

### Cloud & Infrastructure

- Linux Virtual Machine
- Docker
- Docker Compose
- Docker Hub

### CI/CD

- GitHub Actions
- GitHub Secrets

### Application

- Frontend
- Backend
- PostgreSQL Database

---

## 📁 Repository Structure (WILL BE EDITED FURTHER)

```text
formflow_group1/
├── .env.example
├── .github
│   ├── CODEOWNERS
│   └── workflows
│       ├── ci.yml
│       └── deploy.yml
├── .gitignore
├── README.md
├── azure-vm-formflow
│   ├── deployment
│   │   ├── backend.env
│   │   ├── db.env
│   │   ├── docker-compose.yml
│   │   └── frontend.env
│   ├── docker-images.sh
│   ├── nginx
│   │   ├── backend
│   │   └── nginx.conf
│   └── rollback.sh
├── collaboration-guide.md
├── deployment
│   ├── backend.env
│   ├── compose.env
│   ├── db.env
│   └── frontend.env
├── docker-compose.local.yml
├── docker-compose.prod.yml
├── docs
│   ├── 01-project-overview.md
│   ├── 02-design-worksheet.md
│   ├── 03-architecture.md
│   ├── 04-deployment-guide.md
│   ├── 05-CICD-pipeline.md
│   ├── 06-rollback-procedure.md
│   ├── 07-incident-report.md
│   ├── 08-challenges-and-solutions.md
│   ├── 09-lessons-learned.md
│   └── screenshots
│       └── screenshots.md
├── frontend/
├── infrastructure
│   ├── bash-cli
│   │   ├── provision-azure.sh
│   │   └── teardown.sh
│   └── terraform
│       ├── main.tf
│       ├── network.tf
│       ├── nsg.tf
│       ├── outputs.tf
│       ├── providers.tf
│       ├── subnet.tf
│       ├── variables.tf
│       └── vm.tf
├── nginx
│   ├── Dockerfile
│   └── nginx.conf
├── package-lock.json
└── scripts
    ├── bootstrap-azure-oidc.sh
    ├── deploy-on-vm.sh
    └── install-docker.sh
```

---

## ⚙️ Features

- Dockerized frontend
- Dockerized backend
- PostgreSQL database container
- Automated Docker image builds
- Docker Hub image publishing
- GitHub Actions CI/CD pipeline
- Automatic deployment to Linux VM
- Secure secret management
- Semantic Versioning
- Image rollback capability
- Infrastructure documentation

---

## 🔄 CI/CD Workflow

```text
Developer
│
▼
Git Push
│
▼
GitHub Repository
│
▼
GitHub Actions
│
├── Build Images
├── Run Pipeline
├── Push to Docker Hub
└── Deploy to VM
│
▼
Docker Compose
│
▼
Running Containers
```

Every successful push triggers the GitHub Actions workflow, which automatically:

1. Builds the Docker images
2. Tags the images using Semantic Versioning
3. Pushes the images to Docker Hub
4. Connects securely to the Linux VM via SSH
5. Pulls the latest versioned images
6. Restarts the application containers
7. Verifies that deployment completed successfully

---

## 🏷 Image Versioning Strategy

This project does **not** rely on the `latest` Docker tag.

Instead, every deployment is assigned a Semantic Version such as:

```text
v1.0.0
v1.0.1
v1.1.0
v2.0.0
```

This approach provides:

- Complete deployment traceability
- Easy rollback
- Predictable deployments
- Production version visibility

---

## 🔐 Secrets Management

Sensitive credentials are never committed to Git.

Secrets are securely stored using GitHub Secrets and environment variables.

Examples include:

- Docker Hub Token
- Docker Hub Username
- SSH Private Key
- VM Host
- Database Password
- API Keys

---

## 🔄 Rollback Strategy

If a deployment introduces issues, the system can quickly revert to the previous stable image.

Rollback process:

1. Identify the previous image version
2. Pull the tagged image
3. Update deployment configuration
4. Restart containers
5. Verify application health

This minimizes downtime and ensures service continuity.

---

## 📸 Screenshots

The project documentation includes screenshots demonstrating:

- Repository structure
- Docker images built locally
- Docker Hub repository
- GitHub Actions pipeline
- Successful deployment
- Running containers
- Public application access
- Rollback procedure
- Deployment logs
- Version verification

---

## 📚 Documentation

Detailed documentation is available inside the **docs/** directory.

| Document                    | Description                         |
| --------------------------- | ----------------------------------- |
| 01-Project-Overview         | Project summary                     |
| 02-Design Worksheet         | Design decisions                    |
| 03-Architecture             | Infrastructure design               |
| 04-Deployment-Guide         | Deployment instructions             |
| 05-CICD-Pipeline            | CI/CD workflow                      |
| 06-Rollback-Procedure       | Rollback process                    |
| 07-Incident-Report          | Troubleshooting report              |
| 08-Challenges-and-Solutions | Problems encountered                |
| 09-Lessons-Learned          | Reflections and future improvements |

---

## 🧪 Deployment Verification

Deployment was verified by confirming:

- Docker containers running successfully
- Application accessible via Public IP
- GitHub Actions completed successfully
- Docker images published to Docker Hub
- Rollback executed successfully
- Correct image version running in production

---

## 📈 Challenges Encountered

Throughout the project, several technical challenges were encountered, including:

- Docker build failures
- GitHub Actions workflow issues
- Docker Hub authentication problems
- VM storage limitations
- Environment variable configuration
- Deployment debugging
- Rollback verification

Each challenge is documented together with its root cause and resolution.

---

## 💡 Lessons Learned

This project strengthened our understanding of:

- Docker containerization
- Multi-container applications
- CI/CD automation
- Infrastructure deployment
- Image versioning
- Rollback planning
- Secret management
- Production deployment strategies

---

## 🔮 Future Improvements

Potential improvements include:

- Reverse Proxy with Nginx
- HTTPS using Let's Encrypt
- Monitoring with Prometheus & Grafana
- Centralized Logging
- Blue-Green Deployment
- Kubernetes Migration
- Infrastructure as Code (Terraform/Bicep)
- Automated Health Monitoring
- Separate Staging Environment

---

## 👥 Team

This project was completed collaboratively as part of the Cloud & DevOps Bootcamp Capstone Project.

Each team member contributed to different aspects of the solution, including infrastructure design, containerization, CI/CD automation, deployment, testing, documentation, and troubleshooting.

---

## 📜 License

This project was developed for educational purposes as part of the Cloud & DevOps Bootcamp Capstone Project.

---

## ⭐ Acknowledgements

Special thanks to the Cloud & DevOps Bootcamp facilitators for providing the project scenario and guidance throughout the capstone exercise.

---

> **"Automation reduces human error, versioning provides confidence, and documentation ensures continuity."**
