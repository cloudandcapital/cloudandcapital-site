import type { APIRoute } from 'astro';

const pages = [
  '/',
  '/services',
  '/services/examples',
  '/learn',
  '/resources/software-renewal',
  '/insights',
  '/insights/using-ai-cost-lens',
  '/insights/using-the-renewal-tracker',
  '/insights/is-this-software-worth-it',
  '/tools',
  '/tools/software-renewal-tracker',
  '/signal-audit',
  '/interactive-lab',
];

export const GET: APIRoute = ({ site }) => {
  const baseUrl = site ?? new URL('https://cloudandcapital.com');
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...pages.map((path) => `  <url><loc>${new URL(path, baseUrl).href}</loc></url>`),
    '</urlset>',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
