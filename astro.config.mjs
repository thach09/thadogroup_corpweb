import { defineConfig } from 'astro/config';

const origin = 'https://thadocorp.com';
const production = process.env.SITE_ENV === 'production';
if (production && process.env.SITE_URL !== origin) {
  throw new Error('Production builds require SITE_URL=' + origin);
}

export default defineConfig({
  site: origin,
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  build: { inlineStylesheets: 'never' },
  vite: {
    build: { assetsInlineLimit: 0 },
    define: { 'import.meta.env.PUBLIC_INDEX_SITE': JSON.stringify(production) }
  }
});
