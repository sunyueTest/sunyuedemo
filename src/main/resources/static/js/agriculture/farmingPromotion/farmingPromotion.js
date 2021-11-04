/**
 * 自定义滚动条
 * 初始化
 */
$(function(){
    scroll=function(){
        var oMyBar3 = new MyScrollBar({
            selId: 'wrapper3',
            enterColor: '#999',
            enterShow: false,
            bgColor: 'rgba(50, 50, 50, 0.2)',
            barColor: '#2E8EEA',
            enterColor: '#056FD8',
            hasX: false,
            hasY: true,
            width: 6
        })
        var oMyBar4 = new MyScrollBar({
            selId: 'wrapper4',
            enterColor: '#999',
            enterShow: false,
            bgColor: 'rgba(50, 50, 50, 0.2)',
            barColor: '#2E8EEA',
            enterColor: '#056FD8',
            hasX: false,
            hasY: true,
            width: 6
        })
    }
});
var map;
var mapimgsrc='http://demo.sennor.net:885/file/3bc22d3a156e4209a19830a86177d825.png';
var userName=parent.userData.user.userName;
$(function(){
    var wHeight = $(window).height();
    $("#mapContainer").height(wHeight - 10);
    findExpertManageList();
    findArticleList(1);
    findArticleList(0);
    baseCount();
    //initMap();
    $(window).resize(function(){
        var wHeight = $(window).height();
        $("#mapContainer").height(wHeight - 10);
    })
    scroll();
});
//
/**
 * 地图加载
 * 传入data标点信息、坐标
 */
var data='';
function initMap(data){
    let datax=116.404;
    let datay=39.915;
    if(data.datas.length>0){
         datax=data.datas[0].latitude;
         datay=data.datas[0].longitude;
    }
    map = new BMap.Map('mapContainer');
    map.centerAndZoom(new BMap.Point(datay, datax),13);
    map.enableScrollWheelZoom(true);
    map.setMapStyleV2({styleJson:styleJson});
    // console.log('地图获取数据');
    // console.log(data);
    let points = data.datas;
    function addMarker(points,index){  // 创建图标对象
        // 创建标注对象并添加到地图
        var myIcon = new BMap.Icon(mapimgsrc, new BMap.Size(25, 25), {
            // 指定定位位置。
            // 当标注显示在地图上时，其所指向的地理位置距离图标左上
            // 角各偏移10像素和25像素。您可以看到在本例中该位置即是
            // 图标中央下端的尖角位置。
            anchor: new BMap.Size(10, 25),
            // 设置图片偏移。
            // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您
            // 需要指定大图的偏移位置，此做法与css sprites技术类似。
            imageOffset: new BMap.Size(0, 0 - index * 25)   // 设置图片偏移
        });
        for(var i = 0,pointsLen = points.length;i <pointsLen;i++){
            var point = new BMap.Point(points[i].longitude,points[i].latitude);
            var  marker = new BMap.Marker(point,{icon: myIcon});
            map.addOverlay(marker);
            //给标注点添加点击事件。使用立即执行函数和闭包
            (function() {
                var thePoint = points[i];
                marker.addEventListener("click",function(e){
                    console.log(e)
                    showInfo(this,thePoint);
                });
            })();
        }
    }
    addMarker(points);
    function showInfo(thisMaker,point){
        var sContent =
            '<ul style="margin:0 0 5px 0;">'
            if(point.createTime){
                sContent+='<li style="line-height: 26px;font-size: 12px;"><span style="display: inline-block;">时间：</span>' + point.createTime+'</li>'
            }
            if(point.address){
                sContent+= '<li style="line-height: 26px;font-size: 12px;"><span style="display: inline-block;">地址：</span>' + point.address+'</li>'
            }
            if(point.tel){
                sContent+= '<li style="line-height: 26px;font-size: 12px;"><span style="display: inline-block;">联系方式：</span>' + point.tel+'</li>'
            }
            sContent+='<li style="line-height: 26px;font-size: 12px;"><span style="display: inline-block;">名称：</span>' + point.name  +'</li>'
            +'</ul>';
        var infoWindow = new BMap.InfoWindow(sContent);  // 创建信息窗口对象
        console.log(infoWindow)
        thisMaker.openInfoWindow(infoWindow);   //图片加载完毕重绘infowindow
    }
}
/**
 * 专家在线渲染
 * 获取在线专家列表
 */
