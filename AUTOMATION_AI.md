# 🤖 AUTOMATION SETUP GUIDE

## ✅ Что реализовано

Полная автоматизация с AI-генерацией контента:

- ✅ **20 сателлитов ежедневно** (автоматически через GitHub Actions)
- ✅ **1000 страниц на сателлит** (AI-генерация через DeepSeek)
- ✅ **ISR (Incremental Static Regeneration)** — контент обновляется каждые 6 часов
- ✅ **Автоматическое SEO продвижение** (Google + Яндекс)
- ✅ **Уникальный контент** (каждая страница генерируется AI)

---

## 🚀 Быстрый старт

### Шаг 1: Настройка GitHub Secrets

Добавьте секреты в ваш GitHub репозиторий:

**Settings → Secrets and variables → Actions → New repository secret**

**Обязательные:**
```
DEEPSEEK_API_KEY = sk-0745998fd651417cb649a864d5f427de
VERCEL_TOKEN = your_vercel_token
VERCEL_TEAM = your_team_id (если Vercel Pro)
REVALIDATE_SECRET = random_secret_string
```

**Опциональные (для SEO):**
```
YANDEX_WEBMASTER_TOKEN = your_token
YANDEX_USER_ID = your_user_id
```

### Шаг 2: Получите Vercel Token

```bash
# 1. Откройте https://vercel.com/account/tokens
# 2. Create Token → Full Account
# 3. Скопируйте токен
# 4. Добавьте в GitHub Secrets как VERCEL_TOKEN
```

### Шаг 3: Сгенерируйте Revalidation Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Скопируйте результат и добавьте в GitHub Secrets как REVALIDATE_SECRET
```

### Шаг 4: Активируйте GitHub Actions

```bash
# Закоммитьте и запушьте изменения
git add .
git commit -m "feat: Add AI-powered automation with ISR"
git push origin main

# GitHub Actions автоматически запустятся
```

---

## 📅 Автоматические процессы

### 1. Ежедневная генерация (3:00 UTC)

**Workflow:** `.github/workflows/daily-generation.yml`

**Что происходит:**
- Генерируется 20 новых сателлитов
- Каждый с 1000 уникальными страницами
- AI генерирует контент через DeepSeek
- Автоматическая сборка и деплой на Vercel
- Отправка sitemap в Google/Яндекс

**Результат:** 20,000 новых страниц каждый день

### 2. ISR обновление (каждые 6 часов)

**Workflow:** `.github/workflows/isr-update.yml`

**Что происходит:**
- Триггерит ISR revalidation для всех сателлитов
- Контент обновляется с новыми данными
- Страницы остаются свежими

**Результат:** Динамический контент без пересборки

---

## 🛠️ Ручное управление

### Сгенерировать 20 сателлитов вручную

```bash
export DEEPSEEK_API_KEY=sk-0745998fd651417cb649a864d5f427de
export VERCEL_TOKEN=your_token
npm run satellite:daily
```

### Триггернуть ISR обновление

```bash
npm run satellite:trigger-isr
```

### Задеплоить текущий проект

```bash
node scripts/deploy-current.js
```

---

## 📊 Мониторинг

### Проверка GitHub Actions

```
GitHub → Actions → Daily Satellite Generation
```

Здесь вы увидите:
- Статус выполнения
- Логи генерации
- Количество созданных сателлитов
- Ошибки (если есть)

### Проверка логов

```bash
# Логи ежедневной генерации
cat ../satellites/daily-generation-log.json

# Логи деплоя
cat ../satellites/deploy-log.json

