| #   | Screenshot                                                            | Why it matters                        |
| --- | --------------------------------------------------------------------- | ------------------------------------- |
| 01  | GitHub repository structure                                           | Project organization                  |
| 02  | Docker images built locally                                           | Build verification                    |
| 03  | Docker Hub with versioned tags                                        | Image versioning strategy             |
| 04  | Successful GitHub Actions workflow                                    | CI/CD automation                      |
| 05  | `docker compose ps` on the VM                                         | Containers running                    |
| 06  | Application open via Public IP (port 80)                              | Deployment success                    |
| 07  | Deployment script/log output                                          | Successful deployment evidence        |
| 08  | Rollback command execution                                            | Mandatory rollback proof              |
| 09  | Application working after rollback                                    | Rollback validation                   |
| 10  | Production version verification (`IMAGE_TAG`, `docker inspect`, etc.) | Confirms exactly what version is live |
