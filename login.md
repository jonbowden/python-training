# Account

```{raw} html
<style>
.auth-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
}
.auth-tabs {
    display: flex;
    margin-bottom: 20px;
    border-bottom: 2px solid #e0e0e0;
}
.auth-tab {
    padding: 10px 20px;
    cursor: pointer;
    border: none;
    background: none;
    font-size: 16px;
    color: #666;
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
}
.auth-tab.active {
    color: #2563eb;
    border-bottom-color: #2563eb;
    font-weight: 600;
}
.auth-form {
    display: none;
}
.auth-form.active {
    display: block;
}
.form-group {
    margin-bottom: 15px;
}
.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
    color: #333;
}
.form-group input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 14px;
    box-sizing: border-box;
}
.form-group input:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}
.auth-btn {
    width: 100%;
    padding: 12px;
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 10px;
}
.auth-btn:hover {
    background: #1d4ed8;
}
.auth-btn:disabled {
    background: #9ca3af;
    cursor: not-allowed;
}
.auth-message {
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 15px;
    display: none;
}
.auth-message.error {
    background: #fee2e2;
    color: #dc2626;
    display: block;
}
.auth-message.success {
    background: #d1fae5;
    color: #059669;
    display: block;
}
.logged-in-container {
    text-align: center;
    padding: 40px 20px;
}
.logged-in-container h2 {
    color: #059669;
    margin-bottom: 10px;
}
.user-info {
    background: #f3f4f6;
    padding: 20px;
    border-radius: 8px;
    margin: 20px 0;
}
.logout-btn {
    padding: 10px 30px;
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
}
.logout-btn:hover {
    background: #dc2626;
}
.nav-links {
    margin-top: 20px;
}
.nav-links a {
    display: inline-block;
    margin: 5px 10px;
    padding: 10px 20px;
    background: #2563eb;
    color: white;
    text-decoration: none;
    border-radius: 5px;
}
.nav-links a:hover {
    background: #1d4ed8;
}
</style>

<div id="auth-section">
    <!-- Logged Out View -->
    <div id="logged-out-view" class="auth-container">
        <div class="auth-tabs">
            <button class="auth-tab active" onclick="showTab('login')">Login</button>
            <button class="auth-tab" onclick="showTab('register')">Register</button>
        </div>

        <div id="auth-message" class="auth-message"></div>

        <!-- Login Form -->
        <form id="login-form" class="auth-form active" onsubmit="handleLogin(event)">
            <div class="form-group">
                <label for="login-email">Email</label>
                <input type="email" id="login-email" required placeholder="your@email.com">
            </div>
            <div class="form-group">
                <label for="login-password">Password</label>
                <input type="password" id="login-password" required placeholder="Enter password">
            </div>
            <button type="submit" class="auth-btn" id="login-btn">Login</button>
        </form>

        <!-- Register Form -->
        <form id="register-form" class="auth-form" onsubmit="handleRegister(event)">
            <div class="form-group">
                <label for="register-name">Full Name</label>
                <input type="text" id="register-name" required placeholder="Your full name">
            </div>
            <div class="form-group">
                <label for="register-email">Email</label>
                <input type="email" id="register-email" required placeholder="your@email.com">
            </div>
            <div class="form-group">
                <label for="register-password">Password</label>
                <input type="password" id="register-password" required minlength="6" placeholder="Min 6 characters">
            </div>
            <div class="form-group">
                <label for="register-confirm">Confirm Password</label>
                <input type="password" id="register-confirm" required placeholder="Confirm password">
            </div>
            <button type="submit" class="auth-btn" id="register-btn">Create Account</button>
        </form>
    </div>

    <!-- Logged In View -->
    <div id="logged-in-view" class="logged-in-container" style="display: none;">
        <h2>Welcome back!</h2>
        <div class="user-info">
            <p><strong>Name:</strong> <span id="user-name"></span></p>
            <p><strong>Email:</strong> <span id="user-email"></span></p>
        </div>
        <div class="nav-links">
            <a href="dashboard.html">View My Transcript</a>
            <a href="01_syntax.html">Continue Learning</a>
        </div>
        <br><br>
        <button class="logout-btn" onclick="handleLogout()">Logout</button>
    </div>
</div>

<script>
// ============ CONFIGURATION ============
// IMPORTANT: Replace this URL after deploying the Google Apps Script
const API_URL = 'https://script.google.com/macros/s/AKfycbw6q9uUO0ZthdpmiXwm11pTugUtPO_KXYgdBdoAzoEORQvZqkf1umoFmse2MDNwJyqH/exec';

// ============ AUTH STATE ============
const AUTH_KEY = 'codevision_auth';

function getAuth() {
    try {
        const auth = localStorage.getItem(AUTH_KEY);
        return auth ? JSON.parse(auth) : null;
    } catch {
        return null;
    }
}

function setAuth(token, user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify({ token, user }));
}

function clearAuth() {
    localStorage.removeItem(AUTH_KEY);
}

// ============ UI FUNCTIONS ============
function showTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));

    document.querySelector(`[onclick="showTab('${tab}')"]`).classList.add('active');
    document.getElementById(`${tab}-form`).classList.add('active');
    hideMessage();
}

function showMessage(text, type) {
    const msg = document.getElementById('auth-message');
    msg.textContent = text;
    msg.className = 'auth-message ' + type;
}

function hideMessage() {
    document.getElementById('auth-message').className = 'auth-message';
}

function updateUI() {
    const auth = getAuth();
    const loggedOutView = document.getElementById('logged-out-view');
    const loggedInView = document.getElementById('logged-in-view');

    if (auth && auth.token && auth.user) {
        loggedOutView.style.display = 'none';
        loggedInView.style.display = 'block';
        document.getElementById('user-name').textContent = auth.user.name;
        document.getElementById('user-email').textContent = auth.user.email;
    } else {
        loggedOutView.style.display = 'block';
        loggedInView.style.display = 'none';
    }
}

// ============ API FUNCTIONS ============
async function apiCall(action, data) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...data })
    });
    return response.json();
}

async function handleLogin(e) {
    e.preventDefault();
    const btn = document.getElementById('login-btn');
    btn.disabled = true;
    btn.textContent = 'Logging in...';
    hideMessage();

    try {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const result = await apiCall('login', { email, password });

        if (result.success) {
            setAuth(result.token, result.user);
            showMessage('Login successful!', 'success');
            setTimeout(updateUI, 500);
        } else {
            showMessage(result.error || 'Login failed', 'error');
        }
    } catch (err) {
        showMessage('Connection error. Please try again.', 'error');
    }

    btn.disabled = false;
    btn.textContent = 'Login';
}

async function handleRegister(e) {
    e.preventDefault();
    const btn = document.getElementById('register-btn');
    btn.disabled = true;
    btn.textContent = 'Creating account...';
    hideMessage();

    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;

    if (password !== confirm) {
        showMessage('Passwords do not match', 'error');
        btn.disabled = false;
        btn.textContent = 'Create Account';
        return;
    }

    try {
        const result = await apiCall('register', { email, password, name });

        if (result.success) {
            setAuth(result.token, result.user);
            showMessage('Account created successfully!', 'success');
            setTimeout(updateUI, 500);
        } else {
            showMessage(result.error || 'Registration failed', 'error');
        }
    } catch (err) {
        showMessage('Connection error. Please try again.', 'error');
    }

    btn.disabled = false;
    btn.textContent = 'Create Account';
}

function handleLogout() {
    clearAuth();
    updateUI();
}

// ============ INIT ============
document.addEventListener('DOMContentLoaded', updateUI);
</script>
```
