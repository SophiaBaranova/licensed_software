const API_BASE = "../../db";
const ENDPOINTS = {
    products: "products.php",
    categories: "categories.php",
    users: "users.php",
    auth: "auth.php"
};

async function request(url, options = {}) {
    const headers = options.body instanceof FormData
        ? (options.headers || {})
        : {
            "Content-Type": "application/json",
            ...(options.headers || {})
        };

    const res = await fetch(`${API_BASE}/${url}`, {
        ...options,
        credentials: 'include',
        headers
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Помилка при виконанні запиту до БД");
    }

    return data;
}

let cachedProducts = null;

export async function getProducts() {
    cachedProducts = await request(`${ENDPOINTS.products}?action=getAll`);
    return cachedProducts;
}

export async function getProductsCached() {
    if (!cachedProducts) {
        cachedProducts = await getProducts();
    }
    return cachedProducts;
}

export async function getProductById(id) {
    return await request(`${ENDPOINTS.products}?action=getById&id=${id}`);
}

export async function createProduct(productFormData) {
    return request(`${ENDPOINTS.products}?action=create`, {
        method: "POST",
        body: productFormData
    });
}

export async function updateProduct(productFormData) {
    return request(`${ENDPOINTS.products}?action=update`, {
        method: "POST",
        body: productFormData
    });
}

export async function deleteProduct(id) {
    return request(`${ENDPOINTS.products}?action=delete&id=${id}`);
}

export async function getCategories() {
    return request(`${ENDPOINTS.categories}?action=getAll`);
}

export async function createCategory(category) {
    return request(`${ENDPOINTS.categories}?action=create`, {
        method: "POST",
        body: JSON.stringify(category)
    });
}

export async function updateCategory(category) {
    return request(`${ENDPOINTS.categories}?action=update`, {
        method: "POST",
        body: JSON.stringify(category)
    });
}

export async function deleteCategory(id) {
    return await request(`${ENDPOINTS.categories}?action=delete&id=${id}`);
}

// Отримання унікальних виробників зі списку товарів
export async function getVendors() {
    const products = await getProductsCached();
    const vendorSet = new Set(products.map((product) => product.vendor));
    return Array.from(vendorSet);
}

// Отримання унікальних типів ліцензій зі списку товарів
export async function getLicenses() {
    const products = await getProductsCached();
    const licenseSet = new Set(products.map((product) => product.license));
    return Array.from(licenseSet);
}

export async function createUser(user) {
    return await request(`${ENDPOINTS.users}?action=create`, {
        method: "POST",
        body: JSON.stringify(user)
    });
}

export async function checkLoginUnique(login) {
    return await request(`${ENDPOINTS.users}?action=checkLoginUnique&login=${encodeURIComponent(login)}`);
}

export async function loginUser(login, password) {
    return await request(`${ENDPOINTS.auth}?action=login`, {
        method: "POST",
        body: JSON.stringify({ login, password })
    });
}

export async function logoutUser() {
    return await request(`${ENDPOINTS.auth}?action=logout`, {
        method: "POST"
    });
}

export async function checkAuth() {
    return await request(`${ENDPOINTS.auth}?action=me`);
}
