/**
 * LONG-TAIL KEYWORD GENERATOR
 * Generates ultra-specific pages for long-tail traffic
 */

class LongTailGenerator {
  /**
   * Generate long-tail variations
   */
  static generateVariations(baseKeyword, niche, options = {}) {
    const variations = [];

    // Question modifiers
    const questions = [
      'как', 'что такое', 'где', 'когда', 'почему', 'зачем',
      'сколько стоит', 'как выбрать', 'как начать', 'как работает'
    ];

    // Intent modifiers
    const intents = [
      'для начинающих', 'пошагово', 'с нуля', 'самостоятельно',
      'бесплатно', 'без опыта', 'быстро', 'эффективно',
      'в домашних условиях', 'онлайн', 'удаленно'
    ];

    // Time modifiers
    const timeModifiers = [
      '2026', 'в 2026 году', 'сегодня', 'сейчас',
      'за неделю', 'за месяц', 'за год'
    ];

    // Location modifiers (for Russian market)
    const locations = [
      'в России', 'в Москве', 'в СПб', 'в регионах',
      'для РФ', 'для СНГ'
    ];

    // Comparison modifiers
    const comparisons = [
      'vs', 'или', 'лучше чем', 'против',
      'сравнение', 'разница между'
    ];

    const commercialModifiers = [
      'для бизнеса', 'для фриланса', 'для агентства', 'под клиента',
      'с примерами оффера', 'с кейсами', 'с ценами', 'для продаж'
    ];

    const problemModifiers = [
      'без опыта', 'с нуля', 'без команды', 'с минимальным бюджетом',
      'если нет клиентов', 'если нужно быстро', 'для первой продажи'
    ];

    const audiences = options.audienceKeywords || [];
    const services = options.serviceKeywords || [];

    // Generate question-based variations
    questions.forEach(q => {
      variations.push({
        keyword: `${q} ${baseKeyword}`,
        type: 'question',
        priority: 0.8
      });
    });

    // Generate intent-based variations
    intents.forEach(intent => {
      variations.push({
        keyword: `${baseKeyword} ${intent}`,
        type: 'intent',
        priority: 0.9
      });
    });

    // Generate time-based variations
    timeModifiers.forEach(time => {
      variations.push({
        keyword: `${baseKeyword} ${time}`,
        type: 'time',
        priority: 0.85
      });
    });

    // Generate location-based variations
    locations.forEach(loc => {
      variations.push({
        keyword: `${baseKeyword} ${loc}`,
        type: 'location',
        priority: 0.75
      });
    });

    // Generate combined variations (high-value long-tail)
    questions.slice(0, 3).forEach(q => {
      intents.slice(0, 3).forEach(intent => {
        variations.push({
          keyword: `${q} ${baseKeyword} ${intent}`,
          type: 'combined',
          priority: 0.95
        });
      });
    });

    commercialModifiers.forEach(modifier => {
      variations.push({
        keyword: `${baseKeyword} ${modifier}`,
        type: 'commercial',
        priority: 0.96
      });
    });

    problemModifiers.forEach(modifier => {
      variations.push({
        keyword: `${baseKeyword} ${modifier}`,
        type: 'problem',
        priority: 0.94
      });
    });

    audiences.slice(0, 4).forEach(audience => {
      variations.push({
        keyword: `${baseKeyword} для ${audience}`,
        type: 'audience',
        priority: 0.9
      });
    });

    services.slice(0, 4).forEach(service => {
      variations.push({
        keyword: `${baseKeyword} ${service}`,
        type: 'service',
        priority: 0.88
      });
    });

    return variations;
  }

  /**
   * Generate niche-specific long-tail keywords
   */
  static generateNicheKeywords(niche, options = {}) {
    const templates = {
      'ai-copywriting': [
        'chatgpt для заработка',
        'ai-копирайтинг',
        'seo статьи на нейросетях',
        'контент для telegram на ai',
        'продающие тексты с chatgpt',
        'ai контент для бизнеса'
      ],
      'ai-design': [
        'midjourney для бизнеса',
        'ai-дизайн для маркетплейсов',
        'визуалы на нейросетях',
        'ai баннеры',
        'брендинг с ai',
        'карточки товаров на ai'
      ],
      'ai-automation': [
        'ai автоматизация бизнеса',
        'ai агент для продаж',
        'n8n с chatgpt',
        'боты для заявок',
        'автоматизация процессов нейросетями',
        'ai workflow для бизнеса'
      ],
      'ai-marketing': [
        'ai маркетинг',
        'нейросети для рекламы',
        'ai лидогенерация',
        'smm на нейросетях',
        'ai креативы для таргета',
        'контент-воронка на ai'
      ],
      'ai-video': [
        'ai видео для бизнеса',
        'reels на нейросетях',
        'видеоаватары для продаж',
        'ai озвучка роликов',
        'короткие ролики с ai',
        'видеопродакшн на нейросетях'
      ],
      'ai-business': [
        'ai услуги для бизнеса',
        'внедрение нейросетей в компанию',
        'ai сопровождение бизнеса',
        'чат-боты для бизнеса',
        'автоматизация бизнеса с ai',
        'ai отдел продаж'
      ],
      'ai-freelance': [
        'как заработать на ai',
        'ai фриланс',
        'первый клиент на нейросетях',
        'ai услуги без опыта',
        'удаленная работа с ai',
        'как продавать ai услуги'
      ],
      'ai-education': [
        'курс по нейросетям',
        'гайд по ai',
        'обучение chatgpt',
        'инфопродукт по ai',
        'вебинар по нейросетям',
        'обучение ai для бизнеса'
      ]
    };

    const baseKeywords = [
      ...(templates[niche] || templates['ai-business']),
      ...((options.seedKeywords || []).slice(0, 8))
    ];
    const allVariations = [];

    [...new Set(baseKeywords)].forEach(keyword => {
      const variations = this.generateVariations(keyword, niche, options);
      allVariations.push(...variations);
    });

    return allVariations;
  }

  /**
   * Generate page metadata for long-tail keyword
   */
  static generatePageMeta(keyword, niche) {
    const slug = this.keywordToSlug(keyword);

    return {
      slug: slug,
      title: `${this.capitalize(keyword)} — Полный гайд 2026`,
      h1: this.capitalize(keyword),
      description: `${this.capitalize(keyword)}: подробное руководство, инструменты, советы экспертов. Актуально для 2026 года.`,
      keywords: [keyword, niche, '2026', 'гайд', 'инструкция'],
      type: 'longtail'
    };
  }

  /**
   * Convert keyword to URL slug
   */
  static keywordToSlug(keyword) {
    const map = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
      'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
      'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
      'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
      'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
      ' ': '-'
    };

    return keyword
      .toLowerCase()
      .split('')
      .map(char => map[char] || char)
      .join('')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  /**
   * Capitalize first letter
   */
  static capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

module.exports = { LongTailGenerator };
