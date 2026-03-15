const { getAllPages } = require('../data/seo-data');
const { longTailPages = [] } = require('../data/longtail-pages');

function getRevalidationPaths() {
  const paths = new Set([
    '/',
    '/blog',
    '/instrumenty',
    '/napravleniya',
    '/sravnenie',
  ]);

  for (const page of getAllPages()) {
    if (page.path) {
      paths.add(page.path);
    }
  }

  for (const page of longTailPages) {
    if (page.slug) {
      paths.add(`/longtail/${page.slug}`);
    }
  }

  return Array.from(paths);
}

module.exports = {
  getRevalidationPaths,
};
