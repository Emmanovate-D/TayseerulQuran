// Utility Functions for Frontend
const Utils = {
  // Show loading state
  showLoading: (element) => {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (element) {
      element.disabled = true;
      const originalText = element.textContent;
      element.dataset.originalText = originalText;
      element.textContent = 'Loading...';
    }
  },

  // Hide loading state
  hideLoading: (element) => {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (element) {
      element.disabled = false;
      if (element.dataset.originalText) {
        element.textContent = element.dataset.originalText;
        delete element.dataset.originalText;
      }
    }
  },

  // Show success message
  showSuccess: (message, container) => {
    if (typeof container === 'string') {
      container = document.querySelector(container);
    }
    if (container) {
      container.className = 'alert alert-success';
      container.textContent = message;
      container.style.display = 'block';
      setTimeout(() => {
        container.style.display = 'none';
      }, 5000);
    }
  },

  // Show error message
  showError: (message, container) => {
    if (typeof container === 'string') {
      container = document.querySelector(container);
    }
    if (container) {
      container.className = 'alert alert-danger';
      container.textContent = message;
      container.style.display = 'block';
    }
  },

  // Clear message
  clearMessage: (container) => {
    if (typeof container === 'string') {
      container = document.querySelector(container);
    }
    if (container) {
      container.style.display = 'none';
      container.textContent = '';
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return API.config.getAuthToken() !== null;
  },

  // Get current user
  getCurrentUser: () => {
    return API.config.getUser();
  },

  // Check if user has role
  hasRole: (roleName) => {
    const user = API.config.getUser();
    if (!user || !user.roles) return false;
    return user.roles.some(role => role.name.toLowerCase() === roleName.toLowerCase());
  },

  // Check if user has permission
  hasPermission: (permissionName) => {
    const user = API.config.getUser();
    if (!user || !user.roles) return false;
    return user.roles.some(role => 
      role.permissions && role.permissions.some(perm => 
        perm.name === permissionName
      )
    );
  },

  // Redirect if not authenticated
  requireAuth: (redirectTo = 'login.html') => {
    if (!Utils.isAuthenticated()) {
      window.location.href = redirectTo;
      return false;
    }
    return true;
  },

  // Redirect if not has role
  requireRole: (roleName, redirectTo = 'index.html') => {
    if (!Utils.hasRole(roleName)) {
      window.location.href = redirectTo;
      return false;
    }
    return true;
  },

  // Format date
  formatDate: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  // Format currency
  formatCurrency: (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  },

  // Debounce function
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Handle API errors
  handleApiError: (error, messageContainer) => {
    console.error('API Error:', error);
    const errorMessage = error.message || 'An error occurred. Please try again.';
    Utils.showError(errorMessage, messageContainer);
  }
};

// Export to window
window.Utils = Utils;



