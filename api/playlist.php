<?php
header('Content-Type: application/json; charset=utf-8');

$file = __DIR__ . '/../data/playlist.json';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    $payload = json_decode($raw, true);

    if (!isset($payload['tracks']) || !is_array($payload['tracks'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid playlist payload']);
        exit;
    }

    $json = json_encode(['tracks' => $payload['tracks']], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    file_put_contents($file, $json);

    echo $json;
    exit;
}

if (!file_exists($file)) {
    echo json_encode(['tracks' => []], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}

$contents = file_get_contents($file);
echo $contents ?: json_encode(['tracks' => []], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