# Список URL
cat ../satellites/urls.txt
```

---

## 🎯 Как это работает

### Генерация контента

1. **DeepSeek API** генерирует уникальный контент для каждой страницы
2. **ContentGenerator** создаёт:
   - 15 уникальных направлений
   - 100 городов
   - 200 инструментов
   - 50 статей
3. **SatelliteGenerator** собирает всё в проект
4. **Vercel** деплоит с ISR поддержкой

### ISR (Incremental Static Regeneration)

1. Страницы генерируются статически при первом запросе
2. Каждые 6 часов GitHub Actions триггерит revalidation
3. Next.js регенерирует страницы с новым контентом
4. Пользователи всегда видят свежий контент

### Автоматическое SEO

1. После деплоя sitemap отправляется в Google/Яндекс
2. Страницы индексируются автоматически
3. ISR обновляет контент → Google переиндексирует

---

## ⚙️ Конфигурация

### Изменить количество сателлитов

Отредактируйте `scripts/daily-generator.js`:

```javascript
const CONFIG = {
  dailySatellites: 20, // Измените на нужное число
  pagesPerSatellite: 1000,
  // ...
};
```

### Изменить частоту ISR

Отредактируйте `.github/workflows/isr-update.yml`:

```yaml
on:
  schedule:
    - cron: '0 */6 * * *' # Каждые 6 часов
    # Измените на '0 */3 * * *' для каждых 3 часов
```

### Изменить время генерации

Отредактируйте `.github/workflows/daily-generation.yml`:

```yaml
on:
  schedule:
    - cron: '0 3 * * *' # 3:00 UTC
    # Измените на нужное время
```

---

## 🔧 Troubleshooting

### GitHub Actions не запускаются

1. Проверьте, что все секреты добавлены
2. Проверьте, что workflows файлы закоммичены
3. Проверьте Actions → Enable workflows

### DeepSeek API ошибки

1. Проверьте API ключ: `sk-0745998fd651417cb649a864d5f427de`
2. Проверьте лимиты API
3. Проверьте логи в GitHub Actions

### Vercel деплой не работает

1. Проверьте VERCEL_TOKEN
2. Проверьте VERCEL_TEAM (если Pro)
3. Проверьте лимиты Vercel

### ISR не обновляется

1. Проверьте REVALIDATE_SECRET
2. Проверьте, что next.config.js не использует `output: 'export'`
3. Проверьте логи ISR workflow

---

## 📈 Масштабирование

### Текущая конфигурация

- 20 сателлитов/день × 1000 страниц = **20,000 страниц/день**
- 30 дней × 20,000 = **600,000 страниц/месяц**
- ISR обновление 4 раза/день = **2,400,000 обновлений/месяц**

### Vercel Pro лимиты

- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/месяц
- ✅ 6000 build minutes/месяц

**Вывод:** Текущая конфигурация в пределах лимитов

### Увеличение до 50 сателлитов/день

Измените `dailySatellites: 50` в `daily-generator.js`

**Результат:** 50,000 страниц/день = 1,500,000 страниц/месяц

**Требования:**
- Больше build minutes (возможно нужен Enterprise)
- Больше bandwidth
- Мониторинг DeepSeek API лимитов

---

## ✅ Чеклист готовности

- [ ] GitHub Secrets добавлены (DEEPSEEK_API_KEY, VERCEL_TOKEN, etc.)
- [ ] Vercel Token получен и добавлен
- [ ] Revalidation Secret сгенерирован
- [ ] Изменения закоммичены и запушены
- [ ] GitHub Actions активированы
- [ ] Первый workflow запущен успешно
- [ ] Проверена генерация сателлитов
- [ ] Проверен ISR
- [ ] Проверена индексация в Google

---

## 🎉 Готово!

Система полностью автоматизирована:

✅ **20 сателлитов ежедневно** — автоматически
✅ **1000 страниц каждый** — AI-генерация
✅ **ISR обновления** — каждые 6 часов
✅ **SEO продвижение** — автоматически
✅ **Уникальный контент** — DeepSeek AI

**Просто закоммитьте и запушьте — всё остальное автоматически!**

```bash
git add .
git commit -m "feat: Enable AI automation"
git push origin main
```

**Система запустится автоматически в 3:00 UTC каждый день.**

---

## 📞 Поддержка

- Telegram: [@Inside1mb3](https://t.me/Inside1mb3)
- Instagram: [@inside1mb3](https://www.instagram.com/inside1mb3)

**Удачи в масштабировании! 🚀**
