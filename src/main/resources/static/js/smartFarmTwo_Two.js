var cameraNumber = "";
var language = getCookie('jxct_lang');
var cameraNumber = "";
var myChart2Time=0;
var myChart24Time=0;
$(function () {
//页面各元素高度自适应设置
    var documentHeight = $(window).height();
    $(".topContent").height(documentHeight - 225 - 25 - 30);
    $(".farming-info-body-roll").eq(0).height($(".topContent").height() - 40 - 5);
    // $(".playerSizeBox").height($(".topLeftTop").height() - $(".topLeftTopTitleBox").height());
    $(".playerSizeBox").height($(".bottomThree").height() - $(".bottomThreeTitleBox").height());
    $(".equipmentItemBox").height($(".bottomThree").height() - 25 - 17);
    $(".topLeftBottom").height($(".topContent").height() - $(".topLeftTop").height() - 15);
    // $(".msgBox").height($(".topLeftBottom").height() - $(".topLeftBottomTitle").height() - 35);
    $(".topCenterContent").height($(".topContent").height() - 2);
    if($(".topContent").height()-( $(".topCenterFourPart").height()*2)>0){
        $(".dangerMsgItemBox").height($(".topContent").height() - $(".topCenterFourPart").height() - ($(".topCenterFourPart").height()*0.7));

    }else if($(".topContent").height()-( $(".topCenterFourPart").height()*1.5)>0){
        $(".dangerMsgItemBox").height($(".topContent").height() - $(".topCenterFourPart").height() - ($(".topCenterFourPart").height()*0.3));

    }
    else{
        $(".dangerMsgItemBox").height($(".topContent").height() - $(".topCenterFourPart").height() - 70);

    }
    $(".bottomItema").height($(".topContent").height() - $(".topRightBottom").height() - 54);
    $(".environmental").height($(".topContent").height() - $(".topRightBottom").height() - 54);

    $(".bottomOne").width($(".bottomContent").width() / 4 - 1);
    $(".bottomTwo").width($(".bottomContent").width() / 4 - 1);
    $(".bottomThree").width($(".bottomContent").width() / 4 - 1 + 15);
    $(".bottomFour").width($(".bottomContent").width() / 4 - 1 - 15);
    $(".topCenterFiveMb").height($(".dangerMsg").height());
    $(window).resize(function () {
        var documentHeight = $(window).height();
        $(".topContent").height(documentHeight - 225 - 25 - 30);
        $(".farming-info-body-roll").eq(0).height($(".topContent").height() - 40 - 5);
        $(".playerSizeBox").height($(".bottomThree").height() - $(".bottomThreeTitleBox").height());
        $(".equipmentItemBox").height($(".bottomThree").height() - 25 - 17);
        $(".topLeftBottom").height($(".topContent").height() - $(".topLeftTop").height() - 15);
        $(".topCenterContent").height($(".topContent").height() - 2);
        $(".dangerMsgItemBox").height($(".topContent").height() - $(".topCenterFourPart").height() - 40 - 30);
        $(".environmental").height($(".topContent").height() - $(".topRightBottom").height() - 54);
        $(".bottomOne").width($(".bottomContent").width() / 4 - 1);
        $(".bottomTwo").width($(".bottomContent").width() / 4 - 1);
        $(".bottomThree").width($(".bottomContent").width() / 4 - 1);
        $(".bottomFour").width($(".bottomContent").width() / 4 - 1);
        $(".topCenterFiveMb").height($(".dangerMsg").height());
    });
    //大屏名字变动随着中性变化
    $.post("../user/selUserDetails", {}, function (res) {
        if (res.state == 'success' && res.data.info) {
            $("#screenTitle").html(res.data.info.company);
            //<span id="screenTitle"></span>
        }
    });
    $("#playerNoData").click(function () {
        layer.msg("未安装摄像头", {
            offset: '20rem'
        });
    });
    //1、查询用户下所有农产品以及所属农场
    findFarmCrops();
    //2、查询用户下触发器历史记录
    findTriggerList(10);
    //3、查询人员结构
    findPeopele();
    //4、农作物文字滚动
    marqueen('msgBox').start(100, 1);

    $(document).on("click", ".itemNameValueBox", function () {
        // var num=$(this).index();
        var isTrue = $(this).find('input[type=checkbox]').prop('checked');
        $(this).find('input[type=checkbox]').prop('checked', !isTrue);
        if (!isTrue) {
            $(this).css("background-image", "linear-gradient(45deg, #00fbcf, #007dfe)")
        } else {
            $(this).css("background-image", "")
            $(this).css("background", "#2269A6")
        }
        findDeviceLine($(this).attr('number'))
    })

});

