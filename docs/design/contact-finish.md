# Homepage contact finish

The closing contact section uses a slightly rosier clay `#c8a5a5` through `--dusty-rose`. The homepage's Try the tools and Browse all free tools buttons share this token, with `#bf9797` on hover and dark text. Existing clay and rose tokens elsewhere remain unchanged. Contact text is `#2f2927`; the charcoal footer remains intact.

The headline reads “Have a bill, a task, or an idea / you want to make sense of?” with the existing desktop two-line structure and natural mobile wrapping. The supporting copy, including “A few lines are enough,” is unchanged.

The cream email card has 12px corners, matching the established cards. Its small outline heart is replaced by the existing `pink-rhinestone-heart.webp` from About, reused without editing. A static 48px heart overlaps the upper-right corner with a slight clockwise tilt and soft contact shadow. It is decorative, excluded from the accessible name, and cannot intercept clicks. The email address, mailto destination, analytics, arrow, and keyboard focus outline are preserved.

After public production review, Diana requested a less stretched email card. The card now uses `fit-content` with a `100%` maximum width, a consistent 24px text-to-arrow gap, and the existing minimum height. This removes the desktop empty space while allowing the address to wrap on narrow screens. The heart sits 6px higher and slightly farther outside the corner, and the card has another 6px of top spacing.

Validation: Astro production build, whitespace checks, server-rendered headline / email destination / decorative-image markup, and contact color contrast. Public production browser checks cover the desktop contact section and responsive widths from 320 to 1024px, including no horizontal or text overflow and mobile navigation to Contact. The protected draft preview is unavailable in this chat.
