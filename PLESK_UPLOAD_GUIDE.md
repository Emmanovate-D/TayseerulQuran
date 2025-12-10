# Plesk Deployment Guide - Step-by-Step Instructions

## Overview
This guide will help you upload the updated files to Plesk and configure the application correctly.

## Prerequisites
- Access to Plesk control panel for `tayseerulquran.org`
- FTP credentials or File Manager access
- Railway database credentials (from Railway dashboard)

---

## Step 1: Prepare Files for Upload

### Files to Upload

#### Frontend Files (Upload to `/httpdocs/`)
Upload ALL files from the `TayseerulQuran/` folder to `/httpdocs/`:
- All HTML files (index.html, login.html, register.html, etc.)
- `assets/` folder (CSS, JS, images, fonts)
- Any other frontend files

#### Backend Files (Upload to `/httpdocs/backend/`)
Upload ALL files from the `backend/` folder to `/httpdocs/backend/`:
- `server.js` (startup file)
- `package.json`
- `config/` folder
- `controllers/` folder
- `models/` folder
- `routes/` folder
- `middleware/` folder
- `services/` folder
- `utils/` folder
- `scripts/` folder
- `node_modules/` folder (or run `npm install` on server)

**Important:** Do NOT upload:
- `.env` file (we'll configure environment variables in Plesk)
- `.git/` folder
- `README.md` or other documentation files (optional)

---

## Step 2: Access Plesk File Manager

1. Log in to your Plesk control panel
2. Navigate to **Websites & Domains**
3. Click on **tayseerulquran.org**
4. Click on **File Manager**

---

## Step 3: Upload Frontend Files

1. In File Manager, navigate to `/httpdocs/`
2. **Delete existing files** (if any) to start fresh
3. Upload all files from `TayseerulQuran/` folder:
   - Select all files in `TayseerulQuran/`
   - Upload them to `/httpdocs/`
   - Ensure the structure is:
     ```
     /httpdocs/
       ├── index.html
       ├── login.html
       ├── register.html
       ├── assets/
       │   ├── css/
       │   ├── js/
       │   ├── images/
       │   └── fonts/
       └── ... (other HTML files)
     ```

---

## Step 4: Upload Backend Files

1. In File Manager, navigate to `/httpdocs/backend/`
2. **Delete existing files** (if any) to start fresh
3. Upload all files from `backend/` folder:
   - Select all files in `backend/`
   - Upload them to `/httpdocs/backend/`
   - Ensure the structure is:
     ```
     /httpdocs/backend/
       ├── server.js
       ├── package.json
       ├── config/
       ├── controllers/
       ├── models/
       ├── routes/
       ├── middleware/
       ├── services/
       ├── utils/
       └── scripts/
     ```

---

## Step 5: Install Node.js Dependencies

### Option A: Using Plesk Node.js Settings
1. Go to **Websites & Domains** → **tayseerulquran.org**
2. Click on **Node.js**
3. Click **NPM install** button
4. Wait for installation to complete

### Option B: Using SSH (if available)
1. Connect via SSH to your server
2. Navigate to `/var/www/vhosts/tayseerulquran.org/httpdocs/backend/`
3. Run: `npm install --production`

---

## Step 6: Configure Plesk Node.js Settings

1. Go to **Websites & Domains** → **tayseerulquran.org**
2. Click on **Node.js**
3. Configure the following settings:

   **Node.js Version:** `23.11.1` (or latest available)
   
   **Application Mode:** `production`
   
   **Application Root:** `/httpdocs/backend`
   
   **Application Startup File:** `server.js`
   
   **Document Root:** `/httpdocs`
   
   **Application URL:** `http://tayseerulquran.org`

4. Click **Apply** or **Save**

---

## Step 7: Configure Environment Variables

1. In the **Node.js** settings page, scroll down to **Custom environment variables**
2. Click **Add** or **Edit** to add each variable
3. Add the following environment variables:

   ```
   NODE_ENV=production
   PORT=3000
   DB_HOST=yamabiko.proxy.rlwy.net
   DB_PORT=44738
   DB_NAME=railway
   DB_USER=root
   DB_PASSWORD=ymvbsMyPASWMcTZlgtRPjTZXhGYTNSey
   JWT_SECRET=aB3xK9mP2qR7sT4vW8yZ1cD5fG6hJ0kL3nO9pQ2rS5tU8vW1xY4zA7bC0dE
   JWT_EXPIRE=7d
   JWT_REFRESH_SECRET=mN8pQ2rS5tU8vW1xY4zA7bC0dE3fG6hJ9kL2mO5pQ8rS1tU4vW7xY
   JWT_REFRESH_EXPIRE=30d
   CORS_ORIGIN=https://tayseerulquran.org
   ```

   **Important:** Replace the database credentials with your actual Railway credentials:
   - Get `DB_HOST` and `DB_PORT` from Railway's **Connect** tab (TCP Proxy)
   - Get `DB_NAME`, `DB_USER`, `DB_PASSWORD` from Railway's **Variables** tab

4. Click **Apply** or **Save**

---

## Step 8: Configure Domain Settings (Hosting)

1. Go to **Websites & Domains** → **tayseerulquran.org**
2. Click on **Hosting Settings**
3. Ensure the following:

   **Document Root:** `/httpdocs`
   
   **Web hosting is enabled:** ✅ (checked)

4. Click **OK** or **Save**

---

## Step 9: Restart the Node.js Application

1. Go to **Websites & Domains** → **tayseerulquran.org**
2. Click on **Node.js**
3. Click **Restart App** button
4. Wait for the restart to complete (usually 10-30 seconds)

---

## Step 10: Test the Deployment

### Test 1: Frontend Access
1. Open your browser
2. Navigate to `https://tayseerulquran.org`
3. You should see the homepage

### Test 2: Backend API Health Check
1. Open your browser
2. Navigate to `https://tayseerulquran.org/api/health`
3. You should see:
   ```json
   {
     "success": true,
     "message": "API is running",
     "timestamp": "..."
   }
   ```

### Test 3: Login
1. Navigate to `https://tayseerulquran.org/login.html`
2. Try logging in with your credentials
3. Check browser console (F12) for any errors

---

## Step 11: Check Application Logs

1. Go to **Websites & Domains** → **tayseerulquran.org**
2. Click on **Node.js**
3. Click on **Logs** or **Error Log**
4. Look for:
   - ✅ `🚀 Passenger detected - initializing app...`
   - ✅ `🌐 App module loaded successfully`
   - ✅ `✅ Database connection established successfully.` (may take a few seconds)
   - ❌ Any error messages (red text)

---

## Troubleshooting

### Issue: "Unable to connect to server"
**Solution:**
- Check that backend is running (Step 10, Test 2)
- Verify environment variables are set correctly
- Check application logs for errors

### Issue: "500 Internal Server Error"
**Solution:**
- Check application logs (Step 11)
- Verify `server.js` is in `/httpdocs/backend/`
- Verify `Application Startup File` is set to `server.js`
- Verify `Application Root` is set to `/httpdocs/backend`

### Issue: "Passenger timeout error"
**Solution:**
- The code has been updated to prevent this
- If it still occurs, check database connection credentials
- Verify database is accessible from Plesk server

### Issue: "Database connection failed"
**Solution:**
- Verify Railway database credentials are correct
- Check that `DB_HOST` and `DB_PORT` are from Railway's TCP Proxy (not internal)
- Test database connection from Railway dashboard

### Issue: Frontend shows Plesk default page
**Solution:**
- Verify `Document Root` is set to `/httpdocs` (not `/httpdocs/backend/public`)
- Verify frontend files are in `/httpdocs/`

### Issue: CORS errors
**Solution:**
- Verify `CORS_ORIGIN` environment variable includes `https://tayseerulquran.org`
- Check backend logs for CORS-related messages

---

## File Structure Summary

After upload, your Plesk file structure should be:

```
/var/www/vhosts/tayseerulquran.org/
└── httpdocs/
    ├── index.html
    ├── login.html
    ├── register.html
    ├── assets/
    │   ├── css/
    │   ├── js/
    │   ├── images/
    │   └── fonts/
    └── backend/
        ├── server.js
        ├── package.json
        ├── config/
        ├── controllers/
        ├── models/
        ├── routes/
        ├── middleware/
        ├── services/
        ├── utils/
        └── scripts/
```

---

## Quick Reference: Plesk Settings

| Setting | Value |
|---------|-------|
| **Document Root** | `/httpdocs` |
| **Application Root** | `/httpdocs/backend` |
| **Application Startup File** | `server.js` |
| **Application Mode** | `production` |
| **Node.js Version** | `23.11.1` (or latest) |

---

## Support

If you encounter any issues:
1. Check the application logs (Step 11)
2. Verify all settings match this guide
3. Ensure all files are uploaded correctly
4. Test database connection separately

---

## Next Steps After Deployment

1. Test all major features:
   - User registration
   - User login
   - Course browsing
   - Payment processing
   - Admin dashboard access

2. Monitor application logs for the first few hours

3. Set up SSL certificate (if not already done)

4. Configure backups (recommended)

---

**Last Updated:** Based on latest code changes to prevent Passenger timeouts and improve database connection handling.

