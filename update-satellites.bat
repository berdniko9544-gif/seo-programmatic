@echo off
REM Windows batch script to update satellites with ISR architecture
REM Run this from D:\seo-programmatic directory

echo ========================================
echo Updating Satellites with ISR Architecture
echo ========================================
echo.

set VERCEL_TOKEN=vca_4GmyixM5cqJicGNspgfCDWaILBrZA8Hz0RM9P0TuybzW3ernof1sBzB7
set VERCEL_TEAM=berdniko9544-2708s-projects

echo Satellite 1/19: sat-ai-sales-desk-61-20260310-0020
vercel link --yes --token=%VERCEL_TOKEN% --scope=%VERCEL_TEAM% --project=sat-ai-sales-desk-61-20260310-0020
vercel --prod --yes --token=%VERCEL_TOKEN% --scope=%VERCEL_TEAM% --force
echo.

echo Satellite 2/19: sat-client-stack-journal-20260310-0018
vercel link --yes --token=%VERCEL_TOKEN% --scope=%VERCEL_TEAM% --project=sat-client-stack-journal-20260310-0018
vercel --prod --yes --token=%VERCEL_TOKEN% --scope=%VERCEL_TEAM% --force
echo.

echo Satellite 3/19: sat-automation-profit-bu-20260310-0017
vercel link --yes --token=%VERCEL_TOKEN% --scope=%VERCEL_TEAM% --project=sat-automation-profit-bu-20260310-0017
vercel --prod --yes --token=%VERCEL_TOKEN% --scope=%VERCEL_TEAM% --force
echo.

echo Satellite 4/19: sat-prompt-ops-lab-56-20260310-0015
vercel link --yes --token=%VERCEL_TOKEN% --scope=%VERCEL_TEAM% --project=sat-prompt-ops-lab-56-20260310-0015
vercel --prod --yes --token=%VERCEL_TOKEN% --scope=%VERCEL_TEAM% --force
echo.

echo Satellite 5/19: sat-ai-sales-desk-55-20260310-0014
vercel link --yes --token=%VERCEL_TOKEN% --scope=%VERCEL_TEAM% --project=sat-ai-sales-desk-55-20260310-0014
vercel --prod --yes --token=%VERCEL_TOKEN% --scope=%VERCEL_TEAM% --force
echo.

echo ========================================
echo Updated 5 satellites (test batch)
echo Run again to update remaining 14
echo ========================================
pause
