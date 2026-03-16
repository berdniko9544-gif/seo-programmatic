/**
 * PROBLEM-SOLUTION GENERATOR
 * Generates problem-solution pages for high-intent traffic
 */

class ProblemSolutionGenerator {
  /**
   * Generate problem-solution pages
   */
  static generateProblems(niche, directions, count = 50) {
    const problems = this.getCommonProblems(niche);
    const pages = [];
    
    problems.slice(0, count).forEach(problem => {
      // Base problem page
      pages.push({
        slug: problem.slug,
        title: `Как решить: ${problem.title}`,
        h1: problem.title,
        description: `${problem.title} — практическое решение проблемы с пошаговым планом действий. Проверенные методы и инструменты.`,
        problem: problem.title,
        solution: problem.solution,
        steps: problem.steps,
        tools: problem.tools,
        keywords: [
          problem.title,
          `как решить ${problem.title}`,
          `${problem.title} что делать`,
          `решение проблемы ${problem.title}`
        ],
        type: 'problem-solution',
        url: `/problem/${problem.slug}`,
        path: `/problem/${problem.slug}`
      });
      
      // Problem + direction combinations
      directions.slice(0, 3).forEach(direction => {
        pages.push({
          slug: `${problem.slug}-${direction.id}`,
          title: `Как решить "${problem.title}" с помощью ${direction.nameShort}`,
          h1: `${problem.title}: решение через ${direction.nameShort}`,
          description: `Как ${direction.nameShort} помогает решить проблему "${problem.title}". Практические кейсы и инструменты.`,
          problem: problem.title,
          solution: `${problem.solution} Используйте ${direction.nameShort} для автоматизации и ускорения процесса.`,
          steps: problem.steps,
          tools: [...problem.tools, ...(direction.tools || []).slice(0, 2)],
          direction: direction.nameShort,
          keywords: [
            `${problem.title} ${direction.nameShort}`,
            `как решить ${problem.title} с ${direction.nameShort}`,
            `${direction.nameShort} для ${problem.title}`
          ],
          type: 'problem-solution',
          url: `/problem/${problem.slug}/${direction.id}`,
          path: `/problem/${problem.slug}/${direction.id}`
        });
      });
    });
    
    return pages;
  }

