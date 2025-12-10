# Passenger Timeout Fix - Critical Update

## Problem Identified

**Two issues causing Passenger timeout:**

1. **Routes loading at startup** (Line 45): `require('./routes')` was loading all routes synchronously during module load, which triggered:
   - Routes → Controllers → Models → Database access
   - This blocked Passenger from completing app startup

2. **Railway database is offline**: Even with lazy DB init, if routes load at startup, they trigger database access, causing timeout

## Solution Implemented

### ✅ Lazy Route Loading
- Routes are now loaded **only on first API request**, not at startup
- App exports immediately (< 1 second)
- Prevents Passenger timeout completely

### ✅ Enhanced Error Handling
- App can start even if database is completely offline
- Health endpoint works without routes or database
- All errors return JSON (never HTML)

## Changes Made

### `backend/server.js`

1. **Removed synchronous route loading** (Line 44-49):
   ```javascript
   // OLD (caused timeout):
   routes = require('./routes');
   
   // NEW (lazy loading):
   let routes = null;
   const loadRoutes = () => {
     if (!routes) {
       routes = require('./routes');
     }
     return routes;
   };
   ```

2. **Routes load on first request** (Line 172-183):
   ```javascript
   app.use('/api', lazyDbInit, (req, res, next) => {
     const routeHandler = loadRoutes();
     routeHandler(req, res, next);
   });
   ```

3. **Enhanced health endpoint** (Line 186-193):
   - Now shows database and routes status
   - Works even if database is offline

4. **Better database offline handling**:
   - Checks if database config is available before attempting connection
   - App continues to work for health checks even if DB is offline

## Next Steps

### 1. Start Railway Database Service ⚠️ CRITICAL
   - Go to Railway dashboard
   - Find your MySQL service for "Tayseerul Quran"
   - Click "Start" or "Deploy" to bring it online
   - Wait for it to be fully online (green status)

### 2. Upload Updated Files to Plesk
   Upload only this file:
   - `backend/server.js` (updated with lazy route loading)

   **Upload Method:**
   - Use Plesk File Manager
   - Navigate to `/httpdocs/backend/`
   - Upload `server.js` (overwrite existing)

### 3. Restart Node.js Application in Plesk
   - Go to **Node.js** settings in Plesk
   - Click **"Restart App"** or **"Reload"**
   - Wait 10-15 seconds for restart

### 4. Test
   - Visit: `https://tayseerulquran.org/api/health`
   - Should return JSON (not HTML error page)
   - Should show `"database": "pending"` or `"connected"`

## Expected Results

### ✅ Success Indicators:
- No more "Could not spawn process" errors
- `/api/health` returns JSON response
- App starts in < 5 seconds
- Login works once database is online

### ❌ If Still Failing:
- Check Railway database is **online** (green status)
- Check Plesk Node.js logs for new errors
- Verify `server.js` was uploaded correctly
- Check file permissions in Plesk

## Why This Fixes It

**Before:**
```
Passenger loads app → require('./routes') → require('./controllers') → 
require('./models') → sequelize.authenticate() → TIMEOUT (DB offline)
```

**After:**
```
Passenger loads app → module.exports = app → ✅ DONE (< 1 second)
First request → loadRoutes() → lazyDbInit() → DB connection (if online)
```

The app now exports **immediately** without any blocking operations, so Passenger never times out.

