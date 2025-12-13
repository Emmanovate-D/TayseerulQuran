# Complete Render Deployment Guide

## 🚀 Step-by-Step Deployment to Render

### Prerequisites Checklist

Before starting, make sure you have:
- [ ] GitHub repository is up to date (all code pushed)
- [ ] Railway MySQL database is **online** and running
- [ ] Railway database credentials ready (from Railway Variables tab)
- [ ] Render account created (https://dashboard.render.com)

---

## 📋 Step 1: Prepare Database Credentials

### Get Railway Database Values

1. Go to **Railway Dashboard**: https://railway.app
2. Click on your **MySQL service**
3. Go to **"Variables"** tab
4. Copy these values (you'll need them in Step 5):

| Railway Variable | Use as Render Variable |
|-----------------|------------------------|
| `MYSQLHOST` | `DB_HOST` |
| `MYSQLPORT` | `DB_PORT` (usually `3306`) |
| `MYSQLDATABASE` | `DB_NAME` |
| `MYSQLUSER` | `DB_USER` |
| `MYSQLPASSWORD` | `DB_PASSWORD` |

**Example:**
```
DB_HOST = containers-us-west-123.railway.app
DB_PORT = 3306
DB_NAME = railway
DB_USER = root
DB_PASSWORD = your_password_here
```

---

## 🔑 Step 2: Generate JWT Secrets

You need to generate **two strong random strings** for JWT secrets.

### Option A: Using Node.js (Recommended)
```bash
# Run this command twice to get two different secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Option B: Online Generator
Visit: https://randomkeygen.com/ and use "CodeIgniter Encryption Keys"

**Save these two secrets:**
- Secret 1 → Use for `JWT_SECRET`
- Secret 2 → Use for `JWT_REFRESH_SECRET`

---

## 🌐 Step 3: Create New Web Service on Render

### 3.1 Access Render Dashboard

1. Go to: **https://dashboard.render.com**
2. Sign in to your account
3. You should see your dashboard

### 3.2 Create New Service

1. Click the **"+ New"** button (top right corner)
2. Select **"Web Service"**
3. You'll see the "Create a new Web Service" page

---

## 🔗 Step 4: Connect GitHub Repository

### 4.1 Connect GitHub Account (if not already connected)

1. In the "Connect a repository" section:
   - If you see "Connect account" or "Configure account", click it
   - Authorize Render to access your GitHub account
   - Grant necessary permissions

### 4.2 Select Repository

1. After connecting, you should see your repositories
2. Find and select: **`TayseerulQuran`** (or `Emmanovate-D/TayseerulQuran`)
3. Click **"Connect"**

---

## ⚙️ Step 5: Configure Service Settings

Fill in these settings **exactly** as shown:

### Basic Settings

| Setting | Value |
|---------|-------|
| **Name** | `tayseerulquran-backend` |
| **Region** | Choose closest to your users (e.g., `Oregon (US West)`) |
| **Branch** | `main` |
| **Root Directory** | `backend` ⚠️ **CRITICAL - Must be `backend`** |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

### Advanced Settings (Click "Advanced" to expand)

- **Auto-Deploy**: `Yes` ✅
- **Health Check Path**: `/api/health` (optional but recommended)

---

## 🔐 Step 6: Add Environment Variables

**IMPORTANT:** Add these **BEFORE** clicking "Create Web Service"

### 6.1 Scroll to "Environment Variables" Section

Click **"Add Environment Variable"** for each variable below.

### 6.2 Required Variables

Add these one by one:

#### Application Environment
```
Key: NODE_ENV
Value: production
```

```
Key: PORT
Value: 10000
```

#### Database Configuration (Use your Railway values)
```
Key: DB_HOST
Value: <paste_your_MYSQLHOST_from_railway>
```

```
Key: DB_PORT
Value: 3306
```

```
Key: DB_NAME
Value: <paste_your_MYSQLDATABASE_from_railway>
```

```
Key: DB_USER
Value: <paste_your_MYSQLUSER_from_railway>
```

```
Key: DB_PASSWORD
Value: <paste_your_MYSQLPASSWORD_from_railway>
```
⚠️ **Mark this as "Secret"** (click the lock icon)

#### JWT Security (Use your generated secrets)
```
Key: JWT_SECRET
Value: <paste_your_generated_secret_1>
```
⚠️ **Mark this as "Secret"**

```
Key: JWT_EXPIRE
Value: 7d
```

```
Key: JWT_REFRESH_SECRET
Value: <paste_your_generated_secret_2>
```
⚠️ **Mark this as "Secret"**

```
Key: JWT_REFRESH_EXPIRE
Value: 30d
```

#### CORS Configuration
```
Key: CORS_ORIGIN
Value: https://tayseerulquran.org,https://your-service-name.onrender.com
```
⚠️ Replace `your-service-name` with your actual Render service name

### 6.3 Optional: Payment Gateway Variables

Only add these if you're using payment gateways:

**Stripe (if using):**
```
Key: STRIPE_SECRET_KEY
Value: <your_stripe_secret_key>
```

```
Key: STRIPE_PUBLISHABLE_KEY
Value: <your_stripe_publishable_key>
```

**PayPal (if using):**
```
Key: PAYPAL_CLIENT_ID
Value: <your_paypal_client_id>
```

```
Key: PAYPAL_CLIENT_SECRET
Value: <your_paypal_client_secret>
```

---

## 🚀 Step 7: Create and Deploy

1. **Review all settings** one more time
2. **Verify Root Directory** is set to `backend` ⚠️
3. **Verify all environment variables** are added
4. Click **"Create Web Service"**
5. Render will start building and deploying automatically

---

## 📊 Step 8: Monitor Deployment

You'll see the deployment progress in real-time:

### 8.1 Build Phase
- Installing dependencies (`npm install`)
- Should complete in 1-2 minutes

### 8.2 Deploy Phase
- Starting the server
- Should complete in 30-60 seconds

### 8.3 What to Look For in Logs

**✅ Good Signs:**
```
✅ Installing dependencies...
✅ Building...
✅ Server is running on port 10000
✅ Passenger detected - app ready (if you see this, it's fine)
✅ Database connection established successfully
✅ Routes loaded on first request
```

**❌ Errors to Watch For:**
- `Missing required environment variables` → Check all env vars are set
- `Database connection timeout` → Check Railway DB is online
- `Cannot find module` → Check Root Directory is `backend`
- `Port already in use` → Shouldn't happen, but check PORT variable

---

## 🌐 Step 9: Get Your Service URL

After successful deployment:

1. Your service will be live at: **`https://your-service-name.onrender.com`**
2. **Copy this URL** - you'll need it for:
   - Testing the API
   - Updating frontend configuration
   - CORS settings

**Example URL:**
```
https://tayseerulquran-backend.onrender.com
```

---

## ✅ Step 10: Test Your Deployment

### Test 1: Health Check Endpoint

Visit in your browser:
```
https://your-service-name.onrender.com/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2025-12-10T...",
  "database": "connected",
  "routes": "loaded"
}
```

✅ **If you see JSON** = Deployment successful!

❌ **If you see HTML error page** = Check logs for errors

### Test 2: Root Endpoint

Visit:
```
https://your-service-name.onrender.com/
```

Should show API information with available endpoints.

### Test 3: Check Logs

1. In Render dashboard, go to your service
2. Click **"Logs"** tab
3. Look for:
   - ✅ "Database connection established successfully"
   - ✅ "Routes loaded on first request"
   - ❌ No error messages

---

## 🔄 Step 11: Update Frontend Configuration

After deployment, update your frontend to use the new Render URL.

### Option A: Update `api.js` directly

In `TayseerulQuran/assets/js/api.js`, update:

```javascript
// Production API URL
const PRODUCTION_API_URL = 'https://your-service-name.onrender.com/api';
```

### Option B: Dynamic Configuration

```javascript
// Auto-detect API URL
const getApiUrl = () => {
  if (window.location.hostname === 'tayseerulquran.org') {
    return 'https://your-service-name.onrender.com/api';
  }
  return 'http://localhost:3000/api';
};

const API_BASE_URL = getApiUrl();
```

**Replace `your-service-name` with your actual Render service name!**

---

## 📝 Complete Environment Variables Checklist

Use this checklist to ensure all variables are set:

### Required Variables
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `10000`
- [ ] `DB_HOST` = (from Railway)
- [ ] `DB_PORT` = `3306`
- [ ] `DB_NAME` = (from Railway)
- [ ] `DB_USER` = (from Railway)
- [ ] `DB_PASSWORD` = (from Railway) ⚠️ Secret
- [ ] `JWT_SECRET` = (generated) ⚠️ Secret
- [ ] `JWT_EXPIRE` = `7d`
- [ ] `JWT_REFRESH_SECRET` = (generated) ⚠️ Secret
- [ ] `JWT_REFRESH_EXPIRE` = `30d`
- [ ] `CORS_ORIGIN` = (your domains)

### Optional Variables (if using)
- [ ] `STRIPE_SECRET_KEY` = (if using Stripe)
- [ ] `STRIPE_PUBLISHABLE_KEY` = (if using Stripe)
- [ ] `PAYPAL_CLIENT_ID` = (if using PayPal)
- [ ] `PAYPAL_CLIENT_SECRET` = (if using PayPal)

---

## 🐛 Troubleshooting

### Problem: Build Fails

**Symptoms:**
- Build stops with error
- "Cannot find module" errors

**Solutions:**
1. ✅ Verify **Root Directory** is set to `backend`
2. ✅ Check `package.json` exists in `backend/` folder
3. ✅ Verify build command is `npm install`
4. ✅ Check logs for specific error message

### Problem: Service Won't Start

**Symptoms:**
- Service shows "Failed" status
- Logs show port errors

**Solutions:**
1. ✅ Verify `PORT` environment variable is set to `10000`
2. ✅ Check Start Command is `npm start`
3. ✅ Review logs for specific error
4. ✅ Ensure `server.js` exists in `backend/` folder

### Problem: Database Connection Fails

**Symptoms:**
- Logs show "Database connection timeout"
- Health check shows `"database": "pending"`

**Solutions:**
1. ✅ Verify Railway database is **online** (green status)
2. ✅ Double-check `DB_HOST`, `DB_USER`, `DB_PASSWORD` values
3. ✅ Ensure Railway allows external connections
4. ✅ Check Railway firewall/network settings
5. ✅ Try connecting from another tool to verify credentials

### Problem: 500 Internal Server Error

**Symptoms:**
- API returns 500 error
- Browser shows HTML error page

**Solutions:**
1. ✅ Check Render logs for detailed error
2. ✅ Verify all environment variables are set
3. ✅ Ensure `JWT_SECRET` is set (not default value)
4. ✅ Check database connection is working
5. ✅ Verify routes are loading correctly

### Problem: CORS Errors

**Symptoms:**
- Browser console shows CORS errors
- Frontend can't connect to API

**Solutions:**
1. ✅ Update `CORS_ORIGIN` to include your frontend domain
2. ✅ Include Render URL in CORS_ORIGIN
3. ✅ Format: `https://domain1.com,https://domain2.com`

---

## 📋 Quick Reference

### Render Service Settings
```
Name: tayseerulquran-backend
Root Directory: backend ⚠️ CRITICAL
Build Command: npm install
Start Command: npm start
Runtime: Node
Auto-Deploy: Yes
```

### Service URL Format
```
https://<service-name>.onrender.com
```

### Test Endpoints
```
Health: https://<service-name>.onrender.com/api/health
Root: https://<service-name>.onrender.com/
Login: https://<service-name>.onrender.com/api/auth/login
```

---

## ✅ Deployment Checklist

### Before Deployment
- [ ] GitHub repository is up to date
- [ ] Railway database is online
- [ ] Database credentials copied from Railway
- [ ] JWT secrets generated (2 different ones)
- [ ] Render account created

### During Deployment
- [ ] GitHub repository connected
- [ ] Root Directory set to `backend`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] All environment variables added
- [ ] Secrets marked as "Secret" in Render

### After Deployment
- [ ] Service shows "Live" status
- [ ] `/api/health` returns JSON
- [ ] Logs show no errors
- [ ] Database connection successful
- [ ] Frontend updated with new API URL
- [ ] Login functionality tested

---

## 🎉 Success Indicators

Your deployment is successful when:

1. ✅ Service status is **"Live"** (green)
2. ✅ Health endpoint returns JSON
3. ✅ Logs show "Database connection established"
4. ✅ No error messages in logs
5. ✅ Frontend can connect to API
6. ✅ Login works with test credentials

---

## 📞 Next Steps

After successful deployment:

1. **Test all API endpoints**
2. **Update frontend** to use Render URL
3. **Monitor logs** for any issues
4. **Set up custom domain** (optional)
5. **Configure auto-scaling** (if needed)

---

## 💡 Pro Tips

1. **Always mark secrets as "Secret"** in Render (lock icon)
2. **Keep a backup** of your environment variables
3. **Monitor logs** regularly, especially after updates
4. **Test health endpoint** after every deployment
5. **Use Render's auto-deploy** for continuous deployment

---

**Need Help?** Check Render logs first - they usually contain the exact error message!

