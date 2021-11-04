var deviceLine0;
var deviceLine1;
var deviceLine2;
var x = "";
var y = "";
var $this;
var colorNum = "";
var camerNumberList = "";
var innerDeviceNum = 0;
var innerDeviceIdList = [];
var innerDeviceNameList = [];
var greenHouseList = sessionStorage.getItem("greenHouseList");

var stInnerDevice;


$(function () {
    var documentHeight = $(window).height();
    $(".leftBox").height(documentHeight);
    $(".rightTop").height(documentHeight - $(".rightBottom").height() - 10);
    $(".bgBox").height(documentHeight);
    $(".content").height(documentHeight);
    $(".flagBox").css("margin-left", "-" + $(".leftBox").width() * 90 / 100 / 2 + "px");
    $(".flagBoxMb").css("margin-left", "-" + $(".leftBox").width() * 90 / 100 / 2 + "px");
    $(window).resize(function () {
        var documentHeight = $(window).height();
        $(".leftBox").height(documentHeight);
        $(".rightTop").height(documentHeight - $(".rightBottom").height() - 10);
        $(".bgBox").height(documentHeight);
        $(".content").height(documentHeight);
        $(".flagBox").css("margin-left", "-" + $(".leftBox").width() * 90 / 100 / 2 + "px");
        $(".flagBoxMb").css("margin-left", "-" + $(".leftBox").width() * 90 / 100 / 2 + "px");

        if (deviceLine0) {
            deviceLine0.resize();
        }
        if (deviceLine1) {
            deviceLine1.resize();
        }
        if (deviceLine2) {
            deviceLine2.resize();
        }

        //重新加载视频
        for (var m = 0; m < camerNumberList.length; m++) {
            getCamareUrl(camerNumberList[m].id, m);
        }

    });
//获取大棚位置信息
    /*    if (JSON.parse(greenHouseList)) {
            addGreenHouseItem(JSON.parse(greenHouseList));
            addGreenHouseSpeed(JSON.parse(greenHouseList));
            getGreenHouseErr();


            innerDeviceIdList = JSON.parse(sessionStorage.getItem("innerDeviceIdList"));
            innerDeviceNameList = JSON.parse(sessionStorage.getItem("innerDeviceNameList"));
            //每隔30秒循环刷新大棚内部设备
            getInnerDeviceMsg();
            stInnerDevice = setInterval(getInnerDeviceMsg, 10000);
        } else {*/
    getGreenHouse();

    /*    }*/

    //获取外部大棚设备信息
    getOutOfDevice();

//获取外部所有摄像头Num
    getAllOutDeviceNum();


    $(".leftDeviceItem").click(function () {
        /*       if($(this).find(".popup").hasClass("show")){
                   $(this).find(".popup").addClass("hidden");
                   $(this).find(".popup").removeClass("show");
               }else{
                   $(this).find(".popup").addClass("show");
                   $(this).find(".popup").removeClass("hidden");
                   $(this).find(".popup").css("top", -$(this).find(".popup").height() -12)
               }*/

        if ($(this).find(".deviceNumber").length <= 0) {
            $this = $(this);
            $('.greenHouseEditBox').css("display", "block");
            $(".greenHouseEditMb").css("display", "block");
            x = $(this).attr("data-x");
            y = $(this).attr("data-y");
        } else {
            // var farmNameText = $(this).find(".deviceNumber").text();
            var farmName = $(this).attr("data-name");
            if (farmName.length > 0) {
                window.location.href = "greenhouseDetailControl?id=" + $(this).attr("data-id") + "&farmName=" + farmName;
            } else {
                window.location.href = "greenhouseDetailControl?id=" + $(this).attr("data-id");
            }
        }
    });
    $('.confirm').click(function () {

        if ($.trim($(".greenHouseName").val()) == "") {
            $(".greenHouseName").focus();
            $(".greenHouseName").val("");
        } else {
            $.ajax({
                type: "POST",
                url: "../newFarmInfo/addFarmByFront",
                data: {
                    farmName: $('.greenHouseName').val(),
                    x: x,
                    y: y
                },
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    var $deviceItemBg = $('<div class="deviceItemBg"></div>');
                    var $deviceNumber = $('<div class="deviceNumber"></div>');
                    $deviceNumber.text($(".greenHouseName").val());
                    $deviceItemBg.appendTo($this);
                    $deviceNumber.appendTo($this);

                    $('.greenHouseEditBox').css("display", "none");
                    $(".greenHouseEditMb").css("display", "none");
                    $(".greenHouseName").val("");
                },
                error: function (e) {
                    console.log(e);
                }
            });
        }
    });

    $('.cancel').click(function () {
        $('.greenHouseEditBox').css("display", "none");
        $(".greenHouseEditMb").css("display", "none");
        $(".greenHouseName").val("");
    });


    /*   window.location.reload(true)*/
    /*    $("#fullImg").trigger("click");*/


});

