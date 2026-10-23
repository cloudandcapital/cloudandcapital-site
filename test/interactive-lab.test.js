import test from 'node:test';
import assert from 'node:assert/strict';

import {
  assessReadiness,
  classifyDecision,
  findUnsupportedNumbers,
  getCheckedCalculations,
  getQuestions,
  validateBrief,
} from '../src/lib/interactive-lab.js';
import { GET, POST } from '../src/pages/api/interactive-lab.js';
import { validBrief } from '../test-support/interactive-lab-fixture.js';

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

test('normalizes written and digit forms for product count nouns', () => {
  const countNouns = ['anomalies', 'services', 'teams', 'accounts', 'requests', 'workloads', 'incidents', 'outages', 'resources', 'models', 'environments'];
  for (const noun of countNouns) {
    assert.deepEqual(findUnsupportedNumbers({ fact: `14 ${noun}` }, `Fourteen ${noun}`), [], noun);
  }
  assert.deepEqual(findUnsupportedNumbers({ fact: '14 anomalies lack owners.' }, 'Fourteen recent anomalies lack owners.'), []);
});

test('keeps count and measurement units sensitive', () => {
  assert.deepEqual(findUnsupportedNumbers({ fact: 'Review 14 days.' }, 'There are 14 anomalies.'), ['14 days']);
  assert.deepEqual(findUnsupportedNumbers({ fact: 'Review 14 services.' }, 'There are 14 teams.'), ['14 services']);
  assert.deepEqual(findUnsupportedNumbers({ fact: 'Review 14 incidents.' }, 'There are fourteen outages.'), ['14 incidents']);
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

test('two failed regeneration attempts return a clean 502 without a corrupted brief', async () => {
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
    assert.equal(response.status, 502);
    assert.equal(calls, 2);
    assert.equal(body.brief, undefined);
    assert.match(body.error, /inputs are still here/i);
    assert.doesNotMatch(JSON.stringify(body), /unspecified figure/i);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('a successful response never contains the malformed fallback phrase', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({
    stop_reason: 'end_turn',
    content: [{ type: 'text', text: JSON.stringify(validBrief) }],
  }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  try {
    const request = new Request('https://cloudandcapital.com/api/interactive-lab', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stage: 'brief',
        decision: 'Choose whether to reserve GPU capacity for stable demand.',
        decisionType: 'commitment',
        answers: {
          alternatives: 'Reserve capacity, stage the commitment, or wait.',
          exposure: 'Commercial terms have been supplied for review.',
          demand: 'A stable baseline is documented in the usage history.',
          constraint: 'Capacity and cash flexibility must both be protected.',
        },
      }),
    });
    const response = await POST({ request });
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.doesNotMatch(JSON.stringify(body), /unspecified figure/i);
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

test('recurrence words are not quantities, while real seat counts stay checked', () => {
  assert.deepEqual(findUnsupportedNumbers('A one-time migration or a one-off payment.', 'Migration is possible.'), []);
  assert.deepEqual(findUnsupportedNumbers('Remove two unused seats.', 'There are 12 seats.'), ['two unused seats']);
  assert.deepEqual(findUnsupportedNumbers('Two unused seats.', '2 seats are unused.'), []);
});

test('accepts exact calendar equivalences without turning durations into staffing', () => {
  assert.deepEqual(findUnsupportedNumbers('A 12-month term or four quarters.', 'A one-year term.'), []);
  assert.deepEqual(findUnsupportedNumbers('One year.', '12 months.'), []);
  assert.deepEqual(findUnsupportedNumbers('Three months.', 'One quarter.'), []);
  assert.deepEqual(findUnsupportedNumbers('12 engineers.', 'One year.'), ['12 engineers']);
});

test('checks a price increase in cents and allows only those computed amounts', () => {
  const source = 'The annual price is $2,880 and the renewal quote is 20% higher.';
  const calculations = getCheckedCalculations(source);
  assert.equal(calculations.length, 1);
  assert.deepEqual(calculations[0].amounts, [{ value: 3456, currency: '$' }, { value: 576, currency: '$' }]);
  assert.deepEqual(findUnsupportedNumbers('Calculated: $3,456, an increase of $576.', source, { includeCalculations: true }), []);
  assert.deepEqual(findUnsupportedNumbers('$3,456.', source), ['$3,456']);
  assert.deepEqual(findUnsupportedNumbers('Savings of $480.', source, { includeCalculations: true }), ['$480']);
  assert.equal(getCheckedCalculations('The price is $0.05 and the new quote is 10% higher.')[0].amounts[1].value, 0.01);
});

test('annualization needs an explicit monthly rate and yearly horizon', () => {
  assert.deepEqual(getCheckedCalculations('Spend is $40K/month. Compare options over one year.')[0].amounts, [{ value: 480000, currency: '$' }]);
  assert.equal(getCheckedCalculations('Monthly spend is $40K. Compare options over 12 months.').length, 1);
  assert.deepEqual(getCheckedCalculations('We spend $40K per month. The future term is unknown.'), []);
  assert.deepEqual(getCheckedCalculations('The project costs $40K. Review over one year.'), []);
});

test('does not choose among ambiguous bases, currencies, ranges, credits, or unrelated growth', () => {
  for (const source of [
    'Price is $2,880 or $3,000 and the quote is 20% higher.',
    'Price is $2,880 or €2,880 and the quote is 20% higher.',
    'Price is $2,000–3,000 and the quote is 20% higher.',
    'Price is $2,880 with a credit. The quote is 20% higher.',
    'Price is $2,880 and demand is 20% higher.',
    'Price is $2,880 and the quote is 20% lower.',
    'The price is $2,880.005 and the quote is 20% higher.',
    'Price is $2,880 and the quote is 20.123% higher.',
  ]) assert.deepEqual(getCheckedCalculations(source), [], source);
});

const renewalPayload = {
  stage: 'brief', decision: 'Should we renew the design software?', decisionType: 'renewal',
  answers: { alternatives: 'Renew or negotiate the quote.', exposure: 'The annual price is $2,880 and the renewal quote is 20% higher.', demand: 'The design team uses the product regularly.', constraint: 'Replacement cost and contract terms are unknown.' },
};
function labRequest(payload = renewalPayload) {
  return new Request('https://cloudandcapital.com/api/interactive-lab', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
}
function modelResponse(brief) {
  return new Response(JSON.stringify({ stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify(brief) }] }), { status: 200 });
}

test('API returns its own checked calculations and ignores caller-supplied calculations', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => modelResponse({ ...validBrief, economics: { available: false, analysis: 'Calculated: the new price would be $3,456 if the increase applies to the entire bill.', thresholds: [] } });
  try {
    const response = await POST({ request: labRequest({ ...renewalPayload, calculations: [{ amounts: [{ value: 9999, currency: '$' }] }] }) });
    const result = await response.json();
    assert.equal(response.status, 200);
    assert.equal(result.calculations[0].amounts[0].value, 3456);
    assert.doesNotMatch(JSON.stringify(result), /9999/);
  } finally { globalThis.fetch = original; }
});

test('a derived amount cannot be presented as a reported fact', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => modelResponse({ ...validBrief, known_facts: ['The quoted price is $3,456.', 'The team uses the tool.', 'Terms are unknown.'] });
  try {
    const response = await POST({ request: labRequest() });
    assert.equal(response.status, 502);
  } finally { globalThis.fetch = original; }
});

test('the total generation budget prevents a further retry', async () => {
  const originalFetch = globalThis.fetch;
  const originalNow = Date.now;
  let clock = 100000;
  let calls = 0;
  Date.now = () => clock;
  globalThis.fetch = async (_url, options) => {
    calls += 1;
    assert.equal(options.signal instanceof AbortSignal, true);
    clock += 56000;
    return modelResponse({ ...validBrief, recommendation: { ...validBrief.recommendation, move: 'Spend $9999.' } });
  };
  try {
    const response = await POST({ request: labRequest() });
    assert.equal(response.status, 504);
    assert.equal(calls, 1);
  } finally { globalThis.fetch = originalFetch; Date.now = originalNow; }
});

test('provider failures and timeouts have useful errors without a fake brief', async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async () => new Response('provider detail', { status: 503 });
    let response = await POST({ request: labRequest() });
    assert.equal(response.status, 503);
    assert.match((await response.json()).error, /inputs are still here/);
    globalThis.fetch = async () => { throw new DOMException('Timed out', 'TimeoutError'); };
    response = await POST({ request: labRequest() });
    assert.equal(response.status, 504);
    assert.match((await response.json()).error, /too long/);
  } finally { globalThis.fetch = original; }
});

