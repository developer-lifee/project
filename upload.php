<?php
header('Content-Type: application/json');

// Define target directory
$target_dir = __DIR__ . "/";

// Check if file was uploaded
if (!isset($_FILES['uploadedFile'])) {
    http_response_code(400);
    echo json_encode(['error' => 'No file uploaded']);
    exit;
}

$uploadedFile = $_FILES['uploadedFile'];
$fileName = basename($uploadedFile['name']);
$target_file = $target_dir . $fileName;
$uploadOk = 1;
$imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

// Check if image file is a actual image
if (isset($_POST["submit"])) {
    $check = getimagesize($uploadedFile["tmp_name"]);
    if ($check === false) {
        http_response_code(400);
        echo json_encode(['error' => 'File is not an image']);
        exit;
    }
}

// Check file size (limit to 5MB)
if ($uploadedFile["size"] > 5000000) {
    http_response_code(400);
    echo json_encode(['error' => 'File is too large']);
    exit;
}

// Allow certain file formats
if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg") {
    http_response_code(400);
    echo json_encode(['error' => 'Only JPG, JPEG & PNG files are allowed']);
    exit;
}

// Try to upload the file
if (move_uploaded_file($uploadedFile["tmp_name"], $target_file)) {
    echo json_encode([
        'success' => true,
        'message' => 'The file ' . htmlspecialchars($fileName) . ' has been uploaded.',
        'path' => $fileName
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'error' => 'There was an error uploading your file.',
        'details' => error_get_last()
    ]);
}
?>
