let form, layer, laydate;
let myIframe = parent.layer.getFrameIndex(window.name);
// let myIframe ="x";
$('#save').text($.i18n.prop('save'));
$('#switchspan').text($.i18n.prop('relaySwitch'));
$('#taskNameSpan').text($.i18n.prop('任务名称'));
$('#taskTypeSpan').text($.i18n.prop('任务类型'));
$('#oneTimeTask').text($.i18n.prop('一次性任务'));
$('#monthlyTask').text($.i18n.prop('每月任务'));
$('#theDailyTask').text($.i18n.prop('每日任务'));
$('.taskTimeSpan').text($.i18n.prop('任务时间'));
$('#deviceNumber').attr('placeholder', $.i18n.prop('nodeNumber'));
$('#taskName').attr('placeholder', $.i18n.prop('请输入任务名称'));
layui.use(['form', 'table', 'layedit', 'laydate'], function () {
    form = layui.form
        , layer = layui.layer, table = layui.table;

    laydate = layui.laydate;

    //常规用法
    laydate.render({
        elem: '#taskTime1',
        trigger: 'click',
        type: 'datetime',
        position: 'fixed',
        format: 'yyyy-MM-dd HH:mm:ss'
    });

    //常规用法
    laydate.render({
        elem: '#taskTime2',
        trigger: 'click',
        type: 'datetime',
        position: 'fixed',
        format: 'dd HH:mm:ss'
    });

    //常规用法
    laydate.render({
        elem: '#taskTime3',
        trigger: 'click',
        type: 'time',
        position: 'fixed',
        format: 'HH:mm:ss'
    });
    //加载右侧表格数据
    let tableData = [
        {field: 'sensorCode', title: $.i18n.prop('nodeNumber'), align: 'center'}
        , {
            field: '',
            title: $.i18n.prop('relaySwitch'),
            width: 100,
            align: 'center',
            toolbar: '#statusTpl'
        }
        , {
            field: '',
            title: $.i18n.prop('operation'),
            toolbar: '#barDemo',
            width: 100,
            align: 'center'
        }
    ];

    table.render({
        elem: '#table'
        , url: '../conditionConfig/getSensorList?id=0'
        , title: ''
        , cols: [tableData]
        , page: false
    });

    //删除继电器节点
    table.on('tool(table)', function (obj) {
        let data = obj.data;
        if (obj.event === 'del') {
            $(this).parent().parent().parent().remove();
        }
    });

    document.getElementById('search').onclick = function () {
        let ncode = $('#deviceNumber').val();
        reload(ncode);
    };

    function getCommand(toDevice) {
        let trs = $("tbody").find("tr");
        let text = '';
        for (let i = 0; i < trs.length; i++) {
            let td1 = trs[i].firstChild;
            let td2 = td1.nextSibling;
            let sensorCode = td1.firstChild.innerHTML;
            let sw = td2.firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.value;
            text += '0' + sensorCode.replace(toDevice, '') + "0" + sw
        }
        return text;
    };

    //继电器开关控制。
    form.on('switch(status)', function (obj) {

        // layer.tips(this.value + ' ' + this.name + '：' + obj.elem.checked, obj.othis);
        let state = 0;
        if (obj.elem.checked) {
            state = 1;
        }
        this.nextSibling.nextSibling.nextSibling.value = state;
    });
    //监听提交
    form.on('submit(submit)', function (data) {

        let taskName = $('#taskName').val();
        let taskType = $('#taskType').val();
        let taskTime;

        //前端校验，警告信息
        if (taskName == null || taskName == '') {
            layer.msg($.i18n.prop('warn11'));
            return;
        }
        if (taskType == null || taskType == '') {
            layer.msg($.i18n.prop('warn35'));
            return;
        }
        let year = '0', month = '0', day = '0', time = '0', taskTimeArr;
        switch (taskType) {
            case '1' ://一次性任务
                taskTime = $("#taskTime1").val();
                taskTimeArr = taskTime.toString().split(/\s+/);
                let dateArr = taskTimeArr[0].split("-");
                year = dateArr[0];
                month = dateArr[1];
                day = dateArr[2];
                time = taskTimeArr[1];
                break;
            case '2' :
                taskTime = $("#taskTime2").val();
                taskTimeArr = taskTime.toString().split(/\s+/);
                day = taskTimeArr[0];
                time = taskTimeArr[1];
                break;
            case '3' :
                taskTime = $("#taskTime3").val();
                time = taskTime;
                break;
        }
        if (time == null || time == '') {
            layer.msg($.i18n.prop('warn32'));
            return;
        }
        let deviceNumber = $("#deviceNumber").val();
        if (deviceNumber == null || deviceNumber == '') {
            layer.msg($.i18n.prop('err105'));
            return;
        }
        let command = getCommand(deviceNumber);
        if (command == null || command == '') {
            layer.msg($.i18n.prop("未获取到设备节点数据"));
            return;
        }
        //加载层-风格3
        layer.load(2);

        $.ajax({
            url: "../timeTaskManage/saveTimeTaskManage",
            data: {
                taskName: taskName,
                taskType: taskType,
                year: year,
                month: month,
                day: day,
                time: time,
                deviceNumber: deviceNumber,
                command: command
            },
            dataType: "json",
            type: "post",
            timeout: 30000,
            error: function (data, type, err) {
                layer.closeAll('loading');
                layer.msg($.i18n.prop('fail'), {
                    offset: '6px'
                }, {icon: 2});
            },
            success: function (result) {
                layer.closeAll('loading');
                if (result.state == 'success') {
                    console.log(result);

                    layer.msg($.i18n.prop(result.msg))
                    $('#taskName').val('');
                    $('#taskType').val('1');
                    $('#taskTime1').val('');
                    $('#taskTime2').val('');
                    $('#taskTime3').val('');
                    $('#deviceNumber').val('');
                    reload('');
                    parent.$('.layui-btn').click();
                    parent.layer.close(myIframe);
                } else {
                    let msg = result.msg;
                    //特殊弹窗，提示权限受限，鼓励缴费升级
                    if (msg.indexOf("err106/") == 0) {
                        let strs = msg.split("/");
                        let num = strs.length == 2 ? strs[1] : 10;
                        feeEscalation($.i18n.prop("timerNum"), num);
                    } else if (msg == 'err108') {
                        renewal();
                    } else {
                        layer.msg($.i18n.prop(result.msg), {icon: 2})
                    }
                }
            }
        });
        return false;
    });
});

$("#taskType").change(function () {
    switch ($(this).val()) {
        case '1' :
            $("#taskTime1Div").show();
            $("#taskTime2Div").hide();
            $("#taskTime3Div").hide();
            $("#taskTime2").val('');
            $("#taskTime3").val('');
            break;
        case '2' :
            $("#taskTime1Div").hide();
            $("#taskTime2Div").show();
            $("#taskTime3Div").hide();
            $("#taskTime1").val('');
            $("#taskTime3").val('');
            break;
        case '3' :
            $("#taskTime1Div").hide();
            $("#taskTime2Div").hide();
            $("#taskTime3Div").show();
            $("#taskTime2").val('');
            $("#taskTime1").val('');
            break;
    }
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