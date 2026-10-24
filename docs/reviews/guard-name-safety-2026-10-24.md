# Cloud Cost Guard: service-name safety and the 2 pm recheck

Status: source fixes merged and local implementation checks pass. Guard PR42 browser/image/print gates and delivery are pending. Replace pending fields with observed evidence before publication.

Diana supplied the full independent audit attachment. Its latest 2 pm section is the current verdict: the five requested fixes and six earlier passes hold at Guard b9846cd. A newly discovered service-name crash and the remaining reproduced defects are addressed here. Earlier write-ups remain historical; unverified current provider/device coverage is separate. No connected Claude review ran.

## Reproductions and repairs

| Finding | Repair and boundary |
| --- | --- |
| An Amazon/Lambda spike stops a valid review | The shared Watchdog slug can end its 40-character prefix on a separator, creating an empty ID component before the hash. Strip that trailing separator after truncation. The hash still uses the full input. Released CCAC validation stays strict. |
| New spending is called a drop | The previous billing copy treated every non-increase event as a drop. Map `new_spend` explicitly to New spending. This is zero-baseline spending within supplied history, not evidence of a new resource or a cause. |
| Different tax dates hide a possible total | The simple-CSV check now compares the whole source file, starting calendar-month groups, and leading/trailing amounts equal to a block of at least two other rows. It is linear work, does not solve arbitrary subsets or infer invoice boundaries, and never removes or rejects a row merely because an amount matches. All signed amounts remain included. Candidate details are deduplicated and bounded at five; the full count stays available. |
| Total tax/Total VAT is blocked | Those charge labels stay valid. Total incl. tax, Total after credits and the earlier bill-summary variants still stop before analysis. A separately named positive refund still requires its sign to be checked. |
| A polite request is treated as forecasting | Remove the polite explain/review prefix only for intent matching. Will you explain my bill uses the supplied report. Explicit future costs, future bills and What will my budget be still reach the forecast limit. |
| Small language/display issues | Format the existing anomaly diagnostic amounts as money; the card says Daily spending check while source severity remains in evidence. Singular warning text says It matches. The bill-check intro names both possible-total and supplied Google control checks. |

The old complete pipeline was tested with every provider/service pair in the unchanged public 1,000-row prefix plus Lambda: 15 of 34 synthetic daily-spike cases failed released validation, including 14 Amazon names and Lambda. The prefix contains 33 distinct pairs; this is not an independent count of the full 49-name sample cited by Claude. The new complete pipeline passes all 35 pairs from that prefix plus the specifically reported Amazon EC2 and Lambda names. Dates and costs are invented regression inputs, not current customer exports.

## Source ownership and validation

Lite PR31 merged as 74bcd004b27cc2c3c82b33d25951a1e7ca8f3d78 after CI40136499582 passed. Local tests: 206 passed and one existing release-validator skip. Watchdog PR13 merged as 58c6cf491390a31dc607493cbcbe83e749978a92 after CI40136543797 passed; all 114 local tests pass. The app uses the official source sync, with all four producer pins clean. Command Center 0e5b27eda8fc3b427375e6bb11c990a176b59d4c and released CCAC 6bf2e0c617536260a279fb53cc07b98f844e4a8a remain unchanged.

Existing detector thresholds, severity and diagnostic metric rounding remain unchanged. Source tests compare billing diagnostics with generic detector output, including currency formatting. Watchdog's existing diagnostics round currency metrics to two decimal places; this repair does not change that analytical boundary. Full supplied precision remains in the bill records and producer-owned totals. This is separate from display precision for currencies with zero or three fractional digits.

Local Guard validation: 228 frontend tests; 19 pipeline tests including the 35-name complete-validation matrix; 16 native/WebAssembly parity cases; optimized production build. Native and WebAssembly outputs agree exactly for Amazon EC2, Amazon Route 53, Lambda, new spending, the mixed-date warning and all retained previous cases. The new browser cases use real file controls across desktop/tablet/mobile, local Lumen and actual A4/Letter printing of the possible-total report with backgrounds off.

BROWSER_IMAGE_AND_PRINT_PENDING

## Delivery and guide

APP_AND_GUIDE_DELIVERY_PENDING

The guide explains differently dated tax, valid Total tax/VAT charges, reuploading a corrected file, new spending in supplied history and the polite Lumen question. All 138 site tests and its production build pass with Astro telemetry disabled. This repository has no GitHub Actions workflow. The approved homepage and current actual guide screenshot stay unchanged.

## Acceptance and next useful step

This repair release does not certify current AWS FOCUS 1.2, Azure or Google customer exports, every Google header variant, portal paths, complete invoice/account coverage, arbitrary/localized formats, Safari/Firefox, physical phones, screen readers, Chrome's print-dialog UI or physical paper. Prior public FOCUS/Gzip and Microsoft EA-prefix evidence remains valid. No private bill was used. The new printed possible-total warning is checked separately from the earlier printed Google invoice-gap warning.

Diana's next independent manual recheck belongs in the same Claude app chat, focused on the crash, zero baseline, mixed dates/tax labels, polite/future questions and warning clarity. Preserve the already-passed items. No new automation, queue, schedule, ownership or historical cutoff is created. A later small Ask Lumen link remains a usability candidate only.
