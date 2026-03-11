// ============================================================
// CONTENT GENERATION SERVICE
// Generates unique content for satellites using DeepSeek API
// ============================================================

const { DeepSeekClient } = require('../utils/deepseek');
const fs = require('fs');
const path = require('path');

class ContentGenerator {
  constructor(apiKey) {
    this.client = new DeepSeekClient(apiKey);
    this.cache = new Map();
  }

  async generateSatelliteData(niche, satelliteNumber, pagesCount = 1000) {
    console.log(`🎨 Generating unique data for satellite #${satelliteNumber} (${niche})`);

    // Generate unique directions
    const directions = await this.generateDirections(niche, 15);

    // Generate cities (expand to support 1000 pages)
    const cities = this.generateCities(100);

    // Generate tools
    const tools = await this.generateTools(niche, 200);

    // Generate articles
    const articles = await this.generateArticles(niche, 50);

    return {
      directions,
      cities,
      tools,
      articles,
      audiences: this.generateAudiences(),
      comparisonPairs: this.generateComparisons(directions),
    };
  }

  async generateDirections(niche, count = 15) {
    const directions = [];
    const baseDirections = this.getBaseDirections(niche);

    for (let i = 0; i < count; i++) {
      const baseDirection = baseDirections[i % baseDirections.length];

      try {
        const generated = await this.client.generateUniqueDirection(
          baseDirection,
          i + 1
        );

        if (generated) {
          directions.push({
            id: generated.id || `${niche}-dir-${i + 1}`,
            name: generated.name,
            nameShort: generated.name.substring(0, 30),
            icon: this.getRandomIcon(),
            description: generated.description,
            tools: [`Tool ${i + 1}`, `Tool ${i + 2}`],
            priceRange: this.generatePriceRange(),
            difficulty: ['Начальный', 'Средний', 'Продвинутый'][i % 3],
            timeToStart: `${3 + i} дней`,
            demand: ['Высокий', 'Средний', 'Очень высокий'][i % 3],
            keywords: generated.keywords || [],
            faq: generated.faq || []
          });
        }
      } catch (error) {
        console.error(`Error generating direction ${i}:`, error.message);
        // Fallback to template
        directions.push(this.generateFallbackDirection(niche, i));
      }

      // Rate limiting
      await this.sleep(500);
    }

    return directions;
  }

  generateCities(count = 100) {
    const baseCities = [
      'Москва', 'Санкт-Петербург', 'Казань', 'Новосибирск', 'Екатеринбург',
      'Нижний Новгород', 'Самара', 'Омск', 'Челябинск', 'Ростов-на-Дону',
      'Уфа', 'Красноярск', 'Воронеж', 'Пермь', 'Волгоград',
      'Краснодар', 'Саратов', 'Тюмень', 'Тольятти', 'Ижевск'
    ];

    const cities = [];

    // Add base cities
    baseCities.forEach((city, idx) => {
      cities.push({
        name: city,
        slug: this.transliterate(city.toLowerCase()),
        region: 'Россия',
        population: `${1 + idx * 0.1}M`
      });
    });

    // Generate additional cities to reach count
    const additionalCities = [
      'Барнаул', 'Ульяновск', 'Иркутск', 'Хабаровск', 'Ярославль',
      'Владивосток', 'Махачкала', 'Томск', 'Оренбург', 'Кемерово',
      'Новокузнецк', 'Рязань', 'Астрахань', 'Набережные Челны', 'Пенза',
      'Липецк', 'Киров', 'Чебоксары', 'Калининград', 'Тула',
      'Курск', 'Ставрополь', 'Сочи', 'Улан-Удэ', 'Тверь'
    ];

    additionalCities.forEach((city, idx) => {
      if (cities.length < count) {
        cities.push({
          name: city,
          slug: this.transliterate(city.toLowerCase()),
          region: 'Россия',
          population: `${0.5 + idx * 0.05}M`
        });
      }
    });

    // If still need more, generate variations
    while (cities.length < count) {
      const baseCity = baseCities[cities.length % baseCities.length];
      cities.push({
        name: `${baseCity} (район ${cities.length})`,
        slug: `${this.transliterate(baseCity.toLowerCase())}-${cities.length}`,
        region: 'Россия',
        population: '0.5M'
      });
    }

    return cities.slice(0, count);
  }

