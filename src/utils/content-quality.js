/**
 * CONTENT QUALITY ANALYZER
 * Analyzes and scores content quality for SEO
 */

class ContentQualityAnalyzer {
  /**
   * Analyze content and return quality score
   */
  static analyze(content, metadata) {
    const scores = {
      length: this.scoreLength(content),
      readability: this.scoreReadability(content),
      keywords: this.scoreKeywords(content, metadata.keywords || []),
      structure: this.scoreStructure(content),
      links: this.scoreLinks(content),
      media: this.scoreMedia(content),
      freshness: this.scoreFreshness(metadata)
    };

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.keys(scores).length;

    return {
      totalScore: Math.round(totalScore),
      scores,
      recommendations: this.generateRecommendations(scores),
      grade: this.getGrade(totalScore)
    };
  }

  /**
   * Score content length
   */
  static scoreLength(content) {
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).length;

    if (words >= 1500) return 100;
    if (words >= 1000) return 90;
    if (words >= 800) return 80;
    if (words >= 500) return 60;
    if (words >= 300) return 40;
    return 20;
  }

  /**
   * Score readability
   */
  static scoreReadability(content) {
    const text = content.replace(/<[^>]*>/g, '');
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.trim().split(/\s+/);

    if (sentences.length === 0 || words.length === 0) return 0;

    const avgWordsPerSentence = words.length / sentences.length;
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;

    // Optimal: 15-20 words per sentence, 5-7 chars per word
    let score = 100;

    if (avgWordsPerSentence > 25) score -= 20;
    else if (avgWordsPerSentence > 20) score -= 10;

    if (avgWordLength > 8) score -= 20;
    else if (avgWordLength > 7) score -= 10;

    return Math.max(0, score);
  }

  /**
   * Score keyword usage
   */
  static scoreKeywords(content, keywords) {
    if (keywords.length === 0) return 50;

    const text = content.toLowerCase().replace(/<[^>]*>/g, '');
    const words = text.split(/\s+/).length;

    let score = 0;
    let totalDensity = 0;

    keywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();
      const regex = new RegExp(keywordLower, 'gi');
      const matches = (text.match(regex) || []).length;
      const density = (matches / words) * 100;

      totalDensity += density;

      // Optimal density: 1-2%
      if (density >= 1 && density <= 2) {
        score += 100;
      } else if (density >= 0.5 && density <= 3) {
        score += 70;
      } else if (density > 0) {
        score += 40;
      }
    });

    return Math.min(100, score / keywords.length);
  }

  /**
   * Score content structure
   */
  static scoreStructure(content) {
    let score = 0;

    // Check for H1
    if (content.match(/<h1[^>]*>/i)) score += 20;

    // Check for H2/H3
    const h2Count = (content.match(/<h2[^>]*>/gi) || []).length;
    const h3Count = (content.match(/<h3[^>]*>/gi) || []).length;

    if (h2Count >= 3) score += 20;
    else if (h2Count >= 2) score += 15;
    else if (h2Count >= 1) score += 10;

    if (h3Count >= 2) score += 10;

    // Check for lists
    if (content.match(/<ul[^>]*>/i) || content.match(/<ol[^>]*>/i)) {
      score += 15;
    }

    // Check for paragraphs
    const pCount = (content.match(/<p[^>]*>/gi) || []).length;
    if (pCount >= 5) score += 15;
    else if (pCount >= 3) score += 10;

    // Check for bold/emphasis
    if (content.match(/<(strong|b)[^>]*>/i)) score += 10;

    // Check for tables
    if (content.match(/<table[^>]*>/i)) score += 10;

    return Math.min(100, score);
  }

  /**
   * Score internal/external links
   */
  static scoreLinks(content) {
    const internalLinks = (content.match(/<a[^>]+href=["'][^"']*["'][^>]*>/gi) || [])
      .filter(link => !link.includes('http://') && !link.includes('https://'));

    const externalLinks = (content.match(/<a[^>]+href=["']https?:\/\/[^"']*["'][^>]*>/gi) || []);

    let score = 0;

    // Internal links (more important)
    if (internalLinks.length >= 5) score += 50;
    else if (internalLinks.length >= 3) score += 40;
    else if (internalLinks.length >= 1) score += 25;

    // External links (authority signals)
    if (externalLinks.length >= 2) score += 30;
    else if (externalLinks.length >= 1) score += 20;

    // Check for nofollow on external links
    const nofollowCount = (content.match(/rel=["'][^"']*nofollow[^"']*["']/gi) || []).length;
    if (nofollowCount > 0) score += 20;

    return Math.min(100, score);
  }

  /**
   * Score media usage
   */
  static scoreMedia(content) {
    let score = 0;

    // Images
    const imgCount = (content.match(/<img[^>]*>/gi) || []).length;
    if (imgCount >= 3) score += 40;
    else if (imgCount >= 2) score += 30;
    else if (imgCount >= 1) score += 20;

    // Check for alt tags
    const altCount = (content.match(/alt=["'][^"']+["']/gi) || []).length;
    if (altCount === imgCount && imgCount > 0) score += 20;

    // Videos
    if (content.match(/<video[^>]*>/i) || content.match(/youtube\.com|youtu\.be/i)) {
      score += 20;
    }

    // Lazy loading
    if (content.match(/loading=["']lazy["']/i)) {
      score += 20;
    }

    return Math.min(100, score);
  }

  /**
   * Score content freshness
   */
  static scoreFreshness(metadata) {
    if (!metadata.dateModified) return 50;

    const now = new Date();
    const modified = new Date(metadata.dateModified);
    const daysSince = Math.floor((now - modified) / (1000 * 60 * 60 * 24));

    if (daysSince <= 7) return 100;
    if (daysSince <= 30) return 90;
    if (daysSince <= 90) return 70;
    if (daysSince <= 180) return 50;
    return 30;
  }

  /**
   * Generate recommendations
   */
  static generateRecommendations(scores) {
    const recommendations = [];

    if (scores.length < 80) {
      recommendations.push('Увеличьте объем контента до 1000+ слов');
    }

    if (scores.readability < 70) {
      recommendations.push('Упростите предложения (15-20 слов на предложение)');
    }

    if (scores.keywords < 70) {
      recommendations.push('Оптимизируйте плотность ключевых слов (1-2%)');
    }

    if (scores.structure < 70) {
      recommendations.push('Добавьте больше подзаголовков (H2, H3) и списков');
    }

    if (scores.links < 70) {
      recommendations.push('Добавьте 3-5 внутренних ссылок и 1-2 внешних');
    }

    if (scores.media < 70) {
      recommendations.push('Добавьте изображения с alt-текстом');
    }

    if (scores.freshness < 70) {
      recommendations.push('Обновите контент (добавьте актуальную информацию)');
    }

    return recommendations;
  }

  /**
   * Get letter grade
   */
  static getGrade(score) {
    if (score >= 90) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 80) return 'B+';
    if (score >= 75) return 'B';
    if (score >= 70) return 'C+';
    if (score >= 65) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  /**
   * Generate quality report
   */
  static generateReport(content, metadata) {
    const analysis = this.analyze(content, metadata);

    return {
      ...analysis,
      summary: `Content quality: ${analysis.grade} (${analysis.totalScore}/100)`,
      wordCount: content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = { ContentQualityAnalyzer };
