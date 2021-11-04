package com.jxctdzkj.cloudplatform.service;

import com.jxctdzkj.cloudplatform.bean.ConditionConfigBean;
import com.jxctdzkj.cloudplatform.bean.ConditionConfigHistoryBean;
import com.jxctdzkj.cloudplatform.bean.SensorDataBean;
import com.jxctdzkj.cloudplatform.bean.SensorTemplateBean;
import com.jxctdzkj.cloudplatform.utils.ReturnObject;
import org.nutz.dao.pager.Pager;

import java.util.List;
import java.util.Map;

public interface ConditionService {

    List<ConditionConfigBean> getConditionConfigList(int page, int limit, String sensorCode);

    List<ConditionConfigBean> getConditionConfigList(String name, int page, int limit, String sensorCode);

    int getConditionListCount(String name);

    int getConditionListCount(String userName, String name);

    void saveConditionConfig(ConditionConfigBean condition);

    void updateState(int state, long id);

    ConditionConfigBean getCondition(long id);

    List<SensorTemplateBean> getSensorList(String ncode);

    List<SensorTemplateBean> getSensorListTwo(String ncode,long id)throws RuntimeException;

    List<SensorTemplateBean> getAquacultureSensorList(String ncode);

    int getAquacultureSensorCount(String ncode);

    void conditionTrigger(String ncode, Map<String, SensorDataBean> conditionMap);

    ReturnObject delCondition(long id);

    long getHistoryCount(String userName,String sensorCode);

    List<ConditionConfigHistoryBean> getHistoryList(Pager pager, String userName, String sensorCode);

    void deleteHistory(Integer id);


}
