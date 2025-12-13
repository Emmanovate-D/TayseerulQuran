# Test Details - TayseerulQuran Application

## 🎯 Test Credentials

### Super Admin (Full Access)
- **Email:** `superadmin@tayseerulquran.com`
- **Password:** `SuperAdmin123!`
- **Access:** Full system access, all features

### Admin
- **Email:** `admin@tayseerulquran.com`
- **Password:** `Admin123!`
- **Access:** Administrative access

### Tutor
- **Email:** `tutor@tayseerulquran.com`
- **Password:** `Tutor123!`
- **Access:** Teaching and course management

### Staff
- **Email:** `staff@tayseerulquran.com`
- **Password:** `Staff123!`
- **Access:** Staff access

---

## 🔗 Test URLs

### Frontend (Plesk)
- **Homepage:** `https://tayseerulquran.org`
- **Login:** `https://tayseerulquran.org/login.html`
- **Register:** `https://tayseerulquran.org/register.html`
- **Super Admin Dashboard:** `https://tayseerulquran.org/super-admin-dashboard.html`

### Backend API (Render)
- **Health Check:** `https://tayseerulquran.onrender.com/api/health`
- **Database Sync:** `https://tayseerulquran.onrender.com/api/admin/sync-db`
- **API Base:** `https://tayseerulquran.onrender.com/api`

---

## ✅ Pre-Test Checklist

Before testing, ensure:

- [ ] Render backend is deployed and running
- [ ] Database sync completed successfully (all 12 models synced)
- [ ] Frontend files uploaded to Plesk
- [ ] Browser cache cleared (or use incognito window)

---

## 🧪 Test Scenarios

### Test 1: Backend Health Check

**Steps:**
1. Visit: `https://tayseerulquran.onrender.com/api/health`
2. Check response

**Expected Result:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "...",
  "database": "connected",
  "routes": "loaded"
}
```

**✅ Pass Criteria:**
- Status: `200 OK`
- `database: "connected"`
- `routes: "loaded"`

---

### Test 2: Database Sync

**Steps:**
1. Visit: `https://tayseerulquran.onrender.com/api/admin/sync-db`
2. Check response
3. Check Render logs

**Expected Result:**
```json
{
  "success": true,
  "message": "Database sync completed. 12 models synced successfully.",
  "timestamp": "...",
  "database": "synced",
  "summary": {
    "successful": 12,
    "failed": 0,
    "total": 12
  }
}
```

**✅ Pass Criteria:**
- All 12 models synced successfully
- No errors in Render logs
- All phases completed (Phase 1-4)

---

### Test 3: User Login

**Steps:**
1. Visit: `https://tayseerulquran.org/login.html`
2. Enter credentials:
   - Email: `superadmin@tayseerulquran.com`
   - Password: `SuperAdmin123!`
3. Click "Login"
4. Check browser console (F12)
5. Check Network tab

**Expected Result:**
- ✅ Redirected to dashboard
- ✅ Console shows: `"Production API URL set to: https://tayseerulquran.onrender.com/api"`
- ✅ Network tab shows: `POST https://tayseerulquran.onrender.com/api/auth/login`
- ✅ Status: `200 OK`
- ✅ Response contains user data and JWT token

**✅ Pass Criteria:**
- Login successful
- No console errors
- Request goes to Render backend (not Plesk)
- User redirected to appropriate dashboard

---

### Test 4: Super Admin Dashboard

**Steps:**
1. Log in as Super Admin
2. Navigate to: `https://tayseerulquran.org/super-admin-dashboard.html`
3. Check browser console (F12)
4. Check Network tab
5. Verify dashboard loads data

**Expected Result:**
- ✅ Dashboard loads without errors
- ✅ Statistics display (students, tutors, courses, revenue)
- ✅ Recent payments load
- ✅ Recent enrollments load
- ✅ No "Table doesn't exist" errors
- ✅ All API calls return `200 OK`

**✅ Pass Criteria:**
- Dashboard displays correctly
- All sections load data
- No console errors
- No 404 or 500 errors in Network tab

**API Endpoints Tested:**
- `GET /api/students` - Should return student list
- `GET /api/tutors` - Should return tutor list
- `GET /api/courses` - Should return course list
- `GET /api/payments?limit=5` - Should return recent payments
- `GET /api/enrollments?limit=5` - Should return recent enrollments
- `GET /api/payments?limit=1000` - Should return all payments for revenue

---

### Test 5: User Registration

**Steps:**
1. Visit: `https://tayseerulquran.org/register.html`
2. Fill in registration form:
   - First Name: `Test`
   - Last Name: `User`
   - Email: `testuser@example.com` (use unique email)
   - Password: `Test123!`
   - Confirm Password: `Test123!`
3. Click "Register"
4. Check console and Network tab

**Expected Result:**
- ✅ Registration successful
- ✅ User created in database
- ✅ Redirected to login or dashboard
- ✅ No console errors

**✅ Pass Criteria:**
- Registration completes successfully
- New user can log in
- User has appropriate default role (likely "student")

---

### Test 6: API Endpoints

**Test each endpoint:**

