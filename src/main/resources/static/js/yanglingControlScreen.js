var landLine;
var id;
var farmName;
let layer;
let lineChart;
let linechartId = 0;

//室内采集设备
let indoorDataDevices = [];
//室外采集设备
let outdoorDataDevices = [];
//室内继电器设备
let indoorRelayDevices = [];
//折线图中需要展示的标题名称
let linechartTitle = [];
let colors = ['#F2AFAF', '#AFEEF2', '#C2AFF2', '#AFF2BF', '#F2D2AF', '#AFCBF2', '#F2C7AF', '#E0AFF2'];
let colorIndex = 0;
let iconMap = new Map([
    ["温度", "url(../img/yangling/wendu.png) no-repeat"],
    ["湿度", "url(../img/yangling/shidu.png) no-repeat"],
    ["二氧化碳", "url(../img/yangling/co2.png) no-repeat"],
    ["光照度", "url(../img/yangling/guangzhaodu.png) no-repeat"],
    ["风向", "url(../img/yangling/fengxiang.png) no-repeat"],
    ["风速", "url(../img/yangling/fengsu.png) no-repeat"],
    ["雨量", "url(../img/yangling/yuliang.png) no-repeat"],
    ["土壤温度", "url(../img/yangling/turang.png) no-repeat"],
    ["土壤湿度", "url(../img/yangling/turang.png) no-repeat"],
    ["土壤PH", "url(../img/yangling/turang.png) no-repeat"],
    ["土壤电导率", "url(../img/yangling/turang.png) no-repeat"],
    ["太阳总辐射", "url(../img/yangling/fushe.png) no-repeat"],
    ["紫外线", "url(../img/yangling/ziwaixian.png) no-repeat"],
]);


$(function () {

    id = $('#farmId').val();
    farmName = $('#farmName').val();
    $('.right-title').find('p').text('杨凌五泉-杨凌现代农业精准扶贫产业示范园' + farmName);
    //页面各元素高度自适应设置
    var documentHeight = $(window).height();
    $("main").height(documentHeight - 30 - 20);

    $('.other-info-bg-div').height($('#main-content').height());
    $('.other-info-opacity-bg-div1').height($('#main-content').height());
    $('.other-info-opacity-bg-div2').height($('#main-content').height());
    $('.other-info-bg-div2').height($('#main-content').height());

    $(window).resize(function () {
        var documentHeight = $(window).height();
        $("main").height(documentHeight - 30 - 20);
        setDeviceBlockSize();

        $('.other-info-bg-div').height($('#main-content').height() - 12);
        $('.other-info-opacity-bg-div1').height($('#main-content').height() - 12);
        $('.other-info-opacity-bg-div2').height($('#main-content').height() - 12);
        $('.other-info-bg-div2').height($('#main-content').height() - 12);

        // resetrem();


        for (var j = 0; j < $(".linechart-block").length; j++) {
            var resizeLine = echarts.init(document.getElementById('linechart' + j));
            resizeLine.resize();


        }


    });

    layui.use(['form', 'layedit', 'laydate'], function () {
        layer = layui.layer;
        getData(id);
    });

});


function getData(farmId) {
    //首先获取大棚室外气象站和室内采集设备
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
                outdoorDataDevices = [];
                $('.deviceOneMsg').empty();
                $(".deviceOneDangerMsg").empty();
                for (var i = 0; i < data.datas.length; i++) {
                    if (data.datas[i].deviceType != 2 && data.datas[i].type != "" && data.datas[i].data != "") {
                        outdoorDataDevices.push(data.datas[i]);
                    }
                }
            }

            //获取室内采集设备
            getIndoorDevices(farmId);
        },
        error: function (e) {
            console.log(e);
        }
    });
}

