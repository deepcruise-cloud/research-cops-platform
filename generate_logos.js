const fs = require('fs');
const path = require('path');

// Define directory paths
const baseDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\scratch\\company-website';
const outputDir = path.join(baseDir, 'logos');

const rcOutputDir = path.join(outputDir, 'research_cops');
const diOutputDir = path.join(outputDir, 'deepsight_insights');

// Ensure directories exist
[
  outputDir,
  rcOutputDir,
  path.join(rcOutputDir, 'svg'),
  path.join(rcOutputDir, 'png'),
  path.join(rcOutputDir, 'jpeg'),
  diOutputDir,
  path.join(diOutputDir, 'svg'),
  path.join(diOutputDir, 'png'),
  path.join(diOutputDir, 'jpeg')
].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

console.log('Directories initialized.');

// 1. Read the base files
const rcBaseSvg = fs.readFileSync(path.join(baseDir, 'logo_brand.svg'), 'utf8');
const diBaseSvg = fs.readFileSync(path.join(baseDir, 'design-logo-colored.svg'), 'utf8');

// Extract inner content from Research COPS SVG
// logo_brand.svg is:
// <svg ...> ... </svg>
// We can extract the inner contents of <svg> using regex or simple slice.
function getSvgInner(svgContent) {
  const start = svgContent.indexOf('>') + 1;
  const end = svgContent.lastIndexOf('</svg>');
  return svgContent.substring(start, end).trim();
}

const rcInner = getSvgInner(rcBaseSvg);
const diInner = getSvgInner(diBaseSvg);

// Define styles/fonts for text rendering inside SVGs
// Wordmark + tagline use Michroma (Google Fonts, SIL OFL), loaded via the @import below.
const fontDefs = `
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&amp;family=Space+Grotesk:wght@500;700&amp;family=Michroma&amp;display=swap');
      .brand-text-cops {
        font-family: 'Michroma', 'Space Grotesk', sans-serif;
        font-weight: 400;
        fill: #ffffff;
        stroke: #ffffff;
        stroke-width: 0.05em;
        paint-order: stroke fill;
        word-spacing: 0.18em;
      }
      .brand-text-cops-light {
        fill: #052624;
        stroke: #052624;
      }
      .brand-accent-cops {
        fill: #04cbc2;
        stroke: #04cbc2;
      }
      .brand-accent-cops-light {
        fill: #038a83;
        stroke: #038a83;
      }
      .tagline-cops {
        font-family: 'Michroma', 'Inter', sans-serif;
        font-weight: 400;
        fill: #a3c2c0;
        stroke: #a3c2c0;
        stroke-width: 0.045em;
        paint-order: stroke fill;
        letter-spacing: 0.14em;
      }
      .tagline-cops-light {
        fill: #04524e;
        stroke: #04524e;
      }
      
      .brand-text-di {
        font-family: 'Space Grotesk', 'Inter', sans-serif;
        font-weight: 700;
        fill: #ffffff;
      }
      .brand-text-di-light {
        fill: #0f172a;
      }
      .brand-accent-di {
        fill: #3b82f6;
      }
      .brand-accent-di-light {
        fill: #2563eb;
      }
      .tagline-di {
        font-family: 'Inter', sans-serif;
        font-weight: 600;
        fill: #cbd5e1;
        letter-spacing: 0.2em;
      }
      .tagline-di-light {
        fill: #475569;
      }
    </style>
  </defs>
`;

// Helper to write SVG and queue it for PNG/JPEG rendering (see renderAll at the bottom)
const renderQueue = [];
function saveAndRender(filename, svgContent, width, height, outputSubdir) {
  const svgPath = path.join(outputSubdir, 'svg', `${filename}.svg`);
  const pngPath = path.join(outputSubdir, 'png', `${filename}.png`);
  const jpegPath = path.join(outputSubdir, 'jpeg', `${filename}.jpg`);

  // Write SVG file
  fs.writeFileSync(svgPath, svgContent, 'utf8');
  renderQueue.push({ filename, svgContent, width, height, svgPath, pngPath, jpegPath });
}

