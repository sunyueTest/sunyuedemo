package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.DeviceBean;
import com.jxctdzkj.cloudplatform.bean.FarmInfoBean;
import com.jxctdzkj.cloudplatform.bean.SysUserBean;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.opLog.EnableOpLog;
import com.jxctdzkj.cloudplatform.service.DeviceManageService;
import com.jxctdzkj.cloudplatform.service.FarmInfoService;
import com.jxctdzkj.cloudplatform.service.impl.SmartAgricultureServiceImpl;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import com.jxctdzkj.cloudplatform.utils.ReturnObject;
import com.jxctdzkj.support.utils.TextUtils;
import lombok.extern.slf4j.Slf4j;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

@Controller
@Slf4j
@RequestMapping({"farmInfo"})
public class FarmInfoController {

    @Autowired
    Dao dao;

    @Autowired
    FarmInfoService farmInfoService;

    @Autowired
    private SmartAgricultureServiceImpl smartAgricultureService;

    @Autowired
    private DeviceManageService deviceManageService;

    // 页面跳转
    @RequestMapping(value = "toList")
    public ModelAndView toFarmInfoList() {
        return new ModelAndView("farmInfo/list");
    }
    // 花房页面跳转
    @RequestMapping(value = "toListFlower")
    public ModelAndView toFarmInfoListFlower() {
        return new ModelAndView("farmInfo/list").addObject("type","0");
    }

    // 新增-跳转
    @RequestMapping(value = "toAdd")
    public ModelAndView toAdd(String type) {
        return new ModelAndView("farmInfo/addOrUpdate", "bean", new FarmInfoBean()).addObject("type",type);
    }

    // 修改-跳转
    @RequestMapping(value = "toUpdate")
    public ModelAndView toUpdate(String id,String type) {
        FarmInfoBean bean = dao.fetch(FarmInfoBean.class, Cnd.where("id", "=", id));
        return new ModelAndView("farmInfo/addOrUpdate", "bean", bean).addObject("type",type);
    }

    // 绑定设备列表-跳转
    @RequestMapping(value = "toBoundDeviceList")
    public ModelAndView toBoundDeviceList(String id) {
        FarmInfoBean bean = dao.fetch(FarmInfoBean.class, Cnd.where("id", "=", id));
        return new ModelAndView("farmInfo/boundFarmDeviceList", "bean", bean);
    }

    // 绑定设备-跳转
    @RequestMapping(value = "toBoundFarmDevice")
    public ModelAndView toBoundFarmDevice(String farmId) {
        FarmInfoBean bean = dao.fetch(FarmInfoBean.class, Cnd.where("id", "=", farmId));
        return new ModelAndView("farmInfo/boundFarmDevice", "bean", bean);
    }

    // 新增或修改
    @RequestMapping(value = "/save")
    @ResponseBody
    @EnableOpLog(Constant.ModifyType.SAVE)
    public ResultObject save(FarmInfoBean bean) {
        try {
            return farmInfoService.save(bean);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResultObject.apiError("fail");
        }
    }

    // 绑定农场设备
    @RequestMapping(value = "/saveFarmDevice")
    @ResponseBody
    @EnableOpLog(Constant.ModifyType.SAVE)
    public ResultObject saveFarmDevice(String farmId, String deviceNumber, String deviceName, double longitude, double latitude) {
        try {
            return farmInfoService.saveFarmDevice(farmId, deviceNumber, deviceName, longitude, latitude);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResultObject.apiError("fail");
        }
    }

    // 获取列表
    @RequestMapping(value = "/getList")
    @ResponseBody
    public ResultObject getList(@RequestParam(value = "page", required = false, defaultValue = "1") int page,
                                @RequestParam(value = "size", required = false, defaultValue = "100") int size, String farmName) {
        try {
            //根据用户角色判断是否是多级用户系统
            SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
            int roleId = userBean.getRole();
            if (roleId == 16 || roleId == 17) {
                return smartAgricultureService.getSmartAgricultureList(page, size, farmName);
            } else {
                return farmInfoService.getFarmInfoList(page, size, farmName);
            }
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResultObject.apiError("fail");
        }
    }

    // 获取农场设备列表
    @RequestMapping(value = "/getFarmDeviceList")
    @ResponseBody
    public ResultObject getFarmDeviceList(@RequestParam(value = "page", required = false, defaultValue = "1") int page,
                                          @RequestParam(value = "size", required = false, defaultValue = "100") int size,
                                          String deviceNumber, String farmId) {
        try {
            List<DeviceBean> list = farmInfoService.getFarmDeviceList(page, size, deviceNumber, farmId);
            int count = farmInfoService.getFarmDeviceListCount(deviceNumber, farmId);
            return ResultObject.okList(list, page, size, count);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResultObject.apiError("fail");
        }
    }

    // 删除
    @RequestMapping(value = "/del")
    @ResponseBody
    @EnableOpLog(Constant.ModifyType.DELETE)
    public ResultObject del(String id) {
        try {
            return farmInfoService.del(id);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResultObject.apiError("fail");
        }
    }


    /**
     * 农业大数据平台首页-农场设备状态列表
     *
     * @param page
     * @param size
     * @return
     */
    @RequestMapping("getFarmsDevices")
    @ResponseBody
    public ResultObject getFarmsDevices(int page, int size, String deviceName) {
        List<DeviceBean> list = new ArrayList<>();
        try {
            ReturnObject res = deviceManageService.getAllDeviceList(page, size, null);
            if (res.isSuccess()) {
                list = (List<DeviceBean>) res.getData();
                //根据设备名称过滤搜索内容
                if (!TextUtils.isEmpty(deviceName)) {
                    LinkedList<DeviceBean> tempList = new LinkedList<>();
                    for (DeviceBean bean : list) {
                        if (bean.getName().contains(deviceName)) {
                            tempList.add(bean);
                        }
                    }
                    list = tempList;
                }
                for (DeviceBean bean : list) {
                    bean.setDetails(HistoryController.getAnalysisData(bean.getType(), bean.getData()));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            return ResultObject.okList(list);
        }
    }

    @RequestMapping("delFarmDevice")
    @ResponseBody
    @EnableOpLog(Constant.ModifyType.DELETE)
    public Object delFarmDevice(String id) {
        return farmInfoService.delFarmDevice(id);
    }

}
