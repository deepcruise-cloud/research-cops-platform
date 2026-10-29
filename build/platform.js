// Research Centric OPS (the DIY platform, https://diy.researchcops.com): platform content.
// Source of truth: "Research COPS DIY — Product Reference for the Website" (22 Oct 2026).
// Only claim what that brief lists; items it marks ⚠️ are left out or phrased softly.
// Plan prices are intentionally not published (decision of 22 Oct 2026).
// The copy lives in build/site-content.json under "platform" (edited in the Content admin).

const DIY_URL = 'https://diy.researchcops.com';

const { modules, methodologyTotal, methodologies, qualityChecks, security, plans, compare, extras, useCases } = require('./content-store').platform;

module.exports = { DIY_URL, modules, methodologyTotal, methodologies, qualityChecks, security, plans, compare, extras, useCases };
