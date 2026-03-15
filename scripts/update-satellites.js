#!/usr/bin/env node

/**
 * (DEPRECATED) Update satellites on Vercel
 *
 * Satellites now deploy to Cloudflare Workers.
 * Use scripts/deploy-all.js.
 */

throw new Error(
  'scripts/update-satellites.js is deprecated (Vercel-only). Use scripts/deploy-all.js for Cloudflare deploys.'
);

/*

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_TEAM = process.env.VERCEL_TEAM;

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

async function getSatelliteProjects() {
  log('Fetching satellite projects from Vercel...');

  try {
    const output = exec(
      `vercel projects ls --token=${VERCEL_TOKEN} --scope=${VERCEL_TEAM}`,
      { silent: true }
    );

    const lines = output.split('\n');
    const satellites = [];

    for (const line of lines) {
      // Skip header lines and empty lines
      if (!line.trim() || line.includes('Project Name') || line.includes('---')) {
        continue;
      }

      // Match lines with satellite project names
      const trimmed = line.trim();
      if (trimmed.startsWith('sat-')) {
        // Extract just the project name (first column)
        const parts = trimmed.split(/\s+/);
        if (parts.length > 0 && parts[0].startsWith('sat-')) {
          satellites.push(parts[0]);
        }
      }
    }

    // Remove duplicates
    const uniqueSatellites = [...new Set(satellites)];

    log(`Found ${uniqueSatellites.length} satellite projects`);
    return uniqueSatellites;
  } catch (error) {
    log(`Error fetching projects: ${error.message}`, 'error');
    return [];
  }
}

async function updateSatellite(projectName) {
  log(`\n📦 Updating ${projectName}...`);

  try {
    // Link to existing project
    log(`Linking to project ${projectName}...`);
    exec(
      `vercel link --yes --token=${VERCEL_TOKEN} --scope=${VERCEL_TEAM} --project=${projectName}`,
      { ignoreError: true }
    );

    // Deploy with force flag to update
    log(`Deploying updated code...`);
    exec(
      `vercel --prod --yes --token=${VERCEL_TOKEN} --scope=${VERCEL_TEAM} --force`
    );

    log(`Successfully updated ${projectName}`, 'success');
    return true;
  } catch (error) {
    log(`Failed to update ${projectName}: ${error.message}`, 'error');
    return false;
  }
}

async function main() {
  if (!VERCEL_TOKEN) {
    log('VERCEL_TOKEN environment variable required', 'error');
    process.exit(1);
  }

  log('🚀 Starting satellite update process...\n');

  const satellites = await getSatelliteProjects();

  if (satellites.length === 0) {
    log('No satellites found to update');
    return;
  }

  log(`\nWill update ${satellites.length} satellites with new ISR architecture\n`);

  let success = 0;
  let failed = 0;

  // Update first 5 satellites as a test
  const satellitesToUpdate = satellites.slice(0, 5);

  for (const satellite of satellitesToUpdate) {
    const result = await updateSatellite(satellite);
    if (result) {
      success++;
    } else {
      failed++;
    }
  }

  log(`\n📊 Update Results:`);
  log(`✅ Successfully updated: ${success}`);
  log(`❌ Failed: ${failed}`);
  log(`⏳ Remaining: ${satellites.length - satellitesToUpdate.length}`);

  if (success > 0) {
    log(`\n🎉 Satellite update process complete!`, 'success');
    log(`\nTo update remaining satellites, run this script again or update the slice(0, 5) to process more.`);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
*/
