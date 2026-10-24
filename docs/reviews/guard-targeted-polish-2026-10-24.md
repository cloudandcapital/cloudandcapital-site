# Cloud Cost Guard: October 24 afternoon targeted recheck

Status: implementation checks pass locally; Guard PR41 browser/print verification and release are pending. Replace this status with observed release facts before publication.

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

Local Guard checks: 216 frontend tests, 17 pipeline tests, 11 actual native/WebAssembly parity cases and optimized production build pass. New regressions cover recognized labels, vendor fees plus separate refunds, exact-decimal coincidences, bounded review details, dated findings, natural period labels and future phrasing. Existing PNG references, masks, thresholds and skips are unchanged.

BROWSER_AND_PRINT_PENDING

## Delivery and matching guide

APP_AND_GUIDE_DELIVERY_PENDING

The guide documents the warning's flat/same-window/three-row scope, manual confirmation, dated spike and forecast limits. It keeps the existing actual screenshot and approved homepage. Local site tests/build are recorded at release; Astro telemetry is disabled for the build.

## Acceptance and next useful work

This is a targeted repair release, not certification of current customer AWS/Azure/Google exports, full account/invoice coverage, arbitrary/localized formats, provider manifests, Safari/Firefox/screen readers, physical paper or Chrome's print-dialog UI. CI places fixtures in real file controls and uses Chromium's print engine on the actual downloaded HTML. It does not certify an OS file-picker dialog. Prior public FOCUS/Gzip and Microsoft EA-prefix evidence remains valid. No private bill was used.

A small Ask Lumen link near Findings remains a useful later usability candidate. Existing source-file coverage acceptance remains open. Preserve the existing Morning Scan and specialist-audit scopes, schedules and historical cutoffs; no separate queue or automation is created here.

Any next independent retest should cover only the new summary/fee/forecast/date/writing cases and distinguish unverified coverage from reproduced bugs. The six-item pass in the supplied audit remains recorded.