function getIndoorDevices(farmId) {
    $.ajax({
        type: "GET",
        url: "../newFarmInfo/getFarmDeviceList",
        dataType: "json",
        data: {
            page: 1,
            size: 10,
            farmId: farmId,
        },
        success: function (data) {
            if (data.state == "success" && data.datas.length > 0) {
                indoorDataDevices = [];
                indoorRelayDevices = [];
                for (var i = 0; i < data.datas.length; i++) {
                    if (data.datas[i].deviceType == 2) {
                        indoorRelayDevices.push(data.datas[i]);
                    } else {
                        if (data.datas[i].type != "" && data.datas[i].data != "") {
                            indoorDataDevices.push(data.datas[i]);
                        }
                    }
                }
                if (indoorRelayDevices.length > 0) {
                    setRelayMsg(indoorRelayDevices[0].deviceNumber);
                } else {
                    $('<div class="no-data-div"><p class="no-data">暂无数据</p></div>').appendTo($('.other-info-bg-div2'));
                }
            } else {
                $('<div class="no-data-div"><p class="no-data">暂无数据</p></div>').appendTo($('.other-info-bg-div2'));
            }

            getContrastData();

        },
        error: function (e) {
            console.log(e);
        }
    });
}

//获取室内室外的对比数据
function getContrastData() {
    if (outdoorDataDevices.length == 0 && indoorDataDevices.length == 0) {
        setNoDataMsg();
    } else if (outdoorDataDevices.length > 0 && indoorDataDevices.length == 0) {
        setOutdoorDeviceData();
        getLineChartData("", outdoorDataDevices[0].deviceNumber);
    } else if (outdoorDataDevices.length == 0 && indoorDataDevices.length > 0) {
        setIndoorDeviceData();
        getLineChartData(indoorDataDevices[0].deviceNumber, "");
    } else {
        setCommonContrastData();
        getLineChartData(indoorDataDevices[0].deviceNumber, outdoorDataDevices[0].deviceNumber);
    }
}

//设置室内设备和室外气象站都有的参数数据
function setCommonContrastData() {
    let indoorDeviceMap = new Map();
    let outdoorDeviceMap = new Map();

    //室外气象站数据
    let itemName = outdoorDataDevices[0].type;
    let outdoorItemNameArr = itemName.split("/");
    let itemValue = outdoorDataDevices[0].data;
    let outDoorItemValueArr = [];
    if (itemValue && itemValue.length > 0) {
        outDoorItemValueArr = itemValue.split("|");
    }

    //室内设备数据
    itemName = indoorDataDevices[0].type;
    let indoorItemNameArr = itemName.split("/");
    itemValue = indoorDataDevices[0].data;
    let inDoorItemValueArr = [];
    if (itemValue && itemValue.length > 0) {
        inDoorItemValueArr = itemValue.split("|");
    }

    for (let i = 0; i < outdoorItemNameArr.length; i++) {
        outdoorDeviceMap.set(outdoorItemNameArr[i], outDoorItemValueArr[i]);
    }
    for (let i = 0; i < indoorItemNameArr.length; i++) {
        indoorDeviceMap.set(indoorItemNameArr[i], inDoorItemValueArr[i]);
    }

    $('#compare-info').empty();
    $('.other-info-bg-div').empty();
    let $block;
    let otherInfoBlock;
    colorIndex = 0;
    //查找公有参数
    indoorDeviceMap.forEach(function (value, key, map) {
        if (outdoorDeviceMap.has(key)) {
            linechartTitle.push(key.trim());

            $block = packInnerOuterChartDiv(colorIndex, key, indoorDeviceMap.get(key), key, outdoorDeviceMap.get(key), linechartId++);
            $block.appendTo($('#compare-info'));
        } else {
            otherInfoBlock = packOtherInfoBlock(key, indoorDeviceMap.get(key));
            otherInfoBlock.appendTo($('.other-info-bg-div'));
        }
    });
    setDeviceBlockSize();

}

function setDeviceBlockSize() {
    $('.inner-outer-chart-div').height(($('#compare-info').height() - 20) / 4);
}


function setNoDataMsg() {
    $('#inner-outer-device').empty();
    $('.other-info-bg-div').empty();
    $('<div class="no-data-div"><p class="no-data">暂无数据</p></div>').appendTo($('#inner-outer-device'));
    $('<div class="no-data-div"><p class="no-data">暂无数据</p></div>').appendTo($('.other-info-bg-div'));
}

