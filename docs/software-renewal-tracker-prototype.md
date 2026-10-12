# Software Renewal Tracker — website integration ready for review

Prepared October 12, 2026. Based on website main ffa09f053c5dbeba72e20f3f3bd855b1fca80fb3, including today's released analytics wrapper repair and newsletter updates. Local branch: codex/renewal-tracker-release-prep-2026-10-12. No remote push, merge, or deployment occurred.

## What is prepared

New Astro route /tools/software-renewal-tracker uses the existing BaseLayout, navigation, fonts, footer and shared analytics loader. It remains noindex and outside the sitemap during review. The existing /resources/software-renewal worksheet page now has an Open the renewal tracker link. Its fixed cta_click labels are software_renewal_tracker and software_renewal_resource. No entered vendor names, prices, dates, owners or notes are added to analytics. The shared loader and measurement ID remain unchanged.

Manual USD entries include full charge, monthly/quarterly/annual frequency, calculated monthly equivalent, separate billing/renewal/notice dates, owner, decision, confirmed billing state, notes and illustrative label. No accounts, bank connection, AI dependency, sync, automated reminders or additional dashboard. Save writes and verifies the full diary in localStorage under cloud-and-capital:renewal-tracker:v1. It is local to browser, device and origin. CSV is the portable backup; clearing browser data or private-mode behavior can remove saved records.

## Worked example and date rules

Three explicitly fictional subscriptions: $19 monthly, $240 annually and $600 annually. Monthly equivalent = $89; if both annual payments fall in the selected month, cash charges = $859. A full year totals $1,068. Amounts assume unchanged prices, ongoing billing, one monthly charge, and no extra charges beyond the entered amount. Monthly equivalent is a budget comparison, not cash availability.

Examples move to next month. Billing recurrence anchors to the entered recent or next charge date; short months clamp then restore the anchor. Renewal and notice dates are independent and are not repeated automatically. Cancel is a decision and keeps projected charges; confirmed ended billing excludes them. Missing dates/owner and passed real deadlines are visible. Notice dates after renewal are flagged. Warning dates use the page date format; cancellation confirmation is mentioned only for Cancel.

## Examples and saving

Examples are unsaved by default. Adding from their view saves only the new record. Editing an example preserves its illustrative label; the user must explicitly uncheck it after replacing fictional details. Saved illustrative records are labeled and included in totals, as stated beside the checkbox. Saved diaries are replaced only after an explicit confirmation. Switching to examples does not overwrite saved records. Corrupted saved data can be downloaded for recovery; blocked storage is disclosed separately. Existing diary data is not overwritten without confirmation.

## Exports

CSV carries all fields and schema version, validates import before replacement, protects spreadsheet formula-like text, and round-trips Unicode, quotes, commas, newlines and leading apostrophes. Formatted USD amounts and harmless spreadsheet padding/uppercase booleans are accepted. Dates must use YYYY-MM-DD; ambiguous spreadsheet dates are rejected with field and row context.

Calendar .ics export covers 12 months from the selected month. It emits independent all-day billing, renewal and notice events, with stable UIDs, escaped text, folded lines and no alarms or RRULEs. Missing dates and ended billing are excluded. Previously imported calendars do not sync with the tracker; duplicate behavior and alerts belong to the calendar app.

## Validation completed

- Patch integrated cleanly on latest main ffa09f0, preserving today's released analytics changes.
- npm ci completed. All 75 combined website tests passed. Production Astro/Vercel build passed. git diff --check passed.
- Regression checks cover exact example math; month ends/leap years; Cancel versus ended; CSV round trips, malformed data and storage errors; editor/save/reload/import flows; preserving illustrative status; clearing stale validation messages; formatted conditional warnings; shared layout/noindex; and fixed analytics labels rejecting extra private data.
- Standalone HTML regenerated from the exact integrated component, CSS, rules, UI and embedded fonts. It is a local preview with no network dependency.
- Diana confirmed desktop Safari save/reload, November month selection and CSV export/re-import on the prior preview. Screenshots showed the saved $19 test record and correct $0 October charges for a November 5 billing start.
- Independent Python icalendar parsing validated example and leap-year month-end calendars, all-day dates, unique UIDs, Unicode/escaping and line folding.
- Diana's first actual export omitted the notice date because the field was blank. After entering November 1, the second file contained all 14 expected events. Google Calendar independently showed exactly these 14 events with no duplicates in that import: November 1 notice, November 5 billing/renewal, and monthly billing through October 2027. All test events were deleted as requested; follow-up search returned none.
- Claude reported Chromium checks at 320/390/768/1280px, ordinary keyboard flows, date logic, storage and exports for the earlier version. Those are external reviewer findings, not browser checks repeated in this environment.

## Remaining limits and release steps

The supported control-browser skill is unavailable in this environment. No browser preview server was started. Real phones, private-mode persistence, VoiceOver/screen readers, Firefox and other calendar-app imports remain unverified. The small layout/form wording changes in this integration have not had a fresh native-browser visual pass. DOM simulation does not verify visual layout, native dialog focus or screen-reader behavior.

Publication is still pending Diana's request. At release: refresh latest main, keep the analytics repair, decide whether to remove review/noindex text and add the route to the sitemap, deploy through the existing hosting workflow, then verify save/reload/export at the actual website origin. File-origin local data will not appear automatically at the website origin; export/import a CSV to transfer records. Do not expand scope or add an AI dependency.

## Reproduce

Apply software-renewal-tracker.patch on base ffa09f053c5dbeba72e20f3f3bd855b1fca80fb3. Run npm ci, npm test, npm run build, and node scripts/build-renewal-preview.mjs. The standalone HTML is generated at prototype/software-renewal-tracker.html. The same component appears at /tools/software-renewal-tracker in the website checkout.
