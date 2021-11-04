package com.jxctdzkj.cloudplatform.controller;

import com.alibaba.fastjson.JSON;
import com.jxctdzkj.cloudplatform.bean.*;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.exception.ServiceException;
import com.jxctdzkj.cloudplatform.opLog.EnableOpLog;
import com.jxctdzkj.cloudplatform.service.*;
import com.jxctdzkj.cloudplatform.service.impl.SmartAgricultureServiceImpl;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.pager.Pager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * 新农业管理，每个农场/大棚都作为一个分组存在，添加设备时将设备添加到对应分组中
 *
 * @author chanmufeng
 * @time 2019/7/29
 */
@Controller
@Slf4j
@RequestMapping({"newFarmInfo"})
public class NewFarmInfoController {

    @Autowired
    Dao dao;

    @Autowired
    FarmInfoService newFarmInfoService;

    @Autowired
    FarmCropsService farmCropsService;

    @Autowired
    RaiseDustService raiseDustService;

    @Autowired
    private SmartAgricultureServiceImpl smartAgricultureService;

    @Autowired
    private DeviceManageService deviceManageService;

    @Autowired
    private TimeTaskManageService timeTaskManageService;

    // 页面跳转
    @RequestMapping(value = "toList")
    public ModelAndView toFarmInfoList(@RequestParam int type) {
        switch (type) {
            case 2:
                //王致远项目-场景列表
                return new ModelAndView("newFarmInfo/scenes/sceneList");
        }
        return new ModelAndView("newFarmInfo/scenes/list");
    }


    // 新增-跳转
    @RequestMapping(value = "toAdd")
    public ModelAndView toAdd(@RequestParam(value = "type", required = false, defaultValue = "1") String type) {
        return new ModelAndView("newFarmInfo/addOrUpdate", "bean", new FarmInfoBean()).addObject("type", type);
    }


    // 修改-跳转
    @RequestMapping(value = "toUpdate")
    public ModelAndView toUpdate(String id, @RequestParam(value = "type", required = false, defaultValue = "1") String type) {
        FarmInfoBean bean = dao.fetch(FarmInfoBean.class, Cnd.where("id", "=", id));
        return new ModelAndView("newFarmInfo/addOrUpdate", "bean", bean).addObject("type", type);
    }

    // 绑定设备列表-跳转
    @RequestMapping(value = "toBoundDeviceList")
    public ModelAndView toBoundDeviceList(String id) {
        FarmInfoBean bean = dao.fetch(FarmInfoBean.class, Cnd.where("id", "=", id));
        return new ModelAndView("newFarmInfo/boundFarmDeviceList", "bean", bean);
    }

    //跳转修改农场状态的页面
    @RequestMapping("toFarmStatus")
    public ModelAndView toFarmStatus(String id) {
        FarmInfoBean bean = dao.fetch(FarmInfoBean.class, Cnd.where("id", "=", id));
        return new ModelAndView("newFarmInfo/modifyFarmStatus", "bean", bean);
    }

    // 绑定摄像头列表-跳转
    @RequestMapping(value = "toBoundCameraList")
    public ModelAndView toBoundCameraList(String appId) {
        HashMap data = new HashMap();
        data.put("appId", appId);
        data.put("appType", Constant.CameraAppType.DAPENG);
        return new ModelAndView("cameraApplication/boundCameraList", "data", data);
    }


    /**
     * 打开定时定量对话框
     *
     * @param deviceNumber   继电器设备号
     * @param command        发送指令
     * @param sensorName     继电器节点编号
     * @param dataSensorCode 采集设备节点编号
     * @return
     */
    @RequestMapping(value = "timingClose")
    public ModelAndView timingClose(@RequestParam String deviceNumber, @RequestParam String command, @RequestParam String sensorName, @RequestParam String dataSensorCode) {
        HashMap<String, String> data = new HashMap<>();
        data.put("deviceNumber", deviceNumber);
        data.put("command", command);
        data.put("sensorName", sensorName);
        data.put("dataSensorCode", dataSensorCode);
        return new ModelAndView("newFarmInfo/timingClose", "data", data);
    }


