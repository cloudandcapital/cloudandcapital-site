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

Guides & Writing keeps all seven cards, their existing text, real screenshots and destinations. Its introduction is editorial, with clear shortcuts to walkthroughs and essays. Screenshot figures are larger, framed and shadowed; card headings echo the italic tool titles on the homepage. Article templates are not restyled by this index-only treatment.

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
