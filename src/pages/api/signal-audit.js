import { DIMENSIONS, QUESTIONS, TARGET_SCOPES, TECHNOLOGY_SCOPES, fallbackInterpretation, scoreAudit, validatePayload } from '../../lib/signal-audit.js';

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
const MAX_BODY_BYTES = 12_000;
const TIMEOUT_MS = 12_000;

const SYSTEM_PROMPT = `You write concise, finance-native interpretation for Cloud & Capital's independent Technology Cost Signal Audit. Return valid JSON only with exactly these string keys: pattern_read (40-70 words), decision_implication (40-70 words), scope_watchpoint (30-60 words).
Reference the actual answer pattern without listing answers. Respect the selected target and technology scope. Explain a material axis mismatch. Avoid generic advice, invented company facts, universal finance sign-off, or claims that chargeback is inherently more mature than showback. Do not make universal accounting claims about AI training or inference. This assessment is directional, not a certification.`;

function wordCount(value) { return value.trim().split(/\s+/).filter(Boolean).length; }
function validInterpretation(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const ranges = { pattern_read: [40, 70], decision_implication: [40, 70], scope_watchpoint: [30, 60] };
  return Object.keys(ranges).every((key) => typeof value[key] === 'string' && wordCount(value[key]) >= ranges[key][0] && wordCount(value[key]) <= ranges[key][1]);
}

export async function POST({ request }) {
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > MAX_BODY_BYTES) return json({ error: { code: 'PAYLOAD_TOO_LARGE', message: 'Request payload is too large.' } }, 413);

  let raw;
  try { raw = await request.text(); } catch { return json({ error: { code: 'INVALID_REQUEST', message: 'Could not read request body.' } }, 400); }
  if (raw.length > MAX_BODY_BYTES) return json({ error: { code: 'PAYLOAD_TOO_LARGE', message: 'Request payload is too large.' } }, 413);
  let payload;
  try { payload = JSON.parse(raw); } catch { return json({ error: { code: 'INVALID_JSON', message: 'Request body must be valid JSON.' } }, 400); }

  const validated = validatePayload(payload);
  if (!validated.ok) return json({ error: { code: 'INVALID_INPUT', message: validated.error } }, 400);
  const { targetScope, technologyScopes, answers } = validated.value;
  const result = scoreAudit(answers);
  const targetLabel = TARGET_SCOPES.find((item) => item.id === targetScope).label;
  const technologyLabels = technologyScopes.map((id) => TECHNOLOGY_SCOPES.find((item) => item.id === id).label);
  const fallback = fallbackInterpretation(result, { targetScope: targetLabel, technologyScopes: technologyLabels });
  const apiKey = import.meta.env?.ANTHROPIC_API_KEY;
  if (!apiKey) return json({ result, interpretation: fallback, source: 'deterministic' });
  const answerPattern = QUESTIONS.map((question) => {
    const option = question.options.find((item) => item.id === answers[question.id]);
    return { question: question.title, dimension: DIMENSIONS.find((item) => item.id === question.dimension).name, answer: option?.label || 'Unanswered', score: option?.score ?? null };
  });
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST', signal: controller.signal,
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 500,
        system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
        messages: [{ role: 'user', content: JSON.stringify({ target_scope: targetLabel, technology_scope: technologyLabels, trusted_result: result, answer_pattern: answerPattern }) }],
      }),
    });
    if (!response.ok) return json({ result, interpretation: fallback, source: 'deterministic' });
    const data = await response.json();
    const text = data.content?.find((item) => item.type === 'text')?.text || '';
    let interpretation;
    try { interpretation = JSON.parse(text.replace(/^```json\s*|\s*```$/g, '')); } catch { interpretation = null; }
    return json({ result, interpretation: validInterpretation(interpretation) ? interpretation : fallback, source: validInterpretation(interpretation) ? 'ai' : 'deterministic' });
  } catch {
    return json({ result, interpretation: fallback, source: 'deterministic' });
  } finally { clearTimeout(timeout); }
}
