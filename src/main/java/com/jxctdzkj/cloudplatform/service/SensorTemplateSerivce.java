package com.jxctdzkj.cloudplatform.service;

import com.jxctdzkj.cloudplatform.bean.SensorTypeBean;
import com.jxctdzkj.cloudplatform.bean.TemplateBean;

import java.util.List;

public interface SensorTemplateSerivce {

     List<TemplateBean> getTempList(int page, int limit,String name);

     TemplateBean getTempInfo(int id);

     List<SensorTypeBean> getTempSensorList(int id);

     List<SensorTypeBean> getSensorList(String tname);

     long saveTemp(TemplateBean bean);

     void updateTemp(TemplateBean bean);

     int getTempCount();
}
