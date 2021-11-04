var active, userData, isShow, timer;
var sum;
$(document).ready(


    $(function () {
        $.ajax({
            url: "farmDemo/getUserRole",
            data: {},
            async: false,
            dataType: "json",
            type: "post",
            timeout: 10000,
            error: function (data, type, err) {
                console.log(err);
            },
            success: function (data) {
                if (data.success) {
                    if (data.data != null && data.data.roleId == 6) {
                        //$('.layui-layout-admin .layui-body').css('background-image', 'url(img/index_bg.jpg)');
                        $('.layui-layout-admin .layui-body').css('background-image', 'none');
                        $('.layui-layout-admin .layui-body').css('background-color', '#F1F7F7');
                        // $('.layui-layout-admin .layui-header').css('background-color', '#FFFFFF');
                        $('.layui-layout-admin .layui-header a').css('color', 'black');
                        //$('.layui-side-menu').css('background-color', '#3383FF');
                        //$('.layui-layout-admin .layui-logo').css('background-color', );
                        document.getElementById('themeStyle').innerHTML = ".layui-side .layui-nav .layui-nav-child dd.layui-this a,.layui-side .layui-nav-child dd.layui-this, .layui-nav-tree .layui-this,.layui-nav-tree .layui-this>a{\n" +
                            "        background-color:" + '#3383FF' + "!important\n" +
                            "    }";
                        $('.layui-tab-title').css('color', 'black');
                        $('.style').attr("disabled", "disabled");//进入农业平台去掉所有主题样式
                    }
                }
            }
        })
        //设置语言
        loadI18nProperties(function () {
            $('#monitor').text($.i18n.prop('index_monitor'));
            $('#choseLanguage').text($.i18n.prop('index_choseLang'));
            $('#chinese').text($.i18n.prop('index_chinese'));
            $('#themeScheme').text($.i18n.prop('index_theme'));
            $('#info').text($.i18n.prop('index_myInfo'));
            $('#agreement').text($.i18n.prop('index_agreement'));
            $('#out').text($.i18n.prop('index_logout'));
            $('#helpDocument').text($.i18n.prop('index_helpDocument'));
        });
    })
);

function choseTheme() {
    $(this).addClass("layui-this");
}

function hiddenShade() {
    $(".layui-layer-shade").hide();
    $("#layui-layer1").hide();
}

function showShade() {
    $(".layui-layer-shade").show();
    $("#layui-layer1").show();
}
/**
 * 主题切换点击事件
 * 点击获取主题序号=》存入
 * 每次点击会查找页面中的iframe自刷新一边已经打开的iframe，刷新每一个iframe的选中主题（如果打开很多个操作界面会卡；*目前没找到解决办法）
 */
$('.layadmin-setTheme-color li').on('click', function () {
    iframesum = $(this).index();
    let num1 = parseInt(iframesum);
    sum = num1;
    let styles = document.getElementsByClassName('styles')[0]
    num1+=1;
    styles.href = '/static/css/indexCss/indexsubject' + num1 + '.css';
    setCookie("subject", iframesum, 30);
    $.ajax({
        type: "POST",
        url: "user/upSystemStyle?style=" + sum,
        dataType: "json",
        success: function (res) {
            if (res.state == 'success') {
                var iframe = document.getElementsByTagName('iframe');
                for (var i = 0; i < iframe.length; i++) {
                    iframe[i].contentWindow.location.reload(true);
                }
            } else {
                console.log(res);
            }
        }
    });
});
/**
 * 动态定位首页logo
 * 获取logo高度；设置侧边导航距离顶部距离
 */

    function logofixed(){
        var top=$('#index-nav').offset().top;
        console.log(top);
        $('#layui-logo').addClass('logofixed');
        var indexnav=document.getElementById('index-nav');
        indexnav.style.marginTop=top+'px';
        var height=$(window).height();
        var maxheight=height-top;
        console.log(maxheight);
        indexnav.style.height=maxheight+'px'
    }
    logofixed();

$('.layui-side-menu .layui-nav .layui-nav-item>a').on('click', function () {
    if (!isShow) {
        //展开左侧菜单栏
        document.getElementById('flexible').click();
    }

});

