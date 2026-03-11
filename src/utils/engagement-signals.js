/**
 * ENGAGEMENT SIGNAL GENERATOR
 * Adds social proof and engagement signals to boost credibility
 */

class EngagementSignalGenerator {
  /**
   * Generate view count
   */
  static generateViewCount(pageAge = 30, popularity = 'medium') {
    const multipliers = {
      low: 0.5,
      medium: 1.0,
      high: 2.0,
      viral: 5.0
    };

    const multiplier = multipliers[popularity] || 1.0;
    const baseViews = Math.floor(Math.random() * 500) + 100;
    const ageMultiplier = Math.sqrt(pageAge);

    return Math.floor(baseViews * multiplier * ageMultiplier);
  }

  /**
   * Generate reading time stats
   */
  static generateReadingStats(viewCount) {
    const avgReadTime = 3 + Math.floor(Math.random() * 5); // 3-8 minutes
    const completionRate = 0.4 + Math.random() * 0.3; // 40-70%

    return {
      avgReadTime: `${avgReadTime} мин`,
      completionRate: `${(completionRate * 100).toFixed(0)}%`,
      totalReads: Math.floor(viewCount * completionRate)
    };
  }

  /**
   * Generate share counts
   */
  static generateShareCounts(viewCount) {
    const shareRate = 0.02 + Math.random() * 0.03; // 2-5% share rate
    const totalShares = Math.floor(viewCount * shareRate);

    // Distribute across platforms
    return {
      vk: Math.floor(totalShares * 0.4),
      telegram: Math.floor(totalShares * 0.35),
      whatsapp: Math.floor(totalShares * 0.15),
      other: Math.floor(totalShares * 0.1),
      total: totalShares
    };
  }

  /**
   * Generate user testimonials
   */
  static generateTestimonials(niche, count = 3) {
    const names = [
      'Алексей М.', 'Мария К.', 'Дмитрий П.', 'Анна С.',
      'Сергей В.', 'Елена Р.', 'Иван Л.', 'Ольга Н.',
      'Максим Т.', 'Наталья Б.'
    ];

    const templates = {
      crypto: [
        'Отличный гайд! Начал зарабатывать уже через неделю.',
        'Все понятно объяснено, даже для новичка. Рекомендую!',
        'Благодаря этому материалу вышел на стабильный доход.',
        'Лучшее руководство по теме, что я находил.'
      ],
      fitness: [
        'Результаты уже через месяц! Спасибо за подробный план.',
        'Все работает, главное следовать инструкциям.',
        'Наконец-то понятное объяснение без воды.',
        'Рекомендую всем, кто хочет начать.'
      ],
      education: [
        'Прошел обучение по этому гайду, получил первого клиента!',
        'Структурированная информация, ничего лишнего.',
        'Отличный материал для старта карьеры.',
        'Все инструменты работают, проверено.'
      ],
      default: [
        'Очень полезная информация, все по делу.',
        'Помогло разобраться в теме с нуля.',
        'Рекомендую к изучению!',
        'Качественный контент, спасибо автору.'
      ]
    };

    const nicheTemplates = templates[niche] || templates.default;
    const testimonials = [];

    for (let i = 0; i < count; i++) {
      const name = names[Math.floor(Math.random() * names.length)];
      const text = nicheTemplates[Math.floor(Math.random() * nicheTemplates.length)];
      const rating = 4 + Math.floor(Math.random() * 2); // 4-5 stars
      const daysAgo = Math.floor(Math.random() * 30) + 1;

      testimonials.push({
        name,
        text,
        rating,
        date: this.formatRelativeDate(daysAgo),
        verified: Math.random() > 0.3 // 70% verified
      });
    }

    return testimonials;
  }

  /**
   * Format relative date
   */
  static formatRelativeDate(daysAgo) {
    if (daysAgo === 0) return 'сегодня';
    if (daysAgo === 1) return 'вчера';
    if (daysAgo < 7) return `${daysAgo} дн. назад`;
    if (daysAgo < 30) return `${Math.floor(daysAgo / 7)} нед. назад`;
    return `${Math.floor(daysAgo / 30)} мес. назад`;
  }

  /**
   * Generate trust badges
   */
  static generateTrustBadges() {
    return [
      {
        icon: '✓',
        text: 'Проверено экспертами',
        type: 'expert'
      },
      {
        icon: '🔒',
        text: 'Безопасно',
        type: 'security'
      },
      {
        icon: '⚡',
        text: 'Актуально 2026',
        type: 'freshness'
      },
      {
        icon: '👥',
        text: '1000+ пользователей',
        type: 'social'
      }
    ];
  }

  /**
   * Format testimonials as HTML
   */
  static formatTestimonialsHTML(testimonials) {
    const items = testimonials.map(t => `
      <div class="testimonial-item">
        <div class="testimonial-header">
          <span class="testimonial-name">${t.name}</span>
          ${t.verified ? '<span class="verified-badge">✓ Проверено</span>' : ''}
          <span class="testimonial-rating">${'⭐'.repeat(t.rating)}</span>
        </div>
        <p class="testimonial-text">"${t.text}"</p>
        <span class="testimonial-date">${t.date}</span>
      </div>
    `).join('');

    return `
      <section class="testimonials-section">
        <h3>Отзывы пользователей</h3>
        <div class="testimonials-grid">
          ${items}
        </div>
      </section>
    `;
  }

  /**
   * Format engagement stats as HTML
   */
  static formatStatsHTML(stats) {
    return `
      <div class="engagement-stats">
        <div class="stat-item">
          <span class="stat-icon">👁️</span>
          <span class="stat-value">${stats.viewCount.toLocaleString('ru-RU')}</span>
          <span class="stat-label">просмотров</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon">⏱️</span>
          <span class="stat-value">${stats.readingStats.avgReadTime}</span>
          <span class="stat-label">среднее время</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon">📤</span>
          <span class="stat-value">${stats.shareCounts.total}</span>
          <span class="stat-label">поделились</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon">✓</span>
          <span class="stat-value">${stats.readingStats.completionRate}</span>
          <span class="stat-label">дочитали</span>
        </div>
      </div>
    `;
  }

  /**
   * Generate complete engagement signals
   */
  static generate(pageData) {
    const { niche, pageAge = 30, popularity = 'medium' } = pageData;

    const viewCount = this.generateViewCount(pageAge, popularity);
    const readingStats = this.generateReadingStats(viewCount);
    const shareCounts = this.generateShareCounts(viewCount);
    const testimonials = this.generateTestimonials(niche, 3);
    const trustBadges = this.generateTrustBadges();

    return {
      viewCount,
      readingStats,
      shareCounts,
      testimonials,
      trustBadges,
      html: {
        stats: this.formatStatsHTML({ viewCount, readingStats, shareCounts }),
        testimonials: this.formatTestimonialsHTML(testimonials),
        badges: this.formatBadgesHTML(trustBadges)
      }
    };
  }

  /**
   * Format trust badges as HTML
   */
  static formatBadgesHTML(badges) {
    const items = badges.map(b => `
      <span class="trust-badge trust-badge-${b.type}">
        ${b.icon} ${b.text}
      </span>
    `).join('');

    return `<div class="trust-badges">${items}</div>`;
  }

  /**
   * Generate social proof schema
   */
  static generateSchema(testimonials, rating) {
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": rating || "4.7",
        "reviewCount": testimonials.length
      },
      "review": testimonials.map(t => ({
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": t.name
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": t.rating
        },
        "reviewBody": t.text
      }))
    };
  }
}

module.exports = { EngagementSignalGenerator };
