#!/usr/bin/env node

/**
 * SATELLITE GENERATOR v1.0
 * Генерирует новый сателлит с уникальными данными
 *
 * Usage: node satellite-generator.js --niche "crypto" --pages 500
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ============================================================
// CONFIGURATION
// ============================================================

const CONFIG = {
  // Базовый шаблон (текущий проект)
  templateDir: path.join(__dirname, '..'),

  // Директория для новых сателлитов
  outputDir: path.join(process.cwd(), 'satellites'),

  // API ключи (из .env)
  openaiKey: process.env.OPENAI_API_KEY,
  anthropicKey: process.env.ANTHROPIC_API_KEY,
};

// ============================================================
// NICHE TEMPLATES — Шаблоны ниш для генерации
// ============================================================

const NICHE_TEMPLATES = {
  crypto: {
    name: 'Криптовалюты и блокчейн',
    directions: ['trading', 'mining', 'staking', 'nft', 'defi'],
    cities: ['moscow', 'spb', 'kazan', 'novosibirsk', 'ekaterinburg'],
    audiences: ['beginners', 'traders', 'investors', 'developers'],
  },
  fitness: {
    name: 'Фитнес и здоровье',
    directions: ['yoga', 'gym', 'nutrition', 'running', 'crossfit'],
    cities: ['moscow', 'spb', 'kazan', 'novosibirsk', 'ekaterinburg'],
    audiences: ['beginners', 'athletes', 'women', 'men', 'seniors'],
  },
  education: {
    name: 'Онлайн-образование',
    directions: ['programming', 'design', 'marketing', 'languages', 'business'],
    cities: ['moscow', 'spb', 'kazan', 'novosibirsk', 'ekaterinburg'],
    audiences: ['students', 'professionals', 'freelancers', 'entrepreneurs'],
  },
  realestate: {
    name: 'Недвижимость',
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
    this.targetPages = options.pages || 500;
    this.domain = options.domain || `${this.niche}-guide-${Date.now()}`;
    this.outputPath = path.join(CONFIG.outputDir, this.domain);
    this.customData = options.customData || null; // AI-generated data from ContentGenerator
  }

  async generate() {
    console.log(`🚀 Генерация сателлита: ${this.domain}`);
    console.log(`📊 Целевое количество страниц: ${this.targetPages}`);

    // Шаг 1: Копируем базовый шаблон
    await this.copyTemplate();

    // Шаг 2: Генерируем уникальные данные
    await this.generateData();

    // Шаг 3: Обновляем конфигурацию
    await this.updateConfig();

    // Шаг 4: Устанавливаем зависимости
    await this.installDependencies();

    console.log(`✅ Сателлит создан: ${this.outputPath}`);
    console.log(`📝 Следующие шаги:`);
    console.log(`   1. cd ${this.outputPath}`);
    console.log(`   2. npm run build`);
    console.log(`   3. vercel deploy`);
  }

  async copyTemplate() {
    console.log('📁 Копирование шаблона...');

    // Создаём директорию
    if (!fs.existsSync(CONFIG.outputDir)) {
      fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    }

    // Копируем всё кроме node_modules, .next, out
    const excludeDirs = ['node_modules', '.next', 'out', '.git', 'scripts'];

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
    console.log('🎲 Генерация уникальных данных...');

    // If customData provided (from AI ContentGenerator), use it
    if (this.customData) {
      console.log('✅ Используем AI-сгенерированные данные');
      return this.saveCustomData(this.customData);
    }

    // Otherwise, generate template data
    const nicheTemplate = NICHE_TEMPLATES[this.niche] || NICHE_TEMPLATES.crypto;

    // Генерируем направления
    const directions = this.generateDirections(nicheTemplate);

    // Генерируем города (расширяем список)
    const cities = this.generateCities(nicheTemplate);

    // Генерируем инструменты
    const tools = this.generateTools(nicheTemplate);

    // Генерируем статьи
    const articles = this.generateArticles(nicheTemplate);

    // Сохраняем данные
    const dataDir = path.join(this.outputPath, 'src', 'data');

    fs.writeFileSync(
      path.join(dataDir, 'directions.js'),
      `// Auto-generated for ${this.niche}\nconst directions = ${JSON.stringify(directions, null, 2)};\nmodule.exports = { directions };`
    );

    fs.writeFileSync(
      path.join(dataDir, 'locations.js'),
      `// Auto-generated for ${this.niche}\nconst cities = ${JSON.stringify(cities, null, 2)};\nconst audiences = ${JSON.stringify(nicheTemplate.audiences, null, 2)};\nmodule.exports = { cities, audiences };`
    );

    fs.writeFileSync(
      path.join(dataDir, 'tools.js'),
      `// Auto-generated for ${this.niche}\nconst toolCategories = ${JSON.stringify(tools, null, 2)};\nmodule.exports = { toolCategories };`
    );

    fs.writeFileSync(
      path.join(dataDir, 'content.js'),
      `// Auto-generated for ${this.niche}\nconst howToArticles = ${JSON.stringify(articles, null, 2)};\nconst comparisonPairs = [];\nconst yearMonths = [];\nmodule.exports = { howToArticles, comparisonPairs, yearMonths };`
    );

    console.log(`✅ Сгенерировано:`);
    console.log(`   - Направлений: ${directions.length}`);
    console.log(`   - Городов: ${cities.length}`);
    console.log(`   - Инструментов: ${tools.length}`);
    console.log(`   - Статей: ${articles.length}`);
    console.log(`   - Ожидаемое кол-во страниц: ${this.calculateTotalPages(directions.length, cities.length, articles.length)}`);
  }

  generateDirections(nicheTemplate) {
    // Генерируем направления на основе шаблона
    return nicheTemplate.directions.map((dir, idx) => ({
      id: dir,
      name: `${nicheTemplate.name} — ${dir}`,
      nameShort: dir,
      icon: this.getRandomIcon(),
      description: `Подробное руководство по ${dir} в нише ${nicheTemplate.name}`,
      tools: [`Tool ${idx + 1}`, `Tool ${idx + 2}`, `Tool ${idx + 3}`],
      priceRange: `${5000 + idx * 1000} – ${50000 + idx * 10000} ₽`,
      difficulty: ['Начальный', 'Средний', 'Продвинутый'][idx % 3],
      timeToStart: `${3 + idx} дней`,
      demand: ['Высокий', 'Средний', 'Очень высокий'][idx % 3],
      keywords: [
        `${dir} ${nicheTemplate.name}`,
        `как заработать на ${dir}`,
        `${dir} для начинающих`,
      ],
      faq: [
        { q: `Что такое ${dir}?`, a: `${dir} — это направление в ${nicheTemplate.name}` },
        { q: `Сколько можно заработать?`, a: `От ${5000 + idx * 1000} до ${50000 + idx * 10000} ₽/месяц` },
      ],
    }));
  }

  generateCities(nicheTemplate) {
    // Расширяем список городов для большего количества страниц
    const baseCities = nicheTemplate.cities;
    const additionalCities = [
      'samara', 'rostov', 'ufa', 'krasnoyarsk', 'perm',
      'voronezh', 'volgograd', 'krasnodar', 'saratov', 'tyumen',
      'tolyatti', 'izhevsk', 'barnaul', 'ulyanovsk', 'irkutsk',
      'khabarovsk', 'yaroslavl', 'vladivostok', 'makhachkala', 'tomsk',
    ];

    const allCities = [...baseCities, ...additionalCities];

    // Берём столько городов, сколько нужно для достижения целевого количества страниц
    const citiesNeeded = Math.ceil(this.targetPages / 10); // примерно 10 страниц на город

    return allCities.slice(0, citiesNeeded).map(city => ({
      name: this.capitalize(city),
      slug: city,
      region: 'Россия',
      population: '1M+',
    }));
  }

  generateTools(nicheTemplate) {
    const categories = ['Основные', 'Продвинутые', 'Бесплатные', 'Платные', 'Новые', 'Популярные'];

    return categories.map((cat, idx) => ({
      name: cat,
      slug: cat.toLowerCase().replace(/\s+/g, '-'),
      tools: Array.from({ length: 20 }, (_, i) => ({
        name: `${nicheTemplate.name} Tool ${idx * 20 + i + 1}`,
        description: `Инструмент для ${nicheTemplate.name}`,
        category: cat,
        pricing: i % 2 === 0 ? 'Бесплатно' : 'От $10/мес',
        url: `https://example.com/tool-${idx}-${i}`,
        rating: (4 + Math.random()).toFixed(1),
      })),
    }));
  }

  generateArticles(nicheTemplate) {
    return Array.from({ length: 30 }, (_, i) => ({
      slug: `article-${i + 1}-${nicheTemplate.directions[i % nicheTemplate.directions.length]}`,
      title: `Как заработать на ${nicheTemplate.directions[i % nicheTemplate.directions.length]} в 2026`,
      h1: `${nicheTemplate.name}: ${nicheTemplate.directions[i % nicheTemplate.directions.length]}`,
      desc: `Полное руководство по заработку на ${nicheTemplate.directions[i % nicheTemplate.directions.length]}`,
      readTime: `${5 + (i % 10)} мин`,
    }));
  }

  calculateTotalPages(directions, cities, articles) {
    // Формула: направления + города*направления + статьи + инструменты + сравнения + аудитории
    return directions + (cities * directions) + articles + 10 + 10 + 8;
  }

  async updateConfig() {
    console.log('⚙️ Обновление конфигурации...');

    // Обновляем package.json
    const packageJsonPath = path.join(this.outputPath, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.name = this.domain;
    packageJson.version = '1.0.0';
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    // Создаём .env.local
    const envPath = path.join(this.outputPath, '.env.local');
    fs.writeFileSync(envPath, `NEXT_PUBLIC_SITE_URL=https://${this.domain}.vercel.app\nNEXT_PUBLIC_SITE_NAME=${this.niche} Guide\n`);
  }

  async installDependencies() {
    console.log('📦 Установка зависимостей...');
    try {
      execSync('npm install', { cwd: this.outputPath, stdio: 'inherit' });
    } catch (error) {
      console.warn('⚠️ Не удалось установить зависимости автоматически');
      console.log('Запустите вручную: cd', this.outputPath, '&& npm install');
    }
  }

  // Утилиты
  getRandomIcon() {
    const icons = ['🚀', '💡', '🎯', '⚡', '🔥', '💰', '📈', '🎨', '🛠️', '📊'];
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
      `// AI-generated for ${this.niche}\nconst howToArticles = ${JSON.stringify(data.articles, null, 2)};\nconst comparisonPairs = ${JSON.stringify(data.comparisonPairs || [], null, 2)};\nconst yearMonths = [];\nmodule.exports = { howToArticles, comparisonPairs, yearMonths };`
    );

    // Save long-tail pages separately
    if (data.longTailPages && data.longTailPages.length > 0) {
      fs.writeFileSync(
        path.join(dataDir, 'longtail-pages.js'),
        `// AI-generated long-tail pages (${data.longTailPages.length} pages)\nconst longTailPages = ${JSON.stringify(data.longTailPages, null, 2)};\nmodule.exports = { longTailPages };`
      );
    }

    console.log(`✅ Сохранены AI-данные:`);
    console.log(`   - Направлений: ${data.directions.length}`);
    console.log(`   - Городов: ${data.cities.length}`);
    console.log(`   - Инструментов: ${data.tools.length}`);
    console.log(`   - Статей: ${data.articles.length}`);
    console.log(`   - Long-tail страниц: ${data.longTailPages?.length || 0}`);
    console.log(`   - Всего страниц: ${data.allPages?.length || 0}`);
  }
}

// ============================================================
// CLI INTERFACE
// ============================================================

async function main() {
  const args = process.argv.slice(2);

  const options = {
    niche: 'crypto',
    pages: 500,
    domain: null,
  };

  // Парсим аргументы
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

  console.log('🎯 Параметры генерации:');
  console.log(`   Ниша: ${options.niche}`);
  console.log(`   Целевое кол-во страниц: ${options.pages}`);
  console.log(`   Домен: ${options.domain || 'auto-generated'}`);
  console.log('');

  const generator = new SatelliteGenerator(options);
  await generator.generate();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { SatelliteGenerator };
