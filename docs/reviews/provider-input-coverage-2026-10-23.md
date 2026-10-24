# Provider input coverage — October 23, 2026

Current implementation follow-up: Diana supplied her independent Claude audit. Bill controls, date handling, the quick example and reader guidance are being finalized in Guard PR39. [The audit follow-up](guard-claude-audit-follow-up-2026-10-23.md) records the fixes, checks and remaining limits. Release verification is in progress.

Latest provider-format follow-up: Guard PR38 handles valid UTC timestamps without
seconds from Microsoft's published EA FOCUS file and recognized Google invoice
headers before the charge table. An unchanged 5,000-row Microsoft demo prefix
reconciles exactly; this is partial historical demo data, not a current customer
invoice. Release checks and remaining coverage are in
[the provider export follow-up](guard-provider-export-follow-up-2026-10-23.md).
Diana's independent manual Claude review follows the released app and guide.

## Diana's requirement

Every tool should accommodate the common inputs of its intended users. For spending tools, someone should be able to bring a bill or ordinary provider export and get a useful review of their own spending. Supporting only our examples or a specially prepared template is not enough to call the product ready for broad use.

The first experience is: choose the provider, select the file they downloaded, confirm what was read, and get an understandable result with a next action. Make optional examples secondary. Avoid asking visitors to understand a schema or build their own integration before seeing value.

This is an acceptance standard, not a claim that every input is supported. Diana explicitly authorized Guard fixes in this website conversation on October23. Coordinate from fresh source and preserve the existing analytical pipeline; an owning-chat note is not an access barrier. Lens remains a separate active app project.

## Initial coverage targets

| Tool | Baseline providers | Important distinctions |
| --- | --- | --- |
| AI Cost Lens | OpenAI/ChatGPT, Anthropic/Claude, xAI/Grok; assess Google/Gemini and other widely used providers next | Consumer/team subscriptions versus API bills; provider-reported charges versus prepaid payments or balances; invoice-only versus usage/outcome detail |
| Cloud Cost Guard | AWS, Microsoft Azure, Google Cloud | FOCUS versus each native cost export; monthly totals versus detailed records; billed versus amortized/effective cost; exported parts and compression |
| Software Renewal Tracker | Common software subscriptions regardless of vendor | Manual subscription entry stays useful; any promised import must accept its documented real layout and preserve dates/charges |
| Other tools | The actual files, questions or records their stated visitor has | A questionnaire or market dashboard need not add uploads just to satisfy a spending-tool checklist |

The provider list is a starting coverage baseline, not a market-share measurement or an exhaustive promise. Maintain a visible per-format support matrix as the owners test and release adapters.

## Initial source-reported position (before the import fixes)

- **Lens**, main `7f2bb1770d930cf8013af646ef30bc5b3c2ecfda`: README describes local OpenAI dashboard CSVs, Claude Team/Enterprise spend CSV, saved Claude Admin API JSON pairs, and identifiable text-based OpenAI/Anthropic invoice PDFs. A user-confirmed flat CSV/JSON mapper and manual invoice path are available. The README explicitly keeps native current-customer OpenAI CSV compatibility unverified, and does not claim Anthropic Console CSV headers, arbitrary providers or scanned PDF/image support. No xAI/Grok-specific native bill importer is claimed there. These are source-documentation findings in this turn, not new live import passes.
- **Guard**, main `4d35b115c8b5179158087cb285896f8791544cd1`: inspected upload documentation and earlier live walkthrough support selected FOCUS columns/simple CSV. AWS/Azure have documented FOCUS routes with extracted CSV files. Generic Google Cloud exports need preparation. Archives, invoice PDFs and arbitrary native cloud export layouts are not automatically read. The earlier two-file synthetic test established arithmetic, comparison and exports, not broad provider compatibility.

Read the latest app-owner closeout before acting; these snapshots can change. Preserve existing working adapters and accounting boundaries.

## What counts as supported

Use these labels internally and in the product wherever format support matters:

