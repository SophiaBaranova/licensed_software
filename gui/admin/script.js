import { getCategories, getVendors, getProducts, getLicenseTypes } from '../../db/dataService.js';

const state = {
    activeTab: 'category',
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
    category: getCategories(),
    vendor: getVendors(),
    product: getProducts()
};

// Оновлення даних для активної вкладки після змін у БД
function refreshActiveData() {
    if (state.activeTab === 'category') {
        data.category = getCategories();
    } else if (state.activeTab === 'vendor') {
        data.vendor = getVendors();
    } else if (state.activeTab === 'product') {
        data.product = getProducts();
    }
}

const fieldsMap = {
    category: [
        { key: 'name', label: 'Назва' },
        { key: 'description', label: 'Опис' }
    ],
    vendor: [
        { key: 'name', label: 'Назва' },
        { key: 'website', label: 'Веб-сайт' }
    ],
    product: [
        { key: 'name', label: 'Назва' },
        { key: 'short_description', label: 'Короткий опис' },
        { key: 'extended_description', label: 'Повний опис' },
        { key: 'category', label: 'Категорія' },
        { key: 'vendor', label: 'Виробник' },
        { key: 'license', label: 'Ліцензія' },
        { key: 'price', label: 'Ціна' },
        { key: 'version', label: 'Версія' },
        { key: 'supported_os', label: 'Підтримувані ОС' },
        { key: 'download_url', label: 'URL для завантаження' }
    ]
};

const tabLabels = {
    category: 'категорію',
    vendor: 'виробника',
    product: 'продукт'
};

// Повернення варіантів для полів типу select у формі
function getOptions(fieldName) {
    if (fieldName === 'vendor') {
        return data.vendor.map((item) => item.name);
    }
    if (fieldName === 'category') {
        return data.category.map((item) => item.name);
    }
    return [];
}

// Повернення вибраного запису із таблиці активної вкладки
function getActiveRecord() {
    if (!state.selectedKey) return null;
    return data[state.activeTab].find((item) => item.name === state.selectedKey) || null;
}

// Відображення таблиці записів для активної вкладки
function renderTable() {
    tableTitle.textContent = state.activeTab === 'category' ? 'Категорії' : state.activeTab === 'vendor' ? 'Виробники' : 'Продукти';

    tableHeadRow.innerHTML = fieldsMap[state.activeTab]
        .map((field) => `<th>${field.label}</th>`)
        .join('');

    tableBody.innerHTML = data[state.activeTab]
        .map((item) => {
            const columns = fieldsMap[state.activeTab].map((field) => {
                if (field.key === 'price') {
                    return `<td>${formatPrice(item.price, '₴')}</td>`;
                }
                return `<td>${item[field.key] ?? ''}</td>`;
            }).join('');
            return `<tr data-key="${item.name}" class="${state.selectedKey === item.name ? 'selected' : ''}">${columns}</tr>`;
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
            const options = field.options || getOptions(field.name);
            options.forEach((optionValue) => {
                const option = document.createElement('option');
                option.value = optionValue;
                option.textContent = optionValue;
                input.append(option);
            });
        } else {
            input = document.createElement('input');
            input.type = field.type;
            if (field.step) {
                input.step = field.step;
            }
        }

        input.id = `field-${field.key}`;
        input.name = field.key;
        input.required = !!field.required;
        if (values[field.key] !== undefined && values[field.key] !== null) {
            input.value = values[field.key];
        }

        row.append(label, input);
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
    confirmText.textContent = `Ви дійсно хочете видалити запис «${record.name}»?`;
    confirmOverlay.classList.remove('hidden');
    confirmOverlay.setAttribute('aria-hidden', 'false');
}

// Закриття діалогового вікна підтвердження видалення
function closeConfirm() {
    confirmOverlay.classList.add('hidden');
    confirmOverlay.setAttribute('aria-hidden', 'true');
}

// Валідація даних форми (шляхом спроби створення відповідного об'єкта)
function validateRecord(values) {
    if (state.activeTab === 'category') {
        return new Category(values);
    }

    if (state.activeTab === 'vendor') {
        return new Vendor(values);
    }

    if (state.activeTab === 'product') {
        return new Product({
            ...values,
            price: Number(values.price)
        });
    }
}

// Збереження нового/відредагованого запису у БД після валідації
function saveRecord(formData) {
    const values = Object.fromEntries(formData.entries());
    const message = document.getElementById('formMessage');

    let entity;

    try {
        entity = validateRecord(values);
    } catch (error) {
        showMessage(message, error.message);
        return;
    }

    hideMessage(message);

    if (state.mode === 'edit') {
        const record = getActiveRecord();
        if (!record) return;
        
        // TODO: Оновлення запису у БД
    } else {
        // TODO: Збереження нового запису у БД
    }

    refreshActiveData();
    clearSelection();
    closeModal();
}

// Видалення запису з БД після підтвердження
function deleteRecord() {
    if (!state.selectedKey) return;
    
    // TODO: Видалення запису із БД

    refreshActiveData();
    clearSelection();
    closeConfirm();
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

tableBody.addEventListener('click', (event) => {
    const row = event.target.closest('tr');
    if (!row) return;
    selectRow(row.dataset.key);
});

addButton.addEventListener('click', () => openModal('add'));
editButton.addEventListener('click', () => openModal('edit'));
deleteButton.addEventListener('click', () => openConfirm());

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

tabButtons.forEach((button) => {
    button.addEventListener('click', () => activateTab(button.dataset.tab));
});

activateTab(state.activeTab);
