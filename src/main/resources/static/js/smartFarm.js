var cameraNumber = "";
var language = getCookie('jxct_lang'), map;
if (language != 'en') {
    language = 'zh_cn';
}

layui.use(['form', 'layedit', 'laydate'], function () {
});
$(function () {
//页面各元素高度自适应设置
    var documentHeight = $(document).height();
    $(".topContent").height(documentHeight - 225 - 25 - 35);
    $(".msgBox").height($(".topLeftTop").height() - $(".topLeftTopTitle").height() - 35);
    $(".environmental").height($(".topRight").height() - $(".environmentalText").height());
    $(".farming-info-body-roll").eq(0).height($(".topContent").height() - 40 - 5);
    $(".playerSizeBox").height($(".topLeftBottom").height() - 25);
    $("#landBar").height($(".bottomTwo").height() - 25);
    $(".equipmentItemBox").height($(".bottomThree").height() - 25 - 17);
    $(window).resize(function () {
        var documentHeight = $(window).height();
        $(".topContent").height(documentHeight - 225 - 25 - 35);
        $(".msgBox").height($(".topLeftTop").height() - $(".topLeftTopTitle").height() - 35);
        $(".environmental").height($(".topRight").height() - $(".environmentalText").height());
        $(".farming-info-body-roll").eq(0).height($(".topContent").height() - 40 - 5);
        $(".playerSizeBox").height($(".topLeftBottom").height() - 25);
        $(".equipmentItemBox").height($(".bottomThree").height() - 25 - 17);
        /* myChart.resize();*/
        // 重新加载视频
        getCamareUrl(cameraNumber);
    });


//动态添加banner名称
    /*   $.post("../user/selUserDetails", {}, function (res) {
           if (res.state == 'success') {
               $(".bannerImg").html(res.data.info.company);
           }
       });*/
    //农场信息
    loadFarmInfoList();

    //获取人员结构信息
    getPersonMsg();

    // 获取土地信息
    initLandBar();

    $("#playerNoData").click(function () {
        layer.msg("未安装摄像头", {
            offset: '20rem'
        });
    });

    //报警信息
    getDangerMsg();

    $(".switch").click(function () {
        var $them = $(this);
        setTimeout(function () {
            if ($them.prop("checked")) {
                $them.prop("checked", false);
            } else {
                $them.prop("checked", true);
            }
            layer.msg("设备掉线", {
                offset: '20rem'
            });
        }, 200)
    });


});


//TODO
function setEnvironmental(farmId) {
    $.ajax({
        url: "../smartAgriculture/getDeviceNumberByFarmId",
        data: {
            farmId: farmId
        },
        dataType: "json",
        type: "get",
        timeout: 30000,
        async: false,
        success: function (result) {
            var $environmental = $(".environmental");
            $environmental.empty();
            if (result.data == 0) {
                var $msg = $("<span class='msg'></span>");
                $msg.text("暂无数据");
                $msg.appendTo($environmental);
            } else {
                //通过设备号获取设备信息
                $.ajax({
                    url: "../deviceManage/getDeviceSensorList?sensorNcode=" + result.data,
                    data: {},
                    dataType: "json",
                    type: "get",
                    timeout: 30000,
                    async: false,
                    success: function (result) {
                        var $environmental = $(".environmental");
                        var msg = result.data;
                        if (msg.length > 0) {
                            for (var j = 0; j < msg.length; j++) {
                                var $itemBox = $("<div class='itemBox'></div>");
                                var $itemName = $("<span class='itemName'></span>");
                                var $itemValue = $("<span class='itemValue'></span>");
                                $itemName.text($.trim(msg[j].sensorName));
                                $itemValue.text($.trim(msg[j].sensorData));
                                $itemName.appendTo($itemBox);
                                $itemValue.appendTo($itemBox);
                                $itemBox.appendTo($environmental);

                            }
                        } else {
                            var $msg = $("<span class='msg'></span>");
                            $msg.text("暂无数据");
                            $msg.appendTo($environmental);
                        }


                    },
                    error: function (data, type, err) {
                    }
                });
            }


        },
        error: function (data, type, err) {
        }
    });
}