//判断浏览器是否全屏
function f_IsFullScreen() {
    return (document.body.scrollHeight == window.screen.height && document.body.scrollWidth == window.screen.width);
}

//大屏名字变动随着中性变化
$.post("../user/selUserDetails", {}, function (res) {
    if (res.state == 'success' && res.data.info) {
        $("#company").html(res.data.info.company);
        if(res.data.info.logo){
            $("#logo").attr('src', res.data.info.logo);
        }
        //<span id="screenTitle"></span>
    }
});

//首页循环显示大棚内部设备信息
function getInnerDeviceMsg() {

    if (innerDeviceNum <= 48) {
        addInnerDeviceMsg();
    } else {
        innerDeviceNum = 0;
        addInnerDeviceMsg();
    }
}


//循环创建内部设备信息
function addInnerDeviceMsg() {
    deviceLine2 = echarts.init(document.getElementById('lineChart1'));
    deviceLine2.clear();
    $.ajax({
        type: "GET",
        url: "../newFarmInfo/getFarmDeviceList",
        dataType: "json",
        data: {
            page: 1,
            size: 10,
            farmId: innerDeviceIdList[innerDeviceNum],
        },
        success: function (data) {
            $(".innerDeviceTitleP").text(innerDeviceNameList[innerDeviceNum]);
            innerDeviceNum++;
            var innerNode = [];
            $('.deviceTwoMsg').empty();
            $(".deviceTwoDangerMsg").empty();
            $(".twoNoMsg").css("display", "none");

            if (data.datas.length > 0) {
                $(".noLineMsg").css("display", "none");
                for (var m = 0; m < data.datas.length; m++) {
                    if (data.datas[m].deviceType != 2) {
                        innerNode.push(data.datas[m]);
                    }
                }

                //取第一个不为继电器的设备
                if (innerNode.length > 0) {
                    for (var j = 0; j < 1; j++) {
                        var type = [];
                        var type1 = [];
                        var type2 = [];
                        var typeVal = [];
                        var typeVal1 = [];
                        var typeVal2 = [];
                        if (innerNode[j].type && innerNode[j].type.length > 0) {
                            type = innerNode[j].type.split("/");
                            typeVal = innerNode[j].data.split("|");
                            for (var w = 0; w < type.length; w++) {
                                type[w] = $.trim(type[w]);
                                typeVal[w] = $.trim(typeVal[w]);
                            }


                            for (var q = 0; q < type.length; q++) {
                                if (type[q] == '土壤温度' || type[q] == '土壤湿度' || type[q] == '土壤PH' || type[q] == '土壤电导率') {
                                    type2.push(type[q]);
                                    typeVal2.push(typeVal[q]);
                                } else {
                                    type1.push(type[q]);
                                    typeVal1.push(typeVal[q]);
                                }
                            }
                            if (type1.length > 0) {
                                var $deviceMsgBox = $(".deviceTwoMsg").eq(j);
                                for (var e = 0; e < type1.length; e++) {
                                    var $deviceMsg = $("<div class='deviceMsg'></div>");
                                    $deviceMsg.text(type1[e] + ":" + typeVal1[e]);
                                    $deviceMsg.appendTo($deviceMsgBox);
                                }

                            } else {
                                $(".twoNoMsg").css("display", "none");
                                setTimeout(function () {
                                    $("#deviceTwoNoMsg").css("display", "block");
                                }, 200);
                            }

                            if (type2.length > 0) {
                                var $deviceTwoDangerMsg = $(".deviceTwoDangerMsg").eq(j);
                                for (var r = 0; r < type2.length; r++) {
                                    var $dangerMsg = $("<div class='dangerMsg'></div>");
                                    var $dangerMsgType = $("<span></span>");
                                    var $dangerMsgVal = $("<span></span>");

                                    $dangerMsgType.text(type2[r]);
                                    $dangerMsgVal.text(typeVal2[r]);
                                    $dangerMsgType.appendTo($dangerMsg);
                                    $dangerMsgVal.appendTo($dangerMsg);
                                    $dangerMsg.appendTo($deviceTwoDangerMsg);
                                }
                            } else if (type1.length > 0 && type2.length <= 0) {
                                var xData = ['土壤温度', '土壤湿度', '土壤导电率', '土壤PH'];
                                var $deviceTwoDangerMsg = $(".deviceTwoDangerMsg").eq(j);
                                for (var t = 0; t < xData.length; t++) {
                                    var $dangerMsg = $("<div class='dangerMsg'></div>");
                                    var $dangerMsgType = $("<span></span>");
                                    var $dangerMsgVal = $("<span></span>");

                                    $dangerMsgType.text(xData[t]);
                                    $dangerMsgVal.text('暂无数据');
                                    $dangerMsgType.appendTo($dangerMsg);
                                    $dangerMsgVal.appendTo($dangerMsg);
                                    $dangerMsg.appendTo($deviceTwoDangerMsg);
                                }
                            }
                            initTwoDeviceLine(innerNode[j].deviceNumber)
                        } else {
                            $(".twoNoMsg").css("display", "none");
                            setTimeout(function () {
                                $(".twoNoMsg").css("display", "block");
                            }, 200);
                        }
                    }
                }
            } else {
                $(".twoNoMsg").css("display", "none");
                setTimeout(function () {
                    $(".twoNoMsg").css("display", "block");
                }, 200);


            }


        },
        error: function (e) {
            console.log(e);
        }
    });

}


