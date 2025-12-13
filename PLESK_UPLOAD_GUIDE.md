# Plesk Deployment Guide - Step-by-Step Instructions

## Overview
This guide will help you upload the **frontend files** to Plesk. 

**Important:** Your backend is hosted on **Render** (`https://tayseerulquran.onrender.com`), so you **only need to upload frontend files** to Plesk. No Node.js configuration needed on Plesk.

## Prerequisites
- Access to Plesk control panel for `tayseerulquran.org`
- FTP credentials or File Manager access
- Backend is running on Render (verify at: `https://tayseerulquran.onrender.com/api/health`)

---

## Step 1: Prepare Files for Upload

### Files to Upload

#### Frontend Files ONLY (Upload to `/httpdocs/`)
Upload **ALL** files from the `TayseerulQuran/` folder to `/httpdocs/`:
- All HTML files (index.html, login.html, register.html, etc.)
- `assets/` folder (CSS, JS, images, fonts) - **CRITICAL: Must include `api.js` with Render URL**
- Any other frontend files

#### DO NOT Upload Backend Files
**Backend is on Render, so do NOT upload:**
- `backend/` folder
- `server.js`
- `package.json`
- Any Node.js files

**Important:** Do NOT upload:
- `backend/` folder (backend is on Render)
- `.env` files
- `.git/` folder
- `node_modules/` folder

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

## Step 4: Verify Critical Files

After uploading, verify these critical files:

1. **`/httpdocs/assets/js/api.js`**
   - Open in Plesk editor
   - Check line 26: Should show `'https://tayseerulquran.onrender.com/api'`
   - Should NOT show: `window.location.origin + '/api'`

2. **`/httpdocs/login.html`**
   - Open in Plesk editor
   - Search for: `tayseerulquran.onrender.com`
   - Should find: `window.BACKEND_API_URL = 'https://tayseerulquran.onrender.com/api';`

3. **All HTML files** should have the Render URL override script

---

## Step 5: Configure Domain Settings (Hosting)

1. Go to **Websites & Domains** → **tayseerulquran.org**
2. Click on **Hosting Settings**
3. Ensure the following:

   **Document Root:** `/httpdocs`
   
   **Web hosting is enabled:** ✅ (checked)

4. Click **OK** or **Save**

---

## Step 6: Node.js Settings (Optional - Not Required)

Since your backend is on Render, you **do NOT need Node.js** on Plesk:

1. Go to **Websites & Domains** → **tayseerulquran.org**
2. Click on **Node.js**
3. **Node.js can be disabled** - it won't affect your frontend
4. No environment variables needed on Plesk (all backend config is on Render)

---

## Step 7: Test the Deployment

### Test 1: Frontend Access
1. Open your browser
2. Navigate to `https://tayseerulquran.org`
3. You should see the homepage

### Test 2: Backend API Health Check (On Render)
1. Open your browser
2. Navigate to `https://tayseerulquran.onrender.com/api/health`
3. You should see:
   ```json
   {
     "success": true,
     "message": "API is running",
     "timestamp": "..."
   }
   ```

### Test 3: Frontend API Connection
1. Upload `test-api-connection.html` to `/httpdocs/`
2. Visit: `https://tayseerulquran.org/test-api-connection.html`
3. Click **Test Health Endpoint**
4. Should show: ✅ Success with Render backend URL

### Test 4: Login
1. Navigate to `https://tayseerulquran.org/login.html`
2. Open browser console (F12)
3. Check console output:
   - Should see: `"Production API URL set to: https://tayseerulquran.onrender.com/api"`
   - Should see: `"Using Render API URL: https://tayseerulquran.onrender.com/api"`
4. Try logging in with your credentials
5. Check Network tab (F12 → Network):
   - Request should go to: `https://tayseerulquran.onrender.com/api/auth/login`
   - Should NOT go to: `https://tayseerulquran.org/api/auth/login`

---

## Step 8: Clear Browser Cache

After uploading, clear your browser cache:

1. **Hard Refresh:**
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

2. **Or Clear Cache:**
   - Press `Ctrl + Shift + Delete`
   - Select "Cached images and files"
   - Time range: "All time"
   - Click "Clear data"

3. **Or Use Incognito:**
   - Open a new incognito/private window
   - Test the site there

---

## Troubleshooting

### Issue: "404 Not Found" when logging in
**Solution:**
- Check browser console - should show Render URL, not Plesk URL
- Verify `api.js` contains `'https://tayseerulquran.onrender.com/api'`
- Clear browser cache (Step 8)
- Re-upload `assets/js/api.js` file
- Re-upload all HTML files

### Issue: Console shows wrong API URL (`tayseerulquran.org/api`)
**Solution:**
- Files on Plesk are outdated
- Re-upload `assets/js/api.js` and all HTML files
- Clear browser cache completely
- Test in incognito window

### Issue: "Unable to connect to server"
**Solution:**
- Check that Render backend is running: `https://tayseerulquran.onrender.com/api/health`
- Verify frontend is calling Render URL (check Network tab)
- Check Render dashboard for backend status

### Issue: CORS errors
**Solution:**
- Verify Render backend has `CORS_ORIGIN` set to include `https://tayseerulquran.org`
- Check Render environment variables
- Check backend logs on Render dashboard

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
    ├── enroll.html
    ├── classes.html
    ├── (all other .html files)
    ├── assets/
    │   ├── css/
    │   ├── js/
    │   │   └── api.js  ← CRITICAL: Must have Render URL
    │   ├── images/
    │   └── fonts/
    └── test-api-connection.html  (optional test file)
```

**Note:** No `backend/` folder needed - backend is on Render.

---

## Quick Reference: Plesk Settings

| Setting | Value |
|---------|-------|
| **Document Root** | `/httpdocs` |
| **Web hosting** | ✅ Enabled |
| **Node.js** | ❌ Not required (backend on Render) |
| **SSL/TLS** | ✅ Enabled (recommended) |

---

## Support

If you encounter any issues:
1. Check browser console (F12) for errors
2. Check Network tab to see which API URL is being called
3. Verify `api.js` contains Render URL
4. Verify Render backend is running: `https://tayseerulquran.onrender.com/api/health`
5. Clear browser cache and test in incognito window

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

**Last Updated:** Backend is now hosted on Render. Only frontend files need to be uploaded to Plesk.

