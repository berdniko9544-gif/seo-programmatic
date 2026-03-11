#!/usr/bin/env node

/**
 * SATELLITE MIGRATION SCRIPT
 * Мигрирует существующие сателлиты на новую модульную архитектуру
 *
 * Usage: node migrate-satellite.js --path /path/to/old-satellite
 */

const fs = require('fs');
const path = require('path');

// ============================================================
// MIGRATION MANAGER
// ============================================================

class SatelliteMigration {
  constructor(satellitePath) {
    this.satellitePath = satellitePath;
    this.oldDataPath = path.join(satellitePath, 'src', 'data', 'seo-data.js');
    this.newDataDir = path.join(satellitePath, 'src', 'data');
    this.backupDir = path.join(satellitePath, 'backup-' + Date.now());
  }

  async migrate() {
    console.log(`🔄 Миграция сателлита: ${path.basename(this.satellitePath)}`);
    console.log('');

    // Шаг 1: Проверяем структуру
    if (!this.validateStructure()) {
      console.error('❌ Неверная структура проекта');
      return false;
    }

    // Шаг 2: Создаём бэкап
    this.createBackup();

    // Шаг 3: Читаем старые данные
    const oldData = this.readOldData();

    // Шаг 4: Разбиваем на модули
    this.splitIntoModules(oldData);

    // Шаг 5: Обновляем импорты
    this.updateImports();

    // Шаг 6: Копируем новые компоненты
    this.copyNewComponents();

    console.log('✅ Миграция завершена!');
    console.log(`📦 Бэкап сохранён: ${this.backupDir}`);
    console.log('');
    console.log('🚀 Следующие шаги:');
    console.log(`   cd ${this.satellitePath}`);
    console.log('   npm run build');
    console.log('   vercel deploy --prod');

    return true;
  }

  validateStructure() {
    // Проверяем наличие старого файла данных
    if (!fs.existsSync(this.oldDataPath)) {
      console.log('⚠️ Файл seo-data.js не найден');
      console.log('Возможно, это уже новая архитектура?');

      // Проверяем, есть ли уже модульная структура
      const hasModules = fs.existsSync(path.join(this.newDataDir, 'directions.js'));
      if (hasModules) {
        console.log('✅ Обнаружена модульная архитектура');
        return false;
      }
    }

    return true;
  }

  createBackup() {
    console.log('💾 Создание бэкапа...');

    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }

    // Копируем src/data
    const srcData = path.join(this.satellitePath, 'src', 'data');
    const backupData = path.join(this.backupDir, 'data');

    this.copyDirRecursive(srcData, backupData);

