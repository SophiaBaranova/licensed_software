import { getProductById } from '../../db/dataService.js';

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const product = id ? getProductById(id) : null;

    if (!product) {
        showProductNotFound();
        return;
    }

    populateProductPage(product);
    initializeDownloadOverlay();
});

// Заповнення сторінки продукту даними з об'єкта продукту
function populateProductPage(product) {
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
    productImage.src = product.image_url;
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

    downloadButton.addEventListener('click', showOverlay);
    if (downloadOverlayClose) {
        downloadOverlayClose.addEventListener('click', hideOverlay);
    }

    downloadOverlay.addEventListener('click', (event) => {
        if (event.target === downloadOverlay) {
            hideOverlay();
        }
    });

    copyDownloadUrl.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(downloadUrl.textContent.trim());
            copyDownloadUrl.textContent = 'Скопійовано!';
            setTimeout(() => {
                copyDownloadUrl.textContent = 'Скопіювати покликання';
            }, 2000);
        } catch (error) {
            console.warn('Clipboard write failed', error);
        }
    });
}

// Відображення повідомлення про відсутність продукту
function showProductNotFound() {
    const notFound = document.getElementById('productNotFound');
    const detailsCard = document.querySelector('.product-details-card');

    detailsCard.hidden = true;
    notFound.textContent = 'Продукт не знайдено';
    notFound.hidden = false;
}
