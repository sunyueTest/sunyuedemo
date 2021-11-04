var table, form;
layui.use('table', function () {
    var tableData = [
        {
            field: 'id',
            title: 'ID',
            width: 60,
            // fixed: 'left',
            unresize: true,
            sort: true, align: 'center'
        }, {
            field: 'name', title: $.i18n.prop('name'), width: 140, align: 'center'
        }, {field: 'sensorCode', title: $.i18n.prop('nodeNumber'), width: 140, align: 'center'}
        , {field: 'expression', title: $.i18n.prop('expression'), width: 90, align: 'center'}
        , {field: 'value', title: $.i18n.prop('value'), width: 140, align: 'center'}
        , {
            field: '',
            title: $.i18n.prop('state'),
            width: 90,
            align: 'center',
            toolbar: '#statusTpl'
        }
        , {
            field: '',
            title: $.i18n.prop('operation'),
            toolbar: '#barDemo',
            minWidth: 20,
            align: 'center'
        }
    ];
    table = layui.table, form = layui.form;
    table.render({
        elem: '#table'
        , url: '../conditionConfig/conditionConfigList'
        , toolbar: '#toolbar1'
        , title: ''
        , cols: [tableData]
        , page: true
        // limitName: 'page',
        // height: 600,

    });
    $('#aCode').attr('placeholder', $.i18n.prop('nodeNumber'));
    $('#addTrigger').text($.i18n.prop('addCondition'));
    //头工具栏事件
    table.on('toolbar(table)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'detail':
                break;
            case 'search':
                doLoginFilter();//登陆状态验证
                var aCode = $('#aCode').val();
                reloadDeviceList(aCode);
                break;
            case 'addTrigger':
                var win = layer.open({
                    type: 2,
                    area: ['360px', '170px'],
                    title: $.i18n.prop('addCondition'),
                    // maxmin: true,
                    //btn: ['确定', '取消'],
                    btnAlign: 'c',
                    yes: function (index, layero) {
                        //表单提交
                        /*  var body = layer.getChildFrame('body', index);
                          body.find('form').submit();
                          layer.close(index);
*/
                    },
                    anim: 3,
                    content: '../conditionConfig/getCondition',
                    success: function (layero, index) {
                        /* var body = layer.getChildFrame('body', index);
                         body.find('input[name="pId"]').val(0);
                         body.find("input[name='flag']").val('add');*/

                    }
                });
                layer.full(win);
                break;
        }
    });

    //监听行工具事件
    table.on('tool(table)', function (obj) {
        var data = obj.data;
        if (obj.event === 'edit') {
            //layer.msg($.i18n.prop('notSupported'));
            var win = layer.open({
                type: 2,
                //area: ['800px', '500px'],
                title: $.i18n.prop('conditionApp'),
                anim: 3,
                content: '../conditionConfig/getCondition?id=' + data.id,
                success: function (layero, index) {
                    console.log(index);
                }
            });
            layer.full(win);
            //} else if (obj.event === 'show') {
            // parent.jumpDashboard(data.deviceNumber);
        } else if (obj.event === 'del') {
            layer.confirm($.i18n.prop('confirmDelete'), {
                btn: [$.i18n.prop('yes'), $.i18n.prop('no')],
                title: $.i18n.prop('info')
            }, function (index) {
                layer.load(2);
                $.ajax({
                    url: "conditionConfig/delCondition",
                    data: {id: obj.data.id},
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
                        if (true == data.success) {
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

    //监听switch操作
    form.on('switch(status)', function (obj) {

        // layer.tips(this.value + ' ' + this.name + '：' + obj.elem.checked, obj.othis);
        var state = 0;
        if (obj.elem.checked) {
            state = 1;
        }
        $.ajax({
            url: "../conditionConfig/updateState",
            data: {id: this.value, state: state},
            dataType: "json",
            type: "post",
            timeout: 30000,
            error: function (data, type, err) {
                console.log(err);
                layer.closeAll('loading');
                layer.msg($.i18n.prop('fail'), {
                    offset: '6px'
                });
                $('.layui-laypage-btn').click();
            },
            success: function (data) {
                layer.closeAll('loading');
                layer.msg(data.msg);
                if (!data.success) {
                    $('.layui-laypage-btn').click();
                    // $('.tableReload .layui-form-item .layui-btn').click()
                }
            }
        });
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
    $('#aCode').attr('placeholder', $.i18n.prop('nodeNumber'));
    $('#addTrigger').text($.i18n.prop('addCondition'));

    $('#aCode').val(aCode);

}

function onReceive(type, data) {
    if (type == 'addTriggerSuccess') {
        reloadDeviceList('');
    }
}