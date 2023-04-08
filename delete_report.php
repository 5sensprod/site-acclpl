<?php
header('Content-Type: application/json; charset=utf-8');

// Récupérer l'ID du rapport à supprimer
$data = json_decode(file_get_contents('php://input'), true);
$reportId = $data['id'];

// Charger les données JSON existantes
$jsonFile = 'reports.json';
$jsonData = json_decode(file_get_contents($jsonFile), true);

// Rechercher et supprimer le rapport
$reportIndex = array_search($reportId, array_column($jsonData, 'id'));
if ($reportIndex !== false) {
    $report = $jsonData[$reportIndex];
    unlink($report['image']); // Supprimer l'image associée
    array_splice($jsonData, $reportIndex, 1);

    // Sauvegarder les données JSON mises à jour
    $updatedData = json_encode($jsonData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    file_put_contents($jsonFile, $updatedData);

    // Renvoyer une réponse de succès
    http_response_code(200);
    echo json_encode(['status' => 'success', 'message' => 'Report deleted successfully']);
} else {
    // Renvoyer une réponse d'erreur si le rapport n'a pas été trouvé
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Report not found']);
}
?>
