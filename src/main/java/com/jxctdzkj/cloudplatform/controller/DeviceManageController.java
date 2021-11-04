package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.*;
import com.jxctdzkj.cloudplatform.service.DeviceManageService;
import com.jxctdzkj.cloudplatform.service.UserService;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import com.jxctdzkj.cloudplatform.utils.ReturnObject;
import com.jxctdzkj.support.utils.TextUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Slf4j
@RequestMapping({"deviceManage"})
@Controller
public class DeviceManageController {
    @Autowired
    DeviceManageService deviceManageService;

    @Autowired
    UserService userService;

    @RequestMapping()
    public String index() {
        return "deviceList";
    }

    @ResponseBody
    @RequestMapping(value = "/getDeviceList")
    public ReturnObject getDeviceList(int page, int limit, String deviceCode) {
        return deviceManageService.getAllDeviceList(page, limit, deviceCode);
    }

    //大气网格（齐鹏）
    @ResponseBody
    @RequestMapping(value = "/getNewDeviceList")
    public ReturnObject getNewDeviceList(int page, int limit, String deviceCode) {
        return deviceManageService.getNewAllDeviceList(page, limit, deviceCode);
    }

    /**
     * 原始版本
     */
    @RequestMapping(value = "/deviceDetail")
    public String deviceDetail() {
        return "deviceDetail";
    }

    /**
     * 黄威修改版本
     */
    @RequestMapping(value = "/deviceDetailNew")
    public ModelAndView deviceDetailNew(String userName) {
        return new ModelAndView("deviceDetailNew", "userName", userName);
    }

//    /**
//     * ThingJS版本
//     * @return
//     */
//    @RequestMapping(value = "/deviceDetail")
//    public String newDeviceDetail() {
//        return "newDeviceDetail";
//    }

    /**
     * 设备在线记录
     *
     * @return
     */
    @RequestMapping(value = "/deviceOnlineDetail")
    public String deviceOnlineDetail() {
        return "deviceOnlineDetail";
    }

    @RequestMapping(value = "/getTempList")
    @ResponseBody
    public ReturnObject changeTemp() {
        ReturnObject result = new ReturnObject();
        List<TemplateBean> list = deviceManageService.getTempList();
        result.setData(list);
        result.setSuccess(true);
        return result;
    }


    @RequestMapping(value = "/sensorList")
    public ModelAndView sensorList(String deviceNumber) {
        return new ModelAndView("sensorList", "deviceNumber", deviceNumber);
    }

    @RequestMapping(value = "/getSensorList")
    @ResponseBody
    public ReturnObject getSensorList(String deviceNumber) {
        ReturnObject result = new ReturnObject();
        DeviceBean db = deviceManageService.getDeviceBean(deviceNumber);
        List<SensorDataBean> list = new ArrayList<>();
        if (db != null) {
            list.addAll(transformObject(db));
        }
        result.setData(list);
        result.setCount(list.size());
        result.setCode(0);
        result.setSuccess(true);
        return result;
    }

    private List<SensorDataBean> transformObject(DeviceBean db) {
        List<SensorDataBean> list = new ArrayList<SensorDataBean>();
        String typeStr = db.getType();
        String dataStr = db.getData();
        if (StringUtils.isNotBlank(typeStr) && StringUtils.isNotBlank(dataStr)) {

            String[] typeArr = typeStr.split("/");
            String[] dataArr = dataStr.split("\\|");
            List<String> a = new ArrayList<String>();//存放data中的数值
            List<String> b = new ArrayList<String>();//存放data中的单位
            for (String str : dataArr) {

                String data = str.trim();
                data = data.replace("  ", " ");
                String[] c = data.split(" ");
                a.add(c[0]);
                b.add(c.length > 1 ? c[1] : "");
            }
            for (int i = 0; i < typeArr.length; i++) {
                SensorDataBean bean = new SensorDataBean();
                bean.setName(typeArr[i]);
                bean.setSensorData(a.get(i));
                bean.setUnit(b.get(i));
                list.add(bean);

            }
        }
        return list;
    }

    /**
     * 根据设备号获取设备的在线记录
     *
     * @param deviceNumber
     * @return
     */
    @RequestMapping(value = "/getDeviceOnlineList")
    @ResponseBody
    public ReturnObject getDeviceOnlineList(@RequestParam String deviceNumber) {
        log.info(deviceNumber);
        DeviceBean deviceBean = deviceManageService.getDeviceBean(deviceNumber);
        ReturnObject result = new ReturnObject();
        List<NetDeviceStatisticsBean> list = new ArrayList<>();

        if (deviceBean != null) {
            //随机数据
            long currentTime = deviceBean.getTime().getTime();
            for (int i = 0; i < 2; i++) {
                NetDeviceStatisticsBean bean = new NetDeviceStatisticsBean();
                if (i == 0) {
                    bean.setId(i + 1);
                    bean.setOfflineTime(new Timestamp(deviceBean.getTime().getTime() + new Random().nextInt(120000)));
                    bean.setOnlineTime(deviceBean.getTime());
                    list.add(bean);
                } else {
                    bean.setId(i + 1);
                    System.out.println(new Timestamp(currentTime));
                    bean.setOfflineTime(new Timestamp(currentTime = (currentTime - new Random().nextInt(12000000))));
                    bean.setOnlineTime(new Timestamp(currentTime = (currentTime - new Random().nextInt(12000000))));
                    list.add(bean);
                }
            }
        }

//        List<SensorTemplateBean> list = deviceManageService.getDeviceSensorList(sensorNcode);
//        DeviceBean device = deviceManageService.getDeviceBean(sensorNcode);
//        if (device != null && !TextUtils.isEmpty(device.getData())) {
//            String[] data = device.getData().split("\\|");
//            for (int i = 0; i < data.length; i++) {
//                if (list.size() > i) {
//                    list.get(i).setSensorData(data[i]);
//                }
//            }
//        }
        result.setCode(0);
        result.setData(list);
        System.out.println(result.getData());
        return result;
    }

    @RequestMapping(value = "/getDeviceSensorList")
    @ResponseBody
    public ReturnObject getDeviceSensorList(@RequestParam String sensorNcode) {
        ReturnObject result = new ReturnObject();
        List<SensorTemplateBean> list = deviceManageService.getDeviceSensorList(sensorNcode);
        DeviceBean device = deviceManageService.getDeviceBean(sensorNcode);
        if (device != null && !TextUtils.isEmpty(device.getData())) {
            String[] data = device.getData().split("\\|");
            for (int i = 0; i < data.length; i++) {
                if (list.size() > i) {
                    list.get(i).setSensorData(data[i]);
                }
            }
        }
        result.setSuccess(true);
        result.setCode(0);
        result.setData(list);
        return result;
    }

    public void updateDeviceSensor(String deviceNumber, int tempId) {

        deviceManageService.updateDeviceSensor(deviceNumber, tempId);
    }

    /**
     * 获取当前用下所有设备总数以及设备触发器报警总数
     *
     * @return
     * @User 李英豪
     */
    @RequestMapping(value = "/findDeviceCount")
    @ResponseBody
    public ResultObject findDeviceCount() {
        ResultObject result = deviceManageService.findDeviceCount();
        return result;
    }
}
