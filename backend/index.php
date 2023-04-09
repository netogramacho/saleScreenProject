<?php
date_default_timezone_set('America/Sao_Paulo');
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, Accept, Accept-Encoding,SECRET, TOKEN, AdminAuthorization");
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include("sqlMethods.php");
include("defaultMethods.php");

$request_uri = $_SERVER['REQUEST_URI'];
$request_path = explode('/', $request_uri)[1];
$request_method = $_SERVER["REQUEST_METHOD"];


$routes = array(
    'products-api' => 'products.php',
    'sales-api' => 'sales.php',
    'category-api' => 'category.php'
);

if (array_key_exists($request_path, $routes)) {
    $file_path = $routes[$request_path];
    include($file_path);
} else {
    http_response_code(404);
    echo 'Page not found';
}

// echo phpinfo();
?>