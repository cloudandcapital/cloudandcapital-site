# Homepage writing: editorial spacing pass

The approved title, article text, article destinations, cream and sage palette, featured essay layout, staggered Built / Locked in / Default typography, fine linework, and two bottom buttons are retained.

## Changes

- Each Read action follows its description instead of using an automatic top margin to sit at the bottom of a stretched card. Description bottom margins are removed to avoid double spacing. The action gets an 8px top margin; its shared 50px touch target provides approximately another 16px above the visible label. The existing link typography, underline, close arrow, and arrow size remain shared with the rest of the homepage.
- The featured copy starts at the top and its headline, description, and Read action stay together.
- Secondary article padding is 24px vertically. The Featured essay / Latest / Previously labels have a 16px bottom margin, reduced from 20px.
- The linework and typographic composition scale together to 85%, preserving their relationship. The illustration has a bounded height of 23.5rem on desktop, 20.25rem on tablets, and 17.25rem on narrow screens rather than stretching through the full feature height. It remains vertically centered beside the featured copy and appears above it on narrow screens.
- All changes are native CSS. No new image assets or generated artwork are used.

## Scope and verification

Only writing-section styles in `src/pages/index.astro` change. Hero, services, tools, About, Instagram, contact, article content, analytics attributes, and destinations are preserved. Validation uses the Astro production build, whitespace checks, and the server-rendered page / bundled stylesheet. Browser visual review of the protected preview remains with the user; the local Browser connection is unavailable in this chat.
