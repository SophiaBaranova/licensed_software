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

window.commonApp = {
    initCommonNavigation,
    showMessage,
    hideMessage,
    formatPrice,
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCommonNavigation);
} else {
    initCommonNavigation();
}