// Render every queued SVG with Chrome so the wordmark uses the real web fonts
// (Space Grotesk / Inter from Google Fonts, same as the website). resvg/svg2img can't
// fetch web fonts, so it is only used as a fallback when Chrome isn't available.
const CHROME_PATHS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
];
async function renderAll() {
  let puppeteer, executablePath;
  try {
    puppeteer = require('puppeteer-core');
    executablePath = CHROME_PATHS.find(p => fs.existsSync(p));
  } catch (e) { /* puppeteer-core not installed */ }
  if (!puppeteer || !executablePath) {
    console.warn('Chrome/puppeteer-core not found; falling back to svg2img (system fonts only).');
    renderQueue.forEach(job => renderWithSvg2img(job.filename, job.svgContent, job.width, job.height, job.pngPath, job.jpegPath));
    return;
  }
  const browser = await puppeteer.launch({ executablePath, headless: true });
  const page = await browser.newPage();
  for (const job of renderQueue) {
    await page.setViewport({ width: job.width, height: job.height, deviceScaleFactor: 1 });
    await page.goto('file:///' + job.svgPath.replace(/\\/g, '/'), { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: job.pngPath, omitBackground: true, clip: { x: 0, y: 0, width: job.width, height: job.height } });
    console.log(`Rendered PNG: ${job.pngPath}`);
    await page.screenshot({ path: job.jpegPath, type: 'jpeg', quality: 95, clip: { x: 0, y: 0, width: job.width, height: job.height } });
    console.log(`Rendered JPEG: ${job.jpegPath}`);
  }
  await browser.close();
}

