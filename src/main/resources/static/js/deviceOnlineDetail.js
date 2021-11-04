var position, isShowMenu = false, sNodeId, isLoading = false, zNodes, table,
    selectTemplateState = true;
var dNodes = {id: 0, pId: 0, groupName: $.i18n.prop('rootDirectory')};
//设置语言
$('.layui-titlee-sj1').text($.i18n.prop('deviceDetail'));
$('#label1').text($.i18n.prop('deviceNo') + ":");
$('#label2').text($.i18n.prop('name') + ":");
$('#label3').text($.i18n.prop('selectTemplate') + ":");
$('#label4').text($.i18n.prop('input_positionspan') + ":");
$('#input_position').attr('placeholder', $.i18n.prop('input_positionDescription'));
$('#label5').text($.i18n.prop('groupSelspan') + ":");
$('#groupSel').text($.i18n.prop('rootDirectory'));
$('#groupSel').attr('placeholder', $.i18n.prop('groupSelDescription'));
$('#save').text($.i18n.prop('save'));


function initData() {
    layui.use('table', function () {
        table = layui.table;
        table.render({
            elem: '#onlineDetail'
            , url: '../deviceManage/getDeviceOnlineList?deviceNumber=' + $("#currentDeviceNumber").text()
            , title: $.i18n.prop('sensor')
            , cols: [
                [
                    {field: 'id', title: $.i18n.prop('id'),width:80}
                    , {field: 'onlineTime', title: $.i18n.prop('onlineTime')}
                    , {field: 'offlineTime', title: $.i18n.prop('offlineTime')}
                ]
            ]
            , page: false
            , skin: 'nob'
        });

    });
}