//实时环境监测
function setenvironmental(list) {

    var $environmental = $(".environmental");
    $environmental.empty();
    for (var i = 0; i < list.length; i++) {
        var $itemBox = $("<div class='itemBox'></div>");
        var $itemName = $("<span class='itemName'></span>");
        var $itemValue = $("<span class='itemValue'></span>");
        $itemName.text(list[i].sensorName);
        $itemValue.text(list[i].sensorData);

        $itemName.appendTo($itemBox);
        $itemValue.appendTo($itemBox);
        $itemBox.appendTo($environmental);
    }
}

// 创建农场列表并绑定点击事件
function loadFarmInfoList() {
    $.post("../farmInfo/getList", {page: 1, size: 100}, function (result) {
        if (result.state == "success") {
            let farmInfoList = result.datas;
            let html = '';
            for (let i = 0; i < farmInfoList.length; i++) {
                html += '<div class="farming-info-body-roll"> ' +
                    '<div class="farming-info-body-item" ' +
                    'data-farmName="' + farmInfoList[i].farmName + '" ' +
                    'data-lat="' + farmInfoList[i].latitude + '" ' +
                    'data-lon="' + farmInfoList[i].longitude + '" ' +
                    'data-relayNumber="' + farmInfoList[i].relayNumber + '" ' +
                    'data-cameraNumber="' + farmInfoList[i].cameraNumber + '" ' +
                    'data-farmInfoId="' + farmInfoList[i].id + '">' +

                    '<img class="show-info-img" src="' + farmInfoList[i].imgUrl + '">' +
                    '<span class="show-info-item_title">' + farmInfoList[i].farmName + '</span>' +
                    '<div class="show-address">' +
                    '<span>地址：' + farmInfoList[i].farmAddress + '</span></br>' +
                    '<span>联系方式：' + farmInfoList[i].tel + '</span> </br>' +
                    '<span>种植作物：' + farmInfoList[i].crops + '</span>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="item-line"></div>';
            }
            $("#farmList").html(html);

            // 农场点击事件
            $(document).on('click', '.farming-info-body-item', function () {
                // 地图联动
                let farmInfoId = $(this).attr('data-farmInfoId');
                let farmName = $(this).attr('data-farmName');
                let relayNumber = $(this).attr('data-relayNumber');
                cameraNumber = $(this).attr('data-cameraNumber');
                let lat = $(this).attr('data-lat');
                let lon = $(this).attr('data-lon');

                // 设备信息联动
                // initDevice(lon, lat, farmInfoId);

                // 根据农场经纬度获取地理位置
                AMap.service('AMap.Geocoder', function () {//回调函数
                    //实例化Geocoder
                    geocoder = new AMap.Geocoder({
                        city: ""//城市，默认：“全国”
                    });
                    var lnglatXY = [lon, lat];
                    geocoder.getAddress(lnglatXY, function (status, result) {
                        if (status === 'complete' && result.info === 'OK') {
                            // district 此处取乡镇级别
                            let place = result.regeocode.addressComponent.district;
                            initMap(farmName, [lon, lat], place, farmInfoId, lon, lat);
                        } else {
                            initMap(farmName, [lon, lat], '环翠区', farmInfoId, lon, lat);
                        }
                    });
                });


                $.post("../farmCrops/getList", {page: 1, size: 100, farmInfoId: farmInfoId}, function (result) {
                    if (result.state == "success") {
                        var farmCropsList = result.datas;
                        // 饼图联动
                        initPieChart(farmCropsList);
                    }
                });

                // 视频联动
                getCamareUrl(cameraNumber);

                // 继电器列表联动
                initRelayList(relayNumber);

                //实时环境联动
                setEnvironmental(farmInfoId);
            });

            if (farmInfoList.length > 0) {
                $(".farming-info-body-item")[0].click();
            }


        }
    });
}