function findExpertManageList(){
    $.ajax({
        url: "/expertManage/findExpertManageList",
        type: "POST",
        data: {},
        success: function (res) {
            if (res.state == "success") {
                let html='';
                $.each(res.data.list, function (i, item) {
                    if(item.onLine==1&&userName!=item.createUser){
                        html +='                <div class="teacher">\n' +
                            '                    <div class="teacher-pic">\n' +
                            '                        <img src="'+item.certificatePic+'" alt="">\n' +
                            '                    </div>\n' +
                            '                    <div class="teacher-int">\n' +
                            '                        <p class="teacher-int-name">'+item.name+'</p>\n' +
                            '                        <p class="teacher-int-jieshao">'+item.personalInfo+'</p>\n' +
                            '                    </div>\n' +
                            '                    <div class="teacher-bnt" data-name="'+item.name+'" data-createUser="'+item.createUser+'" data-certificatePic="'+item.certificatePic+'" >在线咨询</div>\n' +
                            '                </div>'
                    }
                });
                if(html==''){
                    $('#consultlist').html('<p style="text-align: center;line-height: 15vh;color: #999ea8">暂时无专家在线</p>');
                }else {
                    $('#consultlist').html(html);
                }
            }
        }
    })
}
/**
 * 点击获取聊天框
 */
let createUser='';
let name='';
let certificatePic='';
$(document).on('click', '.teacher-bnt', function () {
    $('#mess-tc').show();
     createUser=this.getAttribute('data-createUser');
     name=this.getAttribute('data-name');
     certificatePic=this.getAttribute('data-certificatePic');
    userbnt=createUser;
    console.log(createUser);
    console.log(name);
    let html='';
    html='        <div class="mess-log-l">\n' +
        '            <div class="mess-log-l-pic">\n' +
        '                <div class="mess-buddha-border">\n' +
        '                    <div class="mess-buddha-pic">\n' +
        '                        <img src="'+certificatePic+'" alt="">\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '            </div>\n' +
        '            <div class="mess-log-l-txt">\n' +
        '                <p class="mess-naem">'+name+'</p>\n' +
        '                <p class="mess-txt">您好，请问有什么要咨询?</p>\n' +
        '            </div>\n' +
        '        </div>'
    $('#mess-Records').html('');
    $('#mess-Records').append(html);
})
function specialistreply(){
    console.log(username);
    send(username,specialistreply);
}
var username=new Array;
var list=[];
var id='';
var userbnt='';//点击获取用户名称
function onReceive(type, data) {
    console.log(type);
    if ('topic' == type) {
        console.log(data);
        let arry=data.split('#::');
        let user=arry[0];
        let teacher=arry[1];
        username.push(user);
        username=removeDuplicates(username);
        console.log(username);
        var teacherint=new Array;
        var val={
            type:1,
            val: teacher
        }
        teacherint.push(val);
        // console.log(teacherint);
        var isTrue=false;
        var valTwo=new Array();
        for(var i=0;i<list.length;i++){
            if(list[i].username==user){
                valTwo=list[i].teacherint;
                valTwo.push(val);
                list[i].teacherint=valTwo;
                isTrue=true;
            }
        }
        if(!isTrue){
            valTwo.push(val);
            var liaotian = {
                username:user,
                teacherint: valTwo
            };
            list.push(liaotian);
        }
        console.log(list[0].username);
        console.log(list);
        // getusername(list);
        // getuserlist(list);
        userbnt=list[0].username;
        console.log(teacher);
        html='';
        html='        <div class="mess-log-l">\n' +
            '            <div class="mess-log-l-pic">\n' +
            '                <div class="mess-buddha-border">\n' +
            '                    <div class="mess-buddha-pic">\n' +
            '                        <img src="'+certificatePic+'" alt="">\n' +
            '                    </div>\n' +
            '                </div>\n' +
            '            </div>\n' +
            '            <div class="mess-log-l-txt">\n' +
            '                <p class="mess-naem">'+name+'</p>\n' +
            '                <p class="mess-txt">'+teacher+'</p>\n' +
            '            </div>\n' +
            '        </div>';
        $('#mess-Records').append(html);
    }
}

