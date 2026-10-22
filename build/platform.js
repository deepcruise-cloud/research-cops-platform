// Research Centric OPS (the DIY platform, https://diy.researchcops.com): platform content.
// Source of truth: "Research COPS DIY — Product Reference for the Website" (22 Oct 2026).
// Only claim what that brief lists; items it marks ⚠️ are left out or phrased softly.
// Plan prices are intentionally not published (decision of 22 Oct 2026).

const DIY_URL = 'https://diy.researchcops.com';

const modules = [
  {
    slug: 'feasibility-costing', icon: 'wallet', name: 'Feasibility & Costing', step: 'Price',
    short: 'A CPI, a feasibility range and a field time for every market, in seconds.',
    h1: 'Quote with <em class="s">confidence</em>. In seconds.',
    lead: 'Pick the markets, audience, targeting, sample size, LOI and incidence. Research Centric OPS returns a recommended CPI, a feasibility range and a field time for each market, plus the target universe and the share of it that is online.',
    today: 'A bid sheet, three supplier emails, and a day of waiting.',
    here: 'Priced in seconds: the universe, the online share, and a confidence label on every number.',
    mock: 'feasibility',
    features: [
      ['globe', '44 market profiles', 'Each market priced and sized on its own profile. Multi-market studies get a result per market.'],
      ['users', '70 audience types', 'In 8 categories: B2C, B2B, Business Functions, Healthcare Professionals, Patients, Education, Government and Specialized.'],
      ['target', '90 targeting questions', 'Narrow the audience with targeting questions and see the effect on price and feasibility straight away.'],
      ['wallet', 'CPI and CPI range', 'A recommended CPI and a range for every market, with the assumed incidence and conversion shown.'],
      ['layers', 'Feasibility as a range', 'Worst-case to expected completes, a field time in days, and a confidence band from Very Low to Very High.'],
      ['doc', 'Quote to study in one click', 'Create the study directly from the quote, so the audience you priced is the audience you screen.'],
    ],
    universe: true,
  },
  {
    slug: 'survey-builder', icon: 'code', name: 'Survey Builder', step: 'Build',
    short: '33 question types, full logic, quotas and preflight checks.',
    h1: 'Build it <em class="s">once</em>. Field it everywhere.',
    lead: '33 question types, display and skip logic, piping, loops, randomisation and quotas, with automatic preflight checks and an estimated LOI before you launch. Surveys work smoothly on phones, and grids become cards on mobile.',
    today: 'A separate scripting platform, with its own login and its own library.',
    here: 'Built where the study lives, with preflight checks before launch.',
    mock: 'builder',
    features: [
      ['layers', '33 question types', 'Standard, grid, advanced and content blocks, including MaxDiff, CBC conjoint, ranking, constant sum, card sorting, tree testing, first click and heatmaps.'],
      ['code', 'Logic & flow', 'Display logic; skip to a question or page; terminate or disqualify; piping and carry-forward; loops; randomisation of pages, groups, questions, choices and rows.'],
      ['target', 'Quotas', 'Quotas set in the survey, with quota-full handling.'],
      ['shield', 'Preflight before launch', 'Automatic validation checks, plus a preview of one question, a page or the whole survey, and an estimated LOI.'],
      ['doc', 'Library, templates & themes', 'A shared question library, survey templates and brand themes.'],
      ['bolt', 'Mobile-friendly', 'Touch-friendly controls for respondents on phones; matrix questions turn into cards on small screens.'],
    ],
    groups: [
      ['Standard', ['Single choice', 'Multi-select', 'Dropdown', 'Short text', 'Long text', 'Number', 'Email', 'Phone', 'Date', 'Slider', 'Range', 'Star rating', 'Likert', 'NPS']],
      ['Grids', ['Matrix (single)', 'Matrix (multiple)']],
      ['Advanced', ['Ranking', 'Constant sum', 'MaxDiff (single screen)', 'MaxDiff (designed sets)', 'CBC conjoint task', 'Pair choice', 'First click', 'Card sorting', 'Tree testing', 'Heatmap click', 'Text highlight']],
      ['Content blocks', ['Heading', 'Text', 'Image', 'Video', 'Divider']],
    ],
    ai: [
      ['AI Draft', 'Builds a draft survey from a brief.'],
      ['AI Survey Architect', 'Builds a draft from a structured brief.'],
      ['Questionnaire import', 'Upload Word, PDF or Excel. Programming notes such as ASK IF, TERMINATE, SKIP TO and RANDOMIZE become real logic.'],
      ['AI edit', 'Describe a change, review the diff, then apply it.'],
      ['AI QA review', 'Flags leading, double-barrelled and unbalanced questions. Advisory only: the rule-based checks decide whether a survey can publish.'],
    ],
  },
  {
    slug: 'translation', icon: 'translate', name: 'Translation', step: 'Translate',
    short: 'Multi-language surveys inside the project, not around it.',
    h1: 'One script. <em class="s">Every</em> market.',
    lead: 'Each survey gets a translation version per language. Built-in machine translation runs on our own servers, with an optional AI translation provider, and respondent screens are localised, including right-to-left languages.',
    today: 'Word files out to a vendor, corrected files back, re-scripted by hand.',
    here: 'A translation version per language, inside the same survey and project.',
    mock: null,
    features: [
      ['globe', 'One version per language', 'Translation versions of each survey, one per language, kept with the survey in the project.'],
      ['bolt', 'Built-in machine translation', 'Runs on our own servers, with an optional AI translation provider.'],
      ['doc', 'Localised respondent screens', 'Buttons and messages are localised for respondents, not just the questions.'],
      ['code', 'Right-to-left support', 'Right-to-left languages such as Arabic and Hebrew are supported in the respondent screens.'],
      ['layers', 'Ready for the next wave', 'A new tracker wave is created with its surveys, allocations and translations.'],
      ['chart', 'Open ends in any language', 'Open ends in other languages are translated first, then quality-checked and organised into the open-end framework in Data Processing.'],
    ],
  },
  {
    slug: 'sample-collection', icon: 'sampling', name: 'Sample Collection', step: 'Field',
    short: 'Opinion Genie plus API-integrated partners, a live quota engine and field controls.',
    h1: 'Every supplier. <em class="s">One</em> live board.',
    lead: 'Field through our own panel, Opinion Genie, and API-integrated partner panels. Allocate quotas by supply preference, soft-launch, then watch completes, incidence and quotas per supplier, and pause or resume any market.',
    today: 'Supplier portals, pasted redirects, and quotas tracked in a second sheet.',
    here: 'One live board: allocations, quotas and completes per supplier.',
    mock: 'sample',
    features: [
      ['users', 'Opinion Genie + partners', 'Our own panel, plus API-integrated partners (create, launch, pause and resume target groups; set CPI and completes goal; sync profiling and quotas) and redirect-based suppliers with tokenised links and postbacks.'],
      ['shield', 'Launch with confidence', 'A launch-readiness check and soft launch, plus a field test page to verify supplier redirects end to end.'],
      ['layers', 'Live field monitor', 'Completes, incidence and quotas per supplier, with postback-failure alerts. Pause and resume a whole project or a subset of markets.'],
      ['target', 'Live quota engine', 'Quotas with quota-full handling, prescreen quotas, and allocations by supply preference.'],
      ['clock', 'Trackers & waves', 'Create a new wave as a child project with its surveys, allocations and translations, then report wave over wave.'],
      ['wallet', 'Reconciliation', 'Compute, review and export (CSV) completes against supplier counts.'],
    ],
    extras: [
      ['Multi-market projects', 'A parent project with child market projects, questionnaire sync across markets and rollup reporting.'],
      ['Recontact', 'Signed recontact links, with a separate recontact CPI.'],
      ['Client link pools', 'Upload unique client survey links, assigned one per respondent.'],
      ['Invite-forward', 'Forward invites to suppliers for tracker waves.'],
    ],
  },
  {
    slug: 'data-reporting', icon: 'chart', name: 'Data Processing & Reporting', step: 'Clean & Report',
    short: 'Cleaning, weighting, crosstabs, open-end quality checks and exports.',
    h1: 'Clean data. <em class="s">Clear</em> answers.',
    lead: 'Clean with built-in and custom rules, weight with RIM or cell weighting, run banner tables, flag poor open ends and organise the rest into a theme framework, all on the response set you collected. Every methodology has its own built-in report.',
    today: 'Export to a stats package, verbatims sent to an outside open-end vendor.',
    here: 'Cleaned, weighted and checked in place, so the deck and the data always agree.',
    mock: 'data',
    features: [
      ['shield', 'Cleaning rules', 'Speeder, straight-liner, duplicate, partial, poor open-end and attention-check rules, plus custom rules. Removed completes are tracked.'],
      ['layers', 'Weighting', 'RIM and cell weighting, with trimming and diagnostics, plus derived variables.'],
      ['chart', 'Banner tables', 'Crosstabs, including pooled multi-wave crosstabs, and automated insights.'],
      ['doc', 'Open-end quality checks & framework', 'Poor-quality and gibberish open ends are flagged for review, and answers are organised into a theme framework. Other languages are translated first, and the framework can be exported.'],
      ['data', 'Exports', 'CSV, SPSS (.sav), Excel banner book and PowerPoint deck, plus MaxDiff and CBC exports.'],
      ['target', 'A report for every method', 'An on-screen dashboard, and a dedicated report for each methodology.'],
    ],
  },
];

