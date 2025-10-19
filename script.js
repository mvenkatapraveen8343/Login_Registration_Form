// DOM Elements
const authContainer = document.getElementById('auth-container');
const dashboard = document.getElementById('dashboard');

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

const tabs = document.querySelectorAll('.tab');
const togglePasswordBtns = document.querySelectorAll('.toggle-password');

const registerPassword = document.getElementById('register-password');
const registerConfirm = document.getElementById('register-confirm');
const passwordMatch = document.getElementById('password-match');
const registerBtn = document.getElementById('register-btn');

const notification = document.getElementById('notification');
const userName = document.getElementById('user-name');
const lastLogin = document.getElementById('last-login');
const userAvatar = document.getElementById('user-avatar');

const strengthFill = document.getElementById('strength-fill');
const missingReq = document.getElementById('missing-requirement');

// Tab switching
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        loginForm.classList.remove('active');
        registerForm.classList.remove('active');

        tab.classList.add('active');
        document.getElementById(`${tab.dataset.tab}-form`).classList.add('active');
    });
});

// Toggle password visibility
togglePasswordBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const input = btn.parentElement.querySelector('input');
        const type = input.type === 'password' ? 'text' : 'password';
        input.type = type;
        btn.querySelector('i').classList.toggle('fa-eye');
        btn.querySelector('i').classList.toggle('fa-eye-slash');
    });
});

// Password validation
registerPassword.addEventListener('input', validatePassword);
registerConfirm.addEventListener('input', checkPasswordMatch);

function validatePassword() {
    const pwd = registerPassword.value;

    const requirements = [
        { regex: /.{8,}/, message: "Minimum 8 characters" },
        { regex: /[A-Z]/, message: "Atleast 1 Uppercase" },
        { regex: /[a-z]/, message: "Atleast 1 Lowercase" },
        { regex: /\d/, message: "Atleast 1 Number" },
        { regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, message: "Atleast 1 Special Character" }
    ];

    let missing = requirements.find(r => !r.regex.test(pwd));
    missingReq.textContent = missing ? missing.message : "";

    let strength = requirements.filter(r => r.regex.test(pwd)).length;
    strengthFill.style.width = (strength * 20) + "%";

    if (strength <= 1) strengthFill.style.background = "#e74c3c";
    else if (strength <= 3) strengthFill.style.background = "#f39c12";
    else strengthFill.style.background = "#27ae60";

    registerBtn.disabled = missing ? true : false;
    checkPasswordMatch();
}

function checkPasswordMatch() {
    const pwd = registerPassword.value;
    const confirm = registerConfirm.value;

    if (!pwd || !confirm) {
        passwordMatch.style.display = 'none';
        return;
    }

    if (pwd === confirm) {
        passwordMatch.textContent = "✓ Passwords match";
        passwordMatch.style.color = "#27ae60";
    } else {
        passwordMatch.textContent = "✗ Passwords do not match";
        passwordMatch.style.color = "#e74c3c";
    }
    passwordMatch.style.display = "block";
}

// Registration
registerForm.addEventListener('submit', e => {
    e.preventDefault();

    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = registerPassword.value;

    if (password !== registerConfirm.value) {
        showNotification("Passwords do not match!", "error");
        return;
    }

    localStorage.setItem("user", JSON.stringify({ name, email, password }));
    showNotification("Registration successful! Please login.", "success");

    tabs[0].click();
    registerForm.reset();
    passwordMatch.style.display = "none";
    missingReq.textContent = "";
    strengthFill.style.width = "0%";
});

// Login
loginForm.addEventListener('submit', e => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser && storedUser.email === email && storedUser.password === password) {
        userName.textContent = storedUser.name;
        userAvatar.textContent = storedUser.name.charAt(0).toUpperCase();
        lastLogin.textContent = new Date().toLocaleString();

        authContainer.style.display = "none";
        dashboard.style.display = "flex";
    } else {
        showNotification("Invalid email or password!", "error");
    }
});

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
    authContainer.style.display = "flex";
    dashboard.style.display = "none";

    loginForm.reset();
    registerForm.reset();
    passwordMatch.style.display = "none";
    missingReq.textContent = "";
    strengthFill.style.width = "0%";
});

// Notification
function showNotification(msg, type) {
    notification.textContent = msg;
    notification.className = `notification ${type}`;
    notification.style.display = "block";
    setTimeout(() => {
        notification.style.display = "none";
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) loginForm.querySelector('#login-email').value = storedUser.email;
});