/**
 * 发送消息
 */
/**
 * 点击发送消息
 * */
$(document).on('click','#addmessage',function(){
    var species=$('#specialistreply').val();
    if(!species){
       alert('请输入聊天信息！');
        return;
    }
    console.log(userbnt);
    console.log(species);
    send(userbnt,species);
    var html='';
    html='        <div class="mess-log-r">\n' +
        '            <div class="mess-log-l-txt">\n' +
        '                <p class="mess-naem-r">用户</p>\n' +
        '                <p class="mess-txt">'+species+'</p>\n' +
        '            </div>\n' +
        '            <div class="mess-log-l-pic"  style="margin-left: 1vw;">\n' +
        '                <div class="mess-buddha-border">\n' +
        '                    <div class="mess-buddha-pic">\n' +
        '                        <img src="/static/img/agriculture/yonghu.png" alt="">\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '            </div>\n' +
        '        </div>';
    $('#mess-Records').append(html);
    $('#specialistreply').val('');
    var val={
        type:0,
        val: species
    }
    for(var i=0;i<list.length;i++){
        if(list[i].username==userbnt){
            // var teacherintTwo=new Array;
            var valTwo=list[i].teacherint;
            valTwo.push(val);
            // teacherintTwo.push(valTwo);
            list[i].teacherint=valTwo;
        }
    }
    console.log(list);
})
function getuserlist(usera){
    let html='';
    $.each(usera, function (i, item) {
        // console.log(item.teacherint)
        html+='<div class="liaotian text test-1">\n';
        $.each(item.teacherint, function (i, item) {
            if(item.type==1){
                html+='<div class="clearfix">\n' +
                    '                <div class="consult-l">\n' +
                    '                    <div class="consult-l-pic"><img style="transform: scale(0.7)" src="/static/img/agriculture/yonghu.png" alt=""></div>\n'+
                    '                    <div class="consult-l-txt">' +item.val+ '</div>\n'+
                    '                </div>\n' +
                    '            </div>\n'
            }else {
                html+='<div class="clearfix">\n' +
                    '                <div class="consult-r">\n' +
                    '                    <div class="consult-r-txt">' +item.val+ '</div>\n'+
                    '                    <div class="consult-r-pic"><img style="transform: scale(0.7)" src="/static/img/agriculture/zhuanjia.png" alt=""></div>\n'+
                    '                </div>\n' +
                    '            </div>\n'
            }

        });
        html+='        </div>'
        // console.log(html)

    });
    $('#chitchat').html(html);
    $('.liaotian').removeClass('acblock');
    $('.liaotian').eq(0).addClass('acblock');
    $('.userbnt').eq(0).addClass('ac');
}


function send(user, data) {
    parent.send(user, data);
}
/**
 * 删除数组中重复元素
 */
function removeDuplicates(arr) {
    var temp = {};
    for (var i = 0; i < arr.length; i++)
        temp[arr[i]] = true;
    var r = [];
    for (var k in temp)
        r.push(k);
    return r;
}
/**
 * 分布栏目
 */
function baseCount(){
    $.ajax({
        url: "../baseCount",
        type: "POST",
        data: {},
        success: function (res) {
            if(res.data.baseList==0){
                $('#status').html('<img src="/static/img/agriculture/zhanwei.png" alt="">');
            }
            var html = "";
            $.each(res.data.baseList, function (i, item) {
                html+='            <div class="status-l" data-type="'+item.type+'">\n' +
                    '                <div class="status-naem"><div class="status-icon"><img src="/static/img/agriculture/house'+item.type+'.png" alt=""></div>'+item.name+'</div>\n' +
                    '                <div class="status-num">'+item.count+'</div>\n' +
                    '            </div>'
            });
            $('#status').html(html);
            isAdmin();
            listBases(1);
        }
    })
}
/**
 * 追加分布状态总公司
 * 判断是否是最高管理员
 * 是：展示多有公司分布地址
 */
