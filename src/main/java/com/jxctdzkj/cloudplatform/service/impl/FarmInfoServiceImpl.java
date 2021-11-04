package com.jxctdzkj.cloudplatform.service.impl;

import com.jxctdzkj.cloudplatform.bean.*;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.exception.ServiceException;
import com.jxctdzkj.cloudplatform.service.ConditionService;
import com.jxctdzkj.cloudplatform.service.DeviceManageService;
import com.jxctdzkj.cloudplatform.service.FarmInfoService;
import com.jxctdzkj.cloudplatform.service.TimeTaskManageService;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import com.jxctdzkj.cloudplatform.utils.Utils;
import com.jxctdzkj.support.utils.Encrypt;
import com.jxctdzkj.support.utils.TextUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.Chain;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.dao.pager.Pager;
import org.nutz.dao.sql.Sql;
import org.nutz.trans.Trans;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.text.ParseException;
import java.util.*;


@Service
@Slf4j
public class FarmInfoServiceImpl implements FarmInfoService {

    @Autowired
    Dao dao;

    @Autowired
    private TimeTaskManageService timeTaskManageService;

    @Autowired
    ConditionService conditionService;

    @Autowired
    DeviceManageService deviceService;

    @Override
    public ResultObject save(FarmInfoBean bean) throws Exception {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        String userName = userBean.getUserName();
        // 继电器判断
        if (StringUtils.isNotBlank(bean.getRelayNumber())) {
            DeviceBean deviceBean = dao.fetch(DeviceBean.class, Cnd.where("nCode", "=", bean.getRelayNumber()));
            if (deviceBean == null) {
                return ResultObject.apiError("继电器不存在");
            }
            if (!Constant.isRelayDevice(deviceBean.getDeviceType())) {
                return ResultObject.apiError("该设备不是继电器");
            }
            UserDeviceBean userDeviceBean = dao.fetch(UserDeviceBean.class, Cnd.where("nCode", "=", bean.getRelayNumber()).and("user_name", "=", userName));
            if (userDeviceBean == null) {
                return ResultObject.apiError("未绑定该继电器, 请前往设备管理绑定");
            }
        }
        // 摄像头判断
        if (StringUtils.isNotBlank(bean.getCameraNumber())) {
            CameraBean cameraBean = dao.fetch(CameraBean.class, Cnd.where("serial", "=", bean.getCameraNumber()).and("user_name", "=", userName));
            if (cameraBean == null) {
                return ResultObject.apiError("未绑定该摄像头, 请前往摄像头管理绑定");
            }
        }
        // 新增
        if (bean.getId() == 0) {
            bean.setCreateTime(Utils.getCurrentTimestamp());
            bean.setCreateUser(userName);
            bean.setDeleteFlag("0");
            return dao.insert(bean) != null ? ResultObject.ok("success") : ResultObject.apiError("fail");
        } else {

            /**
             *只有一级用户可以修改下级信息，否则无权修改其他人创建的信息
             * 在多级用户管理系统下才会生效
             */
            FarmInfoBean oldBean = dao.fetch(FarmInfoBean.class, Cnd.where("id", "=", bean.getId()));
            if (oldBean != null && userBean.getRole() == 17 && !userName.equals(oldBean.getCreateUser())) {
                return ResultObject.apiError("err120");
            }


            if (oldBean != null) {
                bean.setCreateTime(oldBean.getCreateTime());
                bean.setCreateUser(oldBean.getCreateUser());
                bean.setDeleteFlag(oldBean.getDeleteFlag());
                return dao.update(bean) > 0 ? ResultObject.ok("success") : ResultObject.apiError("fail");
            } else {
                return ResultObject.apiError("fail");
            }
        }
    }

