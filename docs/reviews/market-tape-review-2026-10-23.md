# Market Tape and guide review — October 23, 2026

## Product and release

- Dashboard: https://market-tape.cloudandcapital.com/
- Guide: https://cloudandcapital.com/insights/using-market-tape
- Methodology: https://market-tape.cloudandcapital.com/sources
- Frontend: `cloudandcapital/market-tape-app`; production commit `9afae813508a393a00fbbfed33dcf9353271aba8` (PRs 19–22).
- Pipeline audited read-only at `4b7ff3d9c671c4683a9369f9c5e8f3c66f98a1c0`; its 19 existing tests passed. The 52 displayed rows represent 48 unique instruments; repeated XLV, XLP, XLU, and USMV rows are intentional and do not double-count participation metrics. All displayed prices in that snapshot are dated October 22.

## Work completed

- Corrected RS1M score units and definitions without changing the pipeline formula. Actual daily/20-session price changes are labeled separately.
- Removed unsupported purchasing verdicts and the inference that HYG grades measure credit spreads or low stock valuations prove renewal leverage.
- Added fixed cloud commitment questions, distinct price/publication dates, snapshot validation, and source-controlled valuation displays.
- Analysis refreshes use server-verified data and reject a changed displayed snapshot; older snapshots pause new analysis. The age backstop is not a full exchange-calendar check.
- Page rendering no longer waits for Lumen. Analysis still needs independent checking; output-shape and unit checks are not full factual verification.
- Fixed a mobile outside-click handler that closed the Tools submenu immediately after a tap. Verified submenu expansion and Escape closing at 375px.
- Removed broken momentum mini-charts after confirming the active BALL chart asset is absent (404). Replaced them with company/score rows and Yahoo Finance ticker research links. The pipeline itself was not changed.
- Added a plain-English guide, guide-directory entry, tool companion link, and real desktop/phone captures. Main homepage positioning and design are unchanged.

## Verification and limits

Nine new frontend regression tests, existing benchmark/guardrail checks, TypeScript, and the app production build passed. Public Vercel deployment status is successful after the render-isolation repair. Live Lumen completed with score units and no Spot safety verdict. It can still make mistakes or quote more precision than the rounded panels; independent prose/source review remains useful.

The main-site suite has 109 tests. Its full result and production build are checked before publishing the guide. Browser review covers desktop and simulated phone widths, with live source screenshots rather than reconstructed mockups. This is not a physical-device test or independent verification of every manually maintained compute deal or GPU provider quote. Current valuation fetches may be unavailable; dated archived values remain separate.

The first app production deployment failed despite a successful preview. Private Vercel logs returned a team-scope 403, and automatic approval review rejected starting fresh CLI authentication. No login or permission workaround was used. The subsequent source change removed model calls from page rendering and deployed successfully through the existing GitHub integration. It is not claimed as a log-proven diagnosis of the original failure.

## Manual Claude review brief

Please independently audit Cloud & Capital’s Market Tape and its companion guide. My voice is casual, clear, and useful. Keep the existing positioning and calm beige/sage design. The tool should give someone a useful next research question or context for a real technology cost review.

Open and interact with:
- https://market-tape.cloudandcapital.com/
- https://market-tape.cloudandcapital.com/sources
- https://cloudandcapital.com/insights/using-market-tape
- https://cloudandcapital.com/tools

Check the actual product, not just the descriptions. Who is it useful for? What can they do with the information? Compare with a few credible public alternatives and identify any meaningful missing capability without recommending an oversized rebuild.

Verify the RS1M formula and units against `cloudandcapital/market-tape/scripts/build_data.py`. It is a dimensionless volatility-adjusted score, not a return percentage. Check the 48 unique/52 displayed count, price date versus publication time, one-session versus 20-session changes, proxy labels, basis points, grades, and mixed-basket breadth. Check Lumen’s numbers, precision, source dates, and any implied causal or purchasing claim. Do not assume guardrails prove its prose correct.

Review unavailable/stale behavior, valuation-source labeling, ticker/source links, desktop and phone usability, and whether the real screenshots match the tool. The manually maintained infrastructure/deal section has separate dates and is not an exhaustive real-time tracker. Evaluate whether the guide explains both the value and limits without burying the reader in jargon or caveats.

Return findings by severity with the exact page/section, reproduction steps, expected versus actual behavior, and the smallest useful fix. Separate verified bugs from suggestions and from anything you could not test. Give an honest readiness verdict. Don’t publish, sign up, use paid services, request credentials, or run load tests.


## Independent Claude review follow-up

App PR #23, merged as 7e2ae376e749e1d7914114927f823673b0d07eee, deployed successfully to production. Full resolution ledger is in the app repo at audits/claude-review-resolution-2026-10-23.md.

- Equity summaries now use 34 classified equity ETFs, excluding SPY and macro instruments. The pinned October 22 snapshot gives 16/34 positive, 47/100; 53% above the 20-session average and 41% above the 50-session average.
- Corrected IWM-vs-SPY and XLK trend/relative-score labels; neutral rounded zero; all 48 unique instruments inspectable in a table.
- Fixed, identical compute summary at every width; source-built alerts and separate fixed business questions; no generated six-month budget implication.
- GPU scope corrected to one vendor’s selected rental list rates, including reservation-only/on-demand-equivalent endpoints. CBRE vacancy described as unchanged.
- SpaceX SEC S-1 checked directly without identifying request data: monthly arrangement through May 2029, bilateral 90-day termination; no inferred aggregate amount added to $265B+ headline.
- All-unavailable valuation section hidden, missing navigation links added, Market Tape in both relevant catalog topics.
- Refresh analysis tested publicly: status explicitly reports the same cached analysis after checking.
- App tests: 18 regression tests, benchmark checks, TypeScript and build passed. Site tests: 109 passed before the environment interruption. Companion copy/reflow is compiled by the Vercel preview/production build.
- Browser verified live desktop metrics, 48 unique table rows, seven menu entries (directory plus six tools), cache feedback, and 375px phone layout without horizontal overflow.

### Captures completed after reconnecting

The workspace and browser reconnected. Fresh, actual-interface captures now replace the previous layouts:

| Asset | Dimensions | Purpose |
| --- | --- | --- |
| market-tape-snapshot-review.jpg | 1104 × 551 | Tool-directory internals, corrected macro comparisons and momentum |
| market-tape-equity-review.jpg | 1104 × 648 | Desktop guide: equity summaries and technology context |
| market-tape-snapshot-mobile.jpg | 720 × 440 | Double-resolution phone crop of equity breadth, capped in display width |
| market-tape-cloud-review.jpg | 1104 × 255 | Desktop fixed review questions |

No mockups or invented values. The phone guide retains native text for cloud questions rather than shrinking the wide image. Alt text describes the actual breadth crop. The original October 22 source date stays explicit.

Screenshot review exposed a crowded macro row. App PR #24, production main 0f4d07fc2fce55d4664f8806b3565a59e828aaaf, puts the value and score on separate lines with a consistent label gap. Its 18 regression tests and build pass. The final capture uses this deployed layout.

The companion site passes 109 tests and its production build. Browser checks confirm the phone guide selects the 720px image at a 320px display width, with no horizontal overflow, and uses readable native cloud questions. These are viewport checks, not physical-device tests.

History is the next useful product upgrade: store dated snapshots and offer a 5–20-session change view. A commitment-payment calculator and reliable current valuation source are separate improvements.
