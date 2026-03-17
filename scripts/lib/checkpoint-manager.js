#!/usr/bin/env node

/**
 * CHECKPOINT MANAGER
 * Manages checkpoints for partial failure recovery
 */

const fs = require('fs');
const path = require('path');

class CheckpointManager {
  constructor(checkpointFile = 'logs/generation-checkpoint.json') {
    this.checkpointFile = path.join(process.cwd(), checkpointFile);
    this.maxAge = 24 * 60 * 60 * 1000; // 24 hours
  }

  /**
   * Load checkpoint if it exists and is not expired
   * @returns {object|null} Checkpoint data or null
   */
  load() {
    try {
      if (!fs.existsSync(this.checkpointFile)) {
        return null;
      }

      const data = JSON.parse(fs.readFileSync(this.checkpointFile, 'utf8'));

      // Check if checkpoint is expired
      if (Date.now() - data.timestamp > this.maxAge) {
        console.log('⏰ Checkpoint expired, starting from beginning');
        this.clear();
        return null;
      }

      console.log(`📍 Checkpoint found: resuming from satellite ${data.lastSuccessful + 1}`);
      return data;
    } catch (error) {
      console.error('❌ Error loading checkpoint:', error.message);
      return null;
    }
  }

  /**
   * Save checkpoint
   * @param {object} data - Checkpoint data
   */
  save(data) {
    try {
      const checkpoint = {
        ...data,
        timestamp: Date.now(),
      };

      // Ensure logs directory exists
      const logsDir = path.dirname(this.checkpointFile);
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }

      fs.writeFileSync(this.checkpointFile, JSON.stringify(checkpoint, null, 2));
    } catch (error) {
      console.error('❌ Error saving checkpoint:', error.message);
    }
  }

  /**
   * Clear checkpoint
   */
  clear() {
    try {
      if (fs.existsSync(this.checkpointFile)) {
        fs.unlinkSync(this.checkpointFile);
        console.log('🗑️  Checkpoint cleared');
      }
    } catch (error) {
      console.error('❌ Error clearing checkpoint:', error.message);
    }
  }

  /**
   * Get checkpoint status
   * @returns {object} Status information
   */
  getStatus() {
    const checkpoint = this.load();
    if (!checkpoint) {
      return { exists: false };
    }

    return {
      exists: true,
      lastSuccessful: checkpoint.lastSuccessful,
      timestamp: new Date(checkpoint.timestamp).toISOString(),
      age: Date.now() - checkpoint.timestamp,
    };
  }
}

module.exports = { CheckpointManager };
