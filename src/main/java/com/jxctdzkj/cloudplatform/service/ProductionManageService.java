package com.jxctdzkj.cloudplatform.service;

import com.jxctdzkj.cloudplatform.bean.DeviceBean;

import java.util.List;

public interface ProductionManageService {

    List<DeviceBean> getUserPondDeviceList(int page, int limit, String userName, String acode, String pondId, String groupId,String isDevice);


    List<DeviceBean> getUserFarmDeviceList(int page, int limit, String userName, String acode, String farmId);

    int getUserFarmDeviceCount(String userName, String acode, String farmId);

    int getUserPondDeviceCount(String userName, String acode, String pondId, String groupId);
}
