export const validBrief = {
  decision_summary: 'Choose how much capacity to commit before demand is proven.',
  posture: { label: 'Stage', rationale: 'A smaller test can check the baseline before committing.' },
  recommendation: { move: 'Measure the stable baseline before making a commitment.', confidence: 'Medium', rationale: 'Demand and commercial terms still need checking.' },
  options: [
    { name: 'Wait', cost_effect: 'Keep paying for flexibility.', practical_effect: 'Keep the current setup.', check: 'Confirm whether capacity stays available.' },
    { name: 'Stage the commitment', cost_effect: 'Limit exposure to proven demand.', practical_effect: 'Test a smaller commitment first.', check: 'Confirm the stable baseline and terms.' },
  ],
  missing_information: ['The minimum stable demand.', 'The price and cancellation terms.'],
  next_actions: [
    { action: 'Measure the stable workload baseline.', owner: 'Engineering', timing: 'Now' },
    { action: 'Confirm the commercial terms and downside.', owner: 'Subscription owner', timing: 'Before choosing' },
  ],
};
