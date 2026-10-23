# Guard provider-input compatibility — October 23, 2026

**Confirmed gap: both unmodified public FOCUS CSVs fail before analysis.** The 1,000-record file also failed through the public upload control, with Review disabled. This is a read-only review under Diana's new major-provider input requirement. Guard app code was not changed; its separate working chat remains the owner.

## Evidence and provenance

Guard main: `4d35b115c8b5179158087cb285896f8791544cd1`. Tested `frontend/src/lib/billing/csv.js`, exact Git blob `156a3d1f7f8f1fb5f5bc7252bab21996102b1ae7`, SHA-256 `5f058a148fbb6e03c72b6e898c98e5112cb8a9bdcaf6d7b4b11833b24adc2e0a`.

Dataset publisher: FinOps Foundation / FOCUS project, [FOCUS-Sample-Data](https://github.com/FinOps-Open-Cost-and-Usage-Spec/FOCUS-Sample-Data/tree/main/FOCUS-1.0), licensed [CC BY 4.0](https://github.com/FinOps-Open-Cost-and-Usage-Spec/FOCUS-Sample-Data/blob/main/license.md). The README and [Foundation article](https://www.finops.org/insights/focus-sandbox/) describe anonymized real-world FOCUS data, including Microsoft sample records from the Microsoft FinOps Toolkit. These historical combined extracts are not unmodified current customer downloads.

| File | Bytes | Records | Providers in the tested extract |
| --- | --- | --- | --- |
| focus_sample.csv | 755,423 | 1,000 | AWS 942; Microsoft 51; Oracle 7 |
| focus_sample_10000.csv | 7,529,214 | 10,000 | AWS 9,441; Microsoft 491; Oracle 68 |

Both files fit the current 10 MB / 50,000-record limits, use USD throughout and cover September 2024. Neither includes Google Cloud records. Do not infer a GCP pass/failure or complete invoice coverage from this test. The source data is not duplicated in this repo; the JSON records identify exact hashes and original filenames.

## What stopped the imports

1. **Cost precision and formatting.** Both public files use 11-place cost formatting. The first 1,000-row amount, `0.00000080000`, is rejected by Guard's eight-place rule. Every raw record fails that check. Removing trailing zeros would preserve some values, but 493 records in the smaller file and 4,816 in the larger file contain nonzero precision beyond eight places. A blanket rounding workaround would alter source amounts. The owner needs precision support through the owned pipeline and exports, not just a broader UI regex or another JavaScript calculator.
2. **Timezone-less serialized dates.** An isolated diagnostic removed only trailing cost zeros and left dates untouched. Values now fitting eight places reach the next rejection: timestamps such as `2024-09-18 22:00:00` lack the required UTC suffix. No timezone was inferred. Provider-specific rules or explicit confirmation need to establish UTC; blindly appending Z is not a fix. This historical extract's serialization is not evidence of every current provider's date format.
3. **Compressed delivery.** A deterministic Gzip wrapper of the unchanged smaller file failed both the actual UI and the exact upload reader with `save this file as UTF-8 CSV and try again`. The reader attempts text decoding before identifying/decompressing the archive. This locally created wrapper tests delivery format; it is not an authentic AWS export. [AWS documents Gzip/CSV and multipart delivery](https://docs.aws.amazon.com/cur/latest/userguide/dataexports-export-delivery.html). Support the intended compression with limits on decompressed data; until then, explain extraction rather than a misleading encoding correction. ZIP/Parquet are separate capabilities.

The existing current-example control still passes the unchanged reader with seven rows. This is an input-compatibility gap, not a regression of that example's arithmetic. No downstream report or exports were generated from rejected public inputs.

## Independent exact totals

Python's standard CSV reader and Decimal at precision 50 produced these totals. They describe supplied sample rows, not full invoices.

| Extract | AWS USD | Microsoft USD | Oracle USD | Combined USD |
| --- | --- | --- | --- | --- |
| 1,000 rows | 18.00663861840 | 1.97651418586 | 0.53707392473 | 20.52022672899 |
| 10,000 rows | 112.16617543240 | 34.07497307454 | 5.18894273503 | 151.43009124197 |

`guard-public-dataset-totals-2026-10-23.json` records source hashes and independent totals. `guard-provider-input-results-2026-10-23.json` records actual reader errors and diagnostic counts. `guard-public-focus-input-error-2026-10-23.jpg` is the real public UI failure.

## Reproduce and hand off

Download the reader at the pinned Guard revision and the two public CSVs from the publisher above; verify the recorded hashes. The audit script needs no app installation, cloud login, API key or private bill:

```sh
node scripts/audit-guard-provider-inputs.mjs /path/to/pinned/guard-csv.mjs /path/to/focus_sample.csv /path/to/focus_sample_10000.csv
```

It imports the real reader, calls `readBillingFiles` using File objects, and probes each record. Its cost-zero trimming is diagnostic only: it never rounds nonzero digits, changes dates or establishes a native-import pass.

**For the Guard owner:** fix and verify exact monetary precision, explicitly grounded timestamps and ordinary compressed delivery while preserving the existing pipeline, negative credits, duplicate handling, comparison semantics and local privacy. Reconcile these sample totals after establishing the intended date interpretation. Check exports, local Lumen and phone upload. Then test representative current AWS/Azure downloads and a separately sourced Google Cloud layout. Google's [Cost table CSV](https://docs.cloud.google.com/billing/docs/how-to/cost-table) and [FOCUS BigQuery export](https://docs.cloud.google.com/billing/docs/how-to/export-data-bigquery-tables/focus-export) are distinct paths. Name and verify supported formats; a historical sample pass alone does not certify all current provider bills.

Return the release revision, real UI checks, coverage matrix and remaining limits. Broader provider-input readiness stays open until that owning app work passes. Preserve the earlier scoped GREEN and closed seven-row example checks; this is a new product requirement and evidence set.
