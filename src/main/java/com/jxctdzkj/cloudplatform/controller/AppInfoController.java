package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.AppInfoBean;
import com.jxctdzkj.cloudplatform.bean.CameraBean;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.service.DeviceDataService;
import com.jxctdzkj.cloudplatform.service.DeviceManageService;
import com.jxctdzkj.cloudplatform.service.LoginService;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import com.jxctdzkj.cloudplatform.utils.ReturnObject;
import com.jxctdzkj.support.utils.TextUtils;

import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.sql.Timestamp;

import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 *     @author  : FlySand
 *     @e-mail  : 1156183505@qq.com
 *     @time    : 2019/4/3.
 *     @desc    :
 * </pre>
 */
@Controller
@RequestMapping("unrestricted")
@Slf4j
public class AppInfoController {
    @Autowired
    Dao dao;

    @Autowired
    LoginService loginService;


    @Autowired
    DeviceManageService deviceManageService;

    @Autowired
    DeviceDataService deviceDataService;


    @RequestMapping(value = "/getUpdateInfo")
    @ResponseBody
    public Object getUpdateInfo(@RequestParam(value = "type") String type) {
        AppInfoBean appInfo = dao.fetch(AppInfoBean.class, type);

        if (appInfo == null) {
            //return ResultObject.apiError("获取失败");
            return ResultObject.apiError("fail");
        }

        return ResultObject.ok(appInfo);
    }


    /**
     * 杨凌大棚触屏版（不包含设备以及摄像头信息）
     *
     * @return
     */
    @RequestMapping(value = "toDapengFullScreen")
    public String toDapengFullScreen(String userName, String password) {

        if (TextUtils.isEmpty(ControllerHelper.getLoginUserName())) {
            ResultObject resultObject = loginService.loginCheck(userName, password, null);
            if (resultObject.get("msg").equals("ok15")) {
                return "monitor/dapengFullScreen";
            }
            log.info("大棚用户名或密码错误" + resultObject.get("msg"));
            return "redirect:doLogin";
        }

//        SysUserBean userBean = dao.fetch(SysUserBean.class, Cnd.where("user_name", "=", userName).and("password", "=", password).and("is_del", "=", "0"));
//        if (userBean==null){
//            return "error/error";
//        }
//        loginService.autoLogin(userName, password);
        return "monitor/dapengFullScreen";
    }

    /**
     * 获取设备实时数据
     * 供溯源使用
     *
     * @param deviceNumber
     * @return
     */
    @RequestMapping(value = "getDeviceData")
    @ResponseBody
    public ResultObject getDeviceData(String deviceNumber) {
        return ResultObject.ok(deviceManageService.getDeviceBean(deviceNumber));
    }

    /**
     * 获取设备传感器各时段数据
     * 供溯源使用
     *
     * @param deviceNumber
     * @return
     */
    @RequestMapping(value = "getSensorReport")
    @ResponseBody
    public ReturnObject getSensorReport(String deviceNumber) {
        return deviceDataService.selDeviceData(new Timestamp(System.currentTimeMillis()), deviceNumber, 24, 1000 * 60 * 60);
    }

}
