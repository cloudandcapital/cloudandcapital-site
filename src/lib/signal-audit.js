export const DIMENSIONS = [
  { id: 'signal-clarity', name: 'Signal Clarity', description: 'Can teams explain, attribute, and forecast technology cost?' },
  { id: 'economic-context', name: 'Economic Context', description: 'Is cost connected to consumption drivers, total economics, and business value?' },
  { id: 'decision-timing', name: 'Decision Timing', description: 'Does cost and value information arrive while choices remain open?' },
  { id: 'operating-response', name: 'Operating Response', description: 'Do signals reach an owner, trigger action, and create a feedback loop?' },
];

const options = (...labels) => labels.map((label, score) => ({ id: `score-${score}`, score, label }));
const na = { id: 'not-applicable', score: null, label: 'Not applicable or outside my visibility' };
const q = (id, dimension, title, prompt, labels, example = '') => ({ id, dimension, title, prompt, example, options: [...options(...labels), na] });

export const QUESTIONS = [
  q('cost-driver-visibility', 'signal-clarity', 'Cost-driver visibility', 'When a material technology cost change occurs, how quickly can the team explain what changed and why?', [
    'The team can see the bill or category change but cannot reliably isolate the underlying driver.',
    'During a month-end or periodic review, with only part of the change explained.',
    'Within a few days, usually after manually combining information from several sources.',
    'The same or next business day, with the usage, price, volume, or demand driver and responsible owner identified.',
  ]),
  q('attribution', 'signal-clarity', 'Attribution', 'How much of the in-scope spend is connected to a meaningful owner and business context?', [
    'Spend is largely pooled or unallocated.',
    'Spend is visible mainly by provider account, subscription, or cost center, with limited operational ownership.',
    'Major areas are mapped, but shared, untagged, or unallocated spend remains significant.',
    'Most material spend is mapped to a product, service, team, environment, or other useful business construct and is actively maintained.',
  ]),
  q('forecasting', 'signal-clarity', 'Forecasting', 'How are forecasts for this scope built and improved?', [
    'There is no recurring forecast for this scope.',
    'Forecasting is an infrequent manual estimate or annual budget exercise.',
    'Forecasts use recent run rate plus known growth, contracts, or commitment changes.',
    'Forecasts use documented demand drivers and assumptions, are refreshed against actuals, and use variance feedback.',
  ]),
  q('unit-economics-value', 'economic-context', 'Unit economics and value', 'Can teams connect technology spend to a unit of consumption, product value, or business outcome?', [
    'Reporting generally stops at total spend and usage.',
    'The analysis is created manually when leadership asks for it.',
    'Useful measures exist for some products or workloads but are not consistently applied.',
    'Key services use appropriate unit or value measures, and those measures influence decisions.',
  ], 'Examples: cost per customer, transaction, request, token, model call, active seat, job, or workload.'),
  q('full-economic-view', 'economic-context', 'Full economic view', 'How complete is the economic view used for decisions in this scope?', [
    'The team cannot assemble a reliable full-cost view.',
    'Costs remain in separate bills and tools, and comparisons regularly omit material items.',
    'The major cost categories are included, but some are reconciled manually or only periodically.',
    'The relevant technology categories, commitments, shared costs, and material dependencies are combined into a usable total-cost view.',
  ]),
  q('consumption-demand', 'economic-context', 'Consumption and demand', 'For consumption-based services, can cost be traced to the workloads and demand drivers creating it?', [
    'The consumption driver is not visible.',
    'Visibility stops at provider, account, subscription, or broad product totals.',
    'Cost is traceable to a service or team, but the underlying unit or demand driver is weak.',
    'Cost is traceable to the workload or use case and its primary demand driver, such as requests, tokens, users, jobs, storage, or capacity.',
  ]),
  q('architecture-vendor', 'decision-timing', 'Architecture and vendor selection', 'When does cost and value analysis enter architecture or vendor-selection decisions?', [
    'Only after the invoice or cost report appears.',
    'After implementation, contracting, or deployment has begun.',
    'During the decision process, after a leading option has already emerged.',
    'Before the design or shortlist is finalized, with alternatives and assumptions compared.',
  ]),
  q('commitments-contracts', 'decision-timing', 'Commitments and contracts', 'How are long-term commitments and contracts evaluated?', [
    'Commitments are ad hoc, automatically renewed, or not reviewed consistently.',
    'The decision is driven mainly by a discount, renewal deadline, or immediate cost pressure.',
    'The decision uses observed usage and an estimated savings case, with limited scenario analysis.',
    'The decision models utilization, savings, flexibility, downside risk, break-even conditions, and ownership before approval.',
  ], 'Examples may include cloud commitments, GPU capacity, SaaS renewals, data-platform commitments, or licensing agreements.'),
  q('leadership-funding', 'decision-timing', 'Leadership and funding', 'When does leadership receive decision-relevant technology economics?', [
    'Leadership receives only a high-level bill or does not regularly see this information.',
    'After decisions are substantially committed, as part of performance or budget reporting.',
    'During the review process, when some options remain open.',
    'Before funding, roadmap, or investment commitments, while the information can still change the choice.',
  ]),
  q('ownership-follow-through', 'operating-response', 'Ownership and follow-through', 'When a material variance or optimization opportunity is identified, what happens next?', [
    'The process usually ends with the report or alert.',
    'FinOps or finance must chase the responsible team manually.',
    'It is reviewed regularly, but ownership or follow-through is inconsistent.',
    'It receives a named owner, decision rights, an expected response time, and tracked outcome.',
  ]),
  q('anomaly-response', 'operating-response', 'Anomaly response', 'How are material cost anomalies detected and routed?', [
    'They are usually discovered at month-end or through an unexpected bill.',
    'Changes are found through a recurring manual review.',
    'Automated alerts exist, but they are noisy, lack context, or have unclear ownership.',
    'Context-aware thresholds identify material changes, route them to the right owner, and track acknowledgement or resolution.',
  ]),
  q('cross-functional-cadence', 'operating-response', 'Cross-functional operating cadence', 'How do relevant teams review technology economics together?', [
    'The groups operate largely in silos.',
    'The conversation is mostly ad hoc during cost pressure, budget reviews, or renewals.',
    'Reviews recur, but teams reconcile separate views or follow-up remains informal.',
    'They use trusted underlying data, make decisions on a recurring cadence, and record owners and outcomes.',
  ]),
];