    @Override
    public ResultObject saveFarmDevice(String farmId, String deviceNumber, String deviceName, double longitude, double latitude) throws Exception {
        FarmInfoBean bean = dao.fetch(FarmInfoBean.class, Cnd.where("id", "=", farmId));
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        if (bean != null) {
            // 设备判断
            DeviceBean deviceBean = dao.fetch(DeviceBean.class, Cnd.where("nCode", "=", deviceNumber));
            if (deviceBean == null) {
                return ResultObject.apiError("设备不存在");
            }
            if (Constant.isRelayDevice(deviceBean.getDeviceType())) {
                return ResultObject.apiError("请不要绑定继电器设备");
            }
            UserDeviceBean userDeviceBean = dao.fetch(UserDeviceBean.class, Cnd.where("nCode", "=", deviceNumber).and("user_name", "=", userName).and("is_del", "=", "0"));
            if (userDeviceBean == null) {
                return ResultObject.apiError("未绑定该设备, 请前往设备管理绑定");
            }
            UserDeviceBean oldUserBean = userDeviceBean;

            if (oldUserBean.getGroupId() == Long.valueOf(farmId)) {
                return ResultObject.apiError("该设备已绑定, 请不要重复操作");
            }

//            userDeviceBean = dao.fetch(UserDeviceBean.class, Cnd.where("nCode", "=", deviceNumber).and("user_name", "=", userName).and("group_id", "=", farmId).and("is_del", "=", "0"));
//            if (userDeviceBean != null) {
//                return ResultObject.apiError("该设备已绑定, 请不要重复操作");
//            }

//            //groupId不等于0说明被其他农场绑定了
//            if (oldUserBean.getGroupId() != 0) {
//                return ResultObject.apiError("该设备已被其他农场绑定, 请选择其他设备");
//            }

            oldUserBean.setGroupId(Long.parseLong(farmId));
            oldUserBean.setLatitude(latitude);
            oldUserBean.setLongitude(longitude);
            oldUserBean.setDeviceName(deviceName);
            oldUserBean.setDeviceNumber(deviceNumber);
            oldUserBean.setCreateTime(Utils.getCurrentTimestamp());
            oldUserBean.setUserName(userName);
//            UserDeviceBean udBean = new UserDeviceBean();
//            udBean.setGroupId(Long.parseLong(farmId));
//            udBean.setLatitude(latitude);
//            udBean.setLongitude(longitude);
//            udBean.setDeviceName(deviceName);
//            udBean.setDeviceNumber(deviceNumber);
//            udBean.setCreateTime(Utils.getCurrentTimestamp());
//            udBean.setUserName(userName);
            return dao.update(oldUserBean) > 0 ? ResultObject.ok("success") : ResultObject.apiError("fail");
        } else {
            return ResultObject.apiError("fail");
        }
    }

    @Override
    public ResultObject getFarmInfoList(int page, int size, String farmName) {

        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        Cnd cnd = Cnd.where("create_user", "=", userName).and("delete_flag", "=", "0");
        if (StringUtils.isNotBlank(farmName)) {
            cnd = cnd.and("farm_name", "like", "%" + farmName + "%");
        }
        List<FarmInfoBean> list = dao.query(FarmInfoBean.class, cnd, new Pager(page, size));
        int count = dao.count(FarmInfoBean.class, cnd);
        return ResultObject.okList(list, page, size, count);
    }

    //不分页 扬尘监测地区的地区展示以及模糊搜索
    @Override
    public ResultObject getFarmInfoListNoPage(String farmName) throws Exception {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        Cnd cnd = Cnd.where("create_user", "=", userName).and("delete_flag", "=", "0");
        if (StringUtils.isNotBlank(farmName)) {
            cnd = cnd.and("farm_name", "like", "%" + farmName + "%");
        }
        List<FarmInfoBean> list = dao.query(FarmInfoBean.class, cnd);
        return ResultObject.okList(list);
    }

