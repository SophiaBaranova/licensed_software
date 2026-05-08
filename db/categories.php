<?php
require_once "db.php";
require_once "helpers.php";

$action = $_GET['action'] ?? null;

switch ($action) {

    case 'getAll':
        requireAuth();

        $result = $conn->query("SELECT * FROM categories");

        if (!$result) {
            error("Помилка бази даних", 500);
        }

        $categories = [];
        while ($category = $result->fetch_assoc()) {
            $categories[] = $category;
        }

        respond($categories);
        break;

    case 'create':
        requireAdmin();

        $data = getJsonInput();
        if (
            !isset($data['name'])
        ) {
            error("Неповні дані категорії", 422);
        }

        $stmt = $conn->prepare("
            INSERT INTO categories (name, description)
            VALUES (?, ?)
        ");

        $stmt->bind_param(
            "ss",
            $data['name'],
            $data['description']
        );

        if (!$stmt->execute()) {
            error("Не вдалося створити категорію", 500);
        }

        respond(["status" => "created"], 201);
        break;

    case 'update':
        requireAdmin();

        $data = getJsonInput();
        if (
            !isset($data['id']) ||
            !isset($data['name']) ||
            !isset($data['description'])
        ) {
            error("Неповні дані категорії", 422);
        }

        $stmt = $conn->prepare("
            UPDATE categories
            SET name = ?, description = ?
            WHERE id = ?
        ");

        $stmt->bind_param(
            "ssi",
            $data['name'],
            $data['description'],
            $data['id']
        );

        if (!$stmt->execute()) {
            error("Не вдалося оновити категорію", 500);
        }

        if ($stmt->affected_rows === 0) {
            error("Категорію не знайдено або зміни не було внесено", 404);
        }

        respond([
            "status" => "updated",
            "affected_rows" => $stmt->affected_rows
        ]);
        break;

    case 'delete':
        requireAdmin();

        $id = $_GET['id'];
        if (!$id) {
            error("Не вказано ID категорії", 422);
        }

        $stmt = $conn->prepare("DELETE FROM categories WHERE id = ?");
        $stmt->bind_param("i", $id);

        if (!$stmt->execute()) {
            error("Не вдалося видалити категорію", 500);
        }

        if ($stmt->affected_rows === 0) {
            error("Категорію не знайдено", 404);
        }

        respond(["status" => "deleted"]);
        break;

    default:
        error("Заборонена дія", 400);
}

?>
