# Interactive Lab: manual review follow-up

Diana supplied a manual Claude browser audit on October 22, 2026 (Los Angeles).
Verdict: ready with small fixes. The review tested three requested briefs and
one repeat, and distinguished real browser work from clipboard and print limits.
Its review-copy finding described an intentional pre-release state, not a broken
public guide. Publication follows the fixes and actual generation acceptance.

## Changes

| Finding | Response |
| --- | --- |
| 1: review copy/date | Guide date corrected to October 22. Publication removes the review marker and noindex and adds the archive entry after acceptance. |
| 2: privacy overlap | Remove sticky positioning and negative margins from the phone action bar. Both notices remain in normal document flow. |
| 3: renewal notice | Ask about auto-renewal and cancellation/seat-change notice in the cost question and model prompt. Always show a fixed renewal checklist, independent of model wording. |
| 4: added options/owners | Schema v4 requires supplied/suggested option source. Display that distinction and label action roles Suggested owner. Explain that the AI's attribution and available choices still need checking. |
| 5: meter | Give the fill block layout and expose the answer count as a progressbar. |
| 6: variable confidence | Explain that labels can differ between runs and are not measured scores. |
| 7: stale answers | Warn after same-family question edits and retain answers for review. Prompt asks the model to flag conflicting details, without silently choosing a price/deadline. |
| 8–9: certainty/jargon | Strengthen instructions on conditional effects, quality testing, and everyday US English. After checking all original figures, withhold suspect option cost/effect claims in favor of labeled confirmation checks. Claims elsewhere still trigger retry/failure. This does not guarantee that all remaining prose is grounded. |
| 10–11: contrast/focus | Scope label color #6B6B6B to the Lab. Use a solid #3D6055 focus ring. |
| 12: announcements | Remove the full output live region. Announce one short completion message and focus the result heading. |
| 13: returning to a brief | Keep the last brief available while editing, without another generation. Preserve its original input snapshot. |
| 14: export context | Include the question and all four answers in Copy and a dedicated print section. |
| 15: screenshot | Use authentic recommendation/checklist and comparison/check screenshots, without a cursor. The first figure has a separate readable mobile screenshot; the comparison has a larger-image link. |
| 16–17: AI example | Match the card to its flat monthly API bill, lead the capacity answer with engineering uncertainty, and explicitly say annual run rate is not savings. |
| 18: controls | Add starter pressed states, active progress step, and View/Hide details text. |

## Verification before deployment

- 109 automated tests pass, including original-input snapshots after edits,
  returning to the last brief without another fetch, changed-decision warnings,
  option source validation, expanded Copy, and accessible state.
- Production build passes.
- Browser at a 375px iframe: no horizontal overflow; 16px clearance between
  action bar and notices; progress fill 150 by 3px at four answers; solid focus
  outline and darker inactive labels observed.

Live renewal, AI, and unknown-context briefs generated and were inspected. The
unknown case uses low confidence and labels all options as suggestions. The
renewal and AI arithmetic remains $3,456 (increase $576) and $480,000 annual run
rate respectively. Unsupported no-impact wording triggered a further targeted
guard improvement. The final renewal generated successfully under contract v5:
notice terms first, correct arithmetic, preserved alternatives, and conditional
file-access wording. Copy included all original answers. In the live browser,
editing an answer then returning to the last brief kept its original evidence
without another generation. New desktop and phone screenshot assets are ready.

Actual Safari, Firefox, physical phone, screen reader, and printed-PDF output are
not covered by these checks. Print styles and preserved input content are checked
in source and DOM; this is not a claim of inspecting a printed PDF.
