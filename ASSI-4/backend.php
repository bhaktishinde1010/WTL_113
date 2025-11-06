<?php
header('Content-Type: application/json');

// Example user data (in real-world, fetch from MySQL database)
$users = [
    ["name" => "Alice Johnson", "email" => "alice@example.com", "role" => "Admin"],
    ["name" => "Bob Smith", "email" => "bob@example.com", "role" => "Editor"],
    ["name" => "Charlie Brown", "email" => "charlie@example.com", "role" => "Viewer"]
];

echo json_encode($users);
?>
