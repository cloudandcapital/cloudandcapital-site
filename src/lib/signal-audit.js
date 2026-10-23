// Independent, directional rubric. The cutoffs are ours, not an external benchmark.
export const RUBRIC_VERSION = '2026-10-23';
export const HIGH_BOUNDARY = 67;
export const DIMENSIONS = [
  { id: 'signal-clarity', name: 'Understand the bill', description: 'Explain changes, connect spending to an owner, and keep a useful forecast.' },
  { id: 'economic-context', name: 'Connect cost to value', description: 'See what the spending supports and include the costs that matter.' },
  { id: 'decision-timing', name: 'Check before committing', description: 'Bring costs and alternatives into a choice while it can still change.' },
  { id: 'operating-response', name: 'Follow through', description: 'Give a finding an owner, a response, and an outcome you can check.' },
];
const options = (...labels) => labels.map((label, score) => ({ id: `score-${score}`, score, label }));
const unscored = [
  { id: 'outside-visibility', score: null, label: 'I don’t know or can’t see this information.' },
  { id: 'not-applicable', score: null, label: 'This doesn’t apply to the scope I chose.' },
];
const q = (id, dimension, title, prompt, labels, example = '') => ({ id, dimension, title, prompt, example, options: [...options(...labels), ...unscored] });
export const QUESTIONS = [
  q('cost-driver-visibility', 'signal-clarity', 'Explain a bill change', 'When technology spending changes enough to matter, can you explain why?', [
    'We see that the bill changed, but can’t reliably explain what caused it.',
    'We explain part of the change during a monthly or occasional review.',
    'We usually explain it within a few days by combining information manually.',
    'We explain the main usage, price, or demand changes early enough to act, with an owner and records to check.',
  ]),
  q('attribution', 'signal-clarity', 'Connect spending to an owner', 'Can you connect the spending to a team, product, or person who owns it?', [
    'Most spending sits in one shared total without a clear owner.',
    'We know the account or department, but often don’t know who can act on it.',
    'Major areas have owners, but meaningful shared or unassigned costs remain.',
    'Most spending that matters has a useful owner and business purpose, and we keep that mapping current.',
  ]),
  q('forecasting', 'signal-clarity', 'Forecast the spending', 'How do you estimate what this part of the business will spend next?', [
    'We don’t make a recurring forecast.',
    'We make an occasional estimate or an annual budget.',
    'We use recent spending, expected growth, and known contract changes.',
    'We record the main assumptions, compare the forecast with actual spending, and update it when demand changes.',
  ]),
  q('unit-economics-value', 'economic-context', 'See what the spending supports', 'Can you connect the cost to the work or value it supports?', [
    'We mostly report total spending and usage.',
    'We work this out manually when someone asks.',
    'We track useful measures for some products or services.',
    'We use relevant cost and value measures when deciding what to keep, change, or expand.',
  ], 'For example: cost per active seat, customer, transaction, usable AI result, job, or workload.'),
  q('full-economic-view', 'economic-context', 'Include the full cost', 'Do comparisons include the costs and obligations that could change the decision?', [
    'We can’t put together a reliable view of the relevant costs.',
    'Costs sit in separate places, and comparisons regularly miss important items.',
    'We include the main costs, but reconcile some of them manually or only occasionally.',
    'We include the relevant bills, commitments, shared costs, and other important dependencies in a usable comparison.',
  ], 'Include what matters to this choice. That may include support, migration work, minimum commitments, or cancellation terms.'),
  q('consumption-demand', 'economic-context', 'Trace usage to cost', 'For services billed by usage, can you explain what demand is creating the cost?', [
    'We can’t see the main usage driver.',
    'We see provider or account totals, but little underneath them.',
    'We can trace costs to a service or team, but not the main usage driver.',
    'We can connect the cost to its workload or use case and the main driver, such as requests, tokens, storage, or capacity.',
  ], 'If the selected scope has no usage based services, choose “This doesn’t apply.”'),
  q('architecture-vendor', 'decision-timing', 'Compare before choosing', 'When do costs and value enter a design or vendor choice?', [
    'After we see the bill.',
    'After implementation or contracting has started.',
    'While choosing, but usually after a preferred option has emerged.',
    'Before the design or shortlist is settled, with alternatives and assumptions compared.',
  ]),
  q('commitments-contracts', 'decision-timing', 'Review commitments and renewals', 'What happens before a contract, renewal, or long commitment goes ahead?', [
    'It can go ahead or renew automatically without a consistent review.',
    'We mainly react to the discount, deadline, or pressure to cut costs.',
    'We check usage and likely savings, but compare few alternative scenarios.',
    'We check usage, full cost, flexibility, downside risk, terms, and ownership before committing.',
  ]),
  q('leadership-funding', 'decision-timing', 'Inform the person deciding', 'When does the person approving a budget or investment see the relevant costs and tradeoffs?', [
    'They mostly see a bill total, or don’t regularly receive this information.',
    'After the decision is largely committed.',
    'During the review, while some options remain open.',
    'Before committing, while the information can still change the choice.',
  ], 'That person might be you, a business owner, a team lead, or a leadership group.'),
  q('ownership-follow-through', 'operating-response', 'Give a finding an owner', 'When you spot a cost problem or opportunity, what happens next?', [
    'It usually ends with a report or alert.',
    'Someone has to chase the responsible person or team.',
    'We review it, but ownership or follow through is inconsistent.',
    'Someone owns the decision, knows when to respond, and records what happened.',
  ]),
  q('anomaly-response', 'operating-response', 'Respond to unexpected changes', 'How do you catch and handle an unexpected cost change that matters?', [
    'We usually discover it at month end or through an unexpected bill.',
    'We find changes through a regular manual review.',
    'We have alerts, but they can be noisy, hard to explain, or sent to the wrong person.',
    'Our checks catch meaningful changes in time to act, reach the right owner, and track the response.',
  ], 'Checks can be manual or automated. The useful question is whether they work for the size and risk of this spending.'),
  q('cross-functional-cadence', 'operating-response', 'Review and record the outcome', 'How do the people involved review spending and follow up together?', [
    'They mostly work from separate information without a shared review.',
    'They talk when a budget, renewal, or cost problem creates pressure.',
    'They review regularly, but reconcile separate views or leave follow up informal.',
    'They use a shared view, review at a suitable frequency, and record decisions, owners, and outcomes.',
  ]),
];
export const TARGET_SCOPES = [
  { id: 'organization', label: 'Business or business unit' },
  { id: 'product', label: 'One product or application' },
  { id: 'team', label: 'One team or shared service' },
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
  'low-low': { name: 'Invoice Led', meaning: 'Important cost information is hard to explain or arrives after a choice is already made. Start with one gap that could change the next decision.' },
  'high-low': { name: 'Visible, Not Embedded', meaning: 'You can explain much of the spending, but the information doesn’t consistently reach a decision in time or lead to a recorded action.' },
  'low-high': { name: 'Decisions Ahead of the Data', meaning: 'People are trying to use costs when choosing, but the underlying information needs work before it can support those choices reliably.' },
  'high-high': { name: 'Decision Embedded', meaning: 'Your answers suggest that cost information is understandable and reaches decisions in time. Check individual gaps and keep the parts that already work.' },
};
const ACTIONS = {
  'cost-driver-visibility': { title: 'Explain one bill change', move: 'Pick a recent change that mattered. Separate price, usage, and one-off charges, then check the explanation with the person who owns the service.', measures: ['Can the owner reconcile the change to the bill and usage records?'], owners: 'The person responsible for the bill and the service owner' },
  attribution: { title: 'Give the largest costs a clear owner', move: 'Start with the largest unassigned charges. Record who uses each service, why it is needed, and who can approve a change. Keep shared costs visible rather than forcing an arbitrary split.', measures: ['Unassigned spending that still needs an owner'], owners: 'The spending owner, with finance or operations where relevant' },
  forecasting: { title: 'Write down the next forecast’s assumptions', move: 'Start with recent spending. Add expected usage, seat, price, and contract changes, then compare that estimate with the next actual bill.', measures: ['Difference between forecast and actual spending, with the main cause explained'], owners: 'The budget owner and the person who knows expected demand' },
  'unit-economics-value': { title: 'Choose one useful cost measure', move: 'Choose one service and a measure that reflects its purpose, such as cost per active seat or usable AI result. Check the usage and quality behind it before using it to compare options.', measures: ['Cost per relevant unit, alongside usage or quality'], owners: 'The product or service owner, with the person reviewing costs' },
  'full-economic-view': { title: 'Put the relevant costs in one comparison', move: 'For the next choice, combine the relevant bills, contract obligations, support, and changeover work. Mark missing costs as unknown and check whether they could change the choice.', measures: ['Material costs and obligations still missing from the comparison'], owners: 'The decision owner, with finance, procurement, or technical input as needed' },
  'consumption-demand': { title: 'Trace one workload’s usage', move: 'Choose one usage based service. Connect its charge to the workload and main demand driver, then check a recent change against the bill. Keep any shared or unexplained usage separate.', measures: ['How much of the selected charge can be explained by usage?'], owners: 'The workload owner and the person reviewing the bill' },
  'architecture-vendor': { title: 'Compare options before settling on one', move: 'Take the next design or vendor choice that is still open. Compare at least two workable options using the relevant cost, service needs, risks, and assumptions before the shortlist is settled.', measures: ['Did the comparison reach the decision owner before the choice was settled?'], owners: 'The person choosing, with technical and financial input where needed' },
  'commitments-contracts': { title: 'Check the next renewal before it locks in', move: 'Find the next contract or renewal you can still change. Confirm the notice date, usage, price, and exit or seat-change terms. Compare the options before agreeing to another commitment.', measures: ['Notice date, decision owner, and options confirmed before the deadline'], owners: 'The contract owner, with the people using the service' },
  'leadership-funding': { title: 'Put the tradeoffs in front of the approver', move: 'For the next budget or investment choice, give the person approving it a short comparison of costs, benefits, alternatives, and unknowns while the options are still open.', measures: ['Did the approver receive the comparison before committing?'], owners: 'The approver and the person preparing the cost comparison' },
  'ownership-follow-through': { title: 'Give one finding a next step and an owner', move: 'Choose one open cost finding. Agree who can act, what they will check, and when they will respond. Record the decision and outcome, including a reason if no change is needed.', measures: ['Owner, next check, response date, and outcome recorded'], owners: 'The person who can change the service or approve the decision' },
  'anomaly-response': { title: 'Test how one unexpected charge reaches its owner', move: 'Use a recent meaningful cost change to check the current review or alert process. Confirm who receives it, what context they need, and whether the response is early enough for this spending.', measures: ['Time from a meaningful change to an informed response'], owners: 'The service owner and the person checking costs or alerts' },
  'cross-functional-cadence': { title: 'Finish the next review with a decision record', move: 'Bring the relevant people to one spending review. Use the same records and leave with the choice, owner, next check, and outcome recorded. Keep the meeting frequency proportionate to the risk.', measures: ['Decisions and follow ups that have an owner and an outcome'], owners: 'The spending owner and the people affected by the decision' },
};
export const PRIORITY_ACTIONS = Object.fromEntries(DIMENSIONS.map((d) => [d.id, ACTIONS[QUESTIONS.find((q) => q.dimension === d.id).id]]));
const tieOrder = ['decision-timing', 'operating-response', 'signal-clarity', 'economic-context'];
const optionFor = (question, answers) => question.options.find((option) => option.id === answers?.[question.id]);
export function dimensionLabel(score) {
  if (score == null) return 'Not enough answers';
  if (score <= 33) return 'Needs attention';
  if (score <= 66) return 'Developing';
  if (score <= 84) return 'Working';
  return 'Consistent';
}
export function classifyArchetype(signalReadiness, decisionIntegration) {
  if (signalReadiness == null || decisionIntegration == null) return null;
  return ARCHETYPES[`${signalReadiness >= HIGH_BOUNDARY ? 'high' : 'low'}-${decisionIntegration >= HIGH_BOUNDARY ? 'high' : 'low'}`];
}
export function scoreAudit(answers = {}) {
  const dimensions = Object.fromEntries(DIMENSIONS.map((dimension) => {
    const questions = QUESTIONS.filter((q) => q.dimension === dimension.id);
    const values = questions.map((q) => optionFor(q, answers)?.score).filter((score) => typeof score === 'number');
    const score = values.length >= 2 ? Math.round(values.reduce((a, b) => a + b, 0) / (values.length * 3) * 100) : null;
    return [dimension.id, { score, label: dimensionLabel(score), answered: values.length, valid: score !== null }];
  }));
  const average = (ids) => ids.every((id) => dimensions[id].valid) ? Math.round(ids.reduce((sum, id) => sum + dimensions[id].score, 0) / ids.length) : null;
  const axes = { signalReadiness: average(['signal-clarity', 'economic-context']), decisionIntegration: average(['decision-timing', 'operating-response']) };
  const answeredCount = Object.values(dimensions).reduce((sum, value) => sum + value.answered, 0);
  const unknown = QUESTIONS.filter((q) => answers[q.id] === 'outside-visibility').map((q) => q.id);
  const notApplicable = QUESTIONS.filter((q) => answers[q.id] === 'not-applicable').map((q) => q.id);
  const unanswered = QUESTIONS.filter((q) => !optionFor(q, answers)).map((q) => q.id);
  const valid = axes.signalReadiness !== null && axes.decisionIntegration !== null && answeredCount >= 8;
  const archetype = valid ? classifyArchetype(axes.signalReadiness, axes.decisionIntegration) : { name: 'More Information Needed', meaning: 'There aren’t enough scored answers across all four areas to place this scope on the map. Check the missing information and whether the questions fit your scope before drawing a conclusion.' };
  const lowestAnswer = (id) => Math.min(...QUESTIONS.filter((q) => q.dimension === id).map((q) => optionFor(q, answers)?.score).filter((score) => typeof score === 'number'));
  const ranked = DIMENSIONS.filter((d) => dimensions[d.id].valid).sort((a, b) => dimensions[a.id].score - dimensions[b.id].score || lowestAnswer(a.id) - lowestAnswer(b.id) || tieOrder.indexOf(a.id) - tieOrder.indexOf(b.id));
  const weakest = ranked[0]?.id ?? null;
  const max = ranked.length ? Math.max(...ranked.map((d) => dimensions[d.id].score)) : null;
  const strongest = ranked.filter((d) => dimensions[d.id].score === max).map((d) => d.id);
  const priorityArea = ranked.find((dimension) => QUESTIONS.some((q) => q.dimension === dimension.id && typeof optionFor(q, answers)?.score === 'number' && optionFor(q, answers).score < 2));
  const weakestQuestions = QUESTIONS.filter((q) => q.dimension === priorityArea?.id && typeof optionFor(q, answers)?.score === 'number').sort((a, b) => optionFor(a, answers).score - optionFor(b, answers).score);
  const priorityQuestion = weakestQuestions[0];
  const hasKnownGap = QUESTIONS.some((q) => typeof optionFor(q, answers)?.score === 'number' && optionFor(q, answers).score < 2);
  let priority;
  if (!valid || (!hasKnownGap && (unknown.length || unanswered.length))) {
    const fitOnly = notApplicable.length > 0 && !unknown.length && !unanswered.length;
    priority = { kind: 'evidence', questionId: null, title: fitOnly ? 'Check whether this scope fits' : 'Fill in the missing information first', move: fitOnly ? 'Review the questions marked not applicable. A narrower scope or a simpler spending review may fit better. Keep those exclusions visible rather than choosing an answer just to obtain a score.' : 'Choose one question you couldn’t answer and ask the person who owns that information. Check a recent bill, decision, or contract together, then revisit the same scope.', reason: 'A missing answer doesn’t establish that a business process is weak. It tells us what still needs checking.', measures: ['Missing answers checked with the appropriate records or owner'], owners: 'You and the person who can answer the missing question' };
  } else if (!hasKnownGap) {
    priority = { kind: 'maintain', questionId: null, title: 'Keep what’s working', move: 'Use a recent decision to check that the answers still hold. Keep the current process if it serves the business, and revisit this scope after a meaningful change in spending, ownership, or contracts.', reason: 'All scored answers describe a working or consistent practice. A higher score alone is not a reason to add more process.', measures: ['A recent decision supports the answers, with any exceptions recorded'], owners: 'The current spending and decision owners' };
  } else {
    // Among areas with a known 0 or 1 answer, start with the lowest scoring area.
    // Ties follow the disclosed area order and then questionnaire order.
    const question = priorityQuestion;
    priority = { ...ACTIONS[question.id], kind: 'improve', questionId: question.id, reason: `For “${question.title},” you chose: “${optionFor(question, answers).label}” This is the lowest scored answer in the first area we’d check.` };
  }
  return { rubricVersion: RUBRIC_VERSION, dimensions, axes, answeredCount, coverage: { scored: answeredCount, total: QUESTIONS.length, unknown, notApplicable, unanswered }, valid, archetype, strongest, weakest, priority };
}
export function validatePayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return { ok: false, error: 'Request body must be a JSON object.' };
  if (!TARGET_SCOPES.some((item) => item.id === payload.targetScope)) return { ok: false, error: 'Choose a valid assessment scope.' };
  if (!Array.isArray(payload.technologyScopes) || !payload.technologyScopes.length || payload.technologyScopes.length > TECHNOLOGY_SCOPES.length || payload.technologyScopes.some((id) => !TECHNOLOGY_SCOPES.some((item) => item.id === id))) return { ok: false, error: 'Choose valid technology categories.' };
  const technologyScopes = [...new Set(payload.technologyScopes)];
  if (technologyScopes.includes('mixed') && technologyScopes.length > 1) return { ok: false, error: 'Choose individual categories or Mixed technology portfolio.' };
  if (!payload.answers || typeof payload.answers !== 'object' || Array.isArray(payload.answers) || Object.keys(payload.answers).length !== QUESTIONS.length) return { ok: false, error: 'Answer all 12 questions. You can choose “I don’t know” or “This doesn’t apply.”' };
  for (const question of QUESTIONS) if (!Object.hasOwn(payload.answers, question.id) || !optionFor(question, payload.answers)) return { ok: false, error: 'Invalid question or answer.' };
  return { ok: true, value: { targetScope: payload.targetScope, technologyScopes, answers: Object.fromEntries(QUESTIONS.map((q) => [q.id, payload.answers[q.id]])) } };
}
export function scopeGuidance(technologyScopes = []) {
  const notes = {
    'public-cloud': 'For cloud spending, check the usage, shared costs, discounts, and commitment terms behind a change.',
    'ai-data': 'For AI and data work, check usage, quality, retries, review work, and any capacity or minimum commitments.',
    saas: 'For software, check active seats, actual usage, ownership, renewal notice dates, and the terms for changing or leaving.',
    'private-cloud': 'For a data center or private cloud, include the relevant capacity, licensing, support, and operating costs.',
    mixed: 'For a mixed portfolio, keep a shared definition of cost and ownership. Check the terms and usage drivers separately for each service.',
  };
  return technologyScopes.map((id) => notes[id]).filter(Boolean).join(' ');
}
export function fallbackInterpretation(result, context = {}) {
  const ids = context.technologyScopes?.map((value) => TECHNOLOGY_SCOPES.find((item) => item.id === value || item.label === value)?.id).filter(Boolean) || [];
  return { pattern_read: result.archetype.meaning, decision_implication: result.priority.reason, scope_watchpoint: scopeGuidance(ids) || 'Keep the scope and people involved consistent when you revisit the answers.' };
}
export const EXAMPLE = {
  label: 'Made-up example: a team’s software renewals',
  description: 'The team can explain its bills, but reviews renewals late and doesn’t consistently record who will follow up.',
  targetScope: 'team', technologyScopes: ['saas'],
  answers: Object.fromEntries(QUESTIONS.map((question) => [question.id, ({ 'cost-driver-visibility': 'score-3', attribution: 'score-3', forecasting: 'score-2', 'unit-economics-value': 'score-2', 'full-economic-view': 'score-2', 'consumption-demand': 'not-applicable', 'architecture-vendor': 'score-1', 'commitments-contracts': 'score-0', 'leadership-funding': 'score-1', 'ownership-follow-through': 'score-1', 'anomaly-response': 'score-1', 'cross-functional-cadence': 'score-1' })[question.id]])),
};
export function discussionQuestions(result) {
  if (result.priority.kind === 'evidence') return ['Which questions need a different person or a record to answer?', 'Which questions genuinely don’t apply to this scope?', 'What can we verify together before repeating this assessment?'];
  if (result.priority.kind === 'maintain') return ['Which recent decision supports these answers?', 'Has spending, ownership, or the contract changed since then?', 'What would tell us the current process needs an adjustment?'];
  return ['Which upcoming decision could this first step help?', 'Who will check the records and when will they respond?', 'What result would tell us to change something or keep it as it is?'];
}
export function buildAuditSummary(result, context = {}) {
  const scope = TARGET_SCOPES.find((x) => x.id === context.targetScope)?.label || 'Scope not selected';
  const technology = (context.technologyScopes || []).map((id) => TECHNOLOGY_SCOPES.find((x) => x.id === id)?.label).filter(Boolean).join(', ');
  const score = (n) => n === null ? 'Not enough answers' : `${n}/100 points`;
  return [
    'CLOUD & CAPITAL · SIGNAL AUDIT', `Rubric: ${RUBRIC_VERSION}`, context.isExample ? EXAMPLE.label : 'Your self-assessment', `Scope: ${scope}`, `Technology: ${technology}`,
    `Pattern: ${result.archetype.name}`, result.archetype.meaning,
    `Understand the spending: ${score(result.axes.signalReadiness)}`, `Use it in decisions: ${score(result.axes.decisionIntegration)}`,
    `Answer coverage: ${result.answeredCount}/12 scored; ${result.coverage.unknown.length} unknown; ${result.coverage.notApplicable.length} not applicable; ${result.coverage.unanswered.length} unanswered. This is not verified evidence or a confidence estimate.`,
    '', 'FOUR AREAS', ...DIMENSIONS.map((d) => `${d.name}: ${score(result.dimensions[d.id].score)} (${result.dimensions[d.id].answered}/3 scored)`),
    '', 'WHAT TO DO FIRST', result.priority.title, result.priority.move, `Why this first: ${result.priority.reason}`, `Suggested owner: ${result.priority.owners}`, `What to check: ${result.priority.measures.join('; ')}`,
    '', 'QUESTIONS TO DISCUSS', ...discussionQuestions(result).map((q, i) => `${i + 1}. ${q}`), '', 'FOR THIS TECHNOLOGY', scopeGuidance(context.technologyScopes),
    '', 'YOUR ANSWERS', ...QUESTIONS.map((q) => `${q.title}: ${optionFor(q, context.answers)?.label || 'Unanswered'}`),
    '', 'Independent directional self-assessment. Scores use our own rubric, not a certification, percentile, industry benchmark, or verified savings estimate. Check the answers against actual records. Keep exclusions visible when comparing assessments.',
    'Guide: https://cloudandcapital.com/insights/using-signal-audit',
  ].join('\n');
}
