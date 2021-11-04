var deviceLength;
layui.use(['form', 'layedit', 'laydate'], function () {
    var form = layui.form
        , layer = layui.layer
        , layedit = layui.layedit
        , laydate = layui.laydate;

    //常规用法
    laydate.render({
        elem: '#test1'
    });
});
/**
 * 一级公司名称列表渲染插入
 */
var navsum= new Array;
function getlistnav(){
    $.ajax({
        url: "/projectBaseScene/findEntperpriseList",
        type : "POST",
        data: {
            size:200,
            page:1,
        },
        success: function (res) {
            console.log(res)
            let html='';
            $.each(res.datas, function (i, item) {
                navsum.push(item.id);
                html += '<li class="layui-nav-item nav-li" data-id="'+item.id+'">' +
                    '<a href="javascript:;" class="gs">'+item.name+'</a>' +
                    '<div class="layui-nav-child  nav-xm">'+
                    '</div>'+
                    '</li>'
            });
            $('#nav-left').append(html);
            getlistxm();

        }
    });
}
getlistnav();
/**
 * 二级项目名称列表渲染插入
 * 渲染二级列表时会同时初始化页面
 */
var navxm= new Array;
function getlistxm(){
    for(var i=0;i<navsum.length;i++){
        let id=navsum[i];
        let index=i;
        $.ajax({
            async: false,
            url: "/projectBaseScene/findProjectList?entperpriseId="+id,
            type : "POST",
            data: {
                size:200,
                page:1,
            },
            success: function (res) {
                // console.log(res);
                let html='';
                $.each(res.datas, function (i, item) {
                    navxm.push(item.id);
                    html += '                      <div class="layui-nav-item nav-jd" data-id="'+item.id+'" id="'+item.id+'">\n' +
                        '                            <a href="javascript:;" class="xmbg">'+item.name+'</a>\n' +
                        '                        </div>'
                });
                $('.nav-xm').eq(index).append(html);
            }
        });
        if(i==navsum.length-1){
            getlistjd();
            jdinitialize(navxm);
        }
    }
}
/**
 * 三级基地名称
 */
function getlistjd(){
    for(var i=0;i<navxm.length;i++){
        let id=navxm[i];
        $.ajax({
            url: "/projectBaseScene/findBaseList?projectId="+id,
            type : "POST",
            data: {
                size:200,
                page:1,
            },
            success: function (res){
                let html='';
                $.each(res.datas, function (i, item){
                    html += '<div class="layui-nav-child base item" baseid="'+item.id+'" basename="'+item.name+'" baseuser="'+item.createUser+'"  lon="'+item.longitude+'" lat="'+item.latitude+'">'+item.name+'</div>'
                });
                $('#'+id).append(html);
                // $(".item").eq(0).trigger("click");
                layui.use('element', function(){
                    var element = layui.element; //导航的hover效果、二级菜单等功能，需要依赖element模块
                });
            }
        });
    }
}
/**
 * 页面初始化
 */
function jdinitialize(navxm){
    var fige='';
    for(var i=0;i<navxm.length;i++){
        if(!fige){
            $.ajax({
                async: false,
                url: "/projectBaseScene/findBaseList?projectId="+navxm[i],
                type : "POST",
                data: {
                    size:200,
                    page:1,
                },
                success: function (res){
                    if(res.datas.length>0){
                        let lon=res.datas[0].longitude;
                        let lat=res.datas[0].latitude;
                        let name=res.datas[0].name;
                        let user=res.datas[0].createUser;
                        let id=res.datas[0].id;

                        getScene(id);
                        fige=true;
                        console.log(fige);
                    }
                }
            });
        }
    }
}
/**
 * 点击切换页面内容
 */
$(document).on('click','.item',function(){
    // $(".deviceCenterBox").css("display", "none");
    // $(".cameraDeviceBox").css("display", "none");
    $(".item").removeClass("baseac");
    $(this).addClass("baseac");
    //点击基地获取基地下对应的场景
    getScene($(this).attr("baseId"));
});












