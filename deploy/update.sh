#!/usr/bin/env bash
# Ship a new version of the website code on the Utho server (design or layout changes).
# Text changes do not need this: they go through the Content admin's Publish button.
#   sudo bash /opt/researchcops/app/deploy/update.sh                     # git pull, then release
#   sudo bash /opt/researchcops/app/deploy/update.sh bundle.tar.gz       # unpack a bundle, then release
# Undo: sudo -u rcweb node /opt/researchcops/app/deploy/release.js --rollback
set -euo pipefail
APP=/opt/researchcops/app
SITE=/var/www/researchcops
[ "$(id -u)" = 0 ] || { echo "Run as root (sudo)."; exit 1; }

if [ "${1:-}" ]; then
  tmp=$(mktemp -d)
  tar -xzf "$1" -C "$tmp"
  # Replace the code but keep nothing stale: the bundle is the whole tracked tree
  rsync -a --delete --exclude .git "$tmp"/ "$APP"/
  rm -rf "$tmp"
else
  sudo -u rcweb git -C "$APP" pull --ff-only
fi
chown -R rcweb:rcweb "$APP"
# Build with the copy published in the Content admin, switch the live folder, keep earlier releases
sudo -u rcweb env APP_DIR="$APP" SITE_ROOT="$SITE" node "$APP/deploy/release.js"
systemctl restart researchcops-publish 2>/dev/null || true
echo "Done. Releases:"; sudo -u rcweb env SITE_ROOT="$SITE" node "$APP/deploy/release.js" --list
