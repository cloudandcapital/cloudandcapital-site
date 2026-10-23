# Interactive Lab: manual review follow-up

Diana supplied a manual Claude browser audit on October 22, 2026 (Los Angeles).
Verdict: ready with small fixes. The review tested three requested briefs and
one repeat, and distinguished real browser work from clipboard and print limits.
Its review-copy finding described an intentional pre-release state, not a broken
public guide. Publication follows the fixes and actual generation acceptance.

## Changes

| Finding | Response |
| --- | --- |
| 1: review copy/date | Guide date corrected to October 22. Remove the review marker and noindex, and add the archive entry, after acceptance. |
| 2: privacy overlap | Remove sticky positioning and negative margins from the phone action bar. Both notices remain in normal document flow. |
| 3: renewal notice | Ask about auto-renewal and cancellation/seat-change notice in the cost question and model prompt. Always show a fixed renewal checklist, independent of model wording. |
| 4: added options/owners | Schema v4 requires supplied/suggested option source. Display that distinction and label action roles Suggested owner. Explain that the AI's attribution and available choices still need checking. |
| 5: meter | Give the fill block layout and expose the answer count as a progressbar. |
| 6: variable confidence | Explain that labels can differ between runs and are not measured scores. |
| 7: stale answers | Warn after same-family question edits and retain answers for review. Prompt asks the model to flag conflicting details, without silently choosing a price/deadline. |
| 8–9: certainty/jargon | Strengthen instructions on conditional effects, quality testing, and everyday US English. This is prompt guidance, not a guarantee of all generated prose. |
| 10–11: contrast/focus | Scope label color #6B6B6B to the Lab. Use a solid #3D6055 focus ring. |
| 12: announcements | Remove the full output live region. Announce one short completion message and focus the result heading. |
| 13: returning to a brief | Keep the last brief available while editing, without another generation. Preserve its original input snapshot. |
| 14: export context | Include the question and all four answers in Copy and a dedicated print section. |
| 15: screenshot | Recapture the real recommendation/checklist and comparison/checks after live acceptance, with the pointer outside the image. |
| 16–17: AI example | Match the card to its flat monthly API bill, lead the capacity answer with engineering uncertainty, and explicitly say annual run rate is not savings. |
| 18: controls | Add starter pressed states, active progress step, and View/Hide details text. |

## Verification before deployment

- 104 automated tests pass, including original-input snapshots after edits,
  returning to the last brief without another fetch, changed-decision warnings,
  option source validation, expanded Copy, and accessible state.
- Production build passes.
- Browser at a 375px iframe: no horizontal overflow; 16px clearance between
  action bar and notices; progress fill 150 by 3px at four answers; solid focus
  outline and darker inactive labels observed.

Pending: bounded live renewal, AI, and unknown-context generation; new screenshots;
then directory and guide archive publication. Actual Safari, Firefox, physical
phone, screen reader, and printed-PDF output are not covered by these checks.