$(function () {
    var wHeight = $(window).height();
    $(".contentBox").height(wHeight - 10);
    $(".itemBox").height($(".leftBox").height() - $(".searchBox").height() - 15 - 30);
    $(".rightBox").height($(".contentBox").height());
    $(".camera").height($(".cameraDeviceBox").height() - $(".cameraDeviceTitle").height());
    $(".deviceItemBox").height($(".deviceCenterBox").height() - $(".deviceCenterTitleBox").height());

    $(window).resize(function () {
        var wHeight = $(window).height();
        $(".contentBox").height(wHeight - 10);
        $(".itemBox").height($(".leftBox").height() - $(".searchBox").height() - 15 - 30);
        $(".rightBox").height($(".contentBox").height());
        $(".camera").height($(".cameraDeviceBox").height() - $(".cameraDeviceTitle").height());
        $(".deviceItemBox").height($(".deviceCenterBox").height() - $(".deviceCenterTitleBox").height());


    });


    //获取左侧菜单信息
    // getLeftItem();


    $(".cameraBox").hover(function () {
        $(".cameraTitle").css("background", "none");
        $(".cameraItemBox").css("display", "block");
        $(".cameraBox").css("background", "-webkit-linear-gradient(#064b7f , #027589)");
        $(".cameraBox").css("background", "-o-linear-gradient(#064b7f , #027589)");
        $(".cameraBox").css("background", "-moz-linear-gradient(#064b7f , #027589)");
        $(".cameraBox").css("background", "linear-gradient(#064b7f , #027589)");
    }, function () {
        $(".cameraTitle").css("background", "-webkit-linear-gradient(#064b7f , #027589)");
        $(".cameraTitle").css("background", "-o-linear-gradient(#064b7f , #027589)");
        $(".cameraTitle").css("background", "-moz-linear-gradient(#064b7f , #027589)");
        $(".cameraTitle").css("background", "linear-gradient(#064b7f , #027589)");
        $(".cameraBox").css("background", "none");
        $(".cameraItemBox").css("display", "none");
    });

    $(".deviceBox").click(function () {
        $(".deviceCenterBox").css("display", "block");
        $(".cameraDeviceBox").css("display", "none");
    });
    $(".closeBtn").click(function () {
        $(".cameraDeviceBox").css("display", "none");
    });
    $(".deviceCenterCloseBtn").click(function () {
        $(".deviceCenterBox").css("display", "none");
    });
});

//获取左侧菜单信息
function getLeftItem() {
    $.ajax({
        type: "POST",
        url: "/projectBaseScene/listBases",
        async: true,
        data: {
            page: 1,
            size: 100
        },
        dataType: "json",
        success: function (res) {
            var resData = res.datas;
            if (resData && resData.length > 0) {
                addLeftItem(resData);
            }


        },
        error: function (e) {
            console.log(e);
        }
    });
}

//添加左侧菜单
function addLeftItem(msg) {
    var $itemBox = $(".itemBox");
    $itemBox.empty();
    for (var i = 0; i < msg.length; i++) {
        var $item = $("<span class='item'></span>");
        $item.text(msg[i].name);
        $item.attr("baseId", msg[i].id);
        $item.appendTo($itemBox);

    }


    $(".item").click(function () {
        $(".deviceCenterBox").css("display", "none");
        $(".cameraDeviceBox").css("display", "none");
        $(".item").removeClass("checkedItem");
        $(this).addClass("checkedItem");
        //点击基地获取基地下对应的场景
        getScene($(this).attr("baseId"));

        //给没有设备的位置增加 补位图


    });
    $(".item").eq(0).trigger("click");


}

$("#autograph").click(function(){
    $("#autograph").attr("disabled",true);
    setTimeout(function(){
        $("#autograph").attr("disabled",false);
    },2000)
});

//通过基地获取场景信息
function getScene(baseId) {
    $.ajax({
        type: "POST",
        url: "/projectBaseScene/listScenesByBaseId",
        async: true,
        data: {
            baseId: baseId,
            sceneType: 2
        },
        dataType: "json",
        success: function (res) {
            deviceLength = 0;
            var $cameraItemBox = $(".cameraItemBox");
            $cameraItemBox.empty();
            var $rightBottomItemBox = $(".deviceItemBox");
            $rightBottomItemBox.empty();


            //resData基地下所有场景
            var resData = res.datas;
            //遍历基地下所有的场景
            if (resData.length > 0) {
                for (var i = 0; i < resData.length; i++) {
                    getCamera(resData[i].id);


                    //获取继电器设备    获取场景id
                    getAllDevice(resData[i].id);
                }


            } else {
                callFuncInMain('visible',false);
                $rightBottomItemBox.html('<img class="cameraItemBoxNoMsg" src="../../../static/img/agriculture/noMsg.png" style="display: block;">');
            }
            if (deviceLength == 0) {
                $rightBottomItemBox.html('<img class="cameraItemBoxNoMsg" src="../../../static/img/agriculture/noMsg.png" style="display: block;">');
            }

        },
        error: function (e) {
            console.log(e);
        }
    });
}


function callFuncInMain(funcName, data) {
    var message = {
        'funcName': funcName, // 所要调用父页面里的函数名
        'param': data
    }
    var iframe = document.getElementById('iframe');
    // 向父窗体(用户主页面)发送消息
    // 第一个参数是具体的信息内容，
    // 第二个参数是接收消息的窗口的源（origin），即"协议 + 域名 + 端口"。也可以设为*，表示不限制域名，向所有窗口发送
    iframe.contentWindow.postMessage(message, '*');
}