//仅设置室外数据
function setOutdoorDeviceData() {
    colorIndex = 0;

    let itemName = outdoorDataDevices[0].type;
    let itemNameArr = itemName.split("/");
    let itemValue = outdoorDataDevices[0].data;
    let itemValueArr = [];
    if (itemValue && itemValue.length > 0) {
        itemValueArr = itemValue.split("|");
    }

    $('#compare-info').empty();
    let $block;
    for (let i = 0; i < 4; i++) {
        linechartTitle.push(itemNameArr[i].trim());
        $block = packInnerOuterChartDiv(colorIndex, itemNameArr[i], "暂无数据", itemNameArr[i], itemValueArr[i], linechartId++);
        $block.appendTo($('#compare-info'));
    }

    //设置其他数据
    $('.other-info-bg-div').empty();
    let otherInfoBlock;
    for (let i = 4; i < itemNameArr.length; i++) {
        otherInfoBlock = packOtherInfoBlock(itemNameArr[i], itemValueArr[i]);
        otherInfoBlock.appendTo($('.other-info-bg-div'));
    }

    setDeviceBlockSize();
}

//仅设置室内数据
function setIndoorDeviceData() {
    colorIndex = 0;

    let itemName = indoorDataDevices[0].type;
    let itemNameArr = itemName.split("/");
    let itemValue = indoorDataDevices[0].data;
    let itemValueArr = [];
    if (itemValue && itemValue.length > 0) {
        itemValueArr = itemValue.split("|");
    }

    $('#compare-info').empty();
    let $block;
    for (let i = 0; i < 4; i++) {
        linechartTitle.push(itemNameArr[i].trim());
        $block = packInnerOuterChartDiv(colorIndex, itemNameArr[i], itemValueArr[i], itemNameArr[i], "暂无数据", linechartId++);
        $block.appendTo($('#compare-info'));
    }

    //设置其他数据
    $('.other-info-bg-div').empty();
    let otherInfoBlock;
    for (let i = 4; i < itemNameArr.length; i++) {
        otherInfoBlock = packOtherInfoBlock(itemNameArr[i], itemValueArr[i]);
        otherInfoBlock.appendTo($('.other-info-bg-div'));
    }
    setDeviceBlockSize();
}

//拼接室内室外设备块
function packInnerOuterChartDiv(colorIdx, indoorName, indoorValue, outdoorName, outdoorValue, linechartId) {
    indoorValue = indoorValue == undefined ? '' : indoorValue;
    outdoorValue = outdoorValue == undefined ? '' : outdoorValue;
    let $innerOuterChartDiv = $('<div class="inner-outer-chart-div"></div>');
    colorIndex = colorIdx;
    //室内设备
    let $deviceBlock = $('<div class="device-block"></div>');
    $deviceBlock.css("background-color", colors[(colorIndex++) % colors.length]);
    let $titleDiv = $('<div class="inner-devices-title"></div>');
    let $iconDiv = $('<div class="icon"></div>');
    $iconDiv.css("background", getIconUrl(indoorName.trim()));
    $iconDiv.css("background-size", "100%");
    $iconDiv.appendTo($titleDiv);
    $('<p>' + indoorName + '</p>').appendTo($titleDiv);
    let $valueP = $('<p class="inner-devices-value">' + indoorValue + '</p>');
    $titleDiv.appendTo($deviceBlock);
    $valueP.appendTo($deviceBlock);
    $deviceBlock.appendTo($innerOuterChartDiv);

    //室外设备
    let $outdoordeviceBlock = $('<div class="outdoor-device-block"></div>');
    $outdoordeviceBlock.css("background-color", colors[(colorIndex++) % colors.length]);
    $titleDiv = $('<div class="inner-devices-title"></div>');
    $iconDiv = $('<div class="icon"></div>');
    $iconDiv.css("background", getIconUrl(outdoorName.trim()));
    $iconDiv.css("background-size", "100%");
    $iconDiv.appendTo($titleDiv);
    $('<p>' + outdoorName + '</p>').appendTo($titleDiv);
    $valueP = $('<p class="inner-devices-value">' + outdoorValue + '</p>');
    $titleDiv.appendTo($outdoordeviceBlock);
    $valueP.appendTo($outdoordeviceBlock);
    $outdoordeviceBlock.appendTo($innerOuterChartDiv);

    //折线图
    let $chartContainer = $('<div class="linechart-block-container"></div>');
    $('<div class="linechart-block-bg"></div>').appendTo($chartContainer);
    $('<div class="linechart-block" id=linechart' + linechartId + '></div>').appendTo($chartContainer);
    $chartContainer.appendTo($innerOuterChartDiv);

    return $innerOuterChartDiv;
}

