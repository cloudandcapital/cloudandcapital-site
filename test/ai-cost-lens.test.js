import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('AI Cost Lens uses the branded route and redirects to the hosted tool', async () => {
  const [component, data, redirect] = await Promise.all([
    source('src/components/AICostLensFeature.astro'),
    source('src/data/siteContent.ts'),
    source('src/pages/ai-cost-lens.astro'),
  ]);
  assert.equal([...component.matchAll(/href="\/ai-cost-lens"/g)].length, 2);
  assert.ok(!component.includes('https://ai-cost-lens-decision.polush.chatgpt.site'));
  assert.match(component, /href="https:\/\/github\.com\/cloudandcapital\/ai-cost-lens" target="_blank"/);
  const tool = data.match(/\{\s*slug: 'ai-cost-lens',[\s\S]*?\}/)?.[0];
  assert.ok(tool, 'AI Cost Lens tool entry exists');
  assert.match(tool, /href: '\/ai-cost-lens'/);
  assert.doesNotMatch(tool, /external:\s*true/);
  assert.match(redirect, /return Astro\.redirect\('https:\/\/ai-cost-lens-decision\.polush\.chatgpt\.site', 302\);/);
});
