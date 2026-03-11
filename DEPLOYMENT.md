# Deployment Guide — Деплой на Vercel

## 🚀 Шаг 1: Подготовка репозитория

### Создайте Git репозиторий
```bash
cd seo-programmatic
git init
git add .
git commit -m "feat: SEO programmatic v2.0 with modular architecture"
```

### Создайте репозиторий на GitHub
1. Зайдите на [github.com](https://github.com)
2. Нажмите "New repository"
3. Название: `1mb3-seo` (или любое другое)
4. Сделайте репозиторий **Public** или **Private**
5. Не добавляйте README, .gitignore, license (уже есть)

### Загрузите код на GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/1mb3-seo.git
git branch -M main
git push -u origin main
```

---

## 🌐 Шаг 2: Деплой на Vercel

### Подключите проект к Vercel
1. Зайдите на [vercel.com](https://vercel.com)
2. Нажмите **"New Project"**
3. Выберите ваш GitHub репозиторий `1mb3-seo`
4. Vercel автоматически определит Next.js

### Настройки проекта
- **Framework Preset:** Next.js (определится автоматически)
- **Root Directory:** `./` (оставьте по умолчанию)
- **Build Command:** `npm run build` (по умолчанию)
- **Output Directory:** `out` (для static export)

### Environment Variables (опционально)
Добавьте переменные окружения:
```
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_MAIN_SITE_URL=https://1mb3-guide-2026.vercel.app
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_YANDEX_METRIKA_ID=XXXXXXXX
NEXT_PUBLIC_GOOGLE_VERIFICATION=your_google_code
NEXT_PUBLIC_YANDEX_VERIFICATION=your_yandex_code
```

### Нажмите Deploy
Vercel начнёт сборку. Процесс займёт 2-3 минуты.

---

## 🔗 Шаг 3: Настройка домена (опционально)

### Если хотите кастомный домен:

1. В Vercel → **Settings** → **Domains**
2. Добавьте ваш домен (например, `ai-guide.ru`)
3. Vercel покажет DNS записи для настройки

### Настройте DNS у регистратора:
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

Подождите 5-60 минут для распространения DNS.

---

## 📊 Шаг 4: Проверка после деплоя

### Проверьте основные URL:
- ✅ Главная: `https://your-domain.vercel.app`
- ✅ Sitemap: `https://your-domain.vercel.app/sitemap.xml`
- ✅ Robots: `https://your-domain.vercel.app/robots.txt`
- ✅ RSS: `https://your-domain.vercel.app/rss.xml`
- ✅ Направления: `https://your-domain.vercel.app/napravleniya`
- ✅ Блог: `https://your-domain.vercel.app/blog`

### Проверьте производительность:
1. Откройте [PageSpeed Insights](https://pagespeed.web.dev/)
2. Введите URL вашего сайта
3. Проверьте оценки для Mobile и Desktop
4. Цель: 90+ баллов

---

## 🔍 Шаг 5: Индексация в поисковиках

### Google Search Console
1. Зайдите в [Google Search Console](https://search.google.com/search-console)
2. Нажмите **"Добавить ресурс"**
3. Выберите **"Префикс URL"**: `https://your-domain.vercel.app`
4. Подтвердите владение:
   - Метод 1: HTML-тег (добавьте в `layout.js`)
   - Метод 2: DNS-запись (добавьте TXT запись)
5. После подтверждения:
   - Перейдите в **Sitemap**
   - Добавьте: `https://your-domain.vercel.app/sitemap.xml`
   - Нажмите **"Отправить"**
6. Запросите индексацию главной страницы:
   - Вставьте URL в поиск сверху
   - Нажмите **"Запросить индексирование"**

### Яндекс Вебмастер
1. Зайдите в [Яндекс Вебмастер](https://webmaster.yandex.ru)
2. Нажмите **"Добавить сайт"**
3. Введите: `https://your-domain.vercel.app`
4. Подтвердите владение (HTML-файл или meta-тег)
5. После подтверждения:
   - Перейдите в **Индексирование** → **Sitemap файлы**
   - Добавьте: `https://your-domain.vercel.app/sitemap.xml`
6. Проверьте robots.txt:
   - **Инструменты** → **Анализ robots.txt**

---

## 📈 Шаг 6: Аналитика (опционально)

### Google Analytics 4
1. Создайте аккаунт в [Google Analytics](https://analytics.google.com)
2. Создайте новый ресурс (Property)
3. Получите Measurement ID (формат: `G-XXXXXXXXXX`)
4. Добавьте в `src/app/layout.js`:
```javascript
<script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}></script>
<script dangerouslySetInnerHTML={{
  __html: `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
  `
}} />
```

### Yandex Metrika
1. Создайте счётчик в [Яндекс Метрике](https://metrika.yandex.ru)
2. Получите ID счётчика
3. Добавьте код в `src/app/layout.js`

---

## 🔄 Шаг 7: Автоматический деплой

Vercel автоматически деплоит при каждом push в `main`:

```bash
# Внесите изменения
git add .
git commit -m "feat: add new direction"
git push origin main

# Vercel автоматически задеплоит изменения
```

### Preview деплои
Для каждого Pull Request Vercel создаёт preview URL для тестирования.

---

## 🎯 Чек-лист после деплоя

- [ ] Сайт открывается по основному URL
- [ ] Sitemap доступен и корректен
- [ ] Robots.txt настроен правильно
- [ ] RSS-лента работает
- [ ] Все страницы открываются без ошибок
- [ ] Мобильная версия работает корректно
- [ ] PageSpeed Insights: 90+ баллов
- [ ] Google Search Console настроен
- [ ] Яндекс Вебмастер настроен
- [ ] Sitemap отправлен в оба поисковика
- [ ] Аналитика подключена (опционально)
- [ ] Домен настроен (если используется)

---

## 🐛 Troubleshooting

### Ошибка при сборке
```bash
# Проверьте локально
npm run build

# Если ошибка — исправьте и закоммитьте
git add .
git commit -m "fix: build error"
git push
```

### 404 на всех страницах
- Проверьте `next.config.js`: должен быть `output: 'export'`
- Проверьте `trailingSlash: true` если используете

### Sitemap не обновляется
- Sitemap генерируется при сборке
- Сделайте новый деплой для обновления

---

## 📞 Поддержка

Если возникли проблемы:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Community](https://github.com/vercel/next.js/discussions)

---

**Готово! Ваш SEO-сайт задеплоен и готов к индексации 🚀**