/**
 * 拼接其他信息数据块
 * @param name 参数名称
 * @param value 参数值
 * @returns {*|jQuery.fn.init|jQuery|HTMLElement}
 */
function packOtherInfoBlock(name, value) {
    value = value == undefined ? '暂无数据' : value;
    let $otherInfoBlock = $('<div class="other-info"></div>');

    let $imgDiv = $('<div class="img-div"></div>');
    let $iconDiv = $('<div class="icon"></div>');
    $iconDiv.css("background", getIconUrl(name.trim()));
    $iconDiv.css("background-size", "100%");
    $iconDiv.appendTo($imgDiv);
    $imgDiv.appendTo($otherInfoBlock);

    let argDiv = $('<div class="arg-div">' + name + '</div>');
    let valueDiv = $('<div class="value-div">' + value + '</div>');
    argDiv.appendTo($otherInfoBlock);
    valueDiv.appendTo($otherInfoBlock);

    return $otherInfoBlock;
}

function resetrem() {
    var html = document.querySelector("html");//获取到html元素
    var width = html.getBoundingClientRect().width;//获取屏幕的宽度
    html.style.fontSize = width / 100 + "px";
}

//折线图
function getLineChartData(indoorDeviceNum, outdoorDeviceNum) {
    let firstQueryDeviceNum = indoorDeviceNum == "" ? outdoorDeviceNum : indoorDeviceNum;
    let secondQueryDeviceNum = firstQueryDeviceNum == outdoorDeviceNum ? indoorDeviceNum : outdoorDeviceNum;
    let indoorDatasMap = new Map();
    let outdoorDatasMap = new Map();


    //首先获取两个设备的统计数据
    $.ajax({
            type: "POST",
            url: "../monitor/getSensorReport",
            data: {"deviceNumber": firstQueryDeviceNum},
            async: false,
            dataType: "json",
            success: function (res) {
                if (res.success == true && res.data) {
                    var res = res.data;

                    var keyArr = Object.keys(res);
                    if (keyArr.length > 0) {
                        keyArr.remove('type');
                        for (let i = 0; i < keyArr.length; i++) {
                            if (firstQueryDeviceNum == indoorDeviceNum) {
                                indoorDatasMap.set(keyArr[i].split("-")[1], res[keyArr[i]]);
                            } else {
                                outdoorDatasMap.set(keyArr[i].split("-")[1], res[keyArr[i]]);
                            }
                        }
                    }

                    //获取第二个设备统计数据
                    if (secondQueryDeviceNum != "") {
                        $.ajax({
                            type: "POST",
                            url: "../monitor/getSensorReport",
                            data: {"deviceNumber": secondQueryDeviceNum},
                            async: false,
                            dataType: "json",
                            success: function (res) {
                                if (res.success == true && res.data) {
                                    var res = res.data;

                                    var keyArr = Object.keys(res);
                                    if (keyArr.length > 0) {
                                        keyArr.remove('type');
                                        for (let i = 0; i < keyArr.length; i++) {
                                            if (secondQueryDeviceNum == indoorDeviceNum) {
                                                indoorDatasMap.set(keyArr[i].split("-")[1], res[keyArr[i]]);
                                            } else {
                                                outdoorDatasMap.set(keyArr[i].split("-")[1], res[keyArr[i]]);
                                            }
                                        }
                                        initLineChart(indoorDatasMap, outdoorDatasMap);
                                    }
                                } else {
                                    console.log("第二个设备请求错误");
                                }
                            }
                        });
                    } else {
                        initLineChart(indoorDatasMap, outdoorDatasMap);
                    }

                } else {
                    layer.msg(res.msg, {
                        offset: '20rem'
                    });
                }
            },
            error: function (e) {
                console.log(e);
            }
        }
    );
}


