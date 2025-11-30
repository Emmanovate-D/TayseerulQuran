/**
 * Auth Header Management
 * Dynamically shows/hides Sign In/Sign Up or Logout buttons based on authentication status
 */
(function() {
    'use strict';

    // Wait for API to be available
    function waitForAPI(callback, maxAttempts = 50) {
        if (typeof API !== 'undefined' && API.config) {
            callback();
        } else if (maxAttempts > 0) {
            setTimeout(() => waitForAPI(callback, maxAttempts - 1), 100);
        }
    }

    function updateAuthButtons() {
        waitForAPI(() => {
            const token = API.config.getAuthToken();
            const user = API.config.getUser();
            const isLoggedIn = !!(token && user);

            // Update desktop header
            const desktopHeader = document.querySelector('.header-sign-in-up');
            if (desktopHeader) {
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
                    
                    // Add logout functionality
                    const logoutBtn = document.getElementById('logoutBtn');
                    if (logoutBtn) {
                        logoutBtn.addEventListener('click', function(e) {
                            e.preventDefault();
                            handleLogout();
                        });
                    }
                } else {
                    desktopHeader.innerHTML = `
                        <ul>
                            <li><a class="sign-in" href="login.html">Sign In</a></li>
                            <li><a class="sign-up" href="register.html">Sign Up</a></li>
                        </ul>
                    `;
                }
            }

            // Update mobile menu
            const mobileHeader = document.querySelector('.mobile-sign-in-up');
            if (mobileHeader) {
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
                    
                    // Add logout functionality
                    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
                    if (mobileLogoutBtn) {
                        mobileLogoutBtn.addEventListener('click', function(e) {
                            e.preventDefault();
                            handleLogout();
                        });
                    }
                } else {
                    mobileHeader.innerHTML = `
                        <ul>
                            <li><a class="sign-in" href="login.html">Sign In</a></li>
                            <li><a class="sign-up" href="register.html">Sign Up</a></li>
                        </ul>
                    `;
                }
            }
        });
    }

    function handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            // Clear authentication data
            if (typeof API !== 'undefined' && API.config) {
                API.config.removeAuthToken();
                API.config.removeUser();
            }
            
            // Clear any other stored data
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            sessionStorage.clear();
            
            // Redirect to home page
            window.location.href = 'index.html';
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateAuthButtons);
    } else {
        updateAuthButtons();
    }

    // Also update when page becomes visible (in case user logs in on another tab)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            updateAuthButtons();
        }
    });
})();

