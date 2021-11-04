var audio = document.getElementById('alarm');
var timer, isPlay = false;

function start(address, callback) {
    var websocket = null;
    //判断当前浏览器是否支持WebSocket
    if ('WebSocket' in window) {
        websocket = new WebSocket(address);
    } else {
        alert('当前浏览器 Not support websocket');
    }

    //连接发生错误的回调方法
    websocket.onerror = function () {
        console.log('websocket链接异常');
    };

    //连接成功建立的回调方法
    websocket.onopen = function () {
        console.log("websocket链接成功");
    };

    //接收到消息的回调方法
    websocket.onmessage = function (event) {
        var obj = JSON.parse(event.data); //由JSON字符串转换为JSON对象
        console.log(obj);
        try {
            callback(obj);
        } catch (e) {
            console.error(e);
        }
        switch (obj.type) {
            case 'alarm':
                //确保callback是一个函数
                if (typeof callback === "function") {
                    //调用它，既然我们已经确定了它是可调用的
                }
                showAlarm(obj.data.name);
                break
        }
    };

    //连接关闭的回调方法
    websocket.onclose = function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
            initSocket(callback);
        }, 6000)
    };

    //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    window.onbeforeunload = function () {
        websocket.close();
    }
}

function showAlarm(msg) {
    /**
     * http://www.jqueryfuns.com/resource/2412
     * text：消息提示框的内容。
     showHideTransition：消息提示框的动画效果。可取值：plain，fade，slide。
     bgColor：背景颜色。
     textColor：文字颜色。
     allowToastClose：是否显示关闭按钮。
     hideAfter：设置为false则消息提示框不自动关闭。设置为一个数值则在指定的毫秒之后自动关闭消息提示框。
     stack：消息栈。
     textAlign：文本对齐：left, right, center。
     position：消息提示框的位置：bottom-left 、 bottom-right 、 bottom-center 、 top-left 、 top-right 、 top-center 、 mid-center。
     */
    $.toast({
        heading: '报警通知',
        text: msg,
        showHideTransition: 'fade',
        icon: 'error',
        position: 'top-right',
        hideAfter: 8000

    });
    if (!isPlay) {
        isPlay = true;
        audio.play();// 这个就是播放
    }
    clearTimeout(timer);
    timer = setTimeout(function () {
        isPlay = false;
        audio.pause();// 这个就是暂停
    }, 8000)
}

function initSocket(callback, params) {
    $.ajax({
        url: "../system/socketAddress",
        data: params,
        dataType: "json",
        type: "post",
        timeout: 30000,
        error: function (data, type, err) {
            console.log(err);
            // setTimeout(function () {
            //     initSocket(callback);
            // }, 60000)
        },
        success: function (data) {
            if (data.state == 'success') {
                start(data.data, callback);
            } else {
                console.log(data.msg);
            }
        }
    });
}