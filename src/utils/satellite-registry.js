/**
 * SATELLITE REGISTRY
 * Tracks all satellites for cross-linking
 */

class SatelliteRegistry {
  constructor() {
    this.satellites = [];
  }

  /**
   * Register a satellite
   */
  register(satellite) {
    this.satellites.push({
      name: satellite.name,
      domain: satellite.domain,
      niche: satellite.niche,
      url: satellite.url,
      pages: satellite.pages || [],
    });
  }

  /**
   * Get relevant satellites for cross-linking
   */
  getRelevantSatellites(currentNiche, currentDomain, limit = 3) {
    return this.satellites
      .filter(s => s.domain !== currentDomain)
      .sort((a, b) => {
        // Prioritize same niche
        const aScore = a.niche === currentNiche ? 2 : 1;
        const bScore = b.niche === currentNiche ? 2 : 1;
        return bScore - aScore;
      })
      .slice(0, limit);
  }

  /**
   * Generate cross-links for content
   */
  generateCrossLinks(currentNiche, currentDomain, topic) {
    const relevant = this.getRelevantSatellites(currentNiche, currentDomain, 3);

    const links = relevant.map(satellite => {
      const anchorTexts = this.getAnchorTexts(satellite.niche, topic);
      const randomAnchor = anchorTexts[Math.floor(Math.random() * anchorTexts.length)];

      return {
        url: satellite.url,
        anchor: randomAnchor,
        domain: satellite.domain,
      };
    });

    return links;
  }

  /**
   * Get natural anchor texts
   */
  getAnchorTexts(niche, topic) {
    const templates = {
      crypto: [
        'узнайте больше о криптовалютах',
        'полное руководство по блокчейну',
        'как начать торговать криптой',
        'лучшие криптобиржи 2026',
      ],
      fitness: [
        'программы тренировок',
        'советы по фитнесу',
        'как похудеть эффективно',
        'здоровое питание',
      ],
      education: [
        'онлайн-курсы',
        'обучение программированию',
        'лучшие образовательные платформы',
        'как выучить новый навык',
      ],
      realestate: [
        'покупка недвижимости',
        'инвестиции в недвижимость',
        'ипотека без первоначального взноса',
        'аренда квартир',
      ],
      finance: [
        'финансовое планирование',
        'инвестиционные стратегии',
        'как накопить деньги',
        'пассивный доход',
      ],
      tech: [
        'новые технологии',
        'обзоры гаджетов',
        'IT-тренды 2026',
        'программное обеспечение',
      ],
      health: [
        'здоровый образ жизни',
        'профилактика заболеваний',
        'медицинские советы',
        'витамины и добавки',
      ],
      business: [
        'бизнес-идеи',
        'как открыть свое дело',
        'маркетинговые стратегии',
        'управление бизнесом',
      ],
    };

    return templates[niche] || templates.business;
  }

  /**
   * Format links as HTML
   */
  formatLinksAsHTML(links) {
    if (links.length === 0) return '';

    const linksHTML = links
      .map(link => `<a href="${link.url}" rel="noopener">${link.anchor}</a>`)
      .join(', ');

    return `\n\n<div class="related-links"><h3>Полезные ресурсы:</h3><p>${linksHTML}</p></div>`;
  }

  /**
   * Get all satellites
   */
  getAll() {
    return this.satellites;
  }

  /**
   * Clear registry
   */
  clear() {
    this.satellites = [];
  }
}

module.exports = { SatelliteRegistry };
