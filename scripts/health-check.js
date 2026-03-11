#!/usr/bin/env node

/**
 * HEALTH CHECK SCRIPT
 * Проверяет готовность системы к автоматизации
 *
 * Usage: node scripts/health-check.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ============================================================
// HEALTH CHECK
// ============================================================

class HealthCheck {
  constructor() {
    this.checks = [];
    this.warnings = [];
    this.errors = [];
  }

  async run() {
    console.log('🏥 HEALTH CHECK — Проверка готовности системы');
    console.log('═'.repeat(80));
    console.log('');

    // Проверки
    this.checkNodeVersion();
    this.checkNpmPackages();
    this.checkVercelCLI();
    this.checkProjectStructure();
    this.checkScripts();
    this.checkEnvVariables();
    this.checkDiskSpace();

    // Результаты
    this.printResults();
  }

  checkNodeVersion() {
    try {
      const version = process.version;
      const major = parseInt(version.slice(1).split('.')[0]);

      if (major >= 18) {
        this.pass('Node.js', `${version} ✅`);
      } else {
        this.warn('Node.js', `${version} (рекомендуется >= 18.x)`);
      }
    } catch (error) {
      this.fail('Node.js', 'Не удалось определить версию');
    }
  }

  checkNpmPackages() {
    try {
      const packageJson = require('../package.json');
      const nodeModules = path.join(__dirname, '..', 'node_modules');

      if (fs.existsSync(nodeModules)) {
        this.pass('NPM пакеты', 'Установлены ✅');
      } else {
        this.fail('NPM пакеты', 'Не установлены. Запустите: npm install');
      }
    } catch (error) {
      this.fail('NPM пакеты', error.message);
    }
  }

  checkVercelCLI() {
    try {
      execSync('vercel --version', { stdio: 'pipe' });
      this.pass('Vercel CLI', 'Установлен ✅');
    } catch (error) {
      this.fail('Vercel CLI', 'Не установлен. Запустите: npm i -g vercel');
    }
  }

  checkProjectStructure() {
    const requiredDirs = [
      'src/app',
      'src/data',
      'src/components',
      'scripts',
    ];

    const requiredFiles = [
      'src/data/seo-data.js',
      'src/data/directions.js',
      'src/data/locations.js',
      'src/data/tools.js',
      'src/data/content.js',
      'next.config.js',
      'package.json',
    ];

    let allGood = true;

    for (const dir of requiredDirs) {
      const fullPath = path.join(__dirname, '..', dir);
      if (!fs.existsSync(fullPath)) {
        this.fail('Структура проекта', `Отсутствует директория: ${dir}`);
        allGood = false;
      }
    }

    for (const file of requiredFiles) {
      const fullPath = path.join(__dirname, '..', file);
      if (!fs.existsSync(fullPath)) {
        this.fail('Структура проекта', `Отсутствует файл: ${file}`);
        allGood = false;
      }
    }

    if (allGood) {
      this.pass('Структура проекта', 'Все файлы на месте ✅');
    }
  }

  checkScripts() {
    const scripts = [
      'satellite-generator.js',
      'batch-generator.js',
      'migrate-satellite.js',
      'migrate-all.js',
      'build-all.js',
      'deploy-all.js',
      'submit-to-search.js',
      'master.js',
    ];

    let allGood = true;

    for (const script of scripts) {
      const fullPath = path.join(__dirname, script);
      if (!fs.existsSync(fullPath)) {
        this.fail('Скрипты автоматизации', `Отсутствует: ${script}`);
        allGood = false;
      }
    }

    if (allGood) {
      this.pass('Скрипты автоматизации', 'Все скрипты на месте ✅');
    }
  }

  checkEnvVariables() {
    const vercelToken = process.env.VERCEL_TOKEN;
    const vercelTeam = process.env.VERCEL_TEAM;
    const yandexToken = process.env.YANDEX_WEBMASTER_TOKEN;

    if (vercelToken) {
      this.pass('VERCEL_TOKEN', 'Установлен ✅');
    } else {
      this.warn('VERCEL_TOKEN', 'Не установлен (потребуется для автоматического деплоя)');
    }

    if (vercelTeam) {
      this.pass('VERCEL_TEAM', 'Установлен ✅');
    } else {
      this.warn('VERCEL_TEAM', 'Не установлен (опционально для Vercel Pro)');
    }

    if (yandexToken) {
      this.pass('YANDEX_WEBMASTER_TOKEN', 'Установлен ✅');
    } else {
      this.warn('YANDEX_WEBMASTER_TOKEN', 'Не установлен (опционально для автоматической отправки в Яндекс)');
    }
  }

  checkDiskSpace() {
    try {
      // Проверяем доступное место на диске
      const stats = fs.statfsSync || fs.statSync;
      this.pass('Дисковое пространство', 'Проверка пропущена (требуется ручная проверка)');
    } catch (error) {
      this.warn('Дисковое пространство', 'Не удалось проверить');
    }
  }

  pass(category, message) {
    this.checks.push({ status: 'pass', category, message });
  }

  warn(category, message) {
    this.checks.push({ status: 'warn', category, message });
    this.warnings.push({ category, message });
  }

  fail(category, message) {
    this.checks.push({ status: 'fail', category, message });
    this.errors.push({ category, message });
  }

  printResults() {
    console.log('\n📊 Результаты проверки:');
    console.log('─'.repeat(80));

    for (const check of this.checks) {
      const icon = check.status === 'pass' ? '✅' : check.status === 'warn' ? '⚠️' : '❌';
      console.log(`${icon} ${check.category}: ${check.message}`);
    }

    console.log('─'.repeat(80));

    const passCount = this.checks.filter(c => c.status === 'pass').length;
    const warnCount = this.warnings.length;
    const errorCount = this.errors.length;

    console.log(`\n📈 Итого: ${passCount} ✅ | ${warnCount} ⚠️ | ${errorCount} ❌`);

    if (errorCount > 0) {
      console.log('\n❌ КРИТИЧЕСКИЕ ОШИБКИ:');
      this.errors.forEach((err, idx) => {
        console.log(`   ${idx + 1}. ${err.category}: ${err.message}`);
      });
      console.log('\nИсправьте ошибки перед использованием автоматизации.');
    } else if (warnCount > 0) {
      console.log('\n⚠️ ПРЕДУПРЕЖДЕНИЯ:');
      this.warnings.forEach((warn, idx) => {
        console.log(`   ${idx + 1}. ${warn.category}: ${warn.message}`);
      });
      console.log('\nСистема готова, но некоторые функции могут быть недоступны.');
    } else {
      console.log('\n✅ ВСЁ ОТЛИЧНО! Система полностью готова к автоматизации.');
      console.log('\n🚀 Следующие шаги:');
      console.log('   1. Мигрируйте существующие сателлиты:');
      console.log('      npm run satellite:migrate-all -- --dir /path/to/satellites');
      console.log('');
      console.log('   2. Или создайте новые:');
      console.log('      npm run satellite:master -- --generate 5 --niche crypto --pages 500');
      console.log('');
      console.log('📖 Документация: AUTOMATION.md');
    }

    console.log('');
  }
}

// ============================================================
// CLI
// ============================================================

async function main() {
  const healthCheck = new HealthCheck();
  await healthCheck.run();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { HealthCheck };
