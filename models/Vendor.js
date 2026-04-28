export default class Vendor {
    constructor(
        name,
        website
    ) {
        if (!name?.trim()) {
            throw new Error("Назва не може бути порожньою");
        }

        try {
            new URL(website);
        } catch {
            throw new Error("Веб-сайт має бути коректним URL (наприклад: https://example.com)");
        }

        this.name = name.trim();
        this.website = website;
    }
}
