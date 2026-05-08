<?php
require_once "db.php";
require_once "helpers.php";

$action = $_GET['action'] ?? null;

switch ($action) {

    case 'create':
        $data = getJsonInput();
        if (
            !isset($data['login']) ||
            !isset($data['email']) ||
            !isset($data['password']) ||
            !isset($data['role'])
        ) {
            error("Неповні дані користувача", 422);
        }

        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

        $stmt = $conn->prepare("
            INSERT INTO users (login, email, password, role)
            VALUES (?, ?, ?, ?)
        ");

        $stmt->bind_param(
            "ssss",
            $data['login'],
            $data['email'],
            $hashedPassword,
            $data['role']
        );

        if (!$stmt->execute()) {
            error("Не вдалося створити користувача", 500);
        }

        respond(["status" => "created"], 201);
        break;

    case 'checkLoginUnique':
        $login = $_GET['login'];
        if (!$login) {
            error("Не вказано логін", 422);
        }

        $stmt = $conn->prepare("
            SELECT id
            FROM users
            WHERE login = ?
        ");

        $stmt->bind_param("s", $login);
        $stmt->execute();

        $result = $stmt->get_result();

        respond([
            "unique" => $result->num_rows === 0
        ]);
        break;

    default:
        error("Заборонена дія", 400);
}

?>
