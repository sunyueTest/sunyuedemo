var speedOne =0.5;
var speedTwo =0.5;
var speedThree=1;
var speedAll = 2;
var valueOne =0;
var valueTwo =0;
var valueThree =0;
var valueAll = 0;
var myVar ;
var dTime ;
var dValue;
var fixedTime=0;
var fixedValue=0;


var msgBar;

var landLegData;
var msgLegData;
var id = request('id');
/*let id;*/
var farmName = request('farmName');
/*let farmName;*/
var msgLine = "";
var barArr = {};
let noMsgStr = "<p class='nomsg'>暂无数据</p>";
layui.use(['form', 'layedit', 'laydate'], function () {
});
$(function () {

    /*
        id = $('#farmId').val();
        farmName = $('#farmName').val();*/

    $(".leftTitleRight").find("p").text("杨凌现代农业精准扶贫产业" + farmName);
    var documentHeight = $(window).height();
    $(".leftBox").height(documentHeight);
    $(".rightTopMb").height(documentHeight - $(".rightBottom").height());
    $(".rightTop").height(documentHeight - $(".rightBottom").height());
    $(".bgBox").height(documentHeight);
    $(".content").height(documentHeight);
    $("#msgLine").height($(".rightTop").height() - $(".rightTopTitle").height() - $(".megBox").height());
    $("#msgBar").height($(".rightTop").height() - $(".rightTopTitle").height() - $(".megBox").height());
    $(".rightBox").height(documentHeight);
    $("#camera").height(documentHeight - $(".leftBottomBox").height() - $(".leftTitleBox").height());
    $(".leftBottomItemBox").height($(".leftBottomBox").height() - $(".leftBottomTittle").height());
    /*    $(".dangerMsgBox").height($(".leftBottomBox").height() - $(".leftBottomTittle").height());*/
    $(".leftBottomRightTop").height($(".leftBottomLeft").height() - $(".leftBottomRightBottom").height());
    $(".deviceBox").height($(".leftBottomRightTop").height() - $(".leftBottomTittle").height());


    $(window).resize(function () {
        var documentHeight = $(window).height();
        $(".leftBox").height(documentHeight);
        $(".rightTopMb").height(documentHeight - $(".rightBottom").height());
        $(".rightTop").height(documentHeight - $(".rightBottom").height());
        $(".bgBox").height(documentHeight);
        $(".content").height(documentHeight);
        $("#msgLine").height($(".rightTop").height() - $(".rightTopTitle").height() - $(".megBox").height());
        $("#msgBar").height($(".rightTop").height() - $(".rightTopTitle").height() - $(".megBox").height());
        $(".rightBox").height(documentHeight);
        $("#camera").height(documentHeight - $(".leftBottomBox").height() - $(".leftTitleBox").height());
        $(".leftBottomItemBox").height($(".leftBottomBox").height() - $(".leftBottomTittle").height());
        /*    $(".dangerMsgBox").height($(".leftBottomBox").height() - $(".leftBottomTittle").height());*/
        $(".leftBottomRightTop").height($(".leftBottomLeft").height() - $(".leftBottomRightBottom").height());
        $(".deviceBox").height($(".leftBottomRightTop").height() - $(".leftBottomTittle").height());

        if (msgLine) {
            msgLine.resize();
        }
        if (msgBar) {
            msgBar.resize();
        }


        getCamera();
    });

    //详情页，室外气象站数据
    getOuterDeviceMsg();

    //通过大棚id获取摄像头id,在获取摄像头信息
    getCamera();

    //通过大棚id获取环境信息
    getDeviceMsg();

    //获取大棚异常信息
    getException();

















    //开关
    $(".switch").click(function (e) {
        if($(this).parents(".Box_points_switch").attr("id")=="Box_points_switch5"){
            if($("#Box_points_switch1").find(".mui-switch").attr("dataType")=="off"){
                layer.msg("请先开启水泵!", {
                    offset: '20rem'
                });
                // $("#Box_points_switch5").find(".switch").trigger("click");
                $("#Box_points_switch5").find(".switch").prop("checked", false);
            }else{
                layer.msg("操作成功!", {
                    offset: '20rem'
                });
                $(".speedValueOne").val(speedOne);
                $(".speedValueTwo").val(speedTwo);
                $(".speedValueThree").val(speedThree);
                $(".speedValueAll").val(speedAll);
                if($(this).attr("dataType")=="off"){
                    $(this).attr("dataType","on");
                    myVar = setInterval(function(){ myTimer() }, 1000*60);
                    $(".fertilizerInput").attr("disabled","disabled");
                    $(".waterInput").attr("disabled","disabled");
                    $(".timeInput").attr("disabled","disabled");
                    $(".valueInput").attr("disabled","disabled");

                    if($(".time").hasClass("activeOpenType")){

                        dTime = setInterval(function(){ dTimer() }, $(".timeInput").val()*60 *1000);
                    }else{
                        var nowValue = $(".flowValueAll").val();
                        dValue = setInterval(function(){ dValuer(nowValue) }, 1000);

                    }


                }else{
                    $(this).attr("dataType","off");
                    clearDValue();
                    clearDtime();
                    myStopFunction();


                    $(".speedValueOne").val(0);
                    $(".speedValueTwo").val(0);
                    $(".speedValueThree").val(0);
                    $(".speedValueAll").val(0);



                    $(".fertilizerInput").removeAttr("disabled");
                    $(".waterInput").removeAttr("disabled");
                    $(".timeInput").removeAttr("disabled");
                    $(".valueInput").removeAttr("disabled");


                }
            }

        }else if($(this).parents(".Box_points_switch").attr("id")=="Box_points_switch1"){
            layer.msg("操作成功!", {
                offset: '20rem'
            });
            if($(this).attr("dataType")=="off"){
                $(this).attr("dataType","on");
            }else{
                $(this).attr("dataType","off");
                $("#Box_points_switch5").find(".switch").prop("checked", false);
                $("#Box_points_switch5").find(".switch").attr("dataType","off");
                clearDValue();
                clearDtime();
                myStopFunction();
                $(".speedValueOne").val(0);
                $(".speedValueTwo").val(0);
                $(".speedValueThree").val(0);
                $(".speedValueAll").val(0);
                $(".fertilizerInput").removeAttr("disabled");
                $(".waterInput").removeAttr("disabled");
                $(".timeInput").removeAttr("disabled");
                $(".valueInput").removeAttr("disabled");
            }

        }else{
            layer.msg("操作成功!", {
                offset: '20rem'
            });
        }
    });


    $(".toZero").click(function(){
        if($("#Box_points_switch5").find(".mui-switch").attr("dataType")=="on"){
            layer.msg("启动中禁止该操作!", {
                offset: '20rem'
            });
        }else{
            $(this).parent(".speedBoxItemValueBox").find(".speedValue").val(0);
             var xx =  $(this).parent(".speedBoxItemValueBox").find(".speedValue").attr("valueIndex") ;

             if(xx=="valueOne"){
                 valueOne =0;
             }else if(xx=="valueTwo"){
                 valueTwo =0;
             }else if(xx=="valueThree"){
                 valueThree =0;
             }

            $(".flowValueAll").val(Number($(".flowValueOne").val())+Number($(".flowValueTwo").val())+Number($(".flowValueThree").val()));
        }
    });













    $(".timeValue").click(function(){
        if($("#Box_points_switch5").find(".mui-switch").attr("dataType")=="on"){
            layer.msg("启动中禁止该操作!", {
                offset: '20rem'
            });
        }else{
            $(".timeValue").removeClass("activeOpenType");
            $(this).addClass("activeOpenType");
        }
    })





});


