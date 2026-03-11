/**
 * TRAFFIC PROJECTION CALCULATOR
 * Estimates potential traffic based on content strategy
 */

class TrafficProjectionCalculator {
  /**
   * Calculate projected traffic for satellite network
   */
  static calculateProjection(config) {
    const {
      satelliteCount = 20,
      pagesPerSatellite = 300,
      avgMonthlySearchVolume = 100, // per long-tail keyword
      avgCTR = 0.05, // 5% CTR for long-tail
      avgPosition = 8, // average SERP position
      monthsToRank = 3 // time to reach target position
    } = config;

    const totalPages = satelliteCount * pagesPerSatellite;

    // Calculate traffic by month
    const projections = [];

    for (let month = 1; month <= 12; month++) {
      const rankingProgress = Math.min(month / monthsToRank, 1);
      const rankedPages = Math.floor(totalPages * rankingProgress);

      // Position improves over time
      const currentPosition = avgPosition - (rankingProgress * 3);
      const positionCTR = this.getCTRByPosition(currentPosition);

      // Traffic calculation
      const monthlyClicks = rankedPages * avgMonthlySearchVolume * positionCTR;

      projections.push({
        month,
        rankedPages,
        avgPosition: currentPosition.toFixed(1),
        ctr: (positionCTR * 100).toFixed(2) + '%',
        monthlyVisits: Math.round(monthlyClicks),
        dailyVisits: Math.round(monthlyClicks / 30)
      });
    }

    return {
      config,
      totalPages,
      projections,
      summary: this.generateSummary(projections)
    };
  }

  /**
   * Get CTR by SERP position
   */
  static getCTRByPosition(position) {
    const ctrMap = {
      1: 0.316,  // 31.6%
      2: 0.158,  // 15.8%
      3: 0.100,  // 10.0%
      4: 0.077,  // 7.7%
      5: 0.061,  // 6.1%
      6: 0.048,  // 4.8%
      7: 0.039,  // 3.9%
      8: 0.032,  // 3.2%
      9: 0.027,  // 2.7%
      10: 0.023  // 2.3%
    };

    const pos = Math.round(position);
    return ctrMap[pos] || 0.01; // 1% for positions 11+
  }

  /**
   * Generate summary
   */
  static generateSummary(projections) {
    const month3 = projections[2];
    const month6 = projections[5];
    const month12 = projections[11];

    return {
      month3: {
        monthlyVisits: month3.monthlyVisits,
        dailyVisits: month3.dailyVisits
      },
      month6: {
        monthlyVisits: month6.monthlyVisits,
        dailyVisits: month6.dailyVisits
      },
      month12: {
        monthlyVisits: month12.monthlyVisits,
        dailyVisits: month12.dailyVisits
      },
      yearTotal: projections.reduce((sum, p) => sum + p.monthlyVisits, 0)
    };
  }

  /**
   * Calculate traffic by niche
   */
  static calculateByNiche(niche) {
    const nicheMultipliers = {
      crypto: 1.5,      // High search volume
      fitness: 1.2,     // Medium-high
      education: 1.3,   // Medium-high
      realestate: 1.1,  // Medium
      finance: 1.4,     // High
      tech: 1.2,        // Medium-high
      health: 1.1,      // Medium
      business: 1.3     // Medium-high
    };

    const multiplier = nicheMultipliers[niche] || 1.0;

    const baseProjection = this.calculateProjection({
      satelliteCount: 20,
      pagesPerSatellite: 300,
      avgMonthlySearchVolume: 100 * multiplier
    });

    return {
      niche,
      multiplier,
      ...baseProjection
    };
  }

  /**
   * Calculate ROI
   */
  static calculateROI(config) {
    const {
      investmentCost = 0, // Free automation
      avgRevenuePerVisitor = 0.5, // Conservative estimate
      conversionRate = 0.02 // 2% conversion
    } = config;

    const projection = this.calculateProjection(config);
    const yearlyVisits = projection.summary.yearTotal;
    const conversions = yearlyVisits * conversionRate;
    const revenue = conversions * avgRevenuePerVisitor;
    const roi = investmentCost > 0 ? ((revenue - investmentCost) / investmentCost) * 100 : Infinity;

    return {
      yearlyVisits,
      conversions: Math.round(conversions),
      revenue: Math.round(revenue),
      roi: roi === Infinity ? '∞' : roi.toFixed(0) + '%',
      investmentCost
    };
  }

  /**
   * Generate detailed report
   */
  static generateReport(config) {
    const projection = this.calculateProjection(config);
    const roi = this.calculateROI(config);

    return {
      ...projection,
      roi,
      insights: this.generateInsights(projection, roi)
    };
  }

  /**
   * Generate insights
   */
  static generateInsights(projection, roi) {
    const insights = [];

    const month3Visits = projection.summary.month3.monthlyVisits;
    const month12Visits = projection.summary.month12.monthlyVisits;

    insights.push(`📈 Через 3 месяца: ${month3Visits.toLocaleString('ru-RU')} визитов/месяц`);
    insights.push(`🚀 Через 12 месяцев: ${month12Visits.toLocaleString('ru-RU')} визитов/месяц`);
    insights.push(`💰 Годовой доход: ${roi.revenue.toLocaleString('ru-RU')} ₽`);
    insights.push(`📊 ROI: ${roi.roi}`);
    insights.push(`🎯 Конверсий в год: ${roi.conversions.toLocaleString('ru-RU')}`);

    return insights;
  }

  /**
   * Format report as text
   */
  static formatReport(report) {
    let text = '═══════════════════════════════════════════════════════\n';
    text += '           ПРОГНОЗ ТРАФИКА - SATELLITE NETWORK\n';
    text += '═══════════════════════════════════════════════════════\n\n';

    text += `📦 Всего страниц: ${report.totalPages.toLocaleString('ru-RU')}\n`;
    text += `🛰️ Сателлитов: ${report.config.satelliteCount}\n`;
    text += `📄 Страниц на сателлит: ${report.config.pagesPerSatellite}\n\n`;

    text += '───────────────────────────────────────────────────────\n';
    text += '                  ПРОГНОЗ ПО МЕСЯЦАМ\n';
    text += '───────────────────────────────────────────────────────\n\n';

    report.projections.forEach(p => {
      text += `Месяц ${p.month}: ${p.monthlyVisits.toLocaleString('ru-RU')} визитов `;
      text += `(~${p.dailyVisits} в день) | Позиция: ${p.avgPosition} | CTR: ${p.ctr}\n`;
    });

    text += '\n───────────────────────────────────────────────────────\n';
    text += '                      ИТОГИ ГОДА\n';
    text += '───────────────────────────────────────────────────────\n\n';

    report.insights.forEach(insight => {
      text += `${insight}\n`;
    });

    text += '\n═══════════════════════════════════════════════════════\n';

    return text;
  }
}

module.exports = { TrafficProjectionCalculator };