/**
 * 出勤率，暂时的死数据
 */
function initAttendanceLine(dataId) {
    var myChart30 = echarts.init(document.getElementById('attendanceLine'));
    if (dataId == "10") {
        var data = [0, 40, 58, 47, 65, 55, 72];
    } else {
        var data = [22, 47, 58, 43, 69, 50, 77];
    }

    option30 = {

        tooltip: {
            trigger: 'axis',
            axisPointer: {
                lineStyle: {
                    color: '#57617B'
                }
            }
        },

        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: "20%",
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisLine: {
                lineStyle: {
                    color: '#ffffff'
                }
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    fontSize: 10
                }
            },
            axisTick: {//坐标轴刻度相关设置。
                show: false,
            },
            data: ['0', '5', '10', '15', '20', '25', '30']
        }],
        yAxis: [{
            type: 'value',
            splitNumber: 2,
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#ffffff'
                }
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    fontSize: 10
                }
            },
            splitLine: {
                lineStyle: {
                    type: 'dashed',
                    color: '#ffffff'
                }
            }
        }],
        series: [{
            name: '出勤人数',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
                normal: {
                    width: 3
                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(205,52,42, 0.5)'
                    }, {
                        offset: 0.8,
                        color: 'rgba(235,235,21, 0)'
                    }], false),
                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                    shadowBlur: 10
                },
            },
            itemStyle: {
                normal: {

                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                        offset: 0,
                        color: 'rgba(205,52,42,1)'
                    }, {
                        offset: 1,
                        color: 'rgba(235,235,21,1)'
                    }])
                },
                emphasis: {
                    color: 'rgb(99,250,235)',
                    borderColor: 'rgba(99,250,235,0.2)',
                    extraCssText: 'box-shadow: 8px 8px 8px rgba(0, 0, 0, 1);',
                    borderWidth: 10
                }
            },
            data: data
        }]
    };
    myChart30.setOption(option30);
    // loopPlayback(myChart30,6);
    tools.loopShowTooltip(myChart30, option30, {loopSeries: true,interval:2000});
    num30=setInterval(function () {
        myChart30.clear();
        myChart30.setOption(option30);
    },12000);

}
Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};

Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

var oneLoad = true;//用于判断是否是第一次加载进入
var str;//div拼接用，配合append

/**
 * 查询用户下所有农产品以及所属农场,右下角生长周期列表
 */
findFarmCrops = function () {
    $.post(
        "../farmCrops/getList",
        {"page": "1", "size": "1000"},
        function (res) {
            if (res.state == 'success') {
                var farmCropsList = res.datas;
                //调用方法获取农场信息
                findFarm(farmCropsList);
            }
        })
}

/**
 *  查询农场信息
 */
var farmList = [];
findFarm = function (farmCropsList) {
    $.post(
        "../farmInfo/getList",
        {"page": "1", "size": "1000"},
        function (res) {
            if (res.state == 'success' && res.size > 0) {
                farmList = res.datas;
                var farmName;
                for (var k = 0; k < farmList.length; k++) {
                    str =
                        '<div class="msgTitleTwo" onclick="findFarmDetails(' + k + ')">' +
                        '<span class="msgTitleNameTwo">' + farmList[k].farmName + '</span>' +
                        '<span class="msgTitleNameTwo">' + farmList[k].farmAddress + '</span>' +
                        '</div>'
                    $(".msgTitleBox").append(str);
                    //默认加载执行农场第一次方法传入农场id获取对应的设备信息
                    if (oneLoad) {
                        findFarmDetails(0);
                        oneLoad = false;
                    }
                    for (var i = 0; i < farmCropsList.length; i++) {
                        var farmCrops = farmCropsList[i];
                        if (farmCrops.farmInfoId == farmList[k].id) {
                            farmName = farmList[k].farmName;
                            //添加农场数据
                            str = '<div class="msgItemBox conOne">' +
                                '<span class="msgNameOne">' + farmCrops.cropsName + '</span>' +
                                '<span class="msgNameTwo colorYellow">' + farmName + '</span>' +
                                '<span class="msgNameThree colorBlue">' + farmCrops.landArea + '亩</span>' +
                                '<span class="msgNameFour colorGreen">' + farmCrops.plantingDays + '天</span>' +
                                '</div>';
                            $("#msgBox").append(str);
                        }
                    }
                }
            } else {
                //没有农场信息要求基本土地柱状图显示图
                findLandBar(null);
                //没有农场信息要求显示基本折线图样式
                findSensorForMonth(null);

            }
            $(".conOne").show();
        })
}

