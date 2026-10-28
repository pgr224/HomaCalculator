# EndoCalc

A dependency-free static website at runtime, built from the supplied EndoCalc draft. Planned public domain: **https://homacalculator.com**. The current private preview deliberately emits `noindex,follow`; the domain is not purchased or connected by this project.

## Run

```sh
npm ci
npm run build
npm test
npm run test:browser
npm run serve
```

Open http://localhost:4173. Serve the `dist/` directory; ES modules need HTTP rather than opening an HTML file with `file://`.

Browser tests currently use `/usr/bin/google-chrome`. On another system, update `playwright.config.mjs` to the installed Chrome path or use Playwright's installed Chromium. No browser or test dependencies are shipped to visitors.

## Included

- 23 static content pages; 10 calculator/conversion tools.
- HOMA2-IR, HOMA2-%B and HOMA2-%S; QUICKI; TyG; HbA1c ↔ eAG; glucose, insulin, C-peptide and HbA1c unit conversions; adult BMI and waist-to-height ratio.
- 45 original FAQ answers, search, category filters and permanent answer links.
- HOMA1/HOMA2 comparison, interpretation and physiology guides, plus a learning library with three focused articles.
- 15 research/official references with requested nofollow and new-tab protection.
- Result clipboard export and print/PDF; source citations and clean share links.
- Page titles, descriptions, canonical URLs, Open Graph metadata, social image, JSON-LD and XML sitemap.
- Local-only calculations: no storage, analytics or EHR integration.

## Files

- `src/content.mjs`: calculators, FAQs and references.
- `src/guides.mjs`: learning-guide content and cross-links.
- `src/calculations.mjs`: pure math and unit conversions.
- `src/app.mjs`: form validation, calculation UI, FAQs and copy actions.
- `src/styles.css`: responsive design and print view.
- `scripts/build.mjs`: static pages and metadata.
- `docs/SEO-REPORT.md`: draft audit, completed changes and public launch steps.
- `docs/RESEARCH.md`: search provenance and primary sources.
- `docs/BACKLINK-PLAN.md`: link acquisition plan and draft outreach text.

## Public domain launch

After purchasing and connecting the domain, verify which hostname will be canonical (this project defaults to the non-www hostname). Build for the public origin:

```sh
SITE_URL=https://homacalculator.com SITE_INDEXABLE=true npm run build
```

Deploy `dist/` with HTTPS and redirect the alternate hostname to the canonical hostname. Confirm the public pages have `index,follow` and self-referencing canonical links, then submit `https://homacalculator.com/sitemap.xml` in a verified Search Console property. Do not enable indexing on duplicate previews. The default development build returns to `noindex` intentionally.

The included private Sites deployment preserves owner-only access. Switching an existing Site to a public audience is a separate hosting setting; changing this environment variable only changes HTML metadata.

## Medical scope

The browser calculator implements the nonlinear total-insulin model based on Oxford University’s HOMA2 equations and model data, checked against 441 cases from the Oxford validation workbook. HOMA1 equations remain explanatory comparisons only. The implementation accepts glucose and measured total insulin, with selectable conversion factors 6, 6.945 and 6.95 (default), and does not calculate HOMA2 from C-peptide. HomaCalc is independent of the University of Oxford. There is no universal HOMA cutoff, no medication recommendation engine and no claimed medical certification. The content has not undergone independent medical review.

## Continued expansion validation

The current suite has 22 calculation, content and build checks plus 11 browser checks. It covers all ten examples, metric/imperial equivalence, invalid and overflowing numeric inputs, FAQ filter/deep-link interaction, forms without JavaScript, clipboard export, mobile layout and automated WCAG checks on representative pages. Private and public build metadata are checked in isolated temporary directories. Automated accessibility checks are not a substitute for a complete manual accessibility audit.
