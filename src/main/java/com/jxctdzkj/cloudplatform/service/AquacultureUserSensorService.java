package com.jxctdzkj.cloudplatform.service;

import com.jxctdzkj.cloudplatform.bean.AquacultureCommandDeviceBean;
import org.nutz.dao.pager.Pager;

import java.util.List;

public interface AquacultureUserSensorService {

    List<AquacultureCommandDeviceBean> getDeviceCommandList(String deviceNumber, String userName, Pager pager);

    int getDeviceCommandCount(String deviceNumber, String userName);

}
