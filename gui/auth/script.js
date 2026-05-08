import User from '../../models/User.js';
import {
    createUser,
    loginUser,
    checkLoginUnique
} from '../../db/dataService.js';

const {
    showMessage,
    hideMessage
} = window.commonApp;

// Обробка даних форми реєстрації
async function processSignupForm() {
    const form = document.getElementById('signupForm');
    const message = document.getElementById('signupMessage');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const values = Object.fromEntries(formData.entries());

        let user = null;
        // Валідація даних шляхом створення об'єкта User
        try {
            user = new User(values);
        } catch (error) {
            showMessage(message, error.message);
            return;
        }

        try {
            // Перевірка унікальності логіна у БД
            const checkLoginResult = await checkLoginUnique(user.login);

            if (!checkLoginResult.unique) {
                showMessage(message, 'Користувач із таким логіном уже існує');
                return;
            }

            // Збереження нового користувача у БД
            await createUser(user);

            hideMessage(message);

            // Перенаправлення користувача на сторінку авторизації після успішної реєстрації
            window.location.href = 'login.html';
        }
        catch (error) {
            showMessage(message, error.message);
        }
    });
}

// Обробка даних форми авторизації
async function processLoginForm() {
    const form = document.getElementById('loginForm');
    const message = document.getElementById('loginMessage');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const login = formData.get('login').trim();
        const password = formData.get('password').trim();

        if (!login || !password) {
            showMessage(message, 'Будь ласка, заповніть усі поля');
            return;
        }

        try {
            // Перевірка наявності облікового запису у БД та коректності пароля
            const user = await loginUser(login, password);

            hideMessage(message);

            // Перенаправлення користувача на відповідну сторінку залежно від ролі
            if (user.user.role === 'admin') {
                window.location.href = '../admin/dashboard.html';
            }
            else {
                window.location.href = '../catalog/catalog.html';
            }
        }
        catch (error) {
            showMessage(message, error.message);
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    if (document.getElementById('signupForm')) {
        await processSignupForm();
    }
    if (document.getElementById('loginForm')) {
        await processLoginForm();
    }
});
