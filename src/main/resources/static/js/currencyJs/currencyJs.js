/**
 * 大屏调用,通用js方法
 * 需要在</Body>下引用
 * 有未写入的方法，大家自己填一下
 * $.ajaxSettings.async = false;  异步转同步方法，由于无法return返回，异步经常导致没有赋值
 */

/**
 *  获取用户下所有地区以及地区ID用于地区切换下拉框使用
 *  @param farmId可为""
 *  @param page,size必填
 */
currencyUserRegion=function (farmId,page,size) {
    $.post("../newFarmInfo/getList",
        {"farmId": farmId,"page":page,"size":size},
        function (res) {
            findUserRegion(res);
        })
}

/**
 * 根据农场ID获取该农场下所有绑定设备(旧版，一个农场只能绑定一个设备)
 */
// var currencyFarmDeviceListValue=null;
currencyFarmDeviceList=function (farmId) {
    // $.ajaxSettings.async = false;
    $.post("../farmInfo/getFarmDeviceList",
        {"farmId": farmId,"page":"1","size":"100"},
        function (res) {
            setenvironmental(res);
    })
}

/**
 * 根据农场ID获取该农场下所有绑定设备(新版，一个农场能绑定多个个设备)
 */
// var currencyFarmDeviceListValue=null;
currencyFarmDeviceList_Two=function (farmId) {
    // $.ajaxSettings.async = false;
    $.post("../newFarmInfo/getFarmDeviceList",
        {"farmId": farmId,"page":"1","size":"100"},
        function (res) {
            setenvironmental(res);
        })
}

/**
 * 根据农场ID获取农场下的农作物
 */
// var farmCropsListValue=null;
findFarmCropsLists=function (farmId) {
    // $.ajaxSettings.async = false;
    $.post("../farmCrops/getList",
        {"farmInfoId": farmId,"page":"1","size":"100"},
        function (res) {
            findFarmCropsList(res);
        })
    }


/**
 * 根据摄像头编号获取视频信息（旧版，一个农场只能绑定一个摄像头时调用）
 */
// var liveAddressValue=null;
findLiveAddress=function (deviceSerial) {
    // $.ajaxSettings.async = false;
    $.post("../cameraManage/getLiveAddress",
        {"deviceSerial": deviceSerial},
        function (res) {
            getCamareUrl(res);
        })
}

/**
 * 根据设备ID获取设备月数据
 */
// var sensorForMonth=null;
findSensorForMonth=function(deviceNumber){
    // $.ajaxSettings.async = false;
    $.post("../monitor/getSensorForMonth",
        {"deviceNumber": deviceNumber},
        function (res) {
            // sensorForMonth=res;
            findDeviceListLine(res);
    })
}

/**
 * 根据设备ID获取设备24小时数据
 */
// var sensorForMonth=null;
findSensorReport=function(deviceNumber){
    // $.ajaxSettings.async = false;
    $.post("../monitor/getSensorReport",
        {"deviceNumber": deviceNumber},
        function (res) {
            // sensorForMonth=res;
            findDeviceSensorReport(res);
        })
}
/**
 * 根据设备ID获取设备某段天数内数据
 * dayCount  天数
 */
findSensorData=function(deviceNumber,dayCount){
    $.post("../monitor/getSensorDataByDayCountNew",
        {"deviceNumber": deviceNumber,
            "dayCount":dayCount
},
        function (res) {
            findDeviceSensorDataByDay(res);
        })
}



/**
 * 根据土地ID查询土地的耕地信息
 */
// var landBar=null;
findLandBar=function(farmId){
    // $.ajaxSettings.async = false;
    $.post("../smartAgriculture/findLandUse",
        {"farmId": farmId},
        function (res) {
            // landBar=res;
            initLandBar(res);
        })
}

/**
 *  查询当前登录用户下所有触发历史记录
 */
