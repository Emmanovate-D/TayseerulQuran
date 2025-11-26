# How to Push Your Code to GitHub - Simple Guide

## Step 1: Install Git (If Not Already Installed)

1. **Download Git for Windows:**
   - Go to: https://git-scm.com/download/win
   - Click "Download for Windows"
   - Run the installer
   - **IMPORTANT:** During installation, make sure "Add Git to PATH" is checked
   - Click "Next" through all steps (default settings are fine)
   - Click "Install"

2. **After Installation:**
   - Close ALL PowerShell/Command Prompt windows
   - Open a NEW PowerShell window
   - Navigate to your project: `cd C:\Users\User\Downloads\TayseerulQuran`

## Step 2: Push Your Code

### Option A: Use the Batch File (Easiest)
1. Double-click `PUSH_TO_GITHUB.bat`
2. Follow the prompts
3. When asked for credentials:
   - Username: `Emmanovate-D`
   - Password: Use a Personal Access Token (see Step 3 below)

### Option B: Use PowerShell Script
1. Right-click `setup-and-push.ps1`
2. Select "Run with PowerShell"
3. Follow the prompts

### Option C: Manual Commands
Open PowerShell in your project folder and run:

```powershell
git init
git add .
git commit -m "Initial commit: TayseerulQuran LMS project"
git remote add origin https://github.com/Emmanovate-D/TayseerulQuran.git
git branch -M main
git push -u origin main
```

## Step 3: Create GitHub Personal Access Token

Since GitHub no longer accepts passwords, you need a token:

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: "TayseerulQuran Push"
4. Select expiration (30 days, 60 days, or no expiration)
5. **Check the box:** `repo` (this gives full access to repositories)
6. Click "Generate token" at the bottom
7. **COPY THE TOKEN IMMEDIATELY** (you won't see it again!)
8. Use this token as your password when pushing

## Step 4: Verify

After pushing, visit: https://github.com/Emmanovate-D/TayseerulQuran

You should see all your files there!

## Troubleshooting

### "Git is not recognized"
- Git is not installed or not in PATH
- Install Git and restart your terminal
- Make sure "Add Git to PATH" was checked during installation

### "Authentication failed"
- Make sure you're using a Personal Access Token, not your GitHub password
- The token needs `repo` permissions

### "Repository not found"
- Make sure the repository exists at: https://github.com/Emmanovate-D/TayseerulQuran
- Make sure you're logged into the correct GitHub account

### "Remote origin already exists"
- Run: `git remote remove origin`
- Then run: `git remote add origin https://github.com/Emmanovate-D/TayseerulQuran.git`

## Need Help?

If you encounter any issues, note the exact error message and I can help you fix it!


