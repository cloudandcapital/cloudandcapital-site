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
  const [page, sitemap] = await Promise.all([source('src/pages/tools.astro'), source('src/pages/sitemap.xml.ts')]);
  const entries = directoryTools;
  assert.equal(entries.length, 5);
  assert.equal(new Set(entries.map(tool => tool.href)).size, entries.length);
  for (const tool of entries) {
    const registeredSlug = tool.slug === 'cloud-cost-guard' ? 'cloud-cost-guard-lumen' : tool.slug;
    const registered = tools.find(item => item.slug === registeredSlug);
    if (registered) assert.equal(tool.href, registered.href);
    if (tool.external) assert.match(tool.href, /^https:\/\//);
    else assert.match(tool.href, /^\/(?!\/)/);
    assert.ok(validateAnalyticsEvent('cta_click', { destination: tool.destination, source: tool.source }));
    assert.ok((await readFile(new URL(`public${tool.image}`, root))).length > 0);
    assert.match(tool.companion.href, /^\/insights\/[a-z-]+$/);
    assert.ok((await source(`src/pages${tool.companion.href}.astro`)).length > 0, `${tool.name} has a companion guide`);
    assert.ok(sitemap.includes(`'${tool.companion.href}'`), `${tool.name}'s guide is discoverable in the sitemap`);
  }
  const renewal = entries.filter(tool => tool.slug.includes('renewal'));
  assert.equal(renewal.length, 1, 'renewal is one card with a companion worksheet');
  assert.equal(renewal[0].companion.href, '/insights/using-the-renewal-tracker');
  assert.deepEqual(upcomingTools.map(tool => tool.slug), ['monthly-money-planner', 'business-cash-flow-planner', 'worth-it-calculator', 'personal-ai-helper']);
  assert.match(page, /href="https:\/\/github\.com\/cloudandcapital"/);
  assert.doesNotMatch(page, /openSourceTools\.map/);
  assert.ok(openSourceTools.some(project => project.title === 'AI Cost Lens' && project.href === tools.find(tool => tool.slug === 'ai-cost-lens').sourceHref));
});

test('topic filters keep available tools separate from collapsed future ideas', () => {
  const entries = [...directoryTools, ...upcomingTools];
  const filters = [{ id: 'all', label: 'View all', tone: 'all' }, ...toolTopics];
  const dom = new JSDOM(`<section data-tool-directory>
    <div data-tool-filters hidden>${filters.map(topic => `<button type="button" data-tool-filter="${topic.id}" data-tool-tone="${topic.tone}"><span>${topic.label}</span></button>`).join('')}</div>
    <p data-tool-status role="status"></p>
    <ul id="tool-gallery">${directoryTools.map(tool => `<li data-tool-item data-tool-id="${tool.slug}" data-tool-topics="${tool.topics.join(' ')}" ${tool.availability === 'review' ? 'data-tool-review' : ''}><article data-tone="${tool.tone}">${tool.name}</article></li>`).join('')}</ul>
    <details data-tool-upcoming-section><summary>In the works <span data-tool-upcoming-count></span></summary><ul id="upcoming-tools">${upcomingTools.map(tool => `<li data-tool-item data-tool-upcoming data-tool-id="${tool.slug}" data-tool-topics="${tool.topics.join(' ')}"><article data-tone="${tool.tone}">${tool.name}</article></li>`).join('')}</ul></details>
  </section>`);
  const root = dom.window.document.querySelector('section');
  const cards = [...root.querySelectorAll('[data-tool-item]')];
  const shown = () => cards.filter(card => !card.hidden).map(card => card.dataset.toolId);
  const status = root.querySelector('[data-tool-status]');
  const future = root.querySelector('[data-tool-upcoming-section]');
  const futureCount = root.querySelector('[data-tool-upcoming-count]');
  assert.ok(cards.every(card => !card.hidden), 'all entries remain available without JavaScript');
  assert.equal(new Set(entries.map(tool => tool.slug)).size, entries.length);
  initToolDirectory(root);
  initToolDirectory(root); // Reinitialization must not duplicate cards or listeners.
  assert.equal(root.querySelector('[data-tool-filters]').hidden, false);
  assert.equal(shown().length, entries.length);
  assert.equal(future.open, false, 'future ideas start collapsed, including without JavaScript');
  assert.equal(futureCount.textContent, '4 ideas');
  assert.equal(root.querySelector('#tool-gallery').children.length, directoryTools.length);
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
    const matchingIdeas = upcomingTools.filter(tool => tool.topics.includes(topic.id)).length;
    assert.equal(futureCount.textContent, `${matchingIdeas} ${matchingIdeas === 1 ? 'idea' : 'ideas'}`);
    assert.equal(future.open, false, 'selecting a topic does not expand future ideas');
    for (const card of cards.filter(card => !card.hidden)) {
      assert.equal(card.querySelector('article').dataset.filterTone, topic.tone);
    }
  }
  assert.deepEqual(shown(), ['ai-cost-lens', 'personal-ai-helper']);
  assert.equal(status.textContent, 'AI & automation: 1 tool to explore');
  assert.equal(futureCount.textContent, '1 idea');
  future.open = true;
  root.querySelector('[data-tool-filter="all"]').click();
  assert.equal(status.textContent, '5 tools to explore');
  assert.equal(future.open, true, 'a visitor who opened the ideas keeps their choice across matching filters');
  assert.equal(futureCount.textContent, '4 ideas');
  assert.equal(root.dataset.activeTopic, 'all');
  for (const card of cards) assert.equal(card.querySelector('article').dataset.filterTone, undefined);
  assert.equal(shown().length, entries.length);
  assert.equal(root.querySelectorAll('[data-tool-item]').length, entries.length);
  for (const card of cards.filter(card => card.hasAttribute('data-tool-upcoming'))) card.dataset.toolTopics = '';
  root.querySelector('[data-tool-filter="ai-automation"]').click();
  assert.equal(future.hidden, true, 'hide the disclosure when a topic has no future ideas');
  assert.equal(future.open, false);
  root.querySelector('[data-tool-filter="all"]').click();
  assert.equal(future.hidden, false);
  assert.equal(future.open, false, 'an empty result does not reopen the disclosure on return');
  dom.window.close();
});
