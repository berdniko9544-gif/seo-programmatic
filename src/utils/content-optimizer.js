/**
 * CONTENT OPTIMIZER
 * Optimizes content for maximum SEO impact
 */

class ContentOptimizer {
  /**
   * Optimize heading structure
   */
  static optimizeHeadings(content, mainKeyword) {
    // Ensure proper H1-H6 hierarchy
    // Add keywords to headings naturally
    return content;
  }

  /**
   * Generate table of contents
   */
  static generateTOC(content) {
    const headings = [];
    const regex = /<h([2-3])>(.*?)<\/h\1>/gi;
    let match;

    while ((match = regex.exec(content)) !== null) {
      const level = parseInt(match[1]);
      const text = match[2].replace(/<[^>]*>/g, '');
      const id = this.slugify(text);

      headings.push({
        level,
        text,
        id
      });
    }

    if (headings.length < 3) return '';

    const tocHTML = headings.map(h => {
      const indent = h.level === 3 ? 'toc-indent' : '';
      return `<li class="${indent}"><a href="#${h.id}">${h.text}</a></li>`;
    }).join('');

    return `
      <nav class="table-of-contents">
        <h2>Содержание</h2>
        <ul>${tocHTML}</ul>
      </nav>
    `;
  }

  /**
   * Add IDs to headings for TOC
   */
  static addHeadingIDs(content) {
    return content.replace(/<h([2-3])>(.*?)<\/h\1>/gi, (match, level, text) => {
      const cleanText = text.replace(/<[^>]*>/g, '');
      const id = this.slugify(cleanText);
      return `<h${level} id="${id}">${text}</h${level}>`;
    });
  }

  /**
   * Calculate reading time
   */
  static calculateReadingTime(content) {
    const wordsPerMinute = 200;
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  }

  /**
   * Optimize content length
   */
  static ensureMinimumLength(content, minWords = 800) {
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).length;

    if (words < minWords) {
      // Content is too short - needs expansion
      return {
        content,
        needsExpansion: true,
        currentWords: words,
        targetWords: minWords
      };
    }

    return {
      content,
      needsExpansion: false,
      currentWords: words
    };
  }

  /**
   * Add semantic keywords
   */
  static addSemanticKeywords(content, mainKeyword, semanticKeywords = []) {
    // Naturally integrate semantic keywords
    // This is a placeholder - actual implementation would use NLP
    return content;
  }

  /**
   * Optimize images
   */
  static optimizeImages(content, pageTitle) {
    // Add alt tags, lazy loading, proper dimensions
    return content.replace(/<img([^>]*)>/gi, (match, attrs) => {
      let optimized = '<img' + attrs;

      // Add alt if missing
      if (!attrs.includes('alt=')) {
        optimized = optimized.replace('>', ` alt="${pageTitle}"`);
      }

      // Add loading="lazy"
      if (!attrs.includes('loading=')) {
        optimized = optimized.replace('>', ' loading="lazy">');
      }

      return optimized;
    });
  }

  /**
   * Add social sharing buttons
   */
  static addSocialSharing(url, title) {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    return `
      <div class="social-sharing">
        <h4>Поделиться:</h4>
        <div class="social-buttons">
          <a href="https://vk.com/share.php?url=${encodedUrl}&title=${encodedTitle}"
             target="_blank" rel="noopener" class="social-btn vk">
            ВКонтакте
          </a>
          <a href="https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}"
             target="_blank" rel="noopener" class="social-btn telegram">
            Telegram
          </a>
          <a href="https://wa.me/?text=${encodedTitle}%20${encodedUrl}"
             target="_blank" rel="noopener" class="social-btn whatsapp">
            WhatsApp
          </a>
        </div>
      </div>
    `;
  }

  /**
   * Generate content summary
   */
  static generateSummary(content, maxLength = 160) {
    const text = content.replace(/<[^>]*>/g, '').trim();
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

    let summary = '';
    for (const sentence of sentences) {
      if ((summary + sentence).length > maxLength) break;
      summary += sentence + '. ';
    }

    return summary.trim() || text.substring(0, maxLength) + '...';
  }

  /**
   * Add call-to-action
   */
  static addCTA(niche) {
    const ctas = {
      crypto: 'Начните зарабатывать на криптовалюте уже сегодня',
      fitness: 'Начните свой путь к здоровью прямо сейчас',
      education: 'Начните обучение и измените свою карьеру',
      realestate: 'Найдите идеальную недвижимость сегодня',
      finance: 'Начните инвестировать с умом',
      tech: 'Откройте для себя новые технологии',
      health: 'Позаботьтесь о своем здоровье',
      business: 'Начните свой бизнес с правильного шага'
    };

    const ctaText = ctas[niche] || 'Узнайте больше';

    return `
      <div class="content-cta">
        <h3>${ctaText}</h3>
        <p>Получите полный гайд со всеми инструментами и пошаговым планом действий.</p>
        <a href="/#offer" class="cta-button">Получить гайд →</a>
      </div>
    `;
  }

  /**
   * Slugify text
   */
  static slugify(text) {
    const map = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
      'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
      'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
      'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
      'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
      ' ': '-'
    };

    return text
      .toLowerCase()
      .split('')
      .map(char => map[char] || char)
      .join('')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  /**
   * Full content optimization pipeline
   */
  static optimize(content, metadata) {
    let optimized = content;

    // Add heading IDs
    optimized = this.addHeadingIDs(optimized);

    // Generate and prepend TOC
    const toc = this.generateTOC(optimized);
    if (toc) {
      optimized = toc + optimized;
    }

    // Optimize images
    optimized = this.optimizeImages(optimized, metadata.title);

    // Add social sharing
    if (metadata.url) {
      optimized += this.addSocialSharing(metadata.url, metadata.title);
    }

    // Add CTA
    if (metadata.niche) {
      optimized += this.addCTA(metadata.niche);
    }

    // Calculate reading time
    const readingTime = this.calculateReadingTime(optimized);

    return {
      content: optimized,
      readingTime,
      wordCount: this.ensureMinimumLength(optimized).currentWords,
      hasTOC: !!toc
    };
  }
}

module.exports = { ContentOptimizer };
