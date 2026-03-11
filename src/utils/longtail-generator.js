/**
 * LONG-TAIL KEYWORD GENERATOR
 * Generates ultra-specific pages for long-tail traffic
 */

class LongTailGenerator {
  /**
   * Generate long-tail variations
   */
  static generateVariations(baseKeyword, niche) {
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

    return variations;
  }

  /**
   * Generate niche-specific long-tail keywords
   */
  static generateNicheKeywords(niche) {
    const templates = {
      crypto: [
        'заработок на криптовалюте',
        'торговля криптой',
        'майнинг биткоина',
        'стейкинг криптовалюты',
        'NFT заработок',
        'DeFi инвестиции'
      ],
      fitness: [
        'программа тренировок',
        'похудение',
        'набор мышечной массы',
        'домашние тренировки',
        'питание для спортсменов',
        'фитнес для начинающих'
      ],
      education: [
        'онлайн обучение',
        'курсы программирования',
        'изучение языков',
        'дистанционное образование',
        'профессиональные курсы',
        'самообразование'
      ],
      realestate: [
        'покупка квартиры',
        'ипотека',
        'инвестиции в недвижимость',
        'аренда жилья',
        'продажа недвижимости',
        'оценка квартиры'
      ],
      finance: [
        'инвестиции',
        'пассивный доход',
        'финансовая грамотность',
        'накопления',
        'кредиты',
        'страхование'
      ],
      tech: [
        'новые технологии',
        'гаджеты',
        'программное обеспечение',
        'IT решения',
        'цифровизация',
        'автоматизация'
      ],
      health: [
        'здоровый образ жизни',
        'правильное питание',
        'профилактика заболеваний',
        'витамины',
        'медицинские услуги',
        'здоровье'
      ],
      business: [
        'открытие бизнеса',
        'бизнес идеи',
        'маркетинг',
        'продажи',
        'управление бизнесом',
        'стартап'
      ]
    };

    const baseKeywords = templates[niche] || templates.business;
    const allVariations = [];

    baseKeywords.forEach(keyword => {
      const variations = this.generateVariations(keyword, niche);
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
