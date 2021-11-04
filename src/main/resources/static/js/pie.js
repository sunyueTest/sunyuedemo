var total = 50;//最大温度数据单独出来定义，方便环形总数的修改
var myChart = echarts.init(document.getElementById('pie'));

function initChart() {

    var series = [],
        color = ['#dc1439', '#e6b600', '#053afe', '#dc1439', '#e6b600', '#053afe', '#dc1439'],
        itemHeight = 10, itemGap = 5,
        difference = 2,
        titleData = ['大白菜（苗期）', '韭菜（成长期）', '小油菜（成熟期）'
            , '芹菜（苗期）', '大头菜（苗期）', '西红柿（苗期）', '胡萝卜（成长期）'];
    for (let i = 0; i < 6; i++) {
        var val = Math.floor(Math.random(50) * 30);
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
            // subtextStyle: {//副标题样式
            //     color: '#fff',
            //     fontSize: 20,
            //     fontWeight: 'bold',
            //     color: '#0f0'
            // },
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
            top: 6*itemGap,
            left: "50%",
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

var placeHolderStyle = {
    normal: {
        label: {
            show: false,
        },
        labelLine: {
            show: false,
        }
    }
};