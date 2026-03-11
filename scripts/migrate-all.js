#!/usr/bin/env node

/**
 * BATCH MIGRATION SCRIPT
 * Мигрирует все существующие сателлиты на новую архитектуру
 *
 * Usage: node migrate-all.js --dir /path/to/satellites-folder
 */

const fs = require('fs');
const path = require('path');
const { SatelliteMigration } = require('./migrate-satellite');

// ============================================================
// BATCH MIGRATION MANAGER
// ============================================================

class BatchMigration {
  constructor(satellitesDir) {
    this.satellitesDir = satellitesDir;
    this.results = [];
  }

  async migrateAll() {
    console.log('🔄 Батч-миграция всех сателлитов');
    console.log(`📁 Директория: ${this.satellitesDir}`);
    console.log('');

    // Получаем список сателлитов
    const satellites = this.getSatellites();

    if (satellites.length === 0) {
      console.log('📭 Сателлиты не найдены');
      return;
    }

    console.log(`📦 Найдено сателлитов: ${satellites.length}`);
    console.log('');

    const startTime = Date.now();

    // Мигрируем каждый сателлит
    for (let i = 0; i < satellites.length; i++) {
      await this.migrateSatellite(satellites[i], i + 1, satellites.length);
    }

    const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(2);

    console.log('\n✅ Миграция завершена!');
    console.log(`⏱️ Время: ${duration} минут`);
    console.log(`📊 Успешно: ${this.results.filter(r => r.success).length}/${satellites.length}`);
    console.log(`❌ Ошибок: ${this.results.filter(r => !r.success).length}`);

    // Сохраняем лог
    this.saveLog();

    // Выводим результаты
    this.printSummary();
  }

  getSatellites() {
    if (!fs.existsSync(this.satellitesDir)) {
      console.error(`❌ Директория не существует: ${this.satellitesDir}`);
      return [];
    }

    const entries = fs.readdirSync(this.satellitesDir, { withFileTypes: true });

    return entries
      .filter(entry => {
        if (!entry.isDirectory()) return false;

        // Проверяем, что это Next.js проект
        const packageJsonPath = path.join(this.satellitesDir, entry.name, 'package.json');
        return fs.existsSync(packageJsonPath);
      })
      .map(entry => ({
        name: entry.name,
        path: path.join(this.satellitesDir, entry.name),
      }));
  }

  async migrateSatellite(satellite, index, total) {
    console.log(`\n[${index}/${total}] 🔄 Миграция: ${satellite.name}`);
    console.log('─'.repeat(60));

    const startTime = Date.now();

    try {
      const migration = new SatelliteMigration(satellite.path);
      const success = await migration.migrate();

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);

      this.results.push({
        name: satellite.name,
        path: satellite.path,
        success,
        duration,
        timestamp: new Date().toISOString(),
      });

      if (success) {
        console.log(`✅ Готово за ${duration}s`);
      }
    } catch (error) {
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);

      this.results.push({
        name: satellite.name,
        path: satellite.path,
        success: false,
        error: error.message,
        duration,
        timestamp: new Date().toISOString(),
      });

      console.error(`❌ Ошибка: ${error.message}`);
    }
  }

  saveLog() {
    const logFile = path.join(this.satellitesDir, 'migration-log.json');

    const log = {
      timestamp: new Date().toISOString(),
      satellitesDir: this.satellitesDir,
      results: this.results,
    };

    fs.writeFileSync(logFile, JSON.stringify(log, null, 2));
    console.log(`\n📝 Лог сохранён: ${logFile}`);
  }

  printSummary() {
    console.log('\n📋 Результаты миграции:');
    console.log('═'.repeat(80));

    const successful = this.results.filter(r => r.success);
    const failed = this.results.filter(r => !r.success);

    if (successful.length > 0) {
      console.log('\n✅ Успешно мигрированы:');
      successful.forEach((result, idx) => {
        console.log(`   ${idx + 1}. ${result.name} (${result.duration}s)`);
      });
    }

    if (failed.length > 0) {
      console.log('\n❌ Ошибки:');
      failed.forEach((result, idx) => {
        console.log(`   ${idx + 1}. ${result.name}`);
        console.log(`      ${result.error}`);
      });
    }

    console.log('\n═'.repeat(80));
    console.log('\n🚀 Следующие шаги:');
    console.log('');
    console.log('1. Пересоберите все сателлиты:');
    successful.forEach(result => {
      console.log(`   cd ${result.path} && npm run build`);
    });
    console.log('');
    console.log('2. Или используйте автоматический деплой:');
    console.log(`   node scripts/deploy-all.js`);
  }
}

// ============================================================
// CLI
// ============================================================

async function main() {
  const args = process.argv.slice(2);

  let satellitesDir = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--dir' && args[i + 1]) {
      satellitesDir = args[i + 1];
      i++;
    }
  }

  if (!satellitesDir) {
    console.error('❌ Укажите директорию с сателлитами: --dir /path/to/satellites');
    console.log('');
    console.log('Пример:');
    console.log('  node migrate-all.js --dir ~/projects/satellites');
    process.exit(1);
  }

  const migration = new BatchMigration(satellitesDir);
  await migration.migrateAll();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { BatchMigration };
