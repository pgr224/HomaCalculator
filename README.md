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

- 17 static content pages; 8 calculator/conversion tools.
- HOMA1-IR, HOMA1-%B and reciprocal sensitivity; QUICKI; TyG; HbA1c ↔ eAG; glucose, insulin, C-peptide and HbA1c unit conversions.
- 33 original FAQ answers, search, category filters and permanent answer links.
- HOMA1/HOMA2 comparison, interpretation and physiology guides.
- 11 research/official references with requested nofollow and new-tab protection.
- Result clipboard export and print/PDF; source citations and clean share links.
- Page titles, descriptions, canonical URLs, Open Graph metadata, social image, JSON-LD and XML sitemap.
- Local-only calculations: no storage, analytics or EHR integration.

## Files

- `src/content.mjs`: calculators, FAQs and references.
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

The draft's HOMA1 formulas were incorrectly labeled as HOMA2. This version corrects that distinction, removes the fabricated C-peptide-to-insulin calculation, and links to official HOMA2 software. There is no universal HOMA cutoff, no medication recommendation engine and no claimed medical certification. The content has not undergone independent medical review.
