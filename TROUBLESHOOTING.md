# 🔧 TROUBLESHOOTING — Решение проблем

## Частые проблемы и решения

### 1. Ошибка: "Cannot find module"

**Проблема:**
```
Error: Cannot find module 'next'
```

**Решение:**
```bash
npm install
```

---

### 2. Ошибка: "vercel: command not found"

**Проблема:**
```
vercel: command not found
```

**Решение:**
```bash
npm install -g vercel
```

---

### 3. Ошибка при сборке: "styled-jsx client-only"

**Проблема:**
```
Error: 'client-only' cannot be imported from a Server Component module
```

**Решение:**
Эта ошибка уже исправлена в v2.0. Если вы мигрируете старый сателлит, убедитесь, что в `src/app/loading.js` есть директива `'use client'` в начале файла.

---

### 4. Ошибка: "Cannot find module 'critters'"

**Проблема:**
```
Error: Cannot find module 'critters'
```

**Решение:**
Удалите `experimental.optimizeCss` из `next.config.js`. Эта опция уже удалена в v2.0.

---

### 5. Vercel деплой требует авторизации

**Проблема:**
```
Error: No existing credentials found. Please run `vercel login`
```

**Решение А (рекомендуется):**
```bash
# Получите токен: https://vercel.com/account/tokens
export VERCEL_TOKEN=your_token_here

# Теперь деплой будет автоматическим
npm run satellite:deploy-all
```

**Решение Б (интерактивно):**
```bash
vercel login
# Следуйте инструкциям
```

---

### 6. Ошибка: "ENOSPC: System limit for number of file watchers reached"

**Проблема:**
```
Error: ENOSPC: System limit for number of file watchers reached
```

**Решение (Linux/WSL):**
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

---

### 7. Сателлит не индексируется Google

**Проблема:**
Сайт задеплоен, но не появляется в поиске.

**Решение:**

1. **Проверьте индексацию:**
   ```
   site:your-domain.vercel.app
   ```

