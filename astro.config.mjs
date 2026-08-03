import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'hybrid', // <-- Zmiana na tryb hybrydowy
  adapter: cloudflare(),
  integrations: [tailwind()]
});