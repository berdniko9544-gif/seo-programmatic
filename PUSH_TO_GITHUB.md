# 📤 Как запушить код на GitHub

## Текущая ситуация

✅ **Код готов:** 18 коммитов
✅ **Главный сайт:** Развернут и работает
✅ **Сателлиты:** Все 19 обновлены
❌ **GitHub репозиторий:** Не создан

---

## Вариант 1: Через GitHub CLI (быстрее)

### Шаг 1: Авторизоваться в GitHub CLI
```bash
gh auth login
```

Выбрать:
- GitHub.com
- HTTPS
- Login with a web browser

### Шаг 2: Создать репозиторий
```bash
cd D:\seo-programmatic
gh repo create seo-programmatic --public --source=. --remote=origin --push
```

Готово! Код автоматически запушится.

---

## Вариант 2: Вручную через веб-интерфейс

### Шаг 1: Создать репозиторий на GitHub
1. Перейти: https://github.com/new
2. Repository name: `seo-programmatic`
3. Description: `AI-powered programmatic SEO - 20 satellites/day`
4. **Public** repository
5. **НЕ** инициализировать с README
6. Нажать **Create repository**

### Шаг 2: Обновить remote и запушить
```bash
cd D:\seo-programmatic

# Удалить старый remote
git remote remove github

# Добавить правильный remote (замените YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/seo-programmatic.git

# Запушить код
git push -u origin main
```

---

## После push на GitHub

### Добавить GitHub Secrets

Settings → Secrets and variables → Actions → New repository secret

Добавить 4 секрета:

```
Name: DEEPSEEK_API_KEY
Value: sk-0745998fd651417cb649a864d5f427de

Name: VERCEL_TOKEN
Value: vca_4GmyixM5cqJicGNspgfCDWaILBrZA8Hz0RM9P0TuybzW3ernof1sBzB7

Name: VERCEL_TEAM
Value: berdniko9544-2708s-projects

Name: REVALIDATE_SECRET
Value: your_random_secret_here_change_this
```

### Включить GitHub Actions

1. Перейти в **Actions** tab
2. Нажать **"I understand my workflows, go ahead and enable them"**
3. Готово!

---

## Что будет работать после настройки

### Автоматически каждый день (3:00 UTC)
- ✅ Генерация 20 новых сателлитов
- ✅ 20,000 новых уникальных страниц
- ✅ Автоматический деплой на Vercel
- ✅ SEO продвижение

### Автоматически каждые 6 часов
- ✅ ISR обновление всех сателлитов
- ✅ Свежий AI контент
- ✅ Без пересборки

---

## Проверка после настройки

```bash
# Проверить что код запушен
git remote -v
git log --oneline -5

# Проверить GitHub Actions
gh workflow list
gh run list --limit 5
```

---

## ⚠️ Важно: DeepSeek API ключ

Текущий ключ **невалиден** (401 ошибка).

Получить новый:
1. https://platform.deepseek.com/api_keys
2. Создать новый ключ
3. Обновить на Vercel:
   ```bash
   vercel env rm DEEPSEEK_API_KEY production
   vercel env add DEEPSEEK_API_KEY production
   ```
4. Обновить в GitHub Secrets

Без валидного ключа AI генерация контента не будет работать.

---

## Итого

**Выберите вариант 1 (GitHub CLI) или вариант 2 (вручную) и выполните шаги выше.**

После этого система будет полностью автоматической.
