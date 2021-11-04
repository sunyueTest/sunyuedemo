var myChart = echarts.init(document.getElementById('pie'));

/**
 * 预加载获取该用户下所有农场信息
 */
$(function () {
    $.ajax({
        type: "get",
        url: "../farmInfo/getList",
        success: function (data) {
            var $roll=$(".roll").empty();
            if(data.state=="success"&&data.size>0){
                var datas=data.datas;
                for(var i=0;i<data.size>0;i++){
                    var $item=$("<div class='farming-info-body-item item'></div>")//onclick='farmingInfoItemClick(datas[i].farmName)'
                    $item.val(datas[i].farmName);
                    $item.attr("farmId",datas[i].id);
                    $item.attr("longitude",datas[i].longitude);
                    $item.attr("latitude",datas[i].latitude);
                    $item.attr("lotid",datas[i].lotId);
                    $item.click(function () {
                        farmingInfoItemClick(this.value,$(this).attr("farmid"),
                            $(this).attr("longitude"),$(this).attr("latitude"),$(this).attr("lotid"));
                    })
                    var $img=$('<img class="show-info-img" src="../../img/farm/farm_info_1.jpg">')
                    $img.attr("src",datas[i].imgUrl);
                    $img.appendTo($item);
                    var $title=$('<span class="show-info-item_title"></span>');
                    $title.text(datas[i].farmName);
                    $title.appendTo($item);
                    var $address=$('<div class="show-address"></div>');
                    var $span1=$('<span></span></br>');
                    $span1.text("地址："+datas[i].farmAddress);
                    $span1.appendTo($address);
                    var $span2=$('<span></span></br>');
                    $span2.text("联系方式："+datas[i].tel);
                    $span2.appendTo($address);
                    var $span3=$('<span></span></br>');
                    $span3.text("种植作物："+datas[i].crops);
                    $span3.appendTo($address);
                    $address.appendTo($item);
                    $item.appendTo($roll);
                    if(i!=(datas.size-1)){
                        var $line=$('<div class="item-line"></div>');
                        $line.appendTo($roll);
                    }
                }

                farmingInfoItemClick(datas[0].farmName,datas[0].id,datas[0].longitude,datas[0].latitude,datas[0].lotId);
            }
        }
    })
    //大屏名字变动随着中性变化
    $.post("../user/selUserDetails", {}, function (res) {
        if (res.state == 'success' && res.data.info) {
            $("#screenTitle").html(res.data.info.company);
            //<span id="screenTitle"></span>
        }
    });
})

/**
 * 点击农场
 * 传入农场名称与ID
 * 名称用于地图显示，ID用于获取农场下的设备
 */
function farmingInfoItemClick(name,id,longitude,latitude,lotId) {
    console.log("farmingInfoItemClick")
    //获取农场下的设备
    initDevice(id);
    initMap(name,longitude,latitude,lotId);
    initChart(id);
}

/**
 * 根据农场Id获取农场下所有设备信息
 */
function initDevice(id) {
    document.getElementById('rightList').innerHTML = '';
    layui.use('layer', function () {
        layer.load(2);
        $.ajax({
            url: "../newFarmInfo/getFarmDeviceList",
            data: {
                farmId:id
            },
            dataType: "json",
            type: "get",
            timeout: 30000,
            error: function (data, type, err) {
                console.log(err);
                layer.closeAll('loading');
                layer.msg($.i18n.prop('fail'), {
                    offset: '6px'
                }, {icon: 2});
            },
            success: function (data) {
                layer.closeAll('loading');
                console.log(data)
                findWeather(data.datas[0].longitude+","+data.datas[0].latitude);
                getSensorDataWhile(data.datas, 0);
            }
        });
    });
}

/**
 * getSensorDataWhile
 * getSensorData
 * getSensorLi
 * 这三个方法。。。。。真心捋不出来是干啥用的
 * 设备的列表的东西。。。多了没捋明白
 */
function getSensorDataWhile(data, number) {
    console.log(number)
    if (number >= data.length) {
        return
    }
    var datai = data[number];
    console.log(datai)
    if (datai != '' || datai.length > 0) {
        getSensorData(datai.deviceNumber, datai.name, datai.time);
        addMarker(datai.longitude, datai.latitude);
        return getSensorDataWhile(data, ++number);
    }
}
function getSensorData(ncode, name, time) {
    $.ajax({
        url: "/monitor/getSensorData",
        data: {
            deviceNumber: ncode
        },
        success: function (result) {
            if (result.data) {
                var type = result.data.type;
                var data = result.data.data;
                document.getElementById('rightList').innerHTML +=
                    getSensorLi(time, ncode, name, data, type);
            }
        }
    });
}
function getSensorLi(updateTime, deviceNumber, deviceName, data, type) {
    var header = '<li class="position-item">' +
        '<div class="item-update horizontal">' +
        '更新于&nbsp:&nbsp' + updateTime +
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
    var last = '</div></div></li>';
    for (let i = 0; i < type.length; i++) {
        header += '<div class="item-sensor-data"><span class="item-data-span">' +
            type[i].substring(type[i].indexOf("-") + 1) +
            '</span><span style="color:#fff">' + data[i] +
            '</span></div>';
    }
    return header + last;
}

/**
 * 地图显示
 */
function initMap(name,longitude,latitude,lotId) {
    //高德地图
    map = new AMap.Map("container", {
        viewMode: '3D',
        pitch: 50,
        resizeEnable: true,
        center: [longitude,latitude],
        zoom: 11,
        lang: language //可选值：en，zh_en, zh_cn
    });
    lot(lotId);
}

