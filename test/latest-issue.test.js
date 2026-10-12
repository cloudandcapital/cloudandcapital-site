import test from 'node:test';
import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';

const root = new URL('../', import.meta.url);

test('latest issue advances to October 11 while retaining September 27 in the archive', async () => {
  const { marketsMimosasLatest, marketsMimosasSeptember27, writing, newsletter } =
    await import('../src/data/siteContent.ts');
  assert.equal(marketsMimosasLatest.title, 'The AI Memory Boom Reached the Raspberry Pi');
  assert.equal(marketsMimosasLatest.date, 'October 11, 2026');
  assert.equal(marketsMimosasLatest.href, 'https://cloudandcapital.substack.com/p/the-ai-memory-boom-is-making-fortunes');
  assert.equal(newsletter.latestIssueHref, marketsMimosasLatest.href);
  assert.equal(marketsMimosasSeptember27.date, 'September 27, 2026');
  assert.equal(marketsMimosasSeptember27.href, 'https://cloudandcapital.substack.com/p/the-nasdaq-hit-a-record-your-account');
  assert.ok(writing.includes(marketsMimosasSeptember27));
  assert.ok(writing.includes(marketsMimosasLatest));
  await access(new URL(`public${marketsMimosasLatest.image}`, root));
});


test('homepage rotates newest reads and retires older articles to the archive', async () => {
  const { homepageWriting, writing, writingFeatured, marketsMimosasLatest,
    marketsMimosasSeptember27, featuredWriting, selectHomepageWriting } =
    await import('../src/data/siteContent.ts');
  assert.deepEqual(homepageWriting.map(article => article.href),
    [writingFeatured.href, marketsMimosasLatest.href, marketsMimosasSeptember27.href]);
  assert.ok(writing.includes(featuredWriting));
  const nextArticle = { ...marketsMimosasLatest, title: 'Next published read',
    href: 'https://cloudandcapital.substack.com/p/next-read', date: 'October 18, 2026' };
  const nextHomepage = selectHomepageWriting([...writing, nextArticle]);
  assert.deepEqual(nextHomepage.map(article => article.href),
    [writingFeatured.href, nextArticle.href, marketsMimosasLatest.href]);
  assert.ok(writing.includes(marketsMimosasSeptember27));
});