//通过大棚id获取信息，进行以下操作
function getCamera() {
    $.ajax({
        type: "get",
        url: "../cameraApplication/getCameraList",
        dataType: "json",
        data: {
            page: 1,
            size: 1,
            appId: id,
            appType: 1
        },
        success: function (data) {
            if (data.state == "success" && data.datas.length > 0) {
                getCameraUrl(data.datas[0].cameraId);
            } else {
                $("#camera").html('<span style="text-align:center;font-size:.8rem;display:block;padding-top:8.5rem;">请先绑定监控设备</span>');
            }
        },
        error: function (e) {
            console.log(e);
        }
    });
}

//大屏名字变动随着中性变化
$.post("../user/selUserDetails", {}, function (res) {
    if (res.state == 'success' && res.data.info) {
        $("#company").html(res.data.info.company);
        if(res.data.info.logo){
            $("#logo").attr('src', res.data.info.logo);
        }
    }
});

//获取当前大棚的异常信息
function getException() {
    $.ajax({
        type: "get",
        url: "../newFarmInfo/getFarmsException",
        dataType: "json",
        success: function (data) {
            if (data.state == "success" && data.datas.length > 0) {
                let datas = data.datas;
                let flag = false;
                $('.dangerMsgBox').empty();
                for (let i = 0; i < datas.length; i++) {
                    if (datas[i].id == id) {
                        flag = true;
                        let $exceptionMsg = $('<p class="dangerMsg">' + datas[i].remark + '</p>')
                        $exceptionMsg.appendTo($('.dangerMsgBox'));
                    }
                }
                if (!flag) {
                    $(noMsgStr).appendTo($('.dangerMsgBox'));
                }
            }
        },
        error: function (e) {
            console.log(e);
        }
    });
}


