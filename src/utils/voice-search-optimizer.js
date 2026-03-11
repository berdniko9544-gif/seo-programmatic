/**
 * VOICE SEARCH OPTIMIZER
 * Optimizes content for voice search queries (Алиса, Google Assistant)
 */

class VoiceSearchOptimizer {
  /**
   * Generate voice search optimized content
   */
  static optimize(content, metadata) {
    const { title, keywords = [], niche } = metadata;

    // Add conversational Q&A section
    const voiceQueries = this.generateVoiceQueries(title, keywords, niche);
    const qaSection = this.formatQASection(voiceQueries);

    // Add featured snippet optimization
    const snippet = this.generateFeaturedSnippet(title, content);

    return {
      content: content + qaSection,
      snippet,
      voiceQueries
    };
  }

  /**
   * Generate voice search queries
   */
  static generateVoiceQueries(topic, keywords, niche) {
    const queries = [];

    // Question words common in Russian voice search
    const questionWords = [
      'как',
      'что такое',
      'где',
      'когда',
      'почему',
      'зачем',
      'сколько стоит',
      'какой',
      'можно ли'
    ];

    // Generate queries
    questionWords.forEach(qw => {
      queries.push({
        query: `${qw} ${topic.toLowerCase()}`,
        answer: this.generateShortAnswer(qw, topic, niche),
        type: 'voice'
      });
    });

    // Add "near me" queries for local
    queries.push({
      query: `${topic} рядом со мной`,
      answer: `${topic} доступно онлайн из любой точки России. Начните прямо сейчас.`,
      type: 'local'
    });

    // Add comparison queries
    keywords.slice(0, 2).forEach(keyword => {
      queries.push({
        query: `${topic} или ${keyword}`,
        answer: `${topic} и ${keyword} — разные подходы. ${topic} лучше подходит для начинающих.`,
        type: 'comparison'
      });
    });

    return queries;
  }

  /**
   * Generate short answer for voice
   */
  static generateShortAnswer(questionWord, topic, niche) {
    const templates = {
      'как': `Чтобы ${topic.toLowerCase()}, нужно: изучить основы, выбрать инструменты и начать практиковаться. Подробная инструкция в нашем гайде.`,
      'что такое': `${topic} — это современный подход в сфере ${niche}, который позволяет эффективно решать задачи и достигать результатов.`,
      'где': `${topic} можно освоить онлайн через специализированные платформы и курсы. Начните с нашего бесплатного гайда.`,
      'когда': `Начать ${topic.toLowerCase()} можно прямо сейчас. Базовые навыки осваиваются за 1-2 недели.`,
      'почему': `${topic} популярно благодаря высокому спросу, доступности инструментов и возможности заработка.`,
      'зачем': `${topic} нужно для развития навыков, заработка и карьерного роста в современной индустрии.`,
      'сколько стоит': `Начать ${topic.toLowerCase()} можно бесплатно. Профессиональные инструменты — от 1000 ₽/месяц.`,
      'какой': `Лучший способ ${topic.toLowerCase()} зависит от ваших целей. Для начинающих рекомендуем наш пошаговый гайд.`,
      'можно ли': `Да, ${topic.toLowerCase()} можно освоить самостоятельно. Главное — регулярная практика и правильные инструменты.`
    };

    return templates[questionWord] || `${topic} — актуальная тема в 2026 году. Подробности в нашем гайде.`;
  }

  /**
   * Format Q&A section for voice search
   */
  static formatQASection(queries) {
    const qaItems = queries.map(q => `
      <div class="voice-qa-item" itemscope itemtype="https://schema.org/Question">
        <h3 itemprop="name">${q.query}?</h3>
        <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
          <p itemprop="text">${q.answer}</p>
        </div>
      </div>
    `).join('');

    return `
      <section class="voice-search-optimized">
        <h2>Голосовой поиск: быстрые ответы</h2>
        <div class="voice-qa-list">
          ${qaItems}
        </div>
      </section>
    `;
  }

  /**
   * Generate featured snippet content
   */
  static generateFeaturedSnippet(topic, content) {
    // Extract first paragraph or generate summary
    const text = content.replace(/<[^>]*>/g, '');
    const firstParagraph = text.split('\n\n')[0];

    // Keep it short (40-60 words for featured snippets)
    const words = firstParagraph.split(/\s+/).slice(0, 50).join(' ');

    return {
      type: 'paragraph',
      content: words + '...',
      length: words.split(/\s+/).length
    };
  }

  /**
   * Generate speakable schema markup
   */
  static generateSpeakableSchema(content) {
    // Extract key sections for voice assistants
    const sections = [];

    // Find H2 sections
    const h2Regex = /<h2[^>]*>(.*?)<\/h2>/gi;
    let match;

    while ((match = h2Regex.exec(content)) !== null) {
      sections.push(match[1]);
    }

    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": [".voice-search-optimized", "h1", "h2"]
      }
    };
  }

  /**
   * Optimize for conversational queries
   */
  static addConversationalKeywords(keywords) {
    const conversational = [];

    keywords.forEach(keyword => {
      conversational.push(
        `как ${keyword}`,
        `что такое ${keyword}`,
        `${keyword} для начинающих`,
        `${keyword} пошагово`,
        `${keyword} самостоятельно`,
        `можно ли ${keyword}`,
        `стоит ли ${keyword}`
      );
    });

    return conversational;
  }

  /**
   * Generate complete voice optimization
   */
  static generateComplete(content, metadata) {
    const optimized = this.optimize(content, metadata);
    const speakableSchema = this.generateSpeakableSchema(optimized.content);
    const conversationalKeywords = this.addConversationalKeywords(metadata.keywords || []);

    return {
      ...optimized,
      speakableSchema,
      conversationalKeywords,
      voiceOptimized: true
    };
  }
}

module.exports = { VoiceSearchOptimizer };
