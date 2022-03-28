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

if (empty($data['type'])) {
    echo "type error";
    exit(0);
}

$bid = $data['bid'];
$enc = sha1($bid);


if (!file_exists('./data/' . $enc)) {
    exit(0);
}

if ($data['type'] == "get") {
    if (!file_exists('./data/' . $enc . '/userdata.json')) {
        exit(0);
    }
    $udata = json_decode(file_get_contents('./data/' . $enc . '/userdata.json'), true);
    if (empty($udata['position'])) {
        exit(0);
    }
    echo json_encode($udata['position']);
} elseif ($data['type'] == "set") {

    if (empty($data['left']) || empty($data['top']) || empty($data['height']) || empty($data['width'])) {
        echo "position error";
        exit(0);
    }
    if (!file_exists('./data/' . $enc . '/userdata.json')) {
        $file = fopen('./data/' . $enc . '/userdata.json', 'w');
        // Save file
        $rnew = ["position" => [
            "left" => $data['left'],
            "top" => $data['top'],
            "height" => $data['height'],
            "width" => $data['width']
        ]];
        fwrite($file, json_encode($rnew));
        fclose($file);
    } else {
        $udata = json_decode(file_get_contents('./data/' . $enc . '/userdata.json'), true);
        if (empty($udata['position'])) {
            $udata['position'] = [];
        }
        $udata['position']['left'] = $data['left'];
        $udata['position']['top'] = $data['top'];
        $udata['position']['height'] = $data['height'];
        $udata['position']['width'] = $data['width'];
        $file = fopen('./data/' . $enc . '/userdata.json', 'w');
        fwrite($file, json_encode($udata));
        fclose($file);
    }
}
