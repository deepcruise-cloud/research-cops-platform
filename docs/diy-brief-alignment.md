# Website vs. DIY product brief (22 Oct 2026)

What changed on the website so it matches "Research COPS DIY — Product Reference for the Website", and what's still open.

## Section 9 fixes (all done)

| Claim on the site | Now |
|---|---|
| "22 methodologies" | "24 methodologies, each with a built-in report", everywhere (header, platform, pricing, About, homepage, Genie) |
| API code sample, `api.researchcops.com`, OAuth, webhooks, 99.9% SLA | Homepage API section is now "Sampling API · Early access, request access", with no code and no SLA. It lists only the integrations the product has today (partner API, redirects, link pools, recontact, exports). The automation add-on no longer claims a 99.9% SLA or OAuth. |
| "AI-written open ends" reviewed | "Poor-quality and gibberish open ends flagged, then reviewed by a researcher" |
| "Right-to-erasure workflow" | "Data-subject requests handled on request" |
| "Failed CAPTCHA" | "Our own human-verification check, not a third-party CAPTCHA" |
| 2M+ panelists, 300+ attributes, 95% bid response, regional/age splits | Removed from every page and from Genie. Homepage stats are now 44 market profiles · 70 audience types · 33 question types · 24 methodologies. The panel-split section is replaced by a Feasibility showcase (market → target universe → online share → completes, 8 audience categories, geography down to postal codes). |
| "Translations in 25+ languages" | Kept only for Managed Services. The platform says "multi-language surveys". |
| ERP / GraphQL / middleware insights | The insights page intro and sidebar are rewritten. The homepage shows the research article cards. The **live feed is in admin**: see `docs/insights-content-for-admin.md`. |

## Pages rewritten from the brief

- **Feasibility & Costing:** inputs; 44 market profiles; 70 audience types in 8 categories; 90 targeting questions; CPI and range; feasibility range (worst to expected); field time; assumed IR and conversion; confidence band; target and online universe with Measured / Anchored / Indicative labels; geography down to postal codes; create a study from a quote.
- **Survey Builder:** all 33 question types grouped; logic and flow; quotas; preflight, preview and LOI; library, templates and themes; the AI assistant (Sigma, uses AI credits, advisory). No mobile builder app is claimed.
- **Sample Collection:** Opinion Genie plus API-integrated and redirect partners; launch-readiness check and soft launch; field monitor; pause and resume; postback-failure alerts; quotas; trackers and waves; recontact; client link pools; multi-market; reconciliation; field test page.
- **Translation:** a version per language; machine translation on our servers with an optional AI provider; localised respondent screens; right-to-left support. No "Approved" workflow (the hero animation now shows "Localised").
- **Data Processing & Reporting:** cleaning rules; derived variables; RIM and cell weighting with trimming and diagnostics; pooled multi-wave crosstabs; automated insights; open-end quality checks & framework (the term "open-end coding" is no longer used, at your request); confirmed exports only. PDF/Word appears only on Sigma, as "coming soon".
- **Methodologies:** 24 in total. The 22 named designs are listed in Pricing (6), Product (10) and UX/CX (6). NPS is noted as a question type.
- **Security & data quality:** the 7 link checks; cleaning rules; consent screen; 2FA (TOTP and password OTP); SSO via OpenID Connect; roles; audit log. "Designed for GDPR and CCPA", never "certified". Dedicated-instance, data-residency and "agreements in product" claims are removed.
- **Pricing:** cumulative plan contents, AI credits and seats exactly as in section 10. The compare table only shows what the brief states. A new "Included in the platform" grid covers section 12. Removed: projects and responses limits, own-domain/white-label, annual discount, support tiers.
- **Panel & sample companies:** rebuilt around the real partner integration (API target groups, redirects, reconciliation). No white-label or self-serve-quote claims.
- **Sign in:** removed (30 Oct 2026). All links and redirects to https://diy.researchcops.com have been taken out of the public site — the header/mobile "Sign in", the platform-hero "Already have an account?" line, the pricing "Already a customer?" line, the Genie "Sign in" link and the account-FAQ link. `DIY_URL` has been removed from `build/platform.js`. The diy subdomain's DNS/hosting is untouched (see `deploy/`). To restore sign-in later, re-add `DIY_URL` and the links.

## Open questions for the product team

1. **Two unnamed methodologies.** The site says 24 and lists 22 by name. What are the other two?
2. **Universe labels.** The site describes Measured as "highest confidence", Anchored as "built on a firm reference" and Indicative as "a directional estimate". Please confirm or correct these.
3. **"Core product methodologies" on Alpha.** Which ones exactly? The compare table currently shows this at group level only.
4. **Panel figures (2M+, 300+ attributes, 95%, splits).** These are on hold until the panel team confirms a source.

## Needs editing in admin (not in the site code)

- **Insights blogs, news and polls:** paste the replacements in `docs/insights-content-for-admin.md` into admin, keeping the same IDs.
- **Footer description** (admin → settings → footer): it currently says "2M+ verified panelists globally". Replace it with something like *"Research Centric Ops. One platform and one team for every step of a research project, from feasibility and sample to data and reporting."*

## Kept as managed-services claims (from the original app site, not the platform)

25+ translation languages, "up to 40% fewer drop-offs", 98% client satisfaction, same-day feasibility, 48–72 hour consumer fieldwork, white-label fieldwork for agencies. Please confirm these with the ops team before launch.
