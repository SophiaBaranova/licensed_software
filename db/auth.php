<?php

require_once "db.php";
require_once "helpers.php";

session_start();

$action = $_GET['action'] ?? null;

switch ($action) {

    case 'login':

        $data = getJsonInput();

        $stmt = $conn->prepare("
            SELECT *
            FROM users
            WHERE login = ?
        ");

        $stmt->bind_param("s", $data['login']);

        if (!$stmt->execute()) {
            error("Помилка бази даних", 500);
        }

        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        // Перевірка користувача та пароля
        if (
            !$user ||
            !password_verify($data['password'], $user['password'])
        ) {
            error("Неправильні облікові дані", 401);
        }

        // Захист від session fixation
        session_regenerate_id(true);

        // Збереження даних користувача у сесії
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['role'] = $user['role'];

        respond([
            "authenticated" => true,
            "user" => [
                "id" => $user['id'],
                "role" => $user['role']
            ]
        ]);

        break;

    case 'logout':

        $_SESSION = [];

        // Видалення cookie сесії
        if (ini_get("session.use_cookies")) {

            $params = session_get_cookie_params();

            setcookie(
                session_name(),
                '',
                time() - 42000,
                $params["path"],
                $params["domain"],
                $params["secure"],
                $params["httponly"]
            );
        }

        session_destroy();

        respond([
            "authenticated" => false
        ]);

        break;

    // Перевірка активної сесії
    case 'me':

        if (!isset($_SESSION['user_id'])) {
            respond([
                "authenticated" => false
            ]);
        }

        respond([
            "authenticated" => true,
            "user" => [
                "id" => $_SESSION['user_id'],
                "role" => $_SESSION['role']
            ]
        ]);

        break;

    default:
        error("Заборонена дія", 400);
}

?>
