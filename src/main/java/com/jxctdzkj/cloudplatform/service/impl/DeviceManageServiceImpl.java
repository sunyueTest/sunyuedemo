package com.jxctdzkj.cloudplatform.service.impl;

import com.jxctdzkj.cloudplatform.bean.*;
import com.jxctdzkj.cloudplatform.service.DeviceManageService;
import com.jxctdzkj.cloudplatform.service.UserService;
import com.jxctdzkj.cloudplatform.utils.*;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.dao.pager.Pager;
import org.nutz.dao.sql.Sql;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.*;

@Service
public class DeviceManageServiceImpl implements DeviceManageService {
    @Autowired
    Dao dao;

    @Autowired
    UserService userService;

    @Override
    public List<DeviceBean> getDeviceList(int page, int limit, String acode) {
        Pager pager = dao.createPager(page, limit);
        if (StringUtils.isNotBlank(acode)) {
            return dao.query(DeviceBean.class, Cnd.where("ncode", "like", "%" + acode + "%"), pager);
        }
        return dao.query(DeviceBean.class, null, pager);
    }

    @Override
    public DeviceBean getDeviceBean(String deviceNumber) {
        DeviceBean deviceBean = dao.fetch(DeviceBean.class, Cnd.where("Ncode", "=", deviceNumber));
        UserDeviceBean userDeviceBean = dao.fetch(UserDeviceBean.class, Cnd.where("Ncode", "=", deviceNumber).and("user_name", "=", ControllerHelper.getInstance(dao).getLoginUserName()));
        if (userDeviceBean != null) {
            deviceBean.setName(userDeviceBean.getDeviceName());
        }
        return deviceBean;
    }

    @Override
    public List<TemplateBean> getTempList() {
        return dao.query(TemplateBean.class, Cnd.where("is_del", "=", "0"));
    }

    @Override
    public List<SensorTemplateBean> getDeviceSensorList(String sensorNcode) {
        return dao.query(SensorTemplateBean.class, Cnd.where("sensor_ncode", "=", sensorNcode));
    }

    @Override
    public void updateDeviceSensor(String deviceNumber, int tempId) {
        TemplateBean temp = dao.fetch(TemplateBean.class, tempId);
        String templates = temp.getTemplates();
        String[] param1 = templates.split(",");
        String param2 = "," + templates + ",";
        Sql sql = Sqls.create(" select * from sensor_type where id in(@param1) ORDER BY  instr(@param2,CONCAT(',',id,',')) ");
        sql.setCallback(Sqls.callback.entities());
        sql.setEntity(dao.getEntity(SensorTypeBean.class));
        sql.params().set("param1", param1);
        sql.params().set("param2", param2);
        dao.execute(sql);
        List<SensorTypeBean> list = sql.getList(SensorTypeBean.class);

        //删除设备下所有传感器
        //dao.delete();
        //把模板下的所有传感器添加到设备下
        List<SensorTemplateBean> sensorList = new ArrayList<>();
        for (int i = 0; i < list.size(); i++) {
            SensorTemplateBean sensor = new SensorTemplateBean();
            sensor.setSensorType(Long.parseLong("12"));
            sensor.setSensorNcode(deviceNumber);
            sensor.setSensorCode(deviceNumber + i);
            sensorList.add(sensor);
        }
        dao.insert(sensorList);
    }

