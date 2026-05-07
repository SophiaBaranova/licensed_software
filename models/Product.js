export default class Product {
    constructor(
        id = null,
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
        image_url = null
    ) {
        if (!name?.trim()) throw new Error("Назва не може бути порожньою");
        if (!short_description?.trim()) throw new Error("Короткий опис не може бути порожнім");
        if (!vendor?.trim()) throw new Error("Виробник не може бути порожнім");
        if (!license?.trim()) throw new Error("Ліцензія не може бути порожньою");
        if (!category?.trim()) throw new Error("Категорія не може бути порожньою");
        if (!version?.trim()) throw new Error("Версія не може бути порожньою");
        if (!supported_os?.trim()) throw new Error("Список підтримуваних ОС не може бути порожнім");

        if (id !== null && (!Number.isInteger(id) || id <= 0)) {
            throw new Error("ID повинен бути цілим додатним числом");
        }

        if (typeof price !== "number" || price <= 0) {
            throw new Error("Ціна повинна бути додатним числом");
        }

        const versionRegex = /^\d+(\.\d+)*$/;
        if (!versionRegex.test(version)) {
            throw new Error("Версія повинна мати коректний формат (наприклад: 1.0.2)");
        }

        const osRegex = /^\s*\w+(\s*,\s*\w+)*\s*$/;
        if (!osRegex.test(supported_os)) {
            throw new Error("Список підтримуваних ОС має бути у вигляді слів, розділених комами (наприклад: Windows, Linux)");
        }

        try {
            new URL(download_url);
        } catch {
            throw new Error("Покликання для завантаження має бути коректним URL (наприклад: https://example.com/download)");
        }

        if (image_url !== null && image_url !== undefined && image_url !== "") {
            try {
                new URL(image_url);
            } catch {
                throw new Error("Покликання на зображення має бути коректним URL або null");
            }
        } else {
            image_url = null;
        }

        this.name = name.trim();
        this.short_description = short_description.trim();
        this.extended_description = extended_description.trim() || null;
        this.price = price;
        this.vendor = vendor.trim();
        this.license = license.trim();
        this.category = category.trim();
        this.version = version.trim();
        this.supported_os = supported_os.trim();
        this.download_url = download_url;
        this.image_url = image_url;
    }
}
