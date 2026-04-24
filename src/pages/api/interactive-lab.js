const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

const PERSPECTIVE_CONTEXT = {
  finops: 'You are analyzing this decision through a FinOps lens — the discipline of bringing cost into engineering and business decisions. Focus on how cost signal moves through the decision, where commitment pressure exists, and how to preserve optionality while managing spend.',
  finance: 'You are analyzing this decision through a Finance lens — capital allocation, risk management, forecasting accuracy, and commitment structure. Focus on how this decision shapes the financial profile of the organization, the real cost of capital, and downside protection.',
  engineering: 'You are analyzing this decision through an Engineering lens — architecture cost, operational burden, technical tradeoffs, and team capacity. Focus on what this decision means for the system, the team, and the long-term cost of ownership.',
};

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: CORS_HEADERS });
}

export async function POST({ request }) {
  const { decision, perspective } = await request.json();

  if (!decision || !perspective) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields: decision, perspective' }),
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const perspContext = PERSPECTIVE_CONTEXT[perspective];
  if (!perspContext) {
    return new Response(
      JSON.stringify({ error: 'Invalid perspective. Must be: finops, finance, or engineering' }),
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const systemPrompt = `You are the voice of Cloud & Capital — a finance-native cloud economics brand. Your writing is calm, authoritative, and specific. You write for operators, not tourists. No filler, no generic hedging, no AI-sounding phrases.

${perspContext}

You will receive a decision someone is navigating. You must return a structured JSON response with exactly these fields:

{
  "framed_decision": "One sharp sentence (max 25 words) that restates the decision in its true frame. Use italics via <em>tags</em> to emphasize the key tension. This is the thing they'll screenshot.",
  "cost_location": "2-3 sentences (max 45 words) on where cost actually lives in this decision — not the obvious line item, but the structural place where value is being created or destroyed.",
  "real_tradeoff": "2-3 sentences (max 45 words) on the actual tradeoff — not the stated one. What are they really choosing between?",
  "hidden_risk": "2-3 sentences (max 45 words) on the risk that's easy to miss. The thing that bites 6-12 months later, not the obvious one.",
  "what_to_watch": "2-3 sentences (max 45 words) on the one signal or metric that will tell them if this decision is working. Be specific.",
  "the_move": "2-3 sentences (max 55 words) on what a sharp operator would do. Concrete, actionable, not hedged. This is the payoff.",
  "flexibility_score": <number from 0 to 100, where 0 = maximum commitment/locked in, 100 = maximum flexibility/optionality preserved. This reflects where the CURRENT direction of the decision sits, not where it should go.>
}

Rules:
- Return ONLY the JSON object, no preamble, no markdown fences
- Write like a peer giving sharp advice, not a consultant hedging
- Be specific to the decision — no generic FinOps bromides
- Use "you/your" to address them directly
- No bullet points within fields — clean prose only
- The framed_decision should feel like a line someone would write on a whiteboard`;

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
        max_tokens: 1500,
        system: systemPrompt,
        messages: [{ role: 'user', content: `Decision to frame:\n\n${decision}` }],
      }),
    });

    if (!anthropicResponse.ok) {
      const errText = await anthropicResponse.text();
      console.error('Anthropic API error:', errText);
      return new Response(JSON.stringify({ error: 'AI service error' }), { status: 500, headers: CORS_HEADERS });
    }

    const data = await anthropicResponse.json();
    const text = data.content?.[0]?.text || '';
    const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error('JSON parse error:', parseErr, 'Raw text:', text);
      return new Response(JSON.stringify({ error: 'Failed to parse AI response' }), { status: 500, headers: CORS_HEADERS });
    }

    return new Response(JSON.stringify(parsed), { status: 200, headers: CORS_HEADERS });
  } catch (err) {
    console.error('Handler error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: CORS_HEADERS });
  }
}
