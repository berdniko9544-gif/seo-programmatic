#!/usr/bin/env node

/**
 * DAILY SATELLITE GENERATOR
 * Generates 20 satellites daily with unique AI-generated content
 *
 * Usage: node scripts/daily-generator.js
 */

const { ContentGenerator } = require('../src/utils/content-generator');
const { SatelliteRegistry } = require('../src/utils/satellite-registry');
const { SearchEnginePing } = require('../src/utils/search-ping');
const { SatelliteGenerator } = require('./satellite-generator');
const { BuildManager } = require('./build-all');
const { DeploymentManager } = require('./deploy-all');
const { SEOSubmissionManager } = require('./submit-to-search');
const fs = require('fs');
const path = require('path');

// ============================================================
// CONFIGURATION
// ============================================================

const CONFIG = {
  dailySatellites: 20,
  pagesPerSatellite: 1000,
  niches: ['crypto', 'fitness', 'education', 'realestate', 'finance', 'tech', 'health', 'business'],
  deepseekApiKey: process.env.DEEPSEEK_API_KEY,
  satellitesDir: path.join(__dirname, '../../satellites'),
  logFile: path.join(__dirname, '../logs/daily-generation-log.json'),
};

// ============================================================
// DAILY GENERATOR
// ============================================================

class DailySatelliteGenerator {
  constructor() {
    this.registry = new SatelliteRegistry();
    this.contentGenerator = new ContentGenerator(CONFIG.deepseekApiKey, this.registry);
    this.searchPing = new SearchEnginePing();
    this.results = [];
    this.startTime = Date.now();
  }

  async run() {
    console.log('🌅 DAILY SATELLITE GENERATION');
    console.log('═'.repeat(80));
    console.log(`📅 Date: ${new Date().toISOString()}`);
    console.log(`🎯 Target: ${CONFIG.dailySatellites} satellites`);
    console.log(`📄 Pages per satellite: ${CONFIG.pagesPerSatellite}`);
    console.log('');

    try {
      // Step 1: Generate satellites with AI content
      await this.generateSatellites();

      // Step 2: Build all
      await this.buildSatellites();

      // Step 3: Deploy all
      await this.deploySatellites();

      // Step 4: Submit to search engines
      await this.submitToSEO();

      // Step 5: Save results
      this.saveResults();

      const duration = ((Date.now() - this.startTime) / 1000 / 60).toFixed(2);

      console.log('\n✅ DAILY GENERATION COMPLETE!');
      console.log(`⏱️ Total time: ${duration} minutes`);
      console.log(`📊 Success: ${this.results.filter(r => r.success).length}/${CONFIG.dailySatellites}`);
      console.log(`📈 Total pages: ${CONFIG.dailySatellites * CONFIG.pagesPerSatellite}`);

    } catch (error) {
      console.error('\n❌ CRITICAL ERROR:', error.message);
      this.saveResults();
      process.exit(1);
    }
  }

  async generateSatellites() {
    console.log('\n📦 STEP 1: Generating satellites with AI content');
    console.log('─'.repeat(80));

    for (let i = 0; i < CONFIG.dailySatellites; i++) {
      const niche = CONFIG.niches[i % CONFIG.niches.length];
      const satelliteNumber = i + 1;
      const domain = `${niche}-${Date.now()}-${i}`;

      console.log(`\n[${satelliteNumber}/${CONFIG.dailySatellites}] 🎨 Generating: ${domain}`);

      try {
        // Generate unique content using AI (includes long-tail pages)
        const data = await this.contentGenerator.generateSatelliteData(
          niche,
          satelliteNumber,
          CONFIG.pagesPerSatellite
        );

        // Create satellite with generated data
        const generator = new SatelliteGenerator({
          niche,
          pages: CONFIG.pagesPerSatellite,
          domain,
          customData: data
        });

        await generator.generate();

        // Register satellite for cross-linking
        const satelliteUrl = `https://${domain}.vercel.app`;
        this.contentGenerator.registerSatellite({
          name: domain,
          domain: domain,
          niche: niche,
          url: satelliteUrl,
          pages: data.articles || [],
        });

        this.results.push({
          id: satelliteNumber,
          domain,
          niche,
          pages: CONFIG.pagesPerSatellite,
          success: true,
          timestamp: new Date().toISOString()
        });

        console.log(`✅ [${satelliteNumber}] Generated successfully`);

      } catch (error) {
        console.error(`❌ [${satelliteNumber}] Error:`, error.message);

        this.results.push({
          id: satelliteNumber,
          domain,
          niche,
          success: false,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }

      // Rate limiting between satellites
      if (i < CONFIG.dailySatellites - 1) {
        await this.sleep(2000);
      }
    }
  }

  async buildSatellites() {
    console.log('\n🔨 STEP 2: Building all satellites');
    console.log('─'.repeat(80));

    const builder = new BuildManager();
    await builder.buildAll();
  }

  async deploySatellites() {
    console.log('\n☁️ STEP 3: Deploying to Vercel');
    console.log('─'.repeat(80));

    const deployer = new DeploymentManager();
    await deployer.deployAll();
  }

  async submitToSEO() {
    console.log('\n🔍 STEP 4: Submitting to search engines');
    console.log('─'.repeat(80));

    // Ping search engines for each successful satellite
    const successfulSatellites = this.results.filter(r => r.success);

    for (const satellite of successfulSatellites) {
      const sitemapUrl = `https://${satellite.domain}.vercel.app/sitemap.xml`;

      try {
        console.log(`📡 Pinging search engines for ${satellite.domain}...`);
        const pingResults = await this.searchPing.pingAll(sitemapUrl);

        pingResults.forEach(result => {
          if (result.success) {
            console.log(`  ✅ ${result.engine}: Success`);
          } else {
            console.log(`  ⚠️ ${result.engine}: ${result.error}`);
          }
        });

        // Small delay between pings
        await this.sleep(1000);
      } catch (error) {
        console.error(`  ❌ Error pinging for ${satellite.domain}:`, error.message);
      }
    }

    console.log(`\n✅ Pinged ${successfulSatellites.length} satellites`);
  }

  saveResults() {
    const log = {
      date: new Date().toISOString(),
      target: CONFIG.dailySatellites,
      pagesPerSatellite: CONFIG.pagesPerSatellite,
      totalPages: CONFIG.dailySatellites * CONFIG.pagesPerSatellite,
      duration: ((Date.now() - this.startTime) / 1000 / 60).toFixed(2),
      results: this.results,
      success: this.results.filter(r => r.success).length,
      failed: this.results.filter(r => !r.success).length
    };

    const logDir = path.dirname(CONFIG.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    // Append to daily log
    let logs = [];
    if (fs.existsSync(CONFIG.logFile)) {
      logs = JSON.parse(fs.readFileSync(CONFIG.logFile, 'utf8'));
    }
    logs.push(log);

    fs.writeFileSync(CONFIG.logFile, JSON.stringify(logs, null, 2));
    console.log(`\n📝 Log saved: ${CONFIG.logFile}`);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ============================================================
// CLI
// ============================================================

async function main() {
  // Check API key
  if (!CONFIG.deepseekApiKey) {
    console.error('❌ DEEPSEEK_API_KEY not set!');
    console.log('Set it: export DEEPSEEK_API_KEY=your_key');
    process.exit(1);
  }

  const generator = new DailySatelliteGenerator();
  await generator.run();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { DailySatelliteGenerator };