  /**
   * Get common problems for niche
   */
  static getCommonProblems(niche) {
    return [
      {
        slug: 'net-klientov',
        title: 'Нет клиентов на AI-услуги',
        solution: 'Создайте оффер, соберите портфолио из 3-5 кейсов, запустите таргет и холодные продажи',
        steps: [
          'Определите целевую аудиторию',
          'Создайте простой оффер',
          'Соберите портфолио (можно тестовые проекты)',
          'Запустите рекламу в соцсетях',
          'Начните холодные продажи'
        ],
        tools: ['ChatGPT', 'Canva', 'Telegram']
      },
      {
        slug: 'ne-znayu-kak-nachat',
        title: 'Не знаю как начать зарабатывать на нейросетях',
        solution: 'Выберите одно направление, изучите 2-3 инструмента, сделайте первый проект для портфолио',
        steps: [
          'Выберите направление (копирайтинг, дизайн, видео)',
          'Изучите 2-3 основных инструмента',
          'Сделайте 3 тестовых проекта',
          'Упакуйте оффер',
          'Найдите первого клиента'
        ],
        tools: ['ChatGPT', 'Midjourney', 'Notion']
      },
      {
        slug: 'dolgo-sozdayu-kontent',
        title: 'Слишком долго создаю контент',
        solution: 'Автоматизируйте рутину с помощью AI: шаблоны промптов, пакетная генерация, автопостинг',
        steps: [
          'Создайте библиотеку промптов',
          'Настройте пакетную генерацию',
          'Используйте автопостинг',
          'Создайте контент-план на месяц',
          'Делегируйте редактуру AI'
        ],
        tools: ['ChatGPT', 'Claude', 'Buffer', 'Make.com']
      },
      {
        slug: 'net-idey-dlya-postov',
        title: 'Не хватает идей для постов',
        solution: 'Используйте AI для генерации идей: анализ трендов, вопросы аудитории, контент конкурентов',
        steps: [
          'Проанализируйте тренды в нише',
          'Соберите вопросы аудитории',
          'Изучите контент конкурентов',
          'Сгенерируйте 100 идей с AI',
          'Создайте контент-календарь'
        ],
        tools: ['ChatGPT', 'AnswerThePublic', 'BuzzSumo']
      },
      {
        slug: 'konkurenty-deshevle',
        title: 'Конкуренты дешевле',
        solution: 'Не конкурируйте ценой — добавьте ценность: скорость, качество, уникальный подход',
        steps: [
          'Найдите свою уникальность',
          'Добавьте дополнительные услуги',
          'Ускорьте выполнение с AI',
          'Улучшите качество результата',
          'Покажите кейсы и результаты'
        ],
        tools: ['ChatGPT', 'Notion', 'Figma']
      },
      {
        slug: 'ne-hvataet-vremeni',
        title: 'Не хватает времени на все задачи',
        solution: 'Автоматизируйте рутину, делегируйте AI, используйте шаблоны и системы',
        steps: [
          'Выпишите все задачи',
          'Определите что можно автоматизировать',
          'Настройте AI-ассистентов',
          'Создайте шаблоны и чек-листы',
          'Делегируйте рутину'
        ],
        tools: ['ChatGPT', 'n8n', 'Notion', 'Zapier']
      },
      {
        slug: 'slozhno-nayti-niche',
        title: 'Сложно найти свою нишу',
        solution: 'Протестируйте 3-5 направлений, выберите где быстрее идут продажи и интереснее работать',
        steps: [
          'Составьте список из 5 ниш',
          'Сделайте по 1 проекту в каждой',
          'Оцените спрос и конкуренцию',
          'Выберите 1-2 направления',
          'Углубитесь в выбранную нишу'
        ],
        tools: ['Google Trends', 'Kwork', 'FL.ru']
      },
      {
        slug: 'ne-umeu-prodat',
        title: 'Не умею продавать свои услуги',
        solution: 'Изучите основы продаж, создайте скрипты, практикуйтесь на холодных звонках',
        steps: [
          'Изучите базу продаж',
          'Создайте скрипты диалогов',
          'Подготовьте ответы на возражения',
          'Практикуйтесь на 10-20 звонках',
          'Анализируйте и улучшайте'
        ],
        tools: ['ChatGPT', 'Notion', 'Telegram']
      },
      {
        slug: 'nizkiy-chek',
        title: 'Низкий средний чек',
        solution: 'Упакуйте услуги в пакеты, добавьте премиум-опции, работайте с более крупными клиентами',
        steps: [
          'Создайте 3 пакета услуг',
          'Добавьте премиум-опции',
          'Поднимите цены на 30-50%',
          'Ищите более крупных клиентов',
          'Продавайте результат, не время'
        ],
        tools: ['Notion', 'Figma', 'Tilda']
      },
      {
        slug: 'net-povtornyh-prodazh',
        title: 'Нет повторных продаж',
        solution: 'Создайте систему допродаж, предложите абонементы, поддерживайте связь с клиентами',
        steps: [
          'Создайте систему допродаж',
          'Предложите абонементное обслуживание',
          'Настройте email-рассылку',
          'Делайте регулярные касания',
          'Собирайте обратную связь'
        ],
        tools: ['ChatGPT', 'Mailchimp', 'Notion']
      }
    ];
  }

  /**
   * Slugify text
   */
  static slugify(text) {
    const map = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
      'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
      'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
      'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
      'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
      ' ': '-'
    };

    return String(text)
      .toLowerCase()
      .split('')
      .map(char => map[char] || char)
      .join('')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
}

module.exports = { ProblemSolutionGenerator };
