# Cloud Cost Guard: provider export layout follow-up

## Result and scope

Diana authorized the next provider-export validation pass and a later manual
Claude review. Two reproducible format gaps were repaired through the existing
FinOps Lite → Watchdog → released CCAC → Command Center pipeline:

- Microsoft's published EA FOCUS file uses valid UTC boundaries such as
  `2024-06-12T00:00Z`. Both the browser preflight and native producer previously
  rejected them because seconds were mandatory. Minute-precision UTC now works;
  missing timezones still require explicit confirmation and non-UTC offsets are
  not guessed.
- Google's current Cost table documentation says CSV downloads include invoice
  or statement header information. The reader previously treated that preamble
  as the cost table's column header. Recognized key-value document rows now stay
  separate from charges, with a limit of 32 nonblank metadata records. Unknown
  preceding records stop the file. Original CSV hashes and physical line numbers
  are preserved. Clear document currencies must match the user's confirmation.

Existing simple and FOCUS files retain arbitrary column order and additional
invoice dimensions. An invoice date never selects the reporting month, and an
invoice-header total never becomes a charge. Google's separate Cost table Total
control still must reconcile at two-decimal invoice precision. Header and footer
totals can describe different scopes; complete invoice coverage is not asserted.

FinOps Lite PR23 merged as `4a4764694aa48f4871973c698a239a36a5497190`.
PR24 preserves existing header orders and merged as
`8be01c196701fce47f6d09dae18374ab07f6e4bd`. Guard PR38 pins that final source;
Watchdog, CCAC and Command Center pins are unchanged. No financial pipeline fork,
cloud credentials, external billing upload or homepage redesign was introduced.

## Provider evidence

| Provider | Evidence in this pass | Limit |
| --- | --- | --- |
| AWS | Current official FOCUS 1.2 dictionary still contains the supported billed-cost fields. Existing historical public mixed-provider FOCUS/Gzip regressions remain enabled. | No current native customer download, CUR adapter or full FOCUS 1.2 conformance is certified. |
| Azure | The unchanged leading 1,000 and 5,000 records of Microsoft's published EA FOCUS 1.0 demo file pass without timestamp editing. All 96 original columns remain. | Demo records date from June 12, 2024. They are format evidence, not current customer/MCA/1.2-preview acceptance or a complete invoice. |
| Google Cloud | Official documentation establishes the document-header boundary. Invented BOM/CRLF contract data exercises that preamble, explicit month/currency, negative credits, taxes, adjustment, rounding and a checked Total control. | A separately sourced current customer Cost table CSV is still needed. Unknown/localized preambles and arbitrary nested BigQuery files are not newly claimed. |

The Microsoft v14 release was published April 29, 2026. Its tag and the inspected
current repository snapshot point to the same published LFS object:

- Repository snapshot: `8b393911e0b11c25839216d3cdf16c4bec32eae8`.
- Source: `src/open-data/dataset-examples/EA-Cost-FOCUS_1.0.csv`.
- Advertised full object: 204,354,862 bytes, SHA-256
  `9b192e205da384caecb627e8a4281a0229195d96a8be24bce66057b25c6a8603`.
- Only contiguous leading records were downloaded. The full object was not
  downloaded or independently hashed. Microsoft's MIT license and attribution
  are retained beside the 1,000-row regression fixture in both repositories.
- The Gzip wrapper is locally produced with mtime zero; it is not an authentic
  provider-delivered compressed download.

Independent totals use Python's CSV reader and Decimal with 60-place working
precision, then compare the actual Guard reader and complete native pipeline:

| Prefix | Expanded bytes | Positive USD | Negative USD | Net USD |
| --- | ---: | ---: | ---: | ---: |
| 1,000 records | 1,498,396 | 111.458936152662569 | -28.112752516262428 | 83.346183636400141 |
| 5,000 records | 7,484,574 | 1803.772050920521109 | -224.457347406110228 | 1579.314703514410881 |

Expanded SHA-256 values are
`5766878f44ac4a143a6c45c401ab2bd736876ca2ff70a290a82d25dd2344d6ed`
and `ea314dc4e75fb28c9e4df3a33f36cb026737c9ecc77fe024fb243201a1d6ae28`.
Both prefixes have no identical full rows. BOM, original timestamps, amounts,
unknown dimensions and line endings were not rewritten. Browser preflight's
decoded source hash matches the original bytes; canonical source hashes match.

The larger check is recorded in
`guard-published-export-results-2026-10-23.json`. Its real reader SHA-256 is
`ceb9d552d0a72d236f95406e279c2919f849b413a5b2a6c3779eda6fca3d1c15`.
The reusable read-only probe is `scripts/audit-guard-native-focus-export.mjs`:

