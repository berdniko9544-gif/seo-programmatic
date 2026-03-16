#!/usr/bin/env node

/**
 * VERCEL DEPLOYMENT MANAGER
 * Deploys all satellites to Vercel with build minute optimization
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Load VERCEL_TOKEN from .env.local if not in environment
function loadVercelToken() {
  if (process.env.VERCEL_TOKEN) {
    return process.env.VERCEL_TOKEN;
  }
  
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/VERCEL_TOKEN=(.+)/);
    if (match) {
      return match[1].trim();
    }
  }
  
  return null;
}

const CONFIG = {
  satellitesDir: path.join(process.cwd(), 'satellites'),
  logFile: path.join(process.cwd(), 'satellites', 'vercel-deploy-log.json'),
  maxConcurrent: 3,
  vercelToken: loadVercelToken(),
};

class VercelDeploymentManager {
  constructor() {
    this.results = [];
    this.totalBuildMinutes = 0;
  }

  async deployAll() {
    console.log('🚀 Vercel Deployment Manager');
    console.log('━'.repeat(80));

    if (!this.checkVercelCLI()) {
      console.error('❌ Vercel CLI not installed');
      console.log('Install: npm i -g vercel');
      process.exit(1);
    }

    const satellites = this.getSatellites();
    if (satellites.length === 0) {
      console.log('📭 No satellites to deploy');
      return;
    }

    console.log(`📦 Found ${satellites.length} satellites`);
    console.log(`⚡ Concurrency: ${CONFIG.maxConcurrent}`);
    console.log('');

    const startTime = Date.now();

    for (let i = 0; i < satellites.length; i += CONFIG.maxConcurrent) {
      const batch = satellites.slice(i, i + CONFIG.maxConcurrent);
      await Promise.all(
        batch.map((sat, idx) => 
          this.deploySatellite(sat, i + idx + 1, satellites.length)
        )
      );
    }

    const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(2);

    console.log('\n✅ Deployment complete!');
    console.log(`⏱️  Time: ${duration} minutes`);
    console.log(`📊 Success: ${this.results.filter(r => r.success).length}/${satellites.length}`);
    console.log(`⏰ Build minutes used: ~${this.totalBuildMinutes.toFixed(1)} min`);

    this.saveLog();
    this.printURLs();
  }

  checkVercelCLI() {
    try {
      execSync('vercel --version', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }

  getSatellites() {
    if (!fs.existsSync(CONFIG.satellitesDir)) {
      return [];
    }

    return fs
      .readdirSync(CONFIG.satellitesDir, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => ({
        name: entry.name,
        path: path.join(CONFIG.satellitesDir, entry.name),
      }));
  }

  async deploySatellite(satellite, index, total) {
    console.log(`\n[${index}/${total}] 🚀 ${satellite.name}`);

    const startTime = Date.now();

    try {
      const projectName = `seo-sat-${satellite.name}`;

      console.log('  📦 Building...');
      const buildStart = Date.now();
      
      execSync('npm run build', {
        cwd: satellite.path,
        stdio: 'inherit',
        env: {
          ...process.env,
          NODE_ENV: 'production',
          NEXT_TELEMETRY_DISABLED: '1',
        },
      });

      const buildDuration = (Date.now() - buildStart) / 1000 / 60;
      this.totalBuildMinutes += buildDuration;

      console.log(`  ☁️  Deploying to Vercel...`);

      const deployCmd = CONFIG.vercelToken
        ? `vercel deploy --prod --yes --token=${CONFIG.vercelToken} --name=${projectName}`
        : `vercel deploy --prod --yes --name=${projectName}`;

      const deployOutput = execSync(deployCmd, {
        cwd: satellite.path,
        encoding: 'utf8',
      });

      const urlMatch = deployOutput.match(/https:\/\/[^\s]+/);
      const url = urlMatch ? urlMatch[0] : null;

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);

      this.results.push({
        name: satellite.name,
        url,
        projectName,
        success: true,
        buildMinutes: buildDuration.toFixed(2),
        duration,
        timestamp: new Date().toISOString(),
      });

      console.log(`  ✅ Done in ${duration}s (build: ${buildDuration.toFixed(1)}m)`);
      if (url) {
        console.log(`  🌐 ${url}`);
      }
    } catch (error) {
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);

      this.results.push({
        name: satellite.name,
        url: null,
        success: false,
        error: error.message,
        duration,
        timestamp: new Date().toISOString(),
      });

      console.error(`  ❌ Error: ${error.message}`);
    }
  }

  saveLog() {
    const log = {
      timestamp: new Date().toISOString(),
      totalBuildMinutes: this.totalBuildMinutes.toFixed(2),
      results: this.results,
    };

    const logDir = path.dirname(CONFIG.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    fs.writeFileSync(CONFIG.logFile, JSON.stringify(log, null, 2));
    console.log(`\n📝 Log saved: ${CONFIG.logFile}`);
  }

  printURLs() {
    console.log('\n🌐 Deployed URLs:');
    console.log('━'.repeat(80));

    const successful = this.results.filter(result => result.success && result.url);
    successful.forEach((result, index) => {
      console.log(`${index + 1}. ${result.name}`);
      console.log(`   ${result.url}`);
    });

    console.log('━'.repeat(80));

    const urlsFile = path.join(CONFIG.satellitesDir, 'vercel-urls.txt');
    const urls = successful.map(result => result.url).join('\n');
    fs.writeFileSync(urlsFile, urls);

    console.log(`\n📄 URLs saved: ${urlsFile}`);
  }
}

async function main() {
  const manager = new VercelDeploymentManager();
  await manager.deployAll();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { VercelDeploymentManager };
