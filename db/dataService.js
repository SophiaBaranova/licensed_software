import { products, categories, vendors } from '../mockData.js';

export function getProducts() {
    // TODO: Завантаження продуктів із БД
    return products;
}

export function getProductById(id) {
    // TODO: Завантаження продукту із БД за ID
    return products.find((product) => String(product.id) === String(id));
}

export function getCategories() {
    // TODO: Завантаження категорій із БД
    return categories;
}

export function getVendors() {
    // TODO: Завантаження виробників із БД
    return vendors;
}

// Отримання унікальних типів ліцензій зі списку продуктів
export function getLicenseTypes() {
    const licenseSet = new Set(products.map((product) => product.license));
    return Array.from(licenseSet);
}
