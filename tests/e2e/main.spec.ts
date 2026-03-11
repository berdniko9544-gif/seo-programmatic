import { test, expect } from '@playwright/test';

test.describe('Main Site', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/SEO/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');

    // Check navigation links
    const navLinks = page.locator('nav a');
    await expect(navLinks).toHaveCount(4, { timeout: 5000 });
  });

  test('should have valid sitemap', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);

    const content = await page.content();
    expect(content).toContain('<?xml version="1.0"');
    expect(content).toContain('<urlset');
  });

  test('should have valid robots.txt', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response?.status()).toBe(200);

    const content = await page.content();
    expect(content).toContain('User-Agent:');
    expect(content).toContain('Sitemap:');
  });

  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/');

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /.+/);

    // Check Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /.+/);
  });

  test('should load pages quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;

    // Page should load in less than 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });
});

test.describe('API Endpoints', () => {
  test('should handle rate limiting', async ({ request }) => {
    const responses = [];

    // Make 10 requests quickly
    for (let i = 0; i < 10; i++) {
      const response = await request.get('/api/content/test');
      responses.push(response.status());
    }

    // All should succeed (under rate limit)
    expect(responses.every(status => status === 200 || status === 404)).toBe(true);
  });
});
