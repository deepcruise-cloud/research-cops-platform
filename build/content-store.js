// Website copy for the build.
// Defaults: build/site-content.json (in the repo). When build/fetch-content.js has saved the
// copy published from the Content admin (build/.content-live.json), that is laid over the defaults:
// objects merge key by key, lists of pages merge by slug, and other lists are replaced whole.
// Structure (slugs, icons, links between pages) always comes from the defaults.
const fs = require('fs');
const path = require('path');

const DEFAULTS = path.join(__dirname, 'site-content.json');
const LIVE = path.join(__dirname, '.content-live.json');
// Fields of a page that wire the site together rather than hold copy
const STRUCTURE = new Set(['slug', 'icon', 'audiences', 'related', 'services', 'mock', 'universe', 'step']);

const isObj = v => v && typeof v === 'object' && !Array.isArray(v);

function merge(base, over, inPage = false) {
  if (over === undefined || over === null) return base;
  if (isObj(base) && isObj(over)) {
    const out = { ...base };
    for (const k of Object.keys(over)) if (!(inPage && STRUCTURE.has(k))) out[k] = merge(base[k], over[k]);
    return out;
  }
  // Pages listed by slug: keep the default set and order, take the edited copy for each
  if (Array.isArray(base) && base.length && base.every(x => isObj(x) && x.slug) && Array.isArray(over)) {
    const bySlug = Object.fromEntries(over.filter(isObj).map(x => [x.slug, x]));
    return base.map(x => merge(x, bySlug[x.slug], true));
  }
  if (Array.isArray(base) !== Array.isArray(over) || typeof base !== typeof over) return base;
  return over;
}

function load() {
  const defaults = JSON.parse(fs.readFileSync(DEFAULTS, 'utf8'));
  if (!fs.existsSync(LIVE)) return defaults;
  const live = JSON.parse(fs.readFileSync(LIVE, 'utf8'));
  return merge(defaults, live);
}

module.exports = load();
module.exports.merge = merge;
