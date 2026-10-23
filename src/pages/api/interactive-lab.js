import {
  DECISION_TYPES,
  MAX_DECISION_CHARS,
  assessReadiness,
  findUnsupportedNumbers,
  getCheckedCalculations,
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
  return `You help visitors to the Cloud & Capital Interactive Lab think through technology spending decisions.

The user has supplied a decision and answered questions. Write a short, useful brief in plain English, like a thoughtful colleague. Explain what to do next and why, without corporate jargon. Differentiate reported facts, assumptions, and checked calculations.

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
  "common_ground": "An evidence-supported shared constraint or likely alignment; do not invent consensus.",
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
- Use only supplied numbers, equivalent time units, or the checked calculations provided below. Never calculate other figures yourself. Keep calculated figures out of known_facts and label them Calculated wherever used.
- Set economics.available to true only when the supplied facts support a defensible comparison. Explain missing inputs when false.
- Preserve every materially distinct option supplied by the user, including partial renewal, unless it is a duplicate or genuinely infeasible. Include two to four genuinely different options.
- The three lenses must be substantively different, not paraphrases.
- Use Explore when critical evidence is missing and no defensible action is ready; Stage when uncertainty is material and a reversible evidence-gathering move exists; Commit when evidence is sufficient, constraints are satisfied, and downside is bounded.
- Recommendation confidence reflects evidence quality, not writing confidence.
- Do not claim that stakeholders agree unless the supplied context reports agreement. Frame common_ground as a supported shared constraint or likely alignment instead.
- Do not describe an extension as having no commercial commitment unless its price and terms are supplied.
- Do not introduce punitive governance actions, access restrictions, contractual claims, or absolute conclusions unsupported by the supplied evidence.
- Unused seats do not prove avoidable cost: pricing may have minimums, bundles, or other terms. Only say reducing seats saves money if the user supplied those terms; otherwise make that conditional on the vendor confirming a lower price. Do not invent utilization policies or assume an existing annual bill proves the next contract's term.
- Unknown replacement costs or migration effort mean switching has not been evaluated, not that it is impossible. Gather that evidence before the supplied deadline when feasible; do not automatically postpone it until the next renewal.
- Do not call a target unreachable merely because one lever disappears when other levers have not been examined.
- No HTML, markdown, tables, bullets, citations, or disclaimers inside fields.
- No generic FinOps slogans, false precision, or authoritative claims about a vendor's commercial terms.
- Return between two and four options so every materially distinct supplied option is represented, and return exactly three next actions.
- Include no more than two working assumptions and two thresholds; use empty arrays when they add nothing.
- Keep most fields under 12 words; recommendation.move and economics.analysis may use up to 30 words. Use concise fragments in option cells and action fields.
- Keep all prose under 420 words in total. Do not repeat the same point in every section. Prefer specific missing evidence over extra explanation.`;
}

function buildUserPrompt(readiness) {
  const evidence = readiness.questions
    .map((question) => `${question.label}:\n${readiness.answers[question.id]}`)
    .join('\n\n');

  const calculations = getCheckedCalculations(buildSourceText(readiness));
  return `Decision:\n${readiness.decision}\n\nUser-supplied evidence:\n${evidence}\n\nChecked arithmetic (calculated, not reported facts; conditions still apply):\n${calculations.map((item) => item.explanation).join('\n') || 'None. Use qualitative comparisons.'}`;
}

async function callModel(readiness, requestSignal) {
  let correction = '';
  const deadline = Date.now() + 55000;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const remaining = deadline - Date.now();
    if (remaining <= 0) throw new Error('MODEL_TIMEOUT');
    const timeout = AbortSignal.timeout(Math.min(48000, remaining));
    const signal = requestSignal ? AbortSignal.any([requestSignal, timeout]) : timeout;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env?.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2600,
        temperature: 0.2,
        system: [{ type: 'text', text: buildSystemPrompt(readiness), cache_control: { type: 'ephemeral' } }],
        messages: [{ role: 'user', content: `${buildUserPrompt(readiness)}${correction}` }],
      }),
      signal,
    });

    if (!response.ok) {
      console.error('Interactive Lab model request failed', { status: response.status, attempt: attempt + 1 });
      throw new Error('MODEL_UNAVAILABLE');
    }

    const data = await response.json();
    if (Date.now() >= deadline) throw new Error('MODEL_TIMEOUT');
    const raw = data.content?.find((part) => part.type === 'text')?.text || '';
    if (data.stop_reason === 'max_tokens') {
      console.error('Interactive Lab model output truncated at max_tokens');
      throw new Error('MODEL_OUTPUT_TRUNCATED');
    }
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    let brief;

    try {
      brief = JSON.parse(cleaned);
    } catch {
      throw new Error('INVALID_MODEL_JSON');
    }

    if (!validateBrief(brief)) {
      console.error('Interactive Lab schema validation failed');
      throw new Error('INVALID_MODEL_SCHEMA');
    }

    const sourceText = buildSourceText(readiness);
    const unsupportedNumbers = [...new Set([
      ...findUnsupportedNumbers(brief, sourceText, { includeCalculations: true }),
      ...findUnsupportedNumbers(brief.known_facts, sourceText),
    ])];
    if (!unsupportedNumbers.length) return brief;

    console.error('Interactive Lab numeric validation failed', { count: unsupportedNumbers.length, attempt: attempt + 1 });
    if (attempt === 1) {
      const error = new Error('UNSUPPORTED_NUMERIC_CLAIM');
      error.rejectedClaims = unsupportedNumbers;
      throw error;
    }
    correction = `\n\nThe draft used unsupported numbers, or placed calculated figures in known_facts: ${unsupportedNumbers.join(', ')}. Regenerate the complete JSON. Keep known_facts to supplied facts. Elsewhere use only supplied values and the exact checked calculations above, labelled Calculated. Use qualitative wording for all other comparisons.`;
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
    const brief = await callModel(readiness, request.signal);
    const calculations = getCheckedCalculations(buildSourceText(readiness));
    return json({ status: 'ready', ...context, brief, calculations });
  } catch (error) {
    const timedOut = ['TimeoutError', 'AbortError'].includes(error.name) || error.message === 'MODEL_TIMEOUT';
    const unavailable = error.message === 'MODEL_UNAVAILABLE';
    console.error('Interactive Lab request failed', { code: timedOut ? 'MODEL_TIMEOUT' : error.message });
    const message = timedOut ? 'That took too long. Your inputs are still here. Try again in a moment.'
      : unavailable ? 'The AI service is unavailable right now. Your inputs are still here. Please try again later.'
        : 'The Lab could not produce a checked brief. Your inputs are still here. Please try again.';
    const knownCodes = ['INVALID_MODEL_JSON', 'INVALID_MODEL_SCHEMA', 'MODEL_OUTPUT_TRUNCATED', 'UNSUPPORTED_NUMERIC_CLAIM'];
    const code = timedOut ? 'MODEL_TIMEOUT' : unavailable ? 'MODEL_UNAVAILABLE' : knownCodes.includes(error.message) ? error.message : 'MODEL_REQUEST_FAILED';
    // Return validation details only to the requesting visitor, never to logs.
    // This is an error response, not a usable or partially repaired brief.
    return json({ error: message, code, rejectedClaims: error.rejectedClaims || [] }, timedOut ? 504 : unavailable ? 503 : 502);
  }
}

export async function GET() {
  return json({
    name: 'Cloud & Capital Interactive Lab',
    version: 2,
    decisionTypes: Object.fromEntries(Object.entries(DECISION_TYPES).map(([key, value]) => [key, value.label])),
  });
}
