var language = getCookie('jxct_lang'), map;
if (language != 'en') {
    language = 'zh_cn';
}

//初始加载页面时显示历史操作记录列表
refreshPersonRecord();

$(function () {
    //大屏名字变动随着中性变化
    $.post("../user/selUserDetails", {}, function (res) {
        if (res.state == 'success' && res.data.info) {
            $("#screenTitle").html(res.data.info.company);
            //<span id="screenTitle"></span>
        }
    });
})
layui.use(['form', 'layedit', 'laydate'], function () {
});

//添加loading
$('#loading').load("../page/loading.html");

//地图加载完毕删除logo、loading
function removeLoading(){
    console.log("回调完成");
    $('#logo').remove();
}


var $deviceBox;
var botanyTypeBarChart = "";
var animalBarOne = "";
var animalBarTwo = "";
var deviceNumber = [];

//当前花房下所有设备
var ress = [];
//当前花房下所有摄像头号码；
var serial = [];

/*var groupPieTwo = "";
var groupPieThree = "";
var groupPieFour = "";*/
var landLine = "";
var botanyNum = 0;
var animalNum = 0;
$(function () {
//页面各元素高度自适应设置
    var documentHeight = $(window).height();
    $(".content").height(documentHeight - 60);
    $(".leftFixedBox").height($(".content").height() - $(".leftOne").height() - 20);
    /*     $(".leftTwo").height($(".leftFixedBox").height() * 0.45);
        $(".leftThree").height($(".leftFixedBox").height() * 0.45);
        $(".leftFour").height($(".leftFixedBox").height() * 0.25);*/
    $(".warningItemBox").height($(".leftTwo").height() - $(".leftTwoTitleBox").height() - $(".warningTitle").height());
    $(".linkBox").height($(".leftThree").height() - $(".leftThreeTitleBox").height() - $(".linkTitle").height());
    $(".leftThreeContent").height($(".leftThree").height() - $(".leftThreeTitleBox").height());
    $(".leftFourContent").height($(".leftFour").height() - $(".leftFourTitleBox").height());
    $(".optionBox").height($(".leftFourContent").height() - $(".optionTitle").height());
    $(".centerContent").height($(".content").height());
    $(".centerTop").height($(".centerContent").height() - $(".centerBottom").height() - 25);


    $(".rightContent").height($(".content").height());
    $(".rightTop").height($(".rightContent").height() - $(".rightCenter").height() - $(".rightBottom").height() - 20);
    $(".deviceBox").height($(".rightTop").height() - $(".rightTopTitleBox").height() - $(".deviceTitle").height() - 30);
    $(".dangerMsgMb").height($(".dangerMessageBox").height());
    $(".dangerMsgMb").width($(".dangerMessageBox").width());
    $(window).resize(function () {
        var documentHeight = $(window).height();
        $(".content").height(documentHeight - 60);
        $(".leftFixedBox").height($(".content").height() - $(".leftOne").height() - 20);
        /*         $(".leftTwo").height($(".leftFixedBox").height() * 0.45);
                $(".leftThree").height($(".leftFixedBox").height() * 0.45);
                $(".leftFour").height($(".leftFixedBox").height() * 0.25);*/
        $(".warningItemBox").height($(".leftTwo").height() - $(".leftTwoTitleBox").height() - $(".warningTitle").height());
        $(".linkBox").height($(".leftThree").height() - $(".leftThreeTitleBox").height() - $(".linkTitle").height());
        $(".leftThreeContent").height($(".leftThree").height() - $(".leftThreeTitleBox").height());
        $(".leftFourContent").height($(".leftFour").height() - $(".leftFourTitleBox").height());
        $(".optionBox").height($(".leftFourContent").height() - $(".optionTitle").height());
        $(".centerContent").height($(".content").height());
        $(".centerTop").height($(".centerContent").height() - $(".centerBottom").height() - 25);

        $(".rightContent").height($(".content").height());
        $(".rightTop").height($(".rightContent").height() - $(".rightCenter").height() - $(".rightBottom").height() - 20);
        $(".deviceBox").height($(".rightTop").height() - $(".rightTopTitleBox").height() - $(".deviceTitle").height() - 30);

        $(".dangerMsgMb").height($(".dangerMessageBox").height());
        $(".dangerMsgMb").width($(".dangerMessageBox").width());


        botanyTypeBarChart.resize();
        animalBarOne.resize();
        animalBarTwo.resize();

        landLine.resize();
    });

//动态添加banner名称
    /*   $.post("../user/selUserDetails", {}, function (res) {
           if (res.state == 'success') {
               $(".bannerImg").html(res.data.info.company);
           }
       });*/


//图标目前均为假数据，得到对应接口后通过ajax请求获得返回的数据信息并改造成图表所需的格式即可(参照initLandLine方法)


    //获取花房下设备信息
    $.ajax({
        type: "POST",
        // url: "farmInfo/getFarmDeviceList",
        url: "deviceManage/getDeviceList",
        data: {
            // "farmId": res.datas[0].id,
            "page": "1",
            "limit": "100",
            // "size": "100"
        },
        async: true,
        dataType: "json",
        success: function (res) {
            $deviceBox = $(".deviceBox");
            $deviceBox.empty();
            //resData当前花房下所有设备信息
            var resData = res.data;
            console.log("resData:", resData);

            var list = [];
            for (var i = 0; i < resData.length; i++) {
                var data = resData[i];
                if (data.deviceType != 2) {
                    let temp = [];
                    ress.push(resData[i]);
                    deviceNumber.push(resData[i].deviceNumber);
                    var type = resData[i].type.split("/");
                    var datas = resData[i].data.split("|");
                    for (let i = 0; i < type.length; i++) {
                        temp.push({name: type[i], value: datas[i]});
                    }
                    list.push(temp);
                }
            }

            //初始加载默认第一台采集设备
            getInfo(ress[0]);

            //获取账号下花房信息(ID)
            $.ajax({
                type: "POST",
                url: "../farmInfo/getList",
                data: {page: 1, size: 100},
                async: true,
                dataType: "json",
                success: function (res) {
                    console.log("res:", res);
                    if (res.datas.length > 0) {
                        //获取花房植物柱状图
                        initbotanyTypeBar(res.datas[0].id);

                        //获取花房动物种类饼图

                        initAnimalPieOne(res.datas[0].id);

                        //动植物数量比
                        initAnimalPieTwo();

                        //区域作物生长周期
                        $.ajax({
                            type: "POST",
                            url: "farmCrops/getListTwo",
                            data: {
                                "page": 1,
                                "size": 10,
                                "farmInfoId": res.datas[0].id,
                                "type": 0
                            },
                            async: true,
                            dataType: "json",
                            success: function (res) {
                                var resData = res.datas;
                                if (resData.length > 0) {
                                    for (var j = 0; j < resData.length; j++) {
                                        //创建植物周期echarts
                                        initGroup(resData[j], "groupNum" + j);
                                    }
                                }
                            },
                            error: function (e) {
                                console.log(e);
                            }
                        });

                        $.ajax({
                            type: "post",
                            url: "/cameraApplication/getCameraList",
                            data: {
                                page: 1,
                                size: 100,
                                appType: 1,
                                appId: res.datas[0].id
                            },
                            success: function (res) {
                                let infoList = res.datas;

                                for (var i = 0; i < infoList.length; i++) {
                                    serial.push(infoList[i].serial);
                                }
                                //加载视频（通过ajax获取摄像头设备号，添加到参数内）
                                //初始加载默认第一个摄像头
                                getCamareUrl(serial[0]);
                            }
                        })
                    }
                },
                error: function (e) {
                    console.log(e);
                }
            });

            //ThingJS传递动态数据数据
            var iframe = document.getElementById('iframe');
            iframe.onload = function () {
                function count() {
                    var data = {
                        ress: ress,
                        deviceNumber: deviceNumber,
                        list: list,
                        serial: serial,
                    }
                    console.log('data: ', data);
                    var send = {funcName: 'updateData', param: data};
                    iframe.contentWindow.postMessage(send, '*');
                    return count;
                }
                setTimeout(count(), 15000);
                setInterval(count(), 300000);
            };
        },
        error: function (e) {
            console.log(e);
        }
    });

    $("#playerNoData").css("height", "72%").css("width", "92%").css("margin-top", "15px");

    //获取地块数据预警信息
    getDangerMsg();
    //获取联动记录
    getRecordMsg();

    //删除人员操作记录
    $(document).on("click", ".delPersonRecord", function () {
        delPersonRecord($(this).attr("data-id"));
        // alert($(this).attr("data-id"));
    })
});

