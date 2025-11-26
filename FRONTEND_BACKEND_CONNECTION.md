# Frontend-Backend Connection Summary

This document summarizes all the changes made to connect the frontend and backend of the TayseerulQuran project.

## 📋 Files Created

### 1. `tayseerulquran/assets/js/api.js`
**Purpose**: API service layer for frontend-backend communication

**Key Features**:
- API configuration with base URL (`http://localhost:3000/api`)
- Token management (localStorage for auth tokens)
- User data storage
- API request helper with error handling
- Complete API methods for:
  - Authentication (login, register, profile, change password, logout)
  - Courses (CRUD operations)
  - Users (get, update)
  - Students (get, enroll)
  - Tutors (get)
  - Blog (CRUD operations)

**Usage Example**:
```javascript
// Login
const response = await API.auth.login(email, password);

// Register
const response = await API.auth.register(userData);

// Get courses
const courses = await API.course.getAll();
```

---

## 📝 Files Modified

### 2. `tayseerulquran/login.html`
**Changes Made**:
- Added form ID: `loginForm`
- Added input IDs: `loginEmail`, `loginPassword`
- Changed button to `type="submit"`
- Added message div: `loginMessage` for success/error feedback
- Added API script: `<script src="assets/js/api.js"></script>`
- Added form submit handler with:
  - API integration
  - Token storage
  - User data storage
  - Role-based redirects
  - Error handling
  - Loading states

**Form Structure**:
```html
<form id="loginForm">
    <input type="email" id="loginEmail" placeholder="Username or Email" required>
    <input type="password" id="loginPassword" placeholder="Password" required>
    <button type="submit">Login</button>
    <div id="loginMessage"></div>
</form>
```

**Redirect Logic**:
- Super Admin/Admin → `super-admin-dashboard.html`
- Tutor → `staff-dashboard.html`
- Student/Other → `index.html`

---

### 3. `tayseerulquran/register.html`
**Changes Made**:
- Added form ID: `registerForm`
- Split "Name" into two fields: `regFirstName`, `regLastName`
- Added input IDs: `regEmail`, `regPassword`, `regConfirmPassword`, `regPhone`
- Changed button to `type="submit"`
- Added message div: `registerMessage` for success/error feedback
- Added API script: `<script src="assets/js/api.js"></script>`
- Added form submit handler with:
  - Password validation (match and length)
  - API integration
  - Token storage
  - User data storage
  - Error handling
  - Loading states

**Form Structure**:
```html
<form id="registerForm">
    <input type="text" id="regFirstName" placeholder="First Name" required>
    <input type="text" id="regLastName" placeholder="Last Name" required>
    <input type="email" id="regEmail" placeholder="Email" required>
    <input type="password" id="regPassword" placeholder="Password" required>
    <input type="password" id="regConfirmPassword" placeholder="Confirm Password" required>
    <input type="tel" id="regPhone" placeholder="Phone (optional)">
    <button type="submit">Create an account</button>
    <div id="registerMessage"></div>
</form>
```

**Validation**:
- Passwords must match
- Password minimum length: 6 characters
- All required fields validated

---

### 4. `backend/server.js`
**Changes Made**:
- Updated CORS configuration to support multiple origins
- Added flexible origin handling for development
- Allows common development ports (5500, 8080, etc.)
- In development mode, allows all origins for easier testing

**CORS Configuration**:
```javascript
const allowedOrigins = env.CORS_ORIGIN ? 
  (Array.isArray(env.CORS_ORIGIN) ? env.CORS_ORIGIN : env.CORS_ORIGIN.split(',').map(o => o.trim())) :
  [
    'http://localhost:5500',
    'http://localhost:8080',
    'http://127.0.0.1:5500',
    'http://127.0.0.1:8080',
    'http://localhost:3000'
  ];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      if (env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true
}));
```

---

### 5. `backend/config/env.js`
**Changes Made**:
- Updated default CORS_ORIGIN to support multiple frontend ports
- Changed from single origin to comma-separated list

**Before**:
```javascript
CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',

```

