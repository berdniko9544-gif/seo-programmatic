#!/usr/bin/env node

/**
 * UPDATE SATELLITES WITH NEW FEATURES
 * Updates existing satellites with security, SEO, and testing improvements
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SATELLITES_DIR = path.join(process.cwd(), 'satellites');
const TEMPLATE_DIR = path.join(__dirname, '..');

console.log('🔄 UPDATING SATELLITES WITH NEW FEATURES');
console.log('═'.repeat(80));

// Files to copy to each satellite
const filesToCopy = [
  { src: 'src/utils/seo-metadata.ts', dest: 'src/utils/seo-metadata.ts' },
  { src: 'src/middleware.ts', dest: 'src/middleware.ts' },
  // (removed) vercel.json is Vercel-specific
  // { src: 'vercel.json', dest: 'vercel.json' },
  { src: 'jest.config.js', dest: 'jest.config.js' },
  { src: 'jest.setup.js', dest: 'jest.setup.js' },
  { src: 'playwright.config.ts', dest: 'playwright.config.ts' },
];

// Updated next.config.js content
const nextConfigContent = `/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },

  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.deepseek.com;",
          },
        ],
      },
    ];
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
          },
        },
      };
    }
    return config;
  },
}

module.exports = nextConfig`;

function updateSatellite(satelliteDir) {
  const satelliteName = path.basename(satelliteDir);
  console.log('');
  console.log('📦 Updating: ' + satelliteName);

  try {
    // Copy new files
    for (const file of filesToCopy) {
      const srcPath = path.join(TEMPLATE_DIR, file.src);
      const destPath = path.join(satelliteDir, file.dest);

      if (fs.existsSync(srcPath)) {
        const destDir = path.dirname(destPath);
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
        fs.copyFileSync(srcPath, destPath);
        console.log('  ✅ Copied: ' + file.dest);
      }
    }

    // Update next.config.js
    const nextConfigPath = path.join(satelliteDir, 'next.config.js');
    fs.writeFileSync(nextConfigPath, nextConfigContent);
    console.log('  ✅ Updated: next.config.js');

    // Update package.json with test scripts
    const packageJsonPath = path.join(satelliteDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      packageJson.scripts = {
        ...packageJson.scripts,
        test: 'jest',
        'test:watch': 'jest --watch',
        'test:coverage': 'jest --coverage',
        'test:e2e': 'playwright test',
      };
      packageJson.devDependencies = {
        ...packageJson.devDependencies,
        '@playwright/test': '^1.40.0',
        '@testing-library/jest-dom': '^6.1.5',
        '@testing-library/react': '^14.1.2',
        '@types/jest': '^29.5.11',
        jest: '^29.7.0',
        'jest-environment-jsdom': '^29.7.0',
      };
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log('  ✅ Updated: package.json');
    }

    console.log('  ✅ ' + satelliteName + ' updated successfully');
    return true;
  } catch (error) {
    console.error('  ❌ Error updating ' + satelliteName + ':', error.message);
    return false;
  }
}

function main() {
  if (!fs.existsSync(SATELLITES_DIR)) {
    console.log('⚠️  No satellites directory found. Skipping update.');
    return;
  }

  const satellites = fs.readdirSync(SATELLITES_DIR).filter(name => {
    const fullPath = path.join(SATELLITES_DIR, name);
    return fs.statSync(fullPath).isDirectory() && name.startsWith('sat-');
  });

  if (satellites.length === 0) {
    console.log('⚠️  No satellites found. Skipping update.');
    return;
  }

  console.log('');
  console.log('📊 Found ' + satellites.length + ' satellites to update');
  console.log('');

  let successCount = 0;
  let failCount = 0;

  for (const satellite of satellites) {
    const satelliteDir = path.join(SATELLITES_DIR, satellite);
    if (updateSatellite(satelliteDir)) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log('');
  console.log('═'.repeat(80));
  console.log('');
  console.log('✅ Update complete: ' + successCount + ' successful, ' + failCount + ' failed');
  console.log('');
}

if (require.main === module) {
  main();
}

module.exports = { updateSatellite };
