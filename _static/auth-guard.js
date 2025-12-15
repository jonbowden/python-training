// Auth Guard - Protects content pages
(function() {
    const AUTH_KEY = 'codevision_auth';
    const API_URL = 'https://script.google.com/macros/s/AKfycby1sknmInGgsBQ--n3bBIlis-b-DpXYSJuSgNL_R9RJPW0Vg25uVtYddz0cvXuOSNpR/exec';

    // Pages that don't require login
    const PUBLIC_PAGES = [
        'index.html',
        'intro.html',
        'login.html',
        'genindex.html',
        'search.html'
    ];

    // Pages that require admin access (Module 2 - pending validation)
    // Remove pages from this list to make them available to all users
    const ADMIN_ONLY_PAGES = [
        '02_data.html',
        '02_quiz.html',
        'Module2_Assessment.html',
        '02_resources.html'
    ];

    function getCurrentPage() {
        const path = window.location.pathname;
        return path.split('/').pop() || 'index.html';
    }

    function isPublicPage() {
        const page = getCurrentPage();
        const path = window.location.pathname;
        return PUBLIC_PAGES.some(p => page === p || page === '' || path.endsWith('/'));
    }

    function isAdminOnlyPage() {
        const page = getCurrentPage();
        return ADMIN_ONLY_PAGES.includes(page);
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

    function getAuthToken() {
        try {
            const auth = localStorage.getItem(AUTH_KEY);
            if (!auth) return null;
            const parsed = JSON.parse(auth);
            return parsed.token;
        } catch {
            return null;
        }
    }

    async function checkAdminStatus(token) {
        try {
            // Use GET with URL params to avoid CORS preflight
            const url = `${API_URL}?action=checkAdmin&token=${encodeURIComponent(token)}`;
            const response = await fetch(url);
            const result = await response.json();
            console.log('Admin check result:', result);
            return result.success && result.isAdmin;
        } catch (e) {
            console.error('Admin check error:', e);
            return false;
        }
    }

    function showComingSoon() {
        document.body.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; padding: 20px;">
                <h1 style="font-size: 3rem; margin-bottom: 1rem;">Coming Soon</h1>
                <p style="font-size: 1.25rem; max-width: 500px; opacity: 0.9;">Module 2: Python for Data Work is currently being prepared. Check back soon!</p>
                <a href="dashboard.html" style="margin-top: 2rem; padding: 12px 24px; background: white; color: #667eea; text-decoration: none; border-radius: 8px; font-weight: 600; transition: transform 0.2s;">Return to Dashboard</a>
            </div>
        `;
    }

    async function checkAuth() {
        const page = getCurrentPage();

        // Public pages - no auth needed
        if (isPublicPage()) {
            return;
        }

        // Check if logged in
        if (!isLoggedIn()) {
            sessionStorage.setItem('codevision_redirect', window.location.href);
            window.location.href = 'login.html';
            return;
        }

        // Check admin-only pages
        if (isAdminOnlyPage()) {
            const token = getAuthToken();
            const isAdmin = await checkAdminStatus(token);

            if (!isAdmin) {
                showComingSoon();
            }
        }
    }

    // Run on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkAuth);
    } else {
        checkAuth();
    }
})();
