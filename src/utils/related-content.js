/**
 * RELATED CONTENT RECOMMENDER
 * Suggests related pages to increase dwell time and reduce bounce rate
 */

class RelatedContentRecommender {
  /**
   * Find related pages based on keywords and type
   */
  static findRelated(currentPage, allPages, limit = 6) {
    if (!allPages || allPages.length === 0) return [];

    const currentKeywords = new Set(
      (currentPage.keywords || []).map(k => k.toLowerCase())
    );

    const scored = allPages
      .filter(page => page.url !== currentPage.url)
      .map(page => {
        let score = 0;

        // Keyword overlap (highest weight)
        const pageKeywords = (page.keywords || []).map(k => k.toLowerCase());
        const overlap = pageKeywords.filter(k => currentKeywords.has(k)).length;
        score += overlap * 10;

        // Same niche (medium weight)
        if (page.niche === currentPage.niche) {
          score += 5;
        }

        // Same type (low weight)
        if (page.type === currentPage.type) {
          score += 2;
        }

        // Boost recent content
        if (page.dateModified) {
          const daysSinceUpdate = this.getDaysSince(page.dateModified);
          if (daysSinceUpdate < 7) score += 3;
          else if (daysSinceUpdate < 30) score += 1;
        }

        return { page, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return scored.map(item => item.page);
  }

  /**
   * Format related content as HTML
   */
  static formatHTML(relatedPages) {
    if (!relatedPages || relatedPages.length === 0) return '';

    const items = relatedPages.map(page => `
      <div class="related-item">
        <a href="${page.url || page.path}">
          <h4>${page.title || page.name}</h4>
          ${page.description ? `<p>${page.description}</p>` : ''}
          ${page.readTime ? `<span class="read-time">⏱️ ${page.readTime}</span>` : ''}
        </a>
      </div>
    `).join('');

    return `
      <section class="related-content">
        <h3>Читайте также</h3>
        <div class="related-grid">
          ${items}
        </div>
      </section>
    `;
  }

  /**
   * Generate "Popular" badge for trending content
   */
  static generatePopularBadge(page, allPages) {
    // Simulate popularity based on page characteristics
    const isPopular = this.isPopular(page, allPages);

    if (isPopular) {
      return '<span class="badge badge-popular">🔥 Популярное</span>';
    }

    return '';
  }

  /**
   * Check if page should be marked as popular
   */
  static isPopular(page, allPages) {
    // Mark as popular if:
    // 1. Recent update (within 7 days)
    if (page.dateModified) {
      const daysSince = this.getDaysSince(page.dateModified);
      if (daysSince < 7) return true;
    }

    // 2. High priority page type
    const popularTypes = ['direction', 'article', 'longtail'];
    if (popularTypes.includes(page.type)) {
      // 30% chance for these types
      return Math.random() < 0.3;
    }

    return false;
  }

  /**
   * Generate "New" badge for fresh content
   */
  static generateNewBadge(page) {
    if (page.datePublished) {
      const daysSince = this.getDaysSince(page.datePublished);
      if (daysSince < 3) {
        return '<span class="badge badge-new">✨ Новое</span>';
      }
    }

    return '';
  }

  /**
   * Generate "Updated" badge
   */
  static generateUpdatedBadge(page) {
    if (page.dateModified && page.datePublished) {
      const daysSinceUpdate = this.getDaysSince(page.dateModified);
      const daysSincePublish = this.getDaysSince(page.datePublished);

      // If updated recently but not newly published
      if (daysSinceUpdate < 7 && daysSincePublish > 7) {
        return '<span class="badge badge-updated">🔄 Обновлено</span>';
      }
    }

    return '';
  }

  /**
   * Get all badges for page
   */
  static getAllBadges(page, allPages) {
    const badges = [];

    const newBadge = this.generateNewBadge(page);
    if (newBadge) badges.push(newBadge);

    const updatedBadge = this.generateUpdatedBadge(page);
    if (updatedBadge) badges.push(updatedBadge);

    const popularBadge = this.generatePopularBadge(page, allPages);
    if (popularBadge) badges.push(popularBadge);

    return badges.join(' ');
  }

  /**
   * Calculate days since date
   */
  static getDaysSince(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * Generate complete related content section
   */
  static generate(currentPage, allPages, limit = 6) {
    const related = this.findRelated(currentPage, allPages, limit);

    return {
      pages: related,
      html: this.formatHTML(related),
      badges: this.getAllBadges(currentPage, allPages)
    };
  }
}

module.exports = { RelatedContentRecommender };
