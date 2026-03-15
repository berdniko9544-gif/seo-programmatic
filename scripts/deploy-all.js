#!/usr/bin/env node

/**
 * AUTOMATED DEPLOYMENT SCRIPT
 * Deploys all satellites to Cloudflare Workers (OpenNext)
 *
 * Usage: node deploy-all.js
 */

// Required env:
// - CLOUDFLARE_API_TOKEN / CLOUDFLARE_ACCOUNT_ID (wrangler)
// - SATELLITE_PARENT_DOMAIN (used to compute route + public URL)
//
// Optional:
// - REVALIDATE_SECRET / etc (passed via wrangler --var if desired)
//
// Note: requires wildcard DNS + Cloudflare Workers Routes for <sat>.<domain>/*
// (wrangler deploy uses --route to attach routes automatically).


const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ============================================================
// CONFIGURATION
// ============================================================

const CONFIG = {
  satellitesDir: path.join(process.cwd(), 'satellites'),
  satelliteParentDomain: process.env.SATELLITE_PARENT_DOMAIN,
  logFile: path.join(process.cwd(), 'satellites', 'deploy-log.json'),
};

function requireEnv(name) {
  if (!process.env[name]) {
    throw new Error(`Missing required env: ${name}`);
  }
}

function computePublicUrl(satelliteName) {
  if (!CONFIG.satelliteParentDomain) {
    throw new Error('Missing required env: SATELLITE_PARENT_DOMAIN');
  }
  return `https://${satelliteName}.${CONFIG.satelliteParentDomain}`;
}

function makeWorkerName(satelliteName) {
  // Cloudflare Worker script name length limit is 63.
  const prefix = 'seo-sat-';
  const safe = satelliteName.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  const max = 63 - prefix.length;
  return prefix + safe.slice(0, max);
}

function buildWranglerVars() {
  const vars = [];
  const maybe = [
    'REVALIDATE_SECRET',
    'DEEPSEEK_API_KEY',
    'YANDEX_WEBMASTER_TOKEN',
    'YANDEX_USER_ID',
  ];
  for (const k of maybe) {
    if (process.env[k]) {
      vars.push(`--var ${k}:${process.env[k]}`);
    }
  }
  return vars.join(' ');
}

// ============================================================
// DEPLOYMENT MANAGER
// ============================================================

class DeploymentManager {
  constructor() {
    this.results = [];
  }

  async deployAll() {
    console.log('🚀 Автоматический деплой всех сателлитов на Cloudflare Workers (OpenNext)');
    console.log('');

    try {
      requireEnv('SATELLITE_PARENT_DOMAIN');
    } catch (e) {
      console.error('❌', e.message);
      process.exit(1);
    }

    // Check wrangler availability
    if (!this.checkWranglerCLI()) {
      console.error('❌ Wrangler CLI не установлен');
      console.log('Установите: npm i -D wrangler (или используйте npx wrangler)');
      process.exit(1);
    }

    if (!process.env.CLOUDFLARE_API_TOKEN || !process.env.CLOUDFLARE_ACCOUNT_ID) {
      console.warn('⚠️ CLOUDFLARE_API_TOKEN/CLOUDFLARE_ACCOUNT_ID не установлены');
      console.warn('   В CI это должно приходить из GitHub secrets.');
    }

    console.log(`🌐 Домен сателлитов: *.${CONFIG.satelliteParentDomain}`);
    console.log('');

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

  checkWranglerCLI() {
    try {
      execSync('npx --yes wrangler --version', { stdio: 'ignore' });
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
      const workerName = makeWorkerName(satellite.name);
      const publicUrl = computePublicUrl(satellite.name);
      const route = `${satellite.name}.${CONFIG.satelliteParentDomain}/*`;

      // Step 1: Next build
      console.log('  📦 Next build...');
      execSync('npm run build', {
        cwd: satellite.path,
        stdio: 'inherit',
      });

      // Step 2: OpenNext bundle
      console.log('  🧩 OpenNext build...');
      execSync('npx --yes @opennextjs/cloudflare build', {
        cwd: satellite.path,
        stdio: 'inherit',
      });

      // Step 3: Deploy via wrangler
      console.log(`  ☁️ Deploying Worker: ${workerName}`);
      console.log(`  🧭 Route: ${route}`);

      const vars = buildWranglerVars();
      const deployCmd = `npx --yes wrangler deploy --config wrangler.toml --name ${workerName} --route ${route} ${vars}`;

      execSync(deployCmd, {
        cwd: satellite.path,
        stdio: 'inherit',
      });

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);

      this.results.push({
        name: satellite.name,
        url: publicUrl,
        workerName,
        route,
        success: true,
        duration,
        timestamp: new Date().toISOString(),
      });

      console.log(`  ✅ Готово за ${duration}s`);
      console.log(`  🌐 URL: ${publicUrl}`);
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

  // (legacy duplicate deployAll block removed)

  // (intentionally empty)


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
