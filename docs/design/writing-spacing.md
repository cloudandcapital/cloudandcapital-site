# Homepage writing: compact editorial layout

The approved heading, three article titles, descriptions, dates, destinations, cream and sage palette, staggered Built / Locked in / Default typography, and fine linework remain.

## Layout

- The Decision Layer is a full-width landscape feature with copy on the left and typographic artwork on the right. It occupies its own grid row rather than spanning the combined height of two other articles.
- The two Markets & Mimosas articles sit in equal columns below, divided by a fine newspaper rule. Rows use their natural content height; no fixed card height or automatic bottom alignment separates a description from its Read link.
- The featured text has more horizontal space. Artwork terms use normal grid flow with small staggered indents, giving the illustration its own intrinsic height rather than positioning it inside a stretched empty canvas.
- Above 760px, the feature uses the same equal columns as the two articles below. The entire artwork shifts left by 11.6% of its own width, matching the left SVG rule's x=58 position in its 500-unit viewBox. This puts the graphic rule on the article divider at every two-column width while keeping its words and linework together. Mobile alignment remains centered with no horizontal shift.
- On screens at or below 760px, articles stack in reading order. The featured artwork follows its copy, with responsive type sizes and no fixed-height wrapper.
- Every Read link uses the existing ActionLabel component, preserving the shared type, underline, 50px touch target, close arrow, and 1.25rem arrow size.
- The two bottom buttons are replaced by one centered Subscribe on Substack link. The label is 14px with a 28px logo for slightly more presence; the shared underline, 50px touch target, and 1.25rem arrow remain. It leads to the publication's /subscribe route and includes an unaltered logo loaded from the download URL on Substack's official brand page: https://substack.com/brand (asset: https://substack.com/img/substack.png). There is no added form, tracking script, or embed.

## Implementation and scope

Writing markup and styles live in `src/components/HomepageWriting.astro`. The homepage imports this component; obsolete writing styles are removed from `src/pages/index.astro` to prevent conflicting layout overrides. Other sections, shared ActionLabel styles, article data, and existing analytics attributes are preserved.

## Verification

Validation uses the Astro production build, whitespace checks, server-rendered content and links, and compiled responsive CSS. The protected Vercel preview remains available for visual review. Browser visual QA is unavailable in this chat because the connected browser lacks its originating context; do not treat source or server-rendered checks as a browser review.
