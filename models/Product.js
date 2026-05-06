export default class Product {
    constructor(
        name,
        short_description,
        extended_description,
        price,
        vendor,
        license,
        category,
        version,
        supported_os,
        download_url,
        image_url
    ) {
        if (!name?.trim()) throw new Error("Назва не може бути порожньою");
        if (!vendor?.trim()) throw new Error("Постачальник не може бути порожнім");
        if (!category?.trim()) throw new Error("Категорія не може бути порожньою");

        if (typeof price !== "number" || price <= 0) {
            throw new Error("Ціна повинна бути додатним числом");
        }

        const versionRegex = /^\d+(\.\d+)*$/;
        if (!versionRegex.test(version)) {
            throw new Error("Версія повинна мати коректний формат, (наприклад: 1.0.2)");
        }

        const osRegex = /^\s*\w+(\s*,\s*\w+)*\s*$/;
        if (!osRegex.test(supported_os)) {
            throw new Error("Список ОС має бути у вигляді слів, розділених комами (наприклад: Windows, Linux)");
        }

        try {
            new URL(download_url);
        } catch {
            throw new Error("Покликання для завантаження має бути коректним URL (наприклад: https://example.com/download)");
        }

        try {
            new URL(image_url);
        } catch {
            throw new Error("Покликання на зображення має бути коректним URL (наприклад: https://example.com/image.jpg)");
        }

        this.name = name.trim();
        this.short_description = short_description.trim();
        this.extended_description = extended_description.trim();
        this.price = price;
        this.vendor = vendor.trim();
        this.license = license.trim();
        this.category = category.trim();
        this.version = version;
        this.supported_os = supported_os;
        this.download_url = download_url;
        this.image_url = image_url;
    }
}
