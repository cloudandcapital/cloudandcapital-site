# Signal Audit review — October 23, 2026

## Story and baseline

A visitor chooses one business scope and technology categories, answers 12 questions, receives a result and a supported first step, then keeps the scope and answers through Copy or Print. The new questionnaire scores in the browser. Its compatibility API validates and recomputes the same rubric without an AI provider.

Baseline source: cloudandcapital/cloudandcapital-site main c18b569e5493480bd4da129b3f21189441d03052. Public baseline was exercised before editing.

Confirmed baseline defects:
- Choosing the combined “not applicable or outside my visibility” option for all 12 questions returned no score but still prescribed “Move economics upstream” as a priority. This was not supported by the answers.
- Unknown and inapplicable answers were conflated.
- Scores were formatted as percentages; the response count was labeled evidence coverage/confidence despite no verification of the answers.
- The map split visually at 50 while classifications used a 67 point boundary.
- Perfect answers still received a repair recommendation.
- Automatic AI interpretation added variability and answer transmission to a deterministic questionnaire. Disclosure came late and the browser did not guard against a late response after retaking.
- Copy omitted the scope, answers and exclusion counts. The local legacy copy path reported success while the clipboard retained an older Lab brief during the baseline check.
- No dedicated walkthrough existed. The directory screenshot showed setup rather than an output.

## Resolved in this pass

- Separate unknown and not applicable choices. Neither is zero. Require two scored answers per area for placement, and withhold the map point when information is insufficient.
- Missing information leads to checking evidence or scope fit. Known gaps use a specific low answer and visible reason. Working answers lead to maintenance; they do not invent a defect to fix.
- Curated next steps, relevant people, progress checks, and technology-specific notes. No generated company facts or savings claims.
- Explicit points out of 100, answer counts, independent rubric, uncalibrated cutoff and limitations. The map lines and classification both use 67.
- Removed outbound AI generation and browser API request. The compatibility API remains bounded, JSON-only, noncached, server-recomputed and rules based.
- Shorter questions and plain area names. Manual checks can satisfy the high anomaly-response answer when appropriate to the spending; automation is not a universal maturity goal.
- Scope categories stay consistent; Mixed is exclusive with individual categories. Changing scope clears old answers. Editing retains answers. Start fresh clears the scope, example state and result. The illustrative example label persists during edits.
- Keyboard focus on the new question/result, progress state, visible disabled controls and status messages, readable phone controls, reduced-motion scroll handling.
- Copy includes scope, example identity, version, scores, excluded/unknown counts, priority basis, next step and all answers. Failed automatic copy exposes a readonly manual-copy box. Actual browser clipboard was checked and contained the new Signal Audit summary after the fix. Print uses the browser dialog and expands answer/methodology content in its print styles.
- Lifecycle events are session gated and contain no answers or scores. Existing analytics allowlist remains unchanged.
- New companion guide, real screenshot assets, directory and article-archive links. Homepage unchanged.

## Rubric and worked example

Scored choices are 0–3. Each area normalizes its two or three scored responses to 100 and rounds. The two axes average their paired rounded area scores and round again. Both require valid component areas. The 67 cutoff and tie rules are Cloud & Capital's independent choices, not FinOps Foundation benchmarks or empirically calibrated maturity levels.

The built-in software renewal example has area scores 89, 67, 22, 33; axes 78 and 28; 11 scored answers and one genuinely inapplicable usage-billing question. The low renewal answer produces “Check the next renewal before it locks in.” No prices or savings are invented.

Priority selection: among areas containing a known 0 or 1 answer, select the lowest area score, then lowest individual answer, then the disclosed area tie order. Select the lowest question in that area; question ties use questionnaire order. Insufficient information takes precedence over a diagnosis. All-working known answers lead to maintenance. Unknown answers remain a check even in an otherwise working profile.

## Sources reviewed

- https://www.finops.org/framework/
- https://www.finops.org/framework/maturity-model/ — appropriate practice depends on business value; advancing every capability is not the goal.
- https://www.finops.org/wg/finops-assessment/ — establish scope, involve relevant people, and use the assessment to identify areas to investigate rather than treating it as precise analytics.

Adaptation and CC BY 4.0 attribution are visible in the tool and guide. Our scoring and 12 questions are separate from the official assessment.

## Validation and limits

Automated checks cover complete low/high/unknown/inapplicable patterns; two-answer exclusions; insufficient area coverage despite eight total answers; all 216 combinations for a three-question area; monotonicity; threshold and arithmetic; answer-specific recommendations; a known gap in an otherwise higher-scored area; payload forgery, MIME/JSON/UTF-8 size; no outbound AI request; full export context; focus, back/edit/reset, category exclusivity, copy failure, and lifecycle counts.

Browser checks include the public baseline, the complete all-unknown phone path, complete strong desktop path with keyboard choice selection, the built-in 78/28 example, actual clipboard content, form controls, result map, and phone widths. Screenshots are taken from the working example; no fabricated UI.

Not established by this pass: external validation of the rubric, real customer testing, physical Android/iOS testing, universal assistive-technology compatibility, or identical PDF pagination on every browser. Print invocation is covered by the interaction test; final PDF pagination still needs independent review. Browser-extension metadata warnings are distinguished from application errors.

Independent Claude review remains PENDING. Do not mark it complete from our own checks.

## Closeout verification

- 125 website checks pass after this pass, including 25 Signal Audit scoring/API/interaction checks.
- Production build completes. Final publication SHA/status is recorded by the release handoff.
- Rendered tool checked at desktop, 375px and 320px; 320px strong-score overflow was found and corrected. The 100/100 values now fit their columns.
- Mobile guide checked at 375px: document width equals scroll width, actual phone image is 336×689 and displayed at 320px. The additional wide recommendation image is intentionally omitted on mobile; its instructions are in the guide’s native text.
- Actual screenshot assets: result 1080×519, next step 1080×435, phone result 336×689. Preview development controls are excluded. No generated interface or edited numbers.
- Direct local HTTP testing of the compatibility endpoint at 127.0.0.1:4173 was unavailable in the managed preview environment. Handler tests validate the API; the browser questionnaire does not require it. Do not call that local HTTP attempt a passed runtime check.
- The canonical Morning Scan workflow was updated in place, preserving identity and existing schedule, to distinguish existing tool upgrades from new ideas and reconcile current releases before repeating findings. Existing specialist audits were preserved.
