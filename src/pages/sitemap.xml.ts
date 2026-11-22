import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const urls = ['/', '/en/'].map(path => '<url><loc>' + new URL(path, site).href + '</loc></url>');
  return new Response('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + urls.join('') + '</urlset>', {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
};
