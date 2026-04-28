import User from '../../models/User.js';

// Валідація даних форми реєстрації та створення нового користувача
function validateSignupForm() {
    const form = document.getElementById('signupForm');
    const message = document.getElementById('signupMessage');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const login = formData.get('login').trim();
        const email = formData.get('email').trim();
        const password = formData.get('password').trim();

        try {
            const user = new User(login, email, password);
        } catch (error) {
            showMessage(message, error.message);
            return;
        }

        // TODO: Перевірка унікальності логіна у БД

        // TODO: Збереження нового користувача у БД

        hideMessage(message);
        window.location.href = 'login.html';
    });
}

// Валідація даних форми входу та перевірка облікового запису
function validateLoginForm() {
    const form = document.getElementById('loginForm');
    const message = document.getElementById('loginMessage');

    if (!form || !message) return;

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const login = formData.get('login').trim();
        const password = formData.get('password').trim();

        if (!login || !password) {
            showMessage(message, 'Будь ласка, заповніть усі поля');
            return;
        }

        // TODO: Перевірка наявності облікового запису у БД та коректності пароля

        hideMessage(message);
        window.location.href = '../catalog/index.html';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('signupForm')) {
        validateSignupForm();
    }
    if (document.getElementById('loginForm')) {
        validateLoginForm();
    }
});
