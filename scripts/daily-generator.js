#!/usr/bin/env node

/**
 * DAILY SATELLITE GENERATOR
 * Generates satellites with unique AI-generated content
 *
 * Usage: node scripts/daily-generator.js
 */

const { validateEnv } = require('../src/utils/validate-env');
const { createLogger } = require('../src/utils/logger');
const { ContentDeduplicator } = require('../src/utils/content-deduplicator');
const { CheckpointManager } = require('./lib/checkpoint-manager');

// Validate required environment variables at startup
validateEnv(['DEEPSEEK_API_KEY']);

const { ContentGenerator } = require('../src/utils/content-generator');
const { SatelliteRegistry } = require('../src/utils/satellite-registry');
const { SearchEnginePing } = require('../src/utils/search-ping');
const { SatelliteGenerator } = require('./satellite-generator');
const { BuildManager } = require('./build-all');
const { DeploymentManager } = require('./deploy-all');
const { computeSatellitePublicUrl } = require('./cloudflare-worker');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  dailySatellites: Number(process.env.DAILY_SATELLITES ?? 20),
  pagesPerSatellite: Number(process.env.PAGES_PER_SATELLITE ?? 300),
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
  mainSiteUrl:
    process.env.MAIN_SITE_URL ||
    process.env.NEXT_PUBLIC_MAIN_SITE ||
    'https://1mb3-guide-2026.vercel.app',
  satellitesDir: path.join(process.cwd(), 'satellites'),
  logFile: path.join(process.cwd(), 'logs', 'daily-generation-log.json'),
};