//设备曲线图
function initDeviceLine(deviceNumber, z) {
    if (z == 0) {
        deviceLine0 = echarts.init(document.getElementById('lineChart' + z));
        deviceLine0.clear();
    }


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

                    var server = [];
                    var colorNum = 0;
                    var colorArr = ["#00A0E9", "#00FF00"];
                    for (var q = 0; q < newKeyArr.length; q++) {
                        if (newKeyArr[q] == "PM2.5" || newKeyArr[q] == "PM10") {
                            var sObj = {};
                            sObj.name = newKeyArr[q];
                            sObj.type = 'line';
                            var ss = newKeyArr[q];
                            var cArr = [];
                            for (var c = 0; c < lastObj[ss].length; c++) {

                                cArr.push(Number(lastObj[ss][c]));

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
                        var legData = [];
                        for (var v = 0; v < server.length; v++) {
                            legData.push(server[v].name)
                        }
                    } else {
                        if (newKeyArr.length > 2) {
                            var xLength = 2;
                        } else {
                            var xLength = newKeyArr.length;
                        }
                        for (var p = 0; p < xLength; p++) {
                            newKeyArr.remove("风向");
                            var sObj = {};
                            sObj.name = newKeyArr[p];
                            sObj.type = 'line';
                            var ss = newKeyArr[p];
                            var cArr = [];
                            for (var d = 0; d < lastObj[ss].length; d++) {

                                cArr.push(Number(lastObj[ss][d]));

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
                        var legData = [];
                        for (var v = 0; v < server.length; v++) {
                            legData.push(server[v].name)
                        }
                    }


                    option = {
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            color: ["#00A0E9", "#00FF00"],
                            data: legData,
                            top: '0',
                            left: 'center',
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

                    if (z == 0) {
                        deviceLine0.setOption(option);
                    }/* else if (z == 1) {
                        deviceLine1.setOption(option);
                    } else {
                        deviceLine2.setOption(option);
                    }*/
                }

            } else {

            }
        },
        error: function (e) {
            console.log(e);
        }
    });


}

