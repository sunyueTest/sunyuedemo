layui.use(['laydate', 'upload'], function () {
    var upload = layui.upload, laydate = layui.laydate;
    //执行一个laydate实例,日期
    laydate.render({
        elem: '#MaturityTime',
    });
    $('#save').click(function () {
        var productCode = $('#ProductCode').val();
        var name = $('#Name').val();
        var title = $('#Title').val();
        var productTime = $('#MaturityTime').val();
        var aquacultureArea = $('#AquacultureArea').val();
        var yield = $('#Yield').val();
        var placeOfOrigin = $('#PlaceOfOrigin').val();
        var message = $('#Message').val();
        var relayNumber = $('#RelayNumber').val();
        var cameraNumber = $('#CameraNumber').val();
        var position = $('#Position').val();
        $.ajax({
            type: "post",
            url: "/newTraceSource/newAddTraceSource",
            data: {
                productCode: productCode,
                name: name,
                title: title,
                productTime: productTime,
                aquacultureArea: aquacultureArea,
                yield: yield,
                placeOfOrigin: placeOfOrigin,
                message: message,
                relayNumber: relayNumber,
                cameraNumber: cameraNumber,
                position: position
            },
            success: function (data) {
                layer.closeAll('loading');
                if (data.state == 'success') {
                    layer.msg($.i18n.prop("创建成功"));
                    var index = parent.layer.getFrameIndex(window.name);
                    parent.layer.close(index);
                    parent.getReloadParam(1);
                } else {
                    layer.msg($.i18n.prop(data.msg));
                }
            }
        });
    });
});
function selectPoint() {
    var content="../selectPoint"
    var positionValue= $('#Position').val();
    if (positionValue != ''&&positionValue != null&&positionValue!="0.0,0.0") {
        let location = positionValue.split(',');
        content+="?longitude="+location[0]+"&latitude="+location[1];
    }
    layer.open({
        type: 2,
        title: false,
        closeBtn: false,
        area: ['600px', '400px'],
        shade: 0.2,
        id: 'LAY_layuiproMap',
        btn: [$.i18n.prop('yes'), $.i18n.prop('no')],
        btnAlign: 'c',
        moveType: 1,
        content: content,
        yes: function () {
            var iframeWin = $("div.layui-layer-content > iframe")[0].contentWindow; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
            position = iframeWin.getPoint(); //调用子页面的form_submit函数
            $('#Position').val(position);
            layer.closeAll();
        }
    });
}

