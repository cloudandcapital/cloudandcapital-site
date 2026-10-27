// Check rendered metadata after npm run build. This does not inspect Google's index.
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { JSDOM } from 'jsdom';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { default: entry } = await import(pathToFileURL(path.join(root, '.vercel/output/functions/_render.func/dist/server/entry.mjs')));
const origin = 'https://cloudandcapital.com';
const logo = `${origin}/images/brand/cloud-and-capital-mark.png`;
const guideImages = {
  '/insights/using-ai-cost-lens': '/images/ai-cost-lens-usable-result-preview.jpg',
  '/insights/using-cloud-cost-guard': '/images/cloud-cost-guard-billing-review.png',
  '/insights/using-market-tape': '/images/market-tape-equity-review.jpg',
  '/insights/using-signal-audit': '/images/signal-audit-result-review.jpg',
  '/insights/using-the-renewal-tracker': '/images/software-renewal-project-desk.jpg',
};
const failures = [];
const pages = [];
const normalize = value => value.replace(/\s+/g, ' ').trim();
const sitemapResponse = await entry.fetch(new Request(`${origin}/sitemap.xml`));
assert.equal(sitemapResponse.status, 200);
const sitemap = new JSDOM(await sitemapResponse.text(), { contentType: 'application/xml' });
const urls = [...sitemap.window.document.querySelectorAll('loc')].map(node => node.textContent);
assert.equal(urls.length, new Set(urls).size, 'Duplicate sitemap URLs');
for (const url of urls) {
  let dom;
  try {
    const response = await entry.fetch(new Request(url));
    assert.equal(response.status, 200, 'Sitemap route is not 200');
    dom = new JSDOM(await response.text(), { url });
    const doc = dom.window.document;
    const meta = selector => doc.querySelector(selector)?.content;
    assert.equal(doc.querySelector('link[rel="canonical"]')?.href, url, 'Wrong canonical');
    assert.doesNotMatch(meta('meta[name="robots"]') || '', /noindex/i);
    assert.ok(doc.title && meta('meta[name="description"]'), 'Missing title/description');
    assert.equal(meta('meta[property="og:title"]'), doc.title);
    assert.equal(meta('meta[name="twitter:title"]'), doc.title);
    assert.equal(meta('meta[property="og:description"]'), meta('meta[name="description"]'));
    const graphs = [...doc.querySelectorAll('script[type="application/ld+json"]')].map(node => JSON.parse(node.textContent));
    const entities = graphs.flatMap(graph => graph['@graph'] || [graph]);
    const org = entities.find(entity => entity['@type'] === 'Organization');
    assert.equal(org?.logo?.contentUrl, logo, 'Official organization logo missing');
    assert.equal(org.logo.width, 500);
    assert.equal(org.logo.height, 500);
    const image = meta('meta[property="og:image"]');
    assert.equal(meta('meta[name="twitter:image"]'), image, 'Sharing image differs by network');
    const imageUrl = new URL(image);
    assert.equal(imageUrl.origin, origin);
    await access(path.join(root, 'dist/client', imageUrl.pathname));
    const pathname = new URL(url).pathname;
    const expectedImage = guideImages[pathname];
    const article = entities.find(entity => ['Article', 'BlogPosting'].includes(entity['@type']));
    if (expectedImage) {
      assert.ok(article, 'Guide Article entity missing');
      assert.equal(article.image, `${origin}${expectedImage}`);
      assert.equal(image, article.image, 'Guide sharing image is not its real screenshot');
      assert.ok([...doc.querySelectorAll('article img')].some(img => img.src === image), 'Metadata image is not visible in the guide');
      const crumbs = entities.find(entity => entity['@type'] === 'BreadcrumbList')?.itemListElement;
      assert.equal(crumbs?.length, 3, 'Guide breadcrumb trail incomplete');
      assert.deepEqual(crumbs.map(item => item.position), [1, 2, 3]);
      assert.deepEqual(crumbs.map(item => item.item), [`${origin}/`, `${origin}/insights`, url]);
      assert.equal(article.author?.['@id'], `${origin}/#diana`);
      assert.equal(article.publisher?.['@id'], `${origin}/#organization`);
      assert.equal(normalize(article.headline), normalize(doc.querySelector('h1')?.textContent || ''));
      if (pathname.endsWith('/using-the-renewal-tracker')) {
        assert.ok(!article.datePublished && !article.dateModified, 'Do not invent a tracker publication date');
      }
    } else {
      assert.equal(image, `${origin}/images/og-image.png`, 'Default brand sharing image changed');
    }
    pages.push({ url, status: response.status, image, article: Boolean(article), guide: Boolean(expectedImage) });
  } catch (error) { failures.push({ url, message: error.message }); }
  finally { dom?.window.close(); }
}
sitemap.window.close();
const robots = await readFile(path.join(root, 'public/robots.txt'), 'utf8');
assert.match(robots, /Sitemap: https:\/\/cloudandcapital\.com\/sitemap\.xml/);
assert.match(robots, /Allow: \//);
await access(path.join(root, 'dist/client/images/brand/cloud-and-capital-mark.png'));
const queryUrl = `${origin}/insights/using-ai-cost-lens?utm_source=metadata-check`;
const queryPage = new JSDOM(await (await entry.fetch(new Request(queryUrl))).text());
assert.equal(queryPage.window.document.querySelector('link[rel="canonical"]')?.href, `${origin}/insights/using-ai-cost-lens`);
queryPage.window.close();
console.log(JSON.stringify({ scope: 'Rendered first-party search/sharing metadata, not Google indexing or rich-result certification', pagesChecked: urls.length, guidesChecked: pages.filter(page => page.guide).length, articlePages: pages.filter(page => page.article).length, pages, failures }, null, 2));
if (failures.length) process.exitCode = 1;
