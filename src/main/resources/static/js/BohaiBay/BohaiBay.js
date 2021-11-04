// is phone
if(/Android|webOS|iPhone|iPod|iBlackBerry/i.test(navigator.userAgent)) {

var deviceSerial = '';
var deviceLine = '';
    $(function(){
        $(".phoneBody").css("display","block");
//加载摄像头
            getCamera("C64319841");
//初始化折线图
        initLandLine();
        $(".introduceItemTitleAfter").width($(".introduce").width() - $(".introduceItemTitleText").width() - $(".introduceItemTitleTri").width() - 40);
        $(".partTwoThreeContentBox").height($(".partTwoThreeContentBox").width());
        $(".partTwoThreeContentText").css("margin-top", -$(".partTwoThreeContentText").height()/2);

   /*     for(var i=0;i<$(".partTwoItemBorder").length;i++){

                    $(".partTwoItemBorder").eq(i).height($(".partTwoItemContent").eq(i).height());


        }*/

        $(".partTwoItemEspBorder").eq(0).height($(".partTwoThreeContentBox").height() + $(".partTwoThreeContentBox").height()* 0.1 *4);
    });


    //初始化折线图
    function initLandLine(){
        deviceLine = echarts.init(document.getElementById('deviceLine'));
        deviceLine.clear();
        var cArr = [11,20,24,26,28,30,35,38,40,37,35,33,31,30,28,25,22,20,26,28,30,28,26,25];
        option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color:'red'
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
                        color: '#fff',
                        opacity:1
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
                data: ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24']
            }],
            yAxis: [{
                type: 'value',
                splitNumber: 2,
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#fff',
                        opacity:1
                    },
                    show:false

                },
                axisLabel: {
                    margin: 10,
                    textStyle: {
                        fontSize: 10
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: '#fff',
                        opacity:1
                    }
                }
            }],
            series: [ {
                name: '空气温度',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: false,
                lineStyle: {
                    color:'#fff',
                    normal: {
                        width: 3
                    }
                },
                itemStyle: {
                    normal: {
                        color:"red"
                    },
                    emphasis: {
                        color: '#fff',

                        extraCssText: 'box-shadow: 8px 8px 8px rgba(0, 0, 0, 1);',
                        borderWidth: 5
                    }
                },
                data: cArr
            }]
        };
        deviceLine.setOption(option);
    }



