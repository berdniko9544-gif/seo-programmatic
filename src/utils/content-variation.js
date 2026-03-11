/**
 * CONTENT VARIATION GENERATOR
 * Generates multiple versions of content to avoid duplicate content penalties
 */

class ContentVariationGenerator {
  /**
   * Generate variations of text
   */
  static generateVariations(text, count = 3) {
    const variations = [text]; // Original

    for (let i = 1; i < count; i++) {
      const variation = this.createVariation(text, i);
      variations.push(variation);
    }

    return variations;
  }

  /**
   * Create a single variation
   */
  static createVariation(text, seed) {
    let varied = text;

    // Apply transformations based on seed
    if (seed % 3 === 0) {
      varied = this.synonymReplace(varied);
    }
    if (seed % 2 === 0) {
      varied = this.sentenceReorder(varied);
    }

    varied = this.phraseVariation(varied);

    return varied;
  }

  /**
   * Replace words with synonyms
   */
  static synonymReplace(text) {
    const synonyms = {
      'заработок': ['доход', 'прибыль', 'выручка'],
      'инструменты': ['сервисы', 'платформы', 'решения'],
      'начать': ['стартовать', 'приступить', 'запустить'],
      'гайд': ['руководство', 'инструкция', 'пособие'],
      'способ': ['метод', 'подход', 'вариант'],
      'быстро': ['оперативно', 'скоро', 'в короткие сроки'],
      'эффективно': ['результативно', 'продуктивно', 'успешно'],
      'популярный': ['востребованный', 'актуальный', 'трендовый'],
      'лучший': ['оптимальный', 'идеальный', 'превосходный'],
      'простой': ['легкий', 'доступный', 'понятный']
    };

    let varied = text;

    Object.entries(synonyms).forEach(([word, syns]) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = varied.match(regex);

      if (matches && matches.length > 0) {
        // Replace some occurrences (not all)
        const replaceCount = Math.ceil(matches.length / 2);
        let replaced = 0;

        varied = varied.replace(regex, (match) => {
          if (replaced < replaceCount && Math.random() > 0.5) {
            replaced++;
            const syn = syns[Math.floor(Math.random() * syns.length)];
            // Preserve case
            return match[0] === match[0].toUpperCase() ?
              syn.charAt(0).toUpperCase() + syn.slice(1) : syn;
          }
          return match;
        });
      }
    });

    return varied;
  }

  /**
   * Reorder sentences in paragraphs
   */
  static sentenceReorder(text) {
    const paragraphs = text.split('\n\n');

    const reordered = paragraphs.map(para => {
      const sentences = para.split(/([.!?]+\s+)/).filter(s => s.trim());

      // Only reorder if there are 3+ sentences
      if (sentences.length >= 6) { // 3 sentences + 3 separators
        // Swap some adjacent sentences
        for (let i = 0; i < sentences.length - 3; i += 4) {
          if (Math.random() > 0.5) {
            // Swap sentence i with i+2 (skip separator)
            [sentences[i], sentences[i + 2]] = [sentences[i + 2], sentences[i]];
          }
        }
      }

      return sentences.join('');
    });

    return reordered.join('\n\n');
  }

  /**
   * Vary common phrases
   */
  static phraseVariation(text) {
    const variations = {
      'в 2026 году': ['в текущем году', 'в этом году', 'сегодня'],
      'для начинающих': ['для новичков', 'с нуля', 'без опыта'],
      'пошаговая инструкция': ['подробное руководство', 'детальный гайд', 'план действий'],
      'узнайте больше': ['читайте далее', 'подробнее здесь', 'полная информация'],
      'полный гайд': ['исчерпывающее руководство', 'детальная инструкция', 'все что нужно знать'],
      'актуально': ['релевантно', 'современно', 'в тренде'],
      'проверенные методы': ['эффективные способы', 'работающие подходы', 'надежные техники']
    };

    let varied = text;

    Object.entries(variations).forEach(([phrase, vars]) => {
      const regex = new RegExp(phrase, 'gi');
      if (Math.random() > 0.5 && regex.test(varied)) {
        const replacement = vars[Math.floor(Math.random() * vars.length)];
        varied = varied.replace(regex, replacement);
      }
    });

    return varied;
  }

  /**
   * Generate title variations
   */
  static generateTitleVariations(title, count = 5) {
    const variations = [title];

    const templates = [
      (t) => t.replace(/:/g, ' —'),
      (t) => t.replace(/\s+—\s+/, ': '),
      (t) => `✓ ${t}`,
      (t) => `${t} →`,
      (t) => t.replace(/гайд/gi, 'руководство'),
      (t) => t.replace(/инструкция/gi, 'гайд'),
      (t) => t.replace(/2026/g, 'актуально')
    ];

    for (let i = 0; i < count - 1 && i < templates.length; i++) {
      const varied = templates[i](title);
      if (varied !== title && !variations.includes(varied)) {
        variations.push(varied);
      }
    }

    return variations;
  }

  /**
   * Generate description variations
   */
  static generateDescriptionVariations(description, count = 5) {
    const variations = [description];

    // Create variations by:
    // 1. Changing word order
    // 2. Replacing synonyms
    // 3. Adding/removing phrases

    for (let i = 1; i < count; i++) {
      let varied = description;

      // Apply synonym replacement
      varied = this.synonymReplace(varied);

      // Vary phrases
      varied = this.phraseVariation(varied);

      if (varied !== description && !variations.includes(varied)) {
        variations.push(varied);
      }
    }

    return variations;
  }

  /**
   * Generate complete page variations
   */
  static generatePageVariations(page, count = 3) {
    const variations = [];

    for (let i = 0; i < count; i++) {
      const variation = {
        ...page,
        title: this.generateTitleVariations(page.title, 3)[i % 3],
        description: this.generateDescriptionVariations(page.description, 3)[i % 3],
        content: page.content ? this.createVariation(page.content, i) : page.content,
        variationId: i,
        isVariation: i > 0
      };

      variations.push(variation);
    }

    return variations;
  }

  /**
   * Select variation based on criteria
   */
  static selectVariation(variations, criteria = {}) {
    const { userAgent, timeOfDay, dayOfWeek } = criteria;

    // Simple rotation based on criteria
    let index = 0;

    if (userAgent) {
      index = userAgent.length % variations.length;
    } else if (timeOfDay) {
      index = timeOfDay % variations.length;
    } else if (dayOfWeek) {
      index = dayOfWeek % variations.length;
    } else {
      index = Math.floor(Math.random() * variations.length);
    }

    return variations[index];
  }

  /**
   * Calculate similarity between two texts
   */
  static calculateSimilarity(text1, text2) {
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));

    const intersection = new Set([...words1].filter(w => words2.has(w)));
    const union = new Set([...words1, ...words2]);

    return intersection.size / union.size;
  }

  /**
   * Validate variations are sufficiently different
   */
  static validateVariations(variations, minDifference = 0.3) {
    const results = [];

    for (let i = 0; i < variations.length; i++) {
      for (let j = i + 1; j < variations.length; j++) {
        const similarity = this.calculateSimilarity(
          variations[i].content || variations[i].title,
          variations[j].content || variations[j].title
        );

        const difference = 1 - similarity;

        results.push({
          pair: [i, j],
          similarity: similarity.toFixed(2),
          difference: difference.toFixed(2),
          valid: difference >= minDifference
        });
      }
    }

    return {
      allValid: results.every(r => r.valid),
      results
    };
  }
}

module.exports = { ContentVariationGenerator };