//添加人员操作记录
$(function () {
    $("#add").click(function () {
        layer.open({
            type: 2,
            title: "",
            btn: [$.i18n.prop('save'), $.i18n.prop('cancel')],
            closeBtn: false,
            area: ['600px', '420px'],
            shade: 0.2,
            // id: 'LAY_onLineCtrl',
            btnAlign: 'c',
            yes: function (index, layero) {
                layero.find('.layui-layer-ico layui-layer-close layui-layer-close2').addClass('layui-hide');
                var body = layer.getChildFrame('body', index);
                var classTime = body.find('input[name="classTime"]').val();
                var userName = body.find('input[name="userName"]').val();
                var projectName = body.find('input[name="projectName"]').val();

                if (classTime == "" || classTime == null) {
                    layer.msg('请选择课程时间！');
                    return;
                } else if (userName == "" || userName == null) {
                    layer.msg('请输入讲师姓名！');
                    return;
                } else if (projectName == "" || projectName == null) {
                    layer.msg('请输入科目名称！');
                    return;
                }

                $.ajax({
                    type: "post",
                    url: "/newFlowerRoom/saveOperationRecord",
                    data: {
                        classTime: classTime,
                        userName: userName,
                        projectName: projectName
                    },
                    success: function (reg) {
                        if (reg.state == 'success') {
                            layer.msg($.i18n.prop("创建成功"));
                            setTimeout(function () {
                                parent.layer.close(index);
                                //关闭添加页面并刷新操作记录
                                refreshPersonRecord();
                            }, 1000)
                        } else {
                            layer.msg($.i18n.prop(result.msg), {icon: 2});
                        }
                    }
                })
            },
            moveType: 1,
            content: '/newFlowerRoom/addPerson',
            // content:"/newFlowerRoom/list",
            success:

                function (layero, index) {

                }
        });
    });
})

