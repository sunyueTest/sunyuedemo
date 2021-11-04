var language = getCookie('jxct_lang'), map;
if (language != 'en') {
    language = 'zh_cn';
}

layui.use(['form', 'layedit', 'laydate'], function () {
});
var botanyTypeBarChart = "";
var animalBarOne="";
var animalBarTwo ="";
var groupPieOne = "";
var groupPieTwo = "";
var groupPieThree = "";
var groupPieFour = "";
var landLine = "";
$(function () {
//页面各元素高度自适应设置
    var documentHeight = $(window).height();
    $(".content").height(documentHeight - 60);
    $(".leftFixedBox").height($(".content").height() - $(".leftOne").height()-20);
    $(".leftTwo").height($(".leftFixedBox").height()*0.45);
    $(".leftThree").height($(".leftFixedBox").height()*0.45);
    $(".leftFour").height($(".leftFixedBox").height()*0.25);
    $(".warningItemBox").height($(".leftTwo").height()-$(".leftTwoTitleBox").height()- $(".warningTitle").height());
    $(".linkBox").height($(".leftThree").height()-$(".leftThreeTitleBox").height() -$(".linkTitle").height());
    $(".leftThreeContent").height($(".leftThree").height()-$(".leftThreeTitleBox").height());
    $(".leftFourContent").height($(".leftFour").height() - $(".leftFourTitleBox").height());
    $(".optionBox").height($(".leftFourContent").height() - $(".optionTitle").height());
    $(".centerContent").height($(".content").height());
    $(".centerTop").height($(".centerContent").height()-$(".centerBottom").height() - 25);


    $(".rightContent").height($(".content").height());
    $(".rightTop").height($(".rightContent").height() - $(".rightCenter").height()- $(".rightBottom").height() - 20);
    $(".deviceBox").height($(".rightTop").height() - $(".rightTopTitleBox").height()-$(".deviceTitle").height() - 30);
    $(".dangerMsgMb").height($(".dangerMessageBox").height());
    $(".dangerMsgMb").width($(".dangerMessageBox").width());
    $(window).resize(function () {
        var documentHeight = $(window).height();
        $(".content").height(documentHeight - 60);
        $(".leftFixedBox").height($(".content").height() - $(".leftOne").height()-20);
        $(".leftTwo").height($(".leftFixedBox").height()*0.45);
        $(".leftThree").height($(".leftFixedBox").height()*0.45);
        $(".leftFour").height($(".leftFixedBox").height()*0.25);
        $(".warningItemBox").height($(".leftTwo").height()-$(".leftTwoTitleBox").height()- $(".warningTitle").height());
        $(".linkBox").height($(".leftThree").height()-$(".leftThreeTitleBox").height() -$(".linkTitle").height());
        $(".leftThreeContent").height($(".leftThree").height()-$(".leftThreeTitleBox").height());
        $(".leftFourContent").height($(".leftFour").height() - $(".leftFourTitleBox").height());
        $(".optionBox").height($(".leftFourContent").height() - $(".optionTitle").height());
        $(".centerContent").height($(".content").height());
        $(".centerTop").height($(".centerContent").height()-$(".centerBottom").height() - 25);

        $(".rightContent").height($(".content").height());
        $(".rightTop").height($(".rightContent").height() - $(".rightCenter").height()- $(".rightBottom").height()- 20);
        $(".deviceBox").height($(".rightTop").height() - $(".rightTopTitleBox").height()-$(".deviceTitle").height() - 30);

        $(".dangerMsgMb").height($(".dangerMessageBox").height());
        $(".dangerMsgMb").width($(".dangerMessageBox").width());








        botanyTypeBarChart.resize();
        animalBarOne.resize();
        animalBarTwo.resize();
        groupPieOne.resize();
        groupPieTwo.resize();
        groupPieThree.resize();
        groupPieFour.resize();
        landLine.resize();
    });


//动态添加banner名称
    /*   $.post("../user/selUserDetails", {}, function (res) {
           if (res.state == 'success') {
               $(".bannerImg").html(res.data.info.company);
           }
       });*/


//图标目前均为假数据，得到对应接口后通过ajax请求获得返回的数据信息并改造成图表所需的格式即可(参照initLandLine方法)

    initbotanyTypeBar();
    initAnimalPieOne();
    initAnimalPieTwo();
    initGroupOne();
    initGroupTwo();
    initGroupThree();
    initGroupFour();
    //土地墒情预警
    initLandLine();



    //加载视频（通过ajax获取摄像头设备号，添加到参数内）
    getCamareUrl("C73936419");
    $("#playerNoData").css("height","72%").css("width","92%").css("margin-top","15px");

    //获取地块数据预警信息
    getDangerMsg();
    //获取联动记录
    getRecordMsg();
});



















