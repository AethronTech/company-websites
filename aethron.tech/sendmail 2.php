<?php
// sendmail.php - Secure contact form handler for aethron.tech
// Place this file in your web root (e.g., aethron.tech/sendmail.php)

// CONFIGURATION
$recaptcha_secret = 'YOUR_RECAPTCHA_SECRET_KEY'; // <-- Replace with your secret key
$recipient = 'contact@aethron.tech'; // <-- Replace with your real recipient email
$subject = 'Contact Form Submission from aethron.tech';

// 1. Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// 2. Get and sanitize input
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');
$recaptcha_token = $_POST['g-recaptcha-response'] ?? '';

// 3. Validate input
if (!$name || !$email || !$message || !$recaptcha_token) {
    http_response_code(400);
    echo json_encode(['error' => 'All fields are required.']);
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address.']);
    exit;
}

// 4. Verify reCAPTCHA
$recaptcha_url = 'https://www.google.com/recaptcha/api/siteverify';
$recaptcha_response = file_get_contents($recaptcha_url . '?secret=' . urlencode($recaptcha_secret) . '&response=' . urlencode($recaptcha_token));
$recaptcha_data = json_decode($recaptcha_response, true);
if (!$recaptcha_data['success'] || $recaptcha_data['score'] < 0.5) {
    http_response_code(403);
    echo json_encode(['error' => 'reCAPTCHA verification failed.']);
    exit;
}

// 5. Prepare email
$headers = "From: noreply@aethron.tech\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$body = "Name: $name\nEmail: $email\nMessage:\n$message\n";

// 6. Send email
if (mail($recipient, $subject, $body, $headers)) {
    echo json_encode(['success' => true, 'message' => 'Thank you for contacting us!']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send email. Please try again later.']);
}
?>
