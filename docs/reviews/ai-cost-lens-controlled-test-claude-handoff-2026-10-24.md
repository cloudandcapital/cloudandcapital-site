# AI Cost Lens: focused manual Claude review

Prepared October 24, 2026. This is the next manual review in docs/tool-quality-plan.md, for Diana to paste into her own Claude app after her usage resets. It has not been sent to the connected reviewer. It is a handoff, not a second backlog.

## Paste into Claude

Please independently review AI Cost Lens's new controlled-test workflow and its matching guide. Start as a visitor, then inspect the current source and relevant tests. Review only: do not edit, commit, publish, send messages or run paid provider calls. Use invented inputs and keep any downloaded test records private.

Live tool: https://lens.cloudandcapital.com/

Full guide: https://lens.cloudandcapital.com/guide.html#test-one-change

Beginner walkthrough: https://cloudandcapital.com/insights/using-ai-cost-lens

Source: https://github.com/cloudandcapital/ai-cost-lens

The current source when this handoff was prepared is 97ac849cf9faa3aefd0b47e460b7f4a6defc25d2. The feature was PR43 and the full-guide update was PR44. Read the fresh default-branch version first and record the actual version you review. Keep new findings distinct from older audits and any later concurrent changes.

The aim is practical: can a visitor compare the cost and quality of one API change, retain the evidence, and understand what the result does and does not establish? This tool records tests the visitor runs. It does not execute the AI setups or confirm a saving from a bill alone.

1. Check discoverability. Choose Explore an example on the welcome screen, then Verify, between Simulate and Evidence. A small screen uses the section dropdown. Verify does not appear in the simple Compare two options workflow. Does the guide explain those paths accurately?
2. Try the illustrative caching example, then create a record through the real own-input controls. Check one-change locking, workload/currency, before/after settings and the ready-result rule. Reserve validation cases before tuning. Check the boundary between tuning and validation, and what happens if the rule or settings change after validation begins.
3. Check fresh paired evidence. The setups should use the same case IDs and quality checks. Include all calls and retries in the supplied API costs, a source reference, and fresh-run confirmation. Try duplicate evidence, reused outputs/costs, mismatched cases or rubrics, invalid/zero values, missing outcomes and missing optional review minutes. A renamed saved record must not count as fresh evidence.
4. Reconcile the example independently. It uses the same 40 invented cases twice, not 80 distinct cases. Its costs are $0.40 to $0.22 in run one and $0.42 to $0.23 in run two. With all 40 ready, API cost per ready result should be $0.0100 to $0.0055, then $0.0105 to $0.00575. Read the displayed rounding separately from the stored numeric representation.
5. Check the verdict boundaries. At least two fresh validation runs on the same 30 or more reserved cases, the declared sampling/review controls, retained quality and lower API unit cost in every run can produce Candidate worth a finance review. It must not imply statistical proof, automatic adoption, an approved route change or approved savings. A quality failure or non-improvement must retain the starting setup. Review tiny costs carefully.
6. Exercise Download test record, Open saved test and recalculation after reopening; inspect the actual file. Check Print test record and Attach summary to this review, including mismatched workload, currency or illustrative status. The workspace archive should keep the separate test record. Raw outputs should stay out. Test API costs must not populate production Actuals or approve savings. Human effort and full operating costs need their own evidence.
7. Keep the beginner comparison in scope as a regression check. Enter Plan A: $80 monthly, 20 checked, 18 usable, 60 review minutes. Plan B: $40, 20 checked, 16 usable, 120 minutes. Use 100 monthly tasks, $30/hour and a 75% usable floor. Expected: A $230 including time, 90 usable, $2.56 each; B $340, 80 usable, $4.25 each. Unconfirmed policy approval should remain visible. Time value is not cash savings.
8. Compare all of this with both guides. Check the explanation of repeated cases, quality checks, costs, file handling, possible caching causes and the useful next step. Flag misleading or overcomplicated wording in Diana's casual, readable voice. Do not interpret a missing cache-read count as a confirmed root cause.

Use actual controls, mobile layout, keyboard navigation and downloads where available. Record the exact print method; a headless PDF of downloaded HTML is not a native browser print-dialog check. If a surface is unavailable, label it unverified. Provider-file coverage, physical phones and other browsers are separate acceptance items unless you actually exercise them.

Return a short verdict, reproducible defects ordered by impact, arithmetic and file evidence, guide mismatches, and checks that remain unverified. Give expected versus actual behavior and the source version for each defect. Report no new bug if the paths hold. Keep optional design preferences separate from functional failures. Do not reopen Cloud Cost Guard's completed targeted repair loop as part of this review.
