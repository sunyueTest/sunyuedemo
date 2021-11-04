package com.jxctdzkj.cloudplatform.service;

import com.jxctdzkj.cloudplatform.bean.TimedTaskManageBean;
import com.jxctdzkj.cloudplatform.bean.TimedTaskManageHistoryBean;
import com.jxctdzkj.cloudplatform.utils.ResultObject;

import java.util.List;

public interface TimeTaskManageService {

    // 保存水产定时任务
    ResultObject saveTimeTaskManage(TimedTaskManageBean bean);

    // 获取任务列表
    List<TimedTaskManageBean> getTimeTaskManageList(String queryParam, int page, int size);

    // 获取任务列表数count
    int getTimeTaskManageCount(String queryParam);

    // 删除任务
    ResultObject delTimeTaskManage(String id);

    TimedTaskManageBean getTimeTaskInfo(String id);

    ResultObject changeTimeTaskStatus(String id, String status);

    List<TimedTaskManageHistoryBean> getTimeTaskHistory(String queryParam, int page, int size,String taskName);

    int getTimeTaskHistoryCount(String queryParam);
}
