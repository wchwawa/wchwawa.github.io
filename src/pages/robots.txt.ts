import { profile } from '../data/profile';

export function GET() {
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${profile.site}/sitemap.xml\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
