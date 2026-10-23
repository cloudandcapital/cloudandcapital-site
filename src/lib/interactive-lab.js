export const MAX_DECISION_CHARS = 2000;
export const MAX_ANSWER_CHARS = 1200;

export const DECISION_TYPES = {
  commitment: {
    label: 'Cloud capacity',
    eyebrow: 'Before reserving capacity',
    questions: [
      { id: 'alternatives', label: 'What are the real options?', prompt: 'Name the options being considered, including the option to wait or stage the commitment.' },
      { id: 'exposure', label: 'What money and time are at stake?', prompt: 'Include the amount, contract length, pricing structure, and any deadline you know.' },
      { id: 'demand', label: 'What demand is already proven?', prompt: 'Describe the stable baseline, utilization evidence, and what remains uncertain.' },
      { id: 'constraint', label: 'What cannot be compromised?', prompt: 'Note the reliability, capacity, performance, delivery, or cash constraint that matters most.' },
    ],
  },
  renewal: {
    label: 'Software renewal',
    eyebrow: 'Before you renew',
    questions: [
      { id: 'alternatives', label: 'What are the real options?', prompt: 'Renew, renegotiate, reduce scope, switch, build, or wait—name what is genuinely available.' },
      { id: 'exposure', label: 'What does it cost, and when is it due?', prompt: 'Include the current bill, new quote, contract length, renewal date, and any deadline to cancel or change seats. Does it auto-renew? Say what you do not know yet.' },
      { id: 'demand', label: 'Who uses it, and who looks after it?', prompt: 'Share what is actually used, what sits unused, and who owns the subscription.' },
      { id: 'constraint', label: 'What makes change difficult?', prompt: 'Include switching cost, implementation effort, operational dependency, or contractual limits.' },
    ],
  },
  build_buy: {
    label: 'AI build or buy',
    eyebrow: 'Choosing an AI setup',
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
    label: 'Cloud setup',
    eyebrow: 'Choosing a cloud setup',
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

export const ACTION_TIMINGS = ['Now', 'Before the deadline', 'Before choosing'];

export function validateBrief(value, onInvalid = () => {}) {
  const invalid = (field) => { onInvalid(field); return false; };
  if (!value || typeof value !== 'object' || Array.isArray(value)) return invalid('brief');
  const fields = ['decision_summary', 'posture', 'recommendation', 'options', 'missing_information', 'next_actions'];
  if (Object.keys(value).some((key) => !fields.includes(key))) return invalid('unexpected_fields');
  if (!isText(value.decision_summary, 300)) return invalid('decision_summary');
  if (!value.posture || !['Explore', 'Stage', 'Commit'].includes(value.posture.label) || !isText(value.posture.rationale, 500)) return invalid('posture');
  if (!value.recommendation || !isText(value.recommendation.move, 700) || !['Low', 'Medium', 'High'].includes(value.recommendation.confidence) || !isText(value.recommendation.rationale, 500)) return invalid('recommendation');
  if (!Array.isArray(value.options) || value.options.length < 2 || value.options.length > 4) return invalid('options.length');
  if (!value.options.every((item) => ['name', 'cost_effect', 'practical_effect', 'check'].every((key) => isText(item?.[key], 500)) && ['supplied', 'suggested'].includes(item.source))) return invalid('options.fields');
  if (!isTextArray(value.missing_information, 1, 8)) return invalid('missing_information');
  if (!Array.isArray(value.next_actions) || value.next_actions.length < 2 || value.next_actions.length > 4) return invalid('next_actions.length');
  if (!value.next_actions.every((item) => isText(item?.action, 500) && isText(item?.owner, 200) && ACTION_TIMINGS.includes(item?.timing))) return invalid('next_actions.fields');
  return true;
}

const briefString = { type: 'string' };
const briefObject = (properties) => ({ type: 'object', properties, required: Object.keys(properties), additionalProperties: false });
const briefList = (items, description) => ({ type: 'array', items, description });
const briefChoice = (...values) => ({ type: 'string', enum: values });
export const BRIEF_OUTPUT_SCHEMA = briefObject({
  decision_summary: { type: 'string', description: 'Short decision title under twelve words; no figures or fact recap.' },
  posture: briefObject({ label: briefChoice('Explore', 'Stage', 'Commit'), rationale: briefString }),
  recommendation: briefObject({ move: briefString, confidence: briefChoice('Low', 'Medium', 'High'), rationale: briefString }),
  options: briefList(briefObject({ name: briefString, source: briefChoice('supplied', 'suggested'), cost_effect: briefString, practical_effect: briefString, check: briefString }), 'Two to four distinct options. Mark an option supplied only if the visitor named that choice; any new possibility is suggested.'),
  missing_information: briefList(briefString, 'One to five specific things that are still unknown.'),
  next_actions: briefList(briefObject({ action: briefString, owner: briefString, timing: briefChoice(...ACTION_TIMINGS) }), 'Two or three practical next actions.'),
});

const NUMBER_WORD_VALUES = new Map([
  ['zero', 0], ['one', 1], ['two', 2], ['three', 3], ['four', 4], ['five', 5], ['six', 6], ['seven', 7], ['eight', 8], ['nine', 9],
  ['ten', 10], ['eleven', 11], ['twelve', 12], ['thirteen', 13], ['fourteen', 14], ['fifteen', 15], ['sixteen', 16], ['seventeen', 17],
  ['eighteen', 18], ['nineteen', 19], ['twenty', 20], ['thirty', 30], ['forty', 40], ['fifty', 50], ['sixty', 60], ['seventy', 70],
  ['eighty', 80], ['ninety', 90],
]);

const NUMBER_WORD_ATOM = '(?:zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty(?:[- ](?:one|two|three|four|five|six|seven|eight|nine))?|thirty(?:[- ](?:one|two|three|four|five|six|seven|eight|nine))?|forty(?:[- ](?:one|two|three|four|five|six|seven|eight|nine))?|fifty(?:[- ](?:one|two|three|four|five|six|seven|eight|nine))?|sixty(?:[- ](?:one|two|three|four|five|six|seven|eight|nine))?|seventy(?:[- ](?:one|two|three|four|five|six|seven|eight|nine))?|eighty(?:[- ](?:one|two|three|four|five|six|seven|eight|nine))?|ninety(?:[- ](?:one|two|three|four|five|six|seven|eight|nine))?)\\b';
const NUMBER_ATOM = `(?:\\d[\\d,]*(?:\\.\\d+)?|${NUMBER_WORD_ATOM})`;
const COUNT_UNIT = 'anomal(?:y|ies)|services?|teams?|accounts?|requests?|workloads?|incidents?|outages?|resources?|models?|environments?|users?|seats?|licenses?|licences?';
const STANDARD_UNIT = '%|percent(?:age)?|years?|months?|weeks?|days?|hours?|minutes?|seconds?|engineers?|quarters?|x|times?';
const NUMBER_CLAIM_PATTERN = new RegExp(`(?<![\\w])([$€£])?\\s*(${NUMBER_ATOM})(?:\\s*(?:-|–|—|to)\\s*(${NUMBER_ATOM}))?([kKmM])?(?:(?:\\s*[-‐‑–—]\\s*|\\s+)(?:(?:recent|active|unused|licensed|named|stable|production|reserved)(?:\\s*[-‐‑–—]\\s*|\\s+))?(${COUNT_UNIT})\\b|(?:\\s*[-‐‑–—]\\s*)?\\s*(${STANDARD_UNIT})(?![A-Za-z]))?`, 'gi');

function parseNumberAtom(atom) {
  if (/^\d/.test(atom)) return Number(atom.replace(/,/g, ''));
  return atom.toLowerCase().split(/[- ]/).reduce((total, word) => total + (NUMBER_WORD_VALUES.get(word) || 0), 0);
}

function normalizeUnit(unit = '') {
  const normalized = unit.toLowerCase();
  if (normalized === '%' || normalized.startsWith('percent')) return 'percent';
  if (normalized === 'x' || normalized === 'time' || normalized === 'times') return 'multiple';
  if (normalized === 'anomalies') return 'anomaly';
  return normalized.replace(/s$/, '');
}

function extractNumericClaims(text) {
  const claims = [];
  // These describe recurrence, not a quantity. Preserve offsets for the
  // deliberately narrow, server-calculated comparisons below.
  const readable = String(text).replace(/\bone[-\u2010-\u2014 ](?:time|off)\b/gi, (match) => ' '.repeat(match.length));
  for (const match of readable.matchAll(NUMBER_CLAIM_PATTERN)) {
    const [raw, currency, firstAtom, secondAtom, magnitude, countUnit, standardUnit] = match;
    const rawUnit = countUnit || standardUnit;
    if (!currency && !magnitude && !rawUnit && !/^\d/.test(firstAtom)) continue;
    const scale = magnitude?.toLowerCase() === 'k' ? 1000 : magnitude?.toLowerCase() === 'm' ? 1000000 : 1;
    const first = parseNumberAtom(firstAtom) * scale;
    const second = secondAtom ? parseNumberAtom(secondAtom) * scale : null;
    const unit = currency ? `currency:${currency}` : normalizeUnit(rawUnit);
    const value = second === null ? String(first) : `${first}..${second}`;
    claims.push({ raw: raw.trim(), signature: `${value}|${unit}`, value: first, unit, currency, range: second !== null, index: match.index + raw.indexOf(raw.trim()) });
  }
  return claims;
}

function addEquivalentUnits(allowed, value, unit) {
  const conversions = {
    year: [['month', 12], ['quarter', 4]], quarter: [['month', 3]],
    week: [['day', 7]], day: [['hour', 24]], hour: [['minute', 60]], minute: [['second', 60]],
  };
  for (const [other, scale] of conversions[unit] || []) allowed.add(`${Number(value) * scale}|${other}`);
  for (const [other, entries] of Object.entries(conversions)) {
    for (const [target, scale] of entries) if (target === unit && Number(value) % scale === 0) allowed.add(`${Number(value) / scale}|${other}`);
  }
}

const MONEY_CODES = { '$': 'USD', '€': 'EUR', '£': 'GBP' };
function moneyText(amount, symbol) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: MONEY_CODES[symbol], maximumFractionDigits: 2 }).format(amount);
}

