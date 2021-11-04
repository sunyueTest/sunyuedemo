var table, rol = false;
layui.use('table', function () {
    var tableData = [
        // {
        //     type: 'checkbox'//, fixed: 'left'
        // },
        {
            field: 'id',
            title: 'ID',
            width: 50,
            // fixed: 'left',
            sort: true, align: 'center'
        }, {
            field: 'name', width: 140, title: $.i18n.prop('name'), align: 'center'
        }
        , {field: 'sensorCode', width: 160, title: $.i18n.prop('nodeNumber'), align: 'center'}
        , {field: 'expression', width: 120, title: $.i18n.prop('expression'), align: 'center'}
        , {
            field: 'time',
            width: 160, title: $.i18n.prop('time'), align: 'center'
        }
        , {
            field: 'toDevice',
            width: 140, title: $.i18n.prop('deviceNo'), align: 'center'
        }
        // , {
        //     field: 'result',
        //     width: 100, title: $.i18n.prop('result'), align: 'center'
        // }
        , {
            field: 'msg',
            width: 100, title: $.i18n.prop('info'), align: 'center'
        }
        , {
            field: 'command', title: $.i18n.prop('command'), align: 'center'
        }
        , {
            width: 100,
            field: '', title: $.i18n.prop('operation'),
            toolbar: '#barDemo', align: 'center'
        }
    ];

    table = layui.table;
    table.render({
        elem: '#table'
        , url: '../conditionConfig/getHistoryList'
        , toolbar: '#toolbar1'
        , cellMinWidth: 50
        , title: ''
        , cols: [tableData]
        , page: true,
        // limitName: 'page',
        // height: 600,
    });
    //设置语言
    $('#aCode').attr('placeholder', $.i18n.prop('nodeNumber'));

    //头工具栏事件
    table.on('toolbar(table)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'search':
                doLoginFilter();//登陆状态验证
                var aCode = $('#aCode').val();
                console.log(aCode);
                reloadDeviceList(aCode);
                break;
        }
    });

    //监听行工具事件
    table.on('tool(table)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') {
            layer.confirm($.i18n.prop('confirmDelete'), {
                btn: [$.i18n.prop('yes'), $.i18n.prop('no')],
                title: $.i18n.prop('info')
            }, function (index) {
                layer.load(2);
                $.ajax({
                    url: "/conditionConfig/deleteHistory?id="+data.id,
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
                            layer.msg($.i18n.prop('success'), {icon: 1})
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
    $('#aCode').attr('placeholder', $.i18n.prop('nodeNumber'));
    $('a.layui-btn.layui-btn-xs.edit').text($.i18n.prop('edit'));
    $('a.layui-btn.layui-btn-xs.del').text($.i18n.prop('delete'));
}