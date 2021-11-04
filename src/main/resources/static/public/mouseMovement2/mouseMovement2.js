$(document).ready(function () {
    var canvas = document.getElementById("c");
    var ctx = canvas.getContext("2d");
    var c = $("#c");
    var x, y, w, h, cx, cy, l;
    var y = [];
    var b = {
        n: 50,
        c: '#87CEFA',    //  颜色  如果是false 则是随机渐变颜色
        r: 0.9,
        o: 0.05,
        a: 1,
        s: 15,
    }
    var bx = 0, by = 0, vx = 0, vy = 0;
    var td = 0;
    var p = 0;
    var hs = 0;
    re();
    var color, color2;
    if (b.c) {
        color2 = b.c;
    } else {
        color = Math.random() * 360;
    }
    $(window).resize(function () {
        re();
    });

    function begin() {
        if (!b.c) {
            color += .1;
            color2 = 'hsl(' + color + ',100%,80%)';
        }
        td += 5;
        ctx.globalalpha = 0;
        ctx.fillStyle = '#00000000';
        // ctx.fillRect(0, 0, w, h);
        ctx.clearRect(0,0,w,h);
        console.log('00000000');
        for (var i = 0; i < y.length; i++) {
            ctx.globalAlpha = y[i].o;
            ctx.fillStyle = color2;
            ctx.beginPath();
            ctx.shadowBlur = 20;
            ctx.shadowColor = color2;
            y[i].r = (1 - (y[i].y / h)) * 15;
            ctx.arc(y[i].x, y[i].y, y[i].r, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
            ctx.shadowBlur = 0;
            y[i].o = y[i].y / h;
            y[i].v += b.a;
            y[i].y -= b.s;
            y[i].x += (Math.cos((y[i].y + td) / 100) * 10);
            if (y[i].y <= 0 - y[i].r || y[i].o <= 0) {
                y.splice(i, 1);
                i--;
            }
        }
        window.requestAnimationFrame(begin);
    }

    function re() {
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = w;
        canvas.height = h;
        cx = w / 2;
        cy = h / 2;
    };
    c.mousemove(function (e) {
        cx = e.pageX - c.offset().left;
        cy = e.pageY - c.offset().top;
        y.push({x: cx, y: cy, r: b.r, o: 1, v: 0});
    });
    (function () {
        var lastTime = 0;
        var vendors = ['webkit', 'moz'];
        for (var xx = 0; xx < vendors.length && !window.requestAnimationFrame; ++xx) {
            window.requestAnimationFrame = window[vendors[xx] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[xx] + 'CancelAnimationFrame'] ||
                window[vendors[xx] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function (callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
                var id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }
        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
        }
    }());
    begin();
})
