var dangerCharts;
var devicePie;
var environmentBar;
var landBar;
var yujing = [60, 70, 80, 90, 90, 40, 45, 99];//预警雷达图
var weatherbarArr = {};
var dangerMsgList = '';
// var baseCameraLength=0;
var camerNumberList = [];
var menuData = [
    {
        "id": 1,
        "type": 1,
        "name": "国家项目1",
        "construction_company": "恒大集团",
        "supporting_company": "恒大集团",
        "website": "www.hengda.com",
        "logo": "tupian.logo",
        "create_user": "user",
        "create_time": "2019-04-12 14:20:21",
        "bases": [
            {
                "id": 1,
                "project_id": 1,
                "name": "市级示范基地1",
                "ycoordinate": 36.102,
                "ccoordinate": 102.412,
                "create_user": "chanmufeng",
                "create_time": "2019-04-12 14:20:21"
            },
            {
                "id": 2,
                "project_id": 1,
                "name": "市级示范基地2",
                "ycoordinate": 36.102,
                "ccoordinate": 102.412,
                "create_user": "chanmufeng",
                "create_time": "2019-04-12 14:20:21"
            },
            {
                "id": 2,
                "project_id": 1,
                "name": "市级示范基地2",
                "ycoordinate": 36.102,
                "ccoordinate": 102.412,
                "create_user": "chanmufeng",
                "create_time": "2019-04-12 14:20:21"
            }
        ]
    },
    {
        "id": 2,
        "type": 1,
        "name": "国家项目2",
        "construction_company": "恒小集团",
        "supporting_company": "恒小集团",
        "website": "www.hengda.com",
        "logo": "tupian.logo",
        "create_user": "user",
        "create_time": "2019-04-12 14:20:21",
        "bases": [
            {
                "id": 1,
                "project_id": 2,
                "name": "服务中心1",
                "ycoordinate": 36.102,
                "ccoordinate": 102.412,
                "create_user": "chanmufeng",
                "create_time": "2019-04-12 14:20:21"
            },
            {
                "id": 2,
                "project_id": 2,
                "name": "服务中心2",
                "ycoordinate": 36.102,
                "ccoordinate": 102.412,
                "create_user": "chanmufeng",
                "create_time": "2019-04-12 14:20:21"
            },
            {
                "id": 3,
                "project_id": 2,
                "name": "服务中心3",
                "ycoordinate": 36.102,
                "ccoordinate": 102.412,
                "create_user": "chanmufeng",
                "create_time": "2019-04-12 14:20:21"
            },
            {
                "id": 4,
                "project_id": 2,
                "name": "服务中心4",
                "ycoordinate": 36.102,
                "ccoordinate": 102.412,
                "create_user": "chanmufeng",
                "create_time": "2019-04-12 14:20:21"
            }
            ,
            {
                "id": 5,
                "project_id": 2,
                "name": "服务中心5",
                "ycoordinate": 36.102,
                "ccoordinate": 102.412,
                "create_user": "chanmufeng",
                "create_time": "2019-04-12 14:20:21"
            }
        ]
    },
    {
        "id": 3,
        "type": 1,
        "name": "国家项目3",
        "construction_company": "恒中集团",
        "supporting_company": "恒中集团",
        "website": "www.hengda.com",
        "logo": "tupian.logo",
        "create_user": "user",
        "create_time": "2019-04-12 14:20:21",
        "bases": [
            {
                "id": 1,
                "project_id": 3,
                "name": "培训基地1",
                "ycoordinate": 36.102,
                "ccoordinate": 102.412,
                "create_user": "chanmufeng",
                "create_time": "2019-04-12 14:20:21"
            },
            {
                "id": 2,
                "project_id": 3,
                "name": "培训基地2",
                "ycoordinate": 36.102,
                "ccoordinate": 102.412,
                "create_user": "chanmufeng",
                "create_time": "2019-04-12 14:20:21"
            },
            {
                "id": 2,
                "project_id": 3,
                "name": "培训基地3",
                "ycoordinate": 36.102,
                "ccoordinate": 102.412,
                "create_user": "chanmufeng",
                "create_time": "2019-04-12 14:20:21"
            },
            {
                "id": 3,
                "project_id": 3,
                "name": "培训基地4",
                "ycoordinate": 36.102,
                "ccoordinate": 102.412,
                "create_user": "chanmufeng",
                "create_time": "2019-04-12 14:20:21"
            }
            ,
            {
                "id": 4,
                "project_id": 4,
                "name": "培训基地4",
                "ycoordinate": 36.102,
                "ccoordinate": 102.412,
                "create_user": "chanmufeng",
                "create_time": "2019-04-12 14:20:21"
            },
            {
                "id": 5,
                "project_id": 5,
                "name": "培训基地5",
                "ycoordinate": 36.102,
                "ccoordinate": 102.412,
                "create_user": "chanmufeng",
                "create_time": "2019-04-12 14:20:21"
            }
            ,
            {
                "id": 6,
                "project_id": 6,
                "name": "培训基地6",
                "ycoordinate": 36.102,
                "ccoordinate": 102.412,
                "create_user": "chanmufeng",
                "create_time": "2019-04-12 14:20:21"
            }
        ]
    }
];
/**
 *初始化layui
 */
let layer;
layui.use(['form', 'layer', 'layedit', 'laydate'], function () {
    layer = layui.layer;
    $.ajax({
        url: "/sysUserOrder/findNotAcceptedOrderList",
        type: "POST",
        success: function (res) {
            if(res.state=="success"&&res.data[0]>0){
                layer.msg(res.data[1]);
            }
        }
    });
});

