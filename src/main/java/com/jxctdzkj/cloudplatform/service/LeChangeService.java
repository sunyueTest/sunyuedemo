package com.jxctdzkj.cloudplatform.service;

import com.alibaba.fastjson.JSONObject;
import com.jxctdzkj.cloudplatform.bean.CameraBean;
import com.jxctdzkj.cloudplatform.utils.ResultObject;

import java.util.HashMap;

public interface LeChangeService {

    String accessToken();

    void bindDevice(String deviceId,String code,String token);

    void unBindDevice(String deviceId,String token);

    CameraBean getLiveStreamInfo(CameraBean cameraBean, String token);

    String setDeviceSnap(String deviceId,String token);

    /**
     * Operation取值为"move"或者"locate",两种操作不能同时进行。
     *
     * 当Operation为move时，表示移动：
     *
     * H 水平移动速度：范围[-8,8]，负数向左，正数向右。
     *
     * V 垂直移动速度：范围[-8,8]，负数向下，正数向上。（20151207修改成相反，与实际实现保持一致）
     *
     * Z 变倍倍数：取固定值"1"。
     *
     *
     *
     * 注：三个参数为 0,0,1 时表示立即停止。
     *
     * Duration表示移动的持续时间，单位毫秒。没有Duration字段或Duration字段填“last”表示一直运动下去。
     *
     *
     *
     * 当Operation为locate时，表示定位：
     *
     * H 水平位置：取值范围-1~1
     *
     * V 垂直位置：取值范围-1~1
     *
     * Z 变倍倍数：归一化0~1，其中0是缩到最小，1表示放到最大。
     *
     * Duration参数无意义，可省略Duration字段。
     * @param deviceId
     * @param token
     * @param operation
     * @param h
     * @param v
     * @param z
     * @param duration
     */
    void controlPTZ(String deviceId,String token,String operation,Double h,Double v,Double z,String duration);


}
