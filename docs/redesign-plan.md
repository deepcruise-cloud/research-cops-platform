# Research COPS redesign: audit and proposed sitemap

Branch: `redesign/premium-b2b-site` · Status: **awaiting your sitemap approval**

## 1. What the deck changes

The client deck describes **Research Centric OPS, a SaaS platform**: six modules on one project record, 22 built-in methodologies, and five plans (Alpha $150 to Sigma $1,999/mo, plus Custom from $49). The current sites only present Research COPS as a services company. The new site has to sell two things side by side, so every page should make clear which one it is selling:

| | **Platform** (self-serve or licensed) | **Services** (we run it for you) |
|---|---|---|
| Buyer | Agencies, in-house insight teams, panel companies | Agencies, brands, startups, advertisers |
| Offer | Feasibility & Costing, Survey Builder, Sample Collection, Translation, Data & Reporting, Research Centre | Sampling, design, programming, translation, DP, reporting, project management |
| Main CTA | Book a live-brief demo / start a pilot | Get a quote / estimate CPI |

## 2. Repo audit (`company-website`, deployed on Vercel)

**Keep, restyle only:**
- `index.html` homepage sections, including the CPI estimator, demographics, API and the Calendly booking. These become the new homepage.
- `insights.html` + `insights.js`. This is the **admin-driven** blog, news and polls page, reading from Firestore. I keep the data layer and restyle the shell. My static draft articles become seed content you can publish through admin instead.
- `policy.html` + `policy.js`. Admin can override the policies in Firestore, so I keep this engine.
- The Support Genie widget and the cookie banner.

**Do not touch (as instructed):** `admin.html`, `admin.js`, Firebase auth and config, Firestore collections (`leads`, `blogs`, `news`, `polls`, `settings`, `policies`), Calendly.
- Every new form writes to the **same `leads` collection with the same fields**, so leads keep showing up in admin.

**Replace:**
- `solution.html?id=…` becomes one clean page per service (`/solutions/online-sampling/`, and so on). The old URLs get 301 redirects in a new `vercel.json`, so existing links keep working.
- The header and footer are currently copied by hand into 4 files. They become one shared header and footer.

**Workflow automation:** `workflow-hub.html` is a separate "DeepSight Insights" product (HRMS, payroll, finance). It will be listed under **Solutions → Enterprise workflow automation (add-on)**.

**Clean up (not committed, needs your OK to delete):** 10 one-off dev scripts (`check_*.js`, `search_*.js`, `extract_styles.js`, `generate_logos.js`), `node_modules/`, and `server.js` (local only; Vercel doesn't use it).

**Issues found (outside the admin, so for you to decide):**
1. ⚠️ **The admin fallback password is visible in public JavaScript** (`admin.js:433`, `admin.js:437`). Anyone can read it. I won't change admin without your OK, but I recommend removing the fallback and relying only on Firebase Auth.
2. Leads are written to Firestore from the browser, so the **Firestore security rules** decide who can read them. They should be checked in the Firebase console.
3. Workflow-hub leads go only to the visitor's own browser (`localStorage`), so **they never reach admin**.
4. `og-image.png` is missing, the workflow-hub favicon points to a URL outside the repo, and the canonical URLs mix `researchcops.com` and `app.researchcops.com`.
5. Insights depends on the free rss2json API for the TechCrunch and VentureBeat feeds.

**Country count:** changed from 31 to 44 in `index.html`, `solution.js` and `policy.js`. The default privacy text in `admin.js` still says 31, because admin was off-limits. Live policy text stored in Firestore must be edited in admin.

## 3. Proposed sitemap

```
/                         Home: platform + services, CPI estimator, proof, quote
/platform/                Research Centric OPS overview (one record, six modules)
  /platform/feasibility-costing/
  /platform/survey-builder/
  /platform/sample-collection/
  /platform/translation/
  /platform/data-reporting/
  /platform/methodologies/   22 study designs
  /platform/security/        access control, SSO, agreements (procurement page)
/pricing/                 Platform plans + compare table + fieldwork CPI estimator
/solutions/               Managed research services
  /solutions/online-sampling/ … (7 services, already drafted)
  /solutions/workflow-automation/  → enterprise add-on (links to workflow-hub)
/who-we-serve/            Agencies · Brands & insight teams · Startups · Advertising & media · Panel & sample companies (new, from deck)
/insights/                Admin-driven blog/news/polls (restyled)
/about/  /contact/  /privacy/  /terms/  /cookies/   (policies stay admin-editable)
/workflow-hub.html        Unchanged product page, restyled header only
/admin.html               Unchanged
```

Main navigation: **Platform ▾ · Solutions ▾ · Who we serve ▾ · Pricing · Insights · About** · [Sign in] · [Book a demo]

## 4. Decisions (22 Oct 2026)

- **Domain:** build and review on localhost first. After approval, move the site to **www.researchcops.com**, with 301 redirects from the old www URLs.
- **Pricing:** show the plans (Alpha, Beta, Gamma, Sigma, Custom) and the compare tables, but **hide the prices**. Each plan gets a "Talk to sales" button.
- **Countries:** **44** everywhere. The 30-market rate-card figure is not mentioned.
- **Workflow automation:** rebrand from DeepSight Insights to **Research COPS Workflow Automation**. The dashboard demo inside stays functionally the same.
- **Open:** the URL for the platform's **Sign in** button.

## 5. Build order after approval

1. Shared design system, header and footer in the repo; restyle insights, policy and workflow-hub shells.
2. Homepage rebuilt on the existing Firebase lead capture and Calendly.
3. Platform pages and Pricing, built from the deck.
4. Service and audience pages (ported from the draft), plus redirects for the old `solution.html?id=` URLs.
5. QA (desktop and mobile, links, forms writing to `leads`, SEO, accessibility), then a **Vercel preview URL** for your sign-off.
