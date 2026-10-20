# Homepage Instagram strip

The approved clay background, editorial headline, description, six selected post covers, original post destinations, and analytics remain. This is a presentation change to the existing selected posts, not an automatic Instagram feed connection.

## Layout and motion

- Remove the Post / Carousel / Reel badges.
- Use a common image height of `clamp(14.5rem, 18vw, 17rem)` with each image's natural width. Frames add only a thin cream edge and rounded corners, eliminating the empty side panels around narrow Reels. All six local image dimensions match their metadata.
- On fine-pointer devices without reduced-motion preferences, the strip moves continuously to the left over 76 seconds. Two equal runs create a seamless loop. The mirrored run is hidden from assistive technology and its links are excluded from the tab order; pointer users can still open a mirrored post.
- Hovering pauses the motion. Keyboard focus in the post viewport returns it to a stationary, scrollable original run, keeping all six original post links reachable. A labeled 44px pause/play button provides a persistent pause independent of hover.
- Motion pauses when the section is outside the viewport or the document is hidden. Reduced-motion and touch/coarse-pointer users get a stationary, horizontally scrollable run. Without JavaScript the same stationary strip remains usable and the motion control stays hidden.
- The small pause control sits at the right of the footer. The follow link stays on the left.

## Social links

Instagram and Substack use the same 14px ActionLabel text, 28px icon slot, .8rem icon gap, shared 50px target, underline, close arrow, and 1.25rem arrow size. Both links align to the shared 78rem site shell's left edge. The Instagram glyph is 16px centered in its 28px slot, matching the visible Substack mark inside its padded PNG without shifting the link labels. The Instagram logo reuses the Simple Icons path already used by the site's footer; no new image asset or external Instagram embed is added.

## Verification

Check the Astro production build, whitespace, server-rendered links and mirrored-run accessibility attributes, compiled CSS for natural image widths and matching social-link styles, and pause / visibility / motion-preference behavior in a DOM harness. This does not replace browser visual review of the protected preview, which is unavailable from this chat.
