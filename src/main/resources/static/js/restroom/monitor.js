//---------------男厕所----------------------------------------------------
var myChartl = echarts.init(document.getElementById('con-chartl'));
// 指定图表的配置项和数据
var optionl = {
    title: {//标题组件
        text: '男厕使用情况',
        left: '10px',//标题的位置 默认是left，其余还有center、right属性
        textStyle: {
            color: "#436EEE",
            fontSize: 12,
        }
    },
    tooltip: { //提示框组件
        trigger: 'item', //触发类型(饼状图片就是用这个)
        formatter: "{a} <br/>{b} : {c} ({d}%)" //提示框浮层内容格式器
    },
    color: ['#f19611', '#027ff2', '#6500c9', '#00c6ff'],  //手动设置每个图例的颜色
    legend: {  //图例组件
        //right:100,  //图例组件离右边的距离
        orient: 'horizontal',  //布局  纵向布局 图例标记居文字的左边 vertical则反之
        width: 30,      //图行例组件的宽度,默认自适应
/*        x: '122',   //图例显示在右边
        y: '42',   //图例在垂直方向上面显示居中*/
        right:'10%',
        top:'30%',
        itemWidth: 10,  //图例标记的图形宽度
        itemHeight: 10, //图例标记的图形高度
        data: ['使用', '维修', '空闲', '无障碍厕所'],
        textStyle: {    //图例文字的样式
            color: '#333',  //文字颜色
            fontSize: 11,//文字大小

        },
        formatter: function (params) {
            //console.log(params);
            //console.log(optionr.series[0].data[0].name)
            for (var i = 0; i < optionl.series[0].data.length; i++) {
                if (optionl.series[0].data[i].name == params) {
                    return params + ":" + optionl.series[0].data[i].value + '个';
                }
            }
        }
    },
    graphic: [{ //环形图中间添加文字
        type: 'text', //通过不同top值可以设置上下显示
        left: '33%',
        top: '45%',
        style: {
            text: '男厕所',
            textAlign: 'center',
            fill: '#000', //文字的颜色
            width: 30,
            height: 30,
            fontSize: 16,
            fontFamily: "Microsoft YaHei"
        }
    }],

    series: [ //系列列表
        {
            name: '男厕所',  //系列名称
            type: 'pie',   //类型 pie表示饼图
            center: ['25%', '60%'], //设置饼的原心坐标 不设置就会默认在中心的位置
            radius: ['40%', '60%'],  //饼图的半径,第一项是内半径,第二项是外半径,内半径为0就是真的饼,不是环形
            hoverAnmation: false,
            itemStyle: {  //图形样式
                normal: { //normal 是图形在默认状态下的样式；emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时。
                    label: {  //饼图图形上的文本标签
                        show: false,//平常不显示

                    },

                    labelLine: {     //标签的视觉引导线样式
                        show: false  //平常不显示
                    }
                },
                emphasis: {   //normal 是图形在默认状态下的样式；emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时。
                    label: {  //饼图图形上的文本标签
                        show: false,
                        position: 'center',
                        textStyle: {
                            // fontSize : '10',
                            // fontWeight : 'bold'
                        }
                    }
                },

            },
            data: [
                {value: 6, name: '使用'},
                {value: 0, name: '维修'},
                {value: 3, name: '空闲'},
                {value: 1, name: '无障碍厕所'},
            ]
        }
    ]
};
myChartl.setOption(optionl);

//——————————————————————————————女厕所——————————————————————————————————————————————————————————
var myChartr = echarts.init(document.getElementById('con-chartr'));
// 指定图表的配置项和数据
var optionr = {
    title: {//标题组件
        text: '女厕使用情况',//con-chart
        left: '10px',//标题的位置 默认是left，其余还有center、right属性
        textStyle: {
            color: "#436EEE",
            fontSize: 12,
        }
    },
    tooltip: { //提示框组件
        trigger: 'item', //触发类型(饼状图片就是用这个)
        formatter: "{a} <br/>{b} : {c} ({d}%)" //提示框浮层内容格式器
    },
    color: ['#d02d43', '#04e0f9', '#1c7ef6', '#cac401'],  //手动设置每个图例的颜色
    legend: {  //图例组件
        //right:100,  //图例组件离右边的距离
        orient: 'horizontal',  //布局  纵向布局 图例标记居文字的左边 vertical则反之
        width: 30,      //图行例组件的宽度,默认自适应
  /*      x: '122',   //图例显示在右边
        y: '42',   //图例在垂直方向上面显示居中*/
        right:"10%",
        top:"30%",
        itemWidth: 10,  //图例标记的图形宽度
        itemHeight: 10, //图例标记的图形高度
        data: ['使用', '维修', '空闲', '无障碍厕所'],
        textStyle: {    //图例文字的样式
            color: '#333',  //文字颜色
            fontSize: 11,//文字大小

        },
        formatter: function (params) {
            //console.log(params);
            //console.log(optionr.series[0].data[0].name)
            for (var i = 0; i < optionr.series[0].data.length; i++) {
                if (optionr.series[0].data[i].name == params) {
                    return params + ":" + optionr.series[0].data[i].value + '件';
                }
            }
        }
    },
    graphic: { //环形图中间添加文字
        type: 'text', //通过不同top值可以设置上下显示
        left: '33%',
        top: '45%',
        z: 2,
        zlevel: 100,
        style: {
            text: '女厕所',
            textAlign: 'center',
            fill: '#000', //文字的颜色
            width: 30,
            height: 30,
            fontSize: 18,
            fontFamily: "Microsoft YaHei"
        }
    },
    series: [ //系列列表
        {
            name: '女厕所',  //系列名称
            type: 'pie',   //类型 pie表示饼图
            center: ['25%', '60%'], //设置饼的原心坐标 不设置就会默认在中心的位置
            radius: ['40%', '60%'],  //饼图的半径,第一项是内半径,第二项是外半径,内半径为0就是真的饼,不是环形
            hoverAnmation: false,
            itemStyle: {  //图形样式
                normal: { //normal 是图形在默认状态下的样式；emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时。
                    label: {  //饼图图形上的文本标签
                        show: false,//平常不显示

                    },
                    labelLine: {     //标签的视觉引导线样式
                        show: false  //平常不显示
                    }
                },
                emphasis: {   //normal 是图形在默认状态下的样式；emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时。
                    show: false,
                    label: {  //饼图图形上的文本标签
                        show: false,
                        position: 'center',
                        textStyle: {
                            // fontSize : '10',
                            // fontWeight : 'bold'
                        }
                    }
                },

            },
            data: [
                {value: 3, name: '使用'},
                {value: 1, name: '维修'},
                {value: 5, name: '空闲'},
                {value: 1, name: '无障碍厕所'},

            ]
        }
    ]
};
myChartr.setOption(optionr);

list = [{}]

var arr = [];

for(var i=0;i<list.length;i++){
    arr.push(list[i]);
}


