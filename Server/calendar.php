<?php
header("Content-type: text/html; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Headers:x-requested-with,content-type');
$origin = file_get_contents("php://input");
$data = json_decode($origin, true);

if (empty($data['bid']) || empty($data['calendar'])) {
    echo "parameter error";
    exit(0);
}

$bid = $data['bid'];

$enc = sha1($bid);

if (!file_exists('./data/' . $enc)) {
    exit(0);
}

$file = fopen('./data/' . $enc . '/calendar.json', 'w');
// Save file
fwrite($file, json_encode($data['calendar']));
fclose($file);
