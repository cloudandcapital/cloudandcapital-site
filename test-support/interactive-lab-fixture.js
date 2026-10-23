export const validBrief = {
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
