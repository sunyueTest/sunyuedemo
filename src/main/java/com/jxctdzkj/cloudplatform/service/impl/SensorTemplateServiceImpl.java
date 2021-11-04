package com.jxctdzkj.cloudplatform.service.impl;

import com.jxctdzkj.cloudplatform.bean.SensorTypeBean;
import com.jxctdzkj.cloudplatform.bean.TemplateBean;
import com.jxctdzkj.cloudplatform.service.SensorTemplateSerivce;

import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.Chain;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.dao.pager.Pager;
import org.nutz.dao.sql.Sql;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SensorTemplateServiceImpl implements SensorTemplateSerivce {

    @Autowired
    Dao dao;


    @Override
    public List<TemplateBean> getTempList(int page, int limit, String name) {
        Pager pager = dao.createPager(page, limit);
        List<TemplateBean> list;
        if (StringUtils.isBlank(name)) {
            list = dao.query(TemplateBean.class, Cnd.where("is_del", "=", "0"), pager);
        } else {
            list = dao.query(TemplateBean.class, Cnd.where("name", "like", "%" + name + "%").and("is_del", "=", "0"), pager);
        }

        for (TemplateBean bean : list) {
            String temps = bean.getTemplates();
            if (StringUtils.isNotBlank(temps)) {
                String[] param1 = temps.split(",");

                Sql sql = Sqls.create(" select *  from sensor_type where id in(@param1)  ");
                sql.setCallback(Sqls.callback.entities());
                sql.setEntity(dao.getEntity(SensorTypeBean.class));
                sql.params().set("param1", param1);
                dao.execute(sql);
                List<SensorTypeBean> sensorList = sql.getList(SensorTypeBean.class);
               String tempNames="";
               for(String s :param1){
                   for(SensorTypeBean sensorBean:sensorList){
                       String idstr =sensorBean.getId()+"";
                       if(s.equals(idstr)){
                           tempNames+=sensorBean.getName()+",";
                       }
                   }
               }
                tempNames= tempNames.substring(0,tempNames.length()-1);
                bean.setTemplates(tempNames);
            }

        }
        return list;
    }

    @Override
    public TemplateBean getTempInfo(int id) {

        return dao.fetch(TemplateBean.class, id);
    }

    @Override
    public List<SensorTypeBean> getTempSensorList(int id) {

        TemplateBean bean = dao.fetch(TemplateBean.class, id);
        String templates = bean.getTemplates();
        String[] param1 = templates.split(",");
        //String param2 = "," + templates + ",";
        Sql sql = Sqls.create(" select * from sensor_type where id in(@param1) ");
        sql.setCallback(Sqls.callback.entities());
        sql.setEntity(dao.getEntity(SensorTypeBean.class));
        sql.params().set("param1", param1);
        //sql.params().set("param2", param2);
        dao.execute(sql);
        List<SensorTypeBean> list =  sql.getList(SensorTypeBean.class);
        List<SensorTypeBean> result = new ArrayList();
        for(String s:param1){
            for(SensorTypeBean sensorType :list){
                String idstr =sensorType.getId()+"";
                if(s.equals(idstr)){
                    result.add(sensorType);
                }
            }
        }
        return result;
    }

    @Override
    public List<SensorTypeBean> getSensorList(String keyword) {

        if(StringUtils.isBlank(keyword)){
            return dao.query(SensorTypeBean.class, null);
        }else{
            return dao.query(SensorTypeBean.class, Cnd.where("tname","like","%"+keyword+"%"));
        }

    }

    @Override
    public long saveTemp(TemplateBean bean) {

        dao.insert(bean);
        return bean.getId();
    }

    @Override
    public void updateTemp(TemplateBean bean) {
        if (StringUtils.isBlank(bean.getTemplates())) {
            dao.update(TemplateBean.class, Chain.make("name", bean.getName()), Cnd.where("id", "=", bean.getId()));
        } else {
            dao.update(TemplateBean.class, Chain.make("name", bean.getName()).add("templates", bean.getTemplates()), Cnd.where("id", "=", bean.getId()));
        }

    }

    @Override
    public int getTempCount() {
        Sql sql = Sqls.create(" SELECT count(1)  from sensor_template  where is_del= '0' ");
        sql.setCallback(Sqls.callback.integer());
        dao.execute(sql);
        return sql.getInt();
    }


}
