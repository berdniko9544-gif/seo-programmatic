const TEMPLATE_FAMILIES = {
  signal: {
    id: 'signal',
    label: 'Signal Desk',
    logoSuffix: 'SIGNAL',
    eyebrow: 'Контентный сигнал',
    familyTitle: 'Редакционный поток запросов и коммерческих интентов',
    familySummary:
      'Структура заточена под быстрый обход хабов, длинные хвосты и ссылки в главный AI-хаб 1MB3.',
    ctaTitle: 'Заберите главный хаб 1MB3 и закройте коммерческие запросы быстрее',
    ctaBody:
      'Внутри: направления, чеки, инструменты, офферы и шаблоны для быстрого выхода на первые продажи AI-услуг.',
    ctaButton: 'Перейти в 1MB3',
    theme: {
      bg: '#0c1218',
      bgCard: '#121b24',
      bgHover: '#182432',
      text: '#eef4f8',
      textMuted: '#9ab0c1',
      accent: '#0ea5e9',
      accentLight: '#7dd3fc',
      accentGlow: 'rgba(14, 165, 233, 0.18)',
      green: '#22c55e',
      orange: '#f59e0b',
      red: '#ef4444',
      border: '#223241',
    },
  },
  atlas: {
    id: 'atlas',
    label: 'Atlas Map',
    logoSuffix: 'ATLAS',
    eyebrow: 'Карта ниши',
    familyTitle: 'Маршруты по кластерам спроса и конверсионным страницам',
    familySummary:
      'Сателлит подаёт контент как карту рынка: куда идти новичку, что продавать бизнесу и какие страницы тянут лиды.',
    ctaTitle: 'Откройте полную карту 1MB3 по заработку на AI',
    ctaBody:
      'Главный сайт собирает в одном месте направления, кейсы, инструменты и сценарии монетизации для РФ и СНГ.',
    ctaButton: 'Открыть карту 1MB3',
    theme: {
      bg: '#13100d',
      bgCard: '#1b1712',
      bgHover: '#282118',
      text: '#f6efe4',
      textMuted: '#c7b7a0',
      accent: '#f97316',
      accentLight: '#fdba74',
      accentGlow: 'rgba(249, 115, 22, 0.18)',
      green: '#84cc16',
      orange: '#fb923c',
      red: '#dc2626',
      border: '#3a2c1e',
    },
  },
  workshop: {
    id: 'workshop',
    label: 'Workshop',
    logoSuffix: 'LAB',
    eyebrow: 'Практический цех',
    familyTitle: 'Сборка офферов, инструментов и пошаговых маршрутов',
    familySummary:
      'Фокус на практических связках: что взять в работу, какие услуги продавать и как перевести читателя в действие.',
    ctaTitle: 'Соберите рабочую связку на основе гайда 1MB3',
    ctaBody:
      'Внутри есть стек инструментов, шаблоны переписки, структура оффера и маршрут до первого клиента.',
    ctaButton: 'Забрать связку 1MB3',
    theme: {
      bg: '#10150f',
      bgCard: '#162018',
      bgHover: '#203026',
      text: '#eef7ef',
      textMuted: '#a7b9ab',
      accent: '#22c55e',
      accentLight: '#86efac',
      accentGlow: 'rgba(34, 197, 94, 0.18)',
      green: '#4ade80',
      orange: '#f59e0b',
      red: '#ef4444',
      border: '#2a4030',
    },
  },
  fieldbook: {
    id: 'fieldbook',
    label: 'Fieldbook',
    logoSuffix: 'FIELD',
    eyebrow: 'Полевые заметки',
    familyTitle: 'Контент для захвата микроинтентов и сценариев “как начать”',
    familySummary:
      'Подача ближе к редакционной записной книжке: больше чек-листов, актуализаций и навигации к главному хабу.',
    ctaTitle: 'Перенесите эти сценарии в главный хаб 1MB3',
    ctaBody:
      'На основном сайте собраны расширенные разборы, направления с чеками и контентные шаблоны под монетизацию AI.',
    ctaButton: 'Перейти к сценариям 1MB3',
    theme: {
      bg: '#151118',
      bgCard: '#1d1821',
      bgHover: '#2b2231',
      text: '#f5eef8',
      textMuted: '#c0afc8',
      accent: '#ec4899',
      accentLight: '#f9a8d4',
      accentGlow: 'rgba(236, 72, 153, 0.18)',
      green: '#34d399',
      orange: '#fb7185',
      red: '#ef4444',
      border: '#3a2d42',
    },
  },
  navigator: {
    id: 'navigator',
    label: 'Navigator',
    logoSuffix: 'NAV',
    eyebrow: 'Навигатор роста',
    familyTitle: 'Семантические кластеры и хабы, которые ведут в основной сайт',
    familySummary:
      'Семейство построено как навигатор по страницам спроса: читатель последовательно проходит от запроса к хабу 1MB3.',
    ctaTitle: 'Откройте главный навигатор 1MB3 по AI-заработку',
    ctaBody:
      'Там собраны маршруты для фриланса, бизнеса и запуска AI-услуг с примерами связок, чеков и спроса.',
    ctaButton: 'Открыть навигатор 1MB3',
    theme: {
      bg: '#0e111a',
      bgCard: '#151b28',
      bgHover: '#1e2737',
      text: '#edf2ff',
      textMuted: '#aab5d1',
      accent: '#6366f1',
      accentLight: '#a5b4fc',
      accentGlow: 'rgba(99, 102, 241, 0.18)',
      green: '#2dd4bf',
      orange: '#f59e0b',
      red: '#ef4444',
      border: '#29344b',
    },
  },
};

