// Auth Guard - Protects content pages
(function() {
    const AUTH_KEY = 'codevision_auth';

    // Pages that don't require login
    const PUBLIC_PAGES = [
        'index.html',
        'intro.html',
        'login.html',
        'genindex.html',
        'search.html'
    ];

    function isPublicPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        return PUBLIC_PAGES.some(p => page === p || page === '' || path.endsWith('/'));
    }

    function isLoggedIn() {
        try {
            const auth = localStorage.getItem(AUTH_KEY);
            if (!auth) return false;
            const parsed = JSON.parse(auth);
            return parsed && parsed.token && parsed.user;
        } catch {
            return false;
        }
    }

    function checkAuth() {
        if (!isPublicPage() && !isLoggedIn()) {
            // Store intended destination
            sessionStorage.setItem('codevision_redirect', window.location.href);
            window.location.href = 'login.html';
        }
    }

    // Run on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkAuth);
    } else {
        checkAuth();
    }
})();
