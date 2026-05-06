export const vendors = [
    {
        name: "Acme Soft",
        website: "https://www.acmesoft.com"
    },
    {
        name: "Nimbus Labs",
        website: "https://www.nimbuslabs.io"
    },
    {
        name: "Vertex Systems",
        website: "https://www.vertexsystems.com"
    },
    {
        name: "BluePeak Solutions",
        website: "https://www.bluepeak.io"
    },
    {
        name: "LunaWare",
        website: "https://www.lunaware.dev"
    }
];

export const categories = [
    {
        name: "Productivity",
        description: "Інструменти для підвищення ефективності роботи та організації завдань"
    },
    {
        name: "Design",
        description: "Програми для створення графіки, макетів і творчих проектів"
    },
    {
        name: "Security",
        description: "Рішення для захисту даних, мереж і систем користувачів"
    },
    {
        name: "Education",
        description: "Освітні додатки та навчальні платформи для студентів і викладачів"
    },
    {
        name: "Developer Tools",
        description: "Інструменти для розробки, налагодження та тестування програмного забезпечення"
    }
];

export const products = [
    {
        id: 1,
        name: "TaskMaster Pro",
        short_description: "Універсальний менеджер задач для команд і особистої продуктивності.",
        extended_description: "TaskMaster Pro допомагає організовувати завдання, встановлювати пріоритети, відстежувати терміни й синхронізувати роботу між пристроями.",
        price: 49.99,
        vendor: "Acme Soft",
        license: "Pro",
        category: "Productivity",
        version: "3.2.0",
        supported_os: "Windows, macOS, Linux",
        download_url: "https://www.acmesoft.com/download/taskmaster-pro",
        image_url: "https://placehold.co/400x280/2563eb/ffffff?text=TaskMaster+Pro&font=roboto"
    },
    {
        id: 2,
        name: "Nimbus Studio",
        short_description: "Інтуїтивний графічний редактор для дизайнерів і маркетологів.",
        extended_description: "Nimbus Studio пропонує потужні інструменти для векторної графіки, ілюстрацій та швидкого створення контенту для соцмереж.",
        price: 79.0,
        vendor: "Nimbus Labs",
        license: "Business",
        category: "Design",
        version: "5.1.4",
        supported_os: "Windows, macOS",
        download_url: "https://www.nimbuslabs.io/download/nimbus-studio",
        image_url: "https://placehold.co/400x280/2563eb/ffffff?text=Nimbus+Studio&font=roboto"
    },
    {
        id: 3,
        name: "Vertex Secure",
        short_description: "Комплексне рішення для захисту мережі та приватності користувачів.",
        extended_description: "Vertex Secure забезпечує шифрування, двофакторну автентифікацію й захист від зловмисних атак у режимі реального часу.",
        price: 129.5,
        vendor: "Vertex Systems",
        license: "Enterprise",
        category: "Security",
        version: "2.9.7",
        supported_os: "Windows, Linux",
        download_url: "https://www.vertexsystems.com/download/vertex-secure",
        image_url: "https://placehold.co/400x280/2563eb/ffffff?text=Vertex+Secure&font=roboto"
    },
    {
        id: 4,
        name: "BlueLearn",
        short_description: "Навчальна платформа для курсів, тестів і інтерактивних занять.",
        extended_description: "BlueLearn допомагає створювати курси, контролювати прогрес студентів та автоматизувати оцінювання завдань.",
        price: 59.0,
        vendor: "BluePeak Solutions",
        license: "Education",
        category: "Education",
        version: "4.0.2",
        supported_os: "Windows, macOS, Linux",
        download_url: "https://www.bluepeak.io/download/bluelearn",
        image_url: "https://placehold.co/400x280/2563eb/ffffff?text=BlueLearn&font=roboto"
    },
    {
        id: 5,
        name: "LunaCode",
        short_description: "Середовище розробки та інструменти для прискорення процесу програмування.",
        extended_description: "LunaCode надає редактор коду, налагоджувач, API-інтеграції й шаблони для створення веб-додатків та сервісів.",
        price: 89.99,
        vendor: "LunaWare",
        license: "Team",
        category: "Developer Tools",
        version: "1.8.3",
        supported_os: "Windows, macOS, Linux",
        download_url: "https://www.lunaware.dev/download/lunacode",
        image_url: "https://placehold.co/400x280/2563eb/ffffff?text=LunaCode&font=roboto"
    }
];

export default {
    vendors,
    categories,
    products
};
