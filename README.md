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
## Prerequisites

- Git
- Docker with Docker Compose
- Node.js and npm (for local application development)
- Terraform and Azure CLI (for Azure provisioning)

Verify the tooling:

```bash
git --version
docker --version
docker compose version
node --version
npm --version
terraform --version
az --version
```

## Getting Started

Clone the repository and enter the project directory:

```bash
git clone https://github.com/Omotolaojo/formflow_group1.git
cd formflow_group1
```

Configure the environment files in `deployment/` using `.env.example` as a reference. Do not commit credentials or production values.

Start the local stack:

```bash
docker compose -f docker-compose.local.yml up --build
```

To run it in the background:

```bash
docker compose -f docker-compose.local.yml up -d --build
```

Useful local commands:

```bash
# Check services
docker compose -f docker-compose.local.yml ps

# Follow logs
docker compose -f docker-compose.local.yml logs -f

# Stop the stack
docker compose -f docker-compose.local.yml down
```

## Production Deployment

The production stack is defined in `docker-compose.prod.yml`. It includes Nginx, frontend, backend, PostgreSQL, persistent storage, health checks, isolated networks, and `no-new-privileges` security settings.

```bash
# Start or rebuild production services
docker compose -f docker-compose.prod.yml up -d --build

# Check service status
docker compose -f docker-compose.prod.yml ps

# Follow logs
docker compose -f docker-compose.prod.yml logs -f

# Stop the stack
docker compose -f docker-compose.prod.yml down
```

## Infrastructure Provisioning

Azure resources are defined in `Infrastructure/terraform/`, including provider configuration, networking, subnets, network security groups, virtual machines, variables, and outputs.

```bash
cd Infrastructure/terraform

terraform init
terraform fmt -recursive
terraform validate
terraform plan
terraform apply
```

Destroy only the resources managed by this Terraform configuration when they are no longer needed:

```bash
terraform destroy
```

## Health Checks

| Service | Health check |
| --- | --- |
| PostgreSQL | `pg_isready` |
| Backend | `/api/health` |
| Frontend | HTTP check against the local service |
| Nginx | `/healthz` |

Docker Compose uses these health states to manage startup dependencies.

## CI/CD and Collaboration

GitHub Actions workflows are stored in `.github/workflows/`:

- `ci.yml` validates changes through dependency installation, builds/tests, and application checks.
- `deploy.yml` deploys approved changes to the target environment.

The recommended branch flow is:

```text
feature/* -> dev -> pull request + review -> main -> deployment
```

Keep `main` protected and use reviewed pull requests for production-bound changes.

## Security Notes

- Do not commit passwords, database credentials, JWT secrets, API keys, Azure credentials, SSH keys, or Docker Hub credentials.
- Supply deployment secrets through GitHub Actions Secrets, Azure Key Vault, or another approved secret-management system.
- Keep production and development configuration separate.
- Run `terraform plan` and review the output before applying infrastructure changes.

## Troubleshooting

```bash
# Inspect running containers
docker ps

# Review a production service log
docker compose -f docker-compose.prod.yml logs backend

# Inspect Nginx, backend, and frontend logs for 502 errors
docker compose -f docker-compose.prod.yml logs nginx backend frontend

# Verify Azure authentication
az account show
```

If the backend cannot connect to PostgreSQL, check the database container health, database credentials, `DATABASE_URL`, and Docker network configuration. If Nginx returns `502 Bad Gateway`, verify that the backend or frontend upstream service is healthy and reachable on its configured network.


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

## 👥 Contributors

This project was completed collaboratively as part of the Cloud & DevOps Capstone Project.
1. Adekunle Abowaba
2. Angel Alabor
3. Benjamin Victor Ategwu
4. Chima Marcel Awunor
5. Ebube Olisa
6. Francis Quansah
7. Grace Ndeezia
8. Judith Durumezuo
9. Ojo Favour Omotola
10. Makanjuola Oyekola
11. Oladele Abass
12. Osarietinmen Odobo
13. Olowolafe Tolulope
14. Olayenikan Michael
15. Nnamani David
Each team member contributed to different aspects of the solution, including infrastructure design, containerization, CI/CD automation, deployment, testing, documentation, and troubleshooting.

---

## 📜 License

This project was developed for educational purposes as part of Techcrush Cohort7 Cloud & DevOps Capstone Project.

---

## ⭐ Acknowledgements

Special thanks to Techcrush facilitators and Tutor Temi Komolafe for providing the project scenario and guidance throughout the capstone exercise.

---

