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
  assert.equal([...component.matchAll(/href="https:\/\/lens\.cloudandcapital\.com"/g)].length, 2);
  for (const text of [component, data, redirect]) {
    assert.doesNotMatch(text, /(?:chatgpt\.site|vercel\.app)/);
  }
  assert.match(component, /href="https:\/\/github\.com\/cloudandcapital\/ai-cost-lens" target="_blank"/);
  const tool = data.match(/\{\s*slug: 'ai-cost-lens',[\s\S]*?\}/)?.[0];
  assert.ok(tool, 'AI Cost Lens tool entry exists');
  assert.match(tool, /href: 'https:\/\/lens\.cloudandcapital\.com'/);
  assert.match(tool, /external:\s*true/);
  assert.match(redirect, /return Astro\.redirect\('https:\/\/lens\.cloudandcapital\.com', 302\);/);
});