#### 6.1 Get All Courses
- **URL:** `https://tayseerulquran.onrender.com/api/courses`
- **Method:** `GET`
- **Expected:** `200 OK`, returns course list

#### 6.2 Get All Students
- **URL:** `https://tayseerulquran.onrender.com/api/students`
- **Method:** `GET`
- **Expected:** `200 OK`, returns student list

#### 6.3 Get All Tutors
- **URL:** `https://tayseerulquran.onrender.com/api/tutors`
- **Method:** `GET`
- **Expected:** `200 OK`, returns tutor list

#### 6.4 Get All Payments
- **URL:** `https://tayseerulquran.onrender.com/api/payments`
- **Method:** `GET`
- **Expected:** `200 OK`, returns payment list

#### 6.5 Get All Enrollments
- **URL:** `https://tayseerulquran.onrender.com/api/enrollments`
- **Method:** `GET`
- **Expected:** `200 OK`, returns enrollment list

**✅ Pass Criteria:**
- All endpoints return `200 OK`
- All return JSON data (not HTML errors)
- No "Table doesn't exist" errors

---

### Test 7: Browser Console Check

**Steps:**
1. Open any page (e.g., dashboard)
2. Press `F12` to open DevTools
3. Go to Console tab
4. Check for errors

**Expected Result:**
- ✅ No red errors
- ✅ API URL shows Render backend
- ✅ No "Table doesn't exist" errors
- ✅ No CORS errors
- ✅ No 404 or 500 errors

**✅ Pass Criteria:**
- Console is clean (no critical errors)
- All API calls successful

---

### Test 8: Network Tab Check

**Steps:**
1. Open any page
2. Press `F12` → Network tab
3. Interact with the page (login, load dashboard, etc.)
4. Check request URLs and status codes

**Expected Result:**
- ✅ All API requests go to: `https://tayseerulquran.onrender.com/api/...`
- ✅ No requests to: `https://tayseerulquran.org/api/...`
- ✅ All requests return `200 OK` or `401` (for unauthorized)
- ✅ No `404` or `500` errors

**✅ Pass Criteria:**
- All requests go to Render backend
- No failed requests (red in Network tab)

---

## 🐛 Common Issues & Solutions

### Issue: "Table doesn't exist" errors
**Solution:**
1. Visit: `https://tayseerulquran.onrender.com/api/admin/sync-db`
2. Wait for sync to complete
3. Check Render logs for success
4. Refresh dashboard

### Issue: 404 errors on login
**Solution:**
1. Check browser console - should show Render URL
2. Clear browser cache (`Ctrl + Shift + Delete`)
3. Test in incognito window
4. Verify `api.js` has Render URL

### Issue: 500 errors
**Solution:**
1. Check Render logs for specific error
2. Verify database connection
3. Check if all tables exist (run sync endpoint)
4. Verify environment variables in Render

### Issue: CORS errors
**Solution:**
1. Check Render environment variables
2. Verify `CORS_ORIGIN` includes `https://tayseerulquran.org`
3. Check backend logs for CORS messages

---

## 📊 Test Results Template

Use this template to track test results:

```
Test Date: ___________
Tester: ___________

Test 1: Backend Health Check
- [ ] Pass
- [ ] Fail
- Notes: ___________

Test 2: Database Sync
- [ ] Pass
- [ ] Fail
- Notes: ___________

Test 3: User Login
- [ ] Pass
- [ ] Fail
- Notes: ___________

Test 4: Super Admin Dashboard
- [ ] Pass
- [ ] Fail
- Notes: ___________

Test 5: User Registration
- [ ] Pass
- [ ] Fail
- Notes: ___________

Test 6: API Endpoints
- [ ] All Pass
- [ ] Some Fail
- Failed Endpoints: ___________

Test 7: Browser Console
- [ ] Pass (no errors)
- [ ] Fail (has errors)
- Errors: ___________

Test 8: Network Tab
- [ ] Pass (all requests successful)
- [ ] Fail (some requests failed)
- Failed Requests: ___________
```

---

## ✅ Success Criteria

All tests pass when:
- ✅ Backend health check returns `database: "connected"`
- ✅ Database sync completes with 12/12 models successful
- ✅ Login works with test credentials
- ✅ Dashboard loads all data without errors
- ✅ All API endpoints return `200 OK`
- ✅ No console errors
- ✅ All network requests successful
- ✅ No "Table doesn't exist" errors

---

## 🚀 Quick Test Sequence

1. **Health Check:** `https://tayseerulquran.onrender.com/api/health`
2. **Database Sync:** `https://tayseerulquran.onrender.com/api/admin/sync-db`
3. **Login:** `https://tayseerulquran.org/login.html` (use Super Admin credentials)
4. **Dashboard:** Verify all sections load
5. **Console Check:** F12 → Console tab (should be clean)
6. **Network Check:** F12 → Network tab (all requests successful)

---

## 📝 Notes

- Always test in incognito window to avoid cache issues
- Check Render logs if you see errors
- Database sync may take 10-30 seconds
- First request to Render may be slow (free tier cold start)

---

**Last Updated:** After fixing database sync and index column names