function initTwoDeviceLine(deviceNumber) {
    /*    deviceLine2 = echarts.init(document.getElementById('lineChart1'));
        deviceLine2.clear();*/
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

                    var server = [];
                    var colorNum = 0;
                    var colorArr = ["#00A0E9", "#00FF00"];
                    for (var q = 0; q < newKeyArr.length; q++) {
                        if (newKeyArr[q] == "PM2.5" || newKeyArr[q] == "PM10") {
                            var sObj = {};
                            sObj.name = newKeyArr[q];
                            sObj.type = 'line';
                            var ss = newKeyArr[q];
                            var cArr = [];
                            for (var c = 0; c < lastObj[ss].length; c++) {

                                cArr.push(Number(lastObj[ss][c]));

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
                        var legData = [];
                        for (var v = 0; v < server.length; v++) {
                            legData.push(server[v].name)
                        }
                    } else {
                        if (newKeyArr.length > 2) {
                            var xLength = 2;
                        } else {
                            var xLength = newKeyArr.length;
                        }
                        for (var p = 0; p < xLength; p++) {
                            newKeyArr.remove("风向");
                            var sObj = {};
                            sObj.name = newKeyArr[p];
                            sObj.type = 'line';
                            var ss = newKeyArr[p];
                            var cArr = [];
                            for (var d = 0; d < lastObj[ss].length; d++) {

                                cArr.push(Number(lastObj[ss][d]));

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
                        var legData = [];
                        for (var v = 0; v < server.length; v++) {
                            legData.push(server[v].name)
                        }
                    }


                    option = {
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            color: ["#00A0E9", "#00FF00"],
                            data: legData,
                            top: '0',
                            left: 'center',
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

                    deviceLine2.setOption(option);
                }

            } else {

            }
        },
        error: function (e) {
            console.log(e);
        }
    });

}


function initThreeDeviceLine() {

    deviceLine3 = echarts.init(document.getElementById('lineChartThree'));
    deviceLine3.clear();

    var colorArr = ['#00A0E9', '#00FF00'];


    var server = [
        {
            name: 'PM2.5',
            type: 'line',
            data: [20, 15, 17, 19, 22, 25, 31, 42, 28, 35, 41, 28, 39, 37, 33, 24],
            itemStyle: {
                normal: {
                    color: '#00A0E9'
                }
            }
        },
        {
            name: 'PM10',
            type: 'line',
            data: [18, 32, 57, 45, 33, 28, 43, 45, 18, 45, 48, 48, 29, 17, 43, 18],
            itemStyle: {
                normal: {
                    color: '#00FF00'
                }
            }
        },
    ];
    option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            color: ["#00A0E9", "#00FF00"],
            data: ['PM2.5', 'PM10'],
            top: '0',
            left: 'right',
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
            bottom: '0',
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
            data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'],
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


    deviceLine3.setOption(option);

}

//获取所有大棚位置信息
function getGreenHouse() {
    $.ajax({
        type: "get",
        url: "../newFarmInfo/getList",
        dataType: "json",
        data: {
            page: 1,
            size: 100
        },
        success: function (data) {
            if (data.datas.length > 0) {
                for (var n = 0; n < data.datas.length; n++) {
                    innerDeviceIdList.push(data.datas[n].id);
                    innerDeviceNameList.push(data.datas[n].farmName);

                    if (data.datas[n].id == 68) {
                        getSouthDevice(68);
                    }
                    if (data.datas[n].id == 67) {
                        getNorthDevice(67);
                    }
                }


                sessionStorage.setItem("greenHouseList", JSON.stringify(data.datas));
                sessionStorage.setItem("innerDeviceIdList", JSON.stringify(innerDeviceIdList));
                sessionStorage.setItem("innerDeviceNameList", JSON.stringify(innerDeviceNameList));

                addGreenHouseItem(data.datas);
                addGreenHouseSpeed(data.datas);
                getGreenHouseErr();

                //每隔30秒循环刷新大棚内部设备
                getInnerDeviceMsg();
                stInnerDevice = setInterval(getInnerDeviceMsg, 10000);

            }
        },
        error: function (e) {
            console.log(e);
        }
    });
}


