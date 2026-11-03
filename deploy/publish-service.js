// Publish service for the Content admin (POST /api/publish), run on the Utho server behind nginx.
// Node 18+, no npm packages. Listens on 127.0.0.1 only; nginx forwards /api/publish to it.
//
// What a publish does, in this order, so a failure never leaves the site half-updated:
//   1. Checks the Firebase sign-in token and that the email is on ALLOWED_EDITORS.
//   2. Builds a new release from the submitted copy (deploy/release.js). A failed build changes nothing.
//   3. Saves the copy to Firestore as the next version (siteContent/published + siteContentVersions/vN),
//      using the editor's own token, so the Firestore rules decide who may publish.
//   4. Switches the live site to the new release.
//
// Settings (environment, see deploy/researchcops-publish.service):
//   ALLOWED_EDITORS   comma-separated emails allowed to publish (required)
//   PORT              default 3061
//   APP_DIR, SITE_ROOT, KEEP_RELEASES   passed on to deploy/release.js
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const release = require('./release');

const PORT = Number(process.env.PORT || 3061);
const ALLOWED = (process.env.ALLOWED_EDITORS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
const WEB_CONFIG = fs.readFileSync(path.join(release.APP_DIR, 'assets', 'rc-data.js'), 'utf8');
const PROJECT = WEB_CONFIG.match(/projectId:\s*"([^"]+)"/)[1];
const API_KEY = WEB_CONFIG.match(/apiKey:\s*"([^"]+)"/)[1];
const DOCS = `projects/${PROJECT}/databases/(default)/documents`;
const FS_URL = `https://firestore.googleapis.com/v1/${DOCS}`;
const MAX_BODY = 1.5 * 1024 * 1024;
const TOP_KEYS = ['company', 'home', 'pages', 'services', 'automation', 'audiences', 'platform', 'meta'];

if (!ALLOWED.length) { console.error('ALLOWED_EDITORS is not set. Refusing to start.'); process.exit(1); }

const log = (...a) => console.log(new Date().toISOString(), ...a);
const send = (res, code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(obj)); };
class HttpError extends Error { constructor(code, msg) { super(msg); this.code = code; } }

// Firebase ID token → account. accounts:lookup rejects expired or forged tokens.
async function verify(idToken) {
  const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${API_KEY}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken }) });
  const j = await r.json().catch(() => ({}));
  const u = j.users && j.users[0];
  if (!r.ok || !u || !u.email) throw new HttpError(401, 'Your sign-in has expired. Sign out, sign in again and retry.');
  if (u.disabled) throw new HttpError(403, 'This account is disabled.');
  if (!ALLOWED.includes(u.email.toLowerCase())) throw new HttpError(403, `${u.email} is not allowed to publish website content.`);
  return u.email;
}

async function firestore(method, url, idToken, body) {
  const r = await fetch(url, { method, headers: { Authorization: `Bearer ${idToken}`, 'Content-Type': 'application/json' }, body: body && JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  if (r.status === 404 && method === 'GET') return null;
  if (!r.ok) throw new HttpError(r.status === 403 ? 403 : 502, r.status === 403 ? 'Firestore refused the save. Check that the siteContent rules include your email.' : `Firestore error ${r.status}: ${(j.error && j.error.message) || ''}`);
  return j;
}

// Save version N+1 in one atomic commit; the precondition stops two publishes from taking the same number.
async function saveVersion(idToken, email, data) {
  const cur = await firestore('GET', `${FS_URL}/siteContent/published`, idToken);
  const version = (cur && cur.fields && cur.fields.version ? Number(cur.fields.version.integerValue) : 0) + 1;
  const fields = { data: { stringValue: data }, version: { integerValue: String(version) }, publishedBy: { stringValue: email } };
  const write = (name, precondition) => ({ update: { name: `${DOCS}/${name}`, fields }, updateTransforms: [{ fieldPath: 'publishedAt', setToServerValue: 'REQUEST_TIME' }], ...(precondition ? { currentDocument: precondition } : {}) });
  await firestore('POST', `${FS_URL}:commit`, idToken, { writes: [
    write(`siteContentVersions/v${String(version).padStart(5, '0')}`, { exists: false }),
    write('siteContent/published', cur ? { updateTime: cur.updateTime } : { exists: false }),
  ] });
  return version;
}

let busy = false;
async function publish(req) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) throw new HttpError(401, 'Not signed in.');
  const idToken = auth.slice(7);
  const raw = await new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', c => { size += c.length; if (size > MAX_BODY) { req.removeAllListeners('data'); req.resume(); reject(new HttpError(413, 'The content is too large.')); } else chunks.push(c); });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8'))); req.on('error', reject);
  });
  let data, content;
  try { data = JSON.parse(raw).data; content = JSON.parse(data); } catch (e) { throw new HttpError(400, 'The content could not be read.'); }
  if (!content || typeof content !== 'object' || !TOP_KEYS.every(k => k in content)) throw new HttpError(400, 'The content is incomplete.');
  const email = await verify(idToken);

  if (busy) throw new HttpError(409, 'Another publish is running. Try again in a minute.');
  busy = true;
  const tmp = path.join(os.tmpdir(), `rc-content-${Date.now()}.json`);
  try {
    log(`Publish requested by ${email}`);
    fs.writeFileSync(tmp, data);
    let name;
    try { name = release.build({ contentFile: tmp }); }
    catch (e) { log('Build failed:', e.message); throw new HttpError(422, 'The website could not be built with this content, so nothing was published. Your draft is saved.'); }
    const version = await saveVersion(idToken, email, data);
    release.activate(name);
    release.prune();
    log(`Published version ${version} (${name}) by ${email}`);
    return { version, release: name };
  } finally { busy = false; fs.rmSync(tmp, { force: true }); }
}

http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/api/publish/health') return send(res, 200, { ok: true, live: release.currentName() });
  if (req.method !== 'POST' || req.url !== '/api/publish') return send(res, 404, { error: 'Not found' });
  try { send(res, 200, await publish(req)); }
  catch (e) { if (!(e instanceof HttpError)) log('Publish error:', e); send(res, e.code || 500, { error: e instanceof HttpError ? e.message : 'Publishing failed. Your draft is saved.' }); }
}).listen(PORT, '127.0.0.1', () => log(`Publish service on 127.0.0.1:${PORT}; editors: ${ALLOWED.join(', ')}`));