    // 绑定设备-跳转
    @RequestMapping(value = "toBoundFarmDevice")
    public ModelAndView toBoundFarmDevice(String farmId) {
        FarmInfoBean bean = dao.fetch(FarmInfoBean.class, Cnd.where("id", "=", farmId));
        return new ModelAndView("newFarmInfo/boundFarmDevice", "bean", bean);
    }

    //绑定农产品列表
    @RequestMapping("toBoundCropList")
    public ModelAndView toBoundCropList(String id) {
        FarmInfoBean bean = dao.fetch(FarmInfoBean.class, Cnd.where("id", "=", id));
        return new ModelAndView("newFarmInfo/boundCropList", "bean", bean);
    }

    //绑定农产品列表(新增农产品时新增地块绘制功能)
    @RequestMapping("findToBoundCropList")
    public ModelAndView findToBoundCropList(String id) {
        FarmInfoBean bean = dao.fetch(FarmInfoBean.class, Cnd.where("id", "=", id));
        return new ModelAndView("newFarmInfo/findFarmInfo/findToBoundCropList", "bean", bean);
    }

    // 绑定农产品-跳转
    @RequestMapping(value = "toBoundCrop")
    public ModelAndView toBoundCrop(String farmId) {
        FarmInfoBean bean = dao.fetch(FarmInfoBean.class, Cnd.where("id", "=", farmId));
        return new ModelAndView("newFarmInfo/boundCrop", "bean", bean);
    }

    // 新增农产品-跳转
    @RequestMapping(value = "toAddCrop")
    public ModelAndView toAddCrop(String farmId) {
        HashMap<String, Object> data = new HashMap<>();
        data.put("farmId", farmId);
        data.put("bean", new FarmCropsBean());
        return new ModelAndView("newFarmInfo/boundCrop", "data", data);
    }

    // 修改农产品-跳转
    @RequestMapping(value = "toUpdateCrop")
    public ModelAndView toUpdateCrop(String id) {
        FarmCropsBean bean = dao.fetch(FarmCropsBean.class, Cnd.where("id", "=", id));
        HashMap<String, Object> data = new HashMap<>();
        data.put("farmId", bean.getFarmInfoId());
        data.put("bean", bean);
        return new ModelAndView("newFarmInfo/boundCrop", "data", data);
    }

    // 新增农产品-跳转（新增农产品种植地块绘制）
    @RequestMapping(value = "findToAddCrop")
    public ModelAndView findToAddCrop(String farmId) {
        HashMap<String, Object> data = new HashMap<>();
        data.put("farmId", farmId);
        data.put("bean", new FarmCropsBean());
        return new ModelAndView("newFarmInfo/findFarmInfo/findToAddOrUpdateCrop", "data", data);
    }

    // 修改农产品-跳转（修改农产品种植地块绘制）
    @RequestMapping(value = "findToUpdateCrop")
    public ModelAndView findToUpdateCrop(String id) {
        FarmCropsBean bean = dao.fetch(FarmCropsBean.class, Cnd.where("id", "=", id));
        HashMap<String, Object> data = new HashMap<>();
        data.put("farmId", bean.getFarmInfoId());
        data.put("bean", bean);
        return new ModelAndView("newFarmInfo/findFarmInfo/findToAddOrUpdateCrop", "data", data);
    }

    // 新增或修改农产品
    @EnableOpLog
    @RequestMapping(value = "/boundCrop")
    @ResponseBody
    public ResultObject save(FarmCropsBean bean, String plantingDateStr, String harvestDateStr) {
        try {
            return farmCropsService.save(bean, plantingDateStr, harvestDateStr);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResultObject.apiError("fail");
        }
    }

