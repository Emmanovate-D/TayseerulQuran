# Installation Requirements Checklist

## ✅ What You Need to Install

### 1. Node.js (Required)
- **Download**: https://nodejs.org/
- **Version**: LTS (v18.x or v20.x recommended)
- **Installation**: 
  - Download the Windows installer (.msi)
  - Run the installer
  - Check "Add to PATH" during installation
  - Restart terminal after installation

**Verify Installation:**
```powershell
node --version
npm --version
```

### 2. MySQL (Required)
- **Option A - MySQL Community Server**: https://dev.mysql.com/downloads/mysql/
- **Option B - XAMPP** (includes MySQL): https://www.apachefriends.org/
- **Option C - WAMP** (Windows only): https://www.wampserver.com/

**Verify Installation:**
```powershell
mysql --version
```

**Start MySQL Service:**
- If using XAMPP: Start MySQL from XAMPP Control Panel
- If using standalone: MySQL should start automatically as a service

### 3. Code Editor (Optional but Recommended)
- **VS Code**: https://code.visualstudio.com/
- **Or any text editor** for editing `.env` file

## 📦 What Gets Installed Automatically

After running `npm install`, these packages will be installed:

### Core Dependencies:
- `express` - Web framework
- `mysql2` - MySQL driver
- `sequelize` - ORM for database
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `joi` - Input validation
- `dotenv` - Environment variables
- `cors` - Cross-origin resource sharing
- `morgan` - HTTP request logger

### Development Dependencies:
- `nodemon` - Auto-restart server on changes

## 🔧 Quick Installation Commands

### Install Node.js (if using Chocolatey):
```powershell
choco install nodejs
```

### Install MySQL (if using Chocolatey):
```powershell
choco install mysql
```

### Or download manually:
- Node.js: https://nodejs.org/
- MySQL: https://dev.mysql.com/downloads/mysql/

## ⚡ Quick Start After Installation

1. **Open terminal in backend folder**
2. **Run**: `npm install`
3. **Create**: `.env` file (see SETUP_GUIDE.md)
4. **Create**: MySQL database
5. **Run**: `npm run dev`

That's it! 🎉

