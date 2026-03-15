import { render, screen } from '@testing-library/react';
import { generateSEOMetadata, generateJSONLD } from '../seo-metadata';

describe('SEO Metadata Utils', () => {
  describe('generateSEOMetadata', () => {
    it('should generate basic metadata', () => {
      const metadata = generateSEOMetadata({
        title: 'Test Page',
        description: 'Test description',
        url: '/test',
      });

      expect(metadata.title).toBe('Test Page');
      expect(metadata.description).toBe('Test description');
    });

    it('should generate Open Graph metadata', () => {
      const metadata = generateSEOMetadata({
        title: 'Test Page',
        description: 'Test description',
        url: '/test',
        image: '/test-image.jpg',
      });

      expect(metadata.openGraph).toBeDefined();
      expect(metadata.openGraph?.title).toBe('Test Page');
      expect(metadata.openGraph?.description).toBe('Test description');
    });

    it('should generate Twitter Card metadata', () => {
      const metadata = generateSEOMetadata({
        title: 'Test Page',
        description: 'Test description',
        url: '/test',
      });

      expect(metadata.twitter).toBeDefined();
      expect(metadata.twitter?.card).toBe('summary_large_image');
      expect(metadata.twitter?.title).toBe('Test Page');
    });

    it('should handle keywords array', () => {
      const metadata = generateSEOMetadata({
        title: 'Test Page',
        description: 'Test description',
        url: '/test',
        keywords: ['seo', 'test', 'keywords'],
      });

      expect(metadata.keywords).toBe('seo, test, keywords');
    });

    it('should support absolute images and article timestamps', () => {
      const metadata = generateSEOMetadata({
        title: 'Article Page',
        description: 'Article description',
        url: '/article',
        image: 'https://cdn.example.com/og.jpg',
        type: 'article',
        publishedTime: '2026-03-15T00:00:00.000Z',
        modifiedTime: '2026-03-16T00:00:00.000Z',
        author: '1MB3',
      });

      expect(metadata.openGraph?.images?.[0]?.url).toBe('https://cdn.example.com/og.jpg');
      expect(metadata.openGraph?.type).toBe('article');
      expect(metadata.openGraph?.publishedTime).toBe('2026-03-15T00:00:00.000Z');
      expect(metadata.openGraph?.modifiedTime).toBe('2026-03-16T00:00:00.000Z');
      expect(metadata.authors).toEqual([{ name: '1MB3' }]);
    });
  });

  describe('generateJSONLD', () => {
    it('should generate WebSite schema', () => {
      const schema = generateJSONLD({
        type: 'WebSite',
        name: 'Test Site',
        description: 'Test description',
      });

      expect(schema['@type']).toBe('WebSite');
      expect(schema.name).toBe('Test Site');
      expect(schema.potentialAction).toBeDefined();
    });

    it('should generate Article schema', () => {
      const schema = generateJSONLD({
        type: 'Article',
        headline: 'Test Article',
        description: 'Test description',
        url: '/article',
        datePublished: '2024-01-01',
        author: 'Test Author',
      });

      expect(schema['@type']).toBe('Article');
      expect(schema.headline).toBe('Test Article');
      expect(schema.author).toBeDefined();
    });

    it('should generate BreadcrumbList schema', () => {
      const schema = generateJSONLD({
        type: 'BreadcrumbList',
        items: [
          { name: 'Home', url: '/' },
          { name: 'Category', url: '/category' },
        ],
      });

      expect(schema['@type']).toBe('BreadcrumbList');
      expect(schema.itemListElement).toHaveLength(2);
    });

    it('should generate Organization schema with explicit logo', () => {
      const schema = generateJSONLD({
        type: 'Organization',
        name: '1MB3',
        description: 'AI hub',
        logo: '/brand/logo.svg',
      });

      expect(schema['@type']).toBe('Organization');
      expect(schema.logo).toContain('/brand/logo.svg');
    });

    it('should fall back to the site name for article author', () => {
      const schema = generateJSONLD({
        type: 'Article',
        headline: 'Fallback author article',
        description: 'Article without explicit author',
        url: '/article/fallback',
        datePublished: '2026-03-15',
      });

      expect(schema['@type']).toBe('Article');
      expect(schema.author).toEqual({
        '@type': 'Person',
        name: 'SEO Programmatic',
      });
    });
  });
});
