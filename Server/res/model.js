function loadcheck() {
    $('.checkbox').each(function () {
        if ($(this).hasClass('positive')) {
            $(this).html('<svg class="ssvg" viewBox="0 0 32 32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="10.9375%"><path d="M2 20 L12 28 30 4" /></svg>');
            $(this).next().addClass('delete');
        } else if ($(this).hasClass('negative')) {
            $(this).html('<svg class="ssvg" viewBox="0 0 32 32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="10.9375%"><path d="M2 30 L30 2 M30 30 L2 2" /></svg>');
            $(this).next().addClass("wrong");
        } else if ($(this).hasClass('important')) {
            $(this).html('');
            $(this).next().addClass("imptext");
        } else {

        }
    });
}

function updatecheck() {
    $('.checkbox').click(function () {
        let newtype = 0;
        if ($(this).hasClass('positive')) {
            newtype = 2;
            $(this).removeClass('positive');
            $(this).addClass('negative');
            $(this).html('<svg class="ssvg" viewBox="0 0 32 32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="10.9375%"><path d="M2 30 L30 2 M30 30 L2 2" /></svg>');
            $(this).next().removeClass('delete');
            $(this).next().addClass("wrong");
        } else if ($(this).hasClass('negative')) {
            newtype = 3;
            $(this).removeClass('negative');
            $(this).addClass('important');
            $(this).html('');
            $(this).next().removeClass("wrong");
            $(this).next().addClass("imptext");
        } else if ($(this).hasClass('important')) {
            newtype = 0;
            $(this).removeClass('important');
            $(this).html('');
            $(this).next().removeClass("imptext");
        } else {
            newtype = 1;
            $(this).addClass('positive');
            $(this).html('<svg class="ssvg" viewBox="0 0 32 32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="10.9375%"><path d="M2 20 L12 28 30 4" /></svg>');
            $(this).next().addClass('delete');
        }
        // Sene request
        // Send check request
        let smsg = { "bid": window.udatap['bid'], "check": this.id, "type": newtype };
        $.ajax("http://yydbxx.cn/test/canvas/check.php", {
            data: JSON.stringify(smsg),
            contentType: 'application/json',
            type: 'POST'
        });
    });
}

