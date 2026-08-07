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
