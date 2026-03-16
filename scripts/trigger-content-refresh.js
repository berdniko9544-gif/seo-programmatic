#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Trigger ISR revalidation for all satellites
 * This refreshes content and sends freshness signals to search engines
 */

class ContentRefreshTrigger {
  constructor() {
    this.satellites = [];
    this.results = [];
  }

  loadSatellites() {
    const urlsFile = path.join(__dirname, '../satellites/vercel-urls.txt');
    const content = fs.readFileSync(urlsFile, 'utf-8');
    
    this.satellites = content
      .split('\n')
      .filter(line => line.trim() && line.startsWith('https://'))
      .map(url => url.trim());

    console.log(`✅ Loaded ${this.satellites.length} satellites`);
  }

  async triggerRevalidation(satelliteUrl) {
    const revalidateUrl = `${satelliteUrl}/api/revalidate`;
    
    try {
      const response = await fetch(revalidateUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          secret: process.env.REVALIDATE_SECRET || 'dev-secret-key',
          paths: ['/'] // Revalidate homepage, which triggers ISR
        })
      });

      if (response.ok) {
        return { success: true, status: response.status };
      }

      return {
        success: false,
        status: response.status,
        error: await response.text()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async refreshAll() {
    console.log('\n🔄 Triggering content refresh...\n');

    for (let i = 0; i < this.satellites.length; i++) {
      const url = this.satellites[i];
      const host = new URL(url).hostname;

      console.log(`[${i + 1}/${this.satellites.length}] ${host}`);

      const result = await this.triggerRevalidation(url);
      this.results.push({
        url,
        ...result
      });

      console.log(`  ${result.success ? '✅ Refreshed' : '❌ Failed'}`);

      // Rate limiting
      if (i < this.satellites.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }

  printStats() {
    const success = this.results.filter(r => r.success).length;
    const failed = this.results.filter(r => !r.success).length;

    console.log('\n📊 Refresh Results:');
    console.log(`   Total satellites: ${this.satellites.length}`);
    console.log(`   Success: ${success}`);
    console.log(`   Failed: ${failed}`);
  }

  saveLog() {
    const log = {
      timestamp: new Date().toISOString(),
      totalSatellites: this.satellites.length,
      results: this.results
    };

    const logPath = path.join(__dirname, '../satellites/content-refresh-log.json');
    fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
    console.log(`\n✅ Log saved: satellites/content-refresh-log.json`);
  }

  async run() {
    console.log('🔄 Content Refresh Trigger\n');
    
    this.loadSatellites();
    await this.refreshAll();
    this.printStats();
    this.saveLog();
    
    console.log('\n✅ Content refresh complete!');
    console.log('💡 Search engines will detect freshness signals');
  }
}

async function main() {
  const trigger = new ContentRefreshTrigger();
  await trigger.run();
}

main().catch(console.error);
