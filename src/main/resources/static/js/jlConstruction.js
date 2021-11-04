var map;
var allPlace;
var devicePie;
var flagDevice;
var flagUpdata;
var readyNum ;
var readyQNum ;
var dangerArr = [];
var warningArr = [];
var allBadArr =[];
var lxDeviceArr = [];
var isOnTrial = true;
//所有采集设备
var allCollectDevice = [];
layui.use(['form', 'layedit', 'laydate'], function(){
    var form = layui.form
        ,layer = layui.layer
        ,layedit = layui.layedit
        ,laydate = layui.laydate;

    //日期
    laydate.render({
        elem: '#startTime',
        max: getNowFormatDate(),
        done: function(value, date){ //监听日期被切换
            getAllDangerDevice();
            initDevicePie();
            for(var i=0;i<$(".constructionItemText").length;i++){
                if($(".constructionItemText").eq(i).text()==$(".constructionCheckedText").eq(0).text()){
                    $(".constructionItemText").eq(i).parent(".constructionItem").trigger("click");
                    $(".constructionItemBox").css("display","none");
                }
            }
        }
    });

    laydate.render({
        elem: '#endTime',
        max: getNowFormatDate(),
        done: function(value, date){ //监听日期被切换
            getAllDangerDevice();
            initDevicePie();
            for(var i=0;i<$(".constructionItemText").length;i++){
                if($(".constructionItemText").eq(i).text()==$(".constructionCheckedText").eq(0).text()){
                    $(".constructionItemText").eq(i).parent(".constructionItem").trigger("click");
                    $(".constructionItemBox").css("display","none");
                }
            }
        }
    });


});
$(function(){
    //根据isOnTrial判断是否为试用版
    if(isOnTrial){
        $(".onTrialImg").css("display","block");
    }else{
        $(".onTrialImg").css("display","none");
    }






    var wHeight = $(window).height();
    $(".contentBox").height(wHeight);
    $("#mapContainer").height(wHeight);
    $("#mapContainer").height(wHeight);

    $(window).resize(function(){
        var wHeight = $(window).height();
        $(".contentBox").height(wHeight);
        $("#mapContainer").height(wHeight);

        if(devicePie){
            devicePie.resize();
        }

    });
//右侧添加面板切换开关
    $(".hiddenBtn").click(function(){
        if($(".rightTopWeather").css("width")=="0px"){
            $(this).attr("src","../../static/img/hiddenBtn.png");
            $(".rightTopWeather").css("width","19vw").css("transition","width 0.5s");

            setTimeout(function(){
                $(".rightTopWeatherTitle").css("display","block");
                $(".rightTopWeatherItem").css("display","block");
            },500)

        }else{
            $(".rightTopWeather").css("width","0").css("transition","width 0.5s");
  /*          $(this).css("left","-1.3vw").css("transition","left 0.5s");*/

            $(this).attr("src","../../static/img/showBtn.png");
            $(".rightTopWeatherTitle").css("display","none");
            $(".rightTopWeatherItem").css("display","none");
        }
    });


    //默认查询时间为一个月前-今天
    var start = new Date(new Date().getTime()- (1 *24 *60 * 60 *1000));
    var end = new Date();
    /*var startTime = start.format("yyyy-MM-dd");
        var endTime = end.format("yyyy-MM-dd");*/


    if(( String(start.getMonth()+1)).length >1){
        var startTime = start.getFullYear()+"-" + (start.getMonth()+1) + "-" +start.getDate();
    }else{
        var startTime = start.getFullYear()+"-" + "0" +(start.getMonth()+1) + "-" +start.getDate();
    }
    if(String((end.getMonth()+1)).length>1){
        var endTime = end.getFullYear()+"-" + (end.getMonth()+1) + "-" +end.getDate();
    }else{
        var endTime = end.getFullYear()+"-" + "0" +(end.getMonth()+1) + "-" +end.getDate();
    }
    $("#startTime").val(startTime);
    $("#endTime").val(endTime);
    //返回后台按钮
    $(".settingBox").click(function(){
        window.location.href="/index?from=admin";
    });
    //地区信息面板
    $(document).click(function(){
        $(".placeBox").css("display","none");
    });


    //添加报警信息
    initSocket(function (data) {
        getDangerMsg(data)
    });
//动态添加banner名称
    $.post("../user/selUserDetails", {}, function (res) {
        if (res.state == 'success') {
            $(".logoText").html(res.data.info.company);
        }

        if (res.data.info.logo == '' || res.data.info.logo == null) {
            $('.logoImg').attr("src", "img/jxct_logo.png").css("border","1px solid #fff");
        } else {
            $('.logoImg').attr("src", res.data.info.logo);
        }

    });
//获取全部地区
    getAllPlace();
//初始化地图
/*    initMap();*/
    mapInit();
    //获取所有继电器设备
    /*    getAllDevice();*/
    //报警信息筛选
    $(".dangerPointBox").click(function(){
        if($(".dangerItemBox").css("display")=="none"){
            $(".dangerItemBox").css("display","block");
        }else{
            $(".dangerItemBox").css("display","none");
        }
    });
    //测试数值筛选（pm2.5 pm10...）
    $(".monitorBox").click(function(){
        if($(".monitorItemBox").css("display")=="none"){
            $(".monitorItemBox").css("display","block");
        }else{
            $(".monitorItemBox").css("display","none");
        }
    });
    //地区点击下拉框
    $(".constructionBox").click(function(){
        if($(".constructionItemBox").css("display")=="none"){
            $(".constructionItemBox").css("display","block");
        }else{
            $(".constructionItemBox").css("display","none");
        }
    });
    //选择pm2.5 pm10...
    $(".monitorItem").click(function(){
        var $this = $(this);
        $(".monitorCheckedText").text($this.text());
        getMarker();
    });
//选择报警筛选项
    $(".dangerItem").click(function(){
        var $this = $(this);
        $(".dangerCheckedText").text($(this).text());
        getMarker();

    });
    //左侧隐藏功能
    $(".rightHiddenBtn").click(function(){
        var $this = $(this);

        if($this.parent(".leftBox").css("width")=="0px"){
            $this.parent(".leftBox").css("width","22vw").css("transition","width 0.5s");
            $this.css("right","22VW").css("transition","right 0.5s");
            setTimeout(function(){
                if($this.parents(".leftBox").find(".deviceItem").length>0){
                    $this.parents(".leftBox").find(".boxTitle").css("display","block");
                    if($this.parents(".leftBox").find(".deviceItem").children().length>0){
                        $(".deviceBox").css("display","block");
                        $this.parents(".leftBox").find(".deviceTitle").css("display","block");
                    }else if($(".constructionCheckedText").text()=="全部地区"){
                        $this.parents(".leftBox").find(".noPlaceMsg").css("display","block");

                    }else{
                        $(".noDeviceMsg").css("display","block");
                    }
                }
                if($this.parents(".leftBox").find(".templateBox").length>0){
                    $this.parents(".leftBox").find(".boxTitle").css("display","block");
                    if($this.parents(".leftBox").find(".templateValue").text()!=""){
                        $(".templateBox").css("display","block");
                    }/*else if($(".constructionCheckedText").text()=="全部地区"){
                        $this.parents(".leftBox").find(".noPlaceMsg").css("display","block");
                    }*/else{
                        $(".noUpdateMsg").css("display","block");
                    }
                }
                if($this.parents(".leftBox").find("#regionalStatePie").length>0){
                    $this.parents(".leftBox").find(".boxTitle").css("display","block");
                    $this.parents(".leftBox").find("#regionalStatePie").css("display","block")

                }




            },400);
            $this.attr("src","../../static/img/rightHiddenBtn.png");
        }else{

            $this.parent(".leftBox").css("width","0").css("transition","width 0.5s");
            $this.css("right","0").css("transition","right 0.5s");


            if($this.parents(".leftBox").find(".deviceItem").length>0){
                $this.parents(".leftBox").find(".boxTitle").css("display","none");
                $this.parents(".leftBox").find(".deviceBox").css("display","none");
                $this.parents(".leftBox").find(".noDeviceMsg").css("display","none");
                $this.parents(".leftBox").find(".noPlaceMsg").css("display","none");
            }
            if($this.parents(".leftBox").find(".templateBox").length>0){
                /*               $this.parent(".leftBox").children("div").css("display","none");*/
                $this.parents(".leftBox").find(".boxTitle").css("display","none");
                $this.parents(".leftBox").find(".templateBox").css("display","none");
                $this.parents(".leftBox").find(".noUpdateMsg").css("display","none");
                $this.parents(".leftBox").find(".noPlaceMsg").css("display","none");
            }

            if($this.parents(".leftBox").find("#regionalStatePie").length>0){
                $this.parents(".leftBox").find(".boxTitle").css("display","none");
                $this.parents(".leftBox").find("#regionalStatePie").css("display","none")

            }




//初始化加载左侧设备在线率饼图
            $this.attr("src","../../static/img/rightshowBtn.png");
        }



    });




    initDevicePie();


});


