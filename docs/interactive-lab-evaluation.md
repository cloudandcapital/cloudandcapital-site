# Interactive Lab verification

The Lab turns a technology spending question into a short decision brief:
a suggested next move, an option comparison, missing information, and practical
actions. Version 4 labels whether each option was supplied or suggested. It keeps
the short report introduced in version 3, without repeated facts, functional
lenses, or speculative thresholds.

## Current behavior

- Four answers are required; unknown information can be stated as unknown.
- All five starter cases include explicitly illustrative evidence. Partial
  edits keep that label. Reset starts a fresh case.
- Back preserves answers when the decision family stays the same. A different
  family clears incompatible answers.
- The original context is available in the completed brief. Calculations are
  displayed separately from generated prose.
- Copy and print include the original question and all four answers, along with
  the result and example label. Editing keeps the last generated brief available
  without another model call. Its original input snapshot stays attached.
- Phone layouts show comparisons and action lists as labelled cards.
- A fixed renewal checklist asks about auto-renewal and cancellation or seat-change
  notice deadlines. It is visible even if the generated prose omits that check.
- Same-family edits to the question warn visitors to recheck retained answers.
- One short live status announces completion; focus moves to the brief heading.

## Generation and checks

The server uses Sonnet 4.6 at explicit low effort with a compact native JSON
schema and a 1,800 output-token ceiling. It allows at most two attempts within
55 seconds. The browser aborts after 60 seconds; Cancel and errors retain inputs.
Timing labels are constrained to Now, Before the deadline, or Before choosing.
Only capitalization of recognized enum values is normalized.

The prompt asks for qualitative reasoning rather than numeric restatement.
A separate numeric check still rejects invented figures, units, and durations.
Only the server calculates a narrowly defined price increase, or a monthly run
rate over an explicitly supplied yearly horizon. Ambiguous bases, currencies,
credits, ranges, and unsupported arithmetic are excluded. These calculations
include their assumptions and are not commitment quotes or proven savings.

This does not verify contract terms. Seat reduction is only a cost-saving option
if the vendor confirms lower pricing. Unknown migration costs are missing
evidence, not proof that switching is infeasible.

Errors return a failure code and bounded validation details to the requesting
visitor, without returning an unchecked draft or logging input text.

## Automated checks

Run `npm test` and `npm run build`. Regression cases cover Back, complete starters,
example labels, cancellation, stale responses, browser timeouts, Copy, arithmetic,
unit equivalence, numeric rejection, schema errors, truncation, and request budgets.

The opt-in live-model evaluator is excluded from CI. Run only against a local
server with its existing server-side key, or an authorized protected preview:

```bash
INTERACTIVE_LAB_URL=http://127.0.0.1:4321/api/interactive-lab npm run evaluate:interactive-lab
```

Do not run the full evaluator against production. For deployment acceptance,
use bounded manual UI checks of the renewal starter, AI build/buy starter, and
an under-specified own question. Inspect the recommendation against supplied
terms, deadline, unknowns, and arithmetic; also check Back, Copy, and phone layout.
Keep the directory entry under review until actual generation passes.

## Findings from the repair

The initial live checks exposed discarded answers, incomplete starter cases,
slow generation, a hyphenated count-unit parsing bug, an arbitrary fact-list cap,
and invented timelines in the long report. The compact contract removes those
reporting demands while retaining the numeric check and separate arithmetic.

Provider references:
- https://platform.claude.com/docs/en/build-with-claude/effort
- https://platform.claude.com/docs/en/build-with-claude/structured-outputs
