#!/usr/bin/env node

/**
 * AUTOMATED DEPLOYMENT SCRIPT
 * Deploys all satellites to Cloudflare Workers (OpenNext)
 *
 * Usage: node deploy-all.js
 */

const { validateEnv, validateOptionalEnv } = require('../src/utils/validate-env');

// Validate required environment variables at startup
validateEnv(['CLOUDFLARE_API_TOKEN', 'CLOUDFLARE_ACCOUNT_ID']);

// Warn about optional variables
validateOptionalEnv(['REVALIDATE_SECRET', 'DEEPSEEK_API_KEY', 'YANDEX_WEBMASTER_TOKEN', 'YANDEX_USER_ID']);

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const {
  computeSatellitePublicUrl,
  computeSatelliteRoute,
  getWorkersSubdomain,
  makeWorkerName,
} = require('./cloudflare-worker');

const CONFIG = {
  satellitesDir: path.join(process.cwd(), 'satellites'),
  satelliteParentDomain: process.env.SATELLITE_PARENT_DOMAIN,
  logFile: path.join(process.cwd(), 'satellites', 'deploy-log.json'),
};

function buildWranglerVars() {
  // Environment variables are now passed via process.env
  // Wrangler will inherit them from the parent process
  // This avoids exposing secrets in CLI arguments
  return '';
}

class DeploymentManager {
  constructor() {
    this.results = [];
  }

  async deployAll() {
    console.log('рџљЂ РђРІС‚РѕРјР°С‚РёС‡РµСЃРєРёР№ РґРµРїР»РѕР№ РІСЃРµС… СЃР°С‚РµР»Р»РёС‚РѕРІ РЅР° Cloudflare Workers (OpenNext)');
    console.log('');

    const workersSubdomain = getWorkersSubdomain();
    if (!CONFIG.satelliteParentDomain && !workersSubdomain) {
      console.error('вќЊ Missing satellite domain configuration. Set SATELLITE_PARENT_DOMAIN or CLOUDFLARE_WORKERS_SUBDOMAIN.');
      process.exit(1);
    }

    if (!this.checkWranglerCLI()) {
      console.error('вќЊ Wrangler CLI РЅРµ СѓСЃС‚Р°РЅРѕРІР»РµРЅ');
      console.log('РЈСЃС‚Р°РЅРѕРІРёС‚Рµ: npm i -D wrangler (РёР»Рё РёСЃРїРѕР»СЊР·СѓР№С‚Рµ npx wrangler)');
      process.exit(1);
    }

    if (!process.env.CLOUDFLARE_API_TOKEN || !process.env.CLOUDFLARE_ACCOUNT_ID) {
      console.warn('вљ пёЏ CLOUDFLARE_API_TOKEN/CLOUDFLARE_ACCOUNT_ID РЅРµ СѓСЃС‚Р°РЅРѕРІР»РµРЅС‹');
      console.warn('   Р’ CI СЌС‚Рѕ РґРѕР»Р¶РЅРѕ РїСЂРёС…РѕРґРёС‚СЊ РёР· GitHub secrets.');
    }

    if (CONFIG.satelliteParentDomain) {
      console.log(`рџЊђ Р”РѕРјРµРЅ СЃР°С‚РµР»Р»РёС‚РѕРІ: *.${CONFIG.satelliteParentDomain}`);
    } else {
      console.log(`рџЊђ workers.dev fallback: ${workersSubdomain}`);
    }
    console.log('');

    const satellites = this.getSatellites();
    if (satellites.length === 0) {
      console.log('рџ“­ РќРµС‚ СЃР°С‚РµР»Р»РёС‚РѕРІ РґР»СЏ РґРµРїР»РѕСЏ');
      return;
    }

    console.log(`рџ“¦ РќР°Р№РґРµРЅРѕ СЃР°С‚РµР»Р»РёС‚РѕРІ: ${satellites.length}`);
    console.log('');

    const startTime = Date.now();
    for (let index = 0; index < satellites.length; index++) {
      await this.deploySatellite(satellites[index], index + 1, satellites.length);
    }

    const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(2);

    console.log('\nвњ… Р”РµРїР»РѕР№ Р·Р°РІРµСЂС€С‘РЅ!');
    console.log(`вЏ±пёЏ Р’СЂРµРјСЏ: ${duration} РјРёРЅСѓС‚`);
    console.log(`рџ“Љ РЈСЃРїРµС€РЅРѕ: ${this.results.filter(result => result.success).length}/${satellites.length}`);

    this.saveLog();
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

    return fs
      .readdirSync(CONFIG.satellitesDir, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => ({
        name: entry.name,
        path: path.join(CONFIG.satellitesDir, entry.name),
      }));
  }

  async deploySatellite(satellite, index, total) {
    console.log(`\n[${index}/${total}] рџљЂ Р”РµРїР»РѕР№: ${satellite.name}`);

    const startTime = Date.now();

    try {
      const workerName = makeWorkerName(satellite.name);
      const publicUrl = computeSatellitePublicUrl(satellite.name);
      const route = computeSatelliteRoute(satellite.name);

      console.log('  рџ“¦ Next build...');
      execSync('npm run build', {
        cwd: satellite.path,
        stdio: 'inherit',
      });

      console.log('  рџ§© OpenNext build...');
      execSync('npx --yes @opennextjs/cloudflare build', {
        cwd: satellite.path,
        stdio: 'inherit',
      });

      console.log(`  вЃпёЏ Deploying Worker: ${workerName}`);
      if (route) {
        console.log(`  рџ§­ Route: ${route}`);
      } else {
        console.log('  рџ§­ Route: workers.dev fallback');
      }

      const vars = buildWranglerVars();
      const routeArg = route ? ` --route ${route}` : '';
      const deployCmd = `npx --yes wrangler deploy --config wrangler.toml --name ${workerName}${routeArg}`;

      // Environment variables are passed via process.env, not CLI args
      execSync(deployCmd, {
        cwd: satellite.path,
        stdio: 'inherit',
        env: { ...process.env }
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

      console.log(`  вњ… Р“РѕС‚РѕРІРѕ Р·Р° ${duration}s`);
      if (publicUrl) {
        console.log(`  рџЊђ URL: ${publicUrl}`);
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

      console.error(`  вќЊ РћС€РёР±РєР°: ${error.message}`);
    }
  }

  saveLog() {
    const log = {
      timestamp: new Date().toISOString(),
      results: this.results,
    };

    fs.writeFileSync(CONFIG.logFile, JSON.stringify(log, null, 2));
    console.log(`\nрџ“ќ Р›РѕРі СЃРѕС…СЂР°РЅС‘РЅ: ${CONFIG.logFile}`);
  }

  printURLs() {
    console.log('\nрџЊђ URL СЃР°С‚РµР»Р»РёС‚РѕРІ:');
    console.log('в”Ђ'.repeat(80));

    const successful = this.results.filter(result => result.success && result.url);
    successful.forEach((result, index) => {
      console.log(`${index + 1}. ${result.name}`);
      console.log(`   ${result.url}`);
    });

    console.log('в”Ђ'.repeat(80));

    const urlsFile = path.join(CONFIG.satellitesDir, 'urls.txt');
    const urls = successful.map(result => result.url).join('\n');
    fs.writeFileSync(urlsFile, urls);

    console.log(`\nрџ“„ РЎРїРёСЃРѕРє URL СЃРѕС…СЂР°РЅС‘РЅ: ${urlsFile}`);
  }
}

async function main() {
  const manager = new DeploymentManager();
  await manager.deployAll();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { DeploymentManager };
