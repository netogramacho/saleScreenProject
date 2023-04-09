<?php

if ($request_method === 'GET') {
    $response = get_data();
} elseif ($request_method === 'POST') {
    $response = post_data();
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

    $sales = getAllData("SELECT 
        SAL_ID as saleId,
        SAL_DATE as saleDate,
        SAL_TOTAL as saleTotal,
        SAL_TAX as saleTax 
        FROM SALES");

    $response = array();
    foreach($sales as $sale) {
        // TODO LOAD PRODUCTS
        $sale["saleProducts"] = [];
        array_push($response, $sale);
    }

    return $response;
}

function post_data()
{
    $data = json_decode(file_get_contents('php://input'), true);
    $products = $data["saleProducts"] ?? null;
    $tax = $data["saleTax"] ?? null;
    $total = $data["saleTotal"] ?? null;
    if (!$products || !$tax || !$total) {
        handle_error_response("Parâmetros inválidos.", 400);
        exit();
    }

    $query = "INSERT INTO SALES (SAL_TOTAL, SAL_TAX) VALUES (?, ?)";

    $params = array(
        [
            "key" => "d",
            "value" => $total
        ],
        [
            "key" => "d",
            "value" => $tax
        ]
    );

    $execute = insertData($query, $params);

    $querySXP = "INSERT INTO SALE_PRODUCTS (PRO_ID, SAL_ID, SXP_QUANTITY) VALUES (?, ?, ?)";

    $executeSXP = insertSales($querySXP, $products, $execute["insert_id"]);
    if (!$execute["success"] or !$executeSXP) {
        handle_error_response($execute["error"], 500);
        exit();
    }

    $response = array(
        "saleProducts" => $products,
        "saleId" => $execute["insert_id"],
        "saleTotal" => $total,
        "saleTax" => $tax
    );

    return $response;
}