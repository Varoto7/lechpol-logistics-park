import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  // Usuwamy output 'server' i adapter cloudflare, przechodzimy na statyczny HTML
  integrations: [tailwind()]
});