/**
 * 农作物饼状图展示展示
 */
function initChart(farmInfoId) {
    myChart.clear();
    $.ajax({
        url: "/farmCrops/getList",
        data: {
            size:10,
            farmInfoId: farmInfoId
        },
        success: function (result) {
            var series = [],
                color = ['#dc1439', '#e6b600', '#053afe', '#dc1439', '#e6b600', '#053afe', '#dc1439'],
                itemHeight = 10, itemGap = 5,
                difference = 2,
                titleData = [];
            if (result.state=="success") {
                if(result.datas!=null&&result.datas.length>0){
                    var num=result.count;
                    //页面农作物滚动页面展示
                    findCropsList(num,result.datas);
                    for(var i=0;i<num;i++){
                        titleData.push(result.datas[i].cropsName+"("+result.datas[i].growthCycle+")")
                        var val = result.datas[i].plantingDays;
                        var total=result.datas[i].totalDays;
                        var data = {
                            name: titleData[i],
                            type: 'pie',
                            clockWise: false, //顺时加载
                            hoverAnimation: false, //鼠标移入变大
                            radius: [160 - i * itemHeight - i * itemGap - i * difference, 150 - i * itemHeight - i * itemGap - i * difference],
                            itemStyle: placeHolderStyle,
                            label: {
                                normal: {
                                    show: false,
                                }
                            },
                            data: [{
                                value: val,
                                itemStyle: {
                                    normal: {
                                        color: color[i]//'#dc1439'
                                    }
                                }
                            },
                                {
                                    value: total - val,
                                    // total - 28,
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

                    var option = {
                        title: {
                            text: data.title,//主标题
                            // subtext: '26℃',//副标题
                            textStyle: {//主标题样式
                                color: '#99CC66',
                                fontWeight: 'bold',
                                fontSize: 16
                            },
                            left: 'center',
                            top: 'middle'
                        },
                        tooltip: {
                            show: true,
                            trigger: 'item',//提示框触发类型，item数据项图形触发，主要应用于无类目轴的图表（散点图、饼形图等）
                            formatter: function (params, ticket, callback) {//第一个参数数据集、第二个参数是异步回调标志、第三个参数是异步回调
                                return params.seriesName + ": " + params.value + "天";//系列名称：数据值
                            }
                        },
                        color: color,
                        // color: ['#dc1439', '#e6b600', '#053afe'],//调色盘颜色列表，默认情况下图例和饼形环图颜色使用
                        legend: {
                 /*           top: 6 * itemGap,*/
                            top:"10",
                            right: "10",
                            itemHeight: itemHeight,//图例的高度
                            itemGap: itemGap,//图例之间的间距        
                            data: titleData,//图例的数据数组
                            textStyle: {
                                color: '#fff'
                            },
                            selectedMode: true,//图例选择模式
                            orient: "vertical"//图例布局方式
                        },
                        series: data.series
                    };
                    myChart.setOption(option);
                }
            }
        }
    });
}

/**
 * 向农作物展示DIV插入该农场下的农作物
 */
findCropsList=function(num,data){
    var $bottomUlLi=$(".bottom-ul-li").empty();
    if(num>0&&data.length>0){
        var $li;
        var $div;
        var $number;
        var $name;
        var $address;
        var $area;
        var $day;
        var $cycle;
        for(var i=0;i<num;i++){
            $li=$("<li></li>");
            $div=$("<div class='bottom-item-body'></div>");
            $number=$('<span class="bottom-item-number"></span>');
            $number.text(data[i].cropsNumber);
            $name=$('<span class="bottom-item-name"></span>');
            $name.text(data[i].cropsName);
            $address=$('<span class="bottom-item-address"></span>');
            $address.text(data[i].landNumber);
            $area=$('<span class="bottom-item-area"></span>');
            $area.text(data[i].landArea);
            $day=$('<span class="bottom-item-day"></span>');
            $day.text(data[i].plantingDays);
            $cycle=$('<span class="bottom-item-cycle"></span>');
            $cycle.text(data[i].growthCycle);
            $number.appendTo($div);
            $name.appendTo($div);
            $address.appendTo($div);
            $area.appendTo($div);
            $day.appendTo($div);
            $cycle.appendTo($div);
            $div.appendTo($li);
            $li.appendTo($bottomUlLi);
        }
    }
}

/**
 * 插入所在位置实时天气
 */
findWeatherValue=function (data) {
    if(data.HeWeather6[0].status=="ok"){
        //位置
        var weatherAddress=data.HeWeather6[0].basic.admin_area+"/"+data.HeWeather6[0].basic.parent_city;
        //温度
        var weatherTemperature=data.HeWeather6[0].now.tmp+"℃";
        //湿度
        var weatherHumidity=data.HeWeather6[0].now.hum+"%rh";
        //风力
        var weatherWindPower=data.HeWeather6[0].now.wind_sc+"mps";
        //天气实况
        var cond_txt=data.HeWeather6[0].now.cond_txt;
        //风向
        var weatherWindDirection=data.HeWeather6[0].now.wind_dir;
        $("#weatherAddress").text(weatherAddress);
        $("#weatherTemperature").text(weatherTemperature);
        $("#weatherHumidity").text(weatherHumidity);
        $("#cond_txt").text(cond_txt);
        $("#weatherWindDirection").text(weatherWindDirection);
        $("#weatherWindPower").text(weatherWindPower);
    }
}

/**
 * 实例化点标记
 */
function addMarker(lng, lat) {
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

placeHolderStyle = {
    normal: {
        label: {
            show: false,
        },
        labelLine: {
            show: false,
        }
    }
};
