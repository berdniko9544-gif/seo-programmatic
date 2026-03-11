#!/usr/bin/env node

/**
 * AUTOMATED DEPLOYMENT SCRIPT
 * Деплоит все сателлиты на Vercel
 *
 * Usage: node deploy-all.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ============================================================
// CONFIGURATION
// ============================================================

const CONFIG = {
  satellitesDir: path.join(__dirname, '../../satellites'),
  vercelToken: process.env.VERCEL_TOKEN,
  vercelTeam: process.env.VERCEL_TEAM,
  logFile: path.join(__dirname, '../../satellites/deploy-log.json'),
};

// ============================================================
// DEPLOYMENT MANAGER
// ============================================================

class DeploymentManager {
  constructor() {
    this.results = [];
  }

  async deployAll() {
    console.log('🚀 Автоматический деплой всех сателлитов на Vercel');
    console.log('');

    // Проверяем наличие Vercel CLI
    if (!this.checkVercelCLI()) {
      console.error('❌ Vercel CLI не установлен');
      console.log('Установите: npm i -g vercel');
      process.exit(1);
    }

    // Проверяем токен
    if (!CONFIG.vercelToken) {
      console.warn('⚠️ VERCEL_TOKEN не установлен');
      console.log('Получите токен: https://vercel.com/account/tokens');
      console.log('Установите: export VERCEL_TOKEN=your_token');
      console.log('');
      console.log('Продолжаем с интерактивной авторизацией...');
    }

    // Получаем список сателлитов
    const satellites = this.getSatellites();

    if (satellites.length === 0) {
      console.log('📭 Нет сателлитов для деплоя');
      return;
    }

    console.log(`📦 Найдено сателлитов: ${satellites.length}`);
    console.log('');

    const startTime = Date.now();

    // Деплоим каждый сателлит
    for (let i = 0; i < satellites.length; i++) {
      await this.deploySatellite(satellites[i], i + 1, satellites.length);
    }

    const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(2);

    console.log('\n✅ Деплой завершён!');
    console.log(`⏱️ Время: ${duration} минут`);
    console.log(`📊 Успешно: ${this.results.filter(r => r.success).length}/${satellites.length}`);

    // Сохраняем лог
    this.saveLog();

    // Выводим URL
    this.printURLs();
  }

  checkVercelCLI() {
    try {
      execSync('vercel --version', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }

  getSatellites() {
    if (!fs.existsSync(CONFIG.satellitesDir)) {
      return [];
    }

    const entries = fs.readdirSync(CONFIG.satellitesDir, { withFileTypes: true });

    return entries
      .filter(entry => entry.isDirectory())
      .map(entry => ({
        name: entry.name,
        path: path.join(CONFIG.satellitesDir, entry.name),
      }));
  }

  async deploySatellite(satellite, index, total) {
    console.log(`\n[${index}/${total}] 🚀 Деплой: ${satellite.name}`);

    const startTime = Date.now();

    try {
      // Шаг 1: Сборка
      console.log('  📦 Сборка...');
      execSync('npm run build', {
        cwd: satellite.path,
        stdio: 'pipe',
      });

      // Шаг 2: Деплой на Vercel
      console.log('  ☁️ Загрузка на Vercel...');

      const vercelCmd = CONFIG.vercelToken
        ? `vercel --prod --token=${CONFIG.vercelToken} --yes`
        : 'vercel --prod --yes';

      const output = execSync(vercelCmd, {
        cwd: satellite.path,
        encoding: 'utf8',
      });

      // Извлекаем URL из вывода
      const urlMatch = output.match(/https:\/\/[^\s]+/);
      const url = urlMatch ? urlMatch[0] : null;

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);

      this.results.push({
        name: satellite.name,
        url,
        success: true,
        duration,
        timestamp: new Date().toISOString(),
      });

      console.log(`  ✅ Готово за ${duration}s`);
      if (url) {
        console.log(`  🌐 URL: ${url}`);
      }
    } catch (error) {
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);

      this.results.push({
        name: satellite.name,
        url: null,
        success: false,
        error: error.message,
        duration,
        timestamp: new Date().toISOString(),
      });

      console.error(`  ❌ Ошибка: ${error.message}`);
    }
  }

  saveLog() {
    const log = {
      timestamp: new Date().toISOString(),
      results: this.results,
    };

    fs.writeFileSync(CONFIG.logFile, JSON.stringify(log, null, 2));
    console.log(`\n📝 Лог сохранён: ${CONFIG.logFile}`);
  }

  printURLs() {
    console.log('\n🌐 URL сателлитов:');
    console.log('─'.repeat(80));

    const successful = this.results.filter(r => r.success && r.url);

    successful.forEach((result, idx) => {
      console.log(`${idx + 1}. ${result.name}`);
      console.log(`   ${result.url}`);
    });

    console.log('─'.repeat(80));

    // Сохраняем список URL в файл
    const urlsFile = path.join(CONFIG.satellitesDir, 'urls.txt');
    const urls = successful.map(r => r.url).join('\n');
    fs.writeFileSync(urlsFile, urls);

    console.log(`\n📄 Список URL сохранён: ${urlsFile}`);
  }
}

// ============================================================
// CLI
// ============================================================

async function main() {
  const manager = new DeploymentManager();
  await manager.deployAll();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { DeploymentManager };