var indicator = [];
var deviceNum = 0;
var onLineDevice = 0;
var offLineDevice = 0;
$(function () {


    /**
     * 一级公司名称列表渲染插入
     */
    var navsum = new Array;

    function getlistnav() {
        $.ajax({
            url: "/projectBaseScene/findEntperpriseList",
            type: "POST",
            data: {
                size: 200,
                page: 1,
            },
            success: function (res) {
                let html = '';
                $.each(res.datas, function (i, item) {
                    navsum.push(item.id);
                    html += '<li class="layui-nav-item nav-li" data-id="' + item.id + '">' +
                        '<a href="javascript:;" class="gs">' + item.name + '</a>' +
                        '<div class="layui-nav-child  nav-xm">' +
                        '</div>' +
                        '</li>'
                });
                $('#nav-left').append(html);
                getlistxm();
                // allinitialize();

            }
        });
    }

    getlistnav();
    /**
     * 二级项目名称列表渲染插入
     * 渲染二级列表时会同时初始化页面
     */
    var navxm = new Array;

    function getlistxm() {
        for (var i = 0; i < navsum.length; i++) {
            let id = navsum[i];
            let index = i;
            $.ajax({
                async: false,
                url: "/projectBaseScene/findProjectList?entperpriseId=" + id,
                type: "POST",
                data: {
                    size: 200,
                    page: 1,
                },
                success: function (res) {
                    // console.log(res);
                    let html = '';
                    $.each(res.datas, function (i, item) {
                        navxm.push(item.id);
                        html += '                      <div class="layui-nav-item nav-jd" data-id="' + item.id + '" id="' + item.id + '">\n' +
                            '                            <a href="javascript:;" class="xmbg">' + item.name + '</a>\n' +
                            '                        </div>'
                    });
                    $('.nav-xm').eq(index).append(html);
                }
            });
            if (i == navsum.length - 1) {
                getlistjd();
                jdinitialize(navxm);
            }
        }
    }

    /**
     * 三级基地名称
     */
    function getlistjd() {
        for (var i = 0; i < navxm.length; i++) {
            let id = navxm[i];
            $.ajax({
                url: "/projectBaseScene/findBaseList?projectId=" + id,
                type: "POST",
                data: {
                    size: 200,
                    page: 1,
                },
                success: function (res) {
                    let html = '';
                    $.each(res.datas, function (i, item) {
                        html += '<div class="layui-nav-child base item" baseid="' + item.id + '" basename="' + item.name + '" baseuser="' + item.createUser + '"  lon="' + item.longitude + '" lat="' + item.latitude + '">' + item.name + '</div>'
                    });
                    $('#' + id).append(html);
                    //初始化默认加载第一个，目前实现不完善，在想别的办法
                    // $(".item").eq(0).trigger("click");
                    layui.use('element', function () {
                        var element = layui.element; //导航的hover效果、二级菜单等功能，需要依赖element模块
                    });
                }
            });
        }
    }

    // $(document).$(".item").eq(0).trigger("click");
    /**
     * 点击切换
     */
    $(document).on('click', '.item', function () {
        $('.item').removeClass('baseac')
        $(this).addClass('baseac')
        let lon = $(this).attr('lon');
        let lat = $(this).attr('lat');
        let name = $(this).attr('basename');
        let user = $(this).attr("baseUser");
        let id = $(this).attr("baseId");
        map.centerAndZoom(new BMap.Point(lon, lat), 12);
        //初始化设备为0
        deviceNum = 0;
        onLineDevice = 0;
        offLineDevice = 0;
        //添加基地信息
        $(".p1").empty();
        $(".p2").empty();
        $(".p3").empty();
        $(".p1").text("名称：" + name);
        $(".p2").text("负责人：" + user);
        $(".rightOneBoxPhoto").css("display", "inline-block");
        //点击基地获取基地下对应的场景
        getScene(id);
        addMarker(lon, lat, name)
    });
    /**
     * 分级导航二级菜单选中样式
     */
    $(document).on('click', '.nav-jd', function () {
        $('.nav-jd').removeClass('layui-this');
    });


    /**
     * 页面加载初始化
     * 取默认第一个公司下的第一个基地的第一个设备
     * navsum 全部公司id数组、同步进行
     */
    function jdinitialize(navxm) {
        var fige = '';
        for (var i = 0; i < navxm.length; i++) {
            if (!fige) {
                $.ajax({
                    async: false,
                    url: "/projectBaseScene/findBaseList?projectId=" + navxm[i],
                    type: "POST",
                    data: {
                        size: 200,
                        page: 1,
                    },
                    success: function (res) {
                        if (res.datas.length > 0) {
                            let lon = res.datas[0].longitude;
                            let lat = res.datas[0].latitude;
                            let name = res.datas[0].name;
                            let user = res.datas[0].createUser;
                            let id = res.datas[0].id;
                            map.centerAndZoom(new BMap.Point(lon, lat), 12);
                            //初始化设备为0
                            deviceNum = 0;
                            onLineDevice = 0;
                            offLineDevice = 0;
                            //添加基地信息
                            $(".p1").empty();
                            $(".p2").empty();
                            $(".p3").empty();
                            $(".p1").text("名称：" + name);
                            $(".p2").text("负责人：" + user);
                            $(".rightOneBoxPhoto").css("display", "inline-block");
                            //点击基地获取基地下对应的场景
                            getScene(id);
                            addMarker(lon, lat, name);
                            fige = true;
                            console.log(fige);
                        }
                    }
                });
            }
        }
    }

    var wHeight = $(window).height();
    $(".contentBox").height(wHeight - 10);
    $("#mapContainer").height(wHeight);
    $(".itemBox").height($(".leftBox").height() - $(".searchBox").height() - 15 - 30);
    // $(".cameraBox").height($(".rightOneBox").height() - $(".rightOneBoxTop").height() - 40);
    $(".dangerMsgItem").height($("#dangerCharts").height() - 32 - 10);
    $(".allMapBox").height($(".rightThreeBox").height() - $(".allMapTitleBox").height() - 10);
    $("#devicePie").height($(".rightFourBox").height());
    $("#environmentBar").height($(".rightFiveBox").height());
    $("#landBar").height($(".rightSixBox").height());
    initMap();


    /*    addMenu(menuData);*/

    //获取左侧菜单信息
    getLeftItem();


    $(window).resize(function () {
        var wHeight = $(window).height();
        $(".contentBox").height(wHeight - 10);
        $("#mapContainer").height(wHeight);
        $("#mapContainer").backgroundColor("red");
        $(".itemBox").height($(".leftBox").height() - $(".searchBox").height() - 15 - 30);
        $(".cameraBox").height($(".rightOneBox").height() - $(".rightOneBoxTop").height() - 40);
        $(".dangerMsgItem").height($("#dangerCharts").height() - 32 - 10);
        $(".allMapBox").height($(".rightThreeBox").height() - $(".allMapTitleBox").height() - 10);
        $("#devicePie").height($(".rightFourBox").height());
        $("#environmentBar").height($(".rightFiveBox").height());
        $("#landBar").height($(".rightSixBox").height());

        for (var m = 0; m < camerNumberList.length; m++) {
            getCamareUrl(camerNumberList[m].cameraId, m);
        }
    })


    $(".pano_close").click(function () {
        $(".isMap").css("display", "block");
    });


    $("#mapContainer").bind("contextmenu", function () {
        $(".isMap").css("display", "block");
        return false;
    });
});


