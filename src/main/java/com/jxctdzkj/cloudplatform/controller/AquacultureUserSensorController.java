package com.jxctdzkj.cloudplatform.controller;

import com.alibaba.fastjson.JSONObject;
import com.jxctdzkj.cloudplatform.bean.*;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.opLog.EnableOpLog;
import com.jxctdzkj.cloudplatform.service.AquacultureUserSensorService;
import com.jxctdzkj.cloudplatform.service.ConditionService;
import com.jxctdzkj.cloudplatform.service.ProductionManageService;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import com.jxctdzkj.cloudplatform.utils.SqlHelper;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.dao.pager.Pager;
import org.nutz.dao.sql.Sql;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.sql.Timestamp;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;

@Controller
@Slf4j
@RequestMapping({"aquacultureUserSensor"})
public class AquacultureUserSensorController extends BaseController {


    @Autowired
    Dao dao;

    @Autowired
    ProductionManageService productionManageService;

    @Autowired
    ConditionService conditionService;

    @Autowired
    AquacultureUserSensorService aquacultureUserSensorService;

    /**
     * 添加水产设备跳转
     *
     * @return
     */
    @RequestMapping(value = "toAddAquacultureDevice")
    public ModelAndView toAddAquacultureDevice() {
        return new ModelAndView("aquaculture/internetOfThingsManage/addAquacultureDevice", "data", new UserDeviceBean());
    }

    /**
     * 修改设备信息
     *
     * @return
     */
    @RequestMapping(value = "updatePondDetail")
    public ModelAndView updatePondDetail(String id) {
        UserDeviceBean bean = dao.fetch(UserDeviceBean.class, Cnd.where("id", "=", id));
        HashMap<String, Object> map = new HashMap<>();
        map.put("id", bean.getId());
        map.put("deviceName", bean.getDeviceName());
        map.put("deviceNumber", bean.getDeviceNumber());
        return new ModelAndView("aquaculture/internetOfThingsManage/addAquacultureDevice", "data", map);
    }

    /**
     * 绑定设备
     *
     * @param id
     * @param deviceNumber
     * @param name
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/boundPondDevice")
    @EnableOpLog(Constant.ModifyType.SAVE)
    public ResultObject boundPondDevice(@RequestParam(value = "id") String id,
                                        @RequestParam(value = "deviceNumber") String deviceNumber,
                                        @RequestParam(value = "name") String name) {

        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        DeviceBean deviceBean = dao.fetch(DeviceBean.class, deviceNumber);
        if (deviceBean == null) {
            return ResultObject.apiError("err24");
        }
        if (deviceBean.getDeviceType() != Constant.DeviceType.RELAY) {
            return ResultObject.apiError("只能绑定继电器设备");
        }

        List<UserDeviceBean> list = dao.query(UserDeviceBean.class,
                Cnd.where("nCode", "=", deviceNumber).and("is_del", "=", "0")
                        .and("user_name", "=", userName).and("group_id", "=", "1"));
        if (list.size() > 0) {
            UserDeviceBean bean = list.get(0);
            if (id.equals(String.valueOf(bean.getId()))) {
                bean.setDeviceName(name);
                dao.update(bean);
                return ResultObject.ok("success");
            }
            return ResultObject.apiError("fail");
        } else {
            UserDeviceBean udBean = new UserDeviceBean();
            udBean.setDeviceNumber(deviceNumber);
            udBean.setUserName(userName);
            udBean.setCreateTime(new Timestamp(new Date().getTime()));
            udBean.setDeviceName(name);
            udBean.setLongitude(0);
            udBean.setLatitude(0);
            udBean.setGroupId(1);
            if (dao.insert(udBean) != null) {
                List<SensorTemplateBean> sensorList = conditionService.getAquacultureSensorList(deviceNumber);
                sensorList.forEach(l -> {
                    AquacultureUserSensorBean sensorBean = new AquacultureUserSensorBean();
                    sensorBean.setLastUpdateTime(new Date());
                    sensorBean.setLastUpdateUser(userName);
                    sensorBean.setnCode(deviceNumber);
                    sensorBean.setSensorName(l.getSensorName());
                    sensorBean.setSensorCode(l.getSensorCode());
                    sensorBean.setUserName(userName);
                    dao.insert(sensorBean);
                });
                return ResultObject.ok("success");
            } else {
                return ResultObject.apiError("error10");
            }
        }
    }

    /**
     * 获取该用户已绑定的设备
     *
     * @param page
     * @param size
     * @param deviceCode
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/getPondDeviceList")
    public Object getPondDeviceList(int page, int size, String deviceCode, String pondId) {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        List<DeviceBean> list = productionManageService.getUserPondDeviceList(page, size, userName, deviceCode, pondId, "1","");
        int count = productionManageService.getUserPondDeviceCount(userName, deviceCode, pondId, "1");
        return ResultObject.okList(list, page, size, count);
    }

    /**
     * 删除设备
     *
     * @param deviceNumber
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/delPondDevice")
    @EnableOpLog(Constant.ModifyType.DELETE)
    public ResultObject delPondDevice(@RequestParam(value = "deviceNumber") String deviceNumber) {

        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        UserDeviceBean deviceBean = dao.fetch(UserDeviceBean.class,
                Cnd.where("nCode", "=", deviceNumber).and("user_name", "=", userName).and("group_id", "=", "1"));
        if (deviceBean == null) {
            return ResultObject.apiError("err24");
        } else {
            if (dao.delete(deviceBean) > 0) {
                dao.clear(AquacultureUserSensorBean.class, Cnd.where("n_code", "=", deviceNumber).and("user_name", "=", userName));
                return ResultObject.ok("success");
            } else {
                return ResultObject.apiError("fail");
            }
        }
    }

    /**
     * 在线控制跳转
     *
     * @param id
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/toOnLineCtrl")
    public ModelAndView toOnLineCtrl(String id) {
        UserDeviceBean deviceBean = dao.fetch(UserDeviceBean.class, Cnd.where("id", "=", id));
        return new ModelAndView("aquaculture/internetOfThingsManage/onLineCtrl", "data", deviceBean);
    }

    /**
     * 在线控制历史记录跳转
     *
     * @param deviceNumber
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/toCtrlHistory")
    public ModelAndView toCtrlHistory(String deviceNumber) {
        return new ModelAndView("aquaculture/internetOfThingsManage/ctrlHistory", "deviceNumber", deviceNumber);
    }

    /**
     * 获取继电器列表
     *
     * @param ncode
     * @return
     */
    @RequestMapping(value = "/getSensorList")
    @ResponseBody
    public Object getSensorList(@RequestParam(value = "page", required = false, defaultValue = "1") int page,
                                @RequestParam(value = "size", required = false, defaultValue = "100") int size, String ncode) {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        List<SensorTemplateBean> list = conditionService.getAquacultureSensorList(ncode);
       if(list!=null) {
           list.forEach(l -> {
               AquacultureUserSensorBean bean = dao.fetch(AquacultureUserSensorBean.class,
                       Cnd.where("sensor_code", "=", l.getSensorCode()).and("user_name", "=", userName));
               if (bean != null) {
                   l.setSensorName(bean.getSensorName());
                   l.setId(bean.getId());
               }
           });
       }
        int count = conditionService.getAquacultureSensorCount(ncode);
        return ResultObject.okList(list, page, size, count);
    }

