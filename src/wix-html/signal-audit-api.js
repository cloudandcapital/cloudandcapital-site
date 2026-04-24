// /api/signal-audit.js
// Vercel serverless function for the Cloud & Capital Signal Audit
// Keeps the Anthropic API key server-side.

export default async function handler(req, res) {
  // CORS headers — adjust origin to your actual domain in production
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { score, tier, answerSummary } = req.body || {};

  if (typeof score !== 'number' || !tier || !answerSummary) {
    return res.status(400).json({ error: 'Missing required fields: score, tier, answerSummary' });
  }

  const prompt = `You are the voice of Cloud & Capital — a finance-native FinOps and cloud economics brand. Your writing is calm, authoritative, and precise. You write for finance leaders, cloud engineers, and operations managers who think in systems.

A user just completed the Cloud & AI Signal Audit. Here are their results:

Total Score: ${score}/36
Tier: ${tier}

Their answers:
${answerSummary}

Write a personalized 3-paragraph diagnosis (250–320 words total) based on their specific answers.

Paragraph 1: Name the core pattern you see across their answers — what does their signal profile actually reveal about how cost moves through their organization? Be specific. Reference 2-3 of their actual responses without listing them mechanically.

Paragraph 2: Identify the most important leverage point for them — the single place where improving signal flow would have the most downstream impact on decision quality. Be concrete and practical.

Paragraph 3: End with one observation about what this means for AI and inference costs specifically — this is where most organizations are behind and your most important message. Keep it sharp, not generic.

Tone: Write like a smart practitioner giving honest feedback to a peer. No bullet points. No headers. No filler phrases like "great job" or "it's worth noting." No AI-sounding sentences. This should read like it was written by someone who has been in the room when these decisions went wrong.`;

  try {
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!anthropicResponse.ok) {
      const errText = await anthropicResponse.text();
      console.error('Anthropic API error:', errText);
      return res.status(500).json({ error: 'AI service error' });
    }

    const data = await anthropicResponse.json();
    const diagnosis = data.content?.[0]?.text || '';

    return res.status(200).json({ diagnosis });
  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
