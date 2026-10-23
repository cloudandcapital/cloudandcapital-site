import test from 'node:test';
import assert from 'node:assert/strict';
import { DIMENSIONS, QUESTIONS, EXAMPLE, HIGH_BOUNDARY, buildAuditSummary, classifyArchetype, scoreAudit, validatePayload, discussionQuestions } from '../src/lib/signal-audit.js';
import { POST } from '../src/pages/api/signal-audit.js';
const answersAt = (score) => Object.fromEntries(QUESTIONS.map((q) => [q.id, typeof score === 'number' ? `score-${score}` : score]));
const byArea = (scores) => Object.fromEntries(QUESTIONS.map((q) => [q.id, `score-${scores[q.dimension]}`]));
const validPayload = (answers = answersAt(2)) => ({ targetScope: 'product', technologyScopes: ['public-cloud'], answers });
const request = (body, headers = {}) => new Request('https://cloudandcapital.com/api/signal-audit', { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });

test('12 distinct questions cover four areas, with unknown distinct from not applicable', () => {
  assert.equal(QUESTIONS.length, 12); assert.equal(new Set(QUESTIONS.map((q) => q.id)).size, 12);
  for (const d of DIMENSIONS) assert.equal(QUESTIONS.filter((q) => q.dimension === d.id).length, 3);
  for (const q of QUESTIONS) {
    assert.deepEqual(q.options.filter((o) => o.score !== null).map((o) => o.score), [0, 1, 2, 3]);
    assert.equal(q.options.find((o) => o.id === 'outside-visibility').score, null);
    assert.equal(q.options.find((o) => o.id === 'not-applicable').score, null);
  }
});
test('minimum and maximum score endpoints, with maintenance rather than an invented defect at maximum', () => {
  const minimum = scoreAudit(answersAt(0)); const maximum = scoreAudit(answersAt(3));
  assert.deepEqual(minimum.axes, { signalReadiness: 0, decisionIntegration: 0 });
  assert.equal(minimum.archetype.name, 'Invoice Led'); assert.equal(minimum.priority.kind, 'improve');
  assert.deepEqual(maximum.axes, { signalReadiness: 100, decisionIntegration: 100 });
  assert.equal(maximum.archetype.name, 'Decision Embedded'); assert.equal(maximum.priority.kind, 'maintain');
  assert.equal(scoreAudit(answersAt(2)).priority.kind, 'review');
});
test('the four patterns match their axis positions at the disclosed 67 point boundary', () => {
  assert.equal(HIGH_BOUNDARY, 67);
  for (const [x, y, name] of [[66, 66, 'Invoice Led'], [67, 66, 'Visible, Not Embedded'], [66, 67, 'Decisions Ahead of the Data'], [67, 67, 'Decision Embedded']]) assert.equal(classifyArchetype(x, y).name, name);
  assert.equal(classifyArchetype(null, 70), null);
});
test('all-unknown and all-inapplicable answers do not diagnose a process failure', () => {
  for (const id of ['outside-visibility', 'not-applicable']) {
    const r = scoreAudit(answersAt(id));
    assert.equal(r.valid, false); assert.equal(r.weakest, null); assert.equal(r.answeredCount, 0);
    assert.equal(r.priority.kind, 'evidence'); assert.equal(r.priority.questionId, null);
    assert.equal(r.axes.signalReadiness, null); assert.equal(r.axes.decisionIntegration, null);
    assert.equal(r.coverage[id === 'outside-visibility' ? 'unknown' : 'notApplicable'].length, 12);
    assert.doesNotMatch(r.priority.move, /Require|economics upstream/);
  }
});
test('eight answers must include two in each area; excluding a question does not lower its denominator', () => {
  const answers = answersAt('not-applicable');
  for (const d of DIMENSIONS) QUESTIONS.filter((q) => q.dimension === d.id).slice(0, 2).forEach((q) => { answers[q.id] = 'score-3'; });
  const r = scoreAudit(answers); assert.equal(r.valid, true); assert.equal(r.answeredCount, 8);
  assert.deepEqual(Object.values(r.dimensions).map((d) => d.score), [100, 100, 100, 100]);
  const concentrated = answersAt('outside-visibility'); QUESTIONS.slice(0, 8).forEach((q) => { concentrated[q.id] = 'score-3'; });
  const partial = scoreAudit(concentrated); assert.equal(partial.valid, false); assert.equal(partial.priority.kind, 'evidence');
});
test('a single missing answer is visible and two missing in an area withhold its score', () => {
  const answers = answersAt(3); answers.forecasting = 'outside-visibility';
  const r = scoreAudit(answers); assert.equal(r.dimensions['signal-clarity'].score, 100); assert.equal(r.valid, true); assert.equal(r.priority.kind, 'evidence');
  answers.attribution = 'not-applicable'; const partial = scoreAudit(answers);
  assert.equal(partial.dimensions['signal-clarity'].score, null); assert.equal(partial.valid, false);
  assert.equal(partial.coverage.unknown.length, 1); assert.equal(partial.coverage.notApplicable.length, 1);
});
test('all combinations of three answers are bounded and exclusions never become a scored zero', () => {
  const states = ['score-0', 'score-1', 'score-2', 'score-3', 'outside-visibility', 'not-applicable'];
  const group = QUESTIONS.slice(0, 3);
  for (const a of states) for (const b of states) for (const c of states) {
    const selection = [a, b, c]; const answers = answersAt(3);
    group.forEach((q, i) => { answers[q.id] = selection[i]; });
    const area = scoreAudit(answers).dimensions['signal-clarity'];
    const scored = selection.filter((x) => x.startsWith('score-')).map((x) => Number(x.slice(-1)));
    assert.equal(area.answered, scored.length);
    if (scored.length < 2) assert.equal(area.score, null);
    else { assert.equal(area.score, Math.round(100 * scored.reduce((a, b) => a + b, 0) / (3 * scored.length))); assert.ok(area.score >= 0 && area.score <= 100); }
  }
});
test('raising one scored answer never reduces either axis or any area score', () => {
  for (const q of QUESTIONS) for (const level of [0, 1, 2]) {
    const answers = answersAt(1); answers[q.id] = `score-${level}`; const before = scoreAudit(answers);
    answers[q.id] = `score-${level + 1}`; const after = scoreAudit(answers);
    assert.ok(after.dimensions[q.dimension].score >= before.dimensions[q.dimension].score);
    for (const axis of Object.keys(before.axes)) assert.ok(after.axes[axis] >= before.axes[axis]);
  }
});
test('the renewal example reconciles to 78/28 and its recommendation comes from the renewal answer', () => {
  const r = scoreAudit(EXAMPLE.answers);
  assert.deepEqual(r.axes, { signalReadiness: 78, decisionIntegration: 28 });
  assert.deepEqual(Object.values(r.dimensions).map((d) => d.score), [89, 67, 22, 33]);
  assert.equal(r.answeredCount, 11); assert.equal(r.priority.questionId, 'commitments-contracts');
  assert.match(r.priority.move, /notice date/); assert.match(r.priority.reason, /renew automatically/);
});
test('a tied area with a known zero takes precedence over uniformly working answers', () => {
  const answers = answersAt(2); answers['cost-driver-visibility'] = 'score-0'; answers.attribution = 'score-3'; answers.forecasting = 'score-3';
  const r = scoreAudit(answers); assert.equal(r.dimensions['signal-clarity'].score, 67);
  assert.equal(r.priority.questionId, 'cost-driver-visibility');
});
test('equal low areas use the disclosed decision-timing tie order', () => {
  const r = scoreAudit(answersAt(1)); assert.equal(r.weakest, 'decision-timing'); assert.equal(r.priority.questionId, 'architecture-vendor');
});
test('axis arithmetic uses the disclosed rounded area scores', () => {
  const r = scoreAudit(byArea({ 'signal-clarity': 1, 'economic-context': 2, 'decision-timing': 0, 'operating-response': 3 }));
  assert.deepEqual(r.axes, { signalReadiness: 50, decisionIntegration: 50 });
});
test('complete payload validation rejects missing, forged, and contradictory input', () => {
  const invalid = [null, [], {}, { ...validPayload(), targetScope: 'forged' }, { ...validPayload(), technologyScopes: ['mixed', 'saas'] }, { ...validPayload(), answers: {} }, { ...validPayload(), answers: { ...answersAt(3), forged: 'score-3' } }, { ...validPayload(), answers: { ...answersAt(3), forecasting: 'score-99' } }];
  for (const payload of invalid) assert.equal(validatePayload(payload).ok, false);
  assert.equal(validatePayload(validPayload()).ok, true);
});
test('API recomputes the result, ignores supplied scores and makes no outbound AI request', async () => {
  const original = globalThis.fetch; let calls = 0;
  globalThis.fetch = async () => { calls++; throw new Error('No outbound network expected'); };
  try {
    const response = await POST({ request: request({ ...validPayload(answersAt(0)), result: { axes: { signalReadiness: 100 } }, tier: 'Decision Embedded' }) });
    assert.equal(response.status, 200); assert.equal(response.headers.get('cache-control'), 'no-store');
    const body = await response.json(); assert.equal(body.result.axes.signalReadiness, 0); assert.equal(body.source, 'rules'); assert.equal(calls, 0);
  } finally { globalThis.fetch = original; }
});
test('API rejects invalid JSON, media type, complete forged answers, and oversized UTF-8 bodies', async () => {
  const invalidJson = await POST({ request: new Request('https://example.test', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{' }) }); assert.equal(invalidJson.status, 400);
  const type = await POST({ request: request(validPayload(), { 'Content-Type': 'text/plain' }) }); assert.equal(type.status, 415);
  const bad = await POST({ request: request(validPayload({ ...answersAt(2), forecasting: 'score-99' })) }); assert.equal(bad.status, 400);
  const size = await POST({ request: request({ ...validPayload(), padding: 'é'.repeat(7000) }) }); assert.equal(size.status, 413);
});
test('copy output preserves date, scope, all answers, exclusions, first-step basis, and the illustrative label', () => {
  const summary = buildAuditSummary(scoreAudit(EXAMPLE.answers), { ...EXAMPLE, isExample: true, takenAt: '2026-10-23T12:00:00Z' });
  assert.match(summary, /Taken: Oct 23, 2026/); assert.match(summary, /Rubric version: 2026-10-23-r2/);
  assert.match(summary, /Made-up example/); assert.match(summary, /11\/12 scored; 0 unknown; 1 not applicable/);
  assert.match(summary, /78\/100 points/); assert.match(summary, /Why this first/);
  for (const q of QUESTIONS) assert.ok(summary.includes(q.options.find((o) => o.id === EXAMPLE.answers[q.id]).label));
  assert.match(summary, /Scope: One team or shared service/); assert.match(summary, /not a certification/);
});

test('a known low answer takes precedence over partial practices in lower average areas', () => {
  const answers = answersAt(2); answers['cost-driver-visibility'] = 'score-1'; answers.attribution = 'score-3'; answers.forecasting = 'score-3';
  const r = scoreAudit(answers);
  assert.equal(r.dimensions['signal-clarity'].score, 78);
  assert.equal(r.priority.questionId, 'cost-driver-visibility');
});

test('all-middle answers suggest a conditional check, not blanket maintenance or a mandatory upgrade', () => {
  const r = scoreAudit(answersAt(2));
  assert.deepEqual(r.axes, { signalReadiness: 67, decisionIntegration: 67 });
  assert.equal(r.priority.kind, 'review'); assert.equal(r.priority.questionId, 'architecture-vendor');
  assert.match(r.priority.reason, /after a preferred option/); assert.match(r.priority.reason, /keep it if it already meets your needs/);
  assert.match(r.priority.move, /If this affects the decision/); assert.notEqual(r.priority.title, 'Keep what’s working');
});

test('a stronger area average cannot hide a zero on renewals', () => {
  const answers = answersAt(2);
  Object.assign(answers, { 'architecture-vendor': 'score-3', 'commitments-contracts': 'score-0', 'leadership-funding': 'score-3', 'ownership-follow-through': 'score-1', 'anomaly-response': 'score-1', 'cross-functional-cadence': 'score-1' });
  const r = scoreAudit(answers);
  assert.equal(r.dimensions['decision-timing'].score, 67); assert.equal(r.dimensions['operating-response'].score, 33);
  assert.equal(r.priority.questionId, 'commitments-contracts');
});

test('a small SaaS team keeps its renewal first step when two exclusions withhold the map', () => {
  const values = [2, 2, 1, 'not-applicable', 1, 'not-applicable', 1, 0, 1, 1, 1, 1];
  const answers = Object.fromEntries(QUESTIONS.map((q, i) => [q.id, typeof values[i] === 'number' ? `score-${values[i]}` : values[i]]));
  const r = scoreAudit(answers);
  assert.equal(r.valid, false); assert.equal(r.answeredCount, 10); assert.equal(r.axes.signalReadiness, null);
  assert.equal(r.priority.questionId, 'commitments-contracts'); assert.match(r.priority.reason, /renew automatically/);
  assert.match(buildAuditSummary(r, { answers }), /Map not shown/);
});

test('known low answers remain useful even when their own area has too few answers to score', () => {
  const answers = answersAt('outside-visibility'); answers['commitments-contracts'] = 'score-0';
  const r = scoreAudit(answers);
  assert.equal(r.valid, false); assert.equal(r.dimensions['decision-timing'].score, null);
  assert.equal(r.priority.questionId, 'commitments-contracts'); assert.equal(r.priority.kind, 'improve');
  Object.assign(answers, { 'cost-driver-visibility': 'score-1', attribution: 'score-0', 'architecture-vendor': 'score-0' });
  assert.equal(scoreAudit(answers).priority.questionId, 'architecture-vendor');
});

test('scope-fit results explain exclusions and ask about fit instead of treating them as missing answers', () => {
  const r = scoreAudit(answersAt('not-applicable'));
  assert.equal(r.priority.evidenceType, 'scope-fit'); assert.match(r.priority.reason, /not applicable/);
  assert.doesNotMatch(r.priority.reason, /missing answer/);
  assert.match(discussionQuestions(r).join(' '), /narrower scope/); assert.doesNotMatch(discussionQuestions(r).join(' '), /different person or a record/);
});

test('varied missing and excluded answers never suppress the lowest known scored answer', () => {
  const choices = ['score-0', 'score-1', 'score-2', 'score-3', 'outside-visibility', 'not-applicable'];
  let seed = 23;
  for (let run = 0; run < 1500; run++) {
    const answers = Object.fromEntries(QUESTIONS.map((q) => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return [q.id, choices[(seed >>> 8) % choices.length]]; }));
    const scored = Object.values(answers).filter((id) => id.startsWith('score-')).map((id) => Number(id.slice(-1)));
    const lowest = Math.min(...scored); const r = scoreAudit(answers);
    if (lowest < 3) {
      assert.equal(answers[r.priority.questionId], `score-${lowest}`);
      assert.equal(r.priority.kind, lowest === 2 ? 'review' : 'improve');
    } else assert.equal(r.priority.questionId, null);
  }
});
