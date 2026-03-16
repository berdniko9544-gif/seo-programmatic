/**
 * GLOSSARY GENERATOR
 * Generates glossary/dictionary pages for SEO traffic
 */

class GlossaryGenerator {
  /**
   * Generate glossary terms for a niche
   */
  static generateGlossary(niche, count = 500) {
    const terms = [];
    const baseTerms = this.getBaseTerms(niche);
    
    // Generate variations of base terms
    baseTerms.forEach(baseTerm => {
      const variations = this.generateTermVariations(baseTerm, niche);
      terms.push(...variations);
    });
    
    // Limit to requested count
    return terms.slice(0, count).map(term => ({
      ...term,
      type: 'glossary',
      url: `/glossary/${term.slug}`,
      path: `/glossary/${term.slug}`
    }));
  }

  /**
   * Get base terms for niche
   */
  static getBaseTerms(niche) {
    const commonAITerms = [
      { term: 'промпт', definition: 'Текстовая инструкция для нейросети, описывающая желаемый результат' },
      { term: 'токен', definition: 'Единица текста для обработки нейросетью (слово, часть слова или символ)' },
      { term: 'fine-tuning', definition: 'Дообучение нейросети на специфических данных для улучшения результатов' },
      { term: 'температура', definition: 'Параметр креативности нейросети (0-2): чем выше, тем более случайные ответы' },
      { term: 'контекст', definition: 'Объем информации, который нейросеть может обработать за один запрос' },
      { term: 'API', definition: 'Программный интерфейс для взаимодействия с нейросетью через код' },
      { term: 'embedding', definition: 'Векторное представление текста для семантического поиска и анализа' },
      { term: 'RAG', definition: 'Retrieval-Augmented Generation - метод улучшения ответов через поиск в базе знаний' },
      { term: 'LLM', definition: 'Large Language Model - большая языковая модель типа GPT или Claude' },
      { term: 'zero-shot', definition: 'Способность нейросети выполнять задачи без предварительного обучения на примерах' },
      { term: 'few-shot', definition: 'Обучение нейросети на нескольких примерах прямо в промпте' },
      { term: 'chain-of-thought', definition: 'Техника промптинга с пошаговым рассуждением для сложных задач' },
      { term: 'hallucination', definition: 'Ошибка нейросети, когда она выдумывает несуществующие факты' },
      { term: 'inference', definition: 'Процесс получения ответа от обученной нейросети' },
      { term: 'latency', definition: 'Время задержки между запросом и ответом нейросети' }
    ];

    const businessTerms = [
      { term: 'ROI', definition: 'Return on Investment - возврат инвестиций, показатель эффективности вложений' },
      { term: 'конверсия', definition: 'Процент посетителей, совершивших целевое действие (покупка, заявка, подписка)' },
      { term: 'воронка продаж', definition: 'Последовательность этапов от первого контакта до покупки' },
      { term: 'лидогенерация', definition: 'Процесс привлечения потенциальных клиентов (лидов)' },
      { term: 'CRM', definition: 'Customer Relationship Management - система управления взаимоотношениями с клиентами' },
      { term: 'MVP', definition: 'Minimum Viable Product - минимально жизнеспособный продукт для тестирования идеи' },
      { term: 'unit-экономика', definition: 'Расчет прибыли и убытков на одного клиента или единицу продукта' },
      { term: 'LTV', definition: 'Lifetime Value - пожизненная ценность клиента, общая прибыль от него' },
      { term: 'CAC', definition: 'Customer Acquisition Cost - стоимость привлечения одного клиента' },
      { term: 'churn rate', definition: 'Процент клиентов, которые перестали пользоваться услугой' }
    ];

    const marketingTerms = [
      { term: 'таргетинг', definition: 'Настройка рекламы на определенную аудиторию по параметрам' },
      { term: 'ретаргетинг', definition: 'Показ рекламы пользователям, которые уже взаимодействовали с сайтом' },
      { term: 'CTR', definition: 'Click-Through Rate - процент кликов по рекламе от числа показов' },
      { term: 'CPM', definition: 'Cost Per Mille - стоимость 1000 показов рекламы' },
      { term: 'CPC', definition: 'Cost Per Click - стоимость одного клика по рекламе' },
      { term: 'CPA', definition: 'Cost Per Action - стоимость целевого действия (заявка, покупка)' },
      { term: 'SEO', definition: 'Search Engine Optimization - оптимизация сайта для поисковых систем' },
      { term: 'SMM', definition: 'Social Media Marketing - маркетинг в социальных сетях' },
      { term: 'контент-маркетинг', definition: 'Привлечение клиентов через полезный контент' },
      { term: 'email-маркетинг', definition: 'Продвижение через рассылки по электронной почте' }
    ];

    return [...commonAITerms, ...businessTerms, ...marketingTerms];
  }

  /**
   * Generate variations of a term
   */
  static generateTermVariations(baseTerm, niche) {
    const variations = [];
    
    // Base term
    variations.push({
      term: baseTerm.term,
      slug: this.slugify(baseTerm.term),
      title: `Что такое ${baseTerm.term}: определение, примеры, применение`,
      h1: `Что такое ${baseTerm.term}`,
      definition: baseTerm.definition,
      description: `${baseTerm.term} — ${baseTerm.definition}. Подробное объяснение термина с примерами использования в ${niche}.`,
      keywords: [
        `что такое ${baseTerm.term}`,
        `${baseTerm.term} определение`,
        `${baseTerm.term} простыми словами`,
        `${baseTerm.term} примеры`
      ],
      examples: this.generateExamples(baseTerm.term),
      relatedTerms: [],
      category: this.categorize(baseTerm.term)
    });

    // Question variations
    const questions = [
      `как использовать ${baseTerm.term}`,
      `зачем нужен ${baseTerm.term}`,
      `где применяется ${baseTerm.term}`
    ];

    questions.forEach(question => {
      variations.push({
        term: question,
        slug: this.slugify(question),
        title: `${this.capitalize(question)} — полный гайд 2026`,
        h1: this.capitalize(question),
        definition: `${question} — практическое руководство по применению термина "${baseTerm.term}".`,
        description: `${this.capitalize(question)}: подробное объяснение с примерами и кейсами. Актуально для 2026 года.`,
        keywords: [question, baseTerm.term, 'гайд', '2026'],
        examples: this.generateExamples(baseTerm.term),
        relatedTerms: [baseTerm.term],
        category: this.categorize(baseTerm.term)
      });
    });

    return variations;
  }

  /**
   * Generate examples for a term
   */
  static generateExamples(term) {
    return [
      `Пример использования ${term} в практике`,
      `Кейс применения ${term} для бизнеса`,
      `Как ${term} помогает в работе`
    ];
  }

  /**
   * Categorize term
   */
  static categorize(term) {
    const categories = {
      ai: ['промпт', 'токен', 'fine-tuning', 'температура', 'контекст', 'API', 'LLM', 'RAG'],
      business: ['ROI', 'конверсия', 'воронка', 'лидогенерация', 'CRM', 'MVP', 'LTV', 'CAC'],
      marketing: ['таргетинг', 'ретаргетинг', 'CTR', 'CPM', 'CPC', 'CPA', 'SEO', 'SMM']
    };

    for (const [category, terms] of Object.entries(categories)) {
      if (terms.some(t => term.toLowerCase().includes(t.toLowerCase()))) {
        return category;
      }
    }

    return 'general';
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

    return String(text)
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

module.exports = { GlossaryGenerator };
