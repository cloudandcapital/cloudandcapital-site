# 3D service illustrations

Created October 19, 2026 using the built-in image-generation tool with the approved hero as a style reference. These replace the service-card line drawings with a coordinated bill, clock, and three building blocks. The hero image and approved copy are unchanged.

## Project assets

All files are 512 × 512 RGBA WebP images, derived from the transparent 1254 × 1254 generated PNGs by proportional downscaling and format conversion. Original generated files are retained.

- `public/images/service-bill-3d.webp` — 26,832 bytes
- `public/images/service-clock-3d.webp` — 40,344 bytes
- `public/images/service-blocks-3d.webp` — 27,800 bytes

Source style reference: `public/images/cloud-capital-hero-diamond-v5.webp`.

## Integration

The three illustrations share pearly white surfaces, rose glass or clay-pink details, restrained sage accents, dark details where needed, and soft studio light. Display at full opacity with the generated transparency; no CSS tint, extra rotation, or artificial shadow is applied. The bill is slightly smaller to balance its taller silhouette. All three remain decorative with empty alt text, explicit dimensions, lazy loading, and async decoding. Desktop and mobile headline spacing leaves a clear illustration area above the questions.

## Final prompts

### bill

```text
Use case: stylized-concept.
Asset type: one transparent 3D website service-card illustration for Cloud & Capital, displayed small beside a headline.
Reference image: use the attached homepage hero ONLY as a style, lighting, material, and palette reference. Create a NEW isolated subject; do not reproduce the cloud, dollar sculpture, magnifying glass, or diamond handle from the reference.
Style: premium softly sculpted 3D product render. Elegant and slightly playful, rounded tactile forms, soft pearly white porcelain, restrained muted clay pink (#B78384) and pale sage accents, tiny charcoal details where needed. Match the hero's soft white sculpted surfaces and rose glass. Real volume and material depth, no outline/vector styling.
Composition: one compact centered object on a square canvas, slightly elevated three-quarter front view, front easy to recognize. Object including its soft local shadow occupies about 76% of canvas height and fits completely inside frame with generous transparent margin. No text outside the object, no logo, no labels, no other props, no backdrop or plinth.
Lighting: soft studio light from upper left, gentle ambient occlusion and soft short contact shadow. Keep shadow translucent. Actual transparent RGBA background. The object must read clearly against pale pink, sage, or warm cream website cards. No gold, diamonds, glitter, sparkles, busy details, or bright saturated colors.
Subject: a single broad upright bill/invoice rendered as a gently thick pearly-white sculpted paper card with softly rounded corners and a folded top-right corner. The fold underside has a muted clay-pink tint. On the face, one small stylish charcoal dollar symbol and three short recessed gray lines suggest a bill. No words or readable numbers. Keep it broad and simple rather than a long narrow receipt; a small perspective tilt gives it tangible depth.
```

### clock

```text
Use case: stylized-concept.
Asset type: one transparent 3D website service-card illustration for Cloud & Capital, displayed small beside a headline.
Reference image: use the attached homepage hero ONLY as a style, lighting, material, and palette reference. Create a NEW isolated subject; do not reproduce the cloud, dollar sculpture, magnifying glass, or diamond handle from the reference.
Style: premium softly sculpted 3D product render. Elegant and slightly playful, rounded tactile forms, soft pearly white porcelain, restrained muted clay pink (#B78384) and pale sage accents, tiny charcoal details where needed. Match the hero's soft white sculpted surfaces and rose glass. Real volume and material depth, no outline/vector styling.
Composition: one compact centered object on a square canvas, slightly elevated three-quarter front view, front easy to recognize. Object including its soft local shadow occupies about 76% of canvas height and fits completely inside frame with generous transparent margin. No text outside the object, no logo, no labels, no other props, no backdrop or plinth.
Lighting: soft studio light from upper left, gentle ambient occlusion and soft short contact shadow. Keep shadow translucent. Actual transparent RGBA background. The object must read clearly against pale pink, sage, or warm cream website cards. No gold, diamonds, glitter, sparkles, busy details, or bright saturated colors.
Subject: a single simple round desk-clock disc, standing slightly tilted in three-quarter view without legs or bells. Pearly-white softly rounded body and face, a restrained muted clay-pink rose-glass bezel, two slender charcoal hands around 10:10, and only four subtle pale sage tick marks. No numerals or text. Keep the form compact, smooth, and substantial, with visible side thickness.
```

### blocks

```text
Use case: stylized-concept.
Asset type: one transparent 3D website service-card illustration for Cloud & Capital, displayed small beside a headline.
Reference image: use the attached homepage hero ONLY as a style, lighting, material, and palette reference. Create a NEW isolated subject; do not reproduce the cloud, dollar sculpture, magnifying glass, or diamond handle from the reference.
Style: premium softly sculpted 3D product render. Elegant and slightly playful, rounded tactile forms, soft pearly white porcelain, restrained muted clay pink (#B78384) and pale sage accents, tiny charcoal details where needed. Match the hero's soft white sculpted surfaces and rose glass. Real volume and material depth, no outline/vector styling.
Composition: one compact centered object on a square canvas, slightly elevated three-quarter front view, front easy to recognize. Object including its soft local shadow occupies about 76% of canvas height and fits completely inside frame with generous transparent margin. No text outside the object, no logo, no labels, no other props, no backdrop or plinth.
Lighting: soft studio light from upper left, gentle ambient occlusion and soft short contact shadow. Keep shadow translucent. Actual transparent RGBA background. The object must read clearly against pale pink, sage, or warm cream website cards. No gold, diamonds, glitter, sparkles, busy details, or bright saturated colors.
Subject: a compact stack of exactly three gently rounded building cubes, one above and behind two lower cubes, as a single sculptural group. Two cubes are pearly warm-white porcelain and the third is muted clay-pink translucent glass. Very subtle pale sage reflections tie the group together. Clearly visible top and side faces with soft contact shadows between the blocks. No letters, symbols, or numbers.
```
