# Guard import compatibility fixes — October 23, 2026

Ordinary compressed CSV delivery, precise costs and timezone-less timestamps
blocked the public FOCUS inputs before analysis. This change repairs those
import failures through the existing analytical pipeline. Existing weekly audit
scope and schedules are unchanged.

## Implementation

Guard [PR #36](https://github.com/cloudandcapital/cloud-cost-guard/pull/36)
extends the existing upload path rather than adding a second accounting engine:

- `.csv.gz` expands locally using the browser's Gzip reader, with combined limits
  before and after decompression. Wrong extensions, corrupt archives and invalid
  expanded UTF-8 get distinct recovery messages. Existing row/file limits remain.
- Costs preserve up to 18 decimal places in both preflight and the actual
  FinOps Lite producer. Large, precise daily values retain exact lineage through
  Watchdog; the global Decimal context and statistical detector stay unchanged.
- A timestamp without a timezone blocks review until the visitor explicitly
  confirms UTC for that selection. Replacing the selection resets confirmation.
  Other timezone offsets remain unsupported. The original CSV is never rewritten.
- The report, printable HTML and evidence JSON retain the UTC choice and warning.
  Source hashes bind expanded original UTF-8 CSV text, including BOM/line endings;
  they are not hashes of the compressed archive.

Producer changes were merged in [FinOps Lite #20](https://github.com/cloudandcapital/finops-lite/pull/20)
(`ca96b20956d9d1b759499721c4aa91c45990167c`) and
[Watchdog #9](https://github.com/cloudandcapital/finops-watchdog/pull/9)
(`b97ae485a34644e36ab41a83116928c863d74d3d`). Guard's source lock and
verbatim snapshots match those revisions. Released CCAC and Command Center
sources are unchanged. Required dependency audits also prompted a certifi lock
update upstream and removal of unused Zod from Guard; no audit was disabled.

## Reconciled public inputs

The exact datasets, license, hashes and original failures are in the
[historical input audit](guard-public-provider-input-audit-2026-10-23.md).
The follow-up runs the actual updated browser reader and native producer pipeline,
with an explicit UTC test interpretation and the default duplicate policy.
No source row or amount was edited. No identical full-dimension rows were found.

| Input | Records | AWS USD | Microsoft USD | Oracle USD | Net USD |
| --- | --- | --- | --- | --- | --- |
| Original 1,000-row CSV | 1,000 | 18.0066386184 | 1.97651418586 | 0.53707392473 | 20.52022672899 |
| Original 10,000-row CSV | 10,000 | 112.1661754324 | 34.07497307454 | 5.18894273503 | 151.43009124197 |
| Gzip wrapper of the original 1,000-row CSV | 1,000 | 18.0066386184 | 1.97651418586 | 0.53707392473 | 20.52022672899 |

[Machine-readable results](guard-provider-fixed-results-2026-10-23.json)
record each input hash, expanded source hash and source pin. Native and browser
WebAssembly runs produce identical canonical artifacts for the 1,000-row input.
A separate boundary test preserves `999999999999.123456789012345679` through
all pipeline stages; an eighteenth-place source mismatch still fails lineage.

## Scope and remaining work

These historical public extracts contain AWS, Microsoft Toolkit sample and Oracle
records, not Google Cloud. They are not current native customer exports or full
invoices. Gzip is a locally produced wrapper of the unchanged CSV. UTC is an
explicit test choice, not an inferred fact about every timezone-less export.

Broader provider acceptance remains open: representative current AWS/Azure
downloads, separately sourced Google Cloud layouts, empty service-label cases,
and any promised native adapters still need their own evidence. Google’s usual
billing CSV needs preparation. ZIP, Parquet, Excel and invoice PDFs are not newly
supported. Do not replace the earlier scoped GREEN or certify broad readiness
from these sample passes. No private bill was submitted.

Local validation passed 180 frontend tests, 13 pipeline integration tests,
5 native/WebAssembly parity tests, 4 CSV/Gzip transport tests, 46 API tests and
the optimized production build. The guide passed 138 site tests and a production
build; its updated requirements fit at 320px and 375px without horizontal overflow.
Guard's complete CI passed at `0a66675371cc416e83a1128754d3bf1ba53168a3`:
153 browser contract checks passed, with 14 existing skips. This includes the
real file chooser, Gzip import, UTC confirmation, exact report values and
downloaded evidence on desktop, tablet and mobile. All backend, dependency-audit
and production-bundle checks passed. Eight reviewed screenshot references reflect
only the precision disclosure changing from 8 to 18; screenshot assertions remain
enabled.

## Release

Guard PR36 merged as `bfc58e8e192be520f505021c82e70b961ba0fb8a`.
[CI run 40033533365](https://github.com/cloudandcapital/cloud-cost-guard/actions/runs/40033533365)
records the successful checks. The machine-readable input runs identify the last
functional source revision; subsequent branch commits only update visual test
references and collection of failure evidence.

Vercel's production status for the merge revision passed. A fresh, uncached
read of [the public app](https://guard.cloudandcapital.com/) confirmed Gzip
instructions, 18-place cost disclosure and explicit UTC confirmation guidance.
The public `/billing-pipeline/provenance.json` matches the merged FinOps Lite
and Watchdog revisions and billing module hashes above.

## Post-release live upload follow-up

After the testing workspace reconnected on October 23, the public HTTPS app
passed the previously open interactive check. Its actual file chooser accepted
the unchanged 1,000-row Gzip fixture. Review stayed disabled until explicit UTC
confirmation, then showed 1,000 counted records and exact net USD
`20.52022672899`. Downloaded Evidence JSON retained AWS `18.0066386184`,
Microsoft `1.97651418586` and Oracle `0.53707392473`; these add to the exact net.
The UTC confirmation warning and original expanded CSV digest
`e91e5ac7edf01ed2c9d926f37ef7dc1ae2aae97956fea8da6c9ee488b1c2839e`
are present in the downloaded evidence. Printable HTML retains the exact total
and UTC warning. **Clear my data** returned to empty selectors and disabled Review.

| Live artifact | Bytes | SHA-256 |
| --- | ---: | --- |
| Evidence JSON | 2,011,042 | `7601a70e19c62ff98aaebbe865538b12c5cac9cc38537d3ae4481a7ae28777d9` |
| Printable HTML | 6,499 | `24e48632dafdc27b8a13821e97fc8dfd6218ab62f8c0966afe139fb2267331e5` |
| Report viewport screenshot | 90,678 | `2a0a34b05192562638403495cae786fd3bbe38b803f293a359b1f0d8bbd56522` |

This closes the fresh production upload/download/clear-data check for that
public fixture. Physical print, real-device coverage, independent network
capture and broader current-provider acceptance remain separate. No private
bill was used.

