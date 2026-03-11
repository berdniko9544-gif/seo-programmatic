/**
 * RSS FEED GENERATOR
 * Generates RSS feeds for satellites
 */

export class RSSGenerator {
  /**
   * Generate RSS feed
   */
  generate(options) {
    const {
      title,
      description,
      url,
      items = [],
    } = options;

    const rssItems = items.slice(0, 20).map(item => this.generateItem(item)).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${this.escapeXML(title)}</title>
    <description>${this.escapeXML(description)}</description>
    <link>${this.escapeXML(url)}</link>
    <atom:link href="${this.escapeXML(url)}/rss.xml" rel="self" type="application/rss+xml" />
    <language>ru</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${rssItems}
  </channel>
</rss>`;
  }

  /**
   * Generate RSS item
   */
  generateItem(item) {
    return `    <item>
      <title>${this.escapeXML(item.title)}</title>
      <description>${this.escapeXML(item.description)}</description>
      <link>${this.escapeXML(item.url)}</link>
      <guid>${this.escapeXML(item.url)}</guid>
      <pubDate>${new Date(item.date || Date.now()).toUTCString()}</pubDate>
    </item>`;
  }

  /**
   * Escape XML special characters
   */
  escapeXML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

// Support both CommonJS and ES modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RSSGenerator };
}
