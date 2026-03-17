// ============================================================
// CONTENT GENERATION SERVICE
// Generates semantically relevant satellite data around the
// main AI monetization hub and keeps page volume predictable.
// ============================================================

const { DeepSeekClient } = require('../utils/deepseek');
const { SatelliteRegistry } = require('../utils/satellite-registry');
const { InternalLinkingEngine } = require('../utils/internal-linking');
const { LongTailGenerator } = require('../utils/longtail-generator');
const { SchemaGenerator } = require('../utils/schema-generator');
const { ContentFreshnessManager } = require('../utils/content-freshness');
const { GlossaryGenerator } = require('../utils/glossary-generator');
const { ComparisonGenerator } = require('../utils/comparison-generator');
const { ProblemSolutionGenerator } = require('../utils/problem-solution-generator');
const { ContentOptimizer } = require('../utils/content-optimizer');
const { SitemapGenerator } = require('../utils/sitemap-generator');
const { RobotsGenerator } = require('../utils/robots-generator');
const { directions: baseDirections } = require('../data/directions');
const { toolCategories: baseToolCategories } = require('../data/tools');
const { audiences: baseAudiences } = require('../data/locations');
const { comparisonPairs: baseComparisonPairs, yearMonths: baseYearMonths } = require('../data/content');
const {
  buildPageBudget,
  getSemanticBlueprint,
  pickTemplateFamily,
} = require('./site-network-config');

class ContentGenerator {
  constructor(apiKey, registry = null) {
    this.client = apiKey ? new DeepSeekClient(apiKey) : null;
    this.cache = new Map();
    this.registry = registry || new SatelliteRegistry();
    this.linkingEngine = null;
  }

  async generateSatelliteData(niche, satelliteNumber, pagesCount = 1000) {
    const blueprint = getSemanticBlueprint(niche);
    const pageBudget = buildPageBudget(pagesCount);

    console.log(
      `Generating semantic data for satellite #${satelliteNumber} (${niche})`
    );
    console.log(
      `Estimated page mix: ~${pageBudget.estimatedTotal} pages (${pageBudget.longTail} long-tail)`
    );

    const directions = await this.generateDirections(
      niche,
      blueprint,
      pageBudget.directions
    );
    const cities = this.generateCities(pageBudget.cities);
    const tools = this.generateTools(blueprint, pageBudget);
    const articles = this.generateArticles(blueprint, pageBudget.articles, satelliteNumber);
    const audiences = this.generateAudiences(blueprint, pageBudget.audiences);
    const comparisonPairs = this.generateComparisons(
      directions,
      blueprint,
      pageBudget.comparisons
    );
    const yearMonths = this.generateYearMonths(pageBudget.periods);
    const longTailPages = this.generateLongTailPages(
      niche,
      blueprint,
      pageBudget.longTail,
      directions,
      articles,
      audiences
    );
    
    // NEW: Generate glossary pages
    const glossaryPages = pageBudget.glossary > 0
      ? GlossaryGenerator.generateGlossary(niche, pageBudget.glossary)
      : [];
    
    // NEW: Generate tool comparisons
    const toolComparisons = pageBudget.toolComparisons > 0
      ? ComparisonGenerator.generateToolComparisons(tools, 10)
      : [];
    
    // NEW: Generate problem-solution pages
    const problemPages = pageBudget.problems > 0
      ? ProblemSolutionGenerator.generateProblems(niche, directions, pageBudget.problems)
      : [];

    const allPages = this.collectAllPages({
      directions,
      cities,
      tools,
      articles,
      longTailPages,
      audiences,
      comparisonPairs,
      yearMonths,
      glossaryPages,
      toolComparisons,
      problemPages,
      niche,
    });

    this.linkingEngine = new InternalLinkingEngine(allPages);

    return {
      directions,
      cities,
      tools,
      articles,
      longTailPages,
      audiences,
      comparisonPairs,
      yearMonths,
      glossaryPages,
      toolComparisons,
      problemPages,
      allPages,
      pageBudget,
      siteMeta: {
        niche,
        nicheLabel: blueprint.label,
        templateFamily: pickTemplateFamily(satelliteNumber, niche),
        siteName: `1MB3 ${blueprint.label}`,
        brand: '1MB3',
      },
    };
  }

