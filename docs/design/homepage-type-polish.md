# Homepage text and spacing pass

October 20, 2026. The approved palette, artwork, copy, buttons, links, and mobile alignment remain the reference. This pass refines how the same text wraps.

## Findings and changes

- Keep “about your tools” and “your costs” together in the hero. Phrase spans can still wrap within their available width; there are no fixed-height text boxes or forced desktop line breaks.
- Give phone service cards 24px padding instead of 32px. Keep the service-name endings together and gently scale the decorative icons below 380px. This gives the narrowest questions enough room for their approved two-line phrasing.
- Balance the short service and tool descriptions. Increase the service text measure from 39ch to 46ch, capped by the card width, so stacked cards have a more comfortable reading width.
- Keep “for the task” together in the Tools heading and “Renewal Tracker” together in its tool name. Slightly scale the smaller tool headings on the narrowest phones.
- Use pretty wrapping for the biography and event description, and balanced wrapping for short credentials. Scale the event title so “LA” does not sit alone.
- Keep “I’m learning” and “as I build” together in the writing heading. Article-title sentences remain data-driven and wrap as complete units where space allows. Scale The Decision Layer title on phones and narrow tablets to avoid a lone “Layer.”
- Scale the Instagram heading smoothly on phones so “talk” and “life” do not end up alone below the existing intentional line break.
- Balance the centered contact description within a slightly shorter measure. Preserve the compact email card, natural address break, and decorative heart.

## Verification

Inspect actual word positions with browser text ranges at desktop, 320px, 390px, 768px, and 1024px. Review heading lines, short paragraph endings, question spans, card spacing, and horizontal overflow. Compare the page's rendered words with the pre-change capture so this remains a layout pass. Run the production build and existing checks, then repeat the live layout review after deployment.
