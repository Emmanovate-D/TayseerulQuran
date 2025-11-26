# Automated Git Push Script with Token
# This script will push your code to GitHub using your Personal Access Token

$token = "YOUR_PERSONAL_ACCESS_TOKEN_HERE"
$username = "Emmanovate-D"
$repoUrl = "https://github.com/Emmanovate-D/TayseerulQuran.git"

Write-Host "=== TayseerulQuran - Push to GitHub ===" -ForegroundColor Cyan
Write-Host ""

# Check if Git is available
try {
    $gitVersion = git --version 2>&1
    Write-Host "Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Git is not installed or not in PATH!" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "After installation, close and reopen PowerShell, then run this script again." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Step 1: Initializing Git repository..." -ForegroundColor Yellow
if (-not (Test-Path ".git")) {
    git init
    Write-Host "Repository initialized!" -ForegroundColor Green
} else {
    Write-Host "Repository already initialized." -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 2: Adding all files..." -ForegroundColor Yellow
git add .
Write-Host "Files added!" -ForegroundColor Green

Write-Host ""
Write-Host "Step 3: Creating commit..." -ForegroundColor Yellow
git commit -m "Initial commit: TayseerulQuran LMS project"
Write-Host "Commit created!" -ForegroundColor Green

Write-Host ""
Write-Host "Step 4: Setting up remote..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin $repoUrl
Write-Host "Remote configured!" -ForegroundColor Green

Write-Host ""
Write-Host "Step 5: Setting branch to main..." -ForegroundColor Yellow
git branch -M main
Write-Host "Branch set to main!" -ForegroundColor Green

Write-Host ""
Write-Host "Step 6: Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "Using token for authentication..." -ForegroundColor Cyan

# Configure Git to use the token in the URL
$remoteWithToken = $repoUrl -replace "https://", "https://${username}:${token}@"
git remote set-url origin $remoteWithToken

# Push to GitHub
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=== SUCCESS! ===" -ForegroundColor Green
    Write-Host "Your code has been pushed to GitHub!" -ForegroundColor Green
    Write-Host "Repository: https://github.com/Emmanovate-D/TayseerulQuran" -ForegroundColor Cyan
    
    # Remove token from remote URL for security
    git remote set-url origin $repoUrl
    Write-Host ""
    Write-Host "Token removed from remote URL for security." -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "Push failed. Please check:" -ForegroundColor Red
    Write-Host "1. Git is installed and in PATH" -ForegroundColor Yellow
    Write-Host "2. Token is valid and has 'repo' permissions" -ForegroundColor Yellow
    Write-Host "3. Repository exists on GitHub" -ForegroundColor Yellow
    Write-Host "4. Internet connection is working" -ForegroundColor Yellow
}

Write-Host ""
Read-Host "Press Enter to exit"


