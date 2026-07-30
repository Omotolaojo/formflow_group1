#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="${APP_DIR:-/opt/formflow}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"
ENV_FILE="${ENV_FILE:-deployment/compose.env}"

cd "$APP_DIR"

sudo bash scripts/install-docker.sh "$(id -un)"
sudo docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" config --quiet
sudo docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" build --pull
sudo docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d --remove-orphans

printf '%s\n' "Waiting for the internal application health check..."
for attempt in $(seq 1 36); do
  if curl --fail --silent http://127.0.0.1/healthz >/dev/null \
    && curl --fail --silent http://127.0.0.1/api/health >/dev/null \
    && curl --fail --silent http://127.0.0.1/ >/dev/null; then
    sudo docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" ps
    sudo docker image prune -f >/dev/null
    printf '%s\n' "FormFlow deployment is healthy."
    exit 0
  fi
  sleep 5
done

printf '%s\n' "Health checks failed. Recent container status and logs follow." >&2
sudo docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" ps >&2
sudo docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" logs --tail=150 >&2
exit 1
