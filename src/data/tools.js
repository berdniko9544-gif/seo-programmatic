const toolCategories = [
  {
    id: "text-ai",
    name: "Нейросети для текста",
    icon: "✍️",
    tools: [
      { name: "ChatGPT", desc: "Универсальная языковая модель от OpenAI", category: "Текст", pricing: "Бесплатно / $20 мес", url: "https://chat.openai.com", rating: 5 },
      { name: "Claude", desc: "AI-ассистент от Anthropic с большим контекстом", category: "Текст", pricing: "Бесплатно / $20 мес", url: "https://claude.ai", rating: 5 },
      { name: "YandexGPT", desc: "Российская языковая модель от Яндекса", category: "Текст", pricing: "Бесплатно (ограниченно)", url: "https://ya.ru", rating: 4 },
      { name: "GigaChat", desc: "AI от Сбера для русскоязычных задач", category: "Текст", pricing: "Бесплатно (ограниченно)", url: "https://gigachat.sber.ru", rating: 4 },
      { name: "Jasper AI", desc: "AI для маркетинговых текстов и контент-маркетинга", category: "Текст", pricing: "$49/мес", url: "https://jasper.ai", rating: 4 },
      { name: "Copy.ai", desc: "Генерация рекламных текстов и копирайтинг", category: "Текст", pricing: "Бесплатно / $49 мес", url: "https://copy.ai", rating: 4 },
      { name: "Rytr", desc: "Бюджетный AI-копирайтер для небольших задач", category: "Текст", pricing: "Бесплатно / $9 мес", url: "https://rytr.me", rating: 3 },
      { name: "Writesonic", desc: "AI для SEO-статей и блогов", category: "Текст", pricing: "$16/мес", url: "https://writesonic.com", rating: 4 },
    ]
  },
  {
    id: "image-ai",
    name: "Нейросети для изображений",
    icon: "🖼️",
    tools: [
      { name: "Midjourney", desc: "Лучшая нейросеть для генерации художественных изображений", category: "Изображения", pricing: "$10/мес", url: "https://midjourney.com", rating: 5 },
      { name: "DALL-E 3", desc: "Генерация изображений от OpenAI внутри ChatGPT", category: "Изображения", pricing: "Включено в ChatGPT Plus", url: "https://openai.com/dall-e-3", rating: 5 },
      { name: "Stable Diffusion", desc: "Open-source модель для генерации изображений", category: "Изображения", pricing: "Бесплатно (self-hosted)", url: "https://stability.ai", rating: 4 },
      { name: "Leonardo AI", desc: "AI для генерации и редактирования изображений", category: "Изображения", pricing: "Бесплатно / $12 мес", url: "https://leonardo.ai", rating: 5 },
      { name: "Ideogram", desc: "Нейросеть с хорошей работой с текстом на изображениях", category: "Изображения", pricing: "Бесплатно / $8 мес", url: "https://ideogram.ai", rating: 4 },
      { name: "Adobe Firefly", desc: "AI от Adobe для коммерческой генерации изображений", category: "Изображения", pricing: "Включено в Creative Cloud", url: "https://firefly.adobe.com", rating: 4 },
      { name: "Canva AI", desc: "Встроенный AI в популярном дизайн-редакторе", category: "Изображения", pricing: "Бесплатно / Pro $13 мес", url: "https://canva.com", rating: 4 },
      { name: "Flux", desc: "Новая open-source модель для генерации изображений", category: "Изображения", pricing: "Бесплатно", url: "https://flux.ai", rating: 4 },
    ]
  },
  {
    id: "video-ai",
    name: "Нейросети для видео",
    icon: "🎬",
    tools: [
      { name: "Runway ML", desc: "Профессиональная генерация и редактирование видео", category: "Видео", pricing: "Бесплатно / $15 мес", url: "https://runway.ml", rating: 5 },
      { name: "Pika Labs", desc: "Генерация видео из текста и изображений", category: "Видео", pricing: "Бесплатно / $10 мес", url: "https://pika.art", rating: 4 },
      { name: "HeyGen", desc: "Видео-аватары и AI-презентации", category: "Видео", pricing: "$24/мес", url: "https://heygen.com", rating: 5 },
      { name: "Synthesia", desc: "Создание видео с AI-аватарами для бизнеса", category: "Видео", pricing: "$22/мес", url: "https://synthesia.io", rating: 5 },
      { name: "CapCut AI", desc: "Бесплатный видеоредактор с AI-функциями", category: "Видео", pricing: "Бесплатно", url: "https://capcut.com", rating: 4 },
      { name: "Sora", desc: "Модель генерации видео от OpenAI", category: "Видео", pricing: "Включено в ChatGPT Plus", url: "https://openai.com/sora", rating: 5 },
      { name: "Luma Dream Machine", desc: "Генерация 3D-видео и анимации", category: "Видео", pricing: "Бесплатно / $30 мес", url: "https://lumalabs.ai", rating: 4 },
    ]
  },
  {
    id: "audio-ai",
    name: "Нейросети для аудио",
    icon: "🎵",
    tools: [
      { name: "ElevenLabs", desc: "Лучший AI для синтеза речи и клонирования голоса", category: "Аудио", pricing: "Бесплатно / $5 мес", url: "https://elevenlabs.io", rating: 5 },
      { name: "Play.ht", desc: "Озвучка текста AI-голосами", category: "Аудио", pricing: "$31/мес", url: "https://play.ht", rating: 4 },
      { name: "Murf AI", desc: "Профессиональная AI-озвучка", category: "Аудио", pricing: "$26/мес", url: "https://murf.ai", rating: 4 },
      { name: "Suno AI", desc: "Генерация музыки и песен нейросетью", category: "Аудио", pricing: "Бесплатно / $10 мес", url: "https://suno.com", rating: 5 },
      { name: "Udio", desc: "AI-генерация музыки высокого качества", category: "Аудио", pricing: "Бесплатно / $10 мес", url: "https://udio.com", rating: 4 },
    ]
  },
  {
    id: "automation-ai",
    name: "Автоматизация и AI-агенты",
    icon: "⚙️",
    tools: [
      { name: "n8n", desc: "Open-source платформа автоматизации с AI", category: "Автоматизация", pricing: "Бесплатно (self-hosted)", url: "https://n8n.io", rating: 5 },
      { name: "Make.com", desc: "Визуальная автоматизация бизнес-процессов", category: "Автоматизация", pricing: "Бесплатно / $9 мес", url: "https://make.com", rating: 5 },
      { name: "Zapier AI", desc: "Автоматизация с AI-функциями", category: "Автоматизация", pricing: "$20/мес", url: "https://zapier.com", rating: 4 },
      { name: "LangChain", desc: "Фреймворк для создания AI-агентов", category: "Автоматизация", pricing: "Бесплатно (open-source)", url: "https://langchain.com", rating: 5 },
      { name: "CrewAI", desc: "Мультиагентные AI-системы", category: "Автоматизация", pricing: "Бесплатно (open-source)", url: "https://crewai.com", rating: 4 },
    ]
  },
  {
    id: "code-ai",
    name: "AI для разработки",
    icon: "💻",
    tools: [
      { name: "Cursor", desc: "AI-редактор кода нового поколения", category: "Код", pricing: "Бесплатно / $20 мес", url: "https://cursor.sh", rating: 5 },
      { name: "GitHub Copilot", desc: "AI-помощник для написания кода", category: "Код", pricing: "$10/мес", url: "https://github.com/features/copilot", rating: 5 },
      { name: "v0.dev", desc: "Генерация UI-компонентов от Vercel", category: "Код", pricing: "Бесплатно", url: "https://v0.dev", rating: 4 },
      { name: "Bolt.new", desc: "Генерация полных веб-приложений по описанию", category: "Код", pricing: "Бесплатно", url: "https://bolt.new", rating: 4 },
      { name: "Replit AI", desc: "Онлайн-среда разработки с AI", category: "Код", pricing: "Бесплатно / $25 мес", url: "https://replit.com", rating: 4 },
    ]
  }
];

module.exports = { toolCategories };
