// auth.js
const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "admin" // In production, use proper authentication
};

document.addEventListener('DOMContentLoaded', function() {
    // Password visibility toggle
    const togglePasswordBtn = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.querySelector('.toggle-icon');
    
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            toggleIcon.textContent = isPassword ? '🙈' : '👁';
            this.setAttribute('aria-pressed', isPassword);
        });
    }
    
    // Login form submission
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    const rememberCheckbox = document.getElementById('remember-me');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            
            // Clear previous errors
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }
            
            if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
                // Persist auth based on remember-me (fallback to localStorage)
                const persist = rememberCheckbox ? rememberCheckbox.checked : true;
                const storage = persist ? localStorage : sessionStorage;
                storage.setItem('isAuthenticated', 'true');
                storage.setItem('authUser', username);
                storage.setItem('lastAuthAt', String(Date.now()));

                setTimeout(() => {
                    window.location.href = 'admin.html';
                }, 200);
            } else {
                if (errorMessage) {
                    errorMessage.textContent = '❌ Invalid username or password. Please try again.';
                    errorMessage.style.display = 'block';
                }
                // Shake animation for error
                loginForm.classList.add('shake');
                setTimeout(() => loginForm.classList.remove('shake'), 600);
            }
        });
    }
    
    // If already authenticated, skip login page
    const isAuthed = localStorage.getItem('isAuthenticated') === 'true' || sessionStorage.getItem('isAuthenticated') === 'true';
    if (isAuthed && window.location.pathname.includes('login.html')) {
        window.location.href = 'admin.html';
    }

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('authUser');
            localStorage.removeItem('lastAuthAt');
            sessionStorage.removeItem('isAuthenticated');
            sessionStorage.removeItem('authUser');
            sessionStorage.removeItem('lastAuthAt');
            window.location.href = 'login.html';
        });
    }
    
    // Check authentication for admin page
    if (window.location.pathname.includes('admin.html')) {
        const authed = localStorage.getItem('isAuthenticated') === 'true' || sessionStorage.getItem('isAuthenticated') === 'true';
        if (!authed) {
            window.location.href = 'login.html';
        }
    }
});