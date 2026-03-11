#!/bin/bash

# Complete GitHub setup script with authentication
# Run this after authenticating with: gh auth login

echo "🚀 Complete GitHub Setup for seo-programmatic"
echo ""

# Check if authenticated
if ! gh auth status 2>&1 | grep -q "Logged in"; then
    echo "⚠️ Not authenticated with GitHub"
    echo "Please run: gh auth login"
    echo "Then run this script again"
    exit 1
fi

echo "✅ GitHub authentication confirmed"
echo ""

# Create repository
echo "📦 Creating GitHub repository..."
gh repo create seo-programmatic --public --description "AI-powered programmatic SEO - 20 satellites/day" --source=. --remote=origin --push

if [ $? -eq 0 ]; then
    echo "✅ Repository created and code pushed"
else
    echo "⚠️ Repository might already exist, trying to push..."
    git remote add origin https://github.com/$(gh api user -q .login)/seo-programmatic.git 2>/dev/null
    git push -u origin main
fi

echo ""
echo "🔐 Adding GitHub Secrets..."

# Add secrets
gh secret set DEEPSEEK_API_KEY --body "sk-2fc0f8412c164582ac8cf83e859fb560"
gh secret set VERCEL_TOKEN --body "vca_4GmyixM5cqJicGNspgfCDWaILBrZA8Hz0RM9P0TuybzW3ernof1sBzB7"
gh secret set VERCEL_TEAM --body "berdniko9544-2708s-projects"
gh secret set REVALIDATE_SECRET --body "your_random_secret_here_change_this"

echo "✅ Secrets added"
echo ""

echo "⚙️ Enabling GitHub Actions..."
gh workflow enable daily-generation.yml 2>/dev/null
gh workflow enable isr-update.yml 2>/dev/null

echo "✅ Workflows enabled"
echo ""

echo "📊 Verifying setup..."
gh secret list
echo ""

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Check workflows: gh workflow list"
echo "2. View repository: gh repo view --web"
echo "3. Monitor actions: gh run list"