export function getCheckedCalculations(sourceText) {
  const source = String(sourceText);
  const claims = extractNumericClaims(source);
  const amounts = claims.filter((claim) => claim.currency && !claim.range);
  // Do not choose a base among different quotes, credits, currencies or rates.
  if (!amounts.length || claims.some((claim) => claim.currency && claim.range) || /[-−]\s*[$€£]|\b(?:credit|refund|negative)\b/i.test(source)) return [];
  if (new Set(amounts.map((claim) => claim.signature)).size !== 1) return [];
  const { value: amount, currency: symbol } = amounts[0];
  if (!(amount > 0 && amount <= 1e9) || Math.abs(amount * 100 - Math.round(amount * 100)) > 1e-5) return [];
  const result = [];
  const percentages = claims.filter((claim) => claim.unit === 'percent' && !claim.range);
  const rates = [...new Set(percentages.map((claim) => claim.value))];
  if (rates.length === 1 && rates[0] > 0 && rates[0] <= 100 && Math.abs(rates[0] * 100 - Math.round(rates[0] * 100)) < 1e-8) {
    const rate = rates[0];
    const explicitIncrease = percentages.some((claim) => {
      const surrounding = source.slice(Math.max(0, claim.index - 48), claim.index + claim.raw.length + 48);
      const before = source.slice(Math.max(0, claim.index - 70), claim.index);
      const subjects = [...before.matchAll(/\b(price|quote|cost|bill|rate|fee|charge|renewal|demand|usage|traffic|revenue|margin|headcount|requests|utilization)\b/gi)];
      const lastSubject = subjects.at(-1)?.[1];
      const priceSubject = /^(?:price|quote|cost|bill|rate|fee|charge|renewal)$/i.test(lastSubject || '')
        || /^\s*(?:price|cost|fee|rate)\s+increase\b/i.test(source.slice(claim.index + claim.raw.length));
      return /\bincreas(?:e|es|ed|ing)\b|\bhigher\b/i.test(surrounding)
        && priceSubject
        && !/\b(?:discount|decrease|reduction|lower)\b/i.test(surrounding);
    });
    if (explicitIncrease) {
      const cents = BigInt(Math.round(amount * 100));
      const increaseCents = (cents * BigInt(Math.round(rate * 100)) + 5000n) / 10000n;
      const increase = Number(increaseCents) / 100;
      const total = Number(cents + increaseCents) / 100;
      result.push({
        label: 'Applying the price increase',
        explanation: `Calculated: applying a ${rate}% increase to ${moneyText(amount, symbol)} gives ${moneyText(total, symbol)}. The increase is ${moneyText(increase, symbol)}. This assumes the increase applies to that entire charge.`,
        amounts: [{ value: total, currency: symbol }, { value: increase, currency: symbol }],
      });
    }
  }
  const monthly = amounts.every((claim) => {
    const after = source.slice(claim.index + claim.raw.length, claim.index + claim.raw.length + 30);
    const before = source.slice(Math.max(0, claim.index - 35), claim.index);
    return /^\s*(?:\/\s*|per\s+|a\s+|each\s+)?month(?:ly|s)?\b/i.test(after)
      || /\bmonthly(?:\s+(?:spend|cost|price|fee|bill|baseline))?\s*(?:is|of|:)?\s*$/i.test(before);
  });
  const yearlyHorizon = claims.some((claim) => !claim.range && ((claim.unit === 'year' && claim.value === 1) || (claim.unit === 'month' && claim.value === 12)));
  if (monthly && yearlyHorizon) {
    const total = Number(BigInt(Math.round(amount * 100)) * 12n) / 100;
    result.push({ label: 'At the current monthly rate', explanation: `Calculated: ${moneyText(amount, symbol)} per month over 12 months is ${moneyText(total, symbol)}, assuming the rate and usage stay the same. This is today's spending carried forward, not a savings figure or a commitment quote.`, amounts: [{ value: total, currency: symbol }] });
  }
  return result;
}

