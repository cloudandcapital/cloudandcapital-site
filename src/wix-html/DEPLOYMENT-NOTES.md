# Cloud & Capital Tools — Deployment Notes

## What you have

Two interactive tools:

1. **Signal Audit** — 12-question diagnostic, AI-powered personalized diagnosis, priority focus callout
2. **Interactive Lab** — Decision framing tool with 3 perspective lenses and reframe feature

And two matching Vercel serverless functions that hold the Anthropic API key server-side.

---

## Architecture (the plan)

**Right now (testing locally):**
```
Browser → Anthropic API directly
[API key visible in HTML — only safe for your own testing]
```

**For production (on your website):**
```
Browser → your Vercel function → Anthropic API
[API key lives in Vercel env vars, never touches the browser]
```

You already have this pattern running for Cloud Cost Guard at `lumen-api-nine.vercel.app`. These two new tools plug into the same project.

---

## Deploy steps

### 1. Add the function files to your Vercel project

Drop these into your existing `lumen-api-nine` repo:
- `signal-audit-api.js` → rename to `api/signal-audit.js`
- `interactive-lab-api.js` → rename to `api/interactive-lab.js`

(Your existing old `api/interactive-lab.js` can be replaced — the new one returns a richer schema that matches the updated Lab frontend.)

### 2. Confirm your Anthropic API key env var

In Vercel project settings → Environment Variables, make sure you have:
```
ANTHROPIC_API_KEY = sk-ant-...
```

This is the same key you use for Cloud Cost Guard. If it's already set up for that project, you're done.

### 3. Deploy (git push triggers it automatically)

After deploy, the endpoints will be live at:
- `https://lumen-api-nine.vercel.app/api/signal-audit`
- `https://lumen-api-nine.vercel.app/api/interactive-lab`

### 4. Swap the fetch URL in the HTML files

In `signal-audit.html`, find this block inside `streamDiagnosis`:
```js
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    stream: true,
    messages: [{ role: 'user', content: prompt }]
  })
});
```

Replace with:
```js
const response = await fetch('https://lumen-api-nine.vercel.app/api/signal-audit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ score, tier: tierName, answerSummary })
});
const data = await response.json();
// Then render data.diagnosis in the diagnosisEl instead of streaming
```

Note: The Vercel function returns the full diagnosis at once rather than streaming. You'll lose the typewriter effect but the loading animation still plays. If you want streaming later, we can upgrade to a Vercel Edge function — worth doing eventually but not urgent.

In `interactive-lab.html`, find `getFrame()`. Replace the fetch URL:
```js
const response = await fetch('https://lumen-api-nine.vercel.app/api/interactive-lab', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ decision, perspective })
});
return await response.json();
```

Drop the system prompt and messages construction from the frontend — the Vercel function handles all that now.

---

## What's safe to keep in the browser

- The prompt wording (actually the Vercel version is better — prompt stays server-side, can be refined without redeploying the HTML)
- Model name (not sensitive)

## What must NOT be in the browser

- API key — never, under any circumstances
- Any other secrets

---

## After deploying

Test both tools from your live site. If something breaks:
- Check Vercel function logs (Vercel dashboard → your project → Functions)
- Verify CORS — if embedding on a specific domain, lock `Access-Control-Allow-Origin` to that domain instead of `*`

That's it. Same pattern as Cloud Cost Guard, just two more endpoints.
