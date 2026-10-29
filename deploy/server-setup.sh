#!/usr/bin/env bash
# One-time setup of the Research COPS website on the Utho server (Ubuntu/Debian).
# Run as root AFTER the code is in /opt/researchcops/app (git clone or an unpacked bundle).
#   sudo bash /opt/researchcops/app/deploy/server-setup.sh
# Safe to re-run. It never edits the ERP's nginx sites, services, users or databases, and it does
# not enable the nginx site or touch DNS: those are separate, deliberate steps in deploy/README.md.
set -euo pipefail

APP=/opt/researchcops/app
SITE=/var/www/researchcops
PORT=3061

say() { printf '\n== %s\n' "$*"; }
[ "$(id -u)" = 0 ] || { echo "Run as root (sudo)."; exit 1; }
[ -f "$APP/build/build.js" ] || { echo "Code not found in $APP. Clone or unpack it there first."; exit 1; }

say "Checks"
command -v nginx >/dev/null || { echo "nginx is not installed. If the ERP uses Apache or Caddy instead, stop here and adapt deploy/nginx/researchcops.conf."; exit 1; }
nginx -v
NODE_MAJOR=$(node -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0)
if [ "$NODE_MAJOR" -lt 18 ]; then echo "Node 18+ is needed (found: $(node -v 2>/dev/null || echo none)). Install Node 20 LTS without replacing a version the ERP depends on (e.g. NodeSource or nvm for rcweb)."; exit 1; fi
echo "node $(node -v)"
if ss -ltn "sport = :$PORT" | grep -q LISTEN; then echo "Port $PORT is already in use (ERP?). Pick another PORT in the service file and nginx config."; exit 1; fi
echo "port $PORT is free"

say "User and folders"
id rcweb >/dev/null 2>&1 || useradd --system --home /opt/researchcops --shell /usr/sbin/nologin rcweb
mkdir -p "$SITE/releases" /var/www/certbot /etc/researchcops
chown -R rcweb:rcweb "$SITE" "$APP"
chmod 755 "$SITE"

say "Publish settings"
if [ ! -f /etc/researchcops/publish.env ]; then
  printf '# Emails allowed to publish website content (comma-separated)\nALLOWED_EDITORS=\n' > /etc/researchcops/publish.env
  echo "Created /etc/researchcops/publish.env. Add the editor emails before starting the service."
fi
chmod 640 /etc/researchcops/publish.env; chown root:rcweb /etc/researchcops/publish.env

say "First release (default content)"
sudo -u rcweb env APP_DIR="$APP" SITE_ROOT="$SITE" node "$APP/deploy/release.js" --defaults

say "Publish service (installed, not started)"
cp "$APP/deploy/researchcops-publish.service" /etc/systemd/system/
systemctl daemon-reload
systemctl enable researchcops-publish >/dev/null
echo "Start it once ALLOWED_EDITORS is filled in: systemctl start researchcops-publish"

say "nginx site (copied, NOT enabled)"
cp "$APP/deploy/nginx/researchcops.conf" /etc/nginx/sites-available/researchcops.conf
echo "Next: follow 'Go live' in deploy/README.md (certificate, enable site, nginx -t, reload)."