const methodologyTotal = 24;
const methodologies = [
  ['Pricing', ['Van Westendorp PSM', 'Gabor-Granger (with price-ladder preset)', 'Feature Matrix', 'Brand-Price Trade-Off (BPTO)', 'Dynamic Pricing', 'Bundle Pricing']],
  ['Product', ['Concept Test', 'A/B Test', 'Recall', 'Text Highlight', 'Comparative', 'Paired Comparison (Bradley-Terry)', 'Kano', 'CBC Conjoint (with market simulator)', 'MaxDiff', 'TURF']],
  ['UX / CX', ['Card Sorting', 'Tree Testing', 'First Click', 'Heatmap', 'Driver Analysis', 'Journey Mapping']],
];

// Built into every survey link (brief §6)
const qualityChecks = [
  ['Geo-IP country check', 'The respondent must be in the target country.'],
  ['Proxy, VPN & hosting-IP blocking', 'Masked and data-centre traffic is blocked, with limits on IP changes during the survey.'],
  ['Fingerprinting & duplicate checks', 'Unique link, unique IP and unique device. Previous respondents can be excluded across a project.'],
  ['Human-verification challenge', 'Our own check, not a third-party CAPTCHA.'],
  ['Behaviour & quality score', 'Speeder and straight-liner detection, poor open-end detection, attention checks and a 0–100 quality score per response.'],
  ['Device allow-list', 'Run mobile-only or desktop-only studies.'],
  ['Email authenticity check', 'Where a survey collects email addresses.'],
];

