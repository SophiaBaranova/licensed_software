<?php

function getJsonInput() {
    $data = json_decode(file_get_contents("php://input"), true);
    if ($data === null) {
        error("Некоректний JSON", 400);
    }
    return $data;
}

function respond($data, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function error($message, $code = 400) {
    respond(["error" => $message], $code);
}

function requireAuth() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    if (!isset($_SESSION['user_id'])) {
        error("Необхідна авторизація", 401);
    }
}

function requireAdmin() {
    requireAuth();
    if ($_SESSION['role'] !== 'admin') {
        error("Недостатньо прав доступу, потрібна роль 'admin'", 403);
    }
}

?>
