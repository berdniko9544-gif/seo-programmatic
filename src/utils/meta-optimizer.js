/**
 * META TAG OPTIMIZER
 * Generates and optimizes meta tags for maximum CTR
 */

class MetaTagOptimizer {
  /**
   * Generate optimized title tag
   */
  static generateTitle(data) {
    const { title, keyword, niche, year = '2026' } = data;

    // Optimal length: 50-60 characters
    let optimizedTitle = title;

    // Add year if not present
    if (!optimizedTitle.includes(year)) {
      optimizedTitle = `${optimizedTitle} ${year}`;
    }

    // Add power words if space allows
    if (optimizedTitle.length < 50) {
      const powerWords = ['✓', '→', '🔥', 'Полный гайд', 'Инструкция'];
      const powerWord = powerWords[Math.floor(Math.random() * powerWords.length)];

      if (optimizedTitle.length + powerWord.length + 3 <= 60) {
        optimizedTitle = `${powerWord} ${optimizedTitle}`;
      }
    }

    // Truncate if too long
    if (optimizedTitle.length > 60) {
      optimizedTitle = optimizedTitle.substring(0, 57) + '...';
    }

    return optimizedTitle;
  }

  /**
   * Generate compelling meta description
   */
  static generateDescription(data) {
    const { title, keyword, niche, benefits = [] } = data;

    // Optimal length: 150-160 characters
    const templates = [
      `${keyword}: полное руководство 2026. Инструменты, примеры, пошаговый план. Начните зарабатывать уже сегодня!`,
      `Узнайте всё о ${keyword}. Проверенные методы, инструменты, реальные кейсы. Гайд для начинающих и профи.`,
      `${keyword} в 2026: актуальные способы, инструменты, стратегии. Бесплатные материалы и практические советы.`,
      `Полный гайд по ${keyword}. От основ до профессионального уровня. Инструменты, примеры, план действий.`
    ];

    let description = templates[Math.floor(Math.random() * templates.length)];

    // Ensure optimal length
    if (description.length > 160) {
      description = description.substring(0, 157) + '...';
    }

    return description;
  }

  /**
   * Generate Open Graph tags
   */
  static generateOpenGraph(data) {
    const { title, description, url, image, type = 'article' } = data;

    return {
      'og:type': type,
      'og:title': title,
      'og:description': description,
      'og:url': url,
      'og:image': image || '/og-image.png',
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:locale': 'ru_RU',
      'og:site_name': '1MB3'
    };
  }

  /**
   * Generate Twitter Card tags
   */
  static generateTwitterCard(data) {
    const { title, description, image } = data;

    return {
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': image || '/og-image.png'
    };
  }

  /**
   * Generate VK tags (for Russian social network)
   */
  static generateVKTags(data) {
    const { title, description, image } = data;

    return {
      'vk:title': title,
      'vk:description': description,
      'vk:image': image || '/og-image.png'
    };
  }

  /**
   * Generate all meta tags
   */
  static generateAll(data) {
    return {
      title: this.generateTitle(data),
      description: this.generateDescription(data),
      openGraph: this.generateOpenGraph(data),
      twitter: this.generateTwitterCard(data),
      vk: this.generateVKTags(data),
      canonical: data.url,
      robots: 'index, follow',
      keywords: (data.keywords || []).join(', ')
    };
  }

  /**
   * Format meta tags as HTML
   */
  static formatHTML(metaTags) {
    let html = '';

    // Basic meta tags
    html += `<title>${metaTags.title}</title>\n`;
    html += `<meta name="description" content="${metaTags.description}">\n`;

    if (metaTags.keywords) {
      html += `<meta name="keywords" content="${metaTags.keywords}">\n`;
    }

    html += `<meta name="robots" content="${metaTags.robots}">\n`;
    html += `<link rel="canonical" href="${metaTags.canonical}">\n`;

    // Open Graph
    Object.entries(metaTags.openGraph).forEach(([key, value]) => {
      html += `<meta property="${key}" content="${value}">\n`;
    });

    // Twitter
    Object.entries(metaTags.twitter).forEach(([key, value]) => {
      html += `<meta name="${key}" content="${value}">\n`;
    });

    // VK
    Object.entries(metaTags.vk).forEach(([key, value]) => {
      html += `<meta property="${key}" content="${value}">\n`;
    });

    return html;
  }

  /**
   * Validate meta tags
   */
  static validate(metaTags) {
    const issues = [];

    // Check title length
    if (metaTags.title.length < 30) {
      issues.push('Title too short (< 30 chars)');
    }
    if (metaTags.title.length > 60) {
      issues.push('Title too long (> 60 chars)');
    }

    // Check description length
    if (metaTags.description.length < 120) {
      issues.push('Description too short (< 120 chars)');
    }
    if (metaTags.description.length > 160) {
      issues.push('Description too long (> 160 chars)');
    }

    // Check for duplicate title/description
    if (metaTags.title === metaTags.description) {
      issues.push('Title and description are identical');
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }

  /**
   * Generate meta tags for different page types
   */
  static generateForPageType(pageType, data) {
    const baseData = {
      ...data,
      year: '2026'
    };

    switch (pageType) {
      case 'longtail':
        return this.generateAll({
          ...baseData,
          title: data.title || data.keyword,
          keyword: data.keyword
        });

      case 'article':
        return this.generateAll({
          ...baseData,
          type: 'article'
        });

      case 'direction':
        return this.generateAll({
          ...baseData,
          type: 'website'
        });

      default:
        return this.generateAll(baseData);
    }
  }
}

module.exports = { MetaTagOptimizer };