export const TARGET_SCOPES = [
  { id: 'organization', label: 'Organization or business unit' },
  { id: 'product', label: 'Product, platform, or application' },
  { id: 'team', label: 'Technology team or shared service' },
  { id: 'practice', label: 'FinOps or technology finance practice' },
];
export const TECHNOLOGY_SCOPES = [
  { id: 'public-cloud', label: 'Public cloud and Kubernetes' },
  { id: 'ai-data', label: 'AI, ML, and data platforms' },
  { id: 'saas', label: 'SaaS and software licensing' },
  { id: 'private-cloud', label: 'Private cloud and data center' },
  { id: 'mixed', label: 'Mixed technology portfolio' },
];

export const ARCHETYPES = {
  'low-low': { name: 'Invoice-Led', meaning: 'Cost is primarily understood after commitments or through periodic reporting. The first opportunity is to create a reliable signal and move it earlier.' },
  'high-low': { name: 'Visible, Not Embedded', meaning: 'The data exists and can be explained, but it does not consistently shape architecture, procurement, funding, or operating decisions while choices remain open.' },
  'low-high': { name: 'Decisions Ahead of the Data', meaning: 'Teams are attempting to make cost-aware decisions, but attribution, forecasting, or economic context is too weak to support those decisions consistently.' },
  'high-high': { name: 'Decision-Embedded', meaning: 'Cost and value information is sufficiently clear and reaches decision-makers early enough to change choices, with ownership following through.' },
};

export const PRIORITY_ACTIONS = {
  'signal-clarity': { title: 'Make the signal explainable', move: 'Establish an allocation baseline and a recurring cost-driver bridge for the highest-spend part of the selected scope.', measures: ['Percentage of material spend allocated', 'Time required to explain a material variance'], owners: 'FinOps lead, technology finance partner, and accountable engineering owner' },
  'economic-context': { title: 'Connect cost to value', move: 'Define one or two meaningful unit or value measures for the highest-spend product, service, or workload and include them in the next review.', measures: ['Percentage of material spend connected to a unit measure', 'Trend in cost per relevant unit'], owners: 'Product or service owner, engineering lead, and technology finance partner' },
  'decision-timing': { title: 'Move economics upstream', move: 'Require a lightweight cost-and-value scenario before the next material architecture, vendor, funding, renewal, or commitment decision is finalized.', measures: ['Percentage of material decisions with documented pre-commit analysis'], owners: 'Decision owner, architecture or procurement lead, and finance partner as relevant' },
  'operating-response': { title: 'Close the loop', move: 'Give material anomalies and opportunities a named owner, response expectation, decision record, and outcome.', measures: ['Time to acknowledge', 'Time to decision or resolution', 'Action completion rate'], owners: 'Accountable service owner with FinOps or technology finance facilitation' },
};

export function dimensionLabel(score) {
  if (score == null) return 'Needs more evidence';
  if (score <= 33) return 'Reactive';
  if (score <= 66) return 'Developing';
  if (score <= 84) return 'Operational';
  return 'Embedded';
}

