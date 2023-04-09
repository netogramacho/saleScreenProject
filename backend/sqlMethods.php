<?php

function connect()
{
    $host = '';
    $user = '';
    $pass = '';
    $db = '';

    $con = mysqlI_connect($host, $user, $pass, $db);

    return $con;
}

function getAllData($query)
{

    $con = connect();

    $result = $con->query($query);
    $response = array();
    while ($row = $result->fetch_assoc()) {
        array_push($response, $row);
    }

    return $response;
}

function insertData($query, $params)
{
    $con = connect();

    $stmt = $con->prepare($query);

    $types = "";
    $values = [];
    foreach ($params as $param) {
        $types .= $param["key"];
        array_push($values, $param["value"]);
    }

    if (!$stmt) {
        die('Erro ao preparar o statement: ' . $con->error);
    }

    $stmt->bind_param($types, ...$values);

    $exec = $stmt->execute();

    if ($exec === true) {
        return array(
            "success" => true,
            "insert_id" => $stmt->insert_id
        );
    } else {
        return array(
            "success" => false,
            "error" => $stmt->error
        );
    }
}

function updateData($query, $params)
{
    $con = connect();

    $stmt = $con->prepare($query);

    $types = "";
    $values = [];
    foreach ($params as $param) {
        $types .= $param["key"];
        array_push($values, $param["value"]);
    }

    $stmt->bind_param($types, ...$values);

    $exec = $stmt->execute();

    if ($exec === true) {
        return array(
            "success" => true
        );
    } else {
        return array(
            "success" => false,
            "error" => $stmt->error
        );
    }
}

function getDataWithParam($query, $params)
{
    $con = connect();

    $stmt = $con->prepare($query);
    $types = "";
    $values = [];
    foreach ($params as $param) {
        $types .= $param["key"];
        array_push($values, $param["value"]);
    }

    $stmt->bind_param($types, ...$values);

    $stmt->execute();
    $result = $stmt->get_result();
    $response = array();
    while ($row = $result->fetch_assoc()) {
        array_push($response, $row);
    }

    return $response;
}

function insertSales($query, $objects, $saleId)
{
    $con = connect();
    foreach ($objects as $obj) {
        $stmt = $con->prepare($query);
        $values = array(&$obj["product"]["productId"], &$saleId, &$obj["quantity"]);
        call_user_func_array(array($stmt, 'bind_param'), array_merge(array(str_repeat('i', count($values))), $values));
        $exec = $stmt->execute();
    }

    return $exec;
}
function disconnect($con)
{
    mysqli_close($con);
}

?>