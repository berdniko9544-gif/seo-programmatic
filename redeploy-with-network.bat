@echo off
echo ========================================
echo   REDEPLOY SATELLITES WITH CROSS-LINKING
echo ========================================
echo.

echo [1/3] Checking Vercel authentication...
vercel whoami
if errorlevel 1 (
    echo.
    echo ERROR: Not logged in to Vercel
    echo Please run: vercel login
    echo.
    pause
    exit /b 1
)

echo.
echo [2/3] Redeploying 28 satellites...
echo This will take ~15-20 minutes
echo.
node scripts/vercel-deploy-all.js

echo.
echo [3/3] Submitting to IndexNow...
npm run network:submit-indexnow

echo.
echo ========================================
echo   DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Next steps:
echo 1. Check satellites/vercel-deploy-log.json for results
echo 2. Check satellites/indexnow-submission.json for SEO status
echo 3. Deploy main site with: vercel --prod
echo.
pause
