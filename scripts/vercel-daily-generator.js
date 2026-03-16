#!/usr/bin/env node

/**
 * DAILY SATELLITE GENERATOR FOR VERCEL
 * Optimized for Vercel Pro plan (6,000 build minutes/month)
 */

const { ContentGenerator } = require('../src/utils/content-generator');
const { SatelliteRegistry } = require('../src/utils/satellite-registry');
const { SearchEnginePing } = require('../src/utils/search-ping');
const { SatelliteGenerator } = require('./satellite-generator');
const { VercelDeploymentManager } = require('./vercel-deploy-all');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  dailySatellites: Number(process.env.DAILY_SATELLITES ?? 5),
  pagesPerSatellite: Number(process.env.PAGES_PER_SATELLITE ?? 1000),
  niches: [
    'ai-copywriting',
    'ai-design',
    'ai-automation',
    'ai-marketing',
    'ai-video',
    'ai-business',
    'ai-freelance',
    'ai-education',
  ],
  deepseekApiKey: process.env.DEEPSEEK_API_KEY,
  mainSiteUrl: process.env.MAIN_SITE_URL || 'https://1mb3-guide-2026.vercel.app',
  satellitesDir: path.join(process.cwd(), 'satellites'),
  logFile: path.join(process.cwd(), 'logs', 'vercel-daily-log.json'),
};

class VercelDailySatelliteGenerator {
  constructor() {
    this.registry = new SatelliteRegistry();
    this.contentGenerator = new ContentGenerator(CONFIG.deepseekApiKey, this.registry);
    this.searchPing = new SearchEnginePing();
    this.results = [];
    this.startTime = Date.now();
  }

  async run() {
    console.log('🌟 DAILY SATELLITE GENERATION (VERCEL)');
    console.log('━'.repeat(80));
    console.log(`📅 ${new Date().toISOString()}`);
    console.log(`🎯 Target: ${CONFIG.dailySatellites} satellites`);
    console.log(`📄 Pages: ${CONFIG.pagesPerSatellite} per satellite`);
    console.log(`🏠 Main: ${CONFIG.mainSiteUrl}`);
    console.log('');

    try {
      await this.generateSatellites();
      await this.deploySatellites();
      await this.submitToSEO();
      this.saveResults();

      const duration = ((Date.now() - this.startTime) / 1000 / 60).toFixed(2);
      const totalPages = this.results
        .filter(result => result.success)
        .reduce((sum, result) => sum + (result.pages || 0), 0);

      console.log('\n✅ COMPLETE!');
      console.log(`⏱️  ${duration} minutes`);
      console.log(`📊 ${this.results.filter(r => r.success).length}/${CONFIG.dailySatellites} success`);
      console.log(`📖 ${totalPages} pages`);
    } catch (error) {
      console.error('\n❌ ERROR:', error.message);
      this.saveResults();
      process.exit(1);
    }
  }

  async generateSatellites() {
    console.log('\n📦 STEP 1: Generating satellites');
    console.log('━'.repeat(80));

    for (let i = 0; i < CONFIG.dailySatellites; i++) {
      const niche = CONFIG.niches[i % CONFIG.niches.length];
      const satelliteNumber = i + 1;
      const domain = `${niche}-${Date.now()}-${i}`;

      console.log(`\n[${satelliteNumber}/${CONFIG.dailySatellites}] 🎨 ${domain}`);

      try {
        const data = await this.contentGenerator.generateSatelliteData(
          niche,
          satelliteNumber,
          CONFIG.pagesPerSatellite
        );

        const generator = new SatelliteGenerator({
          niche,
          pages: CONFIG.pagesPerSatellite,
          domain,
          customData: data,
          templateFamily: data?.siteMeta?.templateFamily,
        });

        await generator.generate();

        const actualPages = (data?.allPages?.length || 0) + (data?.pageBudget?.estimatedStaticPages || 0);

        this.results.push({
          id: satelliteNumber,
          domain,
          niche,
          pages: actualPages,
          templateFamily: data?.siteMeta?.templateFamily,
          success: true,
          timestamp: new Date().toISOString(),
        });

        console.log(`✅ ${actualPages} pages, ${data?.siteMeta?.templateFamily}`);
      } catch (error) {
        console.error(`❌ Error: ${error.message}`);

        this.results.push({
          id: satelliteNumber,
          domain,
          niche,
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        });
      }

      if (i < CONFIG.dailySatellites - 1) {
        await this.sleep(2000);
      }
    }
  }

  async deploySatellites() {
    console.log('\n☁️  STEP 2: Deploying to Vercel');
    console.log('━'.repeat(80));

    const deployer = new VercelDeploymentManager();
    await deployer.deployAll();
  }

  async submitToSEO() {
    console.log('\n📡 STEP 3: Submitting to search engines');
    console.log('━'.repeat(80));

    const successfulSatellites = this.results.filter(result => result.success);

    for (const satellite of successfulSatellites) {
      const baseUrl = `https://seo-sat-${satellite.domain}.vercel.app`;
      const sitemapUrl = `${baseUrl}/sitemap.xml`;

      try {
        console.log(`📡 ${satellite.domain}...`);
        const pingResults = await this.searchPing.pingAll(sitemapUrl);

        pingResults.forEach(result => {
          if (result.success) {
            console.log(`  ✅ ${result.engine}`);
          } else {
            console.log(`  ⚠️  ${result.engine}: ${result.error}`);
          }
        });

        await this.sleep(1000);
      } catch (error) {
        console.error(`  ❌ ${error.message}`);
      }
    }

    console.log(`\n✅ Pinged ${successfulSatellites.length} satellites`);
  }

  saveResults() {
    const totalPages = this.results
      .filter(result => result.success)
      .reduce((sum, result) => sum + (result.pages || 0), 0);

    const log = {
      date: new Date().toISOString(),
      target: CONFIG.dailySatellites,
      pagesPerSatellite: CONFIG.pagesPerSatellite,
      totalPages,
      duration: ((Date.now() - this.startTime) / 1000 / 60).toFixed(2),
      results: this.results,
      success: this.results.filter(result => result.success).length,
      failed: this.results.filter(result => !result.success).length,
    };

    const logDir = path.dirname(CONFIG.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    let logs = [];
    if (fs.existsSync(CONFIG.logFile)) {
      try {
        logs = JSON.parse(fs.readFileSync(CONFIG.logFile, 'utf8'));
        if (!Array.isArray(logs)) logs = [];
      } catch {
        logs = [];
      }
    }

    logs.push(log);
    fs.writeFileSync(CONFIG.logFile, JSON.stringify(logs, null, 2));
    console.log(`\n📝 ${CONFIG.logFile}`);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

async function main() {
  if (!CONFIG.deepseekApiKey) {
    console.warn('⚠️  DEEPSEEK_API_KEY not set');
  }

  const generator = new VercelDailySatelliteGenerator();
  await generator.run();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { VercelDailySatelliteGenerator };
