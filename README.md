# Cloud & Capital website

Production site for [cloudandcapital.com](https://cloudandcapital.com).

Built with [Astro](https://astro.build), deployed on Vercel.

## What this is

Cloud & Capital is Diana Molski's home for financial tools, technology-cost analysis, money and markets education, and business services. The site connects her finance and FinOps background with usable resources and clear starting points for visitors.

Business services are Technology Cost Review for growing technology teams with material cloud, AI or software costs; AI & Workflow Review for service businesses with recurring manual work; and Tool & Automation Setup for a defined business project. Fit depends on materiality and complexity, not company size alone. A few low-cost subscriptions are usually better served by free resources. Investing & Trading is a separate education path. Insights houses website articles and walkthroughs; Markets & Mimosas is the distinct newsletter.

## Pages

| Route | Description |
| --- | --- |
| `/` | Brand introduction, audience pathways, featured work, background and contact |
| `/services` | Three business services, process, background and inquiry form |
| `/services/examples` | Illustrative service examples |
| `/tools` | Financial and technology-cost tools, open-source work and renewal worksheet |
| `/learn` | Investing and beginner trading lesson topics and inquiry form |
| `/insights` | Website article index and Markets & Mimosas introduction |
| `/insights/is-this-software-worth-it` | Software-value article |
| `/resources/software-renewal` | Eight-question software renewal worksheet and PDF download |
| `/work` | Legacy redirect to `/tools` |
| `/writing` | Legacy redirect to the configured newsletter subscription destination |
| `/ai-cost-lens` | Redirect to https://lens.cloudandcapital.com |
| `/signal-audit` | Cost diagnostic tool |
| `/interactive-lab` | Decision briefs powered by Claude |
| `404` | Branded not-found page |

## Stack

- **Framework:** Astro
- **Fonts:** Cormorant Garamond · DM Sans · DM Mono (via @fontsource)
- **Analytics:** Google Analytics 4 (G-GXRMNTEB3B)
- **Deployment:** Vercel (auto-deploy on push to `main`)

## Development

```bash
npm install
npm run dev        # localhost:4321
npm run build      # production build
npm run preview    # preview build locally
```

## Brand

- Beige: `#F5EEE9` · Sage: `#6B8E7F` · Black: `#000000` · Gold: `#C9A961`
- Primary typeface: Cormorant Garamond (serif)
- Secondary: DM Sans (body) · DM Mono (labels, data)

## Key files

- `src/pages/index.astro`: main site
- `src/pages/ai-cost-lens.astro`: branded AI Cost Lens redirect
- `src/layouts/SiteLayout.astro`: compact layout for the 404 page
- `src/layouts/BaseLayout.astro`: shared navigation and footer for the main site and tools
- `public/images/`: all site images including OG image
