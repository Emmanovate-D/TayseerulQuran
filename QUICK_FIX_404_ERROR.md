# Quick Fix: 404 Error on Login

## Problem
You're getting a **404 Not Found** error when trying to log in. This means the frontend is calling the wrong backend URL.

## Root Cause
The files on Plesk are **outdated** - they're still pointing to `tayseerulquran.org/api` instead of `tayseerulquran.onrender.com/api`.

---

## Solution: 3 Steps

### Step 1: Delete Old Files from Plesk
1. Log in to Plesk
2. Go to **File Manager** → `/httpdocs/`
3. **Delete everything** (or at least delete):
   - `assets/js/api.js`
   - All `.html` files (login.html, register.html, etc.)

### Step 2: Upload Updated Files
Upload these files from your local `TayseerulQuran/` folder to `/httpdocs/`:

**Priority 1 (Most Critical):**
- `assets/js/api.js` → `/httpdocs/assets/js/api.js`

**Priority 2:**
- `login.html` → `/httpdocs/login.html`
- `register.html` → `/httpdocs/register.html`
- All other `.html` files

**Priority 3:**
- Rest of `assets/` folder (CSS, images, etc.)

### Step 3: Verify & Clear Cache
1. **Verify in Plesk:**
   - Open `/httpdocs/assets/js/api.js` in Plesk editor
   - Search for: `tayseerulquran.onrender.com`
   - Should find it on line 26

2. **Clear Browser Cache:**
   - Press `Ctrl + Shift + Delete`
   - Select "Cached images and files"
   - Clear data

3. **Test in Incognito:**
   - Open new incognito window
   - Go to: `https://tayseerulquran.org/login.html`
   - Open console (F12)
   - Should see: `"Production API URL set to: https://tayseerulquran.onrender.com/api"`

---

## What to Check

### ✅ Correct (What You Should See)
```
Console: "Production API URL set to: https://tayseerulquran.onrender.com/api"
Console: "Using Render API URL: https://tayseerulquran.onrender.com/api"
Network Tab: POST https://tayseerulquran.onrender.com/api/auth/login
```

### ❌ Wrong (What You're Seeing Now)
```
Console: "Production API URL set to: https://tayseerulquran.org/api"
Network Tab: POST https://tayseerulquran.org/api/auth/login 404
```

---

## Quick Test File

After uploading, test with this file:

1. Upload `test-api-connection.html` to `/httpdocs/`
2. Visit: `https://tayseerulquran.org/test-api-connection.html`
3. Click **Test Health Endpoint**
4. Should show: ✅ Success

---

## Still Not Working?

If you still see 404 after following these steps:

1. **Check file dates in Plesk:**
   - Files should have recent modification dates
   - If dates are old → files weren't uploaded correctly

2. **Re-upload `api.js` specifically:**
   - Delete `/httpdocs/assets/js/api.js` from Plesk
   - Upload fresh copy from local `TayseerulQuran/assets/js/api.js`

3. **Check browser console:**
   - Open console (F12)
   - Look for any errors
   - Check Network tab to see actual request URL

4. **Verify Render backend is running:**
   - Visit: `https://tayseerulquran.onrender.com/api/health`
   - Should return JSON with `"success": true`

---

## Summary

The issue is simple: **Old files on Plesk**. 

**Fix:** Delete old files → Upload new files → Clear cache → Test

That's it! 🎯


