import { getProducts, getCategories, getVendors, getLicenseTypes } from '../../db/dataService.js';

let allProducts = [];

document.addEventListener('DOMContentLoaded', () => {
    const productsContainer = document.getElementById('catalogProducts');

    allProducts = getProducts();
    renderProducts(allProducts);

    renderFilterGroup('categoryFilters', getCategories().map((category) => category.name));
    renderFilterGroup('vendorFilters', getVendors());
    renderFilterGroup('licenseFilters', getLicenseTypes());

    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    // Активація кнопки пошуку лише при наявності тексту у полі пошуку
    const updateSearchButtonState = () => {
        searchButton.disabled = !searchInput.value.trim();
    };

    searchInput.addEventListener('input', () => {
        updateSearchButtonState();
        applyFilters();
    });

    searchButton.addEventListener('click', applyFilters);

    document.querySelectorAll('.filters-panel input[type="checkbox"]').forEach(input => {
        input.addEventListener('change', applyFilters);
    });

    updateSearchButtonState();
});

// Відображення карток продуктів
function renderProducts(products) {
    const container = document.getElementById('catalogProducts');

    if (!products.length) {
        container.innerHTML = '<p class="no-results">Продукти не знайдено</p>';
        return;
    }

    container.innerHTML = '';
    products.forEach(product => {
        container.appendChild(createProductCard(product));
    });
}

// Застосування пошукового запиту та фільтрів до списку продуктів
function applyFilters() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase().trim();

    const selectedCategories = getCheckedValues('categoryFilters');
    const selectedVendors = getCheckedValues('vendorFilters');
    const selectedLicenses = getCheckedValues('licenseFilters');

    const filtered = allProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery);

        const matchesCategory = selectedCategories.includes(product.category);
        const matchesVendor = selectedVendors.includes(product.vendor);
        const matchesLicense = selectedLicenses.includes(product.license);

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

// Створення картки продукта
function createProductCard(product) {
    const article = document.createElement('article');
    article.className = 'card product-card';
    article.dataset.name = product.name;
    article.dataset.category = product.category;
    article.dataset.vendor = product.vendor;
    article.dataset.license = product.license;

    article.innerHTML = `
        <div class="product-card-image">
            <img src="${product.image_url}" alt="${product.name}"/>
        </div>
        <div class="card-body">
            <h3 class="card-title">${product.name}</h3>
            <p class="card-text">${product.short_description}</p>
            <p class="card-text"><strong>Категорія:</strong> ${product.category}</p>
            <p class="card-text"><strong>Виробник:</strong> ${product.vendor}</p>
            <p class="card-text"><strong>Тип ліцензії:</strong> ${product.license}</p>
            <p class="card-text"><strong>Ціна:</strong> ${formatPrice(product.price)}</p>
            <a class="button button-primary" href="product.html?id=${encodeURIComponent(product.id)}">Детальніше</a>
        </div>
    `;

    return article;
}

// Відображення групи фільтрів
function renderFilterGroup(containerId, values) {
    const container = document.getElementById(containerId);

    const uniqueValues = Array.from(new Set(values));
    uniqueValues.forEach((value) => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.value = value;
        input.checked = true;
        label.appendChild(input);
        label.insertAdjacentText('beforeend', ` ${value}`);
        container.appendChild(label);
    });
}
