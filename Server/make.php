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

if (empty($data['url'])) {
    echo "url error";
    exit(0);
}

$bid = $data['bid'];
$cs = $data['courses'];

if (!preg_match("#^[a-zA-Z0-9]+$#", $bid)) {
    echo "invalid bid";
    exit(0);
}

$enc = sha1($bid);

if (!file_exists('./data/' . $enc)) {
    mkdir('./data/' . $enc);
}

$data['bid']=$enc;

$file = fopen('./data/' . $enc . '/c.json', 'w');
fwrite($file, json_encode($data));
fclose($file);

$command = "python3 canvas_online.py \"" . $bid . "\"";

$dres = shell_exec($command);

echo $dres;