  async generateDirections(niche, blueprint, count = 10) {
    const ids = blueprint.directionIds.slice(0, count);

    return ids.map((directionId, index) => {
      const base =
        baseDirections.find(item => item.id === directionId) ||
        baseDirections[index % baseDirections.length];
      const audience =
        blueprint.audienceSlugs[index % blueprint.audienceSlugs.length];
      const seedKeyword =
        blueprint.seedKeywords[index % blueprint.seedKeywords.length];

      return {
        ...base,
        description: `${base.description}. Акцент этого кластера: ${seedKeyword} и офферы для сегмента "${audience}".`,
        keywords: this.uniqueList([
          ...(base.keywords || []),
          seedKeyword,
          `${base.nameShort} для ${audience}`,
          `${base.nameShort} под коммерческий спрос`,
        ]),
        faq: [
          ...(base.faq || []),
          {
            q: `Как использовать ${base.nameShort.toLowerCase()} в кластере ${blueprint.label.toLowerCase()}?`,
            a: `Используйте ${base.nameShort.toLowerCase()} как часть пакетного оффера: диагностика, внедрение, контент и дальнейшее сопровождение.`,
          },
        ].slice(0, 4),
      };
    });
  }

  generateCities(count = 12) {
    // Use extended cities list for maximum geographic coverage
    const { extendedCities } = require('../data/cities-extended');
    
    // Sort by priority (highest first) and take requested count
    const sortedCities = [...extendedCities].sort((a, b) => (b.priority || 0) - (a.priority || 0));
    
    return sortedCities.slice(0, count);
  }

  generateTools(blueprint, pageBudget) {
    const categoryIds = blueprint.toolCategoryIds.slice(0, pageBudget.toolCategories);

    return categoryIds.map((categoryId, index) => {
      const category =
        baseToolCategories.find(item => item.id === categoryId) ||
        baseToolCategories[index % baseToolCategories.length];
      const seedKeyword =
        blueprint.seedKeywords[index % blueprint.seedKeywords.length];

      return {
        ...category,
        tools: category.tools.slice(0, pageBudget.toolsPerCategory).map(tool => ({
          ...tool,
          desc: `${tool.desc}. Полезно для сценариев "${seedKeyword}".`,
        })),
      };
    });
  }

