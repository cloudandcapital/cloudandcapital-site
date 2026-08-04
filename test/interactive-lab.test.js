import test from 'node:test';
import assert from 'node:assert/strict';

import {
  assessReadiness,
  classifyDecision,
  findUnsupportedNumbers,
  getQuestions,
  validateBrief,
} from '../src/lib/interactive-lab.js';
import { GET, POST } from '../src/pages/api/interactive-lab.js';

test('classifies the five supported decision families and preserves an explicit type', () => {
  assert.equal(classifyDecision('Should we reserve GPU capacity for a year?'), 'commitment');
  assert.equal(classifyDecision('Our Datadog SaaS renewal is due'), 'renewal');
  assert.equal(classifyDecision('Should we build or buy an AI model?'), 'build_buy');
  assert.equal(classifyDecision('We need a cloud cost review'), 'cost_review');
  assert.equal(classifyDecision('Is a multi-cloud architecture worth it?'), 'architecture');
  assert.equal(classifyDecision('Reserve capacity', 'open'), 'open');
});

test('every decision family has four bounded context questions', () => {
  for (const type of ['commitment', 'renewal', 'build_buy', 'cost_review', 'architecture', 'open']) {
    const questions = getQuestions(type);
    assert.equal(questions.length, 4);
    assert.equal(new Set(questions.map(({ id }) => id)).size, 4);
  }
});

test('a vague decision cannot advance directly to advice', () => {
  const result = assessReadiness({ decision: 'We need to reduce technology spend.' });
  assert.equal(result.ready, false);
  assert.deepEqual(result.missing, ['alternatives', 'exposure', 'demand', 'constraint']);
});

test('a decision becomes ready only when all targeted evidence is supplied', () => {
  const result = assessReadiness({
    decision: 'We need to reduce technology spend without damaging reliability.',
    decisionType: 'cost_review',
    answers: {
      alternatives: 'Reduce waste and pause unfunded work.',
      exposure: '$180K monthly baseline with a 12% target by Q4.',
      demand: 'Seventy percent is allocated; unit economics are incomplete.',
      constraint: 'Customer reliability and security work are protected.',
    },
  });
  assert.equal(result.ready, true);
  assert.deepEqual(result.missing, []);
});

const validBrief = {
  decision_summary: 'Choose how much capacity to commit before demand is proven.',
  posture: { label: 'Stage', rationale: 'The baseline is known but growth remains uncertain.' },
  known_facts: ['A commitment is being considered.', 'Demand is uncertain.', 'Finance wants flexibility.'],
  working_assumptions: [{ assumption: 'Some baseline demand will persist.', why_it_matters: 'It determines the defensible commitment floor.' }],
  options: [
    { name: 'Wait', economics: 'Pay for flexibility.', operational_effect: 'No change.', reversibility: 'High.', risk: 'Higher near-term rate.', evidence_needed: 'Usage history.' },
    { name: 'Stage', economics: 'Commit only the baseline.', operational_effect: 'Mixed purchasing model.', reversibility: 'Medium.', risk: 'Some exposure remains.', evidence_needed: 'Baseline utilization.' },
  ],
  lenses: {
    finops: { view: 'Size commitment to proven usage.', need: 'Coverage and utilization.' },
    finance: { view: 'Protect downside.', need: 'Term and cash exposure.' },
    engineering: { view: 'Protect capacity.', need: 'Queue and workload evidence.' },
  },
  common_ground: 'All three lenses need a stable baseline.',
  unresolved_tension: 'The price of flexibility remains uncertain.',
  economics: { available: false, analysis: 'The rate comparison is missing.', thresholds: [] },
  recommendation: { move: 'Stage the commitment.', confidence: 'Medium', rationale: 'Demand evidence is incomplete.' },
  change_the_answer: ['A stable workload floor.', 'A materially different rate.'],
  next_actions: [
    { action: 'Measure baseline.', owner: 'FinOps', evidence: 'Usage export.', timing: 'Before approval.' },
    { action: 'Confirm roadmap.', owner: 'Engineering', evidence: 'Workload plan.', timing: 'This week.' },
  ],
};

test('validates the complete decision brief contract', () => {
  assert.equal(validateBrief(validBrief), true);
  assert.equal(validateBrief({ ...validBrief, lenses: {} }), false);
  assert.equal(validateBrief({ ...validBrief, posture: { label: 'Certain', rationale: 'No.' } }), false);
});

test('detects numeric claims that were not supplied by the user', () => {
  assert.deepEqual(findUnsupportedNumbers({ move: 'Commit 40% after 90 days.' }, '$500K over 12 months.'), ['40%', '90']);
  assert.deepEqual(findUnsupportedNumbers({ move: 'Commit 12%.' }, 'The target is 12%.'), []);
});

test('questions stage never calls the model and returns targeted context', async () => {
  const request = new Request('https://cloudandcapital.com/api/interactive-lab', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stage: 'questions', decision: 'Our Datadog renewal is due in sixty days.' }),
  });
  const response = await POST({ request });
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.status, 'needs_context');
  assert.equal(body.decisionType, 'renewal');
  assert.equal(body.questions.length, 4);
});

test('invalid JSON fails closed and GET exposes only public contract metadata', async () => {
  const invalid = await POST({ request: new Request('https://cloudandcapital.com/api/interactive-lab', { method: 'POST', body: '{' }) });
  assert.equal(invalid.status, 400);
  const metadata = await (await GET()).json();
  assert.equal(metadata.version, 2);
  assert.equal(metadata.decisionTypes.commitment, 'Capacity or commitment');
});