function getSouthDevice(id) {
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
            var innerNode = [];
            $('.deviceSouthBox').empty();

            if (data.datas.length > 0) {
                for (var m = 0; m < data.datas.length; m++) {
                    if (data.datas[m].deviceType != 2) {
                        innerNode.push(data.datas[m]);
                    }
                }

                //取第一个不为继电器的设备
                if (innerNode.length > 0) {
                    for (var j = 0; j < 1; j++) {
                        var type = [];
                        var type1 = [];
                        var typeVal = [];
                        var typeVal1 = [];
                        if (innerNode[j].type && innerNode[j].type.length > 0) {
                            type = innerNode[j].type.split("/");
                            typeVal = innerNode[j].data.split("|");
                            for (var w = 0; w < type.length; w++) {
                                type[w] = $.trim(type[w]);
                                typeVal[w] = $.trim(typeVal[w]);
                            }
                            // for (var q = 0; q < type.length; q++) {
                            //         type1.push(type[q]);
                            //         typeVal1.push(typeVal[q]);
                            //
                            // }
                            if (type.length > 0) {
                                var $deviceSouthBox = $(".deviceSouthBox");
                                for (var e = 0; e < type.length; e++) {
                                    var $deviceMsg = $("<div class='deviceMsg'></div>");
                                    $deviceMsg.text(type[e] + ":" + typeVal[e]);
                                    $deviceMsg.appendTo($deviceSouthBox);
                                }

                            } else {
                                $("#southNoMsg").css("display", "none");
                                setTimeout(function () {
                                    $("#southNoMsg").css("display", "block");
                                }, 200);
                            }
                        } else {
                            $("#southNoMsg").css("display", "none");
                            setTimeout(function () {
                                $("#southNoMsg").css("display", "block");
                            }, 200);
                        }
                    }
                }
            } else {
                $("#southNoMsg").css("display", "none");
                setTimeout(function () {
                    $("#southNoMsg").css("display", "block");
                }, 200);


            }


        },
        error: function (e) {
            console.log(e);
        }
    });
}

function getNorthDevice(id) {
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
            var innerNode = [];
            $(".deviceNorthBox").empty();
            if (data.datas.length > 0) {
                for (var m = 0; m < data.datas.length; m++) {
                    if (data.datas[m].deviceType != 2) {
                        innerNode.push(data.datas[m]);
                    }
                }

                //取第一个不为继电器的设备
                if (innerNode.length > 0) {
                    for (var j = 0; j < 1; j++) {
                        var type = [];
                        var type1 = [];
                        var typeVal = [];
                        var typeVal1 = [];
                        if (innerNode[j].type && innerNode[j].type.length > 0) {
                            type = innerNode[j].type.split("/");
                            typeVal = innerNode[j].data.split("|");
                            for (var w = 0; w < type.length; w++) {
                                type[w] = $.trim(type[w]);
                                typeVal[w] = $.trim(typeVal[w]);
                            }
                            // for (var q = 0; q < type.length; q++) {
                            //     type1.push(type[q]);
                            //     typeVal1.push(typeVal[q]);
                            //
                            // }
                            if (type.length > 0) {
                                var $deviceNorthBox = $(".deviceNorthBox");
                                for (var e = 0; e < type.length; e++) {
                                    var $deviceMsg = $("<div class='deviceMsg'></div>");
                                    $deviceMsg.text(type[e] + ":" + typeVal[e]);
                                    $deviceMsg.appendTo($deviceNorthBox);
                                }

                            } else {
                                $("#northNoMsg").css("display", "none");
                                setTimeout(function () {
                                    $("#northNoMsg").css("display", "block");
                                }, 200);
                            }
                        } else {
                            $("#northNoMsg").css("display", "none");
                            setTimeout(function () {
                                $("#northNoMsg").css("display", "block");
                            }, 200);
                        }
                    }
                }
            } else {
                $("#northNoMsg").css("display", "none");
                setTimeout(function () {
                    $("#northNoMsg").css("display", "block");
                }, 200);


            }


        },
        error: function (e) {
            console.log(e);
        }
    });
}


