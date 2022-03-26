function sendreq() {
    $.ajax("http://yydbxx.cn/test/canvas/make.php", {
        data: window.udata,
        contentType: 'application/json',
        type: 'POST'
    }).done(function (data) {
        window.isupdating=0;
        let mystr = String(data);
        let len = mystr.split('\n').length;
        const fall = 20;
        if (len <= fall) {
            // Hide b2
            $("#b2").hide();
            $("#b1").html(data);
        } else {
            $("#b2").show();
            let an = getIndex(mystr, "\n");
            let pos = an[fall];
            let lastc = mystr.lastIndexOf("</p>", pos);
            let dl = mystr.substring(lastc+5);
            $("#b2").html(dl);
            $("#b1").html(mystr.substring(0, lastc +4));
        }
        $("#container").html(data);
        $("input[type='checkbox']").change(function () {
            // Send check request
            const juser = JSON.parse(window.udata);
            let smsg = {"bid":juser['bid'], "check":this.id, "action":""};
            if (this.checked) {
                // Check
                smsg['action']='add';
                $.ajax("http://yydbxx.cn/test/canvas/check.php", {
                    data: JSON.stringify(smsg),
                    contentType: 'application/json',
                    type: 'POST'
                });
            } else {
                // Cancel
                smsg['action']='del';
                $.ajax("http://yydbxx.cn/test/canvas/check.php", {
                    data: JSON.stringify(smsg),
                    contentType: 'application/json',
                    type: 'POST'
                });
            }
        });
    });
}

function getIndex(str, s) {
    var flag = false;
    var pa = [];
    for (var i = 0; i < str.length - s.length + 1; i++) {
        if (str.substring(i, s.length + i) == s) {
            pa.push(i);
            flag = true;
        }
    }
    if (flag === false) {
        return [];
    }
    return pa;
}

window.wallpaperPropertyListener = {
    applyUserProperties: function (properties) {
        if (properties.user_data) {
            if (properties.user_data.value) {
                $.get('file:///' + properties.user_data.value + '/user_data.json', function (data) {
                    window.udata = data;
                    sendreq();
                }, 'text');
            }
        }
    },
}

$(document).ready(function () {
    $('#b2').hide();
    $(".refresh").click(function () {
        if(window.isupdating){
            $("#b1").html("It's updating now...");
            return;
        }
        window.isupdating=1;
        $('#b2').hide();
        $("#b1").html("Updating...");
        sendreq();
    });

});
