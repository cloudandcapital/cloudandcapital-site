# Tools folder artwork

Created October 19, 2026 with the built-in image-generation tool using the imagegen skill.

Project asset: `public/images/tools-folder-3d.webp`, 512 × 512 RGBA. The transparent generated PNG was proportionally resized and converted to WebP; its composition and transparency are preserved. The original PNG remains in the generation output folder.

The folder sits in normal document flow directly above the homepage Browse all free tools button, centred, with a responsive 120–144px display width. The art is decorative: an aria-hidden container, no pointer events, explicit intrinsic dimensions, and a static image fallback with empty alt text, lazy loading, and async decoding. Its ivory, sage, and rose-glass surfaces echo the existing service illustrations.

## Final generation prompt

```text
Use case: stylized-concept.
Asset type: a single transparent decorative 3D image for Cloud & Capital's website, displayed underneath a clay-pink Browse all free tools button.
Subject: one small open file folder holding exactly three rounded cards, fanned gently above the open top. Folder is sculpted warm pearly ivory, front panel low enough that the cards are visible. Cards are muted sage green, warm white and translucent smoky clay-pink rose glass. The cards may have one or two simple recessed charcoal lines and a little rounded block suggesting useful digital tools, but no words, letters, numbers, logos or readable text.
Style: elegant tactile 3D product render, softly rounded edges, pearly porcelain-like finish, restrained rose-glass accent, realistic material depth and subtle reflections. Boutique editorial website, smart and gently playful, like a beautiful little desk object. Not an office stock icon, not a flat vector icon, not a cartoon face. Keep the silhouette simple and recognizable at about 140px display width.
Composition: one compact centered object, slightly elevated three-quarter front view, the folder front almost facing the camera. Very mild jaunty tilt. Object occupies about 78% of a square canvas, entirely visible with transparent margins. No additional objects outside the folder, no floating sparkles, no background, no backdrop, no plinth, no platform.
Palette: warm white #F7F2EB, sage #789382, muted clay pink #B78384 and restrained charcoal details. No bright colours or gold.
Lighting: soft studio light from upper left, gentle ambient occlusion and a short soft translucent local shadow. Genuine transparent RGBA background. It must blend beautifully onto a warm cream page.
```


## Card shuffle

The motion uses a generated transparent 2 × 2 sprite atlas in `public/images/tools-folder-layers.webp` (1024 × 1024 RGBA WebP), with the foreground folder and three cards as separate layers. The original complete artwork remains the static reduced-motion fallback. The atlas was prepared with the built-in image-generation tool; CSS places its four cells without changing the original still asset.

The folder body stays still. The cards lift 6.4–8.8px one at a time, with small rotations. The existing homepage reveal observer starts one 4.65-second sequence when the CTA enters view. Hovering or keyboard-focusing the tools button replays the sequence while that interaction lasts. CSS enables movement only for `prefers-reduced-motion: no-preference`. The initial animation finishes within five seconds; no autoplay loop runs while a visitor is simply reading. No new JavaScript, dependencies, or layout movement is introduced.

The sentence about market research and worksheets was removed. The catalogue links to Market Tape and one renewal worksheet PDF; the button alone gives a clear invitation without suggesting a larger library.

## Sprite preparation prompt

```text
Use case: precise-object-edit / animation sprite preparation.
Edit the supplied Cloud & Capital folder artwork into a transparent 2-by-2 SPRITE ATLAS for a CSS animation. Preserve the same ivory porcelain, muted sage and translucent clay-pink glass, same rounded shapes, studio lighting and exact three-quarter perspective. No new decorative elements and no text.
The output is ONE square image divided into FOUR EQUAL SQUARE CELLS, with no visible grid lines or labels. Every cell represents the SAME square composition canvas. The object pieces must preserve their original positions and scale within their own cell, so stacking all four cells at the same origin reassembles the supplied artwork.
TOP LEFT CELL: the cream folder body ONLY, with all three cards removed. Include its front lip, curved front panel, left side and base. The open space above the curved front lip is fully transparent. This is the foreground overlay layer, so do not add an opaque rear wall behind the cards.
TOP RIGHT CELL: the sage green card ONLY in its original upper-left/back position and angle, floating on transparency. Complete its originally occluded lower edge as a plain rounded rectangle, but keep the original shape, material, tiny recessed square and two charcoal rules.
BOTTOM LEFT CELL: the ivory card ONLY in its original middle position and angle, floating on transparency. Complete its lower edge as a rounded rectangle; preserve its inset square and rules.
BOTTOM RIGHT CELL: the rose-glass clay pink card ONLY in its original right/front position and angle, floating on transparency. Complete its lower edge as a rounded rectangle; preserve its inset square and rules.
Each isolated card should extend behind where the cream foreground folder lip will be when the cells are stacked; do not crop cards off at the lip. Keep ALL four objects entirely within their own cells with transparent edge margins. Use genuine RGBA transparency across all empty regions. No backdrop, shadow rectangle, labels, grid, button, or website mockup. No repeated assembled folder in any cell. This is four separate pieces of ONE existing illustration for independent vertical card movement.
```