//通过id删除人员操作记录
function delPersonRecord(id){
    $.ajax({
        type:'post',
        data:{id:id},
        url:"newFlowerRoom/deleteOperationRecord",
        success:function (reg) {
            if (reg.state == 'success') {
                layer.msg($.i18n.prop("删除成功"));
                setTimeout(function () {
                    //刷新操作记录
                    refreshPersonRecord();
                }, 2000)
            } else {
                layer.msg($.i18n.prop(result.msg), {icon: 2});
            }
        }
    })
}

//获取人员操作记录列表
function refreshPersonRecord(){
    $.ajax({
        type: "post",
        url: "/newFlowerRoom/getOperationRecord",
        success: function (reg) {
            if (reg.state == 'success') {
                let data = reg.data;
                let $optionBox = $('.optionBox');
                $optionBox.empty();
                for (let i = 0; i < data.length; i++) {
                    var $optionItem = $("<div class= optionItem></div>");
                    var $three = $("<div class= three></div>");
                    var $pointIcon = $("<img class='pointIcon' src='../../static/img/flowerRoom/point.png' />");
                    var $optionTime = $("<span class='optionTime'></span>");
                    var $optionName = $("<span class='optionName'></span>");
                    var $optionClass = $("<span class='optionClass'></span>");
                    var $delPersonRecord = $("<img class='delPersonRecord' id='delPersonRecord' src='../../static/img/flowerRoom/delete.png' />");
                    $optionTime.text(new Date(data[i].classTime).Format('MM/dd hh:mm'));
                    $optionName.text(data[i].userName);
                    $optionClass.text(data[i].projectName);
                    $pointIcon.appendTo($three);
                    $optionTime.appendTo($three);
                    $three.appendTo($optionItem);
                    $optionName.appendTo($optionItem);
                    $optionClass.appendTo($optionItem);
                    $delPersonRecord.appendTo($optionItem);
                    $optionItem.appendTo($optionBox);
                    $delPersonRecord.attr("data-id",data[i].id);
                }
            } else {
                layer.msg($.i18n.prop(result.msg), {icon: 2});
            }
        }
    })
}

