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
    
    // Variation angles based on satellite number
    const angles = [
      { prefix: 'Как', suffix: 'пошаговая инструкция' },
      { prefix: 'Топ способов', suffix: 'проверенные методы' },
      { prefix: 'Секреты', suffix: 'от экспертов' },
      { prefix: 'Практика', suffix: 'реальные кейсы' },
      { prefix: 'Гайд по', suffix: 'для начинающих' },
      { prefix: 'Стратегии', suffix: 'что работает' },
      { prefix: 'Инструменты для', suffix: 'обзор и сравнение' },
      { prefix: 'Ошибки в', suffix: 'как избежать' },
    ];
    
    const descTemplates = [
      (topic, seed) => `${topic}. Разбор спроса, оффера, инструментов и того, как монетизировать запрос "${seed}".`,
      (topic, seed) => `Полный гайд: ${topic.toLowerCase()}. Анализ ниши "${seed}" и практические рекомендации.`,
      (topic, seed) => `${topic} — пошаговая инструкция. Как использовать "${seed}" для заработка в 2026.`,
      (topic, seed) => `Практическое руководство: ${topic.toLowerCase()}. Разбор запроса "${seed}" с примерами.`,
      (topic, seed) => `${topic}: от теории к практике. Монетизация через "${seed}" — реальные кейсы.`,
      (topic, seed) => `Экспертный взгляд на ${topic.toLowerCase()}. Как работать с нишей "${seed}" эффективно.`,
      (topic, seed) => `${topic} в деталях. Инструменты, стратегии и способы заработка на "${seed}".`,
      (topic, seed) => `Современный подход: ${topic.toLowerCase()}. Анализ спроса "${seed}" и методы продвижения.`,
    ];
    
    const angle = angles[satelliteNumber % angles.length];
    const descTemplate = descTemplates[satelliteNumber % descTemplates.length];

    for (let index = 0; index < count; index++) {
      const topic = topics[index % topics.length];
      const seed = blueprint.seedKeywords[index % blueprint.seedKeywords.length];
      
      // Add satellite-specific variation to slug
      const slugBase = this.slugify(`${topic}-${index + 1}`);
      const slug = satelliteNumber > 1 ? `${slugBase}-v${satelliteNumber}` : slugBase;
      
      // Vary title based on satellite number and index
      const titleVariations = [
        `${topic} в 2026`,
        `${angle.prefix} ${topic.toLowerCase()}`,
        `${topic}: ${angle.suffix}`,
        `${topic} — полный разбор`,
        `${topic} для новичков и профи`,
      ];
      const title = titleVariations[(satelliteNumber + index) % titleVariations.length];
      
      // Vary H1 slightly
      const h1Variations = [
        topic,
        `${topic} в 2026`,
        `${angle.prefix} ${topic.toLowerCase()}`,
        `${topic}: практическое руководство`,
      ];
      const h1 = h1Variations[(satelliteNumber + index * 2) % h1Variations.length];

      articles.push({
        slug,
        title,
        h1,
        desc: descTemplate(topic, seed),
        readTime: `${8 + ((index + satelliteNumber) % 7)} мин`,
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
