$("#order").hide();
layui.use('table', function () {
    let tableData = [
        {field: 'orderTitle', title: "预约标题", align: 'center', width: '40%'},
        {field: 'orderName', title: "预约用户", align: 'center', width: '20%'},
        {field: 'orderTime', title: "预约时间", align: 'center', width: '28%'},
        {
            field: 'isOrder', title: "预约状态", align: 'center', width: '12%',
            templet: function (d) {
                if (d.isOrder == 0) {
                    return '<span>待接受</span>'
                } else if (d.isOrder == 1) {
                    return '<span style="color: greenyellow;">已同意</span>'
                } else if (d.isOrder == 2) {
                    return '<span style="color: red;">已拒绝</span>'
                }else if (d.isOrder == 3) {
                    return '<span style="color: grey;">已取消</span>'
                }
            }
        },
    ];

    table = layui.table;
    form = layui.form;

    table.render({
        elem: '#table'
        , url: '/sysUserOrder/findExpertOrderList'
        , title: ''
        , cols: [tableData]
        , page: true,
        request: {limitName: 'size'},
        response: {
            statusCode: 'success'
        },
        done: function (res, curr, count){
            $(".layui-laypage-btn").text("转");
        },
        parseData: function (res) { //将原始数据解析成 table 组件所规定的数据
            return {
                "code": res.state, //解析接口状态
                "msg": res.msg, //解析提示文本
                "count": res.count, //解析数据长度
                "data": res.datas,//解析数据列表

            };
            if ('success' != res.state) {
                layer.msg($.i18n.prop(res.msg), {icon: 2})
            }
        }
    });

    table.on('row(table)', function (obj) {
        let data = obj.data;
        obj.tr.addClass('layui-table-click').siblings().removeClass('layui-table-click');
        $.ajax({
            url: '/sysUserOrder/findorderDetails',
            type: "GET",
            data: {
                id: data.id,
            },
            dataType: "json",
            error: function (data, type, err) {
                layer.closeAll('loading');
                layer.msg($.i18n.prop('fail'), {
                    offset: '6px', icon: 2
                });
            },
            success: function (data) {

                if (data.state == "success") {
                    $(".reply").show();
                    $(".orderDetails").show();
                    $(".orderTime").text(data.data.orderTime);
                    $(".order-Details").html('<span>'+data.data.orderDetails+'</span>');
                    var $orderReply=$(".order-Reply").empty();
                    if(data.data.isOrder!="0"){
                        $orderReply.html('<span>'+data.data.orderReply+'</span>');

                    }else{
                        var $reply=$('<textarea class="reply">&nbsp;&nbsp;&nbsp;&nbsp;</textarea>');
                        $reply.appendTo($orderReply);
                    }
                    $("#orderOK").attr("dataId", data.data.id);
                    $("#orderNO").attr("dataId", data.data.id);
                    if (data.data.isOrder == "0") {
                        $("#orderOK").show();
                        $("#orderNO").show();
                    } else {
                        $("#orderOK").hide();
                        $("#orderNO").hide();
                    }
                }
            }
        })
    })
});

$("#orderOK").click(function () {
    var id = $("#orderOK").attr("dataId");
    layer.confirm("是否接受预约？", {
        btn: [$.i18n.prop('yes'), $.i18n.prop('no')],
        title: $.i18n.prop('info')
    }, function (index) {
        $.ajax({
            url: '/sysUserOrder/updateOrder',
            type: "GET",
            data: {
                id: id,
                isOrder:1,
                orderReply:$('.reply').val()

            },
            dataType: "json",
            error: function (data, type, err) {
                layer.closeAll('loading');
                layer.msg($.i18n.prop('fail'), {
                    offset: '6px', icon: 2
                });
            },
            success: function (data) {
                layer.msg($.i18n.prop(data.msg));
                if (data.state == "success") {
                    reloadTable();
                    $(".orderDetails").hide();
                }
            }
        })
    })
})

$("#orderNO").click(function () {
    var id = $("#orderNO").attr("dataId");
    layer.confirm("是否拒绝预约？", {
        btn: [$.i18n.prop('yes'), $.i18n.prop('no')],
        title: $.i18n.prop('info')
    }, function (index) {
        $.ajax({
            url: '/sysUserOrder/updateOrder',
            type: "GET",
            data: {
                id: id,
                orderReply:$('.reply').val()
            },
            dataType: "json",
            error: function (data, type, err) {
                layer.closeAll('loading');
                layer.msg($.i18n.prop('fail'), {
                    offset: '6px', icon: 2
                });
            },
            success: function (data) {
                layer.msg($.i18n.prop(data.msg));
                if (data.state == "success") {
                    reloadTable();
                    $(".orderDetails").hide();
                }
            }
        })
    })
})

function reloadTable() {
    table.reload('table', {
        page: {
            curr: 1 //重新从第 1 页开始
        }
    });
}