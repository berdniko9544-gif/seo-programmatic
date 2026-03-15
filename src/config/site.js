const DEFAULT_MAIN_SITE_URL =
  process.env.DEFAULT_MAIN_SITE_URL ||
  process.env.MAIN_SITE_URL ||
  'https://seo-programmatic-main.berdniko9544.workers.dev';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  DEFAULT_MAIN_SITE_URL;

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'SEO Programmatic';
const BRAND = process.env.NEXT_PUBLIC_BRAND || SITE_NAME;
const MAIN_SITE_URL = process.env.NEXT_PUBLIC_MAIN_SITE || DEFAULT_MAIN_SITE_URL;
const DEFAULT_OG_IMAGE = process.env.NEXT_PUBLIC_OG_IMAGE || '/og-image.png';
const SITE_VERTICAL = process.env.NEXT_PUBLIC_SITE_VERTICAL || 'ai-business';
const IS_SATELLITE = SITE_URL !== MAIN_SITE_URL;

module.exports = {
  SITE_URL,
  SITE_NAME,
  BRAND,
  MAIN_SITE_URL,
  DEFAULT_OG_IMAGE,
  SITE_VERTICAL,
  IS_SATELLITE,
};