```sh
node scripts/audit-guard-native-focus-export.mjs /path/to/guard /path/to/python /path/to/public-focus.csv
```

The Google document-header fixture deliberately supplies an October invoice date
and a header total of 999.00. Neither replaces the September reporting window or
exact USD 108.830007 charge sum. Its own Cost table Total remains USD 108.83;
six charge records and one Total control are counted separately from four
document metadata rows. Tests also cover missing confirmation, conflicting
currencies, unknown preceding charge rows and an oversized preamble.

## Validation and release

- Source producer: 131 tests passed, one existing release skip. All source CI
  jobs passed on Python 3.10/3.11/3.12, including quality, dependency audit and
  package smoke checks.
- Guard local: 188 frontend tests across ten suites, 15 pipeline tests, seven
  native/WebAssembly parity checks and optimized production build passed.
- Existing visual contracts remain enabled. Added a real-file Microsoft Gzip
  upload, report, downloaded JSON/source hash and clear-data browser case at
  desktop, tablet and phone sizes. The Google browser case now uses the document
  preamble and a typical long filename, retaining monthly-view and source checks.
- Final Guard CI run 40056229626 at
  `cf834ae98be2054f92e053a53ff409f1fe50935c` passed both required jobs and the
  Vercel preview. Browser results: 158 first-pass checks, 14 existing skips, and
  one unchanged legacy desktop Findings screenshot passed its configured retry.
  Its initial 37,457-pixel difference was not preserved by the failure-only
  artifact step because the job ultimately succeeded; cause is unestablished.
  It is not represented as a clean first pass. No image threshold or reference
  was changed. All new Google/Microsoft import cases passed on all three sizes.
  Prior run 40055666484 passed all 159 browser checks without a retry; the final
  source differs only in the upload-help heading.
- Nine final actual Google confirmation/monthly-report and Microsoft report
  images are byte-identical to the reviewed run at desktop 1440×1000, tablet
  768×1024 and phone 390×844. Artifact ID 12545269387,
  `provider-bill-browser-views`, 1,646,859 bytes, SHA-256
  `901254bcdcc799c5c19810b8f66d6ce4a0c9b9d0989fa5884bdb682b2a800e73`.
  Long filenames, exact values, field hints, monthly presentation and overflow
  were checked. Artifacts have seven-day retention.
- Guard PR38 merged as `c4d99d3b200cf61e9845e0d6ec8174bafdae5e33`.
  Its Vercel production status is successful. A fresh public HTTPS read confirms
  the updated export-help heading and `/billing-pipeline/provenance.json` matches
  all four reviewed source pins with `uncommitted: false`. This verifies delivery
  and provenance, not a new production bill-upload observation. No protected
  preview, team authorization change or cloud-account login was used.
- Website guide: 138 tests and a production build passed. The read-only probe
  ran successfully against the unchanged 5,000-row prefix; its later CSV-only
  input guard passed syntax validation. The homepage is unchanged.

## Remaining acceptance and Claude review

This pass improves evidenced file compatibility; it does not close current
native customer-export acceptance for all three providers. Real invoice/account
coverage, current AWS/Azure native downloads, a separately sourced Google Cost
table, localized layouts, fresh independent network capture, physical print and
real Safari/device checks remain distinct. Existing CUR, generic native Azure,
PDF, Excel, ZIP and Parquet limitations are retained.

Diana will paste a review brief into her Claude app after release. That review
should begin cold with the live tool and guide, independently reproduce money
and import checks, assess whether the result helps a visitor decide what to do
next, test mobile/download/clearing behavior, and compare a few relevant current
alternatives. Ask for reproduced defects separately from useful upgrades and
untested concerns. No Claude-connected service, edits or publishing are authorized
by the review brief. No review result is asserted before Diana supplies it.

Primary references:

- [Google Cost table CSV and header information](https://docs.cloud.google.com/billing/docs/how-to/cost-table), updated October 20, 2026.
- [Microsoft open data and EA demo-file description](https://learn.microsoft.com/en-us/cloud-computing/finops/toolkit/open-data).
- [Microsoft v14 release](https://github.com/microsoft/finops-toolkit/releases/tag/v14).
- [Pinned Microsoft source](https://github.com/microsoft/finops-toolkit/blob/8b393911e0b11c25839216d3cdf16c4bec32eae8/src/open-data/dataset-examples/EA-Cost-FOCUS_1.0.csv).
- [Azure FOCUS schema](https://learn.microsoft.com/en-us/azure/cost-management-billing/dataset-schema/cost-usage-details-focus).
- [AWS FOCUS 1.2 fields](https://docs.aws.amazon.com/cur/latest/userguide/table-dictionary-focus-1-2-aws-columns.html).
