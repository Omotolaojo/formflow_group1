#!/usr/bin/env bash

# ============================================================
# FormFlow Rollback Script (Database-aware + image cleanup)
# Usage: ./rollback.sh <previous-version>
# Example: ./rollback.sh v1.0.0
# ============================================================

set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <previous-version>"
  echo "Example: $0 v1.0.0"
  exit 1
fi

PREVIOUS_VERSION=$1
COMPOSE_FILE="docker-compose.yml"

cd /opt/formflow

echo "=== CURRENT RUNNING VERSION ==="
grep -E "formflow-(backend|frontend):" $COMPOSE_FILE || true
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}"
echo ""

echo "=== Rolling back to version: $PREVIOUS_VERSION ==="

sed -i "s|formflow-backend:.*|formflow-backend:${PREVIOUS_VERSION}|g" $COMPOSE_FILE
sed -i "s|formflow-frontend:.*|formflow-frontend:${PREVIOUS_VERSION}|g" $COMPOSE_FILE

echo "=== UPDATED docker-compose.yml ==="
grep -E "formflow-(backend|frontend):" $COMPOSE_FILE
echo ""

echo "=== Pulling previous images ==="
docker compose pull

echo "=== Restarting containers ==="
set +e
docker compose up -d
set -e

echo ""
echo "=== Waiting for backend to stabilise ==="
sleep 10

BACKEND_STATUS=$(docker inspect --format='{{.State.Health.Status}}' formflow-backend-1 2>/dev/null || echo "missing")

if [ "$BACKEND_STATUS" != "healthy" ]; then
  echo ""
  echo "WARNING: Backend is not healthy after rollback (status: $BACKEND_STATUS)"
  echo ""

  if docker compose logs backend --tail 40 2>/dev/null | grep -q "P3009\|failed migrations\|relation .* already exists"; then
    echo "Detected Prisma migration conflict (P3009)."
    echo "This usually happens when rolling back to an older image"
    echo "whose migrations are behind the current database."
    echo ""
    echo "You can reset the database volume to recover (THIS DELETES ALL DATA)."
    echo ""
    read -p "Do you want to reset the database volume now? (yes/no): " CONFIRM

    if [ "$CONFIRM" = "yes" ]; then
      echo ""
      echo "=== Resetting database volume ==="
      docker compose down
      docker volume rm formflow_postgres_data || true
      docker compose up -d
      sleep 15
    else
      echo "Database was NOT reset. Backend will likely remain unhealthy."
    fi
  else
    echo "Backend is unhealthy but no clear migration conflict was detected."
    echo "Check logs with: docker compose logs backend --tail 50"
  fi
fi

echo ""
echo "=== FINAL STATUS ==="
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}"
echo ""

echo "=== Health checks ==="
curl -s -o /dev/null -w "Nginx  /healthz     : %{http_code}\n" http://localhost/healthz || echo "Nginx  /healthz     : unreachable"
curl -s -o /dev/null -w "Backend /api/health : %{http_code}\n" http://localhost/api/health || echo "Backend /api/health : unreachable"
echo ""

echo "=== Cleaning up old unused images ==="
docker image prune -a -f

echo ""
echo "=== Disk usage after cleanup ==="
docker system df

echo ""
echo "Rollback process finished."