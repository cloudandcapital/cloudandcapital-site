const schema = Object.freeze({
  cta_click: Object.freeze({
    destination: Object.freeze(['work', 'signal_audit', 'interactive_lab', 'market_tape', 'cloud_cost_guard', 'github_pipeline', 'writing', 'substack', 'contact']),
    source: Object.freeze(['homepage_hero', 'homepage_work', 'homepage_writing', 'homepage_contact', 'work_flagship', 'work_decision_tools', 'work_market_context', 'work_pipeline', 'work_contact', 'writing_newsletter', 'writing_featured', 'writing_archive', 'writing_contact', 'signal_audit_results']),
  }),
  tool_start: Object.freeze({
    tool: Object.freeze(['signal_audit', 'interactive_lab']),
    entry: Object.freeze(['audit_setup', 'decision_form', 'starter_scenario']),
  }),
  tool_complete: Object.freeze({
    tool: Object.freeze(['signal_audit', 'interactive_lab']),
    result: Object.freeze(['completed']),
  }),
  lab_stage_result: Object.freeze({
    stage: Object.freeze(['questions', 'brief']),
    result: Object.freeze(['success', 'failure']),
  }),
  tool_output_action: Object.freeze({
    tool: Object.freeze(['signal_audit', 'interactive_lab']),
    action: Object.freeze(['copy', 'print', 'retake', 'edit', 'reset']),
  }),
  starter_scenario_selected: Object.freeze({
    scenario: Object.freeze(['gpu_commitment', 'saas_renewal', 'ai_build_or_buy', 'cost_review', 'multi_cloud']),
    tool: Object.freeze(['interactive_lab']),
  }),
});

export const ANALYTICS_SCHEMA = schema;

export function validateAnalyticsEvent(eventName, properties) {
  const eventSchema = schema[eventName];
  if (!eventSchema || !properties || typeof properties !== 'object' || Array.isArray(properties)) return null;
  const expectedKeys = Object.keys(eventSchema).sort();
  const suppliedKeys = Object.keys(properties).sort();
  if (expectedKeys.length !== suppliedKeys.length || expectedKeys.some((key, index) => key !== suppliedKeys[index])) return null;
  const clean = {};
  for (const key of expectedKeys) {
    const value = properties[key];
    if (typeof value !== 'string' || !eventSchema[key].includes(value)) return null;
    clean[key] = value;
  }
  return Object.freeze(clean);
}

export function createAnalyticsTracker(send) {
  return (eventName, properties) => {
    const clean = validateAnalyticsEvent(eventName, properties);
    if (!clean || typeof send !== 'function') return false;
    send(eventName, clean);
    return true;
  };
}