function initLineChart(indoorDatasMap, outdoorDatasMap) {
    for (let i = 0; i < $(".linechart-block").length; i++) {
        let msgLine = echarts.init(document.getElementById('linechart' + i));
        msgLine.clear();
        let series = [];
        let colorNum = 0;
        let colorArr = ["#00A0E9", "#00FF00"];
        if (indoorDatasMap.size != 0) {
            let sObj = {};
            sObj.name = "室内" + linechartTitle[i];
            sObj.type = 'line';
            sObj.data = indoorDatasMap.get(linechartTitle[i]);
            sObj.itemStyle = {
                normal: {
                    color: colorArr[colorNum++]
                }
            };

            series.push(sObj);
        }

        if (outdoorDatasMap.size != 0) {
            let sObj = {};
            sObj.name = "室外" + linechartTitle[i];
            sObj.type = 'line';
            sObj.data = outdoorDatasMap.get(linechartTitle[i]);
            sObj.itemStyle = {
                normal: {
                    color: colorArr[colorNum++]
                }
            };

            series.push(sObj);
        }

        let legData;
        if (series.length > 0) {
            legData = [];
            for (var v = 0; v < series.length; v++) {
                legData.push(series[v].name)
            }
        }

        option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                color: colorArr,
                data: legData,
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
            series: series
        };
        msgLine.setOption(option);
    }
}

//加载继电器设备
function setRelayMsg(deviceNumber) {
    $.ajax({
        type: "POST",
        url: "../aquacultureUserSensor/getSensorListForScreen",
        data: {size: '100', page: 1, ncode: deviceNumber},
        dataType: "json",
        success: function (data) {
            //加载继电器设备
            getEquipmentMsg(data)
        },
        error: function (e) {
            console.log(e);
        }
    });
}

//加载继电器设备信息
function getEquipmentMsg(list) {
    let $relayDiv = $(".other-info-bg-div2");
    $relayDiv.empty();
    let listDatas = list.data;
    if (list.state == "500") {
        $('<div class="no-data-div"><p class="no-data">暂无数据</p></div>').appendTo($('.other-info-bg-div2'));
    } else {
        if (listDatas.length > 0) {
            for (var i = 0; i < listDatas.length; i++) {
                var $equipmentItem = $("<div class='equipentItem'></div>");
                var $equipmentName = $("<span class='equipmentNameBox'></span>");
                var $switch = $("<input class='switch switch-anim' onchange='' type='checkbox' />");
                $switch.attr("data-sensorNcode", listDatas[i].sensorNcode);
                $switch.attr("data-sensorCode", listDatas[i].sensorCode);
                $switch.attr("data-sensorType", listDatas[i].sensorType);
                $switch.attr("data-state", listDatas[i].state);
                $switch.attr("data-sensorName", listDatas[i].sensorName);
                $equipmentName.text(listDatas[i].sensorName);

                if (parseInt(listDatas[i].state) != "0") {
                    $switch.attr("checked", "checked");
                }

                $equipmentName.appendTo($equipmentItem);

                $switch.appendTo($equipmentItem);
                $equipmentItem.appendTo($relayDiv);
                $switch.click(function (e) {
                    let $that = $(this);
                    let indexNum = $that.parent('.equipentItem').index() + 1;
                    let deviceNumber = $that.attr("data-sensorNcode");
                    let sensorCode = $that.attr("data-sensorCode");
                    let sensorName = $that.attr("data-sensorName");

                    let command = getIndex(indexNum, $that.prop("checked") ? true : false);

                    //如果初始状态为关闭，则打开弹窗，填入信息再执行
                    if ($that.prop("checked") == true) {
                        $that.attr("checked", false);
                        timingClose(deviceNumber, sensorCode, sensorName, command, $that);
                    } else {
                        //直接执行
                        sendCommand(deviceNumber, sensorCode, command, $that);
                    }

                });
            }
        } else {
            $('<div class="no-data-div"><p class="no-data">暂无数据</p></div>').appendTo($('.other-info-bg-div2'));
        }
    }
}


