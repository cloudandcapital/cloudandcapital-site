# Services page: October 20 design pass

Diana authorized a full Services upgrade using the approved homepage as the reference. The Tools directory stays in its separate draft PR while Diana runs the manual Claude audit. This pass does not lock either page or build new tools.

## Design and content

- Keep the three established services and their existing anchor URLs: Technology Cost Review, AI & Workflow Review, and Tool & Automation Setup.
- Replace the older flat SVG illustration with a paper composition using the existing clay bill, sage clock, and beige blocks. These are the homepage's approved 3D assets, not a new visual system.
- Give each service a wider rounded panel, matching its homepage color. Put the service name and icon together, followed by its recognizable question. Show starting inputs, deliverables, expandable scope, and the next step.
- Preserve the October 20 AI subscription scope: separate subscriptions from extra usage, check overlapping plans, and agree a way to test a proposed change. Preserve the limits around architecture changes, migrations, complex allocation, and ongoing support.
- Use the shared ActionLabel for text actions and buttons. Arrows stay beside their labels. Service jump links are native anchors and work without JavaScript.
- Keep the fixed scope, quote, and timeline before work begins. A review is not required before a clear setup project. No invented prices, customers, results, or guarantees.
- Add a concise green biography section, using Diana's approved finance degree, Morgan Stanley experience, current finance perspective, and existing credentials.
- Replace the old Lens capture with the accepted homepage screenshot, in a cream browser window with shadow. Keep a truthful example caption and direct tool link.
- Keep the renewal worksheet and learning page as secondary routes. Preserve the worked service examples as clearly named links to the existing examples page.
- Give the inquiry form a Services-only appearance. Learning keeps its default form. Required fields, mailto generation, clipboard copy/recovery, and direct email fallback remain intact. A form draft is not represented as a website submission.

## Verification

The local production build and all 78 existing tests passed. A separate check of the rendered Vercel artifact exercised the actual inquiry script: required-field validation, copy success, and visible recovery when the clipboard is unavailable. It also checked unique IDs, anchors, image assets, structured offers, preserved AI scope, and the default Learning form. No email was sent.

The built-page check does not certify browser layout. Record the published desktop/mobile visual findings and any corrections in the release PR. Treat this as a first design pass for Diana to review, not final visual acceptance.

## Review details

Check the hero's two deliberate headline lines, logical question breaks, service names at narrow widths, consistent arrows, accordion keyboard access, inquiry field spacing, direct email wrapping, loaded images, and horizontal overflow. Inspect 320, 375, 390, 414, 768, and 1024px layouts as well as desktop. The existing responsive-review iframe can navigate from the homepage to Services through the normal Services link.
