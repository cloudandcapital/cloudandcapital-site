import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import { startRenewalDemo } from '../src/lib/renewal-demo.js';
import { examplesFor } from '../src/lib/renewal-tracker.js';

const source = await readFile(new URL('../src/components/RenewalDemo.astro', import.meta.url), 'utf8');
const markup = source.replace(/^---[\s\S]*?---\s*/, '').replace(/<script>[\s\S]*?<\/script>\s*$/, '');
function setup(reduced = false) {
  const dom = new JSDOM(markup, { url: 'https://prototype.invalid' });
  let listener;
  const preference = { matches: reduced, addEventListener(type, next) { if (type === 'change') listener = next; } };
  dom.window.matchMedia = () => preference;
  const root = dom.window.document.querySelector('[data-renewal-demo]');
  return { dom, root, preference, changePreference(value) { preference.matches = value; listener(); } };
}

test('demo dates follow the real example across month changes without storing subscriptions', () => {
  const { dom, root } = setup();
  dom.window.localStorage.setItem('existing-data', 'keep');
  const expected = examplesFor('2027-12-12')[0];
  startRenewalDemo(root, new Date(2027, 11, 12));
  assert.equal(root.querySelector('[data-demo-vendor]').textContent, expected.vendor);
  assert.equal(root.querySelector('[data-demo-notice]').dateTime, '2028-01-04');
  assert.equal(root.querySelector('[data-demo-renewal]').dateTime, '2028-01-05');
  assert.equal(root.querySelector('[data-demo-month]').textContent, 'Jan');
  assert.equal(root.querySelector('[data-demo-day]').textContent, '4');
  assert.equal(dom.window.localStorage.length, 1);
  assert.equal(dom.window.localStorage.getItem('existing-data'), 'keep');
  assert.equal(root.querySelectorAll('button').length, 1);
  dom.window.close();
});

test('demo can be paused and stays static when reduced motion is requested', () => {
  const { dom, root, changePreference } = setup();
  startRenewalDemo(root);
  const toggle = root.querySelector('[data-demo-toggle]');
  assert.equal(root.dataset.demoPlaying, 'true'); assert.equal(toggle.getAttribute('aria-label'), 'Pause animation');
  assert.equal(root.querySelector('[data-demo-pause]').hasAttribute('hidden'), false); assert.equal(root.querySelector('[data-demo-play]').hasAttribute('hidden'), true);
  toggle.click(); assert.equal(root.dataset.demoPlaying, 'false'); assert.equal(toggle.getAttribute('aria-label'), 'Play animation');
  assert.equal(root.querySelector('[data-demo-pause]').hasAttribute('hidden'), true); assert.equal(root.querySelector('[data-demo-play]').hasAttribute('hidden'), false);
  startRenewalDemo(root); toggle.click(); assert.equal(root.dataset.demoPlaying, 'true');
  changePreference(true); assert.equal(root.dataset.demoPlaying, 'false'); assert.equal(toggle.hidden, true);
  changePreference(false); assert.equal(root.dataset.demoPlaying, 'true'); assert.equal(toggle.hidden, false);
  dom.window.close();
  const reduced = setup(true); startRenewalDemo(reduced.root);
  assert.equal(reduced.root.dataset.demoPlaying, 'false'); assert.equal(reduced.root.querySelector('[data-demo-toggle]').hidden, true);
  assert.equal(reduced.root.querySelectorAll('.rt-demo-step').length, 3);
  reduced.dom.window.close();
});
