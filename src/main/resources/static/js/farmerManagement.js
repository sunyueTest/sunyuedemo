
layui.use(['form', 'layedit', 'laydate'], function () {
});
var map;
var plan=[];
$(function () {
    //页面各元素高度自适应设置
    var documentHeight = $(window).height();
    $(".content").height(documentHeight);
    $("#mapContainer").height(documentHeight);
    $(window).resize(function () {
        // $(".projectTime").css("top",$(".ProjectTitle").height()- 47);
        var documentHeight = $(window).height();
        $(".content").height(documentHeight);
        $("#mapContainer").height(documentHeight);
    });

var showMsg = [
    {shop:'延川种植',pre:"农机",fw:"农产业",person:"张三",phone:"88888888888"},
    {shop:'子长种植',pre:"农机",fw:"农产业",person:"张三",phone:"88888888888"},
    {shop:'志丹种植',pre:"农机",fw:"农产业",person:"张三",phone:"88888888888"},
    {shop:'甘泉种植',pre:"农机",fw:"农产业",person:"张三",phone:"88888888888"},
    {shop:'洛川种植',pre:"农机",fw:"农产业",person:"张三",phone:"88888888888"}];

    var $mdContentItemBox = $(".mdContentItemBox");
    $mdContentItemBox.empty();
    for(var j =0;j<showMsg.length;j++){
        var $mdContentItem = $("<div class='mdContentItem'></div>");
        var $mdContentConName = $("<span class='mdContentConName' style='width:4vw;'></span>");
        var $mdContentPrName = $("<span class='mdContentPrName cEFAA3A' style='width:3vw;'></span>");
        var $mdContentAround = $("<span class='mdContentAround cEFAA3A' style='width:3vw;'></span>");
        var $mdContentPerson = $("<span class='mdContentPerson' style='width:3vw;'></span>");
        var $mdContentPhone = $("<span class='mdContentPhone' style='width:4vw;'></span>");
        $mdContentConName.text(showMsg[j].shop);
        $mdContentPrName.text(showMsg[j].pre);
        $mdContentAround.text(showMsg[j].fw);
        $mdContentPerson.text(showMsg[j].person);
        $mdContentPhone.text(showMsg[j].phone);
        $mdContentConName.appendTo($mdContentItem);
        $mdContentPrName.appendTo($mdContentItem);
        $mdContentAround.appendTo($mdContentItem);
        $mdContentPerson.appendTo($mdContentItem);
        $mdContentPhone.appendTo($mdContentItem);
        $mdContentItem.appendTo($mdContentItemBox);
    }
$(".shopSearch").click(function(){

    $mdContentItemBox.empty();
    if($("#shopSearchInput").val()==""){
        for(var j =0;j<showMsg.length;j++){
                var $mdContentItem = $("<div class='mdContentItem'></div>");
                var $mdContentConName = $("<span class='mdContentConName' style='width:4vw;'></span>");
                var $mdContentPrName = $("<span class='mdContentPrName cEFAA3A' style='width:3vw;'></span>");
                var $mdContentAround = $("<span class='mdContentAround cEFAA3A' style='width:3vw;'></span>");
                var $mdContentPerson = $("<span class='mdContentPerson' style='width:3vw;'></span>");
                var $mdContentPhone = $("<span class='mdContentPhone' style='width:4vw;'></span>");
                $mdContentConName.text(showMsg[j].shop);
                $mdContentPrName.text(showMsg[j].pre);
                $mdContentAround.text(showMsg[j].fw);
                $mdContentPerson.text(showMsg[j].person);
                $mdContentPhone.text(showMsg[j].phone);
                $mdContentConName.appendTo($mdContentItem);
                $mdContentPrName.appendTo($mdContentItem);
                $mdContentAround.appendTo($mdContentItem);
                $mdContentPerson.appendTo($mdContentItem);
                $mdContentPhone.appendTo($mdContentItem);
                $mdContentItem.appendTo($mdContentItemBox);
            }

    }else{
        for(var j =0;j<showMsg.length;j++){
            if(showMsg[j].shop.indexOf($("#shopSearchInput").val()) !=-1){
                var $mdContentItem = $("<div class='mdContentItem'></div>");
                var $mdContentConName = $("<span class='mdContentConName' style='width:4vw;'></span>");
                var $mdContentPrName = $("<span class='mdContentPrName cEFAA3A' style='width:3vw;'></span>");
                var $mdContentAround = $("<span class='mdContentAround cEFAA3A' style='width:3vw;'></span>");
                var $mdContentPerson = $("<span class='mdContentPerson' style='width:3vw;'></span>");
                var $mdContentPhone = $("<span class='mdContentPhone' style='width:4vw;'></span>");
                $mdContentConName.text(showMsg[j].shop);
                $mdContentPrName.text(showMsg[j].pre);
                $mdContentAround.text(showMsg[j].fw);
                $mdContentPerson.text(showMsg[j].person);
                $mdContentPhone.text(showMsg[j].phone);
                $mdContentConName.appendTo($mdContentItem);
                $mdContentPrName.appendTo($mdContentItem);
                $mdContentAround.appendTo($mdContentItem);
                $mdContentPerson.appendTo($mdContentItem);
                $mdContentPhone.appendTo($mdContentItem);
                $mdContentItem.appendTo($mdContentItemBox);
            }
        }
    }

});









    var preMsg = [
        {name:'拖拉机',num:"1999",wl:"快风",phone:"88888888888"},
        {name:'锄头',num:"1999",wl:"快风",phone:"88888888888"},
        {name:'化肥',num:"1999",wl:"快风",phone:"88888888888"},
        {name:'农药',num:"1999",wl:"快风",phone:"88888888888"},
        {name:'种子',num:"1999",wl:"快风",phone:"88888888888"}];

    var $trpContentItemBox = $(".trpContentItemBox");
    $trpContentItemBox.empty();
    for(var j =0;j<preMsg.length;j++){
        var $trpContentItem = $("<div class='trpContentItem'></div>");
        var $trpContentNum = $("<span class='trpContentNum' style='width:5vw;'></span>");
        var $trpContentTime = $("<span class='trpContentTime c45A6BB' style='width:4vw;'></span>");
        var $trpContentName = $("<span class='trpContentName cEFAA3A' style='width:4vw;'></span>");
        var $trpContentValue = $("<span class='trpContentValue' style='width:4vw;'></span>");
        $trpContentNum.text(preMsg[j].name);
        $trpContentTime.text(preMsg[j].num);
        $trpContentName.text(preMsg[j].wl);
        $trpContentValue.text(preMsg[j].phone);
        $trpContentNum.appendTo($trpContentItem);
        $trpContentTime.appendTo($trpContentItem);
        $trpContentName.appendTo($trpContentItem);
        $trpContentValue.appendTo($trpContentItem);

        $trpContentItem.appendTo($trpContentItemBox);
    }

    $(".presentSearch").click(function(){
        $trpContentItemBox.empty();

        if($("#presentSearchInput").val()==""){
            for(var j =0;j<preMsg.length;j++){
                var $trpContentItem = $("<div class='trpContentItem'></div>");
                var $trpContentNum = $("<span class='trpContentNum' style='width:5vw;'></span>");
                var $trpContentTime = $("<span class='trpContentTime c45A6BB' style='width:4vw;'></span>");
                var $trpContentName = $("<span class='trpContentName cEFAA3A' style='width:4vw;'></span>");
                var $trpContentValue = $("<span class='trpContentValue' style='width:4vw;'></span>");
                $trpContentNum.text(preMsg[j].name);
                $trpContentTime.text(preMsg[j].num);
                $trpContentName.text(preMsg[j].wl);
                $trpContentValue.text(preMsg[j].phone);
                $trpContentNum.appendTo($trpContentItem);
                $trpContentTime.appendTo($trpContentItem);
                $trpContentName.appendTo($trpContentItem);
                $trpContentValue.appendTo($trpContentItem);

                $trpContentItem.appendTo($trpContentItemBox);
            }

        }else{
            for(var j =0;j<preMsg.length;j++){
                if(preMsg[j].name.indexOf($("#presentSearchInput").val()) !=-1){
                        var $trpContentItem = $("<div class='trpContentItem'></div>");
                        var $trpContentNum = $("<span class='trpContentNum' style='width:5vw;'></span>");
                        var $trpContentTime = $("<span class='trpContentTime c45A6BB' style='width:4vw;'></span>");
                        var $trpContentName = $("<span class='trpContentName cEFAA3A' style='width:4vw;'></span>");
                        var $trpContentValue = $("<span class='trpContentValue' style='width:4vw;'></span>");
                        $trpContentNum.text(preMsg[j].name);
                        $trpContentTime.text(preMsg[j].num);
                        $trpContentName.text(preMsg[j].wl);
                        $trpContentValue.text(preMsg[j].phone);
                        $trpContentNum.appendTo($trpContentItem);
                        $trpContentTime.appendTo($trpContentItem);
                        $trpContentName.appendTo($trpContentItem);
                        $trpContentValue.appendTo($trpContentItem);

                        $trpContentItem.appendTo($trpContentItemBox);

                }
            }
        }

    });




    // mapInit();
    $(".content").click(function(){
        $(".placeMsg").css("display","none");

    })
    $("#placeOne").click(function(e){
        e.stopPropagation();
        $(".placeMsg").css("display","none");
        $("#placeMsgOne").css("display","block");
    })
    $("#placeTwo").click(function(e){
        e.stopPropagation();
        $(".placeMsg").css("display","none");
        $("#placeMsgTwo").css("display","block");
    })
    $("#placeThree").click(function(e){
        e.stopPropagation();
        $(".placeMsg").css("display","none");
        $("#placeMsgThree").css("display","block");
    })
    $("#placeFour").click(function(e){
        e.stopPropagation();
        $(".placeMsg").css("display","none");
        $("#placeMsgFour").css("display","block");
    })
    $("#placeFive").click(function(e){
        e.stopPropagation();
        $(".placeMsg").css("display","none");
        $("#placeMsgFive").css("display","block");
    })





        myVar = setInterval(function(){ myTimer() }, 1000);

        function myTimer(){
            var d= new Date();
            var date = d.getFullYear()+'/'+ (d.getMonth()+1)+'/' + d.getDate();
            var time = d.getHours() +':'+ d.getMinutes()+":" +d.getSeconds();

            if(d.getHours()>=10){
                var H = d.getHours();
            }else{
                var H ='0'+ d.getHours();
            }
            if(d.getMinutes()>=10){
                var M = d.getMinutes();
            }else{
                var M ='0'+ d.getMinutes();
            }
            if(d.getSeconds()>=10){
                var S = d.getSeconds();
            }else{
                var S ='0'+ d.getSeconds();
            }

            var time = H +':'+ M+":" + S;

            $(".projectTime").text(date+" "+time)
            $(".titleDate").text(date);
            $(".titleTime").text(time);
        }


});