const SEMANTIC_BLUEPRINTS = {
  'ai-copywriting': {
    label: 'AI-копирайтинг и контент',
    directionIds: [
      'ai-copywriting',
      'ai-marketing',
      'ai-translation',
      'ai-education',
      'ai-sites',
      'ai-analytics',
      'ai-bots',
      'ai-design',
      'ai-photo',
      'ai-automation',
    ],
    toolCategoryIds: ['text-ai', 'automation-ai', 'image-ai', 'audio-ai', 'code-ai', 'video-ai'],
    audienceSlugs: ['copywriter', 'freelancer', 'student', 'business', 'marketer', 'mama', 'developer', 'designer'],
    seedKeywords: [
      'chatgpt для заработка',
      'ai-копирайтинг для бизнеса',
      'seo статьи с нейросетями',
      'контент-план с ai',
      'продающие тексты chatgpt',
      'ai контент для telegram',
      'промпты для копирайтинга',
      'генерация контента для клиентов',
    ],
    articleTopics: [
      'Как продавать AI-копирайтинг малому бизнесу',
      'ChatGPT для коммерческих текстов и лендингов',
      'Контент-студия на нейросетях без команды',
      'AI-редактура и SEO-поток для агентств',
      'Как собрать пакет услуг по контенту на AI',
      'Промпт-пакеты для копирайтеров и редакторов',
      'Telegram-контент на нейросетях под лидогенерацию',
      'Как упаковать кейсы AI-копирайтинга для фриланса',
    ],
    mainSiteLinks: [
      { path: '/napravleniya/ai-copywriting', label: 'AI-копирайтинг: чеки и офферы', description: 'Главная страница по направлению с чеками, стеком и FAQ.' },
      { path: '/blog/zarabotok-na-chatgpt', label: '10 способов заработка на ChatGPT', description: 'Практические сценарии монетизации языковых моделей.' },
      { path: '/instrumenty/text-ai', label: 'Каталог AI-сервисов для текста', description: 'Сравнение инструментов для статей, постов и лендингов.' },
      { path: '/blog/pervyy-zakazchik-za-7-dney', label: 'Первый клиент за 7 дней', description: 'Шаблон первого оффера и маршрут к заявке.' },
    ],
  },
  'ai-design': {
    label: 'AI-дизайн и визуал',
    directionIds: [
      'ai-design',
      'ai-photo',
      'ai-video',
      'ai-marketing',
      'ai-sites',
      'ai-copywriting',
      'ai-voice',
      'ai-education',
      'ai-analytics',
      'ai-automation',
    ],
    toolCategoryIds: ['image-ai', 'video-ai', 'text-ai', 'code-ai', 'audio-ai', 'automation-ai'],
    audienceSlugs: ['designer', 'freelancer', 'marketer', 'business', 'student', 'mama', 'copywriter', 'developer'],
    seedKeywords: [
      'midjourney для заработка',
      'ai-дизайн для маркетплейсов',
      'визуалы для бизнеса нейросетями',
      'ai баннеры и креативы',
      'фото карточек товаров ai',
      'оформление соцсетей нейросетью',
      'дизайн лендинга на ai',
      'брендинг с помощью нейросетей',
    ],
    articleTopics: [
      'Как продавать AI-дизайн малому бизнесу',
      'Midjourney и Leonardo для коммерческих заказов',
      'Визуалы для маркетплейсов на потоке',
      'AI-креативы для таргета и SMM',
      'Лендинги и упаковка оффера с нейросетями',
      'Как дизайнеру увеличить чек с AI',
      'AI-фото и мокапы для карточек товаров',
      'Портфолио AI-дизайнера без агентства',
    ],
    mainSiteLinks: [
      { path: '/napravleniya/ai-design', label: 'AI-дизайн: услуги и цены', description: 'Основной хаб по AI-дизайну, брендингу и упаковке.' },
      { path: '/napravleniya/ai-photo', label: 'AI-фото для бизнеса', description: 'Сценарии для маркетплейсов, соцсетей и e-commerce.' },
      { path: '/blog/zarabotok-na-midjourney', label: 'Заработок на Midjourney', description: 'Как превратить генерацию визуала в услугу.' },
      { path: '/instrumenty/image-ai', label: 'Каталог AI для изображений', description: 'Сервисы для фото, баннеров и брендинга.' },
    ],
  },
  'ai-automation': {
    label: 'AI-автоматизация и агенты',
    directionIds: [
      'ai-automation',
      'ai-bots',
      'ai-analytics',
      'ai-sites',
      'ai-marketing',
      'ai-copywriting',
      'ai-education',
      'ai-translation',
      'ai-design',
      'ai-video',
    ],
    toolCategoryIds: ['automation-ai', 'code-ai', 'text-ai', 'video-ai', 'audio-ai', 'image-ai'],
    audienceSlugs: ['developer', 'business', 'freelancer', 'marketer', 'student', 'copywriter', 'designer', 'mama'],
    seedKeywords: [
      'ai автоматизация бизнеса',
      'ai агенты для отдела продаж',
      'n8n с chatgpt',
      'боты для обработки заявок',
      'автоматизация telegram и crm',
      'ai workflow для агентства',
      'make и zapier для ai',
      'автоматизация контента нейросетями',
    ],
    articleTopics: [
      'Как продавать AI-автоматизацию малому бизнесу',
      'AI-агенты для заявок, CRM и саппорта',
      'n8n, Make и LangChain в коммерческих проектах',
      'Чек-лист внедрения AI-автоматизации в отдел продаж',
      'Telegram-боты с AI как регулярная услуга',
      'Как собрать high-ticket оффер на AI-агента',
      'AI-автоматизация маркетинга и контента',
      'Переход от ручной услуги к AI-системе на подписке',
    ],
    mainSiteLinks: [
      { path: '/napravleniya/ai-automation', label: 'AI-автоматизация: high-ticket услуги', description: 'Главный хаб по внедрению AI в процессы бизнеса.' },
      { path: '/napravleniya/ai-bots', label: 'Чат-боты и AI-боты', description: 'Сценарии для продаж, поддержки и Telegram.' },
      { path: '/instrumenty/automation-ai', label: 'Инструменты для AI-автоматизации', description: 'n8n, Make, Zapier и другие платформы.' },
      { path: '/blog/chatgpt-dlya-biznesa', label: 'ChatGPT для бизнеса', description: 'Кейсы использования AI в воронках и процессах.' },
    ],
  },
  'ai-marketing': {
    label: 'AI-маркетинг и лидогенерация',
    directionIds: [
      'ai-marketing',
      'ai-copywriting',
      'ai-design',
      'ai-video',
      'ai-analytics',
      'ai-sites',
      'ai-bots',
      'ai-photo',
      'ai-automation',
      'ai-translation',
    ],
    toolCategoryIds: ['text-ai', 'image-ai', 'video-ai', 'automation-ai', 'code-ai', 'audio-ai'],
    audienceSlugs: ['marketer', 'business', 'freelancer', 'copywriter', 'designer', 'student', 'developer', 'mama'],
    seedKeywords: [
      'ai маркетинг для бизнеса',
      'ai лидогенерация',
      'нейросети для рекламы',
      'контент воронка на ai',
      'креативы для таргета нейросетью',
      'автоматизация smm ai',
      'ai аналитика рекламы',
      'telegram маркетинг с ai',
    ],
    articleTopics: [
      'Как продавать AI-маркетинг предпринимателям',
      'Нейросети для лидогенерации и прогрева',
      'AI-креативы и тексты для таргета',
      'Как собрать контент-воронку с AI',
      'AI-аналитика кампаний для агентства',
      'Продажи в Telegram и email с AI',
      'Маркетинговый мини-отдел на нейросетях',
      'Услуги AI-SMM и подписочная модель агентства',
    ],
    mainSiteLinks: [
      { path: '/napravleniya/ai-marketing', label: 'AI-маркетинг: услуги и спрос', description: 'Основной хаб по AI для рекламы, контента и лидогенерации.' },
      { path: '/instrumenty/text-ai', label: 'AI для текста и контента', description: 'Стек сервисов для воронок, постов и лендингов.' },
      { path: '/instrumenty/image-ai', label: 'AI для креативов', description: 'Инструменты для баннеров, карточек и рекламных материалов.' },
      { path: '/blog/ai-uslugi-dlya-biznesa', label: 'Какие AI-услуги продавать бизнесу', description: 'Пакеты услуг и коммерческие углы продаж.' },
    ],
  },
  'ai-video': {
    label: 'AI-видео и короткий контент',
    directionIds: [
      'ai-video',
      'ai-voice',
      'ai-design',
      'ai-photo',
      'ai-marketing',
      'ai-copywriting',
      'ai-sites',
      'ai-education',
      'ai-automation',
      'ai-analytics',
    ],
    toolCategoryIds: ['video-ai', 'audio-ai', 'image-ai', 'text-ai', 'automation-ai', 'code-ai'],
    audienceSlugs: ['designer', 'marketer', 'freelancer', 'business', 'student', 'copywriter', 'mama', 'developer'],
    seedKeywords: [
      'ai видео для бизнеса',
      'reels на нейросетях',
      'видеоаватары для продаж',
      'ozвучка видео ai',
      'короткие ролики для телеграм',
      'ai видео для маркетплейса',
      'контент-продакшн на ai',
      'нейросети для видеомонтажа',
    ],
    articleTopics: [
      'Как продавать AI-видео бизнесу и экспертам',
      'Reels, shorts и ads с помощью нейросетей',
      'Видеоаватары для прогрева и продаж',
      'AI-озвучка и дикторские пакеты услуг',
      'Как собрать поток производства видео на AI',
      'AI-видео для маркетплейсов и карточек товаров',
      'Портфолио видео-специалиста на нейросетях',
      'Какие AI-видео услуги проще всего монетизировать',
    ],
    mainSiteLinks: [
      { path: '/napravleniya/ai-video', label: 'AI-видео: сценарии и чеки', description: 'Основной хаб по роликам, рилсам и видеоаватарам.' },
      { path: '/napravleniya/ai-voice', label: 'AI-озвучка и аудио', description: 'Услуги по синтезу речи и звуковому оформлению.' },
      { path: '/instrumenty/video-ai', label: 'AI-сервисы для видео', description: 'Runway, HeyGen, Pika и другие инструменты.' },
      { path: '/instrumenty/audio-ai', label: 'AI-сервисы для озвучки', description: 'Стек сервисов для голоса, дубляжа и аудио.' },
    ],
  },
  'ai-business': {
    label: 'AI-услуги для бизнеса',
    directionIds: [
      'ai-automation',
      'ai-bots',
      'ai-marketing',
      'ai-copywriting',
      'ai-analytics',
      'ai-sites',
      'ai-design',
      'ai-video',
      'ai-photo',
      'ai-education',
    ],
    toolCategoryIds: ['automation-ai', 'text-ai', 'image-ai', 'video-ai', 'code-ai', 'audio-ai'],
    audienceSlugs: ['business', 'developer', 'marketer', 'freelancer', 'copywriter', 'designer', 'student', 'mama'],
    seedKeywords: [
      'ai услуги для бизнеса',
      'внедрение нейросетей в компанию',
      'ai отдел продаж',
      'ai для маркетинга и рекламы',
      'ai аналитика для малого бизнеса',
      'автоматизация бизнеса нейросетями',
      'чат-боты для лидов',
      'ai сопровождение бизнеса',
    ],
    articleTopics: [
      'Как продавать AI-услуги предпринимателям',
      'Внедрение нейросетей в малый и средний бизнес',
      'AI-сопровождение бизнеса на подписке',
      'Какие AI-услуги быстрее всего закрываются в продажу',
      'AI-воронка для отдела продаж и поддержки',
      'Как упаковать high-ticket предложение по AI',
      'Услуги под ключ: контент, автоматизация, боты',
      'Спрос на внедрение AI в РФ и СНГ',
    ],
    mainSiteLinks: [
      { path: '/blog/ai-uslugi-dlya-biznesa', label: 'AI-услуги для бизнеса', description: 'Главная статья по пакетам услуг и спросу со стороны компаний.' },
      { path: '/napravleniya/ai-automation', label: 'AI-автоматизация процессов', description: 'Подход к внедрению AI в отделы и процессы.' },
      { path: '/napravleniya/ai-bots', label: 'AI-боты и клиентский сервис', description: 'Сценарии ботов для лидов, записи и поддержки.' },
      { path: '/blog/chatgpt-dlya-biznesa', label: 'ChatGPT для бизнеса', description: 'Кейсы AI для бизнеса, маркетинга и операционки.' },
    ],
  },
  'ai-freelance': {
    label: 'AI-фриланс и первый доход',
    directionIds: [
      'ai-copywriting',
      'ai-photo',
      'ai-design',
      'ai-video',
      'ai-voice',
      'ai-sites',
      'ai-marketing',
      'ai-translation',
      'ai-bots',
      'ai-education',
    ],
    toolCategoryIds: ['text-ai', 'image-ai', 'video-ai', 'audio-ai', 'code-ai', 'automation-ai'],
    audienceSlugs: ['freelancer', 'student', 'mama', 'copywriter', 'designer', 'marketer', 'developer', 'business'],
    seedKeywords: [
      'как начать зарабатывать на ai',
      'ai фриланс без опыта',
      'первый клиент на нейросетях',
      'услуги на kwork с ai',
      'удаленная работа с chatgpt',
      'ai услуги для новичка',
      'фриланс на нейросетях 2026',
      'как упаковать ai оффер',
    ],
    articleTopics: [
      'Как новичку начать AI-фриланс без агентства',
      'Первые услуги на Kwork и Telegram с AI',
      'Как собрать оффер и портфолио за выходные',
      '7-дневный маршрут до первой заявки',
      'Как выбрать AI-направление под свои навыки',
      'AI-фриланс для копирайтеров, дизайнеров и мам в декрете',
      'Мини-стек инструментов для старта без вложений',
      'Что продавать первым клиентам в 2026 году',
    ],
    mainSiteLinks: [
      { path: '/blog/kak-nachat-zarabatyvat-na-ai', label: 'Как начать зарабатывать на AI', description: 'Пошаговый старт для новичка с выбором направления.' },
      { path: '/blog/pervyy-zakazchik-za-7-dney', label: 'Первый заказчик за 7 дней', description: 'Тактический маршрут до первой заявки.' },
      { path: '/dlya/freelancer', label: 'Гайд для фрилансеров', description: 'Подбор направлений и стека под AI-фриланс.' },
      { path: '/napravleniya', label: 'Все AI-направления', description: 'Каталог направлений с чеками, порогом входа и спросом.' },
    ],
  },
  'ai-education': {
    label: 'AI-обучение, гайды и инфопродукты',
    directionIds: [
      'ai-education',
      'ai-copywriting',
      'ai-marketing',
      'ai-sites',
      'ai-video',
      'ai-design',
      'ai-translation',
      'ai-voice',
      'ai-analytics',
      'ai-automation',
    ],
    toolCategoryIds: ['text-ai', 'video-ai', 'image-ai', 'audio-ai', 'code-ai', 'automation-ai'],
    audienceSlugs: ['student', 'business', 'freelancer', 'marketer', 'copywriter', 'designer', 'mama', 'developer'],
    seedKeywords: [
      'курс по нейросетям',
      'гайд по заработку на ai',
      'обучение chatgpt для бизнеса',
      'инфопродукт про нейросети',
      'вебинар по ai услугам',
      'платный гайд по ai',
      'обучение нейросетям для новичков',
      'как продавать ai гайды',
    ],
    articleTopics: [
      'Как запустить мини-курс по AI без продакшна',
      'Гайд, интенсив или подписка: что продавать в AI-образовании',
      'Как упаковать обучение по нейросетям',
      'Сценарии прогрева для AI-гайда',
      'AI-обучение для бизнеса и команд',
      'Как собрать первую линейку инфопродуктов по AI',
      'Контент-маркетинг для продажи AI-курсов',
      'Какие темы AI-образования продаются лучше всего',
    ],
    mainSiteLinks: [
      { path: '/napravleniya/ai-education', label: 'AI-обучение и инфопродукты', description: 'Основной хаб по созданию гайдов, курсов и обучающих продуктов.' },
      { path: '/blog/kak-zarabotat-na-neirosetiah', label: 'Полный гайд по заработку на нейросетях', description: 'Большой обзор направлений и моделей монетизации.' },
      { path: '/blog/passivnyy-dokhod-na-ai', label: 'Пассивный доход на AI', description: 'Подходы к шаблонам, гайд-продуктам и подпискам.' },
      { path: '/dlya/student', label: 'Гайд для студентов', description: 'Путь в AI с низким порогом входа и без команды.' },
    ],
  },
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function hashString(value) {
  return String(value)
    .split('')
    .reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) % 2147483647, 7);
}

