# ИНСТРУКЦИЯ: Настройка автоматической генерации

## Почему не запустилось сегодня?

Workflow запланирован на 03:00 UTC, но **не может запуститься без секретов**.

## Что нужно сделать (5 минут):

### 1. Открыть настройки репозитория
```
https://github.com/berdniko9544-gif/seo-programmatic/settings/secrets/actions
```

### 2. Добавить секреты (New repository secret):

**DEEPSEEK_API_KEY**
- Получить: https://platform.deepseek.com/api_keys
- Формат: `sk-...`
- Нужен для AI-генерации контента

**VERCEL_TOKEN**
- Получить: https://vercel.com/account/tokens
- Формат: `vercel_...`
- Нужен для деплоя сателлитов

**VERCEL_TEAM** (опционально)
- Если используете Team в Vercel
- Формат: `team_...`
- Можно оставить пустым для личного аккаунта

**YANDEX_WEBMASTER_TOKEN** (опционально)
- Получить: https://oauth.yandex.ru/authorize?response_type=token&client_id=...
- Для автоматической отправки в Яндекс.Вебмастер
- Можно пропустить (пинг Google/Bing работает без токена)

**YANDEX_USER_ID** (опционально)
- ID пользователя Яндекс
- Можно пропустить

### 3. Запустить вручную (первый раз):

После добавления секретов:
1. Перейти: https://github.com/berdniko9544-gif/seo-programmatic/actions/workflows/daily-generation.yml
2. Нажать "Run workflow"
3. Выбрать ветку "main"
4. Нажать "Run workflow"

### 4. Проверить результат:

Workflow займет ~2-3 часа:
- 20 сателлитов
- По 515 страниц каждый
- AI-генерация контента
- Build + Deploy на Vercel
- Пинг поисковых систем

## Минимальная конфигурация (только обязательные):

Для запуска достаточно **2 секретов**:
1. **DEEPSEEK_API_KEY** - для генерации контента
2. **VERCEL_TOKEN** - для деплоя

Остальные опциональны.

## После настройки:

✅ Завтра в 03:00 UTC запустится автоматически
✅ Каждый день будет генерировать 20 новых сателлитов
✅ Полностью автономная работа

## Проверка статуса:

```bash
# Посмотреть запуски
https://github.com/berdniko9544-gif/seo-programmatic/actions

# Логи последнего запуска
https://github.com/berdniko9544-gif/seo-programmatic/actions/workflows/daily-generation.yml
```

## Если что-то не работает:

1. Проверить, что секреты добавлены правильно (без пробелов)
2. Проверить, что токены валидны
3. Посмотреть логи в Actions
4. Запустить вручную через "Run workflow"
