#!/usr/bin/env node

/**
 * MASSIVE BATCH GENERATOR
 * Generates 100+ satellites in parallel locally
 * Much faster than GitHub Actions
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  totalSatellites: 100,
  parallelWorkers: 5, // Run 5 at a time
  pagesPerSatellite: 1000,
  niches: [
    'ai-copywriting',
    'ai-design',
    'ai-automation',
    'ai-marketing',
    'ai-video',
    'ai-business',
    'ai-freelance',
    'ai-education'
  ]
};

class MassiveGenerator {
  constructor() {
    this.completed = 0;
    this.failed = 0;
    this.inProgress = 0;
    this.queue = [];
    this.startTime = Date.now();
  }

  async generate() {
    console.log('🚀 MASSIVE BATCH GENERATOR');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`📊 Target: ${CONFIG.totalSatellites} satellites`);
    console.log(`⚡ Parallel workers: ${CONFIG.parallelWorkers}`);
    console.log(`📄 Pages per satellite: ${CONFIG.pagesPerSatellite}`);
    console.log('═══════════════════════════════════════════════════════\n');

    // Create queue
    for (let i = 1; i <= CONFIG.totalSatellites; i++) {
      const niche = CONFIG.niches[(i - 1) % CONFIG.niches.length];
      this.queue.push({
        id: i,
        niche,
        domain: `${niche}-sat-${i}-${Date.now()}`,
        pages: CONFIG.pagesPerSatellite
      });
    }

    // Start workers
    const workers = [];
    for (let i = 0; i < CONFIG.parallelWorkers; i++) {
      workers.push(this.worker(i + 1));
    }

    await Promise.all(workers);

    this.printSummary();
  }

  async worker(workerId) {
    while (this.queue.length > 0) {
      const task = this.queue.shift();
      if (!task) break;

      this.inProgress++;
      this.printProgress();

      try {
        await this.generateSatellite(workerId, task);
        this.completed++;
      } catch (error) {
        console.error(`\n❌ Worker ${workerId}: Failed satellite ${task.id}:`, error.message);
        this.failed++;
      } finally {
        this.inProgress--;
        this.printProgress();
      }
    }
  }

  async generateSatellite(workerId, task) {
    return new Promise((resolve, reject) => {
      const args = [
        'scripts/satellite-generator.js',
        '--niche', task.niche,
        '--pages', task.pages.toString(),
        '--domain', task.domain
      ];

      const child = spawn('node', args, {
        stdio: ['ignore', 'pipe', 'pipe']
      });

      let output = '';
      let errorOutput = '';

      child.stdout.on('data', (data) => {
        output += data.toString();
      });

      child.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          console.log(`\n✅ Worker ${workerId}: Completed satellite ${task.id} (${task.niche})`);
          resolve();
        } else {
          reject(new Error(`Exit code ${code}: ${errorOutput}`));
        }
      });

      child.on('error', (error) => {
        reject(error);
      });
    });
  }

  printProgress() {
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const total = CONFIG.totalSatellites;
    const done = this.completed + this.failed;
    const remaining = total - done;
    const progress = Math.floor((done / total) * 100);

    process.stdout.write(`\r📊 Progress: ${done}/${total} (${progress}%) | ✅ ${this.completed} | ❌ ${this.failed} | ⚡ ${this.inProgress} active | ⏱️ ${elapsed}s`);
  }

  printSummary() {
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;

    console.log('\n\n═══════════════════════════════════════════════════════');
    console.log('🎉 GENERATION COMPLETE');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`✅ Completed: ${this.completed}`);
    console.log(`❌ Failed: ${this.failed}`);
    console.log(`📄 Total pages: ${this.completed * CONFIG.pagesPerSatellite}`);
    console.log(`⏱️ Time: ${minutes}m ${seconds}s`);
    console.log(`⚡ Speed: ${(this.completed / (elapsed / 60)).toFixed(2)} satellites/min`);
    console.log('═══════════════════════════════════════════════════════\n');

    // Save results
    const results = {
      completed: this.completed,
      failed: this.failed,
      totalPages: this.completed * CONFIG.pagesPerSatellite,
      timeSeconds: elapsed,
      satellitesPerMinute: this.completed / (elapsed / 60)
    };

    fs.writeFileSync(
      path.join(__dirname, '..', 'massive-generation-results.json'),
      JSON.stringify(results, null, 2)
    );

    console.log('📝 Results saved to massive-generation-results.json\n');
  }
}

// Run
if (require.main === module) {
  const generator = new MassiveGenerator();
  generator.generate().catch(console.error);
}

module.exports = { MassiveGenerator };
