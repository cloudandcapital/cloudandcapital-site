import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { directoryTools, toolTopics, upcomingTools } from '../src/data/toolDirectory.ts';
import { tools, openSourceTools } from '../src/data/siteContent.ts';
import { validateAnalyticsEvent } from '../src/lib/analytics.js';
import { JSDOM } from 'jsdom';
import { initToolDirectory } from '../src/lib/tool-directory.js';

const root = new URL('../', import.meta.url);
const source = (path) => readFile(new URL(path, root), 'utf8');

test('Tools is canonical while Work remains a permanent compatibility redirect', async () => {
  const [page, redirect, sitemap, data, home, homepageTools] = await Promise.all([
    source('src/pages/tools.astro'),
    source('src/pages/work.astro'),
    source('src/pages/sitemap.xml.ts'),
    source('src/data/siteContent.ts'),
    source('src/pages/index.astro'),
    source('src/components/HomepageTools.astro'),
  ]);
  assert.match(redirect, /Astro\.redirect\('\/tools', 308\)/);
  assert.match(sitemap, /'\/tools'/);
  assert.doesNotMatch(sitemap, /'\/work'/);
  assert.match(data, /label: 'Tools', href: '\/tools'/);
  assert.match(home, /<HomepageTools\s*\/>/);
  assert.match(homepageTools, /href="\/tools"/);
  assert.match(page, /<DirectoryToolCard tool=\{tool\}/);
});

test('directory opens released tools, preserves source links and has real screenshot assets', async () => {
  const page = await source('src/pages/tools.astro');
  const entries = directoryTools;
  assert.equal(entries.length, 6);
  assert.equal(new Set(entries.map(tool => tool.href)).size, entries.length);
  for (const tool of entries) {
    const registeredSlug = tool.slug === 'cloud-cost-guard' ? 'cloud-cost-guard-lumen' : tool.slug;
    const registered = tools.find(item => item.slug === registeredSlug);
    if (registered) assert.equal(tool.href, registered.href);
    if (tool.external) assert.match(tool.href, /^https:\/\//);
    else assert.match(tool.href, /^\/(?!\/)/);
    assert.ok(validateAnalyticsEvent('cta_click', { destination: tool.destination, source: tool.source }));
    assert.ok((await readFile(new URL(`public${tool.image}`, root))).length > 0);
  }
  const renewal = entries.filter(tool => tool.slug.includes('renewal'));
  assert.equal(renewal.length, 1, 'renewal is one card with a companion worksheet');
  assert.equal(renewal[0].companion.href, '/insights/using-the-renewal-tracker');
  assert.deepEqual(upcomingTools.map(tool => tool.slug), ['monthly-money-planner', 'business-cash-flow-planner', 'worth-it-calculator', 'personal-ai-helper']);
  assert.match(page, /href="https:\/\/github\.com\/cloudandcapital"/);
  assert.doesNotMatch(page, /openSourceTools\.map/);
  assert.ok(openSourceTools.some(project => project.title === 'AI Cost Lens' && project.href === tools.find(tool => tool.slug === 'ai-cost-lens').sourceHref));
});

test('topic filters show each tool once, include upcoming work and restore View all', () => {
  const entries = [...directoryTools, ...upcomingTools];
  const filters = [{ id: 'all', label: 'View all', tone: 'all' }, ...toolTopics];
  const dom = new JSDOM(`<section data-tool-directory>
    <div data-tool-filters hidden>${filters.map(topic => `<button type="button" data-tool-filter="${topic.id}" data-tool-tone="${topic.tone}"><span>${topic.label}</span></button>`).join('')}</div>
    <p data-tool-status role="status"></p>
    <ul>${entries.map(tool => `<li data-tool-item data-tool-id="${tool.slug}" data-tool-topics="${tool.topics.join(' ')}" ${upcomingTools.includes(tool) ? 'data-tool-upcoming' : ''} ${tool.availability === 'review' ? 'data-tool-review' : ''}><article data-tone="${tool.tone}">${tool.name}</article></li>`).join('')}</ul>
  </section>`);
  const root = dom.window.document.querySelector('section');
  const cards = [...root.querySelectorAll('[data-tool-item]')];
  const shown = () => cards.filter(card => !card.hidden).map(card => card.dataset.toolId);
  const status = root.querySelector('[data-tool-status]');
  assert.ok(cards.every(card => !card.hidden), 'all entries remain available without JavaScript');
  assert.equal(new Set(entries.map(tool => tool.slug)).size, entries.length);
  initToolDirectory(root);
  initToolDirectory(root); // Reinitialization must not duplicate cards or listeners.
  assert.equal(root.querySelector('[data-tool-filters]').hidden, false);
  assert.equal(shown().length, entries.length);
  assert.equal(root.querySelector('[aria-pressed="true"]').dataset.toolFilter, 'all');
  for (const topic of toolTopics) {
    const button = root.querySelector(`[data-tool-filter="${topic.id}"]`);
    button.focus();
    button.click();
    assert.strictEqual(dom.window.document.activeElement, button, 'filtering keeps focus on the selected control');
    assert.deepEqual(shown(), entries.filter(tool => tool.topics.includes(topic.id)).map(tool => tool.slug));
    assert.equal(root.querySelectorAll('[aria-pressed="true"]').length, 1);
    assert.equal(button.getAttribute('aria-pressed'), 'true');
    assert.ok(status.textContent.startsWith(`${topic.label}: `));
    assert.equal(root.dataset.activeTopic, topic.id);
    for (const card of cards.filter(card => !card.hidden)) {
      assert.equal(card.querySelector('article').dataset.filterTone, topic.tone);
    }
  }
  assert.deepEqual(shown(), ['ai-cost-lens', 'interactive-lab', 'personal-ai-helper']);
  assert.equal(status.textContent, 'AI & automation: 1 tool to explore · 1 under review · 1 coming soon');
  root.querySelector('[data-tool-filter="all"]').click();
  assert.equal(status.textContent, '5 tools to explore · 1 under review · 4 coming soon');
  assert.equal(root.dataset.activeTopic, 'all');
  for (const card of cards) assert.equal(card.querySelector('article').dataset.filterTone, undefined);
  assert.equal(shown().length, entries.length);
  assert.equal(root.querySelectorAll('[data-tool-item]').length, entries.length);
  dom.window.close();
});
