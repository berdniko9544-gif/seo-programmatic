#!/usr/bin/env node

/**
 * FIX AND REDEPLOY SATELLITES WITH ENCODING ISSUES
 * Copies fixed shared.js and redeploys to Vercel
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SATELLITES_TO_FIX = [
  'ai-copywriting-1773660281654-0',
  'ai-design-1773660308409-1',
  'ai-automation-1773660334758-2',
  'ai-marketing-1773660364510-3',
  'ai-video-1773660397611-4',
  'demo-copywriting-sat-001',
  'local-test-001',
  'test-satellite-1',
];

const FIXED_SHARED_JS = path.join(process.cwd(), 'src', 'components', 'shared.js');
const SATELLITES_DIR = path.join(process.cwd(), 'satellites');
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;

console.log('🔧 FIXING AND REDEPLOYING SATELLITES');
console.log('━'.repeat(80));
console.log(`📦 Satellites to fix: ${SATELLITES_TO_FIX.length}`);
console.log('');

if (!VERCEL_TOKEN) {
  console.error('❌ VERCEL_TOKEN not set');
  process.exit(1);
}

if (!fs.existsSync(FIXED_SHARED_JS)) {
  console.error('❌ Fixed shared.js not found');
  process.exit(1);
}

const fixedContent = fs.readFileSync(FIXED_SHARED_JS, 'utf8');
let successCount = 0;
let failCount = 0;

for (const satelliteName of SATELLITES_TO_FIX) {
  const satelliteDir = path.join(SATELLITES_DIR, satelliteName);
  
  if (!fs.existsSync(satelliteDir)) {
    console.log(`⏭️  ${satelliteName} - not found, skipping`);
    continue;
  }

  console.log(`\n🔧 [${successCount + failCount + 1}/${SATELLITES_TO_FIX.length}] ${satelliteName}`);
  
  try {
    // Copy fixed shared.js
    const targetSharedJs = path.join(satelliteDir, 'src', 'components', 'shared.js');
    fs.writeFileSync(targetSharedJs, fixedContent, 'utf8');
    console.log('  ✅ Copied fixed shared.js');

    // Build
    console.log('  🔨 Building...');
    execSync('npm run build', {
      cwd: satelliteDir,
      stdio: 'ignore',
    });
    console.log('  ✅ Built successfully');

    // Deploy to Vercel
    console.log('  ☁️  Deploying to Vercel...');
    const deployCmd = `vercel deploy --prod --yes --token=${VERCEL_TOKEN} --name=seo-sat-${satelliteName}`;
    const output = execSync(deployCmd, {
      cwd: satelliteDir,
      encoding: 'utf8',
    });

    // Extract URL from output
    const urlMatch = output.match(/https:\/\/[^\s]+/);
    const url = urlMatch ? urlMatch[0] : 'URL not found';
    
    console.log(`  ✅ Deployed: ${url}`);
    successCount++;

  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    failCount++;
  }
}

console.log('\n' + '━'.repeat(80));
console.log('✅ COMPLETE!');
console.log(`📊 Success: ${successCount}/${SATELLITES_TO_FIX.length}`);
console.log(`❌ Failed: ${failCount}`);
