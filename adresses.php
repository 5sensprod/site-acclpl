<?php
header('Content-Type: application/json');
$filename = 'js/adresses.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Lire le fichier JSON
    $data = file_get_contents($filename);
    echo $data;
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Modifier le fichier JSON
    $postData = json_decode(file_get_contents('php://input'), true);
    $data = json_encode($postData, JSON_PRETTY_PRINT);
    file_put_contents($filename, $data);
    echo $data;
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}