- **Native and tested:** a supported, named provider download/layout is recognized directly; its important fields and totals have been validated through the actual app. Record the layout/version and source.
- **Mapped with confirmation:** a flat file can be reviewed after the user confirms suggested fields, period, currency and cost meaning. Do not label this automatic native support.
- **Manual entry:** useful for a bill with a small number of fields, with the entered facts and limits made clear. It is a fallback, not proof that a native importer works.
- **Unsupported or unverified:** explain the exact issue and next option. Do not quietly substitute an example, omit failed rows or invent missing values.

Do not treat a provider in the pricing catalog, an OpenAI-compatible API endpoint or recognized request-log fields as proof of compatibility with its invoices.

## Acceptance checks for each provider and file type

1. Confirm what an ordinary user can download today from official provider documentation and representative exports. Prefer direct downloads; avoid requiring an API key or custom script for a simple bill review. If an account role or plan restricts an export, say so.
2. Test the actual delivered layout with an authentic authorized/redacted sample or an official representative file where available. Preserve headers, timestamps, number formatting and structure during sanitization. Record synthetic contract tests separately; don't represent them as customer-export validation.
3. Read and show the provider, reporting period, currency, billed charges, credits, taxes and supported dimensions. Keep purchases of prepaid credit, remaining balance, invoice payments, usage charges and subscriptions distinct. Reconcile against the supplied source and make any difference inspectable.
4. Handle common delivery formats deliberately: CSV quoting/encoding, JSON nesting/pagination, multipart exports and compression. For common invoice PDFs, scope supported text extraction and ask for confirmation of the read fields. Scans, encrypted files and screenshots need an explicit separate implementation and validation, not a general PDF claim.
5. Keep unknowns unknown. An invoice-only review should still explain the bill; requests, token counts, retries, business outcomes and cost per usable result need the corresponding additional evidence. Don't make the basic review depend on outcomes that aren't present in the invoice.
6. Test current-only and prior-period comparisons, corrections/reset, malformed files, long labels and mobile selection. Avoid double counting a direct AI service that is already included in AWS Bedrock, Azure or Google Cloud billing. State the scope rather than silently summing overlapping imports.
7. Confirm privacy, processing location and export/copy behavior through the real app. Do not silently send uploaded financial records to an external model, log them, or request/store cloud credentials to complete a local review.
8. Make unsupported formats recoverable: say what the file appears to be, what is missing, and the easiest supported next step. A confusing mapping screen is a usability finding even if it is technically possible to finish.

## Next provider checks

Start with a provider/file coverage matrix that distinguishes documented, implemented and actually tested support. Prioritize the gaps that block an ordinary user's own bill, including xAI/Grok for Lens and a simpler Google Cloud path for Guard. Research the common export layouts before implementing adapters. Preserve existing deterministic accounting and local processing; test each new adapter end to end, then update its guide, directory description and screenshot together.

The independent Claude audit should evaluate this flow cold, then check arithmetic with controlled fixtures. A passing example calculation is one part of acceptance, not the readiness verdict.

## October23 Guard implementation follow-up

Diana authorized the concrete import fixes here. Guard PR36 adds bounded local Gzip CSV opening, 18-place exact cost support and explicit UTC confirmation with source evidence. The unchanged historical public CSVs and Gzip wrapper now pass the actual reader and producer pipeline with exact reconciled totals; native and WebAssembly results agree. See [the implementation review](guard-provider-import-fix-2026-10-23.md) for release and browser evidence. This repairs those observed blockers, without certifying all current native layouts or Google Cloud.

## Google Cost table follow-up

Guard PR37 implements the documented English Google Cost table layout with explicit invoice-month/currency confirmation. It preserves signed credits, tax and adjustments, checks/excludes a Total row and retains original source hashes and context. FOCUS missing-service rows and explicit BigQuery UTC microseconds are also handled. The [implementation review](guard-google-cost-table-2026-10-23.md) distinguishes contract fixtures, automated browser tests, production delivery and remaining current-provider acceptance. The earlier source-reported unsupported position above is historical, not the new Google Cost table verdict.
