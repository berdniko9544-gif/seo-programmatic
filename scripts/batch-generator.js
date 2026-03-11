#!/usr/bin/env node

/**
 * BATCH SATELLITE GENERATOR
 * Создаёт несколько сателлитов параллельно
 *
 * Usage: node batch-generator.js --count 20 --niche crypto --pages 500
 */

const { SatelliteGenerator } = require('./satellite-generator');
const fs = require('fs');
const path = require('path');

// ============================================================
// CONFIGURATION
// ============================================================

const NICHES = ['crypto', 'fitness', 'education', 'realestate'];

const BATCH_CONFIG = {
  maxParallel: 5, // Максимум параллельных генераций
  delayBetweenBatches: 2000, // 2 секунды между батчами
  logFile: path.join(__dirname, '../../satellites/batch-log.json'),
};

// ============================================================
// BATCH GENERATOR
// ============================================================

class BatchGenerator {
  constructor(options) {
    this.count = options.count || 20;
    this.niche = options.niche || 'random';
    this.pages = options.pages || 500;
    this.results = [];
  }

  async generate() {
    console.log(`🚀 Запуск батч-генерации: ${this.count} сателлитов`);
    console.log(`📊 Параметры: ниша=${this.niche}, страниц=${this.pages}`);
    console.log('');

    const startTime = Date.now();

    // Разбиваем на батчи
    const batches = this.createBatches();

    for (let i = 0; i < batches.length; i++) {
      console.log(`\n📦 Батч ${i + 1}/${batches.length} (${batches[i].length} сателлитов)`);

      await this.processBatch(batches[i]);

      // Задержка между батчами
      if (i < batches.length - 1) {
        await this.sleep(BATCH_CONFIG.delayBetweenBatches);
      }
    }

    const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(2);

    console.log('\n✅ Батч-генерация завершена!');
    console.log(`⏱️ Время: ${duration} минут`);
    console.log(`📊 Успешно: ${this.results.filter(r => r.success).length}/${this.count}`);
    console.log(`❌ Ошибок: ${this.results.filter(r => !r.success).length}`);

    // Сохраняем лог
    this.saveLog();

    // Выводим список созданных сателлитов
    this.printSummary();
  }

  createBatches() {
    const batches = [];
    const satellites = [];

    // Создаём список сателлитов для генерации
    for (let i = 0; i < this.count; i++) {
      const niche = this.niche === 'random'
        ? NICHES[Math.floor(Math.random() * NICHES.length)]
        : this.niche;

      satellites.push({
        id: i + 1,
        niche,
        pages: this.pages,
        domain: `${niche}-${Date.now()}-${i}`,
      });
    }

    // Разбиваем на батчи
    for (let i = 0; i < satellites.length; i += BATCH_CONFIG.maxParallel) {
      batches.push(satellites.slice(i, i + BATCH_CONFIG.maxParallel));
    }

    return batches;
  }

  async processBatch(batch) {
    const promises = batch.map(sat => this.generateSatellite(sat));
    await Promise.allSettled(promises);
  }

  async generateSatellite(config) {
    const startTime = Date.now();

    try {
      console.log(`  🔨 [${config.id}] Генерация: ${config.domain}`);

      const generator = new SatelliteGenerator({
        niche: config.niche,
        pages: config.pages,
        domain: config.domain,
      });

      await generator.generate();

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);

      this.results.push({
        id: config.id,
        domain: config.domain,
        niche: config.niche,
        pages: config.pages,
        success: true,
        duration,
        timestamp: new Date().toISOString(),
      });

      console.log(`  ✅ [${config.id}] Готово за ${duration}s`);
    } catch (error) {
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);

      this.results.push({
        id: config.id,
        domain: config.domain,
        niche: config.niche,
        pages: config.pages,
        success: false,
        error: error.message,
        duration,
        timestamp: new Date().toISOString(),
      });

      console.error(`  ❌ [${config.id}] Ошибка: ${error.message}`);
    }
  }

  saveLog() {
    const logDir = path.dirname(BATCH_CONFIG.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const log = {
      timestamp: new Date().toISOString(),
      count: this.count,
      niche: this.niche,
      pages: this.pages,
      results: this.results,
    };

    fs.writeFileSync(BATCH_CONFIG.logFile, JSON.stringify(log, null, 2));
    console.log(`\n📝 Лог сохранён: ${BATCH_CONFIG.logFile}`);
  }

  printSummary() {
    console.log('\n📋 Созданные сателлиты:');
    console.log('─'.repeat(80));

    const successful = this.results.filter(r => r.success);

    successful.forEach(result => {
      console.log(`${result.id}. ${result.domain}`);
      console.log(`   Ниша: ${result.niche} | Страниц: ~${result.pages} | Время: ${result.duration}s`);
    });

    console.log('─'.repeat(80));
    console.log('\n🚀 Следующие шаги:');
    console.log('1. Соберите все сателлиты:');
    console.log('   node scripts/build-all.js');
    console.log('2. Задеплойте на Vercel:');
    console.log('   node scripts/deploy-all.js');
    console.log('3. Отправьте в поисковики:');
    console.log('   node scripts/submit-to-search.js');
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ============================================================
// CLI
// ============================================================

async function main() {
  const args = process.argv.slice(2);

  const options = {
    count: 20,
    niche: 'random',
    pages: 500,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--count' && args[i + 1]) {
      options.count = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--niche' && args[i + 1]) {
      options.niche = args[i + 1];
      i++;
    } else if (args[i] === '--pages' && args[i + 1]) {
      options.pages = parseInt(args[i + 1], 10);
      i++;
    }
  }

  const generator = new BatchGenerator(options);
  await generator.generate();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { BatchGenerator };