//通过大棚id获取室内实时环境信息
function getDeviceMsg() {
    $.ajax({
        type: "GET",
        url: "../newFarmInfo/getFarmDeviceList",
        dataType: "json",
        data: {
            page: 1,
            size: 10,
            farmId: id,
        },
        success: function (data) {
            if (data.state == "success" && data.datas.length > 0) {
                let dataDeviceFlag = false;
                let relayDeviceFlag = false;
                //获取采集设备信息
                for (var i = 0; i < data.datas.length; i++) {
                    if (data.datas[i].deviceType != 2) {
                        dataDeviceFlag = true;
                        initMsgBar(data.datas[i].deviceNumber);
                        initMsgLine(data.datas[i].deviceNumber);
                        addDeviceMsg(data.datas[i]);
                        break;
                    }
                }
                //获取继电器开关列表
                for (var j = 0; j < data.datas.length; j++) {
                    if (data.datas[j].deviceType == 2) {
                        relayDeviceFlag = true;
                        $.ajax({
                            type: "POST",
                            url: "../aquacultureUserSensor/getSensorListForScreen",
                            data: {size: '100', page: 1, ncode: data.datas[j].deviceNumber},
                            dataType: "json",
                            success: function (data) {
                                //加载继电器设备
                                getEquipmentMsg(data)
                            },
                            error: function (e) {
                                console.log(e);
                            }
                        });
                        break;
                    }
                }

                //如果没有继电器设备
                if (!relayDeviceFlag) {
                    var $nomsg = $("<p class='nomsg'>暂无设备</p>");
                    $nomsg.appendTo($(".deviceBox"));
                }

                //如果没有采集设备
                if (!dataDeviceFlag) {
                    displayNoMsgWithoutDataDevice();
                } else {

                }
                // 添加土壤墒情右侧格子信息
                /*     for (var r = 0; r < data.datas.length; r++) {
                         if (data.datas[r].deviceType != 2) {
                             setLandItem(data.datas[r]);
                         }
                         break;
                     }*/
            } else {
                var $nomsg = $("<p class='nomsg'>暂无设备</p>");
                $nomsg.appendTo($(".deviceBox"));

                displayNoMsgWithoutDataDevice();
            }

        },
        error: function (e) {
            console.log(e);
        }
    });
}

//无采集设备时，大屏显示暂无数据
function displayNoMsgWithoutDataDevice() {
    let $nomsg1 = $(noMsgStr);
    let $nomsg2 = $(noMsgStr);

    $('.landLineBox').html('<span style="text-align:center;font-size:.8rem;margin-top:8.5rem;display:block;">暂无数据</span>');


    $(".echartsBox").empty();
    $nomsg2.appendTo($(".echartsBox"));

}

//获取室外气象站实时环境信息
function getOuterDeviceMsg() {
    $.ajax({
        type: "GET",
        url: "../newFarmInfo/getDeviceListOutOfGreenhouse",
        dataType: "json",
        data: {
            page: 1,
            size: 10,
        },
        success: function (data) {
            if (data.state == "success" && data.datas.length > 0) {
                for (var i = 0; i < data.datas.length; i++) {
                    if (data.datas[i].deviceType != 2) {
                        addOutDeviceMsg(data.datas[i]);
                        break;
                    }
                }
            }
        },
        error: function (e) {
            console.log(e);
        }
    });
}

//添加土壤墒情右侧格子信息
function setLandItem(res) {
    var itemName = res.type;
    var itemNameArr = itemName.split("/");
    var itemValue = res.data;
    if (itemValue && itemValue.length > 0) {
        var itemValueArr = itemValue.split("|");


        for (var i = 0; i < $(".landLineItem").length; i++) {
            var flag = false;
            for (var j = 0; j < itemNameArr.length; j++) {
                if ($(".landLineItemTitle").eq(i).text() == $.trim(itemNameArr[j])) {
                    flag = true;
                    $(".landLineItemMsg").eq(i).text($.trim(itemValueArr[j]));
                    break;
                }
            }
            if (!flag) {
                $(".landLineItemMsg").eq(i).text("暂无数据");
            }
        }
    }

}