//植物种类
function initbotanyTypeBar(){
    botanyTypeBarChart = echarts.init(document.getElementById('botanyTypeBar'));


        var data = [1500, 1800, 2000, 2600, 2500];

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
            top:50,
            padding:'0 0 0 0',
            height:'70%',
            containLabel: true,
        },
        legend: {//图例组件，颜色和名字
            right:10,
            top:10,
            data:[{
                name:'数量',
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
                data: ['月季', '草莓', '小白菜', '油麦菜', '西红柿'],
                axisLabel: { //坐标轴刻度标签的相关设置。
                    interval: 0,//设置为 1，表示『隔一个标签显示一个标签』
                    margin:8,
                    textStyle: {
                        color: '#cccccc',
                        fontStyle: 'normal',
                        fontFamily: '微软雅黑',
                        fontSize: 10,
                    }
                },

                axisTick:{//坐标轴刻度相关设置。
                    show: false,
                },
                axisLine:{//坐标轴轴线相关设置
                    lineStyle:{
                        color:'#cccccc',
                        opacity:0.2
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
                axisLine:{
                    lineStyle:{
                        color:'#cccccc',
                        opacity:0.2
                    },
                    show:false
                },
                axisTick:{
                    show: false
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ['#cccccc'],
                        opacity:0.2
                    }
                }

            }
        ],
        series : [
            {
                name:'数量',
                type:'bar',
                data:data,
                barWidth: 10,
                barGap:0,//柱间距离
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
                        },{
                            offset: 0.7, color: '#0dba88'
                        }], false),
                    },
                },
            },

        ]
    };

    botanyTypeBarChart.setOption(option);
}



//动物种类pieOne
function initAnimalPieOne(){
    animalBarOne = echarts.init(document.getElementById('animalBarOne'));

    var datas = [{
        value: 50,
        name: '瓢虫'
    },
        {
            value: 65,
            name: '蝉'
        },
        {
            value: 62,
            name: '蚂蚱'
        },
        {
            value: 77,
            name: '蚯蚓'
        },
        {
            value: 60,
            name: '蝴蝶'
        }
    ];
    option = {

        tooltip: {
            trigger: 'item',
            formatter: "{b} : {d}% <br/> {c}"
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
            formatter: function(name) {
                var total = 0; //各科正确率总和
                var averagePercent; //综合正确率
                datas.forEach(function(value, index, array) {
                    total += value.value;
                });
                return total ;
            },
            data: [datas[0].name],
            left: 'center',
            top: '44%',
            icon: 'none',
            align: 'center',
            padding: [10, 0],
            textStyle: {
                color: "#ffffff",
                fontSize: 22,
                fontWeight:700
            },
        },
        series: [{
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['50%', '50%'],
            color: ['#01b4d2', '#d90051', '#0dba88','#9702fe','#e59a13'],
            data: datas,
            labelLine: {
                normal: {
                    length: 10,
                    length2: 10,
                    lineStyle: {
                        width: 2
                    }
                }
            },
            label: {
                normal: {
                    formatter: function(name) {
                        datas.forEach(function(name,value, index, array) {
                            return name;
                        });
                    },
                    padding: [0, 2],

                }
            }
        }]
    };

    animalBarOne.setOption(option);


}


//动物种类pieTwo
function initAnimalPieTwo(){
    animalBarTwo = echarts.init(document.getElementById('animalBarTwo'));
        var value = [600,996];
    var datas = [{
        value: 600,
        name: '去年'
    },
        {
            value: 960,
            name: '今年'
        }
    ];
    option = {
        tooltip: {
            trigger: 'item',
            formatter: "{b} : {d}% <br/> {c}"
        },
        title: {
            text: (value[1] - value[0])/value[0] *100 +"%",
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
            formatter: "较去年增长比",
            data: [datas[0].name],
            left: 'center',
            top: '44%',
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
            label:{
                normal:{
                    position:"inner",
                    show : false
                }
            }
        }]
    };

    animalBarTwo.setOption(option);


}









//成长周期pieOne
function initGroupOne(){
    groupPieOne = echarts.init(document.getElementById('groupPieOne'));
    var datas = [ {
        value: 80,
        name: '成熟期'
    },{
        value: 20,
        name: '未成熟'
    }
    ];
    option = {
        title: {
            text: '成熟期',
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
            formatter:"西红柿",
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
            color: ['#d90051', '#363636'],
            data: datas,
            label:{
                normal:{
                    position:"inner",
                    show : false
                }
            }
        }]
    };

    groupPieOne.setOption(option);


}

