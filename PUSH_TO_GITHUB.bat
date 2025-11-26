@echo off
echo ========================================
echo TayseerulQuran - Push to GitHub
echo ========================================
echo.

REM Check if Git is available
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed!
    echo.
    echo Please install Git first:
    echo 1. Go to: https://git-scm.com/download/win
    echo 2. Download and install Git
    echo 3. Restart this window
    echo 4. Run this file again
    echo.
    pause
    exit /b 1
)

echo Git is installed. Proceeding...
echo.

REM Initialize Git
if not exist .git (
    echo Initializing Git repository...
    git init
)

echo.
echo Adding all files...
git add .

echo.
echo Creating commit...
git commit -m "Initial commit: TayseerulQuran LMS project"

echo.
echo Setting up remote repository...
git remote remove origin 2>nul
git remote add origin https://github.com/Emmanovate-D/TayseerulQuran.git

echo.
echo Setting branch to main...
git branch -M main

echo.
echo ========================================
echo Ready to push to GitHub!
echo ========================================
echo.
echo You will be asked for credentials:
echo Username: Emmanovate-D
echo Password: Use a Personal Access Token
echo.
echo Get token from: https://github.com/settings/tokens
echo.
pause

echo.
echo Pushing to GitHub...
git push -u origin main

if errorlevel 1 (
    echo.
    echo Push failed. Check your credentials and try again.
) else (
    echo.
    echo ========================================
    echo SUCCESS! Code pushed to GitHub!
    echo ========================================
    echo Repository: https://github.com/Emmanovate-D/TayseerulQuran
)

echo.
pause


