# Tool quality and improvement plan

Owner: Diana Molski. Updated October 23, 2026.

Keep the approved Cloud & Capital positioning and homepage design. A tool earns its place by helping a named visitor complete a useful task. Finish the existing library before expanding it simply to fill cards.

## Release standard

For each tool, record the visitor, task, inputs, useful output, and next action. Verify the underlying source, date, units, assumptions, arithmetic, supported formats, and exclusions. Exercise meaningful normal, missing, extreme, error, edit, reset, and export paths. Keep fictional examples clearly labeled. A self-assessment score, model opinion, estimate, billed cost, and verified result must remain distinct.

Check the actual rendered desktop and phone views, headings and line breaks, contrast, labels, keyboard focus, input controls, overflow, loading/failure states, copy/download behavior, and print support. Test data/network privacy against what the tool promises. Passing code checks does not establish user comprehension, physical-device compatibility, or factual accuracy of generated prose.

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
| Software Renewal Tracker | Existing reviewed entry, CSV and calendar paths; companion guide and PDF resources | Use the current tracker owner for later work. Reconcile any new release before replacing screenshots or repeating defects. |
| AI Cost Lens | Separate active app owner and weekly audit | Do not modify that app from this website task. Read the latest closeout before calling it complete or reopening a finding. |
| Cloud Cost Guard | October24 afternoon leftovers repaired in Guard PR41 with matching guide PR86. The independent six-item pass at PR40 is preserved. Final strict CI: 174 first-pass browser checks, 14 existing skips, no failures/retries; 216 frontend tests and 11 native/WebAssembly cases pass. Larger A4/Letter reports each have two inspected pages with the bill warning on page one | Short targeted manual Claude recheck is next. Current customer-provider exports, full invoice/account coverage, other browsers/screen readers and physical paper remain separate. See docs/reviews/guard-targeted-polish-2026-10-24.md; prior public/provider evidence remains valid. |
| Signal Audit | Scoring, applicability, first-step logic, local privacy, export, wording, guide, actual screenshots and responsive checks | Claude's r2 recheck passes all seven targeted items. Its remaining map/exclusion wording finding is fixed for screen and Copy; 138 tests pass. Real Chrome/Safari PDF pagination still unverified. See docs/reviews/signal-audit-claude-follow-up-2026-10-23.md. |

A row is not a claim that every tool is locked. Each final status needs its owning release evidence.

### Guard: own spending comes first

Diana's October 23 clarification: a visitor wants to upload their own AWS, Azure or Google Cloud bill and understand it. Examples are optional previews and internal QA fixtures; completing one must never be a prerequisite for reviewing real spending. The guide and catalog now lead with the visitor's own export. The guide no longer presents a second downloadable example workflow beside the app's existing example mode.

The app owner should prioritize a provider-led import flow: choose the provider and document the exact supported export, accept its delivered file format where feasible, validate the actual provider schema, and explain any unsupported file without inventing a report. AWS/Azure have documented FOCUS CSV routes. Guard PR37 adds an English Google Cost table CSV path with confirmed invoice month/currency, exact source evidence and separate Total controls; its documented-layout fixtures are separate from current customer-export validation. Guard PR36 handles Gzip CSV delivery; ZIP and Parquet remain separate capabilities.

October 23 read-only compatibility testing found both public FinOps Foundation FOCUS extracts blocked before analysis: eight-place cost limits reject their 11-place values; lossless zero trimming exposes a separate timezone serialization boundary. A Gzip wrapper also gets a misleading UTF-8 recovery message. The 1,000-row failure and compressed-file error were verified through the public UI. Exact reader, independent totals, reproducible probe and the Guard-owner handoff are in [the public-data input audit](reviews/guard-public-provider-input-audit-2026-10-23.md). Diana subsequently authorized Guard implementation here; [the fix follow-up](reviews/guard-provider-import-fix-2026-10-23.md) records the pipeline repair and exact public-data passes. Broad compatibility remains open until representative current provider layouts pass.

Acceptance needs representative exports in the providers' real layouts, including credits/taxes, empty account-level service labels, multipart files, supported date formats, compression and prior-period comparisons. Reconcile against the supplied invoice/export and preserve coverage warnings. Invented records that already match the simple template prove arithmetic, not provider compatibility. Confirm supported FOCUS versions and billing-account restrictions before making a broad provider claim. PDF extraction is a separately evaluated input type; never imply it exists because CSV works.

## Continuing discovery

The canonical Morning Scan workflow is /CloudAndCapital-Brain-v2/workflows/morning-scan.md. Its existing M/W/F scan owns the bounded Tool Builder Radar. October 23 update distinguishes EXISTING TOOL UPGRADE from NEW TOOL IDEA, rotates current released tools, guides, screenshots, source freshness and useful next actions, and checks owner closeouts before repeating defects.

An upgrade candidate needs the observed problem, source/date, affected tool, benefit, smallest useful change, and acceptance check. A new idea needs a user, task, current workaround, overlap, differentiation, and smallest test. Use the existing content-and-ideas ledger; do not create a second backlog, feature quota, or automatic build commitment. Preserve current scan limits, schedule, specialist audits and implementation boundaries.

Existing Lens, Guard, and Market Tape audit tasks keep their current scopes. A scan can discover an opportunity without authorizing a release or inventing demand. NO CHANGE is a useful result. Once an existing tool is healthy, let evidence drive its next upgrade.
