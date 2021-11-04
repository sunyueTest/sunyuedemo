var map;
var check = false;
var zNodes = [], requestCount = 0, deviceNumber = "";
var dataMap = new Map();//报警信息用于获取设备名，在获取设备赋值，报警信息管理获取
var userBean;//用户基本信息
var setting = {
    view: {
        showLine: false,
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
layui.use(['form', 'layedit', 'laydate'], function () {
    //监听指定开关
    layui.form.on('switch(alarm_switch)', function (data) {
        if (this.checked ){
            layui.layer.msg('开启成功');
        } else {
            layui.layer.msg('关闭成功');
        }
    });
});
var dangerMsgPie;
$(function () {
    //大屏名字变动随着中性变化
    $.post("../user/selUserDetails", {}, function (res) {
        if (res.state == 'success' && res.data.info) {
            $("#screenTitle").html(res.data.info.company);
            //<span id="screenTitle"></span>
        }
    });
    //页面加载第一步：获取井盖总数（设备总数），报警数，以及获取异常报警设备的信息
    wellCount();

    //页面加载第二步：地图页面加载
    initMap();

    //页面加载第三步：获取设备总数及报警设备数
    findDevice();

    // //页面加载第三步辖区内报警状态
    // initDangerMsgPie();

    //页面各元素高度自适应设置
    var documentHeight = $(window).height();


    $(".content").height(documentHeight - 60);
    $(".leftBottom").height($(".content").height() - 260 - 18);
    $(".leftDangerMsgBox").height($(".leftBottom").height() - 28.8);
    $(".rightBottom").height($(".content").height() - $(".rightTop").height() - 18);
    $(".centerContent").height($(".content").height() - 6);
    $(".pieDangerMsgItemBox").height($(".pieDangerMsgBox").height() - $(".pieDangerMsgTitle").height() - 5);

    $(window).resize(function () {
        var documentHeight = $(window).height();
        $(".content").height(documentHeight - 60);
        $(".leftBottom").height($(".content").height() - 260 - 18);
        $(".leftDangerMsgBox").height($(".leftBottom").height() - 28.8);
        $(".rightBottom").height($(".content").height() - $(".rightTop").height() - 18);
        $(".centerContent").height($(".content").height() - 6);
        $(".pieDangerMsgItemBox").height($(".pieDangerMsgBox").height() - $(".pieDangerMsgTitle").height() - 5);
        dangerMsgPie.resize();
    });
});

/**
 * 设备列表节点点击事件
 * @param id
 */
function menuInit(id) {
    var treeObj = $("#wellCoverTree");
    $.fn.zTree.init($("#wellCoverTree"), setting, zNodes);
    treeObj.hover(function () {
        if (!treeObj.hasClass("showIcon")) {
            treeObj.addClass("showIcon");
        }
    }, function () {
        treeObj.removeClass("showIcon");
    });
    if (id != -1) {
        var tree = $.fn.zTree.getZTreeObj("wellCoverTree");
        var sel = tree.getNodeByParam('id', id);
        if (sel != null) {
            $("#" + sel.tId + "_a").click(); // 点击节点
        }
    }
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
    if (treeNode.isGroup == null || treeNode.isGroup == true) {
        var zTree = $.fn.zTree.getZTreeObj("wellCoverTree");
        zTree.expandNode(treeNode);
    } else {
        deviceNumber = treeNode.deviceNumber;
        map.setCenter([treeNode.longitude, treeNode.latitude]);
        if (check) {
            map.setZoom(16);
        }
        markerClick(treeNode.name, [treeNode.longitude, treeNode.latitude]);
    }
    check = true;
}


//日期方法
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


var getIndex = function (index, type) {

    if (index < 10) {
        index = "0" + index;
    }

    if (type == true) {
        type = "01";
    } else {
        type = "00";
    }

    return index + type;

};

Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

/**
 *  获取井盖总数+异常报警井盖个数
 */
wellCount = function () {
    $.ajax({
        url: "deviceManage/findDeviceCount",
        dataType: "json",
        type: "post",
        timeout: 30000,
        error: function (data, type, err) {
            console.log(err);
            layer.msg($.i18n.prop('fail'));
        },
        success: function (data) {
            if (data.state == 'success') {
                $(".deviceCount").text("井盖总数" + data.deviceCount + "个");
                $(".wellCount").text("正常" + (data.deviceCount - data.triggerCount) + "个");
                $(".triggerCount").text("报警" + data.triggerCount + "个")
                userBean = data.userBean;
            }
        }
    });
}

/**
 * 地图加载以及子显示
 */
function initMap() {
    let language = getCookie('jxct_lang');
    if (language != 'en') {
        language = 'zh_cn';
    }


    map = new AMap.Map("mapContainer", {
        resizeEnable: true,
        center: [119.999481, 35.88561],
        zoom: 12,
        lang: language,//可选值：en，zh_en, zh_cn
        layers: [
            // 卫星
            new AMap.TileLayer.Satellite(),
            // 路网
            new AMap.TileLayer.RoadNet()
        ]
    });
}

/**
 * 获取设备总数及异常报警设备数
 */

findDevice = function () {
    //获取该用户下所有分组
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
                    data.datas[i].font = {'color': '#ffffff', 'width': '100%', 'padding': '0'};
                    data.datas[i].isGroup = true;
                    getNodeData(data.datas[i].id, 0);
                }
            } else {
                layer.msg($.i18n.prop(data.msg))
            }
        }
    });
}
/**
 *  根据分组ID获取用户每个分组下的设备
 *  并将设备点存入地图上
 */
