export const MAX_DECISION_CHARS = 2000;
export const MAX_ANSWER_CHARS = 1200;

export const DECISION_TYPES = {
  commitment: {
    label: 'Capacity or commitment',
    eyebrow: 'Commitment economics',
    questions: [
      { id: 'alternatives', label: 'What are the real options?', prompt: 'Name the options being considered, including the option to wait or stage the commitment.' },
      { id: 'exposure', label: 'What is the financial exposure?', prompt: 'Include the amount, term, pricing structure, and any deadline you know.' },
      { id: 'demand', label: 'What demand is already proven?', prompt: 'Describe the stable baseline, utilization evidence, and what remains uncertain.' },
      { id: 'constraint', label: 'What cannot be compromised?', prompt: 'Note the reliability, capacity, performance, delivery, or cash constraint that matters most.' },
    ],
  },
  renewal: {
    label: 'SaaS renewal or rationalization',
    eyebrow: 'Vendor economics',
    questions: [
      { id: 'alternatives', label: 'What are the real options?', prompt: 'Renew, renegotiate, reduce scope, switch, build, or wait—name what is genuinely available.' },
      { id: 'exposure', label: 'What is the financial exposure?', prompt: 'Include current spend, proposed term, renewal deadline, and recent growth.' },
      { id: 'demand', label: 'What usage and ownership evidence exists?', prompt: 'Describe adoption, utilization, business owners, and any unallocated or shared usage.' },
      { id: 'constraint', label: 'What makes change difficult?', prompt: 'Include switching cost, implementation effort, operational dependency, or contractual limits.' },
    ],
  },
  build_buy: {
    label: 'AI build, buy, or optimize',
    eyebrow: 'Build-versus-buy economics',
    questions: [
      { id: 'alternatives', label: 'What are the real options?', prompt: 'Name the vendor, model, optimization, or internal-build paths actually being considered.' },
      { id: 'exposure', label: 'What does the current path cost?', prompt: 'Include spend, volume, growth, unit cost, and any margin pressure you can measure.' },
      { id: 'demand', label: 'What outcome must the system deliver?', prompt: 'Describe the customer or business outcome plus quality, latency, or scale requirements.' },
      { id: 'constraint', label: 'What internal capacity exists?', prompt: 'Include engineering time, model operations, data, security, and maintenance capacity.' },
    ],
  },
  cost_review: {
    label: 'Technology cost review',
    eyebrow: 'Spend and value review',
    questions: [
      { id: 'alternatives', label: 'What decision must this review support?', prompt: 'Clarify whether the goal is savings, budget control, margin improvement, accountability, or prioritization.' },
      { id: 'exposure', label: 'What is the baseline and target?', prompt: 'Include current spend, desired change, deadline, and the scope of technology included.' },
      { id: 'demand', label: 'How well is spend understood?', prompt: 'Describe allocation, ownership, unit economics, trend data, and recent anomalies.' },
      { id: 'constraint', label: 'What must be protected?', prompt: 'Name the revenue, reliability, security, customer, or roadmap outcomes that cuts cannot damage.' },
    ],
  },
  architecture: {
    label: 'Architecture or workload placement',
    eyebrow: 'Architecture economics',
    questions: [
      { id: 'alternatives', label: 'What are the real options?', prompt: 'Name the architecture, provider, placement, or migration choices being evaluated.' },
      { id: 'exposure', label: 'What is the cost and time horizon?', prompt: 'Include expected run cost, migration or build cost, and how long the decision must hold.' },
      { id: 'demand', label: 'What workload evidence exists?', prompt: 'Describe scale, variability, data gravity, performance, and current utilization.' },
      { id: 'constraint', label: 'What cannot be compromised?', prompt: 'Include reliability, security, compliance, latency, team capacity, or portability requirements.' },
    ],
  },
  open: {
    label: 'Open technology decision',
    eyebrow: 'Decision framing',
    questions: [
      { id: 'alternatives', label: 'What are the real options?', prompt: 'Name the choices, including waiting, staging, or doing nothing.' },
      { id: 'exposure', label: 'What is at stake?', prompt: 'Include money, time, risk, deadline, and the size of the decision.' },
      { id: 'demand', label: 'What outcome would make this worthwhile?', prompt: 'Describe the business or customer value and how it could be observed.' },
      { id: 'constraint', label: 'What cannot be compromised?', prompt: 'Name the financial, technical, operational, or organizational constraint that matters most.' },
    ],
  },
};

