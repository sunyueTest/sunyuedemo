package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.DeviceBean;
import com.jxctdzkj.cloudplatform.bean.SensorTemplateBean;
import com.jxctdzkj.cloudplatform.bean.SensorTypeBean;
import com.jxctdzkj.cloudplatform.bean.TemplateBean;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.opLog.EnableOpLog;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import com.jxctdzkj.cloudplatform.utils.Utils;
import com.jxctdzkj.support.utils.TextUtils;

import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.pager.Pager;
import org.nutz.trans.Trans;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 *     @author  : FlySand
 *     @e-mail  : 1156183505@qq.com
 *     @time    : 2018/8/29.
 *     @desc    :
 * </pre>
 */
@Slf4j
@RestController
@RequestMapping({"template"})
public class TemplateController {

    @Autowired
    Dao dao;

    /**
     * 获取传感器模版列表、
     *
     * @param page 页码
     * @param size 大小
     */
    @RequestMapping(value = "selList", method = RequestMethod.GET)
    public Object selSensorList(
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "100") int size) {
        Pager pager = dao.createPager(page, size);
        List<TemplateBean> loginUser = dao.query(TemplateBean.class, Cnd.where("is_del", "=", "0"), pager);
        return ResultObject.okList(loginUser, page, size);
    }

    /**
     * 获取传感器模板详情
     */
    @RequestMapping(value = "selDetail", method = RequestMethod.GET)
    public Object selDetail(@RequestParam String deviceNumber) {
        DeviceBean deviceBean = dao.fetch(DeviceBean.class, deviceNumber);
        if (deviceBean == null) {
            return ResultObject.apiError("err31");//设备不存在
        }
        TemplateBean templateBean = dao.fetch(TemplateBean.class, deviceBean.getTemplateId());
        if (templateBean == null) {
            return ResultObject.apiError("err65");//模板不存在
        }
        return ResultObject.ok("ok8").data(templateBean);//查询成功
    }

    /**
     * 添加传感器模板
     */
    @EnableOpLog(Constant.ModifyType.SAVE)
    @RequestMapping(value = "addTemplate", method = RequestMethod.GET)
    public Object addTemplate(
            @RequestParam(value = "name") String name,
            @RequestParam(value = "templates") List<String> templates) {

        if (TextUtils.isEmpty(name)) {
            return ResultObject.apiError("err68");//请输入名字
        }
        if (templates.size() == 0) {
            return ResultObject.apiError("err69");//请输入模板id
        }

        TemplateBean templateBean = new TemplateBean();
        templateBean.setName(name);
        templateBean.setTemplates(Utils.toListString(templates));
        templateBean.setCreatTime(new Timestamp(System.currentTimeMillis()));
        templateBean.setCreateUser(ControllerHelper.getInstance(dao).getLoginUserName());

        templateBean = dao.insert(templateBean);

        if (templateBean != null) {
            return ResultObject.ok("ok2", templateBean);//添加成功
        }

        return ResultObject.apiError("error10");//添加失败
    }

    /**
     * 删除传感器模板
     */
    @EnableOpLog(Constant.ModifyType.DELETE)
    @RequestMapping(value = "delTemplate", method = RequestMethod.POST)
    public Object delTemplate(
            @RequestParam(value = "id") long id) {

        TemplateBean templateBean = dao.fetch(TemplateBean.class, id);

        if (templateBean == null) {
            return ResultObject.apiError("err65");//模板不存在
        }

        templateBean.setIsDel(1);
        if (dao.update(templateBean) > 0) {
            return ResultObject.ok("ok3");//删除成功
        }

        return ResultObject.apiError("error14");//删除失败
    }

    /**
     * 配置设备传感器模板
     */
    @EnableOpLog
    @RequestMapping(value = "changeDeviceTemplate", method = RequestMethod.POST)
    public Object changeDeviceTemplate(
            @RequestParam(value = "deviceNumber") String deviceNumber,
            @RequestParam(value = "id") long templateId) {

        TemplateBean templateBean = dao.fetch(TemplateBean.class, templateId);
        if (templateBean == null) {
            return ResultObject.apiError("err65");//模板不存在
        }
        DeviceBean deviceBean = dao.fetch(DeviceBean.class, deviceNumber);
        if (deviceBean == null) {
            return ResultObject.apiError("err24");//设备不存在
        }
        //进行事物
        try {
            Trans.exec(() -> {
                String[] templateIds = templateBean.getTemplates().split(",");
                List<SensorTypeBean> sensorTypeBeans = new ArrayList<>();
                for (int i = 0; i < templateIds.length; i++) {
                    SensorTypeBean sensorTypeBean = dao.fetch(SensorTypeBean.class, Cnd.where("id", "=", templateIds[i]));
                    if (sensorTypeBean == null) {
                        throw new RuntimeException("模板配置错误");
                    }
                    sensorTypeBeans.add(sensorTypeBean);
                }
                List<SensorTemplateBean> templateBeans = dao.query(SensorTemplateBean.class, Cnd.where("sensor_ncode", "=", deviceNumber));
                log.info("删除数据点：" + templateBeans.size());
                for (int i = 0; i < templateBeans.size(); i++) {
                    if (dao.delete(templateBeans.get(i)) == 0) {
                        throw new RuntimeException("删除数据点:" + templateBeans.get(i) + "失败");
                    }
                }
                log.info("添加新数据点：" + sensorTypeBeans.size());
                for (int i = 0; i < sensorTypeBeans.size(); i++) {
                    SensorTemplateBean sensorTemplateBean = new SensorTemplateBean();
                    sensorTemplateBean.setSensorNcode(deviceNumber);
                    sensorTemplateBean.setSensorCode(deviceNumber + (i + 1));
                    sensorTemplateBean.setSensorType(sensorTypeBeans.get(i).getId());
                    sensorTemplateBean.setSensorName(sensorTypeBeans.get(i).getName());
                    if (dao.insert(sensorTemplateBean) == null) {
                        throw new RuntimeException("添加数据点失败 ：" + sensorTemplateBean);
                    }
                }
                deviceBean.setType("");
                deviceBean.setData("");
                deviceBean.setTemplateId(templateId);
                if (dao.update(deviceBean) == 0) {
                    throw new RuntimeException("更新设备数据失败");
                }
            });
        } catch (Exception e) {
            log.error(e.toString(), e);
            return ResultObject.apiError("error17");//修改失败
        }
        return ResultObject.ok("ok4");//修改成功
    }

}
