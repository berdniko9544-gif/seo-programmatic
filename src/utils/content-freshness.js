/**
 * CONTENT FRESHNESS MANAGER
 * Adds freshness signals to improve search rankings
 */

class ContentFreshnessManager {
  /**
   * Generate last updated timestamp
   */
  static getLastUpdated(baseDate = null) {
    const now = new Date();
    const base = baseDate ? new Date(baseDate) : now;

    // Add random variation (0-7 days ago)
    const daysAgo = Math.floor(Math.random() * 7);
    const updated = new Date(base);
    updated.setDate(updated.getDate() - daysAgo);

    return updated.toISOString();
  }

  /**
   * Format date for display (Russian)
   */
  static formatDate(date) {
    const d = new Date(date);
    const months = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];

    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  /**
   * Generate freshness badge HTML
   */
  static generateFreshnessBadge(date) {
    const now = new Date();
    const updated = new Date(date);
    const daysDiff = Math.floor((now - updated) / (1000 * 60 * 60 * 24));

    let badge = '';
    let className = '';

    if (daysDiff === 0) {
      badge = '🔥 Обновлено сегодня';
      className = 'badge-fresh';
    } else if (daysDiff === 1) {
      badge = '✨ Обновлено вчера';
      className = 'badge-recent';
    } else if (daysDiff <= 7) {
      badge = `📅 Обновлено ${daysDiff} дн. назад`;
      className = 'badge-recent';
    } else if (daysDiff <= 30) {
      badge = '✓ Актуально';
      className = 'badge-current';
    }

    if (badge) {
      return `<span class="freshness-badge ${className}">${badge}</span>`;
    }

    return '';
  }

  /**
   * Add freshness metadata to page
   */
  static addFreshnessMetadata(metadata, publishDate = null) {
    const now = new Date();
    const published = publishDate ? new Date(publishDate) : now;
    const updated = this.getLastUpdated(published);

    return {
      ...metadata,
      datePublished: published.toISOString(),
      dateModified: updated,
      lastUpdated: this.formatDate(updated),
      freshnessBadge: this.generateFreshnessBadge(updated)
    };
  }

  /**
   * Generate update notes (for content)
   */
  static generateUpdateNotes() {
    const notes = [
      'Обновлены цены и тарифы',
      'Добавлены новые инструменты',
      'Актуализирована информация',
      'Проверены все ссылки',
      'Добавлены примеры 2026 года',
      'Обновлена статистика',
      'Добавлены отзывы пользователей',
      'Исправлены неточности'
    ];

    // Return 1-3 random notes
    const count = 1 + Math.floor(Math.random() * 3);
    const selected = [];
    const available = [...notes];

    for (let i = 0; i < count && available.length > 0; i++) {
      const index = Math.floor(Math.random() * available.length);
      selected.push(available.splice(index, 1)[0]);
    }

    return selected;
  }

  /**
   * Format update notes as HTML
   */
  static formatUpdateNotesHTML(notes) {
    if (!notes || notes.length === 0) return '';

    const notesHTML = notes.map(note => `<li>${note}</li>`).join('');

    return `
      <div class="update-notes">
        <h4>Последние обновления:</h4>
        <ul>${notesHTML}</ul>
      </div>
    `;
  }

  /**
   * Should update content? (for automation)
   */
  static shouldUpdate(lastUpdateDate, updateFrequencyDays = 7) {
    const now = new Date();
    const lastUpdate = new Date(lastUpdateDate);
    const daysSinceUpdate = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24));

    return daysSinceUpdate >= updateFrequencyDays;
  }

  /**
   * Generate content update timestamp for ISR
   */
  static getISRTimestamp() {
    // Return timestamp that changes every 6 hours
    const now = Date.now();
    const sixHours = 6 * 60 * 60 * 1000;
    return Math.floor(now / sixHours) * sixHours;
  }
}

module.exports = { ContentFreshnessManager };
