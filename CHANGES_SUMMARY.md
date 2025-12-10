# Code Changes Summary for Plesk Deployment

## Date: Latest Update
## Purpose: Fix Passenger timeout errors and improve Plesk deployment reliability

---

## Files Modified

### 1. `backend/server.js`

#### Changes Made:
1. **Removed static file serving** - Frontend files are now served separately by Apache/Plesk, not by the Node.js backend
2. **Added database connection timeout** - Database connection test now has a 5-second timeout to prevent hanging
3. **Improved Passenger compatibility** - App exports immediately before any async operations
4. **Fixed error handlers** - Error handlers no longer exit the process in production (prevents Passenger crashes)
5. **Early return on DB failure** - If database connection fails, the app continues but skips database initialization

#### Key Code Changes:
- Removed `app.use(express.static(publicPath))` and related static file serving
- Added `Promise.race()` with 5-second timeout for database connection test
- Moved `module.exports = app` to execute immediately (before async operations)
- Changed error handlers to not exit in production mode
- Added early return if database connection fails

---

### 2. `backend/config/database.js`

#### Changes Made:
1. **Reduced connection timeouts** - Changed from 10 seconds to 5 seconds
2. **Added timeout wrapper** - Database authentication now has a timeout wrapper to prevent indefinite hanging

#### Key Code Changes:
- `connectTimeout: 5000` (reduced from 10000)
- `acquire: 5000` (reduced from 10000)
- Added `Promise.race()` with 5-second timeout in `testConnection()`

---

## Why These Changes Were Made

### Problem: Passenger Timeout Errors
The backend was timing out when Passenger tried to spawn the application. This was caused by:
1. Database connection hanging indefinitely during startup
2. App not exporting immediately (Passenger requires immediate export)
3. Error handlers causing process exit in production

### Solution:
1. **Immediate App Export** - App now exports before any async operations
2. **Database Timeout** - Database connection has a 5-second timeout, preventing indefinite hangs
3. **Non-blocking Initialization** - Database initialization happens asynchronously after app export
4. **Graceful Error Handling** - Errors don't crash the app in production

---

## Testing Recommendations

After uploading to Plesk, test:

1. **Application Startup**
   - Check logs for: `🚀 Passenger detected - initializing app...`
   - Check logs for: `🌐 App module loaded successfully`
   - Should NOT see: "Passenger timeout" errors

2. **Database Connection**
   - Check logs for: `✅ Database connection established successfully.`
   - If connection fails, app should still start (with warning message)

3. **API Endpoints**
   - Test: `https://tayseerulquran.org/api/health`
   - Should return JSON response

4. **Frontend-Backend Connection**
   - Test login functionality
   - Check browser console for API calls
   - Verify API URL is `https://tayseerulquran.org/api`

---

## Files That Need to Be Uploaded

### Frontend (to `/httpdocs/`)
- All files from `TayseerulQuran/` folder
- No changes needed - files are already configured

### Backend (to `/httpdocs/backend/`)
- **MUST UPLOAD:**
  - `server.js` (modified)
  - `config/database.js` (modified)
  - All other backend files (unchanged)

---

## Environment Variables Required

Make sure these are set in Plesk Node.js settings:

```
NODE_ENV=production
PORT=3000
DB_HOST=<Railway TCP Proxy Host>
DB_PORT=<Railway TCP Proxy Port>
DB_NAME=<Railway Database Name>
DB_USER=<Railway Database User>
DB_PASSWORD=<Railway Database Password>
JWT_SECRET=<Your JWT Secret>
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=<Your JWT Refresh Secret>
JWT_REFRESH_EXPIRE=30d
CORS_ORIGIN=https://tayseerulquran.org
```

---

## Expected Behavior After Deployment

1. **Application starts immediately** - No Passenger timeout errors
2. **Database connects within 5 seconds** - Or app continues without database (with warning)
3. **API endpoints respond** - `/api/health` returns JSON
4. **Frontend connects to backend** - Login and other features work

---

## Rollback Instructions

If issues occur, you can:
1. Check application logs in Plesk
2. Verify environment variables are correct
3. Restart the Node.js application
4. Check database connectivity separately

---

## Notes

- The app is now more resilient to database connection issues
- Passenger timeout errors should be resolved
- The app will start even if database connection fails (with warnings)
- Database will retry on first API request if initial connection fails


