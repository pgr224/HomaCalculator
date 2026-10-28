# HomaCalc keyword and ranking opportunity audit

> Historical audit snapshot. The 28 October 2026 implementation and live deployment checks are recorded in [SEO-FIXES-2026-10-28.md](SEO-FIXES-2026-10-28.md). Earlier page/tool counts and launch tasks below describe the pre-fix site.

Research date: 28 October 2026. Site: https://homacalculator.com/. Scope: English-language organic search, with India-related intent sampled. US and India keyword metrics were requested separately. This is an analysis and publishing plan; website code and hosting settings were not changed.

## Recommendation

Build visibility around the site's existing HOMA2, insulin conversion, C-peptide conversion, TyG and QUICKI tools first. Develop a separately labelled HOMA1 calculator to compete for the broad “HOMA-IR calculator” intent. Broader A1c and glucose conversion searches are useful expansion targets, but have established specialist competitors. Do not make generic BMI the main acquisition strategy for a HOMA-focused site.

The best immediate advantage is precision: explain which model is calculated, show units and conversion conventions, publish reproducible examples, and make the implementation's validation evidence easy to inspect. Browser-only calculation and print/export are useful features, but competing tools already offer some of them.

**No keyword in this report is confirmed to have both high search volume and low organic competition.** The recommendations below are based on relevance, existing functionality, sampled competing pages and implementation effort. Numeric demand and difficulty validation remains outstanding.

## Evidence and limitations

- Inspected the live homepage, HOMA2 calculator, About page, robots.txt, sitemap, hostname responses and one nonexistent URL.
- Reviewed local content, templates and generated HTML across 23 content pages and 10 tools. Local link checks excluded outbound availability and did not constitute a full live crawl.
- Researched HOMA/HOMA2, QUICKI, TyG, lab-unit conversions, A1c/eAG, GMI, waist-to-height, TG/HDL, Matsuda and India test intent. Public search results are a discovery sample, not a country-specific Google position report.
- Ahrefs became available during the audit. Requested an overview for 34 keyword seeds in the US and India, including volume, global volume, keyword difficulty, traffic potential, parent topic and SERP date. Also requested site metrics for homacalculator.com. All three requests returned **“Insufficient plan.”** This is an account entitlement limitation; the connection itself is present. No keyword metrics or site traffic estimates were returned.
- After installation was explicitly confirmed, retried a minimal US request for just “homa ir calculator” with volume and difficulty, and checked Ahrefs' free subscription-information endpoint. Both again returned **“Insufficient plan.”** Reducing the request did not resolve access; no subscription tier or quota could be verified.
- Search Console impressions, clicks, indexed-page status, ranking history, referring domains and field Core Web Vitals were not available. A public `site:homacalculator.com` search returned no results in this tool; that does **not** establish that Google has indexed zero pages.
- Blank metric fields in the companion CSV mean unavailable, never zero. Global volume must not be presented as US or India volume. Search variants may overlap; do not sum them into a traffic forecast.

## Current site: confirmed strengths and gaps

