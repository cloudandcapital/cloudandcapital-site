import test from 'node:test';
import assert from 'node:assert/strict';
import { QUESTIONS } from '../src/lib/signal-audit.js';
import { POST } from '../src/pages/api/signal-audit.js';
import { createAnalyticsTracker, validateAnalyticsEvent } from '../src/lib/analytics.js';
import { EXAMPLES, exportCSV, importCSV, parseCSV } from '../src/lib/renewal-tracker.js';

const payload = { targetScope: 'product', technologyScopes: ['public-cloud'], answers: Object.fromEntries(QUESTIONS.map(question => [question.id, 'score-2'])) };
const request = (body, headers = {}) => new Request('https://cloudandcapital.com/api/signal-audit', {
  method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body,
});

test('analytics rejects inherited property names without queuing an event', () => {
  let calls = 0;
  const track = createAnalyticsTracker(() => { calls++; });
  for (const event of ['__proto__', 'constructor', 'toString', ['tool_start'], null]) {
    assert.equal(validateAnalyticsEvent(event, {}), null);
    assert.equal(track(event, {}), false);
  }
  assert.equal(calls, 0);
});

test('renewal CSV prefixes formula-like text after leading whitespace and round-trips it', () => {
  for (const text of [' =1+1', '  +1+1', ' -1+1', ' @SUM(1,1)', ' \t=1+1', ' \r=1+1', ' \n=1+1', "  'quoted"]) {
    const csv = exportCSV([{ ...EXAMPLES[0], vendor: text, notes: text }]);
    const rows = parseCSV(csv);
    const header = rows[1];
    assert.equal(rows[2][header.indexOf('vendor')], "'" + text);
    assert.equal(rows[2][header.indexOf('notes')], "'" + text);
    assert.equal(importCSV(csv)[0].vendor, text);
    assert.equal(importCSV(csv)[0].notes, text);
  }
});

test('request limit rejects excessive declared and actual body sizes', async () => {
  for (const headers of [{}, { 'Content-Length': '65536' }, { 'Content-Length': '1' }]) {
    const response = await POST({ request: request(JSON.stringify({ ...payload, extra: 'x'.repeat(65536) }), headers) });
    assert.equal(response.status, 413);
  }
});

test('the request limit counts UTF-8 bytes rather than characters', async () => {
  const response = await POST({ request: request(JSON.stringify({ ...payload, extra: '🌿'.repeat(9000) })) });
  assert.equal(response.status, 413);
});

test('oversized streams are cancelled before the entire input is read', async () => {
  let chunks = 0;
  let cancelled = false;
  const stream = new ReadableStream({
    pull(controller) { chunks++; controller.enqueue(new Uint8Array(8192)); },
    cancel() { cancelled = true; },
  }, { highWaterMark: 0 });
  const response = await POST({ request: new Request('https://cloudandcapital.com/api/signal-audit', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: stream, duplex: 'half',
  }) });
  assert.equal(response.status, 413);
  assert.equal(cancelled, true);
  assert.ok(chunks <= 6);
});

test('unsupported content types and malformed UTF-8 fail without a model call', async () => {
  const plain = await POST({ request: request(JSON.stringify(payload), { 'Content-Type': 'text/plain' }) });
  assert.equal(plain.status, 415);
  const invalid = await POST({ request: request(new Uint8Array([123, 34, 120, 34, 58, 34, 0xc3, 0x28, 34, 125])) });
  assert.equal(invalid.status, 400);
});
