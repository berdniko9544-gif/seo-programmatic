#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const IndexNowClient = require('../src/utils/indexnow');

/**
 * Submit all satellites to IndexNow for instant indexing
 */

class IndexNowSubmitter {
  constructor() {
    this.client = new IndexNowClient();
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

  async submitAll() {
    console.log('\n🚀 Submitting to IndexNow...\n');

    for (let i = 0; i < this.satellites.length; i++) {
      const url = this.satellites[i];
      const host = new URL(url).hostname;

      console.log(`[${i + 1}/${this.satellites.length}] ${host}`);

      try {
        const result = await this.client.submitUrl(url, host);
        this.results.push(result);

        console.log(`  Yandex: ${result.yandex.success ? '✅' : '❌'}`);
        console.log(`  Bing: ${result.bing.success ? '✅' : '❌'}`);

        // Rate limiting: wait 1 second between requests
        if (i < this.satellites.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.log(`  ❌ Error: ${error.message}`);
        this.results.push({
          url,
          error: error.message
        });
      }
    }
  }

  printStats() {
    const yandexSuccess = this.results.filter(r => r.yandex?.success).length;
    const bingSuccess = this.results.filter(r => r.bing?.success).length;
    const errors = this.results.filter(r => r.error).length;

    console.log('\n📊 Submission Results:');
    console.log(`   Total satellites: ${this.satellites.length}`);
    console.log(`   Yandex success: ${yandexSuccess}/${this.satellites.length}`);
    console.log(`   Bing success: ${bingSuccess}/${this.satellites.length}`);
    console.log(`   Errors: ${errors}`);
  }

  saveLog() {
    const log = {
      timestamp: new Date().toISOString(),
      apiKey: this.client.getApiKey(),
      totalSatellites: this.satellites.length,
      results: this.results
    };

    const logPath = path.join(__dirname, '../satellites/indexnow-submission.json');
    fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
    console.log(`\n✅ Log saved: satellites/indexnow-submission.json`);
  }

  saveKeyFile() {
    const keyContent = this.client.getKeyFileContent();
    const keyPath = path.join(__dirname, `../${this.client.getApiKey()}.txt`);
    fs.writeFileSync(keyPath, keyContent);
    console.log(`✅ API key file saved: ${this.client.getApiKey()}.txt`);
    console.log(`   Upload this file to the root of your main site`);
  }

  async run() {
    console.log('🔔 IndexNow Submission Tool\n');
    
    this.loadSatellites();
    this.saveKeyFile();
    await this.submitAll();
    this.printStats();
    this.saveLog();
    
    console.log('\n✅ Submission complete!');
    console.log('💡 URLs will be indexed in 0-5 minutes (vs 1-14 days with sitemaps)');
  }
}

async function main() {
  const submitter = new IndexNowSubmitter();
  await submitter.run();
}

main().catch(console.error);
