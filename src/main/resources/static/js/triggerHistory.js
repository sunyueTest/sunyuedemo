var table, rol = false;
layui.use('table', function () {
    var tableData = [
        // {
        //     type: 'checkbox'//, fixed: 'left'
        // },
        {
            field: 'id',
            title: 'ID',
            width: 60,
            // fixed: 'left',
            unresize: true,
            sort: true, align: 'center'
        }, {
            field: 'name', title: $.i18n.prop('name'), width: 150, align: 'center'
        }
        , {field: 'sensorCode', title: $.i18n.prop('nodeNumber'), width: 160, align: 'center'}
        , {field: '', title: $.i18n.prop('pushType'), width: 120, align: 'center',templet:function(d){
                return $.i18n.prop(d.type);
            }}
        , {field: 'expression', title: $.i18n.prop('expression'), width: 140, align: 'center'}
        // , {field: '', title: '报警状态', width: 90, align: 'center', toolbar: '#onLine'}
        , {field: 'alarmTime', title: $.i18n.prop('alarmTime'), width: 160, align: 'center'}
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
        elem: '#table'
        , url: '../trigger/triggerHistoryList'
        , toolbar: '#toolbar1'
        , title: ''
        , cols: [tableData]
        , page: true,
        // limitName: 'page',
        // height: 600,
        request: {limitName: 'size'},
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
    //设置语言
    $('#aCode').attr('placeholder',$.i18n.prop('nodeNumber'));
    $('a.layui-btn.layui-btn-xs.edit').text($.i18n.prop('edit'));
    $('a.layui-btn.layui-btn-xs.del').text($.i18n.prop('delete'));

    //头工具栏事件
    table.on('toolbar(table)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'detail':
                break;
            case 'search':
                doLoginFilter();//登陆状态验证
                var aCode = $('#aCode').val();
                console.log(aCode);
                reloadDeviceList(aCode);
                break;
            case 'addTrigger':
                parent.sendBroadcast('addTrigger', null);
                break;
        }
    });

    //监听行工具事件
    table.on('tool(table)', function (obj) {
        var data = obj.data;
        if (obj.event === 'edit') {
            layer.msg($.i18n.prop('notSupported'))
            // var win = layer.open({
            //     type: 2,
            //     //area: ['800px', '500px'],
            //     title: '设备详情',
            //     anim: 3,
            //     content: '../deviceManage/deviceDetail?deviceNumber=' + data.deviceNumber,
            //     success: function (layero, index) {
            //         console.log(index);
            //     }
            // });
            // layer.full(win);
        } else if (obj.event === 'show') {
            // parent.jumpDashboard(data.deviceNumber);
        } else if (obj.event === 'del') {
            layer.confirm($.i18n.prop('confirmDelete'), { btn:[$.i18n.prop('yes'),$.i18n.prop('no')],title:$.i18n.prop('info')},function (index) {
                layer.load(2);
                $.ajax({
                    url: "trigger/delTriggerHistory",
                    data: obj.data,
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
                            $('.layui-laypage-btn').click();
                            layer.msg($.i18n.prop(data.msg), {icon: 1})
                        } else {
                            layer.msg($.i18n.prop(data.msg), {icon: 2})
                        }
                    }
                });
            });
        }
    });
});

function reloadDeviceList(aCode) {
    table.reload('table', {
        page: {
            curr: 1 //重新从第 1 页开始
        }
        , where: {
            sensorCode: aCode
        }
    });
    $('#aCode').val(aCode);
    $('#aCode').attr('placeholder',$.i18n.prop('nodeNumber'));
    $('a.layui-btn.layui-btn-xs.edit').text($.i18n.prop('edit'));
    $('a.layui-btn.layui-btn-xs.del').text($.i18n.prop('delete'));
}