package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.SensorTypeBean;
import com.jxctdzkj.cloudplatform.bean.TemplateBean;
import com.jxctdzkj.cloudplatform.opLog.EnableOpLog;
import com.jxctdzkj.cloudplatform.service.SensorTemplateSerivce;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ReturnObject;
import com.jxctdzkj.cloudplatform.utils.Utils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.dao.sql.Sql;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Controller
@RequestMapping({"sensorTemplate"})
public class SensorTemplateController {
    @Autowired
    Dao dao;
    @Autowired
    SensorTemplateSerivce sensorTemplateSerivce;

    @RequestMapping({""})
    public String index() {
        return "sensorTemplateList";
    }

    @RequestMapping({"getTempList"})
    @ResponseBody
    public ReturnObject getTempList(int page, int limit, String name) {
        ReturnObject result = new ReturnObject();
        List<TemplateBean> list = sensorTemplateSerivce.getTempList(page, limit, name);
        result.setCount(sensorTemplateSerivce.getTempCount());
        result.setData(list);
        result.setCode(0);
        return result;
    }

    @EnableOpLog
    @RequestMapping({"/getDetail"})
    public ModelAndView getDetail(Integer id) {
        //TemplateBean temp =sensorTemplateSerivce
        if (id != null) {
            TemplateBean bean = sensorTemplateSerivce.getTempInfo(id);
            bean.setFlag("edit");
            return new ModelAndView("sensorTemplateDetail", "data", bean);
        }
        TemplateBean bean = new TemplateBean();
        bean.setFlag("add");
        return new ModelAndView("sensorTemplateDetail", "data", bean);
    }

    @RequestMapping({"/getTempSensorList"})
    @ResponseBody
    public ReturnObject getTempSensorList(int id, Integer id2) {
        ReturnObject result = new ReturnObject();
        if (id == 0 && id2 != null) {
            id = id2;
        }
        if (id > 0) {
            List<SensorTypeBean> list = sensorTemplateSerivce.getTempSensorList(id);
            result.setData(list);
        }
        result.setCode(0);
        return result;
    }

    @RequestMapping({"/getSensorList"})
    @ResponseBody
    public ReturnObject getSensorList(String keyword) {
        ReturnObject result = new ReturnObject();
        List<SensorTypeBean> list = sensorTemplateSerivce.getSensorList(keyword);
        result.setData(list);
        result.setCode(0);
        return result;
    }

    @EnableOpLog
    @RequestMapping({"/saveTemp"})
    @ResponseBody
    public ReturnObject saveTemp(String name, String flag, String templates, long id) {

        ReturnObject result = new ReturnObject();
        String[] temps = templates.split(",");
        if (temps.length > 12) {
            result.setMsg("err67");//最多配置12个数据点
            return result;
        }

        TemplateBean bean = new TemplateBean();
        bean.setName(name);
        bean.setTemplates(templates);
        bean.setCreateUser(ControllerHelper.getInstance(dao).getLoginUserName());
        bean.setCreatTime(Utils.getCurrentTimestamp());
        //新建还是编辑
        if ("add".equals(flag)) {
            long b = sensorTemplateSerivce.saveTemp(bean);//返回自增主键
            result.setData(b);

        } else if ("edit".equals(flag)) {
            //获取原数据
            TemplateBean oldBean = sensorTemplateSerivce.getTempInfo((int) id);
            String oldTemps = oldBean.getTemplates();
            String newTemps;
            if (StringUtils.isNotBlank(oldTemps)) {
                newTemps = oldTemps + "," + templates;
            } else {
                newTemps = templates;
            }
            bean.setTemplates(newTemps);
            bean.setId(id);
            sensorTemplateSerivce.updateTemp(bean);
            result.setData(id);
        }
        result.setSuccess(true);
        return result;
    }

    @EnableOpLog
    @RequestMapping({"/moveUp"})
    @ResponseBody
    public void moveUp(int index, int tempId) {
        TemplateBean bean = sensorTemplateSerivce.getTempInfo(tempId);
        String[] arr = bean.getTemplates().split(",");
       /* int sort = 0;
        for (int i = 0; i < arr.length; i++) {

            if ((id + "").equals(arr[i])) {
                sort = i;
                break;
            }
        }*/
        int sort = index;
        String id = arr[sort];
        if (sort > 0) {
            arr[sort] = arr[sort - 1];
            arr[sort - 1] = id;
            StringBuilder sb = new StringBuilder();
            for (String s : arr) {
                sb.append(s).append(",");
            }
            String templates = sb.toString();
            templates = templates.substring(0, templates.length() - 1);
            bean.setTemplates(templates);
            sensorTemplateSerivce.updateTemp(bean);
            Map<String, String> map = new HashMap<>();
            map.toString();
        }
    }

    @EnableOpLog
    @RequestMapping({"/moveDown"})
    @ResponseBody
    public void moveDown(int index, int tempId) {
        TemplateBean bean = sensorTemplateSerivce.getTempInfo(tempId);
        String[] arr = bean.getTemplates().split(",");
       /* int sort = arr.length - 1;
        for (int i = 0; i < arr.length; i++) {

            if ((id + "").equals(arr[i])) {
                sort = i;
                break;
            }
        }*/
        int sort = index;
        String id = arr[sort];
        if (sort < arr.length - 1) {
            arr[sort] = arr[sort + 1];
            arr[sort + 1] = id;
            StringBuilder sb = new StringBuilder();
            for (String s : arr) {
                sb.append(s).append(",");
            }
            String templates = sb.toString();
            templates = templates.substring(0, templates.length() - 1);
            bean.setTemplates(templates);
            sensorTemplateSerivce.updateTemp(bean);
        }
    }

    @EnableOpLog
    @RequestMapping({"/delete"})
    @ResponseBody
    public void delete(int index, int tempId) {
        TemplateBean bean = sensorTemplateSerivce.getTempInfo(tempId);
        if (bean == null || StringUtils.isBlank(bean.getTemplates())) {
            return;
        }
        StringBuilder sb = new StringBuilder();
        String[] arr = bean.getTemplates().split(",");
        if (arr.length > 1) {
            arr = ArrayUtils.remove(arr, index);
            for (int i = 0; i < arr.length; i++) {
                sb.append(arr[i]);
                if (i < arr.length - 1) {
                    sb.append(",");
                }
            }
        }
        String templates = sb.toString();
        Sql sql = Sqls.create("update sensor_template set templates =@templates where id =@tempId");
        sql.params().set("templates",templates);
        sql.params().set("tempId",tempId);
        dao.execute(sql);
    }
}
