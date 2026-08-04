import test from 'node:test';
import assert from 'node:assert/strict';
import { DIMENSIONS, QUESTIONS, classifyArchetype, scoreAudit } from '../src/lib/signal-audit.js';
import { POST } from '../src/pages/api/signal-audit.js';

const answersAt = (score) => Object.fromEntries(QUESTIONS.map((q) => [q.id, score === null ? 'not-applicable' : `score-${score}`]));
const setDimensions = (scores) => Object.fromEntries(QUESTIONS.map((q) => [q.id, `score-${scores[q.dimension]}`]));
const request = (body) => new Request('http://localhost/api/signal-audit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
const validPayload = (answers = answersAt(2)) => ({ targetScope: 'product', technologyScopes: ['public-cloud'], answers });

test('model has exactly 12 questions and three per dimension', () => {
  assert.equal(QUESTIONS.length, 12);
  for (const dimension of DIMENSIONS) assert.equal(QUESTIONS.filter((q) => q.dimension === dimension.id).length, 3);
});

test('all-minimum and all-maximum answers score correctly', () => {
  const minimum = scoreAudit(answersAt(0)); const maximum = scoreAudit(answersAt(3));
  assert.equal(minimum.axes.signalReadiness, 0); assert.equal(minimum.archetype.name, 'Invoice-Led');
  assert.equal(maximum.axes.decisionIntegration, 100); assert.equal(maximum.archetype.name, 'Decision-Embedded');
});

test('all four archetypes classify from dimension patterns', () => {
  const patterns = [
    [{ 'signal-clarity': 0, 'economic-context': 0, 'decision-timing': 0, 'operating-response': 0 }, 'Invoice-Led'],
    [{ 'signal-clarity': 3, 'economic-context': 3, 'decision-timing': 0, 'operating-response': 0 }, 'Visible, Not Embedded'],
    [{ 'signal-clarity': 0, 'economic-context': 0, 'decision-timing': 3, 'operating-response': 3 }, 'Decisions Ahead of the Data'],
    [{ 'signal-clarity': 3, 'economic-context': 3, 'decision-timing': 3, 'operating-response': 3 }, 'Decision-Embedded'],
  ];
  for (const [scores, expected] of patterns) assert.equal(scoreAudit(setDimensions(scores)).archetype.name, expected);
});

test('67 is the high boundary while 66 remains low', () => {
  assert.equal(classifyArchetype(66, 66).name, 'Invoice-Led');
  assert.equal(classifyArchetype(67, 66).name, 'Visible, Not Embedded');
  assert.equal(classifyArchetype(66, 67).name, 'Decisions Ahead of the Data');
  assert.equal(classifyArchetype(67, 67).name, 'Decision-Embedded');
});

test('not-applicable is null and invalidates dimensions with fewer than two answers', () => {
  const answers = answersAt(2); answers['cost-driver-visibility'] = 'not-applicable'; answers.attribution = 'not-applicable';
  const result = scoreAudit(answers);
  assert.equal(result.dimensions['signal-clarity'].score, null);
  assert.equal(result.dimensions['signal-clarity'].answered, 1);
  assert.equal(result.valid, false); assert.equal(result.archetype.name, 'Limited Visibility');
});

test('fewer than eight scored answers produces Limited Visibility', () => {
  const answers = answersAt(null); QUESTIONS.slice(0, 7).forEach((q) => { answers[q.id] = 'score-3'; });
  assert.equal(scoreAudit(answers).archetype.name, 'Limited Visibility');
});

test('weakest-dimension ties use the required deterministic order', () => {
  assert.equal(scoreAudit(answersAt(1)).weakest, 'decision-timing');
});

test('server rejects invalid question and option IDs', async () => {
  const invalidQuestion = await POST({ request: request(validPayload({ forged: 'score-3' })) });
  assert.equal(invalidQuestion.status, 400);
  const invalidOption = await POST({ request: request(validPayload({ [QUESTIONS[0].id]: 'score-99' })) });
  assert.equal(invalidOption.status, 400);
});

test('client score and tier cannot forge server result', async () => {
  const response = await POST({ request: request({ ...validPayload(answersAt(0)), score: 36, tier: 'Decision-Embedded' }) });
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.result.archetype.name, 'Invoice-Led');
  assert.equal(body.result.axes.signalReadiness, 0);
});
