var dataFive = {
    "complaint": "0",
    "satisfied": "99%",
    "place": [{
        "name": "刘公岛",
        "sell": "30025",
        "peopleNo": "20554",
        "carPlace": "142"
    }, {"name": "仙姑顶", "sell": "30025", "peopleNo": "20554", "carPlace": "142"}, {
        "name": "成山头",
        "sell": "30025",
        "peopleNo": "20554",
        "carPlace": "142"
    }]
}
$(function () {
    var documentHeight = $(document).height();
    $(".topContent").height(documentHeight - 225 - 25);


});

function initScreenFive(dataFive) {
    $(".screenFiveComplaintNo").text(dataFive.complaint + "件");
    $(".screenFiveSatisfiedNo").text(dataFive.satisfied);
    var $screenFiveNotice = $(".screenFiveNotice");
    var $travelBox = $("<div class='travelBox'></div>");
    for (var i = 0; i < dataFive.place.length; i++) {
        var $itemBox = $("<div class='itemBox'></div>");
        var $itemName = $("<span class='itemName'></span>");
        var $itemSell = $("<span class='itemSell'></span>");
        var $itemPeopleNo = $("<span class='itemPeopleNo'></span>");
        var $itemCarPlace = $("<span class='itemCarPlace'></span>");
        $itemName.appendTo($itemBox);
        $itemSell.appendTo($itemBox);
        $itemPeopleNo.appendTo($itemBox);
        $itemCarPlace.appendTo($itemBox);
        $itemBox.appendTo($travelBox);
        $itemName.text(dataFive.place[i].name);
        $itemSell.text(dataFive.place[i].sell);
        $itemPeopleNo.text(dataFive.place[i].peopleNo);
        $itemCarPlace.text(dataFive.place[i].carPlace);
    }
    $travelBox.appendTo($screenFiveNotice);

}


//高德地图
function loadMap() {
    AMap.plugin('AMap.CitySearch', function () {
        var citySearch = new AMap.CitySearch();
        citySearch.getLocalCity(function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
                //加载天气查询插件
                AMap.plugin('AMap.Weather', function () {
                    //创建天气查询实例
                    let weather = new AMap.Weather();
                    //执行实时天气信息查询
                    weather.getLive(result.city, function (err, data) {
                        if (!isNaN(data.temperature)) {
                            $("#temperature").html(data.temperature + "℃");
                        } else {
                            $("#temperature").html("未知");
                        }
                        if (!isNaN(data.windPower)) {
                            $("#windPower").html(data.windPower + "级");
                        } else {
                            $("#windPower").html("未知");
                        }
                        if (!isNaN(data.humidity)) {
                            $("#humidity").html(data.humidity + "%");
                        } else {
                            $("#humidity").html("未知");
                        }
                        $("#windDirection").html(data.windDirection);
                        $("#city").html(data.city);
                        $("#weather").html(data.weather);
                    });
                });
            }
        })
    });
}

$(function () {
    initEchartsOne();
    initEchartsTwo();
    initEchartsThree();
    initEchartsFour();
    initScreenFive(dataFive);
    loadMap();
});


