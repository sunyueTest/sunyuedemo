// is phone
if(/Android|webOS|iPhone|iPod|iBlackBerry/i.test(navigator.userAgent)) {

var deviceSerial = '';
var deviceLine = '';
    $(function(){
        $(".phoneBody").css("display","block");
//��������ͷ
            getCamera("C64319841");
//��ʼ������ͼ
        initLandLine();
        $(".introduceItemTitleAfter").width($(".introduce").width() - $(".introduceItemTitleText").width() - $(".introduceItemTitleTri").width() - 40);
        $(".partTwoThreeContentBox").height($(".partTwoThreeContentBox").width());
        $(".partTwoThreeContentText").css("margin-top", -$(".partTwoThreeContentText").height()/2);

   /*     for(var i=0;i<$(".partTwoItemBorder").length;i++){

                    $(".partTwoItemBorder").eq(i).height($(".partTwoItemContent").eq(i).height());


        }*/

        $(".partTwoItemEspBorder").eq(0).height($(".partTwoThreeContentBox").height() + $(".partTwoThreeContentBox").height()* 0.1 *4);
    });


    //��ʼ������ͼ
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
                axisTick:{//������̶�������á�
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
                name: '�����¶�',
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



//��ȡ����ͷ
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
                    //�Զ����� 2�벥��һ�� ����ѭ��
                    var timer='';
                    timer=setInterval(function(){ //�򿪶�ʱ��
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
                    sevenTimer=setInterval(function(){ //�򿪶�ʱ��
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


    //��ֳȫ�̹��̼��֤�飬�޷����
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
    //��ʼ������ʱ��
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
    //��ʼ��layui��ʱ���
    layui.use('laydate', function() {
        var laydate = layui.laydate;
        laydate.render({
            elem: '#test1',
            max: 0,//������������޵���
            min: time,//��С���������޵���
            value: time,//Ĭ��ֵ������
        });
    });
    $(function(){
        //��ȡ�����豸������ʼ������ͷ
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
        //��ȡʵʱ����
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
        //������Դ����
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
                        "<span class='mFiveRightItemSp'>�� "+data.data[i].imgCount+" ��</span>"+
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
    //��ʼ����Ⱦ������ֵ
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
    //����ͼ��ʼ��
    var myChart = echarts.init(document.getElementById("dateCurve"));
    $.ajax({
        data: "deviceNumber="+$("#deviceNumber").val(),
        url: "/monitor/getSensorForMonth",
        success: function(data){
            //ɸѡ���ع�����ֵ
            var type = new Array();//���صĶ�ά��������
            var typeValue = new Array();//�µ���������
            var dataValue = new Array();//ֵ
            for(var i=0; i<data.data.type.length; i++) {
                type[i] = data.data.type[i].split("-");
            }
            var flag = 0;
            for(var i=0; i<type.length; i++){
                if(type[i][1] != "ע��״̬" && type[i][1] != "����"){
                    typeValue[flag] = type[i][1];
                    dataValue[flag] = data.data[data.data.type[i]];
                    flag++;
                }
            }
            //�϶�Ϊһ
            var series = new Array();
            for(var i=0; i<typeValue.length; i++){
                series[i] = {name:typeValue[i], type:"line", data:dataValue[i], smooth:true, symbolSize:10};
            }
            //���ó�ʼ��ʱĬ����ʾ��һ�������಻��ʾ
            var data = {};
            for(var i=1; i<typeValue.length; i++){
                if(typeValue[i] != undefined){
                    data[typeValue[i]] = false;
                }
            }
            //��ʼ������ͼ
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
        //��ͼ�����ʼ��
        var position = $(".mapTitle").text().split(",");
        var marker = new AMap.Marker({
            position: new AMap.LngLat(Number(position[0]), Number(position[1])),
        });
        var map = new AMap.Map('mapContainer');
        map.add(marker);
    });
    //���ֲ���������ѭ��
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
//��һ��
    function next(sevenList){
        if(sevenNum < sevenList-3){
            sevenNum++;
            $('.mSevenactiveimg').animate({left:sevenNum*-328},"slow");
        }else{
            sevenNum=0;
            $('.mSevenactiveimg').animate({left:sevenNum*-328},"slow");
        }
    }
//��һ��
    function prev(sevenList){
        sevenNum--;
        if(sevenNum < 0){
            sevenNum = sevenList-3;
            $('.mSevenactiveimg').animate({left:sevenNum*-328},"slow");
        }else{
            $('.mSevenactiveimg').animate({left:sevenNum*-328},"slow");
        }

    }
// ��ͼ����
    function initMap(){
        // ��ʼ���ߵµ�ͼ
        var map = new AMap.Map('mapContainer', {
            resizeEnable: true, //�Ƿ��ص�ͼ�����ߴ�仯
            zoom:11, //��ʼ����ͼ�㼶
            center: [122.11634,37.516719] //��ʼ����ͼ���ĵ�
        });
    }


// ����ͼ����
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
                                color: '#FFCAD4' // 0% ������ɫ
                            }, {
                                offset: 0.4,
                                color: '#F58080' // 100% ������ɫ
                            }, {
                                offset: 1,
                                color: '#F58080' // 100% ������ɫ
                            }],
                            globalCoord: false // ȱʡΪ false
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