| Finding | Evidence | Implication and action |
|---|---|---|
| Public site is reachable and permits indexing | Homepage returns 200; homepage, HOMA2 page and About contain `index,follow` and self-referencing non-www canonicals | Earlier private-preview notes are stale. Verify actual Google indexing in Search Console rather than removing an already-absent noindex |
| Discovery and static content are present | Live sitemap lists 23 URLs; robots.txt allows general crawling; calculator explanations exist in server-delivered HTML | Preserve this foundation. Submit/verify the sitemap in Search Console |
| Hostname duplication | HTTPS www homepage and www calculator return 200. HTTP www redirects to HTTPS www, which returns 200 | Redirect www paths permanently to the matching non-www paths. Canonicals already express a preference; redirects would reinforce it. This is not evidence of a ranking penalty |
| Googlebot is not explicitly blocked by the inspected robots file | General `User-agent: *` rule allows `/`; Googlebot has no separate disallow | No robots-level Google organic blocker was found. This does not verify every Cloudflare/WAF rule or Googlebot access |
| Several AI user agents are blocked | Cloudflare-managed robots rules disallow ChatGPT-User, Claude-User and Perplexity-User, among others | Review only if AI retrieval/referrals are desired. This is separate from ordinary Google indexing; do not remove crawler restrictions indiscriminately |
| Metadata foundation is sound locally | All 23 generated content pages have individual titles; no duplicate titles or missing local root-relative href targets found | Improve intent and wording; do not rebuild basic metadata that already exists |
| Homepage intent is indirect | H1 is “Make sense of your metabolic numbers”; homepage and calculator both contain the HOMA2 tool | Make the H1 describe the resource. Define homepage as a model/tool hub and the calculator URL as the detailed HOMA2 destination. Overlap is a potential issue, not proven cannibalisation |
| Broad HOMA-IR searches and implemented model differ | `/calculators/homa-ir-calculator/` computes HOMA2; sampled broad calculator pages commonly offer HOMA1 | Keep HOMA2 clearly labelled. Add a separate HOMA1 tool if targeting the original formula intent |
| Medical authorship is incomplete | About explicitly states no independent medical review; no named author, reviewer or correction contact is shown | Add real author information, an actual reviewer after review, review dates and a usable correction route |
| Some supporting explanations need more substance | Local comparison article is about 241 words and physiology article about 161; counts include article text, not global navigation | Add missing explanations and worked comparisons. These counts are descriptive, not minimum-word-count targets |
| Correct missing-page response | Tested nonexistent URL returns HTTP 404 | Preserve it; no soft-404 problem was observed for that sample |

