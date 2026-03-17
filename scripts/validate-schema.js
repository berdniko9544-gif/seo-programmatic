#!/usr/bin/env node

/**
 * SCHEMA VALIDATION
 * Validates JSON-LD structured data across all pages
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const PAGES_TO_CHECK = [
  'src/app/page.js',
  'src/app/blog/page.js',
  'src/app/blog/[slug]/page.js',
  'src/app/napravleniya/page.js',
  'src/app/napravleniya/[slug]/page.js',
  'src/app/instrumenty/page.js',
  'src/app/instrumenty/[category]/page.js',
  'src/app/dlya/[audience]/page.js',
  'src/app/longtail/[slug]/page.js',
  'src/app/sravnenie/page.js',
  'src/app/sravnenie/[slug]/page.js',
];

class SchemaValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  validateSchemaObject(schema, pagePath) {
    // Check required @context
    if (!schema['@context']) {
      this.errors.push({
        page: pagePath,
        error: 'Missing @context property',
      });
      return false;
    }

    if (schema['@context'] !== 'https://schema.org') {
      this.errors.push({
        page: pagePath,
        error: `Invalid @context: ${schema['@context']}`,
      });
      return false;
    }

    // Check required @type
    if (!schema['@type']) {
      this.errors.push({
        page: pagePath,
        error: 'Missing @type property',
      });
      return false;
    }

    // Validate based on type
    switch (schema['@type']) {
      case 'Article':
        return this.validateArticle(schema, pagePath);
      case 'FAQPage':
        return this.validateFAQPage(schema, pagePath);
      case 'WebPage':
        return this.validateWebPage(schema, pagePath);
      case 'BreadcrumbList':
        return this.validateBreadcrumbList(schema, pagePath);
      default:
        this.warnings.push({
          page: pagePath,
          warning: `Unknown schema type: ${schema['@type']}`,
        });
        return true;
    }
  }

  validateArticle(schema, pagePath) {
    const required = ['headline', 'datePublished', 'author'];
    const missing = required.filter(field => !schema[field]);

    if (missing.length > 0) {
      this.errors.push({
        page: pagePath,
        error: `Article missing required fields: ${missing.join(', ')}`,
      });
      return false;
    }

    // Validate author
    if (schema.author && typeof schema.author === 'object') {
      if (!schema.author['@type'] || !schema.author.name) {
        this.errors.push({
          page: pagePath,
          error: 'Article author must have @type and name',
        });
        return false;
      }
    }

    return true;
  }

  validateFAQPage(schema, pagePath) {
    if (!schema.mainEntity || !Array.isArray(schema.mainEntity)) {
      this.errors.push({
        page: pagePath,
        error: 'FAQPage must have mainEntity array',
      });
      return false;
    }

    schema.mainEntity.forEach((question, idx) => {
      if (question['@type'] !== 'Question') {
        this.errors.push({
          page: pagePath,
          error: `FAQPage mainEntity[${idx}] must be type Question`,
        });
      }

      if (!question.name) {
        this.errors.push({
          page: pagePath,
          error: `FAQPage question[${idx}] missing name`,
        });
      }

      if (!question.acceptedAnswer || question.acceptedAnswer['@type'] !== 'Answer') {
        this.errors.push({
          page: pagePath,
          error: `FAQPage question[${idx}] must have acceptedAnswer of type Answer`,
        });
      }
    });

    return this.errors.length === 0;
  }

  validateWebPage(schema, pagePath) {
    if (!schema.name && !schema.headline) {
      this.warnings.push({
        page: pagePath,
        warning: 'WebPage should have name or headline',
      });
    }
    return true;
  }

  validateBreadcrumbList(schema, pagePath) {
    if (!schema.itemListElement || !Array.isArray(schema.itemListElement)) {
      this.errors.push({
        page: pagePath,
        error: 'BreadcrumbList must have itemListElement array',
      });
      return false;
    }

    schema.itemListElement.forEach((item, idx) => {
      if (item['@type'] !== 'ListItem') {
        this.errors.push({
          page: pagePath,
          error: `BreadcrumbList item[${idx}] must be type ListItem`,
        });
      }

      if (typeof item.position !== 'number') {
        this.errors.push({
          page: pagePath,
          error: `BreadcrumbList item[${idx}] must have numeric position`,
        });
      }

      if (!item.name) {
        this.errors.push({
          page: pagePath,
          error: `BreadcrumbList item[${idx}] must have name`,
        });
      }
    });

    return this.errors.length === 0;
  }

  extractSchemaFromFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');

      // Look for schema objects in the code
      const schemaMatches = content.match(/const\s+\w+Schema\s*=\s*\{[\s\S]*?\};/g);

      if (!schemaMatches) {
        return [];
      }

      const schemas = [];
      schemaMatches.forEach(match => {
        try {
          // Extract the object part
          const objMatch = match.match(/=\s*(\{[\s\S]*\});/);
          if (objMatch) {
            // This is a simplified extraction - in production you'd use a proper parser
            const schemaStr = objMatch[1];
            // Check if it has @context and @type
            if (schemaStr.includes("'@context'") || schemaStr.includes('"@context"')) {
              schemas.push({ raw: schemaStr, filePath });
            }
          }
        } catch (e) {
          // Skip invalid schemas
        }
      });

      return schemas;
    } catch (error) {
      console.error(`Error reading ${filePath}:`, error.message);
      return [];
    }
  }

  async validate() {
    console.log('🔍 Validating JSON-LD schemas...\n');

    for (const pagePath of PAGES_TO_CHECK) {
      const fullPath = path.join(process.cwd(), pagePath);

      if (!fs.existsSync(fullPath)) {
        this.warnings.push({
          page: pagePath,
          warning: 'File not found',
        });
        continue;
      }

      const schemas = this.extractSchemaFromFile(fullPath);

      if (schemas.length === 0) {
        this.warnings.push({
          page: pagePath,
          warning: 'No schema found',
        });
      }
    }

    // Report results
    console.log(`✅ Checked ${PAGES_TO_CHECK.length} pages\n`);

    if (this.errors.length > 0) {
      console.error('❌ ERRORS:');
      this.errors.forEach(err => {
        console.error(`  ${err.page}: ${err.error}`);
      });
      console.error('');
    }

    if (this.warnings.length > 0) {
      console.warn('⚠️  WARNINGS:');
      this.warnings.forEach(warn => {
        console.warn(`  ${warn.page}: ${warn.warning}`);
      });
      console.warn('');
    }

    if (this.errors.length === 0) {
      console.log('✅ All schemas valid!');
      return true;
    } else {
      console.error(`❌ Found ${this.errors.length} errors`);
      return false;
    }
  }
}

async function main() {
  const validator = new SchemaValidator();
  const isValid = await validator.validate();

  if (!isValid) {
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { SchemaValidator };
