# Tool quality and improvement plan

Owner: Diana Molski. Updated October 24, 2026.

Keep the approved Cloud & Capital positioning and homepage design. A tool earns its place by helping a named visitor complete a useful task. Finish the existing library before expanding it simply to fill cards.

## Release standard

For each tool, record the visitor, task, inputs, useful output, and next action. Verify the underlying source, date, units, assumptions, arithmetic, supported formats, and exclusions. Exercise meaningful normal, missing, extreme, error, edit, reset, and export paths. Keep fictional examples clearly labeled. A self-assessment score, model opinion, estimate, billed cost, and verified result must remain distinct.

Check the actual rendered desktop and phone views, headings and line breaks, contrast, labels, keyboard focus, input controls, overflow, loading/failure states, copy/download behavior, and print support. Test data/network privacy against what the tool promises. Passing code checks does not establish user comprehension, physical-device compatibility, or factual accuracy of generated prose.

Cloud & Capital resource and tool PDFs use **Cloud & Capital** branding, including the footer and author metadata. Diana does not want a personal-name credit on these PDFs. Apply the same rule to their preview images. Use the supplied official logo originals registered in docs/design/site-visual-system.md for new branded materials; do not redraw or retype them.

Ship a casual, readable guide with a checked example and a concrete answer to “what do I do with this?” Use screenshots from that exact version of the tool, with real dimensions and honest example labels. Connect guide to tool and relevant service. Reconcile directory descriptions, source links, and images. Capture the source version and checks in a dated review record.

Diana uses her own Claude app for independent review. Prepare a reproducible handoff covering live tool, guide, sources, arithmetic, usefulness, limitations, design, and exports. Work through material findings and retest changed behavior before marking that review complete. Do not call the connected editorial plugin on her behalf.

## Real-world input coverage

Diana's requirement applies across the library: accommodate the major providers and common files that the intended visitor actually has, with minimal preparation. A tool must not earn a ready verdict just because our invented example or custom template works. Examples are optional; reviewing the visitor's own information is the primary path.

AI Cost Lens's baseline is OpenAI/ChatGPT, Anthropic/Claude and xAI/Grok, followed by Google/Gemini and other widely used providers identified through research and actual use. Subscription invoices and API cost/usage exports are separate inputs. Cloud Cost Guard's baseline is AWS, Azure and Google Cloud. These are coverage targets, not claims that every provider/file format is already supported or that a measured majority of users is covered.

Track native and tested, mapped with confirmation, and unsupported formats separately. Verify the provider's actual download layout, credits, taxes, period, currency and totals. A price catalog entry, an OpenAI-compatible request format or generic mapper does not establish native bill-import support. A bill alone may establish spending without establishing requests, tokens, business outcomes or cost per usable result.

Acceptance brief: [Provider input coverage](reviews/provider-input-coverage-2026-10-23.md). Apply it to existing tools before adding new ones. Coordinate from fresh source to avoid concurrent edits. Guard implementation is authorized here; Lens remains a separate active app project.

## Current ownership and review state

