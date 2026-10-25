# Cloud & Capital supporting-page visual direction

Diana's approved homepage is the reference. On October24 she clarified that Services, Guides & Writing and Learning need a designer pass, and so do the tools. The interfaces should feel like one site. Technical checks and visual approval are distinct.

## Shared choices

- Use the existing global brand tokens: cream #F5EEE9, sage #3D6055, dusty rose #C8A5A5, clay ink #785752 and charcoal #24211E. Beige page surfaces use the cream token.
- Use Cormorant Garamond for expressive headings, Jost for readable explanations and DM Mono for action labels. Italics can add presence without adding another typeface. Avoid stranded words and forced fixed-width lines on phones.
- Reuse ActionLabel for close arrows with one shared arrow size. Filled actions have rounded eight-pixel corners and clear contrast. Native input labels and disclosure controls remain visible and usable.
- Use rounded twenty-pixel panels, quiet borders and restrained shadows. Keep the page progression clear and the number of competing actions small.
- Graphic materials follow the homepage: soft, tactile 3D objects, muted accents and believable depth. Use actual released screenshots for tools. Decorative art must not pretend to be a real result or add a capability claim.
- Check the full desktop and narrow page, including open disclosures, forms, long results and footer. Keep reduced-motion behavior where motion exists. This release adds no animation.

## First three page treatments

Services keeps the three established offers and native scopes. Its sage opening is centered; the same bill, clock and building-block objects have more presence. Cards slightly overlap the end of the opening. The portrait, introduction and two existing image-only credentials form a compact row on desktop and stack naturally on phones.

Guides & Writing now groups the six actual tool walkthroughs together and pairs the existing software-spending article with its worksheet in a distinct Free resources section. Its introduction is editorial, with clear shortcuts to walkthroughs and essays. Screenshot figures are larger, framed and shadowed; card headings echo the italic tool titles on the homepage. Article templates are not restyled by this index-only treatment.

Learning uses the same heading font, action component, sage buttons, dusty rose contact area and rounded form panel. Its three topic descriptions and lesson inclusions remain unchanged. The old flat hero artwork is replaced by a decorative 3D study scene; the small topic illustrations are removed so the lesson choices read calmly.

Implementation is src/styles/supporting-pages.css, imported only by those three routes. Homepage files, global tokens, app calculations and inquiry generation logic are unchanged. Visual approval remains with Diana.

## Learning illustration provenance

Built-in image generation produced the new illustration. It contains no numbers, labels, live price data or product claims. The project asset is public/images/learning-study-3d-v1.webp, 1536 × 1024, 137,928 bytes, with transparency preserved. The generated PNG is retained separately; only format encoding was used for the web asset. The rendered cream-page placement was visually checked.

Prompt:

> Use case: stylized-concept. Asset type: transparent website illustration for Cloud & Capital's investing and trading learning page. Create ONE cohesive, premium soft 3D still life: an open ivory notebook with gently curved thick pages and a muted dusty rose cover in the foreground, a small upright white chart panel behind it showing a simple unlabeled sage-and-dusty-rose price line with a few understated candlestick forms, and a small glossy dusty rose ceramic coffee cup at the side. This is decorative educational artwork, not an exact data visualization; no numbers, letters, labels, UI controls, logos or claims. Match a calm feminine finance website with realistic sculptural white clouds and glossy sage/clay objects: elegant, tactile, grown-up, beautifully detailed, rounded edges, restrained shine, soft studio light from upper left, believable ambient occlusion and contact shadows, 30-degree three-quarter view. Palette strictly warm ivory #F5EEE9, muted sage #3D6055, dusty rose #C8A5A5, restrained charcoal accents. Transparent background with clean alpha and a very subtle floor shadow; every object fully inside frame, generous breathing room, compact balanced silhouette suitable beside a serif headline. Avoid bright pink, neon, gold, glitter, hearts, magnifying glasses, dollar signs, flat vector outlines, cartoon faces, clutter, fake screenshots or text. A polished 3D miniature study desk, welcoming and refined.

## Verification boundary

Real page frames in desktop Chrome were checked at 320, 390 and 768 CSS pixels for all three routes. Their usable widths were 305, 375 and 753 pixels because Chrome's classic scrollbar takes fifteen pixels. All nine page/width checks showed equal document and usable width, with no major card, heading or panel overflow. The main headings all resolved to Cormorant Garamond.

Both inquiry copy paths were exercised with invented inputs after the changes. The business and lesson subjects, recipient and distinct question labels remain correct. An open service scope stays within the phone layout. No email or booking was sent. Build/test and release evidence belong to the release PR; physical-device, other-browser and screen-reader acceptance remain separate.

All 138 existing site tests pass without failures or skips. The final optimized build and unchanged directory verification pass. Built SSR checks cover twenty routes, 331 internal link/anchor references and seventy local image references without failures. Twenty-eight external destinations are recorded, not certified. The temporary responsive wrapper is absent from source and final build. No test assertion, threshold, skip or dependency input was changed.

## Existing renewal resource

The October24 resource follow-through uses the same typography, close ActionLabel arrows, sage action, rounded panels, exact cream and restrained shadows. Its preview is the actual two-page worksheet, not a drawn product mockup. The older flat calendar is removed from this page. The fillable PDF uses Cormorant/Jost from the pinned font packages and standard Helvetica input fields. It distinguishes renewal, notice and payment dates. See docs/reviews/resource-journey-2026-10-24.md for checks and remaining reader/device limits. Diana’s visual approval remains separate.

## Official logo originals

Diana supplied the authoritative artwork on October24. Byte-identical masters are public/images/brand/cloud-and-capital-wordmark.png (1551 × 174) and public/images/brand/cloud-and-capital-mark.png (500 × 500). Use the appropriate readable version for new Cloud & Capital materials, preserving the artwork, colors, background and aspect ratio. Do not recreate these logos with AI or approximate their typography. The wide wordmark is used in both renewal worksheet page headers; its preview is rendered from that PDF. The square cloud/dollar mark is the compact alternate. The approved homepage is preserved.

| Original | SHA256 |
|---|---|
| cloud-and-capital-wordmark.png | 6448e9e5be7ca6a3d431a1fcffe96ea661ef80670f5569b9af69ade918ded299 |
| cloud-and-capital-mark.png | 8c57af24a285769e44e09b9b8fd377e77c01426532e1b567de8dbb57bd5d9c4f |

The persistent brand reference is CloudAndCapital-Brain-v2/brands/cloud-and-capital/design.md. Use Cloud & Capital in PDF credits, footers and author metadata, without a Diana Molski personal-name credit. Follow the same branding for previews and future brand deliverables.