const security = [
  ['users', 'Role-based access', 'Client owner and Client user roles, with access set per account. Multi-client accounts can have support staff assigned per client.'],
  ['shield', 'Two-factor authentication', 'TOTP two-factor authentication and password OTP.'],
  ['plug', 'Single sign-on', 'Sign in through your identity provider with OpenID Connect.'],
  ['doc', 'Audit log', 'An audit log of activity in the account.'],
];

// Plans (brief §10): cumulative features, AI credits and seats. Prices hidden.
const plans = [
  { name: 'Alpha', tag: 'Build surveys and read results.', items: ['Survey Builder', 'Research Center', 'On-screen and CSV results', 'Core product methodologies', '200 AI credits / month', '1 seat'] },
  { name: 'Beta', tag: 'Add feasibility, sample and the UX toolkit.', popular: true, items: ['Everything in Alpha, plus:', 'Feasibility & Costing', 'Sample Collection', 'Question library', 'Excel banner book', 'UX methodologies', '500 AI credits / month · 3 seats'] },
  { name: 'Gamma', tag: 'Translation, processing and team work.', items: ['Everything in Beta, plus:', 'Translation', 'Data Processing', 'Templates & themes', 'PowerPoint and SPSS export', 'Team users', '1,500 AI credits / month · 10 seats'] },
  { name: 'Sigma', tag: 'Advanced pricing and the AI assistant.', items: ['Everything in Gamma, plus:', 'Advanced pricing methods (BPTO, Dynamic, Bundle)', 'AI Survey Assistant', '4,000 AI credits / month', 'Unlimited seats'] },
  { name: 'Custom', tag: 'The modules and methods you need.', items: ['Pick the modules you need', 'Methodologies to suit your work', 'Seats and AI credits to match', 'Scoped with our team'] },
];

