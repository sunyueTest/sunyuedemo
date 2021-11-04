window.onload=function(){
    var myChart1 = echarts.init(document.getElementById('pie1'));
    option1 = {
        title:{
            text:'',
            top:'top',
            left:'center',
            textStyle:{
                fontSize: 18,
                fontWeight: '',
                color: '#fff'
            },
        },//标题
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)",
            /*formatter:function(val){   //让series 中的文字进行换行
                 console.log(val);//查看val属性，可根据里边属性自定义内容
                 var content = var['name'];
                 return content;//返回可以含有html中标签
             },*/ //自定义鼠标悬浮交互信息提示，鼠标放在饼状图上时触发事件
        },//提示框，鼠标悬浮交互时的信息提示
        legend: {
            show: true,
            orient: 'vertical',
            textStyle:{color:'#fff',fontSize:"12"},
            x: 'left',
            formatter:function(name){

                var index = 0;
                var clientlabels = ['男生人数','女生人数'];
                var clientcounts = [339,106];
                clientlabels.forEach(function(value,i){
                    if(value == name){
                        index = i;
                    }
                });
                return name + "  " + clientcounts[index];
            },
            data: ['男生人数', '女生人数']

        },//图例属性，以饼状图为例，用来说明饼状图每个扇区，data与下边series中data相匹配
        graphic:{
            type:'text',
            left:'center',
            top:'center',
            style:{
                text:'用户统计\n'+'100', //使用“+”可以使每行文字居中
                textAlign:'center',
                fill:'#fff',
                width:30,
                height:30
            }
        },//此例饼状图为圆环中心文字显示属性，这是一个原生图形元素组件，功能很多
        series: [
            {
                name:'用户统计',//tooltip提示框中显示内容
                type: 'pie',//图形类型，如饼状图，柱状图等
                radius: ['35%', '60%'],//饼图的半径，数组的第一项是内半径，第二项是外半径。支持百分比，本例设置成环形图。具体可以看文档或改变其值试一试
                //roseType:'area',是否显示成南丁格尔图，默认false
                center:['50%','65%'],
                itemStyle: {
                    normal:{
                        label:{
                            show:true,
                            textStyle:{color:'#fff',fontSize:"12"},
                            formatter:'{b}  \n{c}({d}%)'
                        },//饼图图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等。可以与itemStyle属性同级，具体看文档
                        labelLine:{
                            show:true,
                            lineStyle:{color:'#fff'}
                        }//线条颜色
                    },//基本样式
                    emphasis: {
                        show:false,
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',//鼠标放在区域边框颜色
                        textColor:'#fff'
                    }//鼠标放在各个区域的样式
                },
                data: [
                    {value: 339, name: '男生人数'},
                    {value: 106, name: '女生人数'},
                ],//数据，数据中其他属性，查阅文档
                color: ['#00c9ff','#ff9480'],//各个区域颜色
            },//数组中一个{}元素，一个图，以此可以做出环形图
        ],//系列列表
    };
    myChart1.setOption(option1);



    var myChartzhu = echarts.init(document.getElementById("main"));
    var optionzhu = {
        title: {
            text: ''
        },
        tooltip: {},
        legend: {
            data:['公厕当天使用总人数'],
            textStyle:{
                fontSize:15,
                color:'#fff'
            },
        },
        xAxis: {
            axisLine: {
                lineStyle: {
                    type: 'solid',
                    color: '#24d1f3',//左边线的颜色
                    width:'1'//坐标线的宽度
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#fff',//坐标值得具体的颜色

                }
            },
            data: ["农业路","华夏路","苏州路","珠海路","大庆路","青岛路"]
        },
        yAxis: {
            axisLine: {
                lineStyle: {
                    type: 'solid',
                    color: '#24d1f3',//左边线的颜色
                    width:'1'//坐标线的宽度
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#fff',//坐标值得具体的颜色

                }
            },
        },
        series: [{
            name: '',
            type: 'bar',
            barWidth : 25,
            data: [
                {
                    value:800,
                    itemStyle: {
                        color: '#274cd5',
                    }
                },
                {
                    value:180,
                    itemStyle: {
                        color: '#fdb101',
                    }

                },
                {
                    value:150,
                    itemStyle: {
                        color: '#1695df',
                    }
                },
                {
                    value:200,
                    itemStyle: {
                        color: '#fe631b',
                    }
                },
                {
                    value:45,
                    itemStyle: {
                        color: '#fc9b01',
                    }
                },
                {
                    value:89,
                    itemStyle: {
                        color: '#c7310e',
                    }
                },
            ],

        }]
    };
    myChartzhu.setOption(optionzhu);


}