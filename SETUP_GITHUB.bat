@echo off
REM Complete GitHub Setup - Windows
REM Run this script to finish GitHub setup

echo ========================================
echo GitHub Setup for seo-programmatic
echo ========================================
echo.

echo Step 1: Authenticate with GitHub
echo.
echo Please run this command and follow the prompts:
echo   gh auth login
echo.
echo Choose:
echo   - GitHub.com
echo   - HTTPS
echo   - Login with a web browser
echo.
pause

REM Check if authenticated
gh auth status >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Not authenticated. Please run: gh auth login
    pause
    exit /b 1
)

echo [OK] Authenticated with GitHub
echo.

echo Step 2: Creating repository and pushing code...
gh repo create seo-programmatic --public --description "AI-powered programmatic SEO - 20 satellites/day" --source=. --remote=origin --push

if %errorlevel% neq 0 (
    echo [WARNING] Repository might exist, trying to push...
    git push -u origin main
)

echo [OK] Code pushed to GitHub
echo.

echo Step 3: Adding GitHub Secrets...
gh secret set DEEPSEEK_API_KEY --body "sk-2fc0f8412c164582ac8cf83e859fb560"
gh secret set VERCEL_TOKEN --body "vca_4GmyixM5cqJicGNspgfCDWaILBrZA8Hz0RM9P0TuybzW3ernof1sBzB7"
gh secret set VERCEL_TEAM --body "berdniko9544-2708s-projects"
gh secret set REVALIDATE_SECRET --body "your_random_secret_here_change_this"

echo [OK] Secrets added
echo.

echo Step 4: Enabling GitHub Actions...
gh workflow enable daily-generation.yml
gh workflow enable isr-update.yml

echo [OK] Workflows enabled
echo.

echo Step 5: Verifying setup...
gh secret list
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Your repository: https://github.com/berdniko9544-gif/seo-programmatic
echo.
echo Next steps:
echo 1. View workflows: gh workflow list
echo 2. Check repository: gh repo view --web
echo 3. Monitor actions: gh run list
echo.
echo System will start generating 20 satellites daily at 3:00 UTC
echo.
pause
