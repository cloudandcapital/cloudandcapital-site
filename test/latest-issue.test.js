import test from 'node:test';
import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';

const root = new URL('../', import.meta.url);

test('latest issue advances to October 24 while retaining October 11 and September 27 in the archive', async () => {
  const { marketsMimosasLatest, marketsMimosasOctober11, marketsMimosasSeptember27, writing, newsletter } =
    await import('../src/data/siteContent.ts');
  assert.equal(marketsMimosasLatest.title, 'Oil Went Up. Gold Went Down. Everybody Got Nervous.');
  assert.equal(marketsMimosasLatest.date, 'October 24, 2026');
  assert.equal(marketsMimosasLatest.href, 'https://cloudandcapital.substack.com/p/oil-went-up-gold-went-down-everybody');
  assert.equal(marketsMimosasLatest.description, 'The market spent two weeks worrying about inflation, AI and where to hide.');
  assert.equal(newsletter.latestIssueHref, marketsMimosasLatest.href);
  assert.equal(marketsMimosasOctober11.date, 'October 11, 2026');
  assert.equal(marketsMimosasOctober11.href, 'https://cloudandcapital.substack.com/p/the-ai-memory-boom-is-making-fortunes');
  assert.ok(writing.includes(marketsMimosasOctober11));
  assert.equal(marketsMimosasSeptember27.date, 'September 27, 2026');
  assert.equal(marketsMimosasSeptember27.href, 'https://cloudandcapital.substack.com/p/the-nasdaq-hit-a-record-your-account');
  assert.ok(writing.includes(marketsMimosasSeptember27));
  assert.ok(writing.includes(marketsMimosasLatest));
  await access(new URL(`public${marketsMimosasLatest.image}`, root));
});


test('homepage curates technology, markets and personal writing while retaining the archive', async () => {
  const { homepageWriting, writing, writingFeatured, marketsMimosasLatest,
    marketsMimosasOctober11, marketsMimosasSeptember27, featuredWriting, personalWriting } =
    await import('../src/data/siteContent.ts');
  assert.deepEqual(homepageWriting.map(article => article.href),
    [writingFeatured.href, marketsMimosasLatest.href, personalWriting.href]);
  assert.deepEqual(homepageWriting.map(article => article.label),
    ['Technology & costs', 'Markets & Mimosas', 'Personal article']);
  assert.equal(personalWriting.href, 'https://cloudandcapital.substack.com/p/id-like-a-say-in-this-actually');
  assert.equal(personalWriting.date, undefined);
  for (const article of [featuredWriting, marketsMimosasOctober11, marketsMimosasSeptember27, personalWriting]) {
    assert.ok(writing.includes(article));
  }
  await access(new URL(`public${personalWriting.archiveImage}`, root));
});
