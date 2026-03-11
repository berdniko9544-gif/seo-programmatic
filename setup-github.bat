@echo off
REM Скрипт для завершения настройки GitHub (Windows)
REM Запустите этот скрипт после создания репозитория на GitHub

echo ========================================
echo Настройка GitHub для seo-programmatic
echo ========================================
echo.

REM Проверка что мы в правильной директории
if not exist "package.json" (
    echo [ERROR] Запустите скрипт из директории D:\seo-programmatic
    pause
    exit /b 1
)

echo Шаг 1: Авторизация в GitHub CLI
echo Выполните: gh auth login
echo Выберите: GitHub.com - HTTPS - Login with browser
echo.
pause

echo.
echo Шаг 2: Создание репозитория и push кода
gh repo create seo-programmatic --public --source=. --remote=origin --push

if %errorlevel% neq 0 (
    echo [ERROR] Ошибка при создании репозитория
    echo Создайте репозиторий вручную: https://github.com/new
    echo Затем выполните:
    echo   git remote add origin https://github.com/YOUR_USERNAME/seo-programmatic.git
    echo   git push -u origin main
    pause
    exit /b 1
)

echo [OK] Репозиторий создан и код запушен

echo.
echo Шаг 3: Добавление GitHub Secrets
gh secret set DEEPSEEK_API_KEY --body "sk-0745998fd651417cb649a864d5f427de"
gh secret set VERCEL_TOKEN --body "vca_4GmyixM5cqJicGNspgfCDWaILBrZA8Hz0RM9P0TuybzW3ernof1sBzB7"
gh secret set VERCEL_TEAM --body "berdniko9544-2708s-projects"
gh secret set REVALIDATE_SECRET --body "your_random_secret_here_change_this"

echo [OK] Секреты добавлены

echo.
echo Шаг 4: Включение GitHub Actions
gh workflow enable daily-generation.yml
gh workflow enable isr-update.yml

echo [OK] Workflows включены

echo.
echo ========================================
echo Настройка завершена!
echo ========================================
echo.
echo ВАЖНО: Получите новый DeepSeek API ключ
echo 1. Перейдите: https://platform.deepseek.com/api_keys
echo 2. Создайте новый ключ
echo 3. Обновите на Vercel:
echo    vercel env rm DEEPSEEK_API_KEY production
echo    vercel env add DEEPSEEK_API_KEY production
echo 4. Обновите в GitHub:
echo    gh secret set DEEPSEEK_API_KEY
echo.
echo Система готова к работе!
echo Следующая генерация: завтра в 3:00 UTC (20 сателлитов)
echo.
pause
