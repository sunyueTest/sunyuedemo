package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.CameraBean;
import com.jxctdzkj.cloudplatform.bean.LeChangeDeviceBean;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.opLog.EnableOpLog;
import com.jxctdzkj.cloudplatform.service.LeChangeService;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 乐橙摄像头接口
 */
@Slf4j
@Controller
@RequestMapping({"/leChange"})
public class LeChangeController {

    @Autowired
    LeChangeService leChangeService;

    @Autowired
    Dao dao;

    @RequestMapping("/bindDevice")
    @ResponseBody
    @EnableOpLog(Constant.ModifyType.SAVE)
    public ResultObject bindDevice(String deviceId,String code) {
        try{
            String token =leChangeService.accessToken();
            log.info("token--------------"+token);
            leChangeService.bindDevice(deviceId,code,token);
            return ResultObject.ok("绑定成功").data(token);
        }catch(Exception e){
            log.error(e.toString(),e);
            return ResultObject.error(e.getMessage());
        }
    }

    @RequestMapping("/unBindDevice")
    @ResponseBody
    @EnableOpLog(Constant.ModifyType.DELETE)
    public ResultObject unBindDevice(String deviceId) {
        if(StringUtils.isBlank(deviceId)){
            return ResultObject.error("deviceId is null");
        }
        try{
            String token =leChangeService.accessToken();
            leChangeService.unBindDevice(deviceId,token);
            return ResultObject.ok("绑定成功").data(token);
        }catch(Exception e){
            log.error(e.toString(),e);
            return ResultObject.error(e.getMessage());
        }
    }

    @RequestMapping("/getLiveStreamInfo")
    @ResponseBody
    public ResultObject getLiveStreamInfo(String deviceId) {
        String token =leChangeService.accessToken();
        CameraBean cameraBean = dao.fetch(CameraBean.class, Cnd.where("serial", "=", deviceId));
        return ResultObject.ok().data(leChangeService.getLiveStreamInfo(cameraBean, token));
    }
}