//获取场景下摄像头信息
function getCamera(sceneId, i) {
    $.ajax({
        type: "POST",
        url: "../cameraApplication/getPerspectiveCameraList",
        async: false,
        data: {
            page: 1,
            size: 100,
            appId: sceneId,
            appType: 1

        },
        dataType: "json",
        success: function (res) {


            var resData = res.datas;
            if (resData.length > 0) {
                var resData = res.datas;
                camerNumberList = resData;
                addCameraItem(resData);


            } else {

            }

        },
        error: function (e) {
            console.log(e);
        }
    });
}


function addCameraItem(cameraMsg, $cameraItemBox) {
    var $cameraItemBox = $(".cameraItemBox");
    for (var j = 0; j < cameraMsg.length; j++) {
        var $cameraItem = $("<div class='cameraItem'></div>");
        $cameraItem.attr("cameraId", cameraMsg[j].cameraId);
        $cameraItem.text(cameraMsg[j].cameraName);
        $cameraItem.appendTo($cameraItemBox);


        //点击摄像头名称，加载摄像头
        $cameraItem.click(function () {
            $(".deviceCenterBox").css("display", "none");
            $(".cameraDeviceBox").css("display", "block");
            $(".cameraDeviceTitleText").text($(this).text());
            getCamareUrl($(this).attr("cameraid"));

        })


    }

}


// 获取视频监控url
function getCamareUrl(id) {
    var $playerBox = $(".camera");
    $("#player").remove();
    $("#playerNoData").remove();
    var $player = $('<video  style="width: 100%;height:100%;" poster="" controls playsInline webkit-playsinline autoplay></video>');
    var $rtmpHd = $('<source  type="rtmp/flv"/>');
    var $hlsHd = $('<source type="application/x-mpegURL"/>');
    $player.attr("id", "player");
    $rtmpHd.attr("id", "rtmpHd");
    $hlsHd.attr("id", "hlsHd");
    $rtmpHd.appendTo($player);
    $hlsHd.appendTo($player);
    $player.appendTo($playerBox);
    var $playerNoData = $('<div style = "height: 100%; width: 100%; text-align: center;position:absolute;top:0; background-color: black;"></div>');
    var $nomsg = $("<span class='nomsg' style ='position:absolute;left:0.5rem;'></span>");
    var $img = $('<img src="../static/img/playBtn.png" style="width: 2rem; margin-top: 1.5rem />');
    $playerNoData.attr("id", "playerNoData");
    $nomsg.appendTo($playerNoData);
    $img.appendTo($playerNoData);
    $playerNoData.appendTo($playerBox);
    $.ajax({
        type: "GET",
        url: "../cameraManage/getPlayerAddress",
        dataType: "json",
        async: false,
        data: {
            "id": id,
            "perspective": 1
        },
        success: function (data) {
            if (data.state == 'success') {
                var data = data.data;
                var rtmpHd = document.getElementById("rtmpHd");
                // var hlsHd = document.getElementById("hlsHd");
                rtmpHd.src = data.rtmp;
                // hlsHd.src = data.hlsHd;
                var player = new EZUIPlayer('player');
                $("#player").show();
                $("#playerNoData").hide();
            } else {
                $("#playerNoData").find(".nomsg").text(data.msg).css("display", "block");
            }
        },
        error: function (e) {
            console.log(e);
        }
    });
}


// //3D演示数据
// var isOnload = true;
// function sendDeviceData(iframe, data1, type1) {
//     let data = {title: '2号仓库'};
//     let list = [];
//
//     for (let i = 0; i < type1.length; i++) {
//         list[i] = {name: type1[i], value: data1[i]};
//     }
//     data.list = list;
//     console.log('data: ', data);
//     var send = {funcName: 'updateData', param: data};
//     iframe.contentWindow.postMessage(send, 'http://www.thingjs.com');
//     return sendDeviceData;
// }

