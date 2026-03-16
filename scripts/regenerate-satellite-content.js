#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { ContentGenerator } = require('../src/utils/content-generator');

class SatelliteContentRegenerator {
  constructor() {
    this.satellitesDir = path.join(process.cwd(), 'satellites');
    this.contentGenerator = new ContentGenerator();
    this.results = [];
  }

  getSatellites() {
    const satellites = fs.readdirSync(this.satellitesDir)
      .filter(name =>
        (name.startsWith('ai-') ||
         name.startsWith('demo-') ||
         name.startsWith('local-') ||
         name.startsWith('test-')) &&
        fs.statSync(path.join(this.satellitesDir, name)).isDirectory()
      )
      .sort(); // Sort for deterministic ordering
    
    return satellites.map((name, index) => {
      const satellitePath = path.join(this.satellitesDir, name);
      const envPath = path.join(satellitePath, '.env.local');
      
      let niche = 'ai-business';
      
      // Extract niche from .env.local file
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const nicheMatch = envContent.match(/NEXT_PUBLIC_SITE_VERTICAL=([^\s\n]+)/);
        if (nicheMatch) niche = nicheMatch[1].trim();
      }
      
      // Use index as satellite number for unique variations
      const satelliteNumber = index + 1; // Start from 1 instead of 0
      
      return {
        name,
        path: satellitePath,
        niche,
        satelliteNumber,
        contentPath: path.join(satellitePath, 'src', 'data', 'content.js'),
        directionsPath: path.join(satellitePath, 'src', 'data', 'directions.js')
      };
    });
  }

  async regenerateSatelliteContent(satellite) {
    console.log(`\n🔄 Regenerating content for ${satellite.name}`);
    console.log(`   Niche: ${satellite.niche}, Satellite #${satellite.satelliteNumber}`);

    try {
      // Generate new content with the fixed generator
      const data = await this.contentGenerator.generateSatelliteData(
        satellite.niche,
        satellite.satelliteNumber,
        1000
      );

      // Write content.js
      const contentJs = this.generateContentFile(data);
      fs.writeFileSync(satellite.contentPath, contentJs, 'utf8');
      
      // Write directions.js
      const directionsJs = this.generateDirectionsFile(data.directions);
      fs.writeFileSync(satellite.directionsPath, directionsJs, 'utf8');

      console.log(`   ✅ Generated ${data.articles.length} unique articles`);
      console.log(`   ✅ Generated ${data.directions.length} directions`);
      console.log(`   ✅ Generated ${data.longTailPages.length} long-tail pages`);

      this.results.push({
        name: satellite.name,
        success: true,
        articles: data.articles.length,
        directions: data.directions.length,
        longTail: data.longTailPages.length
      });

    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
      this.results.push({
        name: satellite.name,
        success: false,
        error: error.message
      });
    }
  }

  generateContentFile(data) {
    return `// Auto-generated content with unique variations
const howToArticles = ${JSON.stringify(data.articles, null, 2)};

const comparisonPairs = ${JSON.stringify(data.comparisonPairs, null, 2)};

const yearMonths = ${JSON.stringify(data.yearMonths, null, 2)};

module.exports = {
  howToArticles,
  comparisonPairs,
  yearMonths,
};
`;
  }

  generateDirectionsFile(directions) {
    return `// Auto-generated directions
const directions = ${JSON.stringify(directions, null, 2)};

module.exports = { directions };
`;
  }

  async run() {
    console.log('🚀 Regenerating content for all satellites with unique variations...\n');

    const satellites = this.getSatellites();
    console.log(`Found ${satellites.length} satellites to regenerate\n`);

    for (const satellite of satellites) {
      await this.regenerateSatelliteContent(satellite);
    }

    this.printSummary();
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('REGENERATION SUMMARY');
    console.log('='.repeat(60));

    const successful = this.results.filter(r => r.success);
    const failed = this.results.filter(r => !r.success);

    console.log(`✅ Successfully regenerated: ${successful.length}`);
    console.log(`❌ Failed: ${failed.length}`);

    if (successful.length > 0) {
      const totalArticles = successful.reduce((sum, r) => sum + r.articles, 0);
      const totalDirections = successful.reduce((sum, r) => sum + r.directions, 0);
      const totalLongTail = successful.reduce((sum, r) => sum + r.longTail, 0);
      
      console.log(`\n📊 Total content generated:`);
      console.log(`   - ${totalArticles} unique articles`);
      console.log(`   - ${totalDirections} directions`);
      console.log(`   - ${totalLongTail} long-tail pages`);
    }

    if (failed.length > 0) {
      console.log('\n❌ Failed satellites:');
      failed.forEach(r => {
        console.log(`  - ${r.name}: ${r.error}`);
      });
    }

    console.log('\n✨ Content regeneration complete!');
    console.log('Next step: Redeploy all satellites to Vercel');
  }
}

async function main() {
  const regenerator = new SatelliteContentRegenerator();
  await regenerator.run();
}

main().catch(console.error);
