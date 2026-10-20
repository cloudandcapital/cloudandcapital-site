# Hero magnifier motion

Created October 19, 2026 with the built-in image-generation tool and the imagegen skill, using the approved hero as the edit reference. The original `public/images/cloud-capital-hero-diamond-v5.webp` is preserved. The dusty rose revision below is now the complete reduced-motion image.

## Assets

- `public/images/cloud-capital-hero-base.webp` — 1402 × 1122 RGBA, 126,872 bytes. White cloud and black dollar sign with the magnifier removed.
- `public/images/cloud-capital-hero-magnifier.webp` — 1402 × 1122 RGBA, 187,664 bytes. The isolated rose-glass magnifier with its full diamond-covered handle and a translucent lens centre.

The generated layers retain the reference canvas. The foreground image is scaled to 80% around 46% 45% to match the approved magnifier size and position. Conversion to WebP preserves transparency. The source PNGs remain in the generation output folder.

## Motion and layout

Only the magnifier moves. The cloud and dollar remain fixed. CSS follows a small, closed, smooth 20-second path with at most 8% horizontal displacement, 1.75% vertical displacement, and 1.75 degrees of rotation. The existing hero artwork size, desktop scale, mobile layout, copy, buttons, and handwritten note remain unchanged.

An IntersectionObserver and page visibility check pause motion when the hero is off screen or the page is hidden. A labelled keyboard-accessible 32px pause/play control sits in the artwork's lower-right margin. It is outside the aria-hidden decorative illustration. Reduced-motion visitors see the complete dusty rose image and no motion control. Without JavaScript the layers stay still and the control remains hidden.

## Dusty rose rim revision

October 19, 2026: Diana requested a softer lens rim to fit the dusty rose buttons and closing section. Built-in image-generation edit mode changed the coral rim to muted clay pink, anchored in `#C8A5A5`. Both generated images retain the 1402 × 1122 RGBA canvas, transparent background, lens placement, gold collar, and diamond-covered handle. The foreground retains the existing scale and animation path. The static reduced-motion artwork receives the same color change. Original assets are retained.

- `public/images/cloud-capital-hero-magnifier-dusty-rose.webp` — 178,800 bytes; animated foreground.
- `public/images/cloud-capital-hero-dusty-rose.webp` — 180,630 bytes; complete static scene.

The generated PNGs were converted to WebP at quality 93 with alpha preserved, without resizing or cropping.

### Foreground edit prompt

```text
Use case: precise-object-edit. Asset type: transparent magnifier foreground layer for an existing website animation. This image is the EDIT TARGET. Make one restrained color correction ONLY: change the bright coral/red-pink circular rim around the lens to a muted dusty rose / clay pink, anchored in #C8A5A5, with soft darker rose shadows and pale glossy highlights. Preserve its polished translucent 3D glass material; reduce the saturated red/coral cast. Keep the entire magnifier exactly the same shape, orientation, size and source coordinates on this same 5:4 canvas. Preserve all diamond pavé covering the handle, its white crystal sparkle, gold collar, clear lens reflections and transparent see-through lens centre, all transparent margins and existing lighting. No repositioning, crop, zoom, added objects or lettering. Genuine transparent RGBA background. Keep all original details unchanged except the rim color.
```

### Static scene edit prompt

```text
Use case: precise-object-edit. Asset type: complete static reduced-motion website hero. This image is the EDIT TARGET. Make one restrained color correction ONLY: change the bright coral/red-pink circular rim around the magnifying glass lens to muted dusty rose / clay pink anchored in #C8A5A5, with soft darker rose shadows and pale glossy highlights. Keep its polished translucent glass material, but remove the saturated red/coral cast. Preserve the exact composition and all source coordinates on this same 5:4 canvas: same white cloud, same black dollar-sign sculpture, same lens and reflections, same gold collar and diamond-covered handle, same ground shadows and transparent margins. Do not change the cloud, dollar sign, handle, scale, orientation, framing or lighting. No added objects, lettering, crop or redesign. Genuine transparent RGBA background. Change ONLY the lens rim color.
```

## Base layer prompt

```text
Use case: precise-object-edit. Prepare the BACKGROUND LAYER for a subtle animation of this exact existing Cloud & Capital hero. Remove ONLY the entire magnifying glass: its pink rim, clear lens, gold collar, diamond-covered handle and the magnifier's small ground shadow. Reconstruct the white cloud where it was occluded, matching its existing softly rounded lobes and lighting. Preserve the black dollar-sign sculpture, its exact size and placement, the white cloud's exact silhouette, placement and sculpted material, the cloud and dollar ground shadows, and all the existing transparent margins. Do not redesign or reposition the scene. Keep the same 5:4 canvas proportions and the cloud and dollar in exactly their source coordinates. Genuine transparent RGBA background, no solid backdrop, no extra objects, no text.
```

## Magnifier layer prompt

```text
Use case: precise-object-edit / background-extraction. Prepare the FOREGROUND LAYER for a subtle animation of this exact Cloud & Capital hero. Isolate ONLY the original magnifying glass, preserving its exact orientation, scale, shape, pink rose-glass rim, gold collar and handle completely covered in diamonds. Remove the entire cloud, dollar-sign sculpture and every ground shadow. The clear circular lens must have a genuinely transparent see-through centre, with only the subtle glass sheen and edge highlights remaining; no cloud fragments or baked-in white cloud may remain inside the lens. Preserve the magnifier's original position on the same 5:4 canvas with the original transparent margins; do not centre it, do not zoom, do not rotate or redesign it. Its lens centre should stay around 46% across and 46% down, handle pointing toward the bottom-right as in the reference. Complete jewel-covered handle must remain visible. Genuine transparent RGBA background. One magnifier only; no backdrop, plinth, letters or other objects.
```

