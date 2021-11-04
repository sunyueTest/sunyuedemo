/**
 *初始化layui
 */
let layer;
layui.use(['form', 'layer', 'layedit', 'laydate'], function () {
    layer = layui.layer;
});
/**
 * 自定义滚动条初始化
 * 全部投稿、当前专家、在线咨询、专家列表
 */
$(function(){
    scroll=function(){
        var oMyBar3 = new MyScrollBar({
            selId: 'wrapper3',
            enterColor: '#999',
            enterShow: false,
            bgColor: 'rgba(50, 50, 50, 0.2)',
            barColor: '#2E8EEA',
            enterColor: '#056FD8',
            hasX: false,
            hasY: true,
            width: 6
        })
        var oMyBar4 = new MyScrollBar({
            selId: 'wrapper4',
            enterColor: '#999',
            enterShow: false,
            bgColor: 'rgba(50, 50, 50, 0.2)',
            barColor: '#2E8EEA',
            enterColor: '#056FD8',
            hasX: false,
            hasY: true,
            width: 6
        })

    }
    scroll();
});
/**
 * 获取专家信息列表
 */
var onLine='';//当前点击的是否在线
var username='';//当前专家名称
var createUser=''
var data_name="";
var data_id=0;
$(function () {
    $.ajax({
        url: "../expertManage/findExpertManageList",
        type: "POST",
        data: {},
        success: function (res) {
            // console.log('获取专家列表');
            // console.log(res);
            var $expertManageList = $(".expertManageList");
            $expertManageList.empty();
            if (res.state == "success") {
                var expertManageList = res.data.list;
                if (expertManageList.length > 0) {
                    var expertManage;
                    for (var i = 0; i < expertManageList.length; i++) {
                        expertManage = expertManageList[i];
                        var $expertManage =
                            $("<li class='expertManage' " +
                                "data_pic='" + expertManage.headPhotoPic + "' " +
                                "data_name='" + expertManage.name + "' " +
                                "data_personalInfo='" + expertManage.personalInfo + "' " +
                                "data_id='" + expertManage.id + "' " +
                                "data_userName='" + expertManage.createUser + "'>" +
                                "<p>" + expertManage.name + "</p></li>");
                        $expertManage.appendTo($expertManageList);
                    }
                }
                var expert = expertManageList[0];
                //初始加载显示第一个专家的头像，基本信息
                findExpert(expert);
                //初始加载查询第一个专家的文章
                createUser=expert.createUser;
                // findJournalism(expert.createUser)
                // //初始加载查询第一个专家的信息发布
                // findArticleList(expert.createUser)
                findJournalism(createUser);
                //初始加载查询第一个专家的信息发布
                findArticleList(createUser);
                $('.expertManage').eq(0).addClass('ac');
                username=res.data.list[0].createUser;
                onLine=res.data.list[0].onLine;
                if(onLine==0){
                    $('#title-text').html('留言咨询<span class="title-text-top"></span><span class="title-text-bottom"></span>');
                    $("#specialistreply").attr("placeholder","请输入留言信息");
                    $('#int-state').html('<div  class="int-state-no">状态：●离线</div><div class="order" onclick="order('+res.data.list[0].id+')">预约专家</div>');
                    $('#addmessage').html('<p id="addly">发送</p>');
                }else {
                    $('#title-text').html('在线咨询<span class="title-text-top"></span><span class="title-text-bottom"></span>');
                    $("#specialistreply").attr("placeholder","请输入聊天信息");
                    $('#int-state').html('<div  class="int-state-yes">状态：●在线</div><div class="order" onclick="order('+res.data.list[0].id+')">预约专家</div>');
                    $('#addmessage').html('<p id="addfs">发送</p>');
                }
            }
        }
    })
});
/**
 * 专家回复消息
 */
