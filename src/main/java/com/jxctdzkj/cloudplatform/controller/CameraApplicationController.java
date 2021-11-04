package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.CameraApplicationBean;
import com.jxctdzkj.cloudplatform.bean.CameraBean;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.opLog.EnableOpLog;
import com.jxctdzkj.cloudplatform.service.CameraService;
import com.jxctdzkj.cloudplatform.service.impl.CameraApplicationServiceImpl;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import lombok.extern.slf4j.Slf4j;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * @Description
 * @Author chanmufeng
 * @Date 2019/7/31 11:45
 **/
@RestController
@Slf4j
@RequestMapping({"cameraApplication"})
public class CameraApplicationController {
    @Autowired
    Dao dao;

    @Autowired
    CameraApplicationServiceImpl cameraApplicationService;

    @Autowired
    CameraService cameraService;

    @RequestMapping("getCameraList")
    @ResponseBody
    public Object getCameraList(int page, int size, String serial, Long appId, Integer appType) {
        try {
            List<CameraApplicationBean> list = cameraApplicationService.getCameraList(page, size, serial, appId, appType);
            return ResultObject.okList(list);
        } catch (Exception e) {
            e.printStackTrace();
            return ResultObject.okList(new ArrayList<>());
        }
    }

    //上级可查看下级绑定的摄像头
    @RequestMapping("getPerspectiveCameraList")
    @ResponseBody
    public Object getPerspectiveCameraList(int page, int size, String serial, Long appId, Integer appType) {
        try {
            List<CameraApplicationBean> list = cameraApplicationService.getCameraListWithoutUserName(page, size, serial, appId, appType);
            return ResultObject.okList(list);
        } catch (Exception e) {
            e.printStackTrace();
            return ResultObject.okList(new ArrayList<>());
        }
    }

    // 绑定摄像头-跳转
    @RequestMapping(value = "toBoundCamera")
    public ModelAndView toBoundFarmDevice(String appId, String appType) {
        HashMap data = new HashMap();
        data.put("appId", appId);
        data.put("appType", appType);

        //查询当前用户绑定的所有摄像头
        List<CameraBean> cameraBeans = cameraService.listAllCameras();
        data.put("cameraBeans", cameraBeans);
        return new ModelAndView("cameraApplication/boundCamera", "data", data);
    }

    @RequestMapping("saveCamera")
    @EnableOpLog(Constant.ModifyType.SAVE)
    public Object saveCamera(CameraApplicationBean cameraApplication) {
        return cameraApplicationService.saveCamera(cameraApplication);
    }

    @RequestMapping("deleteCamera")
    @EnableOpLog(Constant.ModifyType.DELETE)
    public Object deleteCamera(String id) {
        return cameraApplicationService.deleteCamera(id);
    }
}
