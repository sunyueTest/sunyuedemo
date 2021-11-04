var table, commandMap = new Map();
layui.use('layer', function () {
    layer.load(1);
    $.ajax({
        url: "device/getCommandTypeList",
        dataType: "json",
        data: {size: 1000},
        type: "get",
        timeout: 30000,
        error: function (data, type, err) {
            layer.closeAll('loading');
            layer.msg($.i18n.prop('fail'));
            setTimeout(function () {
                parent.layer.closeAll()
            }, 1000)
        },
        success: function (data) {
            if (data.state == 'success') {
                for (let i = 0; i < data.datas.length; i++) {
                    commandMap.set(data.datas[i].command, data.datas[i].name);
                }
                initTable();
            } else {
                layer.msg($.i18n.prop(data.msg));
                setTimeout(function () {
                    parent.layer.closeAll()
                }, 1000)
            }
        }
    });
})

function initTable() {
    layui.use('table', function () {
        table = layui.table;
        table.render({
            id: 'loadtable',
            elem: '#device'
            , url: '../device/getCommandList'
            , toolbar: '#toolbar1'
            , title: '区域列表'
            , cols: [[
                {
                    field: 'id', title: 'ID', width: 80, sort: true, align: 'center'
                }, {
                    field: 'deviceNumber',
                    title: $.i18n.prop('deviceNo'),
                    width: 140,
                    align: 'center'
                    // }, {
                    //     field: 'deviceType', title: '设备类型', width: 100, align: 'center'
                }, {
                    field: '', title: $.i18n.prop('command'), templet: function (d) {
                        return '<span class="stateInput">' + $.i18n.prop('command' + d.command) + '</span>';
                    }, width: 180, align: 'center'
                }, {
                    field: 'val', title: $.i18n.prop('value'), width: 120, align: 'center'
                }, {
                    field: 'createTime',
                    title: $.i18n.prop('createTime'),
                    width: 195,
                    align: 'center'
                }, {
                    field: 'commandTime',
                    title: $.i18n.prop('commandTime'),
                    width: 195,
                    align: 'center'
                }, {
                    field: '',
                    title: $.i18n.prop('status'),
                    width: 80,
                    align: 'center',
                    templet: function (d) {
                        if (d.isSuccess == 1) {
                            return $.i18n.prop('command_success');
                        }
                        return $.i18n.prop('wait');
                    }
                }, {
                    field: 'right',
                    title: $.i18n.prop('operation'),
                    toolbar: '#delTemplate',
                    minWidth: 120,
                    align:
                        'center'
                }]],
            page: true,
            response: {
                statusCode: 'success' //重新规定成功的状态码为 200，table 组件默认为 0
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
        $('#input_device_code').attr('placeholder', $.i18n.prop('deviceNo'));
        $('#sendCommand').text($.i18n.prop('sendCommand'));
        $('.success').text($.i18n.prop('command_success'));
        $('.wait').text($.i18n.prop('wait'));
        $('a.layui-btn.layui-btn-xs.del').text($.i18n.prop('delete'));


        layer.closeAll('loading');
        //头工具栏事件
        table.on('toolbar(device)', function (obj) {
            var checkStatus = table.checkStatus(obj.config.id);
            switch (obj.event) {
                case 'search':
                    doLoginFilter();//登陆状态验证
                    var deviceCode = $('#input_device_code').val();
                    reloadCommandList(deviceCode);
                    break;
                case 'sendCommand':
                    parent.changeState('sendCommand');
                    break;
            }
        });

        //监听行工具事件
        table.on('tool(device)', function (obj) {
            var data = obj.data;
            if (obj.event === 'del') {
                layer.confirm($.i18n.prop('confirmDelete'), { btn:[$.i18n.prop('yes'),$.i18n.prop('no')],title:$.i18n.prop('info')},function (index) {
                    layer.load(2);
                    $.ajax({
                        url: "device/delCommand",
                        data: obj.data,
                        dataType: "json",
                        type: "post",
                        timeout: 30000,
                        error: function (data, type, err) {
                            layer.closeAll('loading');
                            layer.msg($.i18n.prop('fail'), {
                                offset: '6px'
                            });
                        },
                        success: function (data) {
                            layer.closeAll('loading');
                            layer.msg($.i18n.prop(data.msg))
                            if ('success' == data.state) {
                                // $('.tableReload .layui-form-item .layui-btn').click()
                                $('.layui-laypage-btn').click();
                            }
                        }
                    });
                });
            }
        });
    });
}

function reloadCommandList(deviceCode) {
    table.reload('loadtable', {
        page: {
            curr: 1 //重新从第 1 页开始
        }
        , where: {
            deviceCode: deviceCode
        }
    });
    $('#input_device_code').val(deviceCode);
    //设置语言
    $('#input_device_code').attr('placeholder', $.i18n.prop('deviceNo'));
    $('#sendCommand').text($.i18n.prop('sendCommand'));
    $('.success').text($.i18n.prop('command_success'));
    $('.wait').text($.i18n.prop('wait'));
    $('a.layui-btn.layui-btn-xs.del').text($.i18n.prop('delete'));
}