function onReceive(type, data) {
    console.log(type);
    if ('topic' == type) {
        // console.log('接受');
        let arry=data.split('#::');
        // console.log(arry);
        // let data=data;
        let html='                <div>\n' +
            '                    <div class="consult-l">\n' +
            '                        <div class="consult-l-pic"><img src="/static/img/agriculture/zhuanjia.png" style="transform: scale(0.6)" alt=""></div>\n' +
            '                        <div class="consult-l-txt">\n' +
            '                            <p>'+arry[1]+'</p>\n' +
            '                        </div>\n' +
            '                    </div>\n' +
            '                </div>'
        $('#consult').append(html);
    }
}
function send(user, data) {
    parent.send(user, data);
}
function specialistreply(){
    console.log(username);
    var specialistreply=$('#specialistreply').val();
    var html='                <div>\n' +
        '                    <div class="consult-r">\n' +
        '                        <div class="consult-r-txt" style="white-space: pre-wrap"><p>'+specialistreply+'</p></div>\n' +
        '                        <div class="consult-r-pic"><img src="/static/img/agriculture/yonghu.png" style="transform: scale(0.6)" alt=""></div>\n' +
        '                    </div>\n' +
        '                </div>'
    if(!specialistreply.length){
        layer.msg('请输入发送信息');
        return;
    }
    $('#consult').append(html);
    $("#specialistreply").val('');
    send(username,specialistreply);
}
/**
 * 发送消息
 */
$(document).on('click', '#addfs', function () {
    specialistreply();
});
$(document).keyup(function(event){
    if(event.keyCode ==13){
        if(onLine==0){
            $("#addly").trigger("click");
        }else {
            $("#addfs").trigger("click");
        }
    }
});
/**
 * 留言弹出
 */
function findSeethemessage() {
    //页面层
    layer.open({
        type: 2,
        skin: 'layui-layer-rim', //加上边框
        area: ['70vw', '70vh'], //宽高
        content: '../agriculture/seethemessage'
    });
}

/**
 * 预约专家申请
 */
function order(expertsId) {
    //页面层
    layer.open({
        type: 2,
        skin: 'layui-layer-rim', //加上边框
        area: ['50vw', '60vh'], //宽高
        content: '../sysUserOrder/toAddOrder?expertsId='+expertsId
    });
}

/**
 * 预约记录列表弹窗
 */
function findorderList() {
    //页面层
    layer.open({
        type: 2,
        skin: 'layui-layer-rim', //加上边框
        area: ['85vw', '90vh'], //宽高
        content: '../sysUserOrder/findorderList'
    });
}

/**
 * 专家点击事件
 */
    $(document).on('click', '.expertManage', function () {
    let data_pic = $(this).attr("data_pic");
    data_name = $(this).attr("data_name");
    let data_personalInfo = $(this).attr("data_personalInfo");
    let data_userName = $(this).attr("data_userName");
    data_id = $(this).attr("data_id");
    username=data_userName;
    console.log(username);
    $('.expertManage').removeClass('ac');
    $(this).addClass('ac');
    let expert=new Object();
    expert.headPhotoPic=data_pic;
    expert.name=data_name;
    expert.personalInfo=data_personalInfo;
    expert.createUser=data_userName;
    //显示专家的头像，基本信息
    findExpert(expert);
    //查询专家的文章
    findJournalism(expert.createUser);
    //查询专家的信息发布
    findArticleList(expert.createUser);
    $.ajax({
        url: "../expertManage/findExpertExamineVal",
        type: "POST",
        data: {
            id:data_id,
        },
        success: function (res) {
            console.log(res); //0离线 1在线
            onLine=res.data.onLine;
            console.log(onLine);
            if(onLine==0){
                $('#title-text').html('留言咨询<span class="title-text-top"></span><span class="title-text-bottom"></span>')
                $("#specialistreply").attr("placeholder","请输入留言信息");
                $('#int-state').html('<div  class="int-state-no">状态：●离线</div><div  class="order" onclick="order('+res.data.id+')">预约专家</div>');
                $('#addmessage').html('<p id="addly">发送</p>');
            }else {
                $('#title-text').html('在线咨询<span class="title-text-top"></span><span class="title-text-bottom"></span>');
                $("#specialistreply").attr("placeholder","请输入聊天信息");
                $('#int-state').html('<div  class="int-state-yes">状态：●在线</div><div  class="order" onclick="order('+res.data.id+')">预约专家</div>');
                $('#addmessage').html('<p id="addfs">发送</p>');
            }
        }
    })
});
/**
 * 显示专家的头像，基本信息
 */
