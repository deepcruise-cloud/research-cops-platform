// Research COPS: Content admin (content-admin.html).
// Edits the website copy held in build/site-content.json. Same Firebase project and login as admin.html.
//   Firestore siteContent/draft      work in progress (admins only)
//   Firestore siteContent/published  the copy the site is built from (written by /api/publish)
//   Firestore siteContentVersions/*  every published version, for History → Restore
// Documents keep the copy as a JSON string in "data", because Firestore cannot store lists of lists.
// Local test mode (localhost + ?local=1): no sign-in, nothing saved online; drafts stay in this browser.
(function () {
  'use strict';

  // Same public web config as assets/rc-data.js
  const FIREBASE_CONFIG = {
    apiKey: "AIzaSyDknEqerA09CE3PT0L0m-nISkBCBPitWEw",
    authDomain: "research-cops-platform-e6520.firebaseapp.com",
    projectId: "research-cops-platform-e6520",
    storageBucket: "research-cops-platform-e6520.firebasestorage.app",
    messagingSenderId: "992558119740",
    appId: "1:992558119740:web:c484f96c5b774e9d17fc39",
    measurementId: "G-11SKJM62QW"
  };
  const DEFAULTS_URL = '/build/site-content.json';
  const LOCAL = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) && new URLSearchParams(location.search).has('local');
  const ICONS = ['sampling', 'design', 'code', 'translate', 'data', 'chart', 'pm', 'flow', 'shield', 'globe', 'clock', 'target', 'layers', 'bolt', 'users', 'doc', 'plug', 'wallet'];

  const $ = id => document.getElementById(id);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const clone = o => JSON.parse(JSON.stringify(o));
  const get = (o, p) => p.reduce((v, k) => (v == null ? v : v[k]), o);
  const set = (o, p, val) => { const t = get(o, p.slice(0, -1)); t[p.at(-1)] = val; };
  const textOf = html => { const d = document.createElement('div'); d.innerHTML = html || ''; return d.textContent; };
  const isObj = v => v && typeof v === 'object' && !Array.isArray(v);

  // ---------- Content merge (same rules as build/content-store.js) ----------
  const STRUCTURE = new Set(['slug', 'icon', 'audiences', 'related', 'services', 'mock', 'universe', 'step']);
  function merge(base, over, inPage = false) {
    if (over === undefined || over === null) return base;
    if (isObj(base) && isObj(over)) { const out = { ...base }; for (const k of Object.keys(over)) if (!(inPage && STRUCTURE.has(k))) out[k] = merge(base[k], over[k]); return out; }
    if (Array.isArray(base) && base.length && base.every(x => isObj(x) && x.slug) && Array.isArray(over)) { const by = Object.fromEntries(over.filter(isObj).map(x => [x.slug, x])); return base.map(x => merge(x, by[x.slug], true)); }
    if (Array.isArray(base) !== Array.isArray(over) || typeof base !== typeof over) return base;
    return over;
  }

  // ---------- Field types ----------
  // text: plain one line · rich: one line with Bold/Accent · para: paragraph with Bold/Accent/Link
  // lines: one item per line · icon: icon picker · bool: tick box · list: repeatable items
  const T = (k, label, o = {}) => ({ k, type: 'text', label, ...o });
  const R = (k, label, o = {}) => ({ k, type: 'rich', label, ...o });
  const P = (k, label, o = {}) => ({ k, type: 'para', label, ...o });
  const L = (k, label, o = {}) => ({ k, type: 'lines', label, ...o });
  const I = (k, label = 'Icon') => ({ k, type: 'icon', label });
  const B = (k, label) => ({ k, type: 'bool', label });
  const LIST = (k, label, item, o = {}) => ({ k, type: 'list', label, item, ...o });
  const G = (label, fields, o = {}) => ({ type: 'group', label, fields, ...o });
  // An item is either one field (k ignored) or an array of fields (tuple → keys are 0,1,2 / object → named keys)
  const tup = (...cols) => cols.map((c, i) => ({ ...c, k: i }));

  const HL = { max: 90 }, LEAD = { max: 380 }, SHORT = { max: 110 };
  const faqs = (k = 'faqs') => LIST(k, 'FAQs', tup(R(0, 'Question', { max: 140 }), P(1, 'Answer', { max: 600, link: true })), { itemLabel: 'FAQ', layout: 'stack' });
  const stats = (n = 3) => LIST('stats', 'Hero numbers', tup(R(0, 'Number', { max: 24 }), R(1, 'Label', { max: 60 })), { fixed: true, itemLabel: 'Number', layout: 'c2', hint: `${n} numbers beside the headline` });
  const features = (k = 'features', label = 'Features') => LIST(k, label, tup(I(0), R(1, 'Title', { max: 60 }), P(2, 'Description', { max: 300 })), { itemLabel: 'Feature', layout: 'c3' });
  const pairs = (k, label, a, b, o = {}) => LIST(k, label, tup(R(0, a, { max: 70 }), P(1, b, { max: 320 })), { itemLabel: label.replace(/s$/, ''), layout: 'c2', ...o });

  const serviceFields = s => [
    G('Menus & cards', [T('name', 'Service name', { max: 50, hint: 'Shown in menus and cards' }), R('short', 'One-line summary', SHORT)]),
    G('Hero', [R('h1', 'Headline', { ...HL, accent: true }), P('lead', 'Intro paragraph', LEAD), stats()]),
    G('What you get', [R('featuresTitle', 'Section heading', { max: 80 }), features()]),
    G('How it works', [R('stepsTitle', 'Section heading', { max: 60, accent: 'plain' }), pairs('steps', 'Steps', 'Step', 'What happens'), L('deliverables', 'Deliverables', { hint: 'One per line' })]),
    G('FAQ', [faqs()]),
  ];
  const audienceFields = a => [
    G('Menus & cards', [T('name', 'Audience name', { max: 50 }), R('short', 'One-line summary', SHORT)]),
    G('Hero', [R('h1', 'Headline', { ...HL, accent: true }), P('lead', 'Intro paragraph', LEAD), stats()]),
    G('What we fix', [LIST('pains', 'Problems', tup(R(0, 'Problem', { max: 60 }), P(1, 'Why it hurts', { max: 260 }), P(2, 'Our fix', { max: 260 })), { itemLabel: 'Problem', layout: 'stack' })]),
    ...(a.platform ? [G('Platform callout', [LIST('platform', 'Callout', tup(R(0, 'Title', { max: 60 }), P(1, 'Text', { max: 320 })), { fixed: true, single: true, layout: 'stack' })])] : []),
    G('Typical projects', [L('studies', 'Project types', { hint: 'One per line' }),
      ...(a.quote ? [LIST('quote', 'Client quote', tup(P(0, 'Quote', { max: 260 }), T(1, 'Who said it', { max: 90 })), { fixed: true, single: true, layout: 'stack' })] : []),
      ...(a.promise !== undefined ? [P('promise', 'Our promise', { max: 160 })] : [])]),
    G('How it works', [R('stepsTitle', 'Section heading', { max: 80, accent: 'plain' }), LIST('steps', 'Steps', tup(T(0, 'When', { max: 40 }), R(1, 'Step', { max: 50 }), P(2, 'What happens', { max: 240 })), { itemLabel: 'Step', layout: 'c3' })]),
    G('FAQ', [faqs()]),
  ];
  const moduleFields = m => [
    G('Menus & cards', [T('name', 'Module name', { max: 50 }), R('short', 'One-line summary', SHORT)]),
    G('Hero', [R('h1', 'Headline', { ...HL, accent: true }), P('lead', 'Intro paragraph', LEAD)]),
    G('Today vs Research COPS', [P('today', 'Today', { max: 160 }), P('here', 'In Research COPS', { max: 160 })]),
    G('Capabilities', [features()]),
    ...(m.groups ? [G('Question types', [LIST('groups', 'Groups', tup(T(0, 'Group', { max: 40 }), L(1, 'Question types', { hint: 'One per line' })), { itemLabel: 'Group', layout: 'c2' })])] : []),
    ...(m.ai ? [G('AI assistant', [pairs('ai', 'AI features', 'Feature', 'What it does')])] : []),
    ...(m.extras ? [G('For bigger programmes', [pairs('extras', 'Extras', 'Title', 'Description')])] : []),
  ];
  const pageHeroFields = (extra = []) => [G('Hero', [R('h1', 'Headline', { ...HL, accent: true }), P('lead', 'Intro paragraph', LEAD)]), ...extra];

  const HOME = [
    G('Hero', [
      T('hero.line1', 'Headline, first line', { max: 40, hint: 'The first word gets the accent underline' }),
      T('hero.line2', 'Headline, second line', { max: 24 }),
      T('hero.typed', 'Typed-in words', { max: 30, hint: 'Types itself in, in the serif accent' }),
      R('hero.cta1', 'Main button', { max: 30 }), R('hero.cta2', 'Second button', { max: 30 }),
      LIST('hero.checks', 'Ticks under the buttons', R(null, 'Tick', { max: 40 }), { fixed: true, itemLabel: 'Tick' }),
      R('hero.pill', 'NEW pill text', { max: 70, hint: 'Shown after "NEW Research Centric OPS:"' }),
    ]),
    G('Numbers strip', [LIST('stats', 'Numbers', [R('n', 'Number', { max: 12 }), R('label', 'Label', { max: 60 })], { fixed: true, itemLabel: 'Number', layout: 'c2' })]),
    G('Two ways to work with us', [R('intro.h2', 'Heading', { ...HL, accent: true }), P('intro.p', 'Intro', LEAD),
      R('intro.platform.h3', 'Platform card: heading', { max: 70 }), P('intro.platform.p', 'Platform card: text', { max: 260 }), LIST('intro.platform.items', 'Platform card: ticks', R(null, 'Tick', { max: 60 }), { fixed: true, itemLabel: 'Tick' }),
      R('intro.services.h3', 'Services card: heading', { max: 70 }), P('intro.services.p', 'Services card: text', { max: 260 }), LIST('intro.services.items', 'Services card: ticks', R(null, 'Tick', { max: 60 }), { fixed: true, itemLabel: 'Tick' })]),
    G('Who we serve (tabs)', [R('audiences.h2', 'Heading', { ...HL, accent: true }), P('audiences.p', 'Intro', LEAD),
      LIST('audiences.tabs', 'Tabs', [R('h3', 'Heading', { max: 90 }), P('lead', 'Intro', { max: 300 }), LIST('checks', 'Ticks', P(null, 'Tick', { max: 200 }), { fixed: true, itemLabel: 'Tick' }), P('promise', 'Our promise', { max: 160 })],
        { fixed: true, itemLabel: 'Tab', itemNames: ['Market research agencies', 'Brands & insight teams', 'Startups', 'Advertising & media', 'Panel & sample companies'], layout: 'stack' })]),
    G('Services', [R('services.h2', 'Heading', { ...HL, accent: true }), P('services.p', 'Intro', LEAD),
      LIST('services.cards', 'Service cards', [P('p', 'Text', { max: 200 }), R('tag', 'Tag line', { max: 50 })], { fixed: true, itemLabel: 'Card', itemNames: ['Questionnaire design', 'Survey programming & hosting', 'Translations', 'Online sampling', 'Data processing', 'Insights & report writing'], layout: 'c2' })]),
    G('CPI estimator', [R('estimator.h2', 'Heading', { ...HL, accent: true }), P('estimator.p', 'Intro', LEAD)]),
    G('Data quality', [R('quality.h2', 'Heading', { ...HL, accent: true }), P('quality.p', 'Intro', LEAD)]),
    G('Client voice', [R('testimonials.h2', 'Heading', { ...HL, accent: true }),
      LIST('testimonials.items', 'Quotes', [P('quote', 'Quote', { max: 260 }), T('role', 'Role', { max: 60 }), T('org', 'Company type', { max: 60 })], { fixed: true, itemLabel: 'Quote', layout: 'stack' })]),
    G('Insights', [R('insights.h2', 'Heading', { ...HL, accent: true })]),
  ];

  // ---------- Sections (left menu) ----------
  let SECTIONS = [];
  function buildSections(c) {
    const S = [];
    S.push({ id: 'company', group: 'Site-wide', label: 'Company details', root: ['company'], view: '/contact/', intro: 'Used on the contact page, the footer, the About page and in Google\'s company details.', fields: [
      G('Contact', [T('phone', 'Phone', { max: 30, hint: 'The call link is made from this number' }), T('emailInfo', 'General email', { max: 60, kind: 'email' }), T('emailBidding', 'Bids & RFQs email', { max: 60, kind: 'email' })]),
      G('Office', [T('addressLine1', 'Address, line 1', { max: 80 }), T('addressLine2', 'Address, line 2', { max: 80 }), T('mapsUrl', 'Google Maps link', { kind: 'url' })]),
      G('Footer & social', [T('footerLine', 'Footer bottom line', { max: 80 }), T('social.linkedin', 'LinkedIn', { kind: 'url' }), T('social.youtube', 'YouTube', { kind: 'url' }), T('social.instagram', 'Instagram', { kind: 'url' }), T('social.facebook', 'Facebook', { kind: 'url' })]),
    ] });
    S.push({ id: 'contactBlock', group: 'Site-wide', label: 'Quote form block', root: ['pages', 'contactBlock'], view: '/#contact', intro: 'The "Brief us" block above the quote form, at the bottom of most pages.', fields: [G('Text', [R('h2', 'Heading', { ...HL, accent: true }), P('p', 'Intro', LEAD)])] });
    S.push({ id: 'home', group: 'Homepage', label: 'Homepage', root: ['home'], view: '/', intro: 'Layout, animations and the product panel stay as designed; the number of ticks, cards and tabs is fixed.', fields: HOME });
    c.services.forEach((s, i) => S.push({ id: 'svc-' + s.slug, group: 'Services', label: textOf(s.name), root: ['services', i], view: `/solutions/${s.slug}/`, fields: serviceFields(s) }));
    S.push({ id: 'svc-automation', group: 'Services', label: textOf(c.automation.name), root: ['automation'], view: `/solutions/${c.automation.slug}/`, fields: serviceFields(c.automation) });
    S.push({ id: 'pg-solutions', group: 'Services', label: 'Services overview', root: ['pages', 'solutions'], view: '/solutions/', fields: pageHeroFields() });
    c.audiences.forEach((a, i) => S.push({ id: 'aud-' + a.slug, group: 'Who we serve', label: textOf(a.name), root: ['audiences', i], view: `/who-we-serve/${a.slug}/`, fields: audienceFields(a) }));
    S.push({ id: 'pg-who', group: 'Who we serve', label: 'Who we serve overview', root: ['pages', 'whoWeServe'], view: '/who-we-serve/', fields: pageHeroFields() });
    S.push({ id: 'pg-platform', group: 'Platform', label: 'Platform overview', root: ['pages', 'platform'], view: '/platform/', fields: pageHeroFields() });
    c.platform.modules.forEach((m, i) => S.push({ id: 'mod-' + m.slug, group: 'Platform', label: textOf(m.name), root: ['platform', 'modules', i], view: `/platform/${m.slug}/`, fields: moduleFields(m) }));
    S.push({ id: 'pg-security', group: 'Platform', label: 'Data quality checks', root: [], view: '/platform/security/', fields: [
      G('Hero', [R('pages.security.h1', 'Headline', { ...HL, accent: true }), P('pages.security.lead', 'Intro paragraph', LEAD)]),
      G('Seven checks', [pairs('platform.qualityChecks', 'Checks', 'Check', 'What it does')]),
      G('Account security', [features('platform.security', 'Security features')]),
      G('FAQ', [faqs('pages.security.faqs')]),
    ] });
    S.push({ id: 'pg-methods', group: 'Platform', label: 'Methodologies', root: [], view: '/platform/methodologies/', fields: [
      G('Hero', [R('pages.methodologies.h1', 'Headline', { ...HL, accent: true }), P('pages.methodologies.lead', 'Intro paragraph', LEAD)]),
      G('Catalogue', [T('platform.methodologyTotal', 'Total methodologies', { max: 4, hint: 'Shown in menus and headings', kind: 'number' }),
        LIST('platform.methodologies', 'Groups', tup(T(0, 'Group', { max: 30 }), L(1, 'Methodologies', { hint: 'One per line' })), { itemLabel: 'Group', layout: 'c2' })]),
    ] });
    S.push({ id: 'pg-platform-more', group: 'Platform', label: 'Use cases & extras', root: ['platform'], view: '/platform/', fields: [
      G('Use cases', [LIST('useCases', 'Use cases', tup(R(0, 'Title', { max: 50 }), R(1, 'Subtitle', { max: 60 }), P(2, 'Description', { max: 360 }), P(3, 'The payoff', { max: 120 })), { itemLabel: 'Use case', layout: 'stack' })]),
      G('Also in the platform', [features('extras', 'Extras')]),
    ] });
    S.push({ id: 'pg-pricing', group: 'Pricing', label: 'Pricing page', root: [], view: '/pricing/', intro: 'Prices stay hidden. The plan comparison table is kept in code, so the number of plans is fixed.', fields: [
      G('Hero', [R('pages.pricing.h1', 'Headline', { ...HL, accent: true }), P('pages.pricing.lead', 'Intro paragraph', LEAD)]),
      G('Plans', [LIST('platform.plans', 'Plans', [T('name', 'Plan name', { max: 20 }), R('tag', 'Short description', { max: 70 }), B('popular', 'Mark as "Most popular"'), L('items', 'What it includes', { hint: 'One per line. A line ending in "plus:" becomes a sub-heading.' })], { fixed: true, itemLabel: 'Plan', layout: 'stack' })]),
      G('FAQ', [faqs('pages.pricing.faqs')]),
    ] });
    S.push({ id: 'pg-about', group: 'Company', label: 'About', root: ['pages', 'about'], view: '/about/', fields: pageHeroFields([
      G('Our story', [LIST('story', 'Paragraphs', P(null, 'Paragraph', { max: 900, link: true }), { itemLabel: 'Paragraph' }), P('note', 'Highlighted note', { max: 300 })]),
      G('What we stand for', [features('values', 'Promises')]),
    ]) });
    S.push({ id: 'pg-contact', group: 'Company', label: 'Contact page', root: ['pages', 'contact'], view: '/contact/', fields: pageHeroFields() });
    S.push({ id: 'meta', group: 'Search & sharing', label: 'Titles & descriptions', root: ['meta'], view: null, intro: 'What Google and link previews show for each page. Titles up to 60 characters and descriptions up to 160 show in full.', fields:
      Object.keys(c.meta).map(u => G(u, [T('title', 'Title', { max: 70, hint: u === '/' ? 'Shown exactly as written' : 'Followed by " · Research COPS"' }), T('description', 'Description', { max: 160, area: true })], { pathKeys: [u] })) });
    SECTIONS = S;
  }

  // ---------- State ----------
  let defaults = null, base = null, doc = null, savedJson = '', current = 'home', user = null, db = null, auth = null, draftMeta = null;
  const changedPaths = () => { const out = new Set(); (function walk(a, b, p) { if (JSON.stringify(a) === JSON.stringify(b)) return; if (isObj(a) && isObj(b)) { for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) walk(a[k], b[k], p.concat(k)); return; } if (Array.isArray(a) && Array.isArray(b) && a.length === b.length) { a.forEach((x, i) => walk(x, b[i], p.concat(i))); return; } out.add(p.join('.')); })(doc, base, []); return out; };
  const isDirty = () => JSON.stringify(doc) !== savedJson;

  function status() {
    const s = $('status');
    if (isDirty()) { s.textContent = 'Unsaved changes'; s.className = 'status dirty'; }
    else { s.textContent = draftMeta ? `Draft saved ${draftMeta}` : 'No changes'; s.className = 'status'; }
    renderSideDots();
  }
  const toast = msg => { const t = el('div', 'toast', esc(msg)); document.body.appendChild(t); setTimeout(() => t.remove(), 3200); };

  // ---------- Rich text ----------
  const ALLOWED_STYLE = /^\s*color:\s*var\(--[\w-]+\)\s*(;\s*font-weight:\s*\d+\s*)?;?\s*$/;
  function clean(html) {
    const box = document.createElement('div'); box.innerHTML = html;
    const out = node => [...node.childNodes].map(n => {
      if (n.nodeType === 3) return esc(n.nodeValue).replace(/&quot;/g, '"').replace(/ /g, ' ');
      if (n.nodeType !== 1) return '';
      const inner = out(n), tag = n.tagName;
      if (tag === 'B' || tag === 'STRONG') return inner ? `<${tag.toLowerCase()}>${inner}</${tag.toLowerCase()}>` : '';
      if (tag === 'EM' || tag === 'I') { const st = n.getAttribute('style'); return inner ? `<em${n.classList.contains('s') ? ' class="s"' : ''}${st && ALLOWED_STYLE.test(st) ? ` style="${esc(st)}"` : ''}>${inner}</em>` : ''; }
      if (tag === 'A') { const h = n.getAttribute('href') || '', st = n.getAttribute('style'); return /^(https?:|mailto:|tel:|\/|#)/.test(h) ? `<a href="${esc(h)}"${st && ALLOWED_STYLE.test(st) ? ` style="${esc(st)}"` : ''}>${inner}</a>` : inner; }
      if (tag === 'BR') return '<br>';
      return inner; // anything else (span, div, font…) is unwrapped
    }).join('');
    return out(box).replace(/(<br>)+$/, '').trim();
  }
  function richEditor(f, value, onChange) {
    const wrap = el('div', 'rich-wrap'), bar = el('div', 'rich-bar'), ed = el('div', 'rich' + (f.type === 'para' ? ' para' : ''));
    ed.contentEditable = 'true'; ed.innerHTML = value || ''; ed.setAttribute('role', 'textbox'); ed.setAttribute('aria-label', f.label);
    if (f.type === 'para') ed.setAttribute('aria-multiline', 'true');
    const fire = () => onChange(clean(ed.innerHTML), ed.textContent);
    const btn = (label, title, cls, fn) => { const b = el('button', cls, label); b.type = 'button'; b.title = title; b.addEventListener('mousedown', e => e.preventDefault()); b.addEventListener('click', () => { ed.focus(); fn(); fire(); }); bar.appendChild(b); };
    btn('<b>B</b>', 'Bold', '', () => document.execCommand('bold'));
    btn('Accent', 'Serif accent word (select the word first)', 'acc', () => {
      const sel = getSelection(); if (!sel.rangeCount) return;
      const r = sel.getRangeAt(0); if (!ed.contains(r.commonAncestorContainer)) return;
      let n = r.commonAncestorContainer; while (n && n !== ed && n.tagName !== 'EM') n = n.parentNode;
      if (n && n !== ed) { n.replaceWith(...n.childNodes); return; } // toggle off
      if (r.collapsed) return;
      const em = document.createElement('em'); if (f.accent !== 'plain') em.className = 's';
      em.appendChild(r.extractContents()); r.insertNode(em);
    });
    if (f.link || f.type === 'para') btn('Link', 'Add or change a link', '', () => {
      const url = prompt('Link address (https://…, /page/ or mailto:…). Leave empty to remove the link.');
      if (url === null) return;
      if (!url.trim()) document.execCommand('unlink'); else if (/^(https?:|mailto:|tel:|\/|#)/.test(url.trim())) document.execCommand('createLink', false, url.trim()); else alert('Links must start with https://, /, mailto: or tel:');
    });
    btn('Clear', 'Remove formatting from the selection', '', () => document.execCommand('removeFormat'));
    ed.addEventListener('input', fire);
    ed.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); if (e.shiftKey && f.type === 'para') { document.execCommand('insertLineBreak'); fire(); } } });
    ed.addEventListener('paste', e => { e.preventDefault(); document.execCommand('insertText', false, (e.clipboardData.getData('text/plain') || '').replace(/\s*\n\s*/g, ' ')); });
    wrap.append(bar, ed);
    return wrap;
  }

  // ---------- Form rendering ----------
  const keyPath = k => (typeof k === 'number' ? [k] : String(k).split('.'));
  function counter(f, len) { const c = el('span', 'count'); if (f.max) { c.textContent = `${len} / ${f.max}`; c.classList.toggle('over', len > f.max); } return c; }

  function renderField(parent, f, path, changed) {
    const value = get(doc, path);
    const pstr = path.join('.');
    if (f.type === 'group') {
      const fs = el('fieldset'); fs.appendChild(el('legend', '', esc(f.label)));
      const gp = f.pathKeys ? path.concat(f.pathKeys) : path;
      f.fields.forEach(x => renderField(fs, x, gp.concat(keyPath(x.k)), changed));
      parent.appendChild(fs); return;
    }
    if (value === undefined && f.type !== 'bool') return; // field not used on this page
    const box = el('div', 'f'); box.dataset.path = pstr;
    if ([...changed].some(c => c === pstr || c.startsWith(pstr + '.'))) box.classList.add('changed');
    const lab = el(f.type === 'list' ? 'div' : 'label', f.type === 'list' ? 'lab' : '');
    lab.innerHTML = `<span>${esc(f.label)}${f.hint ? ` <span class="hint">· ${esc(f.hint)}</span>` : ''}</span>`;
    box.appendChild(lab);
    const onValue = (v, plainLen) => { set(doc, path, v); const c = lab.querySelector('.count'); if (c) c.replaceWith(counter(f, plainLen)); box.classList.toggle('changed', JSON.stringify(v) !== JSON.stringify(get(base, path))); status(); };

    if (f.type === 'text') {
      const inp = el(f.area ? 'textarea' : 'input');
      if (!f.area) inp.type = f.kind === 'url' ? 'url' : f.kind === 'email' ? 'email' : 'text';
      if (f.area) inp.style.minHeight = '64px';
      inp.value = textOf(value); inp.id = 'f-' + pstr.replace(/[^\w-]/g, '_'); lab.htmlFor = inp.id;
      const orig = value;
      // Plain text is stored as HTML text (& → &amp;); untouched values keep their original form
      inp.addEventListener('input', () => onValue(inp.value === textOf(orig) ? orig : esc(inp.value).replace(/&quot;/g, '"'), inp.value.length));
      lab.appendChild(counter(f, inp.value.length)); box.appendChild(inp);
    } else if (f.type === 'rich' || f.type === 'para') {
      lab.appendChild(counter(f, textOf(value).length));
      box.appendChild(richEditor(f, value, (v, t) => onValue(v, t.length)));
    } else if (f.type === 'lines') {
      const ta = el('textarea'); const orig = value.slice();
      ta.value = value.map(textOf).join('\n'); ta.rows = Math.min(14, Math.max(4, value.length + 1));
      ta.id = 'f-' + pstr.replace(/[^\w-]/g, '_'); lab.htmlFor = ta.id;
      ta.addEventListener('input', () => { const lines = ta.value.split('\n').map(s => s.trim()).filter(Boolean); onValue(lines.map(l => orig.find(o => textOf(o) === l) || esc(l).replace(/&quot;/g, '"')), 0); });
      box.appendChild(ta);
    } else if (f.type === 'icon') {
      const sel = el('select'); ICONS.forEach(i => sel.appendChild(new Option(i, i, false, i === value)));
      sel.id = 'f-' + pstr.replace(/[^\w-]/g, '_'); lab.htmlFor = sel.id;
      sel.addEventListener('change', () => onValue(sel.value, 0)); box.appendChild(sel);
    } else if (f.type === 'bool') {
      const row = el('label', 'check-row'), cb = el('input'); cb.type = 'checkbox'; cb.checked = !!value;
      cb.addEventListener('change', () => { if (cb.checked) set(doc, path, true); else delete get(doc, path.slice(0, -1))[path.at(-1)]; box.classList.toggle('changed', !!cb.checked !== !!get(base, path)); status(); });
      row.append(cb, document.createTextNode(f.label)); box.innerHTML = ''; box.appendChild(row);
    } else if (f.type === 'list') {
      renderList(box, f, path, value, changed);
    }
    parent.appendChild(box);
  }

  function renderList(box, f, path, value, changed) {
    const list = el('div', 'list');
    const tuple = Array.isArray(f.item) && f.item.every(c => typeof c.k === 'number');
    value.forEach((item, i) => {
      const it = el('div', 'item'), head = el('div', 'item-head');
      head.innerHTML = `<span>${esc(f.itemNames ? f.itemNames[i] || `${f.itemLabel} ${i + 1}` : `${f.itemLabel || 'Item'} ${i + 1}`)}</span><span class="grow"></span>`;
      if (!f.fixed) {
        const mk = (label, title, dis, fn) => { const b = el('button', '', label); b.type = 'button'; b.title = title; b.disabled = dis; b.addEventListener('click', () => { fn(); status(); renderMain(); }); head.appendChild(b); };
        mk('↑', 'Move up', i === 0, () => { const a = get(doc, path); [a[i - 1], a[i]] = [a[i], a[i - 1]]; });
        mk('↓', 'Move down', i === value.length - 1, () => { const a = get(doc, path); [a[i + 1], a[i]] = [a[i], a[i + 1]]; });
        mk('Remove', 'Remove this item', value.length <= 1, () => { if (confirm(`Remove ${(f.itemLabel || 'item').toLowerCase()} ${i + 1}?`)) get(doc, path).splice(i, 1); });
      }
      if (!f.single) it.appendChild(head);
      const cols = el('div', 'cols' + (f.layout === 'c2' ? ' c2' : f.layout === 'c3' ? ' c3' : ''));
      if (Array.isArray(f.item)) f.item.forEach(c => renderField(cols, c, path.concat(i, tuple ? [c.k] : keyPath(c.k)), changed));
      else renderField(cols, { ...f.item, label: f.item.label }, path.concat(i), changed);
      it.appendChild(cols); list.appendChild(it);
    });
    box.appendChild(list);
    if (!f.fixed) {
      const add = el('button', 'btn btn-sm', `+ Add ${(f.itemLabel || 'item').toLowerCase()}`); add.type = 'button';
      add.addEventListener('click', () => {
        const a = get(doc, path), proto = a[a.length - 1];
        const blank = v => (typeof v === 'string' ? '' : Array.isArray(v) ? (v.every(x => typeof x === 'string') && !tuple ? [] : v.map(blank)) : isObj(v) ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, blank(x)])) : v);
        const n = blank(clone(proto)); if (Array.isArray(f.item) && f.item[0].type === 'icon') n[0] = proto[0];
        a.push(n); status(); renderMain();
        setTimeout(() => { const items = document.querySelectorAll(`[data-path="${path.join('.')}"] .item`); const last = items[items.length - 1]; if (last) { last.scrollIntoView({ block: 'center' }); const ed = last.querySelector('.rich, input, textarea'); if (ed) ed.focus(); } }, 30);
      });
      box.appendChild(add);
    }
  }

  function renderSide() {
    const side = $('side'); side.innerHTML = '';
    let g = '';
    SECTIONS.forEach(s => {
      if (s.group !== g) { g = s.group; side.appendChild(el('h4', '', esc(g))); }
      const b = el('button', s.id === current ? 'on' : '', `<span>${esc(s.label)}</span><span class="dot" hidden></span>`); b.type = 'button'; b.dataset.id = s.id;
      b.addEventListener('click', () => { current = s.id; renderSide(); renderMain(); window.scrollTo(0, 0); history.replaceState(null, '', '#' + s.id); });
      side.appendChild(b);
    });
    renderSideDots();
  }
  function sectionPaths(s) {
    // the content paths a section edits, for the "changed" dots
    if (s.root.length) return [s.root.join('.')];
    const out = []; (function walk(fs) { fs.forEach(f => (f.type === 'group' ? walk(f.fields) : out.push(String(f.k)))); })(s.fields); return out;
  }
  function renderSideDots() {
    if (!doc) return;
    const ch = [...changedPaths()];
    SECTIONS.forEach(s => { const dot = document.querySelector(`.side button[data-id="${s.id}"] .dot`); if (dot) dot.hidden = !sectionPaths(s).some(p => ch.some(c => c === p || c.startsWith(p + '.'))); });
  }
  function renderMain() {
    const s = SECTIONS.find(x => x.id === current) || SECTIONS[0]; current = s.id;
    const main = $('main'); main.innerHTML = '';
    main.appendChild(el('h2', '', esc(s.label)));
    main.appendChild(el('p', 'intro', `${s.intro ? esc(s.intro) + ' ' : ''}${s.view ? `<a href="${esc(s.view)}" target="_blank" rel="noopener">View the live page ↗</a>` : ''}`));
    const changed = changedPaths();
    s.fields.forEach(f => renderField(main, f, s.root.slice(), changed));
  }

  // ---------- Checks before publishing ----------
  const HOUSE = [
    [/\bone (project )?record\b/i, 'Say "one platform", not "one record".'],
    [/open[- ]?ended? coding/i, 'Say "open-end quality checks & framework", not "open-end coding".'],
    [/\b2\s?M\+|\b300\+|\b95\s?%/, 'Panel figures (2M+, 300+, 95%) are not confirmed for the site.'],
    [/DeepSight/i, 'Use "Research COPS" or "Research Centric OPS".'],
  ];
  function locate(path) {
    const p = path.join('.');
    let best = null;
    SECTIONS.forEach(s => sectionPaths(s).forEach(r => { if ((p === r || p.startsWith(r + '.')) && (!best || r.length > best.r.length)) best = { s, r }; }));
    return best ? best.s : null;
  }
  function runChecks() {
    const errs = [], warns = [];
    const add = (arr, path, msg) => { const s = locate(path); arr.push({ s, msg }); };
    (function walk(v, b, p) {
      if (typeof v === 'string') {
        const t = textOf(v).trim();
        HOUSE.forEach(([re, msg]) => { const m = t.match(re); if (m && !(typeof b === 'string' && re.test(textOf(b)))) add(warns, p, `${msg} Found: "…${t.slice(Math.max(0, m.index - 40), m.index + m[0].length + 20)}…"`); });
        const m = t.match(/\b(\d{2,3})\+?\s+(countries|markets)\b/i); if (m && m[1] !== '44' && !(typeof b === 'string' && b.includes(m[0]))) add(warns, p, `Use 44 countries everywhere. Found "${m[0]}".`);
        return;
      }
      if (Array.isArray(v)) return v.forEach((x, i) => walk(x, Array.isArray(b) ? b[i] : undefined, p.concat(i)));
      if (isObj(v)) Object.keys(v).forEach(k => walk(v[k], isObj(b) ? b[k] : undefined, p.concat(k)));
    })(doc, base, []);
    // Length limits from the form definitions, for fields that changed
    const changed = changedPaths();
    SECTIONS.forEach(s => (function walk(fs, path) {
      fs.forEach(f => {
        if (f.type === 'group') return walk(f.fields, f.pathKeys ? path.concat(f.pathKeys) : path);
        const p = path.concat(keyPath(f.k)), v = get(doc, p);
        if (f.type === 'list' && Array.isArray(v)) return v.forEach((_, i) => (Array.isArray(f.item) ? walk(f.item, p.concat(i)) : walk([{ ...f.item, k: i }], p)));
        const was = get(base, p);
        if (typeof v === 'string' && !textOf(v).trim() && typeof was === 'string' && textOf(was).trim()) errs.push({ s, msg: `${f.label} is empty. Add text or undo the change.` });
        if (f.max && typeof v === 'string' && changed.has(p.join('.'))) { const n = textOf(v).length; if (n > f.max) errs.push({ s, msg: `${f.label} is ${n} characters; the limit is ${f.max}.` }); }
        if (f.kind === 'url' && typeof v === 'string' && v && !/^https?:\/\//.test(textOf(v))) errs.push({ s, msg: `${f.label} must start with https://` });
        if (f.kind === 'email' && typeof v === 'string' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(textOf(v))) errs.push({ s, msg: `${f.label} is not a valid email address.` });
      });
    })(s.fields, s.root.slice()));
    if (!/^\d+$/.test(String(doc.platform.methodologyTotal))) errs.push({ s: SECTIONS.find(x => x.id === 'pg-methods'), msg: 'Total methodologies must be a number.' });
    return { errs, warns };
  }

  // ---------- Dialogs ----------
  function dialog(html, wire) { $('dlgBody').innerHTML = html; const d = $('dlg'); if (!d.open) d.showModal(); wire && wire($('dlgBody')); }
  const closeDlg = () => $('dlg').close();
  const goto = id => { closeDlg(); current = id; renderSide(); renderMain(); window.scrollTo(0, 0); };
  const issueList = (arr, cls) => arr.map((x, i) => `<li class="${cls}">${esc(x.msg)}${x.s ? `<small><button type="button" data-goto="${x.s.id}">${esc(x.s.group)} › ${esc(x.s.label)}</button></small>` : ''}</li>`).join('');
  const wireGoto = body => body.querySelectorAll('[data-goto]').forEach(b => b.addEventListener('click', () => goto(b.dataset.goto)));

  // ---------- Load / save / publish ----------
  function setData(content, savedLabel) {
    doc = merge(clone(defaults), content);
    savedJson = JSON.stringify(doc);
    draftMeta = savedLabel || null;
    buildSections(doc); renderSide(); renderMain(); status();
  }
  async function loadAll() {
    defaults = await fetch(DEFAULTS_URL, { cache: 'no-store' }).then(r => { if (!r.ok) throw new Error('Could not load ' + DEFAULTS_URL); return r.json(); });
    let published = null, draft = null, draftLabel = null;
    if (LOCAL) {
      try { draft = JSON.parse(localStorage.getItem('rc_content_draft') || 'null'); draftLabel = localStorage.getItem('rc_content_draft_at'); } catch (e) { /* no storage */ }
    } else {
      const [p, d] = await Promise.all([db.collection('siteContent').doc('published').get(), db.collection('siteContent').doc('draft').get()]);
      if (p.exists) published = JSON.parse(p.data().data);
      if (d.exists) { draft = JSON.parse(d.data().data); const t = d.data().updatedAt; draftLabel = t && t.toDate ? `${t.toDate().toLocaleString()}${d.data().updatedBy ? ' by ' + d.data().updatedBy : ''}` : null; }
    }
    // What is live = defaults + published copy; the editor opens on the draft if there is one
    base = merge(clone(defaults), published);
    setData(draft || published, draftLabel);
    const hash = location.hash.slice(1); if (SECTIONS.some(s => s.id === hash)) { current = hash; renderSide(); renderMain(); }
  }
  async function saveDraft(quiet) {
    const data = JSON.stringify(doc);
    if (LOCAL) {
      try { localStorage.setItem('rc_content_draft', data); localStorage.setItem('rc_content_draft_at', new Date().toLocaleString()); } catch (e) { alert('This browser would not save the draft.'); return false; }
      draftMeta = new Date().toLocaleString() + ' (this browser only)';
    } else {
      await db.collection('siteContent').doc('draft').set({ data, updatedAt: firebase.firestore.FieldValue.serverTimestamp(), updatedBy: user.email });
      draftMeta = `${new Date().toLocaleString()} by ${user.email}`;
    }
    savedJson = data; status(); if (!quiet) toast('Draft saved'); return true;
  }
  function publishFlow() {
    const { errs, warns } = runChecks();
    const changes = changedPaths().size;
    const ok = !errs.length;
    dialog(`<h3>${ok ? 'Ready to publish?' : 'Fix these first'}</h3>
      <p style="color:var(--muted);margin:0">${changes ? `${changes} change${changes === 1 ? '' : 's'} compared with the live site.` : 'Nothing has changed compared with the live site.'}</p>
      <ul>${issueList(errs, 'err')}${issueList(warns, 'warn')}${ok && !warns.length ? '<li class="ok">All checks passed: no empty fields, nothing over its limit, house style followed.</li>' : ''}</ul>
      ${ok && warns.length ? '<label class="check-row"><input type="checkbox" id="ackWarn"> I have checked the warnings above</label>' : ''}
      <p style="font-size:13px;color:var(--muted)">Publishing saves this version, then rebuilds the website. The new text is live in about a minute. Every version is kept in History.</p>
      <div class="actions"><button class="btn" type="button" id="dCancel">Cancel</button>${ok ? `<button class="btn btn-primary" type="button" id="dGo"${warns.length ? ' disabled' : ''}${!changes ? ' disabled' : ''}>Publish now</button>` : ''}</div>`, body => {
      wireGoto(body);
      body.querySelector('#dCancel').onclick = closeDlg;
      const ack = body.querySelector('#ackWarn'), go = body.querySelector('#dGo');
      if (ack) ack.onchange = () => { go.disabled = !ack.checked || !changes; };
      if (go) go.onclick = () => doPublish(go);
    });
  }
  async function doPublish(btn) {
    if (LOCAL) { closeDlg(); dialog(`<h3>Local test mode</h3><p>Publishing is off here. Use <b>Export</b> to download this copy, then build it on this computer with:</p><pre style="background:#f1f6f5;padding:12px;border-radius:9px;overflow:auto">RC_CONTENT_FILE=path/to/site-content.json node build/fetch-content.js\nnode build/build.js</pre><div class="actions"><button class="btn btn-primary" type="button" id="dOk">OK</button></div>`, b => { b.querySelector('#dOk').onclick = closeDlg; }); return; }
    btn.disabled = true; btn.textContent = 'Publishing…';
    try {
      await saveDraft(true);
      const token = await user.getIdToken();
      const res = await fetch('/api/publish', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify({ data: JSON.stringify(doc) }) });
      if (res.status === 404) throw new Error('Publishing is not switched on for this website yet (the /api/publish step is still to be set up). Your draft is saved.');
      const out = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(out.error || `Publishing failed (${res.status}). Your draft is saved.`);
      base = clone(doc); savedJson = JSON.stringify(doc);
      closeDlg(); renderMain(); status();
      toast(`Published version ${out.version || ''}. The site is rebuilding and will update in about a minute.`);
    } catch (e) {
      dialog(`<h3>Not published</h3><p>${esc(e.message)}</p><div class="actions"><button class="btn btn-primary" type="button" id="dOk">OK</button></div>`, b => { b.querySelector('#dOk').onclick = closeDlg; });
    }
  }
  async function historyFlow() {
    if (LOCAL) { dialog('<h3>History</h3><p>Published versions appear here once publishing is set up. In local test mode there is no history.</p><div class="actions"><button class="btn btn-primary" type="button" id="dOk">OK</button></div>', b => { b.querySelector('#dOk').onclick = closeDlg; }); return; }
    dialog('<h3>History</h3><p>Loading…</p>');
    try {
      const snap = await db.collection('siteContentVersions').orderBy('version', 'desc').limit(20).get();
      const rows = snap.docs.map(d => { const v = d.data(); const t = v.publishedAt && v.publishedAt.toDate ? v.publishedAt.toDate().toLocaleString() : ''; return `<tr><td>v${v.version}</td><td>${esc(t)}</td><td>${esc(v.publishedBy || '')}</td><td><button class="btn btn-sm" type="button" data-restore="${d.id}">Load into editor</button></td></tr>`; }).join('');
      dialog(`<h3>History</h3><p style="color:var(--muted);margin:0">Load an earlier version into the editor, check it, then publish it again.</p>${rows ? `<table class="hist"><tr><th>Version</th><th>Published</th><th>By</th><th></th></tr>${rows}</table>` : '<p>No versions published yet.</p>'}<div class="actions"><button class="btn" type="button" id="dOk">Close</button></div>`, b => {
        b.querySelector('#dOk').onclick = closeDlg;
        b.querySelectorAll('[data-restore]').forEach(x => x.onclick = async () => {
          if (isDirty() && !confirm('Replace your unsaved changes with this version?')) return;
          const d = await db.collection('siteContentVersions').doc(x.dataset.restore).get();
          doc = merge(clone(defaults), JSON.parse(d.data().data)); closeDlg(); renderSide(); renderMain(); status(); toast('Version loaded. Save the draft or publish it.');
        });
      });
    } catch (e) { dialog(`<h3>History</h3><p>${esc(e.message)}</p><div class="actions"><button class="btn" type="button" id="dOk">Close</button></div>`, b => { b.querySelector('#dOk').onclick = closeDlg; }); }
  }
  function exportFlow() {
    dialog(`<h3>Export</h3><p>Download the copy in the editor as a file, for a backup or to build the site on a computer.</p>
      <div class="actions"><button class="btn btn-danger" type="button" id="dDiscard">Discard unsaved changes</button><button class="btn" type="button" id="dCancel">Close</button><button class="btn btn-primary" type="button" id="dDl">Download site-content.json</button></div>`, b => {
      b.querySelector('#dCancel').onclick = closeDlg;
      b.querySelector('#dDl').onclick = () => { const a = el('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(doc, null, 2) + '\n'], { type: 'application/json' })); a.download = 'site-content.json'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); closeDlg(); };
      const dis = b.querySelector('#dDiscard'); dis.disabled = !isDirty();
      dis.onclick = () => { if (confirm('Discard all changes since the last save?')) { doc = JSON.parse(savedJson); closeDlg(); renderSide(); renderMain(); status(); } };
    });
  }

  // ---------- Start ----------
  function showApp() {
    $('login').hidden = true; $('app').hidden = false;
    $('who').textContent = LOCAL ? 'Local test mode' : user.email;
    if (LOCAL) { const bn = $('banner'); bn.hidden = false; bn.textContent = 'Local test mode: nothing is saved online. Drafts stay in this browser, and publishing is off.'; $('btnOut').hidden = true; }
    loadAll().catch(e => { $('main').innerHTML = `<div class="note">Could not load the content: ${esc(e.message)}</div>`; });
  }
  function wire() {
    $('btnSave').onclick = () => saveDraft().catch(e => alert('Could not save the draft: ' + e.message));
    $('btnPublish').onclick = publishFlow;
    $('btnHistory').onclick = historyFlow;
    $('btnMore').onclick = exportFlow;
    $('btnOut').onclick = () => { if (isDirty() && !confirm('You have unsaved changes. Sign out anyway?')) return; auth.signOut(); };
    $('dlg').addEventListener('click', e => { if (e.target === $('dlg')) closeDlg(); });
    window.addEventListener('beforeunload', e => { if (doc && isDirty()) { e.preventDefault(); e.returnValue = ''; } });
    document.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's' && doc) { e.preventDefault(); $('btnSave').click(); } });
  }

  wire();
  if (LOCAL) { window.__cms = { get doc() { return doc; }, get base() { return base; }, changedPaths, runChecks }; showApp(); return; }
  if (typeof firebase === 'undefined' || !FIREBASE_CONFIG) { document.body.innerHTML = '<p style="padding:40px;font:16px Inter,sans-serif">The content admin could not connect to Firebase. Check your connection and reload.</p>'; return; }
  if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
  auth = firebase.auth(); db = firebase.firestore();
  $('loginForm').addEventListener('submit', e => {
    e.preventDefault(); $('loginErr').textContent = '';
    auth.signInWithEmailAndPassword($('lEmail').value.trim(), $('lPass').value).catch(() => { $('loginErr').textContent = 'Those details did not work. Check the email and password and try again.'; });
  });
  auth.onAuthStateChanged(u => {
    user = u;
    if (u) showApp();
    else { $('app').hidden = true; $('login').hidden = false; doc = null; }
  });
})();
