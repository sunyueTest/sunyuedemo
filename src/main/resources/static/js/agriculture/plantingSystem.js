var camerNumberList = '';
var flag;
$(function () {
    layui.use(['form', 'layedit', 'laydate', 'element'], function () {
        var element = layui.element; //导航的hover效果、二级菜单等功能，需要依赖element模块
    });
    var wHeight = $(window).height();
    $(".contentBox").height(wHeight - 10);
    $(".leftBox").height($(".contentBox").height());
    $(".itemBox").height($(".leftBox").height() - $(".searchBox").height() - 15 - 30);
    $(".rightBox").height($(".contentBox").height());
    $(".camerasScrollBox").height($(".rightCenterBox").height() - 40);
    $(".camera").width(($(".camera").height() * 4 / 3).toFixed(0));
    $(".camerasBox").width(($(".camera").width() * 12 + 2).toFixed(0));
    $(".rightTopTwoItemBox").height($(".rightTopTwo").height() - $(".rightTopTwoTimeBox").height());
    if ($(".rightTopCenterBox").height() > 200) {
        $("#weather-view-he").css("margin-top", ($(".rightTopCenterBox").height - 200) / 2);
    }
    $(".switch").change(function () {
        /*   if ($("input[type='checkbox']").is(':checked') == true) {
               alert("ON");
           } else {
               alert("OFF");
           }*/
    });
    /**
     * 一级公司名称列表渲染插入
     */
    var navsum = new Array;

    function getlistnav() {
        $.ajax({
            url: "/projectBaseScene/findEntperpriseList",
            type: "POST",
            data: {
                size: 200,
                page: 1,
            },
            success: function (res) {
                console.log(res)
                let html = '';
                $.each(res.datas, function (i, item) {
                    navsum.push(item.id);
                    html += '<li class="layui-nav-item nav-li" data-id="' + item.id + '">' +
                        '<a href="javascript:;" class="gs">' + item.name + '</a>' +
                        '<div class="layui-nav-child  nav-xm">' +
                        '</div>' +
                        '</li>'
                });
                $('#nav-left').append(html);
                getlistxm();
                // allinitialize();
            }
        });
    }

    getlistnav();
    /**
     * 二级项目名称列表渲染插入
     * 渲染二级列表时会同时初始化页面
     */
    var navxm = new Array;

    function getlistxm() {
        for (var i = 0; i < navsum.length; i++) {
            let id = navsum[i];
            let index = i;
            $.ajax({
                async: false,
                url: "/projectBaseScene/findProjectList?entperpriseId=" + id,
                type: "POST",
                data: {
                    size: 200,
                    page: 1,
                },
                success: function (res) {
                    // console.log(res);
                    let html = '';
                    $.each(res.datas, function (i, item) {
                        navxm.push(item.id);
                        html += '                      <div class="layui-nav-item nav-jd" data-id="' + item.id + '" id="' + item.id + '">\n' +
                            '                            <a href="javascript:;" class="xmbg">' + item.name + '</a>\n' +
                            '                        </div>'
                    });
                    $('.nav-xm').eq(index).append(html);
                }
            });
            if (i == navsum.length - 1) {
                getlistjd();
                jdinitialize(navxm);
            }
        }
    }

    /**
     * 三级基地名称
     */
    function getlistjd() {
        for (var i = 0; i < navxm.length; i++) {
            let id = navxm[i];
            $.ajax({
                url: "/projectBaseScene/findBaseList?projectId=" + id,
                type: "POST",
                data: {
                    size: 200,
                    page: 1,
                },
                success: function (res) {
                    let html = '';
                    $.each(res.datas, function (i, item) {
                        html += '<div class="layui-nav-child base item" baseid="' + item.id + '" basename="' + item.name + '" baseuser="' + item.createUser + '"  lon="' + item.longitude + '" lat="' + item.latitude + '">' + item.name + '</div>'
                    });
                    $('#' + id).append(html);
                    // $(".item").eq(0).trigger("click");
                    layui.use('element', function () {
                        var element = layui.element; //导航的hover效果、二级菜单等功能，需要依赖element模块
                    });
                }
            });
        }
    }

    /**
     * 页面初始化
     */
    function jdinitialize(navxm) {
        var fige = '';
        for (var i = 0; i < navxm.length; i++) {
            if (!fige) {
                $.ajax({
                    async: false,
                    url: "/projectBaseScene/findBaseList?projectId=" + navxm[i],
                    type: "POST",
                    data: {
                        size: 200,
                        page: 1,
                    },
                    success: function (res) {
                        if (res.datas.length > 0) {
                            let lon = res.datas[0].longitude;
                            let lat = res.datas[0].latitude;
                            let name = res.datas[0].name;
                            let user = res.datas[0].createUser;
                            let id = res.datas[0].id;
                            getScene(id);
                            fige = true;
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
    $(document).on('click', '.item', function () {
        $(".item").removeClass("baseac");
        $(this).addClass("baseac");
        //点击基地获取基地下对应的场景
        getScene($(this).attr("baseId"));
    });
    /**
     * 分级导航二级菜单选中样式
     */
    $(document).on('click', '.nav-jd', function () {
        $('.nav-jd').removeClass('layui-this');
    });
    $(window).resize(function () {
        var wHeight = $(window).height();
        $(".contentBox").height(wHeight - 10);
        $(".leftBox").height($(".contentBox").height());
        $(".itemBox").height($(".leftBox").height() - $(".searchBox").height() - 15 - 30);
        $(".rightBox").height($(".contentBox").height());
        $(".camerasScrollBox").height($(".rightCenterBox").height() - 40);
        $(".camera").width(($(".camera").height() * 4 / 3).toFixed(0));
        $(".camerasBox").width(($(".camera").width() * 12 + 2).toFixed(0));
        $(".rightTopTwoItemBox").height($(".rightTopTwo").height() - $(".rightTopTwoTimeBox").height());
        if ($(".rightTopCenterBox").height() > 200) {
            $("#weather-view-he").css("margin-top", ($(".rightTopCenterBox").height() - 200) / 2);
        }
        //重新加载视频
        for (var m = 0; m < camerNumberList.length; m++) {
            getCamareUrl(camerNumberList[m].cameraId, m);
        }
    });
//获取左侧菜单信息
    getLeftItem();
    CreatDrag("camerasScrollBox")
});

function onValueChanged(e) {
    alert(this.getFormValue());
}

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
            if (resData.length > 0) {
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
    $itemBox.empty()
    for (var i = 0; i < msg.length; i++) {
        var $item = $("<span class='item'></span>");
        $item.text(msg[i].name);
        $item.attr("baseId", msg[i].id);
        $item.appendTo($itemBox);
    }
    $(".item").click(function () {
        $(".item").removeClass("checkedItem");
        $(this).addClass("checkedItem");
        //点击基地获取基地下对应的场景
        getScene($(this).attr("baseId"));
    });
    $(".item").eq(0).trigger("click");
}

//通过基地获取场景信息
function getScene(baseId) {
    $.ajax({
        type: "POST",
        url: "/projectBaseScene/listScenesByBaseId",
        async: true,
        data: {
            baseId: baseId,
            sceneType: 0
        },
        dataType: "json",
        success: function (res) {
            var resData = res.datas;
            if (resData.length > 0) {
                //暂时获取基地下所有场景后默认取第一个场景信息展示（没做最低到场景切换）
                //获取场景下设备，并取第一个设备加载数据反馈信息
                addDataBack(resData[0].id);
                //获取场景下摄像头
                getCamera(resData[0].id);
                //获取场景下集电器设备（第一个继电器设备）
                getRelayDevice(resData[0].id);
            } else {
                //基地下没有场景信息，右侧尚格场景对应数据清空
                //清除数据反馈信息
                $(".backTimeText").empty();
                $(".backTimeValue").empty();
                $(".rightTopTwoItemBox").html("");
                setTimeout(function () {

                    $(".rightTopTwoItemBox").html("<img class='noMsg' src='../../static/img/agriculture/noMsg.png' />");

                }, 200);


                //清空摄像头
                $(".camera").empty();
                for (var j = 0; j < $(".camera").length; j++) {
                    var $cameraTitle = $("<div class='cameraTitle'></div>");
                    $cameraTitle.text((j + 1) + "号摄像头");
                    $cameraTitle.appendTo($(".camera").eq(j));
                }
                //清空继电器设备
                var $rightBottomItemBox = $(".rightBottomItemBox");
                $rightBottomItemBox.empty();
                setTimeout(function () {
                    $rightBottomItemBox.html("<img class='noDeviceMsg' src='../../static/img/agriculture/noMsg.png' />");
                }, 200)
            }
        },
        error: function (e) {
            console.log(e);
        }
    });
}

//获取场景下设备，并取第一个设备加载数据反馈信息

function addDataBack(farmId) {
    $.ajax({
        type: "POST",
        url: "/projectBaseScene/listSceneDevices",
        async: true,
        data: {
            page: 1,
            size: 10,
            sceneId: farmId,
        },
        dataType: "json",
        success: function (res) {

            var $rightTopTwoItemBox = $(".rightTopTwoItemBox");
            var $backTimeText = $(".backTimeText");
            var $backTimeValue = $(".backTimeValue");
            $rightTopTwoItemBox.empty();
            $backTimeText.empty();
            $backTimeValue.empty();
            var resData = res.datas;
            if (resData.length > 0) {
                $(".rightTopTwoTimeBox").css("visibility", "inherit");
                for (var x = 0; x < resData.length; x++) {
                    if (resData[x].type.length > 0) {
                        var itemName = resData[x].type;
                        var itemValue = resData[x].data;
                        if (itemName.length > 0) {
                            $backTimeText.text("数据反馈时间：");
                            $backTimeValue.text(resData[x].time);

                            var itemNameArr = itemName.split("/");

                            if (itemValue && itemValue.length > 0) {
                                var itemValueArr = itemValue.split("|");

                                for (var i = 0; i < itemValueArr.length; i++) {
                                    var $rightTopTwoItem = $("<div class='rightTopTwoItem bgBlue'></div>");
                                    var $rightTopTwoItemValue = $("<span class='rightTopTwoItemValue'></span>");
                                    $rightTopTwoItemValue.text(itemNameArr[i] + ":" + itemValueArr[i]);
                                    $rightTopTwoItemValue.appendTo($rightTopTwoItem);
                                    $rightTopTwoItem.appendTo($rightTopTwoItemBox);
                                }
                            }


                        }
                        break;
                    }
                }


            } else {
                $rightTopTwoItemBox.html("");
                setTimeout(function () {
                    $(".rightTopTwoItemBox").html("<img class='noMsg' src='../../static/img/agriculture/noMsg.png' />");
                }, 200);


            }


        },
        error: function (e) {
            console.log(e);
        }
    });
}


//获取场景下摄像头信息
function getCamera(sceneId) {
    $.ajax({
        type: "POST",
        url: "../cameraApplication/getPerspectiveCameraList",
        async: true,
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
                for (var m = 0; m < resData.length; m++) {
                    getCamareUrl(resData[m].cameraId, m);
                }
            } else {
                $(".camera").empty();
                for (var j = 0; j < $(".camera").length; j++) {
                    var $cameraTitle = $("<div class='cameraTitle'></div>");
                    $cameraTitle.text((j + 1) + "号摄像头");
                    $cameraTitle.appendTo($(".camera").eq(j));
                }
            }


        },
        error: function (e) {
            console.log(e);
        }
    });
}


// 获取视频监控url
function getCamareUrl(id, m) {
    var $playerBox = $(".camera").eq(m);
    $("#player" + m).remove();
    $("#playerNoData" + m).remove();
    var $player = $('<video  style="width: 100%;height:100%;" poster="" controls playsInline webkit-playsinline autoplay></video>');
    var $rtmpHd = $('<source  type="rtmp/flv"/>');
    var $hlsHd = $('<source type="application/x-mpegURL"/>');
    $player.attr("id", "player" + m);
    $rtmpHd.attr("id", "rtmpHd" + m);
    $hlsHd.attr("id", "hlsHd" + m);
    $rtmpHd.appendTo($player);
    $hlsHd.appendTo($player);
    $player.appendTo($playerBox);
    var $playerNoData = $('<div style = "height: 100%; width: 100%; text-align: center;position:absolute;top:0; background-color: black;"></div>');
    var $nomsg = $("<span class='nomsg' style ='position:absolute;left:0.5rem;'></span>");
    var $img = $('<img src="../static/img/playBtn.png" style="width: 2rem; margin-top: 1.5rem />');
    $playerNoData.attr("id", "playerNoData" + m);
    $nomsg.appendTo($playerNoData);
    $img.appendTo($playerNoData);
    $playerNoData.appendTo($playerBox);
    // $.ajax({
    //     type: "GET",
    //     url: "../cameraManage/getPlayerAddress",
    //     dataType: "json",
    //     async: false,
    //     data: {
    //         "id": id,
    //         "perspective": 1
    //     },
    //     success: function (data) {
    //         if (data.state == 'success') {
    //             var data = data.data;
    //             var rtmpHd = document.getElementById("rtmpHd" + m);
    //             // var hlsHd = document.getElementById("hlsHd");
    //             rtmpHd.src = data.rtmp;
    //             // hlsHd.src = data.hlsHd;
    //             var player = new EZUIPlayer('player' + m);
    //             $("#player" + m).show();
    //             $("#playerNoData" + m).hide();
    //         } else {
    //             $("#playerNoData" + m).find(".nomsg").text(data.msg).css("display", "block");
    //         }
    //     },
    //     error: function (e) {
    //         console.log(e);
    //     }
    // });

    getCameraAddress(id, 1).then(data => {
        if (data == null || data == undefined) {
            $("#playerNoData" + m).find(".nomsg").text(data.msg).css("display", "block");
        }
        var data = data.data;
        var rtmpHd = document.getElementById("rtmpHd" + m);
        // var hlsHd = document.getElementById("hlsHd");
        rtmpHd.src = data.rtmp;
        // hlsHd.src = data.hlsHd;
        var player = new EZUIPlayer('player' + m);
        $("#player" + m).show();
        $("#playerNoData" + m).hide();
    });
}


//获取场景下设备
function getRelayDevice(farmId) {
    $.ajax({
        type: "POST",
        url: "/projectBaseScene/listSceneDevices",
        async: true,
        data: {
            page: 1,
            size: 10,
            sceneId: farmId,
        },
        dataType: "json",
        success: function (res) {
            flag = true;
            var resData = res.datas;
            if (resData.length > 0) {
                for (var j = 0; j < resData.length; j++) {
                    if (resData[j].deviceType == 2) {
                        //得到场景下第一个继电器设备
                        getEquipmentMsg(resData[j].deviceNumber);
                        break;
                    }
                }
            } else {
                var $rightBottomItemBox = $(".rightBottomItemBox");
                $rightBottomItemBox.empty();
                setTimeout(function () {


                    $rightBottomItemBox.html("<img class='noDeviceMsg' src='../../static/img/agriculture/noMsg.png' />");
                }, 200)
            }

            if (flag == true) {
                var $rightBottomItemBox = $(".rightBottomItemBox");
                $rightBottomItemBox.empty();
                setTimeout(function () {


                    $rightBottomItemBox.html("<img class='noDeviceMsg' src='../../static/img/agriculture/noMsg.png' />");
                }, 200)
            }


        },
        error: function (e) {
            console.log(e);
        }
    });
}

//得到场景下第一个继电器设备
function getEquipmentMsg(ncode) {
    flag = false;
    $.ajax({
        type: "POST",
        url: "../aquacultureUserSensor/getSensorList",
        data: {size: '100', page: 1, ncode: ncode},
        dataType: "json",
        success: function (res) {
            var resData = res.datas;
            if (resData.length > 0) {
                addEquipment(resData);
            } else {
                var $rightBottomItemBox = $(".rightBottomItemBox");
                $rightBottomItemBox.empty();
                setTimeout(function () {
                    $rightBottomItemBox.html("<img class='noDeviceMsg' src='../../static/img/agriculture/noMsg.png' />");
                }, 200)


            }


        },
        error: function (e) {
            console.log(e);
        }
    });

}

//创建场景下第一个继电器设备下的设备
function addEquipment(equipmentList) {
    var $rightBottomItemBox = $(".rightBottomItemBox");
    $rightBottomItemBox.empty();
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

        /*       var $settingBtn = $("<div class='settingBtn'>设置</div>");*/

        $switch.appendTo($label);
        $label.appendTo($Box_points_switch);

        $deviceName.appendTo($rightBottomItem);
        $signalImg.appendTo($rightBottomItem);
        $Box_points_switch.appendTo($rightBottomItem);
        /*       $settingBtn.appendTo($rightBottomItem);*/
        $rightBottomItem.appendTo($rightBottomItemBox);


    }
    $(".switch").click(function (e) {


        var $that = $(this);

        var indexNum = $(".switch").index(this) + 1;
        //操作继电器开关
        $.ajax({
            type: "POST",
            url: "../aquacultureUserSensor/sendCommand",
            data: {
                sensorCode: $that.attr("data-sensorCode"),
                deviceNumber: $that.attr("data-sensorNcode"),
                command: getIndex(indexNum, $that.prop("checked") ? true : false)
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


var getIndex = function (index, type) {
    if (index < 10) {
        index = "0" + index;
    }

    if (type == true) {
        type = "01";
    } else {
        type = "00";
    }

    return index + type;

}


//滚动容器增加滑动效果（不需要拖动滚动条）
function CreatDrag(id) {

    var oBox = document.getElementsByClassName(id)[0];
    oBox.onmousedown = function (ev) {
        var ev = ev || event;
        var Y = ev.clientY;
        var X = ev.clientX;
        var ToTop = document.getElementsByClassName(id)[0].scrollTop;
        var Toleft = document.getElementsByClassName(id)[0].scrollLeft;
        oBox.onmousemove = function (ev) {
            ev = ev || event;
            var subY = ev.clientY - Y;
            var subX = ev.clientX - X;
            Y = ev.clientY;
            X = ev.clientX;
            ToTop -= (subY);
            Toleft -= (subX);
            /*     document.getElementsByClassName(id)[0].scrollTop  = ToTop;*/
            document.getElementsByClassName(id)[0].scrollLeft = Toleft;
        }
        document.onmouseup = function () {
            oBox.onmousemove = function () {
                null;
            }
        }
    }
}