**After**:
```javascript
CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5500,http://localhost:8080,http://127.0.0.1:5500,http://127.0.0.1:8080',
```

---

## 🔗 API Endpoints Used

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `POST /api/auth/change-password` - Change password (protected)

### Other Available Endpoints (Ready to Use)
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course (protected)
- `PUT /api/courses/:id` - Update course (protected)
- `DELETE /api/courses/:id` - Delete course (protected)
- `GET /api/users` - Get all users (protected)
- `GET /api/students` - Get all students (protected)
- `GET /api/tutors` - Get all tutors (protected)
- `GET /api/blog` - Get all blog posts
- And more...

---

## 🚀 How to Test

### Step 1: Start Backend Server
```powershell
cd backend
npm start
```
Server will run on: `http://localhost:3000`

### Step 2: Serve Frontend
- Use Live Server in VS Code (usually port 5500)
- Or any static file server on port 5500 or 8080
- Open `login.html` or `register.html` in browser

### Step 3: Test Registration
1. Go to `register.html`
2. Fill in the form:
   - First Name
   - Last Name
   - Email
   - Password (min 6 characters)
   - Confirm Password
   - Phone (optional)
3. Click "Create an account"
4. Should see success message and redirect to `index.html`

### Step 4: Test Login
1. Go to `login.html`
2. Enter email and password
3. Click "Login"
4. Should see success message and redirect based on role:
   - Admin → `super-admin-dashboard.html`
   - Tutor → `staff-dashboard.html`
   - Student → `index.html`

---

## ✅ Features Implemented

1. ✅ **Authentication Integration**
   - Login form connected to backend
   - Registration form connected to backend
   - Token-based authentication

2. ✅ **Token Management**
   - JWT tokens stored in localStorage
   - Automatic token inclusion in API requests
   - Token removal on logout

3. ✅ **User Data Management**
   - User data stored in localStorage
   - Accessible across all pages via `API.config.getUser()`

4. ✅ **Error Handling**
   - Clear error messages displayed to users
   - Network error handling
   - Validation error handling

5. ✅ **User Feedback**
   - Success messages (green)
   - Error messages (red)
   - Loading states on buttons

6. ✅ **Role-Based Navigation**
   - Automatic redirects based on user role
   - Different dashboards for different roles

7. ✅ **CORS Configuration**
   - Multiple origin support
   - Development-friendly settings
   - Production-ready configuration

---

## 📁 File Structure

```
tayseerulquran/
├── assets/
│   └── js/
│       └── api.js          ← NEW: API service file
├── login.html              ← MODIFIED: Added API integration
└── register.html           ← MODIFIED: Added API integration

backend/
├── config/
│   └── env.js              ← MODIFIED: Updated CORS defaults
└── server.js                ← MODIFIED: Enhanced CORS handling
```

---

## 🔧 Configuration

### API Base URL
Located in: `tayseerulquran/assets/js/api.js`
```javascript
BASE_URL: 'http://localhost:3000/api'
```

To change the backend URL, update this value.

### CORS Origins
Located in: `backend/config/env.js`
```javascript
CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5500,http://localhost:8080,...'
```

Or set in `.env` file:
```
CORS_ORIGIN=http://localhost:5500,http://localhost:8080
```

---

## 🎯 Next Steps

You can now:
1. Use `API.auth.login()` and `API.auth.register()` in other pages
2. Use `API.course.getAll()` to fetch courses
3. Use `API.user.getProfile()` to get user data
4. Add API calls to other pages (courses, blog, etc.)
5. Implement protected routes using `API.config.getAuthToken()`

---

## 📝 Notes

- All API calls use async/await
- Tokens are automatically included in authenticated requests
- User data persists across page refreshes (localStorage)
- Error messages are user-friendly
- Forms have client-side validation before API calls

---

## 🛠️ Additional Utilities Created

### 6. `tayseerulquran/assets/js/utils.js`
**Purpose**: Helper utilities for common frontend operations

**Key Features**:
- Loading state management
- Success/error message display
- Authentication checks
- Role and permission checks
- Date and currency formatting
- Page protection helpers
- API error handling

