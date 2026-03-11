import { howToArticles } from '@/data/seo-data';

const BASE_URL = 'https://1mb3-seo.vercel.app';
const SITE_NAME = '1MB3 — ГАЙД 2026';

export async function GET() {
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME} — Блог о заработке на AI</title>
    <link>${BASE_URL}/blog</link>
    <description>Статьи о заработке на нейросетях и AI в 2026 году</description>
    <language>ru</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    ${howToArticles.map(article => `
    <item>
      <title>${article.title}</title>
      <link>${BASE_URL}/blog/${article.slug}</link>
      <description>${article.desc}</description>
      <pubDate>${new Date('2026-03-01').toUTCString()}</pubDate>
      <guid>${BASE_URL}/blog/${article.slug}</guid>
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