| Tool | Current evidence | Remaining owner work |
| --- | --- | --- |
| Market Tape | October 23 Claude review findings resolved; refreshed live guide and real screenshots; app 18 checks and site 109 checks at that release | Independent targeted retest if desired. Stored snapshot history is a future candidate, not shipped functionality. Weekly integrity workflow retains its existing scope. |
| Interactive Lab | October 22–23 review and follow-up records in docs/reviews; live renewal guide and actual example images | Preserve known model limitations and any later owner feedback; do not equate shape validation with verified model prose. |
| Software Renewal Tracker | Existing reviewed entry/CSV/calendar paths and companion guide. October24 public check confirms $89 monthly equivalent/$859 same-month payments, save/reload, Cancel versus ended billing, and actual CSV/18-event calendar bytes | Keep the separate owner’s longer article/PDF shortening and release decision open. This check does not replace that package or claim a new calendar-app, physical-device or cross-browser acceptance. The short website guide remains live. |
| AI Cost Lens | Controlled-test PR43 and full-guide PR44 are merged; their quality gates pass. The public simple comparison still matches $2.56/$4.25, and Verify’s caching example/download matches 40 distinct cases and 80 paired observations. The website walkthrough now explains where Verify appears and links directly to its detailed guide | Queue one focused manual Claude review of the new test workflow and matching guide after October25 at 6pm America/Los_Angeles. Existing app owner retains implementation; this pass changes website guidance only. This is not a new full independent Lens audit. |
| Cloud Cost Guard | October24 3:50 pm manual Claude recheck passes every requested live item at c3d1ccc; earlier passes hold and no new reproducible defects were found. Internal strict CI and inspected A4/Letter warning output remain valid | Targeted repair loop complete. Preserve the passing runtime. Synthetic warning noise is recorded, not a measured customer error rate. Current customer-provider exports, complete coverage, remaining browser/device and accessibility checks remain separate. See docs/reviews/guard-name-safety-2026-10-24.md. |
| Signal Audit | Scoring, applicability, first-step logic, local privacy, export, wording, guide, actual screenshots and responsive checks | Claude's r2 recheck passes all seven targeted items. Its remaining map/exclusion wording finding is fixed for screen and Copy; 138 tests pass. Real Chrome/Safari PDF pagination still unverified. See docs/reviews/signal-audit-claude-follow-up-2026-10-23.md. |

A row is not a claim that every tool is locked. Each final status needs its owning release evidence.

## Order of work from this pass

1. **Complete:** directory counts/support wording, beginner Lens walkthrough to detailed Verify guide, and the renewal tracker’s existing guide/export journey. The approved homepage and app calculations remain stable.
2. **Content/link repair pass complete; visual approval separate:** Services, its worked examples, Guides & Writing, and Investing & Trading/Learning have the checked descriptions, links and bounded layout fixes recorded in [the supporting-page review](reviews/site-page-journeys-2026-10-24.md). Diana clarified that those checks do not finish the designer pass. The three main pages now share the homepage's visual language in the design release described below; Diana's visual sign-off remains open. This does not certify every browser, physical phone or lesson outcome.
3. **Designer passes on hold until October25:** Diana explicitly deferred the designer work until tomorrow. Continue bounded non-design work today. She will make a closer designer pass on October25. Keep her visual approval open and use that feedback to continue the designer pass across the tool directory and tools themselves while retaining the per-tool technical status above. Start with the website's Renewal Tracker, Signal Audit and Interactive Lab, then coordinate fresh source with the Lens, Guard and Tape app work. Refresh directory/homepage screenshots only after each tool's design is released. The focused manual Lens review below and remaining file/device acceptance stay separate. Preserve the separate renewal article/PDF owner's work. Guard's targeted repair loop stays closed unless fresh reproducible evidence changes it.
4. Resume new tools after that evidence is reconciled and Diana chooses the next build. Keep the existing AI helper, money planner, cash-flow planner and calculator cards as coming soon; this pass creates no new build commitment. The existing Before you renew worksheet is now reconciled and visible under Guides & Writing → Free resources; keep future resources grounded in a real visitor task.

### Functional closeout before Diana's visual review

The October24 [navigation closeout](reviews/site-navigation-closeout-2026-10-24.md) restores Investing & Trading to the shared top/phone menu and keeps the footer's six main destinations aligned. It also fixes the open phone-menu control disappearing against the cream header. Existing 138 tests, optimized build, directory checks and a twenty-route internal-link/asset check pass. All seventeen sitemap pages have the expected navigation and checked basic metadata. Seven real Chrome frame widths pass header/overflow checks; phone and desktop links reach Learning, and keyboard dismissal restores focus and scrolling.

These checks close the observed website navigation gap. They do not close Diana's visual approval, tool designer passes, manual Lens review, native Signal Audit print check, representative provider-file coverage or the separately recorded device/accessibility limits. Preserve the passing tool runtimes and existing owner work.

### Non-design search and sharing closeout

