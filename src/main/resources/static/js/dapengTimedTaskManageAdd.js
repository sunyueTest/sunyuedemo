let form, layer, laydate;
let myIframe = parent.layer.getFrameIndex(window.name);

$('#save').text($.i18n.prop('save'));
$('#switchspan').text($.i18n.prop('relaySwitch'));

layui.use(['form', 'table', 'layedit', 'laydate'], function () {
    let form = layui.form, layer = layui.layer, table = layui.table, laydate = layui.laydate;

    //常规用法
    let dateUtil = laydate.render({
        elem: '#taskTime',
        min: minDateTime(),
        btns: ['clear', 'confirm'],
        trigger: 'click',
        type: 'datetime',
        position: 'fixed',
        format: 'yyyy-MM-dd HH:mm:ss',
        ready: function () {
            dateUtil.hint('定时时间只能选择10分钟之后的某个时刻');
        }
    });
});

// 设置最小可选的日期
function minDateTime() {
    let now = new Date();
    let time = new Date(now.getTime() + 10 * 60 * 1000);

    let hour = time.getHours();//得到小时
    let min = time.getMinutes();//得到分钟
    let sec = time.getSeconds();//得到秒
    hour = hour < 10 ? '0' + hour : hour;
    min = min < 10 ? '0' + min : min;
    sec = sec < 10 ? '0' + sec : sec;
    return time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate() + " " + hour + ":" + min + ":" + sec;
}


$("#taskType").change(function () {
    switch ($(this).val()) {
        case '1' :
            $("#taskOption1Div").show();
            $("#taskTimeDiv").show();
            $("#taskOption2Div").hide();
            $("#dataSensorCodeDiv").hide();
            $("#taskOption2").val('');
            $("#taskTime").val('');
            // $("#dataSensorCode").val('');
            break;
        case '2' :
            $("#taskOption1Div").hide();
            $("#taskTimeDiv").show();
            $("#dataSensorCodeDiv").show();
            $("#taskOption2Div").show();
            $("#taskOption1").val('');
            $("#taskTime").val('');
            break;
        case '3' :
            $("#taskTimeDiv").hide();
            $("#taskOption1Div").show();
            $("#taskOption2Div").hide();
            $("#dataSensorCodeDiv").hide();
            $("#taskOption2").val('');
            $("#taskOption1").val('');
            $("#taskTime").val('');
            // $("#dataSensorCode").val('');
            break;
    }
});

