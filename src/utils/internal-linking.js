/**
 * INTERNAL LINKING ENGINE
 * Automatically adds contextual internal links within content
 */

class InternalLinkingEngine {
  constructor(pages = []) {
    this.pages = pages;
    this.linkMap = this.buildLinkMap();
  }

  /**
   * Build keyword -> URL mapping
   */
  buildLinkMap() {
    const map = new Map();

    this.pages.forEach(page => {
      if (page.keywords && Array.isArray(page.keywords)) {
        page.keywords.forEach(keyword => {
          if (!map.has(keyword.toLowerCase())) {
            map.set(keyword.toLowerCase(), []);
          }
          map.get(keyword.toLowerCase()).push({
            url: page.url || page.path,
            title: page.title || page.name,
            type: page.type
          });
        });
      }
    });

    return map;
  }

  /**
   * Add internal links to content
   */
  addInternalLinks(content, currentUrl, maxLinks = 5) {
    if (!content || typeof content !== 'string') {
      return content;
    }

    let modifiedContent = content;
    const addedLinks = new Set();
    let linksAdded = 0;

    // Find potential link opportunities
    const opportunities = this.findLinkOpportunities(content, currentUrl);

    // Sort by relevance (longer keywords first)
    opportunities.sort((a, b) => b.keyword.length - a.keyword.length);

    for (const opp of opportunities) {
      if (linksAdded >= maxLinks) break;
      if (addedLinks.has(opp.keyword)) continue;

      // Replace first occurrence only
      const regex = new RegExp(`\\b${this.escapeRegex(opp.keyword)}\\b`, 'i');
      const match = modifiedContent.match(regex);

      if (match) {
        const replacement = `<a href="${opp.url}" title="${opp.title}">${match[0]}</a>`;
        modifiedContent = modifiedContent.replace(regex, replacement);
        addedLinks.add(opp.keyword);
        linksAdded++;
      }
    }

    return modifiedContent;
  }

  /**
   * Find link opportunities in content
   */
  findLinkOpportunities(content, currentUrl) {
    const opportunities = [];
    const contentLower = content.toLowerCase();

    this.linkMap.forEach((targets, keyword) => {
      // Skip if keyword is too short
      if (keyword.length < 4) return;

      // Check if keyword exists in content
      if (contentLower.includes(keyword)) {
        // Find relevant target (not current page)
        const target = targets.find(t => t.url !== currentUrl);
        if (target) {
          opportunities.push({
            keyword: keyword,
            url: target.url,
            title: target.title,
            type: target.type
          });
        }
      }
    });

    return opportunities;
  }

  /**
   * Generate related links section
   */
  generateRelatedLinks(currentPage, limit = 6) {
    const related = [];
    const currentKeywords = new Set(
      (currentPage.keywords || []).map(k => k.toLowerCase())
    );

    // Find pages with overlapping keywords
    this.pages.forEach(page => {
      if (page.url === currentPage.url) return;
      if (related.length >= limit) return;

      const pageKeywords = (page.keywords || []).map(k => k.toLowerCase());
      const overlap = pageKeywords.filter(k => currentKeywords.has(k)).length;

      if (overlap > 0) {
        related.push({
          url: page.url || page.path,
          title: page.title || page.name,
          description: page.description || page.desc,
          relevance: overlap
        });
      }
    });

    // Sort by relevance
    related.sort((a, b) => b.relevance - a.relevance);

    return related.slice(0, limit);
  }

  /**
   * Format related links as HTML
   */
  formatRelatedLinksHTML(links) {
    if (links.length === 0) return '';

    const linksHTML = links.map(link => `
      <div class="related-link-item">
        <a href="${link.url}">
          <h4>${link.title}</h4>
          ${link.description ? `<p>${link.description}</p>` : ''}
        </a>
      </div>
    `).join('');

    return `
      <section class="related-links-section">
        <h3>Читайте также:</h3>
        <div class="related-links-grid">
          ${linksHTML}
        </div>
      </section>
    `;
  }

  /**
   * Escape regex special characters
   */
  escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Update pages list
   */
  updatePages(pages) {
    this.pages = pages;
    this.linkMap = this.buildLinkMap();
  }
}

module.exports = { InternalLinkingEngine };