function initEchartsOne() {
    var myChart = echarts.init(document.getElementById('echartsOne'));
    var myColor = ['#eb2100', '#eb3600', '#d0570e', '#d0a00e', '#34da62', '#00e9db', '#00c0e9', '#0096f3', '#33CCFF', '#33FFCC'];
    option = {
        title: [{
            text: "便民服务使用排名",
            textStyle: {
                fontSize: 15,
                fontWeight: 0,
                color: "#00FFFF"

            },
            top: 5,
            left: 10
        }],
        backgroundColor: '',
        grid: {
            left: '3%',
            top: '18%',
            right: '5%',
            bottom: '0',
            containLabel: true
        },
        xAxis: [{
            show: false
        }],
        yAxis: [
            {
                axisTick: 'none',
                axisLine: 'none',
                offset: '10',
                axisLabel: {
                    textStyle: {
                        color: '#4499EF',
                        fontSize: '10',
                    }
                },
                data: ["市民热线", "在线办理", "交通情况", "办事指南", "个税查询", "违章查询", "社保查询", "公积金查询"]
            }, {
                axisTick: 'none',
                axisLine: 'none',
                offset: '10',
                axisLabel: {
                    textStyle: {
                        color: '#4499EF',
                        fontSize: '10',
                    }
                },
                data: ['18000', '30050', '35000', '38674', '42000', '48000', '56000', '60000']
            }, {
                offset: '50',
                axisTick: 'none',
                axisLine: 'none',
                axisLabel: {
                    margin: "50",
                    textStyle: {
                        color: '#4499EF',
                        fontSize: '10',
                    }
                },
                data: ['354', '367', '423', '456', '525', '652', '573', '996']
            }],
        series: [{
            name: '条',
            type: 'bar',
            yAxisIndex: 0,
            data: [30, 40, 45, 55, 60, 65, 70, 78],
            label: {
                normal: {
                    show: false,
                    position: 'right',
                    textStyle: {
                        color: '#ffffff',
                        fontSize: '10',
                    }
                }
            },
            barWidth: 8,
            itemStyle: {
                normal: {
                    color: function (params) {
                        var num = myColor.length;
                        return myColor[params.dataIndex % num]
                    },
                    barBorderRadius: 10
                }
            },
            z: 2
        }, {
            name: '白框',
            type: 'bar',
            yAxisIndex: 1,
            barGap: '-100%',
            data: [99, 99.5, 99.5, 99.5, 99.5, 99.5, 99.5, 99.5],
            barWidth: 8,
            itemStyle: {
                normal: {
                    color: '#153963',
                    barBorderRadius: 10
                }
            },
            z: 1
        }, {
            name: '外框',
            type: 'bar',
            yAxisIndex: 2,
            barGap: '-100%',
            data: [100, 100, 100, 100, 100, 100, 100, 100],
            barWidth: 8,
            itemStyle: {
                normal: {
                    color: "#153963",
                    barBorderRadius: 10
                }
            },
            z: 0
        },
        ]
    };
    myChart.setOption(option);
}

