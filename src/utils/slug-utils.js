/**
 * SLUG UTILITIES
 * Shared utilities for generating URL-safe slugs
 * Supports Cyrillic to Latin transliteration
 */

const CYRILLIC_MAP = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
  'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i',
  'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
  'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
  'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch',
  'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
  'э': 'e', 'ю': 'yu', 'я': 'ya',
  'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D',
  'Е': 'E', 'Ё': 'Yo', 'Ж': 'Zh', 'З': 'Z', 'И': 'I',
  'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N',
  'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T',
  'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch',
  'Ш': 'Sh', 'Щ': 'Sch', 'Ъ': '', 'Ы': 'Y', 'Ь': '',
  'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
};

/**
 * Convert text to URL-safe slug
 * Handles Cyrillic to Latin transliteration
 *
 * @param {string} text - Text to convert to slug
 * @returns {string} URL-safe slug
 *
 * @example
 * slugify('Привет мир') // 'privet-mir'
 * slugify('Hello World!') // 'hello-world'
 */
function slugify(text) {
  if (!text) return '';

  return String(text)
    .toLowerCase()
    .split('')
    .map(char => CYRILLIC_MAP[char] || char)
    .join('')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Generate unique slug with optional suffix
 *
 * @param {string} text - Base text for slug
 * @param {string|number} suffix - Optional suffix to append
 * @returns {string} Unique slug
 *
 * @example
 * generateUniqueSlug('Test', 1) // 'test-1'
 * generateUniqueSlug('Test') // 'test'
 */
function generateUniqueSlug(text, suffix = '') {
  const baseSlug = slugify(text);
  return suffix ? `${baseSlug}-${suffix}` : baseSlug;
}

module.exports = {
  slugify,
  generateUniqueSlug,
  CYRILLIC_MAP
};
