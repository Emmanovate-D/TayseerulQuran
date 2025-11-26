# 🚀 Quick Start - 5 Minutes

## Prerequisites Check

Before starting, ensure you have:

- [ ] Node.js installed (`node --version`)
- [ ] MySQL installed and running (`mysql --version`)
- [ ] Terminal/PowerShell access

## Installation Steps

### 1. Install Node.js (if not installed)
```
Download: https://nodejs.org/
Install: Run the .msi installer
Verify: node --version
```

### 2. Install MySQL (if not installed)
```
Download: https://dev.mysql.com/downloads/mysql/
Or use XAMPP: https://www.apachefriends.org/
Start MySQL service
```

### 3. Setup Backend

```powershell
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file (see below)
# Create database (see below)

# Start server
npm run dev
```

### 4. Create .env File

Create `backend/.env`:
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=tayseerulquran_db
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key_32_chars_min
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRE=30d
CORS_ORIGIN=http://localhost:3000
```

### 5. Create Database

```sql
CREATE DATABASE tayseerulquran_db;
```

### 6. Test It

```powershell
# In new terminal
cd backend
node test-api.js
```

## ✅ Success!

If you see:
- ✅ Database connection established
- 🚀 Server running on port 3000
- Health check returns success

**You're all set!** 🎉

## 📚 More Details

- Full setup: See `SETUP_GUIDE.md`
- Requirements: See `INSTALL_REQUIREMENTS.md`
- API docs: See `README.md`

