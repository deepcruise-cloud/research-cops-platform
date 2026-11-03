// Builds the website and switches the live folder to it, keeping earlier releases for rollback.
// Runs on the Utho server (Node 18+, no npm packages needed).
//
//   node deploy/release.js                 build with the copy published in the Content admin
//   node deploy/release.js --defaults      build with build/site-content.json only
//   node deploy/release.js --rollback      switch back to the previous release
//   node deploy/release.js --list          list releases
//
// Layout under SITE_ROOT (default /var/www/researchcops):
//   releases/<timestamp>/   one complete copy of the public site per release
//   current -> releases/…   the folder nginx serves; switched atomically
//   work/                   scratch copy of the code where the build runs
// The code checkout (APP_DIR, default: this repo) is never modified by a build.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const APP_DIR = path.resolve(process.env.APP_DIR || path.join(__dirname, '..'));
const SITE_ROOT = path.resolve(process.env.SITE_ROOT || '/var/www/researchcops');
const KEEP = Number(process.env.KEEP_RELEASES || 8);
const RELEASES = path.join(SITE_ROOT, 'releases');
const CURRENT = path.join(SITE_ROOT, 'current');
const WORK = path.join(SITE_ROOT, 'work');

// Never copied into the public site: source, tooling, docs and deploy files
const PRIVATE = [
  /^\.git/, /^\.claude/, /^node_modules\//, /^docs\//, /^src\//, /^deploy\//,
  /^build\/(?!site-content\.json$)/, // the Content admin loads build/site-content.json; nothing else in build/ is public
  /^(server|extract_styles|generate_logos)\.js$/, /^search_.*\.js$/, /^check_.*\.js$/,
  /^README\.md$/, /^vercel\.json$/, /^package(-lock)?\.json$/, /\.zip$/, /(^|\/)\.DS_Store$/,
];
const isPublic = rel => !PRIVATE.some(re => re.test(rel));

const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);
const walk = (dir, base = dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
  const full = path.join(dir, e.name), rel = path.relative(base, full).split(path.sep).join('/');
  if (e.isDirectory()) return (/^(\.git|node_modules|\.claude)$/.test(e.name) ? [] : walk(full, base));
  return [rel];
});
const copyFiles = (from, to, files) => files.forEach(rel => { const d = path.join(to, rel); fs.mkdirSync(path.dirname(d), { recursive: true }); fs.copyFileSync(path.join(from, rel), d); });
const releasesList = () => (fs.existsSync(RELEASES) ? fs.readdirSync(RELEASES).filter(n => /^\d{8}-\d{6}/.test(n)).sort() : []);
const currentName = () => { try { return path.basename(fs.realpathSync(CURRENT)); } catch (e) { return null; } };

// Point "current" at a release in one rename, so visitors never see a half-copied site
function activate(name) {
  const target = path.join(RELEASES, name), tmp = CURRENT + '.next';
  if (!fs.existsSync(path.join(target, 'index.html'))) throw new Error(`Release ${name} has no index.html`);
  fs.rmSync(tmp, { force: true, recursive: false });
  fs.symlinkSync(target, tmp, process.platform === 'win32' ? 'junction' : 'dir');
  if (process.platform === 'win32' && fs.existsSync(CURRENT)) fs.rmSync(CURRENT, { recursive: false }); // local testing only; on Linux the rename replaces the link atomically
  fs.renameSync(tmp, CURRENT);
  log(`Live site now serves releases/${name}`);
}

// Build into a new release folder. Options: { contentFile } builds with that copy instead of Firestore;
// { defaults: true } uses build/site-content.json only. Returns the release name (not yet live).
function build({ contentFile, defaults } = {}) {
  const name = new Date().toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15);
  const dest = path.join(RELEASES, name);
  log(`Preparing a clean copy of the code from ${APP_DIR}`);
  fs.rmSync(WORK, { recursive: true, force: true });
  copyFiles(APP_DIR, WORK, walk(APP_DIR).filter(rel => !/^(build\/\.content-live\.json)$/.test(rel)));
  const env = { ...process.env };
  delete env.RC_CONTENT_SOURCE; delete env.RC_CONTENT_FILE;
  if (contentFile) env.RC_CONTENT_FILE = path.resolve(contentFile);
  else if (!defaults) env.RC_CONTENT_SOURCE = 'firebase';
  const run = script => execFileSync(process.execPath, [script], { cwd: WORK, env, stdio: 'inherit' });
  run('build/fetch-content.js');
  run('build/build.js');
  const files = walk(WORK).filter(isPublic);
  if (!files.includes('index.html') || !files.includes('content-admin.html')) throw new Error('Build output is incomplete');
  copyFiles(WORK, dest, files);
  log(`Built releases/${name} (${files.length} files)`);
  return name;
}

function prune() {
  const live = currentName();
  const old = releasesList().slice(0, -KEEP).filter(n => n !== live);
  old.forEach(n => fs.rmSync(path.join(RELEASES, n), { recursive: true, force: true }));
  if (old.length) log(`Removed ${old.length} old release(s)`);
}

function rollback() {
  const list = releasesList(), i = list.indexOf(currentName());
  if (i <= 0) throw new Error('There is no earlier release to roll back to');
  activate(list[i - 1]);
}

module.exports = { APP_DIR, build, activate, prune, rollback, releasesList, currentName };

if (require.main === module) {
  const arg = process.argv[2] || '';
  try {
    fs.mkdirSync(RELEASES, { recursive: true });
    if (arg === '--rollback') rollback();
    else if (arg === '--list') { const live = currentName(); releasesList().forEach(n => console.log(n === live ? `${n}  ← live` : n)); }
    else { const name = build({ defaults: arg === '--defaults' }); activate(name); prune(); }
  } catch (e) { console.error('Release failed:', e.message); process.exit(1); }
}
