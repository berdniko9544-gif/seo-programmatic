/**
 * EXTENDED CITIES LIST - 120 cities for maximum geographic coverage
 * Covers all major cities in Russia and CIS countries
 */

const extendedCities = [
  // Миллионники (15 городов)
  { name: "Москва", slug: "moskva", region: "Центральный", population: "12.7M", priority: 1.0 },
  { name: "Санкт-Петербург", slug: "spb", region: "Северо-Западный", population: "5.6M", priority: 1.0 },
  { name: "Новосибирск", slug: "novosibirsk", region: "Сибирский", population: "1.6M", priority: 0.9 },
  { name: "Екатеринбург", slug: "ekaterinburg", region: "Уральский", population: "1.5M", priority: 0.9 },
  { name: "Казань", slug: "kazan", region: "Приволжский", population: "1.3M", priority: 0.9 },
  { name: "Нижний Новгород", slug: "nizhniy-novgorod", region: "Приволжский", population: "1.2M", priority: 0.9 },
  { name: "Челябинск", slug: "chelyabinsk", region: "Уральский", population: "1.2M", priority: 0.9 },
  { name: "Самара", slug: "samara", region: "Приволжский", population: "1.1M", priority: 0.9 },
  { name: "Омск", slug: "omsk", region: "Сибирский", population: "1.1M", priority: 0.9 },
  { name: "Ростов-на-Дону", slug: "rostov", region: "Южный", population: "1.1M", priority: 0.9 },
  { name: "Уфа", slug: "ufa", region: "Приволжский", population: "1.1M", priority: 0.9 },
  { name: "Красноярск", slug: "krasnoyarsk", region: "Сибирский", population: "1.1M", priority: 0.9 },
  { name: "Воронеж", slug: "voronezh", region: "Центральный", population: "1.0M", priority: 0.9 },
  { name: "Пермь", slug: "perm", region: "Приволжский", population: "1.0M", priority: 0.9 },
  { name: "Волгоград", slug: "volgograd", region: "Южный", population: "1.0M", priority: 0.9 },

  // 500K+ (25 городов)
  { name: "Краснодар", slug: "krasnodar", region: "Южный", population: "1.0M", priority: 0.85 },
  { name: "Саратов", slug: "saratov", region: "Приволжский", population: "850K", priority: 0.8 },
  { name: "Тюмень", slug: "tyumen", region: "Уральский", population: "820K", priority: 0.8 },
  { name: "Тольятти", slug: "tolyatti", region: "Приволжский", population: "700K", priority: 0.8 },
  { name: "Ижевск", slug: "izhevsk", region: "Приволжский", population: "650K", priority: 0.8 },
  { name: "Барнаул", slug: "barnaul", region: "Сибирский", population: "630K", priority: 0.8 },
  { name: "Ульяновск", slug: "ulyanovsk", region: "Приволжский", population: "620K", priority: 0.8 },
  { name: "Иркутск", slug: "irkutsk", region: "Сибирский", population: "620K", priority: 0.8 },
  { name: "Хабаровск", slug: "khabarovsk", region: "Дальневосточный", population: "610K", priority: 0.8 },
  { name: "Ярославль", slug: "yaroslavl", region: "Центральный", population: "610K", priority: 0.8 },
  { name: "Владивосток", slug: "vladivostok", region: "Дальневосточный", population: "600K", priority: 0.8 },
  { name: "Махачкала", slug: "makhachkala", region: "Северо-Кавказский", population: "600K", priority: 0.75 },
  { name: "Томск", slug: "tomsk", region: "Сибирский", population: "580K", priority: 0.8 },
  { name: "Оренбург", slug: "orenburg", region: "Приволжский", population: "570K", priority: 0.75 },
  { name: "Кемерово", slug: "kemerovo", region: "Сибирский", population: "560K", priority: 0.75 },
  { name: "Новокузнецк", slug: "novokuznetsk", region: "Сибирский", population: "550K", priority: 0.75 },
  { name: "Рязань", slug: "ryazan", region: "Центральный", population: "540K", priority: 0.75 },
  { name: "Астрахань", slug: "astrakhan", region: "Южный", population: "530K", priority: 0.75 },
  { name: "Набережные Челны", slug: "naberezhnye-chelny", region: "Приволжский", population: "530K", priority: 0.75 },
  { name: "Пенза", slug: "penza", region: "Приволжский", population: "520K", priority: 0.75 },
  { name: "Киров", slug: "kirov", region: "Приволжский", population: "520K", priority: 0.75 },
  { name: "Липецк", slug: "lipetsk", region: "Центральный", population: "510K", priority: 0.75 },
  { name: "Чебоксары", slug: "cheboksary", region: "Приволжский", population: "500K", priority: 0.75 },
  { name: "Калининград", slug: "kaliningrad", region: "Северо-Западный", population: "490K", priority: 0.75 },
  { name: "Тула", slug: "tula", region: "Центральный", population: "480K", priority: 0.75 },

  // 250K-500K (40 городов)
  { name: "Курск", slug: "kursk", region: "Центральный", population: "450K", priority: 0.7 },
  { name: "Сочи", slug: "sochi", region: "Южный", population: "440K", priority: 0.75 },
  { name: "Ставрополь", slug: "stavropol", region: "Северо-Кавказский", population: "430K", priority: 0.7 },
  { name: "Улан-Удэ", slug: "ulan-ude", region: "Сибирский", population: "430K", priority: 0.7 },
  { name: "Тверь", slug: "tver", region: "Центральный", population: "420K", priority: 0.7 },
  { name: "Магнитогорск", slug: "magnitogorsk", region: "Уральский", population: "410K", priority: 0.7 },
  { name: "Иваново", slug: "ivanovo", region: "Центральный", population: "400K", priority: 0.7 },
  { name: "Брянск", slug: "bryansk", region: "Центральный", population: "400K", priority: 0.7 },
  { name: "Белгород", slug: "belgorod", region: "Центральный", population: "390K", priority: 0.7 },
  { name: "Сургут", slug: "surgut", region: "Уральский", population: "380K", priority: 0.7 },
  { name: "Владимир", slug: "vladimir", region: "Центральный", population: "360K", priority: 0.7 },
  { name: "Нижний Тагил", slug: "nizhniy-tagil", region: "Уральский", population: "350K", priority: 0.7 },
  { name: "Архангельск", slug: "arkhangelsk", region: "Северо-Западный", population: "350K", priority: 0.7 },
  { name: "Чита", slug: "chita", region: "Сибирский", population: "340K", priority: 0.7 },
  { name: "Калуга", slug: "kaluga", region: "Центральный", population: "340K", priority: 0.7 },
  { name: "Смоленск", slug: "smolensk", region: "Центральный", population: "330K", priority: 0.7 },
  { name: "Волжский", slug: "volzhskiy", region: "Южный", population: "320K", priority: 0.65 },
  { name: "Курган", slug: "kurgan", region: "Уральский", population: "310K", priority: 0.65 },
  { name: "Череповец", slug: "cherepovets", region: "Северо-Западный", population: "310K", priority: 0.65 },
  { name: "Орёл", slug: "orel", region: "Центральный", population: "310K", priority: 0.65 },
  { name: "Вологда", slug: "vologda", region: "Северо-Западный", population: "310K", priority: 0.65 },
  { name: "Владикавказ", slug: "vladikavkaz", region: "Северо-Кавказский", population: "300K", priority: 0.65 },
  { name: "Саранск", slug: "saransk", region: "Приволжский", population: "300K", priority: 0.65 },
  { name: "Тамбов", slug: "tambov", region: "Центральный", population: "290K", priority: 0.65 },
  { name: "Стерлитамак", slug: "sterlitamak", region: "Приволжский", population: "280K", priority: 0.65 },
  { name: "Грозный", slug: "groznyy", region: "Северо-Кавказский", population: "280K", priority: 0.65 },
  { name: "Кострома", slug: "kostroma", region: "Центральный", population: "280K", priority: 0.65 },
  { name: "Петрозаводск", slug: "petrozavodsk", region: "Северо-Западный", population: "280K", priority: 0.65 },
  { name: "Нижневартовск", slug: "nizhnevartovsk", region: "Уральский", population: "270K", priority: 0.65 },
  { name: "Йошкар-Ола", slug: "yoshkar-ola", region: "Приволжский", population: "270K", priority: 0.65 },
  { name: "Новороссийск", slug: "novorossiysk", region: "Южный", population: "270K", priority: 0.65 },
  { name: "Комсомольск-на-Амуре", slug: "komsomolsk-na-amure", region: "Дальневосточный", population: "250K", priority: 0.65 },
  { name: "Таганрог", slug: "taganrog", region: "Южный", population: "250K", priority: 0.65 },
  { name: "Сыктывкар", slug: "syktyvkar", region: "Северо-Западный", population: "250K", priority: 0.65 },
  { name: "Нальчик", slug: "nalchik", region: "Северо-Кавказский", population: "240K", priority: 0.65 },
  { name: "Шахты", slug: "shakhty", region: "Южный", population: "240K", priority: 0.65 },
  { name: "Дзержинск", slug: "dzerzhinsk", region: "Приволжский", population: "230K", priority: 0.65 },
  { name: "Братск", slug: "bratsk", region: "Сибирский", population: "230K", priority: 0.65 },
  { name: "Орск", slug: "orsk", region: "Приволжский", population: "230K", priority: 0.65 },
  { name: "Ангарск", slug: "angarsk", region: "Сибирский", population: "220K", priority: 0.65 },

  // СНГ (20 городов)
  { name: "Алматы", slug: "almaty", region: "Казахстан", population: "2.0M", priority: 0.85 },
  { name: "Ташкент", slug: "tashkent", region: "Узбекистан", population: "2.9M", priority: 0.85 },
  { name: "Минск", slug: "minsk", region: "Беларусь", population: "2.0M", priority: 0.85 },
  { name: "Киев", slug: "kiev", region: "Украина", population: "3.0M", priority: 0.8 },
  { name: "Баку", slug: "baku", region: "Азербайджан", population: "2.3M", priority: 0.8 },
  { name: "Ереван", slug: "yerevan", region: "Армения", population: "1.1M", priority: 0.8 },
  { name: "Бишкек", slug: "bishkek", region: "Киргизия", population: "1.0M", priority: 0.75 },
  { name: "Душанбе", slug: "dushanbe", region: "Таджикистан", population: "900K", priority: 0.75 },
  { name: "Астана", slug: "astana", region: "Казахстан", population: "1.2M", priority: 0.8 },
  { name: "Шымкент", slug: "shymkent", region: "Казахстан", population: "1.0M", priority: 0.75 },
  { name: "Самарканд", slug: "samarkand", region: "Узбекистан", population: "550K", priority: 0.7 },
  { name: "Гомель", slug: "gomel", region: "Беларусь", population: "510K", priority: 0.7 },
  { name: "Харьков", slug: "kharkov", region: "Украина", population: "1.4M", priority: 0.75 },
  { name: "Одесса", slug: "odessa", region: "Украина", population: "1.0M", priority: 0.75 },
  { name: "Днепр", slug: "dnepr", region: "Украина", population: "980K", priority: 0.75 },
  { name: "Львов", slug: "lvov", region: "Украина", population: "720K", priority: 0.75 },
  { name: "Гянджа", slug: "ganja", region: "Азербайджан", population: "330K", priority: 0.7 },
  { name: "Гюмри", slug: "gyumri", region: "Армения", population: "120K", priority: 0.65 },
  { name: "Ош", slug: "osh", region: "Киргизия", population: "300K", priority: 0.7 },
  { name: "Худжанд", slug: "khujand", region: "Таджикистан", population: "180K", priority: 0.65 },
];

