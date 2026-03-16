#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Cross-Satellite Linking Network Generator
 * Creates mesh network configuration for all satellites
 */

class SatelliteNetworkBuilder {
  constructor() {
    this.satellites = [];
    this.nicheRelevance = {
      'copywriting': ['marketing', 'business', 'freelance'],
      'design': ['video', 'marketing', 'business'],
      'automation': ['business', 'marketing', 'education'],
      'marketing': ['copywriting', 'business', 'automation'],
      'video': ['design', 'marketing', 'education'],
      'business': ['marketing', 'automation', 'freelance'],
      'freelance': ['copywriting', 'business', 'marketing'],
      'education': ['automation', 'business', 'video']
    };
  }

  loadSatellites() {
    const urlsFile = path.join(__dirname, '../satellites/vercel-urls.txt');
    const content = fs.readFileSync(urlsFile, 'utf-8');
    
    this.satellites = content
      .split('\n')
      .filter(line => line.trim() && line.startsWith('https://'))
      .map(url => {
        const match = url.match(/seo-sat-ai-(\w+)-/);
        const niche = match ? match[1] : 'unknown';
        return { url: url.trim(), niche };
      });

    console.log(`✅ Loaded ${this.satellites.length} satellites`);
  }

  calculateRelevanceScore(niche1, niche2) {
    if (niche1 === niche2) return 10;
    if (this.nicheRelevance[niche1]?.includes(niche2)) return 7;
    return 3;
  }

  generateNetworkForSatellite(satellite, index) {
    const otherSatellites = this.satellites.filter((_, i) => i !== index);
    
    // Score and sort by relevance
    const scored = otherSatellites.map(other => ({
      ...other,
      score: this.calculateRelevanceScore(satellite.niche, other.niche)
    }));

    scored.sort((a, b) => b.score - a.score);

    // Select top 6 links
    const links = scored.slice(0, 6).map(s => ({
      url: s.url,
      niche: s.niche,
      relevance: s.score
    }));

    return {
      satelliteUrl: satellite.url,
      niche: satellite.niche,
      crossLinks: links,
      generatedAt: new Date().toISOString()
    };
  }

  generateAllNetworks() {
    const networks = this.satellites.map((sat, idx) => 
      this.generateNetworkForSatellite(sat, idx)
    );

    console.log(`✅ Generated network configs for ${networks.length} satellites`);
    return networks;
  }

  saveNetworkConfigs(networks) {
    const satellitesDir = path.join(__dirname, '../satellites');
    
    networks.forEach((network, idx) => {
      const satDirs = fs.readdirSync(satellitesDir)
        .filter(name => (name.startsWith('ai-') || name.startsWith('demo-') || name.startsWith('local-') || name.startsWith('test-')) &&
                fs.statSync(path.join(satellitesDir, name)).isDirectory());

      if (satDirs[idx]) {
        const configPath = path.join(satellitesDir, satDirs[idx], 'satellite-network.json');
        fs.writeFileSync(configPath, JSON.stringify(network, null, 2));
        console.log(`  ✓ ${satDirs[idx]}/satellite-network.json`);
      }
    });
  }

  saveMasterConfig(networks) {
    const masterConfig = {
      totalSatellites: networks.length,
      generatedAt: new Date().toISOString(),
      networks: networks.map(n => ({
        url: n.satelliteUrl,
        niche: n.niche,
        linksCount: n.crossLinks.length
      }))
    };

    const masterPath = path.join(__dirname, '../satellites/network-master.json');
    fs.writeFileSync(masterPath, JSON.stringify(masterConfig, null, 2));
    console.log(`\n✅ Master config saved: satellites/network-master.json`);
  }

  printStats(networks) {
    console.log('\n📊 Network Statistics:');
    console.log(`   Total satellites: ${networks.length}`);
    console.log(`   Links per satellite: 6`);
    console.log(`   Total cross-links: ${networks.length * 6}`);
    
    const nicheCount = {};
    networks.forEach(n => {
      nicheCount[n.niche] = (nicheCount[n.niche] || 0) + 1;
    });
    
    console.log('\n   Satellites by niche:');
    Object.entries(nicheCount).forEach(([niche, count]) => {
      console.log(`     ${niche}: ${count}`);
    });
  }

  run() {
    console.log('🔗 Cross-Satellite Linking Network Generator\n');
    
    this.loadSatellites();
    const networks = this.generateAllNetworks();
    this.saveNetworkConfigs(networks);
    this.saveMasterConfig(networks);
    this.printStats(networks);
    
    console.log('\n✅ Network generation complete!');
    console.log('💡 Next: Redeploy satellites to activate cross-linking');
  }
}

const builder = new SatelliteNetworkBuilder();
builder.run();
