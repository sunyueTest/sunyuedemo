package com.jxctdzkj.cloudplatform.service.impl;

import com.jxctdzkj.cloudplatform.bean.*;
import com.jxctdzkj.cloudplatform.service.FarmInfoService;
import com.jxctdzkj.cloudplatform.service.RaiseDustService;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import com.jxctdzkj.cloudplatform.utils.Utils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.dao.pager.Pager;
import org.nutz.dao.sql.Sql;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * @Auther huangwei
 * @Date 2019/10/8
 **/
@Service
@Slf4j
public class RaiseDustServiceImpl implements RaiseDustService {
    @Autowired
    Dao dao;
    @Autowired
    FarmInfoService newFarmInfoService;


    /**
     * @return java.util.Map<java.lang.String, java.lang.Integer>
     * @Author huangwei
     * @Description //TODO 超标预警，严重污染 正常 离线 饼状图统计
     * @Date 2019/10/10
     * @Param [from, to]
     **/
    @Override
    public Map<String, Integer> getAllAlarm(String from, String to) {
        Sql deviceAlarm = null;
        Sql seriousness = null;
        Map<String, Integer> maps = new HashMap<String, Integer>();
        String userName = ControllerHelper.getLoginUserName();
        //严重污染
        deviceAlarm = Sqls.create("select  count(DISTINCT t.Ncode) from trigger_alarm t left join network n on  t.Ncode = n.Ncode where t.user_name = @userName and t.trigger_name like \"%严重污染\"  \n" +
                "and  @from < t.alarm_time and t.alarm_time <@to and t.is_del=0  and n.device_type not in ('2','9')");
        deviceAlarm.setCallback(Sqls.callback.integer());
        deviceAlarm.setParam("userName", userName);
        deviceAlarm.setParam("from", from);
        deviceAlarm.setParam("to", to);
        dao.execute(deviceAlarm);
        int countSeriousness = deviceAlarm.getInt();
        //超标报警
        seriousness = Sqls.create("select   count(DISTINCT t.Ncode) from trigger_alarm t left join network n on  t.Ncode = n.Ncode where t.user_name = @userName " +
                "and t.trigger_name like \"%超标报警\"  " +
                "and  @from < t.alarm_time " +
                "and t.alarm_time <@to " +
                "and t.is_del=0 " +
                "and n.device_type not in ('2','9') " +
                "and t.Ncode not in ( select  Ncode from trigger_alarm where user_name = @userName and trigger_name like \"%严重污染\"  and  @from < alarm_time and alarm_time <@to and is_del=0)");
        seriousness.setCallback(Sqls.callback.integer());
        seriousness.setParam("userName", userName);
        seriousness.setParam("from", from);
        seriousness.setParam("to", to);
        dao.execute(seriousness);
        int countOver = seriousness.getInt();
        maps.put("countSeriousness", countSeriousness);
        maps.put("countOver", countOver);
        return maps;

    }

    /**
     * @return java.util.Map<java.lang.String, java.lang.Object>
     * @Author huangwei
     * @Description //TODO 数据上报  获取触发器数据
     * @Date 2019/10/14
     * @Param [deviceId]
     **/
    @Override
    public Map<String, Object> getTrigger(String deviceId) {
        Timestamp creatTime = null;
        String type = null;
        double value = 0.0;
        String unit = null;
        String name = null;
        String loginUserName = ControllerHelper.getLoginUserName();
        HashMap<String, Object> ObjectHashMap = new HashMap<>();
        TriggerBean ncode = dao.fetch(TriggerBean.class, Cnd.where("Ncode", "=", deviceId).and("user_name", "=", loginUserName).and("is_del", "=", 0).desc("alarm_time"));
        if (ncode != null) {
            String sensorCode = ncode.getSensorCode();
            SensorTemplateBean sensor_code = dao.fetch(SensorTemplateBean.class, Cnd.where("sensor_code", "=", sensorCode));
            SensorTypeBean tname = dao.fetch(SensorTypeBean.class, Cnd.where("tname", "=", sensor_code.getSensorName()));
            //获取创建时间
            creatTime = ncode.getCreatTime();
            //获取推送方式
            type = ncode.getType();
            //获取持续时间 前端计算
            //获取推送数值
            value = ncode.getValue();
            if (tname != null) {
                //获取数值单位
                unit = tname.getUnit();
                name = tname.getName();
                ObjectHashMap.put("value", value + unit + "/" + name);
            }
            ObjectHashMap.put("creatTime", creatTime);
            ObjectHashMap.put("type", type);

        }

        return ObjectHashMap;
    }

