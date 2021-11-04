var landLine;
var id;
var farmName;
let layer;
let dataDevices = [];
let lineChart;
$(function () {
    id = $('#farmId').val();
    farmName = $('#farmName').val();
    //页面各元素高度自适应设置
    let documentHeight = $(window).height();

    $(".content").height(documentHeight - 48);
    $('top-content').height($(".content").height() * 0.65);
    $('bottom-content').height($(".content").height() * 0.35);

    $(window).resize(function () {
        documentHeight = $(window).height();
        $(".content").height(documentHeight - 48);
        $('top-content').height($(".content").height() * 0.65);
        $('bottom-content').height($(".content").height() * 0.35);
        resetrem();
    });

    layui.use(['form', 'layer', 'layedit', 'laydate'], function () {
        layer = layui.layer;
    });

    //清空继电器设备
    $('.button-div').empty();

    //清空实时数据
    $('.arg-div').empty();

    //通过大棚id获取环境信息
    getDeviceMsg();
});


//通过大棚id获取所有绑定的设备
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
            console.log('????');
            console.log(id);
            console.log(farmName);
            console.log(data);
            if (data.state == "success" && data.datas.length > 0) {
                for (let i = 0; i < data.datas.length; i++) {
                    //采集设备
                    if (data.datas[i].deviceType != 2) {
                        dataDevices.push(data.datas[i]);
                    } else {//继电器设备
                        initRelayButtons(data.datas[i].deviceNumber);
                    }
                }
                //渲染采集设备实时数据
                renderDeviceData();
                //渲染折线图
                renderDeviceSensorReport();
            }
        },
        error: function (e) {
            console.log(e);
        }
    });
}

function renderDeviceData() {
    let dataMap;
    $argDiv = $('.arg-div');
    let index = 0;
    for (let j = 0; j < dataDevices.length; j++) {
        dataMap = new Map();
        console.log('----device数组-----');
        console.log(dataDevices[j]);
        let type = dataDevices[j].type.split('/');
        let data = dataDevices[j].data.split('|');
        for (let k = 0; k < type.length; k++) {
            dataMap.set(trim(type[k]), data[k]);
        }

        //如果含有风向，就首先进行渲染风向
        if (dataMap.has('风向') && j == 0) {
            let $argName = $("<span class='arg-name'></span>");
            let $argValue = $("<span class='arg-value'></span>");
            $argName.text('风向');
            $argValue.text(dataMap.get('风向'));
            $argName.appendTo($argDiv.eq(index));
            $argValue.appendTo($argDiv.eq(index));
            dataMap.delete('风向');
            index++;
        }

        for (let [key, value] of dataMap) {
            // console.log(key);
            if (index >= $argDiv.length || key == '风向') continue;
            let $argName = $("<span class='arg-name'></span>");
            let $argValue = $("<span class='arg-value'></span>");
            $argName.text(key);
            $argValue.text(value);
            $argDiv.eq(index).attr("device-num", dataDevices[j].deviceNumber);
            // $argDiv.eq(index).attr("device-num",'sdfdsfsdf');
            $argName.appendTo($argDiv.eq(index));
            $argValue.appendTo($argDiv.eq(index));

            index++;
        }
    }
}

/**
 * 加载继电器控制按钮
 * @param deviceNumber
 */
function initRelayButtons(deviceNumber) {
    $buttonDivs = $('.button-div');
    if (deviceNumber.length > 0) {
        $.ajax({
            type: "POST",
            url: "../aquacultureUserSensor/getSensorList",
            async: false,//保证每次刷新页面得到的继电器列表排序统一
            data: {size: '100', page: 1, ncode: deviceNumber},
            dataType: "json",
            success: function (data) {
                //通过设备号获取设备开关信息
                getEquipmentMsg(data);
            },
            error: function (e) {
                console.log(e);
            }
        });
    } else {
        //TODO
        var $bottomFour = $(".bottomFour");
        $bottomFour.empty();
        var $equipment = $("<span class='equipment'>当前监测点联动设备</span>");
        var $nomsg = $("<span class='nomsg'>暂无设备</span>");
        $equipment.appendTo($bottomFour);
        $nomsg.appendTo($bottomFour);
    }
}