findExpert = function (expert) {
    if (expert.headPhotoPic.length > 0) {
        $(".teacher-pic img").attr("src", expert.headPhotoPic);
    }
    $(".teacher-int h4").html(expert.name);
    $(".teacher-int p").html(expert.personalInfo);
};
/**
 * 查询专家的新闻
 */
findArticleList = function (userName) {
    $.ajax({
        url: "../expertManage/findArticleList",
        type: "POST",
        data: {
            type: 1,
            userName: userName
        },
        success: function (res) {
            // $(".newlist").empty();
            console.log(res);
            if (res.state == "success") {
                var imgReg = /<img.*?(?:>|\/>)/gi;
                var list = res.datas;
                if (list.length > 0) {
                    let article;
                    let html="";
                    for (let i = 0; i < list.length; i++) {
                        article = list[i];
                        let arr = article.content.match(imgReg);
                        html += '<div class="int-new-l" data-id="' + article.id + '">\n'
                        if (article.content.match(imgReg) == null) {
                            html += '<div class="inl-pic"><img src="/static/img/newpublic.jpg" alt=""></div>\n'
                        } else {
                            html += '<div class="inl-pic">' + arr[0] + '</div>\n'

                        }
                        html += '<div class="inl-txt">\n' +
                            '<p>' + article.title + '</p>\n' +
                            '<div style="display: flex; justify-content: space-between;">\n' +
                            '<p>' + article.createTime + '</p>\n' +
                            '<p>' + article.expertName + '</p>\n' +
                            '</div>\n' +
                            '</div>\n' +
                            '</div>'
                    }
                    $('#newlist').html(html);
                }else {
                    $('#newlist').html('');
                }
            }
        }
    })
};

/**
 * 查询专家的文章
 */
findJournalism = function (userName) {
    $.ajax({
        url: "../expertManage/findArticleList",
        type: "POST",
        data: {
            type: 0,
            userName: userName,
        },
        success: function (res) {
            $(".teacher-new").empty();
            console.log(res);
            if (res.state == "success") {
                let imgReg = /<img.*?(?:>|\/>)/gi;
                let list = res.datas;
                if (list.length > 0) {
                    let article;
                    let html="";
                    for (let i = 0; i < list.length; i++) {
                        article = list[i];
                        let arr = article.content.match(imgReg);
                        html += '<div class="int-new-l" data-id="' + article.id + '">\n'
                        if (article.content.match(imgReg) == null) {
                            html += '<div class="inl-pic"><img src="/static/img/newpublic.jpg" alt=""></div>\n'
                        } else {
                            html += '<div class="inl-pic">' + arr[0] + '</div>\n'
                        }
                        html += '<div class="inl-txt">\n' +
                            '<p>' + article.title + '</p>\n' +
                            '<div style="display: flex; justify-content: space-between;">\n' +
                            '<p>' + article.createTime + '</p>\n' +
                            '<p>' + article.expertName + '</p>\n' +
                            '</div>\n' +
                            '</div>\n' +
                            '</div>'
                    }
                    $('.teacher-new').html(html);
                }else {
                    $('.teacher-new').html('');

                }
            }
        }
    })
}
/**
 * 判断是否是专家
 * level获取级别
 * 判断是否显示申请成为专家
 * isexamine（）判断申请状态
 */
let userData;
let level=parent.userData.user.level;
if(level==1||level<1){
    $('#xiugai').hide();
}else{
    $('#xiugai').show();
}
function isexamine(){
    $.ajax({
        url: "../expertManage/findExpertExamineVal_Two",
        type: "POST",
        data: {
            type:'1',
        },
        success: function (res) {
            console.log('判断级别');
            console.log(res);
            console.log(level);
            if (res.data == null) {

            } else if (res.data.examine == 0) {
                let html = '<p>正在审核，请耐心等待</p>\n';
                $('#xiugai').html(html);
            } else if (res.data.examine == 1) {
                let html = '<p>审核通过您已成为专家</p>\n';
                $('#xiugai').html(html);
            } else if (res.data.examine == 2) {
                let html = '<p>审核未通过请重新提交申请</p>\n';
                $('#xiugai').html(html);
            }
        }
    })
}
isexamine();
/**
 * 申请成为专家验证、
 */
