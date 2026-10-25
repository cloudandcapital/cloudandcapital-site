import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyDecision, getQuestions } from '../src/lib/interactive-lab.js';
import { POST } from '../src/pages/api/interactive-lab.js';
import { createAnalyticsTracker, validateAnalyticsEvent } from '../src/lib/analytics.js';
import { EXAMPLES, exportCSV, importCSV, parseCSV } from '../src/lib/renewal-tracker.js';

const payload = { decision: 'Review our software renewal options', stage: 'questions' };
const request = (body, headers = {}) => new Request('https://cloudandcapital.com/api/interactive-lab', {
  method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body,
});

test('inherited property names and non-string decision types cannot crash the Lab', async () => {
  for (const decisionType of ['__proto__', 'constructor', 'toString', ['constructor'], {}]) {
    assert.equal(classifyDecision(payload.decision, decisionType), 'renewal');
    assert.equal(getQuestions(decisionType).length, 4);
    const response = await POST({ request: request(JSON.stringify({ ...payload, decisionType })) });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).decisionType, 'renewal');
  }
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
  const response = await POST({ request: new Request('https://cloudandcapital.com/api/interactive-lab', {
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
