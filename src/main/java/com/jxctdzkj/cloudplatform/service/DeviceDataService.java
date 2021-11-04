package com.jxctdzkj.cloudplatform.service;

import com.jxctdzkj.cloudplatform.bean.OpLogBean;
import com.jxctdzkj.cloudplatform.utils.ReturnObject;

import java.sql.Timestamp;

/**
 * @Description 获取设备可视化数据的接口
 * @Author chanmufeng
 * @Date 2019/10/10 13:23
 **/
public interface DeviceDataService {

    ReturnObject selDeviceData(Timestamp startTime, String deviceNumber, int count, long interval);
}