    //新建或修改农场信息
    @EnableOpLog(Constant.ModifyType.SAVE)
    @RequestMapping(value = "/save")
    @ResponseBody
    public ResultObject saveOrUpdate(FarmInfoBean bean) {
        try {
            return newFarmInfoService.saveOrUpdate(bean);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResultObject.apiError(e.getMessage());
        }
    }

    // 绑定农场设备
    @EnableOpLog(Constant.ModifyType.SAVE)
    @RequestMapping(value = "/saveFarmDevice")
    @ResponseBody
    public ResultObject saveFarmDevice(String farmId, String deviceNumber, String deviceName, double longitude, double latitude) {
        try {
            return newFarmInfoService.boundDevice(farmId, deviceNumber, deviceName, longitude, latitude);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResultObject.apiError("fail");
        }
    }

    // 获取农场列表
    @RequestMapping(value = "/getList")
    @ResponseBody
    public ResultObject getList(int page, int size, @RequestParam(value = "farmName", required = false, defaultValue = "") String farmName) {
        try {
            //根据用户角色判断是否是多级用户系统
            SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
            int roleId = userBean.getRole();
            if (roleId == 16 || roleId == 17) {
                return smartAgricultureService.getSmartAgricultureList(page, size, farmName);
            } else {
                return newFarmInfoService.getFarmInfoList(page, size, farmName);
            }
        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage());
            return ResultObject.apiError("fail");
        }
    }

    // 获取农场设备列表
    @RequestMapping(value = "/getFarmDeviceList")
    @ResponseBody
    public ResultObject getFarmDeviceList(@RequestParam(value = "page", required = false, defaultValue = "1") int page,
                                          @RequestParam(value = "size", required = false, defaultValue = "100") int size
            , String deviceNumber, String farmId) {
        try {
            FarmInfoBean bean = dao.fetch(FarmInfoBean.class, Cnd.where("id", "=", farmId));
            if (bean == null) {
                return ResultObject.apiError("农场不存在");
            }

            //查询当前农场分组下的所有子分组
            List<UserGroupBean> userGroupBeans = dao.query(UserGroupBean.class, Cnd.where("parent_id", "=", bean.getGroupId()).asc("id"));
            if (userGroupBeans.size() < 2) {
                return ResultObject.apiError("农场设备分组缺失");
            }

            List<DeviceBean> list = newFarmInfoService.getFarmDeviceListNew(page, size, deviceNumber, userGroupBeans);
            int count = newFarmInfoService.getFarmDeviceListCountNew(deviceNumber, userGroupBeans);
            return ResultObject.okList(list, page, size, count);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResultObject.apiError("fail");
        }
    }

    // 获取农场农产品列表
    @RequestMapping(value = "/getCropList")
    @ResponseBody
    public ResultObject getCropList(int page, int size, String cropName, String farmId) {
        try {
            return farmCropsService.getFarmCropsList(page, size, cropName, farmId, null);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResultObject.apiError("fail");
        }
    }

    // 删除农场信息
    @EnableOpLog(Constant.ModifyType.DELETE)
    @RequestMapping(value = "/del")
    @ResponseBody
    public ResultObject del(String id) {
        try {
            newFarmInfoService.deleteFarm(id);
        } catch (Exception e) {
            log.error(e.toString());
            if (e instanceof ServiceException) {
                return ResultObject.apiError(e.getMessage());
            }
            return ResultObject.apiError("fail");
        }
        return ResultObject.ok("success");
    }

    //解绑农场下设备
    @EnableOpLog(Constant.ModifyType.DELETE)
    @RequestMapping("delFarmDevice")
    @ResponseBody
    public Object delFarmDevice(String id) {
        return newFarmInfoService.delFarmDevice(id);
    }


    //前端页面通过点击对应位置添加农场
    @EnableOpLog(Constant.ModifyType.SAVE)
    @RequestMapping("addFarmByFront")
    @ResponseBody
    public Object addFarmByFront(FarmInfoBean bean) {
        return newFarmInfoService.addFarmByFront(bean);
    }

    /**
     * 根据大棚id获取大棚下待展示生长周期的作物
     *
     * @param id
     * @return
     */
    @RequestMapping("getCrop")
    @ResponseBody
    public Object getCrop(String id) {
        return newFarmInfoService.getEarliestMatureCrop(id);
    }

    //获取当前用户所有有异常状态的农场
    @RequestMapping("getFarmsException")
    @ResponseBody
    public Object getFarmsException() {
        return newFarmInfoService.getFarmsException();
    }

    // 获取大棚之外的设备列表
    @RequestMapping(value = "/getDeviceListOutOfGreenhouse")
    @ResponseBody
    public ResultObject getDeviceListOutOfGreenhouse(int page, int size) {
        try {
            List<DeviceBean> list = newFarmInfoService.getDevicesOutOfGreenhouse(page, size);
            int count = newFarmInfoService.getDevicesOutOfGreenhouseCount();
            return ResultObject.okList(list, page, size, count);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResultObject.apiError("fail");
        }
    }

    // 获取大棚之外的摄像头列表
    @RequestMapping(value = "/getCameraListOutOfGreenhouse")
    @ResponseBody
    public ResultObject getCameraListOutOfGreenhouse(int page, int size) {
        try {
            List<CameraBean> list = newFarmInfoService.getCamerasOutOfGreenhouse(page, size);
            int count = newFarmInfoService.getCameraOutOfGreenhouseCount();
            return ResultObject.okList(list, page, size, count);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResultObject.apiError("fail");
        }
    }

    @EnableOpLog
    @RequestMapping("/modifyStatus")
    @ResponseBody
    public ResultObject modifyStatus(@RequestParam String farmId, String status, String irrigationTime, String duration) {
        return newFarmInfoService.setStatus(farmId, status, irrigationTime, duration);
    }


    //

    /**
     * 获取农场列表,用于用户触控大屏设备
     *
     * @return
     */
    @RequestMapping(value = "/getListForTouchScreen")
    @ResponseBody
    public ResultObject getList() {
        List<FarmInfoBean> farmInfoBeans;
        try {
            String userName = ControllerHelper.getLoginUserName();
            farmInfoBeans = dao.query(FarmInfoBean.class, Cnd.where("create_user", "=", userName).and("delete_flag", "=", "0").orderBy("farm_name", "asc"));
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResultObject.apiError("fail");
        }
        return ResultObject.okList(farmInfoBeans);
    }



    /**
     * 杨凌控制机柜大屏
     *
     * @return
     */
    @RequestMapping(value = "toYanglingControlScreen")
    public ModelAndView toYanglingControlScreen(String id, String farmName) {
        HashMap<String, String> data = new HashMap<>();
        data.put("id", id);
        data.put("farmName", farmName);
        return new ModelAndView("monitor/yanglingControlScreen", "data", data);
    }

