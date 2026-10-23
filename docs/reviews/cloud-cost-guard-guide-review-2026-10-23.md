# Cloud Cost Guard companion guide review — October 23, 2026

## Scope

Added https://cloudandcapital.com/insights/using-cloud-cost-guard with two downloadable fictional bills, independently checked results, a useful next action, format/privacy explanations, and links to the tool and Technology Cost Review. Added directory/archive/sitemap discovery. Reused the actual uploaded-bill screenshot already approved on the homepage; replaced the directory's older sample-dashboard image. Corrected Signal Audit's screenshot height in the writing archive and added its missing sitemap route.

The approved homepage was not edited. The separately owned Cloud Cost Guard app was read and exercised, not modified. AI Cost Lens was not modified.

App source inspected: `cloudandcapital/cloud-cost-guard`, main `4d35b115c8b5179158087cb285896f8791544cd1`, including `docs/billing-upload.md`, public example CSVs/template, billing exports, and the uploaded dashboard. This is a dated guide/flow verification, not a claim that every app path has completed independent review.

## Real controls exercised

Opened https://guard.cloudandcapital.com/, expanded **What can I upload?**, downloaded both public example CSVs, selected them through the current/previous file controls, and ran **Review my bill**. Waited for the local analysis to finish. Used the resulting report, downloaded **Printable report** and **Evidence JSON**, opened **Lumen**, and chose **What changed?**.

The uploaded report displayed the expected totals, date ranges, service movements and period-length warning. Lumen identified the increase and largest driver without claiming to know the underlying cause. Its uploaded-mode label was **Local report guide**, with a disclosure that files/questions are not sent to an AI service. The separate **Try an example** sample/AI chat was not used for this walkthrough.

The HTML download was a real 3,945-byte report, contained the result and service records, and contained no script. The real JSON download contained current/previous records, the comparison, and pipeline evidence. Neither was substituted with a mock export. No actual paper print or browser-generated PDF was made.

## Independent arithmetic

Python Decimal calculations from the downloaded CSV bytes:

| Measure | Exact value | Displayed value |
| --- | --- | --- |
| September positive charges | 1362.375 USD | $1,362.38 |
| September credits | -52.25 USD | -$52.25 |
| September net | 1310.125 USD | $1,310.13 |
| August net | 996.6 USD | $996.60 |
| Net increase | 313.525 USD | $313.53 |
| Percentage increase | 31.4594621713827…% | 31.5% |
| API compute increase | 240.025 USD | $240.03 |

September covers 30 days; August covers 31. The percentage compares supplied period totals, not daily rates. Display amounts use half-up rounding. These are invented records, not client results or an actual AWS invoice. Service-level movement identifies where to investigate; it does not establish waste, savings, anomaly, or root cause.

## Guide and asset checks

- The guide's two CSVs are stable copies of the public app examples verified in this review. Both guide download controls produced byte-identical files through the browser.
- Current CSV: 470 bytes, SHA-256 `314b5ac646f998180301381506730dda580b03e77f95bc4d6f169ff1775e6556`.
- Previous CSV: 461 bytes, SHA-256 `7dd69d5b273a2e79ccbcb0aa4eae73cb81f3234baa3088586132bca6b68c7c6a`.
- Screenshot: existing `cloud-cost-guard-billing-preview.jpg`, actual uploaded example, 1232 × 541. It matches the current live result. The wide image is hidden on phones; native text/table retain the useful numbers at readable sizes.
- Reviewed desktop and simulated 375px/320px layouts. Actual inner widths were 360px/305px after scrollbars, with equal document scroll widths and no horizontal overflow. Reviewed headline breaks, buttons, table and closing service link. These are viewport checks, not physical-device tests.
- Guide explains supported FOCUS/simple CSV rather than claiming arbitrary CSV/PDF/Excel import. It distinguishes calculation reconciliation from completeness, and cloud records from separate AI/software/utilization data.
- The privacy description is consistent with the inspected uploaded-mode implementation and live disclosure. This turn did not repeat a full network-capture privacy audit or test the separate sample AI chat.
- Main-site suite: 138 tests pass, including an extended check that every directory companion route exists and appears in the sitemap. The Astro/Vercel production build passed.

Preview proof: `cloud-cost-guard-guide-review-2026-10-23.jpg`. Manual independent review brief: `cloud-cost-guard-claude-handoff-2026-10-23.md`.

## Still open

Independent Claude review; actual printed/PDF pagination; physical-device testing; and the Guard owner's wider format, malformed input, duplicate, limit, browser compatibility and privacy regressions. Do not reopen or overwrite app-owner work based only on older project notes. Existing specialist audit and Morning Scan schedules remain unchanged.