function isAdmin(){
    $.ajax({
        url: "/projectBaseScene/findEntperpriseListCount",
        type: "POST",
        data: {},
        success: function (res) {
            if(res.state=="success"){
                let xhtml='            <div class="status-r" id="status-l">\n' +
                    '                <div class="status-naem"><div class="status-icon"><img src="/static/img/agriculture/house5.png"></div>所有公司</div>\n' +
                    '                <div class="status-num">'+res.datas.length+'</div>\n' +
                    '            </div>'
                $('#status').append(xhtml)
            }
        }
    })
}
$(document).on('click', '#status-l', function () {
    distributefirm();
})
function distributefirm(){
    $.ajax({
        url: "/projectBaseScene/findEntperpriseListCount",
        type: "POST",
        data: {},
        success: function (res) {
            let data=res;
            mapimgsrc="http://demo.sennor.net:885/file/c50630e9ae4a4933bd222f6301a733a3.png";
            initMap(data);
        }
    })
}






/**
 * 分布状态、点击查询
 */
$(document).on('click', '.status-l', function () {
    let type=this.getAttribute("data-type");
    var arry=[
        'http://demo.sennor.net:885/file/3bc22d3a156e4209a19830a86177d825.png',
        'http://demo.sennor.net:885/file/67ce9673a61649ff87d46d2b618d3ef6.png',
        'http://demo.sennor.net:885/file/36cffea5952e444bb22641cbd0ff978f.png',
        'http://demo.sennor.net:885/file/6f1d86c9afd74d82b600970ab56dc17a.png',
    ];
    mapimgsrc=arry[type-1];
    listBases(type);
});
/**
 * 分布状态、查询函数
 */
function listBases(type){
    $.ajax({
        url: "/projectBaseScene/listBases?page=1&size=100&type="+type,
        type: "POST",
        data: {
        },
        dataType: "json",
        success: function (res) {
            if (res.state == "success") {
                data=res;
                initMap(data);
            }
        }
    });
}
/**
 * 农业信息（新闻查询）
 */
findArticleList = function (type) {
    $.ajax({
        url: "../expertManage/findArticleList",
        type: "POST",
        data: {
            myArticle: 1,
            type: type,
            size:10
        },
        dataType: "json",
        success: function (res) {
            if (res.state == "success") {
                var imgReg = /<img.*?(?:>|\/>)/gi;
                var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
                if(res.datas==0){
                    $('.article'+type).html('<img src="/static/img/agriculture/zhanwei.png" alt="">');
                    return;
                }
                var html = "";
                $.each(res.datas, function (i, item) {
                    var arr = item.content.match(imgReg);
                    html+='<div class="int-new-l" data-id="' + item.id + '">\n'
                    if (item.content.match(imgReg) == null) {
                        html += '<div class="inl-pic"><img src="/static/img/agriculture/FarmingPromotion/banner_03.png" alt=""></div>\n'
                    } else {
                        html += '<div class="inl-pic">' + arr[0] + '</div>\n'

                    }
                    html += '<div class="inl-txt">';
                    html += '<p>' + item.title + '</p>\n'
                    html += '<p>' + item.createTime + '</p>\n'
                    html += '</div>'
                    html += ' </div>'
                });
                $('.article'+type).html(html);
            }
        }
    });
}
/**
 * 点击查询新闻详情
 */