function initEchartsTwo() {
    var myChart = echarts.init(document.getElementById('echartsTwo'));
    var geoCoordMap = {
        '上海': [121.4648, 31.2891],
        '东莞': [113.8953, 22.901],
        '东营': [118.7073, 37.5513],
        '中山': [113.4229, 22.478],
        '临汾': [111.4783, 36.1615],
        '临沂': [118.3118, 35.2936],
        '丹东': [124.541, 40.4242],
        '丽水': [119.5642, 28.1854],
        '新疆': [86.9236, 41.5883],
        '佛山': [112.8955, 23.1097],
        '保定': [115.0488, 39.0948],
        '甘肃': [103.9901, 36.3043],
        '北京': [116.4551, 40.4539],
        '北海': [109.314, 21.6211],
        '江苏': [120.2062, 32.9208],
        '广西': [108.479, 24.1152],
        '江西': [116.0046, 28.6633],
        '南通': [121.1023, 32.1625],
        '厦门': [118.1689, 24.6478],
        '台州': [121.1353, 28.6688],
        '安徽': [117.29, 32.0581],
        '内蒙古': [111.4124, 41.4901],
        '咸阳': [108.4131, 34.8706],
        '黑龙江': [127.9688, 46.868],
        '唐山': [118.4766, 39.6826],
        '嘉兴': [120.9155, 30.6354],
        '大同': [113.7854, 39.8035],
        '天津': [117.4219, 39.4189],
        '山西': [112.3352, 37.9413],
        '威海': [121.9482, 37.1393],
        '宁波': [121.5967, 29.6466],
        '宝鸡': [107.1826, 34.3433],
        '宿迁': [118.5535, 33.7775],
        // '江苏': [119.3000,31.5582],
        '广东': [114.5107, 23.8196],
        '廊坊': [116.521, 39.0509],
        '延安': [109.1052, 36.4252],
        '张家口': [115.1477, 40.8527],
        '徐州': [117.5208, 34.3268],
        '德州': [116.6858, 37.2107],
        '惠州': [114.6204, 23.1647],
        '四川': [103.9526, 30.7617],
        '扬州': [119.4653, 32.8162],
        '承德': [117.5757, 41.4075],
        '西藏': [91.1865, 30.1465],
        '无锡': [120.3442, 31.5527],
        '日照': [119.2786, 35.5023],
        '云南': [101.9199, 25.0663],
        '浙江': [119.5313, 29.8773],
        '枣庄': [117.323, 34.8926],
        '柳州': [109.3799, 24.9774],
        '株洲': [113.5327, 27.0319],
        '湖北': [113.0896, 31.3628],
        '汕头': [117.1692, 23.3405],
        '江门': [112.6318, 22.1484],
        '辽宁': [123.1238, 42.1216],
        '沧州': [116.8286, 38.2104],
        '河源': [114.917, 23.9722],
        '泉州': [118.3228, 25.1147],
        '泰安': [117.0264, 36.0516],
        '泰州': [120.0586, 32.5525],
        '山东': [117.1582, 36.8701],
        '济宁': [116.8286, 35.3375],
        '海口': [110.3893, 19.8516],
        '淄博': [118.0371, 36.6064],
        '淮安': [118.927, 33.4039],
        '深圳': [114.5435, 22.5439],
        '清远': [112.9175, 24.3292],
        '温州': [120.498, 27.8119],
        '渭南': [109.7864, 35.0299],
        '湖州': [119.8608, 30.7782],
        '湘潭': [112.5439, 27.7075],
        '滨州': [117.8174, 37.4963],
        '潍坊': [119.0918, 36.524],
        '烟台': [120.7397, 37.5128],
        '玉溪': [101.9312, 23.8898],
        '珠海': [113.7305, 22.1155],
        '盐城': [120.2234, 33.5577],
        '盘锦': [121.9482, 41.0449],
        '河北': [115.4995, 38.6006],
        '福建': [118.0543, 26.5222],
        '秦皇岛': [119.2126, 40.0232],
        '绍兴': [120.564, 29.7565],
        '聊城': [115.9167, 36.4032],
        '肇庆': [112.1265, 23.5822],
        '舟山': [122.2559, 30.2234],
        '苏州': [120.6519, 31.3989],
        '莱芜': [117.6526, 36.2714],
        '菏泽': [115.6201, 35.2057],
        '营口': [122.4316, 40.4297],
        '葫芦岛': [120.1575, 40.578],
        '衡水': [115.8838, 37.7161],
        '衢州': [118.6853, 28.8666],
        '青海': [97.4038, 35.8207],
        '陕西': [109.1162, 34.2004],
        '贵州': [106.6992, 26.7682],
        '连云港': [119.1248, 34.552],
        '邢台': [114.8071, 37.2821],
        '邯郸': [114.4775, 36.535],
        '河南': [113.4668, 34.6234],
        '鄂尔多斯': [108.9734, 39.2487],
        '重庆': [107.7539, 30.1904],
        '金华': [120.0037, 29.1028],
        '铜川': [109.0393, 35.1947],
        '宁夏': [106.3586, 38.1775],
        '镇江': [119.4763, 31.9702],
        '吉林': [125.8154, 44.2584],
        '湖南': [111.8823, 28.2568],
        '长治': [112.8625, 36.4746],
        '阳泉': [113.4778, 38.0951],
        '青岛': [120.4651, 36.3373],
        '韶关': [113.7964, 24.7028],
        '海南': [109.8500, 19.7028],
        '台湾': [120.7964, 24.1528],
    };
    var BJData = [
        [{
            name: '海南'
        }],
        [{
            name: '台湾'
        }],
        [{
            name: '河北'
        }],
        [{
            name: '青海'
        }],
        [{
            name: '西藏'
        }],
        [{
            name: '山东'
        }],
        [{
            name: '宁夏'
        }],
        [{
            name: '山西'
        }],
        [{
            name: '陕西'
        }],
        [{
            name: '安徽'
        }],
        [{
            name: '江西'
        }],
        [{
            name: '广东'
        }],
        [{
            name: '黑龙江'
        }],
        [{
            name: '吉林'
        }],
        [{
            name: '辽宁'
        }],
        [{
            name: '湖北'
        }],
        [{
            name: '浙江'
        }],
        [{
            name: '福建'
        }],
        [{
            name: '重庆'
        }],
        [{
            name: '宁夏'
        }],
        [{
            name: '贵州'
        }],
        [{
            name: '湖南'
        }],
        [{
            name: '甘肃'
        }],
        [{
            name: '四川'
        }],
        [{
            name: '云南'
        }],
        [{
            name: '江苏'
        }],

        [{
            name: '北京',
            value: randomData()
        }, {
            name: '上海'
        }],
        [{
            name: '新疆',
            value: randomData()
        }, {
            name: '浙江'
        }],
        [{
            name: '新疆',
            value: randomData()
        }, {
            name: '安徽'
        }],
        [{
            name: '新疆',
            value: randomData()
        }, {
            name: '青海'
        }],
        [{
            name: '河南',
            value: randomData()
        }, {
            name: '江苏'
        }],

        [{
            name: '上海',
            value: randomData()
        }, {
            name: '江西'
        }],
        [{
            name: '上海',
            value: randomData()
        }, {
            name: '四川'
        }],
        [{
            name: '北京',
            value: randomData()
        }, {
            name: '广东'
        }],
        [{
            name: '上海',
            value: randomData()
        }, {
            name: '江苏'
        }],
        [{
            name: '广西',
            value: randomData()
        }, {
            name: '上海'
        }],

        [{
            name: '北京',
            value: randomData()
        }, {
            name: '四川'
        }],
        [{
            name: '内蒙古',
            value: randomData()
        }, {
            name: '江苏'
        }]
    ];
    function randomData() {
        return Math.round(Math.random() * 300);
    }
    var series = [{
        name: '接通率',
        type: "map",
        map: "china",
        zoom: 1.152,
        // top: '30',
        zlevel: 1,
        left: 'center',
        align: 'right',
        label: {
            normal: {
                show: false
            },
            emphasis: {
                show: false
            },
        },
        itemStyle: {
            normal: {
                borderColor: "#112b3b", //省市边界线
                borderColor: "#a7e4e6", //省市边界线
                shadowColor: 'rgba(166, 230, 236, 0.6)',
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 120
            },
            emphasis: {
                areaColor: "#4aafde",
                borderColor: "red"
            },
        },
        data: [{
            name: "北京",
            value: 400,
        },
            {
                name: "上海",
                value: 350
            }, {
                name: "天津",
                value: 300
            }, {
                name: "重庆",
                value: 200
            }, {
                name: "广东",
                value: 300
            }, {
                name: "广西",
                value: 10
            }, {
                name: "湖南",
                value: 200
            }, {
                name: "湖北",
                value: 300
            }, {
                name: "河南",
                value: 129
            }, {
                name: "河北",
                value: 390
            }, {
                name: "山东",
                value: 200
            }, {
                name: "山西",
                value: 60
            }, {
                name: "黑龙江",
                value: 400
            }, {
                name: "吉林",
                value: 201
            }, {
                name: "辽宁",
                value: 30
            }, {
                name: "内蒙古",
                value: 490
            }, {
                name: "新疆",
                value: 200
            }, {
                name: "西藏",
                value: 30
            }, {
                name: "宁夏",
                value: 50
            }, {
                name: "甘肃",
                value: 30
            }, {
                name: "云南",
                value: 30
            }, {
                name: "陕西",
                value: 30
            }, {
                name: "青海",
                value: 30
            }, {
                name: "贵州",
                value: 30
            }, {
                name: "福建",
                value: 220
            }, {
                name: "江西",
                value: 30
            }, {
                name: "四川",
                value: 210
            }, {
                name: "江苏",
                value: 140
            }, {
                name: "安徽",
                value: 30
            }, {
                name: "浙江",
                value: 333
            }, {
                name: "海南",
                value: 500
            }, {
                name: "台湾",
                value: 30
            }, {
                name: "南海诸岛",
                value: 0
            },
        ]
    }];
    BJData.forEach(function (item, i) {
        if (item.length === 1) {
            series.push({
                type: "effectScatter",
                coordinateSystem: "geo",
                zlevel: 2,
                label: {
                    normal: {
                        show: true,
                        position: "bottom", //显示位置
                        offset: [0, 0], //偏移设置
                        color: "#fff",
                        formatter: "{b}", //圆环显示文字
                        fontWeight: "lighter",
                        fontSize: 10
                    },
                    emphasis: {
                        show: true
                    },
                },
                symbol: "circle",
                symbolSize: function (val) {
                    return 0.0001 //圆环大小
                },
                itemStyle: {
                    normal: {
                        color: "#fff",
                        show: false,

                    },
                    emphasis: {
                        show: false,

                    }
                },
                data: [{
                    name: item[0].name,
                    value: geoCoordMap[item[0].name]
                }]
            })
        } else {
            series.push({
                    name: '上海-广州',
                    type: "lines",
                    zlevel: 2,
                    animationDuration: function (idx) {
                        // 越往后的数据延迟越大
                        return idx * 400;
                    },
                    animationDelay: function (idx) {
                        // 越往后的数据延迟越大
                        return idx * 100;
                    },
                    effect: {
                        show: true,
                        color: "#fff",
                        period: 2, //箭头指向速度，值越小速度越快
                        trailLength: 0.5, //特效尾迹长度[0,1]值越大，尾迹越长重
                        symbol: "circle", //箭头图标
                        symbolSize: 2, //图标大小
                        loop: true, //是否循环
                        delay: function (idx) {
                            console.log(idx)
                            return Math.round(Math.random() * 3000);
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: 'red',
                            width: 0, //尾迹线条宽度
                            opacity: 0, //尾迹线条透明度
                            curveness: 0.4 //尾迹线条曲直度
                        }
                    },
                    data: [
                        [{
                            coord: geoCoordMap[item[0].name],
                            value: item[0].value
                        },
                            {
                                coord: geoCoordMap[item[1].name]
                            }
                        ]
                    ]
                }, {
                    type: "effectScatter",
                    coordinateSystem: "geo",
                    name: item[0].name,
                    zlevel: 5,
                    rippleEffect: {
                        //涟漪特效
                        period: 4, //动画时间，值越小速度越快
                        brushType: "stroke", //波纹绘制方式 stroke, fill
                        scale: 4 //波纹圆环最大限制，值越大波纹越大
                    },
                    label: {
                        normal: {
                            show: true,
                            position: "bottom", //显示位置
                            offset: [0, 4], //偏移设置
                            fontWeight: "lighter",
                            fontSize: 10,
                            color: "#fff",
                            formatter: "{b}" //圆环显示文字
                        },
                        emphasis: {
                            show: false
                        },
                    },
                    symbol: "circle",
                    symbolSize: function (val) {
                        return 6 + val[2] / 2000; //圆环大小
                    },
                    itemStyle: {
                        normal: {
                            color: "#f00",
                            show: true,

                        },
                        emphasis: {
                            show: true,

                        }
                    },
                    data: [{
                        name: item[0].name,
                        value: geoCoordMap[item[0].name].concat([item[0].value])
                    }]
                },
            );
        }

    });
    option = {
        title: {
            text: '实时数据',
            subtext: '',
            left: '15',
            top: '5',
            textStyle: {
                fontSize: 15,
                fontWeight: 0,
                color: "#00FFFF"
            }
        },
        backgroundColor: '#0e2832',

        visualMap: {
            //图例值控制
            show: false,
            type: 'piecewise',
            seriesIndex: 0,
            pieces: [{
                min: 401
            }, // 不指定 max，表示 max 为无限大（Infinity）。
                {
                    min: 301,
                    max: 400
                },
                {
                    min: 201,
                    max: 300
                },
                {
                    min: 101,
                    max: 200
                },
                {
                    max: 100
                }
            ],
            inRange: {
                color: ['#124754', '#4ed9f0']
            },
            showLabel: false,
            calculable: true,
        },
        geo: {
            map: "china",
            show: false,
            roam: false, //是否允许缩放
            layoutCenter: ["50%", "50%"], //地图位置
            layoutSize: "120%",
            itemStyle: {
                normal: {
                    show: 'true',
                    color: "#0e2832", //地图背景色
                    borderWidth: 2,
                    borderColor: "#a7e4e6", //省市边界线
                    shadowColor: 'rgba(166, 230, 236, 0.6)',
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    shadowBlur: 120
                },
                emphasis: {
                    show: 'true',
                    color: "rgba(255, 43, 61, .9)" //悬浮背景
                }
            }
        },
        series: series
    };
    myChart.setOption(option);
}

