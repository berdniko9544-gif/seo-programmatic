// ============================================================
// 1MB3 PROGRAMMATIC SEO DATA ENGINE
// Generates 200+ unique pages targeting long-tail keywords
// for Russian-speaking audience interested in AI monetization
// ============================================================

const { directions } = require('./directions');
const { cities, audiences } = require('./locations');
const { toolCategories } = require('./tools');
const { yearMonths, comparisonPairs, howToArticles } = require('./content');

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || "https://seo-programmatic-main.vercel.app";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "SEO Programmatic";
const BRAND = process.env.NEXT_PUBLIC_BRAND || "SEO Programmatic";

// ============================================================
// PAGE GENERATORS
// ============================================================

function generateDirectionPages() {
  return directions.map(d => ({
    type: "direction",
    slug: d.id,
    path: `/napravleniya/${d.id}`,
    title: `${d.name} — Заработок на ИИ в 2026 | ${BRAND}`,
    h1: `${d.icon} ${d.name}: как заработать в 2026`,
    description: `${d.description}. Инструменты, цены, план старта. Подробный гайд от ${BRAND}.`,
    data: d,
  }));
}

function generateCityDirectionPages() {
  const pages = [];
  for (const city of cities) {
    for (const dir of directions) {
      pages.push({
        type: "city-direction",
        slug: `${city.slug}-${dir.id}`,
        path: `/zarabotok-na-ai/${city.slug}/${dir.id}`,
        title: `${dir.nameShort} в ${city.name} — Заработок на ИИ 2026 | ${BRAND}`,
        h1: `${dir.icon} ${dir.nameShort} в ${city.name}: старт в 2026`,
        description: `Как начать зарабатывать на ${dir.nameShort.toLowerCase()} в ${city.name}. Инструменты, клиенты, цены. Гайд ${BRAND}.`,
        city: city,
        direction: dir,
      });
    }
  }
  return pages;
}

function generateAudiencePages() {
  return audiences.map(a => ({
    type: "audience",
    slug: a.slug,
    path: `/dlya/${a.slug}`,
    title: `Гайд по заработку на ИИ для ${a.name} 2026 | ${BRAND}`,
    h1: `Гайд по заработку на ИИ для ${a.name}`,
    description: `${a.desc} ${BRAND} ГАЙД 2026.`,
    data: a,
  }));
}

function generateToolCatalogPages() {
  return toolCategories.map(cat => ({
    type: "tool-catalog",
    slug: cat.id,
    path: `/instrumenty/${cat.id}`,
    title: `${cat.name} — Каталог 200+ ИИ-сервисов 2026 | ${BRAND}`,
    h1: `${cat.icon} ${cat.name} для заработка`,
    description: `Полный каталог ${cat.name.toLowerCase()} с ценами, рейтингами и описаниями. Бонус к гайду ${BRAND}.`,
    data: cat,
  }));
}

function generateComparisonPages() {
  return comparisonPairs.map(pair => ({
    type: "comparison",
    slug: pair.slug,
    path: `/sravnenie/${pair.slug}`,
    title: `${pair.a} vs ${pair.b} — Что выбрать в 2026? | ${BRAND}`,
    h1: `${pair.a} vs ${pair.b}: подробное сравнение 2026`,
    description: `Детальное сравнение ${pair.a} и ${pair.b}: функции, цены, для каких задач подходит. Рекомендации ${BRAND}.`,
    data: pair,
  }));
}

function generateTimePeriodPages() {
  return yearMonths.map(ym => ({
    type: "time-period",
    slug: ym.slug,
    path: `/zarabotok-na-ii/${ym.slug}`,
    title: `Заработок на ИИ ${ym.name} — Актуальный гайд | ${BRAND}`,
    h1: `Заработок на нейросетях: что работает в ${ym.name}`,
    description: `Актуальные способы заработка на AI в ${ym.name}. 12 направлений, инструменты, план действий. Гайд ${BRAND}.`,
    data: ym,
  }));
}

function generateHowToPages() {
  return howToArticles.map(h => ({
    type: "how-to",
    slug: h.slug,
    path: `/blog/${h.slug}`,
    title: `${h.title} | ${BRAND}`,
    h1: h.h1,
    description: h.desc,
    data: h,
  }));
}

function getAllPages() {
  return [
    ...generateDirectionPages(),
    ...generateCityDirectionPages(),
    ...generateAudiencePages(),
    ...generateToolCatalogPages(),
    ...generateComparisonPages(),
    ...generateTimePeriodPages(),
    ...generateHowToPages(),
  ];
}

module.exports = {
  SITE_URL,
  SITE_NAME,
  BRAND,
  directions,
  toolCategories,
  cities,
  audiences,
  yearMonths,
  comparisonPairs,
  howToArticles,
  getAllPages,
  generateDirectionPages,
  generateCityDirectionPages,
  generateAudiencePages,
  generateToolCatalogPages,
  generateComparisonPages,
  generateTimePeriodPages,
  generateHowToPages,
};
