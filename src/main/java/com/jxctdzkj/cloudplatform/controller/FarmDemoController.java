package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.SysUserBean;
import com.jxctdzkj.cloudplatform.bean.UserRoleBean;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ReturnObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

@Slf4j
@RequestMapping({"farmDemo"})
@Controller
public class FarmDemoController {

    @Autowired
    Dao dao;

    /**
     * 组态应用入口
     * @return
     */
    @RequestMapping("conditionList")
    public String conditionList() {
        return "farm/condition/conditionList";
    }

    @RequestMapping("commandList")
    public String commandList() {
        return "farm/command/commandList";
    }

    @RequestMapping("sensorTemplateList")
    public String sensorTemplateList() {
        return "farm/templet/sensorTemplateList";
    }

    @RequestMapping("triggerList")
    public String triggerList() {
       return "farm/trigger/triggerList";
    }

    @RequestMapping("triggerHistory")
    public String triggerHistory() {
        return "farm/trigger/triggerHistory";
    }

    @RequestMapping("deviceList")
    public String deviceList() {
        return "farm/device/deviceList";
    }

    @RequestMapping("dashboard")
    public String dashboard() {
        return "farm/device/dashboard";
    }

    @RequestMapping("groupList")
    public String groupList() {
        return "farm/group/groupList";
    }

    @RequestMapping("historyList")
    public String historyList() {
        return "farm/device/historyList";
    }

    @RequestMapping("groupDevice")
    public String groupDevice() {
        return "farm/device/groupDevice";
    }

    @RequestMapping("templateList")
    public String templateList() {
        return "farm/userDefined/templateList";
    }

    @RequestMapping("changePassword")
    public String changePassword() {
        return "farm/user/changePassword";
    }

    @RequestMapping("userList")
    public ModelAndView userList() {
        int level =ControllerHelper.getLoginUserLevel();

        return new ModelAndView("farm/user/userList","level",level);
    }

    @RequestMapping("myInfo")
    public ModelAndView userDetail() {
        SysUserBean user=ControllerHelper.getInstance(dao).getLoginUser();
        return new ModelAndView("farm/user/myInfo","user",user);
    }

    @RequestMapping({"getUserRole"})
    @ResponseBody
    public Object getUserRole() {
        ReturnObject result = new ReturnObject();
        String userName = ControllerHelper.getLoginUserName();
        if(StringUtils.isBlank(userName)){
            result.setSuccess(false);
            result.setMsg("用户未登录");
            return result;
        }
        UserRoleBean userRole=dao.fetch(UserRoleBean.class, Cnd.where("user_name","=",userName));
        if(userRole == null){
            result.setSuccess(false);
            result.setMsg("用户无权限信息");
            return result;
        }
        result.setSuccess(true);
        result.setData(userRole);
        return result;
    }

  
}