function renderWithSvg2img(filename, svgContent, width, height, pngPath, jpegPath) {
  const svg2img = require('svg2img');
  // Convert to PNG
  svg2img(svgContent, { format: 'png', quality: 100, width: width, height: height }, (err, buffer) => {
    if (err) {
      console.error(`Error rendering PNG for ${filename}:`, err);
      return;
    }
    fs.writeFileSync(pngPath, buffer);
    console.log(`Rendered PNG: ${pngPath}`);
  });

  // Convert to JPEG
  svg2img(svgContent, { format: 'jpeg', quality: 95, width: width, height: height }, (err, buffer) => {
    if (err) {
      console.error(`Error rendering JPEG for ${filename}:`, err);
      return;
    }
    fs.writeFileSync(jpegPath, buffer);
    console.log(`Rendered JPEG: ${jpegPath}`);
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// RESEARCH COPS LOGOS
// ══════════════════════════════════════════════════════════════════════════════

// 1. Icon Only (Square - 512x512)
// Research COPS icon is the shield target (contained inside a transform scale of 3.33 inside logo_brand.svg)
// Let's isolate the icon itself. The icon viewBox is 0 0 24 24, but let's make it look beautiful.
function getRCIconOnly(bg) {
  const bgRect = bg ? `<rect width="512" height="512" fill="${bg}" />` : '';
  return `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    ${bgRect}
    <g transform="translate(64, 64) scale(16)">
      <!-- Top Half (Dark) -->
      <path d="M12 2c-2.5 0-4.5-.8-5.8-.8-1.7 0-3 1.6-3 4.3 0 1.3.6 2.5.6 3.3 0 .7-.6 1.4-.6 2.4V12h17.6v-.8c0-1-.6-1.7-.6-2.4 0-.8.6-2 .6-3.3 0-2.7-1.3-4.3-3-4.3-1.3 0-3.3.8-5.8.8z" fill="#04524e" />
      <!-- Bottom Half (White) -->
      <path d="M3.2 12c0 4.5 3.8 9.2 8.8 10.8 5-1.6 8.8-6.3 8.8-10.8H3.2z" fill="#f8fafc" />
      <!-- Outer Shield border stroke -->
      <path d="M12 2c-2.5 0-4.5-.8-5.8-.8-1.7 0-3 1.6-3 4.3 0 1.3.6 2.5.6 3.3 0 .7-.6 1.4-.6 2.4 0 4.5 3.8 9.2 8.8 10.8 5-1.6 8.8-6.3 8.8-10.8 0-1-.6-1.7-.6-2.4 0-.8.6-2 .6-3.3 0-2.7-1.3-4.3-3-4.3-1.3 0-3.3.8-5.8.8z" fill="none" stroke="#04cbc2" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>
      <!-- Horizontal Divider line -->
      <line x1="3.2" y1="12" x2="20.8" y2="12" stroke="#04cbc2" stroke-width="1.5" stroke-linecap="round" />
      <!-- Concentric target circles inside top half -->
      <circle cx="12" cy="7.2" r="0.8" fill="#04cbc2" />
      <g transform="rotate(-110, 12, 7.2)">
        <circle cx="12" cy="7.2" r="1.6" stroke="#ffffff" stroke-width="0.8" fill="none" stroke-dasharray="7.5 2.5" stroke-linecap="round" />
        <circle cx="12" cy="7.2" r="2.6" stroke="#04cbc2" stroke-width="0.8" fill="none" stroke-dasharray="12.2 4.1" stroke-linecap="round" />
        <circle cx="12" cy="7.2" r="3.6" stroke="#ffffff" stroke-width="0.8" fill="none" stroke-dasharray="17.0 5.6" stroke-linecap="round" />
      </g>
    </g>
  </svg>`;
}

// 2. Horizontal Logo (Standard - 600x200)
function getRCHorizontal(bg, isDark) {
  const bgRect = bg ? `<rect width="600" height="200" rx="8" fill="${bg}" />` : '';
  const textClass = isDark ? 'brand-text-cops' : 'brand-text-cops brand-text-cops-light';
  const accentClass = isDark ? 'brand-accent-cops' : 'brand-accent-cops brand-accent-cops-light';
  const taglineClass = isDark ? 'tagline-cops' : 'tagline-cops tagline-cops-light';
  const outerBorderColor = isDark ? '#04cbc2' : '#038a83';

  return `<svg width="600" height="200" viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    ${fontDefs}
    ${bgRect}
    <g transform="translate(40, 40) scale(5)">
      <path d="M12 2c-2.5 0-4.5-.8-5.8-.8-1.7 0-3 1.6-3 4.3 0 1.3.6 2.5.6 3.3 0 .7-.6 1.4-.6 2.4V12h17.6v-.8c0-1-.6-1.7-.6-2.4 0-.8.6-2 .6-3.3 0-2.7-1.3-4.3-3-4.3-1.3 0-3.3.8-5.8.8z" fill="#04524e" />
      <path d="M3.2 12c0 4.5 3.8 9.2 8.8 10.8 5-1.6 8.8-6.3 8.8-10.8H3.2z" fill="#f8fafc" />
      <path d="M12 2c-2.5 0-4.5-.8-5.8-.8-1.7 0-3 1.6-3 4.3 0 1.3.6 2.5.6 3.3 0 .7-.6 1.4-.6 2.4 0 4.5 3.8 9.2 8.8 10.8 5-1.6 8.8-6.3 8.8-10.8 0-1-.6-1.7-.6-2.4 0-.8.6-2 .6-3.3 0-2.7-1.3-4.3-3-4.3-1.3 0-3.3.8-5.8.8z" fill="none" stroke="${outerBorderColor}" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>
      <line x1="3.2" y1="12" x2="20.8" y2="12" stroke="${outerBorderColor}" stroke-width="1.5" stroke-linecap="round" />
      <circle cx="12" cy="7.2" r="0.8" fill="${outerBorderColor}" />
      <g transform="rotate(-110, 12, 7.2)">
        <circle cx="12" cy="7.2" r="1.6" stroke="#ffffff" stroke-width="0.8" fill="none" stroke-dasharray="7.5 2.5" stroke-linecap="round" />
        <circle cx="12" cy="7.2" r="2.6" stroke="${outerBorderColor}" stroke-width="0.8" fill="none" stroke-dasharray="12.2 4.1" stroke-linecap="round" />
        <circle cx="12" cy="7.2" r="3.6" stroke="#ffffff" stroke-width="0.8" fill="none" stroke-dasharray="17.0 5.6" stroke-linecap="round" />
      </g>
    </g>
    <text x="185" y="104" class="${textClass}" fill="${isDark ? '#ffffff' : '#052624'}" font-size="31" letter-spacing="0.5">
      <tspan class="${accentClass}">RESEARCH</tspan> COPS
    </text>
    <text x="186" y="134" class="${taglineClass}" font-size="13.5">
      RESEARCH CENTRIC OPS
    </text>
  </svg>`;
}

// 3. Social Profile / Vertical Logo (Square - 800x800)
function getRCVertical(bg, isDark) {
  const bgRect = bg ? `<rect width="800" height="800" rx="20" fill="${bg}" />` : '';
  const textClass = isDark ? 'brand-text-cops' : 'brand-text-cops brand-text-cops-light';
  const accentClass = isDark ? 'brand-accent-cops' : 'brand-accent-cops brand-accent-cops-light';
  const taglineClass = isDark ? 'tagline-cops' : 'tagline-cops tagline-cops-light';
  const outerBorderColor = isDark ? '#04cbc2' : '#038a83';

  return `<svg width="800" height="800" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
    ${fontDefs}
    ${bgRect}
    <g transform="translate(272, 120) scale(10.66)">
      <path d="M12 2c-2.5 0-4.5-.8-5.8-.8-1.7 0-3 1.6-3 4.3 0 1.3.6 2.5.6 3.3 0 .7-.6 1.4-.6 2.4V12h17.6v-.8c0-1-.6-1.7-.6-2.4 0-.8.6-2 .6-3.3 0-2.7-1.3-4.3-3-4.3-1.3 0-3.3.8-5.8.8z" fill="#04524e" />
      <path d="M3.2 12c0 4.5 3.8 9.2 8.8 10.8 5-1.6 8.8-6.3 8.8-10.8H3.2z" fill="#f8fafc" />
      <path d="M12 2c-2.5 0-4.5-.8-5.8-.8-1.7 0-3 1.6-3 4.3 0 1.3.6 2.5.6 3.3 0 .7-.6 1.4-.6 2.4 0 4.5 3.8 9.2 8.8 10.8 5-1.6 8.8-6.3 8.8-10.8 0-1-.6-1.7-.6-2.4 0-.8.6-2 .6-3.3 0-2.7-1.3-4.3-3-4.3-1.3 0-3.3.8-5.8.8z" fill="none" stroke="${outerBorderColor}" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>
      <line x1="3.2" y1="12" x2="20.8" y2="12" stroke="${outerBorderColor}" stroke-width="1.5" stroke-linecap="round" />
      <circle cx="12" cy="7.2" r="0.8" fill="${outerBorderColor}" />
      <g transform="rotate(-110, 12, 7.2)">
        <circle cx="12" cy="7.2" r="1.6" stroke="#ffffff" stroke-width="0.8" fill="none" stroke-dasharray="7.5 2.5" stroke-linecap="round" />
        <circle cx="12" cy="7.2" r="2.6" stroke="${outerBorderColor}" stroke-width="0.8" fill="none" stroke-dasharray="12.2 4.1" stroke-linecap="round" />
        <circle cx="12" cy="7.2" r="3.6" stroke="#ffffff" stroke-width="0.8" fill="none" stroke-dasharray="17.0 5.6" stroke-linecap="round" />
      </g>
    </g>
    <text x="400" y="490" text-anchor="middle" class="${textClass}" fill="${isDark ? '#ffffff' : '#052624'}" font-size="52" letter-spacing="0.5">
      <tspan class="${accentClass}">RESEARCH</tspan> COPS
    </text>
    <text x="400" y="550" text-anchor="middle" class="${taglineClass}" font-size="22" font-weight="700">
      RESEARCH CENTRIC OPS
    </text>
  </svg>`;
}

// 4. Banner Logo (Cover Banner - 1500x500)
function getRCBanner(bg, isDark) {
  const bgRect = bg ? `<rect width="1500" height="500" fill="${bg}" />` : '';
  const textClass = isDark ? 'brand-text-cops' : 'brand-text-cops brand-text-cops-light';
  const accentClass = isDark ? 'brand-accent-cops' : 'brand-accent-cops brand-accent-cops-light';
  const taglineClass = isDark ? 'tagline-cops' : 'tagline-cops tagline-cops-light';
  const outerBorderColor = isDark ? '#04cbc2' : '#038a83';

  // Add decorative background elements
  const decors = bg ? `
    <circle cx="100" cy="100" r="300" fill="url(#grad1)" opacity="0.05" />
    <circle cx="1400" cy="400" r="250" fill="url(#grad2)" opacity="0.08" />
    <path d="M 0,250 L 1500,250" stroke="${isDark ? 'rgba(4,203,194,0.04)' : 'rgba(4,82,78,0.04)'}" stroke-width="2" />
    <path d="M 400,0 L 400,500" stroke="${isDark ? 'rgba(4,203,194,0.04)' : 'rgba(4,82,78,0.04)'}" stroke-width="2" />
    <path d="M 1100,0 L 1100,500" stroke="${isDark ? 'rgba(4,203,194,0.04)' : 'rgba(4,82,78,0.04)'}" stroke-width="2" />
  ` : '';

  return `<svg width="1500" height="500" viewBox="0 0 1500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="grad1" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#04cbc2" />
        <stop offset="100%" stop-color="#061413" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="grad2" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#10b981" />
        <stop offset="100%" stop-color="#061413" stop-opacity="0" />
      </radialGradient>
    </defs>
    ${fontDefs}
    ${bgRect}
    ${decors}
    <g transform="translate(160, 150) scale(8.33)">
      <path d="M12 2c-2.5 0-4.5-.8-5.8-.8-1.7 0-3 1.6-3 4.3 0 1.3.6 2.5.6 3.3 0 .7-.6 1.4-.6 2.4V12h17.6v-.8c0-1-.6-1.7-.6-2.4 0-.8.6-2 .6-3.3 0-2.7-1.3-4.3-3-4.3-1.3 0-3.3.8-5.8.8z" fill="#04524e" />
      <path d="M3.2 12c0 4.5 3.8 9.2 8.8 10.8 5-1.6 8.8-6.3 8.8-10.8H3.2z" fill="#f8fafc" />
      <path d="M12 2c-2.5 0-4.5-.8-5.8-.8-1.7 0-3 1.6-3 4.3 0 1.3.6 2.5.6 3.3 0 .7-.6 1.4-.6 2.4 0 4.5 3.8 9.2 8.8 10.8 5-1.6 8.8-6.3 8.8-10.8 0-1-.6-1.7-.6-2.4 0-.8.6-2 .6-3.3 0-2.7-1.3-4.3-3-4.3-1.3 0-3.3.8-5.8.8z" fill="none" stroke="${outerBorderColor}" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>
      <line x1="3.2" y1="12" x2="20.8" y2="12" stroke="${outerBorderColor}" stroke-width="1.5" stroke-linecap="round" />
      <circle cx="12" cy="7.2" r="0.8" fill="${outerBorderColor}" />
      <g transform="rotate(-110, 12, 7.2)">
        <circle cx="12" cy="7.2" r="1.6" stroke="#ffffff" stroke-width="0.8" fill="none" stroke-dasharray="7.5 2.5" stroke-linecap="round" />
        <circle cx="12" cy="7.2" r="2.6" stroke="${outerBorderColor}" stroke-width="0.8" fill="none" stroke-dasharray="12.2 4.1" stroke-linecap="round" />
        <circle cx="12" cy="7.2" r="3.6" stroke="#ffffff" stroke-width="0.8" fill="none" stroke-dasharray="17.0 5.6" stroke-linecap="round" />
      </g>
    </g>
    <text x="420" y="250" class="${textClass}" fill="${isDark ? '#ffffff' : '#052624'}" font-size="68" letter-spacing="0.5">
      <tspan class="${accentClass}">RESEARCH</tspan> COPS
    </text>
    <text x="428" y="310" class="${taglineClass}" font-size="28" font-weight="700">
      RESEARCH CENTRIC OPS
    </text>
  </svg>`;
}

// ══════════════════════════════════════════════════════════════════════════════
// DEEPSIGHT INSIGHTS LOGOS
// ══════════════════════════════════════════════════════════════════════════════

// 1. Icon Only (Square - 512x512)
function getDIIconOnly(bg) {
  const bgRect = bg ? `<rect width="512" height="512" fill="${bg}" />` : '';
  return `<svg width="512" height="512" viewBox="0 0 1500 1500" fill="none" xmlns="http://www.w3.org/2000/svg">
    ${bgRect}
    ${diInner}
  </svg>`;
}

// 2. Horizontal Logo (Standard - 600x200)
function getDIHorizontal(bg, isDark) {
  const bgRect = bg ? `<rect width="600" height="200" rx="8" fill="${bg}" />` : '';
  const textClass = isDark ? 'brand-text-di' : 'brand-text-di brand-text-di-light';
  const accentClass = isDark ? 'brand-accent-di' : 'brand-accent-di brand-accent-di-light';
  const taglineClass = isDark ? 'tagline-di' : 'tagline-di tagline-di-light';

  // We wrap the DI icon in a <g> that scales and repositions it.
  // Original is viewBox 0 0 1500 1500, we scale it to fit nicely inside the horizontal height (e.g. 130px height, scale = 130/1500 = 0.0866)
  const scaleFactor = 140 / 1500;
  return `<svg width="600" height="200" viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    ${fontDefs}
    ${bgRect}
    <g transform="translate(30, 30) scale(${scaleFactor})">
      ${diInner}
    </g>
    <text x="210" y="105" class="${textClass}" fill="${isDark ? '#ffffff' : '#0f172a'}" font-size="52" font-family="'Space Grotesk', sans-serif" letter-spacing="0.1em">
      DEEPSIGHT
    </text>
    <text x="214" y="140" class="${taglineClass}" font-size="16" font-weight="700">
      AI-POWERED INSIGHTS ENGINE
    </text>
  </svg>`;
}

// 3. Social Profile / Vertical Logo (Square - 800x800)
function getDIVertical(bg, isDark) {
  const bgRect = bg ? `<rect width="800" height="800" rx="20" fill="${bg}" />` : '';
  const textClass = isDark ? 'brand-text-di' : 'brand-text-di brand-text-di-light';
  const taglineClass = isDark ? 'tagline-di' : 'tagline-di tagline-di-light';

  const scaleFactor = 360 / 1500;
  return `<svg width="800" height="800" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
    ${fontDefs}
    ${bgRect}
    <g transform="translate(220, 90) scale(${scaleFactor})">
      ${diInner}
    </g>
    <text x="400" y="520" text-anchor="middle" class="${textClass}" fill="${isDark ? '#ffffff' : '#0f172a'}" font-size="76" font-family="'Space Grotesk', sans-serif" letter-spacing="0.1em">
      DEEPSIGHT
    </text>
    <text x="400" y="575" text-anchor="middle" class="${taglineClass}" font-size="20" font-weight="700">
      AI-POWERED INSIGHTS ENGINE
    </text>
  </svg>`;
}

// 4. Banner Logo (Cover Banner - 1500x500)
function getDIBanner(bg, isDark) {
  const bgRect = bg ? `<rect width="1500" height="500" fill="${bg}" />` : '';
  const textClass = isDark ? 'brand-text-di' : 'brand-text-di brand-text-di-light';
  const taglineClass = isDark ? 'tagline-di' : 'tagline-di tagline-di-light';

  const decors = bg ? `
    <circle cx="150" cy="150" r="300" fill="url(#grad3)" opacity="0.06" />
    <circle cx="1350" cy="350" r="280" fill="url(#grad4)" opacity="0.08" />
    <path d="M 0,250 L 1500,250" stroke="${isDark ? 'rgba(59,130,246,0.04)' : 'rgba(37,99,235,0.04)'}" stroke-width="2" />
    <path d="M 430,0 L 430,500" stroke="${isDark ? 'rgba(59,130,246,0.04)' : 'rgba(37,99,235,0.04)'}" stroke-width="2" />
    <path d="M 1070,0 L 1070,500" stroke="${isDark ? 'rgba(59,130,246,0.04)' : 'rgba(37,99,235,0.04)'}" stroke-width="2" />
  ` : '';

  const scaleFactor = 280 / 1500;
  return `<svg width="1500" height="500" viewBox="0 0 1500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="grad3" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#3b82f6" />
        <stop offset="100%" stop-color="#0f172a" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="grad4" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#06b6d4" />
        <stop offset="100%" stop-color="#0f172a" stop-opacity="0" />
      </radialGradient>
    </defs>
    ${fontDefs}
    ${bgRect}
    ${decors}
    <g transform="translate(100, 110) scale(${scaleFactor})">
      ${diInner}
    </g>
    <text x="440" y="250" class="${textClass}" fill="${isDark ? '#ffffff' : '#0f172a'}" font-size="104" font-family="'Space Grotesk', sans-serif" letter-spacing="0.1em">
      DEEPSIGHT
    </text>
    <text x="448" y="310" class="${taglineClass}" font-size="28" font-weight="700">
      AI-POWERED INSIGHTS ENGINE
    </text>
  </svg>`;
}

// ══════════════════════════════════════════════════════════════════════════════
// EXECUTE GENERATION
// ══════════════════════════════════════════════════════════════════════════════

console.log('Generating Research COPS logos...');
// Research COPS Solid background is deep brand teal: #061413
saveAndRender('cops_icon_solid', getRCIconOnly('#061413'), 512, 512, rcOutputDir);
saveAndRender('cops_icon_transparent', getRCIconOnly(null), 512, 512, rcOutputDir);
saveAndRender('cops_horizontal_solid', getRCHorizontal('#061413', true), 600, 200, rcOutputDir);
saveAndRender('cops_horizontal_transparent', getRCHorizontal(null, true), 600, 200, rcOutputDir);
saveAndRender('cops_vertical_solid', getRCVertical('#061413', true), 800, 800, rcOutputDir);
saveAndRender('cops_vertical_transparent', getRCVertical(null, true), 800, 800, rcOutputDir);
saveAndRender('cops_banner_solid', getRCBanner('#061413', true), 1500, 500, rcOutputDir);
saveAndRender('cops_banner_transparent', getRCBanner(null, true), 1500, 500, rcOutputDir);

// Also generate Light Mode solid logos for signatures and presentation slides
saveAndRender('cops_horizontal_light', getRCHorizontal('#ffffff', false), 600, 200, rcOutputDir);
saveAndRender('cops_vertical_light', getRCVertical('#ffffff', false), 800, 800, rcOutputDir);

console.log('Generating DeepSight Insights logos...');
// DeepSight Solid background is deep slate blue: #0f172a
saveAndRender('deepsight_icon_solid', getDIIconOnly('#0f172a'), 512, 512, diOutputDir);
saveAndRender('deepsight_icon_transparent', getDIIconOnly(null), 512, 512, diOutputDir);
saveAndRender('deepsight_horizontal_solid', getDIHorizontal('#0f172a', true), 600, 200, diOutputDir);
saveAndRender('deepsight_horizontal_transparent', getDIHorizontal(null, true), 600, 200, diOutputDir);
saveAndRender('deepsight_vertical_solid', getDIVertical('#0f172a', true), 800, 800, diOutputDir);
saveAndRender('deepsight_vertical_transparent', getDIVertical(null, true), 800, 800, diOutputDir);
saveAndRender('deepsight_banner_solid', getDIBanner('#0f172a', true), 1500, 500, diOutputDir);
saveAndRender('deepsight_banner_transparent', getDIBanner(null, true), 1500, 500, diOutputDir);

// Light Mode solid logos
saveAndRender('deepsight_horizontal_light', getDIHorizontal('#ffffff', false), 600, 200, diOutputDir);
saveAndRender('deepsight_vertical_light', getDIVertical('#ffffff', false), 800, 800, diOutputDir);

console.log('SVGs written. Rendering PNG/JPEG...');
renderAll().then(() => console.log('Logo rendering complete.')).catch(err => { console.error('Rendering failed:', err); process.exit(1); });