2. **Отправьте sitemap вручную:**
   - Откройте [Google Search Console](https://search.google.com/search-console)
   - Добавьте сайт
   - Перейдите в "Файлы Sitemap"
   - Добавьте: `https://your-domain.vercel.app/sitemap.xml`

3. **Запросите индексацию:**
   - В Google Search Console
   - Вставьте URL главной страницы
   - Нажмите "Запросить индексацию"

4. **Подождите:**
   - Индексация может занять 1-7 дней
   - Проверяйте каждый день: `site:your-domain.vercel.app`

---

### 8. Ошибка: "Module not found: Can't resolve './directions'"

**Проблема:**
```
Module not found: Can't resolve './directions'
```

**Решение:**
Убедитесь, что все модули данных существуют:
```bash
ls src/data/
# Должны быть: directions.js, locations.js, tools.js, content.js, seo-data.js
```

Если файлы отсутствуют, запустите миграцию:
```bash
npm run satellite:migrate -- --path /path/to/satellite
```

---

### 9. Сборка занимает слишком много времени

**Проблема:**
Сборка одного сателлита занимает >10 минут.

**Решение:**

1. **Проверьте количество страниц:**
   ```bash
   # Слишком много страниц замедляет сборку
   # Оптимально: 500-1000 страниц на сателлит
   ```

2. **Увеличьте память Node.js:**
   ```bash
   export NODE_OPTIONS="--max-old-space-size=4096"
   npm run build
   ```

3. **Используйте параллельную сборку:**
   ```bash
   # Вместо сборки по одному
   npm run satellite:build-all
   # Собирает по 3 сателлита параллельно
   ```

---

### 10. Ошибка: "Bandwidth limit exceeded"

**Проблема:**
```
Error: Bandwidth limit exceeded
```

**Решение:**

1. **Проверьте использование:**
   - Откройте [Vercel Dashboard](https://vercel.com/dashboard)
   - Перейдите в Settings → Usage
   - Проверьте Bandwidth

2. **Vercel Pro лимиты:**
   - 100 GB/месяц
   - Если превышен → апгрейд или удалите неиспользуемые сателлиты

3. **Оптимизация:**
   - Удалите сателлиты без трафика
   - Оптимизируйте изображения
   - Включите кэширование

---

### 11. Yandex Webmaster API ошибка

**Проблема:**
```
Error: Yandex API error: 401 Unauthorized
```

**Решение:**

1. **Проверьте токен:**
   ```bash
   echo $YANDEX_WEBMASTER_TOKEN
   # Должен быть установлен
   ```

2. **Получите новый токен:**
   - Откройте https://oauth.yandex.ru/
   - Создайте приложение с доступом к Webmaster API
   - Получите токен
   - Экспортируйте:
     ```bash
     export YANDEX_WEBMASTER_TOKEN=your_token
     ```

3. **Или отправьте вручную:**
   - Откройте https://webmaster.yandex.ru
   - Добавьте сайт
   - Отправьте sitemap вручную

---

### 12. Ошибка: "Port 3000 already in use"

**Проблема:**
```
Error: Port 3000 is already in use
```

**Решение:**

**Вариант А (убить процесс):**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

**Вариант Б (использовать другой порт):**
```bash
PORT=3001 npm run dev
```

---

### 13. Миграция не находит старые данные

**Проблема:**
```
Error: Cannot find module 'seo-data.js'
```

**Решение:**

1. **Проверьте структуру:**
   ```bash
   ls src/data/
   # Должен быть файл seo-data.js
   ```

2. **Если файл отсутствует:**
   - Возможно, это уже новая архитектура
   - Проверьте наличие модулей:
     ```bash
     ls src/data/directions.js
     ls src/data/locations.js
     ```

3. **Если это новая архитектура:**
   - Миграция не нужна
   - Просто пересоберите:
     ```bash
     npm run build
     ```

---

### 14. Git ошибки при деплое

**Проблема:**
```
Error: Not a git repository
```

**Решение:**

1. **Инициализируйте git:**
   ```bash
   cd /path/to/satellite
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Или деплойте без git:**
   ```bash
   vercel --prod
   # Vercel может деплоить без git
   ```

---

### 15. Слишком много сателлитов, сложно управлять

**Проблема:**
У вас 50+ сателлитов, сложно отслеживать.

**Решение:**

1. **Используйте логи:**
   ```bash
   cat ../satellites/deploy-log.json
   cat ../satellites/urls.txt
   ```

2. **Создайте таблицу в Excel/Google Sheets:**
   - Колонки: Домен, Ниша, Страниц, Трафик, Статус
   - Обновляйте еженедельно

3. **Автоматизируйте мониторинг:**
   - Используйте Google Analytics API
   - Или Vercel Analytics API
   - Создайте дашборд

---

## 🆘 Если ничего не помогло

1. **Проверьте health check:**
   ```bash
   npm run satellite:health
   ```

2. **Проверьте логи:**
   ```bash
   cat ../satellites/batch-log.json
   cat ../satellites/build-log.json
   cat ../satellites/deploy-log.json
   ```

3. **Создайте issue:**
   - Опишите проблему
   - Приложите логи
   - Укажите версию Node.js и ОС

4. **Свяжитесь с поддержкой:**
   - Telegram: [@Inside1mb3](https://t.me/Inside1mb3)
   - Instagram: [@inside1mb3](https://www.instagram.com/inside1mb3)

---

## 📚 Полезные команды

### Проверка системы
```bash
npm run satellite:health
node --version
npm --version
vercel --version
```

### Очистка
```bash
# Очистить node_modules
rm -rf node_modules
npm install

# Очистить .next и out
rm -rf .next out
npm run build

# Очистить все сателлиты
rm -rf ../satellites/*
```

### Логи
```bash
# Просмотр логов
cat ../satellites/batch-log.json | jq
cat ../satellites/build-log.json | jq
cat ../satellites/deploy-log.json | jq

# Список URL
cat ../satellites/urls.txt
```

### Vercel
```bash
# Список проектов
vercel list

# Удалить проект
vercel remove project-name

# Логи деплоя
vercel logs project-name
```

---

**Если вы нашли решение проблемы, которой нет в этом списке — поделитесь!**