//获取当前区域实时环境监测
function getInfo(ress) {
    //获取花房下设备信息
    $.ajax({
        type: "POST",
        url: "farmInfo/getFarmDeviceList",
        data: {
            "farmId": 158,
            "page": "1",
            "size": "100"
        },
        async: true,
        dataType: "json",
        success: function (res) {
            $deviceBox = $(".deviceBox");
            $deviceBox.empty();
            // var resData = res.datas;
            // ress1 = resData[0];
            // ress2 = resData[1];
            //
            // resData1 = resData[0].deviceNumber;
            // resData2 = resData[1].deviceNumber;

            var itemName = ress.type;
            var itemNameArr = itemName.split("/");
            var itemValue = ress.data;
            if (itemValue && itemValue.length > 0) {
                var itemValueArr = itemValue.split("|");
                for (var i = 0; i < itemValueArr.length; i++) {
                    var $deviceItem = $("<div class='deviceItem'></div>");
                    var $devicename = $("<span class='devicename'></span>");
                    var $devicevalue = $("<span class='devicevalue'></span>");
                    $devicename.text(itemNameArr[i] + ":");
                    $devicevalue.text(itemValueArr[i]);
                    $devicename.appendTo($deviceItem);
                    $devicevalue.appendTo($deviceItem);
                    $deviceItem.appendTo($deviceBox);
                }
            }
            //土地墒情预警
            initLandLine(ress.deviceNumber);
        },
        error: function (e) {
            console.log(e);
        }
    });
}

//植物种类
function initbotanyTypeBar(farmInfoId) {
    botanyTypeBarChart = echarts.init(document.getElementById('botanyTypeBar'));
    botanyTypeBarChart.clear();

    $.ajax({
        type: "POST",
        url: "farmCrops/findFarmCount",
        data: {
            "page": 1,
            "size": 10,
            "farmId": farmInfoId,
            "type": 0
        },
        async: false,
        dataType: "json",
        success: function (res) {
            var resData = res.data;
            botanyNum = 0;
            if (resData.length > 0) {
                var data = [];
                var botanyType = [];
                for (var i = 0; i < resData.length; i++) {
                    data.push(resData[i].num);
                    botanyType.push(resData[i].crops_name);
                    botanyNum = botanyNum + resData[i].num;
                }

                var option = {
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
                        left: '1%',
                        right: '2%',
                        bottom: 0,
                        top: 50,
                        padding: '0 0 0 0',
                        height: '65%',
                        containLabel: true,
                    },
                    legend: {//图例组件，颜色和名字
                        right: 10,
                        top: 10,
                        data: [{
                            name: '数量',
                        }],
                        textStyle: {
                            color: '#cccccc',
                            fontStyle: 'normal',
                            fontFamily: '微软雅黑',
                            fontSize: 12,
                        }
                    },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: true,//坐标轴两边留白
                            data: botanyType,
                            axisLabel: { //坐标轴刻度标签的相关设置。
                                interval: 0,//设置为 1，表示『隔一个标签显示一个标签』
                                margin: 8,
                                textStyle: {
                                    color: '#cccccc',
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
                                    color: '#cccccc',
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
                                    color: '#cccccc',
                                    fontStyle: 'normal',
                                    fontFamily: '微软雅黑',
                                    fontSize: 10,
                                }
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#cccccc',
                                    opacity: 0.2
                                },
                                show: false
                            },
                            axisTick: {
                                show: false
                            },
                            splitLine: {
                                show: true,
                                lineStyle: {
                                    color: ['#cccccc'],
                                    opacity: 0.2
                                }
                            }

                        }
                    ],
                    series: [
                        {
                            name: '数量',
                            type: 'bar',
                            data: data,
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
                                        offset: 0, color: '#e59a13'
                                    }, {
                                        offset: 0.7, color: '#0dba88'
                                    }], false),
                                },
                            },
                        },

                    ]
                };

                botanyTypeBarChart.setOption(option);
            }

        },
        error: function (e) {
            console.log(e);
        }
    });


}