var name = '';/*姓名*/
var goodAtFish = '';/*擅长*/
var idCardNo = '';/*身份证*/
var goodAtDisease = '';/*擅长病种*/
var workUnits = '';/*工作单位*/
var position = '';/*职务*/
var phoneNo = '';/*手机号码*/
var educationalBackground = '';///*学历*/
var idCardPicPositive = '';/*身份证正面*/
var idCardPicReverse = '';/*身份证反面*/
var certificatePic = '';/*资质证书*/
var headPhotoPic = '';/*头像*/
var personalInfo = '';/*个人简介*/
var type = '0';/*农业0 渔业1*/
var id=0;//专家申请ID*/
$(document).on('click', '#getteacher', function () {
    let idCardNoreg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;//身份证
    name = $("#name").val();
    goodAtFish = $("#goodAtFish").val();
    idCardNo = $("#idCardNo").val();
    goodAtDisease = $("#goodAtDisease").val();
    workUnits = $("#workUnits").val();
    position = $("#position").val();
    phoneNo = $("#phoneNo").val();
    educationalBackground = $("#educationalBackground").val();
    personalInfo = $("#personalInfo").val().trim();
    if(!goodAtFish){
        layer.msg('请输入擅长病因');
        return;
    }
    if(!name){
        layer.msg('请输入姓名');
        return;
    }
    if(!goodAtDisease){
        layer.msg('请输入擅长');
        return;
    }
    if(!idCardNoreg.test(idCardNo)){
        layer.msg('请输入正确的身份证号');
        return;
    }
    if(!workUnits){
        layer.msg('请输入工作单位');
        return;
    }
    if(!position){
        layer.msg('请输入职务');
        return;
    }
    if(!(/^1\d{10}$/.test(phoneNo))){
        layer.msg('请输入正确的手机号码');
        return;
    }
    if(!educationalBackground){
        layer.msg('请输入最高学历');
        return;
    }
    if(!personalInfo){
        layer.msg('请输入个人简介');
        return;
    }
    if(!headPhotoPic){
        layer.msg('请上传头像');
        return;
    }
    if(!idCardPicPositive){
        layer.msg('请上传身份证正面');
        return;
    }
    if(!idCardPicPositive){
        layer.msg('请上传身份证正面');
        return;
    }
    if(!idCardPicReverse){
        layer.msg('请上传身份证反面');
        return;
    }
    if(!certificatePic){
        layer.msg('请上传资质证书');
        return;
    }
    $.ajax({
        url: "../expertManage/addExpert",
        type: "POST",
        data: {
            id:id,
            name: name,//姓名
            goodAtFish: goodAtFish,//擅长
            idCardNo: idCardNo,//身份证
            goodAtDisease: goodAtDisease,//擅长病种
            workUnits: workUnits,//工作单位
            position: position,//职务
            phoneNo: phoneNo,//手机号码
            educationalBackground: educationalBackground,//学历
            idCardPicPositive: idCardPicPositive,//身份证正面
            idCardPicReverse: idCardPicReverse,//身份证反面
            certificatePic: certificatePic,//资质证书
            headPhotoPic: headPhotoPic,//头像
            personalInfo: personalInfo,//个人简介
            type: 0,//农业0 渔业1
            examine:0,//未审核：0   通过 ：1
            isDelete:0, //删除：1  未删除 0
        },
        success: function (res) {
            if(res.state=="success"){
                layer.msg('提交申请成功请耐心等待审核');
                $('#tc').hide()
                isexamine()
            }
            console.log(res)

        }
    })
});
$(document).on('click', '.nav_li', function () {
    var valueData=$(this).attr("valueData");
    $("#homeIframe").attr("src","../agriculture/pageSkipping?valueData="+valueData);
});

