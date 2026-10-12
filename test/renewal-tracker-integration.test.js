import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateAnalyticsEvent,createAnalyticsTracker} from '../src/lib/analytics.js';
const read = path => readFile(new URL('../'+path,import.meta.url),'utf8');
test('renewal resource reaches the review tracker through an allowed fixed CTA',async()=>{
 const resource=await read('src/pages/resources/software-renewal.astro');
 const tag=[...resource.matchAll(/<a\b[^>]*>/g)].find(([tag])=>tag.includes('href="/tools/software-renewal-tracker"'))?.[0];assert.ok(tag);
 const props={destination:tag.match(/data-analytics-destination="([^"]+)"/)[1],source:tag.match(/data-analytics-source="([^"]+)"/)[1]};
 assert.deepEqual(validateAnalyticsEvent('cta_click',props),props);
 const sent=[];const track=createAnalyticsTracker((...args)=>sent.push(args));assert.equal(track('cta_click',props),true);
 assert.equal(track('cta_click',{...props,vendor:'Private company',charge:'240',noticeDate:'2026-11-01'}),false);assert.equal(sent.length,1);
 assert.match(resource,/downloads\/before-you-renew-that-software\.pdf/);
});
test('tracker uses shared layout and exposes the released route for search indexing',async()=>{
 const [route,base,component,sitemap,analytics]=await Promise.all(['src/pages/tools/software-renewal-tracker.astro','src/layouts/BaseLayout.astro','src/components/RenewalTracker.astro','src/pages/sitemap.xml.ts','src/components/Analytics.astro'].map(read));
 assert.match(route,/<BaseLayout\b/);assert.doesNotMatch(route,/noindex=\{true\}/);assert.match(route,/<RenewalTracker\s*\/>/);assert.match(base,/<Analytics\s*\/>/);
 assert.doesNotMatch(component,/googletagmanager|window\.gtag|fetch\(/);assert.match(sitemap,/'\/tools\/software-renewal-tracker'/);
 assert.match(analytics,/window\.dataLayer\.push\(arguments\)/);assert.match(analytics,/G-GXRMNTEB3B/);
});
