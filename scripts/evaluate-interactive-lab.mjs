import assert from 'node:assert/strict';

import { findUnsupportedNumbers, validateBrief } from '../src/lib/interactive-lab.js';

const endpoint = process.env.INTERACTIVE_LAB_URL;
if (!endpoint) {
  console.error('Set INTERACTIVE_LAB_URL to a local or protected-preview /api/interactive-lab endpoint.');
  process.exit(2);
}

const scenarios = [
  {
    name: 'SaaS renewal', type: 'renewal', posture: 'Stage', required: ['partial renewal', 'unused accounts'], forbidden: ['GPU', 'multi-cloud'],
    decision: 'Decide whether to renew the observability platform, including a partial renewal.',
    answers: { alternatives: 'Full renewal, partial renewal, renegotiation, or replacement.', exposure: 'The renewal is due this quarter; price terms are supplied in the proposal.', demand: 'Unused accounts remain and service owners are known.', constraint: 'Monitoring continuity must be protected.' },
  },
  {
    name: 'GPU commitment', type: 'commitment', posture: 'Stage', required: ['GPU', 'baseline'], forbidden: ['SaaS', 'multi-cloud'],
    decision: 'Choose whether to make a GPU capacity commitment.',
    answers: { alternatives: 'Commit the stable baseline, stage capacity, or remain on demand.', exposure: 'Term pricing exists but growth remains uncertain.', demand: 'The stable baseline is measured; experimental workloads vary.', constraint: 'Training capacity and cash flexibility must be protected.' },
  },
  {
    name: 'AI build-or-buy', type: 'build_buy', posture: 'Stage', required: ['model', 'latency'], forbidden: ['renewal', 'multi-cloud'],
    decision: 'Choose whether to build, buy, or optimize the AI inference layer.',
    answers: { alternatives: 'Use the vendor model, optimize the current path, or build internally.', exposure: 'Unit cost is known but future volume is uncertain.', demand: 'Quality and latency requirements are documented.', constraint: 'The team has limited model operations capacity.' },
  },
  {
    name: 'Cloud cost review', type: 'cost_review', posture: 'Stage', required: ['14 anomalies', 'owners'], forbidden: ['GPU', 'renewal'],
    decision: 'Run a cloud cost review without damaging reliability.',
    answers: { alternatives: 'Remove waste, improve accountability, or reprioritize unfunded work.', exposure: 'The baseline is known but the savings target needs validation.', demand: 'Fourteen recent anomalies lack owners and allocation is incomplete.', constraint: 'Reliability, security, and the product roadmap must be protected.' },
  },
  {
    name: 'Multi-cloud', type: 'architecture', posture: 'Stage', required: ['provider', 'data gravity'], forbidden: ['SaaS', 'GPU'],
    decision: 'Decide whether selected workloads should use a multi-cloud architecture.',
    answers: { alternatives: 'Stay with one provider, place selected workloads elsewhere, or stage a portability test.', exposure: 'Migration cost and long-term run cost require comparison.', demand: 'Data gravity and workload variability are documented.', constraint: 'Reliability and team capacity cannot be compromised.' },
  },
  {
    name: 'Commit control', type: 'commitment', posture: 'Commit', required: ['capacity', 'downside'], forbidden: ['SaaS', 'multi-cloud'],
    decision: 'Approve the bounded capacity commitment supported by complete evidence.',
    answers: { alternatives: 'Approve the bounded commitment or remain on demand.', exposure: 'Price, term, and downside are documented and within the approved budget.', demand: 'The stable capacity baseline is proven by sustained production usage.', constraint: 'Required capacity is guaranteed and the downside is bounded.' },
  },
  {
    name: 'Explore control', type: 'open', posture: 'Explore', required: ['evidence', 'unknown'], forbidden: ['GPU', 'SaaS', 'multi-cloud'],
    decision: 'Choose a technology direction while critical evidence is still missing.',
    answers: { alternatives: 'Several directions have been named but feasibility is unknown.', exposure: 'Cost, timing, and commercial terms are unknown.', demand: 'The required outcome and demand evidence are unknown.', constraint: 'The non-negotiable operating constraint has not been established.' },
  },
];

const headers = { 'Content-Type': 'application/json' };
if (process.env.VERCEL_PROTECTION_BYPASS) {
  headers['x-vercel-protection-bypass'] = process.env.VERCEL_PROTECTION_BYPASS;
}

const recommendations = [];
let failed = false;

function recommendationTerms(value) {
  return new Set(value.toLowerCase().match(/[a-z]{4,}/g) || []);
}

function similarity(left, right) {
  const intersection = [...left].filter((term) => right.has(term)).length;
  const union = new Set([...left, ...right]).size;
  return union ? intersection / union : 1;
}

for (const scenario of scenarios) {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ stage: 'brief', decision: scenario.decision, decisionType: scenario.type, answers: scenario.answers }),
      signal: AbortSignal.timeout(120000),
    });
    const payload = await response.json();
    assert.equal(response.status, 200, payload.error || `HTTP ${response.status}`);
    assert.equal(payload.status, 'ready');
    assert.equal(validateBrief(payload.brief), true, 'invalid brief schema');
    assert.equal(payload.brief.posture.label, scenario.posture, `expected ${scenario.posture} posture`);

    const serialized = JSON.stringify(payload.brief);
    assert.doesNotMatch(serialized, /unspecified figure/i);
    assert.deepEqual(findUnsupportedNumbers(payload.brief, [scenario.decision, ...Object.values(scenario.answers)].join('\n')), []);
    for (const term of scenario.required) assert.match(serialized, new RegExp(term, 'i'), `missing supplied evidence: ${term}`);
    for (const term of scenario.forbidden) assert.doesNotMatch(serialized, new RegExp(term, 'i'), `cross-scenario leakage: ${term}`);
    assert.ok(payload.brief.options.every((option) => option.name && option.risk && option.evidence_needed));
    assert.ok(payload.brief.recommendation.move && payload.brief.next_actions.every((action) => action.action && action.evidence));

    recommendations.push({ name: scenario.name, terms: recommendationTerms(payload.brief.recommendation.move) });
    console.log(`PASS  ${scenario.name}: ${payload.brief.posture.label} — ${payload.brief.recommendation.move}`);
  } catch (error) {
    failed = true;
    console.error(`FAIL  ${scenario.name}: ${error.message}`);
  }
}

for (let left = 0; left < recommendations.length; left += 1) {
  for (let right = left + 1; right < recommendations.length; right += 1) {
    if (similarity(recommendations[left].terms, recommendations[right].terms) >= 0.8) {
      failed = true;
      console.error(`FAIL  recommendations: ${recommendations[left].name} and ${recommendations[right].name} are not meaningfully distinct`);
    }
  }
}

if (failed) process.exit(1);
console.log(`PASS  all ${scenarios.length} scenarios produced distinct, grounded recommendations.`);