    @Override
    public List<DeviceBean> getUserDeviceList(int page, int limit, String userName, String acode) {
        Pager pager = dao.createPager(page, limit);
        Sql sql = null;
        if (StringUtils.isBlank(acode)) {
            sql = Sqls.create(" SELECT distinct u.*, d.Nserson_type as type, d.device_type as device_type , d.Nsensor_data as data,d.Nonlinestate as onLineState,d.Nrecord_time as time,d.template_id as template_id FROM network d , sys_user_to_devcie u  where u.user_name =@userName and is_del=0 and d.Ncode = u.Ncode");
        } else {
            sql = Sqls.create(" SELECT distinct u.*, d.Nserson_type as type, d.device_type as device_type,d.Nsensor_data as data,d.Nonlinestate as onLineState,d.Nrecord_time as time,d.template_id as template_id FROM network d , sys_user_to_devcie u  where u.user_name =@userName and u.Ncode = @ncode and is_del=0 and d.Ncode = u.Ncode");
            sql.params().set("ncode", acode);
        }
        sql.setCallback((conn, rs, sql1) -> {
            List<DeviceBean> list = new LinkedList<DeviceBean>();
            while (rs.next()) {
                DeviceBean deviceBean = new DeviceBean();
                deviceBean.setId(rs.getLong("id"));
                deviceBean.setData(rs.getString("data"));
                deviceBean.setOnLineState(rs.getInt("onLineState"));
                deviceBean.setDeviceNumber(rs.getString("Ncode"));
                deviceBean.setPassword(rs.getString("Npassword"));
                deviceBean.setUserName(rs.getString("user_name"));
                deviceBean.setCreatTime(rs.getTimestamp("create_time"));
                deviceBean.setName(rs.getString("device_name"));
                deviceBean.setLatitude(rs.getDouble("latitude"));
                deviceBean.setLongitude(rs.getDouble("longitude"));
                deviceBean.setTemplateId(rs.getLong("template_id"));
                deviceBean.setTime(rs.getTimestamp("time"));
                deviceBean.setType(rs.getString("type"));
                deviceBean.setDeviceType(rs.getInt("device_type"));
//                deviceBean.setGroupId(rs.getLong("group_id"));
//                deviceBean.setIsDel(rs.getInt("is_del"));

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
    public int getDeviceCount(String acode) {
        Sql sql = null;
        if (StringUtils.isBlank(acode)) {
            sql = Sqls.create(" select count(1)  from network  ");
        } else {
            sql = Sqls.create(" select count(1)  from network  where ncode like @ncode");
        }
        sql.params().set("ncode", "%" + acode + "%");
        sql.setCallback(Sqls.callback.integer());
        dao.execute(sql);
        return sql.getInt();
    }

    @Override
    public int getUserDeviceCount(String userName, String acode) {
        Sql sql = null;
        if (StringUtils.isBlank(acode)) {
            sql = Sqls.create(" select count(1) from sys_user_to_devcie where user_name =@userName and is_del=0");
        } else {
            sql = Sqls.create(" select count(1) from sys_user_to_devcie where user_name =@userName and is_del=0 and ncode= @ncode");
            sql.params().set("ncode", acode);
        }
        sql.setCallback(Sqls.callback.integer());
        sql.params().set("userName", userName);
        dao.execute(sql);
        return sql.getInt();
    }

    @Override
    public List<UserDeviceBean> getDeviceStatic(int page, int limit) {
        Pager pager = dao.createPager(page, limit);
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
       /* if(userBean.getLevel() <= Constant.Define.ROLE_0) {   //系统管理员显示所有设备
        //if (true) {//系统管理员显示所有设备
            List<DeviceBean> deviceList = dao.query(DeviceBean.class, Cnd.NEW(), pager);
            for (int i = 0; i < deviceList.size(); i++) {
                DeviceBean deviceBean = deviceList.get(i);
                UserDeviceBean userDeviceBean = new UserDeviceBean();
                userDeviceBean.setUserName(deviceBean.getUserName());
                userDeviceBean.setId(deviceBean.getId());
                userDeviceBean.setDeviceName(deviceBean.getName());
                userDeviceBean.setDeviceNumber(deviceBean.getDeviceNumber());
                userDeviceBean.setLatitude(deviceBean.getLatitude());
                userDeviceBean.setLongitude(deviceBean.getLongitude());
                deviceBeans.add(userDeviceBean);
            }
        } else if(StringUtils.isNotBlank(devices)){
            String[] ncodes= devices.split(",");
            deviceBeans=dao.query(UserDeviceBean.class, Cnd.where("user_name", "=", userName).and("is_del", "=", "0").and("ncode","in",ncodes), pager);
        }else{

        }*/
        return dao.query(UserDeviceBean.class, Cnd.where("user_name", "=", userName).and("is_del", "=", "0"), pager);
    }

    @Override
    public List<UserDeviceBean> getDeviceSelect() {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        return dao.query(UserDeviceBean.class, Cnd.where("user_name", "=", userName).and("is_del", "=", "0"));
    }

    @Override
    public List<SensorTemplateBean> getSensorSelect(String sensorNcode) {
        return dao.query(SensorTemplateBean.class, Cnd.where("sensor_ncode", "=", sensorNcode));
    }

    @Override
    public List<SensorDataBean> getHistoryData(String sensorCode, Timestamp from, Timestamp to) {
        List<SplitTableBean> tables = SplitTableHelper.getSplitTables(SensorDataBean.class, from, to);
        List<SensorDataBean> list = new ArrayList<>();
        for (SplitTableBean table : tables) {
            Sql sql = Sqls.create("  SELECT avg(sensor_value) sensor_value,DATE_FORMAT(record_time ,'%Y-%m-%d %H:00:00') record_time   FROM " + table.getSplitTableName() + " where sensor_code = @sensorCode and  record_time between @from and  @to group by DATE_FORMAT(record_time ,'%Y-%m-%d %H:00:00')");
            sql.setCallback(Sqls.callback.entities());
            sql.setEntity(dao.getEntity(SensorDataBean.class));
            sql.params().set("sensorCode", sensorCode);
            sql.params().set("from", from);
            sql.params().set("to", to);
            dao.execute(sql);
            list.addAll(sql.getList(SensorDataBean.class));
        }
        return list;
    }

    @Override
    public Map<String, Object> getDeviceReport() {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        Sql sql1 = Sqls.create("  SELECT count(a.nonlinestate) FROM network a where exists (select b.ncode from sys_user_to_devcie b where a.ncode=b.ncode and b.user_name = @userName and b.is_del = 0 ) and a.nonlinestate=1");
        sql1.setCallback(Sqls.callback.integer());
        //sql1.setEntity(dao.getEntity(SensorDataBean.class));
        sql1.params().set("userName", userName);
        dao.execute(sql1);
        Sql sql2 = Sqls.create("  SELECT count(a.nonlinestate) FROM network a where exists (select b.ncode from sys_user_to_devcie b where a.ncode=b.ncode and b.user_name = @userName and b.is_del = 0 ) and a.nonlinestate=0 ");
        sql2.setCallback(Sqls.callback.integer());
        //sql2.setEntity(dao.getEntity(SensorDataBean.class));
        sql2.params().set("userName", userName);
        dao.execute(sql2);
        Map<String, Object> map = new HashMap<>(4);
        map.put("online", sql1.getInt());
        map.put("offline", sql2.getInt());
        return map;
    }

    @Override
    public ReturnObject getAllDeviceList(int page, int limit, String deviceCode) {
        ReturnObject result = new ReturnObject();
        try {
            //获取用户信息，如果是管理员，查询network表，否则查询sys_user_to_device表
            Subject subject = SecurityUtils.getSubject();
            Object o = subject.getSession().getAttribute("user");
            SysUserBean user = userService.getUserInfo(o.toString());
            if (user.getLevel() < 1) {//管理员
                List<DeviceBean> list = getDeviceList(page, limit, deviceCode);
                result.setData(list);
                result.setCount(getDeviceCount(deviceCode));
            } else {
                List<DeviceBean> list = getUserDeviceList(page, limit, o.toString(), deviceCode);
                result.setData(list);
                result.setCount(getUserDeviceCount(o.toString(), deviceCode));
            }
            result.setCode(0);
            result.setSuccess(true);
        } catch (Exception e) {
            e.printStackTrace();
            result.setSuccess(false);
            result.setMsg(e.toString());
        } finally {
            return result;
        }

    }

    @Override
    public ReturnObject getNewAllDeviceList(int page, int limit, String deviceCode) {
        ReturnObject result = new ReturnObject();
        try {
            //获取用户信息，如果是管理员，查询network表，否则查询sys_user_to_device表
            Subject subject = SecurityUtils.getSubject();
            Object o = subject.getSession().getAttribute("user");
            SysUserBean user = userService.getUserInfo(o.toString());
            if (user.getLevel() < 1) {//管理员
                List<DeviceBean> list = getDeviceList(page, limit, deviceCode);
                result.setData(list);
                result.setCount(getDeviceCount(deviceCode));
            } else {
                List<DeviceBean> list = getUserDeviceList(page, limit, o.toString(), deviceCode);
                for (DeviceBean deviceBean : list) {
                    String[] datas1 = deviceBean.getData().split("\\|");
                    String[] datas2 = deviceBean.getType().split("\\/");
                    Map<String, Double> map = new HashMap<>();
                    for (int i = 0; i < datas1.length; i++) {
                        String[] datasStr = datas1[i].trim().split("\\s+");
                        map.put(datas2[i], Double.parseDouble(datasStr[0]));
                    }
                    //计算出的AQI指数（由于单位不统一，现为假数据）
                    double a = AqiUtil.CountAqi(map.get("PM2.5"), map.get("PM10"), map.get("一氧化碳"), map.get("二氧化氮"), map.get("臭氧"), map.get("二氧化硫")).getAqi() - 50;
                    deviceBean.setAqi(a);
                }
                result.setData(list);
                result.setCount(getUserDeviceCount(o.toString(), deviceCode));
            }
            result.setCode(0);
            result.setSuccess(true);
        } catch (Exception e) {
            e.printStackTrace();
            result.setSuccess(false);
            result.setMsg(e.toString());
        } finally {
            return result;
        }

    }

    /**
     * 获取当前用下所有设备总数以及设备触发器报警总数
     *
     * @return
     * @User 李英豪
     */
    @Override
    public ResultObject findDeviceCount() throws RuntimeException {
        Map<String, Object> map = new HashMap<>();
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        String userName = userBean.getUserName();
        Cnd cnd = Cnd.where("user_name", "=", userName).and("is_del", "=", 0);
        //获得设备总数
        long count = ControllerHelper.getInstance(dao).getCount("sys_user_to_devcie " + cnd);
        map.put("deviceCount", count);
        //获取报警设备总数
        String sqlStr = "(SELECT count(1) as groupnum from trigger_alarm_history " +
                "where user_name=@userName and is_del=0 GROUP BY Ncode)AS T";
        Sql sql = Sqls.create(sqlStr);
        sql.setParam("userName", userName);
        sql.setCallback(Sqls.callback.records());
        sql.forceExecQuery();
        count = dao.count(String.valueOf(sql));
        map.put("triggerCount", count);
        map.put("userBean", userBean);
        return ResultObject.ok(map);
    }

    //--根据设备号+用户名称查询设备
    public UserDeviceBean selectByUserNameAndDeviceNumber(String userName, String deviceNumber) {
        return dao.fetch(UserDeviceBean.class, Cnd.where("user_name", "=", userName).and("Ncode", "=", deviceNumber));
    }
}
