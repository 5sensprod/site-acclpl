<?php
header('Content-Type: application/json; charset=utf-8');
$filename = 'js/ad.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Lire le fichier JSON
    $data = file_get_contents($filename);
    echo $data;
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Modifier le fichier JSON
    $postData = json_decode(file_get_contents('php://input'), true);

    // Lire le contenu actuel du fichier JSON
    $data = json_decode(file_get_contents($filename), true);

    // Récupérer le dernier ID existant
    $lastId = end($data['reports'])['id'];

    // Ajouter l'adresse avec un nouvel ID incrémenté
    $postData['id'] = ++$lastId;
    $data['reports'][] = $postData;

    // Écrire le contenu mis à jour dans le fichier JSON
    $updatedData = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    file_put_contents($filename, $updatedData);
    echo $updatedData;
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}