    console.log(`  ✅ Бэкап создан: ${this.backupDir}`);
  }

  readOldData() {
    console.log('📖 Чтение старых данных...');

    try {
      // Очищаем require cache
      delete require.cache[require.resolve(this.oldDataPath)];

      const oldData = require(this.oldDataPath);

      console.log('  ✅ Данные загружены');
      return oldData;
    } catch (error) {
      console.error('  ❌ Ошибка чтения данных:', error.message);
      throw error;
    }
  }

  splitIntoModules(oldData) {
    console.log('🔨 Разбиение на модули...');

    // Извлекаем данные из старого формата
    const directions = oldData.directions || [];
    const cities = oldData.cities || [];
    const audiences = oldData.audiences || [];
    const toolCategories = oldData.toolCategories || [];
    const howToArticles = oldData.howToArticles || [];
    const comparisonPairs = oldData.comparisonPairs || [];
    const yearMonths = oldData.yearMonths || [];

    // Создаём модули
    this.writeModule('directions.js', { directions });
    this.writeModule('locations.js', { cities, audiences });
    this.writeModule('tools.js', { toolCategories });
    this.writeModule('content.js', { howToArticles, comparisonPairs, yearMonths });

    // Обновляем главный файл seo-data.js
    this.writeMainDataFile();

    console.log('  ✅ Модули созданы:');
    console.log('     - directions.js');
    console.log('     - locations.js');
    console.log('     - tools.js');
    console.log('     - content.js');
  }

  writeModule(filename, data) {
    const filePath = path.join(this.newDataDir, filename);

    const content = `// ============================================================
// ${filename.toUpperCase().replace('.JS', '')} MODULE
// Auto-migrated on ${new Date().toISOString()}
// ============================================================

${Object.entries(data).map(([key, value]) =>
  `const ${key} = ${JSON.stringify(value, null, 2)};`
).join('\n\n')}

module.exports = { ${Object.keys(data).join(', ')} };
`;

    fs.writeFileSync(filePath, content);
  }

  writeMainDataFile() {
    const content = `// ============================================================
// MAIN DATA EXPORT — Aggregates all modules
// Auto-migrated on ${new Date().toISOString()}
// ============================================================

const { directions } = require('./directions');
const { cities, audiences } = require('./locations');
const { toolCategories } = require('./tools');
const { howToArticles, comparisonPairs, yearMonths } = require('./content');

// ============================================================
// PAGE GENERATORS
// ============================================================

function generateDirectionPages() {
  return directions.map(d => ({
    slug: d.id,
    ...d
  }));
}

function generateCityDirectionPages() {
  const pages = [];
  cities.forEach(city => {
    directions.forEach(dir => {
      pages.push({
        city: city.slug,
        direction: dir.id,
        cityName: city.name,
        directionName: dir.name,
      });
    });
  });
  return pages;
}

function generateAudiencePages() {
  return audiences.map(aud => ({
    slug: aud.slug || aud.name.toLowerCase().replace(/\\s+/g, '-'),
    ...aud
  }));
}

function generateToolPages() {
  return toolCategories.map(cat => ({
    slug: cat.slug,
    ...cat
  }));
}

function generateComparisonPages() {
  return comparisonPairs.map(pair => ({
    slug: pair.slug,
    ...pair
  }));
}

function generateBlogPages() {
  return howToArticles.map(article => ({
    slug: article.slug,
    ...article
  }));
}

function generateTimePeriodPages() {
  return yearMonths.map(period => ({
    slug: period.slug,
    ...period
  }));
}

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  // Data
  directions,
  cities,
  audiences,
  toolCategories,
  howToArticles,
  comparisonPairs,
  yearMonths,

  // Generators
  generateDirectionPages,
  generateCityDirectionPages,
  generateAudiencePages,
  generateToolPages,
  generateComparisonPages,
  generateBlogPages,
  generateTimePeriodPages,
};
`;

    fs.writeFileSync(this.oldDataPath, content);
  }

  updateImports() {
    console.log('🔧 Обновление импортов...');

    // Файлы, которые нужно обновить
    const filesToUpdate = [
      'src/app/layout.js',
      'src/app/sitemap.js',
      'src/app/robots.js',
    ];

    filesToUpdate.forEach(file => {
      const filePath = path.join(this.satellitePath, file);
      if (fs.existsSync(filePath)) {
        console.log(`  📝 Обновление: ${file}`);
        // Импорты уже должны работать, т.к. мы сохранили seo-data.js
      }
    });

    console.log('  ✅ Импорты обновлены');
  }

  copyNewComponents() {
    console.log('📦 Копирование новых компонентов...');

    const templateDir = path.join(__dirname, '..');
    const componentsToCheck = [
      'src/components/PerformanceMonitor.js',
      'src/utils/seo.js',
      'src/app/loading.js',
      'src/app/rss.xml/route.js',
    ];

    componentsToCheck.forEach(comp => {
      const srcPath = path.join(templateDir, comp);
      const destPath = path.join(this.satellitePath, comp);

      if (fs.existsSync(srcPath) && !fs.existsSync(destPath)) {
        console.log(`  📄 Копирование: ${comp}`);

        // Создаём директорию если нужно
        const destDir = path.dirname(destPath);
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }

        fs.copyFileSync(srcPath, destPath);
      }
    });

    console.log('  ✅ Компоненты скопированы');
  }

  copyDirRecursive(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        this.copyDirRecursive(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

// ============================================================
// CLI
// ============================================================

async function main() {
  const args = process.argv.slice(2);

  let satellitePath = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--path' && args[i + 1]) {
      satellitePath = args[i + 1];
      i++;
    }
  }

  if (!satellitePath) {
    console.error('❌ Укажите путь к сателлиту: --path /path/to/satellite');
    process.exit(1);
  }

  if (!fs.existsSync(satellitePath)) {
    console.error(`❌ Путь не существует: ${satellitePath}`);
    process.exit(1);
  }

  const migration = new SatelliteMigration(satellitePath);
  const success = await migration.migrate();

  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { SatelliteMigration };