//初始化地图（高德）
function mapInit(){
    //初始化地图对象，加载地图
    var map = new AMap.Map("mapContainer", {
        resizeEnable: true,
        center: [110.019914,36.505487],//地图中心点
        zoom: 8, //地图显示的缩放级别
        zooms:[8,9]
    });

    var district = null;
    var polygons=[];
    function drawBounds() {
        //加载行政区划插件
        if(!district){
            //实例化DistrictSearch
            var opts = {
                subdistrict: 0,   //获取边界不需要返回下级行政区
                extensions: 'all',  //返回行政区边界坐标组等具体信息
                level: 'district'  //查询行政级别为 市
            };
            district = new AMap.DistrictSearch(opts);
            map.remove(polygons)//清除上次结果
        }

        district.search('延安市', function(status, result) {


            var outer = [
                new AMap.LngLat(-360,90,true),
                new AMap.LngLat(-360,-90,true),
                new AMap.LngLat(360,-90,true),
                new AMap.LngLat(360,90,true),
            ];
            var holes = result.districtList[0].boundaries
            var pathArray = [
                outer
            ];
            pathArray.push.apply(pathArray,holes)
            var polygon = new AMap.Polygon( {
                pathL:pathArray,
                strokeColor: 'rgba(53,97,139,0.6)',
                strokeWeight: 3,
                fillColor: 'rgba(0,0,0,0.5)',
                // fillOpacity: 0.5
            });
            polygon.setPath(pathArray);
            map.add(polygon)
        });

        // 构造官方卫星、路网图层
        var satelliteLayer = new AMap.TileLayer.Satellite();
        var roadNetLayer =  new AMap.TileLayer.RoadNet();

        //批量添加图层
        map.add([satelliteLayer, roadNetLayer]);

        var d = new Date();
        var toDay = d.getFullYear() +"-" + (d.getMonth()+1) + "-" + d.getDate();
        var fromDate = toDay +" " +"00:00:00";
        var toDate = toDay +" " +"23:59:59";




    }
    drawBounds();



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
