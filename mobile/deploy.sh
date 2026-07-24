#!/usr/bin/env bash
set -euo pipefail

# Override these via env when needed, e.g.:
# DEPLOY_HOST=1.2.3.4 DEPLOY_USER=ecs-user npm run deploy
DEPLOY_USER="${DEPLOY_USER:-ecs-user}"
DEPLOY_HOST="${DEPLOY_HOST:-121.196.147.233}"
REMOTE_TMP_DIR="${REMOTE_TMP_DIR:-/tmp/website-dist}"
REMOTE_SITE_DIR="${REMOTE_SITE_DIR:-/var/www/website}"

echo "==> Building project"
npm run build

echo "==> Removing beta download static artifacts from dist (logo & APK hosted on OSS)"
rm -rf dist/downloads 2>/dev/null || true
find dist -type f \( -iname '*.apk' -o -iname '*.apk.*' -o -iname '*.part' \) -print -delete 2>/dev/null || true

echo "==> Uploading dist to ${DEPLOY_USER}@${DEPLOY_HOST}:${REMOTE_TMP_DIR}"
ssh "${DEPLOY_USER}@${DEPLOY_HOST}" "mkdir -p '${REMOTE_TMP_DIR}'"
scp -r dist/* "${DEPLOY_USER}@${DEPLOY_HOST}:${REMOTE_TMP_DIR}/"

echo "==> Releasing to ${REMOTE_SITE_DIR}"
ssh "${DEPLOY_USER}@${DEPLOY_HOST}" "\
  sudo mkdir -p '${REMOTE_SITE_DIR}' && \
  sudo find '${REMOTE_SITE_DIR}' '${REMOTE_TMP_DIR}' -type f \
    \( -iname '*.apk' -o -iname '*.apk.*' -o -iname '*.part' \) \
    -print -delete 2>/dev/null; \
  sudo rm -rf '${REMOTE_SITE_DIR}/downloads/beta' '${REMOTE_TMP_DIR}/downloads/beta' 2>/dev/null; \
  sudo rm -rf '${REMOTE_SITE_DIR}'/* && \
  sudo cp -a '${REMOTE_TMP_DIR}'/. '${REMOTE_SITE_DIR}/' && \
  (sudo chown -R nginx:nginx '${REMOTE_SITE_DIR}' || sudo chown -R www-data:www-data '${REMOTE_SITE_DIR}') && \
  sudo nginx -t && \
  sudo systemctl reload nginx"

echo "==> Deploy finished"
echo "Verify: http://${DEPLOY_HOST}"