layui.use('upload', function () {
    var $ = layui.jquery
        , upload = layui.upload;

    //头像图片上传
    var uploadInst = upload.render({
        elem: '#test1'
        , url: '/aquacultureSystemSetting/uploadFile'
        , before: function (obj) {
            //预读本地文件示例，不支持ie8
            obj.preview(function (index, file, result) {
                $('#demo1').attr('src', result); //图片链接（base64）
            });
        }
        , done: function (res) {
            //如果上传失败
            if (res.code > 0) {
                return layer.msg('上传失败');
            }
            //上传成功
            console.log(res)
            headPhotoPic = res.msg
        }
        , error: function () {
            //演示失败状态，并实现重传
            var demoText = $('#demoText');
            demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
            demoText.find('.demo-reload').on('click', function () {
                uploadInst.upload();
            });
        }
    });
    //身份证正面图片上传
    var idCardPicPositivea = upload.render({
        elem: '#test2'
        , url: '/aquacultureSystemSetting/uploadFile'
        , before: function (obj) {
            //预读本地文件示例，不支持ie8
            obj.preview(function (index, file, result) {
                $('#demo2').attr('src', result); //图片链接（base64）
            });
        }
        , done: function (res) {
            //如果上传失败
            if (res.code > 0) {
                return layer.msg('上传失败');
            }
            //上传成功
            console.log(res)
            idCardPicPositive = res.msg
        }
        , error: function () {
            //演示失败状态，并实现重传
            var demoText = $('#demoText');
            demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
            demoText.find('.demo-reload').on('click', function () {
                idCardPicPositivea.upload();
            });
        }
    });
    //身份证反面图片上传
    var idCardPicReversea = upload.render({
        elem: '#test3'
        , url: '/aquacultureSystemSetting/uploadFile'
        , before: function (obj) {
            //预读本地文件示例，不支持ie8
            obj.preview(function (index, file, result) {
                $('#demo3').attr('src', result); //图片链接（base64）
            });
        }
        , done: function (res) {
            //如果上传失败
            if (res.code > 0) {
                return layer.msg('上传失败');
            }
            //上传成功
            console.log(res);
            idCardPicReverse = res.msg
        }
        , error: function () {
            //演示失败状态，并实现重传
            var demoText = $('#demoText');
            demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
            demoText.find('.demo-reload').on('click', function () {
                idCardPicReversea.upload();
            });
        }
    });
    //资质证书图片上传
    var certificatePica = upload.render({
        elem: '#test4'
        , url: '/aquacultureSystemSetting/uploadFile'
        , before: function (obj) {
            //预读本地文件示例，不支持ie8
            obj.preview(function (index, file, result) {
                $('#demo4').attr('src', result); //图片链接（base64）
            });
        }
        , done: function (res) {
            //如果上传失败
            if (res.code > 0) {
                return layer.msg('上传失败');
            }
            //上传成功
            console.log(res);
            certificatePic = res.msg
        }
        , error: function () {
            //演示失败状态，并实现重传
            var demoText = $('#demoText');
            demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
            demoText.find('.demo-reload').on('click', function () {
                certificatePica.upload();
            });
        }
    });
});
var xiugai = document.getElementsByClassName('xiugai');
var chaxun = document.getElementsByClassName('chaxun');
var tc = document.getElementById('tc');
var dele = document.getElementById('dele');
var tc2 = document.getElementById('tc2');
var dele2 = document.getElementById('dele2');
$(document).on('click', '#xiugai', function () {
    tc.style.display = 'block';
    $.ajax({
        url: "../expertManage/findExpertExamineVal_Two",
        type: "POST",
        data: {
            type:'1'
        },
        success: function (res) {
            if (res.data == null) {

            } else if (res.data.examine == 0) {
                var html = '<p class="tc-p" style="">正在审核，请耐心等待</p>\n' +
                    '<div id="dele"></div>';
                $('#tc').html(html);
            } else if (res.data.examine == 1) {
                var html = '<p class="tc-p" style="">审核通过您已成为专家</p>\n' +
                    '<div id="dele"></div>';
                $('#tc').html(html);
            } else if (res.data.examine == 2) {
                // var html='<p class="tc-p" style="">审核未通过请重新提交申请</p> \n' +
                //     '<div id="dele"></div>'
                // $('#tc').html(html)
                id=res.data.id;
                $("#name").val(res.data.name);//姓名
                $("#goodAtFish").val(res.data.goodAtFish);//擅长
                $("#idCardNo").val(res.data.idCardNo);//身份证
                $("#goodAtDisease").val(res.data.goodAtDisease);//擅长病种
                $("#workUnits").val(res.data.workUnits);//工作单位
                $("#position").val(res.data.position);//职务
                $("#phoneNo").val(res.data.phoneNo);//手机号码
                $("#educationalBackground").val(res.data.educationalBackground);//学历
                $("#demo2").attr('src',res.data.idCardPicPositive);//身份证正面
                $("#demo3").attr('src',res.data.idCardPicReverse);//身份证反面
                $("#demo4").attr('src',res.data.certificatePic);//资质证书
                $("#demo1").attr('src',res.data.headPhotoPic);//头像
                $("#personalInfo").val(res.data.personalInfo);
                idCardPicPositive=res.data.idCardPicPositive;
                idCardPicReverse=res.data.idCardPicReverse;
                certificatePic=res.data.certificatePic;
                headPhotoPic=res.data.headPhotoPic;
            }
            console.log(res);
        }
    })
});
$(document).on('click', '.chaxun', function () {
    tc.style.display = 'block';
});
$(document).on('click', '#dele', function () {
    tc.style.display = 'none';
});
/**
 * 查询用户详情
 */
