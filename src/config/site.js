const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  'https://seo-programmatic-main.vercel.app';

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'SEO Programmatic';
const BRAND = process.env.NEXT_PUBLIC_BRAND || SITE_NAME;
const MAIN_SITE_URL = process.env.NEXT_PUBLIC_MAIN_SITE || SITE_URL;
const DEFAULT_OG_IMAGE = process.env.NEXT_PUBLIC_OG_IMAGE || '/og-image.png';

module.exports = {
  SITE_URL,
  SITE_NAME,
  BRAND,
  MAIN_SITE_URL,
  DEFAULT_OG_IMAGE,
};