/**
 * 查询用户下所有触发历史
 */
findTrigger = function (triggerList) {
    if (triggerList.state == 'success') {
        if (triggerList.datas.length > 0) {
            $(".dangerMsgtext").remove();
        }
        for (var i = 0; i < triggerList.datas.length; i++) {
            var trigger = triggerList.datas[i];
            str = '<p class="dangerMsgItem conOne">' +
                '<span class="dangerMsgTime">' + trigger.alarmTime.replace(/ \d+(:\d+){2}/, '') + '</span>' +
                '<span class="dangerMsgText">' + trigger.name + '' + trigger.expression.replace("value", "") + '</span>' +
                '</p>'
            $(".dangerMsgItemBox").append(str);
        }
    }
}

/**
 * 点击农场时需要作出的事件
 */
findFarmDetails = function (num) {
    lot(farmList[num].lotId);
    // 获取当前农场下所有设备实时信息
    currencyFarmDeviceList_Two(farmList[num].id);
    //所属农场的农作物生长周期
    findFarmCropsLists(farmList[num].id);
    //获取农场对应摄像头信息
    getCamareUrl(farmList[num].id);
    //添加地图上农场的基本信息
    $(".farmImg").attr("src", farmList[num].imgUrl);
    $(".farmName").text(farmList[num].farmName);
    $(".farmAddress").text("种植地：" + farmList[num].farmAddress);
    $(".person").text("种植物：" + farmList[num].crops);
    $(".call").text("联系方式：" + farmList[num].tel);
    //  土地耕种柱状图
    findLandBar(farmList[num].id);
}

/**
 * 该农场下所有设备实时信息
 */
var tude = new Map();
setenvironmental = function (currencyFarmDeviceListValue) {
    map.clearMap();
    if (currencyFarmDeviceListValue.state == 'success' && currencyFarmDeviceListValue.datas.length > 0) {
        $(".environmental div").remove();
        var device = currencyFarmDeviceListValue.datas[0];
        if (device.deviceType != "2") {
            if (typeof (device.type) != "undefined" && typeof (device.data) != "undefined") {
                var dataList = device.data.split("|");//检测数据
                var typeList = device.type.split("/");//对应的数据类型
                var $environmental = $(".environmental").empty();
                for (var k = 0; k < typeList.length; k++) {
                    var $itemBox = $('<div class="itemBox"></div>');
                    var $goodBg = $('<span class="opacityBox goodBg"></span>')
                    var $itemNameValueBox = $('<div class="itemNameValueBox"></div>');
                    var $itemName = $('<span class="itemName"></span>');
                    var $itemValue = $('<span class="itemValue"></span>');
                    if (k % 2 && k < 10) {
                        var $checkbox = $('<input class="checkbox"  name="checkbox" type="checkbox" checked="checked" value="" />');
                        $itemNameValueBox.css("background-image", "linear-gradient(45deg, #00fbcf, #007dfe )");
                    } else {
                        var $checkbox = $('<input class="checkbox"  name="checkbox" type="checkbox" value="" />');
                    }
                    $itemNameValueBox.attr("number", device.deviceNumber)
                    $checkbox.val(typeList[k]);
                    $itemName.text(typeList[k]);
                    $itemValue.text(":" + dataList[k]);
                    $checkbox.appendTo($itemNameValueBox);
                    $itemName.appendTo($itemNameValueBox);
                    $itemValue.appendTo($itemNameValueBox);
                    $goodBg.appendTo($itemBox);
                    $itemNameValueBox.appendTo($itemBox);
                    $itemBox.appendTo($environmental);
                }
            }
        } else {
            str = '<div class="itemBox">' +
                '<span class="opacityBox goodBg"></span>' +
                '<div class="itemNameValueBox">' +
                '<span class="itemName">该设备属于</span>' +
                '<span class="itemValue">继电器设备</span>' +
                '</div>' +
                '</div>';
            $(".environmental").append(str);
        }
        //添加农场设备点标记
        for (var i = 0; i < currencyFarmDeviceListValue.datas.length; i++) {
            device = currencyFarmDeviceListValue.datas[i];
            tude.set(device.deviceNumber, {"longitude": device.longitude, "latitude": device.latitude});
            var marker = new AMap.Marker({
                position: [device.longitude, device.latitude],
                content: '<img src="../img/toiletScreen/flag_red.png" width="20px" height="30px">',
                offset: new AMap.Pixel(-21, -21),
                title: device.name,
                map: map,
                val: device.deviceNumber
            }).on('click', function (e) {
                markerClick(this.get("title"), this.get("position"), this.get("val"));
            })
        }
        //初始加载获取农场下第一个设备的信息折线图
        findDeviceLine(currencyFarmDeviceListValue.datas[0].deviceNumber);
    }
}
/**
 * 点击地图设备点查询设备实时信息
 */
