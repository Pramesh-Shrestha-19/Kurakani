<?php

session_start();
include("Backend\config\db.php");

$sender_id = $_SESSION['user_id'];

$receiver_id = $_POST['receiver_id'];
$message = $_POST['message'];

$sql = "INSERT INTO messages
(sender_id, receiver_id, message_content)
VALUES (?, ?, ?)";

$stmt = mysqli_prepare($conn, $sql);

mysqli_stmt_bind_param(
    $stmt,
    "iis",
    $sender_id,
    $receiver_id,
    $message
);

mysqli_stmt_execute($stmt);

echo "success";
?>