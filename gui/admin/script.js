import Category from '../../models/Category.js';
import Product from '../../models/Product.js';
import { 
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
} from '../../db/dataService.js';

const {
    isAuthorized,
    showMessage,
    hideMessage,
    formatPrice
} = window.commonApp;

async function init() {
    const authorized =
        await isAuthorized('admin');
    if (!authorized) {
        console.error('Помилка авторизації або недостатньо прав для доступу до сторінки');
        return;
    }

    try {
        await loadData();
    } catch (error) {
        alert(error.message || 'Помилка завантаження даних');
        console.error(error);
    }
    activateTab(state.activeTab);
}

const state = {
    activeTab: 'categories',
    selectedKey: null,
    mode: null
};

const tabButtons = Array.from(document.querySelectorAll('.tab-button'));
const tableTitle = document.querySelector('.table-section .section-title');
const tableHeadRow = document.querySelector('table thead tr');
const tableBody = document.querySelector('table tbody');
const addButton = document.getElementById('addButton');
const editButton = document.getElementById('editButton');
const deleteButton = document.getElementById('deleteButton');
const modalOverlay = document.getElementById('modalOverlay');
const confirmOverlay = document.getElementById('confirmOverlay');
const modalTitle = document.getElementById('modalTitle');
const modalFields = document.getElementById('modalFields');
const recordForm = document.getElementById('recordForm');
const confirmText = document.getElementById('confirmText');
const cancelButton = document.getElementById('cancelButton');
const cancelDeleteButton = document.getElementById('cancelDeleteButton');
const confirmDeleteButton = document.getElementById('confirmDeleteButton');
const closeButtons = Array.from(document.querySelectorAll('.close-button'));

const data = {
    categories: [],
    products: []
};

// Завантаження даних категорій та товарів з БД та відображення їх у таблиці
async function loadData() {
    data.categories = await getCategories();
    data.products = await getProducts();
    renderTable();
}

// Мапа полів для категорій та товарів, що використовується для генерації форм додавання/редагування
const fieldsMap = {
    categories: [
        { key: 'name', label: 'Назва', type: 'text', required: true },
        { key: 'description', label: 'Опис', type: 'textarea', required: false }
    ],
    products: [
        { key: 'name', label: 'Назва', type: 'text', required: true },
        { key: 'short_description', label: 'Короткий опис', type: 'textarea', required: true },
        { key: 'extended_description', label: 'Повний опис', type: 'textarea', required: false },
        { key: 'category_id', label: 'Категорія', type: 'select', required: true },
        { key: 'vendor', label: 'Виробник', type: 'text', required: true },
        { key: 'license', label: 'Ліцензія', type: 'text', required: true },
        { key: 'price', label: 'Ціна', type: 'number', required: true },
        { key: 'version', label: 'Версія', type: 'text', required: true },
        { key: 'supported_os', label: 'Підтримувані ОС', type: 'textarea', required: true },
        { key: 'download_url', label: 'URL для завантаження', type: 'url', required: true },
        { key: 'image', label: 'Зображення', type: 'file', required: false }
    ]
};

// Підписи для модальних вікон залежно від активної вкладки
const tabLabels = {
    categories: 'категорію',
    products: 'товар'
};

// Повернення варіантів для полів типу select у формі
function getOptions(fieldName) {
    if (fieldName === 'category_id') {
        return data.categories;
    }
    return [];
}

// Повернення вибраного запису із таблиці активної вкладки
function getActiveRecord() {
    if (!state.selectedKey) return null;
    return data[state.activeTab].find(
        (item) => String(item.id) === String(state.selectedKey)
    ) || null;
}

