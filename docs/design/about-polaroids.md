# About section: Diana’s photo wall

## Current design

The deep sage About section gives Diana’s circular portrait priority above two smaller staggered cream Polaroids. The portrait stays at 72% of the gallery width; the Polaroids are 42% instead of 52%, approximately 19% smaller, so the supporting photos read as personal details. Myszka sits midway down the left side; South Bay sits lower on the right. Three small pink pavé magnets overlap their upper edges: the existing heart at the portrait’s upper left, enlarged from 24% to 29% of the portrait width and turned left (-18 degrees), a star slightly right of center on Myszka, and a round button slightly left of center on South Bay. Short contact shadows and slight photo tilts suggest pictures held against a wall. The gallery is static and its height contracts to fit the smaller supporting frames.

The only handwritten photo captions are “Myszka” and “South Bay”, set in locally bundled Caveat 400 with font synthesis disabled. There are no caption subtitles or location line. The section eyebrow is “About”, with the same 2.7rem line, .75rem gap, and .42 line opacity as the other section labels, followed by “Hi, I’m Diana.” The personal paragraph retains Diana’s Polish immigrant family roots, South Bay, teenage son, and dog; the ocean sentence is removed.

The existing credentials and PointFive contribution remain. The AI row reads “AI — Claude Code, OpenAI Codex”. There is no separate tools line. The services and free-tools/newsletter sentences are separate biography paragraphs for easier reading, preserving every word. The event heading is “Hosting FinOps Weekly LA”.

## Real photos and provenance

The portrait, Myszka photo, beach photo, and flyer are real photographs/artwork. Only the decorative magnets are generated. Original uploads are unchanged.

- `public/images/diana-molski-portrait.png`: the existing circular portrait. Native CSS clips the image to a circle with a slight 1.012 scale to hide the pale rectangular corners; there is no rectangular frame.
- `public/images/myszka-about.webp`: Diana’s `20260907_072203.jpg`. The over-the-shoulder expression remains readable at small sizes. CSS crop: `object-position: 50% 42%`.
- `public/images/south-bay-about.webp`: Diana’s `20260812_125908.jpg`, looking along the South Bay coast toward the Palos Verdes headland. CSS crop: `object-position: 50% 35%`.
- The other five uploaded photographs were reviewed alongside these. Frames at 0.5, 2.5, and 5.5 seconds from `20260519_185508.mp4`, at 1, 4.5, and 9 seconds from `20260519_183827.mp4`, and at 1, 4, and 8 seconds from `20260519_184407.mp4` were compared. The original Esplanade photograph was selected for its clarity and recognizable coastal setting.
- Myszka and South Bay receive a browser-only warm treatment, guided by the portrait and Diana’s October 19 screenshots. Myszka’s background uses sepia .42 and a 12% golden yellow (#f2dca5) multiply layer; the lower sepia reduces yellow at the feathered fur edges. South Bay retains the approved sepia .42 and 8% golden multiply layer. Both retain saturation 1.08, contrast 1.02, and brightness 1.01. The aim is consistent creamy highlights and contrast while retaining the coast’s natural blues. Multiply layers are isolated inside the photo windows. Reference analysis sampled the portrait backdrop around RGB 189/177/151 and 212/200/174; its blue/green ratio is approximately .85–.87. Source photographs, cream Polaroid borders, magnets, and layout remain unchanged.
- `public/images/event-poster-vol01.png`: the event flyer is a static, non-clickable image, straight and aligned with the text. Its width remains 9.9rem maximum (158.4px at the default font size). There is no enlargement action or textual flyer link. Event: April 9, 2026, Hawthorne. Copy credits FinOps Weekly, SmartClouds, and speakers from Ulta Beauty and Wiv.ai. Source: https://luma.com/2w1hyz2q.
- Photo labels use `@fontsource/caveat` 5.3.0, Latin weight 400, bundled locally.

## Myszka’s natural fur color

The room retains a warm sepia treatment. An additional decorative rendering of the same original `myszka-about.webp` restores the natural photograph at full opacity over her head and body. The two radial masks are fully opaque through 80% of their radius before feathering at the edges, making the original tan fur clearer than the initial 78%-opacity blend. Both image layers share the same object-fit and 50% / 42% object-position, so their pixels align at every frame size. The natural-color layer sits above the warm multiply layer, with no filter of its own. Its blank alt text and aria-hidden flag prevent a duplicate image announcement. South Bay, the portrait, the photo framing, and all other styling are unchanged.

A built-in image generation background-extraction study was inspected, using `public/images/myszka-about.webp` as the edit reference and a transparent background. The resulting source `generated_images/exec-dc3036bf-4bc5-4432-9a81-2a7e6909f504.png` was not adopted: it did not preserve registration precisely enough. The website displays only the original photograph. The final native CSS mask is in `/workspace/scratch/80688df69d25/cloudandcapital-site/src/components/HomepageAbout.astro`.

Study prompt:

Use case: background-extraction. Input image: the real photograph of Myszka, a small tan curly-haired dog sitting on a bed. Create a precise transparent-background cutout of ONLY the dog, including her entire visible ears, wispy head fur, muzzle, chest, body, paws, and tail. CRITICAL: preserve the exact original FULL PORTRAIT CANVAS and original placement, scale, proportions, pose, face, eyes, nose, fur, and outline. Keep the same 901:1600 canvas aspect ratio, with the dog occupying exactly the same location as in the input; retain transparent space above and below where the room and bed were. Do not center, enlarge, move, crop-to-subject, or recompose the dog. Remove the room, window, plant, wall and bedding to genuine transparency. Keep delicate wispy fur edges with soft realistic alpha coverage. No added elements, no cast shadows, no outline, no frame. This will be used ONLY as a registered alpha mask over the unchanged original photograph, so exact pixel alignment and full-canvas layout matter more than any beautification. No color or lighting changes to the dog.

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

The section retains `#about` and its labeled heading, semantic photo figures/captions, six biography paragraphs, professional credential definitions, and the keyboard-visible contribution link. Personal photos have descriptive alt text; all three magnets are decorative and hidden from accessibility APIs. The event has dated context and its static flyer has descriptive alt text. Photo and magnet dimensions are supplied. There is no automatic animation or hover movement in this gallery.