// 地图加载
function initMap() {

    map = new BMap.Map('mapContainer');
    var point = new BMap.Point(120.305456, 31.570037);
    map.centerAndZoom(point,13);

/*     var myIcon = new BMap.Icon('/static/img/agriculture/marker.png',new BMap.Size(43,68));
     var marker = new BMap.Marker(point,{icon:myIcon});
     map.addOverlay(marker);*/







    map.enableScrollWheelZoom(true);
    // 覆盖区域图层测试
    map.addTileLayer(new BMap.PanoramaCoverageLayer());

    var stCtrl = new BMap.PanoramaControl(); //构造全景控件
    stCtrl.setOffset(new BMap.Size(20, 10));
    map.addControl(stCtrl);//添加全景控件
    map.setMapStyleV2({styleJson: styleJson});



    //创建小狐狸




    map.onclick = function (e) {
        /*        var panorama = new BMap.Panorama('allMapBox');
                panorama.setPov({heading: -40, pitch: 6});
                panorama.setPosition(new BMap.Point(e.point.lng, e.point.lat)); //根据经纬度坐标展示全景图*/
        $(".rightThreeBox").hide();
        $(".rightThreeBoxMb").hide();

        $(".isMap").css("display", "none");

        //没安装flash时，提示下载地址
        setTimeout(function () {
            for(var j =0;j<$("#mapContainer").find("div").length;j++){
                if($("#mapContainer").find("div").eq(j).text()=="您未安装Flash Player播放器或者版本过低"){
                    $("#mapContainer").find("div").eq(j).html('您未安装Flash Player播放器或者版本过低' + '<a href="http://www.macromedia.com/go/getflashplayer" style="color:#afafaf;font-size:1rem;cursor: pointer"  target="_blank">请点击此处下载安装最新的flash插件</a>');
                }
            }
        }, 500);
    };
}

/**
 * 实例化点标记
 */
var mapimgsrc = 'http://demo.sennor.net:885/file/3bc22d3a156e4209a19830a86177d825.png';

function addMarker(lon, lat, name, index) {
    var point = new BMap.Point(lon, lat);
    // var myIcon = new BMap.Icon(mapimgsrc, new BMap.Size(80, 80), {
    //     anchor: new BMap.Size(10, 25),
    //     imageOffset: new BMap.Size(0, 0 - index * 25)   // 设置图片偏移
    // });

    var myIcon = new BMap.Icon('/static/img/agriculture/marker.png',new BMap.Size(43,68));
    var marker = new BMap.Marker(point,{icon:myIcon});
    map.addOverlay(marker);



    map.addOverlay(marker);
    addClickHandler(name, marker);
}

