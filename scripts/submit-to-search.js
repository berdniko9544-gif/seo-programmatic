#!/usr/bin/env node

/**
 * SEO SUBMISSION SCRIPT
 * Автоматически отправляет URL в Google и Яндекс для индексации
 *
 * Usage: node submit-to-search.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// ============================================================
// CONFIGURATION
// ============================================================

const CONFIG = {
  satellitesDir: path.join(process.cwd(), 'satellites'),
  urlsFile: path.join(process.cwd(), 'satellites', 'urls.txt'),
  logFile: path.join(process.cwd(), 'satellites', 'seo-submission-log.json'),

  // Google Indexing API
  googleApiKey: process.env.GOOGLE_INDEXING_API_KEY,
  googleServiceAccount: process.env.GOOGLE_SERVICE_ACCOUNT_JSON,

  // Yandex Webmaster API
  yandexToken: process.env.YANDEX_WEBMASTER_TOKEN,
  yandexUserId: process.env.YANDEX_USER_ID,
};

// ============================================================
// SEO SUBMISSION MANAGER
// ============================================================

class SEOSubmissionManager {
  constructor() {
    this.results = [];
  }

  async submitAll() {
    console.log('🔍 Автоматическая отправка URL в поисковики');
    console.log('');

    // Читаем список URL
    const urls = this.readURLs();

    if (urls.length === 0) {
      console.log('📭 Нет URL для отправки');
      console.log('Сначала задеплойте сателлиты: node scripts/deploy-all.js');
      return;
    }

    console.log(`📊 Найдено URL: ${urls.length}`);
    console.log('');

    const startTime = Date.now();

    // Для каждого URL отправляем sitemap
    for (let i = 0; i < urls.length; i++) {
      await this.submitSite(urls[i], i + 1, urls.length);
    }

    const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(2);

    console.log('\n✅ Отправка завершена!');
    console.log(`⏱️ Время: ${duration} минут`);
    console.log(`📊 Успешно: ${this.results.filter(r => r.success).length}/${urls.length}`);

    // Сохраняем лог
    this.saveLog();

    // Выводим инструкции
    this.printInstructions();
  }

  readURLs() {
    if (!fs.existsSync(CONFIG.urlsFile)) {
      return [];
    }

    const content = fs.readFileSync(CONFIG.urlsFile, 'utf8');
    return content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && line.startsWith('http'));
  }

  async submitSite(url, index, total) {
    console.log(`\n[${index}/${total}] 🔍 Отправка: ${url}`);

    const sitemapUrl = `${url}/sitemap.xml`;
    const result = {
      url,
      sitemapUrl,
      google: { success: false, method: 'manual' },
      yandex: { success: false, method: 'manual' },
      timestamp: new Date().toISOString(),
    };

    // Google Search Console
    console.log('  📍 Google Search Console...');
    if (CONFIG.googleApiKey || CONFIG.googleServiceAccount) {
      try {
        await this.submitToGoogle(sitemapUrl);
        result.google = { success: true, method: 'api' };
        console.log('  ✅ Google: отправлено через API');
      } catch (error) {
        result.google = { success: false, method: 'api', error: error.message };
        console.log('  ⚠️ Google: ошибка API, требуется ручная отправка');
      }
    } else {
      console.log('  ℹ️ Google: требуется ручная отправка (нет API ключа)');
    }

    // Yandex Webmaster
    console.log('  📍 Яндекс Вебмастер...');
    if (CONFIG.yandexToken && CONFIG.yandexUserId) {
      try {
        await this.submitToYandex(url, sitemapUrl);
        result.yandex = { success: true, method: 'api' };
        console.log('  ✅ Яндекс: отправлено через API');
      } catch (error) {
        result.yandex = { success: false, method: 'api', error: error.message };
        console.log('  ⚠️ Яндекс: ошибка API, требуется ручная отправка');
      }
    } else {
      console.log('  ℹ️ Яндекс: требуется ручная отправка (нет токена)');
    }

    result.success = result.google.success || result.yandex.success;
    this.results.push(result);
  }

  async submitToGoogle(sitemapUrl) {
    // Google Indexing API имеет лимиты и требует OAuth2
    // Для массовой отправки лучше использовать Search Console вручную
    throw new Error('Google Indexing API требует настройки OAuth2');
  }

  async submitToYandex(siteUrl, sitemapUrl) {
    // Yandex Webmaster API
    // Note: sitemap endpoints expect host_id (not hostname).

    const normalizedSiteUrl = siteUrl.replace(/\/$/, '');

    // 1) Ensure host exists and get host_id
    const hostId = await this.ensureYandexHost(normalizedSiteUrl);

    // 2) Add sitemap for that host
    await this.yandexRequest('POST', `/user/${CONFIG.yandexUserId}/hosts/${encodeURIComponent(hostId)}/sitemaps`, {
      url: sitemapUrl,
    });
  }

  async ensureYandexHost(siteUrl) {
    // Try to add host first (idempotent-ish).
    try {
      const created = await this.yandexRequest('POST', `/user/${CONFIG.yandexUserId}/hosts`, {
        host_url: siteUrl,
      });

      // Typical response contains host_id.
      if (created && (created.host_id || created.hostId)) {
        return created.host_id || created.hostId;
      }
    } catch (e) {
      // If already exists or cannot be added, we'll try to find it below.
      // Common cases: 409 conflict, 403 needs verification, etc.
    }

    // Fallback: list hosts and find matching host_url
    const list = await this.yandexRequest('GET', `/user/${CONFIG.yandexUserId}/hosts`);
    const hosts = list?.hosts || list?.data || [];

    const found = hosts.find(h => {
      const url = (h.host_url || h.hostUrl || '').replace(/\/$/, '');
      return url === siteUrl;
    });

    const hostId = found?.host_id || found?.hostId;
    if (!hostId) {
      throw new Error('Yandex: host_id not found for ' + siteUrl + '. Возможно сайт не добавлен/не подтвержден в Вебмастере.');
    }

    return hostId;
  }

  yandexRequest(method, path, body = null) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.webmaster.yandex.net',
        port: 443,
        path: `/v4${path}`,
        method,
        headers: {
          'Authorization': `OAuth ${CONFIG.yandexToken}`,
          'Content-Type': 'application/json',
        },
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(JSON.parse(data || '{}'));
          } else {
            reject(new Error(`Yandex API error: ${res.statusCode} ${data}`));
          }
        });
      });

      req.on('error', reject);

      if (body) {
        req.write(JSON.stringify(body));
      }

      req.end();
    });
  }

  saveLog() {
    const log = {
      timestamp: new Date().toISOString(),
      results: this.results,
    };

    fs.writeFileSync(CONFIG.logFile, JSON.stringify(log, null, 2));
    console.log(`\n📝 Лог сохранён: ${CONFIG.logFile}`);
  }

  printInstructions() {
    console.log('\n📋 Инструкции по ручной отправке:');
    console.log('═'.repeat(80));

    console.log('\n🔍 Google Search Console:');
    console.log('1. Откройте: https://search.google.com/search-console');
    console.log('2. Добавьте каждый сайт');
    console.log('3. Перейдите в "Файлы Sitemap"');
    console.log('4. Добавьте sitemap.xml для каждого сайта');
    console.log('');
    console.log('Список sitemap:');
    this.results.forEach((result, idx) => {
      console.log(`   ${idx + 1}. ${result.sitemapUrl}`);
    });

    console.log('\n🔍 Яндекс Вебмастер:');
    console.log('1. Откройте: https://webmaster.yandex.ru');
    console.log('2. Добавьте каждый сайт');
    console.log('3. Перейдите в "Индексирование" → "Файлы Sitemap"');
    console.log('4. Добавьте sitemap.xml для каждого сайта');

    console.log('\n💡 Совет:');
    console.log('Для автоматизации настройте API ключи:');
    console.log('  export YANDEX_WEBMASTER_TOKEN=your_token');
    console.log('  export YANDEX_USER_ID=your_user_id');
    console.log('');
    console.log('Получить токен: https://oauth.yandex.ru/');
    console.log('═'.repeat(80));
  }
}

// ============================================================
// CLI
// ============================================================

async function main() {
  const manager = new SEOSubmissionManager();
  await manager.submitAll();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { SEOSubmissionManager };
