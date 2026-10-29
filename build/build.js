// Research COPS static site generator.
// Usage: node build/build.js
// Writes the marketing pages into the repo root (served as-is by Vercel) with one shared
// header and footer. insights.html and policy.html keep their admin-driven engines
// (insights.js / policy.js); only their header and footer come from here.
// admin.html, admin.js, workflow-hub-app.js and the Firebase setup are never touched.
const fs = require('fs');
const path = require('path');
const C = require('./content-store');
const { ICONS, services, automation, audiences } = require('./content');
const { DIY_URL, modules, methodologyTotal, methodologies, qualityChecks, security, plans, compare, extras, useCases } = require('./platform');

const ROOT = path.join(__dirname, '..');
const SITE_URL = 'https://www.researchcops.com';
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
// Company details (Content admin → Company). The phone link is derived from the display number.
// The footer fields have no footer-* ids on purpose: admin.html settings no longer overwrite them.
const CO = { ...C.company, phoneTel: C.company.phone.replace(/[^\d+]/g, '') };
// {{path.to.value}} placeholders in src/home.html and build/contact.html
const fillTokens = (html, ctx) => html.replace(/\{\{([\w.]+)\}\}/g, (m, p) => {
  const v = p.split('.').reduce((o, k) => (o == null ? o : o[k]), ctx);
  if (typeof v !== 'string') throw new Error(`Missing content for {{${p}}}`);
  return v;
});

const allSolutions = [...services, automation];
const bySlug = Object.fromEntries(allSolutions.map(s => [s.slug, s]));
const audBySlug = Object.fromEntries(audiences.map(a => [a.slug, a]));
const solUrl = s => `/solutions/${s}/`;
const audUrl = s => `/who-we-serve/${s}/`;
const modUrl = s => `/platform/${s}/`;
// THE research sequence. Every platform listing (menus, footer, grids, tables) follows it:
// Feasibility & Costing → Survey Builder → Translation → Sample Collection → Data quality checks → Data Processing & Reporting
const PLATFORM_SEQ = [
  ...['feasibility-costing', 'survey-builder', 'translation', 'sample-collection'].map(slug => { const m = modules.find(x => x.slug === slug); return { url: modUrl(slug), name: m.name, short: m.short, icon: m.icon }; }),
  { url: '/platform/security/', name: 'Data quality checks', short: 'Seven fraud and quality checks on every survey link, plus account security.', icon: 'shield' },
  ...['data-reporting'].map(slug => { const m = modules.find(x => x.slug === slug); return { url: modUrl(slug), name: m.name, short: m.short, icon: m.icon }; }),
];
const SERVICE_ORDER = s => services.findIndex(x => x.slug === s);
const strip = h => h.replace(/<[^>]+>/g, '');
const attr = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

const icon = (k, size = 22) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICONS[k]}</svg>`;
const arrow = '<svg class="arrow" width="16" height="16"><use href="#i-arrow"/></svg>';
const check = '<svg width="20" height="20"><use href="#i-check"/></svg>';
const chev = '<svg width="12" height="12" viewBox="0 0 12 12"><path d="M2.5 4.5L6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';

const FIREBASE = ['app', 'auth', 'firestore'].map(m => `<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-${m}-compat.js"></script>`).join('\n');
const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=Instrument+Serif:ital@0;1&family=Michroma&display=swap" rel="stylesheet">`;
const FAVICON = `<link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">`;
// Colour theme trial: set to '' to go back to the original near-black ink
const THEME = '\n<link rel="stylesheet" href="/assets/brand.css">\n<link rel="stylesheet" href="/assets/theme-teal.css">';

// ---------- Shared chrome ----------
// Shield mark, as on the original app: top half in the theme's dark teal, three dashed rings
// that rotate slowly around the centre dot (animation in .rc-mark .rings).
const logoMark = size => `<svg class="rc-mark" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true" shape-rendering="geometricPrecision">
        <path d="M12 2c-2.5 0-4.5-.8-5.8-.8-1.7 0-3 1.6-3 4.3 0 1.3.6 2.5.6 3.3 0 .7-.6 1.4-.6 2.4V12h17.6v-.8c0-1-.6-1.7-.6-2.4 0-.8.6-2 .6-3.3 0-2.7-1.3-4.3-3-4.3-1.3 0-3.3.8-5.8.8z" fill="#04524e"/>
        <path d="M3.2 12c0 4.5 3.8 9.2 8.8 10.8 5-1.6 8.8-6.3 8.8-10.8H3.2z" fill="#f8fafc"/>
        <path d="M12 2c-2.5 0-4.5-.8-5.8-.8-1.7 0-3 1.6-3 4.3 0 1.3.6 2.5.6 3.3 0 .7-.6 1.4-.6 2.4 0 4.5 3.8 9.2 8.8 10.8 5-1.6 8.8-6.3 8.8-10.8 0-1-.6-1.7-.6-2.4 0-.8.6-2 .6-3.3 0-2.7-1.3-4.3-3-4.3-1.3 0-3.3.8-5.8.8z" fill="none" stroke="#04cbc2" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>
        <line x1="3.2" y1="12" x2="20.8" y2="12" stroke="#04cbc2" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="12" cy="7.2" r=".8" fill="#04cbc2"/>
        <g class="rings">
          <circle cx="12" cy="7.2" r="1.6" stroke="#fff" stroke-width=".8" fill="none" stroke-dasharray="7.5 2.5" stroke-linecap="round"/>
          <circle cx="12" cy="7.2" r="2.6" stroke="#04cbc2" stroke-width=".8" fill="none" stroke-dasharray="12.2 4.1" stroke-linecap="round"/>
          <circle cx="12" cy="7.2" r="3.6" stroke="#fff" stroke-width=".8" fill="none" stroke-dasharray="17 5.6" stroke-linecap="round"/>
        </g>
      </svg>`;
const LOGO_MARK = logoMark(44);

const cur = (url, current) => (url === current ? ' aria-current="page"' : '');

function header(current) {
  const inPlat = current.startsWith('/platform/'), inSol = current.startsWith('/solutions/'), inAud = current.startsWith('/who-we-serve/');
  const item = (u, name, short) => `<a href="${u}"${cur(u, current)}><b>${name}</b><small>${short}</small></a>`;
  const platLinks = item('/platform/', 'Platform overview', 'Every step of a study, on one platform.') + PLATFORM_SEQ.map(p => item(p.url, p.name, p.short)).join('') + item('/platform/methodologies/', `${methodologyTotal} methodologies`, 'Pricing, product and UX/CX designs, each with a built-in report.') + `<a class="addon" href="/contact/?need=Platform%20demo"><b>Book a platform demo</b><small>A 30-minute walkthrough on one of your own briefs.</small></a>`;
  const solLinks = services.map(s => item(solUrl(s.slug), s.name, s.short)).join('') + `<a class="addon" href="${solUrl(automation.slug)}"${cur(solUrl(automation.slug), current)}><b>${automation.name}<span class="badge">Add-on</span></b><small>${automation.short}</small></a>`;
  const audLinks = audiences.map(a => item(audUrl(a.slug), a.name, a.short)).join('');
  const mm = (label, items) => `<details class="mm-d"><summary>${label}</summary>${items.map(([u, t]) => `<a href="${u}">${t}</a>`).join('')}</details>`;
  return `<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="i-check" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-x" viewBox="0 0 24 24"><path d="M7 7l10 10M17 7L7 17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></symbol>
</svg>
<a href="#main" class="skip">Skip to content</a>
<header class="nav rc-chrome" id="nav">
  <div class="wrap">
    <a href="/" class="logo" aria-label="Research COPS home">
      ${LOGO_MARK}
      <div><div class="logo-word"><span class="lw-r">Research</span> <i class="lw-c">C</i><i class="lw-ops">OPS</i></div><span class="logo-sub" aria-label="Research Centric OPS"><span class="ls ls-r">Research</span> <span class="ls ls-c"><span class="ls-cap">C</span><span class="ls-tail">entric</span></span> <span class="ls ls-ops">OPS</span></span></div>
    </a>
    <nav class="nav-links" aria-label="Primary">
      <div class="dd${inPlat ? ' cur' : ''}"><button class="dd-btn" aria-expanded="false" aria-haspopup="true">Platform ${chev}</button><div class="dd-menu">${platLinks}</div></div>
      <div class="dd${inSol ? ' cur' : ''}"><button class="dd-btn" aria-expanded="false" aria-haspopup="true">Services ${chev}</button><div class="dd-menu">${solLinks}</div></div>
      <div class="dd${inAud ? ' cur' : ''}"><button class="dd-btn" aria-expanded="false" aria-haspopup="true">Who we serve ${chev}</button><div class="dd-menu one">${audLinks}</div></div>
      <a href="/pricing/"${cur('/pricing/', current)}>Pricing</a>
      <a href="/insights.html"${cur('/insights.html', current)}>Insights</a>
      <a href="/about/"${cur('/about/', current)}>About</a>
    </nav>
    <div class="nav-cta">
      <a href="${DIY_URL}" class="nav-signin" rel="noopener">Sign in</a>
      <a href="/contact/" class="btn btn-primary">Get a quote</a>
      <button class="burger" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="mobileMenu">
        <svg width="24" height="24" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
      </button>
    </div>
  </div>
</header>
<div class="mobile-menu rc-chrome" id="mobileMenu">
  <div class="mm-actions"><a href="/contact/" class="btn btn-primary">Get a quote</a><a href="${DIY_URL}" class="btn btn-ghost" rel="noopener">Sign in</a></div>
  ${mm('Platform', [['/platform/', 'Platform overview'], ...PLATFORM_SEQ.map(p => [p.url, p.name]), ['/platform/methodologies/', 'Methodologies'], ['/contact/?need=Platform%20demo', 'Book a platform demo']])}
  ${mm('Services', [...allSolutions.map(s => [solUrl(s.slug), s.name]), ['/solutions/', 'All services']])}
  ${mm('Who we serve', audiences.map(a => [audUrl(a.slug), a.name]))}
  ${mm('Company', [['/pricing/', 'Pricing & plans'], ['/#estimator', 'CPI estimator'], ['/insights.html', 'Insights'], ['/about/', 'About'], ['/contact/', 'Contact']])}
</div>`;
}

