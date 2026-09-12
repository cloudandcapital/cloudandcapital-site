# Cloud & Capital website

Production site for [cloudandcapital.com](https://cloudandcapital.com).

Built with [Astro](https://astro.build), deployed on Vercel.

## What this is

Cloud & Capital is Diana Molski's home for useful financial tools, clear analysis, and practical resources. It serves people learning about money, businesses trying to understand their costs, and teams managing cloud and AI spend.

## Pages

| Route | Description |
|---|---|
| `/` | Main site: interactive Invest / Spend / Build decision desk, audience pathways, featured tools, writing, professional background, and contact |
| `/work` | Tools and open source work across AI economics, technology costs, and markets |
| `/writing` | Cloud & Capital articles and Substack archive |
| `/ai-cost-lens` | Convenient 302 redirect to the AI Cost Lens production domain, https://lens.cloudandcapital.com |
| `/signal-audit` | Signal Audit: 5-minute cost diagnostic tool |
| `/interactive-lab` | Interactive Lab: decision briefs powered by Claude |
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
