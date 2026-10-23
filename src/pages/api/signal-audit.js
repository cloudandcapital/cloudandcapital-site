import { fallbackInterpretation, scoreAudit, validatePayload } from '../../lib/signal-audit.js';
const MAX_BODY_BYTES = 12_000;
const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers });
// Compatibility endpoint. The questionnaire itself now calculates in the browser.
// No answers are forwarded to an AI provider and no remote service is required.
export async function POST({ request }) {
  if (!/^application\/json(?:;|$)/i.test(request.headers.get('content-type') || '')) return json({ error: { code: 'INVALID_TYPE', message: 'Use application/json.' } }, 415);
  if (Number(request.headers.get('content-length')) > MAX_BODY_BYTES) return json({ error: { code: 'PAYLOAD_TOO_LARGE', message: 'Request payload is too large.' } }, 413);
  let payload;
  const reader = request.body?.getReader();
  if (!reader) return json({ error: { code: 'INVALID_JSON', message: 'Request body must be valid JSON.' } }, 400);
  try {
    const chunks = []; let size = 0;
    for (;;) {
      const { value, done } = await reader.read(); if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) { await reader.cancel(); return json({ error: { code: 'PAYLOAD_TOO_LARGE', message: 'Request payload is too large.' } }, 413); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    payload = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  } catch { return json({ error: { code: 'INVALID_JSON', message: 'Request body must be valid JSON.' } }, 400); }
  finally { reader.releaseLock(); }
  const validated = validatePayload(payload);
  if (!validated.ok) return json({ error: { code: 'INVALID_INPUT', message: validated.error } }, 400);
  const result = scoreAudit(validated.value.answers);
  return json({ result, interpretation: fallbackInterpretation(result, validated.value), source: 'rules' });
}
