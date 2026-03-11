#!/usr/bin/env node

/**
 * Fix existing satellites on Vercel
 * - Migrates old satellites to new ISR architecture
 * - Redeploys with updated configuration
 * - Fixes build errors
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class SatelliteFixer {
  constructor() {
    this.vercelToken = process.env.VERCEL_TOKEN;
    this.vercelTeam = process.env.VERCEL_TEAM;
    this.revalidateSecret = process.env.REVALIDATE_SECRET || 'your_random_secret_here_change_this';
    this.deepseekApiKey = process.env.DEEPSEEK_API_KEY;
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  exec(command, options = {}) {
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

  async getExistingSatellites() {
    this.log('Fetching existing satellites from Vercel...');

    try {
      const output = this.exec('vercel list --yes', { silent: true });
      const lines = output.split('\n');

      const satellites = [];
      for (const line of lines) {
        // Match satellite project names
        if (line.includes('sat-') && line.includes('20260310')) {
          const match = line.match(/sat-[\w-]+-\d{8}-\d{4}/);
          if (match) {
            const projectName = match[0];
            const hasError = line.includes('● Error');
            satellites.push({ name: projectName, hasError });
          }
        }
      }

      this.log(`Found ${satellites.length} satellites (${satellites.filter(s => s.hasError).length} with errors)`);
      return satellites;
    } catch (error) {
      this.log(`Error fetching satellites: ${error.message}`, 'error');
      return [];
    }
  }

  async fixSatellite(satelliteName) {
    this.log(`Fixing satellite: ${satelliteName}`);

    const tempDir = path.join(process.cwd(), '..', 'temp-satellites', satelliteName);

    try {
      // Create temp directory
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      // Copy current project structure to temp
      this.log(`Copying new architecture to ${satelliteName}...`);
      this.copyProjectStructure(tempDir);

      // Update configuration for this satellite
      this.updateSatelliteConfig(tempDir, satelliteName);

      // Deploy to Vercel
      this.log(`Deploying ${satelliteName} to Vercel...`);
      process.chdir(tempDir);

      const deployCmd = this.vercelTeam
        ? `vercel --prod --yes --token=${this.vercelToken} --scope=${this.vercelTeam} --name=${satelliteName}`
        : `vercel --prod --yes --token=${this.vercelToken} --name=${satelliteName}`;

      this.log(`Running: vercel --prod --yes --scope=${this.vercelTeam} --name=${satelliteName}`);
      this.exec(deployCmd);

      this.log(`Successfully fixed ${satelliteName}`, 'success');

      // Return to original directory
      process.chdir(path.join(__dirname, '..'));

      return true;
    } catch (error) {
      this.log(`Error fixing ${satelliteName}: ${error.message}`, 'error');
      process.chdir(path.join(__dirname, '..'));
      return false;
    }
  }

  copyProjectStructure(targetDir) {
    const sourceDir = path.join(__dirname, '..');

    // Copy essential files and directories
    const itemsToCopy = [
      'src',
      'public',
      'package.json',
      'package-lock.json',
      'next.config.js',
      'jsconfig.json',
      '.gitignore'
    ];

    for (const item of itemsToCopy) {
      const sourcePath = path.join(sourceDir, item);
      const targetPath = path.join(targetDir, item);

      if (fs.existsSync(sourcePath)) {
        if (fs.statSync(sourcePath).isDirectory()) {
          this.copyDir(sourcePath, targetPath);
        } else {
          fs.copyFileSync(sourcePath, targetPath);
        }
      }
    }

    // Create .env.local with secrets
    const envContent = `DEEPSEEK_API_KEY=${this.deepseekApiKey}
REVALIDATE_SECRET=${this.revalidateSecret}
NEXT_PUBLIC_SITE_URL=https://placeholder.vercel.app
NEXT_PUBLIC_SITE_NAME=AI Earnings Guide
`;
    fs.writeFileSync(path.join(targetDir, '.env.local'), envContent);
  }

  copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        // Skip node_modules, .next, .git
        if (['node_modules', '.next', '.git', 'out'].includes(entry.name)) {
          continue;
        }
        this.copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  updateSatelliteConfig(satelliteDir, satelliteName) {
    // Update package.json name
    const packageJsonPath = path.join(satelliteDir, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.name = satelliteName;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }

  async run() {
    this.log('🚀 Starting satellite fix process...');

    // Check environment variables
    if (!this.vercelToken) {
      this.log('VERCEL_TOKEN not found in environment', 'error');
      this.log('Set it with: export VERCEL_TOKEN=your_token');
      process.exit(1);
    }

    if (!this.deepseekApiKey) {
      this.log('DEEPSEEK_API_KEY not found in environment', 'error');
      process.exit(1);
    }

    // Get existing satellites
    const satellites = await this.getExistingSatellites();

    if (satellites.length === 0) {
      this.log('No satellites found to fix');
      return;
    }

    // Fix satellites with errors first
    const errorSatellites = satellites.filter(s => s.hasError);
    const successSatellites = satellites.filter(s => !s.hasError);

    this.log(`\nFixing ${errorSatellites.length} satellites with errors...`);

    let fixed = 0;
    let failed = 0;

    for (const satellite of errorSatellites) {
      const success = await this.fixSatellite(satellite.name);
      if (success) {
        fixed++;
      } else {
        failed++;
      }
    }

    this.log(`\n📊 Results:`);
    this.log(`✅ Fixed: ${fixed}`);
    this.log(`❌ Failed: ${failed}`);
    this.log(`✓ Already working: ${successSatellites.length}`);

    this.log('\n🎉 Satellite fix process complete!', 'success');
  }
}

// Run if called directly
if (require.main === module) {
  const fixer = new SatelliteFixer();
  fixer.run().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = SatelliteFixer;