  generateArticles(blueprint, count = 18, satelliteNumber = 1) {
    const topics = blueprint.articleTopics;
    const articles = [];
    
    // Seeded random function for consistent but unique variations
    const seededRandom = (seed) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
    
    // Timestamp-based seed for true uniqueness
    const timeSeed = Date.now() + satelliteNumber * 1000;
    
    // 50+ variation angles for deep uniqueness
    const angles = [
      { prefix: 'Как', suffix: 'пошаговая инструкция' },
      { prefix: 'Топ способов', suffix: 'проверенные методы' },
      { prefix: 'Секреты', suffix: 'от экспертов' },
      { prefix: 'Практика', suffix: 'реальные кейсы' },
      { prefix: 'Гайд по', suffix: 'для начинающих' },
      { prefix: 'Стратегии', suffix: 'что работает' },
      { prefix: 'Инструменты для', suffix: 'обзор и сравнение' },
      { prefix: 'Ошибки в', suffix: 'как избежать' },
      { prefix: 'Полное руководство', suffix: 'с примерами' },
      { prefix: 'Эффективные методы', suffix: 'проверено на практике' },
      { prefix: 'Лучшие практики', suffix: 'от профессионалов' },
      { prefix: 'Детальный разбор', suffix: 'все нюансы' },
      { prefix: 'Современные подходы', suffix: 'актуальные решения' },
      { prefix: 'Проверенные способы', suffix: 'работающие схемы' },
      { prefix: 'Экспертные советы', suffix: 'профессиональный взгляд' },
      { prefix: 'Практическое применение', suffix: 'реальные результаты' },
      { prefix: 'Комплексный подход', suffix: 'системное решение' },
      { prefix: 'Инновационные методы', suffix: 'новые возможности' },
      { prefix: 'Оптимальные решения', suffix: 'максимальная эффективность' },
      { prefix: 'Углубленный анализ', suffix: 'детальное изучение' },
      { prefix: 'Мастер-класс по', suffix: 'от А до Я' },
      { prefix: 'Продвинутые техники', suffix: 'для опытных' },
      { prefix: 'Базовые принципы', suffix: 'фундаментальные знания' },
      { prefix: 'Быстрый старт в', suffix: 'за 7 дней' },
      { prefix: 'Полный курс', suffix: 'все что нужно знать' },
      { prefix: 'Практикум по', suffix: 'упражнения и задания' },
      { prefix: 'Кейс-стади', suffix: 'разбор успешных проектов' },
      { prefix: 'Чек-лист для', suffix: 'пошаговый план' },
      { prefix: 'Roadmap по', suffix: 'путь к результату' },
      { prefix: 'Интенсив', suffix: 'ускоренное обучение' },
      { prefix: 'Воркшоп', suffix: 'практические занятия' },
      { prefix: 'Тренинг по', suffix: 'развитие навыков' },
      { prefix: 'Методология', suffix: 'системный подход' },
      { prefix: 'Фреймворк для', suffix: 'структурированное решение' },
      { prefix: 'Blueprint', suffix: 'готовый план действий' },
      { prefix: 'Toolkit для', suffix: 'набор инструментов' },
      { prefix: 'Playbook по', suffix: 'игровая стратегия' },
      { prefix: 'Система', suffix: 'комплексное решение' },
      { prefix: 'Алгоритм', suffix: 'четкая последовательность' },
      { prefix: 'Формула успеха в', suffix: 'проверенная схема' },
      { prefix: 'Технология', suffix: 'современный метод' },
      { prefix: 'Механика', suffix: 'как это работает' },
      { prefix: 'Архитектура', suffix: 'структура и компоненты' },
      { prefix: 'Экосистема', suffix: 'все элементы системы' },
      { prefix: 'Инфраструктура для', suffix: 'базовые компоненты' },
      { prefix: 'Платформа', suffix: 'единое решение' },
      { prefix: 'Стек технологий', suffix: 'набор инструментов' },
      { prefix: 'Процесс', suffix: 'от идеи до результата' },
      { prefix: 'Workflow по', suffix: 'рабочий процесс' },
      { prefix: 'Pipeline для', suffix: 'конвейер действий' },
      { prefix: 'Автоматизация', suffix: 'эффективные процессы' },
      { prefix: 'Оптимизация', suffix: 'улучшение результатов' },
      { prefix: 'Масштабирование', suffix: 'рост и развитие' },
      { prefix: 'Монетизация через', suffix: 'способы заработка' },
      { prefix: 'Аналитика', suffix: 'данные и метрики' },
    ];
    
    // 50+ description templates for deep uniqueness
    const descTemplates = [
      (topic, seed) => `${topic}. Разбор спроса, оффера, инструментов и того, как монетизировать запрос "${seed}".`,
      (topic, seed) => `Полный гайд: ${topic.toLowerCase()}. Анализ ниши "${seed}" и практические рекомендации.`,
      (topic, seed) => `${topic} — пошаговая инструкция. Как использовать "${seed}" для заработка в 2026.`,
      (topic, seed) => `Практическое руководство: ${topic.toLowerCase()}. Разбор запроса "${seed}" с примерами.`,
      (topic, seed) => `${topic}: от теории к практике. Монетизация через "${seed}" — реальные кейсы.`,
      (topic, seed) => `Экспертный взгляд на ${topic.toLowerCase()}. Как работать с нишей "${seed}" эффективно.`,
      (topic, seed) => `${topic} в деталях. Инструменты, стратегии и способы заработка на "${seed}".`,
      (topic, seed) => `Современный подход: ${topic.toLowerCase()}. Анализ спроса "${seed}" и методы продвижения.`,
      (topic, seed) => `Детальный разбор: ${topic}. Практическое применение "${seed}" для достижения результатов.`,
      (topic, seed) => `${topic} — комплексное руководство. Работа с "${seed}": стратегии и тактики 2026.`,
      (topic, seed) => `Мастер-класс: ${topic.toLowerCase()}. Как превратить "${seed}" в источник дохода.`,
      (topic, seed) => `${topic}: профессиональный подход. Глубокий анализ ниши "${seed}" с реальными примерами.`,
      (topic, seed) => `Экспертное руководство по ${topic.toLowerCase()}. Монетизация "${seed}" — пошаговый план.`,
      (topic, seed) => `${topic} в 2026: актуальные методы. Как эффективно использовать "${seed}" для бизнеса.`,
      (topic, seed) => `Практический курс: ${topic}. Разбор запроса "${seed}" от базы до продвинутых техник.`,
      (topic, seed) => `${topic} — системный подход. Анализ, инструменты и стратегии работы с "${seed}".`,
      (topic, seed) => `Полное погружение в ${topic.toLowerCase()}. Как "${seed}" может стать вашим преимуществом.`,
      (topic, seed) => `${topic}: от новичка до профи. Пошаговое освоение ниши "${seed}" с нуля.`,
      (topic, seed) => `Углубленный гайд: ${topic}. Все аспекты работы с "${seed}" — теория и практика.`,
      (topic, seed) => `${topic} — проверенные методы. Как "${seed}" использовать для максимальной отдачи.`,
      (topic, seed) => `Современная методология: ${topic.toLowerCase()}. Работа с "${seed}" в условиях 2026 года.`,
      (topic, seed) => `${topic}: кейсы и примеры. Реальные истории успеха с использованием "${seed}".`,
      (topic, seed) => `Практикум по ${topic.toLowerCase()}. Применение "${seed}" в различных сценариях.`,
      (topic, seed) => `${topic} — инструкция для действия. Как начать работать с "${seed}" уже сегодня.`,
      (topic, seed) => `Стратегический подход к ${topic.toLowerCase()}. Долгосрочная работа с нишей "${seed}".`,
      (topic, seed) => `${topic}: технологии и инструменты. Современные решения для работы с "${seed}".`,
      (topic, seed) => `Комплексный анализ: ${topic}. Возможности и перспективы ниши "${seed}" в 2026.`,
      (topic, seed) => `${topic} — blueprint для успеха. Готовый план работы с "${seed}" от А до Я.`,
      (topic, seed) => `Эффективные техники: ${topic.toLowerCase()}. Как "${seed}" превратить в прибыльный проект.`,
      (topic, seed) => `${topic}: roadmap и стратегия. Пошаговый путь к результатам через "${seed}".`,
      (topic, seed) => `Продвинутое руководство: ${topic}. Глубокое понимание и применение "${seed}".`,
      (topic, seed) => `${topic} — фреймворк для работы. Структурированный подход к монетизации "${seed}".`,
      (topic, seed) => `Интенсивный курс: ${topic.toLowerCase()}. Быстрое освоение ниши "${seed}" за 7 дней.`,
      (topic, seed) => `${topic}: аналитика и метрики. Как измерять успех при работе с "${seed}".`,
      (topic, seed) => `Воркшоп по ${topic.toLowerCase()}. Практические упражнения и задания на тему "${seed}".`,
      (topic, seed) => `${topic} — автоматизация процессов. Эффективные инструменты для работы с "${seed}".`,
      (topic, seed) => `Масштабирование через ${topic.toLowerCase()}. Как "${seed}" использовать для роста бизнеса.`,
      (topic, seed) => `${topic}: оптимизация и улучшение. Повышение эффективности работы с "${seed}".`,
      (topic, seed) => `Экосистема ${topic.toLowerCase()}. Все компоненты успешной работы с "${seed}".`,
      (topic, seed) => `${topic} — платформенный подход. Единое решение для монетизации "${seed}".`,
      (topic, seed) => `Технологический стек: ${topic}. Современные инструменты для работы с "${seed}".`,
      (topic, seed) => `${topic}: процессы и workflow. Организация эффективной работы с нишей "${seed}".`,
      (topic, seed) => `Pipeline для ${topic.toLowerCase()}. Конвейер действий от идеи до результата с "${seed}".`,
      (topic, seed) => `${topic} — архитектура решения. Структура и компоненты работы с "${seed}".`,
      (topic, seed) => `Механика ${topic.toLowerCase()}. Как работает система монетизации через "${seed}".`,
      (topic, seed) => `${topic}: формула успеха. Проверенная схема заработка на "${seed}" в 2026.`,
      (topic, seed) => `Алгоритм работы с ${topic.toLowerCase()}. Четкая последовательность действий для "${seed}".`,
      (topic, seed) => `${topic} — система и методология. Комплексный подход к освоению ниши "${seed}".`,
      (topic, seed) => `Toolkit для ${topic.toLowerCase()}. Полный набор инструментов для работы с "${seed}".`,
      (topic, seed) => `${topic}: playbook и стратегии. Игровые тактики для победы в нише "${seed}".`,
      (topic, seed) => `Инфраструктура ${topic.toLowerCase()}. Базовые компоненты для работы с "${seed}".`,
      (topic, seed) => `${topic} — инновационные методы. Новые возможности монетизации через "${seed}".`,
      (topic, seed) => `Чек-лист по ${topic.toLowerCase()}. Пошаговый план действий для освоения "${seed}".`,
      (topic, seed) => `${topic}: тренинг и развитие. Прокачка навыков работы с нишей "${seed}".`,
      (topic, seed) => `Базовые принципы ${topic.toLowerCase()}. Фундаментальные знания о "${seed}" для старта.`,
    ];
    
    // Use seeded random instead of simple modulo for true uniqueness
    const angleIndex = Math.floor(seededRandom(timeSeed + 1) * angles.length);
    const descIndex = Math.floor(seededRandom(timeSeed + 2) * descTemplates.length);
    
    const angle = angles[angleIndex];
    const descTemplate = descTemplates[descIndex];

    for (let index = 0; index < count; index++) {
      const topic = topics[index % topics.length];
      const seed = blueprint.seedKeywords[index % blueprint.seedKeywords.length];
      
      // Add satellite-specific variation to slug - predictable but unique
      const slugBase = this.slugify(`${topic}-${index + 1}`);
      const timeHash = Math.floor(timeSeed / 1000000); // Creates unique but consistent hash
      const slugSuffix = satelliteNumber > 1 ? `-s${satelliteNumber}t${timeHash}` : '';
      const slug = `${slugBase}${slugSuffix}`;
      
      // 50+ title variations for deep uniqueness
      const titleVariations = [
        `${topic} в 2026`,
        `${angle.prefix} ${topic.toLowerCase()}`,
        `${topic}: ${angle.suffix}`,
        `${topic} — полный разбор`,
        `${topic} для новичков и профи`,
        `${topic}: практическое руководство`,
        `${topic} — экспертный подход`,
        `${topic} от А до Я`,
        `${topic}: современные методы`,
        `${topic} — пошаговая инструкция`,
        `Как освоить ${topic.toLowerCase()}`,
        `${topic}: секреты успеха`,
        `${topic} — полный курс`,
        `${topic} для начинающих`,
        `${topic}: продвинутые техники`,
        `${topic} — мастер-класс`,
        `${topic} в деталях`,
        `${topic}: проверенные методы`,
        `${topic} — комплексный подход`,
        `${topic} на практике`,
        `${topic}: эффективные стратегии`,
        `${topic} — blueprint для успеха`,
        `${topic} шаг за шагом`,
        `${topic}: roadmap и план`,
        `${topic} — системный подход`,
        `${topic} для профессионалов`,
        `${topic}: инструменты и методы`,
        `${topic} — детальный разбор`,
        `${topic} в 2026 году`,
        `${topic}: кейсы и примеры`,
        `${topic} — практикум`,
        `${topic} для бизнеса`,
        `${topic}: технологии и решения`,
        `${topic} — воркшоп`,
        `${topic} с нуля`,
        `${topic}: аналитика и метрики`,
        `${topic} — интенсив`,
        `${topic} для роста`,
        `${topic}: оптимизация процессов`,
        `${topic} — фреймворк`,
        `${topic} в действии`,
        `${topic}: автоматизация`,
        `${topic} — платформа`,
        `${topic} для масштабирования`,
        `${topic}: инновационный подход`,
        `${topic} — toolkit`,
        `${topic} для монетизации`,
        `${topic}: чек-лист и план`,
        `${topic} — экосистема`,
        `${topic} для стартапов`,
        `${topic}: формула успеха`,
        `${topic} — алгоритм действий`,
        `${topic} для фрилансеров`,
        `${topic}: механика и процессы`,
        `${topic} — архитектура решения`,
      ];
      
      // 50+ H1 variations for deep uniqueness
      const h1Variations = [
        topic,
        `${topic} в 2026`,
        `${angle.prefix} ${topic.toLowerCase()}`,
        `${topic}: практическое руководство`,
        `${topic} — полное руководство`,
        `${topic}: от теории к практике`,
        `${topic} — экспертный взгляд`,
        `${topic} для начинающих и профи`,
        `${topic}: современный подход`,
        `${topic} — детальный разбор`,
        `${topic} в деталях`,
        `${topic}: пошаговая инструкция`,
        `${topic} — мастер-класс`,
        `${topic} на практике`,
        `${topic}: комплексное руководство`,
        `${topic} — системный подход`,
        `${topic} от А до Я`,
        `${topic}: проверенные методы`,
        `${topic} — практический курс`,
        `${topic} для профессионалов`,
        `${topic}: эффективные стратегии`,
        `${topic} — углубленный гайд`,
        `${topic} шаг за шагом`,
        `${topic}: roadmap и стратегия`,
        `${topic} — blueprint успеха`,
        `${topic} в действии`,
        `${topic}: инструменты и техники`,
        `${topic} — фреймворк для работы`,
        `${topic} с нуля до результата`,
        `${topic}: кейсы и примеры`,
        `${topic} — практикум и воркшоп`,
        `${topic} для бизнеса`,
        `${topic}: технологии 2026`,
        `${topic} — интенсивный курс`,
        `${topic} для роста и развития`,
        `${topic}: оптимизация и улучшение`,
        `${topic} — платформенный подход`,
        `${topic} для масштабирования`,
        `${topic}: автоматизация процессов`,
        `${topic} — toolkit и инструменты`,
        `${topic} для монетизации`,
        `${topic}: чек-лист действий`,
        `${topic} — экосистема решений`,
        `${topic} для стартапов`,
        `${topic}: формула успеха`,
        `${topic} — алгоритм работы`,
        `${topic} для фрилансеров`,
        `${topic}: механика и workflow`,
        `${topic} — архитектура системы`,
        `${topic} для предпринимателей`,
        `${topic}: инновационные методы`,
        `${topic} — полный стек`,
        `${topic} для агентств`,
        `${topic}: pipeline и процессы`,
        `${topic} — инфраструктура`,
      ];
      
      // Use seeded random for title and H1 selection
      const titleIndex = Math.floor(seededRandom(timeSeed + index + 200) * titleVariations.length);
      const h1Index = Math.floor(seededRandom(timeSeed + index + 300) * h1Variations.length);
      
      const title = titleVariations[titleIndex];
      const h1 = h1Variations[h1Index];
      
      // Randomize read time between 5-15 minutes
      const readTime = Math.floor(seededRandom(timeSeed + index + 400) * 11) + 5;

      articles.push({
        slug,
        title,
        h1,
        desc: descTemplate(topic, seed),
        readTime: `${readTime} мин`,
        keywords: this.uniqueList([topic, seed, blueprint.label, '2026', angle.suffix]),
        type: 'article',
        url: `/blog/${slug}`,
      });
    }

    return articles;
  }

