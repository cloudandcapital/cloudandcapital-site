import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const source = (path) => readFile(new URL(path, root), 'utf8');

test('Tools is canonical while Work remains a permanent compatibility redirect', async () => {
  const [page, redirect, sitemap, data, home] = await Promise.all([
    source('src/pages/tools.astro'),
    source('src/pages/work.astro'),
    source('src/pages/sitemap.xml.ts'),
    source('src/data/siteContent.ts'),
    source('src/pages/index.astro'),
  ]);
  assert.match(redirect, /Astro\.redirect\('\/tools', 308\)/);
  assert.match(sitemap, /'\/tools'/);
  assert.doesNotMatch(sitemap, /'\/work'/);
  assert.match(data, /label: 'Tools', href: '\/tools'/);
  assert.match(home, /class="path-card" href="\/tools"/);
  assert.match(page, /title="Tools \| Cloud & Capital"/);
  assert.match(page, /<h1 id="tools-title"><span>Start with the question\.<\/span><span>Follow the number\.<\/span><\/h1>/);
});

test('Tools keeps distinct lens destinations and semantic portfolio links', async () => {
  const page = await source('src/pages/tools.astro');
  assert.match(page, /class="lens-open" href=\{lens\.href\}/);
  assert.match(page, /class="lens-source" href=\{lens\.sourceHref\}/);
  assert.match(page, /class="product-feature guard-feature" href=\{guard\.href\}/);
  assert.match(page, /class="product-feature tape-feature" href=\{tape\.href\}/);
  assert.match(page, /class="supporting-tool" href=\{item\.tool\.href\}/);
  assert.match(page, /class="open-row" href=\{project\.href\}/);
  assert.match(page, /openSourceTools\.filter\(\(project\) => project\.title !== 'AI Cost Lens'\)/);
});