//获取摄像头
function getCamera(deviceSerial){
    $.ajax({
        data: {
            deviceSerial:deviceSerial
        },
        url: "/cameraApplication/getLiveAddress",
        success: function(res){
            if (res.state == 'success') {
                var data = res.data;
                var phoneRtmpHd = document.getElementById("phoneRtmpHd");
                phoneRtmpHd.src = data.rtmpHd;
                var player = new EZUIPlayer('phonePlayer');
                $("#phonePlayer").show();
                $("#phonePlayerNoData").hide();
            }else{
                $("#phonePlayerNoData").find(".phoneNomsg").text(res.msg).css("display","block");
            }
        }
    });
}
} else {


    $(".pcBody").css("display","block");
    //is pc
    var num = 0;
    var sevenNum = 0;
    $(function(){


        initMap();
        initLine();
        $('.mOneLeftBottom ul li').click(function(){
            var _this=$(this);
            _this.addClass('active').siblings('li').removeClass('active');
            var int=_this.index();
            $('.activeimg').animate({left:int*-400},"slow");
            num = int ;
        });
        var list=$('.mOneLeftBottom ul li').length;
        $('.activeimg').css({
            width:list*400,
        });
        //
        $.ajax({
            type: "get",
            data: "id="+$("#productId").val(),
            url: "/newTraceSource/enterpriseInfo",
            success: function(data){
                var Type4ImgUrlArray = data.data.imgUrl.split("+");
                if(Type4ImgUrlArray.length-1 > 3){
                    //自动播放 2秒播放一次 无限循环
                    var timer='';
                    timer=setInterval(function(){ //打开定时器
                        num++;
                        if(num > parseFloat(list)-1){
                            num=0;
                            $('.activeimg').animate({left:num*-400},"slow");
                        }else{
                            $('.activeimg').animate({left:num*-400},"slow");
                        }
                        $('.mOneLeftBottom ul li').eq(num).addClass('active').siblings('li').removeClass('active')
                    },3000);
                    var sevenList = Type4ImgUrlArray.length-1;
                    $('.mSevenactiveimg').css({
                        width:sevenList*328,
                    });
                    var sevenTimer='';
                    sevenTimer=setInterval(function(){ //打开定时器
                        sevenNum++;
                        if(sevenNum >= sevenList-2){
                            sevenNum=0;
                            $('.mSevenactiveimg').animate({left:sevenNum*-328},"slow");
                        }else{
                            $('.mSevenactiveimg').animate({left:sevenNum*-328},"slow");
                        }

                    },3000);
                    $('.right').click(function(){
                        next(sevenList)
                    })

                    $('.left').click(function(){
                        prev(sevenList)
                    });
                }else{
                    $(".left").remove();
                    $(".right").remove();
                }
            }
        });
    });


    //养殖全程过程监测证书，无缝滚动
    $.ajax({
        data: "id="+$("#productId").val(),
        url: "/newTraceSource/Certificate",
        success: function(data){
            var imgAllUrl = data.data.imgUrl.split("+");
            if(imgAllUrl.length-1 > 3){
                marqueeStart(1, "left");
            }
        }
    });
    //初始化数据时间
    var year = new Date().getFullYear();
    var month = (new Date().getMonth()+1);
    var day = new Date().getDate();
    var hours = new Date().getHours();
    if(month < 10){
        month = "0"+(new Date().getMonth()+1);
    }
    if(day < 10){
        day = "0"+new Date().getDate();
    }
    var time = year+"-"+month+"-"+day;
    //初始化layui的时间框
    layui.use('laydate', function() {
        var laydate = layui.laydate;
        laydate.render({
            elem: '#test1',
            max: 0,//最大天数，仅限当天
            min: time,//最小天数，仅限当天
            value: time,//默认值，当天
        });
    });
    $(function(){
        //获取鱼塘设备，并初始化摄像头
        $.ajax({
            data: "deviceSerial=[[${data.cameraNumber}]]",
            url: "/cameraManage/getLiveAddress",
            success: function(res){
                if (res.state == 'success') {
                    var data = res.data;
                    var rtmpHd = document.getElementById("rtmpHd");
                    rtmpHd.src = data.rtmpHd;
                    var player = new EZUIPlayer('player');
                    $("#player").show();
                    $("#playerNoData").hide();
                }else{
                    $("#playerNoData").find(".nomsg").text(res.msg).css("display","block");
                }
            }
        });
        //获取实时数据
        $.ajax({
            data: "ncode="+$("#deviceNumber").val(),
            url: "/newTraceSource/getMessageToDeviceId",
            success: function(data){
                var type = data.data.type.split(" / ");
                var dataValue = data.data.data.split(" | ");
                for(var i=0; i<type.length; i++){
                    $(".mThreeLeftItemBox").append("<p class='threeItemLeftItemWp'><span class='threeItemLeftItem'>"+type[i]+": "+dataValue[i]+"</span></p>");
                }
            }
        });
        //加载溯源流程
        $.ajax({
            data: "id="+$("#productId").val(),
            url: "/newTraceSource/getListToNewAquacultureTraceSourceSendAndType0",
            success: function(data){
                for(var i=0; i<data.data.length; i++){
                    $(".mFiveItemBox").append(
                        "<div class='mFiveBottomItem'>"+
                        "<p class='spotlight-group'>" +
                        "<p class='mFiveItemTips'>"+data.data[i].present+"</p>"+
                        "<div class='apendValue"+i+"' style='width:280px; height:180px; overflow:hidden'></div>"+
                        "<div class='mFiveRightItem'>"+
                        "<img src='/static/img/BohaiBay/smicon.png'/>"+
                        "<span class='mFiveRightItemSp'>共 "+data.data[i].imgCount+" 张</span>"+
                        "</div></p></div>"
                    );
                }
                for(var i=0; i<data.data.length; i++){
                    var imgUrl = data.data[i].imgUrl.split("+");
                    for(var j=0; j<(imgUrl.length-1); j++){
                        $(".apendValue"+i+"").append(
                            "<a class='spotlight' href='"+imgUrl[j]+"' data-description='"+data.data[i].imgInfo+"'>"+
                            "<img class='mFiveImg' src='"+imgUrl[j]+"' alt='"+data.data[i].present+"' />"+
                            "</a>"
                        );
                    }
                }
            }
        });
    });
    //初始化污染都数据值
    $("#value").text(Math.ceil(Math.random()*5+95));
    var marginLeft = $(document).width()*0.035 +($(document).width() * 0.83 * $("#value").text() / 100);
    if($("#value").text() == 100){
        var marginLeft = $(document).width()*0.025 +($(document).width() * 0.832 * $("#value").text() / 100);
    }
    $(".pointBox").attr("style", "left:"+marginLeft+"px");
    if($("#value").text() >=0 && $("#value").text() <= 10){
        $("#value").attr("style", "color:#F70909");
    }else if($("#value").text() >=11 && $("#value").text() <= 20){
        $("#value").attr("style", "color:#fb9a29");
    }else if($("#value").text() >=21 && $("#value").text() <= 30){
        $("#value").attr("style", "color:#d3cb3c");
    }else if($("#value").text() >=31 && $("#value").text() <= 40){
        $("#value").attr("style", "color:#80c642");
    }else{
        $("#value").attr("style", "color:#51c349");
    }
    //曲线图初始化
    var myChart = echarts.init(document.getElementById("dateCurve"));
    $.ajax({
        data: "deviceNumber="+$("#deviceNumber").val(),
        url: "/monitor/getSensorForMonth",
        success: function(data){
            //筛选、重构返回值
            var type = new Array();//返回的二维名称数组
            var typeValue = new Array();//新的名称数组
            var dataValue = new Array();//值
            for(var i=0; i<data.data.type.length; i++) {
                type[i] = data.data.type[i].split("-");
            }
            var flag = 0;
            for(var i=0; i<type.length; i++){
                if(type[i][1] != "注册状态" && type[i][1] != "风向"){
                    typeValue[flag] = type[i][1];
                    dataValue[flag] = data.data[data.data.type[i]];
                    flag++;
                }
            }
            //合二为一
            var series = new Array();
            for(var i=0; i<typeValue.length; i++){
                series[i] = {name:typeValue[i], type:"line", data:dataValue[i], smooth:true, symbolSize:10};
            }
            //设置初始化时默认显示第一个，其余不显示
            var data = {};
            for(var i=1; i<typeValue.length; i++){
                if(typeValue[i] != undefined){
                    data[typeValue[i]] = false;
                }
            }
            //初始化曲线图
            option = {
                legend: {
                    selected: data,
                    data: typeValue
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: {show: true},
                        dataView: {show: false, readOnly: true},
                        magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                        restore: {show: false},
                        saveAsImage: {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30']
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : series
            };
            myChart.setOption(option);
        }
    });
    $(function(){
        //地图坐标初始化
        var position = $(".mapTitle").text().split(",");
        var marker = new AMap.Marker({
            position: new AMap.LngLat(Number(position[0]), Number(position[1])),
        });
        var map = new AMap.Map('mapContainer');
        map.add(marker);
    });
    //对轮播滚动进行循环
    $.ajax({
        data: "id="+$("#productId").val(),
        url: "/newTraceSource/getListToNewAquacultureTraceSourceSendAndType1",
        success: function(data){
            var imgUrl = data.data[0].imgUrl.split("+");
            if(imgUrl.length-1 > 5){
                var flag = 5;
                if(flag < imgUrl.length-1){
                    imgLeft(flag, imgUrl, 80);
                }
            }
        }
    });
    function imgLeft(flag, imgUrl, margin_left){
        setTimeout(function(){
            $("#imgViewForLeft").attr("style", "margin-left:-"+margin_left+"px; width: 670px; height: 60px")
            flag++;
            if(flag<imgUrl.length-1){
                margin_left = margin_left + 80;
                imgLeft(flag, imgUrl, margin_left);
            }
            if(flag == imgUrl.length-1){
                setTimeout(function(){
                    $("#imgViewForLeft").attr("style", "width: 670px; height: 60px");
                    imgLeft(5, imgUrl, 80);
                }, 5500);
            }
            return;
        }, 6000);
    }
    function marqueeStart(i, direction){
        var obj = document.getElementById("marquee" + i);
        var obj1 = document.getElementById("marquee" + i + "_1");
        var obj2 = document.getElementById("marquee" + i + "_2");
        obj2.innerHTML = obj1.innerHTML;
        var marqueeVar = window.setInterval("marquee("+ i +", '"+ direction +"')", 20);
        obj.onmouseover = function(){
            window.clearInterval(marqueeVar);
        }
        obj.onmouseout = function(){
            marqueeVar = window.setInterval("marquee("+ i +", '"+ direction +"')", 20);
        }
    }
    function marquee(i, direction){
        var obj = document.getElementById("marquee" + i);
        var obj1 = document.getElementById("marquee" + i + "_1");
        var obj2 = document.getElementById("marquee" + i + "_2");
        if (direction == "up"){
            if (obj2.offsetTop - obj.scrollTop <= 0){
                obj.scrollTop -= (obj1.offsetHeight + 20);
            }else{
                var tmp = obj.scrollTop;
                obj.scrollTop++;
                if (obj.scrollTop == tmp){
                    obj.scrollTop = 1;
                }
            }
        }else{
            if (obj2.offsetWidth - obj.scrollLeft <= 0){
                obj.scrollLeft -= obj1.offsetWidth;
            }else{
                obj.scrollLeft++;
            }
        }
    }
    var index=0;
//下一张
    function next(sevenList){
        if(sevenNum < sevenList-3){
            sevenNum++;
            $('.mSevenactiveimg').animate({left:sevenNum*-328},"slow");
        }else{
            sevenNum=0;
            $('.mSevenactiveimg').animate({left:sevenNum*-328},"slow");
        }
    }
//上一张
    function prev(sevenList){
        sevenNum--;
        if(sevenNum < 0){
            sevenNum = sevenList-3;
            $('.mSevenactiveimg').animate({left:sevenNum*-328},"slow");
        }else{
            $('.mSevenactiveimg').animate({left:sevenNum*-328},"slow");
        }

    }
// 地图加载
    function initMap(){
        // 初始化高德地图
        var map = new AMap.Map('mapContainer', {
            resizeEnable: true, //是否监控地图容器尺寸变化
            zoom:11, //初始化地图层级
            center: [122.11634,37.516719] //初始化地图中心点
        });
    }


// 折线图加载
    function initLine(){
        var myChart = echarts.init(document.getElementById('dateCurve'));
        option = {
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                top: 'middle',
                left: '3%',
                right: '4%',
                bottom: '3%',
                height: '80%',
                containLabel: true
            },
            xAxis: {},
            yAxis: {},
            series: [{
                name: '',
                type: 'line',
                data: [],
                lineStyle: {
                    normal: {
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
                    }
                },
                itemStyle: {
                    normal: {}
                },
                smooth: true
            }]
        };
        myChart.setOption(option);
    }

}