function initGroupTwo(){
    groupPieTwo = echarts.init(document.getElementById('groupPieTwo'));
    var datas = [ {
        value: 20,
        name: '成熟期'
    },{
        value: 80,
        name: '未成熟'
    }
    ];
    option = {
        title: {
            text: '苗期',
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
            formatter:"大头菜",
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
            color: ['#0dba88', '#363636'],
            data: datas,
            label:{
                normal:{
                    position:"inner",
                    show : false
                }
            }
        }]
    };

    groupPieTwo.setOption(option);


}

function initGroupThree(){
    groupPieThree = echarts.init(document.getElementById('groupPieThree'));
    var datas = [ {
        value: 50,
        name: '成熟期'
    },{
        value: 50,
        name: '未成熟'
    }
    ];
    option = {
        title: {
            text: '生长期',
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
            formatter:"月季",
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
            color: ['#e9c105', '#363636'],
            data: datas,
            label:{
                normal:{
                    position:"inner",
                    show : false
                }
            }
        }]
    };

    groupPieThree.setOption(option);


}

function initGroupFour(){
    groupPieFour = echarts.init(document.getElementById('groupPieFour'));
    var datas = [ {
        value: 80,
        name: '成熟期'
    },{
        value: 20,
        name: '未成熟'
    }
    ];
    option = {
        title: {
            text: '成熟期',
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
            formatter:"草莓",
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
            color: ['#d90051', '#363636'],
            data: datas,
            label:{
                normal:{
                    position:"inner",
                    show : false
                }
            }
        }]
    };

    groupPieFour.setOption(option);


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
function getDangerMsg(){
    $.ajax({
        type: "get",
        url: '../trigger/triggerHistoryList',
        data: {
            page:1,
            size:100
        },
        dataType: "json",
        success: function (data) {
            if(data.state=="success"&&data.datas.length>0){
                addDangerMsg(data.datas);
            }
        },
        error: function (e) {
            console.log(e);
        }
    });
}
//加载种植地数据预警信息
function addDangerMsg(list){
    var $warningItemBox = $(".warningItemBox");
    $warningItemBox.empty();
    for(var j = 0;j<list.length;j++){
        var $warningItem = $("<div class='warningItem'></div>");
        var $itemName = $("<span class='itemName'></span>");
        var $itemTime = $("<span class='itemTime'></span>");
        $itemName.text(list[j].deviceNumber +" " + list[j].results);
        $itemTime.text(list[j].alarmTime);
        $itemName.appendTo($warningItem);
        $itemTime.appendTo($warningItem);
        $warningItem.prependTo($warningItemBox);
    }
}
//获取联动记录
function getRecordMsg(){
    $.ajax({
        type: "POST",
        url: '../conditionConfig/getHistoryList',
        data: {
            page:1,
            limit:100
        },
        dataType: "json",
        success: function (data) {
            if(data.success==true &&data.data.length>0) {
                addRecordMsg(data.data);
            }
        },
        error: function (e) {
            console.log(e);
        }
    });
}
//加载联动记录
function addRecordMsg(list){
    var $linkBox = $(".linkBox");
    $linkBox.empty();
    for(var i =0;i<list.length;i++){
        var $linkItem = $("<div class='linkItem'></div>");
        var $pointIcon = $("<img class='pointIcon' src='../../static/img/flowerRoom/point.png' />");
        var $linkMsg = $("<span class='linkMsg'></span>");
        $linkMsg.text(new Date(list[i].time).Format('MM/dd hh:mm') + ' '+ list[i].name + list[i].msg);
        $pointIcon.appendTo($linkItem);
        $linkMsg.appendTo($linkItem);
        $linkItem.appendTo($linkBox);

    }
}

//土地墒情预警（假数据）
function initLandLine(){
    landLine = echarts.init(document.getElementById('landLine'));
    landLine.clear();
    var cArr = [11,20,24,26,28,30,35,38,40,37,35,33,31,30,28,25,22,20,26,28,30,28,26,25,22]
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
            top:"5%",
            height:"80%",
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisLine: {
                lineStyle: {
                    color: '#cccccc',
                    opacity:0.2
                }
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    fontSize: 10
                }
            },
            axisTick:{//坐标轴刻度相关设置。
                show: false,
            },
            data: ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24']
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
                    opacity:0.2
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
                    opacity:0.2
                }
            }
        }],
        series: [ {
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
        }  ]
    };
    landLine.setOption(option);
}

//土地墒情预警（ajax返回数据）
/*function initLandLine(deviceNumber) {
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
                        if (newKeyArr[q] == "土壤温度" || newKeyArr[q] == "土壤湿度" || newKeyArr[q] == "土壤电导率" || newKeyArr[q] == "土壤PH") {
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
                            top: '10%',
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

                    landLine.setOption(option);

                }

            } else {

            }
        },
        error: function (e) {
            console.log(e);
        }
    });


}*/










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
Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