**Usage Examples**:
```javascript
// Check if user is authenticated
if (Utils.isAuthenticated()) {
  // User is logged in
}

// Check user role
if (Utils.hasRole('admin')) {
  // User is admin
}

// Show loading state
Utils.showLoading(buttonElement);

// Show success message
Utils.showSuccess('Operation successful!', '#messageContainer');

// Format currency
Utils.formatCurrency(99.99); // $99.99

// Format date
Utils.formatDate('2024-01-15'); // January 15, 2024
```

### 7. `tayseerulquran/assets/js/examples.js`
**Purpose**: Ready-to-use code examples for common integrations

**Includes Examples For**:
- Loading and displaying courses
- Loading and displaying blog posts
- Enrolling in courses
- Creating courses (admin/tutor)
- Updating user profile
- Displaying user info in header
- Protecting pages (require auth/role)
- Loading course details
- Page initialization

**How to Use**:
1. Copy the example functions you need
2. Adapt them to your specific HTML structure
3. Include the scripts in your HTML:
   ```html
   <script src="assets/js/api.js"></script>
   <script src="assets/js/utils.js"></script>
   <script src="assets/js/examples.js"></script>
   ```

---

## 📚 Quick Integration Guide

### Adding API to a New Page

1. **Include Required Scripts** (before closing `</body>` tag):
   ```html
   <script src="assets/js/api.js"></script>
   <script src="assets/js/utils.js"></script>
   ```

2. **Check Authentication** (if needed):
   ```javascript
   if (!Utils.requireAuth()) {
     return; // Will redirect to login
   }
   ```

3. **Load Data**:
   ```javascript
   async function loadData() {
     try {
       const response = await API.course.getAll();
       // Display data
     } catch (error) {
       Utils.handleApiError(error, '#errorMessage');
     }
   }
   ```

4. **Handle User Actions**:
   ```javascript
   async function handleAction() {
     const button = event.target;
     Utils.showLoading(button);
     try {
       const response = await API.course.create(data);
       Utils.showSuccess('Success!', '#message');
     } catch (error) {
       Utils.handleApiError(error, '#errorMessage');
     } finally {
       Utils.hideLoading(button);
     }
   }
   ```

---

## 🔍 Testing Checklist

### Basic Connection Test
- [ ] Backend server running on port 3000
- [ ] Frontend accessible (port 5500 or 8080)
- [ ] Can open `login.html` without errors
- [ ] Can open `register.html` without errors
- [ ] Browser console shows no errors

### Login Test
- [ ] Login form submits correctly
- [ ] Success message appears on valid login
- [ ] Error message appears on invalid login
- [ ] Redirects to correct page based on role
- [ ] Token stored in localStorage

### Registration Test
- [ ] Registration form submits correctly
- [ ] Password validation works (match, length)
- [ ] Success message appears on valid registration
- [ ] Error message appears on duplicate email
- [ ] Redirects to home page after registration

### API Test
- [ ] Can call `API.auth.login()`
- [ ] Can call `API.auth.register()`
- [ ] Can call `API.course.getAll()`
- [ ] Can call `API.blog.getAll()`
- [ ] Token automatically included in authenticated requests

---

## 🎯 Next Steps

1. **Integrate Courses Page**:
   - Use `loadCourses()` example from `examples.js`
   - Display courses from backend
   - Add enroll functionality

2. **Integrate Blog Pages**:
   - Use `loadBlogPosts()` example
   - Display blog posts from backend
   - Add create/edit for admins

3. **Add User Profile Page**:
   - Use `updateProfile()` example
   - Display current user info
   - Allow profile updates

4. **Protect Admin Pages**:
   - Use `protectPageByRole('admin')` on admin pages
   - Redirect unauthorized users

5. **Add Logout Functionality**:
   - Add logout button to header
   - Call `API.auth.logout()` on click

---

**Status**: ✅ Frontend and Backend are now fully connected!

**Additional Files Created**:
- ✅ `tayseerulquran/assets/js/utils.js` - Utility helpers
- ✅ `tayseerulquran/assets/js/examples.js` - Code examples

