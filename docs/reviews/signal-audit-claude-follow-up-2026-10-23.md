# Signal Audit: independent review follow-up

Rubric version: `2026-10-23-r2`. Previous release: `9b871f423917428611b76844281ff8a30970bae1`.

Diana supplied Claude's completed October 23 review. Claude reported matching the original published arithmetic on 200,000 cases and inspecting live network behavior. Those are independent review findings, not tests we reran or a validation of the rubric against business outcomes.

## Recommendation blockers fixed

1. All score-2 answers retain the independently chosen 67/67 map classification, but now get a conditional, answer-specific check. They no longer get blanket maintenance. The suggestion explicitly allows keeping the existing practice if it meets the business's needs.
2. A known answer supports a first step even when exclusions prevent an overall map. The supplied small SaaS case (2,2,1,N/A,1,N/A,1,0,1,1,1,1) now keeps the renewal step with ten scored answers and a visible explanation of why the map is withheld. A single known renewal zero also remains actionable when every other answer is unknown.
3. Individual severity ranks before an area's average: a zero cannot disappear behind three ones in another area. Among tied individual scores, use the lower mean of available answers in their area, then the disclosed area order and question order. An area with only one answer can help choose a step but still receives no published area score or overall map placement.

The normalization, exclusion denominator, rounded axis arithmetic, 67 boundary and minimum coverage rules are unchanged. The renewal example remains 89/67/22/33 by area, 78/28 by axis, eleven scored and one not applicable.

## Smaller findings addressed

- Lining, tabular sans-serif numerals replace old-style serif figures in score tiles and area scores. Both 100/100 values fit at 320px. The declared DM Sans currently falls back to the platform sans-serif; font loading remains a nonblocking visual refinement noted in the independent recheck.
- An edited example keeps an explicit edited-example label and loses the original scenario description. Copy preserves this provenance. Example results say “Example result.”
- Begin and Next stay keyboard reachable and show the existing friendly errors when a selection is missing.
- Changing scope or categories shows the answer count that will be cleared before Begin. Unchanged selections keep the answers.
- Scope-fit results explain genuine exclusions, use relevant owners/checks, and ask different discussion questions from unknown-information results.
- The result and Copy show the date taken and an explicitly labeled rubric version. The date/version also sit inside the printable result header.
- Weak forecasting/anomaly options describe a missed check or late response, rather than treating an annual budget or manual review as inherently weak.
- Print headings avoid following-page orphans, paragraphs have widow/orphan rules, and screen-only Start fresh instructions are hidden. Before/after print events open and then restore answer/method disclosures, including repeated beforeprint events.
- The guide explains the revised recommendations, edited examples, dated output and correct screenshot contents. Directory copy now includes “what to check.” All three screenshots are actual rendered output, without fabricated numbers.

Small optional improvements included: renewal results link to the existing Renewal Tracker; switching Mixed versus individual categories announces what was cleared; made-up examples use a distinct allowlisted start event with no answers/scores.

## Verification

- 134 website tests pass, including 34 Signal Audit scoring, API and UI tests. Production build and whitespace checks pass.
- Regression coverage includes both supplied blockers, the hidden zero, incomplete areas, scope-fit wording, conditional middle answers, edited-example exports, print disclosure lifecycle and 1,500 deterministic mixed-answer cases that cannot suppress the lowest known answer.
- Rendered Chromium checks reproduce the exact all-middle and small SaaS cases using the actual controls, verify the unchanged worked example, and inspect 320px/375px output and edited provenance. No horizontal overflow; strong-score numerals fit.
- Actual output screenshots: result 1080×555; renewal advice 1080×479; phone result 336×749. A temporary screenshot-only route used the production page/component with surrounding content hidden for the renewal crop; it changed no answers, text, spacing inside the component or calculations, and was deleted before publication.
- Current primary FinOps Foundation Assessment Guide and Maturity Model rechecked: scope consistency and business value remain the principles; maximizing every score is not a goal. Attribution and independent-rubric limits stay visible.

## Still not verified / later

Native Chrome/Safari PDF pagination is still unverified. The cloud browser can invoke Print but does not expose a usable native print-preview/export interface. Print invocation and disclosure restoration are tested; that is not proof of final page breaks. No physical phone, Safari/Firefox or real screen-reader testing is claimed.

Deferred product choices: per-area “good enough” targets, changing the all-lowest tie order, and reversing the answer display order. They need a separate product decision, not a feature added solely because an alternative assessment has it. The focused independent r2 recheck is recorded below.

## Focused independent recheck received

Diana supplied Claude's recheck of the deployed `2026-10-23-r2` rubric. All seven targeted items pass: the original blockers, known answers in incomplete areas, the hidden renewal zero, maintenance/scope fit, edited-example provenance and the UI fixes. Claude also reconciled the worked example again and reported that no answers, scores or scope values reached analytics. This supersedes the earlier pending recheck status; it is distinct from our own tests.

One wording defect remained around withheld maps. Scope-fit results still called exclusions “missing information,” and a generic notice claimed that an information/scope check came from a scored answer. The copy-only follow-up fixes the pattern meaning and map description, and shares a cause-specific notice between the screen and copied summary. It distinguishes a known scored answer, genuine not-applicable exclusions, and unknown/unanswered information. No scoring, priority, coverage or cutoff rule changes; the rubric version remains r2.

The edited-example note now says its answers started from the made-up example. The guide caption names `2026-10-23-r2` exactly. The approved example screenshots still match: their captured header/renewal content is unchanged.

138 website tests pass, including 38 Signal Audit tests. Added regression cases cover all N/A, all unknown, strong answers with two N/A exclusions, and a known gap in an incomplete area. They check the pattern wording, map text and exact agreement between the on-screen notice and Copy. Browser and production verification are recorded in the release checkpoint.

Still open: real Chrome/Safari PDF pagination. No simulated page count or identical cross-browser pagination is claimed. Further tied-gap summaries, reminders about residual unknowns, and font-loading refinement are nonblocking product/design ideas rather than reopened scoring defects.

Visual regression evidence: [all-not-applicable wording](signal-audit-exclusions-wording-2026-10-23.jpg), captured from the working tool without changing its answers or result.
