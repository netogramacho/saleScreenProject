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
    $pro_id = extract_id_from_url();
    if (!$pro_id) {
        $products = getAllData("SELECT 
        prc.PRC_ID as categoryId, 
        prc.PRC_NAME as categoryName, 
        prc.PRC_TAX as categoryTax, 
        pro.PRO_ID as productId,
        pro.PRO_NAME as productName, 
        pro.PRO_DESCRIPTION as productDescription, 
        pro.PRO_PRICE as productPrice  FROM PRODUCTS pro JOIN PRODUCTS_CATEGORY prc ON pro.PRC_ID = prc.PRC_ID WHERE PRO_ACTIVE = 1");

    } else {

        $queryGet = "SELECT 
        prc.PRC_ID as categoryId, 
        prc.PRC_NAME as categoryName, 
        prc.PRC_TAX as categoryTax, 
        pro.PRO_ID as productId,
        pro.PRO_NAME as productName, 
        pro.PRO_DESCRIPTION as productDescription, 
        pro.PRO_PRICE as productPrice 
        FROM PRODUCTS pro JOIN PRODUCTS_CATEGORY prc ON pro.PRC_ID = prc.PRC_ID WHERE PRO_ID = ?";
        $getParams = array(
            [
                "key" => "i",
                "value" => $pro_id
            ]
        );

        $products = getDataWithParam($queryGet, $getParams);
    }
    $response = array();
    foreach ($products as $product) {
        $product["taxValue"] = $product["productPrice"] * $product["categoryTax"];
        array_push($response, $product);
    }

    return $response;
}

function post_data()
{
    $data = json_decode(file_get_contents('php://input'), true);
    $name = $data["productName"] ?? null;
    $prc_id = $data["categoryId"] ?? null;
    $description = $data["productDescription"] ?? null;
    $price = $data["productPrice"] ?? null;
    if (!$name || !$prc_id || !$description || !$price) {
        handle_error_response("Parâmetros inválidos.", 400);
        exit();
    }

    $query = "INSERT INTO PRODUCTS (PRC_ID, PRO_NAME, PRO_DESCRIPTION, PRO_PRICE) VALUES (?, ?, ?, ?)";
    $params = array(
        [
            "key" => "i",
            "value" => $prc_id
        ],
        [
            "key" => "s",
            "value" => $name
        ],
        [
            "key" => "s",
            "value" => $description
        ],
        [
            "key" => "d",
            "value" => $price
        ],
    );

    $execute = insertData($query, $params);
    if (!$execute["success"]) {
        handle_error_response($execute["error"], 500);
        exit();
    }

    $queryGet = "SELECT 
        prc.PRC_ID as categoryId, 
        prc.PRC_NAME as categoryName, 
        prc.PRC_TAX as categoryTax, 
        pro.PRO_ID as productId,
        pro.PRO_NAME as productName, 
        pro.PRO_DESCRIPTION as productDescription, 
        pro.PRO_PRICE as productPrice 
        FROM PRODUCTS pro JOIN PRODUCTS_CATEGORY prc ON pro.PRC_ID = prc.PRC_ID WHERE PRO_ID = ?";

    $getParams = array(
        [
            "key" => "i",
            "value" => $execute["insert_id"]
        ]
    );
    $products = getDataWithParam($queryGet, $getParams);

    $response = array();
    foreach ($products as $product) {
        $product["taxValue"] = $product["productPrice"] * $product["categoryTax"];
        array_push($response, $product);
    }

    $products = getDataWithParam($queryGet, $getParams);

    return $response;
}

function put_data()
{
    $pro_id = extract_id_from_url();
    if (!$pro_id) {
        handle_error_response('Id do produto incorreto ou não informado.', 400);
        exit();
    }


    $data = json_decode(file_get_contents('php://input'), true);
    $name = $data["productName"] ?? null;
    $prc_id = $data["categoryId"] ?? null;
    $description = $data["productDescription"] ?? null;
    $price = $data["productPrice"] ?? null;
    if (!$name || !$prc_id || !$description || !$price) {
        handle_error_response("Parâmetros inválidos.", 400);
        exit();
    }
    $params = array(
        ["key" => "s", "value" => $name],
        ["key" => "i", "value" => $prc_id],
        ["key" => "s", "value" => $description],
        ["key" => "d", "value" => $price],
        ["key" => "i", "value" => $pro_id]
    );

    $query = "UPDATE PRODUCTS SET PRO_NAME = ?, PRC_ID = ?, PRO_DESCRIPTION = ?, PRO_PRICE = ? WHERE PRO_ID = ?";
    $execute = updateData($query, $params);

    if (!$execute["success"]) {
        handle_error_response($execute["error"], 500);
    }

    $queryGet = "SELECT 
        prc.PRC_ID as categoryId, 
        prc.PRC_NAME as categoryName, 
        prc.PRC_TAX as categoryTax, 
        pro.PRO_ID as productId,
        pro.PRO_NAME as productName, 
        pro.PRO_DESCRIPTION as productDescription, 
        pro.PRO_PRICE as productPrice 
        FROM PRODUCTS pro JOIN PRODUCTS_CATEGORY prc ON pro.PRC_ID = prc.PRC_ID WHERE PRO_ID = ?";

    $getParams = array(
        [
            "key" => "i",
            "value" => $pro_id
        ]
    );
    $products = getDataWithParam($queryGet, $getParams);

    $response = array();
    foreach ($products as $product) {
        $product["taxValue"] = $product["productPrice"] * $product["categoryTax"];
        array_push($response, $product);
    }

    $products = getDataWithParam($queryGet, $getParams);

    return $response;
}

function delete_data()
{
    $pro_id = extract_id_from_url();
    if (!$pro_id) {
        handle_error_response('Id do produto incorreto ou não informado.', 400);
        exit();
    }


    $params = [
        [
            "key" => "i",
            "value" => $pro_id
        ]
    ];

    $query = "UPDATE PRODUCTS SET PRO_ACTIVE = 0 WHERE PRO_ID = ?";
    $execute = updateData($query, $params);

    if (!$execute["success"]) {
        handle_error_response($execute["error"], 500);
    } else {
        http_response_code(200);
    }
}

?>