#!/usr/bin/env bash

# ============================================================
# FormFlow Rollback Script (with image cleanup)
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

# Update the image tags
sed -i "s|formflow-backend:.*|formflow-backend:${PREVIOUS_VERSION}|g" $COMPOSE_FILE
sed -i "s|formflow-frontend:.*|formflow-frontend:${PREVIOUS_VERSION}|g" $COMPOSE_FILE

echo "=== UPDATED docker-compose.yml ==="
grep -E "formflow-(backend|frontend):" $COMPOSE_FILE
echo ""

# Pull previous images and restart
echo "=== Pulling previous images ==="
docker compose pull

echo "=== Restarting containers ==="
docker compose up -d

echo ""
echo "=== ROLLBACK COMPLETE ==="
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}"
echo ""

# Health checks
echo "=== Health checks ==="
curl -s -o /dev/null -w "Nginx  /healthz : %{http_code}\n" http://localhost/healthz || echo "Nginx  /healthz : unreachable"
curl -s -o /dev/null -w "Backend /api/health : %{http_code}\n" http://localhost/api/health || echo "Backend /api/health : unreachable"
echo ""

# --------------------------------------------------
# Clean up old unused images to free disk space
# --------------------------------------------------
echo "=== Cleaning up old unused images ==="
docker image prune -a -f

echo ""
echo "=== Disk usage after cleanup ==="
docker system df

echo ""
echo "Rollback to version $PREVIOUS_VERSION completed successfully."