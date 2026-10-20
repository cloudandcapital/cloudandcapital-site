# Tool audit: usefulness, correctness and presentation

Opened October 20, 2026 at Diana’s request. Finish the directory filtering/color/action-alignment repair, then review the actual tools one at a time. Keep the accepted homepage and existing application/pipeline work. This is a full user-journey audit, not a screenshot-only refresh or a blanket rewrite.

## Responsibilities and evidence

Codex owns code inspection, independent calculation checks, controlled input/output tests, real browser journeys, accessibility and responsive checks, repairs and regression verification. Claude supplies a separate critique of the evidence packet: clarity, usefulness, missing assumptions, unsupported claims, confusing results and the next step a visitor would understand. The connected Draft Review tool can read supplied text and evidence; it cannot independently browse or run applications. Do not call its review an independent functional test.

Review packets contain public copy and invented test data, relevant source excerpts, observed results and explicit limits. Never send real customer bills, private notes, credentials or personal account data. Use an explicit pass/fail/pending record for every claim and journey. Existing specialist closeouts are useful prior evidence; inspect current revisions and changed paths before deciding what to repeat. Do not restart completed Lens or Guard work merely to generate another audit label.

## Inventory and order

| Order | Tool/resource | Journey to prove | Current audit state |
| --- | --- | --- | --- |
| 1 | Interactive Lab, `/interactive-lab` | A first-time visitor supplies a bounded question, answers useful context questions, receives a grounded brief and understands its limits and next step. Test the supported decision families, insufficient context, failed requests, copy, print, edit and reset. | Application audit pending. Directory preview frame mismatch observed in Diana’s screenshot. |
| 2 | Signal Audit, `/signal-audit` | Explain the scope and questions, complete with meaningful answers, reconcile scoring and not-applicable behavior, explain the result, retake and export/print. | Pending; reuse existing scoring tests and inspect live result language. |
| 3 | Software Renewal Tracker, `/tools/software-renewal-tracker` | Start with personal records; add/edit/delete; distinguish examples; preserve actual payment versus monthly equivalent, notice dates and ended billing; save/reload/import/export/calendar; handle storage denial and corrupt records. | Pending current browser acceptance; substantial existing automated coverage exists. One directory card includes the worksheet. |
| 3a | Renewal worksheet/PDF, `/resources/software-renewal` | A visitor can answer the questions, understand the decision and use/print the PDF; links connect to the tracker without a second competing tracker. | Pending review of both page and real downloadable PDF. |
| 4 | AI Cost Lens, `https://lens.cloudandcapital.com` | Test supported estimate, bill and evidence flows with known results; check current subscription/usage/baseline paths, assumptions, usable-result denominators, import validation, exports and local-data behavior. | Reconcile latest specialist release evidence first; no new feature work implied. |
| 5 | Cloud Cost Guard, `https://guard.cloudandcapital.com` | Use supported invented billing input and an optional prior period, reconcile totals/drivers, preserve existing dashboard/pipeline, distinguish examples, forecasts and actual savings, verify bounded Lumen behavior and clearing/export where supported. | Reconcile October20 scoped owner acceptance first. Do not replace the pipeline or reopen all closed tests. |
| 6 | Market Tape, `https://market-tape.cloudandcapital.com` | Verify sources, timestamps, freshness and unique-instrument calculations, explain what each view means to an investor/trader, test failure/stale states and avoid unsupported spending or trading conclusions. | Coordinate the existing research/upgrade owner. Audit present behavior before choosing additions. |

For app dependencies and the six older source-code projects, trace the integration paths actually used by the website and dashboard. Separate installable code from a tool people can use on the site. Do not advertise every old repository as a finished web application.

## Acceptance for each tool

1. **Understand:** Identify the intended visitor, one useful job, what to bring and what they receive. Match the directory promise to the actual supported formats and paths. Check overlap with existing tools before adding anything.
2. **Complete:** Walk the real happy path with invented input and a known expected result. For calculations, compute the expected result separately rather than asserting against the implementation itself. Check relevant boundaries such as dates, partial periods, missing data, duplicates, zero/negative amounts and unsupported formats.
3. **Recover:** Test a relevant invalid/empty input, failed request and reset/back/reload path. Verify that failure leaves saved records intact and never fabricates an output or claims success. Do not inject destructive failures into shared production services.
4. **Trust:** Show inputs, units, dates, sources, assumptions and missing evidence where they matter. Distinguish sample results, estimates and actual outputs. AI-generated interpretation must stay grounded in supplied evidence. Check data handling and external requests for the tested scope; never turn a limited network check into a universal privacy guarantee.
5. **Use:** Inspect desktop and 320/375/390/414/768/1024px layouts, long text, line breaks, labels, errors, keyboard focus, touch targets, contrast and reduced motion. Check the real downloadable/exported artifact as well as the on-screen button.
6. **Challenge:** Give Claude the exact public copy, invented test scenario, observed result and source excerpts. Ask it to act as a new user and flag confusion, unsupported claims, mismatched expectations, missing decision support and unnecessary complexity. Resolve findings against code and evidence.
7. **Present:** Capture fresh images from the accepted real UI, using safe sample inputs and no selection/focus overlays or private details. Choose a useful result or representative workflow, show readable content at card size, and use consistent browser frames and crops. Retain the untouched capture and verify the thumbnail on desktop/mobile. Do not use fabricated screenshots.

A tool closes only when its important user journeys and relevant error states pass, material findings are resolved, Claude’s evidence-based critique is addressed, directory wording matches verified behavior, and screenshots are visually accepted. Record remaining limits explicitly. A build or test count alone is not a usability or functionality verdict.

The four Coming soon tools have no functioning release to audit yet. They need a scoped brief, distinct user job, validated calculations/behavior, the same acceptance checks and real screenshots when built. Keep their cards non-clickable and avoid release dates until chosen.

## Directory evidence for this pass

The previous built HTML/script/CSS check returned HTTP200 and each topic hid the correct unrelated cards. It did not cover the requested category-wide colors; original card tones remained fixed. This revision applies the selected palette to visible ready and Coming soon cards, restores individual tones in View all, centers category controls and card actions, and gives screenshot previews a shared aspect-ratio frame. These are directory changes, not completed audits of the seven tools/resources above. Real Safari/phone visual acceptance remains pending.

## Current verification and reviewer status

The updated directory passed all 78 repository tests and the production build. A separate test executes the actual built Tools page HTML, its bundled filtering script and generated CSS in JSDOM. It checks matching membership and palette overrides (Tech spending: six sage cards; Money & investing: four sand cards; AI & automation: three rose cards), View all restoration, hidden-card CSS, focus, centered controls/actions, non-nested links and consistent preview rules. Topic counts include relevant Coming soon cards; shared tools may match multiple topics but appear only once in each view. This is a DOM/CSS integration check, not a visual browser or Safari verdict.

Claude’s connected Draft Review tool returned INVALID_ARGUMENT for the initial packet, a shorter packet, and a minimal request using only documented required fields. No Claude critique was returned. This is a request-validation blocker, not a negative review or completed audit. Keep Claude’s review pending; do not mark the joint audit complete or silently substitute a Codex-only verdict. The plan above is the prepared review brief. The full app evidence packets and new screenshots follow the actual tool tests.