//初始化地图（高德）
function mapInit(){
    map = new AMap.Map('mapContainer', {
        resizeEnable: true,
        rotateEnable:true,
        pitchEnable:true,
        zoom: 15,
 /*       pitch:30,*/
/*        rotation:-15,*/
        mapStyle: "amap://styles/blue",
        viewMode:'2D',//开启3D视图,默认为关闭
        buildingAnimation:true,//楼块出现是否带动画

        expandZoomRange:true,
        zooms:[3,20],
        center:[116.333926,39.997245]
    });

/*         map.addControl(new AMap.ControlBar({
             showZoomBar:false,
             showControlButton:true,
             position:{
                 right:'10px',
                 top:'100px'
             }
         }))*/
}







// 地图加载
/*function initMap(){
    map = new BMap.Map('mapContainer',{enableMapClick:false});
    map.centerAndZoom(new BMap.Point(122.0854, 43.5217), 13);
    map.enableScrollWheelZoom(true);

    /!*   map.setMapStyleV2({styleJson:styleJson});*!/


}*/

/**
 * 实例化点标记
 */
function addMarker(lon,lat,place,dl){
    if(dl==0){
        var src = '/static/img/jialing/default.png'
    }else if(dl==1){
        var src = '/static/img/jialing/danger.png'
    }
    else if(dl==2){
        var src = '/static/img/jialing/warnning.png'
    }
    else if(dl==4){
        var src = '/static/img/jialing/outLine.png'
    }
    // 创建一个 Icon
    var startIcon = new AMap.Icon({
        // 图标尺寸
        size: new AMap.Size(30, 30),
        // 图标的取图地址
        image: src,
        // 图标所用图片大小
        imageSize: new AMap.Size(30, 30),
        // 图标取图偏移量
        imageOffset: new AMap.Pixel(0, 0)
    });

    // 将 icon 传入 marker
    var marker = new AMap.Marker({
        position: new AMap.LngLat(lon,lat),
        icon: startIcon,
        offset: new AMap.Pixel(-13, -30)
    });
    // 将 markers 添加到地图
    map.add(marker);


    addClickHandler(marker,place);



    //如果指定如pm2.5,则所有标点上方显示pm2.5数值
    if($.trim($(".monitorCheckedText").text())!='全部指标'){
        $.ajax({
            type: "GET",
            url: "../newFarmInfo/getFarmDeviceList",
            dataType: "json",
            async:true,
            data: {
                page: 1,
                size: 10,
                farmId: place.id,
            },
            success: function (data) {
                if(data.state=="success"){
                    if(data&&data.datas.length>0){
                        for(var i=0;i<data.datas.length;i++){
                            if(data.datas[i].deviceNumber==place.deviceNumber){
                                    var usedDeviceMsg = data.datas[i];
                                if(usedDeviceMsg.type) {
                                    if (usedDeviceMsg.type.length > 0) {
                                        var itemName = usedDeviceMsg.type;
                                        var itemNameArr = itemName.split("/");
                                        var itemValue = usedDeviceMsg.data;
                                        if (itemValue && itemValue.length > 0) {
                                            var itemValueArr = itemValue.split("|");

                                            var newItemNameArr = [];
                                            for(var i=0;i<itemNameArr.length;i++){
                                                newItemNameArr.push($.trim(itemNameArr[i]));
                                            }
                                            if(newItemNameArr.indexOf($.trim($(".monitorCheckedText").text()))!=-1){
                                                var needItemName = $.trim($(".monitorCheckedText").text());
                                                var needItemValue = itemValueArr[newItemNameArr.indexOf($.trim($(".monitorCheckedText").text()))];




                                                marker.setLabel({
                                                    offset: new AMap.Pixel(0, 3),  //设置文本标注偏移量
                                                    content: "<div class='info'>" +usedDeviceMsg.name+" "+needItemName +":"+ $.trim(needItemValue) +"</div>", //设置文本标注内容
                                                    direction: 'bottom' //设置文本标注方位
                                                });





/*

                                                var infoWindow =   "infoWindow"+ place.deviceNumber;
                                                var infoWindow  = new AMap.InfoWindow({
                                                    anchor: 'top-center',
                                                    content: needItemName + ":" + $.trim(needItemValue),
                                                });
                                                infoWindow.open(map,[lon,lat]);*/





                                            }
                                        }


                                    }
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
    }else{
        $.ajax({
            type: "GET",
            url: "../newFarmInfo/getFarmDeviceList",
            dataType: "json",
            async:true,
            data: {
                page: 1,
                size: 10,
                farmId: place.id,
            },
            success: function (data) {
                if(data.state=="success") {
                    if (data && data.datas.length > 0) {
                        for (var i = 0; i < data.datas.length; i++) {
                            if (data.datas[i].deviceNumber == place.deviceNumber) {
                                var usedDeviceMsg = data.datas[i];

                                marker.setLabel({
                                    offset: new AMap.Pixel(0, 3),  //设置文本标注偏移量
                                    content: "<div class='info'>" + usedDeviceMsg.name, //设置文本标注内容
                                    direction: 'bottom' //设置文本标注方位
                                });

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


}









//点击marker
function addClickHandler(marker,place){



    marker.on('click', function(e){
        if(e.pixel.y-$(window).height()*0.4>0){
                        if(e.pixel.x - $(window).width()*0.22>0){
                            $(".placeBox").css("top",e.pixel.y-$(window).height()*0.4 +"px");
                            $(".placeBox").css("left",e.pixel.x - $(window).width()*0.22 +"px");
                        }else{
                            $(".placeBox").css("top",e.pixel.y-$(window).height()*0.4 +"px");
                            $(".placeBox").css("left",e.pixel.x +"px");
                        }


        }else{
            if(e.pixel.x - $(window).width()*0.22>0){
                $(".placeBox").css("top",e.pixel.y +"px");
                $(".placeBox").css("left",e.pixel.x - $(window).width()*0.22 +"px");
            }else{
                $(".placeBox").css("top",e.pixel.y +"px");
                $(".placeBox").css("left",e.pixel.x +"px");
            }


        }



        var $placeDeviceItemBox = $(".placeDeviceItemBox");
        $placeDeviceItemBox.empty();
        if(place.farmName){
            $(".placeTitle").text(place.farmName);
            $(".updatePlaceText").text(place.farmName)
        }
        if(place.farmAddress){
            $(".address").text("地址："+place.farmAddress);
        }else{
            $(".address").text("地址：");
        }
        if(place.createUser){
            $(".user").text("负责人："+place.createUser);
        }else{
            $(".user").text("负责人：");
        }
        if(place.tel){
            $(".phone").text("联系电话："+place.tel);
        }else{
            $(".phone").text("联系电话：");
        }

        /*      if(place.imgUrl){
                  $(".placeRightImg").attr("src",place.imgUrl);
              }*/
        getDeviceMsg(place.id,place.deviceNumber);
        $.ajax({
            type: "GET",
            url: "../newFarmInfo/getFarmDeviceList",
            dataType: "json",
            data: {
                page: 1,
                size: 10,
                farmId: place.id,
            },
            success: function (data) {
                $(".placeBox").css("display","block");
                if(data.state=="success"){
                    if(data&&data.datas.length>0){
                        for(var i=0;i<data.datas.length;i++){
                            if(data.datas[i].deviceNumber==place.deviceNumber){
                                setenvironmental(data.datas[i]);
                                break;
                            }

                        }

                    }
                }


            },
            error: function (e) {
                console.log(e);
            }
        });
    });














}





//模拟点击第一个点
/*function triggerClickPoint(place){


    var $placeDeviceItemBox = $(".placeDeviceItemBox");
    $placeDeviceItemBox.empty();
    if(place.farmName){
        $(".placeTitle").text(place.farmName);
        $(".updatePlaceText").text(place.farmName)
    }
    if(place.farmAddress){
        $(".address").text("地址："+place.farmAddress);
    }else{
        $(".address").text("地址：");
    }
    if(place.createUser){
        $(".user").text("负责人："+place.createUser);
    }else{
        $(".user").text("负责人：");
    }
    if(place.tel){
        $(".phone").text("联系电话："+place.tel);
    }else{
        $(".phone").text("联系电话：");
    }

    /!*      if(place.imgUrl){
              $(".placeRightImg").attr("src",place.imgUrl);
          }*!/
    getDeviceMsg(place.id,place.deviceNumber);
    $.ajax({
        type: "GET",
        url: "../newFarmInfo/getFarmDeviceList",
        dataType: "json",
        data: {
            page: 1,
            size: 10,
            farmId: place.id,
        },
        success: function (data) {
            $(".placeBox").css("display","block");
            if(data.state=="success"){
                if(data&&data.datas.length>0){
                    for(var i=0;i<data.datas.length;i++){
                        if(data.datas[i].deviceNumber==place.deviceNumber){
                            setenvironmental(data.datas[i]);
                            break;
                        }

                    }

                }
            }


        },
        error: function (e) {
            console.log(e);
        }
    });
}*/



//初始化设备状态
function initDevicePie() {
    devicePie = echarts.init(document.getElementById('regionalStatePie'));
    devicePie.clear();
    $(".noMsg").css("display","none");
    console.log($("#startTime").val());
    $.ajax({
        type: "POST",
        url: "raise/allAlarmDevice",
        data: {
            "page": 1,
            "size": 10,
            from:$("#startTime").val()+" " +"00:00:00",
            to:$("#endTime").val() +" " +"23:59:59",
        },
        async: false,
        dataType: "json",
        success: function (res) {

            if(res.data&&res.data!=""){
                var resData = res.data;
                console.log(res.data);
                animalNum = 0;
                var m2R2Data= [
                    {value:resData.normalCount, legendname:'正常',name:"正常"+" "+resData.normalCount,itemStyle:{color:"#04fa83"}},
                    {value:resData.countOver, legendname:'超标报警',name:"超标报警"+ " "+resData.countOver,itemStyle:{color:"#ffe125"}},
                    {value:resData.countSeriousness, legendname:'严重污染',name:"严重污染"+ " "+resData.countSeriousness,itemStyle:{color:"#ff7596"}},
                    {value:resData.offline, legendname:'离线',name:"离线"+" "+ resData.offline,itemStyle:{color:"#a0a0a0"}},
                    /*{value:1, legendname:'种类05',name:"种类05",itemStyle:{color:"#f2719a"}},*/

                ];
                option = {
                    title: [
                        /*       {
                                   text: '',
                                   textStyle: {
                                       fontSize: 16,
                                       color: "black"
                                   },
                                   left: "2%",
                                   top:"5%"

                               },*/
                        {
                            text: '报警率',
                            subtext:(resData.alarmRate*100).toFixed(0)+" %",
                            textStyle:{
                                fontSize:12,
                                color:"#fff"
                            },
                            subtextStyle: {
                                fontSize: 12,
                                color: '#ff7596'
                            },
                            itemGap:10,
                            textAlign:"center",
                            x: '33.5%',
                            y: '38%',
                        },
                        {
                            text: '总监测区域：'+resData.triggerCount,
                            /*      subtext: "20%",*/
                            textStyle:{
                                fontSize:15,
                                color:"#fff"
                            },
                            subtextStyle: {
                                fontSize: 12,
                                color: '#04fa83'
                            },
                            textAlign:"center",
                            x: '70%',
                            y: '0',
                        }],
                    tooltip: {
                        trigger: 'item',
                        formatter:function (parms){
                            var str=  parms.seriesName+"</br>"+
                                parms.marker+""+parms.data.legendname+"</br>"+
                                "数量："+ parms.data.value+"</br>"+
                                "占比："+ parms.percent+"%";
                            return  str ;
                        }
                    },
                    legend: {
                        icon:"circle",
                        type:"scroll",
                        orient: 'vertical',
                        left:'60%',
                        align:'left',
                        top:'middle',
                        textStyle: {
                            color:'#fff'
                        },
                        height:250
                    },
                    series: [
                        {
                            name:'标题',
                            type:'pie',
                            center: ['35%', '50%'],
                            radius: ['50%', '75%'],
                            clockwise: false, //饼图的扇区是否是顺时针排布
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'outter',
                                    formatter:function (parms){
                                        return parms.data.legendname
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    length:5,
                                    length2:3,
                                    smooth:true,
                                }
                            },
                            data:m2R2Data
                        }
                    ]
                };
                devicePie.setOption(option);
            }else{
                $(".noMsg").css("display","block");
            }



        },
        error: function (e) {
            console.log(e);
        }
    });

}


//加载设备开关
function addEquipment(equipmentList) {
    $(".deviceBox").css("display","block");
    if($(".leftTwoBox").css("width")=="0px"){
        $(".deviceBox").css("display","none");
    }else{
        $(".deviceBox").css("display","block");
    }
    var $deviceItem = $(".deviceItem");
    $deviceItem.empty();
    for (var j = 0; j < equipmentList.length; j++) {
        var $rightBottomItem = $("<div class='rightBottomItem' style='height:3.5vh'></div>");
        var $deviceName = $("<span class='deviceName'></span>");
        $deviceName.text(equipmentList[j].sensorName);
        var $deviceType = $("<span class='deviceType'></span>");
        if(equipmentList[j].state == 0){
            $deviceType.text("关闭").css("color","#ffffff");
        }else{
            $deviceType.text("开启").css("color","#04fa83");
        }


        var $Box_points_switch = $("<div class='Box_points_switch' data-control='BOX' style='width:6vw;'></div>");
        $Box_points_switch.attr("id", "Box_points_switch" + (j + 1));
        var $label = $("<label></label>");
        var $switch = $("<input class='mui-switch mui-switch-anim switch' type='checkbox' />");
        if (equipmentList[j].state == '0') {
            $switch.attr("checked", false);
        } else {
            $switch.attr("checked", true);
        }

        /*      $switch.attr("id","switch" + (j+1));*/
        $switch.attr("data-sensorCode", equipmentList[j].sensorCode);
        $switch.attr("data-sensorNcode", equipmentList[j].sensorNcode);

        /*       var $settingBtn = $("<div class='settingBtn'>设置</div>");*/

        $switch.appendTo($label);
        $label.appendTo($Box_points_switch);

        $deviceName.appendTo($rightBottomItem);
        $deviceType.appendTo($rightBottomItem);
        $Box_points_switch.appendTo($rightBottomItem);
        /*       $settingBtn.appendTo($rightBottomItem);*/
        $rightBottomItem.appendTo($deviceItem);


    }
    $(".switch").click(function (e) {


        var $that = $(this);

        var indexNum = $(".switch").index(this) + 1;
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
                    if ($(".deviceType").eq(indexNum - 1).text() == "开起") {
                        $(".deviceType").eq(indexNum - 1).text("关闭");
                    } else {
                        $(".deviceType").eq(indexNum - 1).text("开起");
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

}








function getDangerMsg(msg){
    var $rightBox = $(".rightBox");
    var $rightItem = $("<div class='rightItem'></div>");
    var $rightBoxTitle = $("<div class='rightBoxTitle'></div>");
    var $titleImg = $("<span class='titleImg'></span>");
    var $titleText = $("<span class='titleText'></span>");
    $titleImg.appendTo($rightBoxTitle);
    $titleText.appendTo($rightBoxTitle);
    $rightBoxTitle.appendTo($rightItem);

    var $closeBtn =$("<i class='closeBtn'></i>");
    var $rightItemBottom = $("<div class='rightItemBottom'></div>");
    var $jlDangerIcon = $("<img class='jlDangerIcon' src='' />");
    var $rightItemBottomRight = $("<div class='rightItemBottomRight'></div>");
    var $dangerTime = $("<p class='dangerTime'></p>");
    var $dangerMsg = $("<p class='dangerMsg'></p>");
    $dangerTime.appendTo($rightItemBottomRight);
    $dangerMsg.appendTo($rightItemBottomRight);
    $jlDangerIcon.appendTo($rightItemBottom);
    $rightItemBottomRight.appendTo($rightItemBottom);
    $rightBoxTitle.appendTo($rightItem);
    $closeBtn.appendTo($rightItem);
    $rightItemBottom.appendTo($rightItem);
    $rightItem.prependTo($rightBox);
    $closeBtn.text("ဆ");

    var title = msg.name;
    if(title.indexOf("严重")!=-1){
        $titleImg.addClass("dangerBorder");
        $titleText.text("严重污染");
        $jlDangerIcon.attr("src","../../static/img/jlDangerIcon.png");
    }else{
        $titleImg.addClass("warningBorder");
        $titleText.text("超标报警");
        $jlDangerIcon.attr("src","../../static/img/jlWarnningIcon.png");
    }
    $dangerTime.text(msg.alarmTime);
    $dangerMsg.text(msg.name);



    $(".closeBtn").click(function(){
        $(this).parents(".rightItem").remove();
    });
    $(".rightItem").eq($(".rightItem").length-1).css("margin-bottom",".5vh");
}


function getAllPlace(){
    $.ajax({
        url: "/raise/getList",
        data: "",
        success: function(res){
            var datas = res.datas;
            allPlace = res.datas;




            //通过所有地区循环遍历出所有设备
            readyQNum =0;
            for(var x=0;x<datas.length;x++){
                getDeviceByFarmId(datas[x].id);
            }

            interValQ;









            var  $constructionItemBox =  $(".constructionItemBox");
            $(".constructionItemBox").height(((allPlace.length+1)*4+0.5)+'vh');

            var $constructionItem = $("<div class='constructionItem'></div>");
            var $constructionItemImg = $("<img class='constructionItemImg'src='/static/img/placeIcon.png' />");
            var $constructionItemText = $("<span class='constructionItemText'></span>");
            $constructionItemText.text("全部地区");
            $constructionItem.attr("data-id",0);
            $constructionItemImg.appendTo($constructionItem);
            $constructionItemText.appendTo($constructionItem);
            $constructionItem.appendTo($constructionItemBox);


            for(var i = 0;i<datas.length; i++){
                var $constructionItem = $("<div class='constructionItem'></div>");
                var $constructionItemImg = $("<img class='constructionItemImg'src='/static/img/placeIcon.png' />");
                var $constructionItemText = $("<span class='constructionItemText'></span>");
                $constructionItemText.text(datas[i].farmName);
                $constructionItem.attr("data-id",datas[i].id);
                $constructionItem.attr("lon",datas[i].longitude);
                $constructionItem.attr("lat",datas[i].latitude);
                $constructionItem.attr("data-place",JSON.stringify(datas[i]));

                $constructionItemImg.appendTo($constructionItem);
                $constructionItemText.appendTo($constructionItem);
                $constructionItem.appendTo($constructionItemBox);
            }


            $(".constructionItem").click(function(){
                $(".p1").text("");
                $(".p2").text("");
                $(".p3").text("");
                $(".p4").text("");
                var $deviceItem = $(".deviceItem");
                $deviceItem.empty();


                $(".constructionCheckedText").text($(this).text());
                $(".constructionCheckedText").attr('data-id',$(this).attr("data-id"));
                map.clearMap();    //清除地图上所有覆盖物

                if($(this).attr("data-id")!=0){
                    getDeviceMsg($(this).attr("data-id"));
                    var lon = $(this).attr("lon");
                    var lat = $(this).attr("lat");
                    var farmName = $(this).find(".constructionItemText").text();
                    var place = JSON.parse($(this).attr("data-place"));
                    var $that = $(this);


                }else{
                    $(".deviceBox").css("display","none");
                    $(".templateBox").css("display","none");
                    $(".noDeviceMsg").css("display","none");

                    $(".noUpdateMsg").css("display","none")


                    if($(".leftTwoBox").css("width")=="0px"){
                        $(".leftTwoBox").find(".noPlaceMsg").css("display","none");
                    }else{
                        $(".leftTwoBox").find(".noPlaceMsg").css("display","block");
                    }

                    if($(".leftThreeBox").css("width")=="0px"){
                        $(".leftThreeBox").find(".noPlaceMsg").css("display","none");
                    }else{
                        $(".leftThreeBox").find(".noPlaceMsg").css("display","block");
                    }
                }
                getMarker();

            })
        }
    })


}


// 获取全部地区下的全部设备
function getAllDevice() {
    //分页是否结束
    isLastDevice();
}


function getDeviceByFarmId(placeId){
    $.ajax({
        type: "GET",
        url: "../newFarmInfo/getFarmDeviceList",
        dataType: "json",
        data: {
            page: 1,
            size: 100,
            farmId: placeId,
        },
        success: function (data) {
            if(data.state=="success"){
                if(data.datas.length>0){
                    var res = data.datas;
                    for(var i=0;i<res.length;i++){
                        if(res[i].deviceType!=2 && res[i].deviceType!=10){
                            allCollectDevice.push(res[i]);
                            lxDeviceArr.push(res[i]);
                        }
                    }
                }
            }



            readyQNum++


        },
        error: function (e) {
            console.log(e);
            readyQNum++
        }
    });
}





//获取所有设备(是否最后一页)
function pickPlaceDevice(){
    if(allCollectDevice.length>0){
        //获取所有点设备后给地图默认中心点设为第一个设备坐标点上
        map.setCenter([allCollectDevice[0].longitude, allCollectDevice[0].latitude]); //设置地图中心点
    }
    //通过设备获取，设备所在地区，添加到allCollectDevice数组中
    readyNum = 0;
    for(var j = 0;j<allCollectDevice.length;j++){
        deviceAddPlace(allCollectDevice[j].deviceNumber,j);

    }
    interVal;

}

//增加定时器，当所有设备都添加绑定了地区后，执行操作
var interVal = setInterval(function(){
    if(readyNum == allCollectDevice.length){
        //清除定时器
        clearInterval(interVal);

//获取所有报警设备
        getAllDangerDevice();


    }
},1000);


var interValQ = setInterval(function(){
    if(allPlace&&allPlace.length>0){
        if(readyQNum == allPlace.length){
            //清除定时器
            clearInterval(interValQ);

//获取所有报警设备
            pickPlaceDevice();


        }
    }


},1000);



//获取所有报警设备
function getAllDangerDevice(){
    dangerArr = [];
    warningArr = [];
    allBadArr =[];
    $.ajax({
        type: "GET",
        url: "../raise/triggerDeviceByAreaId",
        dataType: "json",
        data: {
            page: 1,
            size: 100,
            from:$("#startTime").val()+" " +"00:00:00",
            to:$("#endTime").val() +" " +"23:59:59",
        },
        success: function (data) {
            map.clearMap();    //清除地图上所有覆盖物
            var res = data.data;
            if(res&&JSON.stringify(res)!="{}"){
                var zoo = Object.keys(res);
                for(var z=0;z<zoo.length;z++){
                    var allBadNum = 0 ;
                    for(var x = 0;x<res[zoo[z]].length;x++){
                        var flag=0;
                        var bObj = {};
                        bObj.deviceNumber = zoo[z];
                        bObj.name = res[zoo[z]][x].name;
                        if(res[zoo[z]][x].name.indexOf("严重")!=-1){
                            dangerArr.push(bObj);
                            flag=1;
                        }else{
                            warningArr.push(bObj);
                        }

                        if(allBadNum==0){
                            allBadArr.push(bObj);
                            allBadNum++;
                        }
                        if(res[zoo[z]][x].name.indexOf("严重")!=-1){
                            allBadArr.pop();
                            allBadArr.push(bObj);
                        }






                    }
                }



                //初始化并增加地图标点
                getMarker()


            }else{
                getMarker();
            }
        },
        error: function (e) {
            console.log(e);
        }
    });
}



function getMarker(){
    map.clearMap();    //清除地图上所有覆盖物
    if($(".constructionCheckedText").attr("data-id")==0){
        var placeDevice = allCollectDevice;

    }else{
        var placeDevice = [];


        for(var i=0;i<allCollectDevice.length;i++){
            if(allCollectDevice[i].place.id==$(".constructionCheckedText").attr("data-id")){
                placeDevice.push(allCollectDevice[i]);
            }
        }
    }

    if($.trim($(".dangerCheckedText").text())=="超标报警"){
        var questionDevice = warningArr;
    }else if($.trim($(".dangerCheckedText").text())=="严重污染"){
        var questionDevice = dangerArr;
    }else/* if($.trim($(".dangerCheckedText").text())=="全部报警")*/{
        var questionDevice = allBadArr;
    }

    var fixedPointArr =[];
    var allPointArr = [];
    if($.trim($(".monitorCheckedText").text())=="全部指标"){
        fixedPointArr = questionDevice;
        allPointArr= placeDevice;
    }else if($.trim($(".monitorCheckedText").text())=="PM2.5"){
        getPointArrFn("PM2.5",questionDevice,fixedPointArr,placeDevice,allPointArr);
    }else if($.trim($(".monitorCheckedText").text())=="PM10"){
        getPointArrFn("PM10",questionDevice,fixedPointArr,placeDevice,allPointArr);
    }else if($.trim($(".monitorCheckedText").text())=="温湿度"){
        getPointArrFn("温湿度",questionDevice,fixedPointArr,placeDevice,allPointArr);
    }else if($.trim($(".monitorCheckedText").text())=="噪声"){
        getPointArrFn("噪声",questionDevice,fixedPointArr,placeDevice,allPointArr);
    }else if($.trim($(".monitorCheckedText").text())=="风力"){
        getPointArrFn("风力",questionDevice,fixedPointArr,placeDevice,allPointArr);
    }else if($.trim($(".monitorCheckedText").text())=="风向"){
        getPointArrFn("风向",questionDevice,fixedPointArr,placeDevice,allPointArr);
    }else if($.trim($(".monitorCheckedText").text())=="风速"){
        getPointArrFn("风速",questionDevice,fixedPointArr,placeDevice,allPointArr);
    }else if($.trim($(".monitorCheckedText").text())=="TSP"){
        getPointArrFn("TSP",questionDevice,fixedPointArr,placeDevice,allPointArr);
    }else if($.trim($(".monitorCheckedText").text())=="大气压"){
        getPointArrFn("大气压",questionDevice,fixedPointArr,placeDevice,allPointArr);
    }



    if(fixedPointArr.length>0){
        var pointFlag = 0;

        if($.trim($(".dangerCheckedText").text())=="全部设备"){
            for(var j=0;j<allPointArr.length;j++){
                for(var c=0;c<fixedPointArr.length;c++){



                    if(fixedPointArr[c].deviceNumber==allPointArr[j].deviceNumber){
                        if(pointFlag==0){

                            map.setCenter([allPointArr[j].longitude, allPointArr[j].latitude]); //设置地图中心点
          /*                  triggerClickPoint(allPointArr[j].place);*/
                            pointFlag++
                        }
                        var dl ;
                        if(fixedPointArr[c].name.indexOf("严重")!=-1){
                            dl = 1
                        }else{
                            dl=2;
                        }
                        addMarker(allPointArr[j].longitude,allPointArr[j].latitude,allPointArr[j].place,dl);
                        break;
                    }else{
                        if(c==fixedPointArr.length-1){
                            if(pointFlag==0){

                                map.setCenter([allPointArr[j].longitude, allPointArr[j].latitude]); //设置地图中心点
                  /*              triggerClickPoint(allPointArr[j].place);*/
                                pointFlag++
                            }
                            if(allPointArr[j].onLineState==1){
                                addMarker(allPointArr[j].longitude,allPointArr[j].latitude,allPointArr[j].place,0);
                            }else{
                                addMarker(allPointArr[j].longitude,allPointArr[j].latitude,allPointArr[j].place,4);
                            }
                        }



                    }






                }
            }



        }else if($.trim($(".dangerCheckedText").text())=="全部报警"){
            for(var j=0;j<allPointArr.length;j++){
                for(var c=0;c<fixedPointArr.length;c++){
                    if(fixedPointArr[c].deviceNumber==allPointArr[j].deviceNumber){
                        if(pointFlag==0){
                            map.setCenter([allPointArr[j].longitude, allPointArr[j].latitude]); //设置地图中心点
    /*                        triggerClickPoint(allPointArr[j].place);*/
                            pointFlag++
                        }
                        var dl ;
                        if(fixedPointArr[c].name.indexOf("严重")!=-1){
                            dl = 1
                        }else{
                            dl=2;
                        }
                        addMarker(allPointArr[j].longitude,allPointArr[j].latitude,allPointArr[j].place,dl);
                    }

                }
            }






        }else if($.trim($(".dangerCheckedText").text())=="超标报警"){
            for(var j=0;j<allPointArr.length;j++) {
                for (var c = 0; c < fixedPointArr.length; c++) {
                    if (fixedPointArr[c].deviceNumber == allPointArr[j].deviceNumber) {
                        if (pointFlag == 0) {
                            map.setCenter([allPointArr[j].longitude, allPointArr[j].latitude]); //设置地图中心点
        /*                    triggerClickPoint(allPointArr[j].place);*/
                            pointFlag++
                        }

                        addMarker(allPointArr[j].longitude, allPointArr[j].latitude, allPointArr[j].place, 2);
                    }
                }
            }
        }else if($.trim($(".dangerCheckedText").text())=="严重污染"){
            for(var j=0;j<allPointArr.length;j++) {
                for (var c = 0; c < fixedPointArr.length; c++) {
                    if (fixedPointArr[c].deviceNumber == allPointArr[j].deviceNumber) {
                        if (pointFlag == 0) {
                            map.setCenter([allPointArr[j].longitude, allPointArr[j].latitude]); //设置地图中心点
                            // triggerClickPoint(allPointArr[j].place);
                            pointFlag++
                        }

                        addMarker(allPointArr[j].longitude, allPointArr[j].latitude, allPointArr[j].place, 1);
                    }
                }
            }
        }else if($.trim($(".dangerCheckedText").text())=="正常"){
            var notUseArr = [];
            for(var z =0;z<fixedPointArr.length;z++){
                notUseArr.push(fixedPointArr[z].deviceNumber);
            }
            if(notUseArr.length>0){
                for(var t=0;t<notUseArr.length;t++){
                    for(var y=0;y<allPointArr.length;y++){
                        if(notUseArr[t] == allPointArr[y].deviceNumber){
                            allPointArr.splice(y,1);
                            break;
                        }
                    }
                }
            }

            for (var c = 0; c < allPointArr.length; c++) {
                if(allPointArr[c].onLineState==1){
                    if(pointFlag==0){

                        map.setCenter([allPointArr[c].longitude, allPointArr[c].latitude]); //设置地图中心点
                        // triggerClickPoint(allPointArr[c].place);
                        pointFlag++
                    }

                    addMarker(allPointArr[c].longitude,allPointArr[c].latitude,allPointArr[c].place,0);
                }

            }



        }else if($.trim($(".dangerCheckedText").text())=="离线"){

            var notUseArr = [];
            for(var z =0;z<fixedPointArr.length;z++){
                notUseArr.push(fixedPointArr[z].deviceNumber);
            }
            if(notUseArr.length>0){
                for(var t=0;t<notUseArr.length;t++){
                    for(var y=0;y<allPointArr.length;y++){
                        if(notUseArr[t] == allPointArr[y].deviceNumber){
                            allPointArr.splice(y,1);
                            break;
                        }
                    }
                }
            }

            for (var c = 0; c < allPointArr.length; c++) {
                if(allPointArr[c].onLineState==0){
                    if(pointFlag==0){

                        map.setCenter([allPointArr[c].longitude, allPointArr[c].latitude]); //设置地图中心点
                        // triggerClickPoint(allPointArr[c].place);
                        pointFlag++
                    }

                    addMarker(allPointArr[c].longitude,allPointArr[c].latitude,allPointArr[c].place,4);
                }

            }

        }








    }else{
        var pointFlag = 0;

        if($.trim($(".dangerCheckedText").text())=="全部设备"){
            for(var j=0;j<allPointArr.length;j++){
                if(allPointArr[j].onLineState==1) {
                    addMarker(allPointArr[j].longitude, allPointArr[j].latitude, allPointArr[j].place, 0);
                    if (pointFlag == 0) {

                        map.setCenter([allPointArr[j].longitude, allPointArr[j].latitude]); //设置地图中心点
           /*             triggerClickPoint(allPointArr[j].place);*/
                        pointFlag++;
                    }
                }else{
                    addMarker(allPointArr[j].longitude, allPointArr[j].latitude, allPointArr[j].place, 4);
                    if (pointFlag == 0) {
                        map.setCenter([allPointArr[j].longitude, allPointArr[j].latitude]); //设置地图中心点
                     /*   triggerClickPoint(allPointArr[j].place);*/
                        pointFlag++;
                    }
                }
            }
        }else  if($.trim($(".dangerCheckedText").text())=="正常"){
            for(var j=0;j<allPointArr.length;j++){
                if(allPointArr[j].onLineState==1){
                    addMarker(allPointArr[j].longitude,allPointArr[j].latitude,allPointArr[j].place,0);
                    if(pointFlag==0){
                        map.setCenter([allPointArr[j].longitude, allPointArr[j].latitude]); //设置地图中心点
             /*           triggerClickPoint(allPointArr[j].place);*/
                        pointFlag++;
                    }
                }

            }
        }else if($.trim($(".dangerCheckedText").text())=="离线"){
            for(var j=0;j<allPointArr.length;j++){
                if(allPointArr[j].onLineState==0){
                    addMarker(allPointArr[j].longitude,allPointArr[j].latitude,allPointArr[j].place,4);
                    if(pointFlag==0){
                        map.setCenter([allPointArr[j].longitude,allPointArr[j].latitude]); //设置地图中心点
              /*          triggerClickPoint(allPointArr[j].place);*/
                        pointFlag++;
                    }
                }
            }


        }

    }






}



























function deviceAddPlace(deviceNumber,j){
    $.ajax({
        type: "GET",
        url: "../raise/farmByDevice",
        dataType: "json",
             async:false,
        timeOut:30000,
        data: {
            deviceNumber: deviceNumber,
        },
        success: function (data) {
            if(data){
                var obj = {};
                obj.farmAddress = data.data.farmAddress;
                obj.farmName = data.data.farmName;
                obj.createUser = data.data.createUser;
                obj.tel = data.data.tel;
                obj.id= data.data.id;
                obj.imgUrl = data.data.imgUrl;
                obj.deviceNumber = allCollectDevice[readyNum].deviceNumber;
                allCollectDevice[readyNum].place = obj;
            }

            readyNum++;
        },
        error: function (e) {
            console.log(e);
            readyNum++;
        }
    });
}


















//获取继电器设备个数
function getDeviceMsg(placeId,deviceNumber) {
    $.ajax({
        type: "GET",
        url: "../newFarmInfo/getFarmDeviceList",
        dataType: "json",
        data: {
            page: 1,
            size: 10,
            farmId: placeId,
        },
        success: function (data) {
            flagDevice = 0;
            flagUpdata = 0;
            if (data.state == "success" && data.datas.length > 0) {
                //获取继电器开关列表
                for (var j = 0; j < data.datas.length; j++) {
                    if (data.datas[j].deviceType == 2) {
//继电器返回信
                        flagDevice=1;
                        $.ajax({
                            type: "POST",
                            url: "../aquacultureUserSensor/getSensorListForScreen",
                            data: {size: '100', page: 1, ncode: data.datas[j].deviceNumber},
                            dataType: "json",
                            success: function (data) {
                                //加载继电器设备
                                addEquipment(data.data);



                            },
                            error: function (e) {
                                console.log(e);
                                if($(".leftTwoBox").css("width")=="0px"){
                                    $(".deviceBox").css("display","none");
                                    $(".leftBox").find(".noPlaceMsg").css("display","none");
                                    $(".leftBox").find(".noDeviceMsg").css("display","none");
                                }else{
                                    $(".deviceBox").css("display","none");
                                    $(".leftBox").find(".noPlaceMsg").css("display","none");
                                    $(".leftBox").find(".noDeviceMsg").css("display","block");
                                }

                            }
                        });



                        break;
                    }
                }

                if(flagDevice==0){

                    if($(".leftTwoBox").css("width")=="0px"){
                        $(".deviceBox").css("display","none");
                        $(".leftBox").find(".noPlaceMsg").css("display","none");
                        $(".leftBox").find(".noDeviceMsg").css("display","none");
                    }else{
                        $(".deviceBox").css("display","none");
                        $(".leftBox").find(".noPlaceMsg").css("display","none");
                        $(".leftBox").find(".noDeviceMsg").css("display","block");
                    }


                }

                        //推送返回信息
                        $.ajax({
                            type: "POST",
                            url: "../raise/triggerByDevice",
                            data: {deviceId: deviceNumber},
                            dataType: "json",
                            success: function (data) {
                                if(data.data){

                                    var res=data.data;
                                    if(JSON.stringify(res)!="{}"){
                                        $(".noPlaceMsg").css("display","none");
                                        $(".noUpdateMsg").css("display","none");
                                        $(".templateBox").css("display","block");
                                        $(".p1").text("");
                                        $(".p2").text("");
                                        $(".template").eq(1).css("display","block");
                                        $(".p3").text("");
                                        $(".p4").text("");
                                        if(!res.creatTime){
                                            if($(".leftThreeBox").css("width")=="0px"){
                                                $(".templateBox").css("display","none");
                                                $(".leftBox").find(".noPlaceMsg").css("display","none");
                                                $(".leftBox").find(".noUpdateMsg").css("display","none");
                                            }else{
                                                $(".templateBox").css("display","none");
                                                $(".leftBox").find(".noPlaceMsg").css("display","none");
                                                $(".leftBox").find(".noUpdateMsg").css("display","block");
                                            }
                                        }
                                        if(res.creatTime){
                                            $(".p1").text(res.creatTime);
                                            var now= new Date();
                                            var forTime = new Date(res.creatTime);

                                            var  nowTime = now - forTime;
                                            var minute = (nowTime/1000/60).toFixed(0);
                                            if(minute>=1440){
                                                $(".p3").text( parseInt(minute/1440) + "天" +  parseInt(minute%1440/60) +"小时" + parseInt(minute%1440%60%60)+"分");
                                            }else if(minute>=60){
                                                $(".p3").text( parseInt(minute/60)+"小时" + minute%60 +"分");
                                            }else{
                                                $(".p3").text( parseInt(minute) +"分");

                                            }
                                        }
                                        if(res.type){
                                            if(res.type=="tel"){
                                                $(".p2").text("手机推送");
                                            }else{
                                                $(".p2").text("邮件推送");
                                            }
                                        }
                                        if(res.value){
                                            $(".p4").text(res.value)
                                        }
                                    }else{
                                        $.ajax({
                                            type: "POST",
                                            url: "../device/selDeviceSensorData",
                                            data: {deviceNumber: deviceNumber},
                                            dataType: "json",
                                            success: function (data) {
                                                    if(data.state=="success"){
                                                        if(data.datas){
                                                            $(".noPlaceMsg").css("display","none");
                                                            $(".noUpdateMsg").css("display","none");
                                                            $(".templateBox").css("display","block");
                                                            $(".p1").text("");
                                                            $(".p2").text("");
                                                            $(".template").eq(1).css("display","none");
                                                            $(".p3").text("");
                                                            $(".p4").text("");
                                                                var res=data.datas;
                                                                if(res.length>0){
                                                                    if(res[0].dataTime){
                                                                        $(".p1").text(res[0].dataTime);
                                                                        var now= new Date();
                                                                        var forTime = new Date(res[0].dataTime);
                                                                        var  nowTime = now - forTime;
                                                                        var minute = (nowTime/1000/60).toFixed(0);
                                                                        if(minute>=1440){
                                                                            $(".p3").text( parseInt(minute/1440) + "天" +  parseInt(minute%1440/60) +"小时" + parseInt(minute%1440%60%60)+"分");
                                                                        }else if(minute>=60){
                                                                            $(".p3").text( parseInt(minute/60)+"小时" + minute%60 +"分");
                                                                        }else{
                                                                            $(".p3").text( parseInt(minute) +"分");

                                                                        }
                                                                    }

                                                                    $(".p4").text(res[0].value+res[0].unit+"/"+res[0].name);

                                                                    }
                                                        }
                                                    }else{
                                                        if($(".leftThreeBox").css("width")=="0px"){
                                                            $(".templateBox").css("display","none");
                                                            $(".leftBox").find(".noPlaceMsg").css("display","none");
                                                            $(".leftBox").find(".noUpdateMsg").css("display","none");
                                                        }else{
                                                            $(".templateBox").css("display","none");
                                                            $(".leftBox").find(".noPlaceMsg").css("display","none");
                                                            $(".leftBox").find(".noUpdateMsg").css("display","block");
                                                        }
                                                    }
                                            },
                                            error: function (e) {
                                                console.log(e);
                                                if($(".leftThreeBox").css("width")=="0px"){
                                                    $(".templateBox").css("display","none");
                                                    $(".leftBox").find(".noPlaceMsg").css("display","none");
                                                    $(".leftBox").find(".noUpdateMsg").css("display","none");
                                                }else{
                                                    $(".templateBox").css("display","none");
                                                    $(".leftBox").find(".noPlaceMsg").css("display","none");
                                                    $(".leftBox").find(".noUpdateMsg").css("display","block");
                                                }


                                            }
                                        });


                                    }


                                }
                            },
                            error: function (e) {
                                console.log(e);
                                if($(".leftThreeBox").css("width")=="0px"){
                                    $(".templateBox").css("display","none");
                                    $(".leftBox").find(".noPlaceMsg").css("display","none");
                                    $(".leftBox").find(".noUpdateMsg").css("display","none");
                                }else{
                                    $(".templateBox").css("display","none");
                                    $(".leftBox").find(".noPlaceMsg").css("display","none");
                                    $(".leftBox").find(".noUpdateMsg").css("display","block");
                                }


                            }
                        });


         /*       if(flagDevice==0){

                    if($(".leftTwoBox").css("width")=="0px"){
                        $(".deviceBox").css("display","none");
                        $(".leftBox").find(".noPlaceMsg").css("display","none");
                        $(".leftBox").find(".noDeviceMsg").css("display","none");
                    }else{
                        $(".deviceBox").css("display","none");
                        $(".leftBox").find(".noPlaceMsg").css("display","none");
                        $(".leftBox").find(".noDeviceMsg").css("display","block");
                    }


                }*/
         /*       if(flagUpdata==0){
                    if($(".leftThreeBox").css("width")=="0px"){
                        $(".templateBox").css("display","none");
                        $(".leftBox").find(".noPlaceMsg").css("display","none");
                        $(".leftBox").find(".noUpdateMsg").css("display","none");
                    }else{
                        $(".templateBox").css("display","none");
                        $(".leftBox").find(".noPlaceMsg").css("display","none");
                        $(".leftBox").find(".noUpdateMsg").css("display","block");
                    }
                }*/


            } else {
                $(".noPlaceMsg").css("display","none");


            }
        },
        error: function (e) {
            console.log(e);
        }
    });
}



//实时环境监测
function setenvironmental(constructionList) {
    var $placeDeviceItemBox = $(".placeDeviceItemBox");
    $placeDeviceItemBox.empty();
    if(constructionList.type){
        if (constructionList.type.length>0) {
            var itemName =constructionList.type;
            var itemNameArr = itemName.split("/");
            var itemValue =constructionList.data;
            if(itemValue && itemValue.length>0){
                var itemValueArr = itemValue.split("|");
            }

            var $environmental = $(".environmental");
            $environmental.empty();
            for (var i = 0; i < itemNameArr.length; i++) {
                var $placeDeviceItem = $("<div class='placeDeviceItem'></div>");
                $placeDeviceItem.text($.trim(itemNameArr[i])+":" +$.trim(itemValueArr[i]))

                $placeDeviceItem.appendTo($placeDeviceItemBox);

            }
        } else {
            $placeDeviceItemBox.html("<p style='text-align:center;margin-top:10vh;'>未配置模板</p>");
        }
    }







}


function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
    return currentdate;
}








//筛选指标


function getPointArrFn(point,questionDevice,fixedPointArr,placeDevice,allPointArr){
    //报警设备筛选指定指标
    for(var i=0;i<questionDevice.length;i++){
        if(questionDevice[i].name.indexOf(point)!=-1){
            fixedPointArr.push(questionDevice[i]);
        }
    }
    //全部设备筛选你指定指标
    for(var j=0;j<placeDevice.length;j++){
        if(placeDevice[j].type && placeDevice[j].type.length>0){
            var fixedPointItem = placeDevice[j].type.split("/");
            for(var m=0;m<fixedPointItem.length;m++){
                if($.trim(fixedPointItem[m]).indexOf(point)!=-1){
                    allPointArr.push(placeDevice[j]);
                    break;
                }
            }
        }
    }
}












var styleJson = [{
    "featureType": "land",
    "elementType": "geometry",
    "stylers": {
        "visibility": "on",
        "color": "#024162ff"
    }
}, {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": {
        "visibility": "on",
        "color": "#024162ff"
    }
}, {
    "featureType": "building",
    "elementType": "geometry.fill",
    "stylers": {
        "visibility": "on",
        "color": "#003553ff"
    }
}, {
    "featureType": "building",
    "elementType": "geometry.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#00233aff"
    }
}, {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": {
        "visibility": "on",
        "color": "#03587fff"
    }
}, {
    "featureType": "village",
    "elementType": "labels",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "town",
    "elementType": "labels",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "district",
    "elementType": "labels",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "country",
    "elementType": "labels.text.fill",
    "stylers": {
        "visibility": "on",
        "color": "#03587fff"
    }
}, {
    "featureType": "city",
    "elementType": "labels.text.fill",
    "stylers": {
        "visibility": "on",
        "color": "#03587fff"
    }
}, {
    "featureType": "continent",
    "elementType": "labels.text.fill",
    "stylers": {
        "visibility": "on",
        "color": "#03587fff"
    }
}, {
    "featureType": "poilabel",
    "elementType": "labels",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "poilabel",
    "elementType": "labels.icon",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "scenicspotslabel",
    "elementType": "labels.icon",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "scenicspotslabel",
    "elementType": "labels.text.fill",
    "stylers": {
        "visibility": "on",
        "color": "#03587fff"
    }
}, {
    "featureType": "transportationlabel",
    "elementType": "labels.text.fill",
    "stylers": {
        "visibility": "on",
        "color": "#03587fff"
    }
}, {
    "featureType": "transportationlabel",
    "elementType": "labels.icon",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "airportlabel",
    "elementType": "labels.text.fill",
    "stylers": {
        "visibility": "on",
        "color": "#03587fff"
    }
}, {
    "featureType": "airportlabel",
    "elementType": "labels.icon",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": {
        "visibility": "on",
        "color": "#08668cff"
    }
}, {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#004364ff"
    }
}, {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": {
        "weight": "3"
    }
}, {
    "featureType": "green",
    "elementType": "geometry",
    "stylers": {
        "visibility": "on",
        "color": "#02697cff"
    }
}, {
    "featureType": "scenicspots",
    "elementType": "geometry",
    "stylers": {
        "visibility": "on",
        "color": "#024162ff"
    }
}, {
    "featureType": "scenicspots",
    "elementType": "labels.text.fill",
    "stylers": {
        "visibility": "on",
        "color": "#03587fff"
    }
}, {
    "featureType": "scenicspots",
    "elementType": "labels.text.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#ffffffff",
        "weight": "1"
    }
}, {
    "featureType": "continent",
    "elementType": "labels.text.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#ffffffff",
        "weight": "1"
    }
}, {
    "featureType": "country",
    "elementType": "labels.text.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#ffffffff",
        "weight": "1"
    }
}, {
    "featureType": "city",
    "elementType": "labels.text.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#ffffffff",
        "weight": "1"
    }
}, {
    "featureType": "city",
    "elementType": "labels.icon",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "scenicspotslabel",
    "elementType": "labels.text.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#ffffffff",
        "weight": "1"
    }
}, {
    "featureType": "airportlabel",
    "elementType": "labels.text.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#ffffffff",
        "weight": "1"
    }
}, {
    "featureType": "transportationlabel",
    "elementType": "labels.text.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#ffffffff",
        "weight": "1"
    }
}, {
    "featureType": "railway",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "subway",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "highwaysign",
    "elementType": "labels",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "nationalwaysign",
    "elementType": "labels",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "nationalwaysign",
    "elementType": "labels.icon",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "provincialwaysign",
    "elementType": "labels",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "provincialwaysign",
    "elementType": "labels.icon",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "tertiarywaysign",
    "elementType": "labels",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "tertiarywaysign",
    "elementType": "labels.icon",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "subwaylabel",
    "elementType": "labels",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "subwaylabel",
    "elementType": "labels.icon",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": {
        "visibility": "on",
        "color": "#03587fff",
        "weight": "90"
    }
}, {
    "featureType": "road",
    "elementType": "labels.text.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#ffffffff",
        "weight": "1"
    }
}, {
    "featureType": "shopping",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "scenicspots",
    "elementType": "labels",
    "stylers": {
        "visibility": "on"
    }
}, {
    "featureType": "scenicspotslabel",
    "elementType": "labels",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "manmade",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "manmade",
    "elementType": "labels",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "highwaysign",
    "elementType": "labels.icon",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#02697c00"
    }
}, {
    "featureType": "road",
    "stylers": {
        "level": "6",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "road",
    "stylers": {
        "level": "7",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "road",
    "stylers": {
        "level": "8",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "road",
    "stylers": {
        "level": "9",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off",
        "level": "6",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off",
        "level": "7",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off",
        "level": "8",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off",
        "level": "9",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "road",
    "elementType": "labels",
    "stylers": {
        "visibility": "off",
        "level": "6",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "road",
    "elementType": "labels",
    "stylers": {
        "visibility": "off",
        "level": "7",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "road",
    "elementType": "labels",
    "stylers": {
        "visibility": "off",
        "level": "8",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "road",
    "elementType": "labels",
    "stylers": {
        "visibility": "off",
        "level": "9",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "road",
    "elementType": "labels.text",
    "stylers": {
        "fontsize": "24"
    }
}, {
    "featureType": "highway",
    "elementType": "labels.text.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#ffffffff",
        "weight": "1"
    }
}, {
    "featureType": "highway",
    "elementType": "geometry.fill",
    "stylers": {
        "visibility": "on",
        "color": "#08668cff"
    }
}, {
    "featureType": "highway",
    "elementType": "geometry.stroke",
    "stylers": {
        "color": "#1c4f7eff"
    }
}, {
    "featureType": "highway",
    "elementType": "labels.text.fill",
    "stylers": {
        "visibility": "on",
        "color": "#03587fff"
    }
}, {
    "featureType": "highway",
    "elementType": "geometry",
    "stylers": {
        "weight": "3"
    }
}, {
    "featureType": "nationalway",
    "elementType": "geometry.fill",
    "stylers": {
        "visibility": "on",
        "color": "#08668cff"
    }
}, {
    "featureType": "nationalway",
    "elementType": "geometry.stroke",
    "stylers": {
        "color": "#1c4f7eff"
    }
}, {
    "featureType": "nationalway",
    "elementType": "labels.text.fill",
    "stylers": {
        "visibility": "on",
        "color": "#03587fff"
    }
}, {
    "featureType": "nationalway",
    "elementType": "labels.text.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#ffffffff",
        "weight": "1"
    }
}, {
    "featureType": "nationalway",
    "elementType": "geometry",
    "stylers": {
        "weight": "3"
    }
}, {
    "featureType": "provincialway",
    "elementType": "geometry.fill",
    "stylers": {
        "visibility": "on",
        "color": "#08668cff"
    }
}, {
    "featureType": "cityhighway",
    "elementType": "geometry.fill",
    "stylers": {
        "visibility": "on",
        "color": "#08668cff"
    }
}, {
    "featureType": "arterial",
    "elementType": "geometry.fill",
    "stylers": {
        "visibility": "on",
        "color": "#08668cff"
    }
}, {
    "featureType": "tertiaryway",
    "elementType": "geometry.fill",
    "stylers": {
        "visibility": "on",
        "color": "#08668cff"
    }
}, {
    "featureType": "fourlevelway",
    "elementType": "geometry.fill",
    "stylers": {
        "visibility": "on",
        "color": "#08668cff"
    }
}, {
    "featureType": "local",
    "elementType": "geometry.fill",
    "stylers": {
        "visibility": "on",
        "color": "#08668cff"
    }
}, {
    "featureType": "provincialway",
    "elementType": "geometry.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#004364ff"
    }
}, {
    "featureType": "cityhighway",
    "elementType": "geometry.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#004364ff"
    }
}, {
    "featureType": "arterial",
    "elementType": "geometry.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#004364ff"
    }
}, {
    "featureType": "tertiaryway",
    "elementType": "geometry.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#004364ff"
    }
}, {
    "featureType": "fourlevelway",
    "elementType": "geometry.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#004364ff"
    }
}, {
    "featureType": "local",
    "elementType": "geometry.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#004364ff"
    }
}, {
    "featureType": "local",
    "elementType": "labels.text.fill",
    "stylers": {
        "visibility": "on",
        "color": "#03587fff"
    }
}, {
    "featureType": "local",
    "elementType": "labels.text.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#ffffffff",
        "weight": "1"
    }
}, {
    "featureType": "fourlevelway",
    "elementType": "labels.text.fill",
    "stylers": {
        "visibility": "on",
        "color": "#03587fff"
    }
}, {
    "featureType": "tertiaryway",
    "elementType": "labels.text.fill",
    "stylers": {
        "visibility": "on",
        "color": "#03587fff"
    }
}, {
    "featureType": "arterial",
    "elementType": "labels.text.fill",
    "stylers": {
        "visibility": "on",
        "color": "#03587fff"
    }
}, {
    "featureType": "cityhighway",
    "elementType": "labels.text.fill",
    "stylers": {
        "visibility": "on",
        "color": "#03587fff"
    }
}, {
    "featureType": "provincialway",
    "elementType": "labels.text.fill",
    "stylers": {
        "visibility": "on",
        "color": "#03587fff"
    }
}, {
    "featureType": "provincialway",
    "elementType": "labels.text.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#ffffffff",
        "weight": "1"
    }
}, {
    "featureType": "cityhighway",
    "elementType": "labels.text.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#ffffffff",
        "weight": "1"
    }
}, {
    "featureType": "arterial",
    "elementType": "labels.text.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#ffffffff",
        "weight": "1"
    }
}, {
    "featureType": "tertiaryway",
    "elementType": "labels.text.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#ffffffff",
        "weight": "1"
    }
}, {
    "featureType": "fourlevelway",
    "elementType": "labels.text.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#ffffffff",
        "weight": "1"
    }
}, {
    "featureType": "fourlevelway",
    "elementType": "geometry",
    "stylers": {
        "weight": "1"
    }
}, {
    "featureType": "tertiaryway",
    "elementType": "geometry",
    "stylers": {
        "weight": "1"
    }
}, {
    "featureType": "local",
    "elementType": "geometry",
    "stylers": {
        "weight": "1"
    }
}, {
    "featureType": "provincialway",
    "elementType": "geometry",
    "stylers": {
        "weight": "3"
    }
}, {
    "featureType": "cityhighway",
    "elementType": "geometry",
    "stylers": {
        "weight": "3"
    }
}, {
    "featureType": "arterial",
    "elementType": "geometry",
    "stylers": {
        "weight": "3"
    }
}, {
    "featureType": "highway",
    "stylers": {
        "level": "6",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "highway",
    "stylers": {
        "level": "7",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "highway",
    "stylers": {
        "level": "8",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "highway",
    "stylers": {
        "level": "9",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "highway",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off",
        "level": "6",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "highway",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off",
        "level": "7",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "highway",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off",
        "level": "8",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "highway",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off",
        "level": "9",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "highway",
    "elementType": "labels",
    "stylers": {
        "visibility": "off",
        "level": "6",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "highway",
    "elementType": "labels",
    "stylers": {
        "visibility": "off",
        "level": "7",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "highway",
    "elementType": "labels",
    "stylers": {
        "visibility": "off",
        "level": "8",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "highway",
    "elementType": "labels",
    "stylers": {
        "visibility": "off",
        "level": "9",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "nationalway",
    "stylers": {
        "level": "6",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "nationalway",
    "stylers": {
        "level": "7",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "nationalway",
    "stylers": {
        "level": "8",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "nationalway",
    "stylers": {
        "level": "9",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "nationalway",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off",
        "level": "6",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "nationalway",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off",
        "level": "7",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "nationalway",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off",
        "level": "8",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "nationalway",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off",
        "level": "9",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "nationalway",
    "elementType": "labels",
    "stylers": {
        "visibility": "off",
        "level": "6",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "nationalway",
    "elementType": "labels",
    "stylers": {
        "visibility": "off",
        "level": "7",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "nationalway",
    "elementType": "labels",
    "stylers": {
        "visibility": "off",
        "level": "8",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "nationalway",
    "elementType": "labels",
    "stylers": {
        "visibility": "off",
        "level": "9",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "provincialway",
    "stylers": {
        "level": "8",
        "curZoomRegionId": "0",
        "curZoomRegion": "8-10"
    }
}, {
    "featureType": "provincialway",
    "stylers": {
        "level": "9",
        "curZoomRegionId": "0",
        "curZoomRegion": "8-10"
    }
}, {
    "featureType": "provincialway",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off",
        "level": "8",
        "curZoomRegionId": "0",
        "curZoomRegion": "8-10"
    }
}, {
    "featureType": "provincialway",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off",
        "level": "9",
        "curZoomRegionId": "0",
        "curZoomRegion": "8-10"
    }
}, {
    "featureType": "provincialway",
    "elementType": "labels",
    "stylers": {
        "visibility": "off",
        "level": "8",
        "curZoomRegionId": "0",
        "curZoomRegion": "8-10"
    }
}, {
    "featureType": "provincialway",
    "elementType": "labels",
    "stylers": {
        "visibility": "off",
        "level": "9",
        "curZoomRegionId": "0",
        "curZoomRegion": "8-10"
    }
}, {
    "featureType": "cityhighway",
    "stylers": {
        "level": "6",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "cityhighway",
    "stylers": {
        "level": "7",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "cityhighway",
    "stylers": {
        "level": "8",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "cityhighway",
    "stylers": {
        "level": "9",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "cityhighway",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off",
        "level": "6",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "cityhighway",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off",
        "level": "7",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "cityhighway",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off",
        "level": "8",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "cityhighway",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off",
        "level": "9",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "cityhighway",
    "elementType": "labels",
    "stylers": {
        "visibility": "off",
        "level": "6",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "cityhighway",
    "elementType": "labels",
    "stylers": {
        "visibility": "off",
        "level": "7",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "cityhighway",
    "elementType": "labels",
    "stylers": {
        "visibility": "off",
        "level": "8",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "cityhighway",
    "elementType": "labels",
    "stylers": {
        "visibility": "off",
        "level": "9",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "arterial",
    "stylers": {
        "level": "9",
        "curZoomRegionId": "0",
        "curZoomRegion": "9-9"
    }
}, {
    "featureType": "arterial",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off",
        "level": "9",
        "curZoomRegionId": "0",
        "curZoomRegion": "9-9"
    }
}, {
    "featureType": "arterial",
    "elementType": "labels",
    "stylers": {
        "visibility": "off",
        "level": "9",
        "curZoomRegionId": "0",
        "curZoomRegion": "9-9"
    }
}];

