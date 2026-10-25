# Search and sharing metadata, October24

Diana put the designer passes on hold until tomorrow, October25, and asked to continue other useful website work. This release changes head metadata and the existing audit plan. Page text, layouts, screenshots, homepage sections and tool calculations are preserved.

## Changes

- The Organization entity identifies the supplied official square logo, with its existing public URL and real 500 × 500 dimensions.
- All six tool walkthroughs have a complete Home → Guides & writing → guide breadcrumb trail. Four guide route names were missing from the existing metadata map.
- Signal Audit, Interactive Lab and the Software Renewal Tracker walkthroughs now have Article entities using the visible title, author and existing screenshot. The first two use their visible publication dates. The tracker has no published date on the page, so none is invented.
- Open Graph and Twitter images reuse an article's declared image instead of always falling back to the generic site image. All six tool guides now use an existing screenshot actually visible in that guide. Explicit HeadMeta image overrides retain priority. Other pages keep the existing default image.
- scripts/verify-search-metadata.mjs checks actual built SSR documents, the sitemap, guide images, author/publisher references, breadcrumb positions, canonical URLs, query-string handling and local assets.

## Verification

All 138 existing site tests pass with no failures or skips. The optimized build passes. The rendered metadata check covers all seventeen sitemap pages, all six guides and seven article pages with no failures. The existing navigation/basic metadata check also passes all seventeen pages and the unknown-route 404 check. The companion JSON records the per-page outputs. No dependency, existing assertion, threshold or skip was changed.

The guide titles, descriptions and visible bodies are preserved. No redesigned card, new screenshot, tracking event, account connection, scheduled job or tool feature is included. The approved logo originals are referenced without alteration.

## Search Console limit

GSC Wizard refused its initial property-list call because this account has no active subscription or trial. No further GSC calls, quota consumption, subscription, sitemap submission or indexing-tracker change followed. This pass therefore does not report indexed-page counts, crawl dates, search traffic or Google's selected canonicals. It validates the site's supplied markup, not Google's index, a Rich Results Test verdict, ranking improvement or another platform's cached link preview.

## Sources

Checked Google's current primary documentation:

- [Organization markup](https://developers.google.com/search/docs/appearance/structured-data/organization): logo URL and image guidelines.
- [Breadcrumb markup](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb): ordered navigation trail.
- [Article markup](https://developers.google.com/search/docs/appearance/structured-data/article): representative images and applicable factual metadata. Publication dates are not manufactured to fill optional fields.

The manual Lens review and existing provider-file, print, device and accessibility acceptance remain separate. Designer implementation and Diana's visual sign-off resume tomorrow; this technical release does not close them.
