<?php

function extract_id_from_url()
{
    $request_uri = $_SERVER['REQUEST_URI'];
    $parts = explode('/', $request_uri);
    $id = isset($parts[2]) ? $parts[2] : null;

    return $id;
}

function handle_error_response($error_message, $code)
{
    http_response_code($code);
    echo json_encode(['message' => $error_message]);
    exit();
}

?>