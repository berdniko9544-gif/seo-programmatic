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

console.log('рџ”„ UPDATING SATELLITES WITH NEW FEATURES');
console.log('в•ђ'.repeat(80));

// Files to copy to each satellite
const filesToCopy = [
  { src: 'next-env.d.ts', dest: 'next-env.d.ts' },
  { src: 'next.config.js', dest: 'next.config.js' },
  { src: 'tsconfig.json', dest: 'tsconfig.json' },
  { src: 'tsconfig.typecheck.json', dest: 'tsconfig.typecheck.json' },
  { src: 'src/app/page.js', dest: 'src/app/page.js' },
  { src: 'src/app/layout.js', dest: 'src/app/layout.js' },
  { src: 'src/app/globals.css', dest: 'src/app/globals.css' },
  { src: 'src/app/api/revalidate/route.js', dest: 'src/app/api/revalidate/route.js' },
  { src: 'src/app/api/content/[slug]/route.js', dest: 'src/app/api/content/[slug]/route.js' },
  { src: 'src/app/longtail/[slug]/page.js', dest: 'src/app/longtail/[slug]/page.js' },
  { src: 'src/components/shared.js', dest: 'src/components/shared.js' },
  { src: 'src/config/site.js', dest: 'src/config/site.js' },
  { src: 'src/config/site-profile.js', dest: 'src/config/site-profile.js' },
  { src: 'src/config/content.js', dest: 'src/config/content.js' },
  { src: 'src/utils/rate-limit.js', dest: 'src/utils/rate-limit.js' },
  { src: 'src/utils/revalidation.js', dest: 'src/utils/revalidation.js' },
  { src: 'src/utils/safe-html.js', dest: 'src/utils/safe-html.js' },
  { src: 'src/utils/site-network-config.js', dest: 'src/utils/site-network-config.js' },
  { src: 'src/utils/seo-metadata.ts', dest: 'src/utils/seo-metadata.ts' },
  // (removed) vercel.json is Vercel-specific
  // { src: 'vercel.json', dest: 'vercel.json' },
  { src: 'jest.config.js', dest: 'jest.config.js' },
  { src: 'jest.setup.js', dest: 'jest.setup.js' },
  { src: 'playwright.config.ts', dest: 'playwright.config.ts' },
];



function updateSatellite(satelliteDir) {
  const satelliteName = path.basename(satelliteDir);
  console.log('');
  console.log('рџ“¦ Updating: ' + satelliteName);

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
        console.log('  вњ… Copied: ' + file.dest);
      }
    }
    // Update package.json with test scripts
    const packageJsonPath = path.join(satelliteDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      packageJson.scripts = {
        ...packageJson.scripts,
        dev: 'next dev --webpack',
        typecheck: 'next typegen && tsc --noEmit -p tsconfig.typecheck.json',
        test: 'jest',
        'test:watch': 'jest --watch',
        'test:coverage': 'jest --coverage',
        'test:e2e': 'playwright test',
      };
      packageJson.devDependencies = {
        ...packageJson.devDependencies,
        '@playwright/test': '^1.40.0',
        '@testing-library/jest-dom': '^6.1.5',
        '@testing-library/react': '^16.0.0',
        '@types/jest': '^30.0.0',
        jest: '^30.3.0',
        'jest-environment-jsdom': '^30.3.0',
        typescript: '^5.9.3',
      };
      packageJson.overrides = {
        ...(packageJson.overrides || {}),
        undici: '7.24.3',
      };
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log('  вњ… Updated: package.json');
    }

    console.log('  вњ… ' + satelliteName + ' updated successfully');
    return true;
  } catch (error) {
    console.error('  вќЊ Error updating ' + satelliteName + ':', error.message);
    return false;
  }
}

function main() {
  if (!fs.existsSync(SATELLITES_DIR)) {
    console.log('вљ пёЏ  No satellites directory found. Skipping update.');
    return;
  }

  const satellites = fs.readdirSync(SATELLITES_DIR).filter(name => {
    const fullPath = path.join(SATELLITES_DIR, name);
    return fs.statSync(fullPath).isDirectory() && name.startsWith('sat-');
  });

  if (satellites.length === 0) {
    console.log('вљ пёЏ  No satellites found. Skipping update.');
    return;
  }

  console.log('');
  console.log('рџ“Љ Found ' + satellites.length + ' satellites to update');
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
  console.log('в•ђ'.repeat(80));
  console.log('');
  console.log('вњ… Update complete: ' + successCount + ' successful, ' + failCount + ' failed');
  console.log('');
}

if (require.main === module) {
  main();
}

module.exports = { updateSatellite };





