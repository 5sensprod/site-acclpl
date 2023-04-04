<?php
header('Content-Type: application/json');
$filename = 'js/adresses.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Lire le fichier JSON
    $data = file_get_contents($filename);
    if ($data === false) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to read the JSON file']);
    } else {
        echo $data;
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Modifier le fichier JSON
    $postData = json_decode(file_get_contents('php://input'), true);
    $data = json_encode($postData, JSON_PRETTY_PRINT);
    $result = file_put_contents($filename, $data);
    if ($result === false) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to write the JSON file']);
    } else {
        echo $data;
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}