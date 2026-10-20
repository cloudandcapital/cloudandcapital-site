# Hero magnifier motion

Created October 19, 2026 with the built-in image-generation tool and the imagegen skill, using the approved hero as the edit reference. The original `public/images/cloud-capital-hero-diamond-v5.webp` is preserved and remains the complete reduced-motion image.

## Assets

- `public/images/cloud-capital-hero-base.webp` — 1402 × 1122 RGBA, 126,872 bytes. White cloud and black dollar sign with the magnifier removed.
- `public/images/cloud-capital-hero-magnifier.webp` — 1402 × 1122 RGBA, 187,664 bytes. The isolated rose-glass magnifier with its full diamond-covered handle and a translucent lens centre.

The generated layers retain the reference canvas. The foreground image is scaled to 80% around 46% 45% to match the approved magnifier size and position. Conversion to WebP preserves transparency. The source PNGs remain in the generation output folder.

## Motion and layout

Only the magnifier moves. The cloud and dollar remain fixed. CSS follows a small, closed, smooth 18-second path with at most 4.5% horizontal displacement, 1.25% vertical displacement, and 1.25 degrees of rotation. The existing hero artwork size, desktop scale, mobile layout, copy, buttons, and handwritten note remain unchanged.

An IntersectionObserver and page visibility check pause motion when the hero is off screen or the page is hidden. A labelled keyboard-accessible 32px pause/play control sits in the artwork's lower-right margin. It is outside the aria-hidden decorative illustration. Reduced-motion visitors see the approved complete original image and no motion control. Without JavaScript the layers stay still and the control remains hidden.

## Base layer prompt

```text
Use case: precise-object-edit. Prepare the BACKGROUND LAYER for a subtle animation of this exact existing Cloud & Capital hero. Remove ONLY the entire magnifying glass: its pink rim, clear lens, gold collar, diamond-covered handle and the magnifier's small ground shadow. Reconstruct the white cloud where it was occluded, matching its existing softly rounded lobes and lighting. Preserve the black dollar-sign sculpture, its exact size and placement, the white cloud's exact silhouette, placement and sculpted material, the cloud and dollar ground shadows, and all the existing transparent margins. Do not redesign or reposition the scene. Keep the same 5:4 canvas proportions and the cloud and dollar in exactly their source coordinates. Genuine transparent RGBA background, no solid backdrop, no extra objects, no text.
```

## Magnifier layer prompt

```text
Use case: precise-object-edit / background-extraction. Prepare the FOREGROUND LAYER for a subtle animation of this exact Cloud & Capital hero. Isolate ONLY the original magnifying glass, preserving its exact orientation, scale, shape, pink rose-glass rim, gold collar and handle completely covered in diamonds. Remove the entire cloud, dollar-sign sculpture and every ground shadow. The clear circular lens must have a genuinely transparent see-through centre, with only the subtle glass sheen and edge highlights remaining; no cloud fragments or baked-in white cloud may remain inside the lens. Preserve the magnifier's original position on the same 5:4 canvas with the original transparent margins; do not centre it, do not zoom, do not rotate or redesign it. Its lens centre should stay around 46% across and 46% down, handle pointing toward the bottom-right as in the reference. Complete jewel-covered handle must remain visible. Genuine transparent RGBA background. One magnifier only; no backdrop, plinth, letters or other objects.
```