// Відображення таблиці записів для активної вкладки
function renderTable() {
    const rows = data[state.activeTab] || [];

    tableTitle.textContent =
        state.activeTab === 'categories' ? 'Категорії' : 'Товари';

    tableHeadRow.innerHTML = fieldsMap[state.activeTab]
        .map((field) => `<th>${field.label}</th>`)
        .join('');

    tableBody.innerHTML = rows
        .map((item) => {
            const columns = fieldsMap[state.activeTab].map((field) => {
                    if (field.key === 'price') {
                        return `<td>${formatPrice(item.price, '₴')}</td>`;
                    } else if (field.key === 'category_id') {
                        return `<td>${item.category}</td>`;
                    } else if (field.key === 'image') {
                        if (item.image_url) {
                            return `
                                <td><img
                                    src="${item.image_url}"
                                    alt="${item.name}"
                                    class="table-image-preview"
                                ></td>`;
                        } else {
                            return `<td>-</td>`;
                        }
                    }
                    return `<td>${item[field.key] ?? ''}</td>`;
                }).join('');
            return `<tr data-key="${item.id}" class="${state.selectedKey == item.id ? 'selected' : ''}">${columns}</tr>`;
        })
        .join('');
}

// Очищення вибору рядка в таблиці та відключення кнопок редагування/видалення
function clearSelection() {
    state.selectedKey = null;
    editButton.disabled = true;
    deleteButton.disabled = true;
    renderTable();
}

// Вибір рядка в таблиці та активація кнопок редагування/видалення
function selectRow(key) {
    state.selectedKey = key;
    editButton.disabled = false;
    deleteButton.disabled = false;
    renderTable();
}

// Відображення полів форми для додавання/редагування запису у модальному вікні
function renderFormFields(values = {}) {
    modalFields.innerHTML = '';

    fieldsMap[state.activeTab].forEach((field) => {
        const row = document.createElement('div');
        row.className = 'modal-field';

        const label = document.createElement('label');
        label.htmlFor = `field-${field.key}`;
        label.textContent = field.label;

        let input;
        if (field.type === 'textarea') {
            input = document.createElement('textarea');
        } else if (field.type === 'select') {
            input = document.createElement('select');
            const options = field.options || getOptions(field.key);
            options.forEach((option) => {
                const optionElement = document.createElement('option');
                optionElement.value = option.id;
                optionElement.textContent = option.name;
                input.append(optionElement);
            });
        } else {
            input = document.createElement('input');
            input.type = field.type;
            if (field.type === 'number') {
                input.min = '0';
                input.step = '0.01';
            } else if (field.type === 'file') {
                input.accept = 'image/*';
            }
        }

        input.id = `field-${field.key}`;
        input.name = field.key;
        input.required = field.required;

        // Заповнення полів даними вибраного запису при редагуванні
        if (field.type !== 'file' && values[field.key] !== undefined && values[field.key] !== null) {
            input.value = values[field.key];
        }

        row.append(label, input);

        if (field.key === 'image' && values.image_url) {
            const preview = document.createElement('img');
            preview.src = values.image_url;
            preview.alt = 'Попередній перегляд зображення';
            preview.className = 'image-preview';
            row.append(preview);
        }

        modalFields.append(row);
    });
}

// Відкриття модального вікна для додавання/редагування запису
function openModal(mode) {
    state.mode = mode;
    const record = mode === 'edit' ? getActiveRecord() : null;
    modalTitle.textContent = `${mode === 'edit' ? 'Редагувати' : 'Додати'} ${tabLabels[state.activeTab]}`;
    renderFormFields(record || {});
    modalOverlay.classList.remove('hidden');
    modalOverlay.setAttribute('aria-hidden', 'false');
    const message = document.getElementById('formMessage');
    hideMessage(message);
}

// Закриття модального вікна
function closeModal() {
    state.mode = null;
    modalOverlay.classList.add('hidden');
    modalOverlay.setAttribute('aria-hidden', 'true');
    recordForm.reset();
}

// Відкриття модального вікна підтвердження видалення запису
function openConfirm() {
    const record = getActiveRecord();
    if (!record) return;
    let confirmMessage = `Ви дійсно хочете видалити запис «${record.name}»?`;
    if (state.activeTab === 'categories') {
        confirmMessage += ' Всі товари цієї категорії також будуть видалені.';
    }
    confirmText.textContent = confirmMessage;
    confirmOverlay.classList.remove('hidden');
    confirmOverlay.setAttribute('aria-hidden', 'false');
}

