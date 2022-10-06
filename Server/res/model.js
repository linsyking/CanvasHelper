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
        $.ajax("https://yydbxx.cn/test/canvas/check.php", {
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
            $.ajax("https://yydbxx.cn/test/canvas/check.php", {
                data: JSON.stringify(smsg),
                contentType: 'application/json',
                type: 'POST'
            });
        } else {
            // Cancel
            smsg['action'] = 'del';
            $.ajax("https://yydbxx.cn/test/canvas/check.php", {
                data: JSON.stringify(smsg),
                contentType: 'application/json',
                type: 'POST'
            });
        }
    });
}

function loadppt() {
    $("ppt").click(function () {
        let defaultppt = "复制：请先选中，然后按Ctrl+C";
        if ($(this).is('[label]')) {
            defaultppt = $(this).attr("label");
        }
        window.prompt(defaultppt, $(this).text());
    });
}

function loadcourse() {
    $("cal").click(function () {
        // Get the calendar data
        $.ajax({
            url: 'file:///' + window.oudata + '/calendar.json',
            dataType: 'text',
            type: 'GET',
            success: function (data) {
                let calendar = data;
                var jmsg = [];
                try {
                    jmsg = JSON.parse(calendar);
                } catch (e) {
                    alert("语法错误");
                    return;
                }
                $.ajax("https://yydbxx.cn/test/canvas/calendar.php", {
                    data: JSON.stringify({ "bid": window.udatap['bid'], "calendar": jmsg }),
                    contentType: 'application/json',
                    type: 'POST'
                }).done(function () {
                    $("#b1").html("Successfully uploaded, updating...");
                    sendreq();  // Refresh
                });
                $("#b1").html("Uploading...");
            },
            error: function (data, e) {
                alert(e);
                return;
            }
        });
    });
}

function loadupdate() {
    loadppt();
    loadcheck();
    loadcourse();
    updatecheck();
    updateCB();
}

function displaydata(data) {
    window.isupdating = 0;
    // One column
    $("#b1").html(data);
    loadupdate();
    return;
}

