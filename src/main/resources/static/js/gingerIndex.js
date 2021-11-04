function init() {
    layui.use("layer", function () {
        layer.config({
            extend: 'layer-skin-diy1.css' //加载新皮肤

        });

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

        function mReload(name, tip) {
            var deviceName = document.getElementById("deviceName");
            var number = document.getElementById("deviceNumber");
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
                        console.log(data);

                         //设备采集数据
                        data.temperature = data.datas[1].value;//温度
                        data.humidity = data.datas[2].value;//湿度
                        data.O2 = data.datas[3].value;//氧气浓度

                        //完好率100%参数举例：1、温度：15.4、湿度：86.65、氧气浓度13.593.
                        //完好率100%参数举例：2、温度：15.7、湿度：90.44、氧气浓度15.035.
                        //完好率100%参数举例：3、温度：14.74、湿度：89.3、氧气浓度15.358.

                         //控制参数范围
                        if (data.temperature > 35) {
                            data.temperature = 35;
                        } else if (data.temperature < 0) {
                            data.temperature = 0;
                        }
                        if (data.humidity > 100) {
                            data.humidity = 100;
                        } else if (data.humidity < 0) {
                            data.humidity = 0;
                        }
                        if (data.O2 > 23) {
                            data.O2 = 23;
                        } else if (data.O2 < 0) {
                            data.O2 = 0;
                        }

                        //坐标指数运算方法：坐标湿度 = 实际湿度*0.23   坐标温度 = 实际温度*0.657 氧气浓度为实际数据
                        var temperature = data.temperature * 0.657 ;
                        var humidity = data.humidity * 0.23;
                        var O2 = data.O2;

                        //计算坐标点与R点间距（改需求）
                        var x1 = (temperature - 9.198);
                        var y1 = (humidity - 21.275);
                        var z1 = (O2 - 14.5);

                        // //计算坐标点与R点间距
                        // var x1 = (temperature - 9.857);
                        // var y1 = (humidity - 20.125);
                        // var z1 = (O2 - 14.5);
                        //开平方
                        var x = Math.pow(x1, 2);
                        var y = Math.pow(y1, 2);
                        var z = Math.pow(z1, 2);
                        var result = x + y + z;

                        //开根号求出两坐标点间距
                        var distance = Math.sqrt(result);

                        //球体内完好率全部为100%
                        if(distance<0.986){
                            distance=0.986;
                        }
                        // 完好率计算
                        var intact =Math.round( 100 * 0.986 / distance)+"%";

                        //3DThingJS传值
                        var iframe = document.getElementById('iframe');
                        var data1 = {
                            //ThingJS接收x氧气浓度， y湿度， z温度。
                            x:O2  ,
                            y: humidity,
                            z:temperature,
                            intact: intact,
                            data: data,
                        }

                        var send = {funcName: 'updateData', param: data1};
                        iframe.contentWindow.postMessage(send, 'http://www.thingjs.com');

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
