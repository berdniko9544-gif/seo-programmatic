#!/usr/bin/env node

/**
 * SATELLITE GENERATOR v1.0
 * Р“РµРЅРµСЂРёСЂСѓРµС‚ РЅРѕРІС‹Р№ СЃР°С‚РµР»Р»РёС‚ СЃ СѓРЅРёРєР°Р»СЊРЅС‹РјРё РґР°РЅРЅС‹РјРё
 *
 * Usage: node satellite-generator.js --niche "ai-business" --pages 300
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { ContentGenerator } = require('../src/utils/content-generator');
const { getSemanticBlueprint, pickTemplateFamily } = require('../src/utils/site-network-config');

// ============================================================
// CONFIGURATION
// ============================================================

const CONFIG = {
  // Р‘Р°Р·РѕРІС‹Р№ С€Р°Р±Р»РѕРЅ (С‚РµРєСѓС‰РёР№ РїСЂРѕРµРєС‚)
  templateDir: path.join(__dirname, '..'),

  // Р”РёСЂРµРєС‚РѕСЂРёСЏ РґР»СЏ РЅРѕРІС‹С… СЃР°С‚РµР»Р»РёС‚РѕРІ
  outputDir: path.join(process.cwd(), 'satellites'),

  // API РєР»СЋС‡Рё (РёР· .env)
  openaiKey: process.env.OPENAI_API_KEY,
  anthropicKey: process.env.ANTHROPIC_API_KEY,
};

// ============================================================
// NICHE TEMPLATES вЂ” РЁР°Р±Р»РѕРЅС‹ РЅРёС€ РґР»СЏ РіРµРЅРµСЂР°С†РёРё
// ============================================================

const NICHE_TEMPLATES = {
  crypto: {
    name: 'РљСЂРёРїС‚РѕРІР°Р»СЋС‚С‹ Рё Р±Р»РѕРєС‡РµР№РЅ',
    directions: ['trading', 'mining', 'staking', 'nft', 'defi'],
    cities: ['moscow', 'spb', 'kazan', 'novosibirsk', 'ekaterinburg'],
    audiences: ['beginners', 'traders', 'investors', 'developers'],
  },
  fitness: {
    name: 'Р¤РёС‚РЅРµСЃ Рё Р·РґРѕСЂРѕРІСЊРµ',
    directions: ['yoga', 'gym', 'nutrition', 'running', 'crossfit'],
    cities: ['moscow', 'spb', 'kazan', 'novosibirsk', 'ekaterinburg'],
    audiences: ['beginners', 'athletes', 'women', 'men', 'seniors'],
  },
  education: {
    name: 'РћРЅР»Р°Р№РЅ-РѕР±СЂР°Р·РѕРІР°РЅРёРµ',
    directions: ['programming', 'design', 'marketing', 'languages', 'business'],
    cities: ['moscow', 'spb', 'kazan', 'novosibirsk', 'ekaterinburg'],
    audiences: ['students', 'professionals', 'freelancers', 'entrepreneurs'],
  },
  realestate: {
    name: 'РќРµРґРІРёР¶РёРјРѕСЃС‚СЊ',
    directions: ['buying', 'selling', 'renting', 'investing', 'mortgage'],
    cities: ['moscow', 'spb', 'kazan', 'novosibirsk', 'ekaterinburg'],
    audiences: ['buyers', 'sellers', 'investors', 'renters'],
  },
};

// ============================================================
// MAIN GENERATOR CLASS
// ============================================================

class SatelliteGenerator {
  constructor(options) {
    this.niche = options.niche;
    this.targetPages = options.pages || 300;
    this.domain = options.domain || `${this.niche}-guide-${Date.now()}`;
    this.outputPath = path.join(CONFIG.outputDir, this.domain);
    this.customData = options.customData || null; // AI-generated data from ContentGenerator
    this.templateFamily =
      options.templateFamily ||
      this.customData?.siteMeta?.templateFamily ||
      pickTemplateFamily(options.satelliteNumber || 1, this.niche);
  }

  async generate() {
    console.log(`рџљЂ Р“РµРЅРµСЂР°С†РёСЏ СЃР°С‚РµР»Р»РёС‚Р°: ${this.domain}`);
    console.log(`рџ“Љ Р¦РµР»РµРІРѕРµ РєРѕР»РёС‡РµСЃС‚РІРѕ СЃС‚СЂР°РЅРёС†: ${this.targetPages}`);

    // РЁР°Рі 1: РљРѕРїРёСЂСѓРµРј Р±Р°Р·РѕРІС‹Р№ С€Р°Р±Р»РѕРЅ
    await this.copyTemplate();

    // РЁР°Рі 2: Р“РµРЅРµСЂРёСЂСѓРµРј СѓРЅРёРєР°Р»СЊРЅС‹Рµ РґР°РЅРЅС‹Рµ
    await this.generateData();

    // РЁР°Рі 3: РћР±РЅРѕРІР»СЏРµРј РєРѕРЅС„РёРіСѓСЂР°С†РёСЋ
    await this.updateConfig();

    // РЁР°Рі 4: РЈСЃС‚Р°РЅР°РІР»РёРІР°РµРј Р·Р°РІРёСЃРёРјРѕСЃС‚Рё
    await this.installDependencies();

    console.log(`вњ… РЎР°С‚РµР»Р»РёС‚ СЃРѕР·РґР°РЅ: ${this.outputPath}`);
    console.log(`рџ“ќ РЎР»РµРґСѓСЋС‰РёРµ С€Р°РіРё:`);
    console.log(`   1. cd ${this.outputPath}`);
    console.log(`   2. npm run build`);
    console.log(`   3. npx @opennextjs/cloudflare build`);
    console.log(`   4. npx wrangler deploy --config wrangler.toml --name <workerName> --route <route>`);
  }

  async copyTemplate() {
    console.log('рџ“Ѓ РљРѕРїРёСЂРѕРІР°РЅРёРµ С€Р°Р±Р»РѕРЅР°...');

    // РЎРѕР·РґР°С‘Рј РґРёСЂРµРєС‚РѕСЂРёСЋ
    if (!fs.existsSync(CONFIG.outputDir)) {
      fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    }

    // РљРѕРїРёСЂСѓРµРј РІСЃС‘ РєСЂРѕРјРµ node_modules, .next, out Рё РєР°С‚Р°Р»РѕРіР° satellites
    // (РёРЅР°С‡Рµ РїРѕР»СѓС‡РёС‚СЃСЏ СЂРµРєСѓСЂСЃРёРІРЅР°СЏ РІР»РѕР¶РµРЅРЅРѕСЃС‚СЊ satellites РІРЅСѓС‚СЂРё РєР°Р¶РґРѕРіРѕ СЃР°С‚РµР»Р»РёС‚Р°)
    const excludeDirs = [
      'node_modules',
      '.next',
      '.open-next',
      'out',
      '.git',
      '.claude',
      'coverage',
      'logs',
      'playwright-report',
      'test-results',
      'scripts',
      'satellites',
    ];

    this.copyDirRecursive(CONFIG.templateDir, this.outputPath, excludeDirs);
  }

  copyDirRecursive(src, dest, exclude = []) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (exclude.includes(entry.name)) continue;

      if (entry.isDirectory()) {
        this.copyDirRecursive(srcPath, destPath, exclude);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  async generateData() {
    console.log('рџЋІ Р“РµРЅРµСЂР°С†РёСЏ СѓРЅРёРєР°Р»СЊРЅС‹С… РґР°РЅРЅС‹С…...');

    // If customData provided (from AI ContentGenerator), use it
    if (this.customData) {
      console.log('вњ… РСЃРїРѕР»СЊР·СѓРµРј AI-СЃРіРµРЅРµСЂРёСЂРѕРІР°РЅРЅС‹Рµ РґР°РЅРЅС‹Рµ');
      return this.saveCustomData(this.customData);
    }
    const contentGenerator = new ContentGenerator(CONFIG.openaiKey);
    const generatedData = await contentGenerator.generateSatelliteData(
      this.niche,
      1,
      this.targetPages
    );

    this.customData = generatedData;
    console.log('вњ… РСЃРїРѕР»СЊР·СѓРµРј Р»РѕРєР°Р»СЊРЅСѓСЋ СЃРµРјР°РЅС‚РёС‡РµСЃРєСѓСЋ РіРµРЅРµСЂР°С†РёСЋ РґР°РЅРЅС‹С…');
    return this.saveCustomData(generatedData);
  }

  generateDirections(nicheTemplate) {
    // Р“РµРЅРµСЂРёСЂСѓРµРј РЅР°РїСЂР°РІР»РµРЅРёСЏ РЅР° РѕСЃРЅРѕРІРµ С€Р°Р±Р»РѕРЅР°
    return nicheTemplate.directions.map((dir, idx) => ({
      id: dir,
      name: `${nicheTemplate.name} вЂ” ${dir}`,
      nameShort: dir,
      icon: this.getRandomIcon(),
      description: `РџРѕРґСЂРѕР±РЅРѕРµ СЂСѓРєРѕРІРѕРґСЃС‚РІРѕ РїРѕ ${dir} РІ РЅРёС€Рµ ${nicheTemplate.name}`,
      tools: [`Tool ${idx + 1}`, `Tool ${idx + 2}`, `Tool ${idx + 3}`],
      priceRange: `${5000 + idx * 1000} вЂ“ ${50000 + idx * 10000} в‚Ѕ`,
      difficulty: ['РќР°С‡Р°Р»СЊРЅС‹Р№', 'РЎСЂРµРґРЅРёР№', 'РџСЂРѕРґРІРёРЅСѓС‚С‹Р№'][idx % 3],
      timeToStart: `${3 + idx} РґРЅРµР№`,
      demand: ['Р’С‹СЃРѕРєРёР№', 'РЎСЂРµРґРЅРёР№', 'РћС‡РµРЅСЊ РІС‹СЃРѕРєРёР№'][idx % 3],
      keywords: [
        `${dir} ${nicheTemplate.name}`,
        `РєР°Рє Р·Р°СЂР°Р±РѕС‚Р°С‚СЊ РЅР° ${dir}`,
        `${dir} РґР»СЏ РЅР°С‡РёРЅР°СЋС‰РёС…`,
      ],
      faq: [
        { q: `Р§С‚Рѕ С‚Р°РєРѕРµ ${dir}?`, a: `${dir} вЂ” СЌС‚Рѕ РЅР°РїСЂР°РІР»РµРЅРёРµ РІ ${nicheTemplate.name}` },
        { q: `РЎРєРѕР»СЊРєРѕ РјРѕР¶РЅРѕ Р·Р°СЂР°Р±РѕС‚Р°С‚СЊ?`, a: `РћС‚ ${5000 + idx * 1000} РґРѕ ${50000 + idx * 10000} в‚Ѕ/РјРµСЃСЏС†` },
      ],
    }));
  }

  generateCities(nicheTemplate) {
    // Р Р°СЃС€РёСЂСЏРµРј СЃРїРёСЃРѕРє РіРѕСЂРѕРґРѕРІ РґР»СЏ Р±РѕР»СЊС€РµРіРѕ РєРѕР»РёС‡РµСЃС‚РІР° СЃС‚СЂР°РЅРёС†
    const baseCities = nicheTemplate.cities;
    const additionalCities = [
      'samara', 'rostov', 'ufa', 'krasnoyarsk', 'perm',
      'voronezh', 'volgograd', 'krasnodar', 'saratov', 'tyumen',
      'tolyatti', 'izhevsk', 'barnaul', 'ulyanovsk', 'irkutsk',
      'khabarovsk', 'yaroslavl', 'vladivostok', 'makhachkala', 'tomsk',
    ];

    const allCities = [...baseCities, ...additionalCities];

    // Р‘РµСЂС‘Рј СЃС‚РѕР»СЊРєРѕ РіРѕСЂРѕРґРѕРІ, СЃРєРѕР»СЊРєРѕ РЅСѓР¶РЅРѕ РґР»СЏ РґРѕСЃС‚РёР¶РµРЅРёСЏ С†РµР»РµРІРѕРіРѕ РєРѕР»РёС‡РµСЃС‚РІР° СЃС‚СЂР°РЅРёС†
    const citiesNeeded = Math.ceil(this.targetPages / 10); // РїСЂРёРјРµСЂРЅРѕ 10 СЃС‚СЂР°РЅРёС† РЅР° РіРѕСЂРѕРґ

    return allCities.slice(0, citiesNeeded).map(city => ({
      name: this.capitalize(city),
      slug: city,
      region: 'Р РѕСЃСЃРёСЏ',
      population: '1M+',
    }));
  }

  generateTools(nicheTemplate) {
    const categories = ['РћСЃРЅРѕРІРЅС‹Рµ', 'РџСЂРѕРґРІРёРЅСѓС‚С‹Рµ', 'Р‘РµСЃРїР»Р°С‚РЅС‹Рµ', 'РџР»Р°С‚РЅС‹Рµ', 'РќРѕРІС‹Рµ', 'РџРѕРїСѓР»СЏСЂРЅС‹Рµ'];

    return categories.map((cat, idx) => ({
      name: cat,
      slug: cat.toLowerCase().replace(/\s+/g, '-'),
      tools: Array.from({ length: 20 }, (_, i) => ({
        name: `${nicheTemplate.name} Tool ${idx * 20 + i + 1}`,
        description: `РРЅСЃС‚СЂСѓРјРµРЅС‚ РґР»СЏ ${nicheTemplate.name}`,
        category: cat,
        pricing: i % 2 === 0 ? 'Р‘РµСЃРїР»Р°С‚РЅРѕ' : 'РћС‚ $10/РјРµСЃ',
        url: `https://example.com/tool-${idx}-${i}`,
        rating: (4 + Math.random()).toFixed(1),
      })),
    }));
  }

  generateArticles(nicheTemplate) {
    return Array.from({ length: 30 }, (_, i) => ({
      slug: `article-${i + 1}-${nicheTemplate.directions[i % nicheTemplate.directions.length]}`,
      title: `РљР°Рє Р·Р°СЂР°Р±РѕС‚Р°С‚СЊ РЅР° ${nicheTemplate.directions[i % nicheTemplate.directions.length]} РІ 2026`,
      h1: `${nicheTemplate.name}: ${nicheTemplate.directions[i % nicheTemplate.directions.length]}`,
      desc: `РџРѕР»РЅРѕРµ СЂСѓРєРѕРІРѕРґСЃС‚РІРѕ РїРѕ Р·Р°СЂР°Р±РѕС‚РєСѓ РЅР° ${nicheTemplate.directions[i % nicheTemplate.directions.length]}`,
      readTime: `${5 + (i % 10)} РјРёРЅ`,
    }));
  }

  calculateTotalPages(directions, cities, articles) {
    // Р¤РѕСЂРјСѓР»Р°: РЅР°РїСЂР°РІР»РµРЅРёСЏ + РіРѕСЂРѕРґР°*РЅР°РїСЂР°РІР»РµРЅРёСЏ + СЃС‚Р°С‚СЊРё + РёРЅСЃС‚СЂСѓРјРµРЅС‚С‹ + СЃСЂР°РІРЅРµРЅРёСЏ + Р°СѓРґРёС‚РѕСЂРёРё
    return directions + (cities * directions) + articles + 10 + 10 + 8;
  }

  async updateConfig() {
    console.log('вљ™пёЏ РћР±РЅРѕРІР»РµРЅРёРµ РєРѕРЅС„РёРіСѓСЂР°С†РёРё...');

    // РћР±РЅРѕРІР»СЏРµРј package.json
    const packageJsonPath = path.join(this.outputPath, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.name = this.domain;
    packageJson.version = '1.0.0';
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    // РЎРѕР·РґР°С‘Рј .env.local
    const envPath = path.join(this.outputPath, '.env.local');

    const parentDomain = process.env.SATELLITE_PARENT_DOMAIN;
    if (!parentDomain) {
      throw new Error('Missing required env: SATELLITE_PARENT_DOMAIN');
    }
    const siteUrl = `https://${this.domain}.${parentDomain}`;
    const siteMeta = this.customData?.siteMeta || {};
    const blueprint = getSemanticBlueprint(this.niche);
    const mainSiteUrl =
      process.env.MAIN_SITE_URL ||
      process.env.NEXT_PUBLIC_MAIN_SITE ||
      'https://seo-programmatic-main.berdniko9544.workers.dev';
    const siteName = siteMeta.siteName || `1MB3 ${blueprint.label}`;

    // Keep NEXT_PUBLIC_BASE_URL as an alias while the codebase migrates.
    fs.writeFileSync(
      envPath,
      [
        `NEXT_PUBLIC_SITE_URL=${siteUrl}`,
        `NEXT_PUBLIC_BASE_URL=${siteUrl}`,
        `NEXT_PUBLIC_SITE_NAME=${siteName}`,
        `NEXT_PUBLIC_BRAND=${siteMeta.brand || '1MB3'}`,
        `NEXT_PUBLIC_MAIN_SITE=${mainSiteUrl}`,
        `MAIN_SITE_URL=${mainSiteUrl}`,
        `NEXT_PUBLIC_SITE_VERTICAL=${this.niche}`,
        `NEXT_PUBLIC_TEMPLATE_FAMILY=${this.templateFamily}`,
      ].join('\n') + '\n'
    );
  }

  async installDependencies() {
    console.log('рџ“¦ РЈСЃС‚Р°РЅРѕРІРєР° Р·Р°РІРёСЃРёРјРѕСЃС‚РµР№...');
    try {
      execSync('npm install', { cwd: this.outputPath, stdio: 'inherit' });
    } catch (error) {
      console.warn('вљ пёЏ РќРµ СѓРґР°Р»РѕСЃСЊ СѓСЃС‚Р°РЅРѕРІРёС‚СЊ Р·Р°РІРёСЃРёРјРѕСЃС‚Рё Р°РІС‚РѕРјР°С‚РёС‡РµСЃРєРё');
      console.log('Р—Р°РїСѓСЃС‚РёС‚Рµ РІСЂСѓС‡РЅСѓСЋ: cd', this.outputPath, '&& npm install');
    }
  }

  // РЈС‚РёР»РёС‚С‹
  getRandomIcon() {
    const icons = ['рџљЂ', 'рџ’Ў', 'рџЋЇ', 'вљЎ', 'рџ”Ґ', 'рџ’°', 'рџ“€', 'рџЋЁ', 'рџ› пёЏ', 'рџ“Љ'];
    return icons[Math.floor(Math.random() * icons.length)];
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Save AI-generated custom data
   */
  saveCustomData(data) {
    const dataDir = path.join(this.outputPath, 'src', 'data');

    // Save directions
    fs.writeFileSync(
      path.join(dataDir, 'directions.js'),
      `// AI-generated for ${this.niche}\nconst directions = ${JSON.stringify(data.directions, null, 2)};\nmodule.exports = { directions };`
    );

    // Save locations (cities + audiences)
    fs.writeFileSync(
      path.join(dataDir, 'locations.js'),
      `// AI-generated for ${this.niche}\nconst cities = ${JSON.stringify(data.cities, null, 2)};\nconst audiences = ${JSON.stringify(data.audiences, null, 2)};\nmodule.exports = { cities, audiences };`
    );

    // Save tools
    fs.writeFileSync(
      path.join(dataDir, 'tools.js'),
      `// AI-generated for ${this.niche}\nconst toolCategories = ${JSON.stringify(data.tools, null, 2)};\nmodule.exports = { toolCategories };`
    );

    // Save articles + long-tail pages
    fs.writeFileSync(
      path.join(dataDir, 'content.js'),
      `// AI-generated for ${this.niche}\nconst howToArticles = ${JSON.stringify(data.articles, null, 2)};\nconst comparisonPairs = ${JSON.stringify(data.comparisonPairs || [], null, 2)};\nconst yearMonths = ${JSON.stringify(data.yearMonths || [], null, 2)};\nmodule.exports = { howToArticles, comparisonPairs, yearMonths };`
    );

    // Save long-tail pages separately
    if (data.longTailPages && data.longTailPages.length > 0) {
      fs.writeFileSync(
        path.join(dataDir, 'longtail-pages.js'),
        `// AI-generated long-tail pages (${data.longTailPages.length} pages)\nconst longTailPages = ${JSON.stringify(data.longTailPages, null, 2)};\nmodule.exports = { longTailPages };`
      );
    }

    console.log(`вњ… РЎРѕС…СЂР°РЅРµРЅС‹ AI-РґР°РЅРЅС‹Рµ:`);
    console.log(`   - РќР°РїСЂР°РІР»РµРЅРёР№: ${data.directions.length}`);
    console.log(`   - Р“РѕСЂРѕРґРѕРІ: ${data.cities.length}`);
    console.log(`   - РРЅСЃС‚СЂСѓРјРµРЅС‚РѕРІ: ${data.tools.length}`);
    console.log(`   - РЎС‚Р°С‚РµР№: ${data.articles.length}`);
    console.log(`   - Long-tail СЃС‚СЂР°РЅРёС†: ${data.longTailPages?.length || 0}`);
    console.log(`   - Р’СЃРµРіРѕ СЃС‚СЂР°РЅРёС†: ${data.allPages?.length || 0}`);
  }
}

// ============================================================
// CLI INTERFACE
// ============================================================

async function main() {
  const args = process.argv.slice(2);

  const options = {
    niche: 'ai-business',
    pages: 300,
    domain: null,
  };

  // РџР°СЂСЃРёРј Р°СЂРіСѓРјРµРЅС‚С‹
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--niche' && args[i + 1]) {
      options.niche = args[i + 1];
      i++;
    } else if (args[i] === '--pages' && args[i + 1]) {
      options.pages = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--domain' && args[i + 1]) {
      options.domain = args[i + 1];
      i++;
    }
  }

  console.log('рџЋЇ РџР°СЂР°РјРµС‚СЂС‹ РіРµРЅРµСЂР°С†РёРё:');
  console.log(`   РќРёС€Р°: ${options.niche}`);
  console.log(`   Р¦РµР»РµРІРѕРµ РєРѕР»-РІРѕ СЃС‚СЂР°РЅРёС†: ${options.pages}`);
  console.log(`   Р”РѕРјРµРЅ: ${options.domain || 'auto-generated'}`);
  console.log('');

  const generator = new SatelliteGenerator(options);
  await generator.generate();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { SatelliteGenerator };





