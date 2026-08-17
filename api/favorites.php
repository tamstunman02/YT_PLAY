<?php
header('Content-Type: application/json; charset=utf-8');

$file = __DIR__ . '/../data/favorites.json';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    $payload = json_decode($raw, true);

    $liked = isset($payload['liked']) && is_array($payload['liked']) ? $payload['liked'] : [];
    $json = json_encode(['liked' => $liked], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    file_put_contents($file, $json);
    echo $json;
    exit;
}

if (!file_exists($file)) {
    echo json_encode(['liked' => []], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}

$contents = file_get_contents($file);
echo $contents ?: json_encode(['liked' => []], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