//添加环境实时监测数据
function addDeviceMsg(res) {
    var xArr = ["cafeef2", "cc2aff2", "caff2bf", "cafcbf2", "cf2c7af", "cf2afaf", "cf2d2af", "ce0aff2", "cafeef2", "cc2aff2", "caff2bf", "cafcbf2", "cf2c7af", "cf2afaf", "cf2d2af", "ce0aff2"];
    var itemName = res.type;
    var itemValue = res.data;
    if (itemValue && itemValue.length > 0) {
        var itemNameArr = itemName.split("/");
        var itemValueArr = itemValue.split("|");

        var $environmental = $(".megBox");
        $environmental.empty();

        //加载环境实时监测数据
        for (var i = 0; i < itemValueArr.length; i++) {
            for (var j = 0; j < msgLegData.length; j++) {
                if ($.trim(itemNameArr[i]) == $.trim(msgLegData[j])) {
                    var $msgItem = $("<div class='msgItem'></div>");
                    $msgItem.addClass(xArr[i]);
                    if (itemValueArr[i].length > 0) {
                        $msgItem.text($.trim(itemNameArr[i]) + ":" + $.trim(itemValueArr[i]));
                    } else {
                        $msgItem.text($.trim(itemNameArr[i]) + ":" + "暂无数据");
                    }
                    $msgItem.appendTo($environmental);
                    break;
                }
            }
        }


    }


}


//添加外部环境实时监测数据
function addOutDeviceMsg(res) {
    var xArr = ["cafeef2", "cc2aff2", "caff2bf", "cafcbf2", "cf2c7af", "cf2afaf", "cf2d2af", "ce0aff2", "cafeef2", "cc2aff2", "caff2bf", "cafcbf2", "cf2c7af", "cf2afaf", "cf2d2af", "ce0aff2"];
    var itemName = res.type;

    var itemValue = res.data;
    if (itemName && itemName.length > 0 && itemValue && itemValue.length > 0) {

        var itemNameArr = itemName.split("/");
        var itemValueArr = itemValue.split("|");
        var $leftBottomItemBox = $(".leftBottomItemBox");
        $leftBottomItemBox.empty();

        for (var i = 0; i < itemValueArr.length; i++) {
            var $outMsgItem = $("<div class='outMsgItem'></div>");
            $outMsgItem.addClass(xArr[i]);
            if (itemValueArr[i].length > 0) {
                if ($.trim(itemNameArr[i]) != "") {
                    $outMsgItem.text($.trim(itemNameArr[i]) + ":" + $.trim(itemValueArr[i]));
                } else {
                    $outMsgItem.text("未知设备" + ":" + $.trim(itemValueArr[i]));
                }


            } else {
                $outMsgItem.text($.trim(itemNameArr[i]) + ":" + "暂无数据");
            }
            $outMsgItem.appendTo($leftBottomItemBox);
        }
    } else {
        var $leftBottomItemBox = $(".leftBottomItemBox");
        var $nomsg = $("<p style='font-size:0.8rem;text-align: center;padding-top: 7.5rem;'>暂无设备</p>");
        $nomsg.appendTo($leftBottomItemBox);
    }


}




