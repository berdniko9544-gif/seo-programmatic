#!/usr/bin/env node

/**
 * (DEPRECATED) Batch redeploy satellites on Vercel
 *
 * This repository now deploys satellites to Cloudflare Workers.
 * Use scripts/deploy-all.js.
 */

throw new Error(
  'scripts/batch-redeploy.js is deprecated (Vercel-only). Use scripts/deploy-all.js for Cloudflare deploys.'
);

// (old implementation below kept for reference)

/*

const { execSync } = require('child_process');

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_TEAM = process.env.VERCEL_TEAM;

// Satellites with errors that need fixing
const SATELLITES_TO_FIX = [
  'sat-market-signal-desk-6-20260310-0019',
  'sat-creator-revenue-fiel-20260310-0016',
  'sat-market-signal-desk-5-20260310-0013',
  'sat-automation-profit-bu-20260310-0011',
  'sat-automation-profit-bu-20260310-0005'
];

function log(message, type = 'info') {
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
  console.log(`${prefix} ${message}`);
}

function exec(command, options = {}) {
  try {
    return execSync(command, {
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options
    });
  } catch (error) {
    if (!options.ignoreError) {
      throw error;
    }
    return null;
  }
}

async function redeploySatellite(satelliteName) {
  log(`Redeploying ${satelliteName}...`);

  try {
    const cmd = `vercel --prod --yes --token=${VERCEL_TOKEN} --scope=${VERCEL_TEAM} --force`;

    exec(cmd);

    log(`Successfully redeployed ${satelliteName}`, 'success');
    return true;
  } catch (error) {
    log(`Failed to redeploy ${satelliteName}: ${error.message}`, 'error');
    return false;
  }
}

async function main() {
  if (!VERCEL_TOKEN) {
    log('VERCEL_TOKEN environment variable required', 'error');
    process.exit(1);
  }

  log(`🚀 Starting batch redeploy of ${SATELLITES_TO_FIX.length} satellites...`);

  let success = 0;
  let failed = 0;

  for (const satellite of SATELLITES_TO_FIX) {
    const result = await redeploySatellite(satellite);
    if (result) {
      success++;
    } else {
      failed++;
    }
  }

  log(`\n📊 Results:`);
  log(`✅ Success: ${success}`);
  log(`❌ Failed: ${failed}`);
  log(`\n🎉 Batch redeploy complete!`, 'success');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
*/
