export default class Category {
    constructor(
        id,
        name,
        description
    ) {
        if (id !== null && (!Number.isInteger(id) || id <= 0)) {
            throw new Error("ID повинен бути цілим додатним числом");
        }
        
        if (!name?.trim()) {
            throw new Error("Назва не може бути порожньою");
        }

        this.name = name.trim();
        this.description = description.trim() || null;
    }
}
