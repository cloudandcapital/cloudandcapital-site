// @ts-check
import { defineConfig } from 'astro/config';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://cloudandcapital.com',
  // Preserve Astro 6 inline whitespace and the approved text wrapping.
  compressHTML: true,
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
});