// Compare: [row label, Alpha, Beta, Gamma, Sigma, Custom]; true = included, false = not, 'R' = on request, string = value
const compare = [
  ['Modules', [
    ['Feasibility & Costing', false, true, true, true, 'R'],
    ['Survey Builder', true, true, true, true, 'R'],
    ['Translation', false, false, true, true, 'R'],
    ['Sample Collection', false, true, true, true, 'R'],
    ['Data Processing', false, false, true, true, 'R'],
    ['Research Center', true, true, true, true, 'R'],
  ]],
  ['Resources', [
    ['Question library', false, true, true, true, 'R'],
    ['Templates', false, false, true, true, 'R'],
    ['Brand themes', false, false, true, true, 'R'],
  ]],
  ['Methodologies', [
    ['Core product methodologies', true, true, true, true, 'R'],
    ['UX methodologies', false, true, true, true, 'R'],
    ['Advanced pricing (BPTO, Dynamic, Bundle)', false, false, false, true, 'R'],
  ]],
  ['Results & exports', [
    ['On-screen results', true, true, true, true, 'R'],
    ['CSV export', true, true, true, true, 'R'],
    ['Excel banner book', false, true, true, true, 'R'],
    ['PowerPoint and SPSS export', false, false, true, true, 'R'],
    ['PDF and Word reports', false, false, false, 'Coming soon', 'R'],
  ]],
  ['AI & seats', [
    ['AI Survey Assistant', false, false, false, true, 'R'],
    ['AI credits per month', '200', '500', '1,500', '4,000', 'Scoped'],
    ['Seats', '1', '3', '10', 'Unlimited', 'Scoped'],
  ]],
];

// Brief §12: other platform features
const extras = [
  ['users', 'Multi-client accounts', 'Run several clients from one account, with support staff assigned per client.'],
  ['bolt', 'In-app support chat', 'Chat with our team inside the platform, with unread alerts and notifications.'],
  ['wallet', 'Invoicing & usage billing', 'Invoicing with CSV export, and usage-based billing.'],
  ['shield', 'Self-registration', 'Sign up yourself; accounts are activated after admin approval.'],
  ['target', 'Live polling for events', 'QR-code voting with PIN-protected judges, and results export.'],
  ['doc', 'In-app user guide', 'Step-by-step help inside the platform.'],
];

const useCases = [
  ['Multi-market tracker', 'Several markets, several waves', 'A parent project with child markets keeps the questionnaire in sync. Each new wave is created as a child project with its surveys, allocations and translations, and the report runs wave over wave.', 'No more rebuilding the study from scratch every wave.'],
  ['Healthcare study', 'Professionals and patients', 'Healthcare Professionals and Patients are audience categories of their own. Feasibility shows the target universe, the online share and a confidence label before anything is promised.', 'No more selling a study the sample can\'t deliver.'],
  ['In-house insight team', 'Concept tests, on demand', 'Price the study, build it from a template, field it through Opinion Genie and partners, and read the built-in concept-test report, all in one project.', 'No more agency set-up fee on every small test.'],
];

module.exports = { DIY_URL, modules, methodologyTotal, methodologies, qualityChecks, security, plans, compare, extras, useCases };
