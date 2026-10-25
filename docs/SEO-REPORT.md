# EndoCalc audit and implementation

Prepared 22 October 2026 from the supplied HTML. Planned domain: `homacalculator.com` (purchase and DNS connection remain with the owner).

## What the original draft needed

| Finding | Resolution |
| --- | --- |
| HOMA1 equations presented as a HOMA2 engine | Relabelled HOMA1; separate guide and link to official Oxford HOMA2 software |
| Fixed C-peptide-to-insulin multiplier | Removed; C-peptide has a unit converter only |
| Universal risk bands and treatment recommendations | Removed; interpretation guide describes limitations and relevant assessment |
| Initial unit labels inconsistent with displayed values | Blank inputs and explicit units; changing units preserves concentration |
| Fake EHR success alert and unsubstantiated CE/HIPAA wording | Replaced with real clipboard/print actions; removed claims |
| Invalid nested H1/H2 and limited topic coverage | One H1 per page; dedicated calculator routes and supporting articles |
| Missing metadata and crawl discovery | Unique titles/descriptions, canonical URLs, sitemap and robots file |
| Sparse FAQ coverage | 45 original answers mapped to common search themes and linked sources |
| External references lacked consistent link policy | Requested nofollow plus noopener/noreferrer for every external reference |
| No domain or author/reviewer evidence | Planned domain configured; honest editorial status, no invented medical credentials |

## Search intent map

| Page | Primary intent | Supporting questions |
| --- | --- | --- |
| `/` | HOMA-IR and metabolic calculator overview | Which tool should I use? |
| `/calculators/homa-ir-calculator/` | Calculate HOMA-IR | Formula, normal range, HOMA-%B |
| `/homa1-vs-homa2/` | HOMA2 calculator / model comparison | Oxford software, C-peptide input |
| `/calculators/quicki-calculator/` | QUICKI calculation | Log base, units, sensitivity direction |
| `/calculators/tyg-index-calculator/` | TyG calculation | No insulin assay, equation conventions |
| `/calculators/hba1c-eag-calculator/` | A1c to average glucose | 7% example, reverse estimate |
| `/calculators/glucose-unit-converter/` | mg/dL to mmol/L | Factor of 18 |
| `/calculators/insulin-unit-converter/` | Insulin pmol/L to µIU/mL | 6 vs 6.945 |
| `/calculators/c-peptide-unit-converter/` | C-peptide unit conversion | ng/mL, nmol/L, pmol/L |
| `/calculators/hba1c-unit-converter/` | A1c % to mmol/mol | NGSP/IFCC equation |
| `/calculators/bmi-calculator/` | Adult BMI in kg/lb and cm/inches | Screening limits, adult age scope |
| `/calculators/waist-to-height-ratio-calculator/` | Waist-to-height ratio | Measurement technique, consistent units |
| `/guides/` | Learning library | Normal HOMA ranges, test comparison, preparation |
| `/faq/` | Question-led informational searches | Fasting, PCOS, symptoms, model limits |
| `/interpretation/` | Understand calculator results | Sampling, comparison, diagnosis limits |

This map is editorial intent mapping, not measured keyword volume or a ranking forecast. Search-informed wording does not mean each question appeared in Google's live People also ask panel. See `RESEARCH.md`.

## Structured data and FAQ expectations

Pages include WebPage data; tool pages also include WebApplication and breadcrumb data. FAQPage markup mirrors the visible answers, including answers expandable without a login. Home and tool-page subsets match their own visible text.

Google stopped displaying FAQ rich results starting 7 May 2026. FAQ schema is retained as a semantic description, without promising Google FAQ snippets. [Google's official changelog](https://developers.google.com/search/updates).

No fake review ratings, doctor profiles, institutional affiliations or regulatory approvals are included. The medical content remains reference-linked educational content pending independent medical review.

## Links and backlinks

A citation from this site to a journal is an **outbound reference**, not an inbound backlink. An external publisher must choose to link to EndoCalc for it to earn a backlink. The website provides source pages, deep links and citation copy tools; `BACKLINK-PLAN.md` covers acquisition work that can follow public launch.

External references use nofollow because this was explicitly requested. Google does not require nofollow on ordinary editorial citations. Paid placements should use sponsored, and user-generated links should use ugc if those features are added later. [Google's link relationship guidance](https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links).

## Domain launch work

1. Purchase `homacalculator.com` and choose its canonical hostname; no availability or ownership claim has been made.
2. Connect DNS and HTTPS to the chosen hosting deployment. Preserve privacy of the existing preview until public publication is intended.
3. Obtain independent clinical review and publish only the actual reviewer identity/credentials with permission. Add a real correction/contact route when the owner supplies one.
4. Build with `SITE_URL=https://homacalculator.com SITE_INDEXABLE=true npm run build`. Deploy the resulting `dist/`.
5. Redirect HTTP and alternate hostnames to the selected HTTPS canonical origin.
6. Verify that every public page returns HTTP 200, canonical tags match, robots permits crawling and noindex is removed only on the intended public version.
7. Verify the domain in Google Search Console and submit `/sitemap.xml`. Request indexing of the homepage and key tool pages.
8. Check mobile usability, actual field performance and Search Console query reports after traffic arrives. Use observed queries to prioritize further FAQs.

No messages, directory submissions, external backlinks or public-domain configuration were performed. No rankings, search traffic or rich-result display are guaranteed.

## Continued expansion

The site now has 23 content pages, ten tools, 45 FAQs and 15 references. Three new guides answer the range, test-comparison and fasting-preparation intents in depth, with contextual links to tools and sources. Guide pages include linked tables of contents and hierarchical breadcrumb data.

Form submission is disabled until JavaScript initializes, preventing the browser’s default GET submission from exposing lab values in URLs when scripting is off. FAQ hashes reveal their target even when a search or category filter would hide it. Public and private build modes are tested independently, and public builds require an HTTPS canonical origin.

Validation: 22 automated math/content/build checks and 11 browser checks passed. Browser checks include automated WCAG 2 A/AA rules on representative mobile pages; this is not a complete accessibility certification.
    