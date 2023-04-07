<?php
header('Content-Type: application/json; charset=utf-8');
// header('Content-Type: application/json');
// Récupérer les données du formulaire
$address = $_POST['address'];
$street = $_POST['street'];
$city = $_POST['city'];
$postalCode = $_POST['postal_code'];
$latitude = $_POST['latitude'];
$longitude = $_POST['longitude'];
$name = $_POST['name'];
$imageData = $_POST['photo'];

// Décoder les données de l'image
$imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $imageData));

// Générer un nom de fichier unique pour l'image
$imageFilename = 'img/uploads/' . uniqid() . '.jpg';

// Sauvegarder l'image téléchargée
if (file_put_contents($imageFilename, $imageData)) {
    // Charger les données JSON existantes
    $jsonFile = 'reports.json';
    $jsonData = json_decode(file_get_contents($jsonFile), true);

    // Générer un ID unique pour le nouveau rapport
    $reportId = end($jsonData)['id'] + 1;

    // Créer un nouveau rapport avec les données du formulaire
    $newReport = [
        'id' => $reportId,
        'street' => $street,
        'city' => $city,
        'postal_code' => $postalCode,
        'latitude' => $latitude,
        'longitude' => $longitude,
        'name' => $name,
        'image' => $imageFilename,
    ];

    // Ajouter le nouveau rapport aux données JSON existantes
    array_push($jsonData, $newReport);

    // Sauvegarder les données JSON mises à jour
    $updatedData = json_encode($jsonData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    file_put_contents($jsonFile, $updatedData);

    // Renvoyer une réponse de succès
    http_response_code(200);
    echo json_encode(['status' => 'success', 'message' => 'Report saved successfully']);
} else {
    // Renvoyer une réponse d'erreur si l'image n'a pas pu être sauvegardée
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to upload image']);
}
?>
