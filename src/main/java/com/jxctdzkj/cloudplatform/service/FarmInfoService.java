package com.jxctdzkj.cloudplatform.service;

import com.jxctdzkj.cloudplatform.bean.*;
import com.jxctdzkj.cloudplatform.utils.ResultObject;

import java.util.List;

public interface FarmInfoService {

    ResultObject save(FarmInfoBean bean) throws Exception;

    ResultObject saveFarmDevice(String farmId, String deviceNumber, String deviceName, double longitude, double latitude) throws Exception;

    ResultObject getFarmInfoList(int page, int size, String farmName) throws Exception;

    ResultObject getFarmInfoListNoPage(String farmName) throws Exception;

    List<DeviceBean> getFarmDeviceList(int page, int size, String deviceNumber, String farmId) throws Exception;

    int getFarmDeviceListCount(String deviceNumber, String farmId) throws Exception;

    ResultObject del(String id) throws Exception;

    ResultObject saveOrUpdate(FarmInfoBean bean) throws Exception;

    ResultObject boundDevice(String farmId, String deviceNumber, String deviceName, double longitude, double latitude) throws Exception;

    List<DeviceBean> getFarmDeviceListNew(int page, int size, String deviceNumber, List<UserGroupBean> userGroupBeans) throws Exception;

    int getFarmDeviceListCountNew(String deviceNumber, List<UserGroupBean> userGroupBeans) throws Exception;

    Object delFarmDevice(String id);

    void deleteFarm(String id) throws Exception;

    ResultObject setStatus(String farmId, String status, String irrigationTime, String duration);

    Boolean hasBoundedDevice(String farmId);

    Object addFarmByFront(FarmInfoBean farmInfoBean);

    Object getEarliestMatureCrop(String farmId);

    Object getFarmsException();

    List<DeviceBean> getDevicesOutOfGreenhouse(int page, int size);

    List<CameraBean> getCamerasOutOfGreenhouse(int page, int size);

    int getDevicesOutOfGreenhouseCount();

    int getCameraOutOfGreenhouseCount();

}