//二氧化碳-光照度曲线图
function initMsgLine(deviceNumber) {
    msgLine = echarts.init(document.getElementById('msgLine'));
    msgLine.clear();


    $.ajax({
        type: "POST",
        url: "../monitor/getSensorReportNew",
        data: {"deviceNumber": deviceNumber},
        async: false,
        dataType: "json",
        success: function (res) {
            if (res.success == true && res.data) {
                var res = res.data;

                var keyArr = Object.keys(res).sort();
                if (keyArr.length > 0) {
                    keyArr.remove('type');
                    keyArr.remove('sensorType');
                    var newKeyArr = [];
                    for (var w = 0; w < keyArr.length; w++) {
                        if (keyArr[w] != "type" && keyArr[w] != "typsensorTypee") {
                            newKeyArr.push(keyArr[w].split("-")[1]);
                        }
                    }
                    var lastObj = {};
                    for (var m = 0; m < keyArr.length; m++) {
                        var nKey = newKeyArr[m];
                        var nVal = keyArr[m];
                        lastObj[nKey] = res[nVal];
                    }

                    var server = [];
                    var colorNum = 0;
                    msgLegData = [];
                    var colorArr = ["#afeef2", "#afcbf2", "#e0aff2", "#f2d2af", "#e0aff2", "#009944", "#ff0000", "#13e1f3", "#afeef2", "#afcbf2", "#e0aff2", "#f2d2af", "#e0aff2", "#009944", "#ff0000", "#13e1f3"];
                    for (var q = 0; q < newKeyArr.length; q++) {
                        if (lastObj[newKeyArr[q]].sensorType != 23 && lastObj[newKeyArr[q]].sensorType != 24 && lastObj[newKeyArr[q]].sensorType != 25 && lastObj[newKeyArr[q]].sensorType != 26 && lastObj[newKeyArr[q]].sensorType != 36 && lastObj[newKeyArr[q]].sensorType != 93 && lastObj[newKeyArr[q]].sensorType != 94 && lastObj[newKeyArr[q]].sensorType != 95 && lastObj[newKeyArr[q]].sensorType != 122 && lastObj[newKeyArr[q]].sensorType != 123 && lastObj[newKeyArr[q]].sensorType != 124 && lastObj[newKeyArr[q]].sensorType != 125) {
                            var sObj = {};
                            sObj.name = newKeyArr[q];
                            msgLegData.push(newKeyArr[q]);
                            sObj.type = 'line';
                            var cArr = [];
                            for (var c = 0; c < lastObj[newKeyArr[q]].data.length; c++) {

                                cArr.push(Number(lastObj[newKeyArr[q]].data[c]));

                            }
                            sObj.data = cArr;
                            sObj.itemStyle = {
                                normal: {
                                    color: colorArr[colorNum]
                                }
                            };
                            colorNum++;
                            server.push(sObj);

                        }
                    }


                    if (server.length > 0) {

                        option = {
                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                color: ["#00A0E9", "#00FF00"],
                                data: msgLegData,
                                top: '2%',
                                right: '0',
                                itemWidth: 1,//图例的宽度
                                itemHeight: 8,//图例的高度
                                textStyle: {//图例文字的样式
                                    color: '#fff',
                                    fontSize: 10,
                                    marginLeft: 5
                                }
                            },
                            grid: {
                                top: '20%',
                                left: '3%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            xAxis: {
                                type: 'category',
                                boundaryGap: false,
                                axisTick: {//坐标轴刻度相关设置。
                                    show: false,
                                },
                                axisLabel: {
                                    margin: 10,
                                    textStyle: {
                                        fontSize: 10
                                    }
                                },
                                data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],

                                axisLine: {
                                    lineStyle: {
                                        color: "#fff"
                                    }
                                }
                            },
                            yAxis: {
                                type: 'value',
                                axisLabel: {
                                    margin: 10,
                                    textStyle: {
                                        fontSize: 10
                                    }
                                },
                                splitLine: {
                                    show: false,
                                    lineStyle: {
                                        type: 'dashed',
                                        color: '#fff',
                                    }
                                },
                                axisTick: {
                                    inside: true
                                },
                                axisLine: {
                                    show: true,
                                    lineStyle: {
                                        color: "#fff"
                                    }
                                },
                                nameTextStyle: {
                                    color: "#fff"
                                },
                                splitArea: {
                                    show: false
                                }
                            },
                            series: server
                        };
                        msgLine.setOption(option);

                    } else {

                        let $nomsg2 = $(noMsgStr);
                        $(".echartsBox").empty();
                        $nomsg2.appendTo($(".echartsBox"));

                    }


                }

            } else {
                /*                $('.megBox').html('<span style="text-align:center;font-size:.8rem;margin-top:8.5rem;display:block;">暂无数据</span>');*/
            }
        },
        error: function (e) {
            console.log(e);
        }
    });


}


// 获取视频监控url
function getCameraUrl(id) {
    var $playerBox = $("#camera");
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

    // $.ajax({
    //     type: "GET",
    //     url: "../cameraManage/getPlayerAddress",
    //     dataType: "json",
    //     async: false,
    //     data: {
    //         "id": id
    //     },
    //     success: function (data) {
    //         if (data.state == 'success') {
    //             var data = data.data;
    //             var rtmpHd = document.getElementById("rtmpHd");
    //             // var hlsHd = document.getElementById("hlsHd");
    //             rtmpHd.src = data.rtmp;
    //             // hlsHd.src = data.hlsHd;
    //             var player = new EZUIPlayer('player');
    //             $("#player").show();
    //             $("#playerNoData").hide();
    //         } else {
    //             $("#playerNoData").find(".nomsg").text(data.msg).css("display", "block");
    //         }
    //     },
    //     error: function (e) {
    //         console.log(e);
    //     }
    // });

    getCameraAddress(id, 0).then(data => {
        if (data == null || data == undefined) {
            $("#playerNoData").find(".nomsg").text(data.msg).css("display", "block");
            return;
        }
        var rtmpHd = document.getElementById("rtmpHd");
        // var hlsHd = document.getElementById("hlsHd");
        rtmpHd.src = data.rtmp;
        // hlsHd.src = data.hlsHd;
        var player = new EZUIPlayer('player');
        $("#player").show();
        $("#playerNoData").hide();
    });
}


