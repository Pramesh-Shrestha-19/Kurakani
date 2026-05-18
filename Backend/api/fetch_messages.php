<?php

session_start();
include("Backend\config\db.php");

$current_user = $_SESSION['user_id'];
$chat_user = $_GET['chat_user'];


/* ─────────────────────────────
   1. MARK MESSAGES AS SEEN
───────────────────────────── */

$seen_sql = "
UPDATE messages

SET
seen_status = 1,
seen_at = NOW()

WHERE
receiver_id = ?
AND sender_id = ?
AND seen_status = 0
";

$seen_stmt = mysqli_prepare($conn, $seen_sql);

mysqli_stmt_bind_param(
    $seen_stmt,
    "ii",
    $current_user,
    $chat_user
);

mysqli_stmt_execute($seen_stmt);


/* ─────────────────────────────
   2. FETCH CHAT MESSAGES
───────────────────────────── */

$sql = "
SELECT * FROM messages

WHERE
(sender_id = ? AND receiver_id = ?)

OR

(sender_id = ? AND receiver_id = ?)

ORDER BY sent_at ASC
";

$stmt = mysqli_prepare($conn, $sql);

mysqli_stmt_bind_param(
    $stmt,
    "iiii",
    $current_user,
    $chat_user,
    $chat_user,
    $current_user
);

mysqli_stmt_execute($stmt);

$result = mysqli_stmt_get_result($stmt);

$messages = [];

while($row = mysqli_fetch_assoc($result)) {
    $messages[] = $row;
}

echo json_encode($messages);

?>