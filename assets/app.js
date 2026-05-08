import {
    checkAuth,
    logoutUser
} from '../db/dataService.js';

const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

// Ініціалізація спільної навігації для всіх сторінок
function initCommonNavigation() {
    document.querySelectorAll('[data-nav-target]').forEach((button) => {
        button.addEventListener('click', (event) => {
            const target = event.currentTarget.dataset.navTarget;
            if (target) {
                window.location.href = target;
            }
        });
    });
}

// Ініціалізація кнопок на панелі навігації, що залежать від статусу авторизації
async function initAuthNav() {
    try {
        const data = await checkAuth();

        const loginLink = document.getElementById('loginLink');
        const logoutLink = document.getElementById('logoutLink');
        if (!loginLink || !logoutLink) return;

        if (data.authenticated) {
            loginLink.style.display = 'none';
            logoutLink.style.display = 'inline';
        } else {
            loginLink.style.display = 'inline';
            logoutLink.style.display = 'none';
        }

        logoutLink.addEventListener('click', async (e) => {
            e.preventDefault();
            await logoutUser();
            window.location.href = '/gui/homepage/index.html';
        });
    } catch (err) {
        console.error(err);
    }
}

// Відображення повідомлення у вказаному контейнері
function showMessage(container, message) {
    container.textContent = message;
    container.style.display = 'block';
}

// Приховування повідомлення у вказаному контейнері
function hideMessage(container) {
    container.textContent = '';
    container.style.display = 'none';
}

// Форматування ціни
function formatPrice(price, currency = 'грн') {
    return typeof price === 'number'
        ? `${price.toFixed(2).replace(/\.00$/, '')} ${currency}`
        : price;
}

// Отримання URL зображення товару або генерація заглушки
function getProductImage(product) {
    return (
        product.image_url ||
        `https://placehold.co/400x280/2563eb/ffffff?text=${encodeURIComponent(product.name)}&font=roboto`
    );
}

async function isAuthorized(requiredRole = null) {
    try {
        const data = await checkAuth();

        // Неавторизований користувач
        if (!data.authenticated) {
            window.location.href = '/gui/auth/login.html';
            return false;
        }

        // Недостатньо прав
        if (
            requiredRole &&
            data.user.role !== requiredRole
        ) {
            alert('Недостатньо прав для доступу до сторінки');
            window.location.href = '/gui/homepage/index.html';
            return false;
        }

        return true;

    } catch (error) {
        alert('Помилка перевірки авторизації');
        window.location.href = '/gui/auth/login.html';
        return false;
    }
}

async function logout() {
    try {
        await logoutUser();
        window.location.href = '/gui/auth/login.html';
    } catch (error) {
        alert('Помилка виходу з облікового запису');
        console.error(error);
    }
}

window.commonApp = {
    MAX_IMAGE_SIZE_BYTES,
    MAX_IMAGE_SIZE_MB,
    initCommonNavigation,
    showMessage,
    hideMessage,
    formatPrice,
    getProductImage,
    isAuthorized,
    logout
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCommonNavigation);
} else {
    initCommonNavigation();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuthNav);
} else {
    initAuthNav();
}