test('hyphenated seat and workload descriptions retain their count units', () => {
  assert.deepEqual(findUnsupportedNumbers('Compare the 12-seat and 10-seat plans.', 'There are 12 seats and 10 active seats.'), []);
  assert.deepEqual(findUnsupportedNumbers('A two-workload baseline.', 'Two workloads are stable.'), []);
  assert.deepEqual(findUnsupportedNumbers('A 12-request plan.', 'There are 12 seats.'), ['12-request']);
});

test('invalid model fields are diagnosed without returning a rejected draft', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => modelResponse({ ...validBrief, posture: { label: 'Maybe', rationale: 'Uncertain.' } });
  try {
    const response = await POST({ request: labRequest() });
    const body = await response.json();
    assert.equal(response.status, 502);
    assert.equal(body.code, 'INVALID_MODEL_SCHEMA');
    assert.equal(body.schemaIssue.field, 'posture');
    assert.equal(body.brief, undefined);
  } finally { globalThis.fetch = original; }
});

test('truncated model output fails closed with a distinct recovery code', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({ stop_reason: 'max_tokens', content: [{ type: 'text', text: '{"decision_summary":' }] }));
  try {
    const response = await POST({ request: labRequest() });
    const body = await response.json();
    assert.equal(response.status, 502);
    assert.equal(body.code, 'MODEL_OUTPUT_TRUNCATED');
    assert.equal(body.brief, undefined);
  } finally { globalThis.fetch = original; }
});

test('seven concise facts do not reject an otherwise valid brief', () => {
  const brief = { ...validBrief, known_facts: [
    'The current subscription is used.', 'Some seats are unused.', 'The design lead owns it.',
    'A renewal quote has arrived.', 'The next contract term is unknown.',
    'Replacement pricing is unknown.', 'Existing files must remain accessible.',
  ] };
  assert.equal(validateBrief(brief), true);
  assert.equal(validateBrief({ ...brief, known_facts: [] }), false);
  assert.equal(validateBrief({ ...brief, known_facts: Array(13).fill('A fact.') }), false);
  assert.deepEqual(findUnsupportedNumbers('A price of $9999.', 'The bill is $2880.'), ['$9999']);
});