//初始化预警雷达图
function initDangerCharts() {
    dangerCharts = echarts.init(document.getElementById('dangerCharts'));
    dangerCharts.clear();
    var legendData = ['预警']; //图例
    indicator = [{
        text: '湿度',
        max: 150,
    },
        {
            text: '光照度',
            max: 150
        },
        {
            text: '虫害',
            max: 150
        },
        {
            text: '土壤PH',
            max: 150,
        },
        {
            text: '土壤湿度',
            max: 150
        },
        {
            text: '土壤温度',
            max: 150
        },
        {
            text: '土壤电导率',
            max: 150
        },
        {
            text: '湿度',
            max: 150
        }
    ];


    var pointVal = [100, 100, 100, 100, 100, 100, 100, 100];
    var dataArr = [{
        value: pointVal,
        name: legendData[0],
        itemStyle: {
            normal: {
                lineStyle: {
                    color: '#4A99FF',
                    // shadowColor: '#4A99FF',
                    // shadowBlur: 10,
                },
                shadowColor: '#4A99FF',
                shadowBlur: 10,
            },
        },
        areaStyle: {
            normal: { // 单项区域填充样式
                color: {
                    type: 'linear',
                    x: 0, //右
                    y: 0, //下
                    x2: 1, //左
                    y2: 1, //上
                    colorStops: [{
                        offset: 0,
                        color: '#4A99FF'
                    }, {
                        offset: 1,
                        color: 'rgba(0,0,0,0)'
                    }, {
                        offset: 0.2,
                        color: '#4A99FF'
                    }],
                    globalCoord: false
                },
                opacity: 1 // 区域透明度
            }
        }
    }
    ];
    var colorArr = ['#4A99FF']; //颜色
    option = {
        backgroundColor: '',
        color: colorArr,
        // 图表的位置
        grid: {
            position: 'center',
        },
        /*     legend: {
                 orient:'vertical',
                 icon: 'circle', //图例形状
                 data: legendData,
                 bottom:35,
                 right:40,
                 itemWidth: 14, // 图例标记的图形宽度。[ default: 25 ]
                 itemHeight: 14, // 图例标记的图形高度。[ default: 14 ]
                 itemGap: 21, // 图例每项之间的间隔。[ default: 10 ]横向布局时为水平间隔，纵向布局时为纵向间隔。
                 textStyle: {
                     fontSize: 14,
                     color: '#00E4FF',
                 },
             },*/
        radar: {
            // shape: 'circle',
            name: {
                textStyle: {
                    color: '#fff',
                    fontSize: 12
                },
            },
            "center": ["40%", "50%"],
            "radius": "40%",
            indicator: indicator,
            splitArea: { // 坐标轴在 grid 区域中的分隔区域，默认不显示。
                show: true,
                areaStyle: { // 分隔区域的样式设置。
                    color: ['rgba(255,255,255,0)', 'rgba(255,255,255,0)'], // 分隔区域颜色。分隔区域会按数组中颜色的顺序依次循环设置颜色。默认是一个深浅的间隔色。
                }
            },
            axisLine: { //指向外圈文本的分隔线样式
                lineStyle: {
                    color: '#fff'
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#fff', // 分隔线颜色
                    width: 1, // 分隔线线宽
                }
            },
        },
        series: [{
            type: 'radar',
            symbolSize: 5,
            // symbol: 'angle',
            data: dataArr
        }]
    };
    dangerCharts.setOption(option);
}

//初始化设备状态
function initDevicePie() {
    devicePie = echarts.init(document.getElementById('devicePie'));
    devicePie.clear();
    data = [{
        name: "总 设 备",
        value: deviceNum
    },
        {
            name: "在线设备",
            value: onLineDevice
        },
        {
            name: "离线设备",
            value: offLineDevice
        },
        {
            name: "异常设备",
            value: 0
        }
    ];
    arrName = getArrayValue(data, "name");
    arrValue = getArrayValue(data, "value");
    sumValue = eval(arrValue.join('+'));
    objData = array2obj(data, "name");
    optionData = getData(data)

    function getArrayValue(array, key) {
        var key = key || "value";
        var res = [];
        if (array) {
            array.forEach(function (t) {
                res.push(t[key]);
            });
        }
        return res;
    }

    function array2obj(array, key) {
        var resObj = {};
        for (var i = 0; i < array.length; i++) {
            resObj[array[i][key]] = array[i];
        }
        return resObj;
    }

    function getData(data) {
        var res = {
            series: [],
            yAxis: []
        };
        for (let i = 0; i < data.length; i++) {
            // console.log([70 - i * 15 + '%', 67 - i * 15 + '%']);
            res.series.push({
                name: '',
                type: 'pie',
                clockWise: false, //顺时加载
                hoverAnimation: false, //鼠标移入变大
                radius: [73 - i * 15 + '%', 68 - i * 15 + '%'],
                center: ["30%", "55%"],
                label: {
                    show: false
                },
                itemStyle: {
                    label: {
                        show: false,
                    },
                    labelLine: {
                        show: false
                    },
                    borderWidth: 5,
                },
                data: [{
                    value: data[i].value,
                    name: data[i].name
                }, {
                    value: sumValue - data[i].value,
                    name: '',
                    itemStyle: {
                        color: "rgba(0,0,0,0)",
                        borderWidth: 0
                    },
                    tooltip: {
                        show: false
                    },
                    hoverAnimation: false
                }]
            });
            res.series.push({
                name: '',
                type: 'pie',
                silent: true,
                z: 1,
                clockWise: false, //顺时加载
                hoverAnimation: false, //鼠标移入变大
                radius: [73 - i * 15 + '%', 68 - i * 15 + '%'],
                center: ["30%", "55%"],
                label: {
                    show: false
                },
                itemStyle: {
                    label: {
                        show: false,
                    },
                    labelLine: {
                        show: false
                    },
                    borderWidth: 5,
                },
                data: [{
                    value: 7.5,
                    itemStyle: {
                        color: "#0068b7",
                        borderWidth: 0
                    },
                    tooltip: {
                        show: false
                    },
                    hoverAnimation: false
                }, {
                    value: 2.5,
                    name: '',
                    itemStyle: {
                        color: "rgba(0,0,0,0)",
                        borderWidth: 0
                    },
                    tooltip: {
                        show: false
                    },
                    hoverAnimation: false
                }]
            });
            res.yAxis.push((data[i].value / sumValue * 100).toFixed(2) + "%");
        }
        return res;
    }

    option = {
        backgroundColor: '',
        legend: {
            show: true,
            icon: "circle",
            top: "center",
            left: '55%',
            data: arrName,
            width: 25,
            padding: [0, 5],
            itemGap: 25,
            formatter: function (name) {
                return "{title|" + name + "}     {value|" + (objData[name].value) + "}{title|台}"
            },

            textStyle: {
                rich: {
                    title: {
                        fontSize: 12,
                        lineHeight: 12,
                        color: "#fff"
                    },
                    value: {
                        fontSize: 12,
                        lineHeight: 12,
                        color: "#fff"
                    }
                }
            },
        },
        tooltip: {
            show: true,
            trigger: "item",
            formatter: "{a}<br>{b}:{c}({d}%)"
        },
        color: ['#0068b7 ', '#80c269', '#00ffff', '#fff45c'],
        grid: {
            top: '16%',
            bottom: '53%',
            left: "30%",
            containLabel: false
        },
        yAxis: [{
            type: 'category',
            inverse: true,
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                interval: 0,
                inside: true,
                textStyle: {
                    color: "#fff",
                    fontSize: 16,
                },
                show: false
            },
            data: optionData.yAxis
        }],
        xAxis: [{
            show: false
        }],
        series: optionData.series
    };

    devicePie.setOption(option);
}


