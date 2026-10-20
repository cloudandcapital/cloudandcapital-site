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

The separate dependency repair is still draft PR #31, not a production patch. Its preview deployment reports success; preview acceptance and release remain separate follow-ups. Hosting controls, browser headers and API spend/abuse protection retain their existing security-work owner and acceptance steps.

### Next page: Tools

The live Tools page currently leads with “Start with the question. Follow the number.” and a decorative cost/signal/evidence/decision index, followed by a large AI Cost Lens feature. That is more abstract and more AI-led than the simple library visitors are expecting from the homepage.

Prepare a screenshot-led directory with a concise welcome, obvious tool names, the task each helps with, what the visitor supplies, what they receive and a clear open action. Use the existing working destinations: AI Cost Lens, Cloud Cost Guard, Software Renewal Tracker, Market Tape, Software Renewal Checklist, Signal Audit and Interactive Lab. Organize around technology spending, money and markets, and decision guides, while avoiding empty categories or unnecessary filters. Keep source-code projects clearly secondary to tools people can open and use. Preserve the existing apps and their pipelines; a directory design pass does not certify or rewrite their functionality.

The directory implementation is now prepared as a separate draft. It uses three task anchors, seven screenshot cards, a shared card component, the existing folder artwork, concise input/outcome descriptions and an expandable source-code section. The three guide screenshots were captured from the actual public interfaces; the Lab screenshot uses its built-in SaaS renewal example. Application logic and pipelines are unchanged. Existing route and analytics tests now check the data-driven directory destinations and screenshot files.

The draft builds and all 77 tests pass. Visual acceptance is still pending: the Vercel preview requires authentication, automatic approval review rejected creation of a temporary access link without Diana's explicit permission, and the cloud browser blocks local file URLs. No access protection was changed. Do not call the directory visually accepted or release it until its real desktop/mobile layout is inspected. Next checks: 320/375/390/414/768/1024px and desktop; title wraps; screenshot crops; category anchors; native source-code disclosure; menu; card/source/service links; keyboard focus; reduced-motion hover behavior; no overflow or missing images.

## Remaining-page order

| Order | Page | Main work | Ready when |
| --- | --- | --- | --- |
| 1 | Tools directory (`/tools`) | Lead with real screenshots and clear outcomes. Organize by the task: AI costs, cloud bills, software renewals, markets, and guided decision tools. Distinguish use-now tools from source-code projects. Leave room for the planned capybara agent setup guide and future tools without advertising unfinished features. Match the homepage's rounded frames, spacing, italic tool titles, buttons and links. | A new visitor can identify the right tool, understand what to supply and what they get, and open it on mobile. |
| 2 | Services (`/services`) | Carry across the three service names and clear questions. Explain who each is for, inputs, deliverables, scope, and the next step. Keep the introduction friendly, simplify jargon and repetition, and align inquiry controls with the homepage. Preserve truthful credentials and a fixed scope/quote before work begins. | A business owner can pick a service and understand the next step without needing to know FinOps terminology. |
| 3 | Investing & Trading (`/learn`) | Show exactly what a beginner learns and receives. Use the Sunny / Chart Basics work as context once ready, with approachable examples and a clear inquiry. Keep unvalidated research separate from promises about trading results. | A beginner understands the lesson, preparation, takeaways and how to ask about it. |
| 4 | Insights hub and article (`/insights`, `/insights/is-this-software-worth-it`) | Match the approved newspaper-style writing section. Make the relationship between on-site articles, The Decision Layer, and Markets & Mimosas clear. Audit archive images, titles, descriptions, mobile reading measure and subscription links. | Visitors can choose a read and know where it opens, with comfortable article typography on phones. |
| 5 | Renewal resources and tracker (`/resources/software-renewal`, `/tools/software-renewal-tracker`) | Unify page framing, help text, tool inputs, examples, buttons and status messages. Preserve the working save/import/export/calendar behavior. Review the PDF and printable version alongside the page. | Someone can move from the article/checklist to their own subscription records without confusion. |
| 6 | Signal Audit and Interactive Lab (`/signal-audit`, `/interactive-lab`) | Review the promise, required inputs, progress, results, terminology, empty/error states and mobile controls. Carry over the visual language without dressing a workflow up with unnecessary decoration. | A first-time visitor understands why to use each tool and what the result means. |
| 7 | Service examples (`/services/examples`) and shared site details | Reassess whether examples earn their place, make their status clear, and remove repetitive copy. Sweep header/footer navigation, forms, 404, redirects, metadata, image weight, accessibility and link consistency across completed pages. | Pages connect naturally, navigation is consistent, and there are no dead ends. |

## Separate workstreams

- AI Cost Lens and Cloud Cost Guard are separate repositories/apps. Link to their released destinations, keep their homepage screenshots accurate, and coordinate their design passes without replacing existing pipelines or duplicating feature work.
- The Instagram homepage strip currently uses selected local covers and links. Automatic feed refresh is a separate integration task; decide its maintenance and account-authorization approach before promising automatic updates.
- The capybara agent, additional tools, and new research/articles belong in the build/content backlog. Add them to the directory when usable and clearly explained.

## Working rules

Use the homepage's established components and tokens. Keep imagery purposeful, copy concise, line breaks natural, and mobile spacing deliberate. Verify links, real inputs/results, keyboard use and reduced-motion behavior on each page. Preserve existing functionality and check visual changes in the browser; source inspection alone is not visual QA. Finish one page before beginning another redesign.
