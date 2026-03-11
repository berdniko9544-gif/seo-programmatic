#!/bin/bash

# Manual satellite update script
# Run this to update all existing satellites with new ISR architecture

VERCEL_TOKEN="${VERCEL_TOKEN:-vca_4GmyixM5cqJicGNspgfCDWaILBrZA8Hz0RM9P0TuybzW3ernof1sBzB7}"
VERCEL_TEAM="${VERCEL_TEAM:-berdniko9544-2708s-projects}"

echo "🚀 Updating existing satellites with ISR architecture..."
echo ""

# List of satellites to update (from vercel projects ls)
SATELLITES=(
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
  "sat-creator-revenue-fiel-20260310-0004"
  "sat-prompt-ops-lab-44-20260310-0003"
  "sat-ai-sales-desk-43-20260310-0002"
)

SUCCESS=0
FAILED=0

for SATELLITE in "${SATELLITES[@]}"; do
  echo "📦 Updating $SATELLITE..."

  # Link to existing project
  vercel link --yes --token="$VERCEL_TOKEN" --scope="$VERCEL_TEAM" --project="$SATELLITE" 2>/dev/null

  # Deploy with force flag
  if vercel --prod --yes --token="$VERCEL_TOKEN" --scope="$VERCEL_TEAM" --force 2>&1 | grep -q "Production:"; then
    echo "✅ Successfully updated $SATELLITE"
    ((SUCCESS++))
  else
    echo "❌ Failed to update $SATELLITE"
    ((FAILED++))
  fi

  echo ""
done

echo "📊 Results:"
echo "✅ Success: $SUCCESS"
echo "❌ Failed: $FAILED"
echo ""
echo "🎉 Satellite update complete!"
