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

test('accepts equivalent number words, digits, hyphenated durations, and ranges', () => {
  const source = 'A two-year term needs two engineers, takes four to six months, is due in 45 days, and grew 3x.';
  assert.deepEqual(findUnsupportedNumbers({ move: 'Use a 2-year term with 2 engineers over 4–6 months before the 45-day deadline after growing three times.' }, source), []);
  assert.deepEqual(findUnsupportedNumbers({ move: 'Plan for a six-month migration.' }, source), []);
});

test('accepts equivalent currency shorthand, expanded amounts, and percent formatting', () => {
  const source = 'Current spend is $360K and increased 33%.';
  assert.deepEqual(findUnsupportedNumbers({ move: 'The $360,000 baseline increased 33 percent.' }, source), []);
  assert.deepEqual(findUnsupportedNumbers({ move: 'The $2.4M baseline matches $2,400,000.' }, 'The baseline is $2.4M.'), []);
  assert.deepEqual(findUnsupportedNumbers({ move: 'Growth reached 33%.' }, 'Growth reached thirty-three percent.'), []);
});

test('continues rejecting unsupported numbers, arithmetic, changed units, and magnitudes', () => {
  assert.deepEqual(findUnsupportedNumbers({ move: 'Commit 40% after 90 days.' }, '$500K over 12 months.'), ['40%', '90 days']);
  assert.deepEqual(findUnsupportedNumbers({ move: 'Commit 12%.' }, 'The target is 12%.'), []);
  assert.deepEqual(findUnsupportedNumbers({ move: 'Use 12 engineers.' }, 'The work takes 12 months.'), ['12 engineers']);
  assert.deepEqual(findUnsupportedNumbers({ move: 'Spend is $360,000.' }, 'Spend is $360.'), ['$360,000']);
  assert.deepEqual(findUnsupportedNumbers({ move: 'The annual total is $720K.' }, 'Spend is $360K for two years.'), ['$720K']);
});

test('retries unsupported model claims and removes only claims that remain after the bounded retries', async () => {
  const originalFetch = globalThis.fetch;
  const drafts = [
    { ...validBrief, recommendation: { ...validBrief.recommendation, move: 'Commit $720K.' } },
    { ...validBrief, recommendation: { ...validBrief.recommendation, move: 'Remove 160 seats.' } },
    { ...validBrief, recommendation: { ...validBrief.recommendation, move: 'Keep the $360,000 baseline without claiming $120K in savings.' } },
  ];
  let calls = 0;
  globalThis.fetch = async () => new Response(JSON.stringify({
    stop_reason: 'end_turn',
    content: [{ type: 'text', text: JSON.stringify(drafts[calls++]) }],
  }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  try {
    const request = new Request('https://cloudandcapital.com/api/interactive-lab', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stage: 'brief',
        decision: 'Choose whether to renew the monitoring platform.',
        decisionType: 'renewal',
        answers: {
          alternatives: 'Renew or renegotiate the current agreement.',
          exposure: 'Current spend is $360K per year.',
          demand: 'Critical monitoring is actively used.',
          constraint: 'Service continuity must be protected.',
        },
      }),
    });
    const response = await POST({ request });
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(calls, 3);
    assert.equal(body.brief.recommendation.move, 'Keep the $360,000 baseline without claiming an unspecified figure in savings.');
    assert.deepEqual(findUnsupportedNumbers(body.brief, '$360K per year.'), []);
  } finally {
    globalThis.fetch = originalFetch;
  }
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
