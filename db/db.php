<?php
require_once "helpers.php";

ini_set('display_errors', 0);
error_reporting(E_ALL);

mysqli_report(MYSQLI_REPORT_OFF);

$host = "localhost";
$dbname = "licensed_software";
$username = "root";
$password = "";

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    error("Не вдалося підключитися до бази даних", 500);
}

$conn->set_charset("utf8");

?>
