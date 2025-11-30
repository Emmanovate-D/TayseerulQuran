/**
 * Hide Pages Navigation Menu
 * Hides the "Pages" navigation menu item when user is logged in
 * Keeps it visible on public pages (before sign in/sign up)
 */
(function() {
    'use strict';

    function hidePagesNav() {
        // Wait for API to be available
        function waitForAPI(callback, maxAttempts = 50) {
            if (typeof API !== 'undefined' && API.config) {
                callback();
            } else if (maxAttempts > 0) {
                setTimeout(() => waitForAPI(callback, maxAttempts - 1), 100);
            } else {
                // API didn't load, but we can still check localStorage
                callback();
            }
        }

        waitForAPI(() => {
            try {
                // Check if user is logged in
                let isLoggedIn = false;
                
                if (typeof API !== 'undefined' && API.config) {
                    const token = API.config.getAuthToken();
                    const user = API.config.getUser();
                    isLoggedIn = !!(token && user);
                } else {
                    // Fallback to localStorage check
                    const token = localStorage.getItem('authToken');
                    const userStr = localStorage.getItem('user');
                    isLoggedIn = !!(token && userStr);
                }

                // Find all "Pages" menu items in desktop navigation
                const pagesMenuItems = document.querySelectorAll('.nav-menu li');
                pagesMenuItems.forEach(li => {
                    const link = li.querySelector('a');
                    if (link && link.textContent.trim() === 'Pages') {
                        if (isLoggedIn) {
                            li.style.display = 'none';
                        } else {
                            li.style.display = '';
                        }
                    }
                });

                // Find all "Pages" menu items in mobile navigation
                const mobilePagesMenuItems = document.querySelectorAll('.mobile-menu-items li');
                mobilePagesMenuItems.forEach(li => {
                    const link = li.querySelector('a');
                    if (link && link.textContent.trim() === 'Pages') {
                        if (isLoggedIn) {
                            li.style.display = 'none';
                        } else {
                            li.style.display = '';
                        }
                    }
                });

            } catch (error) {
                console.warn('Error hiding pages nav:', error);
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', hidePagesNav);
    } else {
        setTimeout(hidePagesNav, 100);
    }

    // Also update when page becomes visible (in case user logs in on another tab)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            setTimeout(hidePagesNav, 100);
        }
    });

    // Listen for storage events (when user logs in/out in another tab)
    try {
        window.addEventListener('storage', function(e) {
            if ((e.key === 'authToken' || e.key === 'user')) {
                setTimeout(hidePagesNav, 100);
            }
        });
    } catch (error) {
        console.warn('Could not set up storage listener:', error);
    }
})();

