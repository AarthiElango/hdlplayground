<?php

// Enable CORS for all origins
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$input = file_get_contents('php://input');
$args  = json_decode($input, true);

if (empty($args)) {
    $args = $_POST ?? [];
}

if (empty($args['uuid']) || empty($args['design']) || empty($args['testbench']) || empty($args['username'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Missing required fields: uuid, username, design, testbench',
    ]);
    exit;
}

try {

    // Check parent directory perms
    if (!is_writable(__DIR__ . '/../hdlplayground')) {
        echo json_encode([
            'success' => false,
            'message' => 'Parent directory is not writable: ' . realpath(__DIR__ . '/../')
        ]);
        exit;
    }

    // Sanitize inputs
    $username = preg_replace('/[^a-zA-Z0-9_-]/', '', $args['username']);
    $uuid     = preg_replace('/[^a-zA-Z0-9_-]/', '', $args['uuid']);

    $dateFolder = date("Y-m-d");

    // Create directories
    $base = __DIR__ . '/../hdlplayground/' . $username . '/' . $dateFolder . '/' . $uuid;
    if (!is_dir($base)) mkdir($base, 0777, true);

    // Write design + testbench
    file_put_contents("$base/design.v", $args['design']);
    file_put_contents("$base/tb.v", $args['testbench']);

    //-----------------------------------------------------------------------
    // SAFE EXECUTION WITH TIMEOUT (NO ZOMBIES)
    //-----------------------------------------------------------------------
    $cmd = "cd " . escapeshellarg($base)
         . " && iverilog -o my_design tb.v design.v > compile.log 2> tmp_error.log"
         . " && timeout 4 vvp my_design > output.log 2>> tmp_error.log";

    $descriptors = [
        0 => ["pipe", "r"],
        1 => ["pipe", "w"],
        2 => ["pipe", "w"]
    ];

    $process = proc_open($cmd, $descriptors, $pipes);

    if (is_resource($process)) {
        // Wait max 7 seconds
        $timeout = 7;
        $start = time();

        while (true) {
            $status = proc_get_status($process);

            if (!$status['running']) break;
            if (time() - $start > $timeout) {
                proc_terminate($process, 9); // Hard kill
                break;
            }

            usleep(200000); // 0.2 sec
        }

        foreach ($pipes as $p) fclose($p);
        proc_close($process);
    }

    //-----------------------------------------------------------------------
    // CHECK ERRORS
    //-----------------------------------------------------------------------
    $errorFile = "$base/tmp_error.log";
    if (file_exists($errorFile) && filesize($errorFile) > 0) {
        rename($errorFile, "$base/error.log");
        echo json_encode([
            'success' => false,
            'uuid'    => $uuid,
            'message' => 'Compilation or simulation error',
            'error'   => file_get_contents("$base/error.log"),
        ]);
        exit;
    } else {
        @unlink($errorFile);
    }

    echo json_encode([
        'success' => true,
        'uuid'    => $uuid,
        'message' => 'Simulation completed successfully',
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error'   => $e->getMessage(),
    ]);
}
