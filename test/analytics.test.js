import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import { directoryTools } from '../src/data/toolDirectory.ts';

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
  const files = ['src/pages/index.astro', 'src/pages/tools.astro', 'src/pages/writing.astro', 'src/components/SignalAuditResults.astro', 'src/components/HomepageTools.astro', 'src/components/InstagramSection.astro', 'src/components/HomepageWriting.astro', 'src/components/DirectoryToolCard.astro', 'src/pages/insights/index.astro', 'src/pages/insights/using-the-renewal-tracker.astro'];
  let count = 0;
  for (const file of files) {
    const text = await source(file);
    for (const tag of text.matchAll(/<a\b[^>]*data-analytics-event="cta_click"[^>]*>/g)) {
      count += 1;
      const destination = tag[0].match(/data-analytics-destination="([^"]+)"/)?.[1];
      const sourceValue = tag[0].match(/data-analytics-source="([^"]+)"/)?.[1];
      if (tag[0].includes('data-analytics-destination={choice.destination}')) {
        for (const rowDestination of ['ai_cost_lens', 'cloud_cost_guard', 'software_renewal_tracker']) {
          assert.ok(validateAnalyticsEvent('cta_click', { destination: rowDestination, source: sourceValue }), `${file}: ${rowDestination}`);
        }
        continue;
      }
      if (tag[0].includes('data-analytics-destination={item.destination}')) {
        for (const rowDestination of ['cloud_cost_guard', 'market_tape', 'signal_audit', 'interactive_lab']) {
          assert.ok(validateAnalyticsEvent('cta_click', { destination: rowDestination, source: sourceValue }), `${file}: ${rowDestination}`);
        }
        continue;
      }
      if (tag[0].includes('data-analytics-destination={tool.destination}')) {
        for (const tool of directoryTools) assert.ok(validateAnalyticsEvent('cta_click', { destination: tool.destination, source: tool.source }));
        continue;
      }
      assert.ok(validateAnalyticsEvent('cta_click', { destination, source: sourceValue }), `${file}: ${tag[0]}`);
    }
  }
  assert.ok(count >= 20, `expected broad CTA coverage, found ${count}`);
});

test('tool wiring covers lifecycle events and reset is session-gated and clears state', async () => {
  const [audit, lab] = await Promise.all([source('src/lib/signal-audit-ui.js'), source('src/pages/interactive-lab.astro')]);
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


test('homepage path destinations describe their actual links', async () => {
  const homepage = await source('src/pages/index.astro');
  for (const [pathSource, destination, href] of [
    ['homepage_path_business', 'services', '/services#technology-cost-review'],
    ['homepage_path_workflow', 'services', '/services#workflow-review'],
    ['homepage_path_setup', 'services', '/services#custom-tools'],
  ]) {
    const tag = [...homepage.matchAll(/<a\b[^>]*>/g)]
      .find(([tag]) => tag.includes(`data-analytics-source="${pathSource}"`))?.[0];
    assert.ok(tag, `missing ${pathSource}`);
    assert.equal(tag.match(/href="([^"]+)"/)?.[1], href);
    assert.equal(tag.match(/data-analytics-destination="([^"]+)"/)?.[1], destination);
    assert.ok(validateAnalyticsEvent('cta_click', { destination, source: pathSource }));
  }
});


test('the actual Google wrapper queues Arguments objects and preserves every command value', async () => {
  const component = await source('src/components/Analytics.astro');
  const wrapper = component.match(/window\.gtag = window\.gtag \|\| function \([^)]*\) \{[^}]*\};/)?.[0];
  assert.ok(wrapper, 'expected the existing regular-function wrapper');
  const window = { dataLayer: [] };
  runInNewContext(wrapper, { window });
  const timestamp = new Date('2026-10-12T19:00:00Z');
  const privacy = { allow_google_signals: false, allow_ad_personalization_signals: false };
  const properties = { destination: 'learn', source: 'homepage_path_personal' };
  const commands = [
    ['js', timestamp],
    ['config', 'G-GXRMNTEB3B', privacy],
    ['event', 'cta_click', properties],
  ];
  for (const command of commands) window.gtag(...command);
  assert.equal(window.dataLayer.length, commands.length);
  window.dataLayer.forEach((queued, index) => {
    assert.equal(Array.isArray(queued), false, `${commands[index][0]} must not queue an Array`);
    assert.equal(Object.prototype.toString.call(queued), '[object Arguments]');
    assert.deepEqual(Array.from(queued), commands[index]);
    commands[index].forEach((value, argumentIndex) => assert.strictEqual(queued[argumentIndex], value));
  });
});