//动物种类pieOne
function initAnimalPieOne(farmInfoId) {
    animalBarOne = echarts.init(document.getElementById('animalBarOne'));
    animalBarOne.clear();

    $.ajax({
        type: "POST",
        url: "farmCrops/findFarmCount",
        data: {
            "page": 1,
            "size": 10,
            "farmId": farmInfoId,
            "type": 1
        },
        async: false,
        dataType: "json",
        success: function (res) {


            var resData = res.data;
            animalNum = 0;
            if (resData.length > 0) {
                var datas = [];

                for (var i = 0; i < resData.length; i++) {
                    var obj = {};
                    obj.name = resData[i].crops_name;
                    obj.value = resData[i].num;
                    datas.push(obj);
                    animalNum = animalNum + resData[i].num;
                }


                option = {
                    label: { 　　　　　　　　　　//去除饼图的指示折线label
                        normal: {
                            show: false,
                            position: 'inside',
                            formatter:"{b}:{d}%"
                        },
                    },
                    tooltip: {
                        trigger: 'item',
                        // formatter: "{b} : {d}% <br/> {c}"
                    },
                    title: {
                        text: '数量',
                        left: 'center',
                        top: '30%',
                        padding: [10, 0],
                        textStyle: {
                            color: '#fff',
                            fontSize: 12,
                            align: 'center'
                        }
                    },
                    legend: {
                        selectedMode: false,
                        // formatter: function (name) {
                        //     var total = 0; //各科正确率总和
                        //     var averagePercent; //综合正确率
                        //     datas.forEach(function (value, index, array) {
                        //         total += value.value;
                        //     });
                        //     return total;
                        // },
                        data: [datas[0].name],
                        left: 'center',
                        top: '44%',
                        icon: 'none',
                        align: 'center',
                        padding: [10, 0],
                        textStyle: {
                            color: "#ffffff",
                            fontSize: 22,
                            fontWeight: 700
                        },
                    },
                    series: [{
                        type: 'pie',
                        radius: ['50%', '70%'],
                        center: ['50%', '50%'],
                        color: ['#01b4d2', '#d90051', '#0dba88', '#9702fe', '#e59a13'],
                        data: datas,
                        normal:{
                         show:false
                        },
                        label: { 　　　　　　　　　　//去除饼图的指示折线label
                            normal: {
                                show: false,
                                position: 'inside',
                                formatter:"{b}:{d}%"
                            },
                        },
                        // labelLine: {
                        //     normal: {
                        //         length: 10,
                        //         length2: 10,
                        //         lineStyle: {
                        //             width: 2
                        //         }
                        //     }
                        // },
                        // label: {
                        //     normal: {
                        //         formatter: function (name) {
                        //             datas.forEach(function (name, value, index, array) {
                        //                 return name;
                        //             });
                        //         },
                        //         padding: [0, 2],
                        //
                        //     }
                        // }
                    }]
                };

                animalBarOne.setOption(option);

            }

        },
        error: function (e) {
            console.log(e);
        }
    });


}


//动物种类pieTwo
function initAnimalPieTwo() {
    animalBarTwo = echarts.init(document.getElementById('animalBarTwo'));
    var value = [animalNum, botanyNum];
    var datas = [{
        value: animalNum,
        name: '动物'
    },
        {
            value: botanyNum,
            name: '植物'
        }
    ];
    option = {
        tooltip: {
            trigger: 'item',
            formatter: "{b} : {d}% <br/> {c}"
        },
        title: {
            text: "",
            left: 'center',
            top: '32%',
            padding: [10, 0],
            textStyle: {
                color: '#fff',
                fontSize: 11,
                align: 'center'
            }
        },
        legend: {
            selectedMode: false,
            formatter: "动植物数量比",
            data: [datas[0].name],
            left: 'center',
            top: '40%',
            icon: 'none',
            align: 'center',
            padding: [10, 0],
            textStyle: {
                color: "#ffffff",
                fontSize: 11
            },
        },
        series: [{
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['50%', '50%'],
            color: ['#e59a13', '#0ab4d2'],
            data: datas,
            label: {
                normal: {
                    position: "inner",
                    show: false
                }
            }
        }]
    };

    animalBarTwo.setOption(option);


}


