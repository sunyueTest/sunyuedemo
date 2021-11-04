//回车键登录功能
window.onload=function(){
    $(function(){
        $("#userName").keyup(function(e){
            if(e.keyCode == "13"){
                $("#password").focus();
            }
        })
        $("#password").keyup(function(e){
            if(e.keyCode== "13"){
                doLogin();
            }
        })
    });


    layui.use(['layer', 'form'], function () {
        var layer = layui.layer;

    });

    $('#userName').attr('placeholder',$.i18n.prop('userNameDesc'));
    $('#password').attr('placeholder',$.i18n.prop('passwordDesc'));
    $('#login').text($.i18n.prop('login'));
    $('#register').text($.i18n.prop('register'));

    function setLanguage(value) {

        //setCookie('jxct_lang', local, 30);
        var exdate = new Date()
        exdate.setDate(exdate.getDate() + 30)
        document.cookie = "jxct_lang" + "=" + escape(value) +
            ( ";expires=" + exdate.toGMTString());
        window.location.reload();
    }
    /* //语言切换
     $('.language').mouseover(function(){
         $(".lang").css('display','block');
     });
     $(".lang").mouseout(function(){
         $(".lang").css('display','none');
     });*/
    function doLogin() {
        var userName = $('#userName').val();
        var password = $('#password').val();
        if (userName == '') {
            layer.msg($.i18n.prop('userNameDesc')+'!');
            return false;
        }
        if (password == '') {
            layer.msg($.i18n.prop('passwordDesc')+'!');
            return false;
        }
        if (password.length > 0 && userName.length > 0) {
            var index = layer.load(2);
            var param = {
                userName: userName,
                password: password
            };
            $.ajax({
                type: "post",
                url: "/index/login",
                timeout: 60000,
                data: param,
                success: function (result) {
                    if (result.state == 'success') {
                        window.location.href = "/index";
                    } else {
                        layer.msg($.i18n.prop(result.msg));
                        console.log(result);
                    }
                    layer.close(index);
                },
                error: function (data) {
                    layer.close(index);
                    layer.msg($.i18n.prop('warn37'));
                }
            });

        }
    }
    // 登录
    $('#login').on('click',function(){
        doLogin()
    })
    $('#setLanguagezh').on('click',function(){
        setLanguage('zh')
    })
    $('#setLanguageen').on('click',function(){
        setLanguage('en')
    })


if (window != top)
    top.location.href = location.href;


}

if(demoUser != undefined && demoPwd != undefined){
    $("#userName").val(demoUser);
    $("#password").val(demoPwd);
}else{
    getUser();
}

function getUser(){
    var nmpsd;
    var nm;
    var psd;
    var cookieString = new String(document.cookie);
    var cookieHeader = "username=";
    var beginPosition = cookieString.indexOf(cookieHeader);
    cookieString = cookieString.substring(beginPosition);
    var ends = cookieString.indexOf(";");
    if (ends != -1) {
        cookieString = cookieString.substring(0, ends);
    }
    if (beginPosition > -1) {
        nmpsd = cookieString.substring(cookieHeader.length);
        if (nmpsd != "") {
            beginPosition = nmpsd.indexOf("%%");
            nm = nmpsd.substring(0, beginPosition);
            psd = nmpsd.substring(beginPosition + 2);
            document.getElementById('userName').value = nm;
            document.getElementById('password').value = psd;
            if (nm != "" && psd != "") {
                // document.forms[0].checkbox.checked = true;
                //document.getElementById('rememberMe').checked = true;
                $('#rememberMe').iCheck('check'); // 将输入框的状态设置为checked
                //$('input').iCheck('uncheck'); // 移除 checked 状态
            }
        }
    }
}