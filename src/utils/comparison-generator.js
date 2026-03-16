/**
 * COMPARISON GENERATOR
 * Generates tool vs tool comparison pages for maximum traffic
 */

class ComparisonGenerator {
  /**
   * Generate all possible comparisons between items
   */
  static generateAllComparisons(items, type = 'tool') {
    const comparisons = [];
    
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const item1 = items[i];
        const item2 = items[j];
        
        comparisons.push({
          slug: `${this.slugify(item1.name)}-vs-${this.slugify(item2.name)}`,
          title: `${item1.name} vs ${item2.name}: Что выбрать в 2026`,
          h1: `${item1.name} vs ${item2.name}`,
          description: `Сравнение ${item1.name} и ${item2.name}: функции, цены, плюсы и минусы. Что лучше выбрать для вашей задачи в 2026 году.`,
          item1: {
            name: item1.name,
            description: item1.description || item1.desc,
            pros: this.generatePros(item1, type),
            cons: this.generateCons(item1, type),
            pricing: item1.pricing || 'Уточняйте',
            rating: item1.rating || '4.5'
          },
          item2: {
            name: item2.name,
            description: item2.description || item2.desc,
            pros: this.generatePros(item2, type),
            cons: this.generateCons(item2, type),
            pricing: item2.pricing || 'Уточняйте',
            rating: item2.rating || '4.5'
          },
          type: 'comparison',
          comparisonType: type,
          keywords: [
            `${item1.name} vs ${item2.name}`,
            `сравнение ${item1.name} ${item2.name}`,
            `что лучше ${item1.name} или ${item2.name}`,
            `${item1.name} или ${item2.name} 2026`
          ],
          verdict: this.generateVerdict(item1, item2),
          url: `/sravnenie/${this.slugify(item1.name)}-vs-${this.slugify(item2.name)}`,
          path: `/sravnenie/${this.slugify(item1.name)}-vs-${this.slugify(item2.name)}`
        });
      }
    }
    
    return comparisons;
  }

  /**
   * Generate pros for an item
   */
  static generatePros(item, type) {
    const genericPros = {
      tool: [
        'Простой интерфейс',
        'Быстрая работа',
        'Хорошая поддержка',
        'Регулярные обновления'
      ],
      direction: [
        'Высокий спрос',
        'Низкий порог входа',
        'Хорошие чеки',
        'Много клиентов'
      ],
      service: [
        'Востребованная услуга',
        'Быстрая окупаемость',
        'Масштабируемость',
        'Повторные продажи'
      ]
    };
    
    return genericPros[type] || genericPros.tool;
  }

  /**
   * Generate cons for an item
   */
  static generateCons(item, type) {
    const genericCons = {
      tool: [
        'Требует обучения',
        'Платная подписка',
        'Ограничения бесплатного плана',
        'Нет русского языка'
      ],
      direction: [
        'Высокая конкуренция',
        'Нужны навыки',
        'Требуется портфолио',
        'Сезонность спроса'
      ],
      service: [
        'Нужна экспертиза',
        'Долгий цикл сделки',
        'Требуется команда',
        'Высокие ожидания клиентов'
      ]
    };
    
    return genericCons[type] || genericCons.tool;
  }

  /**
   * Generate verdict
   */
  static generateVerdict(item1, item2) {
    return `Оба инструмента хороши для своих задач. ${item1.name} лучше подходит для начинающих и быстрого старта, а ${item2.name} — для профессионалов с опытом. Выбор зависит от ваших целей и бюджета.`;
  }

  /**
   * Generate comparisons from tool categories
   */
  static generateToolComparisons(toolCategories, maxPerCategory = 10) {
    const allComparisons = [];
    
    toolCategories.forEach(category => {
      const tools = (category.tools || []).slice(0, maxPerCategory);
      const comparisons = this.generateAllComparisons(tools, 'tool');
      allComparisons.push(...comparisons);
    });
    
    return allComparisons;
  }

  /**
   * Generate direction comparisons
   */
  static generateDirectionComparisons(directions) {
    return this.generateAllComparisons(directions, 'direction');
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
      ' ': '-', '.': '', ',': '', ':': '', ';': '', '!': '', '?': ''
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
}

module.exports = { ComparisonGenerator };
