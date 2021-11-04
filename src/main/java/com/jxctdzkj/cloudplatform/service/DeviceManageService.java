package com.jxctdzkj.cloudplatform.service;

import com.jxctdzkj.cloudplatform.bean.*;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import com.jxctdzkj.cloudplatform.utils.ReturnObject;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

public interface DeviceManageService {

    List<DeviceBean> getDeviceList(int page, int limit, String acode);

    DeviceBean getDeviceBean(String deviceNumber);

    List<TemplateBean> getTempList();

    List<SensorTemplateBean> getDeviceSensorList(String sensorNcode);

    void updateDeviceSensor(String deviceNumber, int tempId);

    List<DeviceBean> getUserDeviceList(int page, int limit, String userName, String acode);

    int getDeviceCount(String acode);

    int getUserDeviceCount(String userName, String acode);

    List<UserDeviceBean> getDeviceStatic(int page, int limit);

    List<UserDeviceBean> getDeviceSelect();

    List<SensorTemplateBean> getSensorSelect(String sensorNcode);

    List<SensorDataBean> getHistoryData(String sensorCode, Timestamp from, Timestamp to);

    Map<String, Object> getDeviceReport();

    ReturnObject getAllDeviceList(int page, int limit, String deviceCode);

    ReturnObject getNewAllDeviceList(int page, int limit, String deviceCode);

    /**
     * 获取当前用下所有设备总数以及设备触发器报警总数
     *
     * @return
     * @User 李英豪
     */
    ResultObject findDeviceCount() throws RuntimeException;

    //--根据设备号+用户名称查询设备
    UserDeviceBean selectByUserNameAndDeviceNumber(String userName, String deviceNumber);

}