//成长周期
function initGroup(msg, groupPie) {
    var $groupPieBox = $(".groupPieBox");
    var $groupPie = $("<div  class='groupPie'></div>");
    $groupPie.attr("id", groupPie);
    $groupPie.appendTo($groupPieBox);
    groupPie = echarts.init(document.getElementById(groupPie));
    var datas = [];
    for (var i = 0; i < 2; i++) {
        var datasObj = {};
        if (i == 0) {
            datasObj.value = msg.plantingDays;
            datasObj.name = msg.growthCycle;
        } else {
            datasObj.value = msg.totalDays - msg.plantingDays;
            datasObj.name = "未完成";
        }
        datas.push(datasObj);
    }

    var pieColor;
    if (msg.growthCycle == "成熟期") {
        pieColor = ['#d90051', '#363636'];
    } else if (msg.growthCycle == "成长期") {
        pieColor = ['#e9c105', '#363636'];
    } else {
        pieColor = ['#0dba88', '#363636'];
    }


    option = {
        title: {
            text: datas[0].name,
            left: 'center',
            top: '15%',
            padding: [10, 0],
            textStyle: {
                color: '#ffffff',
                fontSize: 10,
                align: 'center'
            }
        },
        legend: {
            selectedMode: false,
            formatter: msg.cropsName,
            data: [datas[0].name],
            left: 'center',
            bottom: '1%',
            icon: 'none',
            align: 'center',
            padding: [10, 0],
            textStyle: {
                color: "#ffffff",
                fontSize: 10
            },
        },
        series: [{
            type: 'pie',
            radius: ['55%', '65%'],
            center: ['50%', '35%'],
            color: pieColor,
            data: datas,
            label: {
                normal: {
                    position: "inner",
                    show: false
                }
            }
        }]
    };

    groupPie.setOption(option);


}


