export default class User {
    constructor(
        login,
        email,
        password,
        role
    ) {
        if (!login?.trim()) {
            throw new Error("Логін не може бути порожнім");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error("Email має бути коректним");
        }

        if (!password || password.length < 6) {
            throw new Error("Пароль має містити щонайменше 6 символів");
        }

        this.login = login.trim();
        this.email = email;
        this.password = password;
        this.role = "USER";
    }
}
