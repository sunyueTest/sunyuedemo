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
var  userName =  $("#userName").val();

function onClick(e, treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("groupTree");
    var cityObj = document.getElementById('groupSel');
    if (zTree.expandNode(treeNode) == null || treeNode.open == false) {
        sNodeId = treeNode.id;
        hideMenu();
        cityObj.innerText = treeNode.groupName;
        cityObj.style.color = "#000"
    }
}

function selGroupList() {
    if (isLoading) {
        return
    }
    zNodes = [];
    zNodes.push(dNodes);
    isLoading = true;
    layui.use('layer', function () {
        layer.load(1)
        $.ajax({
            url: "../group/selGroupList",
            data: {userName : userName},
            dataType: "json",
            type: "get",
            timeout: 30000,
            error: function (data, type, err) {
                layer.msg($.i18n.prop('fail'));
                isLoading = false;
            },
            success: function (data) {
                isLoading = false;
                layer.closeAll('loading');
                if (data.state == 'success') {
                    for (var i = 0; i < data.datas.length; i++) {
                        zNodes.push(data.datas[i])
                    }
                    $.fn.zTree.init($("#groupTree"), setting, zNodes);
                } else {
                    layer.msg($.i18n.prop(data.msg))
                }
            }
        });
    });
}

function addDiyDom(treeId, treeNode) {
    var spaceWidth = 10;
    var switchObj = $("#" + treeNode.tId + "_switch"),
        icoObj = $("#" + treeNode.tId + "_ico");
    switchObj.remove();
    icoObj.before(switchObj);
    // if (treeNode.level > 1) {
    var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level) + "px'></span>";
    switchObj.before(spaceStr);
    // }
}

function getFont(treeId, node) {
    // return {'color': '#000'};
    return node.font ? node.font : {};
}

function hideMenu() {
    $("#menuContent").fadeOut("fast");
    $("body").unbind("mousedown", onBodyDown);
    isShowMenu = false;
}

function onBodyDown(event) {
    if (!(event.target.id == "groupSel" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length > 0)) {
        hideMenu();
    }
}


// layui.use('table', function () {
//     table = layui.table;
//     table.render({
//         elem: '#sensor'
//         , url: '../deviceManage/getDeviceSensorList?sensorNcode=' + devciedata.deviceNumber
//         , title: $.i18n.prop('sensor')
//         , cols: [
//             [
//
//                 {field: 'sensorCode', title: $.i18n.prop('sensorCode')}
//                 , {field: 'sensorName', title: $.i18n.prop('sensorName')}
//                 , {field: 'sensorData', title: $.i18n.prop('data')}
//             ]
//         ]
//         , page: false
//         , skin: 'nob'
//     });
// });

function selectGroup() {
    if (isShowMenu) {
        hideMenu();
    } else {
        var cityObj = $("#groupSel");
        var cityOffset = $("#groupSel").offset();
        $("#menuContent").css({
            left: cityOffset.left + "px",
            top: cityOffset.top + cityObj.outerHeight() + "px"
        }).slideDown("fast");
        isShowMenu = true;
        $("body").bind("mousedown", onBodyDown);
        selGroupList()
    }
}

function selectTemplate() {
    if (selectTemplateState) {
        initTemlateList(null);
        setTimeout(function () {
            $(".layui-edge").click()
        }, 300)
    }
}

function initTemlateList(selectName) {

    selectTemplateState = false;
    $.ajax({
        url: "../deviceManage/getTempList",
        data: {userName:userName},
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
            var html = '', form = layui.form;
            if (data.data != null) {
                $.each(data.data, function (index, item) {
                    if (item.name == selectName) {
                        html += "<option value='" + item.id + "' selected = 'selected' >" + item.name + "</option>";
                    } else {
                        html += "<option value='" + item.id + "'>" + item.name + "</option>";
                    }
                });
                $("select[name='quiz']").append(html);
                //append后必须从新渲染
                form.render('select');
            }
        }
    });

}