//初始化实时环境数据
function initEnvironmentBar(deviceNumber) {
    environmentBar = echarts.init(document.getElementById('environmentBar'));
    environmentBar.clear();


    $.ajax({
        type: "POST",
        url: "../monitor/getSensorDataByDayCountNew",
        data: {
            "deviceNumber": deviceNumber,
            "dayCount": 7
        },
        async: false,
        dataType: "json",
        success: function (res) {
            if (res.state == "success" && res.data) {
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
                    var weatherNum = 0;
                    for (var q = 0; q < newKeyArr.length; q++) {
                        var serverObj = {};
                        if (newKeyArr[q] == "温度" || newKeyArr[q] == "湿度" || newKeyArr[q] == "光照度" || newKeyArr[q] == "雨量") {
                            var weatherColor = ["#0068b7", "#80c269", '#00ffff', "#fff45c"];
                            weatherNum++;
                            var ss = newKeyArr[q];
                            var cArr = [];
                            for (var c = 0; c < 7; c++) {
                                cArr.push(Number(lastObj[ss][c]));
                            }

                            serverObj.name = ss;
                            serverObj.type = 'bar';
                            serverObj.data = cArr;
                            serverObj.barWidth = 8;
                            serverObj.barGap = 0;
                            serverObj.type = 'bar';
                            serverObj.label = {//图形上的文本标签
                                normal: {
                                    show: false,
                                    position: 'top',
                                    textStyle: {
                                        color: weatherColor[weatherNum],
                                        fontStyle: 'normal',
                                        fontFamily: '微软雅黑',
                                        fontSize: 10,
                                    },
                                },
                            };
                            serverObj.itemStyle = {
                                normal: {
                                    color: weatherColor[weatherNum],
                                }

                            };

                            server.push(serverObj);


                        }
                    }


                    var timeData = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
                    var option = {
                        title: {
                            text: "",
                            left: "15",
                            top: "3",
                            textStyle: {
                                color: "#fff",
                                fontSize: 14
                            }
                        },
                        tooltip: { //提示框组件
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow',
                                label: {
                                    backgroundColor: ''
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
                            top: '25%',
                            left: '2%',
                            right: '5%',
                            bottom: '5%',
                            containLabel: true
                        },
                        legend: {//图例组件，颜色和名字
                            center: "0",
                            top: "5%",
                            itemWidth: 16,
                            itemHeight: 12,
                            itemGap: 5,
                            data: [{
                                name: '温度',
                            }, {
                                name: '湿度',
                            },
                                {
                                    name: '光照度',
                                },
                                {
                                    name: '雨量',
                                }],
                            textStyle: {
                                color: '#ffffff',
                                fontStyle: 'normal',
                                fontFamily: '微软雅黑',
                                fontSize: 10,
                            }
                        },
                        xAxis: [
                            {
                                type: 'category',
                                boundaryGap: true,//坐标轴两边留白
                                data: timeData,
                                axisLabel: { //坐标轴刻度标签的相关设置。
                                    interval: 0,//设置为 1，表示『隔一个标签显示一个标签』
                                    margin: 8,
                                    textStyle: {
                                        color: '#ffffff',
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
                                        color: '#fff',
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
                                        color: '#ffffff',
                                        fontStyle: 'normal',
                                        fontFamily: '微软雅黑',
                                        fontSize: 10,
                                    }
                                },
                                axisLine: {
                                    lineStyle: {
                                        color: '#fff',
                                        opacity: 0.2
                                    }
                                },
                                axisTick: {
                                    show: false
                                },
                                splitLine: {
                                    show: true,
                                    lineStyle: {
                                        color: ['#fff'],
                                        opacity: 0.06
                                    }
                                }

                            }
                        ],
                        series: server
                    };

                    environmentBar.setOption(option);


                }

            } else {

            }
        },
        error: function (e) {
            console.log(e);
        }
    });


}

