// API Configuration
// Automatically detect environment: use production API if on Vercel, otherwise use localhost for development
const API_CONFIG = {
  BASE_URL: window.location.hostname.includes('vercel.app') || window.location.hostname.includes('onrender.com')
    ? 'https://tayseerulquran.onrender.com/api'
    : 'http://localhost:3000/api',
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
    
    // Check if response is JSON
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(text || 'Invalid response from server');
    }
    
    // Handle error responses
    if (!response.ok) {
      // Check if data has a message property
      const errorMessage = data.message || data.error || `Server error: ${response.status}`;
      throw new Error(errorMessage);
    }
    
    return data;
  } catch (error) {
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running.');
    }
    // Re-throw if it's already an Error with a message
    if (error instanceof Error) {
      throw error;
    }
    // Otherwise wrap it
    throw new Error(error.message || 'An unexpected error occurred');
  }
}

// Auth API
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

// Course API
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
  }
};

// Export for use in other scripts
window.API = {
  auth: authAPI,
  course: courseAPI,
  user: userAPI,
  student: studentAPI,
  tutor: tutorAPI,
  blog: blogAPI,
  role: roleAPI,
  config: API_CONFIG
};

