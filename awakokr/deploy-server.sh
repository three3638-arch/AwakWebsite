#!/usr/bin/env bash
set -euo pipefail

# Deploy AwakOKR API to the same host as the static site.
# Usage (from repo root):
#   DEPLOY_HOST=... DEPLOY_USER=ecs-user bash awakokr/deploy-server.sh
#
# Remote layout:
#   /opt/awakokr/server   — built JS + package.json
#   /opt/awakokr/data     — JSON data (persisted)

DEPLOY_USER="${DEPLOY_USER:-ecs-user}"
DEPLOY_HOST="${DEPLOY_HOST:-121.196.147.233}"
REMOTE_APP_DIR="${REMOTE_APP_DIR:-/opt/awakokr}"
REMOTE_SERVICE="${REMOTE_SERVICE:-awakokr}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

echo "==> Building AwakOKR server"
(
  cd "${SCRIPT_DIR}/server"
  npm ci
  npm run build
)

echo "==> Uploading server + data to ${DEPLOY_USER}@${DEPLOY_HOST}:${REMOTE_APP_DIR}"
ssh "${DEPLOY_USER}@${DEPLOY_HOST}" "sudo mkdir -p '${REMOTE_APP_DIR}/server' '${REMOTE_APP_DIR}/data'"

tar -C "${SCRIPT_DIR}" -czf - \
  server/dist server/package.json server/package-lock.json data \
  | ssh "${DEPLOY_USER}@${DEPLOY_HOST}" "sudo mkdir -p '${REMOTE_APP_DIR}' && sudo tar -xzf - -C '${REMOTE_APP_DIR}'"

ssh "${DEPLOY_USER}@${DEPLOY_HOST}" "\
  cd '${REMOTE_APP_DIR}/server' && \
  npm ci --omit=dev && \
  sudo systemctl restart '${REMOTE_SERVICE}' 2>/dev/null || \
  (echo 'Tip: install systemd unit awakokr.service pointing to: node dist/index.js' && \
   echo '     Environment: PORT=3001 DATA_DIR=${REMOTE_APP_DIR}/data JWT_SECRET=...')"

echo "==> AwakOKR server deploy finished (ensure nginx proxies /api/ → 127.0.0.1:3001)"