October24, after Diana paused designer work until October25, the [search metadata pass](reviews/site-search-readiness-2026-10-24.md) adds the official organization logo, completes guide breadcrumbs and missing Article entities, and uses each guide’s actual screenshot for sharing metadata. All seventeen rendered sitemap pages and all six guides pass the new metadata check; existing 138 tests, build and navigation checks pass. No visual redesign or tool-runtime change is included. Actual Google indexing remains unverified because GSC Wizard requires an active subscription; no purchase or submission was made.

### Visual design and approval

Diana's October24 clarification applies to both the supporting pages and every tool. They should flow naturally from the approved homepage: exact cream #F5EEE9, sage and dusty rose, Cormorant serif headings, readable body text, consistent close arrows and buttons, rounded panels, real screenshots with depth, and restrained soft 3D objects. The wording is broadly acceptable for now; the next pass should not turn into another wholesale copy rewrite.

The Services/Guides/Learning design release uses one page-scoped style file. Services has a centered sage opening, slightly lifted rounded cards with larger existing 3D icons and a compact credentials row. Guides uses an editorial introduction, shortcuts to its two sections, and larger framed actual screenshots. Learning uses the same type/buttons, a decorative 3D study illustration and calm topic cards. Its lesson offer, inquiry recipient and calculation boundaries are unchanged. See [the shared visual reference](design/site-visual-system.md).

All six tool interfaces remain on the designer-pass list: **AI Cost Lens, Cloud Cost Guard, Software Renewal Tracker, Signal Audit, Interactive Lab and Market Tape**. Review the actual start, input, results, warning, empty and export views; make the primary action and the useful answer easy to spot. Keep technical controls readable. A cosmetic change must not remove evidence, limitations or a warning to make a screen prettier. Preserve passing calculations and retest changed interactions. A guide screenshot must show the released tool, not a fabricated preview.

Track implementation, browser checks and Diana's visual approval separately. A passed technical audit or a working link does not close visual approval. No blanket “all tools finished” verdict is made. No connected Claude call or new automation is authorized by this visual work.

### Manual Claude review waiting list

Diana’s usage resets October25 at 6pm America/Los_Angeles. This is a review queue inside the existing plan, not a reminder or automatic review. Use her Claude app manually; do not call the connected editorial tool.

- **First: AI Cost Lens’s new controlled tests and full guide.** The [ready-to-paste focused handoff](reviews/ai-cost-lens-controlled-test-claude-handoff-2026-10-24.md) records the paths, expected arithmetic and evidence boundaries. It has not been sent. Check one-change locking, fresh repeated runs, held-out cases, rejection paths, tiny API unit costs, saved/reopened records, print, memo attachment and production-Actuals boundaries. Keep the beginner comparison in the check. Preserve the previous Lens work; report exact new defects separately from untested coverage.
- **Separate acceptance still open:** Signal Audit’s actual print pagination and the recorded tool-specific provider/device/accessibility limits. These are not invented defects or reasons to repeat all earlier reviews. Current provider exports need representative files, not another synthetic example.
- **Guard’s latest targeted review is complete.** Minor repeated wording/internal names and synthetic warning noise are later presentation candidates. No new Guard repair review is queued without fresh evidence.

### Resource structure to preserve

Keep **Tools I built**, **Tools I use**, and **Free resources** distinct when the resource area is expanded. Organize them around the visitor’s problem, explain who each helps, and connect article → tool → relevant service. Only show tools and resources that actually exist. **Before you renew** reuses the existing software-renewal worksheet. Its two-page fillable PDF, webpage, related guide, tracker and Technology Cost Review form one connected resource journey. It lives at /insights#resources, with a shortcut from the tool directory. Do not create a second overlapping checklist. No course or membership commitment is added.

### A clear, personal website worth returning to

Diana's October24 direction is to keep the site useful, straightforward and personal: good tools, interesting articles and things visitors can take away or return to. Creativity should make the useful thing easier to discover and understand. Keep the approved homepage/positioning and the calm cream, sage and dusty rose style.

