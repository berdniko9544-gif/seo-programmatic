const yearMonths = [
  { name: "март 2026", slug: "mart-2026" },
  { name: "апрель 2026", slug: "aprel-2026" },
  { name: "май 2026", slug: "may-2026" },
  { name: "лето 2026", slug: "leto-2026" },
  { name: "2026", slug: "2026" },
];

const comparisonPairs = [
  { a: "ChatGPT", b: "Claude", slug: "chatgpt-vs-claude" },
  { a: "Midjourney", b: "DALL-E", slug: "midjourney-vs-dalle" },
  { a: "n8n", b: "Make.com", slug: "n8n-vs-make" },
  { a: "Cursor", b: "GitHub Copilot", slug: "cursor-vs-copilot" },
  { a: "ElevenLabs", b: "Play.ht", slug: "elevenlabs-vs-playht" },
  { a: "Runway", b: "Pika", slug: "runway-vs-pika" },
  { a: "HeyGen", b: "Synthesia", slug: "heygen-vs-synthesia" },
  { a: "Leonardo AI", b: "Midjourney", slug: "leonardo-vs-midjourney" },
  { a: "YandexGPT", b: "GigaChat", slug: "yandexgpt-vs-gigachat" },
  { a: "v0.dev", b: "Bolt.new", slug: "v0-vs-bolt" },
];

const howToArticles = [
  {
    slug: "kak-zarabotat-na-neirosetiah",
    title: "Как заработать на нейросетях в 2026 году",
    h1: "Как заработать на нейросетях: полный гайд 2026",
    desc: "12 проверенных способов заработка на нейросетях в 2026 году. Пошаговые инструкции и реальные кейсы.",
    readTime: "15 мин"
  },
  {
    slug: "kak-nachat-zarabatyvat-na-ai",
    title: "Как начать зарабатывать на AI с нуля",
    h1: "Как начать зарабатывать на AI с нуля в 2026",
    desc: "Пошаговый план для новичков: от выбора направления до первого заказа за 7 дней.",
    readTime: "12 мин"
  },
  {
    slug: "skolko-zarabatyvayut-na-neirosetiah",
    title: "Сколько зарабатывают на нейросетях в 2026",
    h1: "Сколько реально зарабатывают на нейросетях?",
    desc: "Реальные цифры дохода по 12 направлениям AI-монетизации. Средние чеки и потолки.",
    readTime: "10 мин"
  },
  {
    slug: "luchshie-neiroset-dlya-zarabotka",
    title: "Лучшие нейросети для заработка 2026",
    h1: "Топ нейросетей для заработка в 2026 году",
    desc: "Рейтинг лучших нейросетей для заработка денег: от текста до видео.",
    readTime: "18 мин"
  },
  {
    slug: "zarabotok-na-chatgpt",
    title: "Заработок на ChatGPT в 2026 — 10 способов",
    h1: "10 способов заработка на ChatGPT в 2026",
    desc: "Как зарабатывать на ChatGPT: от копирайтинга до создания AI-агентов. Реальные примеры и цены.",
    readTime: "14 мин"
  },
  {
    slug: "zarabotok-na-midjourney",
    title: "Заработок на Midjourney в 2026 — гайд",
    h1: "Как зарабатывать на Midjourney: полный гайд",
    desc: "Фото для бизнеса, принты, NFT, дизайн — как монетизировать навык генерации в Midjourney.",
    readTime: "16 мин"
  },
  {
    slug: "udalennaya-rabota-na-ai",
    title: "Удалённая работа на AI — вакансии и фриланс 2026",
    h1: "Удалённая работа на AI: как найти клиентов",
    desc: "Где искать заказы на AI-услуги: фриланс-биржи, Telegram, LinkedIn, холодные продажи.",
    readTime: "11 мин"
  },
  {
    slug: "ai-uslugi-dlya-biznesa",
    title: "AI-услуги для бизнеса — что предложить клиентам",
    h1: "Какие AI-услуги продавать бизнесу в 2026",
    desc: "Топ-12 AI-услуг, которые нужны бизнесу: боты, контент, аналитика, автоматизация.",
    readTime: "13 мин"
  },
  {
    slug: "pervyy-zakazchik-za-7-dney",
    title: "Первый заказчик за 7 дней — план действий",
    h1: "Как найти первого клиента на AI-услуги за 7 дней",
    desc: "Пошаговый чек-лист: оффер, портфолио, площадки, первое обращение, закрытие сделки.",
    readTime: "9 мин"
  },
  {
    slug: "juridicheskie-riski-ai",
    title: "Юридические риски работы с AI в РФ 2026",
    h1: "Юридические риски при работе с AI в России",
    desc: "Deepfake, авторские права, персональные данные — что нужно знать при коммерческом использовании AI.",
    readTime: "12 мин"
  },
  {
    slug: "chatgpt-dlya-biznesa",
    title: "ChatGPT для бизнеса — применение и кейсы 2026",
    h1: "ChatGPT для бизнеса: 15 применений в 2026",
    desc: "Как бизнесу использовать ChatGPT: от клиентского сервиса до аналитики. Кейсы из РФ/СНГ.",
    readTime: "17 мин"
  },
  {
    slug: "neirosetvye-professii-2026",
    title: "Нейросетевые профессии 2026 — кем работать",
    h1: "Новые профессии в сфере AI: кем работать в 2026",
    desc: "AI-дизайнер, промпт-инженер, AI-маркетолог — какие профессии будут востребованы.",
    readTime: "14 мин"
  },
  {
    slug: "passivnyy-dokhod-na-ai",
    title: "Пассивный доход на AI — реально ли в 2026",
    h1: "Пассивный доход на нейросетях: что работает",
    desc: "Инфопродукты, шаблоны, SaaS, бот-бизнес — какие модели пассивного дохода реальны.",
    readTime: "11 мин"
  },
  {
    slug: "prompt-inzhenering-zarabotok",
    title: "Промпт-инженеринг — как зарабатывать 2026",
    h1: "Промпт-инженеринг: навык для заработка в 2026",
    desc: "Что такое промпт-инженеринг, кому нужен и сколько платят. Как освоить за 2 недели.",
    readTime: "10 мин"
  },
  {
    slug: "ai-dlya-marketpleysa",
    title: "AI для маркетплейса — фото, тексты, аналитика",
    h1: "AI для маркетплейсов: автоматизация продаж",
    desc: "Как использовать нейросети для Wildberries и Ozon: фото товаров, описания, аналитика.",
    readTime: "15 мин"
  },
];

module.exports = { yearMonths, comparisonPairs, howToArticles };
