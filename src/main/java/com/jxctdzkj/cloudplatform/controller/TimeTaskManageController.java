package com.jxctdzkj.cloudplatform.controller;


import com.jxctdzkj.cloudplatform.bean.TimedTaskManageBean;
import com.jxctdzkj.cloudplatform.bean.TimedTaskManageHistoryBean;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.opLog.EnableOpLog;
import com.jxctdzkj.cloudplatform.service.TimeTaskManageService;
import com.jxctdzkj.cloudplatform.service.impl.VersionServiceImpl;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.List;

@Controller
@Slf4j
@RequestMapping({"timeTaskManage"})
public class TimeTaskManageController {

    @Autowired
    private TimeTaskManageService service;

    @Autowired
    private VersionServiceImpl versionService;

    @RequestMapping(value = "/toList")
    public ModelAndView toList() {
        return new ModelAndView("timeTaskManage/list");
    }

    @RequestMapping(value = "/toHistory")
    public ModelAndView toHistory() {
        return new ModelAndView("timeTaskManage/history");
    }

    @RequestMapping(value = "/toAdd")
    public ModelAndView toAdd() {
        return new ModelAndView("timeTaskManage/add");
    }

    @RequestMapping(value = "/saveTimeTaskManage")
    @ResponseBody
    @EnableOpLog(Constant.ModifyType.SAVE)
    public ResultObject saveTimeTaskManage(TimedTaskManageBean bean) {
        try {
            //首先判断当前用户拥有的定时任务是否超限
            String userName = ControllerHelper.getLoginUserName();
            ResultObject ro = versionService.checkVersionAuthority(userName, "timer");
            if (ro.get("state").equals("failed")) {
                return ro;
            }

            return service.saveTimeTaskManage(bean);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResultObject.apiError("fail");
        }
    }

    @RequestMapping(value = "/getTimeTaskManageList")
    @ResponseBody
    public ResultObject getTimeTaskManageList(int page, int size, String queryParam) {
        try {
            List<TimedTaskManageBean> list = service.getTimeTaskManageList(queryParam, page, size);
            int count = service.getTimeTaskManageCount(queryParam);
            return ResultObject.okList(list, page, size, count);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResultObject.apiError("fail");
        }
    }

    @RequestMapping(value = "/delTimeTaskManage")
    @ResponseBody
    @EnableOpLog(Constant.ModifyType.DELETE)
    public ResultObject delTimeTaskManage(String id) {
        try {
            return service.delTimeTaskManage(id);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResultObject.apiError("fail");
        }
    }

    @RequestMapping(value = "/getTimeTaskInfo")
    @ResponseBody
    public ResultObject getTimeTaskInfo(String id) {
        try {
            TimedTaskManageBean bean = service.getTimeTaskInfo(id);
            if (bean != null) {
                return ResultObject.ok(bean);
            } else {
                return ResultObject.apiError("fail");
            }
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResultObject.apiError("fail");
        }
    }

    @RequestMapping(value = "/changeTimeTaskStatus")
    @ResponseBody
    @EnableOpLog
    public ResultObject changeTimeTaskStatus(String id, String status) {
        try {
            return service.changeTimeTaskStatus(id, status);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResultObject.apiError("fail");
        }
    }

    @RequestMapping(value = "/getTimeTaskHistory")
    @ResponseBody
    public ResultObject getTimeTaskHistory(int page, int size, String queryParam, String taskName) {
        try {
            List<TimedTaskManageHistoryBean> list = service.getTimeTaskHistory(queryParam, page, size, taskName);
            int count = service.getTimeTaskHistoryCount(queryParam);
            return ResultObject.okList(list, page, size, count);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResultObject.apiError("fail");
        }
    }

    @RequestMapping(value = "/toUpdateTimeTask")
    public ModelAndView toUpdateTimeTask(String id) {
        return new ModelAndView("aquaculture/timedTaskManage/updateTimedTaskManage", "id", id);
    }


}
