/**
 * IndexNow API Integration
 * Instant indexing for Yandex and Bing (0-5 minutes vs 1-14 days)
 */

class IndexNowClient {
  constructor() {
    // Generate or use existing API key
    this.apiKey = process.env.INDEXNOW_KEY || this.generateKey();
    this.endpoints = {
      yandex: 'https://yandex.com/indexnow',
      bing: 'https://www.bing.com/indexnow'
    };
  }

  generateKey() {
    // Generate 32-character hex key
    return Array.from({ length: 32 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }

  async submitUrl(url, host) {
    const payload = {
      host: host || new URL(url).hostname,
      key: this.apiKey,
      keyLocation: `https://${host || new URL(url).hostname}/${this.apiKey}.txt`,
      urlList: [url]
    };

    const results = await Promise.allSettled([
      this.submitToYandex(payload),
      this.submitToBing(payload)
    ]);

    return {
      url,
      yandex: results[0].status === 'fulfilled' ? results[0].value : results[0].reason,
      bing: results[1].status === 'fulfilled' ? results[1].value : results[1].reason
    };
  }

  async submitUrls(urls, host) {
    const payload = {
      host: host || new URL(urls[0]).hostname,
      key: this.apiKey,
      keyLocation: `https://${host || new URL(urls[0]).hostname}/${this.apiKey}.txt`,
      urlList: urls
    };

    const results = await Promise.allSettled([
      this.submitToYandex(payload),
      this.submitToBing(payload)
    ]);

    return {
      urls: urls.length,
      yandex: results[0].status === 'fulfilled' ? results[0].value : results[0].reason,
      bing: results[1].status === 'fulfilled' ? results[1].value : results[1].reason
    };
  }

  async submitToYandex(payload) {
    try {
      const response = await fetch(this.endpoints.yandex, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        return { success: true, status: response.status };
      }

      return { 
        success: false, 
        status: response.status, 
        error: await response.text() 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async submitToBing(payload) {
    try {
      const response = await fetch(this.endpoints.bing, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        return { success: true, status: response.status };
      }

      return { 
        success: false, 
        status: response.status, 
        error: await response.text() 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  getKeyFileContent() {
    return this.apiKey;
  }

  getApiKey() {
    return this.apiKey;
  }
}

module.exports = IndexNowClient;
