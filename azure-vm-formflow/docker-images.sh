#!/usr/bin/env bash

# List available tags for backend
curl -s "https://hub.docker.com/v2/repositories/osarietinmen/formflow-backend/tags?page_size=100" | jq -r '.results[].name'

# List available tags for frontend
curl -s "https://hub.docker.com/v2/repositories/osarietinmen/formflow-frontend/tags?page_size=100" | jq -r '.results[].name'