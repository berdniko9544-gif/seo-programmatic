/**
 * ROBOTS.TXT GENERATOR
 * Generates optimized robots.txt for maximum crawlability
 */

class RobotsGenerator {
  /**
   * Generate robots.txt content
   */
  static generate(baseUrl, options = {}) {
    const {
      allowAll = true,
      crawlDelay = null,
      additionalSitemaps = []
    } = options;

    let content = '';

    // User-agent rules
    if (allowAll) {
      content += 'User-agent: *\n';
      content += 'Allow: /\n\n';
    }

    // Crawl delay (if needed)
    if (crawlDelay) {
      content += `Crawl-delay: ${crawlDelay}\n\n`;
    }

    // Disallow admin/api routes
    content += '# Disallow admin and API routes\n';
    content += 'User-agent: *\n';
    content += 'Disallow: /api/\n';
    content += 'Disallow: /_next/\n';
    content += 'Disallow: /admin/\n\n';

    // Sitemap references
    content += '# Sitemaps\n';
    content += `Sitemap: ${baseUrl}/sitemap.xml\n`;

    additionalSitemaps.forEach(sitemap => {
      content += `Sitemap: ${baseUrl}${sitemap}\n`;
    });

    return content;
  }

  /**
   * Generate for multiple search engines
   */
  static generateAdvanced(baseUrl) {
    let content = '';

    // Google
    content += '# Google\n';
    content += 'User-agent: Googlebot\n';
    content += 'Allow: /\n';
    content += 'Crawl-delay: 0\n\n';

    // Yandex
    content += '# Yandex\n';
    content += 'User-agent: Yandex\n';
    content += 'Allow: /\n';
    content += 'Crawl-delay: 0\n\n';

    // Bing
    content += '# Bing\n';
    content += 'User-agent: Bingbot\n';
    content += 'Allow: /\n';
    content += 'Crawl-delay: 0\n\n';

    // All others
    content += '# All other bots\n';
    content += 'User-agent: *\n';
    content += 'Allow: /\n';
    content += 'Disallow: /api/\n';
    content += 'Disallow: /_next/\n\n';

    // Sitemap
    content += `Sitemap: ${baseUrl}/sitemap.xml\n`;

    return content;
  }
}

module.exports = { RobotsGenerator };