const TYPE_SIGNALS = [
  ['renewal', /renew|license|licence|saas|vendor|contract|datadog|observability/i],
  ['build_buy', /build\s*(?:vs\.?|versus|or)\s*buy|model|token|inference|fine[- ]?tun|claude|openai|anthropic|agent/i],
  ['commitment', /commit|reserv|capacity|gpu|savings plan|reserved instance|term deal/i],
  ['architecture', /multi[- ]?cloud|architecture|workload placement|migrat|provider|region|resilien/i],
  ['cost_review', /cost review|reduce (?:technology|tech|cloud) spend|bill|budget|saving|cut spend|spend review/i],
];

export function cleanText(value, maxChars) {
  if (typeof value !== 'string') return '';
  return value.replace(/\0/g, '').trim().slice(0, maxChars);
}

export function classifyDecision(decision, requestedType) {
  if (requestedType && DECISION_TYPES[requestedType]) return requestedType;
  const source = cleanText(decision, MAX_DECISION_CHARS);
  return TYPE_SIGNALS.find(([, pattern]) => pattern.test(source))?.[0] || 'open';
}

export function getQuestions(decisionType) {
  const type = DECISION_TYPES[decisionType] ? decisionType : 'open';
  return DECISION_TYPES[type].questions.map((question) => ({ ...question }));
}

export function normalizeAnswers(decisionType, answers = {}) {
  const normalized = {};
  for (const question of getQuestions(decisionType)) {
    normalized[question.id] = cleanText(answers?.[question.id], MAX_ANSWER_CHARS);
  }
  return normalized;
}

export function assessReadiness({ decision, decisionType, answers }) {
  const normalizedDecision = cleanText(decision, MAX_DECISION_CHARS);
  const type = classifyDecision(normalizedDecision, decisionType);
  const normalizedAnswers = normalizeAnswers(type, answers);
  const questions = getQuestions(type);
  const missing = questions.filter((question) => normalizedAnswers[question.id].length < 8);

  return {
    decision: normalizedDecision,
    decisionType: type,
    typeLabel: DECISION_TYPES[type].label,
    eyebrow: DECISION_TYPES[type].eyebrow,
    answers: normalizedAnswers,
    questions,
    missing: missing.map((question) => question.id),
    ready: normalizedDecision.length >= 20 && missing.length === 0,
  };
}

function isText(value, max = 1200) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= max;
}

function isTextArray(value, min, max) {
  return Array.isArray(value) && value.length >= min && value.length <= max && value.every((item) => isText(item, 500));
}

export function validateBrief(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  if (!isText(value.decision_summary, 300)) return false;
  if (!value.posture || !['Explore', 'Stage', 'Commit'].includes(value.posture.label) || !isText(value.posture.rationale, 600)) return false;
  if (!isTextArray(value.known_facts, 3, 6)) return false;
  if (!Array.isArray(value.working_assumptions) || value.working_assumptions.length > 5) return false;
  if (!value.working_assumptions.every((item) => isText(item?.assumption, 400) && isText(item?.why_it_matters, 500))) return false;
  if (!Array.isArray(value.options) || value.options.length < 2 || value.options.length > 4) return false;
  if (!value.options.every((item) => ['name', 'economics', 'operational_effect', 'reversibility', 'risk', 'evidence_needed'].every((key) => isText(item?.[key], 600)))) return false;
  if (!value.lenses || !['finops', 'finance', 'engineering'].every((lens) => isText(value.lenses?.[lens]?.view, 600) && isText(value.lenses?.[lens]?.need, 400))) return false;
  if (!isText(value.common_ground, 700) || !isText(value.unresolved_tension, 700)) return false;
  if (!value.economics || typeof value.economics.available !== 'boolean' || !isText(value.economics.analysis, 800)) return false;
  if (!Array.isArray(value.economics.thresholds) || value.economics.thresholds.length > 4) return false;
  if (!value.economics.thresholds.every((item) => ['metric', 'trigger', 'meaning', 'basis'].every((key) => isText(item?.[key], 500)))) return false;
  if (!value.recommendation || !isText(value.recommendation.move, 900) || !['Low', 'Medium', 'High'].includes(value.recommendation.confidence) || !isText(value.recommendation.rationale, 700)) return false;
  if (!isTextArray(value.change_the_answer, 2, 4)) return false;
  if (!Array.isArray(value.next_actions) || value.next_actions.length < 2 || value.next_actions.length > 4) return false;
  if (!value.next_actions.every((item) => ['action', 'owner', 'evidence', 'timing'].every((key) => isText(item?.[key], 500)))) return false;
  return true;
}

