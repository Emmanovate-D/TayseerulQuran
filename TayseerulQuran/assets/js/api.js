/**
 * API Configuration
 * Automatically detects environment and sets the appropriate base URL
 * - Production: Uses Render.com backend URL when deployed
 * - Plesk Server: Detects Plesk domains and uses same origin
 * - Development: Uses localhost for local development
 */
const API_CONFIG = {
  BASE_URL: (() => {
    // Manual override (highest priority) - can be set in HTML before api.js loads
    if (window.BACKEND_API_URL) {
      return window.BACKEND_API_URL;
    }
    
    const hostname = window.location.hostname;
    
    // Check if we're on Plesk server (intilaq.host, tayseerulquran.org, or plesk.page)
    if (hostname.includes('intilaq.host') || 
        hostname.includes('tayseerulquran.org') ||
        hostname.includes('plesk.page')) {
      // Use same domain for backend (if backend is on same server)
      return window.location.origin + '/api';
    }
    
    // Vercel/Render deployment
    if (hostname.includes('vercel.app') || hostname.includes('onrender.com')) {
      return 'https://tayseerulquran.onrender.com/api';
    }
    
    // Development fallback
    return 'http://localhost:3000/api';
  })(),
  getAuthToken: () => localStorage.getItem('authToken'),
  setAuthToken: (token) => localStorage.setItem('authToken', token),
  removeAuthToken: () => localStorage.removeItem('authToken'),
  getUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
  removeUser: () => localStorage.removeItem('user')
};

// API Request Helper
async function apiRequest(endpoint, options = {}) {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  const token = API_CONFIG.getAuthToken();
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  
  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }
  
  try {
    const response = await fetch(url, config);
    
    // Handle non-JSON responses
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(text || `Server returned ${response.status} ${response.statusText}`);
    }
    
    if (!response.ok) {
      // Handle validation errors with field-specific messages
      if (data.errors && Array.isArray(data.errors)) {
        const errorMessages = data.errors.map(err => 
          err.field ? `${err.field}: ${err.message}` : err.message
        ).join(', ');
        throw new Error(errorMessages || data.message || 'Validation error occurred');
      }
      
      // Handle standard error messages
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }
    
    return data;
  } catch (error) {
    // Handle network errors
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      throw new Error('Unable to connect to server. Please check if the backend is running and try again.');
    }
    
    // Re-throw if it's already a proper Error object
    if (error instanceof Error) {
    throw error;
    }
    
    // Convert string errors to Error objects
    throw new Error(String(error));
  }
}

/**
 * Authentication API Methods
 * Handles user registration, login, profile management, and password changes
 */
const authAPI = {
  register: async (userData) => {
    return await apiRequest('/auth/register', {
      method: 'POST',
      body: userData,
    });
  },
  
  login: async (email, password) => {
    return await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  },
  
  getProfile: async () => {
    return await apiRequest('/auth/profile', {
      method: 'GET',
    });
  },
  
  changePassword: async (currentPassword, newPassword) => {
    return await apiRequest('/auth/change-password', {
      method: 'POST',
      body: { currentPassword, newPassword },
    });
  },
  
  logout: () => {
    API_CONFIG.removeAuthToken();
    API_CONFIG.removeUser();
    window.location.href = 'login.html';
  }
};

/**
 * Course API Methods
 * Handles course CRUD operations and course management
 */
const courseAPI = {
  getAll: async () => {
    return await apiRequest('/courses', { method: 'GET' });
  },
  
  getById: async (id) => {
    return await apiRequest(`/courses/${id}`, { method: 'GET' });
  },
  
  create: async (courseData) => {
    return await apiRequest('/courses', {
      method: 'POST',
      body: courseData,
    });
  },
  
  update: async (id, courseData) => {
    return await apiRequest(`/courses/${id}`, {
      method: 'PUT',
      body: courseData,
    });
  },
  
  delete: async (id) => {
    return await apiRequest(`/courses/${id}`, {
      method: 'DELETE',
    });
  }
};

// User API
const userAPI = {
  getAll: async () => {
    return await apiRequest('/users', { method: 'GET' });
  },
  
  getById: async (id) => {
    return await apiRequest(`/users/${id}`, { method: 'GET' });
  },
  
  create: async (userData) => {
    return await apiRequest('/users', {
      method: 'POST',
      body: userData,
    });
  },
  
  update: async (id, userData) => {
    return await apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: userData,
    });
  },
  
  delete: async (id) => {
    return await apiRequest(`/users/${id}`, {
      method: 'DELETE',
    });
  }
};

// Student API
const studentAPI = {
  getAll: async () => {
    return await apiRequest('/students', { method: 'GET' });
  },
  
  getById: async (id) => {
    return await apiRequest(`/students/${id}`, { method: 'GET' });
  },
  
  enroll: async (courseId) => {
    return await apiRequest('/students/enroll', {
      method: 'POST',
      body: { courseId },
    });
  }
};

// Tutor API
const tutorAPI = {
  getAll: async () => {
    return await apiRequest('/tutors', { method: 'GET' });
  },
  
  getById: async (id) => {
    return await apiRequest(`/tutors/${id}`, { method: 'GET' });
  },
  
  create: async (tutorData) => {
    return await apiRequest('/tutors', {
      method: 'POST',
      body: tutorData,
    });
  },
  
  approve: async (id) => {
    return await apiRequest(`/tutors/${id}/approve`, {
      method: 'POST',
    });
  },
  
  reject: async (id) => {
    return await apiRequest(`/tutors/${id}/reject`, {
      method: 'POST',
    });
  },
  
  update: async (id, tutorData) => {
    return await apiRequest(`/tutors/${id}`, {
      method: 'PUT',
      body: tutorData,
    });
  },
  
  delete: async (id) => {
    return await apiRequest(`/tutors/${id}`, {
      method: 'DELETE',
    });
  }
};

