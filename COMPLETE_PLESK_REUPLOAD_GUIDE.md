# Complete Plesk Re-Upload Guide

## Overview
This guide will help you completely delete all files from Plesk and re-upload everything from scratch to ensure correct placement and configuration.

**Important:** Your backend is hosted on Render (`https://tayseerulquran.onrender.com`), so you only need to upload the **frontend files** to Plesk.

---

## Step 1: Delete All Files from Plesk

### 1.1 Access File Manager
1. Log in to Plesk
2. Go to **Websites & Domains** → `tayseerulquran.org`
3. Click **File Manager**

### 1.2 Delete All Existing Files
1. Navigate to `/httpdocs/` (this is your website root)
2. **Select all files and folders:**
   - Click the checkbox at the top to select all
   - Or manually select each item
3. Click **Delete** (trash icon)
4. Confirm deletion
5. **Also delete `/backend/` folder if it exists:**
   - Navigate to `/httpdocs/backend/` if it exists
   - Delete the entire `backend` folder

### 1.3 Verify Deletion
- The `/httpdocs/` folder should be empty (or only contain default files)
- No `backend` folder should exist

---

## Step 2: Upload Frontend Files

### 2.1 Files to Upload
Upload **ALL** files from your local `TayseerulQuran/` folder to `/httpdocs/`:

**Required Files:**
- All `.html` files (login.html, register.html, index.html, etc.)
- `assets/` folder (entire folder with all subfolders)
- Any other frontend files (images, CSS, JS, etc.)

**DO NOT upload:**
- `backend/` folder (backend is on Render)
- Any `.env` files
- `node_modules/` folder
- `package.json` or other backend files

### 2.2 Upload Process

#### Method 1: File Manager (Recommended for small files)
1. In Plesk File Manager, navigate to `/httpdocs/`
2. Click **Upload Files**
3. Select files from your local `TayseerulQuran/` folder
4. Upload in batches if needed
5. **Important:** Maintain folder structure:
   - `assets/js/api.js` → `/httpdocs/assets/js/api.js`
   - `login.html` → `/httpdocs/login.html`

#### Method 2: FTP (Recommended for large uploads)
1. Get FTP credentials from Plesk:
   - Go to **Websites & Domains** → **FTP Access**
   - Note your FTP username and password
2. Use an FTP client (FileZilla, WinSCP, etc.)
3. Connect to your domain
4. Navigate to `/httpdocs/`
5. Upload all files from `TayseerulQuran/` folder
6. Maintain folder structure

### 2.3 Verify Upload
After uploading, check these critical files:

1. **`/httpdocs/login.html`**
   - Open in Plesk editor
   - Search for: `tayseerulquran.onrender.com`
   - Should find: `window.BACKEND_API_URL = 'https://tayseerulquran.onrender.com/api';`

2. **`/httpdocs/assets/js/api.js`**
   - Open in Plesk editor
   - Check line 26: Should show `'https://tayseerulquran.onrender.com/api'`
   - Should NOT show: `window.location.origin + '/api'`

3. **File Structure:**
   ```
   /httpdocs/
   ├── index.html
   ├── login.html
   ├── register.html
   ├── index.html
   ├── (all other .html files)
   └── assets/
       ├── js/
       │   └── api.js  ← CRITICAL: Must have Render URL
       ├── css/
       ├── images/
       └── (other asset folders)
   ```

---

## Step 3: Node.js Settings (Since Backend is on Render)

### 3.1 Disable Node.js on Plesk (Optional)
Since your backend is on Render, you don't need Node.js running on Plesk:

1. Go to **Websites & Domains** → `tayseerulquran.org`
2. Click **Node.js**
3. If Node.js is enabled:
   - Click **Disable Node.js** (or leave it disabled)
   - This is fine since backend is on Render

**Note:** You can leave Node.js disabled. It won't affect your frontend.

---

## Step 4: Web Hosting Settings

