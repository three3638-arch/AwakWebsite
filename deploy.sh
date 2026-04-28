#!/usr/bin/env bash

set -euo pipefail

BRANCH="${DEPLOY_BRANCH:-main}"
REMOTE="${DEPLOY_REMOTE:-origin}"
SKIP_BUILD="${SKIP_BUILD:-0}"
AUTO_COMMIT="${AUTO_COMMIT:-1}"
COMMIT_MSG="${1:-chore: deploy website}"

echo "==> Deploy target: ${REMOTE}/${BRANCH}"

if ! command -v git >/dev/null 2>&1; then
  echo "Error: git is not installed."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "Error: npm is not installed."
  exit 1
fi

if [[ ! -f "package.json" ]]; then
  echo "Error: package.json not found. Run this script at repo root."
  exit 1
fi

echo "==> Current branch: $(git branch --show-current)"

if [[ "${SKIP_BUILD}" != "1" ]]; then
  echo "==> Building project..."
  npm run build
else
  echo "==> SKIP_BUILD=1, skip build."
fi

if [[ "${AUTO_COMMIT}" == "1" ]]; then
  if [[ -n "$(git status --porcelain)" ]]; then
    echo "==> Staging and committing changes..."
    git add -A
    git commit -m "${COMMIT_MSG}" || true
  else
    echo "==> No local changes to commit."
  fi
else
  echo "==> AUTO_COMMIT=0, skip auto commit."
fi

echo "==> Pushing to ${REMOTE}/${BRANCH}..."
git push "${REMOTE}" "HEAD:${BRANCH}"

echo "==> Deploy flow completed."
echo "Tip: set DEPLOY_BRANCH / DEPLOY_REMOTE or pass commit message:"
echo "     ./deploy.sh \"chore: release\""
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
