<?php
header("Content-Type: application/json");

error_reporting(E_ALL);
ini_set('display_errors', 1);

include(__DIR__ . "/../config/db.php");
session_start();

$sender_id = $_SESSION['user_id'] ?? 1;

$receiver_id = $_POST['receiver_id'] ?? null;
$message = $_POST['message'] ?? null;

if (!$receiver_id || !$message) {
    echo json_encode([
        "success" => false,
        "message" => "Missing data"
    ]);
    exit;
}

$sql = "INSERT INTO messages 
        (sender_id, receiver_id, message_content, message_type, seen_status)
        VALUES (?, ?, ?, 'text', 0)";

$stmt = mysqli_prepare($conn, $sql);

if (!$stmt) {
    echo json_encode([
        "success" => false,
        "message" => mysqli_error($conn)
    ]);
    exit;
}

mysqli_stmt_bind_param($stmt, "iis", $sender_id, $receiver_id, $message);

$ok = mysqli_stmt_execute($stmt);

echo json_encode([
    "success" => $ok,
    "debug" => $ok ? "inserted" : mysqli_error($conn)
]);
?>