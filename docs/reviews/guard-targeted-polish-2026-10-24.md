# Cloud Cost Guard: October 24 afternoon targeted recheck

Status: the six earlier independent checks remain passed. The remaining targeted defects are repaired in Guard PR41, merged as b9846cd64be78b6eadf96ea5bbefa5e115355da6. Final strict CI passes and the public app is verified. The matching guide changes are in site PR86; its public delivery is confirmed in the canonical closeout after merge.

Diana supplied the full independent audit attachment. Its latest targeted section is the current verdict: all six requested checks pass live at Guard main 0a81125. Earlier write-ups remain historical. This follow-up addresses the remaining reproduced defects without reopening already-passed controls or treating untested provider/device coverage as a defect. No connected Claude review ran.

## Remaining findings and changes

| Finding | Response and boundary |
| --- | --- |
| Service total still doubles a bill | Reproduced the old producer at 974baf7: four rows became USD259.20. Billing-label grammar now recognizes service/monthly and currency/tax-qualified summaries, including every new label in the audit. Real Total business names remain valid. |
| A sum match could catch unknown summaries | A possible-summary warning identifies a matching row in a flat same-window simple CSV with at least three counted rows. It is visible beside the headline and in bill checks, local Lumen, printed HTML and exact evidence. All records and amounts remain included. A numerical match is not proof of a summary, so valid coincident charges are not rejected or silently removed. Details are capped at five while the full count remains available. |
| Vendor-prefixed card fee is blocked | Strip only the credit-card-fee phrase before checking credit/refund/discount words. Stripe credit card fee and Credit card fee (Stripe) stay positive; a separately named positive refund or credit still stops. No sign is guessed. |
| Forecast phrasing misses the limit | Going-to estimates and next-quarter/year questions now reach the explicit no-forecast answer. Supplied-month lookups remain separate and retain the provided dates and coverage caveat. |
| Spike has no date and uses system wording | The billing adapter names the day/service and explains the existing observed amount, trailing median and change, with a next step for that day's charges. Metric values, IDs, severity and detector thresholds are unchanged. Generic CCAC output is preserved. |
| Singular pronouns and awkward period answers | Google/FOCUS singular notes use its/it; full supplied months are named naturally. Partial-month periods keep their actual dates and are not presented as full-month coverage. |
| Print body is small | Body text increases from 10px to 12px, with supporting type adjusted. Actual A4/Letter output is checked with backgrounds off; final observations follow below. |

## Source ownership and validation

FinOps Lite PR30 merged as 20134835a613bea2df324ec89a063769cab5d6fe after CI40129127644 passed. Local source tests: 194 passed and one existing release-validation skip. Watchdog PR12 merged as 182817d691c5fe79dd534aced000a66ee4601190 after CI40129147985 passed; 99 local tests pass. Its pinned billing dependency remains compatible; no dependency or detector update was needed.

Guard uses the official source sync. The two other producer pins remain clean and unchanged: Command Center 0e5b27eda8fc3b427375e6bb11c990a176b59d4c and released CCAC 6bf2e0c617536260a279fb53cc07b98f844e4a8a. A newer Command Center main was observed and deliberately not substituted for the app's existing reviewed pin.

Local Guard checks: 216 frontend tests, 17 pipeline tests, 11 actual native/WebAssembly parity cases and optimized production build pass. New regressions cover recognized labels, vendor fees plus separate refunds, exact-decimal coincidences, bounded review details, dated findings, natural period labels and future phrasing. Masks, comparison thresholds and skips are unchanged. Only the desktop/mobile billing-Lumen reference images were reviewed and updated for the expanded forecast-limit sentence. Their first and repeat captures are pixel-identical; no other references changed.

The initial browser run (CI40129818837 at b08a1ba) passed the new warning, forecast, dated-spike and print cases. Its five failures were two stale Lumen reference images and three old spike-title assertions. The final change updates those expectations and singular anomaly wording. The repeat frontend suite still passes all 216 tests. The strict final run, CI40131116133 at 75c3dbf1086690722f5879bcd76ac360fc149eae, passes both jobs: 174 first-pass browser checks, 14 existing skips, no failures, retries or flaky results. It also passes 216 frontend tests, 46 API checks, 17 billing-pipeline checks, 11 native/WebAssembly parity cases, transport checks, optimized build and production mount.

Actual downloaded report HTML was printed with Chromium, backgrounds off, on A4 and Letter. Both PDFs are two pages; all four rendered pages were inspected. The larger body text is readable, columns fit and the red invoice-gap warning is on page one. This is the print engine, not Chrome's print-dialog UI or physical paper. A4 SHA256: 3870915c4bcf4d4c9a56fce658bd5fa3b3b6c4189c011549a31a8922344f8b5e. Letter SHA256: db22f61990b5af9c034cbadf90a8d2e529bc0859d9f3480c97c2e988386f4a6a.

The possible-summary desktop/tablet/mobile views were checked for warning visibility, included-row wording and readable layout. Desktop Lumen reference SHA256: 3db52c56abb4a820bedb5e7c56f7258f5ecc442f8da8014fca046c7502077b75. Mobile: b7a1af13fa2153fec4f789201014131caa95fe905168d77045f91ddbc6062ba9.

## Delivery and matching guide

Guard PR41 merged as b9846cd64be78b6eadf96ea5bbefa5e115355da6. Its Vercel production commit status succeeded. Fresh public HTTPS runtime provenance matches all four reviewed clean pins. The live quick example returns exact net USD1310.125 and delta USD313.525 with zero checked service series. Both newly covered forecast questions give the explicit future-cost limit; a supplied September answer uses natural month wording and the coverage caveat. Reset returns to an empty upload screen with Review disabled. The merged app tree is exactly the strict-tested tree.

Site PR86 contains the matching guide, this review and Guard-only quality/provider status updates. Its Vercel build is the publication gate; the public guide is checked after merge. No homepage or other-app file changes are included.

The guide documents the warning's flat/same-window/three-row scope, manual confirmation, dated spike and forecast limits. It keeps the existing actual screenshot and approved homepage. All 138 local site tests and the production build pass with Astro telemetry disabled. This repository has no GitHub Actions workflow; Vercel status and actual public guide delivery are checked separately.

## Acceptance and next useful work

This is a targeted repair release, not certification of current customer AWS/Azure/Google exports, full account/invoice coverage, arbitrary/localized formats, provider manifests, Safari/Firefox/screen readers, physical paper or Chrome's print-dialog UI. CI places fixtures in real file controls and uses Chromium's print engine on the actual downloaded HTML. It does not certify an OS file-picker dialog. Prior public FOCUS/Gzip and Microsoft EA-prefix evidence remains valid. No private bill was used.

A small Ask Lumen link near Findings remains a useful later usability candidate. Existing source-file coverage acceptance remains open. Preserve the existing Morning Scan and specialist-audit scopes, schedules and historical cutoffs; no separate queue or automation is created here.

Any next independent retest should cover only the new summary/fee/forecast/date/writing cases and distinguish unverified coverage from reproduced bugs. The six-item pass in the supplied audit remains recorded.
