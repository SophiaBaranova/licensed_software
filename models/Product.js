const {
    MAX_IMAGE_SIZE_MB,
    MAX_IMAGE_SIZE_BYTES
} = window.commonApp;

export default class Product {
    constructor({
        id = null,
        name,
        short_description,
        extended_description = null,
        price,
        vendor,
        license,
        category_id,
        version,
        supported_os,
        download_url,
        image = null
    }) {
        const nameNorm = name?.trim();
        const shortDescNorm = short_description?.trim();
        const extendedDescNorm = extended_description?.trim() || null;
        const priceNorm = Number(price);
        const vendorNorm = vendor?.trim();
        const categoryIdNorm = Number(category_id);
        const licenseNorm = license?.trim();
        const versionNorm = version?.trim();
        const supportedOsNorm = supported_os?.trim();
        const downloadUrlNorm = download_url?.trim();

        if (!nameNorm) throw new Error("Назва не може бути порожньою");
        if (!shortDescNorm) throw new Error("Короткий опис не може бути порожнім");
        if (price == null || price === "") throw new Error("Ціна не може бути порожньою");
        if (!vendorNorm) throw new Error("Виробник не може бути порожнім");
        if (!licenseNorm) throw new Error("Ліцензія не може бути порожньою");
        if (category_id == null || category_id === "") throw new Error("ID категорії не може бути порожнім");
        if (!versionNorm) throw new Error("Версія не може бути порожньою");
        if (!supportedOsNorm) throw new Error("Список підтримуваних ОС не може бути порожнім");
        if (!downloadUrlNorm) throw new Error("Покликання для завантаження не може бути порожнім");

        if (id !== null ) {
            const idNorm = Number(id);
            if (!Number.isInteger(idNorm) || idNorm <= 0) {
                throw new Error("ID повинен бути цілим додатним числом");
            }
            this.id = idNorm;
        }

        if (!Number.isFinite(priceNorm) || priceNorm <= 0) {
            throw new Error("Ціна повинна бути додатним числом");
        }

        if (!Number.isInteger(categoryIdNorm) || categoryIdNorm <= 0) {
            throw new Error("ID категорії повинен бути цілим додатним числом");
        }

        const versionRegex = /^\d+(\.\d+)*$/;
        if (!versionRegex.test(versionNorm)) {
            throw new Error("Версія повинна мати коректний формат (наприклад: 1.0.2)");
        }

        const osRegex = /^\s*[\w\s.-]+(\s*,\s*[\w\s.-]+)*\s*$/;
        if (!osRegex.test(supportedOsNorm)) {
            throw new Error("Список підтримуваних ОС має бути у вигляді слів латиницею, розділених комами (наприклад: Windows, Linux)");
        }

        try {
            new URL(downloadUrlNorm);
        } catch {
            throw new Error("Покликання для завантаження має бути коректним URL");
        }

        if (image !== null) {
            if (!(image instanceof File)) {
                 throw new Error("Зображення повинно бути файлом");
            }
            if (!image.type.startsWith("image/")) {
                throw new Error("Файл повинен бути зображенням");
            }
            if (image.size > MAX_IMAGE_SIZE_BYTES) {
                throw new Error(`Розмір зображення не повинен перевищувати ${MAX_IMAGE_SIZE_MB} МБ`);
            }
        }

        this.name = nameNorm;
        this.short_description = shortDescNorm;
        this.extended_description = extendedDescNorm;
        this.price = priceNorm;
        this.vendor = vendorNorm;
        this.license = licenseNorm;
        this.category_id = categoryIdNorm;
        this.version = versionNorm;
        this.supported_os = supportedOsNorm;
        this.download_url = downloadUrlNorm;
        this.image = image;
    }
}
