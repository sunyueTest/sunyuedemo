let serial, channelNo;

/**
 * 向服务器查询摄像头直播链接
 *
 * @param cameraId 摄像头id
 * @param perspective 是否允许查看其他用户的摄像头
 *
 * 服务器首先查询数据库直播链接缓存
 * ------如果数据库有缓存，则服务器将直接返回cameraBean的信息
 * ------如果没有缓存，则查找当前用户的accessToken
 * ------------如果数据库保存有accessToken,则返回accessToken
 * ------------数据库没有保存accessToken,则返回appKey/appSecret,由浏览器进行下一步accessToken的获取
 */
function step1(cameraId, perspective) {
    return new Promise(function (resolve, reject) {
            $.ajax({
                type: "GET",
                url: "/cameraManage/getCameraAddress?id=" + cameraId + "&perspective=" + perspective,
                success: function (data) {
                    if (data.state == 'success') {
                        resolve(data.data);
                    } else {
                        layer.msg($.i18n.prop("播放失败"));
                        console.log(data.msg);
                    }
                },
                error: function (e) {
                    layer.msg($.i18n.prop("网络异常请稍后再试"));
                    console.log("error");
                }
            });
        }
    )
}

/**
 * 接收step1返回的结果，判断结果类型
 * ------如果是camera对象或者是accessToken，则直接携带该数据进入step3
 * ------如果是appKey/appSecret，则调用开放平台接口，查询accessToken，并上传至服务器保存，进行step3
 */
function step2(data) {
    serial = data.serial;
    channelNo = data.channelNo;
    return new Promise(function (resolve, reject) {
        if (data.camera || data.accessToken) {//服务器直接返回了摄像头直播信息或accessToken
            resolve(data);
        } else if (data.appKey && data.appSecret) {//服务器返回了appKey && appSecret
            $.ajax({
                type: "POST",
                url: "https://open.ys7.com/api/lapp/token/get",
                data: {
                    appKey: data.appKey,
                    appSecret: data.appSecret
                },
                dataType: "json",
                success: function (data) {
                    let tokenData = data.data;
                    if (data.code != "200" || !tokenData) {
                        layer.msg($.i18n.prop("播放失败"));
                        return;
                    }
                    resolve(tokenData);
                    uploadAccessToken(tokenData.accessToken, tokenData.expireTime, 1);
                },
                error: function (e) {
                    layer.msg($.i18n.prop("网络异常请稍后再试"));
                    console.log(e);
                }
            });
        }
    });
}

/**
 * 接收step2返回的数据，camera或accessToken
 * ------如果是camera对象，则直接返回
 * ------如果是accessToken，则调用开放平台接口，查询直播链接，并上传至服务器保存
 */
function step3(data) {
    if (data.camera) {
        console.log("step2直接返回了camera");
        console.log(data.camera);
        return data.camera;
    }
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: "https://open.ys7.com/api/lapp/live/video/list",
            data: {
                pageStart: 0,
                pageSize: 50,
                accessToken: data.accessToken,
            },
            dataType: "json",
            success: function (data) {
                let addressData = data.data;
                if (data.code != '200' || !addressData) {
                    layer.msg($.i18n.prop("直播链接获取失败"));
                    console.log("直播链接获取失败");
                    return;
                }

                for (let i = 0; i < addressData.length; i++) {
                    if (addressData[i].deviceSerial == serial && addressData[i].channelNo == channelNo) {
                        let argObject = {
                            serial: addressData[i].deviceSerial,
                            channelNo: addressData[i].channelNo,
                            flv: addressData[i].flvAddress,
                            flvHd: addressData[i].hdFlvAddress,
                            hls: addressData[i].liveAddress,
                            hlsHd: addressData[i].hdAddress,
                            rtmp: addressData[i].rtmp,
                            rtmpHd: addressData[i].rtmpHd
                        };
                        console.log("最终的摄像头直播链接");
                        console.log(argObject);
                        resolve(argObject);
                        uploadYs7CameraAddress(argObject);
                        break;
                    }
                }
            },
            error: function (e) {
                layer.msg($.i18n.prop("网络异常请稍后再试"));
                console.log(e);
            }
        });
    });
}

/**
 * 获取摄像头直播链接调用接口
 * @param cameraId 摄像头id
 * @param perspective 是否允许当前用户查看其他用户的摄像头
 */
function getCameraAddress(cameraId, perspective) {
    return step1(cameraId, perspective).then(step2).then(step3);
}


/**
 * 将accessToken上传至服务器保存
 */
function uploadAccessToken(accessToken, expireTime, cameraType) {
    $.ajax({
        type: "POST",
        url: "/cameraManage/uploadAccessToken",
        data: {
            accessToken: accessToken,
            expireTime: expireTime,
            cameraType: cameraType
        },
        dataType: "json",
    });
}

/**
 * 将得到的摄像头链接上传至服务器保存
 */
function uploadYs7CameraAddress(args) {
    args.id = 0;
    $.ajax({
        type: "POST",
        url: "/cameraManage/uploadYs7CameraAddress",
        data: args,
        dataType: "json",
    });
}
