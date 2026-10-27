const schema = Object.freeze({
  cta_click: Object.freeze({
    destination: Object.freeze(['work', 'services', 'learn', 'signal_audit', 'market_tape', 'cloud_cost_guard', 'ai_cost_lens', 'ai_cost_lens_github', 'github_pipeline', 'writing', 'substack', 'contact', 'software_renewal_tracker', 'instagram']),
    source: Object.freeze(['homepage_hero', 'homepage_path_personal', 'homepage_path_business', 'homepage_path_team', 'homepage_path_workflow', 'homepage_path_setup', 'homepage_examples', 'homepage_featured_tools', 'homepage_work', 'homepage_writing', 'homepage_instagram', 'homepage_contact', 'work_flagship', 'work_decision_tools', 'work_market_context', 'work_pipeline', 'work_contact', 'writing_newsletter', 'writing_featured', 'writing_archive', 'writing_contact', 'signal_audit_results', 'software_renewal_resource']),
  }),
  tool_start: Object.freeze({
    tool: Object.freeze(['signal_audit']),
    entry: Object.freeze(['audit_setup', 'audit_example']),
  }),
  tool_complete: Object.freeze({
    tool: Object.freeze(['signal_audit']),
    result: Object.freeze(['completed']),
  }),
  tool_output_action: Object.freeze({
    tool: Object.freeze(['signal_audit']),
    action: Object.freeze(['copy', 'print', 'retake']),
  }),
});

export const ANALYTICS_SCHEMA = schema;

export function validateAnalyticsEvent(eventName, properties) {
  if (typeof eventName !== 'string' || !Object.hasOwn(schema, eventName)) return null;
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
