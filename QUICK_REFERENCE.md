# Quick Reference Guide - Frontend-Backend Integration

## 🚀 Quick Start

### 1. Start Backend
```powershell
cd backend
npm start
```

### 2. Serve Frontend
- Use Live Server (VS Code extension) - usually port 5500
- Or any static file server

### 3. Test Connection
- Open `login.html` or `register.html`
- Try logging in or registering

---

## 📦 Files to Include

### For Basic Pages (with API calls):
```html
<script src="assets/js/api.js"></script>
<script src="assets/js/utils.js"></script>
```

### For Pages with Examples:
```html
<script src="assets/js/api.js"></script>
<script src="assets/js/utils.js"></script>
<script src="assets/js/examples.js"></script>
```

---

## 🔑 Common API Calls

### Authentication
```javascript
// Login
const response = await API.auth.login(email, password);

// Register
const response = await API.auth.register({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'password123'
});

// Get Profile
const response = await API.auth.getProfile();

// Logout
API.auth.logout();
```

### Courses
```javascript
// Get all courses
const response = await API.course.getAll();

// Get course by ID
const response = await API.course.getById(courseId);

// Create course (admin/tutor)
const response = await API.course.create({
  title: 'Course Title',
  description: 'Description',
  price: 99.99
});

// Update course
const response = await API.course.update(courseId, courseData);

// Delete course
const response = await API.course.delete(courseId);
```

### Blog
```javascript
// Get all posts
const response = await API.blog.getAll();

// Get post by ID
const response = await API.blog.getById(postId);

// Create post
const response = await API.blog.create({
  title: 'Post Title',
  content: 'Post content...'
});
```

### Students
```javascript
// Get all students
const response = await API.student.getAll();

// Enroll in course
const response = await API.student.enroll(courseId);
```

---

## 🛠️ Utility Functions

### Authentication Checks
```javascript
// Check if user is logged in
if (Utils.isAuthenticated()) {
  // User is authenticated
}

// Get current user
const user = Utils.getCurrentUser();

// Check user role
if (Utils.hasRole('admin')) {
  // User is admin
}

// Check permission
if (Utils.hasPermission('edit_course')) {
  // User has permission
}
```

### Page Protection
```javascript
// Require authentication (redirects to login if not)
if (!Utils.requireAuth()) {
  return; // User redirected to login
}

// Require specific role
if (!Utils.requireRole('admin')) {
  return; // User redirected if not admin
}
```

### UI Helpers
```javascript
// Show loading state
Utils.showLoading(buttonElement);

// Hide loading state
Utils.hideLoading(buttonElement);

// Show success message
Utils.showSuccess('Success!', '#messageContainer');

// Show error message
Utils.showError('Error occurred', '#errorContainer');

// Clear message
Utils.clearMessage('#messageContainer');
```

### Formatting
```javascript
// Format date
Utils.formatDate('2024-01-15'); // "January 15, 2024"

// Format currency
Utils.formatCurrency(99.99); // "$99.99"
```

### Error Handling
```javascript
try {
  const response = await API.course.getAll();
} catch (error) {
  Utils.handleApiError(error, '#errorMessage');
}
```

---

## 📝 Common Patterns

### Pattern 1: Load and Display Data
```javascript
async function loadData() {
  try {
    const response = await API.course.getAll();
    if (response.success && response.data) {
      const container = document.getElementById('container');
      container.innerHTML = response.data.map(item => 
        `<div>${item.title}</div>`
      ).join('');
    }
  } catch (error) {
    Utils.handleApiError(error, '#errorMessage');
  }
}

// Call on page load
loadData();
```

### Pattern 2: Form Submission
```javascript
document.getElementById('myForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const button = e.target.querySelector('button[type="submit"]');
  Utils.showLoading(button);
  
  try {
    const formData = {
      // Get form values
    };
    
    const response = await API.course.create(formData);
    
    if (response.success) {
      Utils.showSuccess('Created successfully!', '#message');
      e.target.reset();
    }
  } catch (error) {
    Utils.handleApiError(error, '#errorMessage');
  } finally {
    Utils.hideLoading(button);
  }
});
```

### Pattern 3: Button Action
```javascript
async function handleAction(id) {
  const button = event.target;
  Utils.showLoading(button);
  
  try {
    const response = await API.course.delete(id);
    if (response.success) {
      Utils.showSuccess('Deleted successfully!', '#message');
      // Update UI
    }
  } catch (error) {
    Utils.handleApiError(error, '#errorMessage');
  } finally {
    Utils.hideLoading(button);
  }
}
```

### Pattern 4: Protected Page
```javascript
// At the top of your page script
if (!Utils.requireAuth()) {
  // User will be redirected to login
  return;
}

// Or require specific role
if (!Utils.requireRole('admin')) {
  // User will be redirected if not admin
  return;
}

// Rest of your page code...
```

---

## 🔍 Debugging

### Check if API is loaded
```javascript
console.log('API loaded:', typeof API !== 'undefined');
console.log('Utils loaded:', typeof Utils !== 'undefined');
```

### Check authentication
```javascript
console.log('Is authenticated:', Utils.isAuthenticated());
console.log('Current user:', Utils.getCurrentUser());
console.log('Token:', API.config.getAuthToken());
```

### Test API call
```javascript
// In browser console
API.course.getAll().then(console.log).catch(console.error);
```

### Check CORS
- Open browser DevTools → Network tab
- Look for CORS errors
- Check if backend is running on port 3000
- Check if frontend origin is allowed

---

## ⚠️ Common Issues

### "Failed to fetch"
- **Cause**: Backend not running or wrong URL
- **Fix**: Start backend server, check API base URL in `api.js`

### "Not allowed by CORS"
- **Cause**: Frontend origin not in allowed list
- **Fix**: Update CORS_ORIGIN in `backend/config/env.js` or `.env`

### "Unauthorized" or 401
- **Cause**: Token missing or expired
- **Fix**: User needs to login again

### Token not persisting
- **Cause**: localStorage disabled or cleared
- **Fix**: Check browser settings, use sessionStorage as fallback

---

## 📞 API Base URL

Default: `http://localhost:3000/api`

To change: Edit `tayseerulquran/assets/js/api.js` line 3:
```javascript
BASE_URL: 'http://your-backend-url/api'
```

---

## 🎯 File Locations

- **API Service**: `tayseerulquran/assets/js/api.js`
- **Utilities**: `tayseerulquran/assets/js/utils.js`
- **Examples**: `tayseerulquran/assets/js/examples.js`
- **Documentation**: `FRONTEND_BACKEND_CONNECTION.md`
- **This Guide**: `QUICK_REFERENCE.md`

---

**Need Help?** Check `FRONTEND_BACKEND_CONNECTION.md` for detailed documentation.



