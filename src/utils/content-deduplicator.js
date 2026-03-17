/**
 * CONTENT DEDUPLICATOR
 * Prevents duplicate content across satellites
 */

const crypto = require('crypto');

class ContentDeduplicator {
  constructor() {
    // Map of domain -> Set of content hashes
    this.contentHashes = new Map();
    // Map of hash -> metadata for debugging
    this.hashMetadata = new Map();
  }

  /**
   * Check if content is duplicate
   * @param {string} content - Content to check
   * @param {string} domain - Domain/satellite identifier
   * @returns {boolean} True if duplicate, false if unique
   */
  checkDuplicate(content, domain) {
    if (!content || typeof content !== 'string') {
      return false;
    }

    const hash = this.hashContent(content);

    if (!this.contentHashes.has(domain)) {
      this.contentHashes.set(domain, new Set());
    }

    const domainHashes = this.contentHashes.get(domain);

    if (domainHashes.has(hash)) {
      return true; // Duplicate found
    }

    // Store hash and metadata
    domainHashes.add(hash);
    this.hashMetadata.set(hash, {
      domain,
      length: content.length,
      preview: content.substring(0, 100),
      timestamp: new Date().toISOString()
    });

    return false; // Unique content
  }

  /**
   * Check similarity between two pieces of content
   * @param {string} content1 - First content
   * @param {string} content2 - Second content
   * @returns {number} Similarity score (0-1)
   */
  checkSimilarity(content1, content2) {
    if (!content1 || !content2) return 0;

    // Simple word-based similarity
    const words1 = new Set(content1.toLowerCase().split(/\s+/));
    const words2 = new Set(content2.toLowerCase().split(/\s+/));

    const intersection = new Set([...words1].filter(w => words2.has(w)));
    const union = new Set([...words1, ...words2]);

    return intersection.size / union.size;
  }

  /**
   * Hash content for deduplication
   * @param {string} content - Content to hash
   * @returns {string} SHA-256 hash
   */
  hashContent(content) {
    return crypto
      .createHash('sha256')
      .update(content.trim().toLowerCase())
      .digest('hex');
  }

  /**
   * Get statistics
   * @returns {object} Deduplication statistics
   */
  getStats() {
    const stats = {
      totalDomains: this.contentHashes.size,
      totalHashes: this.hashMetadata.size,
      domainStats: {}
    };

    this.contentHashes.forEach((hashes, domain) => {
      stats.domainStats[domain] = {
        uniqueContent: hashes.size
      };
    });

    return stats;
  }

  /**
   * Clear all stored hashes
   */
  clear() {
    this.contentHashes.clear();
    this.hashMetadata.clear();
  }

  /**
   * Clear hashes for specific domain
   * @param {string} domain - Domain to clear
   */
  clearDomain(domain) {
    if (this.contentHashes.has(domain)) {
      const hashes = this.contentHashes.get(domain);
      hashes.forEach(hash => this.hashMetadata.delete(hash));
      this.contentHashes.delete(domain);
    }
  }
}

module.exports = { ContentDeduplicator };
