export default class Category {
    constructor(
        name,
        description
    ) {
        if (!name?.trim()) {
            throw new Error("Назва не може бути порожньою");
        }

        this.name = name.trim();
        this.description = description;
    }
}
