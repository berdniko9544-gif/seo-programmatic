import { SITE_URL } from '@/config/site';
import { directions } from '@/data/seo-data';
import { toolCategories } from '@/data/seo-data';

export async function GET() {
  const images = [];

  // Add direction images
  directions.forEach(direction => {
    if (direction.image) {
      images.push({
        loc: `${SITE_URL}${direction.image}`,
        title: direction.name,
        caption: direction.description,
      });
    }
  });

  // Add tool category images
  toolCategories.forEach(category => {
    if (category.image) {
      images.push({
        loc: `${SITE_URL}${category.image}`,
        title: category.name,
        caption: `AI инструменты для ${category.name.toLowerCase()}`,
      });
    }

    // Add individual tool images if available
    category.tools?.forEach(tool => {
      if (tool.image) {
        images.push({
          loc: `${SITE_URL}${tool.image}`,
          title: tool.name,
          caption: tool.description || `${tool.name} - AI инструмент`,
        });
      }
    });
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${images.map(img => `  <url>
    <loc>${SITE_URL}</loc>
    <image:image>
      <image:loc>${escapeXml(img.loc)}</image:loc>
      <image:title>${escapeXml(img.title)}</image:title>
      ${img.caption ? `<image:caption>${escapeXml(img.caption)}</image:caption>` : ''}
    </image:image>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