Google recommends consistent canonical signals and permanent redirects for deprecated duplicates. [Canonical documentation](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

For health content, demonstrable expertise, accurate authorship, original work and trustworthy sourcing deserve substantial attention. E-E-A-T is not a single measurable ranking factor or a score that can be added with schema. [Google's people-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).

## Keyword-to-page plan

Priority reflects editorial judgment, existing assets and topical fit. “Focused” describes narrower intent, **not a measured low keyword-difficulty score**. All monthly volumes, traffic potentials and difficulty scores remain unavailable.

| Priority | Keyword cluster and examples | Target | Opportunity and competition evidence |
|---|---|---|---|
| P1 | homa2 calculator; homa2 ir calculator; homa2 insulin resistance calculator | Existing `/calculators/homa-ir-calculator/` | Strong product fit. Explain browser use, total-insulin input scope, outputs and validation. Oxford is an authoritative destination; do not frame HomaCalc as official |
| P1 | insulin pmol/l to uiu/ml; insulin uiu/ml to pmol/l; insulin conversion factor | Existing `/calculators/insulin-unit-converter/` | Focused lab-report task already supported. Put both conversion directions and conventions in visible content. Assay-aware examples can differentiate |
| P1 | c peptide conversion; c peptide ng/ml to nmol/l; c peptide pmol/l to ng/ml | Existing `/calculators/c-peptide-unit-converter/` | Focused converter intent already supported. Competing specialist converters exist; lead with the operation and a compact reference table |
| P1 | tyg index calculator; triglyceride glucose index calculator; tyg formula | Existing `/calculators/tyg-index-calculator/` | Good topical extension with a ready tool. Explain the two logarithm conventions and why published numerical scales cannot be mixed |
| P1 | quicki calculator; insulin sensitivity index calculator; quicki formula | Existing `/calculators/quicki-calculator/` | Ready specialist tool. Add a base-10 worked calculation, required units and a model-specific comparison with HOMA1/HOMA2 |
| P2 | homa ir calculator; homa calculator; insulin resistance calculator; homa ir formula | Proposed `/calculators/homa1-ir-calculator/` | Broader acquisition target, but requires a separately labelled HOMA1 tool. Sample includes MDCalc and numerous dedicated calculators. Do not assume this is an easy keyword |
| P2 | homa ir normal range; homa ir interpretation; homa ir cutoff | Existing `/guides/homa-ir-normal-range/` | Strengthen the existing page rather than creating several synonymous guides. Explain model, assay and study-population differences; no universal diagnostic chart |
| P2 | homa1 vs homa2; difference between homa ir and homa2 | Existing `/homa1-vs-homa2/` | Focused comparison intent with a useful differentiator: show the same sample through the two methods and explain why results differ |
| P2 | hba1c conversion; hba1c mmol/mol to percent; a1c percent to mmol/mol | Existing `/calculators/hba1c-unit-converter/` | Broader adjacent demand hypothesis. Competes with NGSP and specialist converters; add bidirectional unit wording and a useful conversion table |
| P2 | a1c to glucose; hba1c to average glucose; eag calculator; average glucose to a1c | Existing `/calculators/hba1c-eag-calculator/` | Distinguish population eAG estimates, measured A1c and CGM-derived GMI. Existing NGSP and Accu-Chek tools increase the quality needed to compete |
| P2 | blood sugar converter; glucose mg/dl to mmol/l; glucose mmol/l to mg/dl | Existing `/calculators/glucose-unit-converter/` | Accessible task intent. Always include “glucose” or “blood sugar”: generic mg/dL-to-mmol/L searches can concern different substances |
| P2 | fasting insulin vs hba1c; normal glucose high insulin; fasting glucose and insulin preparation | Existing two relevant guides, with one new focused guide only if justified | Expand useful explanations and link naturally to the correct calculator. Interpretative content needs actual clinical review |
| P3 | waist to height ratio calculator; waist height ratio in inches | Existing `/calculators/waist-to-height-ratio-calculator/` | Useful supporting tool, but the NHS already provides a dedicated calculator. Prioritise after the insulin-focused cluster |
| P3 | gmi calculator; glucose management indicator calculator; gmi vs a1c | Proposed GMI tool plus a focused comparison section | Logical gap beside eAG, with CGM-specific intent. Validate demand and original methodology before implementing; do not relabel reverse eAG as GMI |
| P3 | triglyceride hdl ratio calculator; tg hdl ratio mmol/l | Proposed TG/HDL tool | Closely related lipid/insulin-resistance topic. Different lipid conversion factors make the displayed ratio unit-dependent; show the convention explicitly |
| P3 | matsuda index calculator; ogtt insulin sensitivity index | Proposed research tool, later | Strong topical fit but specialist audience and more input complexity. An author-maintained calculator already exists; low apparent commercial saturation does not establish meaningful volume |
| Research first | tyg bmi calculator; tyg bmi index | Proposed extension, later | Reuses existing TyG and BMI concepts, but research visibility alone is not evidence of consumer search demand |
| Deprioritise as acquisition focus | bmi calculator; insulin resistance symptoms; diabetes calculator | Existing BMI/supporting content only | Too broad to be the first growth strategy. Validate demand, search intent and ability to compete before investing in general health publishing |

Do not create separate pages for every spelling, unit variant or individual laboratory value. Cover closely related variants on the same useful page. The CSV records candidate queries, not a recommendation to publish one URL per row.

## What competing pages show

| First-party source inspected | What it establishes | Practical response |
|---|---|---|
| [MDCalc HOMA-IR](https://www.mdcalc.com/calc/3120/homa-ir-homeostatic-model-assessment-insulin-resistance) | A dedicated calculator with clinical context and a named contributor | Broad HOMA intent needs more than a formula and keyword placement. Publish credible authorship and method-specific interpretation |
| [Oxford HOMA resources](https://www.rdm.ox.ac.uk/about/our-facilities-and-units/DTU/software/homa) | The original model's authoritative resource | Explain the independent implementation and scope precisely. Direct Oxford FAQ retrieval returned 403 in this audit; indexed Oxford material was available through search |
| [TestWell TyG calculator](https://www.test-well.com/tools/tyg-index-calculator) | Formula, units, a worked example, cited studies and an identified reviewer | Explain the scale convention clearly and make real review visible after it occurs |
| [CalcEngines QUICKI](https://calcengines.com/medical/diabetes-glucose/quicki-calculator/) | Detailed unit handling, base-10 working and comparison material | Add reproducible calculation steps and explain HOMA1 versus HOMA2 when comparing indices |
| [CalcEngines C-peptide converter](https://calcengines.com/medical/diabetes-glucose/c-peptide-unit-converter/) | Unit conversion plus contextual explanation | Improve immediate unit-specific answers and source-backed limitations. Do not imply C-peptide is measured insulin |
| [NGSP conversion tool](https://ngsp.org/convert1.asp) and [Accu-Chek A1c tool](https://www.accu-chek.co.uk/tools/hba1c-calculator) | Established specialist alternatives for A1c-related tasks | Differentiate with clear task selection, accessible mobile input and explanations of what each conversion means |
| [NHS waist-to-height calculator](https://www.nhs.uk/health-assessment-tools/calculate-your-waist-to-height-ratio) | A dedicated public-health tool for this query family | Treat this as supporting coverage; do not call the head term low competition |
| [Matsuda author's calculator](https://mmatsuda.diabetes-smc.jp/MIndex.html) | Existing OGTT-based tools with multiple sampling schedules | A future tool should identify the exact schedule and methodology, rather than infer missing measurements |

These are observed alternatives, not a measured list of the top ten Google results in India or the US. Backlink strength and keyword difficulty were not retrieved.

## Proposed search presentation

These are drafts for a later implementation. Retain current URLs unless Search Console evidence and a migration plan justify changing them.

| Page | Proposed title | H1/content direction |
|---|---|---|
| Homepage | HOMA Calculators: HOMA2, Insulin Resistance & Conversions \| HomaCalc | HOMA and metabolic health calculators; introduce model choice and link to the dedicated tool pages |
| Existing HOMA2 page | HOMA2-IR Calculator: Insulin Resistance, %B & %S \| HomaCalc | HOMA2-IR calculator; add a clear link to the HOMA1 alternative when available |
| New HOMA1 page | HOMA-IR Calculator (HOMA1): Fasting Glucose & Insulin \| HomaCalc | HOMA-IR calculator (HOMA1); the 405/22.5 approximation and supported units |
| Insulin converter | Insulin Converter: pmol/L to µIU/mL and Back \| HomaCalc | Insulin unit converter; show both directions, selected factor and why factors differ |
| C-peptide converter | C-Peptide Converter: ng/mL, nmol/L & pmol/L \| HomaCalc | C-peptide unit converter; provide a compact bidirectional table |
| TyG | TyG Index Calculator: Triglyceride–Glucose Index \| HomaCalc | Put the exact ln convention and required units close to the result |
| HbA1c units | HbA1c Converter: mmol/mol to % and Back \| HomaCalc | Separate unit conversion from A1c-to-eAG estimation |
| eAG | A1c to Average Glucose Calculator (eAG) \| HomaCalc | Make both calculation directions obvious; explain why one fasting glucose cannot produce a measured A1c |
| Normal-range guide | HOMA-IR Normal Range: HOMA1 vs HOMA2 Cutoffs \| HomaCalc | Start with the answer that no single cutoff applies universally, then explain the evidence |

Suggested HOMA2 description: “Calculate HOMA2-IR, beta-cell function and insulin sensitivity from fasting glucose and insulin. Includes unit options, a worked example and method limits.”

Titles should describe the actual page. Google can generate title links from several page signals; there is no guaranteed fixed-character formula. [Google title-link guidance](https://developers.google.com/search/docs/appearance/title-link).

## Highest-impact improvements

1. **Resolve host duplication and establish an indexing baseline.** Permanently redirect www to non-www while retaining paths and query strings. Check the sitemap and priority URLs in a verified Search Console property. Inspect the canonical Google selects. A clean public response is not proof of indexing.
2. **Give HOMA1 and HOMA2 distinct intent.** Keep the existing HOMA2 implementation accurately labelled. Introduce the original HOMA1 calculation as its own tool only when implemented and tested. Let the homepage explain the choice instead of competing as another detailed HOMA2 destination.
3. **Publish real expertise and reproducible methods.** Add owner/author identity, relevant credentials where true, a correction contact and actual medical review. Publish a validation-method page with model version, units, insulin factors, supported input scope and selected reproducible cases. The site's stated 441-case validation was observed in its content; this audit did not rerun that suite.
4. **Improve the existing pages before multiplying URLs.** Put a direct answer and the tool first, followed by steps, units, worked examples, limitations and relevant follow-up answers. Add tables only where useful. Strengthen the model comparison with paired examples and the normal-range guide with a carefully sourced, model-specific discussion of study populations.
5. **Make the specialist tool cluster easy to traverse.** Link HOMA2 to its comparison, interpretation, insulin conversion, QUICKI and TyG pages in the explanatory text. Link converters back to the calculation that needs those units. Use descriptive anchor text; avoid making every article link equally to every calculator.
6. **Earn relevant references through useful assets.** Publish an inspectable calculation/validation note and a carefully labelled embeddable tool if maintaining one is feasible. Approach relevant laboratories, educational resources and professional authors with a concrete useful resource. No outreach was sent. Outbound citations are not backlinks to your site, and blanket nofollow is not a ranking strategy. Existing link policy was preserved.
7. **Measure mobile experience before making performance claims.** The local runtime has no production dependency bundle, but that is not a Core Web Vitals result. Test representative pages on mobile and use field data when available. Keep form labels, unit controls and result actions accessible.
8. **Treat FAQs as useful answers.** Keep original, visible answers that resolve real questions. Do not spend the main SEO budget on FAQ schema: Google discontinued FAQ rich results from 7 May 2026. [Official documentation update](https://developers.google.com/search/updates).

## How to confirm high-volume, lower-competition opportunities

Use the 34 seeds and expanded query inventory in the companion CSV as the input, not as established volume data.

1. Retrieve country-specific 12-month average search volume, global volume, KD, parent topic, traffic potential and the SERP update date. Keep US and India difficulty scores separate.
2. As an initial editorial filter, test **500+ monthly searches and KD ≤20** for broader targets, and **100+ monthly searches and KD ≤20** for focused laboratory tools. These are proposed screening thresholds, not observed results or universal SEO rules. Smaller specialist opportunities can still be valuable.
3. Inspect the current top ten pages. Compare intent, source quality, model support, useful features and referring domains. Check whether smaller relevant pages can rank; low KD alone does not make a medical query easy.
4. Review whether searchers click external results or receive the answer directly in Search. A large search estimate is not a corresponding traffic estimate. Check country and date before comparing figures.
5. Group overlapping variants into page topics. Use parent topic as a clue, not an instruction to merge incompatible HOMA1 and HOMA2 tools.
6. Use Search Console to find existing relevant queries at roughly positions 8–30 with sustained impressions. Improve the matching existing page before commissioning another one. Do not use paid-ad “competition” as organic keyword difficulty.

The Ahrefs API plan limitation must be resolved, or a legitimate keyword export supplied, to complete the numerical screening. No upgrade or purchase is necessary to act on the confirmed technical and editorial findings.

## Suggested delivery sequence

| Stage | Work | Success evidence |
|---|---|---|
| First 1–2 weeks | Host redirect, Search Console baseline, intent map, truthful authorship/contact, HOMA2 and converter presentation | Redirects and canonicals agree; priority URLs can be inspected; one intended landing page per distinct task |
| Next 2–4 weeks | Strengthen existing TyG, QUICKI, conversion and comparison pages; prepare and validate HOMA1 if pursued | Working tools, method-appropriate examples, accurate review status, coherent internal links |
| Following 1–2 months | Select GMI/TG-HDL or another gap only after demand checks; publish validation assets and seek relevant editorial references | Query/page impressions, clicks and ranking trends; relevant earned links; no invented traffic target |

This is a work sequence, not a promise of when rankings will improve. Report non-brand clicks, impressions, query groups, landing pages and countries over comparable periods. Keep calculation inputs out of analytics. Top placement cannot be guaranteed by these changes.
