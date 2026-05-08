<?php

require_once "db.php";
require_once "helpers.php";

$action = $_GET['action'] ?? null;

const IMAGE_DIR = __DIR__ . "/upload/";
const IMAGE_URL_PATH = "/db/upload/";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

if (!is_dir(IMAGE_DIR)) {
    mkdir(IMAGE_DIR, 0777, true);
}

// Завантаження зображення та повернення шляху для збереження в БД
function uploadProductImage(array $file, int $productId): string
{
    if ($file['error'] !== UPLOAD_ERR_OK) {
        error("Помилка завантаження зображення", 400);
    }
    if ($file['size'] > MAX_IMAGE_SIZE) {
        error("Файл занадто великий", 400);
    }
    $imageInfo = getimagesize($file['tmp_name']);
    if ($imageInfo === false) {
        error("Файл не є зображенням", 400);
    }

    $mimeMap = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png'
    ];
    $mime = $imageInfo['mime'];
    if (!isset($mimeMap[$mime])) {
        error("Дозволені тільки JPG та PNG", 400);
    }

    $ext = $mimeMap[$mime];

    $fileName = "{$productId}.{$ext}";
    $fullPath = IMAGE_DIR . $fileName;

    if (!move_uploaded_file($file['tmp_name'], $fullPath)) {
        error("Не вдалося зберегти файл", 500);
    }

    return IMAGE_URL_PATH . $fileName;
}

switch ($action) {

    case 'getAll':
        requireAuth();

        $result = $conn->query("
            SELECT p.*, c.name AS category
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
        ");

        if (!$result) {
            error("Помилка бази даних", 500);
        }

        $products = [];
        while ($product = $result->fetch_assoc()) {
            $products[] = $product;
        }

        respond($products);
        break;

    case 'getById':
        requireAuth();
        
        $id = $_GET['id'];
        if (!$id) {
            error("Не вказано ID товару", 422);
        }

        $stmt = $conn->prepare("
            SELECT p.*, c.name AS category
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?
        ");

        $stmt->bind_param("i", $id);
        $stmt->execute();

        $product = $stmt->get_result()->fetch_assoc();

        if (!$product) {
            error("Товар не знайдено", 404);
        }

        respond($product);
        break;

    case 'create':
        requireAdmin();

        $data = $_POST;
        if (
            !isset($data['name']) ||
            !isset($data['short_description']) ||
            !isset($data['price']) ||
            !isset($data['vendor']) ||
            !isset($data['license']) ||
            !isset($data['category_id']) ||
            !isset($data['version']) ||
            !isset($data['supported_os']) ||
            !isset($data['download_url'])
        ) {
            error("Неповні дані товару", 422);
        }

        $stmt = $conn->prepare("
            INSERT INTO products
            (name, short_description, extended_description, price, vendor, license,
             category_id, version, supported_os, download_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");

        $stmt->bind_param(
            "sssdssisss",
            $data['name'],
            $data['short_description'],
            $data['extended_description'],
            $data['price'],
            $data['vendor'],
            $data['license'],
            $data['category_id'],
            $data['version'],
            $data['supported_os'],
            $data['download_url']
        );

        if (!$stmt->execute()) {
            error("Не вдалося створити товар", 500);
        }

        $productId = $conn->insert_id;
        $imagePath = null;

        if (!empty($_FILES['image']) &&
            $_FILES['image']['error'] !== UPLOAD_ERR_NO_FILE) {

            $imagePath = uploadProductImage($_FILES['image'], $productId);

            $stmt = $conn->prepare("
                UPDATE products
                SET image_url = ?
                WHERE id = ?
            ");

            $stmt->bind_param("si", $imagePath, $productId);
            $stmt->execute();
        }

        respond(["status" => "created"], 201);
        break;

    case 'update':
        requireAdmin();

        $data = $_POST;
        if (
            !isset($data['id']) ||
            !isset($data['name']) ||
            !isset($data['short_description']) ||
            !isset($data['price']) ||
            !isset($data['vendor']) ||
            !isset($data['license']) ||
            !isset($data['category_id']) ||
            !isset($data['version']) ||
            !isset($data['supported_os']) ||
            !isset($data['download_url'])
        ) {
            error("Неповні дані товару", 422);
        }

        $id = $data['id'];

        // Отримання існуючого зображення
        $stmt = $conn->prepare("
            SELECT image_url
            FROM products
            WHERE id = ?
        ");

        $stmt->bind_param("i", $id);
        $stmt->execute();

        $product = $stmt->get_result()->fetch_assoc();

        if (!$product) {
            error("Товар не знайдено", 404);
        }

        $imagePath = $product['image_url'];

        // Оновлення зображення, якщо нове завантажено
        if (!empty($_FILES['image']) &&
            $_FILES['image']['error'] !== UPLOAD_ERR_NO_FILE) {

            // Видалення старого зображення
            if (!empty($imagePath)) {
                $oldPath = IMAGE_DIR . basename($imagePath);
                if (file_exists($oldPath)) {
                    unlink($oldPath);
                }
            }

            // Завантаження нового зображення
            $imagePath = uploadProductImage($_FILES['image'], $id);
        }

        $stmt = $conn->prepare("
            UPDATE products
            SET name = ?,
                short_description = ?,
                extended_description = ?,
                price = ?,
                vendor = ?,
                license = ?,
                category_id = ?,
                version = ?,
                supported_os = ?,
                download_url = ?,
                image_url = ?
            WHERE id = ?
        ");

        $stmt->bind_param(
            "sssdssissssi",
            $data['name'],
            $data['short_description'],
            $data['extended_description'],
            $data['price'],
            $data['vendor'],
            $data['license'],
            $data['category_id'],
            $data['version'],
            $data['supported_os'],
            $data['download_url'],
            $imagePath,
            $id
        );

        if (!$stmt->execute()) {
            error("Не вдалося оновити товар", 500);
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
            error("Не вказано ID товару", 422);
        }

        // Отримання існуючого зображення
        $stmt = $conn->prepare("
            SELECT image_url
            FROM products
            WHERE id = ?
        ");

        $stmt->bind_param("i", $id);
        $stmt->execute();

        $product = $stmt->get_result()->fetch_assoc();

        if (!$product) {
            error("Товар не знайдено", 404);
        }

        // Видалення зображення, якщо воно існує
        if (!empty($product['image_url'])) {
            $file = IMAGE_DIR . basename($product['image_url']);

            if (file_exists($file)) {
                unlink($file);
            }
        }

        $stmt = $conn->prepare("
            DELETE FROM products
            WHERE id = ?
        ");

        $stmt->bind_param("i", $id);

        if (!$stmt->execute()) {
            error("Не вдалося видалити товар", 500);
        }

        respond(["status" => "deleted"]);
        break;

    default:
        error("Заборонена дія", 400);
}

?>
