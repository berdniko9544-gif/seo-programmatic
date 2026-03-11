/**
 * SITEMAP GENERATOR FOR SATELLITES
 * Generates comprehensive sitemaps including all page types
 */

class SitemapGenerator {
  /**
   * Generate complete sitemap
   */
  static generate(baseUrl, pages) {
    const urls = [];

    // Homepage
    urls.push({
      url: baseUrl,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 1.0
    });

    // All pages
    pages.forEach(page => {
      urls.push({
        url: `${baseUrl}${page.url || page.path}`,
        lastmod: page.dateModified || new Date().toISOString(),
        changefreq: this.getChangeFreq(page.type),
        priority: this.getPriority(page.type)
      });
    });

    return this.formatXML(urls);
  }

  /**
   * Get change frequency by page type
   */
  static getChangeFreq(type) {
    const freqMap = {
      'direction': 'weekly',
      'article': 'weekly',
      'longtail': 'weekly',
      'tool': 'monthly',
      'city': 'monthly',
      'comparison': 'monthly',
      'audience': 'monthly'
    };

    return freqMap[type] || 'monthly';
  }

  /**
   * Get priority by page type
   */
  static getPriority(type) {
    const priorityMap = {
      'direction': 0.9,
      'article': 0.85,
      'longtail': 0.8,
      'tool': 0.75,
      'city': 0.7,
      'comparison': 0.7,
      'audience': 0.7
    };

    return priorityMap[type] || 0.6;
  }

  /**
   * Format as XML
   */
  static formatXML(urls) {
    const urlEntries = urls.map(url => `
  <url>
    <loc>${this.escapeXML(url.url)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlEntries}
</urlset>`;
  }

  /**
   * Escape XML special characters
   */
  static escapeXML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * Generate sitemap index (for large sites)
   */
  static generateIndex(baseUrl, sitemapUrls) {
    const sitemapEntries = sitemapUrls.map(url => `
  <sitemap>
    <loc>${this.escapeXML(url)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapEntries}
</sitemapindex>`;
  }

  /**
   * Split large sitemap into chunks (max 50,000 URLs per sitemap)
   */
  static splitSitemap(baseUrl, pages, maxUrlsPerSitemap = 50000) {
    const chunks = [];

    for (let i = 0; i < pages.length; i += maxUrlsPerSitemap) {
      const chunk = pages.slice(i, i + maxUrlsPerSitemap);
      chunks.push(this.generate(baseUrl, chunk));
    }

    return chunks;
  }
}

module.exports = { SitemapGenerator };