    /**
     * 获取继电器列表-大屏用
     *
     * @param ncode
     * @return
     */
    @RequestMapping(value = "/getSensorListForScreen")
    @ResponseBody
    public ResultObject getSensorListForScreen(String ncode) {
        List<SensorTemplateBean> list = conditionService.getAquacultureSensorList(ncode);
        //获取继电器的开关状态
        DeviceBean deviceBean = dao.fetch(DeviceBean.class, Cnd.where("Ncode", "=", ncode));
        if (StringUtils.isNotBlank(deviceBean.getData())) {
            String[] switchStates = deviceBean.getData().split("\\|");
            int state = 0;
            for (SensorTemplateBean bean : list) {
                for (int i = 0; i < switchStates.length; i++) {
                    if (bean.getSensorCode().replace(bean.getSensorNcode(), "").equals(i + 1 + "")) {
                        state = switchStates[i].contains("开") ? 1 : 0;
                        bean.setState(state);
                    }
                }
            }
        }

        if (list.size() > 0) {
            return ResultObject.ok(list);
        } else {
            return ResultObject.apiError("fail");
        }
    }

    /**
     * 发送指令
     * 渔业平台专用，添加单独的控制记录，其他不要用
     * @link  /device/sendCommand
     *
     * @param deviceNumber
     * @param command
     * @return
     */
    @RequestMapping(value = "/sendCommand")
    @ResponseBody
    @EnableOpLog(Constant.ModifyType.SAVE)
    public Object sendCommand(String deviceNumber, String command, String sensorCode) {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        DeviceBean bean = dao.fetch(DeviceBean.class, deviceNumber);
        if (bean == null) {
            return ResultObject.apiError("err31");
        }
        //发送网络继电器控制
        if (1 == bean.getOnLineState()) {//设备在线
            String resultStr = (String) SqlHelper.sendDeviceCommandByType(deviceNumber, command, userName, Constant.DeviceType.RELAY);
            JSONObject jObj = JSONObject.parseObject(resultStr);
            String state = jObj.get("state").toString();
            AquacultureCommandDeviceBean aBean = new AquacultureCommandDeviceBean();
            aBean.setUserName(userName);
            aBean.setDeviceNumber(deviceNumber);
            aBean.setDeviceType(bean.getDeviceType());
            aBean.setCommand(command);
            aBean.setVal(command.substring(3, 4));
            aBean.setCommandTime(new Date());
            aBean.setSensorCode(sensorCode);
            if (state.equals("success")) {
                aBean.setIsSuccess(1);
                if (Constant.Privatisation.UPDATE_LOCAL_RELAY_STATE) {
                    SensorTemplateBean sensorTemplateBean = dao.fetch(SensorTemplateBean.class, Cnd.where("sensor_code", "=", sensorCode));
                    sensorTemplateBean.setSensorData(command.substring(3, 4));
                    dao.update(sensorTemplateBean);
                }
            } else {
                aBean.setIsSuccess(0);
            }
            dao.insert(aBean);
            return jObj;
        } else {
            return ResultObject.apiError("设备不在线");//设备掉线
        }
    }