// Закриття модального вікна підтвердження видалення запису
function closeConfirm() {
    confirmOverlay.classList.add('hidden');
    confirmOverlay.setAttribute('aria-hidden', 'true');
}

// Валідація даних форми (шляхом спроби створення відповідного об'єкта)
function validateRecord(values) {
    if (state.activeTab === 'categories') {
        return new Category(values);
    }
    return new Product(values);
}

// Збереження нового/відредагованого запису у БД після валідації
async function saveRecord(formData) {
    const values = Object.fromEntries(formData.entries());
    const message = document.getElementById('formMessage');

    if (values.image instanceof File && values.image.size === 0) {
        values.image = null;
    }

    let entity;

    try {
        if (state.mode === 'edit') {
            const record = getActiveRecord();
            entity = validateRecord({
                ...values,
                id: record?.id
            });
        } else {
            entity = validateRecord(values);
        }
    } catch (error) {
        showMessage(message, error.message);
        return;
    }

    hideMessage(message);

    try {

        if (state.activeTab === 'products') {
            // Підготовка даних для відправки, включаючи файл зображення, якщо він є
            const requestData = new FormData();
            Object.entries(entity).forEach(([key, value]) => {
                requestData.append(key, value);
            });
            if (values.image) {
                requestData.append('image', values.image);
            }

            if (state.mode === 'edit') {
                // Оновлення запису у БД
                console.log("Updating product with data:", Object.fromEntries(requestData.entries()));
                await updateProduct(requestData);
            } else {
                // Створення нового запису у БД
                await createProduct(requestData);
            }

        } else {
            if (state.mode === 'edit') {
                // Оновлення запису у БД
                await updateCategory(entity);
            } else {
                // Створення нового запису у БД
                await createCategory(entity);
            }
        }

        // Оновлення даних таблиць, очищення вибору та закриття модального вікна
        await loadData();
        clearSelection();
        closeModal();

    } catch (error) {
        showMessage(message, error.message || "Помилка збереження даних");
        console.error(error);
    }
}

// Видалення запису з БД після підтвердження
async function deleteRecord() {
    if (!state.selectedKey) return;

    try {
        if (state.activeTab === 'categories') {
            await deleteCategory(state.selectedKey);
        } else {
            await deleteProduct(state.selectedKey);
        }

        // Оновлення даних таблиць, очищення вибору та закриття модального вікна
        await loadData();
        clearSelection();
        closeConfirm();

    } catch (error) {
        alert(error.message || "Помилка видалення даних");
        console.error(error);
    }
}

// Активація вкладки та відповідне оновлення таблиці
function activateTab(tabName) {
    state.activeTab = tabName;
    state.selectedKey = null;
    tabButtons.forEach((button) => button.classList.toggle('active', button.dataset.tab === tabName));
    editButton.disabled = true;
    deleteButton.disabled = true;
    renderTable();
}

// Вибір рядка в таблиці при кліку
tableBody.addEventListener('click', (event) => {
    const row = event.target.closest('tr');
    if (!row) return;
    selectRow(row.dataset.key);
});

// Обробники подій для кнопок додавання, редагування та видалення записів
addButton.addEventListener('click', () => openModal('add'));
editButton.addEventListener('click', () => openModal('edit'));
deleteButton.addEventListener('click', () => openConfirm());

// Обробники подій для модальнх вікон
recordForm.addEventListener('submit', (event) => {
    event.preventDefault();
    saveRecord(new FormData(recordForm));
});
cancelButton.addEventListener('click', closeModal);
cancelDeleteButton.addEventListener('click', closeConfirm);
confirmDeleteButton.addEventListener('click', deleteRecord);
closeButtons.forEach((button) => {
    button.addEventListener('click', () => {
        closeModal();
        closeConfirm();
    });
});
modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) {
        closeModal();
    }
});
confirmOverlay.addEventListener('click', (event) => {
    if (event.target === confirmOverlay) {
        closeConfirm();
    }
});

// Активація вкладки при кліку
tabButtons.forEach((button) => {
    button.addEventListener('click', () => activateTab(button.dataset.tab));
});

init();