//柱状图
function initMsgBar(deviceNumber) {
    msgBar = echarts.init(document.getElementById('msgBar'));

    $.ajax({
        type: "POST",
        url: "../monitor/getSensorReport",
        data: {"deviceNumber": deviceNumber},
        async: false,
        dataType: "json",
        success: function (res) {
            if (res.success == true && res.data) {
                var res = res.data;

                var keyArr = Object.keys(res);
                if (keyArr.length > 0) {
                    keyArr.remove('type');
                    var newKeyArr = [];
                    for (var w = 0; w < keyArr.length; w++) {
                        if (keyArr[w] != "type") {
                            newKeyArr.push(keyArr[w].split("-")[1]);
                        }
                    }
                    var lastObj = {};
                    for (var m = 0; m < keyArr.length; m++) {
                        var nKey = newKeyArr[m];
                        var nVal = keyArr[m];
                        lastObj[nKey] = res[nVal];
                    }

                    for (var q = 0; q < newKeyArr.length; q++) {
                        if (newKeyArr[q] == "温度" || newKeyArr[q] == "湿度") {
                            var ss = newKeyArr[q];
                            var cArr = [];
                            for (var c = 0; c < 5; c++) {
                                cArr.push(Number(lastObj[ss][c]));
                            }

                            barArr['室内' + newKeyArr[q]] = cArr;
                        }
                    }


                    $.ajax({
                        type: "get",
                        url: "../newFarmInfo/getDeviceListOutOfGreenhouse",
                        dataType: "json",
                        data: {
                            page: 1,
                            size: 10
                        },
                        success: function (data) {
                            if (data.state == "success" && data.datas.length > 0) {
                                var dataList = [];
                                var relay = [];
                                for (var v = 0; v < data.datas.length; v++) {
                                    if (data.datas[v].deviceType != 2) {
                                        dataList.push(data.datas[v]);
                                    }
                                }
                                $.ajax({
                                    type: "POST",
                                    url: "../monitor/getSensorReport",
                                    data: {"deviceNumber": dataList[0].deviceNumber},
                                    async: false,
                                    dataType: "json",
                                    success: function (data) {
                                        if (data.success == true && data.data) {
                                            var outKeyArr = Object.keys(data.data);
                                            if (outKeyArr.length > 0) {
                                                outKeyArr.remove('type');
                                                var newKeyArr = [];
                                                for (var w = 0; w < outKeyArr.length; w++) {
                                                    if (outKeyArr[w] != "type") {
                                                        newKeyArr.push(outKeyArr[w].split("-")[1]);
                                                    }
                                                }
                                                var lastObj = {};
                                                for (var m = 0; m < outKeyArr.length; m++) {
                                                    var nKey = newKeyArr[m];
                                                    var nVal = outKeyArr[m];
                                                    lastObj[nKey] = data.data[nVal];
                                                }

                                                for (var q = 0; q < newKeyArr.length; q++) {
                                                    if (newKeyArr[q] == "温度" || newKeyArr[q] == "湿度") {
                                                        var ss = newKeyArr[q];
                                                        var cArr = [];
                                                        for (var c = 0; c < 5; c++) {
                                                            cArr.push(Number(lastObj[ss][c]));
                                                        }

                                                        barArr['室外' + newKeyArr[q]] = cArr;
                                                    }
                                                }
                                            }

                                            //外部温度湿度与内部温度湿度组装完成
                                            var timeData = [];
                                            var nowDate = new Date();
                                            var hour = nowDate.getHours();
                                            for (var k = 0; k < 5; k++) {
                                                timeData.unshift(hour + "时");
                                                hour--;
                                                if (hour < 0) {
                                                    hour = 23;
                                                }
                                            }

                                            var option = {
                                                title: {
                                                    text: "",
                                                    left: "15",
                                                    top: "3",
                                                    textStyle: {
                                                        color: "#fff",
                                                        fontSize: 14
                                                    }
                                                },
                                                tooltip: { //提示框组件
                                                    trigger: 'axis',
                                                    axisPointer: {
                                                        type: 'shadow',
                                                        label: {
                                                            backgroundColor: '#6a7985'
                                                        }
                                                    },
                                                    textStyle: {
                                                        color: '#fff',
                                                        fontStyle: 'normal',
                                                        fontFamily: '微软雅黑',
                                                        fontSize: 12,
                                                    }
                                                },
                                                grid: {
                                                    top: '20%',
                                                    left: '5%',
                                                    right: '2%',
                                                    bottom: '3%',
                                                    containLabel: true
                                                },
                                                legend: {//图例组件，颜色和名字
                                                    right: "0",
                                                    top: "2%",
                                                    itemWidth: 16,
                                                    itemHeight: 12,
                                                    itemGap: 5,
                                                    data: [{
                                                        name: '室内温度',
                                                    }, {
                                                        name: '室外温度',
                                                    },
                                                        {
                                                            name: '室内湿度',
                                                        },
                                                        {
                                                            name: '室外湿度',
                                                        }],
                                                    textStyle: {
                                                        color: '#ffffff',
                                                        fontStyle: 'normal',
                                                        fontFamily: '微软雅黑',
                                                        fontSize: 10,
                                                    }
                                                },
                                                xAxis: [
                                                    {
                                                        type: 'category',
                                                        boundaryGap: true,//坐标轴两边留白
                                                        data: timeData,
                                                        axisLabel: { //坐标轴刻度标签的相关设置。
                                                            interval: 0,//设置为 1，表示『隔一个标签显示一个标签』
                                                            margin: 8,
                                                            textStyle: {
                                                                color: '#ffffff',
                                                                fontStyle: 'normal',
                                                                fontFamily: '微软雅黑',
                                                                fontSize: 10,
                                                            }
                                                        },

                                                        axisTick: {//坐标轴刻度相关设置。
                                                            show: false,
                                                        },
                                                        axisLine: {//坐标轴轴线相关设置
                                                            lineStyle: {
                                                                color: '#fff',
                                                                opacity: 0.2
                                                            }
                                                        },
                                                        splitLine: { //坐标轴在 grid 区域中的分隔线。
                                                            show: false,
                                                        }
                                                    }
                                                ],
                                                yAxis: [
                                                    {
                                                        type: 'value',
                                                        splitNumber: 2,
                                                        axisLabel: {
                                                            textStyle: {
                                                                color: '#ffffff',
                                                                fontStyle: 'normal',
                                                                fontFamily: '微软雅黑',
                                                                fontSize: 10,
                                                            }
                                                        },
                                                        axisLine: {
                                                            lineStyle: {
                                                                color: '#fff',
                                                                opacity: 0.2
                                                            }
                                                        },
                                                        axisTick: {
                                                            show: false
                                                        },
                                                        splitLine: {
                                                            show: true,
                                                            lineStyle: {
                                                                color: ['#fff'],
                                                                opacity: 0.06
                                                            }
                                                        }

                                                    }
                                                ],
                                                series: [
                                                    {
                                                        name: '室内温度',
                                                        type: 'bar',
                                                        data: barArr['室内温度'],
                                                        barWidth: 10,
                                                        barGap: 0,//柱间距离
                                                        label: {//图形上的文本标签
                                                            normal: {
                                                                show: true,
                                                                position: 'top',
                                                                textStyle: {
                                                                    color: '#00FBCF',
                                                                    fontStyle: 'normal',
                                                                    fontFamily: '微软雅黑',
                                                                    fontSize: 10,
                                                                },
                                                            },
                                                        },
                                                        itemStyle: {//图形样式
                                                            normal: {

                                                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                                                    offset: 0, color: '#00FBCF'
                                                                }, {
                                                                    offset: 0.7, color: '#007AFF'
                                                                }], false),
                                                            },
                                                        },
                                                    },
                                                    {
                                                        name: '室外温度',
                                                        type: 'bar',
                                                        data: barArr['室外温度'],
                                                        barWidth: 10,
                                                        barGap: 0,//柱间距离
                                                        label: {//图形上的文本标签
                                                            normal: {
                                                                show: true,
                                                                position: 'top',
                                                                textStyle: {
                                                                    color: '#fe00aa',
                                                                    fontStyle: 'normal',
                                                                    fontFamily: '微软雅黑',
                                                                    fontSize: 10,
                                                                },
                                                            },
                                                        },
                                                        itemStyle: {//图形样式
                                                            normal: {

                                                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                                                    offset: 0, color: '#fe00aa'
                                                                }, {
                                                                    offset: 0.7, color: '#ff0a00'
                                                                }], false),
                                                            },
                                                        },
                                                    },
                                                    {
                                                        name: '室内湿度',
                                                        type: 'bar',
                                                        data: barArr['室内湿度'],
                                                        barWidth: 10,
                                                        barGap: 0.2,//柱间距离
                                                        label: {//图形上的文本标签
                                                            normal: {
                                                                show: true,
                                                                position: 'top',
                                                                textStyle: {
                                                                    color: '#b5fd00',
                                                                    fontStyle: 'normal',
                                                                    fontFamily: '微软雅黑',
                                                                    fontSize: 10,
                                                                },
                                                            },
                                                        },
                                                        itemStyle: {//图形样式
                                                            normal: {

                                                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                                                    offset: 0, color: '#b5fd00'
                                                                }, {
                                                                    offset: 0.7, color: '#04fe00'
                                                                }], false),
                                                            },
                                                        },
                                                    },
                                                    {
                                                        name: '室外湿度',
                                                        type: 'bar',
                                                        data: barArr['室外湿度'],
                                                        barWidth: 10,
                                                        barGap: 0.2,//柱间距离
                                                        label: {//图形上的文本标签
                                                            normal: {
                                                                show: true,
                                                                position: 'top',
                                                                textStyle: {
                                                                    color: '#FDF102',
                                                                    fontStyle: 'normal',
                                                                    fontFamily: '微软雅黑',
                                                                    fontSize: 10,
                                                                },
                                                            },
                                                        },
                                                        itemStyle: {//图形样式
                                                            normal: {

                                                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                                                    offset: 0, color: '#FDF102'
                                                                }, {
                                                                    offset: 0.7, color: '#FD6202'
                                                                }], false),
                                                            },
                                                        },
                                                    }
                                                ]
                                            };

                                            msgBar.setOption(option);


                                        } else {

                                        }
                                    },
                                    error: function (e) {
                                        console.log(e);
                                    }
                                });


                            } else {

                            }
                        },
                        error: function (e) {
                            console.log(e);
                        }
                    });


                }

            } else {

            }
        },
        error: function (e) {
            console.log(e);
        }
    });


}

