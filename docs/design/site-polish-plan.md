# Cloud & Capital: polish after the homepage

The homepage is the approved visual reference: warm cream, sage and dusty rose; Cormorant serif headings; clear links with close arrows; rounded cards; real tool screenshots; restrained 3D objects, handwritten notes and pink crystal details. Keep Diana's voice warm, specific and welcoming, with useful outcomes explained before technical terms.

The homepage release does not mean the whole website audit is complete. Work through these pages one at a time, approving their desktop and mobile layouts before moving on.

## October 20 alignment review

Reviewed the October 20 Alignment Review, Command Center and shared editorial direction from the Advice and Brain Audit work, then inspected the published homepage and followed its Tools navigation. The approved homepage remains the visual reference. The initial review was read only. Diana subsequently approved the three homepage refinements and continuing into the Tools directory; implementation status is recorded below.

Carry these decisions into the remaining pages:

- Diana's finance perspective connects cloud, AI, SaaS and technology spending: what does it cost, what drives it, what useful result do we get, what commitment or risk are we taking, and what decision follows? Do not claim her background is unique or that other practitioners mostly come from engineering.
- Keep three clear visitor paths: get help with a business problem, use a free resource, or explore Diana's writing and perspective. A free user does not have to become a consulting lead.
- Preserve the wider Cloud & Capital mix: finance, markets, small business, useful systems, curiosity, humor and life around building. AI costs are one part of the brand.
- Insights should hold durable answers, guides, worked examples and resources. Markets & Mimosas remains the deeper editorial destination. Add personal writing only when Diana explicitly chooses the public text; private notes are not website source material.
- Finish the accepted website and current renewal resource journey. The capybara agent and other tool ideas stay in the backlog until their own build is chosen; do not turn this review into another tool project.

### Homepage findings

The live page still provides clear services, real featured tool destinations, a personal About section, writing, Instagram and a direct contact step. The approved cream, sage, dusty rose, 3D and crystal details remain coherent. Desktop inspection and a fresh 390px responsive check found no missing loaded images, horizontal overflow or checked text overflow. The mobile event flyer is centered, and the footer uses centered alignment. The earlier release checks covered six responsive widths, the build and 77 tests; those are prior evidence, not newly rerun tests or physical-device certification.

The three refinements were approved and released in PR #32, production commit `8167dd3fefc0801fce5bdbc40d33047717bad937`:

| Item | Finding | Released change |
| --- | --- | --- |
| Finance perspective | The degree, Morgan Stanley experience and FinOps credentials were present, but their connection was mostly implicit. | The second About paragraph now ends: “These days, I look at technology through a finance lens: what it costs, what you get, and whether it’s worth it.” The remaining biography is preserved. |
| Search and sharing copy | The former title and description focused on consulting, startups and service businesses. | The title is now “Cloud & Capital \| Finance, Technology & Free Tools”, with a description covering free tools, writing and business services. |
| Mobile Instagram link | At 390px, the label wrapped and left the arrow too far from the text. | Keep the label and arrow together. The pause control may wrap on narrow desktop windows; it remains hidden for touch and reduced-motion preferences. Use a smaller social label only at 360px and below. Desktop styles are preserved. |

Release checks: production build, all 77 tests and whitespace checks passed. The deployment reported success, and the new title/About text were observed on production. Fresh 320, 375, 390 and 768px responsive checks found no checked text overflow, horizontal escapes or missing loaded images. These are browser viewport checks, not physical-device certification.

Following Diana's screenshot review, PR #35 (`def69b9161819a5f2c01461f87bef4b4c663cd8e`) widened the hero's second paragraph, kept its short phrases together and centered the contact heart along the email card's top edge. The card has additional room above it so the heart clears the paragraph. Production build and whitespace checks passed; the release reported success. Live desktop plus 320, 375, 390, 414, 768 and 1024px checks found no checked overflow or missing loaded images. The heart is horizontally centered at every checked width and clears both paragraph and card label.

The separate dependency repair is still draft PR #31, not a production patch. Its preview deployment reports success; preview acceptance and release remain separate follow-ups. Hosting controls, browser headers and API spend/abuse protection retain their existing security-work owner and acceptance steps.

### Visitor feedback refinement — October 20

Diana approved a restrained decorative edit and clearer explanation of the work after Zack’s first-visitor feedback. This updates the earlier crystal placement decisions:

- PR #37 (`27f6a2e6e6eee6fa33b18341a7e2e6e2a916e971`) makes the finance analyst/tool builder role explicit in the introduction, names software/cloud/AI costs, and tightens the three service descriptions around recognizable tasks and deliverables.
- About is now 169 words. It names Cal State Dominguez Hills and Morgan Stanley, explains the finance perspective and present work, and retains the mom/internet-nerd/rabbit-hole details, beauty/animals background, Polish family, Myszka, South Bay, newsletter and welcoming close. The event and credentials remain.
- Remove the three crystal magnets from the About photos and the email-card heart. Keep the photo treatment, handwriting, clay pink/sage palette and crystal magnifying glass. The email card no longer reserves extra space for a heart.
- PR #38 (`124751d3ec0c7839c46e1a57f015a7d1a1017ce7`) aligns desktop service-card rows with CSS subgrid and keeps short hero phrases together. The byline is shorter at narrow widths.
- PR #39 (`3d3ed7a66797ddc65ef11627604f75075c6c7aed`) keeps “I’m still working through.” together in the closing About paragraph without changing its wording. Build and focused live viewport checks passed.

