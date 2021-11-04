package com.jxctdzkj.cloudplatform.service.impl;

import com.jxctdzkj.cloudplatform.bean.AquacultureCommandDeviceBean;
import com.jxctdzkj.cloudplatform.service.AquacultureUserSensorService;
import lombok.extern.slf4j.Slf4j;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.dao.pager.Pager;
import org.nutz.dao.sql.Sql;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;

@Service
@Slf4j
public class AquacultureUserSensorServiceImpl implements AquacultureUserSensorService {

    @Autowired
    Dao dao;

    @Override
    public List<AquacultureCommandDeviceBean> getDeviceCommandList(String deviceNumber, String userName, Pager pager) {

        Sql sql = Sqls.create("select a.*, b.sensor_name as sensorName from aquaculture_command_to_device a, aquaculture_user_sensor b " +
                " where a.sensor_code = b.sensor_code and a.user_name=b.user_name and a.Ncode=b.n_code " +
                " and a.user_name = @userName and a.Ncode = @deviceNumber and a.is_del = 0 order by command_time desc" );
        sql.params().set("deviceNumber", deviceNumber);
        sql.params().set("userName", userName);
        sql.setCallback((conn, rs, sql1) -> {
            List<AquacultureCommandDeviceBean> list = new LinkedList<AquacultureCommandDeviceBean>();
            while (rs.next()) {
                AquacultureCommandDeviceBean bean = new AquacultureCommandDeviceBean();
                bean.setId(rs.getLong("id"));
                bean.setUserName(rs.getString("user_name"));
                bean.setDeviceNumber(rs.getString("Ncode"));
                bean.setVal(rs.getString("val"));
                bean.setCommand(rs.getString("command"));
                bean.setSensorCode(rs.getString("sensor_code"));
                bean.setSensorName(rs.getString("sensorName"));
                bean.setDeviceType(rs.getInt("device_type"));
                bean.setIsDel(rs.getInt("is_del"));
                bean.setIsSuccess(rs.getInt("is_success"));
                bean.setCommandTime(rs.getTimestamp("command_time"));
                list.add(bean);
            }
            return list;
        });
        sql.setPager(pager);
        dao.execute(sql);
        return sql.getList(AquacultureCommandDeviceBean.class);
    }

    @Override
    public int getDeviceCommandCount(String deviceNumber, String userName) {
        Sql sql = Sqls.create("SELECT count(1) from aquaculture_command_to_device a, aquaculture_user_sensor b " +
                " where a.sensor_code = b.sensor_code  and a.user_name=b.user_name and a.Ncode=b.n_code " +
                " and a.user_name = @userName and a.Ncode = @deviceNumber and a.is_del = 0 order by command_time desc" );
        sql.params().set("deviceNumber", deviceNumber);
        sql.params().set("userName", userName);

        sql.setCallback(Sqls.callback.integer());
        dao.execute(sql);
        return sql.getInt();
    }
}
