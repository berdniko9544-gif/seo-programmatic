/**
 * ANCHOR TEXT OPTIMIZER
 * Generates natural, varied anchor text for links
 */

class AnchorTextOptimizer {
  /**
   * Generate varied anchor texts for a keyword
   */
  static generateVariations(keyword, targetUrl, context = {}) {
    const variations = [];

    // Exact match (use sparingly - 10%)
    variations.push({
      text: keyword,
      type: 'exact',
      weight: 0.1
    });

    // Partial match (30%)
    variations.push(
      {
        text: `${keyword} в 2026`,
        type: 'partial',
        weight: 0.15
      },
      {
        text: `как ${keyword}`,
        type: 'partial',
        weight: 0.15
      }
    );

    // Branded (20%)
    variations.push(
      {
        text: `${keyword} от 1MB3`,
        type: 'branded',
        weight: 0.1
      },
      {
        text: `гайд по ${keyword}`,
        type: 'branded',
        weight: 0.1
      }
    );

    // Generic (20%)
    variations.push(
      {
        text: 'узнать больше',
        type: 'generic',
        weight: 0.05
      },
      {
        text: 'читать далее',
        type: 'generic',
        weight: 0.05
      },
      {
        text: 'подробнее здесь',
        type: 'generic',
        weight: 0.05
      },
      {
        text: 'полное руководство',
        type: 'generic',
        weight: 0.05
      }
    );

    // Naked URL (5%)
    variations.push({
      text: targetUrl.replace(/https?:\/\//, ''),
      type: 'naked',
      weight: 0.05
    });

    // LSI/Semantic (15%)
    const lsiVariations = this.generateLSIVariations(keyword);
    lsiVariations.forEach(lsi => {
      variations.push({
        text: lsi,
        type: 'lsi',
        weight: 0.15 / lsiVariations.length
      });
    });

    return variations;
  }

  /**
   * Generate LSI (Latent Semantic Indexing) variations
   */
  static generateLSIVariations(keyword) {
    const templates = [
      `инструкция по ${keyword}`,
      `руководство ${keyword}`,
      `советы по ${keyword}`,
      `${keyword}: полный гайд`,
      `все о ${keyword}`,
      `${keyword} для начинающих`
    ];

    return templates;
  }

  /**
   * Select anchor text based on distribution
   */
  static selectAnchorText(variations, usedAnchors = []) {
    // Filter out recently used anchors
    const available = variations.filter(v =>
      !usedAnchors.includes(v.text)
    );

    if (available.length === 0) {
      return variations[0].text; // Fallback
    }

    // Weighted random selection
    const totalWeight = available.reduce((sum, v) => sum + v.weight, 0);
    let random = Math.random() * totalWeight;

    for (const variation of available) {
      random -= variation.weight;
      if (random <= 0) {
        return variation.text;
      }
    }

    return available[0].text;
  }

  /**
   * Optimize anchor text in HTML
   */
  static optimizeAnchors(html, anchorMap = {}) {
    return html.replace(/<a([^>]+)>([^<]+)<\/a>/gi, (match, attrs, text) => {
      // Extract href
      const hrefMatch = attrs.match(/href=["']([^"']+)["']/);
      if (!hrefMatch) return match;

      const href = hrefMatch[1];

      // If we have a mapping for this URL, use optimized anchor
      if (anchorMap[href]) {
        const optimized = anchorMap[href];
        return `<a${attrs}>${optimized}</a>`;
      }

      return match;
    });
  }

  /**
   * Analyze anchor text distribution
   */
  static analyzeDistribution(links) {
    const distribution = {
      exact: 0,
      partial: 0,
      branded: 0,
      generic: 0,
      naked: 0,
      lsi: 0
    };

    links.forEach(link => {
      const type = this.classifyAnchor(link.text, link.targetKeyword);
      distribution[type]++;
    });

    const total = links.length;
    const percentages = {};

    Object.keys(distribution).forEach(type => {
      percentages[type] = ((distribution[type] / total) * 100).toFixed(1);
    });

    return {
      distribution,
      percentages,
      isNatural: this.isNaturalDistribution(percentages)
    };
  }

  /**
   * Classify anchor text type
   */
  static classifyAnchor(anchorText, targetKeyword) {
    const lower = anchorText.toLowerCase();
    const keywordLower = targetKeyword.toLowerCase();

    if (lower === keywordLower) return 'exact';
    if (lower.includes(keywordLower)) return 'partial';
    if (lower.includes('1mb3') || lower.includes('гайд')) return 'branded';
    if (lower.match(/^https?:\/\//)) return 'naked';
    if (lower.match(/узнать|читать|подробнее|далее|здесь/)) return 'generic';
    return 'lsi';
  }

  /**
   * Check if distribution is natural
   */
  static isNaturalDistribution(percentages) {
    // Natural distribution guidelines:
    // Exact: 5-15%
    // Partial: 20-40%
    // Branded: 15-25%
    // Generic: 15-25%
    // Naked: 3-10%
    // LSI: 10-20%

    const exact = parseFloat(percentages.exact);
    const partial = parseFloat(percentages.partial);

    if (exact > 20) return false; // Too many exact matches
    if (partial < 15) return false; // Too few partial matches

    return true;
  }

  /**
   * Generate anchor text strategy for page
   */
  static generateStrategy(page, allPages) {
    const strategy = {
      internal: [],
      external: [],
      recommendations: []
    };

    // Find related pages for internal linking
    const related = allPages
      .filter(p => p.url !== page.url)
      .slice(0, 5);

    related.forEach(relatedPage => {
      const keyword = relatedPage.keywords?.[0] || relatedPage.title;
      const variations = this.generateVariations(keyword, relatedPage.url);

      strategy.internal.push({
        targetUrl: relatedPage.url,
        targetKeyword: keyword,
        variations: variations,
        recommended: this.selectAnchorText(variations)
      });
    });

    return strategy;
  }
}

module.exports = { AnchorTextOptimizer };