  async generateTools(niche, count = 200) {
    const categories = ['Основные', 'Продвинутые', 'Бесплатные', 'Платные', 'Новые', 'Популярные'];
    const toolCategories = [];

    for (const category of categories) {
      const tools = [];
      const toolsPerCategory = Math.ceil(count / categories.length);

      for (let i = 0; i < toolsPerCategory; i++) {
        tools.push({
          name: `${niche} Tool ${category} ${i + 1}`,
          description: `Инструмент для ${niche} - ${category}`,
          category,
          pricing: i % 2 === 0 ? 'Бесплатно' : `От ${10 + i * 5}$/мес`,
          url: `https://example.com/tool-${category}-${i}`,
          rating: (4 + Math.random()).toFixed(1)
        });
      }

      toolCategories.push({
        name: category,
        slug: this.transliterate(category.toLowerCase()),
        tools
      });
    }

    return toolCategories;
  }

  async generateArticles(niche, count = 50) {
    const articles = [];
    const topics = this.getArticleTopics(niche);

    for (let i = 0; i < count; i++) {
      const topic = topics[i % topics.length];

      articles.push({
        slug: `article-${i + 1}-${this.transliterate(topic.toLowerCase().substring(0, 30))}`,
        title: `${topic} в 2026 году`,
        h1: topic,
        desc: `Полное руководство: ${topic}`,
        readTime: `${5 + (i % 10)} мин`,
        keywords: [topic, niche, '2026']
      });

      // Don't generate actual content here - will be done via ISR
    }

    return articles;
  }

  generateAudiences() {
    return [
      { name: 'Фрилансеры', slug: 'freelancers' },
      { name: 'Предприниматели', slug: 'entrepreneurs' },
      { name: 'Студенты', slug: 'students' },
      { name: 'Специалисты', slug: 'professionals' },
      { name: 'Новички', slug: 'beginners' },
      { name: 'Эксперты', slug: 'experts' },
      { name: 'Маркетологи', slug: 'marketers' },
      { name: 'Разработчики', slug: 'developers' }
    ];
  }

  generateComparisons(directions) {
    const pairs = [];
    for (let i = 0; i < Math.min(10, directions.length - 1); i++) {
      pairs.push({
        slug: `${directions[i].id}-vs-${directions[i + 1].id}`,
        tool1: directions[i].name,
        tool2: directions[i + 1].name
      });
    }
    return pairs;
  }

  // Helper methods
  getBaseDirections(niche) {
    const directions = {
      crypto: ['Trading', 'Mining', 'Staking', 'NFT', 'DeFi', 'Blockchain Development'],
      fitness: ['Yoga', 'Gym', 'Nutrition', 'Running', 'CrossFit', 'Personal Training'],
      education: ['Programming', 'Design', 'Marketing', 'Languages', 'Business', 'Data Science'],
      realestate: ['Buying', 'Selling', 'Renting', 'Investing', 'Mortgage', 'Property Management']
    };
    return directions[niche] || directions.crypto;
  }

  getArticleTopics(niche) {
    return [
      `Как начать в ${niche}`,
      `Лучшие инструменты для ${niche}`,
      `${niche} для начинающих`,
      `Заработок на ${niche}`,
      `Топ-10 советов по ${niche}`,
      `Ошибки новичков в ${niche}`,
      `Будущее ${niche}`,
      `${niche} в России`,
      `Как выбрать ${niche}`,
      `${niche} vs альтернативы`
    ];
  }

  generateFallbackDirection(niche, index) {
    return {
      id: `${niche}-dir-${index}`,
      name: `${niche} направление ${index + 1}`,
      nameShort: `Направление ${index + 1}`,
      icon: this.getRandomIcon(),
      description: `Уникальное направление в ${niche}`,
      tools: [`Tool ${index + 1}`, `Tool ${index + 2}`],
      priceRange: this.generatePriceRange(),
      difficulty: ['Начальный', 'Средний', 'Продвинутый'][index % 3],
      timeToStart: `${3 + index} дней`,
      demand: ['Высокий', 'Средний'][index % 2],
      keywords: [`${niche}`, `направление ${index}`],
      faq: []
    };
  }

  getRandomIcon() {
    const icons = ['🚀', '💡', '🎯', '⚡', '🔥', '💰', '📈', '🎨', '🛠️', '📊', '🌟', '💎', '🎪', '🎭', '🎬'];
    return icons[Math.floor(Math.random() * icons.length)];
  }

  generatePriceRange() {
    const min = Math.floor(Math.random() * 50) * 1000 + 5000;
    const max = min * (2 + Math.floor(Math.random() * 5));
    return `${min.toLocaleString('ru-RU')} – ${max.toLocaleString('ru-RU')} ₽`;
  }

  transliterate(text) {
    const map = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
      'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
      'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
      'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
      'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
      ' ': '-', '(': '', ')': ''
    };

    return text.toLowerCase().split('').map(char => map[char] || char).join('');
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = { ContentGenerator };