  generateLongTailPages(niche, blueprint, count, directions, articles, audiences) {
    console.log(`Generating ${count} long-tail pages for ${niche}`);

    const seedKeywords = this.uniqueList([
      ...blueprint.seedKeywords,
      ...directions.slice(0, 6).map(item => item.nameShort.toLowerCase()),
      ...articles.slice(0, 6).map(item => item.h1.toLowerCase()),
      ...audiences.slice(0, 4).map(item => `${blueprint.label.toLowerCase()} для ${item.name}`),
    ]);

    const longTailKeywords = LongTailGenerator.generateNicheKeywords(niche, {
      seedKeywords,
      audienceKeywords: audiences.slice(0, 4).map(item => item.name),
      serviceKeywords: directions.slice(0, 5).map(item => item.nameShort),
    });

    const pages = [];
    const seenSlugs = new Set();

    longTailKeywords
      .sort((left, right) => right.priority - left.priority)
      .forEach(keywordMeta => {
        if (pages.length >= count) {
          return;
        }

        const meta = LongTailGenerator.generatePageMeta(
          keywordMeta.keyword,
          niche
        );
        if (seenSlugs.has(meta.slug)) {
          return;
        }

        seenSlugs.add(meta.slug);
        const freshness = ContentFreshnessManager.addFreshnessMetadata(meta);

        pages.push({
          ...freshness,
          keyword: keywordMeta.keyword,
          priority: keywordMeta.priority,
          intent: keywordMeta.type,
          type: 'longtail',
          url: `/longtail/${meta.slug}`,
          path: `/longtail/${meta.slug}`,
          name: meta.title,
        });
      });

    console.log(`Generated ${pages.length} long-tail pages`);
    return pages;
  }

