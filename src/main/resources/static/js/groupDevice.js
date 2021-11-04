function init() {
    layui.use("layer", function () {
        layer.config({
            extend: 'layer-skin-diy1.css' //加载新皮肤

        });
        var defautHtml = '<li>' +
            '<div class="flysand-table-cell-1"><span>- -</span></div>' +
            '<div class="flysand-table-cell-2"><span>- -</span></div>' +
            '<div class="flysand-table-cell-3"><span>- -</span></div>' +
            '<div class="flysand-table-cell-4"></div>' +
            '<div class="flysand-table-cell-5"></div>' +
            '</li>';
        var senorDataList = document.getElementById("senor_data_list");
        senorDataList.innerHTML = defautHtml;
        var zNodes = [], requestCount = 0, deviceNumber = "";
        var setting = {
            view: {
                showLine: false,
                // dblClickExpand: dblClickExpand
                // selectedMulti: false
                fontCss: getFont,
                showIcon: false,
                selectedMulti: false,
                dblClickExpand: false,
                addDiyDom: addDiyDom,
            },
            data: {
                key: {
                    title: "groupName",
                    name: "groupName"
                },
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onClick: onClick
            }
        };

        function getFont(treeId, node) {
            // return {'color': '#000'};
            return node.font ? node.font : {};
        }

        function addDiyDom(treeId, treeNode) {
            var spaceWidth = 5;
            var switchObj = $("#" + treeNode.tId + "_switch"),
                icoObj = $("#" + treeNode.tId + "_ico");
            switchObj.remove();
            icoObj.before(switchObj);
            if (treeNode.level > 1) {
                var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level) + "px'></span>";
                switchObj.before(spaceStr);
            }
        }

        function onClick(event, treeId, treeNode, clickFlag) {
            // showLog("[ " + getTime() + " onClick ]&nbsp;&nbsp;clickFlag = " + clickFlag + " (" + (clickFlag === 1 ? "普通选中" : (clickFlag === 0 ? "<b>取消选中</b>" : "<b>追加选中</b>")) + ")");
            if (treeNode.isGroup == null || treeNode.isGroup == true) {
                var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                zTree.expandNode(treeNode);
            } else {
                deviceNumber = treeNode.deviceNumber;
                mReload(treeNode.deviceName, true);
            }
        }

        $.ajax({
            url: "group/selGroupList",
            data: {},
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
                    for (var i = 0; i < data.datas.length; i++) {
                        zNodes.push(data.datas[i])
                    }
                    menuInit(-1);
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
                            datai.isGroup = false;
                            datai.id = datai.id + 100000;
                            datai.pId = datai.groupId;
                            datai.groupName = datai.deviceName;
                            datai.iconSkin = "icon02";
                            datai.font = {'color': '#D4D4D4', 'width': '100%', 'padding': '0'};
                            zNodes.push(datai);
                        }
                        if (data.isLast) {
                            if (requestCount == 1) {
                                menuInit(openExp(0, 0));
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

        function openExp(index, oId) {
            for (var i = index; i < zNodes.length; i++) {
                if (zNodes[i].pId == oId && zNodes[i].isGroup == true) {
                    zNodes[i].open = true;
                    console.log('openExp')
                    console.log(zNodes[i])
                    return openExp(0, zNodes[i].id)
                }
            }
            for (var i = index; i < zNodes.length; i++) {
                if (zNodes[i].pId == oId) {
                    return zNodes[i].id;
                }
            }
        }

        function getWind(val) {
            switch (val) {
                case 0:
                    return $.i18n.prop('north-northeast');
                case 1:
                    return $.i18n.prop('northeast');
                case 2:
                    return $.i18n.prop('east-northeast');
                case 3:
                    return $.i18n.prop('east');
                case 4:
                    return $.i18n.prop('east-southeast');
                case 5:
                    return $.i18n.prop('southeast');
                case 6:
                    return $.i18n.prop("south-southeast");
                case 7:
                    return $.i18n.prop("south");
                case 8:
                    return $.i18n.prop("south-southwest");
                case 9:
                    return $.i18n.prop("southwest");
                case 10:
                    return $.i18n.prop("west-southwest");
                case 11:
                    return $.i18n.prop("west");
                case 12:
                    return $.i18n.prop("west-northwest");
                case 13:
                    return $.i18n.prop("west-northwest");
                case 14:
                    return $.i18n.prop("north-northwest");
                case 15:
                    return $.i18n.prop("north");
                default:
                    // return $.i18n.prop("noWind");
                    return $.i18n.prop('north-northeast');
            }
        }

        function mReload(name, tip) {
            var deviceName = document.getElementById("deviceName");
            var number = document.getElementById("deviceNumber");
            deviceName.innerHTML = name;
            number.innerHTML = deviceNumber;
            senorDataList.innerHTML = defautHtml;
            layer.load(1);
            $.ajax({
                url: "device/selDeviceSensorData",
                data: {deviceNumber: deviceNumber},
                dataType: "json",
                type: "post",
                timeout: 30000,
                error: function (data, type, err) {
                    // console.log(err);
                    layer.closeAll('loading')
                    layer.msg($.i18n.prop('fail'));
                    if (err.indexOf('JSON') !== -1) {
                        parent.checkLoginState();
                    }
                },
                success: function (data) {
                    // var data = testData;
                    layer.closeAll('loading');
                    if (data.state == 'success') {
                        var innerHTML = '';
                        for (var i = 0; i < data.datas.length; i++) {
                            var datai = data.datas[i];
                            innerHTML += '<li>' +
                                '<div class="flysand-table-cell-1">' +
                                '<div class="flysand-table-cell-1t">' +
                                '<span class="flysand-table-cell-1d">' + $.i18n.prop(datai.name) + '</span><br/>' +
                                '<span class="flysand-table-cell-1e">' + $.i18n.prop('templateId') + ":" + datai.templateId + '</span></div></div>' +
                                '<div class="flysand-table-cell-2">' +
                                '<div class="flysand-table-cell-2t">' +
                                '<span class="flysand-table-cell-2d">';

                            if (data.deviceType == 2 || data.deviceType == 10 || data.deviceType == 12) {
                                if (parseInt(datai.value) != 1) {
                                    innerHTML += '<i class="switchBtn fa fa-toggle-off" data-teleplatedId=' + datai.templateId + ' data-value= ' + datai.value + ' data-index=' + (Number(i) + 1) + ' style="color:#449d44;font-size:28px;"></i>';
                                } else {
                                    innerHTML += '<i class="switchBtn fa fa-toggle-on" data-teleplatedId=' + datai.templateId + ' data-value= ' + datai.value + ' data-index=' + (Number(i) + 1) + ' style="color:#449d44;font-size:28px;"></i>';
                                }
                            } else {
                                if ('风向' == datai.name) {
                                    innerHTML += getWind(datai.value);
                                } else if (datai.value == 65535) {
                                    innerHTML += 'error1';
                                } else {
                                    innerHTML += datai.value + '</span><span class="flysand-table-cell-2e">' + datai.unit + '</span>';
                                }
                            }
                            innerHTML +=
                                '</div></div><div class="flysand-table-cell-3">' +
                                '<span>' + datai.dataTime + '</span></div>' +
                                '<div class="flysand-table-cell-4">' +
                                '<img class="flysand-table-cell-4t" src="img/item_history.png" onclick="historyClick(\'' + deviceNumber + '\')"/></div>' +
                                '<div class="flysand-table-cell-5">' +
                                '<img class="flysand-table-cell-5t" src="img/item_more.png" onclick="moreClick(\'' + deviceNumber + '\')"/>' +
                                '</div>' +
                                '<div class="flysand-table-cell-6">' +
                                '<img class="flysand-table-cell-6t" src="img/update.png" onclick="sensorEdit(\'' + datai.templateId + '\')"/>' +
                                '</div>' +
                                '</li>';
                        }
                        senorDataList.innerHTML = innerHTML;
                        $(".switchBtn").click(function () {
                            turnOn($(this), deviceNumber);
                        })
                    } else if (tip) {
                        layer.msg($.i18n.prop(data.msg))
                    }
                }
            });

        }

        function menuInit(id) {
            var treeObj = $("#treeDemo");
            // zTree_Menu = $.fn.zTree.getZTreeObj("treeDemo");
            // curMenu = zTree_Menu.getNodes()[0].children[0].children[0];
            // zTree_Menu.selectNode(curMenu);
            $.fn.zTree.init($("#treeDemo"), setting, zNodes);
            treeObj.hover(function () {
                if (!treeObj.hasClass("showIcon")) {
                    treeObj.addClass("showIcon");
                }
            }, function () {
                treeObj.removeClass("showIcon");
            });
            if (id != -1) {
                var tree = $.fn.zTree.getZTreeObj("treeDemo");
                var sel = tree.getNodeByParam('id', id);
                if (sel != null) {
                    $("#" + sel.tId + "_a").click(); // 点击节点
                }
            }
        }
    });
}

$(document).ready(function () {
    init();
});

function historyClick(deviceNumber) {
    //console.log('deviceNumber:' + deviceNumber);
    //layer.msg('程序员玩命开发中')
    document.cookie = "deviceNumber=" + deviceNumber;
    //parent.deviceNumber=deviceNumber;
    parent.changeState('history');
}

function moreClick(deviceNumber) {
    console.log('deviceNumber:' + deviceNumber);
    // layer.msg('程序员玩命开发中')
    parent.jumpDashboard(deviceNumber);
}


/**
 * 修改传感器系数和差值
 * @param sensorCode
 */
function sensorEdit(sensorCode) {

    layer.open({
        type: 2,
        skin: 'layer-skin-diy1',
        area: ['400px', '300px'],
        title: $.i18n.prop('edit'),
        btn: [$.i18n.prop('save'), $.i18n.prop('cancel')],
        btnAlign: 'c',
        yes: function (index, layero) {
            var body = layer.getChildFrame('body', index);
            var sensorCode = body.find('input[name="sensorCode"]').val();
            var sensorValueone = body.find('input[name="sensorValueone"]').val();
            var sensorValuetwo = body.find('input[name="sensorValuetwo"]').val();
            var sensorName = body.find('input[name="sensorName"]').val();
            $.ajax({
                url: "sensor/updateSensorValue",
                data: {
                    sensorCode: sensorCode,
                    sensorValueone: sensorValueone,
                    sensorValuetwo: sensorValuetwo,
                    sensorName: sensorName
                },
                dataType: "json",
                type: "get",
                timeout: 30000,
                error: function (data, type, err) {
                    console.log(err);
                    layer.msg($.i18n.prop('fail'));
                },
                success: function (data) {
                    // layer.closeAll('loading');
                    if (data.success) {
                        layer.msg($.i18n.prop('success'));

                    } else {
                        layer.msg($.i18n.prop('fail'));
                    }
                }
            });
            layer.close(index);
        },
        anim: 3,
        content: 'sensor/getSensorDetail?sensorCode=' + sensorCode,
        success: function (layero, index) {

        }
    });
}

function onReceive(type, data) {
    if (type == 'bundDeviceSuccess' || "upDeviceInfoSuccess" == type) {
        setTimeout(function () {
            init();
        }, 1000);
    }
}

function getIndexType(index, $this) {
    if (String(index).length > 1) {
        index = index;

    } else {
        index = "0" + index;
    }
    if ($this.hasClass("fa-toggle-on")) {
        var type = "01";
    } else {
        var type = "00";
    }

    return index + type;

};


function turnOn($this, deviceNumber) {
    if ($this.hasClass("fa-toggle-off")) {
        $this.removeClass("fa-toggle-off").addClass("fa-toggle-on");
    } else {
        $this.addClass("fa-toggle-off").removeClass("fa-toggle-on");
    }

    var postData = {};
    postData.deviceType = 2;
    postData.deviceNumber = deviceNumber;
    postData.devicePassword = "";
    postData.command = 201;
    postData.value = getIndexType($this.attr("data-index"), $this);
    //加载层
    layer.load(1
    );
    $.ajax({
        url: "device/sendCommand",
        data: postData,
        dataType: "json",
        type: "post",
        timeout: 30000,
        error: function (data, type, err) {
            if ($this.hasClass("fa-toggle-off")) {
                $this.removeClass("fa-toggle-off").addClass("fa-toggle-on");
            } else {
                $this.addClass("fa-toggle-off").removeClass("fa-toggle-on");
            }
            layer.closeAll('loading');
            layer.msg($.i18n.prop('fail'), {
                offset: '6px'
            });
        },
        success: function (data) {
            layer.closeAll('loading');
            if (data.state == 'success') {

                var msg = '';
                try {
                    msg = $.i18n.prop(data.msg);
                } catch (e) {
                    msg = data.msg;
                }
                layer.msg($.i18n.prop(data.msg));
                /*      layer.alert(msg, function () {

                          for (var i = 0; i < parent.frames.length; i++) {
                              var iframe = parent.frames[i];
                              if ('指令列表' == iframe.window.document.title) {
                                  iframe.reloadCommandList('');
                              }
                          }
                          parent.changeState('closeCommand');
                      })*/
            } else {
                setTimeout(function () {
                    if ($this.hasClass("fa-toggle-off")) {
                        $this.removeClass("fa-toggle-off").addClass("fa-toggle-on");
                    } else {
                        $this.addClass("fa-toggle-off").removeClass("fa-toggle-on");
                    }
                }, 100);

                layer.msg($.i18n.prop(data.msg));
            }
        }
    });
}