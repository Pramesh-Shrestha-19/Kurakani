<?php

session_start();
include("Backend\config\db.php");

$current_user = $_SESSION['user_id'];

$sql = "

SELECT
    users.user_id,
    users.name,
    users.profile_picture,
    users.status,

    MAX(messages.sent_at) AS last_message_time

FROM friends

JOIN users
ON users.user_id = friends.friend_user_id

LEFT JOIN messages
ON (
    (messages.sender_id = users.user_id
    AND messages.receiver_id = ?)

    OR

    (messages.sender_id = ?
    AND messages.receiver_id = users.user_id)
)

WHERE friends.user_id = ?

GROUP BY users.user_id

ORDER BY last_message_time DESC

";

$stmt = mysqli_prepare($conn, $sql);

mysqli_stmt_bind_param(
    $stmt,
    "iii",
    $current_user,
    $current_user,
    $current_user
);

mysqli_stmt_execute($stmt);

$result = mysqli_stmt_get_result($stmt);

$chats = [];

while($row = mysqli_fetch_assoc($result)) {
    $chats[] = $row;
}

echo json_encode($chats);

?>