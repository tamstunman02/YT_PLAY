<?php
header('Content-Type: application/json; charset=utf-8');

$q = $_GET['q'] ?? '';
if (trim($q) === '') {
    echo json_encode(['items' => []]);
    exit;
}

$key = getenv('YOUTUBE_API_KEY');
if (!$key) {
    echo json_encode([
        'items' => [
            [
                'videoId' => 'dQw4w9WgXcQ',
                'title' => 'Sample YouTube Result',
                'channel' => 'Demo Channel',
                'thumbnail' => 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg'
            ]
        ]
    ]);
    exit;
}

$url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=6&q=' . urlencode($q) . '&key=' . urlencode($key);

$response = file_get_contents($url);
if ($response === false) {
    echo json_encode(['items' => []]);
    exit;
}

$data = json_decode($response, true);
$result = [];

if (isset($data['items'])) {
    foreach ($data['items'] as $item) {
        $result[] = [
            'videoId' => $item['id']['videoId'] ?? '',
            'title' => $item['snippet']['title'] ?? 'Untitled',
            'channel' => $item['snippet']['channelTitle'] ?? 'Unknown',
            'thumbnail' => $item['snippet']['thumbnails']['high']['url'] ?? ($item['snippet']['thumbnails']['default']['url'] ?? '')
        ];
    }
}

echo json_encode(['items' => $result]);
