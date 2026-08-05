import {
  DECISION_TYPES,
  MAX_DECISION_CHARS,
  assessReadiness,
  findUnsupportedNumbers,
  validateBrief,
} from '../../lib/interactive-lab.js';

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

function buildSourceText(readiness) {
  return [readiness.decision, ...Object.values(readiness.answers)].join('\n');
}

function buildSystemPrompt(readiness) {
  return `You are the analytical engine for the Cloud & Capital Interactive Lab, a finance-native decision-framing instrument for technology spend.

The user has already supplied a decision and answered a set of evidence questions. Create a concise, meeting-ready decision brief. The brief must help Finance, FinOps, and Engineering discuss the same decision from shared facts.

Decision family: ${readiness.typeLabel}

Return only valid JSON matching this exact structure:
{
  "decision_summary": "One neutral sentence describing the actual decision and central tension.",
  "posture": { "label": "Explore | Stage | Commit", "rationale": "Why this posture fits the supplied evidence." },
  "known_facts": ["Three to six facts drawn only from the user's text."],
  "working_assumptions": [{ "assumption": "An inference needed to reason", "why_it_matters": "How it could change the decision" }],
  "options": [{
    "name": "A real option",
    "economics": "Cost, value, or exposure using only supplied figures",
    "operational_effect": "What changes for the system or team",
    "reversibility": "High, medium, or low with a short explanation",
    "risk": "The principal downside",
    "evidence_needed": "The evidence required before choosing"
  }],
  "lenses": {
    "finops": { "view": "Cost, allocation, usage, and accountability perspective", "need": "What FinOps still needs" },
    "finance": { "view": "Capital, budget, margin, and downside perspective", "need": "What Finance still needs" },
    "engineering": { "view": "Architecture, delivery, reliability, and operating burden perspective", "need": "What Engineering still needs" }
  },
  "common_ground": "Where all three disciplines agree.",
  "unresolved_tension": "The tradeoff that cannot be resolved from current evidence.",
  "economics": {
    "available": true,
    "analysis": "What can and cannot be concluded economically from supplied evidence.",
    "thresholds": [{ "metric": "A decision variable", "trigger": "A supplied or explicitly qualitative threshold", "meaning": "How it changes the choice", "basis": "User fact or working assumption" }]
  },
  "recommendation": { "move": "A concrete, staged recommendation", "confidence": "Low | Medium | High", "rationale": "Why confidence is at this level" },
  "change_the_answer": ["Two to four developments that would reverse or materially alter the recommendation."],
  "next_actions": [{ "action": "A specific action", "owner": "A role, not a named person", "evidence": "What the action should produce", "timing": "A practical qualitative timing" }]
}

Rules:
- Treat every supplied statement as user-provided context, not independently verified truth.
- Never invent prices, percentages, utilization levels, time periods, savings, ROI, or break-even points.
- Do not introduce any numeric value that does not appear in the user's supplied text. Use qualitative language when figures are absent.
- Set economics.available to true only when the supplied facts support a defensible comparison. Explain missing inputs when false.
- Include two to four genuinely different options. Waiting or staging may be an option when relevant.
- The three lenses must be substantively different, not paraphrases.
- Prefer Stage when uncertainty is material and a reversible evidence-gathering step exists.
- Recommendation confidence reflects evidence quality, not writing confidence.
- No HTML, markdown, tables, bullets, citations, or disclaimers inside fields.
- No generic FinOps slogans, false precision, or authoritative claims about a vendor's commercial terms.
- Return exactly three options and three next actions.
- Include no more than three working assumptions and three thresholds.
- Keep every prose field to one sentence and no more than 35 words.
- Keep the complete response under 1,400 words so the JSON is never truncated.`;
}

function buildUserPrompt(readiness) {
  const evidence = readiness.questions
    .map((question) => `${question.label}:\n${readiness.answers[question.id]}`)
    .join('\n\n');

  return `Decision:\n${readiness.decision}\n\nUser-supplied evidence:\n${evidence}`;
}

async function callModel(readiness) {
  let correction = '';
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env?.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 3200,
        temperature: 0.2,
        system: [{ type: 'text', text: buildSystemPrompt(readiness), cache_control: { type: 'ephemeral' } }],
        messages: [{ role: 'user', content: `${buildUserPrompt(readiness)}${correction}` }],
      }),
      signal: AbortSignal.timeout(90000),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error('Interactive Lab model error:', response.status, detail.slice(0, 500));
      throw new Error('MODEL_REQUEST_FAILED');
    }

    const data = await response.json();
    const raw = data.content?.find((part) => part.type === 'text')?.text || '';
    if (data.stop_reason === 'max_tokens') {
      console.error('Interactive Lab model output truncated at max_tokens');
      throw new Error('MODEL_OUTPUT_TRUNCATED');
    }
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    let brief;

    try {
      brief = JSON.parse(cleaned);
    } catch (error) {
      console.error('Interactive Lab JSON parse error:', error, raw.slice(0, 500));
      throw new Error('INVALID_MODEL_JSON');
    }

    if (!validateBrief(brief)) {
      console.error('Interactive Lab schema validation failed');
      throw new Error('INVALID_MODEL_SCHEMA');
    }

    const unsupportedNumbers = findUnsupportedNumbers(brief, buildSourceText(readiness));
    if (!unsupportedNumbers.length) return brief;

    console.error('Interactive Lab unsupported numeric claims:', unsupportedNumbers);
    if (attempt === 2) throw new Error('UNSUPPORTED_NUMERIC_CLAIM');
    correction = `\n\nYour previous draft was rejected because it introduced these unsupported numeric claims: ${unsupportedNumbers.join(', ')}. Regenerate the complete JSON from scratch. Do not use those claims, calculate derived figures, or replace them with new numbers. Use qualitative language to describe comparisons whose figures were not explicitly supplied.`;
  }
  throw new Error('UNSUPPORTED_NUMERIC_CLAIM');
}

export async function POST({ request }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'The request must contain valid JSON.' }, 400);
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return json({ error: 'Invalid request.' }, 400);
  }

  if (typeof body.decision !== 'string' || !body.decision.trim()) {
    return json({ error: 'Describe the decision before continuing.' }, 400);
  }

  if (body.decision.length > MAX_DECISION_CHARS) {
    return json({ error: `Keep the decision under ${MAX_DECISION_CHARS.toLocaleString()} characters.` }, 400);
  }

  const readiness = assessReadiness({
    decision: body.decision,
    decisionType: body.decisionType,
    answers: body.answers,
  });

  const context = {
    decisionType: readiness.decisionType,
    typeLabel: readiness.typeLabel,
    eyebrow: readiness.eyebrow,
    questions: readiness.questions,
    answers: readiness.answers,
    missing: readiness.missing,
  };

  if (body.stage === 'questions' || !readiness.ready) {
    return json({ status: 'needs_context', ...context });
  }

  if (body.stage !== 'brief') {
    return json({ error: 'Invalid stage. Use questions or brief.' }, 400);
  }

  try {
    const brief = await callModel(readiness);
    return json({ status: 'ready', ...context, brief });
  } catch (error) {
    console.error('Interactive Lab handler error:', error);
    return json({ error: 'The Lab could not produce a validated brief. Your inputs are still here—please try again.' }, 502);
  }
}

export async function GET() {
  return json({
    name: 'Cloud & Capital Interactive Lab',
    version: 2,
    decisionTypes: Object.fromEntries(Object.entries(DECISION_TYPES).map(([key, value]) => [key, value.label])),
  });
}
