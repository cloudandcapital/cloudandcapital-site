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


test('homepage rotates newest reads and retires older articles to the archive', async () => {
  const { homepageWriting, writing, writingFeatured, marketsMimosasLatest,
    marketsMimosasOctober11, marketsMimosasSeptember27, featuredWriting, selectHomepageWriting } =
    await import('../src/data/siteContent.ts');
  assert.deepEqual(homepageWriting.map(article => article.href),
    [writingFeatured.href, marketsMimosasLatest.href, marketsMimosasOctober11.href]);
  assert.ok(writing.includes(featuredWriting));
  const nextArticle = { ...marketsMimosasLatest, title: 'Next published read',
    href: 'https://cloudandcapital.substack.com/p/next-read', date: 'October 31, 2026' };
  const nextHomepage = selectHomepageWriting([...writing, nextArticle]);
  assert.deepEqual(nextHomepage.map(article => article.href),
    [writingFeatured.href, nextArticle.href, marketsMimosasLatest.href]);
  assert.ok(writing.includes(marketsMimosasSeptember27));
});
