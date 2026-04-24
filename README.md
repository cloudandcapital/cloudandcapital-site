# Cloud & Capital — Website

Production site for [cloudandcapital.com](https://cloudandcapital.com).

Built with [Astro](https://astro.build), deployed on Vercel.

## What this is

Cloud & Capital is a technology economics and FinOps practice. The site covers Diana's advisory work, open-source tools, writing (Markets & Mimosas on Substack), and community events (FinOps Weekly LA).

## Pages

| Route | Description |
|---|---|
| `/` | Main site — discipline, work, about, community, writing |
| `/audit` | Signal Audit — 5-minute cost diagnostic tool |
| `/interactive-lab` | Interactive Lab — AI-powered analysis tool |
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

- `src/pages/index.astro` — main site (all sections inline)
- `src/layouts/SiteLayout.astro` — layout for main site + 404
- `src/layouts/BaseLayout.astro` — layout for Signal Audit + Interactive Lab
- `public/images/` — all site images including OG image