function sendCommand(deviceNumber, sensorCode, command, $that) {
    layer.load(2);
    //操作继电器开关
    $.ajax({
        type: "POST",
        url: "../aquacultureUserSensor/sendCommand",
        data: {
            sensorCode: sensorCode,
            deviceNumber: deviceNumber,
            command: command
        },
        dataType: "json",
        success: function (data) {
            if (data.state == 'success') {
                layer.closeAll('loading');
                layer.msg($.i18n.prop('orderSuccess'), {
                    offset: '20rem'
                });

                $.post("../newFarmInfo/modifyStatus", {
                        "farmId": id,
                        "status": 0,
                    }
                );
            } else {
                layer.msg(data.msg, {
                    offset: '20rem'
                });
            }
        },
        error: function (e) {
            layer.closeAll('loading');
            layer.msg($.i18n.prop('err173'));
            setTimeout(function () {
                if ($that.prop("checked")) {
                    $that.prop("checked", false);
                } else {
                    $that.prop("checked", true);
                }
            }, 200)
        }
    });
}

//直接开启
function directOpening(deviceNumber, sensorCode, command, radio, relayType) {
    layer.load(2);
    //操作继电器开关
    $.ajax({
        type: "POST",
        url: "../aquacultureUserSensor/sendCommand",
        data: {
            sensorCode: sensorCode,
            deviceNumber: deviceNumber,
            command: command
        },
        dataType: "json",
        success: function (data) {
            if (data.state == 'success') {
                layer.closeAll('loading');
                layer.msg($.i18n.prop('orderSuccess'), {
                    offset: '20rem'
                });
                //如果是灌溉或施肥状态，执法指令之后要修改农场状态
                if (relayType == 2 || relayType == 4) {
                    $.post("../newFarmInfo/modifyStatus", {
                            "farmId": id,
                            "status": relayType,
                        }
                    );
                }
            } else {
                layer.msg(data.msg, {
                    offset: '20rem'
                });
            }
        },
        error: function (e) {
            layer.closeAll('loading');
            layer.msg($.i18n.prop('err173'));
            setTimeout(function () {
                if (radio.prop("checked")) {
                    radio.prop("checked", false);
                } else {
                    radio.prop("checked", true);
                }
            }, 200)
        }
    });
}