### 4.1 Document Root
1. Go to **Websites & Domains** → `tayseerulquran.org`
2. Click **Hosting Settings**
3. **Document Root:** Should be `/httpdocs`
4. **Website Scripting:** Can be enabled or disabled (doesn't matter for static frontend)

### 4.2 SSL/TLS Certificate
1. Go to **Websites & Domains** → `tayseerulquran.org`
2. Click **SSL/TLS Settings**
3. Ensure SSL is enabled
4. Your site should be accessible via `https://tayseerulquran.org`

### 4.3 PHP Settings (Not Required)
- PHP settings don't matter since you're serving static HTML/JS/CSS files
- Default settings are fine

---

## Step 5: Verification

### 5.1 Test API Connection
1. Upload the test file: `test-api-connection.html` to `/httpdocs/`
2. Visit: `https://tayseerulquran.org/test-api-connection.html`
3. Click **Test Health Endpoint**
4. Should show: ✅ Success with Render backend URL

### 5.2 Test Login Page
1. Visit: `https://tayseerulquran.org/login.html`
2. Open browser console (F12)
3. Check console output:
   - Should see: `"Production API URL set to: https://tayseerulquran.onrender.com/api"`
   - Should see: `"Using Render API URL: https://tayseerulquran.onrender.com/api"`
4. Try logging in (will fail with wrong credentials, but should NOT show 404)

### 5.3 Check Network Tab
1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Try to log in
4. Check the request URL:
   - ✅ **Correct:** `https://tayseerulquran.onrender.com/api/auth/login`
   - ❌ **Wrong:** `https://tayseerulquran.org/api/auth/login`

---

## Step 6: Clear Browser Cache

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

### Problem: Still Getting 404 Errors

**Check:**
1. ✅ Files uploaded to correct location (`/httpdocs/`)
2. ✅ `api.js` contains Render URL (`tayseerulquran.onrender.com`)
3. ✅ Browser cache cleared
4. ✅ Tested in incognito window

**Solution:**
- Re-upload `assets/js/api.js` file
- Re-upload all HTML files
- Clear browser cache again

### Problem: Console Shows Wrong API URL

**Check:**
1. Open `/httpdocs/login.html` in Plesk editor
2. Search for `tayseerulquran.org/api`
3. If found → file is wrong, re-upload

**Solution:**
- Delete `login.html` from Plesk
- Re-upload from local `TayseerulQuran/login.html`

### Problem: Files Not Uploading

**Check:**
1. File permissions in Plesk
2. Disk space available
3. Upload size limits

**Solution:**
- Use FTP instead of File Manager for large files
- Upload in smaller batches

---

## Quick Checklist

Before testing, verify:

- [ ] All old files deleted from `/httpdocs/`
- [ ] All frontend files uploaded to `/httpdocs/`
- [ ] `assets/js/api.js` contains Render URL
- [ ] All HTML files contain Render URL override
- [ ] File structure is correct (`assets/` folder exists)
- [ ] Browser cache cleared
- [ ] Tested in incognito window
- [ ] Console shows correct API URL
- [ ] Network tab shows requests to Render

---

## Summary

1. **Delete** all files from `/httpdocs/` in Plesk
2. **Upload** all files from local `TayseerulQuran/` folder to `/httpdocs/`
3. **Verify** `api.js` and HTML files have Render URL
4. **Clear** browser cache
5. **Test** login page and check console/network tab

Your backend is on Render, so Plesk only serves the frontend files. No Node.js configuration needed on Plesk.

---

## File Upload Priority

If you need to upload files in priority order:

1. **First:** `assets/js/api.js` (most critical)
2. **Second:** `login.html`, `register.html` (main pages)
3. **Third:** All other HTML files
4. **Fourth:** `assets/` folder (CSS, images, etc.)
5. **Last:** Any other static files

---

## Need Help?

If you still see 404 errors after following this guide:

1. Check the test file: `test-api-connection.html`
2. Check browser console for exact error
3. Check Network tab for request URL
4. Verify Render backend is running: `https://tayseerulquran.onrender.com/api/health`


