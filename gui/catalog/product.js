import { getProductById } from '../../db/dataService.js';

const {
    isAuthorized,
    formatPrice,
    getProductImage
} = window.commonApp;

let product = null;

document.addEventListener('DOMContentLoaded', async () => {
    const authorized =
        await isAuthorized('user');
    if (!authorized) {
        console.error('Помилка авторизації або недостатньо прав для доступу до сторінки');
        return;
    }
    
    // Отримання ID товару з URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    try {
        if (id !== null) {
            // Завантаження даних товару із БД за ID
            product = await getProductById(id);
        }

        if (!product) {
            showProductNotFound('Товар не знайдено');
            return;
        }

        populateProductPage();
        initializeDownloadOverlay();
    }
    catch (error) {
        showProductNotFound(error.message);
    }
});

// Заповнення сторінки даними товару
function populateProductPage() {
    const title = document.getElementById('productTitle');
    const subtitle = document.getElementById('productSubtitle');
    const category = document.getElementById('productCategory');
    const vendor = document.getElementById('productVendor');
    const license = document.getElementById('productLicense');
    const price = document.getElementById('productPrice');
    const version = document.getElementById('productVersion');
    const supportedOS = document.getElementById('productSupportedOS');
    const description = document.getElementById('productDescription');
    const downloadUrl = document.getElementById('downloadUrl');
    const productImage = document.getElementById('productImage');
    const notFound = document.getElementById('productNotFound');
    const detailsCard = document.querySelector('.product-details-card');

    notFound.hidden = true;
    detailsCard.hidden = false;

    title.textContent = product.name;
    subtitle.textContent = product.short_description;
    category.textContent = product.category;
    vendor.textContent = product.vendor;
    license.textContent = product.license;
    price.textContent = formatPrice(product.price);
    version.textContent = product.version;
    supportedOS.textContent = product.supported_os;
    description.textContent = product.extended_description;
    downloadUrl.textContent = product.download_url;
    productImage.src = getProductImage(product);
    productImage.alt = product.name;
}

// Ініціалізація модального вікна для відображення покликання завантаження
function initializeDownloadOverlay() {
    const downloadButton = document.getElementById('downloadButton');
    const downloadOverlay = document.getElementById('downloadOverlay');
    const downloadOverlayClose = document.getElementById('downloadOverlayClose');
    const copyDownloadUrl = document.getElementById('copyDownloadUrl');
    const downloadUrl = document.getElementById('downloadUrl');

    const showOverlay = () => {
        downloadOverlay.classList.add('open');
        downloadOverlay.setAttribute('aria-hidden', 'false');
    };

    const hideOverlay = () => {
        downloadOverlay.classList.remove('open');
        downloadOverlay.setAttribute('aria-hidden', 'true');
    };

    // Відкриття модального вікна при натисканні на кнопку "Завантажити"
    downloadButton.addEventListener('click', showOverlay);

    // Закриття модального вікна при натисканні на кнопку закриття або поза межами вікна
    downloadOverlayClose.addEventListener('click', hideOverlay);
    downloadOverlay.addEventListener('click', (event) => {
        if (event.target === downloadOverlay) {
            hideOverlay();
        }
    });

    // Копіювання покликання завантаження в буфер обміну при натисканні на кнопку "Скопіювати покликання"
    // і зміна тексту кнопки на "Скопійовано!" (на 2 секунди)
    copyDownloadUrl.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(downloadUrl.textContent.trim());
            copyDownloadUrl.textContent = 'Скопійовано!';
            setTimeout(() => {
                copyDownloadUrl.textContent = 'Скопіювати покликання';
            }, 2000);
        } catch (error) {
            console.warn('Помилка копіювання в буфер обміну', error);
        }
    });
}

// Відображення повідомлення про відсутність товару
function showProductNotFound() {
    const notFound = document.getElementById('productNotFound');
    const detailsCard = document.querySelector('.product-details-card');

    detailsCard.hidden = true;
    notFound.textContent = 'Товар не знайдено';
    notFound.hidden = false;
}