updateDevice = function (selDeviceInfo) {
    // findSelDeviceInfo(deviceNumber);
    if (selDeviceInfo.state == 'success') {
        $(".environmental div").remove();
        var device = selDeviceInfo.data;
        if (device.deviceType != "2") {
            var $environmental = $('.environmental').empty();
            var dataList = device.data.split("|");//检测数据
            var typeList = device.type.split("/");//对应的数据类型
            for (var k = 0; k < typeList.length; k++) {
                var $itemBox = $('<div class="itemBox"></div>');
                var $goodBg = $('<span class="opacityBox goodBg"></span>')
                var $itemNameValueBox = $('<div class="itemNameValueBox"></div>');
                var $itemName = $('<span class="itemName"></span>');
                var $itemValue = $('<span class="itemValue"></span>');
                if (k % 2 && k < 10) {
                    var $checkbox = $('<input class="checkbox"  name="checkbox" type="checkbox" checked="checked" value="" />');
                    $itemNameValueBox.css("background-image", "linear-gradient(45deg, #00fbcf, #007dfe )");
                } else {
                    var $checkbox = $('<input class="checkbox"  name="checkbox" type="checkbox" value="" />');
                }
                $itemNameValueBox.attr("number", device.deviceNumber)
                $checkbox.val(typeList[k]);
                $itemName.text(typeList[k]);
                $itemValue.text(":" + dataList[k]);
                $checkbox.appendTo($itemNameValueBox);
                $itemName.appendTo($itemNameValueBox);
                $itemValue.appendTo($itemNameValueBox);
                $goodBg.appendTo($itemBox);
                $itemNameValueBox.appendTo($itemBox);
                $itemBox.appendTo($environmental);
            }
        } else {
            str = '<div class="itemBox">' +
                '<span class="opacityBox goodBg"></span>' +
                '<div class="itemNameValueBox">' +
                '<span class="itemName">该设备属于</span>' +
                '<span class="itemValue">继电器设备</span>' +
                '</div>' +
                '</div>';
            $(".environmental").append(str);
        }

    }
}

/**
 * 所属农场下的农作物
 */
findFarmCropsList = function (farmCropsListValue) {
    $(".cropsItemBox div").remove();
    $(".cropsItemBox span").remove();
    if (farmCropsListValue.state == 'success') {
        list = farmCropsListValue.datas;
        for (var i = 0; i < list.length; i++) {
            var farmCrops = list[i];
            str = '<div class="cropsItem conOne crop">';
            str += '<span class="cropsName">' + farmCrops.cropsName + '</span>';
            if (farmCrops.growthCycle == '苗期') {
                str += '<div class="crops daBG crop"></div>' +
                    '<span class="growUpDate daColor">（苗期）</span>';
            } else if (farmCrops.growthCycle == '成长期') {
                str += '<div class="crops qBG crop"></div>' +
                    '<span class="growUpDate qColor">（成长期）</span>';
            } else {
                str += '<div class="crops toBG"></div>' +
                    '<span class="growUpDate toColor">（成熟期）</span>';
            }
            str += '</div>';
            $(".cropsItemBox").append(str);
        }
        $(".conOne").show();

    }
}

/**
 * 加载对应农场的摄像头
 */
