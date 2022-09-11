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
    $.get('https://yydbxx.cn', function (data) { }, 'text').fail(function () {
        setTimeout(wait, 1000);
        return;
    }).done(function () {
        var queryString = '?reload=' + new Date().getTime();
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'https://yydbxx.cn/test/canvas/res/style.css' + queryString;
        head.appendChild(link);

        var js = document.createElement('script');
        js.src = "https://yydbxx.cn/test/canvas/res/model.js" + queryString;
        head.appendChild(js);

        var link2 = document.createElement('link');
        link2.rel = 'stylesheet';
        link2.type = 'text/css';
        link2.href = './style.css';
        head.appendChild(link2);
    });
}
