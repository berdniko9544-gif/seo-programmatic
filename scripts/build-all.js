#!/usr/bin/env node

/**
 * BUILD ALL SATELLITES
 * Собирает все сателлиты параллельно
 *
 * Usage: node build-all.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ============================================================
// CONFIGURATION
// ============================================================

const CONFIG = {
  satellitesDir: path.join(process.cwd(), 'satellites'),
  maxParallel: 3, // Максимум параллельных сборок
  logFile: path.join(process.cwd(), 'satellites', 'build-log.json'),
};

// ============================================================
// BUILD MANAGER
// ============================================================

class BuildManager {
  constructor() {
    this.results = [];
  }

  async buildAll() {
    console.log('🔨 Сборка всех сателлитов');
    console.log('');

    // Получаем список сателлитов
    const satellites = this.getSatellites();

    if (satellites.length === 0) {
      console.log('📭 Нет сателлитов для сборки');
      return;
    }

    console.log(`📦 Найдено сателлитов: ${satellites.length}`);
    console.log(`⚙️ Параллельных сборок: ${CONFIG.maxParallel}`);
    console.log('');

    const startTime = Date.now();

    // Разбиваем на батчи
    const batches = this.createBatches(satellites);

    for (let i = 0; i < batches.length; i++) {
      console.log(`\n📦 Батч ${i + 1}/${batches.length} (${batches[i].length} сателлитов)`);
      await this.processBatch(batches[i]);
    }

    const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(2);

    console.log('\n✅ Сборка завершена!');
    console.log(`⏱️ Время: ${duration} минут`);
    console.log(`📊 Успешно: ${this.results.filter(r => r.success).length}/${satellites.length}`);
    console.log(`❌ Ошибок: ${this.results.filter(r => !r.success).length}`);

    // Сохраняем лог
    this.saveLog();

    // Выводим статистику
    this.printStats();
  }

  getSatellites() {
    if (!fs.existsSync(CONFIG.satellitesDir)) {
      return [];
    }

    const entries = fs.readdirSync(CONFIG.satellitesDir, { withFileTypes: true });

    return entries
      .filter(entry => {
        if (!entry.isDirectory()) return false;

        const packageJsonPath = path.join(CONFIG.satellitesDir, entry.name, 'package.json');
        return fs.existsSync(packageJsonPath);
      })
      .map(entry => ({
        name: entry.name,
        path: path.join(CONFIG.satellitesDir, entry.name),
      }));
  }

  createBatches(satellites) {
    const batches = [];
    for (let i = 0; i < satellites.length; i += CONFIG.maxParallel) {
      batches.push(satellites.slice(i, i + CONFIG.maxParallel));
    }
    return batches;
  }

  async processBatch(batch) {
    const promises = batch.map(sat => this.buildSatellite(sat));
    await Promise.allSettled(promises);
  }

  async buildSatellite(satellite) {
    const startTime = Date.now();

    console.log(`  🔨 [${satellite.name}] Сборка...`);

    try {
      execSync('npm run build', {
        cwd: satellite.path,
        stdio: 'pipe',
      });

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);

      // Подсчитываем количество страниц
      const pageCount = this.countPages(satellite.path);

      this.results.push({
        name: satellite.name,
        path: satellite.path,
        success: true,
        pageCount,
        duration,
        timestamp: new Date().toISOString(),
      });

      console.log(`  ✅ [${satellite.name}] Готово за ${duration}s (${pageCount} страниц)`);
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

      console.error(`  ❌ [${satellite.name}] Ошибка: ${error.message.split('\n')[0]}`);
    }
  }

  countPages(satellitePath) {
    const prerenderManifestPath = path.join(satellitePath, '.next', 'prerender-manifest.json');
    if (fs.existsSync(prerenderManifestPath)) {
      try {
        const prerenderManifest = JSON.parse(fs.readFileSync(prerenderManifestPath, 'utf8'));
        const routesCount = Object.keys(prerenderManifest.routes || {}).length;
        const dynamicRoutesCount = Object.values(prerenderManifest.dynamicRoutes || {}).reduce(
          (sum, route) => sum + ((route?.fallbackRouteParams?.length && route.fallbackRouteParams.length) || 0),
          0
        );
        const notFoundRoutes = prerenderManifest.notFoundRoutes?.length || 0;
        return routesCount + dynamicRoutesCount + notFoundRoutes;
      } catch {
        // Fall through to HTML counting if the manifest is unavailable.
      }
    }

    const outDir = path.join(satellitePath, 'out');
    if (!fs.existsSync(outDir)) return 0;

    let count = 0;

    const walk = (dir) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          walk(fullPath);
        } else if (entry.name.endsWith('.html')) {
          count++;
        }
      }
    };

    walk(outDir);
    return count;
  }

  saveLog() {
    const log = {
      timestamp: new Date().toISOString(),
      results: this.results,
    };

    fs.writeFileSync(CONFIG.logFile, JSON.stringify(log, null, 2));
    console.log(`\n📝 Лог сохранён: ${CONFIG.logFile}`);
  }

  printStats() {
    console.log('\n📊 Статистика сборки:');
    console.log('═'.repeat(80));

    const successful = this.results.filter(r => r.success);
    const failed = this.results.filter(r => !r.success);

    if (successful.length > 0) {
      const totalPages = successful.reduce((sum, r) => sum + r.pageCount, 0);
      const avgPages = (totalPages / successful.length).toFixed(0);
      const avgTime = (successful.reduce((sum, r) => sum + parseFloat(r.duration), 0) / successful.length).toFixed(2);

      console.log(`\n✅ Успешно собрано: ${successful.length}`);
      console.log(`   Всего страниц: ${totalPages}`);
      console.log(`   Среднее кол-во страниц: ${avgPages}`);
      console.log(`   Среднее время сборки: ${avgTime}s`);
    }

    if (failed.length > 0) {
      console.log(`\n❌ Ошибки: ${failed.length}`);
      failed.forEach((result, idx) => {
        console.log(`   ${idx + 1}. ${result.name}`);
      });
    }

    console.log('\n═'.repeat(80));
    console.log('\n🚀 Следующий шаг:');
    console.log('   node scripts/deploy-all.js');
  }
}

// ============================================================
// CLI
// ============================================================

async function main() {
  const manager = new BuildManager();
  await manager.buildAll();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { BuildManager };
