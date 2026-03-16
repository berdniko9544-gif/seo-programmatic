# Настройка Vercel для автоматического деплоя

## Шаг 1: Получить Vercel Token

1. Зайти на https://vercel.com/account/tokens
2. Нажать "Create Token"
3. Название: `GitHub Actions SEO Satellites`
4. Scope: Full Account
5. Expiration: No Expiration
6. Скопировать токен (показывается только один раз!)

## Шаг 2: Добавить токен в GitHub Secrets

1. Зайти в репозиторий: https://github.com/berdniko9544-gif/seo-programmatic
2. Settings → Secrets and variables → Actions
3. Нажать "New repository secret"
4. Добавить:
   - Name: `VERCEL_TOKEN`
   - Value: (вставить токен из шага 1)

## Шаг 3: Получить Vercel Org ID (опционально)

1. Зайти на https://vercel.com/account
2. Settings → General
3. Скопировать "Team ID" или "User ID"
4. Добавить в GitHub Secrets:
   - Name: `VERCEL_ORG_ID`
   - Value: (вставить ID)

## Шаг 4: Проверить другие секреты

Убедиться что есть:
- ✅ `DEEPSEEK_API_KEY` - для AI генерации
- ✅ `YANDEX_WEBMASTER_TOKEN` - для отправки в Яндекс
- ✅ `YANDEX_USER_ID` - для Яндекс.Вебмастер
- ✅ `REVALIDATE_SECRET` - для ISR

## Шаг 5: Запустить первый деплой

### Вариант A: Через GitHub Actions (рекомендуется)

1. Зайти в Actions: https://github.com/berdniko9544-gif/seo-programmatic/actions
2. Выбрать "Daily Satellite Generation (Vercel)"
3. Нажать "Run workflow"
4. Параметры:
   - Satellites: `1` (для теста)
   - Pages: `1000`
5. Нажать "Run workflow"
6. Ждать ~5-10 минут
7. Проверить результат

### Вариант B: Локально

```bash
# Установить Vercel CLI
npm i -g vercel

# Залогиниться
vercel login

# Сгенерировать 1 тестовый сателлит
npm run satellite:generate -- --niche ai-copywriting --pages 1000 --domain test-vercel-001

# Задеплоить
cd satellites/test-vercel-001
vercel deploy --prod

# Проверить URL
```

## Шаг 6: Проверить работу из РФ

1. Открыть URL сателлита в браузере
2. Проверить без VPN
3. Убедиться что сайт загружается
4. Проверить скорость (должна быть быстрая)

## Шаг 7: Активировать автоматическую генерацию

1. Workflow уже настроен на ежедневный запуск в 6:00 МСК
2. Расписание: `cron: '0 3 * * *'` (3:00 UTC = 6:00 МСК)
3. По умолчанию: 5 сателлитов в день
4. Можно изменить в `.github/workflows/vercel-daily-generation.yml`

## Мониторинг

### Vercel Dashboard

1. Зайти на https://vercel.com/dashboard
2. Проверить:
   - Build minutes usage (должно быть ~10 мин/день)
   - Deployments (все сателлиты)
   - Analytics (трафик)

### GitHub Actions

1. Зайти в Actions
2. Проверить логи каждого запуска
3. Скачать artifacts (URLs, logs)

## Оптимизация

### Увеличить количество сателлитов

Если build minutes позволяют:

```yaml
# .github/workflows/vercel-daily-generation.yml
default: '10'  # было 5
```

### Уменьшить страниц на сателлит

Если нужно больше сателлитов:

```yaml
# .github/workflows/vercel-daily-generation.yml
default: '500'  # было 1000
```

## Расчет лимитов

### Vercel Pro: 6,000 build минут/месяц

**5 сателлитов/день:**
```
5 × 0.5 минуты × 30 дней = 75 минут/месяц
Использование: 1.25% от лимита
Запас: 5,925 минут
```

**10 сателлитов/день:**
```
10 × 0.5 минуты × 30 дней = 150 минут/месяц
Использование: 2.5% от лимита
Запас: 5,850 минут
```

**20 сателлитов/день:**
```
20 × 0.5 минуты × 30 дней = 300 минут/месяц
Использование: 5% от лимита
Запас: 5,700 минут
```

## Troubleshooting

### Ошибка: "Vercel CLI not found"

```bash
npm i -g vercel
```

### Ошибка: "Invalid token"

1. Проверить что токен правильно скопирован
2. Проверить что токен не истек
3. Создать новый токен

### Ошибка: "Build failed"

1. Проверить логи в GitHub Actions
2. Проверить что все зависимости установлены
3. Проверить что ISR правильно настроен

### Медленный build

1. Проверить количество страниц в `generateStaticParams()`
2. Должно быть ~50-150 страниц, не больше
3. Остальные страницы генерируются on-demand

## Следующие шаги

1. ✅ Настроить Vercel токен
2. ✅ Запустить первый тестовый деплой
3. ✅ Проверить работу из РФ
4. ✅ Активировать автоматическую генерацию
5. ⏳ Мониторить build minutes
6. ⏳ Оптимизировать на основе метрик
7. ⏳ Масштабировать до 10-20 сателлитов/день

## Контакты

- Vercel Support: https://vercel.com/support
- GitHub Actions Docs: https://docs.github.com/en/actions
- Next.js ISR Docs: https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration
