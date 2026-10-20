# About section: Diana’s photo wall

## Current design

The deep sage About section holds Diana’s circular portrait above two staggered cream Polaroids. Myszka sits midway down the left side; South Bay sits lower on the right. Three small pink pavé magnets overlap their upper edges: the existing heart at the portrait’s upper left, a star slightly right of center on Myszka, and a round button slightly left of center on South Bay. Short contact shadows and slight photo tilts suggest pictures held against a wall. The gallery is static.

The only handwritten photo captions are “Myszka” and “South Bay”, set in locally bundled Caveat 400 with font synthesis disabled. There are no caption subtitles or location line. The section eyebrow is “About”, with the same 2.7rem line, .75rem gap, and .42 line opacity as the other section labels, followed by “Hi, I’m Diana.” The personal paragraph retains Diana’s Polish immigrant family roots, South Bay, teenage son, and dog; the ocean sentence is removed.

The existing credentials and PointFive contribution remain. The AI row reads “AI — Claude Code, OpenAI Codex”. There is no separate tools line.

## Real photos and provenance

The portrait, Myszka photo, beach photo, and flyer are real photographs/artwork. Only the decorative magnets are generated. Original uploads are unchanged.

- `public/images/diana-molski-portrait.png`: the existing circular portrait. Native CSS clips the image to a circle with a slight 1.012 scale to hide the pale rectangular corners; there is no rectangular frame.
- `public/images/myszka-about.webp`: Diana’s `20260907_072203.jpg`. The over-the-shoulder expression remains readable at small sizes. CSS crop: `object-position: 50% 42%`.
- `public/images/south-bay-about.webp`: Diana’s `20260812_125908.jpg`, looking along the South Bay coast toward the Palos Verdes headland. CSS crop: `object-position: 50% 35%`.
- The other five uploaded photographs were reviewed alongside these. Frames at 0.5, 2.5, and 5.5 seconds from `20260519_185508.mp4`, at 1, 4.5, and 9 seconds from `20260519_183827.mp4`, and at 1, 4, and 8 seconds from `20260519_184407.mp4` were compared. The original Esplanade photograph was selected for its clarity and recognizable coastal setting.
- A light browser-only tone treatment on Myszka and South Bay uses sepia(.12), saturate(.9), contrast(.98), and brightness(1.02), leaving the source files unchanged.
- `public/images/event-poster-vol01.png`: the full-resolution 1200px event flyer is straight and aligned with the text. Its width is reduced by 10% to a maximum of 9.9rem (158.4px at the default font size), and it links to the original. There is no extra textual flyer link. Event: April 9, 2026, Hawthorne. Copy credits FinOps Weekly, SmartClouds, and speakers from Ulta Beauty and Wiv.ai. Source: https://luma.com/2w1hyz2q.
- Photo labels use `@fontsource/caveat` 5.3.0, Latin weight 400, bundled locally.

## Generated magnets

Mode for all three: built-in image generation, new transparent assets, no image references. Originals are retained. Project copies are trimmed to alpha bounds as needed, resized, and WebP encoded with alpha preserved.

### Existing heart

Source: `generated_images/exec-a05c6223-0e58-4d17-a44d-0d60cf9f588e.png`.

Saved path: `/workspace/scratch/80688df69d25/cloudandcapital-site/public/images/pink-rhinestone-heart.webp` (512 × 468 RGBA).

Full prompt:

Use case: stylized-concept. Asset type: small decorative 3D jewel for Cloud & Capital's About section. Generate ONE elegant, softly rounded heart-shaped pink pavé jewel on a genuinely transparent background. The entire front surface is densely covered edge to edge in individually faceted tiny pale blush-pink and clear diamonds, set in delicate rose-gold prongs, with a softly domed three-dimensional shape and a narrow shiny rose-gold edge. It should feel like a beautiful little luxury handbag charm or rhinestone brooch, refined and playful. Nearly face-on with a very slight three-quarter turn so the thickness is visible; upright symmetrical heart, full object visible, centered and occupying about 78 percent of the canvas. Soft studio lighting from upper left, realistic crisp diamond facets with restrained bright glints, warm subtle reflections, gentle contact shadow only. Palette: dusty clay pink, pale rose, clear diamond, champagne rose gold. This must harmonize with a realistic white cloud and rose-glass magnifying glass whose whole handle is diamond encrusted. No chain, no ring, no pin, no loop, no extra objects, no text, no letters, no drawn stars, no scattered gems, no opaque backdrop, no cartoon outline.

### Star magnet

Source: `generated_images/exec-eea44cd2-54e8-4612-96b6-abd190f88ef9.png`.

Saved path: `/workspace/scratch/80688df69d25/cloudandcapital-site/public/images/pink-rhinestone-star-magnet.webp` (311 × 320 RGBA).

Full prompt:

Use case: product-mockup. Asset type: transparent decorative magnet for a personal website photo wall. Style: photorealistic small 3D jewelry object, nostalgic 1990s pink rhinestone accessory. Materials: rose gold metal setting with dense pale rose pink and clear round faceted crystals across the ENTIRE front, matching an existing pavé pink heart magnet. Lighting: soft upper-left studio light, crisp facets with restrained glints, realistic shallow thickness and a tiny visible polished rose gold rim. Composition: one object centered, near straight-on, very slightly turned to reveal depth; fill most of square with comfortable padding. Genuine transparent background. No wall, no photo, no hands, no text, no chain, no loop, no pin stem, no other objects, no sparkles outside the silhouette, no heavy cast shadow. Subject: a small five-pointed star magnet, softly rounded tips, wide enough arms for several rows of tiny stones; an understated cute star rather than an elongated cartoon sparkle.

### Round magnet

Source: `generated_images/exec-e98dde1f-ea11-4f41-95fd-8455cc16a0bb.png`.

Saved path: `/workspace/scratch/80688df69d25/cloudandcapital-site/public/images/pink-rhinestone-round-magnet.webp` (320 × 320 RGBA).

Full prompt:

Use case: product-mockup. Asset type: transparent decorative magnet for a personal website photo wall. Style: photorealistic small 3D jewelry object, nostalgic 1990s pink rhinestone accessory. Materials: rose gold metal setting with dense pale rose pink and clear round faceted crystals across the ENTIRE front, matching an existing pavé pink heart magnet. Lighting: soft upper-left studio light, crisp facets with restrained glints, realistic shallow thickness and a tiny visible polished rose gold rim. Composition: one object centered, near straight-on, very slightly turned to reveal depth; fill most of square with comfortable padding. Genuine transparent background. No wall, no photo, no hands, no text, no chain, no loop, no pin stem, no other objects, no sparkles outside the silhouette, no heavy cast shadow. Subject: a small circular domed button magnet, rose pink and clear pavé crystals, a round silhouette with a softly rounded edge, NOT a flower.

## Accessibility and motion

The section retains `#about` and its labeled heading, semantic photo figures/captions, five biography paragraphs, professional credential definitions, and the contribution link. Personal photos have descriptive alt text; all three magnets are decorative and hidden from accessibility APIs. The event has dated context and keyboard-visible links. Photo and magnet dimensions are supplied. There is no automatic animation or hover movement in this gallery.
