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

if (empty($data['check'])) {
    echo "check error";
    exit(0);
}

if (empty($data['action'])) {
    echo "action error";
    exit(0);
}

$bid = $data['bid'];
$cs = $data['check'];
$act = $data['action'];

if (!preg_match("#^[a-zA-Z0-9]+$#", $bid)) {
    echo "invalid bid";
    exit(0);
}

if (!preg_match("#^[a-zA-Z0-9]+$#", $cs)) {
    echo "invalid bid";
    exit(0);
}

$enc = sha1($bid);

if (!file_exists('./data/' . $enc . '/userdata.json')) {
    $file = fopen('./data/' . $enc . '/userdata.json', 'w');
    fwrite($file, "[\"" . $cs . "\"]");
    fclose($file);
} else {
    $udata = json_decode(file_get_contents('./data/' . $enc . '/userdata.json'), true);
    if ($act == 'add') {
        foreach ($udata as $i) {
            if ($i == $cs) {
                exit(0);
            }
        }
        $udata[] = $cs;
        $file = fopen('./data/' . $enc . '/userdata.json', 'w');
        fwrite($file, json_encode($udata));
        fclose($file);
    }
    if ($act == 'del') {
        $newp = [];
        foreach ($udata as $i) {
            if ($i != $cs) {
                $newp[] = $i;
            }
        }
        $file = fopen('./data/' . $enc . '/userdata.json', 'w');
        fwrite($file, json_encode($newp));
        fclose($file);
    }
}