function addGreenHouseItem(list) {
    var $leftDeviceItem = $(".leftDeviceItem");
    let irrigationTime, startTime, nowTime, end;

    for (var j = 0; j < list.length; j++) {
        for (var b = 0; b < $leftDeviceItem.length; b++) {
            if (list[j].x == $leftDeviceItem.eq(b).attr("data-x") && list[j].y == $leftDeviceItem.eq(b).attr("data-y")) {

                var $deviceItemBg = $('<div class="deviceItemBg"></div>');
                var $deviceNumber = $('<div class="deviceNumber"></div>');
                $deviceItemBg.css("height", $leftDeviceItem.eq(b).height() + "px");
                $deviceNumber.css("height", $leftDeviceItem.eq(b).height() + "px");
                $deviceNumber.css("line-height", $leftDeviceItem.eq(b).height() + "px");


                if (list[j].status == 0) {
                    $deviceItemBg.addClass("c009944");
                } else if (list[j].status == 1) {
                    $deviceItemBg.addClass("cff0000");
                } else if (list[j].status == 2) {//灌溉
                    $deviceItemBg.addClass("c13e1f3");
                    irrigationTime = list[j].irrigationTime;
                    startTime = new Date(irrigationTime.replace(/-/g, "/")).getTime();
                    nowTime = new Date().getTime();
                    end = ((nowTime - startTime) / 600 / parseInt(list[j].duration)).toFixed(0);
                    end = end > 100 ? 100 : end;
                    $deviceItemBg.css("width", end + '%');
                } else if (list[j].status == 3) {
                    $deviceItemBg.addClass("c949900");
                    irrigationTime = list[j].irrigationTime;
                    startTime = new Date(irrigationTime.replace(/-/g, "/")).getTime();
                    nowTime = new Date().getTime();
                    end = ((nowTime - startTime) / 600 / 60 / 24 / parseInt(list[j].duration)).toFixed(2);
                    end = end > 100 ? 100 : end;
                    $deviceItemBg.css("width", (100 - end) + '%');
                    $deviceItemBg.css("right", "0");
                } else if (list[j].status == 4) {
                    $deviceItemBg.addClass("c8d450a");
                    irrigationTime = list[j].irrigationTime;
                    startTime = new Date(irrigationTime.replace(/-/g, "/")).getTime();
                    nowTime = new Date().getTime();
                    end = ((nowTime - startTime) / 600 / parseInt(list[j].duration)).toFixed(0);
                    end = end > 100 ? 100 : end;
                    $deviceItemBg.css("width", end + '%');
                }
                $deviceNumber.text(list[j].farmName);
                $deviceItemBg.appendTo($leftDeviceItem.eq(b));
                $deviceNumber.appendTo($leftDeviceItem.eq(b));
                $leftDeviceItem.eq(b).attr("data-id", list[j].id);
                $leftDeviceItem.eq(b).attr("data-name", list[j].farmName);
                var $this = $deviceNumber;
                var $that = list[j].farmName;
                $.ajax({
                    type: "GET",
                    url: "../newFarmInfo/getFarmDeviceList",
                    dataType: "json",
                    async: false,
                    data: {
                        page: 1,
                        size: 10,
                        farmId: list[j].id,
                    },
                    success: function (data) {
                        for (var i = 0; i < data.datas.length; i++) {
                            if (data.datas[i].deviceType != 2) {
                                var itemName = data.datas[i].type;
                                var itemNameArr = itemName.split("/");
                                var itemValue = data.datas[i].data;
                                if (itemValue && itemValue.length > 0) {
                                    var itemValueArr = itemValue.split("|");
                                    var textVal = $that;
                                    for (var j = 0; j < itemValueArr.length; j++) {
                                        textVal = textVal + " " + $.trim(itemValueArr[j]);
                                    }
                                    $this.text(textVal);
                                    break;
                                }

                            }
                        }


                    },
                    error: function (e) {
                        console.log(e);
                    }
                });
                break;
            }
        }
    }
}

