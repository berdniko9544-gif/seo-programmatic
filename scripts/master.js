#!/usr/bin/env node

/**
 * MASTER CONTROL SCRIPT
 * Управляет всем процессом: генерация → сборка → деплой → SEO
 *
 * Usage:
 *   node master.js --generate 20 --niche crypto --pages 500
 *   node master.js --migrate /path/to/satellites
 *   node master.js --deploy-only
 */

const { BatchGenerator } = require('./batch-generator');
const { BatchMigration } = require('./migrate-all');
const { BuildManager } = require('./build-all');
const { DeploymentManager } = require('./deploy-all');
const { SEOSubmissionManager } = require('./submit-to-search');

// ============================================================
// MASTER ORCHESTRATOR
// ============================================================

class MasterOrchestrator {
  constructor(options) {
    this.options = options;
  }

  async run() {
    console.log('🎯 MASTER CONTROL — Автоматизация сателлитов');
    console.log('═'.repeat(80));
    console.log('');

    const startTime = Date.now();

    try {
      // Режим 1: Генерация новых сателлитов
      if (this.options.generate) {
        await this.runGenerationPipeline();
      }

      // Режим 2: Миграция существующих сателлитов
      else if (this.options.migrate) {
        await this.runMigrationPipeline();
      }

      // Режим 3: Только деплой
      else if (this.options.deployOnly) {
        await this.runDeploymentPipeline();
      }

      // Режим 4: Полный цикл (генерация + сборка + деплой + SEO)
      else {
        await this.runFullPipeline();
      }

      const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(2);

      console.log('\n═'.repeat(80));
      console.log(`✅ Процесс завершён за ${duration} минут`);
      console.log('═'.repeat(80));
    } catch (error) {
      console.error('\n❌ Критическая ошибка:', error.message);
      process.exit(1);
    }
  }

  async runGenerationPipeline() {
    console.log('📦 ЭТАП 1: Генерация сателлитов');
    console.log('─'.repeat(80));

    const generator = new BatchGenerator({
      count: this.options.generate,
      niche: this.options.niche || 'random',
      pages: this.options.pages || 500,
    });

    await generator.generate();

    if (this.options.skipBuild) {
      console.log('\n⏭️ Сборка пропущена (--skip-build)');
      return;
    }

    await this.runBuildPipeline();

    if (this.options.skipDeploy) {
      console.log('\n⏭️ Деплой пропущен (--skip-deploy)');
      return;
    }

    await this.runDeploymentPipeline();

    if (this.options.skipSeo) {
      console.log('\n⏭️ SEO отправка пропущена (--skip-seo)');
      return;
    }

    await this.runSeoPipeline();
  }

  async runMigrationPipeline() {
    console.log('🔄 ЭТАП 1: Миграция существующих сателлитов');
    console.log('─'.repeat(80));

    const migration = new BatchMigration(this.options.migrate);
    await migration.migrateAll();

    if (this.options.skipBuild) {
      console.log('\n⏭️ Сборка пропущена (--skip-build)');
      return;
    }

    await this.runBuildPipeline();

    if (this.options.skipDeploy) {
      console.log('\n⏭️ Деплой пропущен (--skip-deploy)');
      return;
    }

    await this.runDeploymentPipeline();
  }

  async runBuildPipeline() {
    console.log('\n🔨 ЭТАП 2: Сборка всех сателлитов');
    console.log('─'.repeat(80));

    const builder = new BuildManager();
    await builder.buildAll();
  }

  async runDeploymentPipeline() {
    console.log('\n☁️ ЭТАП 3: Деплой на Cloudflare Workers');
    console.log('─'.repeat(80));

    const deployer = new DeploymentManager();
    await deployer.deployAll();
  }

  async runSeoPipeline() {
    console.log('\n🔍 ЭТАП 4: Отправка в поисковики');
    console.log('─'.repeat(80));

    const seo = new SEOSubmissionManager();
    await seo.submitAll();
  }

  async runFullPipeline() {
    await this.runGenerationPipeline();
  }
}

// ============================================================
// CLI
// ============================================================

function parseArgs() {
  const args = process.argv.slice(2);

  const options = {
    generate: null,
    migrate: null,
    deployOnly: false,
    niche: 'random',
    pages: 500,
    skipBuild: false,
    skipDeploy: false,
    skipSeo: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--generate' && args[i + 1]) {
      options.generate = parseInt(args[i + 1], 10);
      i++;
    } else if (arg === '--migrate' && args[i + 1]) {
      options.migrate = args[i + 1];
      i++;
    } else if (arg === '--deploy-only') {
      options.deployOnly = true;
    } else if (arg === '--niche' && args[i + 1]) {
      options.niche = args[i + 1];
      i++;
    } else if (arg === '--pages' && args[i + 1]) {
      options.pages = parseInt(args[i + 1], 10);
      i++;
    } else if (arg === '--skip-build') {
      options.skipBuild = true;
    } else if (arg === '--skip-deploy') {
      options.skipDeploy = true;
    } else if (arg === '--skip-seo') {
      options.skipSeo = true;
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }
  }

  return options;
}

function printHelp() {
  console.log(`
🎯 MASTER CONTROL — Автоматизация сателлитов

ИСПОЛЬЗОВАНИЕ:
  node master.js [опции]

РЕЖИМЫ РАБОТЫ:

  1. Генерация новых сателлитов:
     node master.js --generate 20 --niche crypto --pages 500

  2. Миграция существующих сателлитов:
     node master.js --migrate /path/to/satellites

  3. Только деплой (без генерации):
     node master.js --deploy-only

ОПЦИИ:

  --generate N          Создать N новых сателлитов
  --migrate PATH        Мигрировать существующие сателлиты
  --deploy-only         Только деплой (без генерации)

  --niche NAME          Ниша (crypto, fitness, education, realestate, random)
  --pages N             Целевое количество страниц (по умолчанию: 500)

  --skip-build          Пропустить сборку
  --skip-deploy         Пропустить деплой
  --skip-seo            Пропустить отправку в поисковики

  --help, -h            Показать эту справку

ПРИМЕРЫ:

  # Создать 20 сателлитов по криптовалютам с 1000 страниц каждый
  node master.js --generate 20 --niche crypto --pages 1000

  # Мигрировать существующие сателлиты и задеплоить
  node master.js --migrate ~/projects/old-satellites

  # Только деплой уже собранных сателлитов
  node master.js --deploy-only

  # Создать 5 сателлитов, но не деплоить
  node master.js --generate 5 --skip-deploy

ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ:

  CLOUDFLARE_API_TOKEN      API Token Cloudflare (wrangler deploy)
  CLOUDFLARE_ACCOUNT_ID     Account ID Cloudflare
  SATELLITE_PARENT_DOMAIN   Домен для сателлитов (например: sat.example.com)
  YANDEX_WEBMASTER_TOKEN    Токен Яндекс Вебмастер
  YANDEX_USER_ID            ID пользователя Яндекс
  GOOGLE_INDEXING_API_KEY   API ключ Google Indexing

ДОКУМЕНТАЦИЯ:
  См. AUTOMATION.md для подробной информации
`);
}

async function main() {
  const options = parseArgs();

  if (!options.generate && !options.migrate && !options.deployOnly) {
    console.error('❌ Укажите режим работы: --generate, --migrate или --deploy-only');
    console.log('Используйте --help для справки');
    process.exit(1);
  }

  const orchestrator = new MasterOrchestrator(options);
  await orchestrator.run();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { MasterOrchestrator };