    @Override
    public List<DeviceBean> getFarmDeviceList(int page, int size, String deviceNumber, String farmId) throws Exception {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        Pager pager = dao.createPager(page, size);
        Sql sql = null;
        if (StringUtils.isBlank(deviceNumber)) {
            sql = Sqls.create(" SELECT distinct u.*, d.Nserson_type as type, d.device_type as device_type , d.Nsensor_data as data,d.Nonlinestate as onLineState,d.Nrecord_time as time,d.template_id as template_id FROM network d , sys_user_to_devcie u  where u.user_name =@userName and is_del=0 and d.Ncode = u.Ncode and u.group_id = @groupId");
//            sql = Sqls.create(" SELECT distinct u.*, d.Nserson_type as type, d.device_type as device_type , d.Nsensor_data as data,d.Nonlinestate as onLineState,d.Nrecord_time as time,d.template_id as template_id FROM network d , sys_user_to_devcie u  where u.user_name =@userName and is_del=0 and d.Ncode = u.Ncode and u.group_id = @groupId");
        } else {
            sql = Sqls.create(" SELECT distinct u.*, d.Nserson_type as type, d.device_type as device_type,d.Nsensor_data as data,d.Nonlinestate as onLineState,d.Nrecord_time as time,d.template_id as template_id FROM network d , sys_user_to_devcie u  where u.user_name =@userName and u.Ncode = @ncode and is_del=0 and d.Ncode = u.Ncode and u.group_id = @groupId");
//            sql = Sqls.create(" SELECT distinct u.*, d.Nserson_type as type, d.device_type as device_type,d.Nsensor_data as data,d.Nonlinestate as onLineState,d.Nrecord_time as time,d.template_id as template_id FROM network d , sys_user_to_devcie u  where u.user_name =@userName and u.Ncode = @ncode and is_del=0 and d.Ncode = u.Ncode and u.group_id = @groupId");
            sql.params().set("ncode", deviceNumber);
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
        sql.params().set("groupId", farmId);
        dao.execute(sql);
        return sql.getList(DeviceBean.class);
    }

    @Override
    public int getFarmDeviceListCount(String deviceNumber, String farmId) throws Exception {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        Sql sql = null;
        if (StringUtils.isBlank(deviceNumber)) {
            sql = Sqls.create(" SELECT count(1) FROM network d , sys_user_to_devcie u  where u.user_name =@userName and is_del=0 and d.Ncode = u.Ncode and u.group_id = @groupId and u.is_del=0");
        } else {
            sql = Sqls.create(" SELECT count(1) FROM network d , sys_user_to_devcie u  where u.user_name =@userName and u.Ncode = @ncode and is_del=0 and d.Ncode = u.Ncode and u.group_id = @groupId and u.is_del=0");
            sql.params().set("ncode", deviceNumber);
        }
        sql.setCallback(Sqls.callback.integer());
        sql.params().set("userName", userName);
        sql.params().set("groupId", farmId);
        dao.execute(sql);
        return sql.getInt();
    }

    @Override
    public ResultObject del(String id) throws Exception {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        FarmInfoBean bean = dao.fetch(FarmInfoBean.class, Cnd.where("id", "=", id));
        String userName = userBean.getUserName();
        if (bean != null) {
            /**
             * 只有一级用户可以删除下级信息，否则无权删除其他人创建的信息
             * 仅针对多级用户系统
             */
//            FarmInfoBean oldBean = dao.fetch(FarmInfoBean.class, Cnd.where("id", "=", id));
            if (userBean.getRole() == 17 && !userName.equals(bean.getCreateUser())) {
                return ResultObject.apiError("err124");
            }

            /*
             * 新增逻辑判断，如果当前删除农场下有农作物且农作物删除状态为0，无法删除农场
             * 李英豪
             */
            List<FarmCropsBean> list = dao.query(
                    FarmCropsBean.class,
                    Cnd.where("farm_info_id", "=", id).and("delete_flag", "=", "0"));
            if (list.size() > 0) {
                return ResultObject.apiError("err125");
            }


            bean.setDeleteFlag("1");
            //删除土地使用信息，仅针对多级用户系统
            dao.clear(LandUseBean.class, Cnd.where("farm_id", "=", id));
            return dao.update(bean) > 0 ? ResultObject.ok("success") : ResultObject.apiError("fail");
        } else {
            return ResultObject.apiError("fail");
        }
    }

    @Override
    public Object delFarmDevice(String id) {
        try {
            UserDeviceBean bean = dao.fetch(UserDeviceBean.class, Cnd.where("id", "=", id));
            bean.setGroupId(0);
            dao.update(bean);
            return ResultObject.ok("success");
        } catch (Exception e) {
            return ResultObject.apiError("failed");
        }
    }

    //---------------------------------------------------------------------------
    //                         新版农场（大棚）管理接口
    //---------------------------------------------------------------------------
    @Override
    public ResultObject saveOrUpdate(FarmInfoBean bean) {

        Trans.exec(() -> {
            try {
                SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
                String userName = userBean.getUserName();
                // 新增
                if (bean.getId() == 0) {
                    /**
                     * 初始化三个分组
                     */
                    //顶级农场分组
                    UserGroupBean indexFarmGroupBean = new UserGroupBean(bean.getFarmName(), userName, 0, Utils.getCurrentTimestamp());
                    dao.insert(indexFarmGroupBean);

                    //添加的顺序为继电器设备分组-》采集设备分组
                    //继电器设备分组
                    UserGroupBean relayGroupBean = new UserGroupBean("继电器设备", userName, indexFarmGroupBean.getId(), Utils.getCurrentTimestamp());
                    if (dao.insert(relayGroupBean) != null) {
                        //采集设备分组
                        UserGroupBean dataDeviceGroupBean = new UserGroupBean("采集设备", userName, indexFarmGroupBean.getId(), Utils.getCurrentTimestamp());
                        dao.insert(dataDeviceGroupBean);
                    }
                    //创建农场
                    bean.setCreateTime(Utils.getCurrentTimestamp());
                    bean.setCreateUser(userName);
                    bean.setDeleteFlag("0");
                    bean.setGroupId(indexFarmGroupBean.getId());

                    if (dao.insert(bean) == null) {
                        throw new ServiceException("农场添加失败");
                    }
                } else {
                    /**
                     *只有一级用户可以修改下级信息，否则无权修改其他人创建的信息
                     * 在多级用户管理系统下才会生效
                     */
                    FarmInfoBean oldBean = dao.fetch(FarmInfoBean.class, Cnd.where("id", "=", bean.getId()));
                    if (oldBean != null && userBean.getRole() == 17 && !userName.equals(oldBean.getCreateUser())) {
                        throw new ServiceException("您不是该条记录的创建者，无权修改");
                    }
                    String oldFarmName = oldBean.getFarmName();
                    if (oldBean != null) {
                        bean.setCreateTime(oldBean.getCreateTime());
                        bean.setCreateUser(oldBean.getCreateUser());
                        bean.setDeleteFlag(oldBean.getDeleteFlag());
                        bean.setX(oldBean.getX());
                        bean.setY(oldBean.getY());
                        bean.setGroupId(oldBean.getGroupId());
                        bean.setStatus(oldBean.getStatus());
                        bean.setIrrigationTime(oldBean.getIrrigationTime());
                        if (dao.update(bean) <= 0) {
                            throw new ServiceException("农场更新失败");
                        }
                    } else {
                        throw new ServiceException("农场不存在");
                    }

                    //如果农场名称更改，则继续更改对应的根设备分组名称
                    if (!bean.getFarmName().equals(oldFarmName)) {
                        UserGroupBean userGroupBean = dao.fetch(UserGroupBean.class, oldBean.getGroupId());
                        userGroupBean.setGroupName(bean.getFarmName());
                        if (dao.update(userGroupBean) <= 0) {
                            throw new ServiceException("农场根设备分组更新失败");
                        }
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
                if (e instanceof ServiceException) {
                    throw new RuntimeException(e.getMessage());
                }
                throw new RuntimeException("操作失败");
            }
        });
        return ResultObject.ok().data(bean);
    }

    @Override
    public ResultObject boundDevice(String farmId, String deviceNumber, String deviceName, double longitude, double latitude) throws Exception {
        FarmInfoBean bean = dao.fetch(FarmInfoBean.class, Cnd.where("id", "=", farmId));
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        String userName = userBean.getUserName();
        if (bean == null) {
            return ResultObject.apiError("fail");
        }
        // 设备判断
        DeviceBean deviceBean = dao.fetch(DeviceBean.class, Cnd.where("nCode", "=", deviceNumber));
        if (deviceBean == null) {
            return ResultObject.apiError("err24");//设备不存在
        }

        UserDeviceBean userDeviceBean = dao.fetch(UserDeviceBean.class, Cnd.where("Ncode", "=", deviceNumber).and("user_name", "=", userName).and("is_del", "=", "0"));
        if (userDeviceBean == null) {
            //管理员绑定设备将首先添加到user_to_device表
            if (userBean.getLevel() <= Constant.Define.ROLE_0) {
                userDeviceBean = new UserDeviceBean();
                userDeviceBean.setUserName(userName);
                userDeviceBean.setDeviceNumber(deviceNumber);
                userDeviceBean.setDeviceName(deviceName);
                //设置分组
                userDeviceBean.setGroupId(0);
                if (!TextUtils.isEmpty(deviceBean.getPassword())) {
                    userDeviceBean.setDevicePassword(Encrypt.e(deviceBean.getPassword()));
                }
                userDeviceBean.setCreateTime(new Timestamp(System.currentTimeMillis()));
                userDeviceBean.setLatitude(deviceBean.getLatitude());
                userDeviceBean.setLongitude(deviceBean.getLongitude());
                userDeviceBean = dao.insert(userDeviceBean);
                if (userDeviceBean == null) {
                    return ResultObject.apiError("err172");
                }
            } else {
                return ResultObject.apiError("err36");//未绑定该设备, 请前往设备管理绑定
            }
        }

        if (deviceBean.getDeviceType() != Constant.DeviceType.HUMIDITY && deviceBean.getDeviceType() != Constant.DeviceType.RELAY) {
            return ResultObject.apiError("err166");//该设备不是继电器或采集设备
        }

        UserDeviceBean oldUserBean = userDeviceBean;

        //查询当前农场分组下的所有子分组
        List<UserGroupBean> userGroupBeans = dao.query(UserGroupBean.class, Cnd.where("parent_id", "=", bean.getGroupId()).asc("id"));
//        if (userGroupBeans.size() < 2) {
//            throw new RuntimeException("err160");//农场设备分组缺失
//        }

        //判断是否已经被该农场绑定
//        if (oldUserBean.getGroupId() == userGroupBeans.get(0).getId() ||
//                oldUserBean.getGroupId() == userGroupBeans.get(1).getId()) {
//            return ResultObject.apiError("err161");//该设备已绑定, 请不要重复操作
//        }

//            //判断是否被其他农场绑定
//            if (oldUserBean.getGroupId() != 0 && oldUserBean.getGroupId() != userGroupBeans.get(0).getId() && oldUserBean.getGroupId() != userGroupBeans.get(1).getId()) {
//                return ResultObject.apiError("err162");//该设备已被其他农场绑定
//            }

//        oldUserBean.setGroupId(deviceBean.getDeviceType() == Constant.DeviceType.RELAY ? userGroupBeans.get(0).getId() : userGroupBeans.get(1).getId());
        oldUserBean.setLatitude(latitude);
        oldUserBean.setLongitude(longitude);
        oldUserBean.setDeviceName(deviceName);
        oldUserBean.setDeviceNumber(deviceNumber);
        oldUserBean.setCreateTime(Utils.getCurrentTimestamp());
        oldUserBean.setUserName(userName);
        return dao.update(oldUserBean) > 0 ? ResultObject.ok("success") : ResultObject.apiError("fail");
    }

    @Override
    public List<DeviceBean> getFarmDeviceListNew(int page, int size, String deviceNumber, List<UserGroupBean> userGroupBeans) throws Exception {

        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        //如果是多级农业解决办法（否则子用户的设备不是上级添加无法查看）
        if (!userGroupBeans.get(0).getUserName().equals(userName)) {
            userName = userGroupBeans.get(0).getUserName();
        }
        Pager pager = dao.createPager(page, size);
        Sql sql = null;
        if (StringUtils.isBlank(deviceNumber)) {
            sql = Sqls.create(" SELECT distinct u.*, d.Nserson_type as type, d.device_type as device_type , d.Nsensor_data as data,d.Nonlinestate as onLineState,d.Nrecord_time as time,d.template_id as template_id FROM network d , sys_user_to_devcie u  where u.user_name =@userName and is_del=0 and d.Ncode = u.Ncode and (u.group_id = @groupId1 or u.group_id = @groupId2)");
        } else {
            sql = Sqls.create(" SELECT distinct u.*, d.Nserson_type as type, d.device_type as device_type,d.Nsensor_data as data,d.Nonlinestate as onLineState,d.Nrecord_time as time,d.template_id as template_id FROM network d , sys_user_to_devcie u  where u.user_name =@userName and u.Ncode LIKE @ncode and is_del=0 and d.Ncode = u.Ncode and (u.group_id = @groupId1 or u.group_id = @groupId2)");
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

    @Override
    public int getFarmDeviceListCountNew(String deviceNumber, List<UserGroupBean> userGroupBeans) throws Exception {

        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        if (!userGroupBeans.get(0).getUserName().equals(userName)) {
            userName = userGroupBeans.get(0).getUserName();
        }
        Sql sql = null;
        if (StringUtils.isBlank(deviceNumber)) {
            sql = Sqls.create(" SELECT count(1) FROM network d , sys_user_to_devcie u  where u.user_name =@userName and is_del=0 and d.Ncode = u.Ncode and (u.group_id = @groupId1 or u.group_id = @groupId2 ) and u.is_del=0");
        } else {
            sql = Sqls.create(" SELECT count(1) FROM network d , sys_user_to_devcie u  where u.user_name =@userName and u.Ncode = @ncode and is_del=0 and d.Ncode = u.Ncode and (u.group_id = @groupId1 or u.group_id = @groupId2 ) and u.is_del=0");
            sql.params().set("ncode", deviceNumber);
        }
        sql.setCallback(Sqls.callback.integer());
        sql.params().set("userName", userName);
        sql.params().set("groupId1", userGroupBeans.get(0).getId());
        sql.params().set("groupId2", userGroupBeans.get(1).getId());
        dao.execute(sql);
        return sql.getInt();
    }

    @Override
    @Transactional
    public void deleteFarm(String id) throws Exception {
        try {
            SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
            String userName = userBean.getUserName();
            FarmInfoBean bean = dao.fetch(FarmInfoBean.class, Cnd.where("id", "=", id));

            if (bean == null) {
                throw new ServiceException("农场不存在");
            }

            /**
             * 只有一级用户可以删除下级信息，否则无权删除其他人创建的信息
             * 仅针对多级用户系统
             */
//            FarmInfoBean oldBean = dao.fetch(FarmInfoBean.class, Cnd.where("id", "=", id));
            if (userBean.getRole() == 17 && !userName.equals(bean.getCreateUser())) {
                throw new ServiceException("您无权删除其他人创建的记录");
            }

            /*
             * 新增逻辑判断，如果当前删除农场下有农作物且农作物删除状态为0，无法删除农场
             * 李英豪
             */
            int cropCount = dao.count(FarmCropsBean.class, Cnd.where("farm_info_id", "=", id).and("delete_flag", "=", "0"));
            if (cropCount > 0) {
                throw new ServiceException("该农场下有农产品信息，请先删除农产品");
            }

            //如果该农场下绑定有设备，则不能删除
            if (hasBoundedDevice(id)) {
                throw new ServiceException("该农场下有未解绑设备");
            }

            //如果该农场下绑定有摄像头，则不能删除
            int cameraCount = dao.count(CameraApplicationBean.class, Cnd.where("is_del", "=", "0").and("app_id", "=", id).and("app_type", "=", Constant.CameraAppType.DAPENG));
            if (cameraCount > 0) {
                throw new ServiceException("该农场下有未解绑摄像头");
            }

            //删除土地使用信息，仅针对多级用户系统
            dao.clear(LandUseBean.class, Cnd.where("farm_id", "=", id));

            //删除其下所有设备分组
            dao.update(UserGroupBean.class, Chain.make("is_del", 1), Cnd.where("parent_id", "=", bean.getGroupId()));
            //删除农场顶级设备分组
            dao.update(UserGroupBean.class, Chain.make("is_del", 1), Cnd.where("id", "=", bean.getGroupId()));

            //标记农场为已删除
            bean.setDeleteFlag("1");
            dao.update(bean);
        } catch (Exception e) {
            log.error(e.toString());
            throw e;
        }
    }

    /**
     * 修改大棚状态
     *
     * @param farmId         大棚id
     * @param status         大棚状态
     * @param irrigationTime 任务开始时间
     * @param duration       任务持续时长
     * @return
     */
    @Override
    public ResultObject setStatus(String farmId, String status, String irrigationTime, String duration) {
        try {
            FarmInfoBean bean = dao.fetch(FarmInfoBean.class, Cnd.where("id", "=", farmId));

            if (bean == null) {
                return ResultObject.apiError("err167");
            }

            if (StringUtils.isNotBlank(status)) {
                bean.setStatus(status);
            }

            if (StringUtils.isNotBlank(status)) {
                try {
                    Timestamp dateTime = StringUtils.isBlank(irrigationTime) ?
                            Utils.getCurrentTimestamp() : Timestamp.valueOf(irrigationTime);
                    bean.setIrrigationTime(dateTime);
                } catch (Exception e) {
                    log.error(e.toString());
                    return ResultObject.apiError("err169");
                }
            }
            if (StringUtils.isNotBlank(duration)) {
                bean.setDuration(duration);
            }

            dao.update(bean);
        } catch (Exception e) {
            return ResultObject.apiError("err168");
        }
        return ResultObject.ok("success");
    }

    /**
     * 判断农场是否绑定设备
     *
     * @param farmId
     * @return
     */
    @Override
    public Boolean hasBoundedDevice(String farmId) {
        try {
            FarmInfoBean bean = dao.fetch(FarmInfoBean.class, Cnd.where("id", "=", farmId));
            if (bean == null) {
                return false;
            }

            //查询当前农场分组下的所有子分组
            List<UserGroupBean> userGroupBeans = dao.query(UserGroupBean.class, Cnd.where("parent_id", "=", bean.getGroupId()).asc("id"));
            if (userGroupBeans.size() < 2) {
                log.error("农场设备分组丢失");
                return false;//允许删除
            }

            return getFarmDeviceListCountNew(null, userGroupBeans) > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return true;//禁止删除
        }
    }


    /**
     * 前端页面通过点击对应位置添加农场
     *
     * @return
     */
    @Override
    public Object addFarmByFront(FarmInfoBean farmInfoBean) {
        return saveOrUpdate(farmInfoBean);
    }

    /**
     * 查询当前大棚下未收获的且成熟最早的农产品
     *
     * @param farmId
     * @return
     */
    @Override
    public Object getEarliestMatureCrop(String farmId) {
        try {
            String userName = ControllerHelper.getLoginUserName();
            FarmCropsBean farmCropsBean = dao.fetch(FarmCropsBean.class,
                    Cnd.where("delete_flag", "=", "0")
                            .and("create_user", "=", userName)
                            .and("harvest_date", ">=", Utils.getCurrentTimestamp())
                            .and("farm_info_id", "=", farmId)
                            .limit(1, 0)
                            .orderBy("harvest_date", "ASC"));
            return ResultObject.ok(farmCropsBean);
        } catch (Exception e) {
            log.error(e.toString());
            return ResultObject.apiError("failed");
        }

    }


    /**
     * 获取当前用户所有有异常状态的农场
     *
     * @return
     */
    @Override
    public Object getFarmsException() {
        List<FarmInfoBean> farms = new LinkedList<>();

        try {
            String userName = ControllerHelper.getLoginUserName();
            //搜索报警记录和报警传感器对应的型号
//            Sql sql = Sqls.create("SELECT DISTINCT h.Ncode, h.sensor_code,expression,s.sensor_name FROM trigger_alarm_history h, sensor s WHERE s.sensor_code = h.sensor_code " +
//                    "AND h.state = 0 AND h.is_del = 0 AND h.user_name = @userName limit 20");
            Sql sql = Sqls.create("SELECT DISTINCT h.Ncode, h.sensor_code,expression,s.sensor_name FROM trigger_alarm_history h, sensor s WHERE s.sensor_code = h.sensor_code " +
                    "AND h.is_del = 0 AND h.user_name = @userName limit 20");
            sql.setParam("userName", userName);
            sql.setCallback((conn, rs, sql1) -> {
                List<TriggerHistoryBean> list = new LinkedList<TriggerHistoryBean>();
                while (rs.next()) {
                    TriggerHistoryBean triggerHistoryBean = new TriggerHistoryBean();
                    triggerHistoryBean.setDeviceNumber(rs.getString("Ncode"));
                    triggerHistoryBean.setSensorCode(rs.getString("sensor_code"));
                    triggerHistoryBean.setExpression(rs.getString("expression").replace("value", rs.getString("sensor_name")));
                    list.add(triggerHistoryBean);
                }
                return list;
            });
            dao.execute(sql);
            List<TriggerHistoryBean> list = sql.getList(TriggerHistoryBean.class);
            HashMap<String, Object> map = new HashMap<>();

            //在此过滤设备号，每个设备号仅保留一个
            for (TriggerHistoryBean bean : list) {
                System.out.println(bean);
                if (!TextUtils.isEmpty(bean.getDeviceNumber()) && !map.containsKey(bean.getDeviceNumber())) {
                    map.put(bean.getDeviceNumber(), bean);
                }
            }
            Sql farmSql = null;
            //根据报警设备搜索农场信息
            for (String key : map.keySet()) {
                farmSql = Sqls.create("SELECT id,farm_name,x,y FROM farm_info WHERE group_id = (SELECT g.parent_id FROM sys_user_to_group  g,sys_user_to_devcie ud WHERE ud.group_id=g.id AND ud.is_del=0 AND ud.user_name=@userName AND ud.Ncode = @device)");
                farmSql.setParam("userName", userName);
                farmSql.setParam("device", key);
                farmSql.setCallback(Sqls.callback.entity());
                farmSql.setEntity(dao.getEntity(FarmInfoBean.class));
                dao.execute(farmSql);
                FarmInfoBean farmInfoBean = (FarmInfoBean) farmSql.getResult();
                if (farmInfoBean == null) continue;
                farmInfoBean.setRemark(((TriggerHistoryBean) map.get(key)).getExpression());
                farms.add(farmInfoBean);
                log.info(farmInfoBean.getId() + " " + farmInfoBean.getFarmName() + " " + farmInfoBean.getStatus());
            }
        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.toString());
        }
        return ResultObject.okList(farms);
    }

    /**
     * 查询不依附于具体大棚的摄像头
     *
     * @return
     */
    @Override
    public List<CameraBean> getCamerasOutOfGreenhouse(int page, int size) {
        String userName = ControllerHelper.getLoginUserName();
        Pager pager = dao.createPager(page, size);
        Sql sql = Sqls.create("SELECT * FROM camera WHERE id NOT IN ( SELECT DISTINCT camera_id FROM camera_application WHERE user_name = @userName1 AND is_del = 0 AND camera_id IS NOT NULL) AND delete_flag = 0 AND user_name = @userName2");
        sql.setCallback((conn, rs, sql1) -> {
            List<CameraBean> list = new LinkedList<CameraBean>();
            while (rs.next()) {
                CameraBean cameraBean = new CameraBean();
                cameraBean.setId(rs.getLong("id"));
                cameraBean.setName(rs.getString("name"));
                cameraBean.setNcode(rs.getString("ncode"));
                cameraBean.setSerial(rs.getString("serial"));
                cameraBean.setValidateCode(rs.getString("validate_code"));
                cameraBean.setHls(rs.getString("hls"));
                cameraBean.setHlsHd(rs.getString("hlsHd"));
                cameraBean.setRtmp(rs.getString("rtmp"));
                cameraBean.setRtmpHd(rs.getString("rtmpHd"));
                cameraBean.setUserName(rs.getString("user_name"));
                cameraBean.setCameraType(rs.getString("camera_type"));
                cameraBean.setChannelNo(rs.getString("channelNo"));
                cameraBean.setExpireTime(rs.getTimestamp("expire_time"));
                cameraBean.setFlv(rs.getString("flv"));
                cameraBean.setFlvHd(rs.getString("flvHd"));

                list.add(cameraBean);
            }
            return list;
        });
        sql.setPager(pager);
        sql.params().set("userName1", userName);
        sql.params().set("userName2", userName);
        dao.execute(sql);
        return sql.getList(CameraBean.class);
    }

    @Override
    public int getDevicesOutOfGreenhouseCount() {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        Sql sql = Sqls.create(" SELECT count(1) FROM network d , sys_user_to_devcie u  where u.user_name =@userName and is_del=0 and d.Ncode = u.Ncode and u.group_id = 0");
        sql.setCallback(Sqls.callback.integer());
        sql.params().set("userName", userName);
        dao.execute(sql);
        return sql.getInt();
    }

    /**
     * 获取不附属于任何大棚的设备
     *
     * @param page
     * @param size
     * @return
     */
    public List<DeviceBean> getDevicesOutOfGreenhouse(int page, int size) {
        String userName = ControllerHelper.getLoginUserName();
        Pager pager = dao.createPager(page, size);
        Sql sql = Sqls.create(" SELECT distinct u.*, d.Nserson_type as type, d.device_type as device_type,d.Nsensor_data as data,d.Nonlinestate as onLineState,d.Nrecord_time as time,d.template_id as template_id FROM network d , sys_user_to_devcie u  where u.user_name =@userName and is_del=0 and d.Ncode = u.Ncode and u.group_id = 0");
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
        for (DeviceBean bean : sql.getList(DeviceBean.class)) {
            System.out.println(bean);
        }
        return sql.getList(DeviceBean.class);
    }

    @Override
    public int getCameraOutOfGreenhouseCount() {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        Sql sql = Sqls.create(" SELECT count(1) FROM camera WHERE serial NOT IN ( SELECT DISTINCT serial FROM camera_application WHERE user_name = @userName1 AND is_del = 0 ) AND delete_flag = 0 AND user_name = @userName2");
        sql.setCallback(Sqls.callback.integer());
        sql.params().set("userName1", userName);
        sql.params().set("userName2", userName);
        dao.execute(sql);
        return sql.getInt();
    }


    private double getWaterYieldByDeviceNumber(String deviceNumber) throws ServiceException {
        DeviceBean deviceBean = deviceService.getDeviceBean(deviceNumber);
        if (deviceNumber == null) {
            throw new ServiceException("err31");
        }
        double res;
        try {
            String data = deviceBean.getData();
            String[] dataArr = data.split("\\|");
            res = Double.valueOf(dataArr[7].replaceAll("[^0-9.]", ""));
        } catch (Exception e) {
            throw new ServiceException("err62");
        }
        return res;
    }

    private TimedTaskManageBean newTimerBean(String timeStampStr, String taskName, String deviceNumber, String command, String userName) throws Exception {
        String[] taskTimeArr, dateArr;
        int year, month, day;
        String time;
        taskTimeArr = timeStampStr.split("\\s+");
        dateArr = taskTimeArr[0].split("-");
        year = Integer.valueOf(dateArr[0]);
        month = Integer.valueOf(dateArr[1]);
        day = Integer.valueOf(dateArr[2]);
        time = taskTimeArr[1];

        return new TimedTaskManageBean(taskName, deviceNumber, "1", year, month, day, time, command, Utils.getCurrentTimestamp(), userName);
    }

    /**
     * 设置定时任务
     *
     * @param period         定时任务延迟执行毫秒数
     * @param farmId         大棚id
     * @param status         大棚状态
     * @param irrigationTime 任务执行时间
     * @param duration       任务时长
     */
    private void startTimer(long period, String farmId, String status, String irrigationTime, String duration) {
        Timer timer = new Timer();
        timer.schedule(new TimerTask() {
            public void run() {
                setStatus(farmId, status, irrigationTime, duration);
            }
        }, period);// 设定指定的时间time,此处为2000毫秒
    }


}


