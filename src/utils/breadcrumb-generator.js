/**
 * BREADCRUMB GENERATOR
 * Generates breadcrumb navigation with schema markup
 */

class BreadcrumbGenerator {
  /**
   * Generate breadcrumbs for page
   */
  static generate(path, baseUrl = '') {
    const segments = path.split('/').filter(s => s);
    const breadcrumbs = [
      {
        name: 'Главная',
        url: baseUrl || '/',
        position: 1
      }
    ];

    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Skip dynamic segments like [slug]
      if (segment.startsWith('[')) return;

      breadcrumbs.push({
        name: this.segmentToName(segment),
        url: baseUrl + currentPath,
        position: index + 2
      });
    });

    return breadcrumbs;
  }

  /**
   * Convert URL segment to readable name
   */
  static segmentToName(segment) {
    const nameMap = {
      'napravleniya': 'Направления',
      'instrumenty': 'Инструменты',
      'blog': 'Блог',
      'dlya': 'Для кого',
      'sravnenie': 'Сравнение',
      'longtail': 'Статьи',
      'zarabotok-na-ai': 'Заработок на AI',
      'zarabotok-na-ii': 'Заработок на ИИ'
    };

    return nameMap[segment] || this.capitalize(segment.replace(/-/g, ' '));
  }

  /**
   * Format breadcrumbs as HTML
   */
  static formatHTML(breadcrumbs) {
    if (breadcrumbs.length <= 1) return '';

    const items = breadcrumbs.map((crumb, index) => {
      const isLast = index === breadcrumbs.length - 1;

      if (isLast) {
        return `<span class="breadcrumb-current">${crumb.name}</span>`;
      }

      return `<a href="${crumb.url}" class="breadcrumb-link">${crumb.name}</a>`;
    }).join(' <span class="breadcrumb-separator">›</span> ');

    return `
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        ${items}
      </nav>
    `;
  }

  /**
   * Generate breadcrumb schema
   */
  static generateSchema(breadcrumbs) {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map(crumb => ({
        "@type": "ListItem",
        "position": crumb.position,
        "name": crumb.name,
        "item": crumb.url
      }))
    };
  }

  /**
   * Generate complete breadcrumb with HTML and schema
   */
  static generateComplete(path, baseUrl = '') {
    const breadcrumbs = this.generate(path, baseUrl);

    return {
      breadcrumbs,
      html: this.formatHTML(breadcrumbs),
      schema: this.generateSchema(breadcrumbs)
    };
  }

  /**
   * Capitalize first letter
   */
  static capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

module.exports = { BreadcrumbGenerator };
