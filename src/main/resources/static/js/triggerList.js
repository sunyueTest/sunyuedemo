var table, form;
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
            field: 'name', title: $.i18n.prop('name'), width: 140, align: 'center'
        }
        , {field: 'sensorCode', title: $.i18n.prop('nodeNumber'), width: 140, align: 'center'}
        , {
            field: '',
            title: $.i18n.prop('pushType'),
            width: 90,
            align: 'center',
            templet: function (d) {
                return $.i18n.prop(d.type);
            }
        }
        , {field: 'expression', title: $.i18n.prop('expression'), width: 90, align: 'center'}
        , {
            field: '',
            title: $.i18n.prop('alarmState'),
            width: 90,
            align: 'center',
            toolbar: '#statusTpl'
        }
        , {
            field: '',
            title: $.i18n.prop('autoClose'),
            width: 90,
            align: 'center',
            toolbar: '#autoCloseTpl'
        }
        , {field: 'creatTime', title: $.i18n.prop('creatTime'), width: 160, align: 'center'}
        , {field: 'alarmTime', title: $.i18n.prop('alarmTime'), width: 160, align: 'center'}
        , {
            field: '',
            title: $.i18n.prop('operation'),
            toolbar: '#barDemo',
            minWidth: 20,
            align: 'center',
            width: 200
        }
    ];

    table = layui.table, form = layui.form;
    table.render({
        elem: '#table'
        , url: '../trigger/triggerList'
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
        },
        done: function (res, curr, count) {
            $('#aCode').attr('placeholder', $.i18n.prop('nodeNumber'));
            $('#detail').text($.i18n.prop('seeDetail'));
            $('#addTrigger').text($.i18n.prop('addTrigger'));
            $('#toggle').text($.i18n.prop('toggle'));
            $('#addTriggerAll').text($.i18n.prop('addTriggerAll'));
            $('a.layui-btn.layui-btn-xs.edit').text($.i18n.prop('edit'));
            $('a.layui-btn.layui-btn-xs.del').text($.i18n.prop('delete'));
        }
    });

    // $('#aCode').attr('placeholder', $.i18n.prop('nodeNumber'));
    // $('#detail').text($.i18n.prop('seeDetail'));
    // $('#addTrigger').text($.i18n.prop('addTrigger'));
    // $('#toggle').text($.i18n.prop('toggle'));
    // $('#addTriggerAll').text($.i18n.prop('addTriggerAll'));
    // $('a.layui-btn.layui-btn-xs.edit').text($.i18n.prop('edit'));
    // $('a.layui-btn.layui-btn-xs.del').text($.i18n.prop('delete'));


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
            case 'addTriggerAll':
                parent.sendBroadcast('addTriggerAll', null);
                break;
            case 'toggle':
                layer.msg('<br>'+$.i18n.prop('allToggle')+'<br><br>', {
                    time: 20000, //20s后自动关闭
                    title: $.i18n.prop('allToggle'),
                    btn: [ $.i18n.prop('on'), $.i18n.prop('off'),$.i18n.prop('cancel')],
                    yes: function () {
                        console.log("yes")
                        layer.closeAll();
                        toggle('open');
                    }, btn2: function () {
                        toggle('close');
                        console.log("btn2")
                    }
                });
                break
        }
    });

    function toggle(type) {

        $.ajax({
            url: "trigger/toggle",
            data: {'type': type},
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
    }

    //监听行工具事件
    table.on('tool(table)', function (obj) {
        var data = obj.data;

        if (obj.event === 'edit') {
          //  console.log("<><><><><>");
           // layer.msg($.i18n.prop('notSupported'))
            layer.open({
                type: 2,
                area: ['500px', '500px'],
                title: '修改触发器',
                btn: [$.i18n.prop('save'), $.i18n.prop('cancel')],
                btnAlign: 'c',
                yes: function (index, layero) {

                    var body = layer.getChildFrame('body', index);
                    var name = body.find('input[name="name"]').val();
                    var address = body.find('input[name="address"]').val();
                    let sensorCode = body.find('input[name="nodeNumber"]').val();
                    let type = body.find('span[name="type"]').text();
                    let deviceNumber = body.find('input[name="deviceNumber"]').val();
                    let devicePassword = body.find('input[id="devicePassword"]').val();
                    // let expression = body.find('input[name="expression"]').val();
                    // var nodeNumber = $('#nodeNumber').val();
                    // var nodeName = $('#nodeName').val();
                    // var expression = $('#expression').val();
                    // var address = $('#address').val();

                    if(type ==$.i18n.prop('email')){
                        type = "email";
                    }else if(type==$.i18n.prop('tel')){
                        type ="tel";
                    }else{
                        type =null;
                    }

                    $("#groupSel").text()
                    let expression = body.find('input[name="expression"]').val();
                    if (name.trim().length <= 0) {
                        layer.msg($.i18n.prop('warn11'));
                        return;
                    }
                    if(sensorCode.trim().length <= 0){
                        layer.msg($.i18n.prop('err70'));
                        return;
                    }
                    if(type == null){
                        layer.msg($.i18n.prop('warn27'));
                        return;
                    }
                    if(address.trim().length <= 0){
                        layer.msg($.i18n.prop('emailPo'));
                        return;
                    }
                    if(expression.trim().length <= 0){
                        layer.msg($.i18n.prop('warn28'));
                        return;
                    }
                    if(expression.trim().length >= 0){

                        if(expression.match(">")){
                            let split = expression.trim().split(">")
                            if(split[1].match("^[A-Za-z]+$")){
                                layer.msg($.i18n.prop('err78'));
                                return;
                            }
                        }else if(expression.match("<")){
                            let split =expression.trim().split("<");
                            if(split[1].match("^[A-Za-z]+$")){
                                layer.msg($.i18n.prop('err78'));
                                return;
                            }
                        }
                    }
                    if(type ==="email"){
                        var addressValue = $("#address").val();
                        if(!address.match("^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$")){
                            layer.msg($.i18n.prop('err74'));
                            return;
                        }
                    }else if(type ==="tel"){
                        var addressValue = $("#address").val();
                        if(!address.match("^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\\d{8}$")){
                            layer.msg($.i18n.prop('err75'));
                            return;
                        }
                    }
                    $.ajax({
                        url: "../raise/verfiyPassword",
                        data:{
                            name: name,
                            type: type,
                            password: devicePassword,
                            expression: expression,
                            address: address,
                            sensorCode:sensorCode
                        },
                        dataType: "json",
                        type: "post",
                        success: function (result) {
                            if("success" === result.state){
                                $.ajax({
                                    url: "../raise/updateTrigger",
                                    data: {
                                        name: name,
                                        id: data.id,
                                        sensorCode: sensorCode,
                                        type: type,
                                        address: address,
                                        expression: expression,
                                    },
                                    dataType: "json",
                                    type: "post",
                                    success: function (result) {
                                        if (result.state === "success") {
                                            layer.msg($.i18n.prop('success'));
                                            layer.close(index);
                                            table.render({
                                                elem: '#table'
                                                , url: '../trigger/triggerList'
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
                                        } else {
                                            layer.msg($.i18n.prop(result.msg));
                                        }
                                    }
                                });
                            }else{
                                layer.msg($.i18n.prop(result.msg));
                            }
                        },
                    });



                },
                anim: 3,
                content: '/raise/getTriggerDetail?id=' + data.id,
                success: function (layero, index) {

                    var body = layer.getChildFrame('body', index);
                    var iframeWin = window[layero.find('iframe')[0]['name']];
                    var address = body.find('input[name="address"]').val();
                    if(address.match("^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$")){
                        body.find('span[name="type"]').text($.i18n.prop('email'));
                    }else if(address.match("^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\\d{8}$")){
                        body.find('span[name="type"]').text($.i18n.prop('tel'));
                    }
                    // body.find('input[name="serial"]').attr("readOnly", "true");
                    // body.find('input[name="validateCode"]').attr("readOnly", "true");
                }
            });

        }
        else if(obj.event ==="set"){
            layer.open({
                type: 2,
                area: ['400px', '400px'],
                title: $.i18n.prop('设置报警推送时间'),
                anim: 3,
                content: '/raise/toSetTime?id=' + data.id,
            })

        }
        else if (obj.event === 'show') {
            // parent.jumpDashboard(data.deviceNumber);
        } else if (obj.event === 'del') {
            layer.confirm($.i18n.prop('confirmDelete'), {
                btn: [$.i18n.prop('yes'), $.i18n.prop('no')],
                title: $.i18n.prop('info')
            }, function (index) {
                layer.load(2);
                $.ajax({
                    url: "trigger/delTrigger",
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

    //监听switch操作
    form.on('switch(autoClose)',function (obj) {
        console.log('switch(autoClose)')
        // layer.tips(this.value + ' ' + this.name + '：' + obj.elem.checked, obj.othis);
        var state = 0;
        if (obj.elem.checked) {
            state = 1;
        }
        $.ajax({
            url: "../trigger/autoClose",
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
            },
            success: function (data) {
                layer.closeAll('loading');
                layer.msg($.i18n.prop(data.msg))
                if ('success' != data.state) {
                    $('.layui-laypage-btn').click();
                    // $('.tableReload .layui-form-item .layui-btn').click()
                }
            }
        });
    });
    form.on('switch(status)', function (obj) {
        console.log('switch(statusTpl)')
        // layer.tips(this.value + ' ' + this.name + '：' + obj.elem.checked, obj.othis);
        var state = 0;
        if (obj.elem.checked) {
            state = 1;
        }
        $.ajax({
            url: "../trigger/changeState",
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
            },
            success: function (data) {
                layer.closeAll('loading');
                layer.msg($.i18n.prop(data.msg))
                if ('success' != data.state) {
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
    $('#aCode').val(aCode);
    $('#aCode').attr('placeholder', $.i18n.prop('nodeNumber'));
    $('#detail').text($.i18n.prop('seeDetail'));
    $('#addTrigger').text($.i18n.prop('addTrigger'));
    $('a.layui-btn.layui-btn-xs.edit').text($.i18n.prop('edit'));
    $('a.layui-btn.layui-btn-xs.del').text($.i18n.prop('delete'));
}

function onReceive(type, data) {
    if (type == 'addTriggerSuccess') {
        reloadDeviceList('');
    }
}