#!/usr/bin/env bash

# ============================================================
# FormFlow - Check Current Running Version
# Usage: ./check-version.sh
# ============================================================

cd /opt/formflow || {
  echo "Error: /opt/formflow not found"
  exit 1
}

echo "=========================================="
echo "  FormFlow – Current Running Version"
echo "=========================================="
echo ""

echo ">>> Tags in docker-compose.yml:"
grep -E "formflow-(backend|frontend):" docker-compose.yml || echo "No formflow images found in compose file"
echo ""

echo ">>> Currently running containers:"
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}" --filter "name=formflow" 2>/dev/null || \
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}"
echo ""

echo ">>> Health checks:"
echo -n "Nginx healthz : "; curl -s -o /dev/null -w "%{http_code}" http://localhost/healthz || echo "unreachable"
echo ""
echo -n "Backend API   : "; curl -s -o /dev/null -w "%{http_code}" http://localhost/api/health || echo "unreachable"
echo ""
echo "=========================================="