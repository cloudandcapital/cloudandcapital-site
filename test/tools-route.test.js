import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { directoryGroups } from '../src/data/toolDirectory.ts';
import { tools, openSourceTools } from '../src/data/siteContent.ts';
import { validateAnalyticsEvent } from '../src/lib/analytics.js';

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
  const entries = directoryGroups.flatMap(group => group.tools);
  assert.equal(entries.length, 7);
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
  assert.match(page, /openSourceTools\.map/);
  assert.match(page, /href=\{project\.href\}/);
  assert.ok(openSourceTools.some(project => project.title === 'AI Cost Lens' && project.href === tools.find(tool => tool.slug === 'ai-cost-lens').sourceHref));
});