function getCamareUrl(farmInfoId) {
    var cameraNumber = 0;
    $.post("../cameraApplication/getCameraList", {
        "appId": farmInfoId,
        "appType": 1,
        "page": 1,
        "size": 1
    }, function (res) {
        $("#player").remove();
        $("#playerNoData").remove();
        if (res.state == 'success' && res.datas.length > 0) {
            var data = res.datas;
            if (data.length > 0) {
                cameraNumber = data[0].cameraId;
            }
            var $playerBox = $(".playerBox");
            var $player = $('<video  id="player" style="width: 100%; height: 100%;" poster="" controls playsInline webkit-playsinline autoplay></video>');
            var $rtmpHd = $('<source id="rtmpHd" type="rtmp/flv"/>');
            var $hlsHd = $('<source id="hlsHd" type="application/x-mpegURL"/>');
            $rtmpHd.appendTo($player);
            $hlsHd.appendTo($player);
            $player.appendTo($playerBox);
            var $playerNoData = $('<div id="playerNoData" style = "height: 100%; width: 100%; text-align: center;position:absolute;top:0; background-color: black;"></div>');
            var $nomsg = $("<span class='nomsg' style ='position:absolute;left:0.5rem;'></span>");
            var $img = $('<img src="../static/img/playBtn.png" style="width: 4rem; margin-top: 3rem />');
            $nomsg.appendTo($playerNoData);
            $img.appendTo($playerNoData);
            $playerNoData.appendTo($playerBox);

            $.post("../cameraManage/getPlayerAddress", {"id": cameraNumber}, function (res) {
                if (res.state == 'success') {
                    var data = res.data;
                    var rtmpHd = document.getElementById("rtmpHd");
                    rtmpHd.src = data.rtmpHd;
                    var player = new EZUIPlayer('player');
                    $("#player").show();
                    $("#playerNoData").hide();
                } else {
                    $("#playerNoData").find(".nomsg").text(res.msg).css("display", "block");
                }
            });
        }
    })
}

/**
 * 根据设备编号查询设备采集信息折线图
 * @param id
 */
findDeviceLine = function (deviceNumber) {
    clearInterval(myChart24Time);
    myChart24 = echarts.init(document.getElementById('landLine'));
    myChart24.clear();
    var server = [];
    var legData = [];
    $.post("../monitor/getSensorReport", {"deviceNumber": deviceNumber}, function (res) {
        if (res.success == true) {
            var res = res.data;
            //获取勾选的显示数据按钮
            checkbox = [];
            $("input:checkbox[name='checkbox']:checked").each(
                function () {
                    checkbox.push(this.value);

                });
            var keyArr = Object.keys(res);
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
                for (var i = 0; i < checkbox.length; i++) {
                    if (newKeyArr[q].replace(/[\s　]/g, "") == checkbox[i].replace(/[\s　]/g, "")) {
                        var sObj = {};
                        sObj.name = newKeyArr[q];
                        sObj.type = 'line';
                        var ss = newKeyArr[q];
                        var cArr = [];
                        for (var c = 0; c < lastObj[ss].length; c++) {
                            cArr.push(Number(lastObj[ss][c]));
                        }
                        sObj.data = cArr;
                        server.push(sObj);
                    }
                }
            }
            for (var v = 0; v < server.length; v++) {
                legData.push(server[v].name)
            }
        }
        option24 = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                color: ["#08f0f9", "#facf64", "#fa64eb", "#64fa7f", "#FA7064"],
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
        myChart24.setOption(option24);
        // loopPlayback(myChart24,12);
        // tools.stopAutoShow(myChart24);
        myChart24Time=tools.loopShowTooltip(myChart24, option24, {loopSeries: true,interval:2000});
    });
    //获取用户当前农场下所有设备的温度湿度，做成折线图
    findSensorForMonth(deviceNumber);
    //修改地图中心点
    // map.setCenter([tude.get(deviceNumber).longitude, tude.get(deviceNumber).latitude]);
}

/**
 *  获取用户当前农场下所有设备的温度湿度，做成折线图
 */
