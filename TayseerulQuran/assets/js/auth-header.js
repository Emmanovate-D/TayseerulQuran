/**
 * Auth Header Management
 * Dynamically shows/hides Sign In/Sign Up or Logout buttons based on authentication status
 */
(function() {
    'use strict';

    let isUpdating = false; // Prevent multiple simultaneous updates
    let logoutHandlersAttached = false; // Track if handlers are already attached

    // Safe localStorage access
    function safeLocalStorageGet(key) {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            console.warn('localStorage access failed:', e);
            return null;
        }
    }

    function safeLocalStorageRemove(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.warn('localStorage remove failed:', e);
        }
    }

    function safeSessionStorageClear() {
        try {
            sessionStorage.clear();
        } catch (e) {
            console.warn('sessionStorage clear failed:', e);
        }
    }

    // Get auth status - works with or without API
    function getAuthStatus() {
        try {
            // Try using API if available
            if (typeof API !== 'undefined' && API.config) {
                const token = API.config.getAuthToken();
                const user = API.config.getUser();
                return !!(token && user);
            }
            
            // Fallback to direct localStorage check
            const token = safeLocalStorageGet('authToken');
            const userStr = safeLocalStorageGet('user');
            
            if (!token || !userStr) {
                return false;
            }
            
            // Try to parse user to verify it's valid JSON
            try {
                const user = JSON.parse(userStr);
                return !!(user && (user.id || user.email));
            } catch (e) {
                // Invalid user data, consider not logged in
                return false;
            }
        } catch (error) {
            console.warn('Error checking auth status:', error);
            return false;
        }
    }

    // Wait for API to be available with timeout
    function waitForAPI(callback, maxAttempts = 50) {
        if (typeof API !== 'undefined' && API.config) {
            callback();
        } else if (maxAttempts > 0) {
            setTimeout(() => waitForAPI(callback, maxAttempts - 1), 100);
        } else {
            // API didn't load, but we can still work with localStorage
            console.warn('API not loaded, using localStorage fallback');
            callback();
        }
    }

    // Attach logout handler to an element
    function attachLogoutHandler(elementId) {
        const element = document.getElementById(elementId);
        if (element && !element.dataset.logoutHandlerAttached) {
            element.dataset.logoutHandlerAttached = 'true';
            element.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                handleLogout();
            });
        }
    }

    function updateAuthButtons() {
        // Prevent multiple simultaneous updates
        if (isUpdating) {
            return;
        }
        
        isUpdating = true;

        try {
            waitForAPI(() => {
                const isLoggedIn = getAuthStatus();

                // Update desktop header
                const desktopHeader = document.querySelector('.header-sign-in-up');
                if (desktopHeader) {
                    try {
                        if (isLoggedIn) {
                            desktopHeader.innerHTML = `
                                <ul>
                                    <li>
                                        <a class="sign-in" href="#" id="logoutBtn" style="cursor: pointer;">
                                            <i class="icofont-logout"></i> Logout
                                        </a>
                                    </li>
                                </ul>
                            `;
                            
                            // Attach logout handler after a brief delay to ensure DOM is updated
                            setTimeout(() => attachLogoutHandler('logoutBtn'), 50);
                        } else {
                            desktopHeader.innerHTML = `
                                <ul>
                                    <li><a class="sign-in" href="login.html">Sign In</a></li>
                                    <li><a class="sign-up" href="register.html">Sign Up</a></li>
                                </ul>
                            `;
                        }
                    } catch (e) {
                        console.error('Error updating desktop header:', e);
                    }
                }

                // Update mobile menu
                const mobileHeader = document.querySelector('.mobile-sign-in-up');
                if (mobileHeader) {
                    try {
                        if (isLoggedIn) {
                            mobileHeader.innerHTML = `
                                <ul>
                                    <li>
                                        <a class="sign-in" href="#" id="mobileLogoutBtn" style="cursor: pointer;">
                                            <i class="icofont-logout"></i> Logout
                                        </a>
                                    </li>
                                </ul>
                            `;
                            
                            // Attach logout handler after a brief delay to ensure DOM is updated
                            setTimeout(() => attachLogoutHandler('mobileLogoutBtn'), 50);
                        } else {
                            mobileHeader.innerHTML = `
                                <ul>
                                    <li><a class="sign-in" href="login.html">Sign In</a></li>
                                    <li><a class="sign-up" href="register.html">Sign Up</a></li>
                                </ul>
                            `;
                        }
                    } catch (e) {
                        console.error('Error updating mobile header:', e);
                    }
                }
                
                isUpdating = false;
            });
        } catch (error) {
            console.error('Error in updateAuthButtons:', error);
            isUpdating = false;
        }
    }

    function handleLogout() {
        try {
            if (confirm('Are you sure you want to logout?')) {
                // Clear authentication data using API if available
                try {
                    if (typeof API !== 'undefined' && API.config) {
                        if (typeof API.config.removeAuthToken === 'function') {
                            API.config.removeAuthToken();
                        }
                        if (typeof API.config.removeUser === 'function') {
                            API.config.removeUser();
                        }
                    }
                } catch (e) {
                    console.warn('Error using API to clear auth:', e);
                }
                
                // Clear any other stored data (fallback)
                safeLocalStorageRemove('authToken');
                safeLocalStorageRemove('user');
                safeSessionStorageClear();
                
                // Redirect to home page
                try {
                    window.location.href = 'index.html';
                } catch (e) {
                    // Fallback if href assignment fails
                    window.location = 'index.html';
                }
            }
        } catch (error) {
            console.error('Error during logout:', error);
            // Still try to redirect
            try {
                window.location.href = 'index.html';
            } catch (e) {
                console.error('Failed to redirect:', e);
            }
        }
    }

    // Initialize when DOM is ready
    function initialize() {
        try {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', updateAuthButtons);
            } else {
                // DOM already loaded, but wait a bit for other scripts
                setTimeout(updateAuthButtons, 100);
            }
        } catch (error) {
            console.error('Error initializing auth header:', error);
        }
    }

    // Also update when page becomes visible (in case user logs in on another tab)
    function setupVisibilityListener() {
        try {
            document.addEventListener('visibilitychange', function() {
                if (!document.hidden && !isUpdating) {
                    // Small delay to ensure other scripts have updated localStorage
                    setTimeout(updateAuthButtons, 200);
                }
            });
        } catch (error) {
            console.warn('Could not set up visibility listener:', error);
        }
    }

    // Initialize
    initialize();
    setupVisibilityListener();

    // Also listen for storage events (when user logs in/out in another tab)
    try {
        window.addEventListener('storage', function(e) {
            if ((e.key === 'authToken' || e.key === 'user') && !isUpdating) {
                setTimeout(updateAuthButtons, 100);
            }
        });
    } catch (error) {
        console.warn('Could not set up storage listener:', error);
    }
})();