// 创建饼图
function initPieChart(farmCropsList) {
    let myChart = echarts.init(document.getElementById('pie'));
    let series = [],
        color = ['#dc1439', '#e6b600', '#053afe', '#dc1439', '#e6b600', '#053afe', '#dc1439'],
        itemHeight = 10, itemGap = 5,
        difference = 2,
        maxData = 6, titleData = [];
    if (farmCropsList.length < maxData) {
        maxData = farmCropsList.length;
    }
    for (let i = 0; i < maxData; i++) {
        let totalDays = farmCropsList[i].totalDays;
        let plantingDays = farmCropsList[i].plantingDays;
        titleData.push(farmCropsList[i].cropsName + "(" + farmCropsList[i].growthCycle + ")");
        let data = {
            name: farmCropsList[i].cropsName + "(" + farmCropsList[i].growthCycle + ")",
            type: 'pie',
            clockWise: false, //顺时加载
            hoverAnimation: false, //鼠标移入变大
            radius: [70 - i * itemHeight - i * itemGap - i * difference, 80 - i * itemHeight - i * itemGap - i * difference],
            itemStyle: {
                normal: {
                    label: {
                        show: false,
                    },
                    labelLine: {
                        show: false,
                    }
                }
            },
            label: {
                normal: {
                    show: false,
                }
            },
            data: [{
                value: plantingDays,
                itemStyle: {
                    normal: {
                        color: color[i]//'#dc1439'
                    }
                }
            },
                {
                    value: totalDays,
                    itemStyle: {
                        normal: {
                            color: 'transparent'
                        }
                    }
                }]
        };
        series.push(data);
    }
    var data = {title: '生长周期', series: series};
    option = {
        title: {
            text: data.title,//主标题
            textStyle: {//主标题样式
                color: '#99CC66',
                fontWeight: 'bold',
                fontSize: 12
            },
            left: '0',
            top: '0'
        },
        tooltip: {
            show: true,
            trigger: 'item',//提示框触发类型，item数据项图形触发，主要应用于无类目轴的图表（散点图、饼形图等）
            formatter: function (params, ticket, callback) {//第一个参数数据集、第二个参数是异步回调标志、第三个参数是异步回调
                return params.seriesName + ": " + params.value + "天";//系列名称：数据值
            }
        },
        color: color,
        legend: {
            top: "6px",
            left: "50%",
            itemHeight: itemHeight,//图例的高度
            itemGap: itemGap,//图例之间的间距        
            data: titleData,//图例的数据数组
            textStyle: {
                color: '#fff',
                fontSize: 10
            },
            selectedMode: true,//图例选择模式
            orient: "vertical"//图例布局方式
        },
        series: data.series
    };
    myChart.clear();
    myChart.setOption(option);
}

