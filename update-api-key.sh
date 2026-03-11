#!/bin/bash

# Script to update DeepSeek API key on all Vercel projects
# New API key: sk-2fc0f8412c164582ac8cf83e859fb560

VERCEL_TOKEN="vca_4GmyixM5cqJicGNspgfCDWaILBrZA8Hz0RM9P0TuybzW3ernof1sBzB7"
VERCEL_TEAM="berdniko9544-2708s-projects"
NEW_API_KEY="sk-2fc0f8412c164582ac8cf83e859fb560"

PROJECTS=(
  "seo-programmatic-main"
  "sat-market-signal-desk-6-20260310-0019"
  "sat-creator-revenue-fiel-20260310-0016"
  "sat-market-signal-desk-5-20260310-0013"
  "sat-automation-profit-bu-20260310-0011"
  "sat-automation-profit-bu-20260310-0005"
  "sat-ai-sales-desk-61-20260310-0020"
  "sat-client-stack-journal-20260310-0018"
  "sat-automation-profit-bu-20260310-0017"
  "sat-prompt-ops-lab-56-20260310-0015"
  "sat-ai-sales-desk-55-20260310-0014"
  "sat-client-stack-journal-20260310-0012"
  "sat-creator-revenue-fiel-20260310-0010"
  "sat-prompt-ops-lab-50-20260310-0009"
  "sat-ai-sales-desk-49-20260310-0008"
  "sat-market-signal-desk-4-20260310-0007"
  "sat-client-stack-journal-20260310-0006"
  "sat-automation-profit-bu-20260310-0005"
  "sat-creator-revenue-fiel-20260310-0004"
  "sat-prompt-ops-lab-44-20260310-0003"
  "sat-ai-sales-desk-43-20260310-0002"
)

echo "🔑 Updating DeepSeek API key on all Vercel projects..."
echo ""

SUCCESS=0
FAILED=0

for PROJECT in "${PROJECTS[@]}"; do
  echo "📦 Updating $PROJECT..."

  # Link to project
  vercel link --yes --token="$VERCEL_TOKEN" --scope="$VERCEL_TEAM" --project="$PROJECT" 2>/dev/null

  # Add new API key
  if echo "$NEW_API_KEY" | vercel env add DEEPSEEK_API_KEY production --token="$VERCEL_TOKEN" --scope="$VERCEL_TEAM" 2>&1 | grep -q "Added"; then
    echo "✅ API key updated for $PROJECT"
    ((SUCCESS++))
  else
    echo "⚠️ API key might already exist for $PROJECT"
    ((SUCCESS++))
  fi

  echo ""
done

echo "📊 Results:"
echo "✅ Success: $SUCCESS"
echo "❌ Failed: $FAILED"
echo ""
echo "🎉 API key update complete!"
