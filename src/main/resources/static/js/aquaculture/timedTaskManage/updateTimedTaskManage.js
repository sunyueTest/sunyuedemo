let form, layer, laydate, table;
let myIframe = parent.layer.getFrameIndex(window.name);
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
    form = layui.form;
    layer = layui.layer;
    table = layui.table;
    laydate = layui.laydate;

    //常规用法
    laydate.render({
        elem: '#taskTime1',
        trigger: 'click',
        type : 'datetime',
        position : 'fixed',
        format: 'yyyy-MM-dd HH:mm:ss'
    });

    //常规用法
    laydate.render({
        elem: '#taskTime2',
        trigger: 'click',
        type : 'datetime',
        position : 'fixed',
        format: 'dd HH:mm:ss'
    });

    //常规用法
    laydate.render({
        elem: '#taskTime3',
        trigger: 'click',
        type : 'time',
        position : 'fixed',
        format: 'HH:mm:ss'
    });
    //加载右侧表格数据
    let tableData = [
        {field: 'sensorCode', title: $.i18n.prop('nodeNumber'), align: 'center'}
        , {
            field: '',
            title: $.i18n.prop('relaySwitch'),
            width : 100,
            align: 'center',
            toolbar: '#statusTpl'
        }
        , {
            field: '',
            title: $.i18n.prop('operation'),
            toolbar: '#barDemo',
            width : 100,
            align: 'center'
        }
    ];

    table.render({
        elem: '#table'
        , url: '../conditionConfig/getSensorList'
        , title: ''
        , cols: [tableData]
        , page: false
    });

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

        if (taskName == null || taskName == '') {
            layer.msg($.i18n.prop('warn11'));
            return;
        }
        if (taskType == null || taskType == '') {
            layer.msg($.i18n.prop('warn35'));
            return;
        }
        let year = '0', month = '0', day = '0', time = '0', taskTimeArr;
        switch(taskType){
            case '1' :
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
        let deviceNumber = $("#deviceNumber").val();
        if (deviceNumber == null || deviceNumber == '') {
            layer.msg($.i18n.prop('err105'));
            return;
        }
        let command = getCommand(deviceNumber);

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
                command: command,
                id : $("#timeTaskId").val()
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
                    layer.msg($.i18n.prop(result.msg));
                    parent.layui.table.reload('table', {
                        page: {
                            curr: 1
                        }
                    });
                    parent.layer.close(myIframe);
                } else {
                    layer.msg($.i18n.prop(result.msg), {icon: 2})
                }
            }
        });
        return false;
    });

    getTimeTaskInfo($("#timeTaskId").val());
});

$("#taskType").change(function (){
    switch($(this).val()){
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
            ncode: aCode,
            id :$("#timeTaskId").val()
        }
    });
}

function getTimeTaskInfo(id){
    $.post("../timeTaskManage/getTimeTaskInfo",{"id" : id},function(res){
        if(res.state == 'success'){
            var data = res.data;
            $('#taskName').val(data.taskName);
            $('#taskType').val(data.taskType);
            $('#deviceNumber').val(data.deviceNumber);
            let taskTime ;
            switch (data.taskType) {
                case "1" :
                    taskTime = data.year + "-" + data.month + "-" + data.day + " " + data.time;
                    $("#taskTime1").val(taskTime);
                    $("#taskTime1Div").show();
                    $("#taskTime2Div").hide();
                    $("#taskTime3Div").hide();
                    $("#taskTime2").val('');
                    $("#taskTime3").val('');
                    break;
                case "2" :
                    taskTime = data.day + " " + data.time;
                    $("#taskTime2").val(taskTime);
                    $("#taskTime1Div").hide();
                    $("#taskTime2Div").show();
                    $("#taskTime3Div").hide();
                    $("#taskTime1").val('');
                    $("#taskTime3").val('');
                    break;
                case "3" :
                    $("#taskTime3").val(data.time);
                    $("#taskTime1Div").hide();
                    $("#taskTime2Div").hide();
                    $("#taskTime3Div").show();
                    $("#taskTime2").val('');
                    $("#taskTime1").val('');
                    break;
            }
            reload(data.deviceNumber);
        }
    });
}