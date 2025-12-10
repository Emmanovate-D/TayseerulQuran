# How to Debug Passenger Errors

## The Real Problem

The error "Unable to find the file /var/www/vhosts/tayseerulquran.org/httpdocs/backend/public/tmp/passenger-error-XXX.html" means:
- **Passenger is trying to write an error file because the app crashed**
- The directory doesn't exist (we just fixed this)
- **But the real issue is: WHY is the app crashing?**

## Step 1: Get the Actual Error from Plesk Logs

### Method 1: Node.js Logs (Most Important)

1. **In Plesk:**
   - Go to **Domains** → **tayseerulquran.org**
   - Click **Node.js**
   - Click **"Logs"** or **"View Logs"** button
   - Look for the **most recent errors** (scroll to bottom)

2. **What to look for:**
   - Error messages starting with `❌` or `⚠️`
   - Stack traces
   - "Error caught by global handler"
   - "Route execution error"
   - "Database connection" errors

3. **Copy the last 50-100 lines** and share them

### Method 2: Main Error Logs

1. **In Plesk:**
   - Go to **Logs** (main menu)
   - Click **Error Log**
   - Filter by domain: `tayseerulquran.org`
   - Look for recent errors

### Method 3: Apache Error Logs

1. **In Plesk:**
   - Go to **Logs** → **Error Log**
   - Look for Passenger-related errors
   - Look for "500 Internal Server Error" entries

## Step 2: Test the Health Endpoint

1. **Visit:** `https://tayseerulquran.org/api/health`
2. **Check browser console** (F12 → Console tab)
3. **What you should see:**
   - ✅ **JSON response** = App is working
   - ❌ **HTML error page** = App is still crashing

## Step 3: Test Login and Check Logs

1. **Try to login** at `https://tayseerulquran.org/login.html`
2. **Immediately check Plesk Node.js logs** (within 10 seconds)
3. **Look for:**
   - "Routes loaded on first request"
   - "Lazy database initialization started"
   - Any error messages

## Common Errors and Fixes

### Error: "Database connection timeout"
- **Cause:** Railway database is offline or unreachable
- **Fix:** Check Railway dashboard, ensure MySQL service is online

### Error: "Routes not loaded"
- **Cause:** Error loading route files
- **Fix:** Check if all route files exist in `/httpdocs/backend/routes/`

### Error: "Cannot find module"
- **Cause:** Missing dependency or wrong path
- **Fix:** Run `npm install` in Plesk or check file paths

### Error: "JWT_SECRET is not defined"
- **Cause:** Missing environment variable
- **Fix:** Add `JWT_SECRET` to Plesk Node.js environment variables

## What to Share for Help

When asking for help, share:

1. **Plesk Node.js Logs** (last 50-100 lines)
2. **Browser Console Errors** (F12 → Console)
3. **What you were doing** when the error occurred (login, health check, etc.)
4. **Railway Database Status** (online/offline)

## Quick Checklist

- [ ] Railway MySQL service is **online** (green status)
- [ ] All environment variables are set in Plesk
- [ ] Updated `server.js` is uploaded to `/httpdocs/backend/`
- [ ] Node.js app is **restarted** in Plesk
- [ ] `/api/health` returns JSON (not HTML)
- [ ] Checked Plesk Node.js logs for actual errors

## Next Steps

1. **Get the actual error from Plesk logs** (most important!)
2. **Share the error message** so we can fix the root cause
3. **The directory issue is fixed** - now we need to fix the crash