const NUMBER_WORD_VALUES = new Map([
  ['zero', 0], ['one', 1], ['two', 2], ['three', 3], ['four', 4], ['five', 5], ['six', 6], ['seven', 7], ['eight', 8], ['nine', 9],
  ['ten', 10], ['eleven', 11], ['twelve', 12], ['thirteen', 13], ['fourteen', 14], ['fifteen', 15], ['sixteen', 16], ['seventeen', 17],
  ['eighteen', 18], ['nineteen', 19], ['twenty', 20], ['thirty', 30], ['forty', 40], ['fifty', 50], ['sixty', 60], ['seventy', 70],
  ['eighty', 80], ['ninety', 90],
]);

const NUMBER_ATOM = '(?:\\d[\\d,]*(?:\\.\\d+)?|zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty(?:[- ](?:one|two|three|four|five|six|seven|eight|nine))?|thirty(?:[- ](?:one|two|three|four|five|six|seven|eight|nine))?|forty(?:[- ](?:one|two|three|four|five|six|seven|eight|nine))?|fifty(?:[- ](?:one|two|three|four|five|six|seven|eight|nine))?|sixty(?:[- ](?:one|two|three|four|five|six|seven|eight|nine))?|seventy(?:[- ](?:one|two|three|four|five|six|seven|eight|nine))?|eighty(?:[- ](?:one|two|three|four|five|six|seven|eight|nine))?|ninety(?:[- ](?:one|two|three|four|five|six|seven|eight|nine))?)';
const NUMBER_CLAIM_PATTERN = new RegExp(`([$€£])?\\s*(${NUMBER_ATOM})(?:\\s*(?:-|–|—|to)\\s*(${NUMBER_ATOM}))?([kKmM])?(?:\\s*-\\s*)?\\s*(%|percent(?:age)?|years?|months?|weeks?|days?|hours?|engineers?|users?|seats?|licenses?|licences?|quarters?|x|times?)?`, 'gi');

function parseNumberAtom(atom) {
  if (/^\d/.test(atom)) return Number(atom.replace(/,/g, ''));
  return atom.toLowerCase().split(/[- ]/).reduce((total, word) => total + (NUMBER_WORD_VALUES.get(word) || 0), 0);
}

function normalizeUnit(unit = '') {
  const normalized = unit.toLowerCase();
  if (normalized === '%' || normalized.startsWith('percent')) return 'percent';
  if (normalized === 'x' || normalized === 'time' || normalized === 'times') return 'multiple';
  return normalized.replace(/s$/, '');
}

function extractNumericClaims(text) {
  const claims = [];
  for (const match of String(text).matchAll(NUMBER_CLAIM_PATTERN)) {
    const [raw, currency, firstAtom, secondAtom, magnitude, rawUnit] = match;
    if (!currency && !magnitude && !rawUnit && !/^\d/.test(firstAtom)) continue;
    const scale = magnitude?.toLowerCase() === 'k' ? 1000 : magnitude?.toLowerCase() === 'm' ? 1000000 : 1;
    const first = parseNumberAtom(firstAtom) * scale;
    const second = secondAtom ? parseNumberAtom(secondAtom) * scale : null;
    const unit = currency ? `currency:${currency}` : normalizeUnit(rawUnit);
    const value = second === null ? String(first) : `${first}..${second}`;
    claims.push({ raw: raw.trim(), signature: `${value}|${unit}` });
  }
  return claims;
}

export function findUnsupportedNumbers(value, sourceText) {
  const allowed = new Set();
  for (const { signature } of extractNumericClaims(sourceText)) {
    allowed.add(signature);
    const [value, unit] = signature.split('|');
    if (value.includes('..')) value.split('..').forEach((endpoint) => allowed.add(`${endpoint}|${unit}`));
  }
  return [...new Set(extractNumericClaims(JSON.stringify(value)).filter(({ signature }) => !allowed.has(signature)).map(({ raw }) => raw))];
}
