# TayseerulQuran - Automated Git Setup and Push Script
# This script will help you push your code to GitHub

Write-Host "=== TayseerulQuran Git Setup ===" -ForegroundColor Cyan
Write-Host ""

# Function to check if Git is available
function Test-GitAvailable {
    try {
        $null = git --version 2>$null
        return $true
    } catch {
        return $false
    }
}

# Check for Git
Write-Host "Checking for Git installation..." -ForegroundColor Yellow
$gitAvailable = Test-GitAvailable

if (-not $gitAvailable) {
    Write-Host "Git is not installed or not in PATH." -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Git using one of these methods:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://git-scm.com/download/win" -ForegroundColor White
    Write-Host "2. Or use: winget install Git.Git" -ForegroundColor White
    Write-Host ""
    Write-Host "After installing Git, please:" -ForegroundColor Yellow
    Write-Host "- Close this PowerShell window" -ForegroundColor White
    Write-Host "- Open a new PowerShell window" -ForegroundColor White
    Write-Host "- Navigate to: cd C:\Users\User\Downloads\TayseerulQuran" -ForegroundColor White
    Write-Host "- Run this script again: .\setup-and-push.ps1" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit
}

Write-Host "Git is available!" -ForegroundColor Green
Write-Host ""

# Get current directory
$projectPath = Get-Location
Write-Host "Project path: $projectPath" -ForegroundColor Cyan
Write-Host ""

# Step 1: Initialize Git repository
Write-Host "Step 1: Initializing Git repository..." -ForegroundColor Yellow
if (Test-Path ".git") {
    Write-Host "Git repository already initialized." -ForegroundColor Green
} else {
    git init
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Git repository initialized successfully!" -ForegroundColor Green
    } else {
        Write-Host "Failed to initialize Git repository." -ForegroundColor Red
        exit 1
    }
}
Write-Host ""

# Step 2: Add all files
Write-Host "Step 2: Adding all files to staging..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -eq 0) {
    Write-Host "All files added successfully!" -ForegroundColor Green
} else {
    Write-Host "Failed to add files." -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 3: Create initial commit
Write-Host "Step 3: Creating initial commit..." -ForegroundColor Yellow
git commit -m "Initial commit: TayseerulQuran LMS project"
if ($LASTEXITCODE -eq 0) {
    Write-Host "Commit created successfully!" -ForegroundColor Green
} else {
    Write-Host "Failed to create commit. This might be because there are no changes to commit." -ForegroundColor Yellow
}
Write-Host ""

# Step 4: Add remote repository
Write-Host "Step 4: Setting up remote repository..." -ForegroundColor Yellow
$remoteUrl = "https://github.com/Emmanovate-D/TayseerulQuran.git"

# Check if remote already exists
$existingRemote = git remote get-url origin 2>$null
if ($existingRemote) {
    Write-Host "Remote 'origin' already exists: $existingRemote" -ForegroundColor Yellow
    $update = Read-Host "Do you want to update it to $remoteUrl? (Y/N)"
    if ($update -eq "Y" -or $update -eq "y") {
        git remote set-url origin $remoteUrl
        Write-Host "Remote updated successfully!" -ForegroundColor Green
    }
} else {
    git remote add origin $remoteUrl
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Remote repository added successfully!" -ForegroundColor Green
    } else {
        Write-Host "Failed to add remote repository." -ForegroundColor Red
        exit 1
    }
}
Write-Host ""

# Step 5: Set branch to main
Write-Host "Step 5: Setting branch to 'main'..." -ForegroundColor Yellow
git branch -M main
Write-Host "Branch set to 'main'!" -ForegroundColor Green
Write-Host ""

# Step 6: Push to GitHub
Write-Host "Step 6: Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "You will be prompted for your GitHub credentials." -ForegroundColor Cyan
Write-Host "Username: Emmanovate-D" -ForegroundColor Cyan
Write-Host "Password: Use a Personal Access Token (not your GitHub password)" -ForegroundColor Cyan
Write-Host "Get token from: https://github.com/settings/tokens" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pushing code to GitHub..." -ForegroundColor Yellow

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=== SUCCESS! ===" -ForegroundColor Green
    Write-Host "Your code has been pushed to GitHub!" -ForegroundColor Green
    Write-Host "Repository URL: https://github.com/Emmanovate-D/TayseerulQuran" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "Push failed. Common issues:" -ForegroundColor Red
    Write-Host "1. Authentication failed - make sure you're using a Personal Access Token" -ForegroundColor Yellow
    Write-Host "2. Repository doesn't exist - make sure the repository is created on GitHub" -ForegroundColor Yellow
    Write-Host "3. Network issues - check your internet connection" -ForegroundColor Yellow
}

Write-Host ""
Read-Host "Press Enter to exit"


