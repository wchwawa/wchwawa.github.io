import { profile, routes } from '../data/profile';

export function GET() {
  const urls = Object.values(routes).map(route => `<url><loc>${profile.site}${route}</loc><xhtml:link rel="alternate" hreflang="en" href="${profile.site}/"/><xhtml:link rel="alternate" hreflang="zh-CN" href="${profile.site}/zh/"/><xhtml:link rel="alternate" hreflang="x-default" href="${profile.site}/"/></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
