<?php

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    http_response_code(400);
    exit("Invalid data");
}

// Database connection
$pdo = new PDO("mysql:host=localhost;dbname=tracking", "user", "pass");

// Insert
$stmt = $pdo->prepare("
INSERT INTO events 
(site_id, event, url, path, title, referrer, user_agent, visitor_id, session_id, duration)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");

$stmt->execute([
    $data['site_id'] ?? null,
    $data['event'] ?? null,
    $data['url'] ?? null,
    $data['path'] ?? null,
    $data['title'] ?? null,
    $data['referrer'] ?? null,
    $data['user_agent'] ?? null,
    $data['visitor_id'] ?? null,
    $data['session_id'] ?? null,
    $data['duration'] ?? null
]);

echo "OK";
