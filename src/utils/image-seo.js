/**
 * IMAGE SEO OPTIMIZER
 * Optimizes images for search engines and performance
 */

class ImageSEOOptimizer {
  /**
   * Generate descriptive alt text
   */
  static generateAltText(imageName, pageContext) {
    const { title, keywords = [], niche } = pageContext;

    // Remove file extension and clean up
    const baseName = imageName
      .replace(/\.(jpg|jpeg|png|gif|webp|svg)$/i, '')
      .replace(/[-_]/g, ' ')
      .trim();

    // If image name is descriptive, use it
    if (baseName.length > 5 && !baseName.match(/^\d+$/)) {
      return `${baseName} - ${title}`;
    }

    // Generate from context
    const keyword = keywords[0] || niche || 'изображение';
    return `${keyword} - ${title}`;
  }

  /**
   * Optimize image tags in HTML
   */
  static optimizeImages(html, pageContext) {
    return html.replace(/<img([^>]*)>/gi, (match, attrs) => {
      let optimized = attrs;

      // Extract src
      const srcMatch = attrs.match(/src=["']([^"']+)["']/);
      if (!srcMatch) return match;

      const src = srcMatch[1];
      const imageName = src.split('/').pop();

      // Add alt if missing
      if (!attrs.includes('alt=')) {
        const altText = this.generateAltText(imageName, pageContext);
        optimized += ` alt="${altText}"`;
      }

      // Add loading="lazy" if missing
      if (!attrs.includes('loading=')) {
        optimized += ' loading="lazy"';
      }

      // Add decoding="async" for better performance
      if (!attrs.includes('decoding=')) {
        optimized += ' decoding="async"';
      }

      // Add width/height if missing (prevents layout shift)
      if (!attrs.includes('width=') && !attrs.includes('height=')) {
        optimized += ' width="800" height="600"';
      }

      return `<img${optimized}>`;
    });
  }

  /**
   * Generate image sitemap
   */
  static generateImageSitemap(pages, baseUrl) {
    const urls = [];

    pages.forEach(page => {
      const images = this.extractImages(page.content || '');

      if (images.length > 0) {
        urls.push({
          loc: `${baseUrl}${page.url || page.path}`,
          images: images.map(img => ({
            loc: img.src.startsWith('http') ? img.src : `${baseUrl}${img.src}`,
            title: img.alt || page.title,
            caption: img.caption || ''
          }))
        });
      }
    });

    return this.formatImageSitemapXML(urls);
  }

  /**
   * Extract images from HTML
   */
  static extractImages(html) {
    const images = [];
    const regex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    let match;

    while ((match = regex.exec(html)) !== null) {
      const fullTag = match[0];
      const src = match[1];

      const altMatch = fullTag.match(/alt=["']([^"']+)["']/);
      const alt = altMatch ? altMatch[1] : '';

      images.push({ src, alt });
    }

    return images;
  }

  /**
   * Format image sitemap as XML
   */
  static formatImageSitemapXML(urls) {
    const urlEntries = urls.map(url => {
      const imageEntries = url.images.map(img => `
      <image:image>
        <image:loc>${this.escapeXML(img.loc)}</image:loc>
        <image:title>${this.escapeXML(img.title)}</image:title>
        ${img.caption ? `<image:caption>${this.escapeXML(img.caption)}</image:caption>` : ''}
      </image:image>`).join('');

      return `
  <url>
    <loc>${this.escapeXML(url.loc)}</loc>${imageEntries}
  </url>`;
    }).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urlEntries}
</urlset>`;
  }

  /**
   * Escape XML special characters
   */
  static escapeXML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * Generate WebP alternatives suggestion
   */
  static suggestWebP(imageSrc) {
    if (imageSrc.match(/\.(jpg|jpeg|png)$/i)) {
      return imageSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }
    return null;
  }

  /**
   * Generate responsive image srcset
   */
  static generateSrcSet(imageSrc, sizes = [400, 800, 1200]) {
    const ext = imageSrc.match(/\.(jpg|jpeg|png|webp)$/i)?.[0] || '.jpg';
    const base = imageSrc.replace(/\.(jpg|jpeg|png|webp)$/i, '');

    return sizes.map(size => `${base}-${size}w${ext} ${size}w`).join(', ');
  }
}

module.exports = { ImageSEOOptimizer };