$(function () {
    $.ajax({
        url: "/user/selUserDetails",
        data: {},
        dataType: "json",
        type: "post",
        timeout: 30000,
        error: function (data, type, err) {
            console.log(err);
        },
        success: function (data) {
            userData = data.data;
        }
    });
})

$(document).on('click', '.int-new-l', function () {
    var id=this.getAttribute("data-id");
    console.log(id);
    $.ajax({
        url: "../expertManage/findArticle?id="+id,
        type : "POST",
        data: {
        },
        success: function (res) {
            // console.log(res.data.content)
            var html=res.data.content;
            $('#tcint').html(html);
            $(".tc-title p").html(res.data.title)
            var oMyBar5 = new MyScrollBar({
                selId: 'wrapper5',
                enterColor: '#999',
                enterShow: false,
                bgColor: 'rgba(50, 50, 50, 0.2)',
                barColor: '#2E8EEA',
                enterColor: '#056FD8',
                hasX: false,
                hasY: true,
                width: 6
            })
        }
    })
    tc2.style.display='block';
});
/**
 * 新闻详情删除按钮
 * 兼容自定义滚动条；每次删除都要删除已经存在的滚动条；下次点击重新渲染；重新添加结构
 */
dele2.onclick=function(){
    tc2.style.display='none';
    $('#tcint').html("");
    $(".tc-title p").html("");
    let html='        <div class="tc-int scroll" id="tcint" style="box-sizing: border-box;padding: 2vh 2vw">\n' +
        '            <h2>台风“杨柳”携风雨远去 南方“苦夏”熬到头</h2>\n' +
        '            <div class="tc-int-txt">\n' +
        '            </div>\n' +
        '        </div>'
    $('#wrapper5').html(html);
}

/**
 * 留言点击
 */
$(document).on('click', '#addly', function () {
    console.log(id);
    var species=$('#specialistreply').val();
    console.log(species);
    if(!species.length){
        layer.msg('请输入留言信息');
        return;
    }
    $.ajax({
        url: "../productService/addExpertsDiagnosis",
        type: "POST",
        data: {
            expertsId: data_id,
            expertsName:data_name,
            species: species,
        },
        success: function (res) {
            console.log(res)
            var html='                <div>\n' +
                '                    <div class="consult-r">\n' +
                '                        <div class="consult-r-txt" style="white-space: pre-wrap"><p>'+species+'</p></div>\n' +
                '                        <div class="consult-r-pic"><img src="/static/img/agriculture/yonghu.png" style="transform: scale(0.6)" alt=""></div>\n' +
                '                    </div>\n' +
                '                </div>'
            $('#consult').append(html)
            $("#specialistreply").val('');
        }
    })
});



