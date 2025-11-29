/**
 * Language Toggle and RTL Support
 * Handles switching between English and Arabic
 */

(function() {
    'use strict';

    // Language storage key
    const LANGUAGE_KEY = 'tayseerulquran_language';
    const DEFAULT_LANGUAGE = 'en';

    // Get current language from localStorage
    function getCurrentLanguage() {
        return localStorage.getItem(LANGUAGE_KEY) || DEFAULT_LANGUAGE;
    }

    // Set language
    function setLanguage(lang) {
        localStorage.setItem(LANGUAGE_KEY, lang);
        applyLanguage(lang);
    }

    // Apply language to page
    function applyLanguage(lang) {
        const html = document.documentElement;
        const body = document.body;

        if (lang === 'ar') {
            html.setAttribute('dir', 'rtl');
            html.setAttribute('lang', 'ar');
            body.classList.add('rtl');
            body.classList.remove('ltr');
        } else {
            html.setAttribute('dir', 'ltr');
            html.setAttribute('lang', 'en');
            body.classList.add('ltr');
            body.classList.remove('rtl');
        }

        // Update language toggle buttons
        const toggleButtons = document.querySelectorAll('.language-toggle button');
        toggleButtons.forEach(btn => {
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Trigger custom event for other scripts
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    }

    // Create language toggle UI
    function createLanguageToggle() {
        // Check if toggle already exists
        if (document.querySelector('.language-toggle')) {
            return;
        }

        const toggle = document.createElement('div');
        toggle.className = 'language-toggle';
        toggle.innerHTML = `
            <button data-lang="en" class="active">EN</button>
            <button data-lang="ar">AR</button>
        `;

        // Add to body
        document.body.appendChild(toggle);

        // Add event listeners
        toggle.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', function() {
                const lang = this.dataset.lang;
                setLanguage(lang);
            });
        });
    }

    // Initialize on page load
    function init() {
        // Apply saved language
        const currentLang = getCurrentLanguage();
        applyLanguage(currentLang);

        // Create toggle if not in admin pages
        if (!document.body.classList.contains('main-wrapper-02')) {
            createLanguageToggle();
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export functions for global use
    window.LanguageToggle = {
        setLanguage: setLanguage,
        getCurrentLanguage: getCurrentLanguage,
        applyLanguage: applyLanguage
    };

})();