function addGreenHouseSpeed(list) {
    var $leftDeviceItem = $(".leftDeviceItem");
    for (var w = 0; w < list.length; w++) {
        for (var c = 0; c < $leftDeviceItem.length; c++) {
            //对处于灌溉状态以外的农场设置农产品生长周期进度
            if (list[w].x == $leftDeviceItem.eq(c).attr("data-x") && list[w].y == $leftDeviceItem.eq(c).attr("data-y") && list[w].status != '2' && list[w].status != '3' && list[w].status != '4') {
                var $needDeviceItem = $leftDeviceItem.eq(c);
                $.ajax({
                    type: "get",
                    url: "../newFarmInfo/getCrop",
                    dataType: "json",
                    async: false,
                    data: {
                        id: list[w].id
                    },
                    success: function (data) {
                        if (data.data && data.state == 'success') {
                            var startDay = new Date(data.data.plantingDate.replace(/-/g, "/")).getTime();
                            var nowDay = new Date().getTime();
                            var endDay = new Date(data.data.harvestDate.replace(/-/g, "/")).getTime();

                            var end = ((nowDay - startDay) / (endDay - startDay) * 100).toFixed(0) + "%";
                            list[w].grow = end;
                            $needDeviceItem.find(".deviceItemBg").css("width", end);
                        }
                    },
                    error: function (e) {
                        console.log(e);
                    }
                });
            }
        }
    }
}

function getGreenHouseErr() {
    $.ajax({
        type: "get",
        url: "../newFarmInfo/getFarmsException",
        dataType: "json",
        async: false,
        success: function (data) {
            var $leftDeviceItem = $(".leftDeviceItem");
            if (data != null && data.datas.length > 0) {
                var datas = data.datas;
                var tempLeftDeviceItem;
                for (var w = 0; w < datas.length; w++) {
                    for (var c = 0; c < $leftDeviceItem.length; c++) {
                        tempLeftDeviceItem = $leftDeviceItem.eq(c);
                        if (datas[w].x == tempLeftDeviceItem.attr("data-x") && datas[w].y == tempLeftDeviceItem.attr("data-y")) {
                            tempLeftDeviceItem.attr("title", datas[w].remark);
                            tempLeftDeviceItem.find(".deviceItemBg").removeClass("c009944").removeClass("c13e1f3").removeClass("c949900").removeClass("c8d450a").addClass("cff0000");
                            //如果当前农场没有任何作物，直接将进度条设置为100%来显示异常状态
                            if (tempLeftDeviceItem.find(".deviceItemBg").width() == 0) {
                                tempLeftDeviceItem.find(".deviceItemBg").css("width", "100%");
                            }
                        }
                    }
                }
            }
        },
        error: function (e) {
            console.log(e);
        }
    });
}

