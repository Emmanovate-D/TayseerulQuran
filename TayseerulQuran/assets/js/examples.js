// Example Code Snippets for API Integration
// Copy and adapt these examples to your pages

// ============================================
// EXAMPLE 1: Load and Display Courses
// ============================================
async function loadCourses() {
  try {
    const response = await API.course.getAll();
    if (response.success && response.data) {
      const courses = response.data;
      const container = document.getElementById('coursesContainer');
      
      if (container) {
        container.innerHTML = courses.map(course => `
          <div class="course-item">
            <h3>${course.title}</h3>
            <p>${course.description || ''}</p>
            <p>Price: ${Utils.formatCurrency(course.price || 0)}</p>
            <button onclick="viewCourse(${course.id})">View Details</button>
          </div>
        `).join('');
      }
    }
  } catch (error) {
    Utils.handleApiError(error, '#errorMessage');
  }
}

// ============================================
// EXAMPLE 2: Load and Display Blog Posts
// ============================================
async function loadBlogPosts() {
  try {
    const response = await API.blog.getAll();
    if (response.success && response.data) {
      const posts = response.data;
      const container = document.getElementById('blogContainer');
      
      if (container) {
        container.innerHTML = posts.map(post => `
          <article class="blog-post">
            <h2><a href="blog-details.html?id=${post.id}">${post.title}</a></h2>
            <p class="meta">Published: ${Utils.formatDate(post.createdAt)}</p>
            <p>${post.excerpt || post.content?.substring(0, 150)}...</p>
            <a href="blog-details.html?id=${post.id}">Read More</a>
          </article>
        `).join('');
      }
    }
  } catch (error) {
    Utils.handleApiError(error, '#errorMessage');
  }
}

// ============================================
// EXAMPLE 3: Enroll in a Course
// ============================================
async function enrollInCourse(courseId) {
  // Check authentication
  if (!Utils.isAuthenticated()) {
    alert('Please login to enroll in courses');
    window.location.href = 'login.html';
    return;
  }

  const button = event.target;
  Utils.showLoading(button);

  try {
    const response = await API.student.enroll(courseId);
    if (response.success) {
      Utils.showSuccess('Successfully enrolled in course!', '#successMessage');
      // Update UI or redirect
      setTimeout(() => {
        window.location.href = 'courses-details.html?id=' + courseId;
      }, 1500);
    }
  } catch (error) {
    Utils.handleApiError(error, '#errorMessage');
  } finally {
    Utils.hideLoading(button);
  }
}

// ============================================
// EXAMPLE 4: Create a Course (Admin/Tutor)
// ============================================
async function createCourse(courseData) {
  // Check authentication and role
  if (!Utils.requireAuth()) return;
  if (!Utils.hasRole('admin') && !Utils.hasRole('tutor')) {
    alert('You do not have permission to create courses');
    return;
  }

  const form = document.getElementById('createCourseForm');
  const submitBtn = form.querySelector('button[type="submit"]');
  
  Utils.showLoading(submitBtn);

  try {
    const response = await API.course.create(courseData);
    if (response.success) {
      Utils.showSuccess('Course created successfully!', '#successMessage');
      form.reset();
      // Reload courses list
      loadCourses();
    }
  } catch (error) {
    Utils.handleApiError(error, '#errorMessage');
  } finally {
    Utils.hideLoading(submitBtn);
  }
}

// ============================================
// EXAMPLE 5: Update User Profile
// ============================================
async function updateProfile(profileData) {
  if (!Utils.requireAuth()) return;

  const user = Utils.getCurrentUser();
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  const submitBtn = document.querySelector('#profileForm button[type="submit"]');
  Utils.showLoading(submitBtn);

  try {
    const response = await API.user.update(user.id, profileData);
    if (response.success) {
      // Update stored user data
      API.config.setUser(response.data.user);
      Utils.showSuccess('Profile updated successfully!', '#successMessage');
    }
  } catch (error) {
    Utils.handleApiError(error, '#errorMessage');
  } finally {
    Utils.hideLoading(submitBtn);
  }
}

// ============================================
// EXAMPLE 6: Display User Info in Header
// ============================================
function displayUserInfo() {
  const user = Utils.getCurrentUser();
  const userInfoContainer = document.getElementById('userInfo');
  const loginLink = document.getElementById('loginLink');
  const logoutLink = document.getElementById('logoutLink');

  if (user) {
    // User is logged in
    if (userInfoContainer) {
      userInfoContainer.innerHTML = `
        <span>Welcome, ${user.firstName} ${user.lastName}</span>
        ${user.roles && user.roles.length > 0 ? 
          `<span class="badge">${user.roles[0].name}</span>` : ''}
      `;
    }
    if (loginLink) loginLink.style.display = 'none';
    if (logoutLink) logoutLink.style.display = 'block';
  } else {
    // User is not logged in
    if (userInfoContainer) userInfoContainer.innerHTML = '';
    if (loginLink) loginLink.style.display = 'block';
    if (logoutLink) logoutLink.style.display = 'none';
  }
}

// ============================================
// EXAMPLE 7: Protect Page (Require Auth)
// ============================================
function protectPage() {
  // Add this to pages that require authentication
  if (!Utils.requireAuth()) {
    return false;
  }
  return true;
}

// ============================================
// EXAMPLE 8: Protect Page (Require Role)
// ============================================
function protectPageByRole(requiredRole) {
  // Add this to admin/tutor pages
  if (!Utils.requireAuth()) {
    return false;
  }
  if (!Utils.requireRole(requiredRole)) {
    return false;
  }
  return true;
}

// ============================================
// EXAMPLE 9: Load Course Details
// ============================================
async function loadCourseDetails(courseId) {
  try {
    const response = await API.course.getById(courseId);
    if (response.success && response.data) {
      const course = response.data;
      
      // Update page elements
      document.getElementById('courseTitle').textContent = course.title;
      document.getElementById('courseDescription').textContent = course.description;
      document.getElementById('coursePrice').textContent = Utils.formatCurrency(course.price);
      
      // Check if user is enrolled
      if (Utils.isAuthenticated()) {
        const user = Utils.getCurrentUser();
        // Add logic to check enrollment status
      }
    }
  } catch (error) {
    Utils.handleApiError(error, '#errorMessage');
  }
}

// ============================================
// EXAMPLE 10: Initialize Page
// ============================================
function initializePage() {
  // Display user info
  displayUserInfo();
  
  // Load data based on page
  const path = window.location.pathname;
  if (path.includes('courses.html')) {
    loadCourses();
  } else if (path.includes('blog')) {
    loadBlogPosts();
  } else if (path.includes('courses-details.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');
    if (courseId) {
      loadCourseDetails(courseId);
    }
  }
  
  // Protect admin pages
  if (path.includes('super-admin') || path.includes('admin-dashboard')) {
    protectPageByRole('admin');
  }
}

// Run on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePage);
} else {
  initializePage();
}