class DailySatelliteGenerator {
  constructor() {
    this.registry = new SatelliteRegistry();
    this.contentGenerator = new ContentGenerator(CONFIG.deepseekApiKey, this.registry);
    this.searchPing = new SearchEnginePing();
    this.deduplicator = new ContentDeduplicator();
    this.checkpointManager = new CheckpointManager();
    this.logger = createLogger({ service: 'daily-generator' });
    this.results = [];
    this.startTime = Date.now();
    this._saving = false;

    const onCancel = signal => {
      try {
        console.error(`\nвљ пёЏ Received ${signal}. Saving partial results...`);
        this.saveResults();
      } catch (error) {
        console.error('Failed to save partial results:', error?.message || error);
      } finally {
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => onCancel('SIGTERM'));
    process.on('SIGINT', () => onCancel('SIGINT'));
  }

  getActualPageCount(data) {
    return (data?.allPages?.length || 0) + (data?.pageBudget?.estimatedStaticPages || 0);
  }

  async run() {
    console.log('рџЊ… DAILY SATELLITE GENERATION');
    console.log('в•ђ'.repeat(80));
    console.log(`рџ“… Date: ${new Date().toISOString()}`);
    console.log(`рџЋЇ Target: ${CONFIG.dailySatellites} satellites`);
    console.log(`рџ“„ Pages per satellite: ${CONFIG.pagesPerSatellite}`);
    console.log(`рџЏ  Main site hub: ${CONFIG.mainSiteUrl}`);
    console.log('');

    try {
      await this.generateSatellites();
      await this.buildSatellites();
      await this.deploySatellites();
      await this.submitToSEO();
      this.saveDeployedUrls();
      this.saveResults();

      const duration = ((Date.now() - this.startTime) / 1000 / 60).toFixed(2);
      const totalPages = this.results
        .filter(result => result.success)
        .reduce((sum, result) => sum + (result.pages || 0), 0);

      console.log('\nвњ… DAILY GENERATION COMPLETE!');
      console.log(`вЏ±пёЏ Total time: ${duration} minutes`);
      console.log(`рџ“Љ Success: ${this.results.filter(r => r.success).length}/${CONFIG.dailySatellites}`);
      console.log(`рџ“€ Total pages: ${totalPages}`);
    } catch (error) {
      console.error('\nвќЊ CRITICAL ERROR:', error.message);
      this.saveResults();
      process.exit(1);
    }
  }

  async generateSatellites() {
    console.log('\nрџ”¦ STEP 1: Generating satellites with AI content');
    console.log('в”Ђ'.repeat(80));

    const batchSize = parseInt(process.env.GENERATION_BATCH_SIZE || '3');
    console.log(`вљЎ Parallel generation enabled: batch size = ${batchSize}`);

    // Load checkpoint to resume from last successful satellite
    const checkpoint = this.checkpointManager.load();
    const startIndex = checkpoint?.lastSuccessful !== undefined ? checkpoint.lastSuccessful + 1 : 0;

    if (startIndex > 0) {
      console.log(`рџ”Ќ Resuming from satellite ${startIndex + 1} (checkpoint found)`);
      this.logger.info('Resuming from checkpoint', { startIndex, checkpoint });
    }

    for (let i = startIndex; i < CONFIG.dailySatellites; i += batchSize) {
      const batchEnd = Math.min(i + batchSize, CONFIG.dailySatellites);
      const batch = [];

      // Prepare batch
      for (let j = i; j < batchEnd; j++) {
        const niche = CONFIG.niches[j % CONFIG.niches.length];
        const satelliteNumber = j + 1;
        const domain = `${niche}-${Date.now()}-${j}`;

        batch.push({
          index: j,
          satelliteNumber,
          niche,
          domain,
        });
      }

      // Process batch in parallel
      console.log(`\nрџ”„ Processing batch ${Math.floor(i / batchSize) + 1} (satellites ${i + 1}-${batchEnd})`);

      await Promise.all(
        batch.map(item => this.generateSingleSatellite(item))
      );

      // Save checkpoint after each batch
      this.checkpointManager.save({
        lastSuccessful: batchEnd - 1,
        totalSatellites: CONFIG.dailySatellites,
        completedBatches: Math.floor(i / batchSize) + 1,
      });

      // Memory check after each batch
      this.checkMemoryUsage();
    }

    // Clear checkpoint on successful completion
    this.checkpointManager.clear();
  }

  async generateSingleSatellite({ index, satelliteNumber, niche, domain }) {
    console.log(`\n[${satelliteNumber}/${CONFIG.dailySatellites}] рџЋЁ Generating: ${domain}`);

    try {
      const data = await this.contentGenerator.generateSatelliteData(
        niche,
        satelliteNumber,
        CONFIG.pagesPerSatellite
      );
      const actualPages = this.getActualPageCount(data);

      // Check for duplicate content
      if (data.articles && data.articles.length > 0) {
        for (const article of data.articles) {
          const isDuplicate = await this.deduplicator.checkDuplicate(
            article.content || article.body || '',
            domain
          );
          if (isDuplicate) {
            this.logger.warn('Duplicate content detected', {
              domain,
              articleSlug: article.slug,
              satelliteNumber,
            });
            console.warn(`  вљ пёЏ Duplicate content detected in article: ${article.slug}`);
          }
        }
      }

      const generator = new SatelliteGenerator({
        niche,
        pages: CONFIG.pagesPerSatellite,
        domain,
        customData: data,
        templateFamily: data?.siteMeta?.templateFamily,
      });

      await generator.generate();

      const satelliteUrl = computeSatellitePublicUrl(domain);
      if (!satelliteUrl) {
        throw new Error('Missing satellite public URL configuration. Set SATELLITE_PARENT_DOMAIN or CLOUDFLARE_WORKERS_SUBDOMAIN.');
      }
      this.contentGenerator.registerSatellite({
        name: domain,
        domain,
        niche,
        url: satelliteUrl,
        pages: data.articles || [],
      });

      this.results.push({
        id: satelliteNumber,
        domain,
        niche,
        pages: actualPages,
        requestedPages: CONFIG.pagesPerSatellite,
        templateFamily: data?.siteMeta?.templateFamily,
        success: true,
        timestamp: new Date().toISOString(),
      });

      this.logger.info('Satellite generated successfully', {
        satelliteNumber,
        domain,
        pages: actualPages,
        templateFamily: data?.siteMeta?.templateFamily,
      });

      console.log(`вњ… [${satelliteNumber}] Generated successfully (${actualPages} pages, family: ${data?.siteMeta?.templateFamily})`);
    } catch (error) {
      console.error(`вќЊ [${satelliteNumber}] Error:`, error.message);

      this.logger.error('Satellite generation failed', {
        satelliteNumber,
        domain,
        niche,
        error: error.message,
        stack: error.stack,
      });

      this.results.push({
        id: satelliteNumber,
        domain,
        niche,
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  checkMemoryUsage() {
    const used = process.memoryUsage();
    const heapUsedMB = (used.heapUsed / 1024 / 1024).toFixed(2);
    const heapTotalMB = (used.heapTotal / 1024 / 1024).toFixed(2);
    const heapUsedPercent = ((used.heapUsed / used.heapTotal) * 100).toFixed(1);

    console.log(`\nрџ'ѕ Memory: ${heapUsedMB}MB / ${heapTotalMB}MB (${heapUsedPercent}%)`);

    if (heapUsedPercent > 85) {
      console.warn(`вљ пёЏ High memory usage: ${heapUsedPercent}%`);
      if (global.gc) {
        console.log('рџ—'пёЏ Running garbage collection...');
        global.gc();
      }
    }
  }

  async buildSatellites() {
    console.log('\nрџ”Ё STEP 2: Building all satellites');
    console.log('в”Ђ'.repeat(80));

    const builder = new BuildManager();
    await builder.buildAll();
  }

  async deploySatellites() {
    console.log('\nвЃпёЏ STEP 3: Deploying to Cloudflare Workers');
    console.log('в”Ђ'.repeat(80));

    const deployer = new DeploymentManager();
    await deployer.deployAll();
  }

  async submitToSEO() {
    console.log('\nрџ”Ќ STEP 4: Submitting to search engines');
    console.log('в”Ђ'.repeat(80));

    const successfulSatellites = this.results.filter(result => result.success);

    for (const satellite of successfulSatellites) {
      const baseUrl = computeSatellitePublicUrl(satellite.domain);
      if (!baseUrl) {
        throw new Error('Missing satellite public URL configuration. Set SATELLITE_PARENT_DOMAIN or CLOUDFLARE_WORKERS_SUBDOMAIN.');
      }
      const sitemapUrl = `${baseUrl}/sitemap.xml`;

      try {
        console.log(`рџ“Ў Pinging search engines for ${satellite.domain}...`);
        const pingResults = await this.searchPing.pingAll(sitemapUrl);

        pingResults.forEach(result => {
          if (result.success) {
            console.log(`  вњ… ${result.engine}: Success`);
          } else {
            console.log(`  вљ пёЏ ${result.engine}: ${result.error}`);
          }
        });

        await this.sleep(1000);
      } catch (error) {
        console.error(`  вќЊ Error pinging for ${satellite.domain}:`, error.message);
      }
    }

    console.log(`\nвњ… Pinged ${successfulSatellites.length} satellites`);
  }

  saveDeployedUrls() {
    const urlsFile = path.join(CONFIG.satellitesDir, 'urls.txt');
    let urls = [];

    if (fs.existsSync(urlsFile)) {
      urls = fs
        .readFileSync(urlsFile, 'utf8')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && line.startsWith('http'));
    }

    if (urls.length === 0) {
      urls = this.results
        .filter(result => result.success && result.domain)
        .map(result => computeSatellitePublicUrl(result.domain))
        .filter(Boolean);
    }

    if (!fs.existsSync(CONFIG.satellitesDir)) {
      fs.mkdirSync(CONFIG.satellitesDir, { recursive: true });
    }

    fs.writeFileSync(urlsFile, urls.join('\n'));
    console.log(`\nрџ“ќ Deployed URLs saved: ${urlsFile} (${urls.length})`);
  }

  saveResults() {
    if (this._saving) return;
    this._saving = true;

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
        if (!Array.isArray(logs)) {
          logs = [];
        }
      } catch {
        logs = [];
      }
    }

    logs.push(log);
    fs.writeFileSync(CONFIG.logFile, JSON.stringify(logs, null, 2));
    console.log(`\nрџ“ќ Log saved: ${CONFIG.logFile}`);

    this._saving = false;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

async function main() {
  if (!CONFIG.deepseekApiKey) {
    console.warn('вљ пёЏ DEEPSEEK_API_KEY not set. Falling back to local semantic generation only.');
  }

  const generator = new DailySatelliteGenerator();
  await generator.run();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { DailySatelliteGenerator };