The [resource journey and reference-site research](reviews/resource-journey-2026-10-24.md) records the patterns applied here: a clear way in by task, useful curated reading beside a chronological archive, and a next step from article to resource/tool to service. This is structural inspiration, not evidence that another site's audience or revenue will transfer to Cloud & Capital.

The first release gives the existing renewal worksheet a distinct Free resources home and keeps the walkthrough section to the six actual tools. It uses the real downloadable PDF as its preview. No new course, membership, signup requirement or recurring publishing promise is added. Tools I use should appear only once Diana's actual choices and the reasons for recommending them are checked; no empty section or borrowed endorsement is published.

A small curated “rabbit holes worth opening” collection and short notes on what Diana actually tried are possible ways to express her curiosity later. Keep any selected content idea in the existing content-and-ideas workflow, not a second backlog or an automatic build assignment. Publication still needs real material and normal editorial decisions. Provider-file acceptance and the six tool designer passes retain their existing status.

### Guard: own spending comes first

Diana's October 23 clarification: a visitor wants to upload their own AWS, Azure or Google Cloud bill and understand it. Examples are optional previews and internal QA fixtures; completing one must never be a prerequisite for reviewing real spending. The guide and catalog now lead with the visitor's own export. The guide no longer presents a second downloadable example workflow beside the app's existing example mode.

The app owner should prioritize a provider-led import flow: choose the provider and document the exact supported export, accept its delivered file format where feasible, validate the actual provider schema, and explain any unsupported file without inventing a report. AWS/Azure have documented FOCUS CSV routes. Guard PR37 adds an English Google Cost table CSV path with confirmed invoice month/currency, exact source evidence and separate Total controls; its documented-layout fixtures are separate from current customer-export validation. Guard PR36 handles Gzip CSV delivery; ZIP and Parquet remain separate capabilities.

October 23 read-only compatibility testing found both public FinOps Foundation FOCUS extracts blocked before analysis: eight-place cost limits reject their 11-place values; lossless zero trimming exposes a separate timezone serialization boundary. A Gzip wrapper also gets a misleading UTF-8 recovery message. The 1,000-row failure and compressed-file error were verified through the public UI. Exact reader, independent totals, reproducible probe and the Guard-owner handoff are in [the public-data input audit](reviews/guard-public-provider-input-audit-2026-10-23.md). Diana subsequently authorized Guard implementation here; [the fix follow-up](reviews/guard-provider-import-fix-2026-10-23.md) records the pipeline repair and exact public-data passes. Broad compatibility remains open until representative current provider layouts pass.

Acceptance needs representative exports in the providers' real layouts, including credits/taxes, empty account-level service labels, multipart files, supported date formats, compression and prior-period comparisons. Reconcile against the supplied invoice/export and preserve coverage warnings. Invented records that already match the simple template prove arithmetic, not provider compatibility. Confirm supported FOCUS versions and billing-account restrictions before making a broad provider claim. PDF extraction is a separately evaluated input type; never imply it exists because CSV works.

## Continuing discovery

The canonical Morning Scan workflow is /CloudAndCapital-Brain-v2/workflows/morning-scan.md. Its existing M/W/F scan owns the bounded Tool Builder Radar. October 23 update distinguishes EXISTING TOOL UPGRADE from NEW TOOL IDEA, rotates current released tools, guides, screenshots, source freshness and useful next actions, and checks owner closeouts before repeating defects.

An upgrade candidate needs the observed problem, source/date, affected tool, benefit, smallest useful change, and acceptance check. A new idea needs a user, task, current workaround, overlap, differentiation, and smallest test. Use the existing content-and-ideas ledger; do not create a second backlog, feature quota, or automatic build commitment. Preserve current scan limits, schedule, specialist audits and implementation boundaries.

Existing Lens, Guard, and Market Tape audit tasks keep their current scopes. A scan can discover an opportunity without authorizing a release or inventing demand. NO CHANGE is a useful result. Once an existing tool is healthy, let evidence drive its next upgrade.
