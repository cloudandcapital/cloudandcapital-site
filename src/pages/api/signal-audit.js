const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: CORS_HEADERS });
}

export async function POST({ request }) {
  const { score, tier, answerSummary } = await request.json();

  if (typeof score !== 'number' || !tier || !answerSummary) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields: score, tier, answerSummary' }),
      { status: 400, headers: CORS_HEADERS }
    );
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
        'x-api-key': import.meta.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!anthropicResponse.ok) {
      const errText = await anthropicResponse.text();
      console.error('Anthropic API error:', errText);
      return new Response(JSON.stringify({ error: 'AI service error' }), { status: 500, headers: CORS_HEADERS });
    }

    const data = await anthropicResponse.json();
    const diagnosis = data.content?.[0]?.text || '';

    return new Response(JSON.stringify({ diagnosis }), { status: 200, headers: CORS_HEADERS });
  } catch (err) {
    console.error('Handler error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: CORS_HEADERS });
  }
}