//设备开关
function getEquipmentMsg(list) {
    var $bottomContentItem1 = $(".bottom-content-item1");
    var listDatas = list.datas;
    //TODO 修改
    if (list.state == "500") {
        var $equipment = $("<span class='equipment'>当前监测点联动设备</span>");
        var $nomsg = $("<span class='nomsg'></span>");
        $nomsg.text(list.msg);
        $equipment.appendTo($bottomContentItem1);
        $nomsg.appendTo($bottomContentItem1);
    } else {
        if (listDatas.length > 0) {
            let $buttonDivs = $('.button-div');
            let $buttonDiv;
            for (var i = 0; i < listDatas.length; i++) {
                for (let j = 0; j < $buttonDivs.length; j++) {
                    $buttonDiv = $buttonDivs[j];
                    if ($buttonDivs.eq(j).children().length != 0) {
                        continue;
                    }
                    var $radioButton = $("<div class='radio-button'></div>");
                    var $radioText = $("<div class='radio-text'></div>");
                    $radioText.text(listDatas[i].sensorName);
                    $radioButton.attr("data-sensorNcode", listDatas[i].sensorNcode);
                    $radioButton.attr("data-sensorCode", listDatas[i].sensorCode);
                    $radioButton.attr("data-sensorType", listDatas[i].sensorType);
                    $radioButton.attr("data-state", listDatas[i].sensorData);

                    if (parseInt(listDatas[i].sensorData) == 1) {
                        $radioButton.addClass('opened');
                    } else {
                        $radioButton.addClass('closed');
                    }

                    $radioButton.appendTo($buttonDivs[j]);
                    $radioText.appendTo($buttonDivs[j]);

                    $radioButton.click(function (e) {
                        var $that = $(this);

                        let sensorCode = $that.attr('data-sensorcode');
                        let indexNum = sensorCode.replace($that.attr('data-sensorncode'), '');
                        console.log($that.hasClass("opened"));
                        //操作继电器开关
                        $.ajax({
                            type: "POST",
                            url: "../aquacultureUserSensor/sendCommand",
                            data: {
                                sensorCode: $that.attr("data-sensorCode"),
                                deviceNumber: $that.attr("data-sensorNcode"),
                                command: getIndex(indexNum, $that.hasClass("opened") ? false : true)
                            },
                            dataType: "json",
                            success: function (data) {
                                layer.msg(data.msg, {
                                    offset: '20rem'
                                });
                                if (data.state != "failed") {
                                    if ($that.hasClass('opened')) {
                                        $that.removeClass('opened').addClass('closed');
                                    } else {
                                        $that.removeClass('closed').addClass('opened');
                                    }
                                }
                            },
                            error: function (e) {
                                console.log(e);
                            }
                        });
                    });
                    break;
                }
            }
        }
        // else {
        //     var $equipment = $("<span class='equipment'>当前监测点联动设备</span>");
        //     var $nomsg = $("<span class='nomsg'>暂无设备</span>");
        //     $equipment.appendTo($bottomFour);
        //     $nomsg.appendTo($bottomFour);
        // }
    }
}

var getIndex = function (index, type) {
    var index;
    var type;
    if (String(index).length > 1) {
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


function renderDeviceSensorReport() {
    let index = 0;
    let $chartDiv = $('.chart-div');

    for (let i = 0; i < dataDevices.length; i++) {
        console.log("获取第" + i + 1 + "设备信息");
        $.ajax({
            type: "POST",
            url: "../monitor/getSensorReport",
            data: {"deviceNumber": dataDevices[i].deviceNumber},
            dataType: "json",
            success: function (res) {
                if (res.success == true && res.data && index++ < $chartDiv.length) {
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

                        let series = [];
                        let colorNum = 0;
                        let colorArr = ["#00A0E9", "#00FF00", "#8AFFD9", "#FFB438", "#FF87EB", "#FF437A", "#4CFFEB"];
                        for (var q = 0; q < newKeyArr.length; q++) {
                            for (let r = 0; r < $chartDiv.length; r++) {
                                let $preSib = $chartDiv.eq(r).prev();
                                if ($preSib.attr("device-num") == dataDevices[i].deviceNumber
                                    && $preSib.children('span').eq(0).text() == newKeyArr[q]) {
                                    series = [];
                                    let charDivIndex = $('.chart-div').index($chartDiv.eq(r));

                                    console.log("初始化chart-div" + (charDivIndex + 1) + "  " + newKeyArr[q] + "  " + $preSib.children('span').eq(0).text() + "  " + dataDevices[i].deviceNumber);
                                    lineChart = echarts.init(document.getElementById('chart-div' + (charDivIndex + 1)));
                                    lineChart.clear();

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
                                            color: colorArr[colorNum++]
                                        }
                                    };
                                    series.push(sObj);

                                    if (series.length > 0) {
                                        var legData = [];
                                        for (var v = 0; v < series.length; v++) {
                                            legData.push(series[v].name)
                                        }
                                    }

                                    setOption(lineChart, series);
                                }
                            }
                        }
                    }
                }
            }
        });
    }
}

function setOption(chartObj, series) {
    option = {
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            top: '5%',
            left: '2%',
            right: '3%',
            bottom: '5%',
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
                    color: "#424349"
                }
            }
        },
        yAxis: {
            type: 'value',
            splitNumber: 4,
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
                    color: '#ffb999',
                }
            },
            axisTick: {
                inside: true
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: "#224149"
                }
            },
            nameTextStyle: {
                color: "#ff625d"
            },
            splitArea: {
                show: false
            }

        },
        series: series
    };

    chartObj.setOption(option);
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

function trim(str) {
    if (str == null) {
        str = "";
    }
    return str.replace(/(^\s*)|(\s*$)/g, "");
};

function resetrem() {
    var html = document.querySelector("html");//获取到html元素
    var width = html.getBoundingClientRect().width;//获取屏幕的宽度
    html.style.fontSize = width / 100 + "px";
}
