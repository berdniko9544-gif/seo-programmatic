/**
 * SEARCH ENGINE PING
 * Notify search engines about new content
 */

const https = require('https');
const http = require('http');

class SearchEnginePing {
  /**
   * Ping all search engines
   */
  async pingAll(sitemapUrl) {
    const results = await Promise.allSettled([
      this.pingGoogle(sitemapUrl),
      this.pingBing(sitemapUrl),
      this.pingYandex(sitemapUrl),
    ]);

    return results.map((result, index) => ({
      engine: ['Google', 'Bing', 'Yandex'][index],
      success: result.status === 'fulfilled',
      error: result.status === 'rejected' ? result.reason : null,
    }));
  }

  /**
   * Ping Google
   */
  pingGoogle(sitemapUrl) {
    const url = `http://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    return this.makeRequest(url);
  }

  /**
   * Ping Bing
   */
  pingBing(sitemapUrl) {
    const url = `http://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    return this.makeRequest(url);
  }

  /**
   * Ping Yandex
   */
  pingYandex(sitemapUrl) {
    const url = `http://webmaster.yandex.ru/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    return this.makeRequest(url);
  }

  /**
   * Make HTTP request
   */
  makeRequest(url) {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https') ? https : http;

      const req = protocol.get(url, (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ statusCode: res.statusCode });
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });

      req.on('error', reject);
      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Timeout'));
      });
    });
  }
}

module.exports = { SearchEnginePing };
