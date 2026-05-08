INSERT INTO categories (name, description)
VALUES
    ('Productivity', 'Інструменти для підвищення ефективності роботи та організації завдань'),
    ('Design', 'Програми для створення графіки, макетів і творчих проектів'),
    ('Security', 'Рішення для захисту даних, мереж і систем користувачів'),
    ('Education', 'Освітні додатки та навчальні платформи для студентів і викладачів'),
    ('Developer Tools', 'Інструменти для розробки, налагодження та тестування програмного забезпечення');

INSERT INTO products (
    name,
    short_description,
    extended_description,
    price,
    vendor,
    license,
    category_id,
    version,
    supported_os,
    download_url,
    image_url
)
VALUES
(
    'TaskMaster Pro',
    'Універсальний менеджер задач для команд і особистої продуктивності.',
    'TaskMaster Pro допомагає організовувати завдання, встановлювати пріоритети, відстежувати терміни й синхронізувати роботу між пристроями.',
    49.99,
    'Acme Soft',
    'Pro',
    1,
    '3.2.0',
    'Windows, macOS, Linux',
    'https://www.acmesoft.com/download/taskmaster-pro',
    '/db/upload/1.png'
),
(
    'Nimbus Studio',
    'Інтуїтивний графічний редактор для дизайнерів і маркетологів.',
    'Nimbus Studio пропонує потужні інструменти для векторної графіки, ілюстрацій та швидкого створення контенту для соцмереж.',
    79.00,
    'Nimbus Labs',
    'Business',
    2,
    '5.1.4',
    'Windows, macOS',
    'https://www.nimbuslabs.io/download/nimbus-studio',
    '/db/upload/2.png'
),
(
    'Vertex Secure',
    'Комплексне рішення для захисту мережі та приватності користувачів.',
    'Vertex Secure забезпечує шифрування, двофакторну автентифікацію й захист від зловмисних атак у режимі реального часу.',
    129.50,
    'Vertex Systems',
    'Enterprise',
    3,
    '2.9.7',
    'Windows, Linux',
    'https://www.vertexsystems.com/download/vertex-secure',
    '/db/upload/3.png'
),
(
    'BlueLearn',
    'Навчальна платформа для курсів, тестів і інтерактивних занять.',
    'BlueLearn допомагає створювати курси, контролювати прогрес студентів та автоматизувати оцінювання завдань.',
    59.00,
    'BluePeak Solutions',
    'Education',
    4,
    '4.0.2',
    'Windows, macOS, Linux',
    'https://www.bluepeak.io/download/bluelearn'
),
(
    'LunaCode',
    'Середовище розробки та інструменти для прискорення процесу програмування.',
    'LunaCode надає редактор коду, налагоджувач, API-інтеграції й шаблони для створення веб-додатків та сервісів.',
    89.99,
    'LunaWare',
    'Team',
    5,
    '1.8.3',
    'Windows, macOS, Linux',
    'https://www.lunaware.dev/download/lunacode',
    '/db/upload/4.png'
);

INSERT INTO users (login, email, password, role)
VALUES
(
    'admin',
    'admin@example.com',
    '$2y$12$sdMrlAH1O7BbsP8Qswr0vOJm6v3Sq2zfl4W8S1wDyreEpofbVmJSq', -- admin_password
    'admin'
),
(
    'user',
    'user@example.com',
    '$2y$12$GY/IW3iyQBG7r.euaTFMPe2oLNmyHIxd21.AbKuE1MuCXgqubL4rW8', -- user_password
    'user'
);
