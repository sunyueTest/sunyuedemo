package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.ConditionConfigBean;
import com.jxctdzkj.cloudplatform.bean.ConditionConfigHistoryBean;
import com.jxctdzkj.cloudplatform.bean.SensorTemplateBean;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.opLog.EnableOpLog;
import com.jxctdzkj.cloudplatform.service.ConditionService;
import com.jxctdzkj.cloudplatform.service.impl.VersionServiceImpl;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ReturnObject;

import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.pager.Pager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.List;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequestMapping({"conditionConfig"})
@Controller
public class ConditionConfigController {
    @Autowired
    ConditionService conditionService;

    @Autowired
    VersionServiceImpl versionService;

    @RequestMapping()
    public String index() {
        return "condition/conditionList";
    }

    @RequestMapping(value = "/conditionConfigList")
    @ResponseBody
    public ReturnObject getConditionConfigList(int page, int limit, String sensorCode) {
        ReturnObject result = new ReturnObject();
        int level = ControllerHelper.getLoginUserLevel();
        List<ConditionConfigBean> list = new ArrayList<>();
        if (level > Constant.Define.ROLE_0) {
            String userName = ControllerHelper.getLoginUserName();
            int count = conditionService.getConditionListCount(userName, sensorCode);
            if (count > 0) {
                list = conditionService.getConditionConfigList(ControllerHelper.getLoginUserName(), page, limit, sensorCode);
            }
            result.setCount(count);
        } else {
            int count = conditionService.getConditionListCount(sensorCode);
            result.setCount(count);
            if (count > 0) {
                list = conditionService.getConditionConfigList(page, limit, sensorCode);
            }
        }
        result.setCode(0);
        result.setData(list);
        result.setSuccess(true);
        result.setLast(limit > list.size());
        return result;
    }

    @RequestMapping(value = "/getCondition")
    public ModelAndView getCondition(Integer id) {
        if (id == null) {
            return new ModelAndView("condition/conditionAdd", "data", new ConditionConfigBean());
        } else {
            ConditionConfigBean bean = conditionService.getCondition(id);
            return new ModelAndView("condition/conditionAdd", "data", bean);
        }
    }

    @RequestMapping(value = "/saveCondition")
    @ResponseBody
    @EnableOpLog(Constant.ModifyType.SAVE)
    public ReturnObject saveCondition(ConditionConfigBean bean) {
        ReturnObject result = new ReturnObject();
        try {
            //判断当前用户创建的组态数量是否超限
            String userName = ControllerHelper.getLoginUserName();
            ReturnObject ro = versionService.checkVersion(userName, "configuration");
            if (!ro.isSuccess()) return ro;

            conditionService.saveConditionConfig(bean);
            result.setSuccess(true);
        } catch (Exception e) {
            log.error(e.getMessage());
            result.setSuccess(false);
            result.setMsg(e.toString());
        }
        return result;
    }

    @RequestMapping(value = "/delCondition")
    @ResponseBody
    @EnableOpLog(Constant.ModifyType.DELETE)
    public ReturnObject delCondition(@RequestParam long id) {
        return conditionService.delCondition(id);
    }

    @RequestMapping(value = "/updateState")
    @ResponseBody
    @EnableOpLog
    public ReturnObject updateState(int state, long id) {
        ReturnObject result = new ReturnObject();
        conditionService.updateState(state, id);
        result.setSuccess(true);
        result.setMsg("操作成功");
        return result;
    }


    @RequestMapping(value = "/getSensorList")
    @ResponseBody
    public ReturnObject getSensorList(String ncode, long id) {
        ReturnObject result = new ReturnObject();
        try {
            List<SensorTemplateBean> data = null;
            if (StringUtils.isBlank(ncode)) {//修改
                if (id > 0) {
                    ConditionConfigBean bean = conditionService.getCondition(id);
                    if (bean != null) {
                        data = conditionService.getSensorList(bean.getToDevice());
                    }
                    String commands = bean.getCommand();
                    List<Integer> bitList = new ArrayList<>();
                    for (int i = 0; i < commands.length(); i++) {
                        bitList.add(-1);//标记元素
                    }
                    for (int i = 0; i < commands.length() / 4; i++) {
                        String order = commands.substring(i * 4, i * 4 + 4);
                        int b = Integer.parseInt(order.substring(0, 2));
                        int s = Integer.parseInt(order.substring(2, 4));
                        bitList.set(b - 1, s);
                    }
                    //解析指令.
                    List<SensorTemplateBean> valid = new ArrayList<>();//缓存有效的数据
                    for (int i = 0; i < data.size(); i++) {
                        if (bitList.get(i) != -1) {
                            data.get(i).setState(bitList.get(i));
                            valid.add(data.get(i));
                        }
                    }
                    result.setData(valid);
                }
            } else {//查询
                data = conditionService.getSensorListTwo(ncode, id);
                //data = conditionService.getSensorList(ncode);
                //ConditionConfigBean bean = conditionService.getCondition(id);
                result.setData(data);
            }

            result.setCode(0);
        } catch (RuntimeException e) {
            result.setSuccess(false);
            result.setMsg(e.getMessage());
        }
        return result;
    }

    @RequestMapping(value = "/conditionHistory")
    public String conditionHistory() {
        return "condition/conditionHistory";
    }

    @RequestMapping(value = "/getHistoryList")
    @ResponseBody
    public ReturnObject getHistoryList(String sensorCode, int page, int limit) {
        ReturnObject result = new ReturnObject();
        String user = ControllerHelper.getLoginUserName();
        if (StringUtils.isBlank(user)) {
            result.setMsg("用户未登录");
            result.setSuccess(false);
            return result;
        }
        Pager pager = new Pager(page, limit);
        int level = ControllerHelper.getLoginUserLevel();
        String userName = null;
        if (level > Constant.Define.ROLE_0) {
            userName = ControllerHelper.getLoginUserName();
        }
        List<ConditionConfigHistoryBean> data = conditionService.getHistoryList(pager, userName, sensorCode);
        long count = conditionService.getHistoryCount(userName, sensorCode);
        result.setCount(count);
        result.setData(data);
        result.setCode(0);
        return result;
    }

    @RequestMapping(value = "/deleteHistory")
    @ResponseBody
    @EnableOpLog(Constant.ModifyType.DELETE)
    public ReturnObject deleteHistory(Integer id) {
        ReturnObject result = new ReturnObject();
        conditionService.deleteHistory(id);
        result.setSuccess(true);
        return result;
    }

}
