import fs from 'node:fs';
import path from 'node:path';
import { IS_SATELLITE } from '@/config/site';

let cachedNetwork = null;

/**
 * Load satellite network configuration
 * Cached at module initialization to avoid blocking rendering
 */
export function getSatelliteNetwork() {
  if (!IS_SATELLITE) {
    return null;
  }

  if (cachedNetwork !== null) {
    return cachedNetwork;
  }

  try {
    const networkPath = path.join(process.cwd(), 'satellite-network.json');
    if (!fs.existsSync(networkPath)) {
      cachedNetwork = null;
      return null;
    }

    cachedNetwork = JSON.parse(fs.readFileSync(networkPath, 'utf8'));
    return cachedNetwork;
  } catch (error) {
    console.error('Failed to load satellite network:', error);
    cachedNetwork = null;
    return null;
  }
}

/**
 * Clear cache (useful for testing)
 */
export function clearNetworkCache() {
  cachedNetwork = null;
}