  generateAudiences(blueprint, count = 8) {
    const ordered = [
      ...blueprint.audienceSlugs
        .map(slug => baseAudiences.find(item => item.slug === slug))
        .filter(Boolean),
      ...baseAudiences.filter(item => !blueprint.audienceSlugs.includes(item.slug)),
    ];

    return ordered.slice(0, count);
  }

  generateComparisons(directions, blueprint, count = 8) {
    const preferred = baseComparisonPairs.filter(pair => {
      const joined = `${pair.a} ${pair.b}`.toLowerCase();
      return blueprint.seedKeywords.some(keyword =>
        joined.includes(keyword.split(' ')[0].toLowerCase())
      );
    });

    const fallback = baseComparisonPairs.filter(
      pair => !preferred.some(item => item.slug === pair.slug)
    );

    const selected = [...preferred, ...fallback].slice(0, count);

    return selected.length >= count
      ? selected
      : selected.concat(
          directions
            .slice(0, Math.max(0, count - selected.length))
            .map((direction, index) => ({
              a: direction.nameShort,
              b: directions[(index + 1) % directions.length].nameShort,
              slug: `${direction.id}-vs-${directions[(index + 1) % directions.length].id}`,
            }))
        );
  }

  generateYearMonths(count = 4) {
    return baseYearMonths.slice(0, count);
  }

