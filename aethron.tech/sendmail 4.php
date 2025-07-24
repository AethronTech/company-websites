<?php
// sendmail.php - Secure contact form handler for aethron.tech
// Place this file in your web root (e.g., aethron.tech/sendmail.php)

// CONFIGURATION
$recaptcha_secret = '6Lf2M4srAAAAAB1eoZpWQqwL4Vt7PK8dQF_AHmWz'; // <-- Your reCAPTCHA secret key
$recipient = 'contact@aethron.tech'; // <-- Replace with your real recipient email
$subject = 'Contact Form Submission from aethron.tech';

// 0. CORS headers for AJAX/fetch
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 1. Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// 1b. Basic rate limiting (per IP, per minute)
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rate_file = sys_get_temp_dir() . '/aethron_contact_' . md5($ip);
$now = time();
$last = (file_exists($rate_file)) ? (int)file_get_contents($rate_file) : 0;
if ($now - $last < 60) {
    http_response_code(429);
    echo json_encode(['error' => 'Too many requests. Please wait a minute.']);
    exit;
}
file_put_contents($rate_file, $now);

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
$success = mail($recipient, $subject, $body, $headers);

// 7. Detect AJAX (fetch/XHR) or normal POST
$is_ajax = isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
if (strpos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false) {
    $is_ajax = true;
}

if ($success) {
    if ($is_ajax) {
        echo json_encode(['success' => true, 'message' => 'Thank you for contacting us!']);
    } else {
        echo '<!DOCTYPE html><html><body><h2>Thank you for contacting us!</h2><p>Your message has been sent.</p></body></html>';
    }
} else {
    http_response_code(500);
    if ($is_ajax) {
        echo json_encode(['error' => 'Failed to send email. Please try again later.']);
    } else {
        echo '<!DOCTYPE html><html><body><h2>Error</h2><p>Failed to send email. Please try again later.</p></body></html>';
    }
}
?>
