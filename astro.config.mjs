import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [mdx(), react()],
  output: 'static',
  adapter: vercel(),
  markdown: {
    remarkPlugins: [],
    rehypePlugins: []
  }
});