    /**
     * @return java.util.List<com.jxctdzkj.cloudplatform.bean.DeviceBean>
     * @Author huangwei
     * @Description //TODO 查看用户下所有设备 （展示）
     * @Date 2019/10/23
     * @Param [page, size, deviceNumber, userName]
     **/
    @Override
    public List<DeviceBean> toBoundDeviceByUser(int page, int size, String deviceNumber, String userName) {
        //List<UserDeviceBean> beans = dao.query(UserDeviceBean.class, Cnd.where("user_name", "=", userName),new Pager(page,size));
        Pager pager = dao.createPager(page, size);
        Sql sql = null;
        // sql = Sqls.create(" SELECT distinct u.*, d.Nserson_type as type, d.device_type as device_type , d.Nsensor_data as data,d.Nonlinestate as onLineState,d.Nrecord_time as time,d.template_id as template_id FROM network d , sys_user_to_devcie u  where u.user_name =@userName and is_del=0 and d.Ncode = u.Ncode");
        if (StringUtils.isBlank(deviceNumber)) {
            sql = Sqls.create(" SELECT distinct u.*, d.Nserson_type as type, d.device_type as device_type , d.Nsensor_data as data,d.Nonlinestate as onLineState,d.Nrecord_time as time,d.template_id as template_id FROM network d , sys_user_to_devcie u  where u.user_name =@userName and is_del=0 and d.Ncode = u.Ncode ");
        } else {
            sql = Sqls.create(" SELECT distinct u.*, d.Nserson_type as type, d.device_type as device_type,d.Nsensor_data as data,d.Nonlinestate as onLineState,d.Nrecord_time as time,d.template_id as template_id FROM network d , sys_user_to_devcie u  where u.user_name =@userName and u.Ncode LIKE @ncode and is_del=0 and d.Ncode = u.Ncode ");
            sql.params().set("ncode", "%" + deviceNumber + "%");
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
                list.add(deviceBean);
            }
            return list;
        });
        sql.setPager(pager);
        sql.params().set("userName", userName);
        dao.execute(sql);
        return sql.getList(DeviceBean.class);
    }

    /**
     * @return java.util.List<com.jxctdzkj.cloudplatform.bean.FarmInfoBean>
     * @Author huangwei
     * @Description //TODO 获取当前用户所有地区
     * @Date 2019/10/14
     * @Param []
     **/
    @Override
    public List<FarmInfoBean> getFarmInfoListNoPage() {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        Cnd cnd = Cnd.where("create_user", "=", userName).and("delete_flag", "=", "0");
        List<FarmInfoBean> list = dao.query(FarmInfoBean.class, cnd);
        return list;
    }

    /**
     * @return com.jxctdzkj.cloudplatform.utils.ResultObject
     * @Author huangwei
     * @Description //TODO  根据地区获取报警信息  (当月 当年)共用接口
     * @Date 2019/10/23
     * @Param [page, size, areaId, from, to]
     **/
    @Override
    public ResultObject getDeviceHistory(int page, int size, String areaId, String from, String to) {
        Pager pager = new Pager(page, size);
        String userName = ControllerHelper.getLoginUserName();
        List<TriggerHistoryBean> trigger = dao.query(TriggerHistoryBean.class, Cnd.where("group_id", "=", areaId)
                .and("alarm_time", ">", from).and("alarm_time", "<", to).and("user_name", "=", userName), pager);
        return ResultObject.okList(trigger, page, size);
    }

    /**
     * @return java.util.Map<java.lang.String, java.lang.Object>
     * @Author huangwei
     * @Description //TODO 获取设备的状态
     * @Date 2019/10/23
     * @Param []
     **/
    @Override
    public Map<String, Object> getDeviceStatus() {
        HashMap<String, Object> hashMap = new HashMap<>();
        String userName = ControllerHelper.getLoginUserName();
        //统计用户下所有不在线的设备
        Sql sql = Sqls.create("select count(*) from  network  n left join  sys_user_to_devcie s on n.Ncode = s.Ncode  where s.user_name =@userName and n.device_type not in ('2','9') and n.Nonlinestate = '0' and s.is_del = 0");
        sql.setCallback(Sqls.callback.integer());
        sql.setParam("userName", userName);
        dao.execute(sql);
        //统计用户绑定的所有非继电器设备
        Sql sql2 = Sqls.create("select count(*) from  network  n left join  sys_user_to_devcie s on n.Ncode = s.Ncode  where s.user_name =@userName and n.device_type not in ('2','9') and s.is_del = 0");
        sql2.setCallback(Sqls.callback.integer());
        sql2.setParam("userName", userName);
        dao.execute(sql);
        dao.execute(sql2);
        hashMap.put("deviceCount", sql2.getInt());
        hashMap.put("offline", sql.getInt());
        return hashMap;
    }

    /**
     * @return java.util.List<com.jxctdzkj.cloudplatform.bean.DeviceBean>
     * @Author huangwei
     * @Description //TODO 获取农场下的设备列表（非继电器）
     * @Date 2019/10/23
     * @Param [page, size, deviceNumber, userGroupBeans]
     **/
    @Override
    public List<DeviceBean> getFarmDeviceListNewTwo(int page, int size, String deviceNumber, List<UserGroupBean> userGroupBeans) throws Exception {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        Pager pager = dao.createPager(page, size);
        Sql sql = null;
        if (StringUtils.isBlank(deviceNumber)) {
            sql = Sqls.create(" SELECT distinct u.*, d.Nserson_type as type, d.device_type as device_type , d.Nsensor_data as data,d.Nonlinestate as onLineState,d.Nrecord_time as time,d.template_id as template_id FROM network d , sys_user_to_devcie u  where u.user_name =@userName and is_del=0 and d.Ncode = u.Ncode and (u.group_id = @groupId1 or u.group_id = @groupId2) and d.device_type not in ('2','9')");
        } else {
            sql = Sqls.create(" SELECT distinct u.*, d.Nserson_type as type, d.device_type as device_type,d.Nsensor_data as data,d.Nonlinestate as onLineState,d.Nrecord_time as time,d.template_id as template_id FROM network d , sys_user_to_devcie u  where u.user_name =@userName and u.Ncode LIKE @ncode and is_del=0 and d.Ncode = u.Ncode and (u.group_id = @groupId1 or u.group_id = @groupId2) and d.device_type not in ('2','9')");
            sql.params().set("ncode", "%" + deviceNumber + "%");
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

                list.add(deviceBean);
            }
            return list;
        });
        sql.setPager(pager);
        sql.params().set("userName", userName);
        sql.params().set("groupId1", userGroupBeans.get(0).getId());
        sql.params().set("groupId2", userGroupBeans.get(1).getId());
        dao.execute(sql);
        return sql.getList(DeviceBean.class);
    }

    @Deprecated
    @Override
    public ResultObject getDeviceByScreenValue(int page, int size, String areaId, String from, String to) {
        String userName = ControllerHelper.getLoginUserName();
        ArrayList<Object> objectList = new ArrayList<>();
        Pager pager = dao.createPager(page, size);
        FarmInfoBean farm = dao.fetch(FarmInfoBean.class, Cnd.where("id", "=", areaId));
        if (farm == null) {
            return ResultObject.apiError("农场不存在");
        }
        //根据地区查出所有设备
        List<UserGroupBean> userGroupBeans = dao.query(UserGroupBean.class, Cnd.where("parent_id", "=", farm.getGroupId()).asc("id"));
        if (userGroupBeans.size() < 2) {
            return ResultObject.apiError("农场设备分组缺失");
        }
        String deviceNumber = null;
        //获取地区的设备
        try {
            List<DeviceBean> farmDeviceList = newFarmInfoService.getFarmDeviceListNew(page, size, deviceNumber, userGroupBeans);
            //对地区设备进行遍历(是否报警)
            for (DeviceBean device : farmDeviceList) {
                HashMap<String, List<TriggerBean>> map = new HashMap<>();
                //获取设备的报警情况
                List<TriggerBean> query = dao.query(TriggerBean.class, Cnd.where("user_name", "=", userName).and("alarm_time", ">", from)
                        .and("alarm_time", "<", to)
                        .and("is_del", "=", 0)
                        .and(" Ncode", "=", device.getDeviceNumber()), pager);
                map.put(device.getDeviceNumber(), query);
                objectList.add(map);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return ResultObject.okList(objectList);
    }

    /**
     * @return com.jxctdzkj.cloudplatform.utils.ResultObject
     * @Author huangwei
     * @Description //TODO 根据设备查询其所在地区
     * @Date 2019/10/23
     * @Param [deviceNumber]
     **/
    @Override
    public ResultObject getAreaByDevice(String deviceNumber) {
        //根据设备查询地区
        FarmInfoBean farm = new FarmInfoBean();
        String loginUserName = ControllerHelper.getLoginUserName();
        UserDeviceBean fetch = dao.fetch(UserDeviceBean.class, Cnd.where("Ncode", "=", deviceNumber).and("user_name", "=", loginUserName).and("is_del", "=", "0"));
        if (fetch != null) {
            long groupId = fetch.getGroupId();
            UserGroupBean id = dao.fetch(UserGroupBean.class, Cnd.where("id", "=", groupId));
            if (id != null) {
                long l = id.getpId();
                farm = dao.fetch(FarmInfoBean.class, Cnd.where("group_id", "=", l));
            }
        }
        return ResultObject.ok(farm);
    }

    /**
     * @return com.jxctdzkj.cloudplatform.utils.ResultObject
     * @Author huangwei
     * @Description //TODO 用户管理下 查看所有设备中删除功能
     * @Date 2019/10/23
     * @Param [id]
     **/
    @Override
    public ResultObject delDeviceByUser(String id) {
        UserDeviceBean deviceBean = dao.fetch(UserDeviceBean.class, Cnd.where("id", "=", id));
        //if(deviceBean!=null) {
        //    int i = dao.delete(deviceBean);
        //     if(i>0){
        //         return  ResultObject.ok();
        //     }
        //}
        if (deviceBean != null) {
            deviceBean.setIsDel(1);
        }
        int i = dao.update(deviceBean);
        if (i > 0) {
            return ResultObject.ok();
        }
        return ResultObject.apiError("删除失败");
    }

    /**
     * @return com.jxctdzkj.cloudplatform.utils.ResultObject
     * @Author huangwei
     * @Description //TODO 查看所有报警信息（实时报警信息）
     * @Date 2019/10/23
     * @Param [page, size, areaId]
     **/
    @Override
    public ResultObject getDeviceAlarm(int page, int size, String areaId) {
        String userName = ControllerHelper.getLoginUserName();
        Date date = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(calendar.DATE, 0);//如果把0修改为-1就代表昨天
        date = calendar.getTime();
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        SimpleDateFormat formatTwo = new SimpleDateFormat("yyyy-MM-dd");
        String to = format.format(date);
        String from = formatTwo.format(date);
        from = from + " 00:00:00";
        String number = null;
        String deviceName = null;
        List<TriggerBean> query = dao.query(TriggerBean.class, Cnd.where("group_id", "=", areaId)
                .and("alarm_time", ">", from)
                .and("alarm_time", "<", to).desc("alarm_time"), new Pager(page, size));
        //循环获取设备名称
        for (TriggerBean trigger : query) {
            number = trigger.getDeviceNumber();
            UserDeviceBean deviceBean = dao.fetch(UserDeviceBean.class, Cnd.where("user_name", "=", userName).and("Ncode", "=", number));
            if (deviceBean != null) {
                deviceName = deviceBean.getDeviceName();
                trigger.setAddress(deviceName);
            }
        }
        return ResultObject.okList(query, page, size);
    }

    //获取设备最新的报警信息
    @Override
    public ResultObject getAlarmByDevice(String deviceNumber, String from, String to) {
        TriggerBean fetch = dao.fetch(TriggerBean.class, Cnd.where("Ncode", "=", deviceNumber)
                .and("alarm_time", ">", from).and("alarm_time", "<", to).desc("alarm_time"));
        return ResultObject.ok(fetch);
    }

    @Override
    public ResultObject saveDevice(String userName, String deviceName, String deviceNumber, String devicePassword, Double longitude, Double latitude) {
        SysUserBean userBean = dao.fetch(SysUserBean.class, Cnd.where("user_name", "=", userName));
        if (userBean != null) {
            // 设备判断
            DeviceBean deviceBean = dao.fetch(DeviceBean.class, Cnd.where("nCode", "=", deviceNumber));
            if (deviceBean == null) {
                return ResultObject.apiError("设备不存在");
            }
            UserDeviceBean userDeviceBean = dao.fetch(UserDeviceBean.class, Cnd.where("nCode", "=", deviceNumber).and("user_name", "=", userName).and("is_del", "=", "0"));
            if (userDeviceBean != null) {
                return ResultObject.apiError("该设备已经被绑定");
            }
            if (latitude == 0 || longitude == 0 || latitude > longitude) {
                //return ResultObject.apiError("经纬度错误");
                return ResultObject.apiError("err27");
            }
            UserDeviceBean newDeviceBean = new UserDeviceBean();
            newDeviceBean.setUserName(userName);
            newDeviceBean.setDeviceName(deviceName);
            newDeviceBean.setDeviceNumber(deviceNumber);
            newDeviceBean.setCreateTime(Utils.getCurrentTimestamp());
            newDeviceBean.setDevicePassword(devicePassword);
            newDeviceBean.setLongitude(longitude);
            newDeviceBean.setLatitude(latitude);
            dao.insert(newDeviceBean);
            return ResultObject.ok("ok2");
        }
        return ResultObject.apiError("error10");
    }

    @Override
    public ResultObject getSensorList(int page, int size, String sensorName) throws Exception {
        Pager pager = new Pager(page, size);
        Cnd cnd = null;
        if (StringUtils.isNotBlank(sensorName)) {
            cnd = Cnd.where("tname", "like", "%" + sensorName + "%");
        }
        List<SensorTypeBean> list = dao.query(SensorTypeBean.class, cnd, pager);
        int count = dao.count(SensorTypeBean.class, cnd);
        return ResultObject.okList(list, page, size, count);
    }

    @Override
    public ResultObject addSensor(String sensorName, String unit, String coeffcient) {
        SensorTypeBean typeBean = new SensorTypeBean();
        typeBean.setCoeffcient(coeffcient);
        typeBean.setUnit(unit);
        typeBean.setName(sensorName);
        dao.insert(typeBean);
        return ResultObject.ok();
    }

    @Override
    public ResultObject allBoundUser(int page, int size, String deviceNumber, String userName) {
        Pager pager = new Pager(page, size);
        Cnd cnd = Cnd.where("Ncode", "=", deviceNumber).and("is_del", "=", 0);
        if (StringUtils.isNotBlank(userName)) {
            cnd = cnd.and("user_name", "like", "%" + userName + "%");
        }

        List<UserDeviceBean> list = dao.query(UserDeviceBean.class, cnd, pager);
        int count = dao.count(UserDeviceBean.class, cnd);
        return ResultObject.okList(list, page, size, count);
    }

    @Override
    public ResultObject boundSonUser(int page, int size, String userName,String searchName) {
        Pager pager = new Pager(page, size);

        Cnd cnd = Cnd.where("parentuser", "=", userName).and("user_name","!=",userName).and("is_del", "=", 0);
        if (StringUtils.isNotBlank(searchName)) {
            cnd = cnd.and("user_name", "like", "%" + searchName + "%");
        }
        List<SysUserBean> list = dao.query(SysUserBean.class, cnd, pager);
        int count = dao.count(SysUserBean.class, cnd);
        return ResultObject.okList(list, page, size, count);

    }
}
