#!/bin/bash

# Скрипт для завершения настройки GitHub
# Запустите этот скрипт после создания репозитория на GitHub

echo "🚀 Настройка GitHub для seo-programmatic"
echo ""

# Проверка что мы в правильной директории
if [ ! -f "package.json" ]; then
    echo "❌ Ошибка: Запустите скрипт из директории D:\seo-programmatic"
    exit 1
fi

echo "📋 Шаг 1: Авторизация в GitHub CLI"
echo "Выполните: gh auth login"
echo "Выберите: GitHub.com → HTTPS → Login with browser"
echo ""
read -p "Нажмите Enter после авторизации..."

echo ""
echo "📦 Шаг 2: Создание репозитория и push кода"
gh repo create seo-programmatic --public --source=. --remote=origin --push

if [ $? -eq 0 ]; then
    echo "✅ Репозиторий создан и код запушен"
else
    echo "❌ Ошибка при создании репозитория"
    echo "Создайте репозиторий вручную: https://github.com/new"
    echo "Затем выполните:"
    echo "  git remote add origin https://github.com/YOUR_USERNAME/seo-programmatic.git"
    echo "  git push -u origin main"
    exit 1
fi

echo ""
echo "🔐 Шаг 3: Добавление GitHub Secrets"
gh secret set DEEPSEEK_API_KEY --body "sk-0745998fd651417cb649a864d5f427de"
gh secret set VERCEL_TOKEN --body "vca_4GmyixM5cqJicGNspgfCDWaILBrZA8Hz0RM9P0TuybzW3ernof1sBzB7"
gh secret set VERCEL_TEAM --body "berdniko9544-2708s-projects"
gh secret set REVALIDATE_SECRET --body "your_random_secret_here_change_this"

echo "✅ Секреты добавлены"

echo ""
echo "⚙️ Шаг 4: Включение GitHub Actions"
gh workflow enable daily-generation.yml
gh workflow enable isr-update.yml

echo "✅ Workflows включены"

echo ""
echo "🎉 Настройка завершена!"
echo ""
echo "⚠️ ВАЖНО: Получите новый DeepSeek API ключ"
echo "1. Перейдите: https://platform.deepseek.com/api_keys"
echo "2. Создайте новый ключ"
echo "3. Обновите на Vercel:"
echo "   vercel env rm DEEPSEEK_API_KEY production"
echo "   vercel env add DEEPSEEK_API_KEY production"
echo "4. Обновите в GitHub:"
echo "   gh secret set DEEPSEEK_API_KEY"
echo ""
echo "📊 Система готова к работе!"
echo "Следующая генерация: завтра в 3:00 UTC (20 сателлитов)"
