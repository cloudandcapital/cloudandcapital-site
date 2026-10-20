# Homepage writing: compact editorial layout

The approved heading, three article titles, descriptions, dates, destinations, cream and sage palette, staggered Built / Locked in / Default typography, and fine linework remain.

## Layout

- The Decision Layer is a full-width landscape feature with copy on the left and typographic artwork on the right. It occupies its own grid row rather than spanning the combined height of two other articles.
- The two Markets & Mimosas articles sit in equal columns below, divided by a fine newspaper rule. Rows use their natural content height; no fixed card height or automatic bottom alignment separates a description from its Read link.
- The featured text has more horizontal space. Artwork terms use normal grid flow with small staggered indents, giving the illustration its own intrinsic height rather than positioning it inside a stretched empty canvas.
- Above 760px, the feature uses the same equal columns as the two articles below. The entire artwork shifts left by 11.6% of its own width, matching the left SVG rule's x=58 position in its 500-unit viewBox. This puts the graphic rule on the article divider at every two-column width while keeping its words and linework together. Mobile alignment remains centered with no horizontal shift.
- On screens at or below 760px, articles stack in reading order. The featured artwork follows its copy, with responsive type sizes and no fixed-height wrapper.
- Every Read link uses the existing ActionLabel component, preserving the shared type, underline, 50px touch target, close arrow, and 1.25rem arrow size.
- The two bottom buttons are replaced by one left-aligned Subscribe on Substack link, matching the Instagram follow link below. The label is 14px with a 28px icon slot; the shared underline, 50px touch target, and 1.25rem arrow remain. It leads to the publication's /subscribe route. The orange Substack mark is a local SVG from Simple Icons (CC0), displayed at 18px inside the slot to match the visible size of the previous padded PNG and the Instagram glyph. This removes the failed external image request observed during production QA. Asset source: https://github.com/simple-icons/simple-icons/blob/develop/icons/substack.svg. There is no added form, tracking script, or embed.

## Implementation and scope

Writing markup and styles live in `src/components/HomepageWriting.astro`. The homepage imports this component; obsolete writing styles are removed from `src/pages/index.astro` to prevent conflicting layout overrides. Other sections, shared ActionLabel styles, article data, and existing analytics attributes are preserved.

## Verification

Validation uses the Astro production build, whitespace checks, server-rendered content and links, and compiled responsive CSS. Production browser QA also checks the actual page inside responsive iframes at 320, 375, 390, 414, 768 and 1024px. All six checked widths have no clipped text or horizontal page overflow. Mobile menu open, Escape, focus return, close-on-link and contact-anchor landing are verified. The local Browser connector remains unavailable; these observations use the supported cloud browser.