  collectAllPages({
    directions,
    cities,
    tools,
    articles,
    longTailPages,
    audiences,
    comparisonPairs,
    yearMonths,
    niche,
  }) {
    const allPages = [];

    directions.forEach(direction => {
      allPages.push({
        url: `/napravleniya/${direction.id}`,
        path: `/napravleniya/${direction.id}`,
        title: direction.name,
        name: direction.name,
        description: direction.description,
        keywords: direction.keywords || [direction.name, niche],
        type: 'direction',
      });
    });

    cities.forEach(city => {
      directions.forEach(direction => {
        allPages.push({
          url: `/zarabotok-na-ai/${city.slug}/${direction.id}`,
          path: `/zarabotok-na-ai/${city.slug}/${direction.id}`,
          title: `${direction.nameShort} в ${city.name}`,
          name: `${direction.nameShort} в ${city.name}`,
          description: `${direction.nameShort} в ${city.name}: спрос, чеки, инструменты и локальные сценарии продаж.`,
          keywords: this.uniqueList([
            direction.nameShort,
            city.name,
            niche,
            `${direction.nameShort} в ${city.name}`,
          ]),
          type: 'city-direction',
        });
      });
    });

    tools.forEach(category => {
      allPages.push({
        url: `/instrumenty/${category.id}`,
        path: `/instrumenty/${category.id}`,
        title: category.name,
        name: category.name,
        description: `${category.name}: стек инструментов для рабочих AI-сценариев.`,
        keywords: this.uniqueList([
          category.name,
          ...category.tools.slice(0, 3).map(tool => tool.name),
        ]),
        type: 'tool-catalog',
      });
    });

    audiences.forEach(audience => {
      allPages.push({
        url: `/dlya/${audience.slug}`,
        path: `/dlya/${audience.slug}`,
        title: `Гайд для ${audience.name}`,
        name: `Гайд для ${audience.name}`,
        description: audience.desc,
        keywords: this.uniqueList([audience.name, niche, audience.slug]),
        type: 'audience',
      });
    });

    comparisonPairs.forEach(pair => {
      allPages.push({
        url: `/sravnenie/${pair.slug}`,
        path: `/sravnenie/${pair.slug}`,
        title: `${pair.a} vs ${pair.b}`,
        name: `${pair.a} vs ${pair.b}`,
        description: `Сравнение ${pair.a} и ${pair.b} в коммерческих AI-сценариях.`,
        keywords: [pair.a, pair.b, niche],
        type: 'comparison',
      });
    });

    yearMonths.forEach(period => {
      allPages.push({
        url: `/zarabotok-na-ii/${period.slug}`,
        path: `/zarabotok-na-ii/${period.slug}`,
        title: `Заработок на AI: ${period.name}`,
        name: `Заработок на AI: ${period.name}`,
        description: `Сезонный и актуальный спрос на AI-услуги в период ${period.name}.`,
        keywords: [period.name, niche, 'заработок на ai'],
        type: 'time-period',
      });
    });

    articles.forEach(article => {
      allPages.push({
        url: article.url,
        path: article.url,
        title: article.title,
        name: article.title,
        description: article.desc,
        keywords: article.keywords,
        type: 'article',
      });
    });

    allPages.push(...longTailPages);

    return allPages;
  }

