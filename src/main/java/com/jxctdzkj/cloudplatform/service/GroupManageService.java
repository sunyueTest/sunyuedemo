package com.jxctdzkj.cloudplatform.service;

import com.jxctdzkj.cloudplatform.bean.DeviceBean;
import com.jxctdzkj.cloudplatform.bean.NetDevicedata;
import com.jxctdzkj.cloudplatform.bean.UserDeviceBean;
import com.jxctdzkj.cloudplatform.bean.UserGroupBean;

import java.util.List;

public interface GroupManageService {

    public List<UserGroupBean> getGroupList(String userName);

    public List<UserDeviceBean> getGroupDeviceList(String userName);

    public UserGroupBean getGroupById(Integer id);

    public UserDeviceBean getGroupDeviceById(Integer id);

    public void saveGroup(UserGroupBean groupBean);

    public void updateGroup(UserGroupBean groupBean);

    public void saveGroupDevice(UserDeviceBean deviceBean);

    public void updateGroupDevice(UserDeviceBean deviceBean);

    public void deleteGroupDevice(UserDeviceBean deviceBean);

    public void deleteGroup(UserGroupBean groupBean);

    List<UserGroupBean> getRootList(String userName);

    List<NetDevicedata> getSensorData(String dcode);

    List<String> getSensorType(String deviceNumber);

    List<String> getSensorTypeId(String deviceNumber);

    DeviceBean getDeviceData(String deviceNumber);

    void updatePid(int id,int pId);

    List<NetDevicedata> getSensorDataByDayCount(String dcode, int dayCount);

    List<UserDeviceBean> getDeviceListByGroupId(Long groupId) ;

    /**
     * 根据传入的分组ID查询该分组下是否存在子分组或设备,存在不允许删除
     * @param id
     * @return 字符串:删除成功/删除失败,先删除当前分组下的子分组与设备
     * @throws RuntimeException
     * @User 李英豪
     */
    String getGroupDevice(Integer id)throws RuntimeException;
}