// Keep original audiences
const audiences = [
  {
    name: "фрилансеры",
    slug: "freelancer",
    desc: "Гайд адаптирован для фрилансеров: быстрый старт, поиск клиентов, упаковка оффера.",
    icon: "💼",
    benefits: ["Быстрый старт без вложений", "Поиск первых клиентов за 7 дней", "Готовые шаблоны для оффера"]
  },
  {
    name: "предприниматели",
    slug: "business",
    desc: "Гайд для предпринимателей: внедрение AI в бизнес, автоматизация, масштабирование.",
    icon: "🚀",
    benefits: ["Автоматизация бизнес-процессов", "Снижение затрат на персонал", "Масштабирование с AI"]
  },
  {
    name: "студенты",
    slug: "student",
    desc: "Гайд для студентов: минимальные вложения, первые деньги на AI, совмещение с учёбой.",
    icon: "🎓",
    benefits: ["Старт без вложений", "Гибкий график работы", "Навыки для будущей карьеры"]
  },
  {
    name: "мамы в декрете",
    slug: "mama",
    desc: "Гайд для мам в декрете: удалённая работа, гибкий график, доход без офиса.",
    icon: "👶",
    benefits: ["Работа из дома", "Свободный график", "Доход от 30 000 ₽/мес"]
  },
  {
    name: "дизайнеры",
    slug: "designer",
    desc: "Гайд для дизайнеров: усиление навыков с AI, новые услуги, рост дохода.",
    icon: "🎨",
    benefits: ["Ускорение работы в 5-10 раз", "Новые услуги и ниши", "Рост среднего чека"]
  },
  {
    name: "маркетологи",
    slug: "marketer",
    desc: "Гайд для маркетологов: AI-инструменты для контента, рекламы, аналитики.",
    icon: "📊",
    benefits: ["Автоматизация контента", "AI-аналитика и прогнозы", "Креативы за минуты"]
  },
  {
    name: "программисты",
    slug: "developer",
    desc: "Гайд для разработчиков: AI-боты, автоматизация, SaaS на базе нейросетей.",
    icon: "💻",
    benefits: ["Высокие чеки от 50 000 ₽", "Создание AI-продуктов", "Пассивный доход на SaaS"]
  },
  {
    name: "копирайтеры",
    slug: "copywriter",
    desc: "Гайд для копирайтеров: ускорение работы в 5–10 раз, новые форматы и услуги.",
    icon: "✍️",
    benefits: ["Работа в 10 раз быстрее", "Больше проектов = больше дохода", "Новые форматы контента"]
  },
];

module.exports = { 
  extendedCities,
  cities: extendedCities, // Alias for compatibility
  audiences 
};
