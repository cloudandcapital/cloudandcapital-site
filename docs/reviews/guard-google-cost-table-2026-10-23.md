# Google Cost table and FOCUS compatibility follow-up

## Result

Guard PR37 adds a supported English Google Cloud Cost table CSV path without
manual template editing. The visitor confirms invoice month and billing currency.
Unrounded cost is preferred; signed credit/tax/adjustment rows stay in the review.
A single Total control must reconcile at invoice precision and is excluded from
charges. The monthly view does not create daily spending or anomaly observations.
The source stays unchanged. Downloaded evidence records its hash, exact normalized
costs and confirmed context; it does not embed every original CSV column.

FOCUS records without ServiceName retain amounts under a flagged unassigned
label. Explicit BigQuery UTC timestamps and microseconds are preserved. These
changes use the existing FinOps Lite → Watchdog → released CCAC → Command Center
pipeline. FinOps Lite PR21 is merged as
`9a3faacdfe6040c6e569e875f7a3da581819db81`; other producer pins are unchanged.
Source PR22 is a documentation-only correction explaining exported source hashes
versus original CSV columns; it merged as
`33ab741f4669164eca9b905cd22f266e23db9e22`. It changes no pinned financial code.

## Evidence

- Producer: 118 tests passed, one existing release skip. All upstream CI jobs
  passed on Python 3.10/3.11/3.12, including quality, dependency audit and package
  smoke checks.
- Guard: 183 reader/interface tests, 14 pipeline integration tests, six
  native/WebAssembly parity tests and optimized production build passed.
- The unchanged public mixed-provider FOCUS fixture still passes. The new Google
  fixture is invented from documented English columns: six charge rows and one
  excluded Total row, exact net USD `108.830007`, rounded control USD `108.83`.
  It includes a separate credit, tax, adjustment and rounding row. Usage dates
  deliberately cross invoice months.
- Initial browser run 40045759132 passed the complete new Google path on desktop,
  tablet and mobile, including actual uploaded-file controls, report, monthly
  view, downloaded evidence/source hash and clearing. It had 154 passes, 14
  existing skips, and two expected entry-image failures from the support-text
  change. Both reviewed images retain their original dimensions; differences
  are restricted to that sentence. Image assertions remain enabled.
- The Google confirmation panel was also observed in the managed preview. The
  browser file picker repeatedly stalled; this is a control-surface limitation,
  not a claimed application defect. No new production file-upload pass is
  inferred from that preflight view.
- Run 40051989705 at `5709ae4e354f0d3ce92a76be28c9aebed96d22ed`
  passed both jobs, including 156 browser checks with 14 existing skips. The six
  actual Google confirmation/monthly-report images were reviewed at desktop
  1440×1000, tablet 768×1024 and mobile 390×844. Fields and helper text remain
  readable, page overflow checks pass, and no daily chart is displayed for the
  invoice-month summary. Artifact `google-bill-browser-views`, ID 12543079860,
  is 1,005,411 bytes, SHA-256
  `7505cb3680a204edfaf5e7c4161c6262cb9faeefceb4279f52ed31cd0ad24dda`.
  The final head differs only in two documentation files clarifying source hashes.
- The updated website guide passed 138 tests and a production build. Homepage
  design is unchanged.

## Release verification

Guard PR37 merged as `dd0f4d54dfb6d59341724fae0508dd8eec860e27` after
all checks passed at `69529ca1fc910f305a0093901acb6e63cefcf702`.
Final CI run 40052379153 passed both jobs: 183 frontend tests, 14 pipeline
integration tests, six native/WebAssembly parity checks, four transport checks,
46 API safety tests, dependency audit, production build/mount and 156 browser
checks with 14 existing skips. The six final browser images are byte-identical
to the reviewed run. Final artifact ID 12543919135, 1,005,411 bytes, SHA-256
`29ec0c3a1e12c1d372a7832664d8643e6371bd3faa40f2b66af144552996b3c9`.

The merge's Vercel production status is successful. A fresh public HTTPS read
confirmed the English Google Cost table instructions, preserved FOCUS/Gzip
routes and empty-service warning. Public `/billing-pipeline/provenance.json`
matches all four reviewed source pins, with `uncommitted: false` throughout.
This checks public delivery and provenance, not a new production Google upload.
No new team authorization or protected-preview bypass was used.

## Coverage limits

The Google fixture is contract evidence, not a captured current customer export.
AWS/Azure current downloads, a separately sourced Google Cost table file,
localized schemas, physical print/device coverage and fresh network capture still
need their own evidence. Native CUR, Cost Explorer pivots, arbitrary nested
BigQuery exports, PDFs, Excel, ZIP and Parquet are not newly supported. Retain
scoped verdicts; no global provider-ready or customer-savings claim follows.

Provider references:
[Google Cost table](https://docs.cloud.google.com/billing/docs/how-to/cost-table),
[Google FOCUS schema](https://docs.cloud.google.com/billing/docs/how-to/export-data-bigquery-tables/focus-export),
[Azure FOCUS schema](https://learn.microsoft.com/en-us/azure/cost-management-billing/dataset-schema/cost-usage-details-focus),
[AWS FOCUS 1.2](https://docs.aws.amazon.com/cur/latest/userguide/table-dictionary-focus-1-2-aws.html).