Validation: the copy/decorative pass built and all 77 existing tests passed. The final layout pass built and passed whitespace checks. Both production deployments reported success. Live desktop and 320/375/390/414/768/1024px checks found no checked text overflow, horizontal escapes or missing loaded images. The three desktop service dividers and action rows align, and the checked hero role/audience phrases stay together. These are responsive Chrome checks, not physical-device or Safari certification.

### Tools directory: interactive menu refinement — October 20

The Tools directory remains draft PR #34. Diana reviewed its first desktop preview and supplied a screenshot. She likes the screenshot cards, but wants a simpler interactive menu, stronger buttons, less repetition, a larger folder without “help yourself!”, and room for planned tools.

The revised draft has one gallery, with View all selected by default and three topic buttons: Tech spending, Money & investing, and AI & automation. The six released tool cards each appear once. The renewal worksheet is a companion link inside the tracker card, rather than a second software-renewal card. Cards can belong to multiple topics without creating duplicate entries. Worksheet and diagnostic tools are grouped by subject instead of a separate “Decision guides” format category. Filtering keeps keyboard focus on the selected native button, exposes its pressed state, announces the result count, and removes hidden cards from keyboard access. Without JavaScript, all cards remain available and the inactive filter controls stay hidden.

Diana explicitly requested Coming soon space. Four non-clickable Coming soon cards now cover the Monthly Money Planner, Business Cash Flow Planner, Worth It Calculator, and animal-inspired AI helper/setup walkthrough. They promise no release date or working integration. This supersedes the earlier instruction to omit all unfinished tools from this directory; the agent build itself remains separate backlog work. No empty topic buttons or invented release dates were added.

The folder is larger and the handwritten note is removed. The repeated source-code project cards are replaced with one secondary GitHub link. Card screenshots, released destinations, analytics metadata, app logic, and existing pipelines are preserved. All cards use the same gallery layout, including Market Tape. Mobile filters use a two-column arrangement and cards stack in one column.

Validation: all 78 tests passed, including a new test that clicks every topic, checks unique membership and pressed states, keeps focus, restores View all, and distinguishes ready tools from Coming soon entries. The route check also prevents a separate renewal worksheet card and retains its companion destination. The production build passed. The preview will be updated after final source checks. New desktop/mobile visual acceptance remains pending. Diana can review the protected preview in her own signed-in browser and provide screenshots; the review browser does not currently have verified Vercel access. Do not claim this revision is visually accepted or merge it into production before that review.

### Pipeline reconciliation after Diana’s review

Diana identified software renewal as duplicated and reminded us that the pipeline includes a calculator, financial planning and budgeting tools. The saved October18–19 Website Audit lineup includes Monthly Money Planner and Business Cash Flow Planner as future builds, the animal-inspired assistant as a concept, and Chart Basics/illustrated guide as existing teaching work. The older MASTER-ROADMAP’s later backlog records Worth It Calculator as cost/hourly rate/time saved; it was an idea rather than a released product. Diana’s current request authorizes representing these planned tools on the draft page without starting their builds.

| Directory item | Draft promise | State |
| --- | --- | --- |
| Monthly Money Planner | Monthly budget, spending and saving | Coming soon; budgeting is included here instead of creating another nearly identical placeholder |
| Business Cash Flow Planner | Money in/out and business cash-buffer planning | Coming soon |
| Worth It Calculator | Compare cost with time saved | Coming soon; working title from the saved roadmap |
| Your own AI helper | Animal-inspired assistant and setup walkthrough | Coming soon; final character and build scope remain separate |
| Chart Basics companion/illustrated guide | Existing teaching resources | Keep out of the public tool gallery until its owning release is ready |
| Software Renewal Tracker + companion worksheet | Track renewals, with a separate link for the existing review worksheet | One released card, two distinct working destinations |

The Coming soon copy is a concise proposal for the page, not a locked feature specification. Existing Market Tape research/upgrades stay with their owner and do not become a duplicate tool. No new application, financial calculation, login, bank connection or agent integration was built in this website pass.

### Topic palettes, centered actions and full tool audit

Diana’s next screenshot review approved the direction but identified the Interactive Lab thumbnail frame and asked for selected topics to show only their matching tools in a consistent color. The subsequent request centers the tool buttons. A check of the previous actual built HTML/script/CSS confirmed correct membership; category colors were missing because they were fixed to each individual card.

This repair gives each topic a palette: Tech spending uses sage, Money & investing uses sand/beige, and AI & automation uses clay pink. The selected palette applies to both released and Coming soon cards, including their preview, light body tint, border and accents. View all restores each card’s original tone. Topic controls and tool action/companion links are centered. Ready-tool screenshot frames share an aspect ratio and contain the full image; the taller Lab capture no longer defines a deeper preview region. Replacing the actual screenshots remains part of the app audit after each UI is accepted.