findDeviceListLine = function (sensorForMonth) {
    clearInterval(myChart2Time);
    var landData1 = [];
    var landData2 = [];
    myChart2 = echarts.init(document.getElementById('environment'));
    myChart2.clear();
    if (sensorForMonth.success == true) {
        $(".topCenterThreePartText").remove();
        var res = sensorForMonth.data;
        var keyArr = Object.keys(res);
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
            if (newKeyArr[q] == "温度") {
                var sObj = {};
                sObj.name = newKeyArr[q];
                sObj.type = 'line';
                var ss = newKeyArr[q];
                var cArr = [];
                for (var c = 0; c < lastObj[ss].length; c++) {
                    cArr.push(Number(lastObj[ss][c]));
                }
                landData1 = cArr;
            }
            if (newKeyArr[q] == "湿度") {
                var sObj = {};
                sObj.name = newKeyArr[q];
                sObj.type = 'line';
                var ss = newKeyArr[q];
                var cArr = [];
                for (var c = 0; c < lastObj[ss].length; c++) {
                    cArr.push(Number(lastObj[ss][c]));
                }
                landData2 = cArr;
            }
        }
    }
   option2 = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            color: ["#FF9600", "#6967F9"],
            data: ['温度', '湿度'],
            top: '0',
            right: '20px',
            textStyle: {//图例文字的样式
                color: '#fff',
                fontSize: 10
            }
        },
        grid: {
            top: '20%',
            left: '3%',
            right: '4%',
            bottom: '3%',
            height: '80%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
            axisTick: {//坐标轴刻度相关设置。
                show: false,
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    fontSize: 10
                }
            },
            axisLine: {

                lineStyle: {
                    color: "#fff"
                }
            }
        },
        yAxis: {
            type: 'value',

            splitLine: {
                show: false,
                lineStyle: {
                    type: 'dashed',
                    color: '#fff'
                }
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    fontSize: 10
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            },
            nameTextStyle: {
                color: "#fff"
            },
            axisTick: {
                inside: true
            },
            splitArea: {
                show: false
            }
        },
        series: [{
            name: '温度',
            type: 'line',
            data: landData1,
            color: "#F58080",
            lineStyle: {
                normal: {
                    width: 2,
                    color: {
                        type: 'linear',

                        colorStops: [{
                            offset: 0,
                            color: '#FFCAD4' // 0% 处的颜色
                        }, {
                            offset: 0.4,
                            color: '#F58080' // 100% 处的颜色
                        }, {
                            offset: 1,
                            color: '#F58080' // 100% 处的颜色
                        }],
                        globalCoord: false // 缺省为 false
                    },
                    shadowColor: 'rgba(245,128,128, 0.5)',
                    shadowBlur: 10,
                    shadowOffsetY: 7
                }
            },
            itemStyle: {
                normal: {
                    color: '#F58080',
                    borderWidth: 2,
                    borderColor: "#F58080"
                }
            },
            smooth: true
        },
            {
                name: '湿度',
                type: 'line',
                data: landData2,
                lineStyle: {
                    normal: {
                        width: 2,
                        color: {
                            type: 'linear',

                            colorStops: [{
                                offset: 0,
                                color: '#F6D06F' // 0% 处的颜色
                            },
                                {
                                    offset: 0.4,
                                    color: '#F9A589' // 100% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#F9A589' // 100% 处的颜色
                                }
                            ],
                            globalCoord: false // 缺省为 false
                        },
                        shadowColor: 'rgba(249,165,137, 0.5)',
                        shadowBlur: 10,
                        shadowOffsetY: 7
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#F6D06F',
                        borderWidth: 2,
                        borderColor: "#F6D06F"
                    }
                },
                smooth: true
            }
        ]
    };
    myChart2.setOption(option2);
    // loopPlayback(myChart2,10);
    // tools.stopAutoShow(myChart2);
    myChart2Time=tools.loopShowTooltip(myChart2, option2, {loopSeries: true,interval:2000});
}

/**
 * 土地耕种柱状图
 * @param farmId
 */