  optimizeContent(content, metadata) {
    if (this.linkingEngine) {
      content = this.linkingEngine.addInternalLinks(
        content,
        metadata.url,
        5
      );
    }

    content = this.addCrossLinks(
      content,
      metadata.niche,
      metadata.domain,
      metadata.title
    );

    return ContentOptimizer.optimize(content, metadata);
  }

  generateSchema(pageType, data) {
    switch (pageType) {
      case 'article':
      case 'longtail':
        return SchemaGenerator.article(data);
      case 'direction':
        return SchemaGenerator.howTo(data);
      case 'faq':
        return SchemaGenerator.faq(data.questions);
      default:
        return null;
    }
  }

  addCrossLinks(content, niche, domain, topic) {
    if (!this.registry || this.registry.getAll().length === 0) {
      return content;
    }

    const links = this.registry.generateCrossLinks(niche, domain, topic);
    if (links.length === 0) {
      return content;
    }

    return content + this.registry.formatLinksAsHTML(links);
  }

  registerSatellite(satellite) {
    if (this.registry) {
      this.registry.register(satellite);
    }
  }

  generateSitemap(baseUrl, allPages) {
    return SitemapGenerator.generate(baseUrl, allPages);
  }

  generateRobotsTxt(baseUrl) {
    return RobotsGenerator.generateAdvanced(baseUrl);
  }

  uniqueList(values) {
    return [...new Set(values.filter(Boolean))];
  }

  slugify(text) {
    const map = {
      а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo',
      ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm',
      н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u',
      ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch',
      ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
      ' ': '-', '(': '', ')': '',
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
}

module.exports = { ContentGenerator };
