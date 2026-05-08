export default class Category {
    constructor({
        id = null,
        name,
        description
    }) {
        const nameNorm = name?.trim();
        const descriptionNorm = description?.trim() || null;

        if (!nameNorm) throw new Error("Назва не може бути порожньою");

        if (id !== null ) {
            const idNorm = Number(id);
            if (!Number.isInteger(idNorm) || idNorm <= 0) {
                throw new Error("ID повинен бути цілим додатним числом");
            }
            this.id = idNorm;
        }

        this.name = nameNorm;
        this.description = descriptionNorm;
    }
}