function initEchartsThree() {
    var myChart = echarts.init(document.getElementById('echartsThree'));
    var myChart = echarts.init(document.getElementById('echartsThree'));
    var data1 = ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
    var data2 = ['3', '2', '1', '3', '2', '1', '2', '2', '4'];
    var data3 = ['1', '1', '1', '1', '1', '1', '1', '1', '1'];
    var data = [];
    var labelData = [];
    for (var i = 0; i < 9; ++i) {
        data.push({
            value: data2[i],
            name: data1[i]
        });
        labelData.push({
            value: data3[i],
            name: data1[i]
        });
    }


    option = {
        title: [{
            text: "车流高峰时段",
            textStyle: {
                fontSize: 15,
                fontWeight: 0,
                color: "#00FFFF"

            },
            top: 5,
            left: 10
        }],
        legend: {
            top: 30,
            x: 'center',
            data: ['5-10K', '10-20K', '20-30K', '30-40K'],
            textStyle: {
                fontSize: 15,
                fontWeight: 0,
                color: "auto",

            },
            itemHeight: 10,
            itemWidth: 18,

        },
        series: [{
            type: 'pie',
            data: data,
            radius: ['15%', '50%'],
            roseType: 'area',
            zlevel: 2,
            itemStyle: {
                normal: {
                    color: '',
                    borderColor: '',
                }
            },
            labelLine: {
                normal: {
                    show: true
                }
            },
            label: {
                normal: {
                    show: false
                }
            },

            data: [{
                value: 14.7,
                name: '10-20K'
            },
                {
                    value: 10.4,
                    name: '10-20K'
                },
                {
                    value: 6.3,
                    name: '5-10K'
                },
                {
                    value: 21.6,
                    name: '5-10K'
                },
                {
                    value: 21.6,
                    name: '20-30K'
                },
                {
                    value: 21.6,
                    name: '20-30K'
                },
                {
                    value: 21.6,
                    name: '20-30K'
                },
                {
                    value: 21.6,
                    name: '30-40K'
                },
                {
                    value: 21.6,
                    name: '30-40K'
                },


            ]

        }, {
            type: 'pie',
            data: labelData,
            radius: ['60%', '80%'],
            zlevel: -2,
            itemStyle: {
                normal: {
                    color: '#001142',
                    borderColor: '#0040FF'
                }
            },
            label: {
                normal: {
                    position: 'inside',
                }
            }
        }]
    };

    myChart.setOption(option);
}