function getOutOfDevice() {
    $.ajax({
        type: "get",
        url: "../newFarmInfo/getDeviceListOutOfGreenhouse",
        dataType: "json",
        data: {
            page: 1,
            size: 10
        },
        success: function (data) {
            if (data.datas.length > 0) {
                $('.deviceOneMsg').empty();
                $(".deviceOneDangerMsg").empty();
                var nData = [];
                for (var i = 0; i < data.datas.length; i++) {
                    if (data.datas[i].deviceType != 2) {
                        nData.push(data.datas[i]);
                    }
                }
                //暂时只展示三台设备
                for (var j = 0; j < 1; j++) {
                    var type = [];
                    var type1 = [];
                    var type2 = [];
                    var typeVal = [];
                    var typeVal1 = [];
                    var typeVal2 = [];
                    if (nData[j].type && nData[j].type.length > 0) {
                        type = nData[j].type.split("/");
                        typeVal = nData[j].data.split("|");
                        for (var w = 0; w < type.length; w++) {
                            type[w] = $.trim(type[w]);
                            typeVal[w] = $.trim(typeVal[w]);
                        }


                        for (var q = 0; q < type.length; q++) {
                            if (type[q] == '土壤温度' || type[q] == '土壤湿度' || type[q] == '土壤PH' || type[q] == '土壤电导率') {
                                type2.push(type[q]);
                                typeVal2.push(typeVal[q]);
                            } else {
                                type1.push(type[q]);
                                typeVal1.push(typeVal[q]);
                            }
                        }
                        if (type1.length > 0) {
                            var $deviceMsgBox = $(".deviceOneMsg").eq(j);
                            for (var e = 0; e < type1.length; e++) {
                                var $deviceMsg = $("<div class='deviceMsg'></div>");
                                $deviceMsg.text(type1[e] + ":" + typeVal1[e]);
                                $deviceMsg.appendTo($deviceMsgBox);
                            }

                        } else {
                            $(".oneNoMsg").css("display", "none");
                            $("#deviceOneNoMsg").css("display", "block");
                        }

                        if (type2.length > 0) {
                            var $deviceOneDangerMsg = $(".deviceOneDangerMsg").eq(j);
                            for (var r = 0; r < type2.length; r++) {
                                var $dangerMsg = $("<div class='dangerMsg'></div>");
                                var $dangerMsgType = $("<span></span>");
                                var $dangerMsgVal = $("<span></span>");

                                $dangerMsgType.text(type2[r]);
                                $dangerMsgVal.text(typeVal2[r]);
                                $dangerMsgType.appendTo($dangerMsg);
                                $dangerMsgVal.appendTo($dangerMsg);
                                $dangerMsg.appendTo($deviceOneDangerMsg);
                            }
                        } else {
                            var xData = ['土壤温度', '土壤湿度', '土壤导电率', '土壤PH'];
                            var $deviceOneDangerMsg = $(".deviceOneDangerMsg").eq(j);
                            for (var t = 0; t < xData.length; t++) {
                                var $dangerMsg = $("<div class='dangerMsg'></div>");
                                var $dangerMsgType = $("<span></span>");
                                var $dangerMsgVal = $("<span></span>");

                                $dangerMsgType.text(xData[t]);
                                $dangerMsgVal.text('暂无数据');
                                $dangerMsgType.appendTo($dangerMsg);
                                $dangerMsgVal.appendTo($dangerMsg);
                                $dangerMsg.appendTo($deviceOneDangerMsg);
                            }
                        }
                        initDeviceLine(nData[j].deviceNumber, j)
                    } else {
                        $(".oneNoMsg").css("display", "block");

                    }
                }
            } else {
                $(".oneNoMsg").css("display", "block");
            }
        },
        error: function (e) {
            console.log(e);
        }
    });
}


function getAllOutDeviceNum() {
    $.ajax({
        type: "get",
        url: "../newFarmInfo/getCameraListOutOfGreenhouse",
        dataType: "json",
        data: {
            page: 1,
            size: 10
        },
        success: function (data) {
            if (data.state == "success" && data.datas.length > 0) {
                var datas = data.datas;
                camerNumberList = datas;
                for (var m = 0; m < datas.length; m++) {
                    getCamareUrl(datas[m].id, m);
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
    //         "id": id
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
    getCameraAddress(id, 0).then(data => {
        if (data == null || data == undefined) {
            $("#playerNoData" + m).find(".nomsg").text(data.msg).css("display", "block");
            return;
        }
        let rtmpHd = document.getElementById("rtmpHd" + m);
        // var hlsHd = document.getElementById("hlsHd");
        rtmpHd.src = data.rtmp;
        // hlsHd.src = data.hlsHd;
        let player = new EZUIPlayer('player' + m);
        $("#player" + m).show();
        $("#playerNoData" + m).hide();
    });
}


Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