function getcache() {
    if (window.udatap['bid']) {
        $.ajax("https://yydbxx.cn/test/canvas/readcache.php", {
            data: "{\"bid\":\"" + window.udatap['bid'] + "\"}",
            contentType: 'application/json',
            type: 'POST',
            error: function (data) {
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
    $.ajax("https://yydbxx.cn/test/canvas/make.php", {
        data: window.udata,
        contentType: 'application/json',
        type: 'POST',
        error: function (data) {
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

function fixedEncodeURIComponent(str) {
    return str.replace(/[!'()*]/g, function (c) {
        return '%' + c.charCodeAt(0).toString(16);
    });
}

function add_bg() {
    if (window.bgimage) {
        $('head').append('<style>body, .box::before{background: url(' + fixedEncodeURIComponent(window.bgimage) + ') 0 / cover fixed;}</style>');
        return;
    }
    if (window.prop.background_image && window.prop.background_image.value.length > 5) {
        const bgv = window.prop.background_image.value;
        const bgpath = 'file:///' + bgv;
        $('head').append('<style>body, .box::before{background: url(' + fixedEncodeURIComponent(bgpath) + ') 0 / cover fixed;}</style>');
        window.bgimage = bgpath;
    } 
}

function setVideobg() {
    if (window.udatap['video']) {
        $("body").append('<video class="bgvideo" playsinline autoplay muted loop><source src="' + window.udatap['video'] + '" type="video/ogg"></video>');
    }
}

window.notice = function () {
    let properties = window.prop;
    add_bg();
    if (properties.user_data && !window.udata) {
        if (properties.user_data.value) {
            window.oudata = properties.user_data.value;
            $.get('file:///' + properties.user_data.value + '/user_data.json', function (data) {
                window.udata = data;
                try {
                    window.udatap = JSON.parse(data);
                } catch (e) {
                    $("#b1").html("<b>user_data parse error</b>\n<p>" + e + "</p>");
                    showerrer();
                    return;
                }
                setpos();
                setVideobg();
                $("#b1").html("Updating...");
                getcache();
                window.isupdating = 1;
                sendreq();
            }, 'text').fail(function () {
                $("#b1").html("Cannot read <i>user_data.json</i> file, please double check the <b>directory</b> you set");
                showerrer();
            });
            // Get version
            $.get('file:///' + properties.user_data.value + '/project.json', function (data) {
                try {
                    window.projectinfo = JSON.parse(data);
                } catch (e) {
                    $("#b1").html("<b>project.json parse error</b>\n<p>" + e + "</p>");
                    showerrer();
                    return;
                }
                if(window.projectinfo["version"]<=6){
                    // Old version
                    // oldversion();
                    // return;
                }
            }, 'text');
        } else {
            $("#b1").html("Please set your directory");
            showerrer();
        }
    }
    // One Right
    $("#c1").css("position", "absolute");
    $("#c1").addClass("rightbox");
}

function showerrer() {
    $(".box").css("visibility", "visible");
    clearDrag(document.getElementById("hd"));
    clearDrag(document.getElementById("c1"));
}

function showup() {
    $(".box").css("visibility", "visible");
    $("#hd").css("visibility", "visible");
    $("#rfsbox").css("visibility", "visible");
}

var loadJS = function(url, implementationCode, location){
    //url is URL of external file, implementationCode is the code
    //to be called from the file, location is the location to 
    //insert the <script> element

    var scriptTag = document.createElement('script');
    scriptTag.src = url;

    scriptTag.onload = implementationCode;
    scriptTag.onreadystatechange = implementationCode;

    location.appendChild(scriptTag);
};

var initScrollBar = function(){
    document.querySelector('.foo').fakeScroll({
        track : "smooth"
    });
}

loadJS('https://res.yydbxx.cn/server/static/canvas/fakescroll.min.js', initScrollBar, document.head);

function oldversion(){
    window.location.href="https://yydbxx.cn/test/canvas/res/update.html";
}

$(document).ready(function () {
    if ($(".mainwindow").length) {
        // Old version
        oldversion();
        return;
    }
    // Init
    $("body").append('<div class="box" id="c1"><div class="foo"><div class="innerbox" id="b1"></div></div><div id="hd" class="resizer"><img id="resizeicon" width="50px" height="50px" src="https://res.yydbxx.cn/server/static/canvas/resize.svg"></div><img class="refreshicon" id="rfsbox" src="https://res.yydbxx.cn/server/static/canvas/refresh.svg"></div>');
    

    window.notice();
    dragElement_no(document.getElementById("hd"));
    dragElement(document.getElementById("c1"));

    $("#rfsbox").click(function () {
        if (window.isupdating) {
            $("#b1").html("It's updating now...");
            return;
        }
        window.isupdating = 1;
        $("#b1").html("Updating...");
        sendreq();
    });
    
    setInterval(soft_refresh, 60 * 1000);

});

function soft_refresh() {
    // Soft refresh
    if (window.isupdating) {
        return;
    }
    window.isupdating = 1;
    // $("#b1").prepend("<i>Self refreshing...</i>");
    sendreq();
}

function clearDrag(elmnt) {
    // Cleaer the drug event
    elmnt.onmousedown = null;
    document.onmouseup = null;
    document.onmousemove = null;
}

function dragElement(elmnt) {
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
        if (mydiv.offsetWidth - pos1 < 100 || mydiv.offsetHeight - pos2 < 100) {
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
    $.ajax("https://yydbxx.cn/test/canvas/position.php", {
        data: JSON.stringify(smsg),
        contentType: 'application/json',
        type: 'POST'
    });
}

function setpos() {
    const smsg = { "bid": window.udatap['bid'], "type": "get" };
    $.ajax("https://yydbxx.cn/test/canvas/position.php", {
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