// 获取视频监控url
function getCamareUrl(deviceSerial) {
    var $playerBox = $(".playerBox");
    $("#player").remove();
    $("#playerNoData").remove();
    var $player = $('<video  id="player" style="width: 100%;height:100%;" poster="" controls playsInline webkit-playsinline autoplay></video>');
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

//获取种植地数据预警信息
function getDangerMsg() {
    $.ajax({
        type: "get",
        url: '../trigger/triggerHistoryList',
        data: {
            page: 1,
            size: 100
        },
        dataType: "json",
        success: function (data) {
            if (data.state == "success" && data.datas.length > 0) {
                addDangerMsg(data.datas);
            }
        },
        error: function (e) {
            console.log(e);
        }
    });
}


//加载种植地数据预警信息
function addDangerMsg(list) {
    var $warningItemBox = $(".warningItemBox");
    $warningItemBox.empty();
    for (var j = 0; j < list.length; j++) {
        var $warningItem = $("<div class='warningItem'></div>");
        var $itemName = $("<span class='itemName'></span>");
        var $itemTime = $("<span class='itemTime'></span>");
        $itemName.text(list[j].name);
        $itemTime.text(list[j].alarmTime);
        $itemName.appendTo($warningItem);
        $itemTime.appendTo($warningItem);
        $warningItem.prependTo($warningItemBox);
    }
}

// 监听子页面传回的数据
window.addEventListener('message', function (e) {
    console.log(e);
    var data = e.data;
    var funcName = data.funcName;
    var param = data.param;
    // 调用 本页面方法
    try {
        window[funcName](param);
    } catch (e) {

    }
});

//获取联动记录
function getRecordMsg() {
    $.ajax({
        type: "POST",
        url: '../conditionConfig/getHistoryList',
        data: {
            page: 1,
            limit: 100
        },
        dataType: "json",
        success: function (data) {
            if (data.count > 0 && data.data.length > 0) {
                addRecordMsg(data.data);
            }
        },
        error: function (e) {
            console.log(e);
        }
    });
}

//加载联动记录
function addRecordMsg(list) {
    var $linkBox = $(".linkBox");
    $linkBox.empty();
    for (var i = 0; i < list.length; i++) {
        var $linkItem = $("<div class='linkItem'></div>");
        var $first = $("<div class='first'></div>");
        var $pointIcon = $("<img class='pointIcon' src='../../static/img/flowerRoom/point.png' />");
        var $linkTime = $("<span class='linkTime'></span>");
        var $linkName = $("<span class='linkName'></span>");
        var $linkMsg = $("<span class='linkMsg'></span>");
        $linkName.text(list[i].name);
        $linkTime.text(new Date(list[i].time).Format('MM/dd hh:mm'));
        $linkMsg.text(list[i].msg);
        // $linkMsg.text(new Date(list[i].time).Format('MM/dd hh:mm') + ' ' + list[i].name + list[i].msg);
        $pointIcon.appendTo($first);
        $linkTime.appendTo($first);
        $first.appendTo($linkItem);
        $linkName.appendTo($linkItem);
        $linkMsg.appendTo($linkItem);
        $linkItem.appendTo($linkBox);

    }
}

//土地墒情预警（假数据）
/*function initLandLine() {
    landLine = echarts.init(document.getElementById('landLine'));
    landLine.clear();
    var cArr = [11, 20, 24, 26, 28, 30, 35, 38, 40, 37, 35, 33, 31, 30, 28, 25, 22, 20, 26, 28, 30, 28, 26, 25, 22]
    option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                lineStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0,
                            color: 'rgba(255,255,255,0)' // 0% 处的颜色
                        }, {
                            offset: 0.5,
                            color: 'rgba(255,255,255,1)' // 100% 处的颜色
                        }, {
                            offset: 1,
                            color: 'rgba(255,255,255,0)' // 100% 处的颜色
                        }],
                        global: false // 缺省为 false
                    }
                },
            },

        },

        grid: {
            left: '3%',
            right: '4%',
            bottom: '1%',
            top: "5%",
            height: "80%",
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisLine: {
                lineStyle: {
                    color: '#cccccc',
                    opacity: 0.2
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
            data: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24']
        }],
        yAxis: [{
            type: 'value',
            splitNumber: 2,
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#cccccc',
                    opacity: 0.2
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
                    color: '#cccccc',
                    opacity: 0.2
                }
            }
        }],
        series: [{
            name: '预警数值',
            type: 'line',
            smooth: false,
            symbol: 'circle',
            symbolSize: 8,
            showSymbol: false,
            lineStyle: {
                normal: {
                    width: 3
                }
            },
            areaStyle: { //区域填充样式
                normal: {
                    //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(0,150,239,0.3)'
                    },
                        {
                            offset: 1,
                            color: 'rgba(0,253,252,0)'
                        }
                    ], false),
                    shadowColor: 'rgba(53,142,215, 0.9)', //阴影颜色
                    shadowBlur: 20 //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
                }
            },
            itemStyle: {
                normal: {

                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                        offset: 0,
                        color: '#3d84f3'
                    }, {
                        offset: 1,
                        color: '#48daf3'
                    }])
                },
                emphasis: {
                    color: 'rgb(99,250,235)',
                    borderColor: 'rgba(99,250,235,0.2)',
                    extraCssText: 'box-shadow: 8px 8px 8px rgba(0, 0, 0, 1);',
                    borderWidth: 10
                }
            },
            data: cArr
        }]
    };
    landLine.setOption(option);
}*/

//土地墒情预警（ajax返回数据）
function initLandLine(deviceNumber) {
    landLine = echarts.init(document.getElementById('landLine'));
    landLine.clear();


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
                        if (newKeyArr[q] == "温度" || newKeyArr[q] == "湿度" || newKeyArr[q] == "土壤温度" || newKeyArr[q] == "土壤湿度") {
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
                            top: '1%',
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
                            top: '15%',
                            left: '3%',
                            right: '4%',
                            bottom: '10%',
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
                                show: false
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

                    landLine.setOption(option);

                }

            } else {

            }
        },
        error: function (e) {
            console.log(e);
        }
    });


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
