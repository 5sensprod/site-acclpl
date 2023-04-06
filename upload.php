<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $data = $_POST['image'];
  $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $data));
  $filename = 'uploads/' . uniqid() . '.jpg';

  if (file_put_contents($filename, $imageData)) {
    echo json_encode(['status' => 'success', 'message' => $filename]);
  } else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to upload image']);
  }
} else {
  http_response_code(405);
  echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>
