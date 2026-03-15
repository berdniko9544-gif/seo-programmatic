#!/usr/bin/env node

/**
 * (DEPRECATED) Redeploy a single satellite on Vercel
 *
 * Satellites now deploy to Cloudflare Workers. Use:
 *   node scripts/deploy-all.js
 */

throw new Error(
  'scripts/redeploy-satellite.js is deprecated (Vercel-only). Use scripts/deploy-all.js for Cloudflare deploys.'
);

/*

const { execSync } = require('child_process');
const path = require('path');

const satelliteName = process.argv[2];

if (!satelliteName) {
  console.error('Usage: node redeploy-satellite.js <satellite-name>');
  process.exit(1);
}

const vercelToken = process.env.VERCEL_TOKEN;
const vercelTeam = process.env.VERCEL_TEAM;

if (!vercelToken) {
  console.error('VERCEL_TOKEN environment variable required');
  process.exit(1);
}

console.log(`🚀 Redeploying ${satelliteName}...`);

try {
  // Deploy current directory as the satellite
  const cmd = `vercel --prod --yes --token=${vercelToken} --scope=${vercelTeam} --force`;

  console.log('Running deployment...');
  execSync(cmd, {
    stdio: 'inherit',
    cwd: process.cwd()
  });

  console.log(`✅ Successfully redeployed ${satelliteName}`);
} catch (error) {
  console.error(`❌ Failed to redeploy ${satelliteName}:`, error.message);
  process.exit(1);
}
*/
