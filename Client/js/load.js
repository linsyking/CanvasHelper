// Wait for internet connection

$(document).ready(function () {
    wait();
});

window.wallpaperPropertyListener = {
    applyUserProperties: function (properties) {
        window.prop = properties;
        if (window.notice)
            window.notice();
    }
}

function wait() {
    $.get("https://res.yydbxx.cn/server/online.txt", function () { }, "text").fail(function () {
        // Cannot connect to the server
        setTimeout(wait, 1000);
    }).done(function () {
        var queryString = "?reload=" + new Date().getTime();
        var head = document.getElementsByTagName("head")[0];
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = "https://res.yydbxx.cn/server/static/canvas/style.css" + queryString;
        head.appendChild(link);

        var js = document.createElement("script");
        js.src = "https://res.yydbxx.cn/server/static/canvas/model.js" + queryString;
        head.appendChild(js);

        link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = "./style.css";
        head.appendChild(link);
    });
}