    /**
     * 获取控制记录
     *
     * @param deviceNumber
     * @return
     */
    @RequestMapping(value = "/getCommandList")
    @ResponseBody
    public Object getCommandList(@RequestParam(value = "page", required = false, defaultValue = "1") int page,
                                 @RequestParam(value = "size", required = false, defaultValue = "100") int size, String deviceNumber) {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        List<AquacultureCommandDeviceBean> list = aquacultureUserSensorService.getDeviceCommandList(deviceNumber, userName, new Pager(page, size));
        int count = aquacultureUserSensorService.getDeviceCommandCount(deviceNumber, userName);
        return ResultObject.okList(list, page, size, count);
    }

    /**
     * 修改传感器名称 跳转
     *
     * @param sensorCode
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/toUpdateSensorDetail")
    public ModelAndView toUpdateSensorDetail(String sensorCode) {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        AquacultureUserSensorBean bean = dao.fetch(AquacultureUserSensorBean.class, Cnd.where("sensor_code", "=", sensorCode).and("user_name", "=", userName));
        return new ModelAndView("aquaculture/internetOfThingsManage/updateSensorDetail", "data", bean);
    }

    //获取当前用户的所有继电器设备
    @RequestMapping("getAllRelayDevice")
    @ResponseBody
    public ResultObject getAllRelayDevice(@RequestParam(value = "page", required = false, defaultValue = "1") int page,
                                          @RequestParam(value = "size", required = false, defaultValue = "100") int size) {
        String userName = ControllerHelper.getLoginUserName();
        Sql sql = Sqls.create(" select ud.* from sys_user_to_devcie ud ,network n where ud.user_name =@userName and ud.Ncode=n.Ncode and n.device_type=@deviceType ");
        sql.params().set("userName", userName);
        sql.params().set("deviceType", Constant.DeviceType.RELAY);
        sql.setCallback((conn, rs, sql1) -> {
            List<UserDeviceBean> list = new LinkedList<UserDeviceBean>();
            while (rs.next()) {
                UserDeviceBean bean = new UserDeviceBean();
                bean.setDeviceNumber(rs.getString("Ncode"));
                bean.setId(rs.getLong("id"));
                bean.setUserName(rs.getString("user_name"));
                bean.setDevicePassword(rs.getString("Npassword"));
                bean.setDeviceName(rs.getString("device_name"));
                bean.setGroupId(rs.getInt("group_id"));
                bean.setCreateTime(rs.getTimestamp("create_time"));
                bean.setIsDel(rs.getInt("is_del"));
                bean.setPondId(rs.getString("pond_id"));
                bean.setLatitude(rs.getDouble("latitude"));
                bean.setLongitude(rs.getDouble("longitude"));
                list.add(bean);
            }
            return list;
        });
        sql.setPager(new Pager(page, size));
        dao.execute(sql);

        return ResultObject.okList(sql.getList(UserDeviceBean.class));
    }

    /**
     * 修改传感器名称
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "/updateSensorDetail")
    @ResponseBody
    @EnableOpLog
    public ResultObject updateSensorDetail(String id, String sensorName) {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        AquacultureUserSensorBean bean = dao.fetch(AquacultureUserSensorBean.class, Cnd.where("id", "=", id));
        if (bean != null) {
            bean.setSensorName(sensorName);
            bean.setLastUpdateTime(new Date());
            bean.setLastUpdateUser(userName);
            if (dao.update(bean) > 0) {
                return ResultObject.ok("success");
            } else {
                return ResultObject.apiError("fail");
            }
        } else {
            return ResultObject.apiError("fail");
        }
    }

    /**
     * 删除控制记录
     *
     * @param id
     * @return
     */
    @EnableOpLog(Constant.ModifyType.DELETE)
    @RequestMapping(value = "/delCtrlHistory")
    @ResponseBody
    public ResultObject delCtrlHistory(String id) {
        AquacultureCommandDeviceBean bean = dao.fetch(AquacultureCommandDeviceBean.class, Cnd.where("id", "=", id));
        if (bean != null) {
            bean.setIsDel(1);
            if (dao.update(bean) > 0) {
                return ResultObject.ok("success");
            } else {
                return ResultObject.apiError("fail");
            }
        } else {
            return ResultObject.apiError("fail");
        }
    }

}
