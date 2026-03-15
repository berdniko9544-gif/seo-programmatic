import { howToArticles } from '@/data/seo-data';
import { SITE_URL, SITE_NAME } from '@/config/site';
import { CONTENT_UPDATED_AT } from '@/config/content';

export async function GET() {
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME} — Блог о заработке на AI</title>
    <link>${SITE_URL}/blog</link>
    <description>Статьи о заработке на нейросетях и AI в 2026 году</description>
    <language>ru</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    ${howToArticles.map(article => `
    <item>
      <title>${article.title}</title>
      <link>${SITE_URL}/blog/${article.slug}</link>
      <description>${article.desc}</description>
      <pubDate>${new Date(CONTENT_UPDATED_AT).toUTCString()}</pubDate>
      <guid>${SITE_URL}/blog/${article.slug}</guid>
    </item>`).join('')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
