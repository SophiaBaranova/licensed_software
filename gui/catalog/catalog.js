import { getProducts, getCategories, getVendors, getLicenses } from '../../db/dataService.js';

const {
    isAuthorized,
    formatPrice,
    getProductImage
} = window.commonApp;

let allProducts = [];

document.addEventListener('DOMContentLoaded', async () => {
    const authorized =
        await isAuthorized('user');
    if (!authorized) {
        console.error('Помилка авторизації або недостатньо прав для доступу до сторінки');
        return;
    }

    const productsContainer = document.getElementById('catalogProducts');
    const productsNotFound = document.getElementById('productsNotFound');
    productsNotFound.hidden = true;

    try {
        allProducts = await getProducts();

        renderProducts(allProducts);

        const categories = await getCategories();
        const vendors = await getVendors();
        const licenses = await getLicenses();

        renderFilterGroup(
            'categoryFilters',
            categories.map(category => category.name)
        );

        renderFilterGroup('vendorFilters', vendors);
        renderFilterGroup('licenseFilters', licenses);

        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');

        // Активація кнопки пошуку лише при наявності тексту у полі пошуку
        const updateSearchButtonState = () => {
            searchButton.disabled = !searchInput.value.trim();
        };

        searchInput.addEventListener('input', updateSearchButtonState);

        // Застосування фільтрів при натисканні на кнопку пошуку
        searchButton.addEventListener('click', applyFilters);

        // Застосування фільтрів при зміні стану чекбоксів
        document
            .querySelectorAll('.filters-panel input[type="checkbox"]')
            .forEach(input => {
                input.addEventListener('change', applyFilters);
            });

        updateSearchButtonState();
    }
    catch (error) {
        productsNotFound.hidden = false;
        productsNotFound.textContent = error.message;
        productsContainer.innerHTML = '';
    }
});

// Відображення карток товарів
function renderProducts(products) {
    const productsContainer = document.getElementById('catalogProducts');
    const productsNotFound = document.getElementById('productsNotFound');

    if (!products.length) {
        productsNotFound.hidden = false;
        productsNotFound.textContent = "Товари не знайдено";
        productsContainer.innerHTML = '';
        return;
    }

    productsNotFound.hidden = true;
    productsContainer.innerHTML = '';
    products.forEach(product => {
        productsContainer.appendChild(createProductCard(product));
    });
}

// Застосування пошукового запиту та фільтрів до списку товарів
function applyFilters() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase().trim();

    const selectedCategories = getCheckedValues('categoryFilters');
    const selectedVendors = getCheckedValues('vendorFilters');
    const selectedLicenses = getCheckedValues('licenseFilters');

    const filtered = allProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery);

        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
        const matchesVendor = selectedVendors.length === 0 || selectedVendors.includes(product.vendor);
        const matchesLicense = selectedLicenses.length === 0 || selectedLicenses.includes(product.license);

        return matchesSearch && matchesCategory && matchesVendor && matchesLicense;
    });

    renderProducts(filtered);
}

// Повернення масиву вибраних значень з групи чекбоксів фільтра
function getCheckedValues(containerId) {
    return Array.from(
        document.querySelectorAll(`#${containerId} input[type="checkbox"]:checked`)
    ).map(input => input.value);
}

// Створення картки товару
function createProductCard(product) {
    const article = document.createElement('article');
    article.className = 'card product-card';
    article.dataset.name = product.name;
    article.dataset.category = product.category;
    article.dataset.vendor = product.vendor;
    article.dataset.license = product.license;

    article.innerHTML = `
        <div class="product-card-image">
            <img src="${getProductImage(product)}" alt="${product.name}"/>
        </div>
        <div class="card-body">
            <h3 class="card-title">${product.name}</h3>
            <p class="card-text">${product.short_description}</p>
            <p class="card-text"><strong>Категорія:</strong> ${product.category}</p>
            <p class="card-text"><strong>Виробник:</strong> ${product.vendor}</p>
            <p class="card-text"><strong>Тип ліцензії:</strong> ${product.license}</p>
            <p class="card-text"><strong>Ціна:</strong> ${formatPrice(product.price)}</p>
            <a class="button button-primary" href="product.html?id=${product.id}">Детальніше</a>
        </div>
    `;

    return article;
}

// Відображення групи фільтрів
function renderFilterGroup(containerId, values) {
    const container = document.getElementById(containerId);

    values.forEach((value) => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.value = value;
        input.checked = false;
        label.appendChild(input);
        label.insertAdjacentText('beforeend', ` ${value}`);
        container.appendChild(label);
    });
}
