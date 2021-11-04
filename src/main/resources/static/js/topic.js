var topicSocket, tJumpTimer, topicTimer, tFlag;

/**
 * 初始化长连接
 *
 * @param info 登陆信息 （userNane ,password,address）
 * @param dialog 提示信息
 * @param callback 接收回调
 */
function initTopicSocket(dialog, callback) {
    $.ajax({
        url: "../system/topicAddress",
        data: {},
        dataType: "json",
        type: "post",
        timeout: 30000,
        error: function (data, type, err) {
            console.log(err);
            setTimeout(function () {
                initTopicSocket(dialog,callback);
            }, 6000)
        },
        success: function (data) {
            if (data.state == 'success') {
                console.log(data);
                startTopic(data.data,dialog, callback);
            } else {
                console.log(data.msg);
            }
        }
    });
}

function startTopic(info, dialog, callback) {
    //判断当前浏览器是否支持WebSocket
    if ('WebSocket' in window) {
        topicSocket = new WebSocket(info.address);
    } else {
        alert('当前浏览器 Not support websocket')
    }

    //连接发生错误的回调方法
    topicSocket.onerror = function () {
    };

    //连接成功建立的回调方法
    topicSocket.onopen = function () {
        if (info.userName != null && info.password != null) {
            console.log('发送登录包：'+info.userName);
            topicSocket.send('0' + info.userName + "#" + info.password);
        } else {
            console.log('用户名密码为空');
        }
    };

    //接收到消息的回调方法
    topicSocket.onmessage = function (event) {
        console.log(event.data);
        switch (event.data) {
            case '@offline':
                console.log('被呼叫用户不在线');
                if (typeof dialog === "function") {
                    dialog('用户不在线');
                }
                break;
            case '@success':
                console.log('登陆成功');
                jump();
                break;
            case '@err':
                console.log('登陆失败');
                stop();
                break;
            case '@callerr':
                console.log('呼叫包错误');
                break;
            case '@kicking':
                console.log('被踢走');
                if (typeof dialog === "function") {
                    dialog('用户在其他地方登陆，已下线');
                }
                stop();
                break;
            default:
                if (typeof callback === "function") {
                    callback(event.data);
                }
                break
        }
    };

    //连接关闭的回调方法
    topicSocket.onclose = function () {
        console.log('连接关闭');
        if (tFlag) {
            console.log('不重连')
        } else {
            console.log('重连');
            clearTimeout(topicTimer);
            topicTimer = setTimeout(function () {
                initSocket(info, callback);
            }, 6000)
        }
    };

    //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    window.onbeforeunload = function () {
        topicSocket.close();
    }
}


function jump() {
    if (tJumpTimer != null) {
        clearInterval(tJumpTimer);
        console.log('clearInterval');
    }
    console.log('set');
    tJumpTimer = setInterval(function () {
        console.log('send:1');
        topicSocket.send(1);
    }, 59000);
}

function stop() {
    tFlag = true;
    if (topicTimer != null) {
        clearTimeout(topicTimer);
    }
    if (tJumpTimer != null) {
        clearInterval(tJumpTimer);
        console.log('clearInterval');
    }
    try {
        topicSocket.close();
    } catch (e) {

    }
}

//发送消息
function send(user, msg) {
    topicSocket.send('2' + user + "#" + msg);
    jump();
}