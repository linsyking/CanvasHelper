<?php
header("Content-type: text/html; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Headers:x-requested-with,content-type');
$origin = file_get_contents("php://input");
$data = json_decode($origin, true);

if (empty($data['bid'])) {
    echo "bid error";
    exit(0);
}

$bid = $data['bid'];
$enc = sha1($bid);

if (file_exists('./data/' . $enc . '/cache.json')) {
    echo file_get_contents('./data/' . $enc . '/cache.json');
}else{
    echo "no";
}

