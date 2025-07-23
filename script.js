// DOM Elements
const authContainer = document.getElementById('auth-container');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const tabs = document.querySelectorAll('.tab');
const forms = document.querySelectorAll('.form');
const togglePasswordBtns = document.querySelectorAll('.toggle-password');
const registerPassword = document.getElementById('register-password');
const registerConfirm = document.getElementById('register-confirm');
const passwordMatch = document.getElementById('password-match');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');
const notification = document.getElementById('notification');
const userName = document.getElementById('user-name');
const lastLogin = document.getElementById('last-login');
const userAvatar = document.getElementById('user-avatar');
const strengthText = document.getElementById('strength-text');

// Password requirement visual elements
const lengthVisual = document.getElementById('length-visual');
const uppercaseVisual = document.getElementById('uppercase-visual');
const lowercaseVisual = document.getElementById('lowercase-visual');
const numberVisual = document.getElementById('number-visual');
const specialVisual = document.getElementById('special-visual');

// Strength bars
const strengthBars = [
    document.getElementById('bar-1'),
    document.getElementById('bar-2'),
    document.getElementById('bar-3'),
    document.getElementById('bar-4'),
    document.getElementById('bar-5')
];

// Tab switching
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        forms.forEach(f => f.classList.remove('active'));

        tab.classList.add('active');
        document.getElementById(`${tab.dataset.tab}-form`).classList.add('active');
    });
});

// Toggle password visibility
togglePasswordBtns.forEach(btn => {
    btn.addEventListener('click', function () {
        const input = this.parentElement.querySelector('input');
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);

        // Toggle eye icon
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });
});

// Password validation
registerPassword.addEventListener('input', validatePassword);
registerConfirm.addEventListener('input', checkPasswordMatch);

function validatePassword() {
    const password = registerPassword.value;
    let strength = 0;

    // Validate password requirements
    const hasLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    // Update visual indicators
    updateRequirementVisual(lengthVisual, hasLength);
    updateRequirementVisual(uppercaseVisual, hasUppercase);
    updateRequirementVisual(lowercaseVisual, hasLowercase);
    updateRequirementVisual(numberVisual, hasNumber);
    updateRequirementVisual(specialVisual, hasSpecial);

    // Calculate password strength
    if (hasLength) strength += 1;
    if (hasUppercase) strength += 1;
    if (hasLowercase) strength += 1;
    if (hasNumber) strength += 1;
    if (hasSpecial) strength += 1;

    // Update strength meter
    updateStrengthMeter(strength);

    // Check if all requirements are met
    const isValid = hasLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;
    registerBtn.disabled = !isValid;

    // Also check password match
    checkPasswordMatch();
}

function updateRequirementVisual(element, isValid) {
    element.style.background = isValid ? '#27ae60' : '#ecf0f1';
}

function updateStrengthMeter(strength) {
    // Reset all bars
    strengthBars.forEach(bar => {
        bar.style.width = '0%';
        bar.style.background = '#f0f0f0';
    });

    // Set text and colors based on strength
    let text = '';
    let color = '';

    switch (strength) {
        case 0:
            text = 'Very Weak';
            color = '#e74c3c';
            break;
        case 1:
            text = 'Weak';
            color = '#e74c3c';
            break;
        case 2:
            text = 'Medium';
            color = '#f39c12';
            break;
        case 3:
            text = 'Good';
            color = '#2ecc71';
            break;
        case 4:
            text = 'Strong';
            color = '#2ecc71';
            break;
        case 5:
            text = 'Very Strong';
            color = '#2ecc71';
            break;
        default:
            text = 'Very Weak';
            color = '#e74c3c';
    }

    strengthText.textContent = text;
    strengthText.style.color = color;

    // Update bars
    for (let i = 0; i < strength; i++) {
        strengthBars[i].style.width = '100%';
        strengthBars[i].style.background = color;
    }
}

function checkPasswordMatch() {
    const password = registerPassword.value;
    const confirm = registerConfirm.value;

    if (password === '' || confirm === '') {
        passwordMatch.style.display = 'none';
        return;
    }

    if (password === confirm) {
        passwordMatch.textContent = '✓ Passwords match!';
        passwordMatch.style.color = '#27ae60';
        passwordMatch.style.display = 'block';
    } else {
        passwordMatch.textContent = '✗ Passwords do not match!';
        passwordMatch.style.color = '#e74c3c';
        passwordMatch.style.display = 'block';
    }
}

// Registration
registerForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = registerPassword.value;
    const confirm = registerConfirm.value;

    // Check if passwords match
    if (password !== confirm) {
        showNotification('Passwords do not match!', 'error');
        return;
    }

    // Store user data
    localStorage.setItem('user', JSON.stringify({
        name: name,
        email: email,
        password: password,
        joined: new Date().toISOString()
    }));

    showNotification('Registration successful! Please login.', 'success');

    // Switch to login form
    tabs[0].click();

    // Clear form
    this.reset();
    passwordMatch.style.display = 'none';

    // Reset strength meter
    updateStrengthMeter(0);
});

// Login
loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Get stored user
    const storedUser = JSON.parse(localStorage.getItem('user'));

    // Check credentials
    if (storedUser && storedUser.email === email && storedUser.password === password) {
        // Update dashboard with user info
        userName.textContent = storedUser.name;
        userAvatar.textContent = storedUser.name.charAt(0);
        lastLogin.textContent = new Date().toLocaleString();

        // Show dashboard
        authContainer.style.display = 'none';
        dashboard.style.display = 'block';
    } else {
        showNotification('Invalid email or password!', 'error');
    }
});

// Logout
logoutBtn.addEventListener('click', function () {
    authContainer.style.display = 'flex';
    dashboard.style.display = 'none';
    loginForm.reset();
});

// Helper functions
function showNotification(message, type) {
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    // Check if user is already logged in (for demo purposes)
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
        loginForm.querySelector('#login-email').value = storedUser.email;
    }
});