//初始化土地墒情
function initLandBar(deviceNumber) {
    landBar = echarts.init(document.getElementById('landBar'));
    landBar.clear();
    $.ajax({
        type: "POST",
        url: "../monitor/getSensorDataByDayCountNew",
        data: {"deviceNumber": deviceNumber,
                "dayCount":7
        },
        async: false,
        dataType: "json",
        success: function (res) {
            if (res.state == "success" && res.data) {
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
                    var weatherNum = 0;
                    for (var q = 0; q < newKeyArr.length; q++) {
                        var serverObj = {};
                        if (newKeyArr[q] == "土壤温度" || newKeyArr[q] == "土壤湿度" || newKeyArr[q] == "土壤电导率" || newKeyArr[q] == "土壤PH") {
                            var weatherColor = ["#0068b7", "#80c269", '#00ffff', "#fff45c"];
                            weatherNum++;
                            var ss = newKeyArr[q];
                            var cArr = [];
                            for (var c = 0; c < 7; c++) {
                                cArr.push(Number(lastObj[ss][c]));
                            }

                            serverObj.name = ss;
                            serverObj.type = 'bar';
                            serverObj.data = cArr;
                            serverObj.barWidth = 8;
                            serverObj.barGap = 0;
                            serverObj.type = 'bar';
                            serverObj.label = {//图形上的文本标签
                                normal: {
                                    show: false,
                                    position: 'top',
                                    textStyle: {
                                        color: weatherColor[weatherNum],
                                        fontStyle: 'normal',
                                        fontFamily: '微软雅黑',
                                        fontSize: 10,
                                    },
                                },
                            };
                            serverObj.itemStyle = {
                                normal: {
                                    color: weatherColor[weatherNum],
                                }

                            };

                            server.push(serverObj);


                        }
                    }


                    var timeData = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
                    var option = {
                        title: {
                            text: "",
                            left: "15",
                            top: "3",
                            textStyle: {
                                color: "#fff",
                                fontSize: 14
                            }
                        },
                        tooltip: { //提示框组件
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow',
                                label: {
                                    backgroundColor: ''
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
                            top: '25%',
                            left: '2%',
                            right: '5%',
                            bottom: '3%',
                            containLabel: true
                        },
                        legend: {//图例组件，颜色和名字
                            center: "0",
                            top: "5%",
                            itemWidth: 16,
                            itemHeight: 12,
                            itemGap: 5,
                            data: [{
                                name: '土壤温度',
                            }, {
                                name: '土壤湿度',
                            },
                                {
                                    name: '土壤电导率',
                                },
                                {
                                    name: '土壤PH',
                                }],
                            textStyle: {
                                color: '#ffffff',
                                fontStyle: 'normal',
                                fontFamily: '微软雅黑',
                                fontSize: 10,
                            }
                        },
                        xAxis: [
                            {
                                type: 'category',
                                boundaryGap: true,//坐标轴两边留白
                                data: timeData,
                                axisLabel: { //坐标轴刻度标签的相关设置。
                                    interval: 0,//设置为 1，表示『隔一个标签显示一个标签』
                                    margin: 8,
                                    textStyle: {
                                        color: '#ffffff',
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
                                        color: '#fff',
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
                                        color: '#ffffff',
                                        fontStyle: 'normal',
                                        fontFamily: '微软雅黑',
                                        fontSize: 10,
                                    }
                                },
                                axisLine: {
                                    lineStyle: {
                                        color: '#fff',
                                        opacity: 0.2
                                    }
                                },
                                axisTick: {
                                    show: false
                                },
                                splitLine: {
                                    show: true,
                                    lineStyle: {
                                        color: ['#fff'],
                                        opacity: 0.06
                                    }
                                }

                            }
                        ],
                        series: server
                    };

                    landBar.setOption(option);


                }

            } else {

            }
        },
        error: function (e) {
            console.log(e);
        }
    });
}


//获取左侧菜单信息
function getLeftItem() {
    $.ajax({
        type: "POST",
        url: "/projectBaseScene/listBases",
        async: true,
        data: {
            page: 1,
            size: 100
        },
        dataType: "json",
        success: function (res) {
            var resData = res.datas;
            if (resData.length > 0) {
                addLeftItem(resData);
                //将设备点存入地图上
                for (var i = 0; i < resData.length; i++) {
                    addMarker(resData[i].longitude, resData[i].latitude, resData[i].name);
                }
            }
        },
        error: function (e) {
            console.log(e);
        }
    });
}

function addClickHandler(name, marker) {
    marker.addEventListener("click", function (e) {
        showInfo(this,name);
            setTimeout(function () {
                $(".isMap").css("display", "block");
                for (var k = 0; k < $(".item").length; k++) {
                    if ($(".item").eq(k).text() == name) {
                        $(".item").eq(k).trigger("click");
                        break;
                    }
                }
            }, 200)
        }
    );
}


function showInfo(thisMaker,point){
    var sContent =
        '<ul style="margin:0 0 5px 0;">'

        sContent+='<li style="line-height: 26px;font-size: 12px;"><span style="display: inline-block;">基地名称：</span>'+'</li>'

    if(point){
        sContent+= '<li style="line-height: 26px;font-size: 12px;"><span style="display: inline-block;"></span>' + point +'</li>'
    }


        +'</ul>';
    var infoWindow = new BMap.InfoWindow(sContent);  // 创建信息窗口对象
    console.log(infoWindow)
    thisMaker.openInfoWindow(infoWindow);   //图片加载完毕重绘infowindow
}





//添加左侧菜单
function addLeftItem(msg) {
    //获取基地预警信息
    dangerMsgList = "";
    getDangerMsg();

    var $itemBox = $(".itemBox");
    $itemBox.empty()
    for (var i = 0; i < msg.length; i++) {
        var $item = $("<span class='item'></span>");
        $item.text(msg[i].name);
        $item.attr("baseId", msg[i].id);
        $item.attr("baseName", msg[i].name);
        $item.attr("baseUser", msg[i].createUser);
        $item.attr("lon", msg[i].longitude);
        $item.attr("lat", msg[i].latitude);
        $item.appendTo($itemBox);

    }


}