function initLandBar(landBar) {
    var myChart = echarts.init(document.getElementById('landBar'));
    // findLandBar(farmId);
    var data1 = [];//耕地面积
    var data2 = [];//种植面积
    var year = [];//对应年份
    if (landBar.state == 'success' && landBar.data.length > 0) {
        var landData = landBar.data;
        var land;

        for (var i = 0; i < landData.length; i++) {
            land = landData[i];
            data1.push(land.cultivatedArea);
            data2.push(land.plantedArea);
            year.push(land.year);
        }
        var k = landData.length - 1;
        $(".topCenterOneTitle").text(year[k] + "年度农作物种植");
        $(".topCenterOneLeft").text(data2[k] + "亩")
        var num = "↑";
        var last = "%";
        var nums = 100;
        if (k > 0) {
            nums = (((data2[k] - data2[k - 1]) / data2[k - 1]))*100 ;
            $(".topCenterOneRight").css("color", "green");
            if ((data2[k] - data2[k - 1]) <= 0) {
                num = "↓";
                $(".topCenterOneRight").css("color", "red");
            }
        }
        $(".topCenterOneRight").text("种植度" + num + nums.toFixed(2) + last);
    } else {
        $(".topCenterOneTitle").text("年度农作物种植");
        $(".topCenterOneLeft").text("0亩")
        $(".topCenterOneRight").text("种植度0%");
    }
    var option = {
        title: {
            text: "土地使用面积",
            left: "15",
            top: "3",
            textStyle: {
                color: "#fff",
                fontSize: 14
            }
        },
        tooltip: { //提示框组件
            trigger: 'axis',
            formatter: '{b}<br />{a0}: {c0}<br />{a1}: {c1}',
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
            left: '1%',
            right: '2%',
            bottom: 0,
            top: 50,
            padding: '0 0 0 0',
            height: '70%',
            containLabel: true,
        },
        legend: {//图例组件，颜色和名字
            right: 10,
            top: 0,
            data: [{
                name: '耕地面积',
                //icon:'image://../wwwroot/js/url2.png', //路径
            },
                {
                    name: '种植面积',
                }],
            textStyle: {
                color: '#ffffff',
                fontStyle: 'normal',
                fontFamily: '微软雅黑',
                fontSize: 12,
            }
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: true,//坐标轴两边留白
                data: year,
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
                name: '耕地面积',
                type: 'bar',
                data: data1,
                barWidth: 15,
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
                name: '种植面积',
                type: 'bar',
                data: data2,
                barWidth: 15,
                barGap: 0.5,//柱间距离
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

    myChart.setOption(option);
}

/**
 * 获取农场人员数量
 */
findPeopele = function () {
    var male = 0;
    var female = 0;
    $.post("../smartAgriculture/getPeopleStructureList",
        {
            "page": 1,
            "size": 100
        },
        function (res) {
            if (res.state == 'success') {
                if (res.datas.length > 0) {
                    for (var i = 0; i < res.datas.length; i++) {
                        people = res.datas[i];
                        male += people.maleNum;
                        female += people.femaleNum;
                    }
                }
                $(".allPersonBox .personValue").text(male + female);
                $(".manBox .personValue").text(male);
                $(".womanBox .personValue").text(female);
                initAttendanceLine(10);
            }
        })
}

/**
 * 显示点标记文字
 */
function markerClick(name, position, deviceNumber) {
    var title = '<span style="font-size:16px;margin-right:15px;">' + name + '</span>';
    content = [];
    var infoWindow = new AMap.InfoWindow({
        isCustom: true,  //使用自定义窗体
        content: createInfoWindow(title, content.join("")),
        offset: new AMap.Pixel(60, -25)
    });
    infoWindow.open(map, position);
    findDeviceLine(deviceNumber);
    findSelDeviceInfo(deviceNumber);

}

/**
 * 构建自定义信息窗体
 */

function createInfoWindow(title, content) {
    var info = document.createElement("div");
    info.className = "custom-info input-card content-window-card";

    //可以通过下面的方式修改自定义窗体的宽高
    //info.style.width = "400px";
    // 定义顶部标题
    var top = document.createElement("div");
    var titleD = document.createElement("div");
    var closeX = document.createElement("img");
    top.style.backgroundColor = 'white';
    top.style.color = 'black';
    top.className = "info-top";
    top.style.width = "120px";
    titleD.innerHTML = title;
    closeX.style.cssFloat = 'right';

    closeX.src = "https://webapi.amap.com/images/close2.gif";
    closeX.onclick = closeInfoWindow;

    top.appendChild(closeX);
    top.appendChild(titleD);
    info.appendChild(top);

    // 定义中部内容
    var middle = document.createElement("div");
    middle.className = "info-middle";
    middle.style.backgroundColor = 'white';
    middle.innerHTML = content;
    info.appendChild(middle);

    // 定义底部内容
    var bottom = document.createElement("div");
    bottom.className = "info-bottom";
    bottom.style.position = 'relative';
    bottom.style.top = '0px';
    bottom.style.margin = '0 auto';
    var sharp = document.createElement("img");
    sharp.src = "https://webapi.amap.com/images/sharp.png";
    bottom.appendChild(sharp);
    info.appendChild(bottom);
    return info;
}

function closeInfoWindow() {
    map.clearInfoWindow();
}