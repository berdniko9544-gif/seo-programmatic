#!/usr/bin/env node

/**
 * ISR TRIGGER SCRIPT
 * Triggers ISR revalidation for all satellites
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const CONFIG = {
  satellitesDir: path.join(process.cwd(), 'satellites'),
  urlsFile: path.join(process.cwd(), 'satellites', 'urls.txt'),
};

class ISRTrigger {
  async run() {
    console.log('🔄 Triggering ISR revalidation for all satellites');

    const urls = this.readURLs();

    if (urls.length === 0) {
      console.log('No satellites found');
      return;
    }

    console.log(`Found ${urls.length} satellites`);

    for (const url of urls) {
      await this.triggerRevalidation(url);
      await this.sleep(1000);
    }

    console.log('✅ ISR revalidation complete');
  }

  readURLs() {
    if (!fs.existsSync(CONFIG.urlsFile)) {
      return [];
    }

    const content = fs.readFileSync(CONFIG.urlsFile, 'utf8');
    return content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && line.startsWith('http'));
  }

  async triggerRevalidation(baseUrl) {
    console.log(`  Revalidating: ${baseUrl}`);
    if (!process.env.MAIN_SITE_REVALIDATE_SECRET && !process.env.REVALIDATE_SECRET) {
      console.log('  ⚠️ No REVALIDATE_SECRET provided; skipping request');
      return;
    }

    // Trigger revalidation by hitting the revalidate API route.
    // If you want to revalidate the *main site* (not satellites), you can set:
    // - MAIN_SITE_REVALIDATE_URL=https://your-main-site.com/api/revalidate
    // - MAIN_SITE_REVALIDATE_SECRET=...
    const secret = process.env.MAIN_SITE_REVALIDATE_SECRET || process.env.REVALIDATE_SECRET;
    const endpoint = process.env.MAIN_SITE_REVALIDATE_URL || `${baseUrl}/api/revalidate`;
    const revalidateUrl = `${endpoint}?secret=${encodeURIComponent(secret)}`;

    return new Promise((resolve) => {
      https.get(revalidateUrl, (res) => {
        if (res.statusCode === 200) {
          console.log(`  ✅ ${baseUrl}`);
        } else {
          console.log(`  ⚠️ ${baseUrl} (${res.statusCode})`);
        }
        resolve();
      }).on('error', () => {
        console.log(`  ❌ ${baseUrl} (error)`);
        resolve();
      });
    });
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

async function main() {
  const trigger = new ISRTrigger();
  await trigger.run();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { ISRTrigger };
