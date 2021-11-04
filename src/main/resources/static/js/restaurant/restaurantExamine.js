var table;
var laydate;
layui.use(['table', 'laydate'], function () {
    let tableData = [
        {
            field: 'restauranName', title: "商家名称", align:
                'center'
        }
        , {
            field: 'restauranType',
            title: "经营类型",
            align: 'center',
            templet: function (d) {
                if (d.restauranType == 0) {
                    return '餐饮';
                } else if (d.restauranType == 1) {
                    return '食堂';
                } else if (d.restauranType == 2) {
                    return '农贸市场';
                } else if (d.restauranType == 3) {
                    return '超市';
                } else if (d.restauranType == 4) {
                    return '制造业';
                } else if (d.restauranType == 5) {
                    return '特种设备';
                } else if (d.restauranType == 6) {
                    return '药品';
                } else if (d.restauranType == 7) {
                    return '医疗器械';
                } else if (d.restauranType == 8) {
                    return '保健品';
                } else if (d.restauranType == 9) {
                    return '化妆品';
                }
            },
            width: 100
        }
        , {field: 'createTime', title: "申请时间", align: 'center'}
        // , {field: 'tel', title: "联系方式", align: 'center'}
        , {
            field: '',
            title: $.i18n.prop('operation'),
            toolbar: '#barDemo',
            minWidth: 20,
            align: 'center'
        }
    ];
    table = layui.table;
    table.render({
        elem: '#restaurant'
        , url: '/restaurant/findRestaurantTimeList'
        , toolbar: '#toolbar1'
        , title: "明厨亮灶"
        , cols: [tableData]
        , page: true
        , height: 600,
        response: {
            statusCode: 'success'
        },
        parseData: function (res) { //将原始数据解析成 table 组件所规定的数据
            return {
                "code": res.state, //解析接口状态
                "msg": res.msg, //解析提示文本
                "count": res.count, //解析数据长度
                "data": res.datas,//解析数据列表
            };
        }
    });

    //头工具栏事件
    table.on('toolbar(restaurant)', function (obj) {
        // var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'search':
                doLoginFilter(); //登陆验证
                var restayrantName = $('#restayrantName').val();
                reloadRestayrantList(restayrantName);
                break;
        }
    });

    //监听行工具事件
    table.on('tool(restaurant)', function (obj) {
        var data = obj.data;
        if (obj.event === 'xiangqing') {
            layer.open({
                type: 2,
                title: false,
                closeBtn: true,
                area: ['450px', '530px'],
                shade: 0.2,
                id: 'LAY_onLineCtrl',
                btnAlign: 'c',
                moveType: 1,
                content: '../restaurant/restaurantDetails?restaurantId=' + data.id,

            });
        } else if (obj.event === 'tongguo') {
            layer.confirm("确认通过商家审核么？", {
                btn: [$.i18n.prop('yes'), $.i18n.prop('no')],
                title: $.i18n.prop('info')
            }, function (index) {
                layer.load(2);
                $.ajax({
                    url: "../restaurant/examineRestaurant",
                    data: {
                        restaurantId: data.id,
                        type: 1
                    },
                    dataType: "json",
                    type: "post",
                    timeout: 30000,
                    error: function (data, type, err) {
                        console.log(err);
                        layer.closeAll('loading');
                        layer.msg($.i18n.prop('fail'), {
                            offset: '6px', icon: 2
                        });
                    },
                    success: function (data) {
                        layer.closeAll('loading');
                        if ('success' == data.state) {
                            $('.layui-btn').click();
                            layer.msg($.i18n.prop(data.msg), {icon: 1});
                        } else {
                            layer.msg($.i18n.prop(data.msg), {icon: 2});
                        }
                    }
                });
            });
        } else if (obj.event === 'bohui') {
            layer.prompt(
                {
                    formType: 2,
                    value: '',
                    title: '请输入驳回原因'
                }
                , function (value, index, elem) {
                    layer.load(2);
                    $.ajax({
                        url: "../restaurant/examineRestaurant",
                        data: {
                            restaurantId: data.id,
                            type: 2,
                            remarks:value
                        },
                        dataType: "json",
                        type: "post",
                        timeout: 30000,
                        error: function (data, type, err) {
                            console.log(err);
                            layer.closeAll('loading');
                            layer.msg($.i18n.prop('fail'), {
                                offset: '6px', icon: 2
                            });
                        },
                        success: function (data) {
                            layer.closeAll('loading');
                            if ('success' == data.state) {
                                $('.layui-btn').click();
                                layer.msg($.i18n.prop(data.msg), {icon: 1});
                                layer.close(index);
                            } else {
                                layer.msg($.i18n.prop(data.msg), {icon: 2});
                            }
                        }
                    });
                });
        }
    });

    laydate = layui.laydate;
    //常规用法
    laydate.render({
        elem: '#test1'
    });
    laydate.render({
        elem: '#test2'
    });
});

//重新加载商家列表
function reloadRestayrantList(restaurantName) {
    var stateTime = $("#test1").val();
    var endTime = $("#test2").val();
    table.reload('restaurant', {
        page: {
            curr: 1 //重新从第 1 页开始
        }
        , where: {
            stateTime: stateTime,
            endTime:endTime,
            restaurantName: restaurantName
        }
    });
    $("#test1").val(stateTime);
    $("#test2").val(endTime);
    laydate.render({
        elem: '#test1'
    });
    laydate.render({
        elem: '#test2'
    });
    $('#restayrantName').val(restaurantName);
}