let getIndex = function (index, type) {
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

Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

function getIconUrl(key) {
    console.log(key);
    console.log(iconMap);
    console.log(iconMap.has(key));
    if (iconMap.has(key)) {
        return iconMap.get(key);
    }
    return "url(../img/yangling/wendu.png) no-repeat";
}

/**
 * 展示定时定量弹窗
 * @param deviceNumber 设备号
 * @param sensorCode 传感器编号
 * @param sensorName 传感器名称
 * @param command 命令
 * @param radio 被点击的开关按钮对象
 */
function timingClose(deviceNumber, sensorCode, sensorName, command, radio) {
    let dataSensorCode = '';//采集设备即时水量传感器编号
    if (indoorDataDevices.length > 0) {
        dataSensorCode = indoorDataDevices[0].deviceNumber + "8";
    }
    layer.open({
        content: '../newFarmInfo/timingClose?deviceNumber=' + deviceNumber + "&command=" + command + "&sensorName=" + sensorName + "&dataSensorCode=" + dataSensorCode,
        type: 2,
        area: ['400px', '450px'],
        title: $.i18n.prop('setTimer'),
        btn: [$.i18n.prop('save'), $.i18n.prop('cancel')],
        btnAlign: 'c',
        yes: function (index, layero) {
            let body = layer.getChildFrame('body', index);
            //首先校验
            let timeUnit = body.find('select[name="timeUnit"]').val();
            let taskType = body.find('select[name="taskType"]').val();
            let relayType = body.find('select[name="relayType"]').val();//继电器类型（灌溉/施肥）
            let taskTime = body.find('input[id="taskTime"]').val();//任务开始时间

            if (taskType == 1) {
                let delayMinute = body.find('input[name="taskOption1"]').val();
                if (delayMinute == null || delayMinute == '') {
                    layer.msg($.i18n.prop('err170'));
                    return;
                }

                if (timeUnit == 1 && delayMinute < 5) {
                    layer.msg($.i18n.prop('err174'));//定时时长至少是5分钟
                    return;
                }

                if (taskTime == null || taskTime == '') {
                    layer.msg($.i18n.prop('err169'));
                    return;
                }

            } else if (taskType == 2) {
                let delayQuantity = body.find('input[name="taskOption2"]').val();
                if (delayQuantity == null || delayQuantity == '') {
                    layer.msg($.i18n.prop('err171'));
                    return;
                }
                if (taskTime == null || taskTime == '') {
                    layer.msg($.i18n.prop('err169'));
                    return;
                }
            } else {
                let delayMinute = body.find('input[name="taskOption1"]').val();
                if (delayMinute == null || delayMinute == '') {
                    layer.msg($.i18n.prop('err170'));
                    return;
                }

                if (timeUnit == 1 && delayMinute < 5) {
                    layer.msg($.i18n.prop('err174'));//定时时长至少是5分钟
                    return;
                }
            }

            //保存定时定量信息
            saveTimeOrQuantityOption(taskType, deviceNumber, sensorCode, sensorName, command, taskTime, body, radio, relayType);

        },
        anim: 3,
        success: function (layero, index) {

        }
    });
}

//保存定时任务
function saveTimer(taskName, deviceNumber, sensorCode, command, taskTime, body, relayType, radio) {
    let period = body.find('input[name="taskOption1"]').val();
    // //时间单位（分钟、小时）
    let timeUnit = body.find('select[name="timeUnit"]').val();
    //加载层-风格3
    layer.load(2);

    if (timeUnit == '1') {//分钟
        period = period * 60 * 1000;
    } else {//小时
        period = period * 60 * 60 * 1000;
    }
    $.ajax({
        url: "../newFarmInfo/saveTimerTask",
        data: {
            taskName: taskName,
            deviceNumber: deviceNumber,
            command: command,
            taskTime: taskTime,
            period: period,
            relayType: relayType,
            farmId: id

        },
        dataType: "json",
        type: "post",
        timeout: 30000,
        error: function (data, type, err) {
            layer.closeAll('loading');
            layer.msg($.i18n.prop('fail'), {
                offset: '6px'
            });
        },
        success: function (result) {
            layer.closeAll();
            if (result.state == 'success') {
                radio.prop("checked", true);
                layer.msg($.i18n.prop("timerSuccess"));
                layer.closeAll('loading');
            } else {
                layer.msg($.i18n.prop(result.msg))
            }
        }
    });
}


function saveTimeOrQuantityOption(taskType, deviceNumber, sensorCode, sensorName, command, taskTime, body, radio, relayType) {
    let taskName = deviceNumber + "_" + sensorName + "_开启";

    switch (taskType) {
        case '1' ://定时任务
            saveTimer(taskName, deviceNumber, sensorCode, command, taskTime, body, relayType, radio);
            break;

        case '2' ://定量任务
            let quantity = body.find('input[name="taskOption2"]').val();
            if (!checkPositiveInteger(quantity)) {
                layer.msg("流量必须为正整数");
                return;
            }
            let dataSensorCode = body.find('input[name="dataSensorCode"]').val();//采集设备即时水量传感器编号
            if (dataSensorCode == '') {
                layer.msg("请填写采集设备节点编号");
                return;
            }
            $.ajax({
                url: "../newFarmInfo/saveQuantitativeTask",
                data: {
                    name: taskName,
                    sensorCode: dataSensorCode,
                    value: quantity,
                    toDevice: deviceNumber,
                    command: command.substring(0, 3) + '0',
                    expression: '>',
                    taskTime: taskTime,
                    relayType: relayType,
                    farmId: id
                },
                dataType: "json",
                type: "post",
                timeout: 30000,
                error: function (data, type, err) {
                    layer.closeAll('loading');
                    layer.msg($.i18n.prop('fail'), {
                        offset: '6px'
                    });
                },
                success: function (result) {
                    layer.closeAll();
                    if (result.state == 'success') {
                        radio.prop("checked", true);
                        layer.msg($.i18n.prop("success"));
                        layer.closeAll('loading');
                    } else {
                        layer.msg($.i18n.prop(result.msg))
                    }
                }
            });
            break;

        case '3' ://立即开启
            //直接下发开启指令
            directOpening(deviceNumber, sensorCode, command, radio, relayType);
            saveTimer(taskName, deviceNumber, sensorCode, command, "", body, relayType, radio);
            break;
    }
}


Date.prototype.Format = function (fmt) {
    var o = {
        "H+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}