const footer = () => `<footer class="rc-chrome">
  <div class="wrap">
    <div class="fgrid">
      <div>
        <a href="/" class="flogo" aria-label="Research COPS home">${logoMark(48)}<span><span class="logo-word"><span>Research</span> COPS</span><span class="logo-sub">RESEARCH CENTRIC OPS</span></span></a>
        <p class="fdesc ftag"><span class="best">Best</span> Operating System for<br>Your <em class="s">Research Projects</em>.</p>
        <p class="fsteps" aria-label="Price, Build, Translate, Field, Report and Analyze. One Platform."><span aria-hidden="true">Price</span><i aria-hidden="true">→</i><span aria-hidden="true">Build</span><i aria-hidden="true">→</i><span aria-hidden="true">Translate</span><i aria-hidden="true">→</i><span aria-hidden="true">Field</span><i aria-hidden="true">→</i><span aria-hidden="true">Report &amp; Analyze</span><b class="fop" aria-hidden="true">One Platform</b></p>
      </div>
      <div><h5>Platform</h5><ul><li><a href="/platform/">Overview</a></li>${PLATFORM_SEQ.map(p => `<li><a href="${p.url}">${p.name}</a></li>`).join('')}<li><a href="/pricing/">Plans</a></li></ul></div>
      <div><h5>Services</h5><ul>${services.slice(0, 6).map(s => `<li><a href="${solUrl(s.slug)}">${s.name}</a></li>`).join('')}<li><a href="${solUrl(automation.slug)}">Workflow automation</a></li></ul></div>
      <div><h5>Who we serve</h5><ul>${audiences.map(a => `<li><a href="${audUrl(a.slug)}">${a.name}</a></li>`).join('')}</ul></div>
      <div><h5>Company</h5><ul><li><a href="/about/">About us</a></li><li><a href="/insights.html">Insights</a></li><li><a href="/contact/">Contact</a></li><li><a href="/policy.html?id=privacy">Privacy policy</a></li><li><a href="/policy.html?id=terms">Terms & conditions</a></li><li><a href="/policy.html?id=cookies">Cookie policy</a></li></ul></div>
    </div>
    <div class="fcontact-row">
      <ul class="fcontact">
        <li><span class="fi" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2"/></svg></span><div><small>Phone</small><a class="fc-phone" href="tel:${CO.phoneTel}">${CO.phone}</a></div></li>
        <li><span class="fi" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg></span><div><small>Email</small><span class="fc-emails"><a href="mailto:${CO.emailInfo}">${CO.emailInfo}</a><br><a href="mailto:${CO.emailBidding}">${CO.emailBidding}</a></span></div></li>
        <li><span class="fi" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg></span><div><small>Office</small><span class="fc-address">${CO.addressLine1},<br>${CO.addressLine2}</span></div></li>
      </ul>
      <div class="social">
        <a href="${attr(CO.social.linkedin)}" aria-label="LinkedIn (opens in a new tab)" target="_blank" rel="noopener"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 11.02 5 2.5 2.5 0 01-.02-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.6 8.65 21 11.2 21 14.5V21h-4v-5.8c0-1.4 0-3.2-1.95-3.2S13 13.5 13 15.1V21H9z"/></svg></a>
        <a href="${attr(CO.social.youtube)}" aria-label="YouTube (opens in a new tab)" target="_blank" rel="noopener"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23 7.2a3 3 0 00-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 001 7.2 31 31 0 00.6 12 31 31 0 001 16.8a3 3 0 002.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 002.1-2.1c.4-1.6.5-4.8.5-4.8s0-3.2-.5-4.8zM9.7 15.1V8.9L15.5 12z"/></svg></a>
        <a href="${attr(CO.social.instagram)}" aria-label="Instagram (opens in a new tab)" target="_blank" rel="noopener"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></svg></a>
        <a href="${attr(CO.social.facebook)}" aria-label="Facebook (opens in a new tab)" target="_blank" rel="noopener"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M14 8h3V4h-3a4 4 0 00-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8.5c0-.3.2-.5.5-.5z"/></svg></a>
      </div>
    </div>
    <div class="fbottom"><span>© ${new Date().getFullYear()} Research COPS. All rights reserved.</span><span>${CO.footerLine}</span></div>
  </div>
</footer>`;