// var triggerList;
findTriggerList=function (size) {
    // $.ajaxSettings.async = false;
    $.get("../trigger/triggerHistoryList",
        {"size": size},
        function (res) {
            // triggerList=res;
            findTrigger(res);
        })
}

/**
 *  查询当前登录用户下时间范围内触发历史记录
 */
// var triggerList;
findTriggerTimeList=function (stateTime,endTime) {
    // $.ajaxSettings.async = false;
    $.get("../trigger/findTriggerTimeList",
        {"stateTime": stateTime,
            "endTime": endTime},
        function (res) {
            // triggerList=res;
            findTrigger(res);
        })
}

/**
 *  根据设备ID查询设备信息
 */
// var selDeviceInfo;
findSelDeviceInfo=function(deviceNumber) {
    // $.ajaxSettings.async = false;
    $.post("../device/selDeviceInfo",
        {"deviceNumber": deviceNumber},
        function (res) {
            updateDevice(res);

        })
}
/**
 * 根据坐标获取天气
 * coordinate==String(经度+","+纬度)
 */

findWeather=function (coordinate) {
    $.ajax({
        type: "post",
        url:"https://free-api.heweather.net/s6/weather/now",
        jsonp: "jsonpCallback",
        async:false,
        data:{
            "location": coordinate,
            "key":"c39380f488404b079a317043a40476fa"
        },
        success: function (data) {
            findWeatherValue(data);
        }
    })
}

/**
 * 根据地块ID获取对应的坐标信息，绘制地图中心点
 **/
var lotname="";
var Z=1;
var xy = [];
var X =116.397459;
var Y =39.908671;
function lot(id) {
    xy = [];
    $.ajax({
        type: "POST",
        url: "../lot/currencyShowLot",
        data: {id: id},
        dataType: "json",
        async:false,
        success: function (data) {
            if ('success' != data.state) {
                if(alert){
                    layer.alert("查询不到地段信息，请查看此地段是否已被删除或未添加地段");
                }
            }else{
                var lot=data.data.lot;
                var coordinateX=lot.coordinateX.split(",");
                var coordinateY=lot.coordinateY.split(",");
                lotname=lot.lotName;
                Z = coordinateX.length;
                for (var i = 0; i < coordinateX.length; i++) {
                    if(i==0){
                        X=0;
                        Y=0;
                    }
                    xy.push([coordinateX[i], coordinateY[i]]);
                    X = X + parseFloat(coordinateX[i]);
                    Y = Y + parseFloat(coordinateY[i]);
                }
                console.log("修改前X"+X/Z);
                console.log("修改前Y"+Y/Z);
                // map.setCenter([X/Z,Y/Z])
                map.panTo([X/Z,Y/Z]);
            }
        }
    })
}

/**
 * 查询用户下所有农场列表信息
 * farmName可以为null
 */
function findFarm(farmName) {
    $.ajax({
        type:"post",
        url:"/newFarmInfo/getList",
        async:false,
        data: {
            farmName:farmName,
            page:1,
            size:100
        },
        dataType: "json",
        success:function (data) {
            findFarmList(data);
        }
    })
}

/**
 * 查询某区域下所有摄像头信息（此功能仅适用于1区域对应多摄像头环境）
 * appId：区域ID
 * appType：摄像头类型（目前为止没卵用，填1）
 * page：页数
 * size：行数
 */
function getCameraList(appId){
    $.ajax({
        type:"post",
        url:"/cameraApplication/getCameraList",
        async:false,
        data: {
            appId:appId,
            appType:1,
            page:1,
            size:100
        },
        dataType: "json",
        success:function (data) {
            cameraList(data);
        }
    })
}

/**
 * 获取用户下的人员信息
 */
function findPeopleCount() {
    $.ajax({
        type:"post",
        url:"/smartAgriculture/getPeopleStructureList",
        // async:false,
        dataType: "json",
        data:{
            createUser:createUser
        },
        success:function (data) {
            findPeopleNum(data);
        }
    })

}