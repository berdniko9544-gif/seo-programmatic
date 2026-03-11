/**
 * SEASONAL CONTENT GENERATOR
 * Generates timely, seasonal content for better relevance
 */

class SeasonalContentGenerator {
  /**
   * Get current season
   */
  static getCurrentSeason() {
    const month = new Date().getMonth() + 1;

    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
  }

  /**
   * Get seasonal keywords
   */
  static getSeasonalKeywords(niche, season = null) {
    const currentSeason = season || this.getCurrentSeason();

    const seasonalThemes = {
      spring: {
        keywords: ['весна', 'март', 'апрель', 'май', 'новый сезон', 'обновление'],
        themes: ['начало года', 'новые возможности', 'весенний старт']
      },
      summer: {
        keywords: ['лето', 'июнь', 'июль', 'август', 'отпуск', 'каникулы'],
        themes: ['летний заработок', 'удаленная работа', 'фриланс летом']
      },
      autumn: {
        keywords: ['осень', 'сентябрь', 'октябрь', 'ноябрь', 'новый учебный год'],
        themes: ['осенний старт', 'обучение', 'новые навыки']
      },
      winter: {
        keywords: ['зима', 'декабрь', 'январь', 'февраль', 'новый год', 'праздники'],
        themes: ['зимний заработок', 'итоги года', 'планы на год']
      }
    };

    return seasonalThemes[currentSeason];
  }

  /**
   * Get holiday-specific content
   */
  static getHolidayContent() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    const holidays = [
      {
        month: 1, day: 1, name: 'Новый год',
        keywords: ['новый год', 'новогодний заработок', 'праздничный сезон'],
        active: month === 12 || (month === 1 && day <= 10)
      },
      {
        month: 2, day: 23, name: '23 февраля',
        keywords: ['подарки', 'мужские товары'],
        active: month === 2 && day >= 15 && day <= 25
      },
      {
        month: 3, day: 8, name: '8 марта',
        keywords: ['подарки', 'женские товары', '8 марта'],
        active: month === 3 && day >= 1 && day <= 10
      },
      {
        month: 5, day: 9, name: '9 мая',
        keywords: ['день победы', 'патриотика'],
        active: month === 5 && day >= 1 && day <= 10
      },
      {
        month: 9, day: 1, name: 'День знаний',
        keywords: ['обучение', 'образование', 'школа', 'курсы'],
        active: month === 9 && day >= 1 && day <= 15
      },
      {
        month: 11, day: 11, name: '11.11',
        keywords: ['распродажа', 'скидки', 'черная пятница'],
        active: month === 11 && day >= 5 && day <= 15
      },
      {
        month: 11, day: 24, name: 'Черная пятница',
        keywords: ['черная пятница', 'распродажа', 'скидки'],
        active: month === 11 && day >= 20 && day <= 30
      }
    ];

    return holidays.filter(h => h.active);
  }

  /**
   * Generate seasonal page variations
   */
  static generateSeasonalPages(basePages, niche) {
    const seasonal = this.getSeasonalKeywords(niche);
    const holidays = this.getHolidayContent();
    const pages = [];

    // Add seasonal variations for top pages
    basePages.slice(0, 20).forEach(page => {
      seasonal.themes.forEach(theme => {
        pages.push({
          ...page,
          slug: `${page.slug}-${this.slugify(theme)}`,
          title: `${page.title} — ${theme}`,
          keywords: [...(page.keywords || []), ...seasonal.keywords],
          type: 'seasonal',
          seasonal: true,
          seasonalTheme: theme
        });
      });
    });

    // Add holiday-specific pages
    holidays.forEach(holiday => {
      basePages.slice(0, 10).forEach(page => {
        pages.push({
          ...page,
          slug: `${page.slug}-${this.slugify(holiday.name)}`,
          title: `${page.title} — ${holiday.name}`,
          keywords: [...(page.keywords || []), ...holiday.keywords],
          type: 'holiday',
          holiday: holiday.name
        });
      });
    });

    return pages;
  }

  /**
   * Add seasonal context to content
   */
  static addSeasonalContext(content, niche) {
    const seasonal = this.getSeasonalKeywords(niche);
    const holidays = this.getHolidayContent();

    let context = '';

    if (holidays.length > 0) {
      const holiday = holidays[0];
      context = `
        <div class="seasonal-banner">
          <p>🎉 <strong>${holiday.name}:</strong> Актуальные предложения и специальные условия!</p>
        </div>
      `;
    } else {
      context = `
        <div class="seasonal-note">
          <p>✨ Актуально для ${seasonal.themes[0]}</p>
        </div>
      `;
    }

    return context + content;
  }

  /**
   * Get trending topics for current period
   */
  static getTrendingTopics(niche) {
    const month = new Date().getMonth() + 1;

    const trendingByMonth = {
      1: ['планирование года', 'новые цели', 'финансовые планы'],
      2: ['подарки', 'романтика', 'день влюбленных'],
      3: ['весенние тренды', 'обновление', 'женский день'],
      4: ['весенняя уборка', 'обновление гардероба'],
      5: ['майские праздники', 'отдых', 'путешествия'],
      6: ['летний отдых', 'каникулы', 'отпуск'],
      7: ['летние развлечения', 'активный отдых'],
      8: ['подготовка к школе', 'конец лета'],
      9: ['день знаний', 'обучение', 'новый сезон'],
      10: ['осенние тренды', 'подготовка к зиме'],
      11: ['черная пятница', 'распродажи', 'скидки'],
      12: ['новый год', 'подарки', 'праздники']
    };

    return trendingByMonth[month] || [];
  }

  /**
   * Slugify text
   */
  static slugify(text) {
    const map = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e',
      'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l',
      'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's',
      'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch',
      'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e',
      'ю': 'yu', 'я': 'ya', ' ': '-'
    };

    return text
      .toLowerCase()
      .split('')
      .map(char => map[char] || char)
      .join('')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-');
  }
}

module.exports = { SeasonalContentGenerator };