function updateCB() {
    $("input").change(function () {
        // Send check request
        let smsg = { "bid": window.udatap['bid'], "check": this.id, "action": "" };
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

function displaydata(data) {
    window.isupdating = 0;
    if (window.dpmode != 1) {
        // One column
        $("#b1").html(data);
        loadcheck();
        updatecheck();
        updateCB();
        return;
    }
    let mystr = String(data);
    let len = mystr.split('\n').length;
    const fall = 20;
    if (len <= fall) {
        // Hide c2
        $("#c2").hide();
        $("#b1").html(data);
    } else {
        let an = getIndex(mystr, "\n");
        let pos = an[fall];
        let lastc = mystr.lastIndexOf("</p>", pos);
        let dl = mystr.substring(lastc + 5);
        if (dl.length <= 3) {
            // Hide c2
            $("#c2").hide();
        } else {
            $("#c2").show();
            $("#b2").html(dl);
        }
        $("#b1").html(mystr.substring(0, lastc + 4));
    }
    loadcheck();
    updatecheck();
    updateCB();
}

function getcache() {
    if (window.udatap['bid']) {
        $("#b1").text("hi1");
        $.ajax("http://yydbxx.cn/test/canvas/readcache.php", {
            data: "{\"bid\":\"" + window.udatap['bid'] + "\"}",
            contentType: 'application/json',
            type: 'POST',
            error: function (data) {
                $("#c2").hide();
                $("#b1").text("Please check your Internet connection");
                window.isupdating = 0;
            }
        }).done(function (data) {
            if (data.length > 5)
                displaydata(data);
        });
    }
}

function sendreq() {
    // Precheck
    if (window.udatap['bid'].length < 10) {
        // Obviously incorrect
        $("#b1").html("Please check your bid");
        return;
    }
    $.ajax("http://yydbxx.cn/test/canvas/make.php", {
        data: window.udata,
        contentType: 'application/json',
        type: 'POST',
        error: function (data) {
            $("#c2").hide();
            $("#b1").text("Please check your Internet connection");
            window.isupdating = 0;
        }
    }).done(function (data) {
        window.isonline = true;
        $("#resizeicon").addClass("ftg");
        displaydata(data);
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

function add_bg() {
    if (window.bgimage) {
        $('head').append('<style>body, .box::before{background: url(' + window.bgimage + ') 0 / cover fixed;}</style>');
        return;
    }
    if (window.prop.background_image && window.prop.background_image.value.length > 5) {
        const bgv = window.prop.background_image.value;
        const bgpath = 'file:///' + bgv;
        $('head').append('<style>body, .box::before{background: url(' + bgpath + ') 0 / cover fixed;}</style>');
        window.bgimage = bgpath;
    } else {
        $('head').append('<style>body, .box::before{background: url(./img/bg.jpg) 0 / cover fixed;}</style>');
        window.bgimage = './img/bg.jpg';
    }
}

window.notice = function () {
    let properties = window.prop;
    add_bg();
    if (properties.user_data && !window.udata) {
        if (properties.user_data.value) {
            $.get('file:///' + properties.user_data.value + '/user_data.json', function (data) {
                window.udata = data;
                try {
                    window.udatap = JSON.parse(data);
                } catch (e) {
                    $("#b1").html("<b>user_data parse error</b>\n<p>" + e + "</p>");
                    showerrer();
                    return;
                }
                if (window.dpmode == 2) {
                    setpos();
                }
                getcache();
                window.isupdating = 1;
                sendreq();
            }, 'text').fail(function () {
                $("#b1").html("Cannot read <i>user_data.json</i> file, please double check the <b>directory</b> you set");
                showerrer();
            });
        } else {
            $("#b1").html("Please set your directory");
            showerrer();
        }
    }
    if (properties.layout) {
        let displaymode = properties.layout.value;
        window.dpmode = displaymode;
        if (displaymode == 1) {
            // Plsane
            // Default
            if (window.modified) {
                $("#b1").html("<b>To make this work, you need to restart this wallpaper</b>");
            }
            // $("#c2").show();
            showup();
            $(".innerbox").css("overflow", "hidden");
            window.modified = 1;
        }
        if (displaymode == 2) {
            // One Right
            if (window.modified) {
                $("#b1").html("<b>To make this work, you need to restart this wallpaper</b>");
                showerrer();
            }
            $("#c2").remove();
            $("#c1").css("position", "absolute");
            $("#c1").addClass("rightbox");
            window.modified = 1;
        }
    }
}

function showerrer() {
    $(".box").css("visibility", "visible");
}

function showup() {
    $(".box").css("visibility", "visible");
    $("#hd").css("visibility", "visible");
    $("#rfsbox").css("visibility", "visible");
}

$(document).ready(function () {
    if ($(".mainwindow").length) {
        // Old version
        $(".mainwindow").html("<h1>请更新壁纸！</h1>\n<b>提示：您需要将壁纸从Wallpaper Engine中删除后重新下载安装才能生效。</b>\n<p>注：该更新版本为最后一个版本，您以后无需再更新！谢谢您的支持！</p>")
        return;
    }
    // Init
    $("body").append('<div class="box" id="c1"><div class="innerbox" id="b1"></div><div id="hd" class="resizer"><img id="resizeicon" width="50px" height="50px" src="http://yydbxx.cn/test/canvas/res/resize.svg"></div><img class="refreshicon" id="rfsbox" src="http://yydbxx.cn/test/canvas/res/refresh.svg"></div>');
    $("body").append('<div class="box" id="c2"><div class="innerbox" id="b2"></div></div>');
    // $("body").append('');
    window.notice();
    $('#c2').hide();
    if (window.dpmode != 2) {
        $("#hd").hide();
    }

    dragElement_no(document.getElementById("hd"));
    dragElement(document.getElementById("c1"));

    $("#rfsbox").click(function () {
        if (window.isupdating) {
            $("#b1").html("It's updating now...");
            return;
        }
        window.isupdating = 1;
        $('#c2').hide();
        $("#b1").html("Updating...");
        sendreq();
    });

});


function dragElement(elmnt) {
    if (window.dpmode != 2) return;
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        if (pos3 > elmnt.offsetLeft + elmnt.offsetWidth - 50 || pos3 < elmnt.offsetLeft + 70) {
            return;
        }
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
    function closeDragElement() {
        sendpos();
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function dragElement_no(elmnt) {
    if (window.dpmode != 2) return;
    var mydiv = document.getElementById("c1");
    // mydiv.style.top = mydiv.offsetTop + "px";
    // mydiv.style.left = mydiv.offsetLeft + "px";
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;

        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        if(mydiv.offsetWidth - pos1<100 || mydiv.offsetHeight - pos2<100){
            closeDragElement();
            return;
        }
        // set the element's new position:
        mydiv.style.width = (mydiv.offsetWidth - pos1) + "px";
        mydiv.style.height = (mydiv.offsetHeight - pos2) + "px";
    }
    function closeDragElement() {
        // stop moving when mouse button is released:
        sendpos();
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function sendpos() {
    var mydiv = document.getElementById("c1");
    let x = mydiv.offsetLeft;
    let y = mydiv.offsetTop;
    let w = mydiv.offsetWidth;
    let h = mydiv.offsetHeight;
    // Send box position
    const smsg = { "bid": window.udatap['bid'], "type": "set", "left": x, "top": y, "height": h, "width": w };
    $.ajax("http://yydbxx.cn/test/canvas/position.php", {
        data: JSON.stringify(smsg),
        contentType: 'application/json',
        type: 'POST'
    });
}

function setpos() {
    const smsg = { "bid": window.udatap['bid'], "type": "get" };
    $.ajax("http://yydbxx.cn/test/canvas/position.php", {
        data: JSON.stringify(smsg),
        contentType: 'application/json',
        type: 'POST'
    }).done(function (data) {
        if (data.length < 10) {
            showup();
            return;
        }
        var b1pos;
        try {
            b1pos = JSON.parse(data);
            var mydiv = document.getElementById("c1");
            mydiv.style.left = b1pos['left'] + "px";
            mydiv.style.top = b1pos['top'] + "px";
            mydiv.style.width = b1pos['width'] + "px";
            mydiv.style.height = b1pos['height'] + "px";
            showup();
        } catch (e) {
            showup();
            return;
        }

    });
}

