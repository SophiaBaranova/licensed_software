export default class User {
    constructor({
        login,
        email,
        password,
        role = "user"
    }) {
        const loginNorm = login?.trim();
        const emailNorm = email?.trim();
        const passwordNorm = password?.trim();
        const roleNorm = role?.trim().toLowerCase();

        if (!loginNorm) { throw new Error("Логін не може бути порожнім"); }
        if (!emailNorm) { throw new Error("Email не може бути порожнім"); }

        if (!passwordNorm || passwordNorm.length < 6) {
            throw new Error("Пароль має містити щонайменше 6 символів");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailNorm)) {
            throw new Error("Email має бути коректним");
        }

        if (!["user", "admin"].includes(roleNorm)) {
            throw new Error("Роль має бути 'user' або 'admin'");
        }

        this.login = loginNorm;
        this.email = emailNorm;
        this.password = passwordNorm;
        this.role = roleNorm;
    }
}