//通过基地获取场景信息
function getScene(baseId) {
    $.ajax({
        type: "POST",
        url: "/projectBaseScene/listScenesByBaseId",
        async: true,
        data: {
            baseId: baseId
        },
        dataType: "json",
        success: function (res) {

            var baseCameraLength = 0;
            var resData = res.datas;
            if (resData.length > 0) {
                //获取基地下摄像头总数
                for (var j = 0; j < resData.length; j++) {
                    $.ajax({
                        type: "POST",
                        url: "../cameraApplication/getPerspectiveCameraList",
                        async: false,
                        data: {
                            page: 1,
                            size: 100,
                            appId: resData[j].id,
                            appType: 1
                        },
                        dataType: "json",
                        success: function (res) {
                            var resData = res.datas;
                            baseCameraLength += resData.length;
                        },
                        error: function (e) {
                            console.log(e);
                        }
                    });
                }
                $(".p3").text("监控摄像头：" + baseCameraLength + '台');


                getCamera(resData[0].id);
                //初始化预警雷达图
                initDangerCharts();
                //加载基地预警信息
                addBaseDangerMsg(resData);


                //获取基地下所有设备总和
                for (var x = 0; x < resData.length; x++) {
                    getDeviceNum(resData[x].id);
                }
                initDevicePie();


                getWeatherMsg(resData[0].id)

            } else {


                $(".camera").empty();
                $(".cameraNoMsg").css("display", "none");
                setTimeout(function () {
                    $(".cameraNoMsg").css("display", "block");
                }, 200);


                $(".p3").text("监控摄像头：" + resData.length + '台');

                //初始化预警雷达图
                initDangerCharts();

                $(".dangerMsgItem").empty();
                setTimeout(function () {
                    $(".dangerMsgItem").html("<span class='noDangerMsg'>暂无数据</span>");
                    $(".noDangerMsg").height($(".dangerMsgItem").height()).css("line-height", $(".dangerMsgItem").height() + "px").css("text-align", "center").css("display", "block");
                    $(".dangerTime").css("visibility", "hidden");
                }, 200);


                initDevicePie();
                if (environmentBar) {
                    environmentBar.clear();
                }
                if (landBar) {
                    landBar.clear();
                }


                $(".environmentBarNoMsg").css("display", "none");
                $(".landBarNoMsg").css("display", "none");
                setTimeout(function () {
                    $(".environmentBarNoMsg").css("display", "block");
                    $(".landBarNoMsg").css("display", "block");

                }, 200)

            }


        },
        error: function (e) {
            console.log(e);
        }
    });
}


//获取基地下第一个采集设备
function getWeatherMsg(farmId) {
    $.ajax({
        type: "POST",
        url: "/projectBaseScene/listSceneDevices",
        async: true,
        data: {
            page: 1,
            size: 10,
            sceneId: farmId,
        },
        dataType: "json",
        success: function (res) {
            var resData = res.datas;
            if (resData.length > 0) {
                for (var j = 0; j < resData.length; j++) {
                    if (resData[j].deviceType != 2) {
                        $(".environmentBarNoMsg").css("display", "none");
                        $(".landBarNoMsg").css("display", "none");
                        initEnvironmentBar(resData[j].deviceNumber);
                        initLandBar(resData[j].deviceNumber);
                        break;
                    }
                }


            } else {
                if (environmentBar) {
                    environmentBar.clear();
                }
                if (landBar) {
                    landBar.clear();
                }


                $(".environmentBarNoMsg").css("display", "none");
                $(".landBarNoMsg").css("display", "none");
                setTimeout(function () {
                    $(".environmentBarNoMsg").css("display", "block");
                    $(".landBarNoMsg").css("display", "block");
                }, 200)
            }

        },
        error: function (e) {
            console.log(e);
        }
    });
}


//获取场景下摄像头信息
function getCamera(sceneId) {
    $.ajax({
        type: "POST",
        url: "../cameraApplication/getPerspectiveCameraList",
        async: true,
        data: {
            page: 1,
            size: 100,
            appId: sceneId,
            appType: 1

        },
        dataType: "json",
        success: function (res) {
            var resData = res.datas;

            if (resData.length > 0) {
                $(".cameraNoMsg").css("display", "none");
                var resData = res.datas;
                camerNumberList = resData;
                for (var m = 0; m < 1; m++) {
                    getCamareUrl(resData[0].cameraId, m);
                }
            } else {
                $(".camera").empty();
                $(".cameraNoMsg").css("display", "none");
                setTimeout(function () {
                    $(".cameraNoMsg").css("display", "block");
                }, 200);

            }


        },
        error: function (e) {
            console.log(e);
        }
    });
}


// 获取视频监控url
function getCamareUrl(id, m) {
    var $playerBox = $(".camera").eq(m);
    $("#player" + m).remove();
    $("#playerNoData" + m).remove();
    var $player = $('<video  style="width: 100%;height:100%;" poster="" controls playsInline webkit-playsinline autoplay></video>');
    var $rtmpHd = $('<source  type="rtmp/flv"/>');
    var $hlsHd = $('<source type="application/x-mpegURL"/>');
    $player.attr("id", "player" + m);
    $rtmpHd.attr("id", "rtmpHd" + m);
    $hlsHd.attr("id", "hlsHd" + m);
    $rtmpHd.appendTo($player);
    $hlsHd.appendTo($player);
    $player.appendTo($playerBox);
    var $playerNoData = $('<div style = "height: 100%; width: 100%; text-align: center;position:absolute;top:0; background-color: black;"></div>');
    var $nomsg = $("<span class='nomsg' style ='position:absolute;left:0.5rem;'></span>");
    var $img = $('<img src="../static/img/playBtn.png" style="width: 2rem; margin-top: 1.5rem />');
    $playerNoData.attr("id", "playerNoData" + m);
    $nomsg.appendTo($playerNoData);
    $img.appendTo($playerNoData);
    $playerNoData.appendTo($playerBox);
    $.ajax({
        type: "GET",
        url: "../cameraManage/getPlayerAddress",
        dataType: "json",
        async: false,
        data: {
            "id": id,
            "perspective": 1
        },
        success: function (data) {
            if (data.state == 'success') {
                var data = data.data;
                var rtmpHd = document.getElementById("rtmpHd" + m);
                // var hlsHd = document.getElementById("hlsHd");
                rtmpHd.src = data.rtmp;
                // hlsHd.src = data.hlsHd;
                var player = new EZUIPlayer('player' + m);
                $("#player" + m).show();
                $("#playerNoData" + m).hide();
            } else {
                $("#playerNoData" + m).find(".nomsg").text($.i18n.prop(data.msg)).css("display", "block");
            }
        },
        error: function (e) {
            console.log(e);
        }
    });
}