export function findUnsupportedNumbers(value, sourceText, { includeCalculations = false } = {}) {
  const allowed = new Set();
  for (const { signature } of extractNumericClaims(sourceText)) {
    allowed.add(signature);
    const [value, unit] = signature.split('|');
    const endpoints = value.includes('..') ? value.split('..') : [value];
    for (const endpoint of endpoints) {
      allowed.add(`${endpoint}|${unit}`);
      addEquivalentUnits(allowed, endpoint, unit);
    }
  }
  if (includeCalculations) {
    for (const calculation of getCheckedCalculations(sourceText)) {
      for (const amount of calculation.amounts) allowed.add(`${amount.value}|currency:${amount.currency}`);
    }
  }
  return [...new Set(extractNumericClaims(JSON.stringify(value)).filter(({ signature }) => !allowed.has(signature)).map(({ raw }) => raw))];
}

// A narrow guard for promises observed in live review. This does not establish
// that the remaining prose is true or that every unsupported claim is detected.
export function findUnqualifiedPromises(value) {
  const matches = new Set();
  const qualifiers = /\b(?:may|might|could|if|unless|unknown|uncertain|unconfirmed|check|confirm|test|assess|verify|whether|depends?|potential(?:ly)?)\b|\bnot\s+(?:confirmed|guaranteed)\b|\bno\s+guarantee\b/i;
  const promises = [
    /\bno disruption\b/i,
    /\b(?:keeps?|preserves?|maintains?)\b[^.!?;]{0,90}\b(?:quality|reliability|access)\b/i,
    /\b(?:captures?|delivers?|guarantees?)\b[^.!?;]{0,60}\b(?:savings?|cost reduction)\b/i,
    /\bonly safe\s+(?:first\s+)?(?:move|path|option|step)\b/i,
  ];
  function visit(item) {
    if (typeof item === 'string') {
      for (const clause of item.split(/[.!?;\n]/)) {
        if (qualifiers.test(clause)) continue;
        for (const pattern of promises) {
          const match = clause.match(pattern);
          if (match) matches.add(match[0]);
        }
      }
    } else if (Array.isArray(item)) item.forEach(visit);
    else if (item && typeof item === 'object') Object.values(item).forEach(visit);
  }
  visit(value);
  return [...matches];
}
