import test from 'node:test';
import assert from 'node:assert/strict';
import { isAnalyticsHost, validateAnalyticsEvent, createAnalyticsTracker } from '../src/lib/analytics.js';
import { resourceLinks, resourceHelpLinks } from '../src/data/resourceLinks.js';

test('local development and nonproduction hosts cannot enable analytics', () => {
  for (const hostname of ['localhost', '127.0.0.1', 'preview.vercel.app', 'cloudandcapital.com.evil.example', 'lens.cloudandcapital.com', '']) {
    assert.equal(isAnalyticsHost(hostname, true), false, hostname);
  }
  for (const hostname of ['cloudandcapital.com', 'www.cloudandcapital.com']) {
    assert.equal(isAnalyticsHost(hostname, false), false);
    assert.equal(isAnalyticsHost(hostname, undefined), false);
    assert.equal(isAnalyticsHost(hostname, true), true);
  }
});

test('resource entrances all have a permitted matching measurement destination', () => {
  const links = [...resourceLinks, ...resourceHelpLinks];
  assert.equal(new Set(links.map(link => link.href)).size, links.length);
  for (const link of links) {
    assert.ok(validateAnalyticsEvent('cta_click', { destination: link.destination, source: 'resource_links' }), link.title);
    assert.ok(link.href.startsWith('/') || link.href === 'https://cloudandcapital.substack.com');
  }
});

test('inquiry measurement accepts only fixed actions, never form values or sent status', () => {
  const sent = [];
  const track = createAnalyticsTracker((...args) => sent.push(args));
  assert.equal(track('inquiry_action', { kind: 'learning', action: 'open_email_draft' }), true);
  assert.equal(track('inquiry_action', { kind: 'business', action: 'copy_email_text' }), true);
  assert.equal(track('inquiry_action', { kind: 'learning', action: 'sent' }), false);
  assert.equal(track('inquiry_action', { kind: 'business', action: 'open_email_draft', email: 'private@example.com' }), false);
  assert.equal(track('inquiry_action', { kind: 'private@example.com', action: 'open_email_draft' }), false);
  assert.equal(sent.length, 2);
});
