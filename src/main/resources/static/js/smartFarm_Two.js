var farmInfoId = "";
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
        getCamareUrl(farmInfoId);

    });

    //获取人员结构
    getPeopleStructureList();

    //农场信息
    loadFarmInfoList();


    $("#playerNoData").click(function () {
        layer.msg("未安装摄像头", {
            offset: '20rem'
        });
    });

    //报警信息
    getDangerMsg();

    //大屏名字变动随着中性变化
    $.post("../user/selUserDetails", {}, function (res) {
        if (res.state == 'success' && res.data.info) {
            $("#screenTitle").html(res.data.info.company);
        }
    });
});


/**
 * 根据农场ID获取所有设备信息
 * @param farmId
 */
function setEnvironmental(farmId) {
    farmInfoId = farmId;
    $.ajax({
        // url: "../smartAgriculture/getDeviceNumberByFarmId",
        url: "../newFarmInfo/getFarmDeviceList",
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
            //继电器重置
            var $equipmentItemBox = $(".equipmentItemBox");
            $equipmentItemBox.empty();
            var $nomsg = $("<span class='nomsg'>暂无设备</span>");
            $nomsg.appendTo($equipmentItemBox);

            if (result.count == 0) {
                var $msg = $("<span class='msg'></span>");
                $msg.text("暂无数据");
                $msg.appendTo($environmental);
            } else {
                var j = 0;
                for (var i = 0; i < result.count; i++) {
                    var data = result.datas[i];
                    if (data.deviceType != "2") {
                        //通过设备号获取设备信息
                        $.ajax({
                            url: "../deviceManage/getDeviceSensorList?sensorNcode=" + data.deviceNumber,
                            data: {},
                            dataType: "json",
                            type: "get",
                            timeout: 30000,
                            async: false,
                            success: function (result) {
                                var $environmental = $(".environmental");
                                var $itemDiv = $("<div class='itemDiv'></div>");
                                var $itemTitle = $("<span class='itemTitle'></span>");
                                $itemTitle.text(data.name);
                                $itemTitle.appendTo($itemDiv);
                                $itemDiv.appendTo($environmental);
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
                    } else {
                        if (j == 0) {
                            initRelayList(data.deviceNumber);
                            j++;
                        }

                    }
                    //地图加设备点
                    addMarker(data.longitude, data.latitude);
                }
            }


        },
        error: function (data, type, err) {
        }
    });
}

/**
 * 查询用户下所有农场信息，并添加每个农场点击事件
 */
function loadFarmInfoList() {
    $.post("../farmInfo/getList", {page: 1, size: 100}, function (result) {
        if (result.state == "success") {
            let farmInfoList = result.datas;
            let html = '';
            for (let i = 0; i < farmInfoList.length; i++) {
                html += '<div class="farming-info-body-roll"> ' +
                    '<div class="farming-info-body-item" ' +
                    // 'data-farmName="' + farmInfoList[i].farmName + '" ' +
                    'data-lat="' + farmInfoList[i].latitude + '" ' +
                    'data-lon="' + farmInfoList[i].longitude + '" ' +
                    'data-lotId="' + farmInfoList[i].lotId + '" ' +
                    'data-createUser="' + farmInfoList[i].createUser + '" ' +
                    // 'data-relayNumber="' + farmInfoList[i].relayNumber + '" ' +
                    // 'data-cameraNumber="' + farmInfoList[i].cameraNumber + '" ' +
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
                let farmInfoId = $(this).attr('data-farmInfoId');
                // let farmName = $(this).attr('data-farmName');
                let createUser = $(this).attr('data-createUser');
                // cameraNumber = $(this).attr('data-cameraNumber');
                let lat = $(this).attr('data-lat');
                let lon = $(this).attr('data-lon');
                let lotId = $(this).attr('data-lotId');
                // 地图联动
                initMap(name, lon, lat, lotId);

                // 饼图联动
                initPieChart(farmInfoId,createUser);

                // 视频联动
                getCamareUrl(farmInfoId);

                //土地使用情况点击事件
                initLandBar(farmInfoId)

                //实时环境联动
                setEnvironmental(farmInfoId);
            });

            if (farmInfoList.length > 0) {
                $(".farming-info-body-item")[0].click();
            }


        }
    });
}

/**
 * 作物生长饼状图
 * @param farmInfoId  农场ID
 */
function initPieChart(farmInfoId,createUser) {
    $.post("../farmCrops/getList", {page: 1, size: 100, farmInfoId: farmInfoId,userName:createUser}, function (result) {
        if (result.state == "success") {
            var farmCropsList = result.datas;
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
    });
}

/**
 * 摄像头联动
 * @param deviceSerial 摄像头ID
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
        if (res.state == 'success'&&res.datas.length>0) {
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
 * 继电器设备联动（一个农场只拥有一台继电器）
 * @param relayNumber
 */
function initRelayList(relayNumber) {
    $.post("../aquacultureUserSensor/getSensorList", {page: 1, size: 100, ncode: relayNumber}, function (result) {
        if (result.state == "success") {
            let list = result.datas;
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
                        //操作继电器开关
                        $switch.click(function (e) {
                            var $that = $(this);
                            var indexNum = $that.index();
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
                }
            }
        }
    });
}

/**
 * 地图显示
 */
function initMap(name, longitude, latitude, lotId) {
    //高德地图
    map = new AMap.Map("container", {
        viewMode: '3D',
        pitch: 50,
        resizeEnable: true,
        center: [longitude, latitude],
        zoom: 11,
        lang: language //可选值：en，zh_en, zh_cn
    });
    lot(lotId);
}

/**
 * 实例化点标记
 */
function addMarker(lng, lat) {
    console.log("点标记：" + new Date())
    var circleMarker = new AMap.CircleMarker({
        center: [lng, lat],
        radius: 5,//3D视图下，CircleMarker半径不要超过64px
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

/**
 * 农场预警信息
 */
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

//日期方法
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMont() + 1, //月份
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

/**
 * 人员信息查询
 */
getPeopleStructureList = function () {
    $.ajax({
        type: "post",
        url: "../smartAgriculture/getPeopleStructureList",
        dataType: "json",
        success: function (result) {
            if (result.state = "success" && result.count > 0) {
                var data = result.datas[0];
                var maleNum = data.maleNum;//男性
                var femaleNum = data.femaleNum;//女性
                var under35Num = data.under35Num;//35岁以下
                var between3545Num = data.between3545Num;//35~45岁
                var between4555Num = data.between4555Num;//45~55
                var over55Num = data.over55Num;//大于55岁
                var elderlyPeopleNum = data.elderlyPeopleNum;//孤寡老人
                var leftBehindChildrenNum = data.leftBehindChildrenNum;//留守儿童
                var poorPeopleNum = data.poorPeopleNum;//贫困人口
                var disabledPeopleNum = data.disabledPeopleNum;//残疾人口
                //总人数
                var num = maleNum + femaleNum;
                $(".allPersonValue").text(num);
                $(".manValue").text(maleNum);
                $(".womanValue").text(femaleNum);
                $(".under35").text((Math.round(under35Num / num * 10000) / 100.00) + "%");
                $(".between3545").text((Math.round(between3545Num / num * 10000) / 100.00) + "%");
                $(".between4655").text((Math.round(between4555Num / num * 10000) / 100.00) + "%");
                $(".over55").text((Math.round(over55Num / num * 10000) / 100.00) + "%");
                $(".oldPerson").text((Math.round(elderlyPeopleNum / num * 10000) / 100.00) + "%");
                $(".child").text((Math.round(leftBehindChildrenNum / num * 10000) / 100.00) + "%");
                $(".poor").text((Math.round(poorPeopleNum / num * 10000) / 100.00) + "%");
                $(".failed").text((Math.round(disabledPeopleNum / num * 10000) / 100.00) + "%");


            }
        }
    })
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

/**
 * 土地使用面积
 */
function initLandBar(farmInfoId) {
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
            }, axisLine: {
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
                show: true
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
//无数据，暂时注释掉
   $.ajax({
        type: "POST",
        url: "../smartAgriculture/findLandUse",
        data: {farmId:farmInfoId},
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
                        msgArrOne.push(msgArr[w].cultivatedArea);
                        msgArrTwo.push(msgArr[w].plantedArea);
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