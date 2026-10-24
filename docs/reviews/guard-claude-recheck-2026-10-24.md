# Cloud Cost Guard: October 24 independent recheck follow-up

Owner: Diana-authorized website/tool implementation. No connected Claude review, new automation or schedule/cutoff change. The uploaded manual recheck was read in full, with the original audit treated as historical below its new findings.

Status: source fixes merged; Guard PR40 browser/visual/PDF verification and release are in progress. Replace this status with the observed release facts before final publication.

## Findings and response

| Recheck item | Response |
| --- | --- |
| Total labels still double a bill | Reproduced USD 259.20 from a USD 129.60 bill with Invoice total, Total charges, Totals, Total due and Total (USD). Stop explicit aggregate labels in the producer and browser reader. Keep real service names such as Total Defense and Totaljobs. Do not reject an unrelated charge just because it coincidentally equals other rows. |
| Earlier correction suppresses a spike | Reproduced a 30-day September series with USD 250 on September 25 and an earlier USD -10 correction. All 31 rows remain in the USD 3140 bill total. The 30 in-window observations total USD 3150 and retain the existing detector’s spike. A visible note explains excluded out-of-window rows. The independent consumer reconstructs the subset and rejects altered observations. Overlapping partial days, missing in-window dates and negative daily sums remain ineligible. |
| Short history called checked | Billing series_evaluated counts only histories long enough to run the detector; series_with_observations separately retains eligible observations, including short histories. The quick example has one observed history, zero checked and no normality assurance. Generic CCAC detector behavior and thresholds are unchanged. |
| Lumen misroutes ordinary questions | Supplied-month queries select the matching current/previous upload with its exact dates, rather than becoming forecasts. Unprovided years/months do not acquire invented totals. Invoice questions read actual checks and source-owned signed differences. Explicit Tax categories have an exact producer-owned metric; amount lookup stays separate from tax correctness. |
| Header warning easy to miss | A mismatch is also noted by the headline and the card displays its exact source-owned difference, formatted for reading. It remains a warning because Google header/footer differences can be legitimate. Matching controls still do not prove account completeness. |
| Month header stops unfamiliar forms | English Month YYYY and YYYY-MM are recognized and conflicting months stop. Other forms use the visitor’s explicit confirmation and a visible warning. This is adapter support, not a claim about a verified current Google header format. |
| Currency/amount/fee polish | Known yen, rupee and won symbols cannot contradict confirmation. Multiple valid comma groups such as 1,500,000 are unambiguous; one comma such as 1,500 still stops. Credit card processing fees remain positive charges. Signed credits are never negated automatically. Singular row labels and the duplicated no-report sentence are corrected. |
| Print and mobile | Compact print styling places net cost and bill checks together, gives gaps strong borders/backgrounds, and allows long sections to break. Actual A4/Letter outputs are checked separately below. On mobile the Lumen trigger is in the header instead of floating over report text. Example reset/download wording identifies invented data. |
| Guide described as stale | Not reproduced. Before this follow-up, both observed URL forms returned HTTP 200 and identical 33,935-byte bodies, SHA-256 846b8fb12dd46c5f22f523fde80408a93027916b418a11ba1544795d2a9bc82d. Both already contained MOSP, AWS FOCUS 1.2 settings, daily average, bill checks, same-pipeline example and the actual screenshot. The first response was a Vercel cache MISS. The cause of Claude’s older observation is unestablished. This pass adds the remaining template/monthly/spike/Lumen explanations and expands MOSP into plain words. |
| Clipboard | Claude’s targeted recheck observed no writes and attributed the original notice to its input method. No application clipboard handler was found or added. Treat the old observation as not reproduced, not as a proven site defect. |

## Source ownership and verification

Financial behavior stays in reviewed upstream source. FinOps Lite PR28 merged as ddbab6cd6cbff9a40edc310d935da4852657264a after final CI 40115296552 passed its Python matrix, quality/audit and package jobs. The earlier run had a Python 3.11 runner that remained in progress; a meaningful additional partial-day boundary regression was committed, and the complete final head passed. Watchdog PR11 merged as 274e854b55199f78d12373d499227847e0f560e7 after CI 40115548084 passed. Its billing extra and checked lockfile pin that merged Lite source. Other producer pins remain unchanged and clean. Guard uses the official source sync script, not independent financial calculations in the UI.

Local Guard checks: 196 frontend tests, 17 pipeline tests, 10 actual native/WebAssembly parity cases and optimized build pass. Upstream local Watchdog suite: 99 tests. The extra runtime case independently compares browser/native artifacts for the correction/spike example. The browser suite checks actual file inputs, error recovery, downloads, Lumen and responsive behavior. All 138 site tests pass. The first site build was stopped by automatic approval review when Astro attempted telemetry. A materially safer rerun used Astro’s documented ASTRO_TELEMETRY_DISABLED=1 opt-out and completed successfully. Final strict browser/PDF release facts remain to be inserted.

The prior guide’s two URL forms were verified with ordinary public HTTP requests; no account login or cache/security bypass was used. Source for Azure account-type instructions: https://learn.microsoft.com/en-us/azure/cost-management-billing/manage/view-all-accounts (Properties → Type for one scope; Billing scopes for multiple). Google cost-table source and its legitimate header/filter/memo caveats remain those linked in the prior review.

## Acceptance and useful next work

Current native customer AWS/Azure exports, a separately sourced current Google Cost table, complete account/invoice coverage, provider manifests, arbitrary localized layouts, larger capacity, fresh independent network capture, Safari/Firefox/screen readers, real-device behavior and physical paper remain separate. Automated browser file inputs exercise the real reader without certifying an OS file-picker dialogue. No private bill was used.

A daily-average change percentage and supplied-period/invoice-ID completeness signals remain evidence-led upgrade candidates. Preserve the existing Morning Scan and specialist-audit owner scopes instead of creating another queue. They do not authorize hourly aggregation, new adapters, automatic duplicate choices or additional commitments in this fix.

Diana’s next manual Claude pass should be limited to the remaining reproduced cases and these fixed boundaries, separating defects from unverified coverage. The approved homepage, other tools and recurring schedules are unchanged.
