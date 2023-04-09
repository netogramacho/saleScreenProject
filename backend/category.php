<?php

if ($request_method === 'GET') {
    $response = get_data();
} elseif ($request_method === 'POST') {
    $response = post_data();
} elseif ($request_method === 'PUT') {
    $response = put_data();
} elseif ($request_method === 'DELETE') {
    delete_data();
} else {
    http_response_code(405);
    echo json_encode(array('error' => 'Método de requisição não suportado.'));
    exit();
}

// retorna a resposta como JSON
header('Content-Type: application/json');

echo json_encode($response);

// funções para lidar com cada método de requisição HTTP
function get_data()
{
    $prc_id = extract_id_from_url();
    if (!$prc_id) {
        $response = getAllData("SELECT 
        PRC_ID as categoryId, 
        PRC_NAME as categoryName, 
        PRC_TAX as categoryTax 
        FROM PRODUCTS_CATEGORY WHERE PRC_ACTIVE = 1");
    } else {

        $queryGet = "SELECT 
        PRC_ID as categoryId, 
        PRC_NAME as categoryName, 
        PRC_TAX as categoryTax 
        FROM PRODUCTS_CATEGORY WHERE PRC_ID = ?";
        $getParams = array(
            [
                "key" => "i",
                "value" => $prc_id
            ]
        );

        $response = getDataWithParam($queryGet, $getParams);
    }

    return $response;
}

function post_data()
{
    $data = json_decode(file_get_contents('php://input'), true);
    $name = $data["categoryName"] ?? null;
    $tax = $data["categoryTax"] ?? null;
    if (!$name || !$tax) {
        handle_error_response("Parâmetros inválidos.", 400);
        exit();
    }

    $query = "INSERT INTO PRODUCTS_CATEGORY (PRC_NAME, PRC_TAX) VALUES (?, ?)";
    $params = array(
        [
            "key" => "s",
            "value" => $name
        ],
        [
            "key" => "d",
            "value" => $tax
        ],
    );
    $execute = insertData($query, $params);
    if (!$execute["success"]) {
        handle_error_response($execute["error"], 500);
        exit();
    }

    $response = array(
        "categoryId" => $execute["insert_id"],
        "categoryName" => $name,
        "categoryTax" => $tax
    );

    return $response;
}

function put_data()
{

    $prc_id = extract_id_from_url();
    if (!$prc_id) {
        handle_error_response('Id do produto incorreto ou não informado.', 400);
        exit();
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $name = $data["categoryName"] ?? null;
    $tax = $data["categoryTax"] ?? null;
    if (!$name || !$tax) {
        handle_error_response("Parâmetros inválidos.", 400);
        exit();
    }
    $params = array(
        ["key" => "s", "value" => $name],
        ["key" => "d", "value" => $tax],
        ["key" => "i", "value" => $prc_id]
    );

    $query = "UPDATE PRODUCTS_CATEGORY SET PRC_NAME = ?, PRC_TAX = ? WHERE PRC_ID = ?";
    $execute = updateData($query, $params);

    if (!$execute["success"]) {
        handle_error_response($execute["error"], 500);
    }

    $response = array(
        "categoryId" => $prc_id,
        "categoryName" => $name,
        "categoryTax" => $tax
    );

    return $response;
}

function delete_data()
{
    $prc_id = extract_id_from_url();
    if (!$prc_id) {
        handle_error_response('Id do produto incorreto ou não informado.', 400);
        exit();
    }


    $params = [
        [
            "key" => "i",
            "value" => $prc_id
        ]
    ];

    $query = "UPDATE PRODUCTS_CATEGORY SET PRC_ACTIVE = 0 WHERE PRC_ID = ?";
    $execute = updateData($query, $params);

    if (!$execute["success"]) {
        handle_error_response($execute["error"], 500);
    } else {
        http_response_code(200);
    }
}