// 获取视频监控url
function getCamareUrl(deviceSerial) {
    var $playerBox = $(".playerBox");
    $("#player").remove();
    $("#playerNoData").remove();
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

    $.post("../cameraManage/getLiveAddress", {"deviceSerial": deviceSerial}, function (res) {
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


// 继电器列表联动
function initRelayList(relayNumber) {
    $.post("../aquacultureUserSensor/getSensorList", {page: 1, size: 100, ncode: relayNumber}, function (result) {
        if (result.state == "success") {
            let sensorList = result.datas;
            getEquipmentMsg(sensorList);
        }
    });
}

// 地图联动
function initMap(name, point, place, farmInfoId, lon, lat) {
    //高德地图
    map = new AMap.Map("container", {
        viewMode: '3D',
        pitch: 50,
        resizeEnable: true,
        center: point,
        zoom: 11,
        // mapStyle: "amap://styles/blue",
        lang: language //可选值：en，zh_en, zh_cn
    });
    //加载天气查询插件
    AMap.plugin('AMap.Weather', function () {
        //创建天气查询实例
        var weather = new AMap.Weather();
        //执行实时天气信息查询

    });
    map.on('complete', function () {

        // 设置光照
        map.AmbientLight = new AMap.Lights.AmbientLight([1, 1, 1], 0.5);
        map.DirectionLight = new AMap.Lights.DirectionLight([0, 0, 1], [1, 1, 1], 1);

        var object3Dlayer = new AMap.Object3DLayer();
        map.add(object3Dlayer);

        new AMap.DistrictSearch({
            subdistrict: 0,   //返回下一级行政区
            extensions: 'all',  //返回行政区边界坐标组等具体信息
            level: 'city'  //查询行政级别为 市
        }).search(place, function (status, result) {
            var bounds = result.districtList[0].boundaries;
            var height = 500;
            var color = '#00383838'; // rgba
            var prism = new AMap.Object3D.Prism({
                path: bounds,
                height: height,
                color: color
            });

            prism.transparent = true;
            object3Dlayer.add(prism);

            var text = new AMap.Text({
                // text: result.districtList[0].name + '</br>(' + result.districtList[0].adcode + ')',
                text: name,
                verticalAlign: 'bottom',
                position: point,
                height: 5000,
                style: {
                    'background-color': 'transparent',
                    '-webkit-text-stroke': '#000',
                    '-webkit-text-stroke-width': '0.5px',
                    'text-align': 'center',
                    'border': 'none',
                    'color': 'white',
                    'font-size': '24px',
                    'font-weight': 600
                }
            });
            text.setMap(map);
        });
    });
}


// 实例化点标记
function addMarker(lng, lat) {
    var circleMarker = new AMap.CircleMarker({
        center: [lng, lat],
        radius: 10,//3D视图下，CircleMarker半径不要超过64px
        strokeColor: 'white',
        strokeWeight: 2,
        strokeOpacity: 0.5,
        fillColor: 'rgba(255,0,0)',
        fillOpacity: 1,
        zIndex: 10,
        bubble: true,
        cursor: 'pointer',
        clickable: true
    })
    circleMarker.setMap(map)
}

// 递归设备信息
function getSensorDataWhile(data, number) {
    if (number >= data.length) {
        return
    }
    var datai = data[number];
    if ((datai != '' || datai.length > 0) && datai.deviceType != "2") {
        getSensorData(datai);
        addMarker(datai.longitude, datai.latitude);
        return getSensorDataWhile(data, ++number);
    }
}

// 创建右上角设备列表html
function getSensorData(deviceInfo) {
    document.getElementById('rightList').innerHTML +=
        getSensorLi(deviceInfo.time, deviceInfo.deviceNumber, deviceInfo.name, deviceInfo.data, deviceInfo.type);
    $(".itemLineBtn").click(function () {
        let thisDeviceNumber = $(this).attr('data-thisDeviceNumber');
        layer.open({
            type: 2,
            content: '../monitor/dataAnalysis?deviceNumber=' + thisDeviceNumber,
            area: ['1200px', '600px']
        });
    })
}

// 创建设备列表ul内容
function getSensorLi(updateTime, deviceNumber, deviceName, data, type) {
    let header = '<li class="position-item">' +
        '<div class="item-update horizontal" style="position: relative;">' +
        '更新于&nbsp:&nbsp' + updateTime + '<div class="itemLineBtnBox">' + '<h3 class="itemLineBtn" data-thisDeviceNumber="' + deviceNumber + '">' + '分析' + '</h3>' + '</div>' +
        '</div>' +
        '<div class="item-line"></div>' +
        '<div class="item-device">' +
        '<img class="item-img" src="../../img/farming_portrait.jpg">' +
        '<div class="item-device-text">' +
        '<span>设备：' + deviceNumber + '</span></br>' +
        '<span>名称：' + deviceName + '</span>' +
        '</div>' +
        '</div>' +
        '<div class="item-sensor">';
    let last = '</div></div></li>';

    // 设备-传感器类型
    let typeArr = type.split("/");
    // 设备-传感器数据
    let dataArr = data.split("|");
    for (let i = 0; i < typeArr.length; i++) {
        header += '<div class="item-sensor-data"><span class="item-data-span">' +
            typeArr[i] +
            '</span><span style="color:#fff">' + dataArr[i] +
            '</span></div>';
    }
    return header + last;

}

//农场数据警情信息
function getDangerMsg() {
    $.ajax({
        // url: "../trigger/triggerHistoryListForAquacultureScreen",
        url: "../smartAgriculture/getAllAlarms",
        data: {},
        dataType: "json",
        type: "get",
        timeout: 30000,
        async: false,
        success: function (result) {
            var $topLeftTop = $(".topLeftTop");
            $topLeftTop.empty();
            var $msgTitle = $("<span class='topLeftTopTitle'>农场数据预警</span>");
            $msgTitle.appendTo($topLeftTop);
            var $msgBox = $("<div class='msgBox'></div>");
            $msgBox.appendTo($topLeftTop);
            var dataMsg = result.datas;

            if (dataMsg.length > 0) {
                var fixLength;
                if (dataMsg.length >= 5) {
                    fixLength = 5;
                } else {
                    fixLength = dataMsg.length;
                }
                for (var i = 0; i < fixLength; i++) {
                    var $msg = $("<span class='msg'></span>");
                    $msg.text(dataMsg[i].name + "有异常 " + dataMsg[i].alarmTime);
                    $msg.prependTo($msgBox);
                }
            } else {
                var $nomsg = $("<span class='nomsg'>暂无数据</span>");
                $nomsg.prependTo($msgBox);
            }
        },
        error: function (data, type, err) {
        }
    });
}

// 继电器列表创建
function getEquipmentMsg(list) {
    var $equipmentItemBox = $(".equipmentItemBox");
    $equipmentItemBox.empty();
    if (list.length == 0) {
        var $nomsg = $("<span class='nomsg'>暂无设备</span>");

        $nomsg.appendTo($equipmentItemBox);
    } else {
        if (list.length > 0) {


            var $equipmentNameBox = $("<div class='equipmentNameBox'></div>");
            var $equipmentStatusBox = $("<div class='equipmentStatusBox'></div>");
            var $equipmentSwitch = $("<div class='equipmentSwitch'></div>");

            var $equipmentTitle = $("<span class='equipmentTitle'>联动设备</span>");
            var $equipmentStatusTitle = $("<span class='equipmentStatusTitle'>状态</span>");
            var $equipmentSwitchTitle = $("<span class='equipmentSwitchTitle'>手动开关</span>");
            $equipmentTitle.appendTo($equipmentNameBox);
            $equipmentStatusTitle.appendTo($equipmentStatusBox);
            $equipmentSwitchTitle.appendTo($equipmentSwitch);
            $equipmentNameBox.appendTo($equipmentItemBox);
            $equipmentStatusBox.appendTo($equipmentItemBox);
            $equipmentSwitch.appendTo($equipmentItemBox);
            for (var i = 0; i < list.length; i++) {
                var $equipmentName = $("<span class='equipmentName'></span>");
                var $equipmentStatus = $("<span class='equipmentStatus'></span>");
                var $switch = $("<input class='switch switch-anim' onchange='' type='checkbox' />");
                $switch.attr("data-sensorNcode", list[i].sensorNcode);
                $switch.attr("data-sensorCode", list[i].sensorCode);
                $switch.attr("data-sensorType", list[i].sensorType);
                $switch.attr("data-state", list[i].state);
                $equipmentName.text(list[i].sensorName);
                $equipmentStatus.text(($.trim(list[i].sensorData) == "开" || $.trim(list[i].sensorData) == "1") ? "开" : "关");

                if ($.trim(list[i].sensorData) == "开" || $.trim(list[i].sensorData) == "1") {
                    $switch.attr("checked", "checked");
                }

                $equipmentName.appendTo($equipmentNameBox);
                $equipmentStatus.appendTo($equipmentStatusBox);
                $switch.appendTo($equipmentSwitch);

                $switch.click(function (e) {

                    var $that = $(this);

                    var indexNum = $that.index();
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
            /*    var $bottomThree = $(".bottomThree");
                var $equipment = $("<span class='equipment'>当前监测点联动设备</span>");
                var $nomsg = $("<span class='nomsg'>暂无设备</span>");
                $equipment.appendTo($bottomThree);
                $nomsg.appendTo($bottomThree);*/
        }
    }
}


// 折线图加载
function initLine(list) {
    var listData = list.data;
    var listDataType = listData.type;
    if (listDataType.length > 0) {
        var serverMsg = [];
        for (var i = 0; i < listDataType.length; i++) {
            var serverMsgObj = {};
            serverMsgObj.name = listDataType[i];
            serverMsgObj.type = "line";
            serverMsgObj.data = listData[listDataType[i]];
            serverMsg.push(serverMsgObj);
        }
        listLength = serverMsg[0].data.length;

        var xData = [];
        for (var j = 1; j < listLength; j++) {
            xData.push(j);
        }

        // 如果没有数据
        if (isXdata(serverMsg)) {
            var $dateCurve = $("#dateCurve");
            $dateCurve.empty();
            var $nomsg = $("<span class='nomsg'>暂无数据</span>");
            $nomsg.appendTo($dateCurve);
        } else {
            var $dateCurve = $("#dateCurve");
            $dateCurve.empty();
            $dateCurve.removeAttr('_echarts_instance_');
            var myChart = echarts.init(document.getElementById('dateCurve'));

            option = {
                title: [{
                    text: "数据曲线",
                    textStyle: {
                        fontSize: 18,
                        fontWeight: 0,
                        color: "#ffffff"

                    },
                    top: 5,
                    left: "center"
                }],
                grid: {
                    top: 120
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    top: 40,
                    x: 'center',
                    data: listDataType,
                    textStyle: {
                        fontSize: 15,
                        fontWeight: 0,
                        color: "auto",

                    },
                    itemHeight: 10,
                    itemWidth: 18,
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: xData
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        data: ['0', '250', '300', '600', '800', '1500', '2100', '2700']
                    }
                ],
                series: serverMsg
            };
            myChart.setOption(option);
        }
    }
}


//日期方法
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
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

};

function getPersonMsg() {
    $.ajax({
        type: "POST",
        url: "../smartAgriculture/getPeopleStructureStatistics",
        data: {},
        dataType: "json",
        success: function (data) {
            if (data.state != "failed") {
                var people = data.data;
                if (people != "" && people.length > 0) {
                    $(".allPersonValue").text(people.femaleNum + people.maleNum);
                    $(".manValue").text(people.maleNum);
                    $(".womanValue").text(people.femaleNum);

                    $(".under35").text(people.under35Num);
                    $(".between3545").text(people.between3545Num);
                    $(".between4655").text(people.between4555Num);
                    $(".over55").text(people.over55Num);

                    $(".oldPerson").text(people.elderlyPeopleNum);
                    $(".child").text(people.leftBehindChildrenNum);
                    $(".poor").text(people.poorPeopleNum);
                    $(".failed").text(people.disabledPeopleNum);


                }
            } else {

            }
        },
        error: function (e) {

        }
    });
}


function initLandBar() {
    var myChart = echarts.init(document.getElementById("landBar"));
    var option = {
        title: {
            text: '',
            textStyle: {
                align: 'center',
                color: '#fff',
                fontSize: 20,
            },
            top: '3%',
            left: '10%',
        },
        backgroundColor: '#0f375f',
        grid: {
            top: 60,
            bottom: "15%",
            left: "15%"
        },
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "shadow",
                label: {
                    show: true
                }
            }
        },
        legend: {
            data: ["耕地面积", "种植地面积", "土地变动"],
            top: "5",
            textStyle: {
                color: "#ffffff",
                fontSize: 10
            }
        },
        xAxis: {
            data: [
                "2015年",
                "2016年",
                "2017年",
                "2018年",
                "2019年",
            ],
            axisLine: {
                show: true //隐藏X轴轴线
            },
            axisTick: {
                show: true //隐藏X轴刻度
            },
            axisLabel: {
                show: true,
                textStyle: {
                    color: "#ebf8ac" //X轴文字颜色
                }
            },
            axisLine: {
                lineStyle: {
                    color: ''
                }
            },
        },
        yAxis: [{
            type: "value",
            name: "单位:万平米",
            nameTextStyle: {
                color: "#ffffff",
                fontSize: 10
            },
            splitLine: {
                show: false
            },
            splitLine: {
                show: false
            },
            axisTick: {
                show: true
            },
            axisLine: {
                show: true
            },
            axisLabel: {
                show: true,
                textStyle: {
                    color: "#ffffff"
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#FFFFFF'
                }
            },
        },
            {
                type: "value",
                name: "单位:%",
                nameTextStyle: {
                    color: "#ffffff"
                },
                position: "right",
                splitLine: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    show: true,
                    formatter: "{value}", //右侧Y轴文字显示
                    textStyle: {
                        color: "#ffffff"
                    }
                }
            },
            {
                type: "value",
                gridIndex: 0,
                min: 50,
                max: 100,
                splitNumber: 8,
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                splitArea: {
                    show: true,
                    areaStyle: {
                        color: ["rgba(250,250,250,0.0)", "rgba(250,250,250,0.05)"]
                    }
                }
            }
        ],
        series: [{
            name: "土地变动",
            type: "line",
            yAxisIndex: 1, //使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
            smooth: true, //平滑曲线显示
            showAllSymbol: true, //显示所有图形。
            symbol: "circle", //标记的图形为实心圆
            symbolSize: 10, //标记的大小
            itemStyle: {
                //折线拐点标志的样式
                color: "#ce4f4f"
            },
            lineStyle: {
                color: "#ce4f4f"
            },
            areaStyle: {
                color: "rgba(5,140,255, 0.2)"
            },
            data: [4.2, 3.8, 4.8, 3.5, 2.9, 2.8, 3, 5]
        },
            {
                name: "耕地面积",
                type: "bar",
                barWidth: 10,
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: "#22822a"
                        },
                            {
                                offset: 1,
                                color: "#22822a"
                            }
                        ])
                    }
                },
                data: [4.2, 3.8, 4.8, 3.5, 2.9]
            },
            {
                name: "种植地面积",
                type: "bar",
                barWidth: 10,
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: "#cecc5d"
                        },
                            {
                                offset: 1,
                                color: "#cecc5d"
                            }
                        ])
                    }
                },
                data: [5.2, 4.8, 4.8, 4.5, 3.9]
            }
        ]
    };

    myChart.setOption(option);

    $.ajax({
        type: "POST",
        url: "../smartAgriculture/getLandStatisticsInformation",
        data: {},
        dataType: "json",
        success: function (data) {
            if (data.state != "failed") {
                var data = data.data;
                if (data != "") {
                    var xAxisArr = [];
                    var msgArr = [];
                    for (var i in data) {
                        xAxisArr.push(i);
                        msgArr.push(data[i]);
                    }
                    if (xAxisArr.length > 4) {
                        var xAxisArrFive = [];
                        var msgArrFive = [];
                        for (var j = 0; j < 5; j++) {
                            xAxisArrFive.push(xAxisArr[xAxisArr.length - (j + 1)]);
                            msgArrFive.push(msgArr[msgArr.length - (j + 1)]);
                        }
                        xAxisArr = xAxisArrFive.reverse();
                        msgArr = msgArrFive.reverse();
                    }
                    var msgArrOne = [];
                    var msgArrTwo = [];
                    for (var w = 0; w < msgArr.length; w++) {
                        msgArrOne.push(msgArr[w][0]);
                        msgArrTwo.push(msgArr[w][1]);
                    }


                    option.xAxis.data = xAxisArr;
                    option.series = [{
                        name: "土地变动",
                        type: "line",
                        yAxisIndex: 1, //使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
                        smooth: true, //平滑曲线显示
                        showAllSymbol: true, //显示所有图形。
                        symbol: "circle", //标记的图形为实心圆
                        symbolSize: 10, //标记的大小
                        itemStyle: {
                            //折线拐点标志的样式
                            color: "#ce4f4f"
                        },
                        lineStyle: {
                            color: "#ce4f4f"
                        },
                        areaStyle: {
                            color: "rgba(5,140,255, 0.2)"
                        },
                        data: [4.2, 3.8, 4.8, 3.5, 2.9, 2.8, 3, 5]
                    }, {
                        name: "耕地面积",
                        type: "bar",
                        barWidth: 10,
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: "#22822a"
                                },
                                    {
                                        offset: 1,
                                        color: "#22822a"
                                    }
                                ])
                            }
                        },
                        data: msgArrOne
                    }, {
                        name: "种植地面积",
                        type: "bar",
                        barWidth: 10,
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: "#cecc5d"
                                },
                                    {
                                        offset: 1,
                                        color: "#cecc5d"
                                    }
                                ])
                            }
                        },
                        data: msgArrTwo
                    }]
                    myChart.setOption(option);
                }
            }
        },
        error: function (e) {

        }
    });


}