#!/usr/bin/env node

/**
 * VERCEL DEPLOYMENT SCRIPT
 * Deploys current project to Vercel with ISR support
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class VercelDeployer {
  constructor() {
    this.projectRoot = path.join(__dirname, '..');
  }

  async deploy() {
    console.log('🚀 Deploying to Vercel with ISR support');
    console.log('═'.repeat(80));

    // Check environment
    this.checkEnvironment();

    // Build project
    console.log('\n📦 Building project...');
    try {
      execSync('npm run build', {
        cwd: this.projectRoot,
        stdio: 'inherit'
      });
      console.log('✅ Build successful');
    } catch (error) {
      console.error('❌ Build failed');
      process.exit(1);
    }

    // Deploy to Vercel
    console.log('\n☁️ Deploying to Vercel...');
    try {
      const vercelToken = process.env.VERCEL_TOKEN;
      const vercelTeam = process.env.VERCEL_TEAM;

      let cmd = 'vercel --prod --yes';

      if (vercelToken) {
        cmd += ` --token=${vercelToken}`;
      }

      if (vercelTeam) {
        cmd += ` --scope=${vercelTeam}`;
      }

      const output = execSync(cmd, {
        cwd: this.projectRoot,
        encoding: 'utf8'
      });

      // Extract URL
      const urlMatch = output.match(/https:\/\/[^\s]+/);
      const url = urlMatch ? urlMatch[0] : null;

      console.log('✅ Deployment successful');
      if (url) {
        console.log(`🌐 URL: ${url}`);

        // Save URL
        const urlFile = path.join(this.projectRoot, 'DEPLOYMENT_URL.txt');
        fs.writeFileSync(urlFile, url);
      }

      return url;
    } catch (error) {
      console.error('❌ Deployment failed:', error.message);
      process.exit(1);
    }
  }

  checkEnvironment() {
    console.log('🔍 Checking environment...');

    const required = ['DEEPSEEK_API_KEY', 'VERCEL_TOKEN'];
    const missing = [];

    for (const key of required) {
      if (!process.env[key]) {
        missing.push(key);
      }
    }

    if (missing.length > 0) {
      console.error('❌ Missing required environment variables:');
      missing.forEach(key => console.error(`   - ${key}`));
      console.log('\nSet them in .env.local or export them:');
      console.log('export DEEPSEEK_API_KEY=your_key');
      console.log('export VERCEL_TOKEN=your_token');
      process.exit(1);
    }

    console.log('✅ Environment OK');
  }
}

async function main() {
  const deployer = new VercelDeployer();
  await deployer.deploy();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { VercelDeployer };