function pickTemplateFamily(satelliteNumber = 1, niche = 'ai-business') {
  const familyIds = Object.keys(TEMPLATE_FAMILIES);
  const offset = hashString(niche) % familyIds.length;
  return familyIds[(Math.max(1, satelliteNumber) - 1 + offset) % familyIds.length];
}

function buildPageBudget(targetPages = 1000) {
  // Support up to 2000 pages per satellite for maximum traffic
  const requested = clamp(Number(targetPages) || 1000, 180, 2000);
  const estimatedStaticPages = 10;
  const audiences = 8;
  const toolCategories = 6;
  
  // Scale comparisons, periods, and articles based on target
  const comparisons = requested >= 800 ? 15 : requested >= 340 ? 10 : 8;
  const periods = requested >= 800 ? 6 : 4;
  const articles = requested >= 800 ? 30 : requested >= 340 ? 20 : 18;
  
  // NEW: Add glossary, tool comparisons, and problem pages
  const glossary = requested >= 800 ? 50 : requested >= 500 ? 30 : 0;
  const toolComparisons = requested >= 800 ? 100 : requested >= 500 ? 50 : 0;
  const problems = requested >= 800 ? 40 : requested >= 500 ? 20 : 0;

  // Scale directions and cities based on target, with higher limits
  let directions = clamp(Math.round(requested / 80), 8, 12);
  let cities = clamp(Math.round(requested / 8), 12, 120); // Up to 120 cities!

  const computeLongTail = () =>
    requested -
    estimatedStaticPages -
    audiences -
    toolCategories -
    comparisons -
    periods -
    articles -
    directions -
    directions * cities -
    glossary -
    toolComparisons -
    problems;

  let longTail = computeLongTail();

  // Prioritize long-tail pages: aim for 40-60% of total pages
  const targetLongTailMin = Math.floor(requested * 0.4);
  const targetLongTailMax = Math.floor(requested * 0.6);

  // Reduce cities if long-tail is too low
  while (longTail < targetLongTailMin && cities > 12) {
    cities -= 1;
    longTail = computeLongTail();
  }

  // Reduce directions if still too low
  while (longTail < targetLongTailMin && directions > 8) {
    directions -= 1;
    longTail = computeLongTail();
  }

  // Ensure minimum long-tail pages
  longTail = Math.max(targetLongTailMin, longTail);

  // Cap long-tail at maximum to leave room for other page types
  if (longTail > targetLongTailMax) {
    longTail = targetLongTailMax;
  }

  return {
    requestedPages: requested,
    estimatedStaticPages,
    directions,
    cities,
    audiences,
    toolCategories,
    comparisons,
    periods,
    articles,
    glossary,
    toolComparisons,
    problems,
    toolsPerCategory: requested >= 800 ? 12 : requested >= 340 ? 10 : 8,
    longTail,
    estimatedTotal:
      estimatedStaticPages +
      directions +
      directions * cities +
      audiences +
      toolCategories +
      comparisons +
      periods +
      articles +
      glossary +
      toolComparisons +
      problems +
      longTail,
  };
}

function getSemanticBlueprint(niche = 'ai-business') {
  return SEMANTIC_BLUEPRINTS[niche] || SEMANTIC_BLUEPRINTS['ai-business'];
}

module.exports = {
  TEMPLATE_FAMILIES,
  SEMANTIC_BLUEPRINTS,
  buildPageBudget,
  getSemanticBlueprint,
  pickTemplateFamily,
};
