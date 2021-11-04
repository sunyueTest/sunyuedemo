let table, form;
layui.use('table', function () {
    let tableData = [
        {field: 'taskName', title: $.i18n.prop('任务名称'), align: 'center'},
        {field: 'deviceNumber', title: $.i18n.prop('nodeNumber'), width: 140, align: 'center'},
        {
            field: '',
            title: $.i18n.prop('任务类型'),
            align: 'center',
            templet: function (d) {
                switch(d.taskType){
                    case "1": return $.i18n.prop('一次性任务'); break;
                    case "2": return $.i18n.prop('每月任务'); break;
                    case "3": return $.i18n.prop('每日任务'); break;
                }
            }
        },
        {field: 'time', title: $.i18n.prop('任务时间'), align: 'center', width : 210,
            templet: function (d) {
                let type = d.taskType, year = d.year, month = d.month, day = d.day, time = d.time;
                switch(type){
                    case "1":
                        return year + "年" + month + "月" + day + "日 " + time;
                        break;
                    case "2":
                        return day + "日 " + time;
                        break;
                    case "3":
                        return time;
                        break;
                }
            }},
        {field: 'command', title: $.i18n.prop('command'), align: 'center'},
        {field: 'taskTime', title: $.i18n.prop('执行时间'), width: 200, align: 'center'},
        {
            field: 'taskStatus',
            title: $.i18n.prop('执行状态'),
            align: 'center',
            templet: function (d) {
                if(d.taskStatus == '1'){
                    return $.i18n.prop('command_success');
                }else{
                    return $.i18n.prop('command_fail');
                }
            }
        }
    ];

    table = layui.table;
    form = layui.form;

    table.render({
        elem: '#table'
        , url: '../timeTaskManage/getTimeTaskHistory'
        , toolbar: '#toolbar1'
        , title: ''
        , cols: [tableData]
        , page: true,
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
        },
        done: function (res, curr, count) {
            console.log(res);
        }

    });
    $('#aCode').attr('placeholder', $.i18n.prop('nodeNumber'));

    //头工具栏事件
    table.on('toolbar(table)', function (obj) {
        switch (obj.event) {
            case 'search':
                doLoginFilter();//登陆状态验证
                let aCode = $('#aCode').val();
                reloadDeviceList(aCode);
                break;
        }
    });

    //监听行工具事件
    table.on('tool(table)', function (obj) {
        let data = obj.data;
        if (obj.event === 'edit') {
            layer.open({
                type: 2,
                title: false,
                closeBtn: true,
                area: ['850px', '450px'],
                shade: 0.2,
                id: 'LAY_onLineCtrl',
                btnAlign: 'c',
                moveType: 1,
                content: '../timeTaskManage/toUpdateTimeTask?id=' + data.id
            });
        } else if (obj.event === 'del') {
            layer.confirm($.i18n.prop('confirmDelete'), {
                btn: [$.i18n.prop('yes'), $.i18n.prop('no')],
                title: $.i18n.prop('info')
            }, function (index) {
                layer.load(2);
                $.ajax({
                    url: "../timeTaskManage/delTimeTaskManage",
                    data: {id: data.id},
                    dataType: "json",
                    type: "post",
                    timeout: 30000,
                    error: function (data, type, err) {
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

    //监听switch操作
    form.on('switch(status)', function (obj) {
        let state = 0;
        if (obj.elem.checked) {
            state = 1;
        }
        $.ajax({
            url: "../timeTaskManage/changeTimeTaskStatus",
            data: {id: this.value, status: state},
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
                if ('success' != data.state) {
                    $('.layui-laypage-btn').click();
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
            queryParam: aCode
        }
    });
    $('#aCode').attr('placeholder', $.i18n.prop('nodeNumber'));
}

function onReceive(type, data) {
    if (type == 'addTriggerSuccess') {
        reloadDeviceList('');
    }
}