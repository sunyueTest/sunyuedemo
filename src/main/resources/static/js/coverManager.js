//设置语言
// $('#submit').text($.i18n.prop('submit'));

layui.config({
    base: '../static/module/',
}).extend({
    authtree: 'authtree',
});
layui.use(['jquery', 'authtree', 'layer'], function () {
    var $ = layui.jquery, authtree = layui.authtree, layer = layui.layer;
    var list = [], checkedIds = [], checked, show, treeId = '#LAY-auth-tree-index',
        requestCount = 0;
    // layer.load(2);
    $.ajax({
        url: "group/selGroupList",
        data: {},
        dataType: "json",
        type: "get",
        timeout: 30000,
        error: function (data, type, err) {
            console.log(err);
            layer.closeAll('loading');
            layer.msg($.i18n.prop('fail'));
        },
        success: function (data) {
            if (data.state == 'success') {
                for (var i = 0; i < data.datas.length; i++) {
                    data.datas[i].name = data.datas[i].groupName;
                    list.push(data.datas[i]);
                    checkedIds.push(data.datas[i].id);
                }
                requestCount = data.datas.length + 1;
                getNodeData(0, 0);
                for (var i = 0; i < data.datas.length; i++) {
                    data.datas[i].font = {'color': '#009688'};
                    data.datas[i].isGroup = true;
                    getNodeData(data.datas[i].id, 0);
                }
            } else {
                layer.msg($.i18n.prop(data.msg))
            }
        }
    });

    function getNodeData(id, len) {
        $.ajax({
            url: "group/selDeviceForGroup",
            data: {id: id},
            dataType: "json",
            type: "get",
            timeout: 30000,
            error: function (data, type, err) {
                console.log(err);
                layer.msg($.i18n.prop('fail'));
            },
            success: function (data) {
                // layer.closeAll('loading');
                if (data.state == 'success') {
                    len = data.datas.length;
                    for (var i = 0; i < len; i++) {
                        var datai = data.datas[i];
                        datai.id = datai.id + 100000;
                        datai.pId = datai.groupId;
                        datai.name = datai.deviceName;
                        datai.isGroup = false;
                        list.push(datai);
                        if (id == 0) {
                            checkedIds.push(datai.id);
                        }
                    }
                    if (data.isLast) {
                        if (requestCount == 1) {
                            initGroupData(list);
                        }
                        requestCount -= 1;
                    } else {
                        getNodeData(data.datas[0].id, len);
                    }
                } else {
                    layer.msg($.i18n.prop(data.msg))
                }
            }
        });
    }

    function initGroupData(list) {
        var trees = authtree.listConvert(list, {
            primaryKey: 'id'
            , startPid: 0
            , parentKey: 'pId'
            , nameKey: 'name'
            , valueKey: 'id'
            , checkedKey: []
        });
        // console.log("trees=" + trees);
        // // 如果后台返回的不是树结构，请使用 authtree.listConvert 转换
        authtree.render(treeId, trees, {
            inputname: 'authids[]',
            layfilter: 'lay-check-auth',
            autowidth: true,
            id: 'authtreeId'
        });
    }


    $('#selectAll').on('click', function () {
        console.log('全选');
        if (!checked) {
            authtree.checkAll(treeId);
        } else {
            authtree.uncheckAll(treeId);
        }
        checked = !checked;
    });
    $('#show').on('click', function () {
        console.log('显示/隐藏');
        if (!show) {
            authtree.showAll(treeId);
        } else {
            authtree.closeAll(treeId);
        }
        show = !show;
    });
    $('#activate').on('click', function () {
        console.log('一键激活');
        var deviceList = getSelectDevice();
        var data = {
            deviceList: deviceList,
            command: '209',
            value: '209',
            deviceType: '8'
        };
        sendCommand(data);
    });
    $('#logout').on('click', function () {
        console.log('一键注销');
        var deviceList = getSelectDevice();
        var data = {
            deviceList: deviceList,
            command: '211',
            value: '211',
            deviceType: '8'
        };
        sendCommand(data);
    });

    function sendCommand(data) {
        layer.load(2);
        $.ajax({
            url: "device/deliveryCommands",
            data: data,
            dataType: "json",
            type: "post",
            timeout: 30000,
            error: function (data, type, err) {
                layer.closeAll('loading');
                layer.msg($.i18n.prop('fail'));
            },
            success: function (data) {
                layer.closeAll('loading');
                layer.msg($.i18n.prop(data.msg))
                if (data.state == 'success') {
                    reloadCommandList('');
                }
            }
        });

    }

    function getSelectDevice() {
        let authids = authtree.getChecked(treeId), map = {}, activateDevice = [], deviceList = '';
        for (let i = 0; i < authids.length; i++) {
            map[authids[i]] = authids[i];
        }
        for (let i = 0, k = 0, j = 0; i < list.length; i++) {
            // console.log(list[i]);
            if (list[i].id == map[list[i].id]) {
                // console.log(list[i].isGroup);
                if (list[i].isGroup == false) {
                    activateDevice[j++] = list[i].deviceNumber;
                }
                k++;
            }
        }
        console.log(activateDevice);
        for (let i = 0; i < activateDevice.length; i++) {
            deviceList += activateDevice[i];
            if (i < activateDevice.length - 1) {
                deviceList += ",";
            }
        }
        console.log(deviceList);
        return deviceList;
    }
});