//获取基地下采集设备     根据场景id获取对应设备
function getAllDevice(farmId, i) {
    console.log(farmId + "   " + i);
    $.ajax({
        type: "POST",
        url: "/projectBaseScene/listSceneDevices",
        async: false,

        data: {
            page: 1,
            size: 10,
            sceneId: farmId
        },
        dataType: "json",
        success: function (res) {
            //场景下所有设备信息
            var resData = res.datas;
            if (resData.length > 0) {
                let flag = false;
                for (let i = 0; i < resData.length; i++) {
                    if (resData[i].deviceType == 0 && resData[i].data != undefined && resData[i].type != undefined && !flag) {
                        flag = true;

                        //遍历每一台设备
                        var data1 = resData[i].data.split("|");
                        var type1 = resData[i].type.split("/");
                        var iframe = document.getElementById('iframe');

                        let data = {title: '仓库'};
                        let list = [];
                        for (let i = 0; i < type1.length; i++) {
                            list[i] = {name: type1[i], value: data1[i]};
                        }
                        data.list = list;
                        console.log('data: ', data);
                        var send = {funcName: 'updateData', param: data};
                        iframe.contentWindow.postMessage(send, 'http://www.thingjs.com');

                        // iframe.onload = function () {
                        //     isOnload = false;
                        //         sendDeviceData(iframe,data1, type1);
                        // };
                        //
                        // if (!isOnload) {
                        //
                        //     sendDeviceData(iframe, data1, type1);
                        //
                        // }
                    }
                }

                for (var x = 0; x < resData.length; x++) {
                    if (resData[x].deviceType == 2) {
                        //加载继电器开关
                        getEquipmentMsg(resData[x].deviceNumber, i);
                    }
                }
            } else {
                callFuncInMain('visible',false);
            }

        },
        error: function (e) {
            console.log(e);
        }
    });
}

//得到场景下继电器设备
function getEquipmentMsg(ncode, i) {
    $.ajax({
        type: "POST",
        url: "../aquacultureUserSensor/getSensorList",
        data: {size: '100', page: 1, ncode: ncode},
        dataType: "json",
        async: false,
        success: function (res) {
            var resData = res.datas;
            if (resData.length > 0) {
                addEquipment(resData, i);
            } else {


            }


        },
        error: function (e) {
            console.log(e);
        }
    });

}

//创建场景下继电器设备下的设备
function addEquipment(equipmentList, i) {
    deviceLength++;
    var $rightBottomItemBox = $(".deviceItemBox");


    for (var j = 0; j < equipmentList.length; j++) {
        var $rightBottomItem = $("<div class='rightBottomItem'></div>");
        var $deviceName = $("<span class='deviceName'></span>");
        $deviceName.text(equipmentList[j].sensorName);
        var $signalImg = $("<img class='signalImg' src='../../static/img/agriculture/strong.png' />");
        var $Box_points_switch = $("<div class='Box_points_switch' data-control='BOX'></div>");
        $Box_points_switch.attr("id", "Box_points_switch" + (j + 1));
        var $label = $("<label></label>");
        var $switch = $("<input class='mui-switch mui-switch-anim switch' type='checkbox' />");
        if (equipmentList[j].state == '0') {
            $switch.attr("checked", false);
        } else {
            $switch.attr("checked", true);
        }

        /*      $switch.attr("id","switch" + (j+1));*/
        $switch.attr("data-sensorCode", equipmentList[j].sensorCode);
        $switch.attr("data-sensorNcode", equipmentList[j].sensorNcode);

        /*  var $settingBtn = $("<div class='settingBtn'>设置</div>");*/

        $switch.appendTo($label);
        $label.appendTo($Box_points_switch);

        $deviceName.appendTo($rightBottomItem);
        $signalImg.appendTo($rightBottomItem);
        $Box_points_switch.appendTo($rightBottomItem);
        /*         $settingBtn.appendTo($rightBottomItem);*/
        $rightBottomItem.appendTo($rightBottomItemBox);


        $switch.click(function (e) {


            var $that = $(this);

            var indexNum = $(".switch").index(this) + 1;
            //操作继电器开关
            $.ajax({
                type: "POST",
                url: "../aquacultureUserSensor/sendCommand",
                data: {
                    sensorCode: $that.attr("data-sensorCode"),
                    deviceNumber: $that.attr("data-sensorNcode"),
                    command: getIndex($that.attr("data-sensorCode"), $that.attr("data-sensorNcode"), $that.prop("checked") ? true : false)
                },
                dataType: "json",
                success: function (data) {
                    layer.msg(data.msg, {
                        offset: '20rem'
                    });
                    if (data.state == "failed") {
                        setTimeout(function () {
                            if ($that.prop("checked")) {
                                $that.prop("checked", false);
                            } else {
                                $that.prop("checked", true);
                            }

                        }, 200)
                    }
                },
                error: function (e) {
                    setTimeout(function () {
                        if ($that.prop("checked")) {
                            $that.prop("checked", false);
                        } else {
                            $that.prop("checked", true);
                        }

                    }, 200)
                }
            });

        });

    }

}


Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

var getIndex = function (sensorCode, sensorNcode, type) {
    var sensorNcodeLength = sensorNcode.length;
    var index = sensorCode.substring(sensorNcodeLength, sensorCode.length);
    if (index.length > 1) {
        index = index;
    } else {
        index = "0" + index;
    }
    if (type == true) {
        type = "01";
    } else {
        type = "00";
    }
    return index + type;
};
