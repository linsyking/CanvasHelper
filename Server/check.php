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

if (!array_key_exists('type',$data)) {
    echo "type error";
    exit(0);
}

$bid = $data['bid'];
$cs = $data['check'];
$ctype = $data['type'];
$enc = sha1($bid);

if (!file_exists('./data/' . $enc)) {
    exit(0);
}

if (!file_exists('./data/' . $enc . '/userdata.json')) {
    $file = fopen('./data/' . $enc . '/userdata.json', 'w');
    // Save file
    $rnew=["checks"=>[["name"=>$cs,"type"=>$ctype]]];
    fwrite($file, json_encode($rnew));
    fclose($file);
} else {
    $udata = json_decode(file_get_contents('./data/' . $enc . '/userdata.json'), true);
    if(empty($udata['checks'])){
        $udata['checks']=[];
    }
    $udatac=&$udata['checks'];
    $isexist=0;
    foreach ($udatac as &$i) {
        if ($i["name"] == $cs) {
            $i["type"] = $ctype;
            $isexist=1;
            break;
        }
    }
    if(!$isexist){
        $newcs = ["name"=>$cs, "type"=>$ctype];
        $udatac[] = $newcs;
    }
    $file = fopen('./data/' . $enc . '/userdata.json', 'w');
    fwrite($file, json_encode($udata));
    fclose($file);
}
