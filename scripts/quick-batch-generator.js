#!/usr/bin/env node

/**
 * QUICK BATCH GENERATOR
 * Generates satellites quickly without full npm install
 * Uses existing node_modules from main project
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  satellites: 20, // Start with 20, can increase
  parallel: 3,
  pages: 1000
};

console.log('🚀 QUICK BATCH GENERATOR');
console.log(`Generating ${CONFIG.satellites} satellites with ${CONFIG.pages} pages each\n`);

const niches = [
  'ai-copywriting', 'ai-design', 'ai-automation', 'ai-marketing',
  'ai-video', 'ai-business', 'ai-freelance', 'ai-education'
];

let completed = 0;
let failed = 0;

for (let i = 0; i < CONFIG.satellites; i += CONFIG.parallel) {
  const batch = [];
  
  for (let j = 0; j < CONFIG.parallel && (i + j) < CONFIG.satellites; j++) {
    const satNum = i + j + 1;
    const niche = niches[satNum % niches.length];
    const domain = `${niche}-quick-${satNum}`;
    
    console.log(`\n📦 Starting satellite ${satNum}/${CONFIG.satellites}: ${domain}`);
    
    const cmd = `node scripts/satellite-generator.js --niche ${niche} --pages ${CONFIG.pages} --domain ${domain}`;
    
    batch.push(
      new Promise((resolve) => {
        try {
          execSync(cmd, { stdio: 'inherit', timeout: 600000 }); // 10 min timeout
          console.log(`✅ Completed satellite ${satNum}`);
          completed++;
          resolve();
        } catch (error) {
          console.error(`❌ Failed satellite ${satNum}:`, error.message);
          failed++;
          resolve();
        }
      })
    );
  }
  
  await Promise.all(batch);
  
  console.log(`\n📊 Progress: ${completed + failed}/${CONFIG.satellites} (✅ ${completed} | ❌ ${failed})\n`);
}

console.log('\n🎉 BATCH GENERATION COMPLETE');
console.log(`✅ Completed: ${completed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📄 Total pages: ${completed * CONFIG.pages}`);
