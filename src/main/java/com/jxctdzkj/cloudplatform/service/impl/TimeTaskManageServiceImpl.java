package com.jxctdzkj.cloudplatform.service.impl;

import com.jxctdzkj.cloudplatform.bean.TimedTaskManageBean;
import com.jxctdzkj.cloudplatform.bean.TimedTaskManageHistoryBean;
import com.jxctdzkj.cloudplatform.service.TimeTaskManageService;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import lombok.extern.slf4j.Slf4j;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.pager.Pager;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

@Service
@Slf4j
public class TimeTaskManageServiceImpl implements TimeTaskManageService {

    @Autowired
    Dao dao;

    @Override
    public ResultObject saveTimeTaskManage(TimedTaskManageBean bean) {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        bean.setCreateTime(new Timestamp(new Date().getTime()));
        bean.setCreateUser(userName);
        bean.setDeleteFlag("0");
        String[] secondsArr = bean.getTime().split(":");
        int seconds = (Integer.parseInt(secondsArr[0]) * 3600) + (Integer.parseInt(secondsArr[1]) * 60) + Integer.parseInt(secondsArr[2]);
        bean.setSeconds(seconds);
        if (bean.getId() != 0) {
            TimedTaskManageBean oldBean = dao.fetch(TimedTaskManageBean.class, Cnd.where("id", "=", bean.getId()));
            String status = oldBean.getStatus();
            if (oldBean != null) {
                BeanUtils.copyProperties(bean, oldBean);
                oldBean.setStatus(status);
                return dao.update(oldBean) > 0 ? ResultObject.ok("success") : ResultObject.apiError("fail");
            }
            return ResultObject.apiError("fail");
        } else {
            bean.setStatus("1");
//            dao.insert(bean);
            return dao.insert(bean) != null ? ResultObject.ok("success") : ResultObject.apiError("fail");
        }
    }

    @Override
    public List<TimedTaskManageBean> getTimeTaskManageList(String queryParam, int page, int size) {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        Cnd cnd=Cnd.where("create_user", "=", userName).and("delete_flag", "=", "0");
        if(queryParam!=null&&!"".equals(queryParam)){
            cnd.and("device_number","like","%"+queryParam+"%");
        }
        return dao.query(TimedTaskManageBean.class, cnd, new Pager(page, size));
    }

    @Override
    public int getTimeTaskManageCount(String queryParam) {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        Cnd cnd=Cnd.where("create_user", "=", userName).and("delete_flag", "=", "0");
        if(queryParam!=null&&!"".equals(queryParam)){
            cnd.and("device_number","like","%"+queryParam+"%");
        }
        return dao.count(TimedTaskManageBean.class, cnd);
    }

    @Override
    public ResultObject delTimeTaskManage(String id) {
        TimedTaskManageBean bean = dao.fetch(TimedTaskManageBean.class, Cnd.where("id", "=", id));
        if (bean != null) {
            bean.setDeleteFlag("1");
            return dao.update(bean) > 0 ? ResultObject.ok("success") : ResultObject.apiError("fail");
        } else {
            return ResultObject.apiError("fail");
        }
    }

    @Override
    public TimedTaskManageBean getTimeTaskInfo(String id) {
        return dao.fetch(TimedTaskManageBean.class, Cnd.where("id", "=", id));
    }

    @Override
    public ResultObject changeTimeTaskStatus(String id, String status) {
        TimedTaskManageBean bean = dao.fetch(TimedTaskManageBean.class, Cnd.where("id", "=", id));
        if (bean != null) {
            bean.setStatus(status);
            return dao.update(bean) > 0 ? ResultObject.ok("success") : ResultObject.apiError("fail");
        } else {
            return ResultObject.apiError("fail");
        }
    }

    @Override
    public List<TimedTaskManageHistoryBean> getTimeTaskHistory(String queryParam, int page, int size, String taskName) {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        Cnd cnd = Cnd.where("create_user", "=", userName);
        if (taskName != null) {
            cnd.and("task_name", "=", taskName);
        }
        return dao.query(TimedTaskManageHistoryBean.class, cnd, new Pager(page, size));
    }

    @Override
    public int getTimeTaskHistoryCount(String queryParam) {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        return dao.count(TimedTaskManageHistoryBean.class, Cnd.where("create_user", "=", userName));
    }
}