//加载继电器设备
function getEquipmentMsg(list) {
    var $deviceBox = $(".deviceBox");
    $deviceBox.empty();
    var listDatas = list.data;
    if (list.state == "500") {
        var $nomsg = $("<span class='nomsg'></span>");
        $nomsg.text(list.msg);
        $nomsg.appendTo($deviceBox);
    } else {
        if (listDatas.length > 0) {
            for (var i = 0; i < listDatas.length; i++) {
                var $equipmentItem = $("<div class='equipentItem'></div>");
                var $equipmentName = $("<span class='equipmentNameBox'></span>");
                // var $switchMb = $("<div class='switchMb'></div>");
                var $switch = $("<input class='switch switch-anim' onchange='' type='checkbox' />");
                $switch.attr("data-sensorNcode", listDatas[i].sensorNcode);
                $switch.attr("data-sensorCode", listDatas[i].sensorCode);
                $switch.attr("data-sensorType", listDatas[i].sensorType);
                $switch.attr("data-state", listDatas[i].state);
                $equipmentName.text(listDatas[i].sensorName);

                if (parseInt(listDatas[i].state) != "0") {
                    $switch.attr("checked", "checked");
                }

                $equipmentName.appendTo($equipmentItem);

                // $switchMb.appendTo($equipmentItem);
                $switch.appendTo($equipmentItem);
                $equipmentItem.appendTo($deviceBox);
                $switch.click(function (e) {
                    var $that = $(this);
                    layer.load(2);
                    var indexNum = $that.parent('.equipentItem').index() + 1;
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
                            layer.closeAll('loading');

                            layer.msg(data.msg, {
                                offset: '20rem'
                            });
                            if (data.state != "failed") {
                                if ($(".equipmentStatus").eq(indexNum - 1).text() == "开") {
                                    $(".equipmentStatus").eq(indexNum - 1).text("关");
                                } else {
                                    $(".equipmentStatus").eq(indexNum - 1).text("开");
                                }
                            } else {
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
                            layer.closeAll('loading');
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
        } else {
            var $nomsg = $("<p class='nomsg'>暂无设备</p>");
            $nomsg.appendTo($deviceBox);
        }
    }
}

function request(keyValue) {
    var search = location.search.slice(1);
    var arr = search.split("&");
    for (var i = 0; i < arr.length; i++) {
        var ar = arr[i].split("=");
        if (ar[0] == keyValue) {
            if (decodeURI(ar[1]) == 'undefined') {
                return "";
            } else {
                return decodeURI(ar[1]);
            }
        }
    }
    return "";
};

Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

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


function myTimer() {
    valueOne = valueOne+ 0.5;
    valueTwo = valueTwo +0.5;
    valueThree = valueThree +1;
    valueAll = valueOne + valueTwo + valueThree;


    $(".flowValueOne").val(valueOne);
    $(".flowValueTwo").val(valueTwo);
    $(".flowValueThree").val(valueThree);
    $(".flowValueAll").val(valueAll);
}
function dTimer(){
    $("#Box_points_switch1").find(".switch").trigger("click");
    $(".fertilizerInput").removeAttr("disabled");
    $(".waterInput").removeAttr("disabled");
    $(".timeInput").removeAttr("disabled");
    $(".valueInput").removeAttr("disabled");
}
function dValuer(nowValue){
    if(Number($(".flowValueAll").val()) >=  Number(nowValue)+Number($(".valueInput").val())){
        $("#Box_points_switch1").find(".switch").trigger("click");
    }
}


function clearDValue() {
    clearInterval(dValue);
}
function clearDtime() {
    clearInterval(dTime);
}
function myStopFunction() {
    clearInterval(myVar);
}