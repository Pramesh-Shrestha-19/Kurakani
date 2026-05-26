<?php
header("Content-Type: application/json");

error_reporting(0);
ini_set('display_errors', 0);

include(__DIR__ . "/../config/db.php");

$chat_user = $_GET['chat_user'] ?? null;

if (!$chat_user) {
    echo json_encode([]);
    exit;
}

$sql = "SELECT * 
        FROM messages 
        WHERE sender_id = ? OR receiver_id = ?
        ORDER BY message_id ASC";

$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "ii", $chat_user, $chat_user);
mysqli_stmt_execute($stmt);

$result = mysqli_stmt_get_result($stmt);

$messages = [];

while ($row = mysqli_fetch_assoc($result)) {
    $messages[] = $row;
}

echo json_encode($messages);
?>