$(document).on('click', '.int-new-l', function () {
    var id = this.getAttribute("data-id")
    console.log(id)
    $.ajax({
        url: "../expertManage/findArticle?id=" + id,
        type: "POST",
        data: {},
        success: function (res) {
            var html = res.data.content;
            $('#tcint').html(html);
            $("#p").html(res.data.title)
        }
    })
    tc.style.display = 'block'
});
/**
 * 根据专家用户名查询专家详细信息
 * createName 用户名
 */
function  reasonCreateNamegetIcon(createName){
    $.ajax({
        url: "",
        type: "POST",
        data: {
            createName:createName
        },
        success: function (res) {
        }
    })
}




dele.onclick = function () {
    tc.style.display = 'none';
};

$(document).on('click', '#mess-dele', function () {
    $('#mess-tc').hide();
});






var styleJson = [{
    "featureType": "land",
    "elementType": "geometry",
    "stylers": {
        "visibility": "on",
        "color": "#024162ff"
    }
}, {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": {
        "visibility": "on",
        "color": "#024162ff"
    }
}, {
    "featureType": "building",
    "elementType": "geometry.fill",
    "stylers": {
        "visibility": "on",
        "color": "#003553ff"
    }
}, {
    "featureType": "building",
    "elementType": "geometry.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#00233aff"
    }
}, {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": {
        "visibility": "on",
        "color": "#03587fff"
    }
}, {
    "featureType": "village",
    "elementType": "labels",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "town",
    "elementType": "labels",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "district",
    "elementType": "labels",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "country",
    "elementType": "labels.text.fill",
    "stylers": {
        "visibility": "on",
        "color": "#03587fff"
    }
}, {
    "featureType": "city",
    "elementType": "labels.text.fill",
    "stylers": {
        "visibility": "on",
        "color": "#03587fff"
    }
}, {
    "featureType": "continent",
    "elementType": "labels.text.fill",
    "stylers": {
        "visibility": "on",
        "color": "#03587fff"
    }
}, {
    "featureType": "poilabel",
    "elementType": "labels",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "poilabel",
    "elementType": "labels.icon",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "scenicspotslabel",
    "elementType": "labels.icon",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "scenicspotslabel",
    "elementType": "labels.text.fill",
    "stylers": {
        "visibility": "on",
        "color": "#03587fff"
    }
}, {
    "featureType": "transportationlabel",
    "elementType": "labels.text.fill",
    "stylers": {
        "visibility": "on",
        "color": "#03587fff"
    }
}, {
    "featureType": "transportationlabel",
    "elementType": "labels.icon",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "airportlabel",
    "elementType": "labels.text.fill",
    "stylers": {
        "visibility": "on",
        "color": "#03587fff"
    }
}, {
    "featureType": "airportlabel",
    "elementType": "labels.icon",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": {
        "visibility": "on",
        "color": "#08668cff"
    }
}, {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#004364ff"
    }
}, {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": {
        "weight": "3"
    }
}, {
    "featureType": "green",
    "elementType": "geometry",
    "stylers": {
        "visibility": "on",
        "color": "#02697cff"
    }
}, {
    "featureType": "scenicspots",
    "elementType": "geometry",
    "stylers": {
        "visibility": "on",
        "color": "#024162ff"
    }
}, {
    "featureType": "scenicspots",
    "elementType": "labels.text.fill",
    "stylers": {
        "visibility": "on",
        "color": "#03587fff"
    }
}, {
    "featureType": "scenicspots",
    "elementType": "labels.text.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#ffffffff",
        "weight": "1"
    }
}, {
    "featureType": "continent",
    "elementType": "labels.text.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#ffffffff",
        "weight": "1"
    }
}, {
    "featureType": "country",
    "elementType": "labels.text.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#ffffffff",
        "weight": "1"
    }
}, {
    "featureType": "city",
    "elementType": "labels.text.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#ffffffff",
        "weight": "1"
    }
}, {
    "featureType": "city",
    "elementType": "labels.icon",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "scenicspotslabel",
    "elementType": "labels.text.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#ffffffff",
        "weight": "1"
    }
}, {
    "featureType": "airportlabel",
    "elementType": "labels.text.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#ffffffff",
        "weight": "1"
    }
}, {
    "featureType": "transportationlabel",
    "elementType": "labels.text.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#ffffffff",
        "weight": "1"
    }
}, {
    "featureType": "railway",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "subway",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "highwaysign",
    "elementType": "labels",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "nationalwaysign",
    "elementType": "labels",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "nationalwaysign",
    "elementType": "labels.icon",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "provincialwaysign",
    "elementType": "labels",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "provincialwaysign",
    "elementType": "labels.icon",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "tertiarywaysign",
    "elementType": "labels",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "tertiarywaysign",
    "elementType": "labels.icon",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "subwaylabel",
    "elementType": "labels",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "subwaylabel",
    "elementType": "labels.icon",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": {
        "visibility": "on",
        "color": "#03587fff",
        "weight": "90"
    }
}, {
    "featureType": "road",
    "elementType": "labels.text.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#ffffffff",
        "weight": "1"
    }
}, {
    "featureType": "shopping",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "scenicspots",
    "elementType": "labels",
    "stylers": {
        "visibility": "on"
    }
}, {
    "featureType": "scenicspotslabel",
    "elementType": "labels",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "manmade",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "manmade",
    "elementType": "labels",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "highwaysign",
    "elementType": "labels.icon",
    "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#02697c00"
    }
}, {
    "featureType": "road",
    "stylers": {
        "level": "6",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "road",
    "stylers": {
        "level": "7",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "road",
    "stylers": {
        "level": "8",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "road",
    "stylers": {
        "level": "9",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off",
        "level": "6",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off",
        "level": "7",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off",
        "level": "8",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off",
        "level": "9",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "road",
    "elementType": "labels",
    "stylers": {
        "visibility": "off",
        "level": "6",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "road",
    "elementType": "labels",
    "stylers": {
        "visibility": "off",
        "level": "7",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "road",
    "elementType": "labels",
    "stylers": {
        "visibility": "off",
        "level": "8",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "road",
    "elementType": "labels",
    "stylers": {
        "visibility": "off",
        "level": "9",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "road",
    "elementType": "labels.text",
    "stylers": {
        "fontsize": "24"
    }
}, {
    "featureType": "highway",
    "elementType": "labels.text.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#ffffffff",
        "weight": "1"
    }
}, {
    "featureType": "highway",
    "elementType": "geometry.fill",
    "stylers": {
        "visibility": "on",
        "color": "#08668cff"
    }
}, {
    "featureType": "highway",
    "elementType": "geometry.stroke",
    "stylers": {
        "color": "#1c4f7eff"
    }
}, {
    "featureType": "highway",
    "elementType": "labels.text.fill",
    "stylers": {
        "visibility": "on",
        "color": "#03587fff"
    }
}, {
    "featureType": "highway",
    "elementType": "geometry",
    "stylers": {
        "weight": "3"
    }
}, {
    "featureType": "nationalway",
    "elementType": "geometry.fill",
    "stylers": {
        "visibility": "on",
        "color": "#08668cff"
    }
}, {
    "featureType": "nationalway",
    "elementType": "geometry.stroke",
    "stylers": {
        "color": "#1c4f7eff"
    }
}, {
    "featureType": "nationalway",
    "elementType": "labels.text.fill",
    "stylers": {
        "visibility": "on",
        "color": "#03587fff"
    }
}, {
    "featureType": "nationalway",
    "elementType": "labels.text.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#ffffffff",
        "weight": "1"
    }
}, {
    "featureType": "nationalway",
    "elementType": "geometry",
    "stylers": {
        "weight": "3"
    }
}, {
    "featureType": "provincialway",
    "elementType": "geometry.fill",
    "stylers": {
        "visibility": "on",
        "color": "#08668cff"
    }
}, {
    "featureType": "cityhighway",
    "elementType": "geometry.fill",
    "stylers": {
        "visibility": "on",
        "color": "#08668cff"
    }
}, {
    "featureType": "arterial",
    "elementType": "geometry.fill",
    "stylers": {
        "visibility": "on",
        "color": "#08668cff"
    }
}, {
    "featureType": "tertiaryway",
    "elementType": "geometry.fill",
    "stylers": {
        "visibility": "on",
        "color": "#08668cff"
    }
}, {
    "featureType": "fourlevelway",
    "elementType": "geometry.fill",
    "stylers": {
        "visibility": "on",
        "color": "#08668cff"
    }
}, {
    "featureType": "local",
    "elementType": "geometry.fill",
    "stylers": {
        "visibility": "on",
        "color": "#08668cff"
    }
}, {
    "featureType": "provincialway",
    "elementType": "geometry.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#004364ff"
    }
}, {
    "featureType": "cityhighway",
    "elementType": "geometry.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#004364ff"
    }
}, {
    "featureType": "arterial",
    "elementType": "geometry.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#004364ff"
    }
}, {
    "featureType": "tertiaryway",
    "elementType": "geometry.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#004364ff"
    }
}, {
    "featureType": "fourlevelway",
    "elementType": "geometry.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#004364ff"
    }
}, {
    "featureType": "local",
    "elementType": "geometry.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#004364ff"
    }
}, {
    "featureType": "local",
    "elementType": "labels.text.fill",
    "stylers": {
        "visibility": "on",
        "color": "#03587fff"
    }
}, {
    "featureType": "local",
    "elementType": "labels.text.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#ffffffff",
        "weight": "1"
    }
}, {
    "featureType": "fourlevelway",
    "elementType": "labels.text.fill",
    "stylers": {
        "visibility": "on",
        "color": "#03587fff"
    }
}, {
    "featureType": "tertiaryway",
    "elementType": "labels.text.fill",
    "stylers": {
        "visibility": "on",
        "color": "#03587fff"
    }
}, {
    "featureType": "arterial",
    "elementType": "labels.text.fill",
    "stylers": {
        "visibility": "on",
        "color": "#03587fff"
    }
}, {
    "featureType": "cityhighway",
    "elementType": "labels.text.fill",
    "stylers": {
        "visibility": "on",
        "color": "#03587fff"
    }
}, {
    "featureType": "provincialway",
    "elementType": "labels.text.fill",
    "stylers": {
        "visibility": "on",
        "color": "#03587fff"
    }
}, {
    "featureType": "provincialway",
    "elementType": "labels.text.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#ffffffff",
        "weight": "1"
    }
}, {
    "featureType": "cityhighway",
    "elementType": "labels.text.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#ffffffff",
        "weight": "1"
    }
}, {
    "featureType": "arterial",
    "elementType": "labels.text.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#ffffffff",
        "weight": "1"
    }
}, {
    "featureType": "tertiaryway",
    "elementType": "labels.text.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#ffffffff",
        "weight": "1"
    }
}, {
    "featureType": "fourlevelway",
    "elementType": "labels.text.stroke",
    "stylers": {
        "visibility": "on",
        "color": "#ffffffff",
        "weight": "1"
    }
}, {
    "featureType": "fourlevelway",
    "elementType": "geometry",
    "stylers": {
        "weight": "1"
    }
}, {
    "featureType": "tertiaryway",
    "elementType": "geometry",
    "stylers": {
        "weight": "1"
    }
}, {
    "featureType": "local",
    "elementType": "geometry",
    "stylers": {
        "weight": "1"
    }
}, {
    "featureType": "provincialway",
    "elementType": "geometry",
    "stylers": {
        "weight": "3"
    }
}, {
    "featureType": "cityhighway",
    "elementType": "geometry",
    "stylers": {
        "weight": "3"
    }
}, {
    "featureType": "arterial",
    "elementType": "geometry",
    "stylers": {
        "weight": "3"
    }
}, {
    "featureType": "highway",
    "stylers": {
        "level": "6",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "highway",
    "stylers": {
        "level": "7",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "highway",
    "stylers": {
        "level": "8",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "highway",
    "stylers": {
        "level": "9",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "highway",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off",
        "level": "6",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "highway",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off",
        "level": "7",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "highway",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off",
        "level": "8",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "highway",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off",
        "level": "9",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "highway",
    "elementType": "labels",
    "stylers": {
        "visibility": "off",
        "level": "6",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "highway",
    "elementType": "labels",
    "stylers": {
        "visibility": "off",
        "level": "7",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "highway",
    "elementType": "labels",
    "stylers": {
        "visibility": "off",
        "level": "8",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "highway",
    "elementType": "labels",
    "stylers": {
        "visibility": "off",
        "level": "9",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "nationalway",
    "stylers": {
        "level": "6",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "nationalway",
    "stylers": {
        "level": "7",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "nationalway",
    "stylers": {
        "level": "8",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "nationalway",
    "stylers": {
        "level": "9",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "nationalway",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off",
        "level": "6",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "nationalway",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off",
        "level": "7",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "nationalway",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off",
        "level": "8",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "nationalway",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off",
        "level": "9",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "nationalway",
    "elementType": "labels",
    "stylers": {
        "visibility": "off",
        "level": "6",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "nationalway",
    "elementType": "labels",
    "stylers": {
        "visibility": "off",
        "level": "7",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "nationalway",
    "elementType": "labels",
    "stylers": {
        "visibility": "off",
        "level": "8",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "nationalway",
    "elementType": "labels",
    "stylers": {
        "visibility": "off",
        "level": "9",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "provincialway",
    "stylers": {
        "level": "8",
        "curZoomRegionId": "0",
        "curZoomRegion": "8-10"
    }
}, {
    "featureType": "provincialway",
    "stylers": {
        "level": "9",
        "curZoomRegionId": "0",
        "curZoomRegion": "8-10"
    }
}, {
    "featureType": "provincialway",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off",
        "level": "8",
        "curZoomRegionId": "0",
        "curZoomRegion": "8-10"
    }
}, {
    "featureType": "provincialway",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off",
        "level": "9",
        "curZoomRegionId": "0",
        "curZoomRegion": "8-10"
    }
}, {
    "featureType": "provincialway",
    "elementType": "labels",
    "stylers": {
        "visibility": "off",
        "level": "8",
        "curZoomRegionId": "0",
        "curZoomRegion": "8-10"
    }
}, {
    "featureType": "provincialway",
    "elementType": "labels",
    "stylers": {
        "visibility": "off",
        "level": "9",
        "curZoomRegionId": "0",
        "curZoomRegion": "8-10"
    }
}, {
    "featureType": "cityhighway",
    "stylers": {
        "level": "6",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "cityhighway",
    "stylers": {
        "level": "7",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "cityhighway",
    "stylers": {
        "level": "8",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "cityhighway",
    "stylers": {
        "level": "9",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "cityhighway",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off",
        "level": "6",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "cityhighway",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off",
        "level": "7",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "cityhighway",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off",
        "level": "8",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "cityhighway",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off",
        "level": "9",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "cityhighway",
    "elementType": "labels",
    "stylers": {
        "visibility": "off",
        "level": "6",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "cityhighway",
    "elementType": "labels",
    "stylers": {
        "visibility": "off",
        "level": "7",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "cityhighway",
    "elementType": "labels",
    "stylers": {
        "visibility": "off",
        "level": "8",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "cityhighway",
    "elementType": "labels",
    "stylers": {
        "visibility": "off",
        "level": "9",
        "curZoomRegionId": "0",
        "curZoomRegion": "6-9"
    }
}, {
    "featureType": "arterial",
    "stylers": {
        "level": "9",
        "curZoomRegionId": "0",
        "curZoomRegion": "9-9"
    }
}, {
    "featureType": "arterial",
    "elementType": "geometry",
    "stylers": {
        "visibility": "off",
        "level": "9",
        "curZoomRegionId": "0",
        "curZoomRegion": "9-9"
    }
}, {
    "featureType": "arterial",
    "elementType": "labels",
    "stylers": {
        "visibility": "off",
        "level": "9",
        "curZoomRegionId": "0",
        "curZoomRegion": "9-9"
    }
}];



