# 🚀 QUICK START — Автоматизация сателлитов

## Для владельцев Vercel Pro с существующими сателлитами

### Шаг 1: Мигрируйте существующие сателлиты

```bash
# Укажите путь к вашим сателлитам
npm run satellite:migrate-all -- --dir /path/to/your/satellites
```

Это обновит все ваши сателлиты на новую модульную архитектуру:
- ✅ Разделит данные на модули (directions, locations, tools, content)
- ✅ Добавит RSS-ленту
- ✅ Добавит Performance monitoring
- ✅ Улучшит SEO (structured data, sitemap)
- ✅ Создаст бэкап старых данных

### Шаг 2: Пересоберите и задеплойте

```bash
# Автоматическая сборка всех сателлитов
npm run satellite:build-all

# Автоматический деплой на Vercel
npm run satellite:deploy-all
```

### Шаг 3: Отправьте в поисковики

```bash
npm run satellite:submit-seo
```

---

## Создание новых сателлитов

### Вариант 1: Полный автоматический цикл

```bash
# Создать 20 сателлитов → собрать → задеплоить → отправить в SEO
npm run satellite:master -- --generate 20 --niche crypto --pages 500
```

### Вариант 2: Пошаговый контроль

```bash
# Шаг 1: Генерация
npm run satellite:batch -- --count 20 --niche crypto --pages 500

# Шаг 2: Сборка
npm run satellite:build-all

# Шаг 3: Деплой
npm run satellite:deploy-all

# Шаг 4: SEO
npm run satellite:submit-seo
```

---

## Настройка (один раз)

### 1. Установите Vercel CLI

```bash
npm install -g vercel
```

### 2. Получите Vercel токен

1. Откройте https://vercel.com/account/tokens
2. Создайте новый токен
3. Экспортируйте:

```bash
export VERCEL_TOKEN=your_token_here
```

### 3. (Опционально) Настройте Vercel Team

Для Vercel Pro аккаунтов:

```bash
export VERCEL_TEAM=team_xxxxxxxxxxxxx
```

---

## Доступные ниши

- `crypto` — Криптовалюты и блокчейн
- `fitness` — Фитнес и здоровье
- `education` — Онлайн-образование
- `realestate` — Недвижимость
- `random` — Случайная ниша для каждого сателлита

---

## Примеры команд

### Создать 5 сателлитов по фитнесу

```bash
npm run satellite:master -- --generate 5 --niche fitness --pages 1000
```

### Создать 20 сателлитов (разные ниши)

```bash
npm run satellite:master -- --generate 20 --niche random --pages 500
```

### Только деплой (без генерации)

```bash
npm run satellite:master -- --deploy-only
```

### Мигрировать один сателлит

```bash
npm run satellite:migrate -- --path /path/to/satellite
```

---

## Структура после генерации

```
../satellites/
├── crypto-1234567890-0/
│   ├── src/
│   │   ├── data/
│   │   │   ├── directions.js    # 5 направлений
│   │   │   ├── locations.js     # 50 городов
│   │   │   ├── tools.js         # 120 инструментов
│   │   │   └── content.js       # 30 статей
│   │   └── ...
│   ├── out/                     # 500+ HTML страниц
│   └── package.json
├── fitness-1234567891-1/
├── education-1234567892-2/
└── ...
```

---

## Логи и мониторинг

Все логи сохраняются в `../satellites/`:

- `batch-log.json` — Лог генерации
- `migration-log.json` — Лог миграции
- `build-log.json` — Лог сборки
- `deploy-log.json` — Лог деплоя
- `seo-submission-log.json` — Лог SEO
- `urls.txt` — Список всех URL

---

## Vercel Pro оптимизация

✅ **Бесплатные домены** — используйте `*.vercel.app`
✅ **Unlimited deployments** — деплойте сколько угодно
✅ **100 GB bandwidth/месяц** — достаточно для старта

### Рекомендации:

1. Начните с 5-10 сателлитов
2. Проверьте индексацию: `site:your-domain.vercel.app`
3. Если работает → масштабируйте до 20+
4. Покупайте домены только для успешных сателлитов

---

## Важно ⚠️

### Качество контента

- ✅ Уникальный контент для каждой страницы
- ✅ Минимум 500 слов на важных страницах
- ❌ Не копируйте контент с других сайтов
- ❌ Не используйте спин-контент

### Скорость генерации

- ✅ Постепенное масштабирование (5 → 10 → 20)
- ✅ Разные ниши и структуры
- ❌ Не создавайте 100+ сателлитов за день
- ❌ Не используйте одинаковый контент

---

## Полная документация

- `AUTOMATION.md` — Подробное руководство по автоматизации
- `README.md` — Общая информация о проекте
- `DEPLOYMENT.md` — Инструкция по деплою
- `BUILD_SUMMARY.md` — Результаты сборки

---

## Поддержка

Вопросы:
- Telegram: [@Inside1mb3](https://t.me/Inside1mb3)
- Instagram: [@inside1mb3](https://www.instagram.com/inside1mb3)

---

**Готово к масштабированию! 🚀**
