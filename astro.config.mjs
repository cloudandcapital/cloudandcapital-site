// @ts-check
import { defineConfig } from 'astro/config';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://cloudandcapital.com',
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
});
