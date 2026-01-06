# Silicon Vault - Quick Deployment Script
# This script helps you deploy your site to Netlify

Write-Host "🚀 Silicon Vault - Netlify Deployment Helper" -ForegroundColor Cyan
Write-Host "=" * 50

# Check if npm is installed
Write-Host "`n📦 Checking for npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✓ npm is installed (version $npmVersion)" -ForegroundColor Green
} catch {
    Write-Host "✗ npm is not installed. Please install Node.js first." -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Install dependencies
Write-Host "`n📥 Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Check if Netlify CLI is installed
Write-Host "`n🔍 Checking for Netlify CLI..." -ForegroundColor Yellow
try {
    $netlifyCLI = netlify --version
    Write-Host "✓ Netlify CLI is installed" -ForegroundColor Green
} catch {
    Write-Host "⚠ Netlify CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g netlify-cli
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Netlify CLI installed successfully" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to install Netlify CLI" -ForegroundColor Red
        exit 1
    }
}

# Ask user what they want to do
Write-Host "`n🎯 What would you like to do?" -ForegroundColor Cyan
Write-Host "1. Test locally with Netlify Dev (recommended first)"
Write-Host "2. Deploy to Netlify"
Write-Host "3. Exit"

$choice = Read-Host "`nEnter your choice (1-3)"

switch ($choice) {
    "1" {
        Write-Host "`n🧪 Starting local development server..." -ForegroundColor Yellow
        Write-Host "Your site will open at: http://localhost:8888" -ForegroundColor Cyan
        Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
        netlify dev
    }
    "2" {
        Write-Host "`n🚀 Deploying to Netlify..." -ForegroundColor Yellow
        
        # Check if already linked to Netlify
        if (Test-Path ".netlify/state.json") {
            Write-Host "✓ Site already linked to Netlify" -ForegroundColor Green
            netlify deploy --prod
        } else {
            Write-Host "⚠ First time deployment. You'll need to link this site to Netlify..." -ForegroundColor Yellow
            netlify init
        }
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`n✓ Deployment successful! 🎉" -ForegroundColor Green
            Write-Host "Your visitor tracking with Netlify Blobs is now active!" -ForegroundColor Cyan
        } else {
            Write-Host "`n✗ Deployment failed" -ForegroundColor Red
        }
    }
    "3" {
        Write-Host "`nGoodbye! 👋" -ForegroundColor Cyan
        exit 0
    }
    default {
        Write-Host "`n✗ Invalid choice" -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n" -ForegroundColor Gray
Write-Host "=" * 50
Write-Host "For more information, see DEPLOYMENT.md" -ForegroundColor Gray
