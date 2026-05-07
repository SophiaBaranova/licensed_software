import { products, categories } from '../mockData.js';

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

// Отримання унікальних виробників зі списку продуктів
export function getVendors() {
    const vendorSet = new Set(products.map((product) => product.vendor));
    return Array.from(vendorSet);
}

// Отримання унікальних типів ліцензій зі списку продуктів
export function getLicenseTypes() {
    const licenseSet = new Set(products.map((product) => product.license));
    return Array.from(licenseSet);
}