//获取预警信息

function getDangerMsg() {
    $.ajax({
        type: "get",
        url: "../newFarmInfo/getFarmsException",
        dataType: "json",
        async: false,
        success: function (res) {
            var resData = res.datas;
            dangerMsgList = resData;
            if (dangerMsgList.length > 0) {
                $(".dangerTime").css("visibility", "inherit");
            } else {
                $(".dangerTime").css("visibility", "hidden");
            }

        },
        error: function (e) {
            console.log(e);
        }
    });
}


//加载基地预警信息
function addBaseDangerMsg(msg) {
    var $dangerMsgItem = $(".dangerMsgItem");
    $dangerMsgItem.empty()


    for (var i = 0; i < msg.length; i++) {
        for (var j = 0; j < dangerMsgList.length; j++) {
            if (msg[i].farmName == dangerMsgList[j].farmName) {
                var $p = $("<p></p>");
                var $dangerIcon = $("<span class='dangerIcon cyellow'></span>");
                var $dangerText = $("<span class='dangerText'></span>");
                $dangerText.text(dangerMsgList[j].remark);
                $dangerIcon.appendTo($p);
                $dangerText.appendTo($p);
                $p.appendTo($dangerMsgItem);

            }
        }
    }
    if ($(".dangerText").length > 0) {
        $(".dangerTime").css("visibility", "inherit");

        var pointVal = [100, 100, 100, 100, 100, 100, 100, 100];
        for (var v = 0; v < $(".dangerText").length; v++) {
            for (var x = 0; x < indicator.length; x++) {
                if ($(".dangerText").eq(v).text().split(">")[0] == indicator[x].text || $(".dangerText").eq(v).text().split("<")[0] == indicator[x].text) {
                    pointVal[x] = 150;
                }
            }
        }
        var legendData = ['预警']; //图例
        var dataArr = [{
            value: pointVal,
            name: legendData[0],
            itemStyle: {
                normal: {
                    lineStyle: {
                        color: '#4A99FF',
                        // shadowColor: '#4A99FF',
                        // shadowBlur: 10,
                    },
                    shadowColor: '#4A99FF',
                    shadowBlur: 10,
                },
            },
            areaStyle: {
                normal: { // 单项区域填充样式
                    color: {
                        type: 'linear',
                        x: 0, //右
                        y: 0, //下
                        x2: 1, //左
                        y2: 1, //上
                        colorStops: [{
                            offset: 0,
                            color: '#4A99FF'
                        }, {
                            offset: 1,
                            color: 'rgba(0,0,0,0)'
                        }, {
                            offset: 0.2,
                            color: '#4A99FF'
                        }],
                        globalCoord: false
                    },
                    opacity: 1 // 区域透明度
                }
            }
        }
        ];
        var colorArr = ['#4A99FF']; //颜色
        option = {
            backgroundColor: '',
            color: colorArr,
            // 图表的位置
            grid: {
                position: 'center',
            },
            /*     legend: {
                     orient:'vertical',
                     icon: 'circle', //图例形状
                     data: legendData,
                     bottom:35,
                     right:40,
                     itemWidth: 14, // 图例标记的图形宽度。[ default: 25 ]
                     itemHeight: 14, // 图例标记的图形高度。[ default: 14 ]
                     itemGap: 21, // 图例每项之间的间隔。[ default: 10 ]横向布局时为水平间隔，纵向布局时为纵向间隔。
                     textStyle: {
                         fontSize: 14,
                         color: '#00E4FF',
                     },
                 },*/
            radar: {
                // shape: 'circle',
                name: {
                    textStyle: {
                        color: '#fff',
                        fontSize: 12
                    },
                },
                "center": ["50%", "50%"],
                "radius": "50%",
                indicator: indicator,
                splitArea: { // 坐标轴在 grid 区域中的分隔区域，默认不显示。
                    show: true,
                    areaStyle: { // 分隔区域的样式设置。
                        color: ['rgba(255,255,255,0)', 'rgba(255,255,255,0)'], // 分隔区域颜色。分隔区域会按数组中颜色的顺序依次循环设置颜色。默认是一个深浅的间隔色。
                    }
                },
                axisLine: { //指向外圈文本的分隔线样式
                    lineStyle: {
                        color: '#fff'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: '#fff', // 分隔线颜色
                        width: 1, // 分隔线线宽
                    }
                },
            },
            series: [{
                type: 'radar',
                symbolSize: 5,
                // symbol: 'angle',
                data: dataArr
            }]
        };
        dangerCharts.setOption(option);


    } else {
        setTimeout(function () {
            $(".dangerMsgItem").html("<span class='noDangerMsg'>暂无数据</span>");
            $(".noDangerMsg").height($(".dangerMsgItem").height()).css("line-height", $(".dangerMsgItem").height() + "px").css("text-align", "center").css("display", "block");
            $(".dangerTime").css("visibility", "hidden");
        }, 200);
    }


}


//获取基地下所有场景设备总和
function getDeviceNum(farmId) {
    $.ajax({
        type: "POST",
        url: "/projectBaseScene/listSceneDevices",
        async: false,
        data: {
            page: 1,
            size: 10,
            sceneId: farmId,
        },
        dataType: "json",
        success: function (res) {
            var resData = res.datas;
            if(resData){
                deviceNum = deviceNum + resData.length;
                for (var x = 0; x < resData.length; x++) {
                    if (resData[x].onLineState == 1) {
                        onLineDevice = onLineDevice + 1
                    } else {
                        offLineDevice = offLineDevice + 1
                    }
                }

            }



        },
        error: function (e) {
            console.log(e);
        }
    });
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


Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

