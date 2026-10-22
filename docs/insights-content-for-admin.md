# Insights: replacement content for admin

The live Insights feed (Firestore `blogs`, `news` and `polls`, edited in `admin.html`) is about ERP, GraphQL middleware, HRMS and ledgers. The DIY product brief (section 9) asks for research topics instead. Paste these over the existing items in **admin.html**, keeping the **same IDs**, so the homepage cards (which link to `blog-1`, `blog-2` and `blog-3`) open the matching article.

Every fact below comes from the DIY product brief of 22 Oct 2026.

---

## Blogs

### blog-1
- **Title:** Targeting hard-to-reach B2B decision makers: what actually drives your CPI
- **Category:** Global
- **Read time:** 6 min read
- **Image:** keep the current image, or use https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600
- **Excerpt:** Incidence, audience, market and interview length explained, with a checklist to sense-check any B2B quote.
- **Content:**

B2B sample costs more than consumer sample because every targeting rule narrows an already specialised pool. Four things move the price, and each one is easy to argue about on its own.

**Market.** How reachable the audience is in that country. A thinner market costs more.

**Audience.** How common the audience is. Research Centric OPS has 70 audience types in 8 categories, from B2C and B2B to Healthcare Professionals, Patients, Education and Government, and the price reflects how rare each one is.

**Incidence rate (IR).** The share of invited people who qualify. Most bad quotes start with a bad incidence assumption. If you're not sure, share the screener criteria instead of guessing a percentage.

**Length of interview (LOI).** Longer surveys cost more, and more people drop out before the end.

A checklist for any B2B quote:
- Does it state the IR and LOI the price is based on?
- Is feasibility shown as a range (worst case to expected), not one number?
- Is there a field time per market?
- How confident is the estimate, and what is it based on?

In Research Centric OPS, Feasibility & Costing returns a recommended CPI, a CPI range, a feasibility range, a field time and a confidence label (Very Low to Very High) for each of 44 market profiles, in seconds.

### blog-2
- **Title:** Defending against survey fraud: fingerprints, speeders and behavioural signals
- **Category:** Tech
- **Read time:** 5 min read
- **Image:** keep the current image, or use https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=600
- **Excerpt:** No single check catches everything. Here are the layers built into every Research Centric OPS survey link.
- **Content:**

Bots, survey farms and professional respondents keep getting smarter. No single check catches all of them, so quality has to come in layers. These are built into every survey link in Research Centric OPS:

1. **Geo-IP country check.** The respondent must be in the target country.
2. **Proxy, VPN and hosting-IP blocking**, with limits on IP changes during the survey.
3. **Fingerprinting and duplicate checks:** unique link, unique IP, unique device. Previous respondents can be excluded across a project.
4. **Human verification.** Our own check, not a third-party CAPTCHA.
5. **Behaviour checks:** speeders, straight-liners, poor open ends and attention checks, with a 0–100 quality score per response.
6. **Device allow-list,** for mobile-only or desktop-only studies.
7. **Email authenticity check,** where email is collected.

After fieldwork, cleaning rules remove speeders, straight-liners, duplicates, partials, poor open ends and failed attention checks, and you can add custom rules. Every removed complete is tracked, so you can show your client exactly what was taken out and why.

### blog-3
- **Title:** Concept testing: a practical guide for marketers
- **Category:** Business
- **Read time:** 5 min read
- **Image:** keep the current image, or use https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=600
- **Excerpt:** Monadic vs. sequential designs, and the metrics that best predict launch success.
- **Content:**

Concept testing tells you whether an idea resonates with the people you want to sell to, before you spend money building or launching it. Done well, it also tells you why, and what to fix.

**Choose a design.** In a monadic test each respondent sees one concept: the cleanest read, but it needs more sample. In a sequential monadic test each respondent sees several concepts in rotated order, which works for comparing three to five options on a tighter budget. A comparative test shows concepts side by side to force a choice.

**Metrics that matter.** Purchase or adoption intent (the top-two-box score), uniqueness, relevance, believability and price-value.

**How many respondents?** For monadic tests, plan on at least 150 completes per concept per key segment.

In Research Centric OPS, Concept Test is one of 24 methodologies that come ready to field, each with its own built-in report.

### blog-featured
- **Title:** One platform: why the audience you price should be the audience you field
- **Category:** Tech
- **Read time:** 4 min read
- **Featured:** yes
- **Excerpt:** Re-keying the same study into four systems is where research margin quietly leaks. Here's the alternative.
- **Content:**

Most studies pass through six systems and four teams: a bid spreadsheet, supplier portals, a scripting platform, a translation vendor, a stats package and a deck rebuilt by hand. Every hand-off is a file, an email and someone waiting, and four chances to disagree with yourself about who the audience is.

Research Centric OPS runs the whole study on one platform. The audience priced in Feasibility & Costing is the audience screened in the Survey Builder, translated in Translation, fielded in Sample Collection and reported in Data & Reporting.

For trackers, each new wave is a child project with its surveys, allocations and translations already in place, and reports run wave over wave. For multi-market studies, a parent project keeps the questionnaire in sync across child markets and rolls the results up.

---

## News

| ID | Title | Details |
|---|---|---|
| news-1 | Feasibility & Costing covers 44 market profiles | Price and size studies across 44 market profiles and 70 audience types in 8 categories, with 90 targeting questions. |
| news-2 | Geography down to postal, ZIP and PIN codes | Target zones, states, metros, city tiers, counties, districts, or paste a list of postal codes, all within Feasibility. |
| news-3 | Questionnaire import turns programming notes into logic | Upload Word, PDF or Excel on the Sigma plan. Notes such as ASK IF, TERMINATE, SKIP TO and RANDOMIZE become real survey logic. |
| news-4 | 24 methodologies, each with a built-in report | From Van Westendorp and Gabor-Granger to CBC conjoint (with a market simulator), MaxDiff, TURF, card sorting and tree testing. |
| news-5 | Postback-failure alerts in the live field monitor | See completes, incidence and quotas per supplier, and get alerted when a supplier postback fails. |
| news-6 | Two-factor authentication and SSO | Accounts support TOTP two-factor authentication and single sign-on through OpenID Connect. |

---

## Polls (replace the ERP/HRMS polls)

| ID | Question | Options |
|---|---|---|
| poll-1 | What slows down your research projects most? | Waiting on feasibility and bids · Re-keying the study into several tools · Poor-quality completes · Building reports by hand |
| poll-2 | How do you price B2B studies today? | Spreadsheet rate card · Supplier quotes by email · Past similar jobs · A feasibility tool |
| poll-3 | Which methodology do you run most often? | Concept testing · Pricing research · MaxDiff or conjoint · UX research |
