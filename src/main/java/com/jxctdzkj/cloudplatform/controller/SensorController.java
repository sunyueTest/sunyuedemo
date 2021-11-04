package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.DeviceBean;
import com.jxctdzkj.cloudplatform.bean.SensorTemplateBean;
import com.jxctdzkj.cloudplatform.bean.SensorTypeBean;
import com.jxctdzkj.cloudplatform.opLog.EnableOpLog;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import com.jxctdzkj.cloudplatform.utils.ReturnObject;
import com.jxctdzkj.cloudplatform.utils.SqlHelper;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.dao.pager.Pager;
import org.nutz.dao.sql.Sql;
import org.nutz.trans.Atom;
import org.nutz.trans.Trans;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.sql.Connection;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 * <pre>
 *     @author  : FlySand
 *     @e-mail  : 1156183505@qq.com
 *     @time    : 2018/8/28.
 *     @desc    : 数据模版 (传感器类型匹配)
 * </pre>
 */
@Slf4j
@RestController
@RequestMapping({"sensor"})
public class SensorController {

    @Autowired
    Dao dao;

    /**
     * 获取传感器类型列表、
     *
     * @param page 页码
     * @param size 大小
     */
    @RequestMapping(value = "selList", method = RequestMethod.GET)
    public Object selSensorList(
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "100") int size) {
        Pager pager = dao.createPager(page, size);
        List<SensorTypeBean> loginUser = dao.query(SensorTypeBean.class, null, pager);
        return ResultObject.okList(loginUser, page, size);
    }

    /**
     * 获取当前设备的传感器类型列表、
     *
     * @param deviceNumber 设备号
     * @param page         页码
     * @param size         大小
     */
    @RequestMapping(value = "selTypeList", method = RequestMethod.GET)
    @ResponseBody
    public Object selDeviceTemplates(
            @RequestParam(value = "deviceNumber") String deviceNumber,
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "100") int size) {
        DeviceBean deviceBean = dao.fetch(DeviceBean.class, Cnd.where("Ncode", "=", deviceNumber));
        Object result = ControllerHelper.getInstance(dao).checkDevice(deviceBean);
        if (result != null) {
            return result;
        }
        Pager pager = dao.createPager(page, size);
        List<SensorTemplateBean> sensorTemplateBeans = dao.query(SensorTemplateBean.class, Cnd.where("sensor_ncode", "=", deviceNumber), pager);
        return ResultObject.okList(sensorTemplateBeans, page, size);
    }

    /**
     * 添加传感器数据点（模板）
     *
     * @param deviceNumber 设备号
     * @param templateIds  数据点模板id
     */
    @RequestMapping(value = "addTemplate", method = RequestMethod.GET)
    public Object addSenorTemplate(
            @RequestParam(value = "deviceNumber") String deviceNumber,
            @RequestParam(value = "templateIds") List<String> templateIds) {
        DeviceBean deviceBean = dao.fetch(DeviceBean.class, deviceNumber);
        Object result = ControllerHelper.getInstance(dao).checkDevice(deviceBean);
        if (result != null) {
            return result;
        }
        if (templateIds.size() == 0) {
            return ResultObject.apiError("err57");//请添加模板
        }
        List<SensorTypeBean> typeBeans = dao.query(SensorTypeBean.class, SqlHelper.getWhereOrCnd("id", templateIds));
        log.info("typeBeans  =" + typeBeans.size());
        if (typeBeans.size() == 0) {
            return ResultObject.apiError("err58");//模板类型不存在
        }
        if (typeBeans.size() != templateIds.size()) {
            return ResultObject.apiError("err59");//模板类型不匹配
        }
        List<SensorTemplateBean> oldSensorTemplateBeans = dao.query(SensorTemplateBean.class, Cnd.where("sensor_ncode", "=", deviceNumber));
        log.info("oldSensorTemplateBeans =" + oldSensorTemplateBeans.size());
        int lastTemplateIndex = 0;
        if (oldSensorTemplateBeans.size() > 0) {
            SensorTemplateBean bean = oldSensorTemplateBeans.get(oldSensorTemplateBeans.size() - 1);
            lastTemplateIndex = Integer.parseInt(bean.getSensorCode().replace(deviceNumber, "")) + 1;
        }
        log.info("lastTemplateIndex= " + lastTemplateIndex);
        //生成模板列表
        List<SensorTemplateBean> templateBeans = new ArrayList<>();
        for (int i = 0; i < typeBeans.size(); i++) {
            SensorTypeBean typeBean = typeBeans.get(i);
            SensorTemplateBean templateBean = new SensorTemplateBean();
            templateBean.setSensorType(typeBean.getId());
            templateBean.setSensorNcode(deviceNumber);
            templateBean.setSensorCode(deviceNumber + (lastTemplateIndex + i));
            templateBean.setSensorName(typeBean.getName());
            templateBean.setRecordTime(new Timestamp(System.currentTimeMillis()));
            templateBean.setSensorId(templateBean.getSensorId());
            templateBeans.add(templateBean);
        }
        try {
            Trans.exec(Connection.TRANSACTION_READ_UNCOMMITTED, (Atom) () -> {
                List<SensorTemplateBean> insertBeans = new ArrayList<>();
                String sensorType = "";
                for (int i = 0; i < oldSensorTemplateBeans.size(); i++) {
                    sensorType += oldSensorTemplateBeans.get(i).getSensorName() + " / ";
                }
                for (int i = 0; i < templateBeans.size(); i++) {
                    log.info("insert " + i);
                    SensorTemplateBean insertBean = dao.insert(templateBeans.get(i));
                    sensorType += insertBean.getSensorName();
                    if (i < templateBeans.size() - 1) {
                        sensorType += " / ";
                    }
                    insertBeans.add(insertBean);
                }
                if (insertBeans.size() == templateBeans.size()) {
                    log.info("templateBeans添加成功");
                } else {
                    log.info("添加失败  insertBeans.size() =" + insertBeans.size());
                    throw new RuntimeException("添加个数不一致");
                }
                log.info("sensorType = " + sensorType);
                deviceBean.setType(sensorType);
                if (dao.update(deviceBean) < 1) {
                    throw new RuntimeException("update(deviceBean)失败");
                }
            });
            return ResultObject.ok("ok2");//添加成功
        } catch (Exception e) {
            log.info("catch (Exception e)" + e.getMessage());
        }
        return ResultObject.apiError("error10");//添加失败
    }

    /**
     * 删除传感器数据点（模板）
     *
     * @param deviceNumber 设备号
     * @param sensorCodes  传感器编码
     */
    @EnableOpLog
    @RequestMapping(value = "delTemplate", method = RequestMethod.POST)
    public Object delTemplate(
            @RequestParam(value = "deviceNumber") String deviceNumber,
            @RequestParam(value = "sensorCodes") List<String> sensorCodes) {
        DeviceBean deviceBean = dao.fetch(DeviceBean.class, deviceNumber);
        Object result = ControllerHelper.getInstance(dao).checkDevice(deviceBean);
        if (result != null) {
            return result;
        }
        if (sensorCodes.size() == 0) {
            return ResultObject.apiError("err60");//传感器编码为空
        }
        List<SensorTemplateBean> typeBeans = dao.query(SensorTemplateBean.class, SqlHelper.getAndOrCnd("sensor_code", Cnd.where("sensor_ncode", "=", deviceNumber), sensorCodes));
        log.info("typeBeans  =" + typeBeans.size());
        if (typeBeans.size() == 0) {
            return ResultObject.apiError("err61");//模板数据不存在
        }
        if (typeBeans.size() != sensorCodes.size()) {
            return ResultObject.apiError("err62");//模板数据不匹配
        }
        try {
            Trans.exec(Connection.TRANSACTION_READ_UNCOMMITTED, (Atom) () -> {
                for (int i = 0; i < typeBeans.size(); i++) {
                    if (dao.delete(typeBeans.get(i)) < 1) {
                        throw new RuntimeException("删除失败");
                    }
                }

            });
            updateDeviceTemplate(deviceBean);
            return ResultObject.ok("ok3");//删除成功
        } catch (Exception e) {
            log.info("catch (Exception e)" + e.getMessage());
        }
        return ResultObject.apiError("error14");//删除失败
    }

    /**
     * 清除传感器全部数据点(模板)
     *
     * @param deviceNumber 设备号
     */
    @EnableOpLog
    @RequestMapping(value = "cleraDeviceTeemplate", method = RequestMethod.GET)
    public Object delTemplate(
            @RequestParam(value = "deviceNumber") String deviceNumber) {
        DeviceBean deviceBean = dao.fetch(DeviceBean.class, deviceNumber);
        Object result = ControllerHelper.getInstance(dao).checkDevice(deviceBean);
        if (result != null) {
            return result;
        }
        List<SensorTemplateBean> templateBeans = dao.query(SensorTemplateBean.class, Cnd.where("sensor_ncode", "=", deviceNumber));
        log.info("oldSensorTemplateBeans =" + templateBeans.size());
        if (templateBeans.size() == 0) {
            return ResultObject.apiError("err63");//当前设备没有模板
        }
        try {
            Trans.exec(Connection.TRANSACTION_READ_UNCOMMITTED, (Atom) () -> {
                for (int i = 0; i < templateBeans.size(); i++) {
                    if (dao.delete(templateBeans.get(i)) < 1) {
                        throw new RuntimeException("清除失败");
                    }
                }
            });
            updateDeviceTemplate(deviceBean);
            return ResultObject.ok("ok12");//清除成功
        } catch (Exception e) {
            log.info("catch (Exception e)" + e.getMessage());
        }
        return ResultObject.apiError("err64");//清除失败
    }

    /**
     * 修改模板偏移量、系数
     *
     * @param deviceNumber 设备号
     * @param sensorCode   传感器编码
     * @param coefficient  系数
     * @param difference   差值
     */
    @EnableOpLog
    @RequestMapping(value = "upTemplate", method = RequestMethod.GET)
    public Object upTemplate(
            @RequestParam(value = "deviceNumber") String deviceNumber,
            @RequestParam(value = "sensorCode") String sensorCode,
            @RequestParam(value = "sensorCode", required = false, defaultValue = "0") Double coefficient,
            @RequestParam(value = "sensorCode", required = false, defaultValue = "0") Double difference
    ) {
        DeviceBean deviceBean = dao.fetch(DeviceBean.class, deviceNumber);
        Object result = ControllerHelper.getInstance(dao).checkDevice(deviceBean);
        if (result != null) {
            return result;
        }
        List<SensorTemplateBean> templateBeans = dao.query(SensorTemplateBean.class, Cnd.where("sensor_ncode", "=", deviceNumber).and("sensor_code", "=", sensorCode));
        if (templateBeans.size() < 1) {
            return ResultObject.apiError("err65");//模板不存在
        }
        if (templateBeans.size() > 1) {
            return ResultObject.apiError("err66");//存在多个相同模板，请删除
        }
        SensorTemplateBean bean = templateBeans.get(0);
        bean.setSensorValueone(coefficient);
        bean.setSensorValuetwo(difference);
        if (dao.update(bean) > 0) {
            return ResultObject.ok("ok4", bean);//修改成功
        }
        return ResultObject.apiError("error17");//修改失败
    }


    /**
     * 更新设备传感器类型
     *
     * @param device 要更新的设备
     * @throws Exception 更新设备传感器类型失败
     */
    private void updateDeviceTemplate(DeviceBean device) throws Exception {
        List<SensorTemplateBean> sensorTemplateBeans = dao.query(SensorTemplateBean.class, Cnd.where("sensor_ncode", "=", device.getDeviceNumber()));
        String sensorType = "";
        for (int i = 0; i < sensorTemplateBeans.size(); i++) {
            sensorType += sensorTemplateBeans.get(i).getSensorName();
            if (i < sensorTemplateBeans.size() - 1) {
                sensorType += " / ";
            }
        }
        log.info("sensorType =" + sensorType);
        device.setType(sensorType);
        if (dao.update(device) < 1) {
            throw new RuntimeException("更新设备传感器类型失败");
        }
    }

    @RequestMapping(value = "getSensorDetail", method = RequestMethod.GET)
    public ModelAndView getSensorDetail(String sensorCode) {

        SensorTemplateBean sensor = dao.fetch(SensorTemplateBean.class, Cnd.where("sensor_code", "=", sensorCode));
        return new ModelAndView("sensorEdit", "sensor", sensor);
    }

    @RequestMapping(value = "updateSensorValue", method = RequestMethod.GET)
    @ResponseBody
    public ReturnObject updateSensorValue(Double sensorValueone, Double sensorValuetwo, String sensorCode, String sensorName) {
        ReturnObject result = new ReturnObject();
        if (StringUtils.isBlank(sensorCode)) {
            result.setSuccess(false);
            result.setMsg("传感器编码为空");
        }

        Sql sql = Sqls.create("update sensor set sensor_valueone=@sensorValueone,sensor_valuetwo=@sensorValuetwo,sensor_name=@sensorName where sensor_code=@sensorCode ");
        sql.params().set("sensorValueone", sensorValueone);
        sql.params().set("sensorValuetwo", sensorValuetwo);
        sql.params().set("sensorCode", sensorCode);
        sql.params().set("sensorName", sensorName);
        dao.execute(sql);
        result.setSuccess(true);
        return result;
    }

}