var isTrue = true;

function getNodeData(id, len) {
    $.ajax({
        url: "group/selDeviceForGroup",
        data: {id: id},
        dataType: "json",
        type: "get",
        timeout: 30000,
        async:false,
        error: function (data, type, err) {
            console.log(err);
            layer.msg($.i18n.prop('fail'));
        },
        success: function (data) {
            if (data.state == 'success') {
                len = data.datas.length;
                for (var i = 0; i < len; i++) {
                    var datai = data.datas[i];
                    datai.isGroup = false;
                    datai.id = datai.id + 100000;
                    datai.pId = datai.groupId;
                    datai.groupName = datai.deviceName;
                    datai.iconSkin = "icon02";
                    datai.font = {'color': '#08f0f9', 'width': '100%', 'padding': '0'};
                    zNodes.push(datai);
                    //将设备点存入地图上
                    addMarker(datai.longitude, datai.latitude, datai.deviceName);
                    dataMap.set(datai.deviceNumber, datai.deviceName);


                }
                //获取，异常报警设备对应属性放到信息管理中
                //因为要先获取设备名称才可以在信息管理匹配，当前所处方法处于循环内，加判断，只执行一次
                if (isTrue) {
                    findTrigger();
                    isTrue = false;
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

/**
 * 实例化点标记
 */

function addMarker(lng, lat, name) {
    console.log("点标记：" + new Date())
    var marker = new AMap.Marker({
        title: name,
        icon: new AMap.Icon({
            image: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
            size: new AMap.Size(29, 45),
            imageSize: new AMap.Size(22, 33)
        }),
        position: [lng, lat],
        offset: new AMap.Pixel(-13, -30)
    }).on('click', function (e) {
        markerClick(name, marker.getPosition());
    });
    marker.setMap(map);
}

/**
 * 显示点标记文字
 */
function markerClick(name, position) {
    var title = '<span style="font-size:16px;margin-right:15px;">' + name + '</span>';
    content = [];
    var infoWindow = new AMap.InfoWindow({
        isCustom: true,  //使用自定义窗体
        content: createInfoWindow(title, content.join("")),
        offset: new AMap.Pixel(16, -45)
    });
    infoWindow.open(map, position);

}

/**
 * 构建自定义信息窗体
 */

function createInfoWindow(title, content) {
    var info = document.createElement("div");
    info.className = "custom-info input-card content-window-card";

    //可以通过下面的方式修改自定义窗体的宽高
    //info.style.width = "400px";
    // 定义顶部标题
    var top = document.createElement("div");
    var titleD = document.createElement("div");
    var closeX = document.createElement("img");
    top.className = "info-top";
    titleD.innerHTML = title;
    closeX.src = "https://webapi.amap.com/images/close2.gif";
    closeX.onclick = closeInfoWindow;

    top.appendChild(titleD);
    top.appendChild(closeX);
    info.appendChild(top);

    // 定义中部内容
    var middle = document.createElement("div");
    middle.className = "info-middle";
    middle.style.backgroundColor = 'white';
    middle.innerHTML = content;
    info.appendChild(middle);

    // 定义底部内容
    var bottom = document.createElement("div");
    bottom.className = "info-bottom";
    bottom.style.position = 'relative';
    bottom.style.top = '0px';
    bottom.style.margin = '0 auto';
    var sharp = document.createElement("img");
    sharp.src = "https://webapi.amap.com/images/sharp.png";
    bottom.appendChild(sharp);
    info.appendChild(bottom);
    return info;
}

function closeInfoWindow() {
    map.clearInfoWindow();
}

/**
 * 报警井盖在这里
 */
var numberList;
var idList;

function initDangerMsgPie(Triggerlist) {
    dangerMsgPie = echarts.init(document.getElementById('dangerMsgPie'));

    var obj = {};
    var nameList = [];
    var map = new Map();
    for (var i = 0; i < Triggerlist.length; i++) {
        var s = Triggerlist[i].name;
        if (obj[s]) {//如果已存在
            map.set(s + "_num", map.get(s + "_num") + 1);
            map.set(s + "_number", map.get(s + "_number") + "," + Triggerlist[i].deviceNumber);
            map.set(s + "_id", map.get(s + "_id") + "," + Triggerlist[i].id);
        } else {
            obj[s] = s;//加入标记对象中
            map.set(s + "_num", 1);
            map.set(s + "_number", Triggerlist[i].deviceNumber);
            map.set(s + "_id", (Triggerlist[i].id).toString());
            nameList.push(s);
        }
    }
    option = {};
    var datas = [];
    if (nameList.length > 0) {
        for (var k = 0; k < nameList.length; k++) {
            datas.push({
                name: nameList[k], value: map.get(nameList[k] + "_num"),
                id: map.get(nameList[k] + "_id"), number: map.get(nameList[k] + "_number")
            });
        }
        ;
    } else {
        datas.push({value: 0, name: '异位报警'});
        datas.push({value: 0, name: '有毒气体报警'});
        datas.push({value: 0, name: '可燃气体报警'});
    }
    option = {

        tooltip: {
            trigger: 'item',
            formatter: "{b} : {d}% <br/> {c}"
        },
        title: {
            text: '异常报警',
            left: 'center',
            top: '38%',
            padding: [10, 0],
            textStyle: {
                color: '#fff',
                fontSize: 15,
                align: 'center'
            }
        },
        legend: {
            selectedMode: false,
            formatter: function (name) {
                var total = 0; //各科正确率总和
                var averagePercent; //综合正确率
                datas.forEach(function (value, index, array) {
                    total += value.value;
                });
                return total + "个";
            },
            data: [datas[0].name],
            left: 'center',
            top: '48%',
            icon: 'none',
            align: 'center',
            padding: [10, 0],
            textStyle: {
                color: "#ffc72b",
                fontSize: 15
            },
        },
        series: [{
            type: 'pie',
            radius: ['40%', '50%'],
            center: ['50%', '50%'],
            color: ['#fdb628', '#eb6f49', '#08f0f9'],
            data: datas,
            labelLine: {
                normal: {
                    length: 20,
                    length2: 20,
                    lineStyle: {
                        width: 2
                    }
                }
            },
            label: {
                normal: {
                    formatter: function (params) {
                        var str = '{o|' + params.value + '个}\n{hr|}\n{d|' + params.name + '}';
                        return str
                    },

                    padding: [0, -15],
                    rich: {
                        b: {
                            fontSize: 12,
                            color: '#12EABE',
                            align: 'center',
                            padding: 4
                        },
                        hr: {
                            borderColor: '#fdb628',
                            width: '100%',
                            borderWidth: 2,
                            height: 0
                        },
                        jr: {
                            borderColor: '#eb6f49',
                            width: '100%',
                            borderWidth: 2,
                            height: 0,
                        },
                        kr: {
                            borderColor: '#08f0f9',
                            width: '100%',
                            borderWidth: 2,
                            height: 0
                        },
                        d: {
                            fontSize: 12,
                            color: '#fff',
                            align: 'center',
                            padding: 4
                        },
                        c: {
                            fontSize: 12,
                            color: '#fff',
                            align: 'center',
                            padding: 4
                        },
                        o: {
                            fontSize: 12,
                            color: '#fdb628',
                            align: 'center',
                            padding: 4
                        },
                        p: {
                            fontSize: 12,
                            color: '#eb6f49',
                            align: 'center',
                            padding: 4
                        },
                        q: {
                            fontSize: 12,
                            color: '#08f0f9',
                            align: 'center',
                            padding: 4,
                        },
                        r: {
                            fontSize: 12,
                            color: '#fdb628',
                            align: 'center',
                            padding: [4, 10],
                            borderWidth: 2,
                            borderColor: "#fdb628",
                        },
                        s: {
                            fontSize: 12,
                            color: '#eb6f49',
                            align: 'center',
                            padding: [4, 10],
                            borderWidth: 2,
                            borderColor: "#eb6f49",


                        },
                        t: {
                            fontSize: 12,
                            color: '#08f0f9',
                            align: 'center',
                            padding: [4, 10],
                            borderWidth: 2,
                            borderColor: "#08f0f9",
                        },
                    }
                }
            }
        }]
    };

    dangerMsgPie.setOption(option);

    dangerMsgPie.on('click', function (e) {
        $(".pieDangerMsgBox").hide();
        $(".pieDangerMsgItemBox").remove();
        numberList = e.data.number.split(",");
        idList = e.data.id.split(",");
        findTriggerDetails(numberList, idList, Triggerlist);
    })
}

/**
 * 获取异常设备
 */
var Triggerlist = [];//所有的异常报警信息记录
findTrigger = function () {
    $.ajax({
        url: "trigger/triggerHistoryList",
        data: {
            size: 1000
        },
        dataType: "json",
        type: "get",
        timeout: 30000,
        error: function (data, type, err) {
            console.log(err);
            layer.msg($.i18n.prop('fail'));
        },
        success: function (data) {
            if (data.state == 'success') {
                Triggerlist = data.datas;
                // var obj = {};
                // var map=new Map();
                // var nameList=[];
                // for(var i=0;i<list.length;i++){
                //     var idList=[];
                //     var s = list[i].name;
                //     //作用：第一个set将报警汉字作为key,报警个数作为value
                //     //第二个set将汉字加id作为key,设备名的list作为value
                //     if (obj[s]) {//如果已存在
                //         map.set(s,map.get(s)+1);
                //         map.set(s+"_id",map.get(s+"_id")+","+list[i].deviceNumber);
                //     }else {
                //         obj[s] = s;//加入标记对象中
                //         map.set(s,1)
                //         nameList.push(s);
                //         var number=list[i].deviceNumber;
                //         map.set(s+"_id",number);
                //     };
                //
                // }
                //将数量及类型放入下去辖区内报警状态中
                initDangerMsgPie(Triggerlist);
                //报警信息管理窗口维护
                maintenance(Triggerlist);
            } else {
                layer.msg($.i18n.prop(data.msg))
            }
        }
    });
}
/**
 * 报警信息管理窗口维护
 */
maintenance = function (list) {
    $(".leftDangerMsgItemBox").remove();
    var divString = "";
    for (var i = 0; i < list.length; i++) {
        divString = '<div class="leftDangerMsgItemBox">' +
            '<div class="leftDangerMsgItem">' +
            '<p><span>报警原因：</span><span>' + list[i].name + '</span></p>' +
            '<p><span>设备名称：</span><span>' + dataMap.get(list[i].deviceNumber) + '</span></p>' +
            '<p><span>报警时间：</span><span>' + list[i].alarmTime + '</span></p>' +
            '<p><span>触发数值：</span><span class="colorRed">' + list[i].expression.replace("value", list[i].name) + '</span></p>' +
            '<p><span>报警数值：</span><span class="colorRed">' + list[i].results + '</span></p>' +
            '</div>' +
            '<span class="borderSpan borderTop"></span>' +
            '<span class="borderSpan borderRight"></span>' +
            '<span class="borderSpan borderBottom"></span>' +
            '<span class="borderSpan borderLeft"></span>' +
            '</div>'
        $(".leftDangerMsgBox").append(divString);
        // console.log(dataMap.get(list[i].deviceNumber));
    }
};
/**
 * 查看井盖报警状态详情
 */
findTriggerDetails = function (number, id, list) {
    $(".pieDangerMsgItemBox").remove();
    if (number.length > 0) {
        var str = '';
        for (var k = 0; k < id.length; k++) {
            for (var i = 0; i < list.length; i++) {
                if (id[k] == list[i].id) {
                    var trigger = list[i];
                    str = '<div class="pieDangerMsgItemBox">' +
                        '<div class="pieDangerMsgItem">' +
                        '<div class="pieDangerMsgItemPart">' +
                        '<p>' + trigger.alarmTime + '</p>' +
                        '<p class="colorYellow"><span>报警数值:</span><span>' + trigger.results + '</span></p>' +
                        '<p  class="colorYellow"><span>报警信息:</span><span class="colorRed" style="font-weight:900;">' + trigger.name + '</span></p>' +
                        '</div>' +
                        '<div class="pieDangerMsgItemPart">' +
                        '<p  class="colorYellow"><span>设备ID:</span><span>' + number[k] + '</span></p>' +
                        '<p  class="colorYellow"><span>设备名称:</span><span>' + dataMap.get(number[k]) + '</span></p>' +
                        '<p  class="colorYellow"><span>区域负责人:</span><span>' + userBean.realName + '</span></p>' +
                        '</div>' +
                        '<div class="pieDangerMsgItemPart">' +

                        '<p  class="colorYellow"><span>联系方式:</span><span>' + userBean.tel + '</span></p>' +
                        '<p  class="colorYellow"><span>邮箱:</span><span>' + userBean.email + '</span></p>' +
                        '</div>' +
                        '<img class="deleteIcon" onclick="delTrigger(' + trigger.id + ')" src="../../static/img/wellCover/deleteIcon.png" />' +
                        '</div>' +
                        '</div>';
                    $(".pieDangerMsgBox").append(str);
                }
            }
        }

        $(".pieDangerMsgBox").show();
    }
}

/**
 *  删除此条报警记录
 */
delTrigger = function (id) {
    $.ajax({
        url: "trigger/delTriggerHistory",
        data: {
            id: id
        },
        dataType: "json",
        type: "post",
        timeout: 30000,
        error: function (data, type, err) {
            console.log(err);
            layer.msg($.i18n.prop('fail'));
        },
        success: function (data) {
            layer.msg($.i18n.prop(data.msg));
            //重新获取对应数据
            wellCount();
            findTrigger();
            idList.remove(id);
            findTriggerDetails(numberList, idList, Triggerlist);
        }
    })
}
/**
 * 一键删除
 */
delAll = function () {
    for (var i = 0; i < idList.length; i++) {
        delTrigger(idList[i]);
    }
}

/**
 * 报警初始化
 *
 */
initSocket(function (data) {
    // console.log(data);
});
