#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class EnvUrlFixer {
  constructor() {
    this.satellitesDir = path.join(process.cwd(), 'satellites');
    this.deployLogPath = path.join(this.satellitesDir, 'vercel-deploy-log.json');
    this.results = [];
  }

  loadDeploymentLog() {
    if (!fs.existsSync(this.deployLogPath)) {
      console.error('❌ Deployment log not found:', this.deployLogPath);
      process.exit(1);
    }

    const log = JSON.parse(fs.readFileSync(this.deployLogPath, 'utf8'));
    return log.results || [];
  }

  getSatellites() {
    return fs.readdirSync(this.satellitesDir)
      .filter(name => 
        (name.startsWith('ai-') || 
         name.startsWith('demo-') || 
         name.startsWith('local-') || 
         name.startsWith('test-')) &&
        fs.statSync(path.join(this.satellitesDir, name)).isDirectory()
      )
      .map(name => ({
        name,
        path: path.join(this.satellitesDir, name),
        envPath: path.join(this.satellitesDir, name, '.env.local')
      }));
  }

  fixSatelliteEnv(satellite, deploymentUrl) {
    if (!fs.existsSync(satellite.envPath)) {
      console.log(`⚠️  No .env.local found for ${satellite.name}`);
      this.results.push({
        name: satellite.name,
        success: false,
        reason: 'No .env.local file'
      });
      return;
    }

    try {
      let envContent = fs.readFileSync(satellite.envPath, 'utf8');
      const lines = envContent.split('\n');
      
      // Update URL-related variables
      const updatedLines = lines.map(line => {
        if (line.startsWith('NEXT_PUBLIC_SITE_URL=')) {
          return `NEXT_PUBLIC_SITE_URL=${deploymentUrl}`;
        }
        if (line.startsWith('NEXT_PUBLIC_BASE_URL=')) {
          return `NEXT_PUBLIC_BASE_URL=${deploymentUrl}`;
        }
        if (line.startsWith('SITE_URL=')) {
          return `SITE_URL=${deploymentUrl}`;
        }
        return line;
      });

      fs.writeFileSync(satellite.envPath, updatedLines.join('\n'), 'utf8');
      
      console.log(`✅ Fixed ${satellite.name}`);
      console.log(`   URL: ${deploymentUrl}`);
      
      this.results.push({
        name: satellite.name,
        success: true,
        url: deploymentUrl
      });
    } catch (error) {
      console.error(`❌ Error fixing ${satellite.name}:`, error.message);
      this.results.push({
        name: satellite.name,
        success: false,
        reason: error.message
      });
    }
  }

  run() {
    console.log('🔧 Fixing .env.local URLs for all satellites...\n');

    const deployments = this.loadDeploymentLog();
    const satellites = this.getSatellites();

    console.log(`Found ${satellites.length} satellites`);
    console.log(`Found ${deployments.length} deployment records\n`);

    // Create a map of satellite names to deployment URLs
    const deploymentMap = new Map();
    deployments.forEach(deployment => {
      if (deployment.success && deployment.url) {
        deploymentMap.set(deployment.name, deployment.url);
      }
    });

    // Fix each satellite
    satellites.forEach(satellite => {
      const deploymentUrl = deploymentMap.get(satellite.name);
      
      if (!deploymentUrl) {
        console.log(`⚠️  No deployment URL found for ${satellite.name}`);
        this.results.push({
          name: satellite.name,
          success: false,
          reason: 'No deployment URL in log'
        });
        return;
      }

      this.fixSatelliteEnv(satellite, deploymentUrl);
    });

    this.printSummary();
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('SUMMARY');
    console.log('='.repeat(60));

    const successful = this.results.filter(r => r.success);
    const failed = this.results.filter(r => !r.success);

    console.log(`✅ Successfully fixed: ${successful.length}`);
    console.log(`❌ Failed: ${failed.length}`);

    if (failed.length > 0) {
      console.log('\nFailed satellites:');
      failed.forEach(r => {
        console.log(`  - ${r.name}: ${r.reason}`);
      });
    }

    console.log('\n✨ All .env.local files have been updated with correct Vercel URLs!');
    console.log('Next step: Regenerate satellites with fixed content generator');
  }
}

const fixer = new EnvUrlFixer();
fixer.run();