//**安徽乡镇报警项目********************************************
    //根据乡镇的id查询所有村的信息

    /**
     * @return com.jxctdzkj.cloudplatform.utils.ResultObject
     * @Author huangwei
     * @Description //TODO 根据乡镇查询出所有乡村
     * @Date 2019/11/25
     * @Param [page, size, id]
     **/
    @RequestMapping(value = "getHamlet")
    @ResponseBody
    public ResultObject getAllHamletByTownId(int page, int size, String id) {
        List<FarmInfoBean> lot_id = dao.query(FarmInfoBean.class, Cnd.where("lot_id", "=", id).and("delete_flag","=",0), new Pager(page, size));
        int count = dao.func(FarmInfoBean.class, "count", "lot_id", Cnd.where("lot_id", "=", id));
        return ResultObject.okList(lot_id, page, size, count);
    }



    //查看乡村信息 （农场信息）

    /**
     * @return com.jxctdzkj.cloudplatform.utils.ResultObject
     * @Author huangwei
     * @Description //TODO 根据村id查询村信息
     * @Date 2019/11/25
     * @Param [id]
     **/
    @RequestMapping(value = "getHamletById")
    @ResponseBody
    public ResultObject getAllHamletById(String id) {
        FarmInfoBean farmInfoBean = dao.fetch(FarmInfoBean.class, Cnd.where("id", "=", id));
        if(farmInfoBean!=null){
            String number = farmInfoBean.getCameraNumber();
            if(StringUtils.isBlank(number)){
                farmInfoBean.setCameraNumber("");
            }
        }
        return ResultObject.ok(farmInfoBean);
    }

    //根据报警设备编号查询报警的农场以及设备位置
    @RequestMapping(value = "getAlarmHamlet")
    @ResponseBody
    public ResultObject getAlarmHamlet(String deviceNumber) {
        String loginUserName = ControllerHelper.getLoginUserName();
        //根据登录名称以及设备号 查询相应的村庄
        ResultObject areaByDevice = raiseDustService.getAreaByDevice(deviceNumber);
        FarmInfoBean farmInfoBean = (FarmInfoBean) areaByDevice.get("data");
        //根据设备号查询设备位置
        UserDeviceBean userDeviceBean = dao.fetch(UserDeviceBean.class, Cnd.where("user_name", "=", loginUserName).and("is_del", "=", "0").and("Ncode", "=", deviceNumber));
        List<Object> objectList = new ArrayList<>();
        objectList.add(farmInfoBean);
        objectList.add(userDeviceBean);
        return ResultObject.okList(objectList);
    }

   // 查询一键报警历史记录
    @RequestMapping(value = "listAlarmHistory")
    @ResponseBody
    public ResultObject listAlarmHistory(@RequestParam int page, @RequestParam int size,@RequestParam(required = false,defaultValue = "") String fromDate ,@RequestParam(required = false,defaultValue = "")String toDate) {
        String userName = ControllerHelper.getLoginUserName();
        Cnd and  =(Cnd) Cnd.where("alarm_time", ">", fromDate).and("alarm_time", "<", toDate).and("user_name", "=", userName).orderBy("alarm_time", "desc");

        if(fromDate.equals("") || toDate.equals("")){
            and = (Cnd) Cnd.where("user_name","=",userName).orderBy("alarm_time","desc");
        }
        List<AlarmHistoryBean> alarmHistoryBeans = dao.query(AlarmHistoryBean.class, and, new Pager(page, size));
        int count = dao.count(AlarmHistoryBean.class,and);
        return ResultObject.okList(alarmHistoryBeans,page,size,count);
    }



   // 查询报警记录折线图（每月每天）


    @RequestMapping(value = "listAlarmHistoryByMonth")
    @ResponseBody
    public ResultObject listAlarmHistoryByMonth(@RequestParam(required = false,defaultValue = "") String fromDate ,@RequestParam(required = false,defaultValue = "")String toDate) throws ParseException {
        int dayCount=0;
        ArrayList<Integer> list = new ArrayList<>();
        String userName = ControllerHelper.getLoginUserName();
        Cnd and  =(Cnd) Cnd.where("alarm_time", ">", fromDate+" 00:00:00").and("alarm_time", "<", toDate+" 23:59:59").and("user_name", "=", userName).orderBy("alarm_time", "desc");
        //查出的一个月的总次数
        int count = dao.count(AlarmHistoryBean.class,and);
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date date = dateFormat.parse(toDate);
        int day = date.getDate();
        //定义一个每天计算的和
        while (true){
            date.setDate(day);
            //每天的报警次数
            int alarm = dao.count(AlarmHistoryBean.class, Cnd.where("alarm_time", "<", dateFormat.format(date)+" 23:59:59").and("alarm_time",">",dateFormat.format(date)+" 00:00:00").and("user_name", "=", userName));
            dayCount += alarm;
            list.add(alarm);
            if(dayCount == count){
                break;
            }
                day--;
        }
        while(day!=1){
            list.add(0);
            day--;
        }
        Collections.reverse(list);
        return  ResultObject.ok().data(list);


    }




}
