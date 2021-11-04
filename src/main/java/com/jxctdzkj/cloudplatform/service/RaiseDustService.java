package com.jxctdzkj.cloudplatform.service;

import com.jxctdzkj.cloudplatform.bean.DeviceBean;
import com.jxctdzkj.cloudplatform.bean.FarmInfoBean;
import com.jxctdzkj.cloudplatform.bean.UserGroupBean;
import com.jxctdzkj.cloudplatform.utils.ResultObject;

import java.util.List;
import java.util.Map;

/**
 * @Auther huangwei
 * @Date 2019/10/8
 **/
public interface RaiseDustService {

     //获取所有地区下的所有设备的报警情况展示
     Map<String,Integer> getAllAlarm(String from , String to);

     //数据上报接口  获取该设备的触发器数据
     Map<String,Object> getTrigger(String deviceId);

     //保存设备 给用户绑定设备
     ResultObject saveDevice(String userName, String deviceName, String deviceNumber,String devicePassword, Double longitude, Double latitude);

     //查询用户下所有设备
     List<DeviceBean>  toBoundDeviceByUser(int page,int size, String deviceNumber,String userName);

     //获取当前用户的地区
     List<FarmInfoBean> getFarmInfoListNoPage();

     //根据用户删除用户指定的设备
     ResultObject delDeviceByUser(String id);

     //获取离线设备
     Map<String, Object> getDeviceStatus ();

     //获取该地区下的所有设备（不包含继电器）
     List<DeviceBean> getFarmDeviceListNewTwo(int page, int size, String deviceNumber, List<UserGroupBean> userGroupBeans) throws Exception;

     //通过筛选值以及地区筛选相应的设备报警信息
     ResultObject getDeviceByScreenValue(int size,int page, String areaId,String from,String to);

      //根据设备查地区信息
     ResultObject getAreaByDevice(String deviceNumber);

     //根据地区查询地区下所有报警信息  根据时间段（当月,今年）
     ResultObject  getDeviceHistory(int page ,int size,String areaId,String from,String to);

     //查看所有报警信息（实时报警信息）

     ResultObject   getDeviceAlarm(int page,int size,String areaId);

     //根据设备查询报警信息

     ResultObject   getAlarmByDevice(String  deviceNumber,String from,String to);
     //查看所有传感器

     ResultObject   getSensorList(int page,int size,String sensorName)  throws Exception;

     //新增传感器

     ResultObject  addSensor(String sensorName ,String unit,String coeffcient) throws Exception;

     //查询该设备所绑定的用户

     ResultObject  allBoundUser(int page,int size,String deviceNumber,String userName);


     //查看当前用户的子用户

     ResultObject  boundSonUser(int page,int size,String userName,String searchName);

}
