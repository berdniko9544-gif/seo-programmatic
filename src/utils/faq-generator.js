/**
 * FAQ GENERATOR
 * Generates FAQ sections optimized for featured snippets
 */

class FAQGenerator {
  /**
   * Generate niche-specific FAQs
   */
  static generateForNiche(niche, topic) {
    const templates = this.getTemplates(niche);
    const faqs = [];

    // Generate 5-8 FAQs per page
    const count = 5 + Math.floor(Math.random() * 4);

    for (let i = 0; i < count && i < templates.length; i++) {
      const template = templates[i];
      faqs.push({
        question: template.question.replace('{topic}', topic),
        answer: template.answer.replace('{topic}', topic).replace('{niche}', niche)
      });
    }

    return faqs;
  }

  /**
   * Get FAQ templates by niche
   */
  static getTemplates(niche) {
    const universal = [
      {
        question: 'Что такое {topic}?',
        answer: '{topic} — это современный подход в сфере {niche}, который позволяет эффективно решать задачи и достигать результатов. В 2026 году это направление активно развивается и предлагает множество возможностей.'
      },
      {
        question: 'Как начать работать с {topic}?',
        answer: 'Для начала работы с {topic} рекомендуем: 1) Изучить основы и базовые концепции, 2) Выбрать подходящие инструменты, 3) Начать с простых проектов, 4) Постепенно наращивать опыт и компетенции.'
      },
      {
        question: 'Сколько можно заработать на {topic}?',
        answer: 'Доход от {topic} зависит от опыта, навыков и времени, которое вы готовы инвестировать. Начинающие специалисты зарабатывают от 20,000 ₽/мес, опытные — от 100,000 ₽/мес и выше.'
      },
      {
        question: 'Какие инструменты нужны для {topic}?',
        answer: 'Для работы с {topic} существует множество инструментов — как бесплатных, так и платных. Начать можно с бесплатных решений, постепенно переходя к профессиональным платформам по мере роста.'
      },
      {
        question: 'Сколько времени нужно на обучение {topic}?',
        answer: 'Базовые навыки в {topic} можно освоить за 1-2 недели. Для достижения профессионального уровня потребуется 2-3 месяца регулярной практики. Главное — начать и практиковаться ежедневно.'
      },
      {
        question: 'Актуально ли {topic} в 2026 году?',
        answer: 'Да, {topic} остается актуальным и востребованным в 2026 году. Спрос на специалистов в этой области продолжает расти, а технологии постоянно развиваются, открывая новые возможности.'
      },
      {
        question: 'Где искать клиентов для {topic}?',
        answer: 'Клиентов для {topic} можно найти на фриланс-биржах (Kwork, FL.ru), в социальных сетях (ВКонтакте, Telegram), через личный бренд и рекомендации. Начните с портфолио из 3-5 работ.'
      },
      {
        question: 'Какие ошибки часто делают новички в {topic}?',
        answer: 'Типичные ошибки новичков: 1) Слишком низкие цены на старте, 2) Отсутствие портфолио, 3) Недостаточное изучение инструментов, 4) Нерегулярная практика. Избегайте этих ошибок для быстрого роста.'
      }
    ];

    const nicheSpecific = {
      crypto: [
        {
          question: 'Безопасно ли {topic} в России?',
          answer: 'Работа с {topic} в России легальна, но требует соблюдения законодательства. Используйте проверенные платформы, храните активы в надежных кошельках и декларируйте доходы.'
        },
        {
          question: 'Нужны ли большие вложения для {topic}?',
          answer: 'Начать можно с минимальных вложений от 5,000 ₽. Главное — изучить основы, понять риски и начать с небольших сумм, постепенно масштабируя.'
        }
      ],
      fitness: [
        {
          question: 'Нужно ли специальное образование для {topic}?',
          answer: 'Для {topic} желательно пройти курсы и получить сертификат, но обязательного образования не требуется. Главное — знания, практика и умение работать с клиентами.'
        }
      ],
      education: [
        {
          question: 'Какие курсы по {topic} лучше выбрать?',
          answer: 'При выборе курсов по {topic} обращайте внимание на: программу обучения, отзывы выпускников, практические задания, поддержку кураторов и стоимость. Начните с бесплатных материалов.'
        }
      ]
    };

    return [...universal, ...(nicheSpecific[niche] || [])];
  }

  /**
   * Format FAQs as HTML
   */
  static formatHTML(faqs) {
    if (!faqs || faqs.length === 0) return '';

    const faqItems = faqs.map(faq => `
      <div class="faq-item">
        <h3 class="faq-question">${faq.question}</h3>
        <div class="faq-answer">
          <p>${faq.answer}</p>
        </div>
      </div>
    `).join('');

    return `
      <section class="faq-section">
        <h2>Часто задаваемые вопросы</h2>
        <div class="faq-list">
          ${faqItems}
        </div>
      </section>
    `;
  }

  /**
   * Generate FAQ schema for structured data
   */
  static generateSchema(faqs) {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  }

  /**
   * Generate FAQ for specific page type
   */
  static generateForPage(pageType, data) {
    const { niche, topic, title } = data;
    const faqs = this.generateForNiche(niche, topic || title);

    return {
      faqs,
      html: this.formatHTML(faqs),
      schema: this.generateSchema(faqs)
    };
  }
}

module.exports = { FAQGenerator };
