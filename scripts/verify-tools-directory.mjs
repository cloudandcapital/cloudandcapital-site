// Run after npm run build. Exercise this build's rendered HTML, script and CSS.
// JSDOM verifies behavior and CSS rules; it does not certify browser layout.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import entry from '../.vercel/output/functions/_render.func/dist/server/entry.mjs';
import { directoryTools, toolTopics, upcomingTools } from '../src/data/toolDirectory.ts';

const response = await entry.fetch(new Request('https://cloudandcapital.com/tools'));
assert.equal(response.status, 200);
const dom = new JSDOM(await response.text(), {
  runScripts: 'outside-only', url: 'https://cloudandcapital.com/tools',
});
const { document } = dom.window;
for (const link of document.querySelectorAll('link[rel="stylesheet"]')) {
  const href = link.getAttribute('href');
  if (href?.startsWith('/_astro/')) {
    const style = document.createElement('style');
    style.textContent = await readFile(new URL(`../dist/client${href}`, import.meta.url), 'utf8');
    document.head.append(style);
  }
}
const cards = [...document.querySelectorAll('[data-tool-item]')];
assert.equal(cards.length, directoryTools.length + upcomingTools.length);
assert.ok(cards.every(card => dom.window.getComputedStyle(card).display !== 'none'));
assert.ok(document.querySelector('[data-tool-filters]').hidden);
const script = [...document.scripts].find(item => item.textContent.includes('directoryReady'));
assert.ok(script, 'the rendered page includes its filtering script');
// Execute only this trusted, locally built script; do not load analytics or URLs.
dom.window.eval(script.textContent);
assert.equal(document.querySelector('[data-tool-filters]').hidden, false);
assert.equal(dom.window.getComputedStyle(document.querySelector('[data-tool-filters]')).justifyContent, 'center');

const tones = {
  sage: { preview: '#e4e9df', body: '#f0f3ec' },
  sand: { preview: 'var(--cream)', body: 'var(--cream)' },
  rose: { preview: '#eddbd6', body: '#f6eae7' },
};
const allEntries = [...directoryTools, ...upcomingTools];
assert.equal(dom.window.getComputedStyle(document.documentElement).getPropertyValue('--cream').trim().toLowerCase(), '#f5eee9');
const visible = () => cards.filter(card => dom.window.getComputedStyle(card).display !== 'none');
for (const topic of toolTopics) {
  const button = document.querySelector(`[data-tool-filter="${topic.id}"]`);
  button.focus();
  button.click();
  assert.equal(button.getAttribute('aria-pressed'), 'true');
  assert.strictEqual(document.activeElement, button);
  assert.deepEqual(visible().map(card => card.dataset.toolId), allEntries.filter(tool => tool.topics.includes(topic.id)).map(tool => tool.slug));
  for (const card of visible()) {
    const article = card.querySelector('[data-tone]');
    const css = dom.window.getComputedStyle(article);
    const upcoming = card.hasAttribute('data-tool-upcoming');
    assert.equal(article.dataset.filterTone, topic.tone);
    assert.equal(css.getPropertyValue(upcoming ? '--upcoming-surface' : '--preview-tint').trim(), tones[topic.tone].preview);
    assert.equal(css.getPropertyValue(upcoming ? '--upcoming-body' : '--card-surface').trim(), tones[topic.tone].body);
  }
  console.log(`${topic.label}: ${visible().length} matching cards, ${topic.tone} palette`);
}
document.querySelector('[data-tool-filter="all"]').click();
assert.equal(visible().length, cards.length);
assert.equal(document.querySelectorAll('[data-filter-tone]').length, 0);
assert.equal(document.querySelector('[data-tool-status]').textContent, '5 tools to explore · 1 under review · 4 coming soon');
for (const action of document.querySelectorAll('.card-action, .card-resource')) {
  const css = dom.window.getComputedStyle(action);
  assert.equal(css.alignSelf, 'center');
  assert.equal(css.justifyContent, 'center');
}
assert.equal(document.querySelectorAll('a a').length, 0);
for (const preview of document.querySelectorAll('.card-preview')) {
  assert.match(dom.window.getComputedStyle(preview).aspectRatio, /^1\.85(?:\s*\/\s*1)?$/);
}
for (const image of document.querySelectorAll('.preview-window img')) {
  assert.equal(dom.window.getComputedStyle(image).objectFit, 'contain');
}
console.log('PASS: built HTML, script, hidden-card CSS, category palettes, View all, centered actions and preview rules. Browser visual acceptance remains separate.');
dom.window.close();
// The Vercel SSR runtime holds background handles; this standalone check is done.
process.exit(0);
