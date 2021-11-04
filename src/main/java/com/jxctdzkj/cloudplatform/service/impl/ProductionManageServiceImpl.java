package com.jxctdzkj.cloudplatform.service.impl;

import com.jxctdzkj.cloudplatform.bean.CameraBean;
import com.jxctdzkj.cloudplatform.bean.DeviceBean;
import com.jxctdzkj.cloudplatform.service.ProductionManageService;
import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.dao.pager.Pager;
import org.nutz.dao.sql.Sql;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

@Service
public class ProductionManageServiceImpl implements ProductionManageService {
    @Autowired
    Dao dao;

    @Override
    public List getUserPondDeviceList(int page, int limit, String userName, String acode, String pondId, String groupId, String isDevice) {
        Pager pager = dao.createPager(page, limit);
        Sql sql;
        StringBuilder sqlStr = new StringBuilder(" SELECT distinct u.*, d.Nserson_type as NsersonType, d.Nsensor_data as data,d.Nonlinestate as onLineState,d.Nrecord_time as time,d.template_id as template_id " +
                " FROM network d , sys_user_to_devcie u  where u.user_name =@userName and u.is_del=0 and d.Ncode = u.Ncode");
        sql = getSql(acode, pondId, groupId, sqlStr);

        sql.setCallback((conn, rs, sql1) -> {
            List<DeviceBean> list = new LinkedList<DeviceBean>();
            while (rs.next()) {
                DeviceBean deviceBean = new DeviceBean();
                deviceBean.setId(rs.getLong("id"));
                deviceBean.setData(rs.getString("data"));
                deviceBean.setOnLineState(rs.getInt("onLineState"));
                deviceBean.setDeviceNumber(rs.getString("Ncode"));
                deviceBean.setUserName(rs.getString("user_name"));
                deviceBean.setCreatTime(rs.getTimestamp("create_time"));
                deviceBean.setName(rs.getString("device_name"));
                deviceBean.setTemplateId(rs.getLong("template_id"));
                deviceBean.setTime(rs.getTimestamp("time"));
                deviceBean.setType(StringUtils.isNotBlank(rs.getString("NsersonType")) ? rs.getString("NsersonType") : "无");
                deviceBean.setLatitude(rs.getDouble("latitude"));
                deviceBean.setLongitude(rs.getDouble("longitude"));
                String pondIdForCameraQuery = "";
                if (StringUtils.isBlank(pondId)) {
                    pondIdForCameraQuery = rs.getString("pond_id");
                } else {
                    pondIdForCameraQuery = pondId;
                }
                CameraBean cameraBean = dao.fetch(CameraBean.class, Cnd.where("user_name", "=", userName).and("ncode", "=", pondIdForCameraQuery));
                if (cameraBean != null) {
                    deviceBean.setaCode(cameraBean.getSerial());
                }
                list.add(deviceBean);
            }
            return list;
        });
        sql.setPager(pager);
        sql.params().set("userName", userName);
        dao.execute(sql);
        List<DeviceBean> deviceList = sql.getList(DeviceBean.class);
        List<CameraBean> cameraList = new ArrayList<>();
        //这里修复水产大屏池塘无设备时，直播视频不显示的问题
        if (!"1".equals(isDevice)) {
            if (deviceList.size() == 0) {
                if (!StringUtils.isBlank(pondId)) {
                    CameraBean cameraBean = dao.fetch(CameraBean.class, Cnd.where("user_name", "=", userName).and("ncode", "=", pondId));
                    if (cameraBean != null) {
                        cameraList.add(cameraBean);
                        return cameraList;
                    }
                }
            }
        }
        return deviceList;
    }

    @Override
    public List<DeviceBean> getUserFarmDeviceList(int page, int limit, String userName, String acode, String farmId) {
        Pager pager = dao.createPager(page, limit);
        Sql sql;
        StringBuilder sqlStr = new StringBuilder(" SELECT distinct u.*, d.Nserson_type as NsersonType, d.Nsensor_data as data,d.Nonlinestate as onLineState,d.Nrecord_time as time,d.template_id as template_id " +
                " FROM network d , sys_user_to_devcie u  where u.user_name =@userName and u.is_del=0 and d.Ncode = u.Ncode");
        sql = getSql(acode, null, farmId, sqlStr);
        sql.setCallback((conn, rs, sql1) -> {
            List<DeviceBean> list = new LinkedList<DeviceBean>();
            while (rs.next()) {
                DeviceBean deviceBean = new DeviceBean();
                deviceBean.setId(rs.getLong("id"));
                deviceBean.setData(rs.getString("data"));
                deviceBean.setOnLineState(rs.getInt("onLineState"));
                deviceBean.setDeviceNumber(rs.getString("Ncode"));
                deviceBean.setUserName(rs.getString("user_name"));
                deviceBean.setCreatTime(rs.getTimestamp("create_time"));
                deviceBean.setName(rs.getString("device_name"));
                deviceBean.setTemplateId(rs.getLong("template_id"));
                deviceBean.setTime(rs.getTimestamp("time"));
                deviceBean.setType(StringUtils.isNotBlank(rs.getString("NsersonType")) ? rs.getString("NsersonType") : "无");
                deviceBean.setLatitude(rs.getDouble("latitude"));
                deviceBean.setLongitude(rs.getDouble("longitude"));
                list.add(deviceBean);
            }
            return list;
        });
        sql.setPager(pager);
        sql.params().set("userName", userName);
        dao.execute(sql);
        return sql.getList(DeviceBean.class);
    }

    @Override
    public int getUserFarmDeviceCount(String userName, String acode, String farmId) {
        Sql sql;
        StringBuilder sqlStr = new StringBuilder(" SELECT count(1) FROM network d , sys_user_to_devcie u  where u.user_name = @userName and u.is_del=0 and d.Ncode = u.Ncode");
        sql = getSql(acode, null, farmId, sqlStr);

        sql.setCallback(Sqls.callback.integer());
        sql.params().set("userName", userName);
        dao.execute(sql);
        return sql.getInt();
    }

    @Override
    public int getUserPondDeviceCount(String userName, String acode, String pondId, String groupId) {
        Sql sql;
        StringBuilder sqlStr = new StringBuilder(" SELECT count(1) FROM network d , sys_user_to_devcie u  where u.user_name = @userName and u.is_del=0 and d.Ncode = u.Ncode");
        sql = getSql(acode, pondId, groupId, sqlStr);

        sql.setCallback(Sqls.callback.integer());
        sql.params().set("userName", userName);
        dao.execute(sql);
        return sql.getInt();
    }

    private Sql getSql(String acode, String pondId, String groupId, StringBuilder sqlStr) {
        Sql sql;
        if (StringUtils.isNotBlank(acode)) {
            sqlStr.append(" and u.nCode like @nCode ");
        }
        if (StringUtils.isNotBlank(pondId)) {
            sqlStr.append(" and u.pond_id = @pondId ");
        }
        if (StringUtils.isNotBlank(groupId)) {
            sqlStr.append(" and u.group_id = @groupId ");
        }
        sql = Sqls.create(sqlStr.toString());

        if (StringUtils.isNotBlank(acode)) {
            sql.params().set("nCode", "%" + acode + "%");
        }
        if (StringUtils.isNotBlank(pondId)) {
            sql.params().set("pondId", pondId);
        }
        if (StringUtils.isNotBlank(groupId)) {
            sql.params().set("groupId", groupId);
        }
        return sql;
    }
}
