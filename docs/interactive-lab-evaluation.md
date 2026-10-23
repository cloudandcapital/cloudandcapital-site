# Interactive Lab specificity evaluation

The Interactive Lab evaluation is an opt-in live-model check. It is deliberately excluded from `npm test`, so CI does not need production credentials or make paid model calls.

Run the site locally with `ANTHROPIC_API_KEY` available only to the server, then point the evaluator at its API route:

```bash
INTERACTIVE_LAB_URL=http://127.0.0.1:4321/api/interactive-lab npm run evaluate:interactive-lab
```

To evaluate a protected Vercel preview, use its API URL. If deployment protection requires an automation bypass secret, pass it through the environment; the runner sends it as Vercel's protection-bypass header and never prints it:

```bash
INTERACTIVE_LAB_URL=https://your-preview.vercel.app/api/interactive-lab \
VERCEL_PROTECTION_BYPASS=your-protected-preview-bypass-secret \
npm run evaluate:interactive-lab
```

When the local Vercel CLI is authenticated for the linked project, it can supply the protection bypass automatically without handling a secret directly:

```bash
VERCEL_DEPLOYMENT=https://your-preview.vercel.app npm run evaluate:interactive-lab
```

Use a local environment or protected preview, not the production endpoint. The seven scenarios cover SaaS renewal, GPU commitment, AI build-or-buy, cloud cost review, multi-cloud, a high-evidence Commit control, and an underdetermined Explore control. The runner checks schema validity, expected posture, supplied evidence, scenario specificity, terminology leakage, numeric grounding, malformed fallback text, and distinct recommendations.

## Repair checks, October 23, 2026

The Lab preserves answers when returning to the same decision family. Changing
families clears incompatible answers. All five starters include complete,
explicitly illustrative evidence; that label remains after partial edits.

Generation is limited to two attempts within a 55-second server budget, with a
60-second browser cutoff and cancellation. Errors keep the visitor's inputs.
Numeric validation accepts equivalent time units and ordinary recurrence wording
such as “one-time.” It still rejects invented counts, prices, and savings.

The server can independently check a narrowly defined price increase, or a
monthly run rate over an explicitly supplied yearly horizon. These appear in a
separate calculation section with conditions. Ambiguous bases, credits, multiple
currencies, and unsupported arithmetic are excluded. Checked amounts cannot be
listed as user-reported facts. This numeric check does not verify contracts or
prove that a cheaper seat count is available.

Regression checks: `npm test`. Re-test a renewal, AI build/buy, and an under-specified
case through the deployed UI, including Back, cancellation, Copy, and mobile
layout. Keep the directory entry under review until real generation succeeds.

The first bounded production renewal check timed out with its inputs intact.
The follow-up keeps Sonnet 4.6, explicitly sets low effort, and requests a much
shorter brief (420 prose words; 2,600 output-token cap). This follows the
provider's effort guidance: https://platform.claude.com/docs/en/build-with-claude/effort.
Loading and results scroll into view so the status and next move are visible.

The shorter Sonnet request also timed out. The next repair uses the pinned
Claude Haiku 4.5 snapshot (`claude-haiku-4-5-20251001`) with the same prompt,
validation, and deadline. The numeric rules do not rely on model arithmetic.
Provider reference: https://platform.claude.com/docs/en/models/haiku-4-5/overview.
The noindex responsive-review helper now accepts `page=lab` as an allowlisted
local route so actual generation can be checked at phone widths.

The first Haiku check returned within the deadline but failed validation.
A deterministic regression reproduced rejection of “12-seat” versus “12 seats”;
count-unit parsing now preserves hyphenated count modifiers. Error responses
carry a bounded failure code and rejected numeric claims back to the requesting
visitor, never to logs, so live validation can be diagnosed without exposing a
rejected draft as a usable brief.