function initData() {
    layui.use('table', function () {
        table = layui.table;
        table.render({
            elem: '#sensor'
            , url: '../deviceManage/getDeviceSensorList?sensorNcode=' + $("#deviceNumber").val()
            , title: $.i18n.prop('sensor')
            , cols: [
                [

                    {field: 'sensorCode', title: $.i18n.prop('sensorCode'),}
                    , {field: 'sensorName', title: $.i18n.prop('sensorName')}
                    , {
                    field: 'sensorData', title: $.i18n.prop('data'),
                    templet: function (cellvalue) {
                        if (cellvalue.sensorType == 35) {
                            return ($.trim(cellvalue.sensorData) == 1 || $.trim(cellvalue.sensorData) == "开") ? '<i class="switchBtn fa fa-toggle-on" data-sensorCode=' + cellvalue.sensorCode + ' data-index= ' + cellvalue.LAY_INDEX + ' data-sensorData= ' + cellvalue.sensorData + ' data-sensorNcode=' + cellvalue.sensorNcode + ' style="color:#449d44;font-size:28px;vertical-align:middle;"></i>' : '<i class="switchBtn fa fa-toggle-off" data-sensorCode=' + cellvalue.sensorCode + ' data-index= ' + cellvalue.LAY_INDEX + ' data-sensorData= ' + cellvalue.sensorData + ' data-sensorNcode=' + cellvalue.sensorNcode + ' style="color:#449d44;font-size:28px;vertical-align:middle;"></i>';
                        } else {
                            return (cellvalue.sensorData == undefined) ? '<div class="layui-table-cell laytable-cell-1-0-2">- -</div>' : '<div class="layui-table-cell laytable-cell-1-0-2">' + cellvalue.sensorData + '</div>'
                        }
                    }
                }
                ]
            ],
            done: function () {
                $(".switchBtn").click(function () {
                    turnOn($(this), $(this).attr("data-sensorNcode"));
                })
            }
            , page: false
            , skin: 'nob'
        });

        //监听行单击事件
        table.on('row(sensor)', function (obj) {
            let rowData = obj.data;
            if (rowData.sensorName.trim() == '经度' || rowData.sensorName.trim() == '纬度') {
                $.post("../trajectoryReplay/checkDeviceHasLonLat", {"deviceNumber": rowData.sensorNcode}, function (res) {
                    if (res.state == 'success') {
                        parent.parent.jumpTrajectoryReplay(rowData.sensorNcode);
                    } else {
                        layui.use('layer', function () {
                            layer.msg("该设备没有经纬度信息");
                        });
                    }
                });
            }
        });

    });

    layer.load(2)
    $.ajax({
        url: "../template/selDetail",
        data: {"deviceNumber": $("#deviceNumber").val()},
        dataType: "json",
        type: "get",
        timeout: 30000,
        error: function (data, type, err) {
            layer.closeAll('loading');
        },
        success: function (data) {
            if ('success' == data.state) {
                var selectName = data.data.name;
                initTemlateList(selectName)
            } else {
                layer.closeAll('loading');
            }
        }
    });
    $.ajax({
        url: "../group/selDeviceToGroup",
        data: {deviceNumber: $("#deviceNumber").val()},
        dataType: "json",
        type: "get",
        timeout: 30000,
        error: function (data, type, err) {
        },
        success: function (data) {
            if ('success' == data.state) {
                sNodeId = data.data.id;
                document.getElementById('groupSel').innerHTML = data.data.groupName
            }
        }
    });

}

layui.use(['form', 'element', 'jquery', 'layer'], function () {
    var form = layui.form, layer = layui.layer;
    // 监听
    $('.select').ready(function () {
        // select下拉框选中触发事件
        form.on('select(quiz)', function (data) {
            var deviceNumber = $("#deviceNumber").val();
            var tempId = $("select[name='quiz']").val();
            //$.ajax();
            layer.load(2);
            $.ajax({
                url: "../template/changeDeviceTemplate",
                data: {
                    deviceNumber: deviceNumber,
                    id: tempId
                },
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
                    layer.alert($.i18n.prop(data.msg))
                    if ('success' == data.state) {
                        //执行重载
                        table.reload('sensor', {});
                        parent.parent.sendBroadcast('changeTemplate', null);
                    }
                }
            });
        });

    });

    //监听提交
    form.on('submit(submit)', function (data) {
        var deviceName = $("#deviceName").val();
        if (deviceName == null || deviceName == '') {
            layer.msg($.i18n.prop('warn6'))
            return false;
        }

        if (position == null) {
            var inputPostion = $('#input_position').val();
            var location = inputPostion.split(',');
            if (location[0] == null || location[1] == 0) {
                layer.msg($.i18n.prop('warn10'))
                return false;
            } else {
                position = {lat: location[1], lng: location[0]}
            }
        }
        if (sNodeId == null) {
            // layer.msg('请选择设备分组')
            // return false;
            sNodeId = 0;
        }
        //加载层
        layer.load(2);
        $.ajax({
            url: "../device/upDeviceInfo",
            data: {
                userName : userName,
                deviceName: deviceName,
                deviceNumber: $("#deviceNumber").val(),
                longitude: position.lng,
                latitude: position.lat,
                groupId: sNodeId,
            },
            dataType: "json",
            type: "post",
            timeout: 30000,
            error: function (data, type, err) {
                layer.closeAll('loading');
                layer.msg($.i18n.prop('fail'), {icon: 2})
            },
            success: function (data) {
                layer.closeAll('loading');
                if (data.state != 'success') {
                } else {
                    layer.msg($.i18n.prop('success'), {icon: 1})
                    setTimeout(function () {
                        //注意：parent 是 JS 自带的全局对象，可用于操作父页面
                        var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
                        parent.layer.close(index);

                    }, 1000);

                    parent.parent.sendBroadcast('upDeviceInfoSuccess', null);
                    // parent.location.reload();


                }
            }
        });
        return false;
    });

});

function selectPoint() {
    var content="../selectPoint"
    var positionValue= $('#input_position').val();
    if (positionValue != ''&&positionValue != null&&positionValue!="0.0,0.0") {
        let location = positionValue.split(',');
        content+="?longitude="+location[0]+"&latitude="+location[1];
    }
    layer.open({
        type: 2,
        title: false //不显示标题栏
        ,
        closeBtn: false,
        area: ['600px', '400px'],
        shade: 0.2,
        id: 'LAY_layuipro' //设定一个id，防止重复弹出
        ,
        btn: [$.i18n.prop('yes'), $.i18n.prop('no')],
        btnAlign: 'c',
        moveType: 1 //拖拽模式，0或者1
        ,
        content: content
        ,
        yes: function () {
            var iframeWin = $("div.layui-layer-content > iframe")[0].contentWindow; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
            position = iframeWin.getPoint(); //调用子页面的form_submit函数
            $('#input_position').val(position);
            layer.closeAll();
        }
    });
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
    layer.load(2);
    $.ajax({
        url: "../device/sendCommand",
        data: postData,
        dataType: "json",
        type: "post",
        timeout: 60000,
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
            if (data.state != null && data.state == 'success') {

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
            //刷新列表
            window.parent.$('.layui-laypage-btn').click();
        }
    });
}