// Blog API
const blogAPI = {
  getAll: async () => {
    return await apiRequest('/blog', { method: 'GET' });
  },
  
  getById: async (id) => {
    return await apiRequest(`/blog/${id}`, { method: 'GET' });
  },
  
  create: async (postData) => {
    return await apiRequest('/blog', {
      method: 'POST',
      body: postData,
    });
  },
  
  update: async (id, postData) => {
    return await apiRequest(`/blog/${id}`, {
      method: 'PUT',
      body: postData,
    });
  },
  
  delete: async (id) => {
    return await apiRequest(`/blog/${id}`, {
      method: 'DELETE',
    });
  }
};

// Role API
const roleAPI = {
  getAll: async () => {
    return await apiRequest('/admin/roles', { method: 'GET' });
  },
  
  getById: async (id) => {
    return await apiRequest(`/admin/roles/${id}`, { method: 'GET' });
  },
  
  create: async (roleData) => {
    return await apiRequest('/admin/roles', {
      method: 'POST',
      body: roleData,
    });
  },
  
  update: async (id, roleData) => {
    return await apiRequest(`/admin/roles/${id}`, {
      method: 'PUT',
      body: roleData,
    });
  },
  
  assignPermissions: async (id, permissionIds) => {
    return await apiRequest(`/admin/roles/${id}/permissions`, {
      method: 'POST',
      body: { permissionIds },
    });
  }
};

// Permission API
const permissionAPI = {
  getAll: async () => {
    return await apiRequest('/admin/permissions', { method: 'GET' });
  },
  
  getById: async (id) => {
    return await apiRequest(`/admin/permissions/${id}`, { method: 'GET' });
  },
  
  create: async (permissionData) => {
    return await apiRequest('/admin/permissions', {
      method: 'POST',
      body: permissionData,
    });
  },
  
  update: async (id, permissionData) => {
    return await apiRequest(`/admin/permissions/${id}`, {
      method: 'PUT',
      body: permissionData,
    });
  }
};

// Payment API
const paymentAPI = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await apiRequest(`/payments${query ? `?${query}` : ''}`, { method: 'GET' });
  },
  
  getById: async (id) => {
    return await apiRequest(`/payments/${id}`, { method: 'GET' });
  },
  
  create: async (paymentData) => {
    return await apiRequest('/payments', {
      method: 'POST',
      body: paymentData,
    });
  },
  
  update: async (id, paymentData) => {
    return await apiRequest(`/payments/${id}`, {
      method: 'PUT',
      body: paymentData,
    });
  },
  
  delete: async (id) => {
    return await apiRequest(`/payments/${id}`, {
      method: 'DELETE',
    });
  },
  
  getUserPayments: async (userId) => {
    return await apiRequest(`/payments/user/${userId}`, { method: 'GET' });
  },
  
  getMyPayments: async () => {
    return await apiRequest('/payments/me/payments', { method: 'GET' });
  },
  
  processPayment: async (paymentData) => {
    return await apiRequest('/payments/process', {
      method: 'POST',
      body: paymentData,
    });
  },
  
  refund: async (paymentId, refundData) => {
    return await apiRequest(`/payments/${paymentId}/refund`, {
      method: 'POST',
      body: refundData,
    });
  },
  
  getReceipt: async (paymentId) => {
    return await apiRequest(`/payments/${paymentId}/receipt`, { method: 'GET' });
  }
};

// Enrollment API
const enrollmentAPI = {
  enroll: async (courseId, paymentData = null) => {
    return await apiRequest('/enrollments', {
      method: 'POST',
      body: { courseId, paymentData },
    });
  },
  
  getMyEnrollments: async () => {
    return await apiRequest('/enrollments/me', { method: 'GET' });
  },
  
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await apiRequest(`/enrollments${query ? `?${query}` : ''}`, { method: 'GET' });
  },
  
  getById: async (id) => {
    return await apiRequest(`/enrollments/${id}`, { method: 'GET' });
  },
  
  cancel: async (id) => {
    return await apiRequest(`/enrollments/${id}`, {
      method: 'DELETE',
    });
  },
  
  update: async (id, enrollmentData) => {
    return await apiRequest(`/enrollments/${id}`, {
      method: 'PUT',
      body: enrollmentData,
    });
  }
};

// Contact API
const contactAPI = {
  submit: async (contactData) => {
    return await apiRequest('/contact', {
      method: 'POST',
      body: contactData,
    });
  },
  
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await apiRequest(`/contact${query ? `?${query}` : ''}`, { method: 'GET' });
  },
  
  getById: async (id) => {
    return await apiRequest(`/contact/${id}`, { method: 'GET' });
  },
  
  updateStatus: async (id, statusData) => {
    return await apiRequest(`/contact/${id}`, {
      method: 'PUT',
      body: statusData,
    });
  },
  
  delete: async (id) => {
    return await apiRequest(`/contact/${id}`, {
      method: 'DELETE',
    });
  }
};

/**
 * Main API Object
 * Exports all API methods and configuration for use across the application
 * Usage: API.auth.login(), API.course.getAll(), etc.
 */
window.API = {
  auth: authAPI,
  course: courseAPI,
  user: userAPI,
  student: studentAPI,
  tutor: tutorAPI,
  blog: blogAPI,
  role: roleAPI,
  permission: permissionAPI,
  payment: paymentAPI,
  enrollment: enrollmentAPI,
  contact: contactAPI,
  config: API_CONFIG
};

