# Deploying www.researchcops.com on the Utho server

The website is static HTML built by `build/build.js`, served by nginx. One small Node service
(`deploy/publish-service.js`) makes the Content admin's **Publish** button rebuild the site.
Firebase (leads, admin, insights, Content admin sign-in) and Calendly stay exactly as they are.

```
Browser ──https──▶ nginx (www.researchcops.com server block, its own file)
                     ├─ /                → /var/www/researchcops/current   (static files)
                     └─ /api/publish     → 127.0.0.1:3061  researchcops-publish (systemd, user rcweb)
                                              └─ builds a new release, saves the version in Firestore,
                                                 then switches "current" to it
ERP server blocks, services and users: untouched.
diy.researchcops.com: untouched (keep its DNS record).
```

## Files in this folder

| File | What it is |
|---|---|
| `server-setup.sh` | One-time server setup: user `rcweb`, folders, first release, systemd unit. Does not enable the site or touch DNS. |
| `nginx/researchcops.conf` | nginx site: HTTPS, www redirect, old-link redirects, caching, security headers, `/api/publish` proxy. Tested with nginx 1.18 and 1.27. |
| `researchcops-publish.service` | systemd unit for the publish service, sandboxed to the website folder. |
| `publish-service.js` | Checks the editor's Firebase sign-in and email allow-list, builds, saves the version to Firestore, switches the live folder. |
| `release.js` | Builds a release, switches the live folder in one step, keeps 8 releases, `--rollback`, `--list`. |
| `update.sh` | Ships new code (design changes): git pull or bundle → release. |
| `make-bundle.sh` | Run on your PC: packs the committed code as a `.tar.gz` for upload. |
| `firestore-rules.txt` | Rules to add for `siteContent` and `siteContentVersions`. |

## Server layout

```
/opt/researchcops/app            the code (git clone or unpacked bundle), owned by rcweb
/var/www/researchcops/releases/  one folder per release
/var/www/researchcops/current    → the live release (nginx root)
/etc/researchcops/publish.env    ALLOWED_EDITORS=…
/etc/nginx/sites-available/researchcops.conf
```

## Step by step

### 1. Before touching the server
- Lower the DNS TTL of `researchcops.com` and `www` to 300 seconds, a day before go-live.
- Firebase console → Firestore → Rules: merge in `firestore-rules.txt` with the real editor emails. Check that `leads` is not publicly readable.
- Firebase console → Authentication → Settings → Authorized domains: make sure `www.researchcops.com` (and `staging.researchcops.com` if you use it) are listed.
- admin.html → General Site Settings: update the office address (the footer shows that value when it is set).

### 2. Put the code on the server
Either clone (needs a read-only deploy key on GitHub, and the branch pushed):
```bash
sudo mkdir -p /opt/researchcops && sudo git clone -b redesign/premium-b2b-site git@github.com:deepcruise-cloud/research-cops-platform.git /opt/researchcops/app
```
or upload a bundle from your PC (nothing needs pushing):
```bash
bash deploy/make-bundle.sh
scp researchcops-site-*.tar.gz <user>@<utho-ip>:/tmp/
# on the server
sudo mkdir -p /opt/researchcops/app && sudo tar -xzf /tmp/researchcops-site-*.tar.gz -C /opt/researchcops/app
```

### 3. Set up (once)
```bash
sudo bash /opt/researchcops/app/deploy/server-setup.sh
sudo nano /etc/researchcops/publish.env        # ALLOWED_EDITORS=you@researchcops.com,colleague@researchcops.com
sudo systemctl start researchcops-publish
curl -s http://127.0.0.1:3061/api/publish/health
```

### 4. Test on a staging name (optional, recommended)
Add an A record `staging.researchcops.com` → Utho IP, then:
```bash
sudo sed 's/researchcops\.com www\.researchcops\.com/staging.researchcops.com/; s/server_name www\.researchcops\.com/server_name staging.researchcops.com/; s#/live/researchcops\.com/#/live/staging.researchcops.com/#; s#https://www\.researchcops\.com#https://staging.researchcops.com#' \
  /etc/nginx/sites-available/researchcops.conf > /etc/nginx/sites-available/researchcops-staging.conf
# delete the bare-domain server block in that copy, then:
sudo certbot certonly --webroot -w /var/www/certbot -d staging.researchcops.com
sudo ln -s /etc/nginx/sites-available/researchcops-staging.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```
Check the pages, the quote form (a test lead appears in admin.html), the Content admin sign-in and one publish.

### 5. Go live without an HTTPS gap
Issue the certificate before moving DNS with a DNS challenge (adds a TXT record at your DNS provider):
```bash
sudo certbot certonly --manual --preferred-challenges dns -d researchcops.com -d www.researchcops.com
```
Then:
```bash
sudo ln -s /etc/nginx/sites-available/researchcops.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx     # nginx -t must pass, or the reload is skipped and the ERP is unaffected
```
Point the `@` and `www` A records to the Utho IP. Within ~5 minutes the new site is live.
Switch certificate renewal to the webroot method afterwards (`certbot renew --dry-run` must pass).

### 6. After go-live
- Google Search Console: submit `https://www.researchcops.com/sitemap.xml`.
- Keep the old Vercel deployment for two weeks as a fallback, then retire it.
- After a week of clean HTTPS, turn on the `Strict-Transport-Security` header in the nginx file.

## Day to day
- **Text changes:** Content admin (`/content-admin.html`) → Save draft → Publish. Live in about a minute.
- **Design or code changes:** commit, then `bash deploy/make-bundle.sh`, upload, `sudo bash /opt/researchcops/app/deploy/update.sh /tmp/<bundle>.tar.gz` (or `update.sh` with no argument after a git push).
- **Undo the last release:** `sudo -u rcweb node /opt/researchcops/app/deploy/release.js --rollback`
- **Logs:** `journalctl -u researchcops-publish -f`, `/var/log/nginx/researchcops.*.log`

## Rollback of the whole move
Point the DNS records back to Vercel (TTL is 300 s, so ~5 minutes). Nothing on the ERP needs undoing; to remove the site entirely:
`sudo rm /etc/nginx/sites-enabled/researchcops.conf && sudo nginx -t && sudo systemctl reload nginx && sudo systemctl disable --now researchcops-publish`.

## What keeps the ERP safe
- A separate nginx site file that only answers for researchcops.com names; enabled only after `nginx -t` passes.
- The publish service listens on 127.0.0.1:3061 only (setup stops if the port is taken), runs as its own user with write access to `/var/www/researchcops` only, and is capped at 512 MB RAM and half a CPU.
- No databases, packages or system settings are changed. Node 18+ is required; if the ERP pins an older Node, install a separate one for `rcweb` instead of upgrading the system one.
