// Fetches the copy published from the Content admin, for the build to lay over site-content.json.
// Usage (Vercel build command): node build/fetch-content.js && node build/build.js
//
// RC_CONTENT_SOURCE=firebase  read Firestore siteContent/published (public read) and save it as
//                             build/.content-live.json. Any failure stops the deploy, so the live
//                             site stays on its last good version instead of falling back to old copy.
// RC_CONTENT_FILE=path.json   use a local file instead (for previewing an exported draft).
// Neither set                 nothing to fetch; the build uses build/site-content.json.
const fs = require('fs');
const path = require('path');

const LIVE = path.join(__dirname, '.content-live.json');
// Same public Firebase web config the site already ships in assets/rc-data.js
const WEB_CONFIG = fs.readFileSync(path.join(__dirname, '..', 'assets', 'rc-data.js'), 'utf8');
const PROJECT = WEB_CONFIG.match(/projectId:\s*"([^"]+)"/)[1];
const API_KEY = WEB_CONFIG.match(/apiKey:\s*"([^"]+)"/)[1];

async function main() {
  if (fs.existsSync(LIVE)) fs.unlinkSync(LIVE);
  if (process.env.RC_CONTENT_FILE) {
    const data = JSON.parse(fs.readFileSync(process.env.RC_CONTENT_FILE, 'utf8'));
    fs.writeFileSync(LIVE, JSON.stringify(data));
    return console.log(`Content: using ${process.env.RC_CONTENT_FILE}`);
  }
  if (process.env.RC_CONTENT_SOURCE !== 'firebase') return console.log('Content: using build/site-content.json');

  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/siteContent/published?key=${API_KEY}`;
  const res = await fetch(url);
  if (res.status === 404) return console.log('Content: nothing published yet, using build/site-content.json');
  if (!res.ok) throw new Error(`Firestore returned ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const doc = await res.json();
  const raw = doc.fields && doc.fields.data && doc.fields.data.stringValue;
  if (!raw) throw new Error('siteContent/published has no "data" field');
  const data = JSON.parse(raw);
  fs.writeFileSync(LIVE, JSON.stringify(data));
  const v = doc.fields.version && (doc.fields.version.integerValue || doc.fields.version.stringValue);
  console.log(`Content: published version ${v || '?'} from Firestore`);
}

main().catch(err => { console.error('Content fetch failed:', err.message); process.exit(1); });
