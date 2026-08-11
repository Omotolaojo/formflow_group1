# Deployment Errors Encountered and Resolution Report

## Overview

This report documents the deployment issues encountered while containerising and exposing the application through Docker Compose, Nginx, Next.js, the backend API, and Prisma. It records the observed symptoms, underlying causes, corrective actions, and final status of each issue.

The deployment was stabilised by standardising Compose and environment configuration, including Nginx in the service stack, synchronising the database schema, and routing public requests through a single Nginx entry point on port 80.

## Target Architecture

The intended deployment flow is:

```text
Client Browser
    |
    v
Nginx (public port 80)
    |
    +--> Frontend / Next.js (port 3000, internal)
    |
    +--> Backend API (port 5000, internal)
              |
              v
          Database
```

Only Nginx should be exposed publicly. The frontend and backend services communicate over the Docker application network and should not require direct public port access.

## Resolved Issues

| Issue | Root Cause | Resolution | Result |
|---|---|---|---|
| Compose file was not detected | The Compose file used a non-default name (`docker-compose.prod.yml`), which Docker Compose does not select automatically. | The correct file was specified explicitly with `-f docker-compose.prod.yml` and the deployment environment file was passed with `--env-file deployment/compose.env`. The local Compose configuration was subsequently standardised as `docker-compose.local.yml`. | Compose loaded the intended configuration successfully. |
| Inconsistent environment-variable names | The variable names in the environment file did not match those referenced by the Compose configuration. | Environment variables were renamed and aligned across the `.env` and Compose files. | Services received the expected configuration values. |
| Deployment environment files were missing | Compose referenced `deployment/*.env` files that were not present in the repository. | Created the `deployment` directory and required local environment files, then added appropriate ignore rules for local secrets. | Compose validation and deployment configuration could proceed. |
| Nginx was absent from the Compose stack | The Nginx configuration existed but no Nginx service had been declared in Docker Compose. | Added the Nginx service and configuration to the Compose file. | Nginx became part of the deployed application stack. |
| Prisma installation failed during image build | The Prisma engine download was interrupted by an `ECONNRESET` network error. | Added retry behaviour, longer network timeouts, and npm cache mounts; then rebuilt the backend image. | Backend and frontend images built successfully. |
| Prisma CLI could be unavailable during production migrations | The production install used `npm ci --omit=dev`, while the runtime migration process depended on the Prisma CLI. | Ensured Prisma was available as a production dependency and invoked it using `npx --no-install`. | Runtime migrations no longer rely on downloading packages. |
| Database schema was out of sync | The administrator seed queried `User.isActive`, but the corresponding database column did not exist. | Added a forward Prisma migration for `isActive`, then rebuilt and recreated the backend service. | The migration applied successfully and the backend became healthy. |
| Frontend health check failed | The health check used `curl`, but the Next.js runtime image did not contain `curl`. | Replaced the command with a Node.js `fetch`-based health check and recreated the frontend container. | The frontend health check passed with a failing streak of zero. |
| Nginx entered a restart loop | Nginx could not resolve `frontend:3000` because the frontend and Nginx services did not share a Docker network. | Attached the frontend service to the application network and recreated the affected containers. | Nginx resolved the frontend and backend services and started correctly. |
| Port 80 was initially unavailable | Nginx was not running, leaving no listener on port 80. | Corrected Nginx DNS and networking configuration and verified the `80:80` port mapping. | Public health routes became reachable. |
| Backend API requests returned 404 responses | Environment variables and proxy routing did not reliably direct browser API requests to the backend. Requests such as `/auth/me` were handled by the frontend instead. | Removed the need for direct public access to the backend and routed public traffic through Nginx on port 80. Nginx forwards requests internally to the frontend on port 3000 and backend on port 5000. | The intended gateway pattern was established, reducing direct exposure of internal services. |

## Resolved Application Routing and Authentication Issues

### Registration Route Returned 404

**Symptom:** The browser called `/auth/register`, which was handled by Next.js and returned a 404 response.

**Root cause:** The frontend used `/auth/register`, which Next.js handled as a frontend route. The backend endpoint was exposed through the public API prefix `/api/auth/register`.

**Resolution:**

1. Updated the frontend request path to `/api/auth/register`.
2. Confirmed that Nginx forwards `/api/` requests to the backend service.
3. Rebuilt and redeployed the frontend image.
4. Verified registration through the public Nginx endpoint.

**Outcome:** Registration requests now reach the backend through Nginx and return the expected API response.

### Login Returned 401/500 and Non-JSON Responses

**Symptom:** Login attempts returned `401` or `500` responses; in some cases the client received HTML rather than the expected JSON error body.

**Root cause:** Authentication requests were affected by inconsistent API routing and error-response handling. In some cases, the frontend received an HTML response rather than a structured backend JSON error.

**Resolution:**

1. Confirmed that the browser calls `/api/auth/login` through Nginx.
2. Corrected proxy routing so Nginx forwards authentication requests to the backend without an incorrect rewrite.
3. Corrected backend authentication error handling to return consistent JSON responses with appropriate HTTP status codes.
4. Updated frontend response handling to process failed API responses safely.
5. Verified login behaviour through the public Nginx endpoint.

**Outcome:** Login requests now return consistent API responses; authentication and error handling no longer produce unexpected HTML responses.

## Operational Lessons and Preventive Controls

- Use a consistent Compose-file naming convention, or document the required `-f` option in deployment instructions.
- Keep environment-variable names aligned across Compose files, environment templates, Nginx configuration, and application code.
- Maintain a version-controlled environment template (for example, `.env.example`) while keeping real credentials in ignored local or secret-managed files.
- Include all required infrastructure services, especially the reverse proxy, in the Compose definition.
- Treat Prisma migrations as part of the production runtime contract and ensure their dependencies are available in production images.
- Apply schema migrations before application startup or use an explicit migration step in the deployment workflow.
- Use health checks that rely only on binaries available in the final runtime image.
- Expose only Nginx publicly; keep application-service ports internal to the Docker network.
- Define and test public API path conventions such as `/api/*` before integrating frontend calls.
- Standardise API error responses as JSON so frontend error handling remains predictable.

## Current Status

The core container deployment is operational: images build successfully, database migrations apply, backend and frontend health checks pass, Nginx starts correctly, and public access is available through port 80. Registration and login requests are routed through the public API gateway and return consistent backend responses.
