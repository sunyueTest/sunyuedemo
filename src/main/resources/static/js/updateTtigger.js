//设置语言
$('#name').attr('placeholder', $.i18n.prop('triggerNameDesc'));
$('#namespan').text($.i18n.prop('name'));
$('#nodespan').text($.i18n.prop('nodeNumber'));
$('#nodeNumber').attr('placeholder', $.i18n.prop('nodeNumberDesc'));
$('#pwdspan').text($.i18n.prop('devicePassword'));
$('#devicePassword').attr('placeholder', $.i18n.prop('dvpwdDesc'));
$('#typespan').text($.i18n.prop('pushType'));
$('#groupSel').text($.i18n.prop('selpushType'));
$('#expspan').text($.i18n.prop('triggerExp'));
$('#expression').attr('placeholder', $.i18n.prop('triggerExpDesc'));
$('#save').text($.i18n.prop('add'));
$('#telOrEml').text($.i18n.prop('telemail'));



var isShowMenu = false, type, zNodes =
    [
        {id: 0, pId: -1, name: $.i18n.prop('email'), type: 'email'},
        {id: 1, pId: -1, name: $.i18n.prop('tel'), type: 'tel'},
        // {id: 1, pId: -1, name: "微信"}
    ];

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
            // title: "groupName",
            // name: "groupName"
        },
        simpleData: {
            enable: true
        }
    },
    callback: {
        onClick: onClick
    }
};

function onClick(e, treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("groupTree");
    var cityObj = document.getElementById('groupSel');
    var address = document.getElementById('address');
    console.log(parent);
    if (zTree.expandNode(treeNode) == null || treeNode.open == false) {
        type = treeNode.type;
        hideMenu();
        console.log(cityObj);
        cityObj.innerText = treeNode.name;
        cityObj.style.color = "#000"
    }
    // $.ajax({
    //     url: "trigger/getAddress",
    //     data: ,
    //     dataType: "json",
    //     type: "post",
    //     timeout: 30000,
    //     error: function (data, type, err) {
    //         console.log(err);
    //         layer.closeAll('loading');
    //         layer.msg($.i18n.prop('fail'), {
    //             offset: '6px'
    //         }, {icon: 2});
    //     },
    //     success: function (data) {
    //         layer.closeAll('loading');
    //         if (data.state == 'success') {
    //
    //             layer.msg($.i18n.prop(data.msg), {icon: 1});
    //             setTimeout(function () {
    //                 try {
    //                     parent.sendBroadcast('addTriggerSuccess', null);
    //                 } catch (e) {
    //                     console.log(e)
    //                 }
    //             }, 1000);
    //
    //         } else {
    //             let msg = data.msg;
    //             //特殊弹窗，提示权限受限，鼓励缴费升级
    //             if (msg.indexOf("err106/") == 0) {
    //                 let strs = msg.split("/");
    //                 let num = strs.length == 2 ? strs[1] : 10;
    //                 feeEscalation("触发器创建数量", num);
    //             } else if (msg == 'err108') {
    //                 renewal();
    //             } else {
    //                 layer.msg($.i18n.prop(data.msg), {icon: 2})
    //             }
    //         }
    //     }
    // });

    if("undefined" == typeof(parent.parent.userData)){
        if (treeNode.type == 'email') {
            address.value = parent.parent.parent.userData.user.email;
        } else if (treeNode.type == 'tel') {
            address.value = parent.parent.parent.userData.user.tel;
        }
    }
    else {
        if (treeNode.type == 'email') {
            address.value = parent.parent.userData.user.email;
        } else if (treeNode.type == 'tel') {
            address.value = parent.parent.userData.user.tel;
        }
    }

}

function selGroupList() {
    $.fn.zTree.init($("#groupTree"), setting, zNodes);
}

function hideMenu() {
    $("#menuContent").fadeOut("fast");
    $("body").unbind("mousedown", onBodyDown);
    isShowMenu = false;
}

function onBodyDown(event) {
    console.log('onBodyDown')
    if (!(event.target.id == "groupSel" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length > 0)) {
        hideMenu();
    }
}

function addDiyDom(treeId, treeNode) {
    console.log('addDiyDom')
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

function selectGroup() {
    console.log('selectGroup')
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

function selectPoint() {
    layer.msg($.i18n.prop('notSupported'))
}

layui.use(['form', 'layedit', 'laydate'], function () {
    var form = layui.form
        , layer = layui.layer;
    //监听提交
    form.on('submit(submit)', function (data) {
        var name = $('#name').val();
        console.log(type)
        var nodeNumber = $('#nodeNumber').val();
        var nodeName = $('#nodeName').val();
        var expression = $('#expression').val();
        var address = $('#address').val();

        if (name == null || name == '') {
            layer.msg($.i18n.prop('warn6'))
            return
        }
        if (addAll) {
            if (nodeName == null || nodeName == '') {
                layer.msg($.i18n.prop('请输入节点名称'))
                return
            }
        } else {
            if (nodeNumber == null || nodeNumber == '') {
                layer.msg($.i18n.prop('warn27'))
                return
            }
        }
        if (type == null) {
            layer.msg($.i18n.prop('warn26'))
            return
        }
        if (expression == null) {
            layer.msg($.i18n.prop('warn28'))
            return
        }
        if (type == 'email') {
            if (address == null || address == '' || address.indexOf("@") == -1) {
                layer.msg($.i18n.prop('warn47'), {icon: 2});
                return;
            }
        } else if (type == 'tel') {
            if (address == null || address == '' || address.length != 11) {
                layer.msg($.i18n.prop('warn48'), {icon: 2});
                return;
            }
        } else {
            return;
        }
        var data = {
            name: name,
            type: type,
            password: $('#devicePassword').val(),
            expression: expression,
            address: address
        };
        if (addAll) {
            data.sensorName = nodeName;
        } else {
            data.sensorCode = nodeNumber;
        }
        //加载层-风格3
        layer.load(2);
        $.ajax({
            url: "trigger/addTrigger",
            data: data,
            dataType: "json",
            type: "post",
            timeout: 30000,
            error: function (data, type, err) {
                console.log(err);
                layer.closeAll('loading');
                layer.msg($.i18n.prop('fail'), {
                    offset: '6px'
                }, {icon: 2});
            },
            success: function (data) {
                layer.closeAll('loading');
                if (data.state == 'success') {

                    layer.msg($.i18n.prop(data.msg), {icon: 1});
                    setTimeout(function () {
                        try {
                            parent.sendBroadcast('addTriggerSuccess', null);
                        } catch (e) {
                            console.log(e)
                        }
                    }, 1000);

                } else {
                    let msg = data.msg;
                    //特殊弹窗，提示权限受限，鼓励缴费升级
                    if (msg.indexOf("err106/") == 0) {
                        let strs = msg.split("/");
                        let num = strs.length == 2 ? strs[1] : 10;
                        feeEscalation($.i18n.prop("triggerNumber"), num);
                    } else if (msg == 'err108') {
                        renewal();
                    } else {
                        layer.msg($.i18n.prop(data.msg), {icon: 2})
                    }
                }
            }
        });
        return false;
    });
});

function trigger_Tips() {
    window.open("http://docs.sennor.net/#3_6_1", "_blank");
}