import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { ANALYTICS_SCHEMA, createAnalyticsTracker, validateAnalyticsEvent } from '../src/lib/analytics.js';

const root = new URL('../', import.meta.url);
const source = (path) => readFile(new URL(path, root), 'utf8');

test('analytics accepts only the documented event and exact property schema', () => {
  assert.deepEqual(validateAnalyticsEvent('cta_click', { destination: 'work', source: 'homepage_hero' }), { destination: 'work', source: 'homepage_hero' });
  assert.deepEqual(validateAnalyticsEvent('tool_complete', { tool: 'signal_audit', result: 'completed' }), { result: 'completed', tool: 'signal_audit' });
  assert.equal(validateAnalyticsEvent('page_view', {}), null);
  assert.equal(validateAnalyticsEvent('cta_click', { destination: 'work' }), null);
  assert.equal(validateAnalyticsEvent('cta_click', { destination: 'work', source: 'homepage_hero', href: '/work' }), null);
  assert.equal(validateAnalyticsEvent('tool_start', { tool: 'unknown', entry: 'audit_setup' }), null);
});

test('free-form and sensitive values are rejected without calling the sender', () => {
  const sent = [];
  const track = createAnalyticsTracker((...args) => sent.push(args));
  const sensitiveValues = [
    'diana@example.com', 'https://example.com/private', 'Acme Corp', '$500K',
    'Our contract renews in 60 days', 'Generated decision brief', 'questionnaire answer',
  ];
  for (const value of sensitiveValues) {
    assert.equal(track('cta_click', { destination: value, source: 'homepage_hero' }), false);
  }
  assert.equal(track('tool_start', { tool: 'signal_audit', entry: 'audit_setup' }), true);
  assert.equal(sent.length, 1);
  assert.deepEqual(sent[0], ['tool_start', { entry: 'audit_setup', tool: 'signal_audit' }]);
});

test('the shared loader disables advertising signals and layouts contain no duplicate GA loader', async () => {
  const [analytics, base, site] = await Promise.all([
    source('src/components/Analytics.astro'), source('src/layouts/BaseLayout.astro'), source('src/layouts/SiteLayout.astro'),
  ]);
  assert.match(analytics, /allow_google_signals:\s*false/);
  assert.match(analytics, /allow_ad_personalization_signals:\s*false/);
  assert.match(base, /<Analytics\s*\/>/);
  assert.match(site, /<Analytics\s*\/>/);
  assert.doesNotMatch(base, /googletagmanager|gtag\('config'/);
  assert.doesNotMatch(site, /googletagmanager|gtag\('config'/);
});

test('all static CTA metadata is complete and accepted by the allowlist', async () => {
  const files = ['src/pages/index.astro', 'src/pages/work.astro', 'src/pages/writing.astro', 'src/components/SignalAuditResults.astro'];
  let count = 0;
  for (const file of files) {
    const text = await source(file);
    for (const tag of text.matchAll(/<a\b[^>]*data-analytics-event="cta_click"[^>]*>/g)) {
      count += 1;
      const destination = tag[0].match(/data-analytics-destination="([^"]+)"/)?.[1];
      const sourceValue = tag[0].match(/data-analytics-source="([^"]+)"/)?.[1];
      assert.ok(validateAnalyticsEvent('cta_click', { destination, source: sourceValue }), `${file}: ${tag[0]}`);
    }
  }
  assert.ok(count >= 20, `expected broad CTA coverage, found ${count}`);
});

test('tool wiring covers lifecycle events and reset is session-gated and clears state', async () => {
  const [audit, lab] = await Promise.all([source('src/pages/signal-audit.astro'), source('src/pages/interactive-lab.astro')]);
  for (const action of ['copy', 'print', 'retake']) assert.match(audit, new RegExp(`action: ["']${action}["']`));
  assert.match(audit, /tool_start/);
  assert.match(audit, /tool_complete/);
  for (const stage of ['questions', 'brief']) {
    assert.match(lab, new RegExp(`stage: '${stage}', result: 'success'`));
    assert.match(lab, new RegExp(`stage: '${stage}', result: 'failure'`));
  }
  for (const action of ['copy', 'print', 'edit', 'reset']) assert.match(lab, new RegExp(`action: '${action}'`));
  assert.match(lab, /if \(toolSessionStarted\) window\.ccTrack\?\.\('tool_output_action', \{ tool: 'interactive_lab', action: 'reset' \}\);\s*toolSessionStarted = false;\s*toolCompletionTracked = false;/);
  for (const scenario of ANALYTICS_SCHEMA.starter_scenario_selected.scenario) assert.match(lab, new RegExp(`data-analytics-scenario="${scenario}"`));
});