export function classifyArchetype(signalReadiness, decisionIntegration) {
  if (signalReadiness == null || decisionIntegration == null) return null;
  return ARCHETYPES[`${signalReadiness >= 67 ? 'high' : 'low'}-${decisionIntegration >= 67 ? 'high' : 'low'}`];
}

export function scoreAudit(answers) {
  const dimensions = Object.fromEntries(DIMENSIONS.map((d) => {
    const qs = QUESTIONS.filter((item) => item.dimension === d.id);
    const values = qs.map((item) => {
      const option = item.options.find((candidate) => candidate.id === answers[item.id]);
      return option?.score ?? null;
    });
    const scored = values.filter((value) => value !== null);
    const score = scored.length >= 2 ? Math.round((scored.reduce((sum, value) => sum + value, 0) / (scored.length * 3)) * 100) : null;
    return [d.id, { score, label: dimensionLabel(score), answered: scored.length, valid: score !== null }];
  }));
  const average = (ids) => ids.every((id) => dimensions[id].valid) ? Math.round(ids.reduce((sum, id) => sum + dimensions[id].score, 0) / ids.length) : null;
  const axes = {
    signalReadiness: average(['signal-clarity', 'economic-context']),
    decisionIntegration: average(['decision-timing', 'operating-response']),
  };
  const answeredCount = Object.values(dimensions).reduce((sum, value) => sum + value.answered, 0);
  const valid = axes.signalReadiness !== null && axes.decisionIntegration !== null && answeredCount >= 8;
  const archetype = valid ? classifyArchetype(axes.signalReadiness, axes.decisionIntegration) : { name: 'Limited Visibility', meaning: 'There is not yet enough evidence to place this scope on the signal map. The unanswered areas are a useful finding: bring the right owners together and complete those signals before drawing a conclusion.' };
  const validDimensions = DIMENSIONS.filter((d) => dimensions[d.id].valid);
  const strongest = validDimensions.length ? [...validDimensions].sort((a, b) => dimensions[b.id].score - dimensions[a.id].score)[0].id : null;
  const tieOrder = ['decision-timing', 'operating-response', 'signal-clarity', 'economic-context'];
  const weakest = validDimensions.length ? [...validDimensions].sort((a, b) => dimensions[a.id].score - dimensions[b.id].score || tieOrder.indexOf(a.id) - tieOrder.indexOf(b.id))[0].id : 'decision-timing';
  return { dimensions, axes, answeredCount, confidence: Math.round(answeredCount / QUESTIONS.length * 100), valid, archetype, strongest, weakest, priority: PRIORITY_ACTIONS[weakest] };
}

export function validatePayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return { ok: false, error: 'Request body must be a JSON object.' };
  if (!TARGET_SCOPES.some((item) => item.id === payload.targetScope)) return { ok: false, error: 'Invalid assessment scope.' };
  if (!Array.isArray(payload.technologyScopes) || payload.technologyScopes.length < 1 || payload.technologyScopes.length > TECHNOLOGY_SCOPES.length || payload.technologyScopes.some((id) => !TECHNOLOGY_SCOPES.some((item) => item.id === id))) return { ok: false, error: 'Invalid technology scope selection.' };
  if (!payload.answers || typeof payload.answers !== 'object' || Array.isArray(payload.answers) || Object.keys(payload.answers).length > QUESTIONS.length) return { ok: false, error: 'Invalid answers.' };
  for (const [questionId, optionId] of Object.entries(payload.answers)) {
    const question = QUESTIONS.find((item) => item.id === questionId);
    if (!question || !question.options.some((option) => option.id === optionId)) return { ok: false, error: 'Invalid question or option ID.' };
  }
  return { ok: true, value: { targetScope: payload.targetScope, technologyScopes: [...new Set(payload.technologyScopes)], answers: payload.answers } };
}

export function fallbackInterpretation(result, context = {}) {
  const weakest = DIMENSIONS.find((d) => d.id === result.weakest)?.name || 'Decision Timing';
  const technologyScope = Array.isArray(context.technologyScopes) && context.technologyScopes.length ? context.technologyScopes.join(', ') : 'the selected technology portfolio';
  return {
    pattern_read: result.valid ? `${result.archetype.name} describes an operating pattern, not a grade. Your four signals show where technology economics is usable today and where the handoff from information to action weakens.` : 'Several answers sit outside the current respondent’s visibility. That is useful evidence in itself: the signal cannot yet be followed consistently across the selected scope without bringing in additional owners.',
    decision_implication: `The immediate leverage point is ${weakest}. ${result.priority.move}`,
    scope_watchpoint: `For ${technologyScope}, keep the assessment boundary consistent when you revisit it. Validate the pattern with the people who own missing evidence or downstream decisions; the appropriate practice should match this scope’s actual decision needs.`,
  };
}