//注意：导航 依赖 element 模块，否则无法进行功能性操作
layui.use(['element', 'layer'], function () {
    var element = layui.element;
    //左侧菜单伸缩事件
    isShow = true;  //定义一个标志位
    $('#flexible').click(function () {
        //选择出所有的span，并判断是不是hidden
        $('.layui-nav-item span').each(function () {
            if ($(this).is(':hidden')) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
        $('.layui-nav-item cite').each(function () {
            if ($(this).is(':hidden')) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
        //判断isshow的状态
        if (isShow) {//向左移动
            $('.layui-side').width(60); //设置宽度
            //$('.layui-nav .layui-layout-left').style.marginLeft='60px'; //修改图标的位置
            $('#lay-left').css('left', 60 + 'px');
            //将footer和body的宽度修改
            //$('.layui-header').css('left', 60+'px');
            $('#LAY_app_flexible').removeClass('layui-icon-shrink-right');
            $('#LAY_app_flexible').addClass('layui-icon-spread-left');
            $('.layui-body').css('left', 60 + 'px');
            document.getElementById("layui-logo").style.display = "none";
            document.getElementById("logo").style.display = "none";
            //$('.layui-footer').css('left', 60+'px');
            //将二级导航栏隐藏
            $('dd span').each(function () {
                $(this).hide();
            });
            $('#LAY-system-side-menu').find('li').each(function () {
                //tmp = $(this).text();
                $(this).removeClass('layui-nav-itemed');
            });
            //修改标志位
            isShow = false;
        } else {
            $('.layui-side').width(220);
            $('#lay-left').css('left', 220 + 'px');
            //$('.layui-nav .layui-layout-left').style.marginLeft='220px';
            //$('.layui-nav .layui-layout-right').css('left', 220+'px');
            //$('.layui-header').css('left', 220+'px');
            $('.layui-body').css('left', 220 + 'px');
            $('#LAY_app_flexible').removeClass('layui-icon-spread-left');
            $('#LAY_app_flexible').addClass('layui-icon-shrink-right');
            document.getElementById("layui-logo").style.display = "block";
            document.getElementById("logo").style.display = "block";
            //$('.layui-footer').css('left', 200+'px');
            $('dd span').each(function () {
                $(this).show();
            });
            isShow = true;
        }
    });
    active = {
        //在这里给active绑定几项事件，后面可通过active调用这些事件
        tabAdd: function (url, id, name){
            //新增一个Tab项 传入三个参数，分别对应其标题，tab页面的地址，还有一个规定的id，是标签中data-id的属性值
            //关于tabAdd的方法所传入的参数可看layui的开发文档中基础方法部分
            console.log(url);
            element.tabAdd('tabs', {
                title: name,
                content: '<iframe id = "' + id + '" data-frameid="' + id +
                '"  scrolling="auto" frameborder="0" src="' + url +
                ((sum == null) ? '' : ((url.indexOf("?") > 0 ? '&' : '?') + 'num=' + sum))
                + '" style="height:100%;width:98%; min-height: 500px;" num="1"></iframe>',
                id: id //规定好的id
            });
            //$(".lay-tabsbody-item").innerHTML = '<iframe data-frameid="'+id+'" scrolling="auto" frameborder="0" src="'+url+'" style="width:100%;height:99%;"></iframe>';
            // FrameWH();  //计算ifram层的大小
        },
        tabChange: function (id, url) {
            //切换到指定Tab项
            element.tabChange('tabs', id); //根据传入的id传入到指定的tab项
            //$(".lay-tabsbody-item").innerHTML = '<iframe data-frameid="'+id+'" scrolling="auto" frameborder="0" src="'+url+'" style="width:100%;height:99%;"></iframe>'
            checkLoginState();
        },
        tabDelete: function (id) {
            element.tabDelete("tabs", id);//删除
        }
        , tabDeleteAll: function (ids) {//删除所有
            $.each(ids, function (i, item) {
                element.tabDelete("tabs", item); //ids是一个数组，里面存放了多个id，调用tabDelete方法分别删除
            })
        }
    };
    getUserInfo();
    hiddenShade();
    //当点击有site-demo-active属性的标签时，即左侧菜单栏中内容 ，触发点击事件
    $('.site-menu-active').on('click', function () {
        var dataid = $(this);

        //这时会判断右侧.layui-tab-title属性下的有lay-id属性的li的数目，即已经打开的tab项数目
        if ($(".layui-tab-title li[lay-id]").length <= 0) {
            //如果比零小，则直接打开新的tab项
            active.tabAdd(dataid.attr("data-url"), dataid.attr("data-id"), dataid.attr("data-title"));
        } else {
            //否则判断该tab项是否以及存在
            var isData = false; //初始化一个标志，为false说明未打开该tab项 为true则说明已有
            $.each($(".layui-tab-title li[lay-id]"), function () {
                //如果点击左侧菜单栏所传入的id 在右侧tab项中的lay-id属性可以找到，则说明该tab项已经打开
                if ($(this).attr("lay-id") == dataid.attr("data-id")) {
                    isData = true;
                }
            })
            if (isData == false) {
                //标志为false 新增一个tab项
                active.tabAdd(dataid.attr("data-url"), dataid.attr("data-id"), dataid.attr("data-title"));
            }
        }
        //最后不管是否新增tab，最后都转到要打开的选项页面上
        active.tabChange(dataid.attr("data-id"), dataid.attr("data-url"));
    });

});


function onCancel() {
    //FF中需要修改配置window.close方法才能有作用，为了不需要用户去手动修改，所以用一个空白页面显示并且让后退按钮失效
//Opera浏览器旧版本(小于等于12.16版本)内核是Presto，window.close方法有作用，但页面不是关闭只是跳转到空白页面，后退按钮有效，也需要特殊处理
    var userAgent = navigator.userAgent;
    if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Presto") != -1) {
        window.location.replace("about:blank");
    } else {
        window.opener = null;
        window.open("../doLogin", "_self");
        window.close();
    }
}

function onAgree() {
    $.ajax({
        url: "agreement/agree",
        data: {},
        dataType: "json",
        type: "post",
        timeout: 10000,
        error: function (data, type, err) {
            console.log(err);
        },
        success: function (data) {
            $('#agreementDialog').css('display', 'none');
        }
    })
}

var myInfo = function () {
    var isData = false; //初始化一个标志，为false说明未打开该tab项 为true则说明已有
    $.each($(".layui-tab-title li[lay-id]"), function () {
        //如果点击左侧菜单栏所传入的id 在右侧tab项中的lay-id属性可以找到，则说明该tab项已经打开
        if ($(this).attr("lay-id") == '701') {
            isData = true;
        }
    });
    if (isData == false) {
        //标志为false 新增一个tab项
        active.tabAdd('../userManage/myInfo', '701', $.i18n.prop('index_myInfo'));
    }
    //最后不管是否新增tab，最后都转到要打开的选项页面上
    active.tabChange('701', '../userManage/myInfo');
};
var aboutUs = function () {
    window.open("/aboutUs/aboutUsWeb");
};
function changeState(type) {
    switch (type) {
        case 'closeCommand':
            active.tabDelete('sendCommand');
            break;
        case 'sendCommand':
            active.tabDelete('sendCommand');
            active.tabAdd('sendCommand', 'sendCommand', $.i18n.prop('sendCommand'));
            active.tabChange('sendCommand', 'sendCommand');
            break;
        case 'addDeviceTable':
            active.tabDelete('boundDevice');
            active.tabAdd('boundDevice', 'boundDevice', $.i18n.prop('boundDevice'));
            active.tabChange('boundDevice', 'boundDevice');
            break;
        case 'bundDeviceSuccess':
            active.tabDelete('boundDevice');
            break;
        case 'addTrigger':
            active.tabDelete('addTrigger');
            active.tabDelete('addTriggerAll');
            active.tabAdd('addTrigger', 'addTrigger', $.i18n.prop('addTrigger'));
            active.tabChange('addTrigger', 'addTrigger');
            break;
        case 'addTriggerAll':
            active.tabDelete('addTrigger');
            active.tabDelete('addTriggerAll');
            active.tabAdd('addTriggerAll', 'addTriggerAll', $.i18n.prop('addTrigger'));
            active.tabChange('addTriggerAll', 'addTriggerAll');
            break;
        case 'addTriggerSuccess':
            active.tabDelete('addTriggerAll');
            active.tabDelete('addTrigger');
            break;
        case 'history':
            active.tabDelete('204');
            active.tabAdd('history', '204', $.i18n.prop('historyData'));
            active.tabChange('204', 'history');
            break;
        case 'farmHistory':
            active.tabDelete('1104');
            active.tabAdd('farmDemo/historyList', '1104', $.i18n.prop('historyData'));
            active.tabChange('1104', 'farmDemo/historyList');
            break;
    }
}
function sendBroadcast(type, data) {
    changeState(type);
    for (let i = 0; i < frames.length; i++) {
        var iframe = frames[i];
        try {
            iframe.onReceive(type, data);
        } catch (e) {
            // console.log(e)
        }
    }

}
// 图形化显示
function jumpDashboard(deviceNumber) {
    active.tabDelete('203');
    active.tabAdd('/dashboard', '203', $.i18n.prop('graphicalDisplay'));
    active.tabChange('203', '/dashboard');
    setTimeout(function () {
        var iframe = $("#203")[0].contentWindow;
        iframe.setDeviceNumber(deviceNumber);
        iframe.searchDevice();
    }, 500);
}
// 设备体检
function jumpExamination(deviceNumber) {
    active.tabDelete('306');
    active.tabAdd('/examination', '306', $.i18n.prop('graphicalExamination'));
    active.tabChange('306', '/examination');
    setTimeout(function () {
        var iframe = $("#306")[0].contentWindow;
        iframe.setDeviceNumber(deviceNumber);
        // iframe.searchDevice();
    }, 500);
}
// 设备历史记录
function jumpDeviceHistory(deviceNumber) {
    active.tabDelete('308');
    active.tabAdd('/deviceHistory', '308', $.i18n.prop('历史记录'));
    active.tabChange('308', '/deviceHistory');
    setTimeout(function () {
        var iframe = $("#308")[0].contentWindow;
        iframe.setDeviceNumber(deviceNumber);
        // iframe.searchDevice();
    }, 500);
}

// 轨迹回放
function jumpTrajectoryReplay(deviceNumber) {
    active.tabDelete('307');
    active.tabAdd('/trajectoryReplay', '307', $.i18n.prop('轨迹回放'));
    active.tabChange('307', '/trajectoryReplay');
    setTimeout(function () {
        var iframe = $("#307")[0].contentWindow;
        iframe.setDeviceNumber(deviceNumber);
    }, 500);
}

// ThingJS版轨迹回放
function newJumpTrajectoryReplay(deviceNumber) {
    active.tabDelete('307');
    active.tabAdd('/newTrajectoryReplay', '307', $.i18n.prop('轨迹回放'));
    active.tabChange('307', '/newTrajectoryReplay');
    setTimeout(function () {
        var iframe = $("#307")[0].contentWindow;
        iframe.setDeviceNumber(deviceNumber);
    }, 500);
}

function checkLoginState() {
    $.ajax({
        url: "/loginState",
        data: {},
        dataType: "json",
        type: "get",
        timeout: 30000,
        error: function (data, type, err) {
            console.log(err);
            window.location.replace(window.location.href);
        },
        success: function (data) {
            console.log(data)
            // layer.closeAll('loading');
            if (data.state != 'success') {
                window.location.replace(window.location.href);
            }
        }
    });
}
function getUserInfo() {
    $.ajax({
        url: "user/selUserDetails",
        data: {},
        dataType: "json",
        type: "post",
        timeout: 30000,
        error: function (data, type, err) {
            console.log(err);
        },
        success: function (data) {
            userData = data.data;
            sendBroadcast("initQrcode", null);
            if (userData.user.realName == null || userData.user.realName == '') {
                $("#realName").text(userData.user.userName);
            } else {
                $("#realName").text(userData.user.realName);
            }
            if ('success' == data.state){
                if (data.data.info != null) {
                    if (data.data.info.logo == '' || data.data.info.logo == null) {
                        $('#logo').attr("src", "img/jxct_logo.png");

                    } else {
                        $('#logo').attr("src", data.data.info.logo);

                    }
                    var span = document.getElementById('span_company');
                    if (data.data.info.company == null) {
                        span.innerHTML = '精讯云';
                    } else {
                        span.innerHTML = data.data.info.company;
                    }
                    if (data.data.info.systematic == null) {
                        document.title = '精讯云';
                    } else {
                        document.title = data.data.info.systematic;
                    }
                } else {
                    $('#logo').attr("src", "img/jxct_logo.png");
                    var span = document.getElementById('span_company');
                    span.innerHTML = '精讯云';
                    document.title = '精讯云';
                }
            }
            var num1 = userData.info.style;
            $('.style').attr("disabled", "disabled");
            $('.style').eq(num1).removeAttr("disabled");
            document.querySelector('#logo').onload = function(){
                var top=$('#layui-logo').height();
                console.log(top);
                $('#layui-logo').addClass('logofixed');
                var indexnav=document.getElementById('index-nav');
                indexnav.style.marginTop=top+'px';
                var height=$(window).height();
                var maxheight=height-top;
                console.log(maxheight);
                indexnav.style.height=maxheight+'px'
            }
        }
    });
}
/**
 * 设置语言
 */
function setLanguage(local) {
    setCookie('jxct_lang', local, 30);
    window.location.reload();
}
/**
 * 报警初始化
 *

 <audio src="sound/alarm.mp3" id="alarm" loop="loop"></audio>
 <link rel="stylesheet" href="../static/tost/src/jquery.toast.css">
 <script type="text/javascript" src="../tost/src/jquery.toast.js"></script>
 <script th:src="@{/static/js/socket.js?v=1}" charset="utf-8"></script>
 */
initSocket(function (data) {
    // console.log(data);
});
var warbntflge=true;
function warbnt(){
    if(warbntflge){
        $('.layui-side').css('left', '220px');
        $('.war-bnt').hide();
        warbntflge=!warbntflge;
        $('.war-motai').show();
    }else {
        $('.layui-side').css('left', '0');
        $('.war-bnt').show();
        warbntflge=!warbntflge;
        $('.war-motai').hide();
    }
}
function warbntmotai(){
    if(warbntflge){
        $('.layui-side').css('left', '220px');
        $('.war-bnt').css('left', '220px');
        warbntflge=!warbntflge;
        $('.war-motai').hide();

    }else {
        $('.layui-side').css('left', '0');
        $('.war-bnt').css('left', '0');
        warbntflge=!warbntflge;
        $('.war-motai').hide();
        $('.war-bnt').show();

    }
}