function initEchartsFour() {
    var myChart = echarts.init(document.getElementById('echartsFour'));


    option = {
        title: [{
            text: "市政办理事项情况",
            textStyle: {
                fontSize: 15,
                fontWeight: 0,
                color: "#00FFFF"

            },
            top: 5,
            left: 10
        }],
        grid: {
            left: '3%',
            top: '30%',
            right: '3%',
            bottom: '15%',
            containLabel: true
        },
        backgroundColor: '',
        tooltip: {},
        xAxis: {
            data: ["房管局", "人社局", "公安局", "民政局", "社保局"],
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#00FFFF'
                }
            },
            position: "top",
            offset: "10"

        },
        yAxis: {
            offset: 0,                   //---y轴相对于默认位置的偏移
            type: 'value',           //---轴类型，默认'category'
            name: [],
            nameLocation: 'end',         //---轴名称相对位置value
            nameTextStyle: {             //---坐标轴名称样式
                color: "#fff",
                padding: [5, 0, 0, 5],  //---坐标轴名称相对位置
            },
            nameGap: 15,
            splitLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisLabel: {
                show: false
            }
        },
        series: [{
            name: '',
            type: 'pictorialBar',
            symbolSize: [50, 22.5],
            symbolOffset: [0, -10],
            label: {
                normal: {
                    show: true,
                    position: 'inside'
                }
            },
            z: 12,
            itemStyle: {
                normal: {
                    color: '#14b1eb'
                }
            },
            data: [{
                value: 60,
                symbolPosition: 'end'
            }, {
                value: 80,
                symbolPosition: 'end'
            }, {
                value: 100,
                symbolPosition: 'end'
            }, {
                value: 80,
                symbolPosition: 'end'
            }, {
                value: 60,
                symbolPosition: 'end'
            }]
        }, {
            name: '',
            type: 'pictorialBar',
            symbolSize: [50, 22.5],
            symbolOffset: [0, 10],
            z: 12,
            itemStyle: {
                normal: {
                    color: '#14b1eb'
                }
            },

            data: [60, 80, 100, 80, 60]
        }, {
            type: 'bar',
            itemStyle: {
                normal: {
                    color: '#14b1eb',
                    opacity: .7
                }
            },
            silent: true,
            barWidth: 50,
            barGap: '-100%', // Make series be overlap
            data: [60, 80, 100, 80, 60]
        }
        ]
    };


    myChart.setOption(option);
}
