#!/usr/bin/env bash
set -euo pipefail

# Override these via env when needed, e.g.:
# DEPLOY_HOST=1.2.3.4 DEPLOY_USER=ecs-user npm run deploy
DEPLOY_USER="${DEPLOY_USER:-ecs-user}"
DEPLOY_HOST="${DEPLOY_HOST:-121.196.147.233}"
REMOTE_TMP_DIR="${REMOTE_TMP_DIR:-/tmp/website-dist}"
REMOTE_SITE_DIR="${REMOTE_SITE_DIR:-/var/www/website}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}"

echo "==> Building PC site (root)"
npm run build

echo "==> Building mobile site"
(
  cd mobile
  npm ci
  npm run build
)

echo "==> Merging mobile dist into dist/m (does not overwrite PC index.html)"
mkdir -p dist/m
rm -rf dist/m/*
cp -a mobile/dist/. dist/m/

echo "==> Building AwakOKR client"
(
  cd awakokr/client
  npm ci
  npm run build
)

echo "==> Merging AwakOKR client into dist/okr"
mkdir -p dist/okr
rm -rf dist/okr/*
cp -a awakokr/client/dist/. dist/okr/

echo "==> Uploading dist to ${DEPLOY_USER}@${DEPLOY_HOST}:${REMOTE_TMP_DIR}"
ssh "${DEPLOY_USER}@${DEPLOY_HOST}" "mkdir -p '${REMOTE_TMP_DIR}'"
scp -r dist/* "${DEPLOY_USER}@${DEPLOY_HOST}:${REMOTE_TMP_DIR}/"

echo "==> Releasing to ${REMOTE_SITE_DIR}"
ssh "${DEPLOY_USER}@${DEPLOY_HOST}" "\
  sudo mkdir -p '${REMOTE_SITE_DIR}' && \
  sudo rm -rf '${REMOTE_SITE_DIR}'/* && \
  sudo cp -a '${REMOTE_TMP_DIR}'/. '${REMOTE_SITE_DIR}/' && \
  (sudo chown -R nginx:nginx '${REMOTE_SITE_DIR}' || sudo chown -R www-data:www-data '${REMOTE_SITE_DIR}') && \
  sudo nginx -t && \
  sudo systemctl reload nginx"

echo "==> Deploy finished"
echo "Verify: http://${DEPLOY_HOST}"
