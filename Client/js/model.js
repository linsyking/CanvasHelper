function updateCB() {
    $("input").change(function () {
        // Send check request
        const juser = JSON.parse(window.udata);
        let smsg = { "bid": juser['bid'], "check": this.id, "action": "" };
        if (this.checked) {
            // Check
            smsg['action'] = 'add';
            $.ajax("http://yydbxx.cn/test/canvas/check.php", {
                data: JSON.stringify(smsg),
                contentType: 'application/json',
                type: 'POST'
            });
        } else {
            // Cancel
            smsg['action'] = 'del';
            $.ajax("http://yydbxx.cn/test/canvas/check.php", {
                data: JSON.stringify(smsg),
                contentType: 'application/json',
                type: 'POST'
            });
        }
    });
}

function sendreq() {
    $.ajax("http://yydbxx.cn/test/canvas/make.php", {
        data: window.udata,
        contentType: 'application/json',
        type: 'POST',
        error: function (data) {
            $("#b2").hide();
            $("#b1").text("Please check your Internet connection");
            window.isupdating = 0;
        }
    }).done(function (data) {
        window.isupdating = 0;
        if (window.dpmode != 1) {
            // One column
            $("#b1").html(data);
            updateCB();
            return;
        }
        let mystr = String(data);
        let len = mystr.split('\n').length;
        const fall = 20;
        if (len <= fall) {
            // Hide b2
            $("#b2").hide();
            $("#b1").html(data);
        } else {
            let an = getIndex(mystr, "\n");
            let pos = an[fall];
            let lastc = mystr.lastIndexOf("</p>", pos);
            let dl = mystr.substring(lastc + 5);
            if (dl.length <= 3) {
                // Hide b2
                $("#b2").hide();
            } else {
                $("#b2").show();
                $("#b2").html(dl);
            }
            $("#b1").html(mystr.substring(0, lastc + 4));
        }
        updateCB();
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
        if (properties.background_image) {
            if (properties.background_image.value.length > 5) {
                // User customized background image
                let fpath = 'file:///' + properties.background_image.value;
                $("body").css("background-image", "url(" + fpath + ")");
            }
        }
        if (properties.user_data) {
            if (properties.user_data.value) {
                $.get('file:///' + properties.user_data.value + '/user_data.json', function (data) {
                    window.udata = data;
                    sendreq();
                }, 'text').fail(function () {
                    $("#b1").html("Cannot read <i>user_data.json</i> file, please double check the <b>directory</b> you set.");
                });
            }
        }
        if (properties.layout) {
            let displaymode = properties.layout.value;
            window.dpmode = displaymode;
            if (displaymode == 3) {
                // One Middle
                if (window.modified)
                    $("#b1").html("Try refreshing");
                $(".box").css("overflow-y", "auto");
                $("#b2").remove();
                $("#b1").css("position", "initial");
                window.modified = 1;
            }
            if (displaymode == 1) {
                // Plane
                // Default
                if (window.modified)
                    $("#b1").html("<b>To make this work, you need to restart this wallpaper.</b>");
                window.modified = 1;
            }
            if (displaymode == 2) {
                // One Right
                if (window.modified)
                    $("#b1").html("Try refreshing");
                $(".box").css("overflow-y", "auto");
                $("#b2").remove();
                $("#b1").css("right", "10%");
                $("#b1").css("position", "absolute");
                window.modified = 1;
            }
        }
    },
}

$(document).ready(function () {
    $('#b2').hide();
    $(".refresh").click(function () {
        if (window.isupdating) {
            $("#b1").html("It's updating now...");
            return;
        }
        window.isupdating = 1;
        $('#b2').hide();
        $("#b1").html("Updating...");
        sendreq();
    });

});