function head({ url, title, description, extraHead = '' }) {
  // Titles and descriptions edited in the Content admin (Search & sharing)
  const m = C.meta[url] || {};
  title = m.title || title;
  description = m.description || description;
  const full = url === '/' ? title : `${title} · Research COPS`;
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${full}</title>
<meta name="description" content="${attr(description)}">
<link rel="canonical" href="${SITE_URL}${url}">
<meta property="og:title" content="${attr(full)}">
<meta property="og:description" content="${attr(description)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${SITE_URL}${url}">
<meta property="og:site_name" content="Research COPS">
<meta property="og:image" content="${SITE_URL}/assets/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Research COPS: Best Operating System for Your Research Projects">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${SITE_URL}/assets/og-image.png">
${FAVICON}
${FONTS}
${extraHead}`;
}

const tail = (pageScripts = '') => `${FIREBASE}
${pageScripts}
<script src="/assets/rc-data.js"></script>
<script src="/assets/site.js"></script>
<script src="/assets/genie.js" defer></script>
<script src="/cookie-consent.js" defer></script>`;

function layout({ url, title, description, body }) {
  return `<!doctype html>
<html lang="en">
<head>
${head({ url, title, description, extraHead: '<link rel="stylesheet" href="/assets/site.css">\n<link rel="stylesheet" href="/assets/pages.css">\n<link rel="stylesheet" href="/assets/platform.css">\n<link rel="stylesheet" href="/assets/hero-flow.css">' + THEME })}
</head>
<body>
${header(url)}
<main id="main">
${body}
</main>
${footer()}
${tail()}
</body>
</html>
`;
}

// Legacy engine pages: original <main> markup + original script, new header/footer.
function legacyLayout({ url, title, description, main, script, styles = '' }) {
  return `<!doctype html>
<html lang="en">
<head>
<script src="/theme.js"></script>
${head({ url, title, description, extraHead: '<link rel="stylesheet" href="/styles.css">\n<link rel="stylesheet" href="/assets/chrome.css">\n' + styles + THEME })}
</head>
<body>
${header(url)}
<div id="main" style="padding-top:20px">
${main}
</div>
${footer()}
${tail(`<script src="/${script}"></script>`)}
</body>
</html>
`;
}

// ---------- Reusable sections ----------
const contactSection = () => fillTokens(read('build/contact.html'), { contact: C.pages.contactBlock, company: CO });

const band = (h = 'Bring a live brief. Leave with a <em class="s">price</em>.', p = 'A working session on one of your real briefs, quoted live against your own expectation of the number.') => `<div class="band">
  <div class="wrap">
    <div><h2>${h}</h2><p>${p}</p></div>
    <div style="display:flex;gap:12px;flex-wrap:wrap">
      <a href="/contact/?need=Platform%20demo" class="btn btn-primary">Book a working session</a>
      <a href="mailto:Bidding-team@researchcops.com" class="btn btn-ghost">Email the bidding team</a>
    </div>
  </div>
</div>`;

const crumbs = items => `<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a>${items.map(([u, t]) => `<span>/</span>${u ? `<a href="${u}">${t}</a>` : `<b style="font-weight:500;color:var(--on-dark-body)">${t}</b>`}`).join('')}</nav>`;

const pageHero = ({ trail, eyebrow, h1, lead, stats, ctas = 'quote', slim = false, need = '', primary = 'Get a quote', alt = ['/#estimator', 'Estimate your CPI'] }) => {
  const q = need ? `?need=${encodeURIComponent(need)}` : '';
  const ctaHtml = ctas === 'quote'
    ? `<div class="hero-ctas"><a href="/contact/${q}" class="btn btn-primary">${primary} ${arrow}</a><a href="${alt[0]}" class="btn btn-ghost">${alt[1]}</a></div>`
    : ctas === 'demo'
      ? `<div class="hero-ctas"><a href="/contact/?need=Platform%20demo" class="btn btn-primary">Book a demo ${arrow}</a><a href="/pricing/" class="btn btn-ghost">See plans</a></div><p class="hero-signin">Already have an account? <a href="${DIY_URL}" rel="noopener">Sign in to Research Centric OPS →</a></p>`
      : '';
  return `<section class="page-hero dark${slim ? ' slim' : ''}">
  <div class="wrap">
    ${crumbs(trail)}
    <div class="${stats ? 'ph-grid' : ''}">
      <div>
        <span class="eyebrow">${eyebrow}</span>
        <h1>${h1}</h1>
        <p class="lead">${lead}</p>
        ${ctaHtml}
      </div>
      ${stats ? `<div class="ph-stats">${stats.map(([n, l]) => `<div><strong>${n}</strong><span>${l}</span></div>`).join('')}</div>` : ''}
    </div>
  </div>
</section>`;
};

const faqBlock = (faqs, bg = '') => `<section${bg ? ` style="background:${bg}"` : ''}>
  <div class="wrap">
    <div class="sec-head reveal"><span class="eyebrow">FAQ</span><h2>Asked and <em class="s">answered</em>.</h2></div>
    <div class="faq reveal">${faqs.map(([q, a], i) => `<details${i === 0 ? ' open' : ''}><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>
  </div>
</section>`;

const relCard = (url, title, desc, more = 'Learn more') => `<a class="rel" href="${url}"><h3>${title}</h3><p>${desc}</p><span class="more">${more} →</span></a>`;
const faqSchema = faqs => `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) })}</script>`;
const orgSchema = `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', name: 'Research COPS', alternateName: 'Research Centric Ops', url: SITE_URL, logo: SITE_URL + '/assets/icon-512.png', email: CO.emailInfo, telephone: CO.phone.replace(/\s+/g, '-'), address: { '@type': 'PostalAddress', streetAddress: CO.addressLine1, addressLocality: 'Greater Noida', addressRegion: 'Uttar Pradesh', postalCode: '201306', addressCountry: 'IN' } })}</script>`;

// "Today vs here" strip used on platform pages
const todayHere = (today, here) => `<div class="th reveal"><div class="th-today"><small>Today</small><p>${today}</p></div><div class="th-arrow">${arrow}</div><div class="th-here"><small>In Research COPS</small><p>${here}</p></div></div>`;

// Product mock panels (illustrative figures; labels follow the DIY product brief)
const MOCKS = {
  feasibility: `<div class="mock" aria-label="Example Feasibility & Costing screen">
  <div class="mock-bar"><i></i><i></i><i></i><span><b class="bar-brand">Research Centric OPS</b> / feasibility</span></div>
  <div class="mock-body mock-2">
    <div><h4>The brief</h4>
      <dl class="mock-dl"><dt>Market</dt><dd>Germany</dd><dt>Audience</dt><dd>B2B Decision Makers</dd><dt>Incidence</dt><dd>35%</dd><dt>Interview length</dt><dd>15 minutes</dd><dt>Sample size</dt><dd>200</dd><dt>Geography</dt><dd>National</dd></dl></div>
    <div><h4>Recommended CPI</h4><div class="mock-big">$15.38</div><p class="mock-mute">CPI range $13.53 – $18.52 · Field time 5–7 days</p>
      <div class="mock-cases"><div><small>Worst case</small><b>211</b></div><div><small>Expected</small><b>386</b></div><div><small>Confidence</small><b class="ok">Very High</b></div></div>
      <h4 style="margin-top:16px">Target universe</h4>
      <ul class="mock-ul"><li><span>Estimated target universe</span><b>1.9M · Anchored</b></li><li><span>Online share (adjusted for age &amp; type)</span><b>62% · Measured</b></li><li><span>Assumed IR · conversion</span><b>35% · 14%</b></li></ul></div>
  </div></div>`,
  builder: `<div class="mock" aria-label="Example Survey Builder screen">
  <div class="mock-bar"><i></i><i></i><i></i><span><b class="bar-brand">Research Centric OPS</b> / projects / builder</span></div>
  <div class="mock-body mock-2">
    <div><h4>Survey flow</h4><ol class="mock-flow"><li>S1 · Screener</li><li>Q1 · Category usage</li><li>Q2 · Concept exposure</li><li class="on">Q3 · MaxDiff (designed sets)</li><li>Q4 · Open end</li><li>End · Thank you</li></ol></div>
    <div><div class="mock-tabs"><span class="on">Questions</span><span>Logic</span><span>Quotas</span><span>Preview</span><span>Translations</span></div>
      <h4>Q3 · MaxDiff</h4><p class="mock-q">Which of these matters most, and least, when choosing a supplier?</p>
      <p class="mock-mute">12 attributes · 8 sets · 4 per set</p>
      <div class="mock-cases"><div><small>Est. LOI</small><b>15.2 min</b></div><div><small>Preflight</small><b class="ok">Passed</b></div><div><small>Mobile view</small><b class="ok">Cards</b></div></div></div>
  </div></div>`,
  sample: `<div class="mock" aria-label="Example Sample Collection screen">
  <div class="mock-bar"><i></i><i></i><i></i><span><b class="bar-brand">Research Centric OPS</b> / projects / field monitor</span></div>
  <div class="mock-body">
    <div class="mock-cases four"><div><small>Completes</small><b>148 / 200</b></div><div><small>Incidence, actual</small><b>33%</b></div><div><small>Soft launch</small><b class="ok">Passed</b></div><div><small>Postbacks</small><b class="ok">Healthy</b></div></div>
    <div class="mock-table"><div class="mt-h"><span>Supplier</span><span>Alloc.</span><span>Done</span><span>CPI</span><span>Status</span></div>
      <div><span>Opinion Genie</span><span>100</span><span>84</span><span>$13.90</span><span class="ok">In field</span></div>
      <div><span>Partner A (API)</span><span>60</span><span>47</span><span>$16.20</span><span class="ok">In field</span></div>
      <div><span>Partner B (redirect)</span><span>40</span><span>17</span><span>$17.50</span><span class="warn">Paused</span></div></div>
    <div class="mock-quotas"><div><span>Company size 1000+</span><div class="bar"><i data-w="78"></i></div><b>62/80</b></div><div><span>IT decision makers</span><div class="bar"><i data-w="85"></i></div><b>51/60</b></div><div><span>Finance</span><div class="bar"><i data-w="58"></i></div><b>35/60</b></div></div>
  </div></div>`,
  data: `<div class="mock" aria-label="Example Data Processing & Reporting screen">
  <div class="mock-bar"><i></i><i></i><i></i><span><b class="bar-brand">Research Centric OPS</b> / projects / data</span></div>
  <div class="mock-body">
    <div class="mock-tabs"><span class="on">Cleaning</span><span>Weighting</span><span>Open ends</span><span>Banner tables</span><span>Reports</span></div>
    <div class="mock-2">
      <div><h4>Cleaning rules</h4><div class="mock-cases"><div><small>Responses in</small><b>336</b></div><div><small>Clean completes</small><b class="ok">300</b></div></div>
        <ul class="mock-ul"><li><span>Speeders</span><b>17</b></li><li><span>Straight-liners</span><b>11</b></li><li><span>Poor open ends</span><b>8</b></li><li><span>Duplicates</span><b>0</b></li></ul></div>
      <div><h4>Open-end framework</h4>
        <div class="mock-quotas"><div><span>Security and compliance</span><div class="bar"><i data-w="31"></i></div><b>31%</b></div><div><span>Price and value</span><div class="bar"><i data-w="27"></i></div><b>27%</b></div><div><span>Integration effort</span><div class="bar"><i data-w="22"></i></div><b>22%</b></div><div><span>Support quality</span><div class="bar"><i data-w="20"></i></div><b>20%</b></div></div>
        <p class="mock-mute" style="margin-top:12px">Export: CSV · SPSS · Excel banner book · PowerPoint</p></div>
    </div>
  </div></div>`,
};

// ---------- Page templates ----------
function platformIndex() {
  const body = `${pageHero({ trail: [[null, 'Platform']], eyebrow: 'Research Centric OPS', h1: C.pages.platform.h1, lead: C.pages.platform.lead, ctas: 'demo', stats: [['6', 'Steps on one platform'], [String(methodologyTotal), 'Methodologies, each with a built-in report'], ['44', 'Market profiles in Feasibility']] })}

<section>
  <div class="wrap">
    <div class="sec-head reveal"><span class="eyebrow">The way it works today</span><h2>Six tools. Four teams. <em class="s">Endless</em> hand-offs.</h2><p>The tools are fine. The seams between them are not: every hand-off between them means a file, an email and someone waiting.</p></div>
    <div class="seams reveal">${[['Feasibility & cost', 'A spreadsheet, three supplier emails, and a day of waiting for a bid.'], ['Scripting & hosting', 'A survey platform with its own login, its own question library and its own rules.'], ['Translation', 'Word files out to a vendor, corrected files back, re-scripted by hand.'], ['Sample sourcing', 'Supplier portals, redirect links pasted by hand, quotas tracked in a second sheet.'], ['Data & open ends', 'A raw export, a cleaning script, open ends sent to an outside vendor, weights in a stats package.'], ['Tables & reporting', 'A tab spec, a table book nobody reads, and a deck rebuilt by hand every wave.']].map(([t, d], i) => `<div class="seam"><span>0${i + 1}</span><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>
  </div>
</section>

<section class="dark">
  <div class="wrap">
    <div class="statement reveal"><span class="eyebrow">Research Centric OPS</span><p>One platform runs the <em class="s">whole</em> study.</p><small>The audience priced in Feasibility is the audience built into the survey, translated, fielded in Sample Collection, quality-checked and processed in Data &amp; Reporting.</small></div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="sec-head reveal"><span class="eyebrow">What's in the platform</span><h2>Six steps. <em class="s">One</em> platform.</h2><p>All of it sits in the Research Center, with a shared question library, templates, brand themes, invoicing, single sign-on and role-based access.</p></div>
    <div class="feat-grid reveal">
      ${PLATFORM_SEQ.map((p, i) => `<a class="feat rel" href="${p.url}"><div class="ico">${icon(p.icon)}</div><span class="seq-n">0${i + 1}</span><h3>${p.name}</h3><p>${p.short}</p><span class="more">Explore →</span></a>`).join('')}
    </div>
  </div>
</section>

<section style="background:var(--paper-2)">
  <div class="wrap">
    <div class="sec-head reveal"><span class="eyebrow">Side by side</span><h2>Same jobs. <em class="s">None</em> of the seams.</h2></div>
    <div class="cmp reveal" role="table" aria-label="Typical tools compared with Research Centric OPS">
      <div class="cmp-h" role="row"><span role="columnheader">The job</span><span role="columnheader">Typically done with</span><span role="columnheader">In Research Centric OPS</span></div>
      ${[['Feasibility & price', 'Excel, supplier emails, past jobs', 'CPI, range and confidence per market, in seconds'], ['Survey build', 'A separate scripting platform', '33 question types, logic and preflight checks'], ['Translation', 'Word files out, re-scripted by hand', 'A translation version per language, in the survey'], ['Sample & suppliers', 'Portals, manual redirects, a quota sheet', 'Opinion Genie, API partners and a live quota engine'], ['Data quality', 'Spot checks after fieldwork', 'Seven checks built into every survey link'], ['Cleaning & open ends', 'Stats package plus an open-end vendor', 'Cleaning rules, weighting and open-end quality checks'], ['Tables & reporting', 'Tab spec, table book, hand-built deck', 'Banner tables, built-in reports, PowerPoint export'], ['Billing', 'A finance chase at month end', 'Invoicing with CSV export and usage-based billing']].map(r => `<div role="row"><b role="cell">${r[0]}</b><span role="cell" class="old">${r[1]}</span><span role="cell" class="new">${check}${r[2]}</span></div>`).join('')}
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="sec-head reveal"><span class="eyebrow">Where the margin goes</span><h2>Where your margin <em class="s">leaks</em>.</h2></div>
    <div class="feat-grid reveal cols-4">${[['doc', 'Re-keying the same study', 'The audience is typed into the bid sheet, the supplier portal, the screener and the tab spec: four chances to disagree with yourself.'], ['wallet', 'Quoting from memory', 'A price based on what a similar study cost last year, which nobody can reconstruct three weeks later.'], ['clock', 'Waiting on a bid', 'The client wants a number in the meeting, but the supplier replies tomorrow.'], ['users', 'No single source of truth', 'The only person who knows the project\'s real status is the one who hasn\'t gone on leave yet.']].map(([ic, t, d]) => `<div class="feat"><div class="ico">${icon(ic)}</div><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>
  </div>
</section>

<section class="dark">
  <div class="wrap">
    <div class="sec-head reveal"><span class="eyebrow">Use cases</span><h2>Proof in <em class="s" style="color:var(--accent)">three</em> projects.</h2></div>
    <div class="pain-grid reveal">${useCases.map(([t, s, d, f]) => `<div class="pain"><small style="color:var(--accent)">${s}</small><h3>${t}</h3><p>${d}</p><div class="fix">${f}</div></div>`).join('')}</div>
  </div>
</section>

<section style="background:var(--paper-2)">
  <div class="wrap">
    <div class="sec-head reveal"><span class="eyebrow">Also in the platform</span><h2>Built for the <em class="s">day-to-day</em>.</h2></div>
    <div class="feat-grid reveal">${extras.map(([ic, t, d]) => `<div class="feat"><div class="ico">${icon(ic)}</div><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="sec-head reveal"><span class="eyebrow">Who gets the value</span><h2>One platform. <em class="s">Three</em> ways to win.</h2></div>
    <div class="rel-grid reveal">${['research-agencies', 'brands-insight-teams', 'panel-sample-companies'].map(s => relCard(audUrl(s), audBySlug[s].platform[0], `<b style="color:var(--text)">${audBySlug[s].name}.</b> ${audBySlug[s].platform[1]}`, 'See how')).join('')}</div>
  </div>
</section>

<section style="background:var(--paper-2)">
  <div class="wrap">
    <div class="sec-head reveal"><span class="eyebrow">What happens next</span><h2>Decide on <em class="s">evidence</em>, not slides.</h2></div>
    <div class="steps reveal">
      <div class="step"><span class="num">01</span><span class="when">This week</span><h3>Working session</h3><p>We price one of your real briefs live in Feasibility, so you can compare it with the number you expected.</p></div>
      <div class="step"><span class="num">02</span><span class="when">Then</span><h3>Pilot on one project</h3><p>A single live study, end to end, with your team in the platform.</p></div>
      <div class="step"><span class="num">03</span><span class="when">After that</span><h3>Decide on the evidence</h3><p>Compare the pilot with what the same project cost you the last time you ran it.</p></div>
    </div>
  </div>
</section>
${read('src/api-section.html')}
${contactSection().replace('<option>Platform demo</option>', '<option selected>Platform demo</option>')}`;
  return layout({ url: '/platform/', title: 'Research Centric OPS platform', description: 'Feasibility and costing, survey building, translation, sample collection, data quality checks and data processing, all on one platform.', body });
}

function modulePage(m) {
  const body = `${pageHero({ trail: [['/platform/', 'Platform'], [null, m.name]], eyebrow: `Platform · ${m.step}`, h1: m.h1, lead: m.lead, ctas: 'demo' })}

<section style="padding-top:64px">
  <div class="wrap">
    ${todayHere(m.today, m.here)}
    ${m.mock ? `<div class="reveal" style="margin-top:40px">${MOCKS[m.mock]}<p class="mock-note">Illustrative screen with example figures.</p></div>` : ''}
  </div>
</section>

<section style="background:var(--paper-2)">
  <div class="wrap">
    <div class="sec-head reveal"><span class="eyebrow">Capabilities</span><h2>${m.name}, <em class="s">feature by feature</em>.</h2></div>
    <div class="feat-grid reveal">${m.features.map(([ic, t, d]) => `<div class="feat"><div class="ico">${icon(ic)}</div><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>
  </div>
</section>

${m.universe ? `<section class="dark">
  <div class="wrap split">
    <div class="reveal"><span class="eyebrow">Know the market before you promise</span><h2>See the market <em class="s" style="color:var(--accent)">before</em> you sell it.</h2><p class="lead2">For every market you see the estimated target universe (the people who match the audience) and how many of them are online, adjusted for the audience's age and type. Each figure carries a label, so you know how firm it is.</p>
      <div class="bands" style="margin-top:28px">${[['Measured', 'Highest confidence'], ['Anchored', 'Built on a firm reference'], ['Indicative', 'A directional estimate'], ['Very Low → Very High', 'Feasibility confidence band']].map(([n, d]) => `<div><b>${n}</b><span>${d}</span></div>`).join('')}</div></div>
    <div class="reveal"><h4 style="margin-bottom:14px;font-size:13px;letter-spacing:.14em;text-transform:uppercase;font-family:var(--sans);color:var(--on-dark-muted)">Geography within a market</h4>
      <div class="factors" style="margin-top:0">${[['Zones & regions', 'Target part of a country.'], ['States & provinces', 'Down to state level.'], ['Metros, cities & city tiers', 'Urban or tier-based targeting.'], ['Counties & districts', 'Local-level targeting.'], ['Postal, ZIP & PIN codes', 'Paste a list of codes.'], ['Quote to study', 'Create the study from the quote.']].map(([t, d]) => `<div><b>${t}</b><span>${d}</span></div>`).join('')}</div>
      <h4 style="margin:26px 0 14px;font-size:13px;letter-spacing:.14em;text-transform:uppercase;font-family:var(--sans);color:var(--on-dark-muted)">70 audience types in 8 categories</h4>
      <div class="chips">${['B2C', 'B2B', 'Business Functions', 'Healthcare Professionals', 'Patients', 'Education', 'Government', 'Specialized'].map(c => `<span class="chip" style="background:transparent;color:var(--on-dark);border-color:var(--line-dark)">${c}</span>`).join('')}</div></div>
  </div>
</section>` : ''}

${m.groups ? `<section>
  <div class="wrap">
    <div class="sec-head reveal"><span class="eyebrow">33 question types</span><h2>33 question types. <em class="s">No</em> workarounds.</h2></div>
    <div class="meth reveal">${m.groups.map(([g, list]) => `<div class="meth-col"><h3>${g} <span style="color:var(--muted);font-weight:500">· ${list.length}</span></h3><ul>${list.map(x => `<li>${check}${x}</li>`).join('')}</ul></div>`).join('')}</div>
  </div>
</section>
<section class="dark">
  <div class="wrap split">
    <div class="reveal"><span class="eyebrow">AI assistant · Sigma plan</span><h2>Brief in. <em class="s" style="color:var(--accent)">Draft</em> out.</h2><p class="lead2">Available on the Sigma plan and paid for with AI credits. AI suggestions are advisory: the rule-based preflight checks decide whether a survey can publish.</p></div>
    <ol class="tl reveal">${m.ai.map(([t, d]) => `<li><div><h4>${t}</h4><p>${d}</p></div></li>`).join('')}</ol>
  </div>
</section>` : ''}

${m.extras ? `<section>
  <div class="wrap">
    <div class="sec-head reveal"><span class="eyebrow">For bigger programmes</span><h2>Built for trackers and <em class="s">multi-market</em> work.</h2></div>
    <div class="feat-grid reveal cols-4">${m.extras.map(([t, d]) => `<div class="feat"><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>
  </div>
</section>` : ''}

<section${m.extras || m.groups ? ' style="background:var(--paper-2)"' : ''}>
  <div class="wrap">
    <div class="sec-head reveal"><span class="eyebrow">One platform</span><h2>One platform, <em class="s">end to end</em>.</h2></div>
    <div class="rel-grid reveal cols-3">${PLATFORM_SEQ.map(p => p.url === modUrl(m.slug) ? relCard(p.url, p.name, p.short, 'You are here').replace('class="rel"', 'class="rel is-current" aria-current="page"').replace('You are here →', 'You are here') : relCard(p.url, p.name, p.short, 'Explore')).join('')}</div>
  </div>
</section>
${contactSection().replace('<option>Platform demo</option>', '<option selected>Platform demo</option>')}`;
  return layout({ url: modUrl(m.slug), title: `${m.name} | Research Centric OPS`, description: strip(m.lead), body });
}

function methodologiesPage() {
  const body = `${pageHero({ trail: [['/platform/', 'Platform'], [null, 'Methodologies']], eyebrow: 'Methodologies built in', h1: C.pages.methodologies.h1, lead: C.pages.methodologies.lead, ctas: 'demo' })}
<section>
  <div class="wrap">
    <div class="meth reveal cols-3">${methodologies.map(([g, list]) => `<div class="meth-col"><h3>${g} <span style="color:var(--muted);font-weight:500">· ${list.length}</span></h3><ul>${list.map(x => `<li>${check}${x}</li>`).join('')}</ul></div>`).join('')}</div>
    <p class="note reveal" style="margin-top:36px">The full catalogue of ${methodologyTotal} is in the app; the groups above show the main designs. NPS is available as a question type in the Survey Builder. Which methodologies you get depends on your plan. <a href="/pricing/#compare" style="color:var(--accent-ink);font-weight:600">Compare plans →</a></p>
  </div>
</section>
${contactFor('Platform demo')}`;
  return layout({ url: '/platform/methodologies/', title: 'Research methodologies', description: `${methodologyTotal} methodologies with built-in reports: Van Westendorp, Gabor-Granger, CBC conjoint, MaxDiff, TURF, Kano, concept and A/B tests, card sorting, tree testing, first click, heatmaps and more.`, body });
}

function securityPage() {
  const body = `${pageHero({ trail: [['/platform/', 'Platform'], [null, 'Data quality checks']], eyebrow: 'Data quality checks & security', h1: C.pages.security.h1, lead: C.pages.security.lead, ctas: 'demo' })}
<section>
  <div class="wrap">
    <div class="sec-head reveal"><span class="eyebrow">Built into every survey link</span><h2>Seven checks. <em class="s">Every</em> response.</h2></div>
    <ol class="tl reveal" style="max-width:860px">${qualityChecks.map(([t, d]) => `<li><div><h4>${t}</h4><p>${d}</p></div></li>`).join('')}</ol>
  </div>
</section>
<section class="dark">
  <div class="wrap split">
    <div class="reveal"><span class="eyebrow">Cleaning</span><h2>Every removal, <em class="s" style="color:var(--accent)">on record</em>.</h2><p class="lead2">Cleaning rules cover speeders, straight-liners, duplicates, partials, poor open ends and attention checks, and you can add custom rules. Removed completes are tracked.</p></div>
    <ul class="checks reveal" style="color:var(--on-dark)">${['Consent and lawful-basis screen whenever a project collects personal data', 'Designed for GDPR and CCPA', 'Data-subject requests handled on request', 'Previous respondents can be excluded across a project'].map(t => `<li>${check}<span>${t}</span></li>`).join('')}</ul>
  </div>
</section>
<section style="background:var(--paper-2)">
  <div class="wrap">
    <div class="sec-head reveal"><span class="eyebrow">Account security</span><h2>Your accounts, <em class="s">locked down</em>.</h2></div>
    <div class="feat-grid reveal cols-4">${security.map(([ic, t, d]) => `<div class="feat"><div class="ico">${icon(ic)}</div><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>
  </div>
</section>
${faqBlock(C.pages.security.faqs)}
${contactSection().replace('<option>Platform demo</option>', '<option selected>Platform demo</option>')}`;
  return layout({ url: '/platform/security/', title: 'Data quality checks & security', description: 'Geo-IP, proxy/VPN, fingerprinting, human-verification and quality-score checks on every survey link, plus 2FA, SSO (OpenID Connect), role-based access and an audit log.', body });
}

function pricingPage() {
  const cell = v => v === true ? `<span class="yes" aria-label="Included">${check}</span>` : v === false ? '<span class="no" aria-label="Not included">–</span>' : v === 'R' ? '<span class="add">On request</span>' : `<span>${v}</span>`;
  const body = `${pageHero({ trail: [[null, 'Pricing']], eyebrow: 'Plans & pricing', h1: C.pages.pricing.h1, lead: C.pages.pricing.lead, ctas: false, slim: true })}

<section style="padding-top:64px">
  <div class="wrap">
    <div class="plans reveal">${plans.map(p => `<div class="plan${p.popular ? ' pop' : ''}">${p.popular ? '<span class="plan-tag">Most popular</span>' : ''}<h3>${p.name}</h3><p class="plan-sub">${p.tag}</p><div class="plan-price">${p.name === 'Custom' ? 'Built to order' : 'Talk to sales'}</div><ul>${p.items.map(i => i.endsWith('plus:') ? `<li class="plan-plus">${i}</li>` : `<li>${check}${i}</li>`).join('')}</ul><a class="btn ${p.popular ? 'btn-primary' : 'btn-line'}" href="/contact/?need=Platform%20plans" style="justify-content:center">${p.name === 'Custom' ? 'Build my plan' : `Get ${p.name} pricing`}</a></div>`).join('')}</div>
    <p class="plan-foot reveal">AI features use AI credits · Already a customer? <a href="${DIY_URL}" style="color:var(--accent-ink);font-weight:600">Sign in to Research Centric OPS</a></p>
  </div>
</section>

<section id="compare" style="background:var(--paper-2)">
  <div class="wrap">
    <div class="sec-head reveal"><span class="eyebrow">Compare every plan</span><h2>Every plan, <em class="s">side by side</em>.</h2></div>
    <p class="swipe-hint">Swipe to compare all plans →</p>
    <div class="ctable reveal" role="table" aria-label="Plan comparison">
      <div class="ct-row ct-head" role="row"><span role="columnheader">Feature</span>${plans.map(p => `<span role="columnheader">${p.name}</span>`).join('')}</div>
      ${compare.map(([g, rows]) => `<div class="ct-group" role="row"><span role="cell">${g}</span></div>${rows.map(r => `<div class="ct-row" role="row"><span role="cell">${r[0]}</span>${r.slice(1).map(v => `<span role="cell">${cell(v)}</span>`).join('')}</div>`).join('')}`).join('')}
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="sec-head reveal"><span class="eyebrow">Included in the platform</span><h2>Included. <em class="s">Not</em> upsold.</h2></div>
    <div class="feat-grid reveal">${extras.map(([ic, t, d]) => `<div class="feat"><div class="ico">${icon(ic)}</div><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>
  </div>
</section>

<section class="dark">
  <div class="wrap split">
    <div class="reveal"><span class="eyebrow">Fieldwork</span><h2>Need sample? We <em class="s" style="color:var(--accent)">quote</em> it per project.</h2><p class="lead2">Fieldwork is priced on a cost-per-complete basis and quoted separately from the platform. Get an indicative CPI in seconds, or send us the brief for a firm quote.</p><div class="hero-ctas"><a class="btn btn-primary" href="/#estimator">Open the CPI estimator ${arrow}</a><a class="btn btn-ghost" href="/solutions/">Managed services</a></div></div>
    <div class="reveal"><div class="bands">${[['44', 'Market profiles'], ['70', 'Audience types in 8 categories'], ['90', 'Targeting questions'], ['Opinion Genie', 'Our own panel, plus API-integrated partners']].map(([n, d]) => `<div><b>${n}</b><span>${d}</span></div>`).join('')}</div></div>
  </div>
</section>

<section style="background:var(--paper-2)">
  <div class="wrap">
    <div class="sec-head reveal"><span class="eyebrow">Where the money comes from</span><h2>Four savings. Only <em class="s">one</em> is a licence.</h2></div>
    <div class="feat-grid reveal cols-4">${[['Vendor fees', 'Open-end vendors, tabulation bureau and translation management.'], ['Licence consolidation', 'Scripting platform, stats package and panel integrations.'], ['Operations hours', 'No more re-keying the same study into four systems or chasing status.'], ['Bids won', 'You stop losing opportunities because the quote arrived the next day.']].map(([t, d]) => `<div class="feat"><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>
    <div class="note reveal" style="margin-top:28px"><b>The honest version:</b> the licence saving is the smallest of the four. Operations hours are the largest, and the hardest to see on an invoice. We don't quote industry-average percentages. In a working session, we fill in the numbers from your own last four projects.</div>
  </div>
</section>
${faqBlock(C.pages.pricing.faqs)}
${contactSection().replace('<option>Platform plans</option>', '<option selected>Platform plans</option>')}`;
  return layout({ url: '/pricing/', title: 'Pricing & plans', description: 'Compare Research Centric OPS plans (Alpha, Beta, Gamma, Sigma and Custom): modules, methodologies, exports, AI credits and seats.', body });
}


// Secondary hero button per service (CPI only where fieldwork is priced)
const SERVICE_ALT = {
  'questionnaire-design': ['/contact/?need=Full-service%20study', 'Get a questionnaire audit'],
  'survey-programming': ['/platform/survey-builder/', 'See it in the platform'],
  'translations': ['/platform/translation/', 'See it in the platform'],
  'data-processing': ['/platform/data-reporting/', 'See it in the platform'],
  'insights-reporting': ['/contact/?need=Full-service%20study', 'Request a sample report'],
  'workflow-automation': ['/workflow-hub.html', 'Try the live demo'],
};
const AUD_TYPE = { 'research-agencies': 'Research agency', 'brands-insight-teams': 'Brand / insight team', 'startups': 'Startup', 'advertising-media': 'Advertising / media', 'panel-sample-companies': 'Panel / sample company' };
// The quote form with the right "I need" option and "I am a…" chip preselected
const contactFor = (need, type) => {
  let html = contactSection();
  if (need) html = html.replace(`<option>${need}</option>`, `<option selected>${need}</option>`);
  if (type) html = html.replace(' checked>', '>').replace(`value="${type}">`, `value="${type}" checked>`);
  return html;
};

function solutionPage(s) {
  const isAddon = s === automation;
  const need = isAddon ? 'Workflow automation' : s.slug === 'online-sampling' ? 'Sample only' : 'Full-service study';
  const aud = (s.audiences || []).map(a => audBySlug[a]);
  const body = `${pageHero({ trail: [['/solutions/', 'Services'], [null, s.name]], eyebrow: isAddon ? 'Enterprise add-on' : 'Managed services', h1: s.h1, lead: s.lead, stats: s.stats, need, ...(SERVICE_ALT[s.slug] ? { alt: SERVICE_ALT[s.slug] } : {}) })}
${isAddon ? `<section style="padding:48px 0 0"><div class="wrap"><a class="demo-cta reveal" href="/workflow-hub.html"><span><small>Interactive demo</small><b>Explore the workflow automation suites and launch the live dashboard simulator</b></span>${arrow}</a></div></section>` : ''}

<section>
  <div class="wrap">
    <div class="sec-head reveal"><span class="eyebrow">What you get</span><h2>${s.featuresTitle}</h2></div>
    <div class="feat-grid reveal">${s.features.map(([ic, t, d]) => `<div class="feat"><div class="ico">${icon(ic)}</div><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>
  </div>
</section>

<section class="dark">
  <div class="wrap split">
    <div class="sticky reveal">
      <span class="eyebrow">How it works</span>
      <h2>${s.stepsTitle.replace('<em>', '<em class="s" style="color:var(--accent)">')}</h2>
      <p class="lead2">Every project has a named project manager, sign-off points and live status updates.</p>
      <h4 style="margin:32px 0 14px;font-size:13px;letter-spacing:.14em;text-transform:uppercase;font-family:var(--sans);color:var(--on-dark-muted)">Deliverables</h4>
      <div class="chips">${s.deliverables.map(d => `<span class="chip" style="background:transparent;color:var(--on-dark);border-color:var(--line-dark)">${d}</span>`).join('')}</div>
    </div>
    <ol class="tl reveal">${s.steps.map(([t, d]) => `<li><div><h4>${t}</h4><p>${d}</p></div></li>`).join('')}</ol>
  </div>
</section>

${aud.length ? `<section style="background:var(--paper-2)">
  <div class="wrap">
    <div class="sec-head reveal"><span class="eyebrow">Who uses it</span><h2>Who it's <em class="s">built</em> for.</h2></div>
    <div class="rel-grid reveal cols-${Math.min(aud.length, 4)}">${aud.map(a => relCard(audUrl(a.slug), a.name, a.short, 'See how we help')).join('')}</div>
  </div>
</section>` : ''}

${faqBlock(s.faqs)}

<section style="background:var(--paper-2);padding-top:88px">
  <div class="wrap">
    <div class="sec-head reveal"><span class="eyebrow">Related</span><h2>Pairs <em class="s">well</em> with.</h2></div>
    <div class="rel-grid reveal">${[...s.related].sort((x, y) => (SERVICE_ORDER(x) < 0 ? 99 : SERVICE_ORDER(x)) - (SERVICE_ORDER(y) < 0 ? 99 : SERVICE_ORDER(y))).map(r => relCard(solUrl(r), bySlug[r].name, bySlug[r].short)).join('')}</div>
  </div>
</section>

${contactSection().replace(`<option>${need}</option>`, `<option selected>${need}</option>`)}
${faqSchema(s.faqs)}`;
  return layout({ url: solUrl(s.slug), title: strip(s.name), description: strip(s.lead), body });
}

function solutionsIndex() {
  const body = `${pageHero({ trail: [[null, 'Services']], eyebrow: 'Managed research services', h1: C.pages.solutions.h1, lead: C.pages.solutions.lead })}
<section>
  <div class="wrap">
    <div class="sec-head reveal"><span class="eyebrow">Research services</span><h2>From brief to <em class="s">boardroom</em>.</h2></div>
    <div class="feat-grid svc-grid reveal">${services.map(s => `<a class="feat rel" href="${solUrl(s.slug)}"><div class="ico">${icon(s.icon)}</div><h3>${s.name}</h3><p>${s.short}</p><span class="more">Learn more →</span></a>`).join('')}</div>
    <a class="demo-cta reveal" href="/platform/" style="margin-top:28px"><span><small>Prefer to run it yourself?</small><b>The same capabilities are available as a platform: Research Centric OPS</b></span>${arrow}</a>
  </div>
</section>
<section class="dark">
  <div class="wrap split">
    <div class="reveal"><span class="eyebrow">Enterprise add-on</span><h2>${automation.h1}</h2><p class="lead2">${automation.lead}</p><div class="hero-ctas"><a class="btn btn-primary" href="${solUrl(automation.slug)}">Explore workflow automation ${arrow}</a><a class="btn btn-ghost" href="/workflow-hub.html">Open the demo</a></div></div>
    <ul class="checks reveal" style="color:var(--on-dark)">${automation.features.map(([, t, d]) => `<li>${check}<span><b style="color:#fff">${t}.</b> <span style="color:var(--on-dark-muted)">${d}</span></span></li>`).join('')}</ul>
  </div>
</section>
${contactSection()}`;
  return layout({ url: '/solutions/', title: 'Managed research services', description: 'Questionnaire design, survey programming, translations, online sampling with built-in quality checks, data processing, insight reporting, project management and enterprise workflow automation.', body });
}

function audiencePage(a) {
  const others = audiences.filter(x => x !== a);
  const need = a.slug === 'research-agencies' ? 'Sample only' : a.slug === 'panel-sample-companies' ? 'Supply partnership' : 'Full-service study';
  const supplier = a.slug === 'panel-sample-companies';
  const body = `${pageHero({ trail: [['/who-we-serve/', 'Who we serve'], [null, a.name]], eyebrow: `For ${a.name.toLowerCase()}`, h1: a.h1, lead: a.lead, stats: a.stats, need, ...(supplier ? { primary: 'Become a supply partner', alt: ['/platform/sample-collection/', 'See the integration'] } : {}) })}

<section class="dark" style="padding-top:24px">
  <div class="wrap">
    <div class="sec-head reveal"><span class="eyebrow">What gets in the way</span><h2>What we <em class="s" style="color:var(--accent)">fix</em>.</h2></div>
    <div class="pain-grid reveal">${a.pains.map(([t, d, f]) => `<div class="pain"><small>The problem</small><h3>${t}</h3><p>${d}</p><div class="fix">${f}</div></div>`).join('')}</div>
  </div>
</section>

${a.platform ? `<section style="padding-bottom:0">
  <div class="wrap"><a class="demo-cta reveal" href="/platform/"><span><small>On the platform · ${a.platform[0]}</small><b>${a.platform[1]}</b></span>${arrow}</a></div>
</section>` : ''}

<section>
  <div class="wrap split">
    <div class="sticky reveal">
      <span class="eyebrow">Typical projects</span>
      <h2>What ${a.name.toLowerCase()} use us for</h2>
      <div class="chips lg" style="margin-top:24px">${a.studies.map(s => `<span class="chip">${s}</span>`).join('')}</div>
      ${a.quote ? `<div class="quote-mini" style="margin-top:36px">“${a.quote[0]}”<small>${a.quote[1]}</small></div>` : `<div class="promise" style="margin-top:36px"><small>Our promise</small>${a.promise}</div>`}
    </div>
    <div class="reveal">
      <span class="eyebrow">Recommended services</span>
      <div style="display:grid;gap:16px;margin-top:22px">${[...a.services].sort((x, y) => SERVICE_ORDER(x) - SERVICE_ORDER(y)).map(sl => { const s = bySlug[sl]; return `<a class="rel" href="${solUrl(sl)}" style="flex-direction:row;gap:20px;align-items:flex-start"><div class="ico" style="flex:none;margin:0">${icon(s.icon)}</div><div><h3>${s.name}</h3><p style="margin:0">${s.short}</p></div></a>`; }).join('')}</div>
    </div>
  </div>
</section>

<section style="background:var(--paper-2)">
  <div class="wrap">
    <div class="sec-head reveal"><span class="eyebrow">How it works</span><h2>${a.stepsTitle.replace('<em>', '<em class="s">')}</h2></div>
    <div class="steps reveal">${a.steps.map(([when, t, d], i) => `<div class="step"><span class="num">0${i + 1}</span><span class="when">${when}</span><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>
  </div>
</section>

${faqBlock(a.faqs)}

<section style="background:var(--paper-2);padding-top:88px">
  <div class="wrap">
    <div class="sec-head reveal"><span class="eyebrow">Also serving</span><h2>Other teams we <em class="s">work</em> with.</h2></div>
    <div class="rel-grid reveal cols-4">${others.map(o => relCard(audUrl(o.slug), o.name, o.short, 'See how we help')).join('')}</div>
  </div>
</section>

${contactFor(need, AUD_TYPE[a.slug])}
${faqSchema(a.faqs)}`;
  return layout({ url: audUrl(a.slug), title: `For ${a.name}`, description: strip(a.lead), body });
}

function audiencesIndex() {
  const body = `${pageHero({ trail: [[null, 'Who we serve']], eyebrow: 'Who we serve', h1: C.pages.whoWeServe.h1, lead: C.pages.whoWeServe.lead })}
<section>
  <div class="wrap">
    <div class="rel-grid reveal cols-2">${audiences.map(a => `<a class="rel" href="${audUrl(a.slug)}" style="padding:36px"><span class="eyebrow" style="margin-bottom:14px">For ${a.name.toLowerCase()}</span><h3 style="font-size:26px">${strip(a.h1)}</h3><p>${strip(a.lead).split('. ')[0]}.</p><div class="chips" style="margin-bottom:20px">${a.studies.slice(0, 3).map(s => `<span class="chip">${s}</span>`).join('')}</div><span class="more">See how we help →</span></a>`).join('')}</div>
  </div>
</section>
<section id="industries" style="background:var(--paper-2)">
  <div class="wrap">
    <div class="sec-head reveal"><span class="eyebrow">Industries</span><h2>Fluent in <em class="s">your</em> category.</h2></div>
    <div class="ind reveal">${['Technology & SaaS', 'Healthcare & Pharma', 'Financial Services', 'Automotive', 'Retail & CPG', 'Telecom & Mobile', 'Advertising & Media', 'Entertainment & Gaming', 'Travel & Hospitality', 'Energy & CleanTech', 'Manufacturing', 'Real Estate', 'Education', 'Legal & Professional Services', 'Market Research'].map(i => `<span>${i}</span>`).join('')}</div>
  </div>
</section>
${contactSection()}`;
  return layout({ url: '/who-we-serve/', title: 'Who we serve', description: 'Research COPS works with market research agencies, brands and insight teams, startups, advertising and media agencies, and panel and sample companies.', body });
}

function aboutPage() {
  const body = `${pageHero({ trail: [[null, 'About']], eyebrow: 'About Research COPS', h1: C.pages.about.h1, lead: C.pages.about.lead, stats: [['44', 'Market profiles'], [String(methodologyTotal), 'Methodologies in the platform'], ['70', 'Audience types in 8 categories']], ctas: false })}

<section>
  <div class="wrap split">
    <div class="sticky reveal">
      <span class="eyebrow">Our story</span>
      <h2>Built by researchers who were tired of the <em class="s">seams</em>.</h2>
    </div>
    <div class="reveal prose" style="max-width:none">
      ${C.pages.about.story.map(p => `<p>${p}</p>`).join('\n      ')}
      <div class="note" style="margin-top:28px">${C.pages.about.note}</div>
    </div>
  </div>
</section>

<section style="background:var(--paper-2)">
  <div class="wrap">
    <div class="sec-head reveal"><span class="eyebrow">What we stand for</span><h2>Four promises. <em class="s">Every</em> project.</h2></div>
    <div class="values reveal">
      ${C.pages.about.values.map(([ic, t, d]) => `<div class="feat"><div class="ico">${icon(ic)}</div><h3>${t}</h3><p>${d}</p></div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="dark">
  <div class="wrap">
    <div class="sec-head reveal"><span class="eyebrow">By the numbers</span><h2>Numbers that <em class="s" style="color:var(--accent)">hold up</em>.</h2></div>
    <div class="stats" style="background:transparent;border:1px solid var(--line-dark);border-radius:18px">
      <div class="wrap" style="padding:0">
        <div class="stat"><strong>44</strong><p>Market profiles in Feasibility &amp; Costing</p></div>
        <div class="stat"><strong>70</strong><p>Audience types in 8 categories</p></div>
        <div class="stat"><strong>${methodologyTotal}</strong><p>Methodologies, each with a built-in report</p></div>
        <div class="stat"><strong>6</strong><p>Workflow steps on one platform</p></div>
      </div>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="sec-head reveal"><span class="eyebrow">Visit us</span><h2>Our office</h2></div>
    <div class="office reveal">
      <div class="map" aria-hidden="true"><svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#04cbc2" stroke-width="1"><path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg></div>
      <div class="info">
        <h3>Greater Noida, India</h3>
        <p>${CO.addressLine1},<br>${CO.addressLine2}</p>
        <p><a href="tel:${CO.phoneTel}" style="color:var(--accent-ink);font-weight:600">${CO.phone}</a></p>
        <p><a href="mailto:${CO.emailInfo}" style="color:var(--accent-ink);font-weight:600">${CO.emailInfo}</a></p>
        <a class="btn btn-dark" style="margin-top:8px" href="${attr(CO.mapsUrl)}" rel="noopener" target="_blank">Open in Google Maps ${arrow}</a>
      </div>
    </div>
  </div>
</section>
${contactSection()}`;
  return layout({ url: '/about/', title: 'About us', description: 'Research COPS (Research Centric Ops) is a market research operations company in Greater Noida, India, and the team behind the Research Centric OPS platform. We serve clients in 44 countries.', body });
}

function contactPage() {
  const body = `${pageHero({ trail: [[null, 'Contact']], eyebrow: 'Contact', h1: C.pages.contact.h1, lead: C.pages.contact.lead, ctas: false, slim: true })}
${contactSection().replace('<section id="contact" class="dark">', '<section id="contact" class="dark" style="padding-top:24px">')}`;
  return layout({ url: '/contact/', title: 'Contact, quote & demo', description: 'Request a quote, platform demo, feasibility check or panel book from Research COPS. Email info-team@researchcops.com or call +91 0120 605 1391.', body });
}

function homePage() {
  const hero = C.home.hero, w = t => `<span class="w" aria-hidden="true">${t}</span>`;
  const words = s => s.trim().split(/\s+/);
  const h1 = `<h1 class="hero-h1" aria-label="${attr(strip(`${hero.line1} ${hero.line2} ${hero.typed}.`))}">${words(hero.line1).map((t, i) => i ? w(t) : w(t).replace('class="w"', 'class="w best"')).join(' ')}<br class="hb"> ${words(hero.line2).map(w).join(' ')} ${w(`<em class="s shine" id="heroWord">${hero.typed}</em><span class="caret"></span>.`)}</h1>`;
  const [top, bottom] = read('src/home.html').replace('{{BAND}}', '').split('{{CONTACT}}');
  const body = fillTokens(top.replace('{{HERO_H1}}', h1), { home: C.home }) + contactSection() + fillTokens(bottom, { home: C.home }) + orgSchema;
  return layout({ url: '/', title: 'Research COPS | Best Operating System for Your Research', description: 'One platform and one team for every step of a research project: feasibility and costing, survey building, translation, verified B2B, healthcare and consumer sample in 44 markets, data quality checks and data processing.', body });
}

function notFound() {
  const body = `${pageHero({ trail: [[null, 'Not found']], eyebrow: '404', h1: 'This page is <em class="s">out of field</em>.', lead: 'The page you were looking for has moved or no longer exists.', ctas: false })}
<section><div class="wrap"><div class="rel-grid">${relCard('/', 'Homepage', 'Start from the top.')}${relCard('/platform/', 'Platform', 'Research Centric OPS.')}${relCard('/contact/', 'Contact', 'Talk to our team.')}</div></div></section>`;
  return layout({ url: '/404.html', title: 'Page not found', description: 'Page not found.', body });
}

// Old solution.html?id=… links → new service pages (Vercel redirects do this server-side; this covers local + stale caches)
const LEGACY_SOLUTION_MAP = { management: 'end-to-end-project-management', sampling: 'online-sampling', development: 'questionnaire-design', translations: 'translations', processing: 'data-processing', consulting: 'insights-reporting', automation: 'workflow-automation', 'workflow-hub': 'workflow-automation' };
const solutionRedirect = () => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Redirecting… · Research COPS</title><meta name="robots" content="noindex">
<link rel="canonical" href="${SITE_URL}/solutions/">
<script>(function(){var m=${JSON.stringify(LEGACY_SOLUTION_MAP)};var id=new URLSearchParams(location.search).get('id')||'sampling';location.replace('/solutions/'+(m[id]||'online-sampling')+'/');})();</script>
</head><body><p>Redirecting to <a href="/solutions/">our services</a>…</p></body></html>
`;

const vercelJson = () => JSON.stringify({
  cleanUrls: false,
  trailingSlash: true,
  redirects: [
    ...Object.entries(LEGACY_SOLUTION_MAP).map(([id, slug]) => ({ source: '/solution.html', has: [{ type: 'query', key: 'id', value: id }], destination: `/solutions/${slug}/`, permanent: true })),
    { source: '/solution.html', destination: '/solutions/online-sampling/', permanent: true },
    { source: '/privacy', destination: '/policy.html?id=privacy', permanent: true },
    { source: '/terms', destination: '/policy.html?id=terms', permanent: true },
    { source: '/cookies', destination: '/policy.html?id=cookies', permanent: true },
    { source: '/insights', destination: '/insights.html', permanent: true },
  ],
}, null, 2) + '\n';

// ---------- Write ----------
const legacyInsights = () => legacyLayout({ url: '/insights.html', title: 'Insights', description: 'Research methods, B2B sampling, data quality and industry news from Research COPS.', main: read('src/legacy/insights-main.html'), script: 'insights.js' });
const legacyPolicy = () => legacyLayout({ url: '/policy.html', title: 'Legal & policies', description: 'Research COPS privacy policy, terms and conditions, and cookie policy.', styles: read('src/legacy/policy-head.html'), main: read('src/legacy/policy-main.html'), script: 'policy.js' });

const pages = [
  ['index.html', homePage()],
  ['404.html', notFound()],
  ['platform/index.html', platformIndex()],
  ...modules.map(m => [`platform/${m.slug}/index.html`, modulePage(m)]),
  ['platform/methodologies/index.html', methodologiesPage()],
  ['platform/security/index.html', securityPage()],
  ['pricing/index.html', pricingPage()],
  ['solutions/index.html', solutionsIndex()],
  ...allSolutions.map(s => [`solutions/${s.slug}/index.html`, solutionPage(s)]),
  ['who-we-serve/index.html', audiencesIndex()],
  ...audiences.map(a => [`who-we-serve/${a.slug}/index.html`, audiencePage(a)]),
  ['about/index.html', aboutPage()],
  ['contact/index.html', contactPage()],
  ['insights.html', legacyInsights()],
  ['policy.html', legacyPolicy()],
  ['solution.html', solutionRedirect()],
];

for (const [file, html] of pages) {
  const dest = path.join(ROOT, file);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, html);
}
const urls = pages.map(([f]) => f).filter(f => !['404.html', 'solution.html'].includes(f)).map(f => SITE_URL + '/' + f.replace(/index\.html$/, ''));
urls.push(SITE_URL + '/workflow-hub.html');
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${u}</loc></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin.html\nDisallow: /content-admin.html\nSitemap: ${SITE_URL}/sitemap.xml\n`);
fs.writeFileSync(path.join(ROOT, 'vercel.json'), vercelJson());
// workflow-hub.html is hand-maintained (it carries the demo simulator), so only its shared
// header, footer and scripts are refreshed here, between the rc:header / rc:footer / rc:tail markers.
const WH = path.join(ROOT, 'workflow-hub.html');
if (fs.existsSync(WH)) {
  const fill = (html, key, inner) => html.replace(new RegExp(`<!-- rc:${key} -->[\\s\\S]*?<!-- /rc:${key} -->`), () => `<!-- rc:${key} -->\n${inner}\n<!-- /rc:${key} -->`);
  let wh = fs.readFileSync(WH, 'utf8');
  wh = fill(fill(fill(wh, 'header', header('/solutions/workflow-automation/')), 'footer', footer()), 'tail', tail());
  fs.writeFileSync(WH, wh);
}
console.log(`Built ${pages.length} pages`);
