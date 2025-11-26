# Complete Setup & Testing Guide

## 📋 Prerequisites

### 1. Install Node.js
- **Download**: https://nodejs.org/ (LTS version recommended)
- **Install**: Run the installer and follow the prompts
- **Verify**: Open new terminal and run:
  ```powershell
  node --version
  npm --version
  ```

### 2. Install MySQL
- **Download**: https://dev.mysql.com/downloads/mysql/
- **Or use XAMPP**: https://www.apachefriends.org/ (includes MySQL)
- **Start MySQL service**
- **Verify**: 
  ```powershell
  mysql --version
  ```

## 🚀 Setup Steps

### Step 1: Create .env File
Create `backend/.env` file with:

```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=tayseerulquran_db
DB_USER=root
DB_PASSWORD=your_mysql_password

JWT_SECRET=tayseerulquran_super_secret_jwt_key_change_in_production_32chars
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=tayseerulquran_super_secret_refresh_key_change_in_production
JWT_REFRESH_EXPIRE=30d

CORS_ORIGIN=http://localhost:3000
```

**Important**: Replace `your_mysql_password` with your actual MySQL root password.

### Step 2: Install Dependencies
```powershell
cd backend
npm install
```

This installs:
- express, mysql2, sequelize
- jsonwebtoken, bcryptjs
- joi, dotenv, cors, morgan
- nodemon (for development)

### Step 3: Create Database
Open MySQL command line or MySQL Workbench:

```sql
CREATE DATABASE tayseerulquran_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Or using command line:
```powershell
mysql -u root -p -e "CREATE DATABASE tayseerulquran_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### Step 4: Start Server
```powershell
npm run dev
```

**Expected Output:**
```
✅ Database connection established successfully.
🚀 Server is running on port 3000
📝 Environment: development
🌐 API URL: http://localhost:3000/api
💚 Health Check: http://localhost:3000/api/health
```

## 🧪 Testing

### Option 1: Automated Test Script
In a **new terminal** (keep server running):
```powershell
cd backend
node test-api.js
```

### Option 2: Manual Testing with curl

**Health Check:**
```powershell
curl http://localhost:3000/api/health
```

**Register User:**
```powershell
curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d "{\"firstName\":\"John\",\"lastName\":\"Doe\",\"email\":\"john@example.com\",\"password\":\"password123\"}"
```

**Login:**
```powershell
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"john@example.com\",\"password\":\"password123\"}"
```

**Get Profile (replace YOUR_TOKEN):**
```powershell
curl http://localhost:3000/api/auth/profile -H "Authorization: Bearer YOUR_TOKEN"
```

### Option 3: Use Postman or Thunder Client
- Import the API endpoints
- Test each endpoint manually
- Use the JWT token from login for protected routes

## ✅ Success Indicators

You'll know everything works when:
1. ✅ Server starts without errors
2. ✅ "Database connection established" message appears
3. ✅ Health check returns: `{"success": true, "message": "API is running"}`
4. ✅ Registration creates user and returns JWT token
5. ✅ Login returns JWT token
6. ✅ Protected routes require authentication

## 🆘 Troubleshooting

### "node: command not found"
**Solution**: Install Node.js from https://nodejs.org/

### "Cannot connect to database"
**Solutions**:
- Check MySQL service is running
- Verify database credentials in `.env`
- Ensure database `tayseerulquran_db` exists
- Check MySQL user has proper permissions

### "Port 3000 already in use"
**Solution**: Change `PORT=3000` to `PORT=3001` in `.env`

### "Module not found"
**Solution**: Run `npm install` in backend folder

### "JWT_SECRET is required"
**Solution**: Ensure `.env` file exists and has JWT_SECRET set

### "Sequelize validation error"
**Solution**: This is normal - tables will be created automatically on first run

## 📊 Expected Database Tables

After first successful run, these tables will be created automatically:
- users
- roles
- permissions
- role_permissions
- user_roles
- courses
- students
- tutors
- blog_posts
- payments
- student_courses

## 🎯 Next Steps After Setup

1. **Create Super Admin** (manually in database or via API)
2. **Assign Roles & Permissions** (via admin routes)
3. **Test RBAC** (verify permissions work)
4. **Test All CRUD Operations**
5. **Test Payment Processing**
6. **Test Blog Functionality**

---

**Ready to go!** Follow these steps and your backend will be fully functional.