All 78 tests and the production build passed. A new standalone built-page integration check tests the rendered HTML, actual filtering script and CSS, matching membership/palettes, focus, View all restoration, hidden cards, centered actions and shared preview rules. It does not certify visual desktop/mobile/Safari layouts. Run it after the build with `node scripts/verify-tools-directory.mjs`.

Diana also requested a thorough audit with Codex and Claude of every tool/resource for usefulness, working inputs/results, calculations, recovery, accessibility/mobile and better real screenshots. The inventory, responsibilities, evidence and acceptance steps are in `docs/design/tool-audit-plan.md`. The first tool is Interactive Lab. After connector validation errors, Diana chose a manual Claude review; its complete copyable brief is `docs/design/claude-tool-audit-brief.md`. It includes relevant competitor research and an upgrade/screenshot plan. Keep Tools open for those findings while continuing to Services. Diana explicitly approved this parallel review instead of waiting to finish the tool audits before opening the next page. The external review starts when Diana pastes the brief into Claude; no background review is claimed here.

Diana accepted the current directory direction for now and requested the folder files shuffle like the homepage. Reuse the homepage’s staggered 3.2-second lift/rotation amounts and layered front/back masking. Play a small initial shuffle and replay on hover; leave the folder still for reduced-motion preferences. This does not change the homepage or its artwork. The build and gallery integration check passed; the check now loads the finished Vercel function artifact after the adapter moves the server entry during packaging.

## Remaining-page order

| Order | Page | Main work | Ready when |
| --- | --- | --- | --- |
| 1 | Tools directory (`/tools`) | Lead with real screenshots and clear outcomes. Organize by the task: AI costs, cloud bills, software renewals, markets, and guided decision tools. Distinguish use-now tools from source-code projects. Include the approved, clearly labeled Coming soon cards for the two planners, calculator, and AI helper; add other future tools only when chosen. Match the homepage's rounded frames, spacing, italic tool titles, buttons and links. | A new visitor can identify the right tool, understand what to supply and what they get, and open it on mobile. |
| 2 | Services (`/services`) | Carry across the three service names and clear questions. Explain who each is for, inputs, deliverables, scope, and the next step. Keep the introduction friendly, simplify jargon and repetition, and align inquiry controls with the homepage. Preserve truthful credentials and a fixed scope/quote before work begins. | A business owner can pick a service and understand the next step without needing to know FinOps terminology. |
| 3 | Investing & Trading (`/learn`) | Show exactly what a beginner learns and receives. Use the Sunny / Chart Basics work as context once ready, with approachable examples and a clear inquiry. Keep unvalidated research separate from promises about trading results. | A beginner understands the lesson, preparation, takeaways and how to ask about it. |
| 4 | Insights hub and article (`/insights`, `/insights/is-this-software-worth-it`) | Match the approved newspaper-style writing section. Make the relationship between on-site articles, The Decision Layer, and Markets & Mimosas clear. Audit archive images, titles, descriptions, mobile reading measure and subscription links. | Visitors can choose a read and know where it opens, with comfortable article typography on phones. |
| 5 | Renewal resources and tracker (`/resources/software-renewal`, `/tools/software-renewal-tracker`) | Unify page framing, help text, tool inputs, examples, buttons and status messages. Preserve the working save/import/export/calendar behavior. Review the PDF and printable version alongside the page. | Someone can move from the article/checklist to their own subscription records without confusion. |
| 6 | Signal Audit and Interactive Lab (`/signal-audit`, `/interactive-lab`) | Review the promise, required inputs, progress, results, terminology, empty/error states and mobile controls. Carry over the visual language without dressing a workflow up with unnecessary decoration. | A first-time visitor understands why to use each tool and what the result means. |
| 7 | Service examples (`/services/examples`) and shared site details | Reassess whether examples earn their place, make their status clear, and remove repetitive copy. Sweep header/footer navigation, forms, 404, redirects, metadata, image weight, accessibility and link consistency across completed pages. | Pages connect naturally, navigation is consistent, and there are no dead ends. |

## Separate workstreams

- AI Cost Lens and Cloud Cost Guard are separate repositories/apps. Link to their released destinations, keep their homepage screenshots accurate, and coordinate their design passes without replacing existing pipelines or duplicating feature work.
- The Instagram homepage strip currently uses selected local covers and links. Automatic feed refresh is a separate integration task; decide its maintenance and account-authorization approach before promising automatic updates.
- The capybara-inspired agent, planners, calculator, and other tool builds remain separate backlog work. Clearly labeled Coming soon cards may represent the chosen planned tools; add open actions and screenshots only when a tool is usable.

## Working rules

Use the homepage's established components and tokens. Keep imagery purposeful, copy concise, line breaks natural, and mobile spacing deliberate. Verify links, real inputs/results, keyboard use and reduced-motion behavior on each page. Preserve existing functionality and check visual changes in the browser; source inspection alone is not visual QA. Finish one page before beginning another redesign.
