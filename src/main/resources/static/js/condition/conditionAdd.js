//设置语言
$('#name').attr('placeholder', $.i18n.prop('conditionName'));
$('#namespan').text($.i18n.prop('name'));
$('#sensorCode').attr('placeholder', $.i18n.prop('dataNodeNo'));
$('#nodespan').text($.i18n.prop('nodeNumber'));
$('#password').attr('placeholder', $.i18n.prop('dvpwdDesc'));
$('#pwdspan').text($.i18n.prop('devicePassword'));
$('#expspan').text($.i18n.prop('expression'));
$('#valuespan').text($.i18n.prop('value'));
$('#switchspan').text($.i18n.prop('relaySwitch'));
$('#save').text($.i18n.prop('save'));
$('#command').attr('placeholder', $.i18n.prop('err105'));


var expression = $("#exps").val();
$("#expression").val(expression);
var form, layer;
layui.use(['form', 'table', 'layedit', 'laydate'], function () {
    form = layui.form
        , layer = layui.layer, table = layui.table;

    //加载右侧表格数据
    var tableData = [
        {field: 'sensorCode', title: $.i18n.prop('nodeNumber'), width: 150, align: 'center'}
        , {
            field: '',
            title: $.i18n.prop('relaySwitch'),
            width: 200,
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
    table.render({
        elem: '#table'
        , url: '../conditionConfig/getSensorList?id=' + $('#id').val()
        // , toolbar: '#toolbar1'
        , title: ''
        , cols: [tableData]
        , page: false
        // limitName: 'page',
        // height: 600,

    });
    table.on('tool(table)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') {
            $(this).parent().parent().parent().remove();
        }
    });
    document.getElementById('search').onclick = function () {
        var ncode = $('#command').val();
        reload(ncode);
    }

    function getCommand(toDevice) {
        var trs = $("tbody").find("tr");
        var text = '';
        for (var i = 0; i < trs.length; i++) {
            var td1 = trs[i].firstChild;
            var td2 = td1.nextSibling;
            var sensorCode = td1.firstChild.innerHTML;
            var sw = td2.firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.value;
            text += '0' + sensorCode.replace(toDevice, '') + "0" + sw
        }
        return text;
    }

    //继电器开关控制。
    form.on('switch(status)', function (obj) {

        // layer.tips(this.value + ' ' + this.name + '：' + obj.elem.checked, obj.othis);
        var state = 0;
        if (obj.elem.checked) {
            state = 1;
        }
        this.nextSibling.nextSibling.nextSibling.value = state;
    });
    //监听提交
    form.on('submit(submit)', function (data) {

        var name = $('#name').val();
        var sensorCode = $('#sensorCode').val();
        var expression = $('#expression').val();
        var toDevice = $('#command').val();
        if (name == null || name == '') {
            layer.msg($.i18n.prop('warn34'));
            return;
        }
        if (sensorCode == null || sensorCode == '') {
            layer.msg($.i18n.prop('warn35'));
            return;
        }
        if (expression == null) {
            layer.msg($.i18n.prop('warn36'));
            return;
        }
        if (toDevice == null || toDevice == '') {
            layer.msg($.i18n.prop('err105'));
            return;
        }
        var command = getCommand(toDevice);
        if (command == null || command == '') {
            layer.msg($.i18n.prop('configureCommand'));
            return;
        }
        //加载层-风格3
        layer.load(2);

        $.ajax({
            url: "../conditionConfig/saveCondition",
            data: {
                name: name,
                sensorCode: sensorCode,
                value: $('#value').val(),
                password: $('#password').val(),
                expression: expression,
                toDevice: toDevice,
                command: command,
                id: $('#id').val() > 0 ? $('#id').val() : 0,
            },
            dataType: "json",
            type: "post",
            timeout: 30000,
            error: function (data, type, err) {
                console.log(err);
                layer.closeAll('loading');
                //$('.layui-layer-close').click();
                layer.msg($.i18n.prop('fail'), {
                    offset: '6px'
                }, {icon: 2});
            },
            success: function (result) {
                layer.closeAll('loading');
                //$('.layui-layer-close').click();
                if (result.success) {
                    parent.reloadDeviceList('');
                    layer.msg($.i18n.prop('success'));
                    setTimeout(function () {
                        //注意：parent 是 JS 自带的全局对象，可用于操作父页面
                        var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
                        parent.layer.close(index);
                    }, 1000)
                } else {
                    let msg = result.msg;
                    if (msg.indexOf("err106/") == 0) {
                        let strs = msg.split("/");
                        let num = strs.length == 2 ? strs[1] : 10;
                        feeEscalation($.i18n.prop("configurationNum"), num);
                    } else if (msg == "err108") {
                        renewal();
                    } else {
                        console.log(result);
                        layer.msg($.i18n.prop(msg));
                    }
                }
            }
        });
        return false;
    });
});

function reload(aCode) {
    table.reload('table', {
        page: {
            curr: 1 //重新从第 1 页开始
        }
        , where: {
            ncode: aCode
        }
    });
}

/*function getController(){
    layer.open({
        type: 2,
        area: ['500px', '400px'],
        title: $.i18n.prop('relaySwitch'),
        // maxmin: true,
        //btn: ['确定', '取消'],
        //btnAlign: 'c',
        yes: function (index, layero) {
            //表单提交
            /!*  var body = layer.getChildFrame('body', index);
              body.find('form').submit();
              layer.close(index);
*!/
        },
        anim: 3,
        content: '../conditionConfig/getController',
        success: function (layero, index) {
             var body = layer.getChildFrame('body', index);
             body.find('input[name="index"]').val(index);

        }
    });
}*/

/*  function commandText(text){
      $("#command").val(text);
  }*/
