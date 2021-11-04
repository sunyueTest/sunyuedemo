package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.*;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.mode.SenorDataMode;
import com.jxctdzkj.cloudplatform.opLog.EnableOpLog;
import com.jxctdzkj.cloudplatform.radis.RedisUtil;
import com.jxctdzkj.cloudplatform.service.impl.DeviceManageServiceImpl;
import com.jxctdzkj.cloudplatform.service.impl.VersionServiceImpl;
import com.jxctdzkj.cloudplatform.utils.*;
import com.jxctdzkj.support.utils.Encrypt;
import com.jxctdzkj.support.utils.TextUtils;
import com.jxctdzkj.support.utils.ThreadPoolUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.session.Session;
import org.nutz.dao.Cnd;
import org.nutz.dao.Condition;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.dao.pager.Pager;
import org.nutz.dao.sql.Sql;
import org.nutz.trans.Atom;
import org.nutz.trans.Trans;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Connection;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * <pre>
 *     author  : FlySand
 *     e-mail  : 1156183505@qq.com
 *     time    : 2018/8/3.
 *     desc    :
 * </pre>
 */
@Slf4j
@RequestMapping({"device"})
@RestController
public class DeviceController {

    @Autowired
    Dao dao;

    @Autowired
    DeviceManageServiceImpl deviceManageService;

    @Autowired
    VersionServiceImpl versionService;

    /**
     * 查询当前设备归属用户
     */
    @RequestMapping(value = "selUser", method = RequestMethod.POST)
    public Object selDeviceForUser(@RequestParam(value = "deviceNumber") String deviceNumer) {

        DeviceBean deviceBean = dao.fetch(DeviceBean.class, deviceNumer);
        if (deviceBean == null) {
            //return ResultObject.apiError("设备不存在");
            return ResultObject.apiError("err24");
        }
        //return ResultObject.ok("查询成功")
        return ResultObject.ok("ok8")
                .data("userName", deviceBean.getUserName());
    }

    /**
     * 添加设备
     */
    @EnableOpLog(Constant.ModifyType.SAVE)
    @RequestMapping(value = "addDevice", method = RequestMethod.POST)
    public Object addDeviceForUser(UserDeviceBean bean) {
        Session session = SecurityUtils.getSubject().getSession();
        log.info("session =" + session);
        String userName = session.getAttribute("user").toString();
        //首先判断当前用户拥有的设备数是否超限
        ResultObject ro = versionService.checkVersionAuthority(userName, "device");
        if (ro.get("state").equals("failed")) {
            return ro;
        }
        DeviceBean deviceBeanss = dao.fetch(DeviceBean.class, bean.getDeviceNumber());

//        2021-11-03修改注释掉
//        if (deviceBean == null) {
//            //return ResultObject.apiError("设备不存在");
//            return ResultObject.apiError("err24");
//        }
//        if (!TextUtils.isEmpty(deviceBean.getPassword()) && !TextUtils.isEmpty(bean.getDevicePassword()) && !deviceBean.getPassword().equals(Encrypt.e(bean.getDevicePassword()))) {
//            //return ResultObject.apiError("密码错误");
//            return ResultObject.apiError("err25");
//        }
        log.info("userName =" + userName);
        //查重
        List<UserDeviceBean> deviceBeans = dao.query(UserDeviceBean.class, Cnd.where("Ncode", "=", bean.getDeviceNumber()).and("user_name", "=", userName).and("is_del", "=", "0"));
        log.info("deviceBeans =" + deviceBeans.size());
        if (deviceBeans.size() > 0) {
            //return ResultObject.apiError("重复绑定");
            return ResultObject.apiError("err26");
        }
        if (bean.getLatitude() == 0 || bean.getLongitude() == 0 || bean.getLatitude() > bean.getLongitude()) {
            //return ResultObject.apiError("经纬度错误");
            return ResultObject.apiError("err27");
        }
        //第一个添加设备的用户为设备的拥有者
        if (TextUtils.isEmpty(userName)) {
            deviceBeanss.setUserName(userName);
            if (!TextUtils.isEmpty(bean.getDevicePassword())) {
                deviceBeanss.setPassword(Encrypt.e(bean.getDevicePassword()));
            }
            if (1 == dao.update(deviceBeanss)) {
                log.info("更新成功  user = " + userName);
            } else {
                log.info("更新失败  user = " + userName);
                //return ResultObject.apiError("初始化设备信息异常");
                return ResultObject.apiError("err28");
            }
        }
        UserDeviceBean userDeviceBean = new UserDeviceBean();
        userDeviceBean.setUserName(userName);
        userDeviceBean.setDeviceNumber(bean.getDeviceNumber());
        userDeviceBean.setDeviceName(bean.getDeviceName());
        //设置分组
        userDeviceBean.setGroupId(bean.getGroupId());
        if (!TextUtils.isEmpty(bean.getDevicePassword())) {
            userDeviceBean.setDevicePassword(Encrypt.e(bean.getDevicePassword()));
        }
        userDeviceBean.setCreateTime(new Timestamp(System.currentTimeMillis()));
        userDeviceBean.setLatitude(bean.getLatitude());
        userDeviceBean.setLongitude(bean.getLongitude());
        DeviceBean deviceBean = new DeviceBean();
        userDeviceBean = dao.insert(userDeviceBean);
        deviceBean.setDeviceNumber(bean.getDeviceNumber());
        deviceBean.setUserName(userName);
        deviceBean.setLatitude(bean.getLatitude());
        deviceBean.setLongitude(bean.getLongitude());
        deviceBean.setName(bean.getDeviceName());
        deviceBean = dao.insert(deviceBean);
        log.info("成功添加 ：" + userDeviceBean);
        //return userDeviceBean == null ? ResultObject.apiError("添加失败") : ResultObject.ok("添加成功");
        return userDeviceBean == null ? ResultObject.apiError("error10") : ResultObject.ok("ok2");
    }

    /**
     * 查询单个设备信息
     */
    @RequestMapping(value = "selDeviceInfo")
    public Object selDeviceInfo(@RequestParam(value = "deviceNumber") String deviceNubmer) {
        DeviceBean deviceBean = dao.fetch(DeviceBean.class, deviceNubmer);
        if (deviceBean == null) {
            //return ResultObject.apiError("设备不存在");
            return ResultObject.apiError("err24");
        }
        String userName = ControllerHelper.getLoginUserName();
        if (ControllerHelper.getLoginUserLevel() > 0) {
            UserDeviceBean userDeviceBean = dao.fetch(UserDeviceBean.class, Cnd.where("Ncode", "=", deviceNubmer).and("user_name", "=", userName).and("is_del", "=", "0"));
            if (userDeviceBean == null) {
                //return ResultObject.apiError("未绑定设备");
                return ResultObject.apiError("err32");
            }
            deviceBean.setName(userDeviceBean.getName());
            deviceBean.setLatitude(userDeviceBean.getLatitude());
            deviceBean.setLongitude(userDeviceBean.getLongitude());
        }

        return ResultObject.ok(deviceBean);
    }

    /**
     * 查询设备列表
     */
    @RequestMapping(value = "selDeviceList")
    public Object selDeviceList(
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "100") int size) {
        Pager pager = dao.createPager(page, size);
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        String userName = userBean.getUserName();
        List<UserDeviceBean> deviceBeans = new ArrayList<>();
        if (userBean.getLevel() <= Constant.Define.ROLE_0) {//系统管理员显示所有设备
            List<DeviceBean> devices = dao.query(DeviceBean.class, Cnd.NEW(), pager);
            for (int i = 0; i < devices.size(); i++) {
                DeviceBean deviceBean = devices.get(i);
                UserDeviceBean userDeviceBean = new UserDeviceBean();
                userDeviceBean.setId(deviceBean.getId());
                userDeviceBean.setDeviceName(deviceBean.getName());
                userDeviceBean.setDeviceNumber(deviceBean.getDeviceNumber());
                userDeviceBean.setLatitude(deviceBean.getLatitude());
                userDeviceBean.setLongitude(deviceBean.getLongitude());
                userDeviceBean.setUserName(deviceBean.getUserName());
                deviceBeans.add(userDeviceBean);
            }
        } else {
            deviceBeans.addAll(dao.query(UserDeviceBean.class, Cnd.where("user_name", "=", userName).and("is_del", "=", "0"), pager));
        }
        return ResultObject.okList(deviceBeans, page, size);
    }

    /**
     * @return java.lang.Object
     * @Author huangwei
     * @Description //TODO  精讯云后台查询用户下所有设备分布
     * @Date 2019/11/26
     * @Param [page, size]
     **/
    @RequestMapping(value = "selDeviceListByUser")
    public Object selDeviceListByUserId(
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "100") int size) {
        Pager pager = dao.createPager(page, size);
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        String userName = userBean.getUserName();
        List<UserDeviceBean> deviceBeans = new ArrayList<>();
        if (userBean.getLevel() <= Constant.Define.ROLE_0) {//系统管理员显示所有设备
            deviceBeans = dao.query(UserDeviceBean.class, Cnd.NEW(), pager);
            //for (int i = 0; i < devices.size(); i++) {
            //    DeviceBean deviceBean = devices.get(i);
            //    UserDeviceBean userDeviceBean = new UserDeviceBean();
            //    userDeviceBean.setId(deviceBean.getId());
            //    userDeviceBean.setDeviceName(deviceBean.getName());
            //    userDeviceBean.setDeviceNumber(deviceBean.getDeviceNumber());
            //    userDeviceBean.setLatitude(deviceBean.getLatitude());
            //    userDeviceBean.setLongitude(deviceBean.getLongitude());
            //    userDeviceBean.setUserName(deviceBean.getUserName());
            //    deviceBeans.add(userDeviceBean);
            //}
        } else {
            deviceBeans.addAll(dao.query(UserDeviceBean.class, Cnd.where("user_name", "=", userName).and("is_del", "=", "0"), pager));
        }
        return ResultObject.okList(deviceBeans, page, size);
    }


    /**
     * 修改设备信息
     */
    @EnableOpLog
    @RequestMapping(value = "upDeviceInfo", method = RequestMethod.POST)
    public Object upDeviceInfo(UserDeviceBean device, @RequestParam(value = "userName", required = false, defaultValue = "") String userName) {
        if (TextUtils.isEmpty(device.getDeviceNumber())) {
            //return ResultObject.apiError("设备号为空");
            return ResultObject.apiError("err29");
        }
        if (TextUtils.isEmpty(device.getDeviceName())) {
            //return ResultObject.apiError("设备名称为空");
            return ResultObject.apiError("err30");
        }
        DeviceBean deviceBean = dao.fetch(DeviceBean.class, device.getDeviceNumber());
        if (deviceBean == null) {
            //return ResultObject.apiError("设备不存在");
            return ResultObject.apiError("err31");
        }
        SysUserBean loginUser = ControllerHelper.getInstance(dao).getLoginUser();

        //黄威 增加判断条件
        if (StringUtils.isNotBlank(userName)) {
            SysUserBean newUser = dao.fetch(SysUserBean.class, Cnd.where("user_name", "=", userName));
            loginUser = newUser;
        }
        //
        UserDeviceBean userDeviceBean = dao.fetch(UserDeviceBean.class, Cnd.where("Ncode", "=", device.getDeviceNumber()).and("user_name", "=", loginUser.getUserName()).and("is_del", "=", "0"));
        if (loginUser.getLevel() < Constant.Define.ROLE_1) {
            deviceBean.setLatitude(device.getLatitude());
            deviceBean.setLongitude(device.getLongitude());
            deviceBean.setName(device.getDeviceName());
            if (dao.update(deviceBean) == 0) {
                //return ResultObject.apiError("修改失败");
                return ResultObject.apiError("error17");
            }
            if (device.getGroupId() >= 0) {
                if (userDeviceBean == null) {
                    device.setUserName(loginUser.getUserName());
                    device.setCreateTime(Utils.getCurrentTimestamp());
                    dao.insert(device);
                } else {
                    userDeviceBean.setGroupId(device.getGroupId());
                    dao.update(userDeviceBean);
                }
            }
            //return ResultObject.ok("修改成功").data(deviceBean);
            return ResultObject.ok("ok4").data(deviceBean);
        } else if (userDeviceBean == null) {
            //return ResultObject.apiError("未绑定设备");
            return ResultObject.apiError("err32");
//        } else if (!userDeviceBean.equals(deviceBean.getUserName())) {
//            return ResultObject.apiError("只有主人才能修改设备信息");
        } else {
            if (device.getLatitude() == 0 || device.getLongitude() == 0 || device.getLatitude() > device.getLongitude()) {
                //return ResultObject.apiError("经纬度错误");
                return ResultObject.apiError("err33");
            }
            userDeviceBean.setLatitude(device.getLatitude());
            userDeviceBean.setLongitude(device.getLongitude());
            userDeviceBean.setDeviceName(device.getDeviceName());
            userDeviceBean.setGroupId(device.getGroupId());
            if (dao.update(userDeviceBean) == 1) {
                return ResultObject.ok("success").data(userDeviceBean);
            }
        }
        //return ResultObject.apiError("保存失败");
        return ResultObject.apiError("err34");
    }

    /**
     * 二级用户更新绑定设备密码
     */
    @EnableOpLog
    @RequestMapping(value = "upDevicePasswrod")
    public Object upDevicePasswrod(
            @RequestParam(value = "deviceNumber") String deviceNumber,
            @RequestParam(value = "newPassword") String newPassword) {
        DeviceBean deviceBean = dao.fetch(DeviceBean.class, deviceNumber);
        if (deviceBean == null) {
            return ResultObject.apiError("err24");
            //return ResultObject.apiError("设备不存在");
        }
        if (TextUtils.isEmpty(deviceBean.getPassword())) {
            return ResultObject.apiError("err35");//设备未设置密码
        }
        Session session = SecurityUtils.getSubject().getSession();
        log.info("session =" + session);
        String userName = session.getAttribute("user").toString();
        log.info("userName =" + userName);
        List<UserDeviceBean> deviceBeans = dao.query(UserDeviceBean.class, Cnd.where("Ncode", "=", deviceNumber).and("user_name", "=", userName).and("is_del", "=", "0"));
        if (deviceBeans.size() > 0) {
            UserDeviceBean userDeviceBean = deviceBeans.get(0);
            if (!TextUtils.isEmpty(deviceBean.getPassword()) && deviceBean.getPassword().equals(Encrypt.e(newPassword))) {
                userDeviceBean.setDevicePassword(Encrypt.e(newPassword));
                if (dao.update(deviceBean) > 0) {
                    //return ResultObject.ok("修改成功");
                    return ResultObject.ok("ok4");
                }
            }
        } else {
            //return ResultObject.apiError("未绑定设备");
            return ResultObject.apiError("err36");
        }
        //return ResultObject.apiError("密码错误");
        return ResultObject.apiError("err37");
    }


    /**
     * 删除设备绑定的用户，恢复出厂
     * 系统管理员可以操作
     */
    @EnableOpLog(Constant.ModifyType.DELETE)
    @RequestMapping(value = "delDeviceUser")
    public Object delDeviceUser(
            @RequestParam(value = "deviceNumber") String deviceNumber) {
        DeviceBean deviceBean = dao.fetch(DeviceBean.class, deviceNumber);
        if (deviceBean == null) {
            return ResultObject.apiError("err31");//设备不存在
        }

        if (Constant.Define.ROLE_0 != ControllerHelper.getInstance(dao).getLoginUser().getLevel()) {
            return ResultObject.error(Constant.HttpState.NO_PERMISSION, "err38");//无操作权限
        }

        //进行事物
        try {
            Trans.exec(Connection.TRANSACTION_READ_UNCOMMITTED, (Atom) () -> {
                //删除设备上的用户
                deviceBean.setPassword("");
                deviceBean.setUserName("");
                if (dao.update(deviceBean) > 0) {
                    log.info("恢复设备表成功");
                } else {
                    new RuntimeException("恢复设备表失败");
                }
                //删除绑定表
                List<UserDeviceBean> deviceBeans = dao.query(UserDeviceBean.class, Cnd.where("Ncode", "=", deviceNumber).and("is_del", "=", "0"));
                log.info("当前设备绑定" + deviceBeans.size() + "个用户");
                for (int i = 0; i < deviceBeans.size(); i++) {
                    UserDeviceBean userDeviceBean = deviceBeans.get(i);
                    userDeviceBean.setIsDel(1);
                    log.info("删除用户:" + userDeviceBean.getUserName());
                    if (dao.update(userDeviceBean) > 0) {
                        log.info("删除用户设备" + i + "成功");
                    } else {
                        new RuntimeException("删除用户设备" + i + "表失败");
                    }
                }
            });
            return ResultObject.apiError("ok3");//删除成功
        } catch (Exception e) {
            log.info("catch (Exception e)  " + e.getMessage());
            e.printStackTrace();
        }
        return ResultObject.apiError("error14");//删除失败
    }

    /**
     * 异步删除设备记录
     */
    @EnableOpLog(Constant.ModifyType.DELETE)
    @RequestMapping(value = "delDeviceRecord")
    public Object delDeviceRecord(
            @RequestParam(value = "deviceNumber") String deviceNumber) {
        DeviceBean deviceBean = dao.fetch(DeviceBean.class, deviceNumber);
        if (deviceBean == null) {
            return ResultObject.apiError("err31");//设备不存在
        }
        if (Constant.Define.ROLE_0 != ControllerHelper.getInstance(dao).getLoginUser().getLevel()) {
            return ResultObject.error(Constant.HttpState.NO_PERMISSION, "err38");//无操作权限
        }

        List<SensorTemplateBean> templateBeans = dao.query(SensorTemplateBean.class, Cnd.where("sensor_ncode", "=", deviceNumber));
        log.info("模板templateBeans =" + templateBeans.size());
        if (templateBeans.size() == 0) {
            throw new ArithmeticException("未添加模板");
        }

//        String delDeviceNumber = RedisUtil.getInstance().getSaveString(deviceNumber, "");
//        String delDeviceNumber2 = RedisUtil.getInstance().getSaveString(deviceNumber + "1", "");
//        log.info("delDeviceNumber =" + delDeviceNumber + "  delDeviceNumber2 =" + delDeviceNumber2);
//        if (deviceNumber.equals(delDeviceNumber) || deviceNumber.equals(delDeviceNumber2)) {
//            return ResultObject.apiError("后台删除中，请勿重复提交");
//        }

        ThreadPoolUtil.getInstance().execute(() -> {
            int page = 1;
            log.info("开始删除历史记录");
            while (true) {
                List<NetDevicedata> netDevicedatas = dao.query(NetDevicedata.class, Cnd.where("Dcode", "=", deviceNumber).limit(new Pager(page, 1000)).orderBy("Did", "desc"));
                if (netDevicedatas.size() > 0) {
                    page++;
                    for (int j = 0; j < netDevicedatas.size(); j++) {
                        if (dao.delete(netDevicedatas.get(j)) > 0) {
                            log.info("删除历史记录：" + netDevicedatas.get(j).getDeviceNumber() + "   " + netDevicedatas.get(j).getDrecordTime());
                        }
                    }
                } else {
                    log.info("删除历史记录NetDevicedata完毕");
                    RedisUtil.getInstance().delKey(deviceNumber);
                    log.info("删除记录完毕!!  delKey" + deviceNumber);
                    break;
                }
            }
        });
        List<Boolean> isAlldel = new ArrayList<>();
        for (int i = 0; i < templateBeans.size(); i++) {
            int finalI = i;
            ThreadPoolUtil.getInstance().execute(() -> {
                log.info("删除传感器数据 :" + finalI);
                int page = 1;
                while (true) {
                    List<SensorDataBean> sensorDataBeans = dao.query(SensorDataBean.class, Cnd.where("sensor_code", "=", templateBeans.get(finalI).getSensorCode()).limit(new Pager(page, 1000)).orderBy("id", "desc"));
                    if (sensorDataBeans.size() > 0) {
                        page++;
                        for (int j = 0; j < sensorDataBeans.size(); j++) {
                            if (dao.delete(sensorDataBeans.get(j)) > 0) {
                                log.info("删除传感器数据：" + sensorDataBeans.get(j).getSensorCode() + "    " + sensorDataBeans.get(j).getRecordTime());
                            }
                        }
                    } else {
                        log.info("删除一个SensorDataBean完毕");
                        isAlldel.add(true);
                        if (isAlldel.size() == templateBeans.size()) {
                            RedisUtil.getInstance().delKey(deviceNumber + "1");
                            log.info("删除整个SensorDataBean完毕");
                        }
                        break;
                    }

                }
            });
        }
        RedisUtil.getInstance().saveString(deviceNumber, deviceNumber);
        RedisUtil.getInstance().saveString(deviceNumber + "1", deviceNumber);

        return ResultObject.ok("ok9");//执行后台删除中
    }


    @RequestMapping(value = "/getCommandTypeList")
    public Object getCommandTypeList(String deviceType,
                                     @RequestParam(value = "page", required = false, defaultValue = "1") int page,
                                     @RequestParam(value = "size", required = false, defaultValue = "100") int size) {
        Cnd cnd = null;
        if (!TextUtils.isEmpty(deviceType)) {
            cnd = Cnd.where("deviceType", "=", deviceType);
        }
        List<CommandTypeBean> beans = dao.query(CommandTypeBean.class, cnd, new Pager(page, size));
        return ResultObject.okList(beans, page, size);
    }

    @EnableOpLog(Constant.ModifyType.SAVE)
    @RequestMapping(value = "/create")
    public Object create(
            @RequestParam(value = "id") String id,
            @RequestParam(value = "password") String password,
            @RequestParam(value = "deviceType") int deviceType) {
        DeviceBean deviceBean = dao.fetch(DeviceBean.class, id);
        if (deviceBean != null) {
            return ResultObject.apiError("err39");//重复创建
        }
        deviceBean = new DeviceBean();
        deviceBean.setDeviceNumber(id);
        if (!TextUtils.isEmpty(password)) {
            deviceBean.setPassword(Encrypt.e(password));
        }
        deviceBean.setDeviceType(deviceType);
        deviceBean.setName("新设备注册入平台");
        deviceBean = dao.insert(deviceBean);
        if (deviceBean != null) {
            return ResultObject.ok("ok10", deviceBean);//创建成功
        }
        return ResultObject.apiError("err40");//创建失败
    }

    @EnableOpLog(Constant.ModifyType.DELETE)
    @RequestMapping(value = "/delCommand", method = RequestMethod.POST)
    public Object delCommand(@RequestParam(value = "id") long id) {
        DeviceCommandBean commandBean = dao.fetch(DeviceCommandBean.class, id);
        if (commandBean == null) {
            return ResultObject.apiError("err41");//指令不存在
        }
        if (!ControllerHelper.getInstance(dao).getLoginUserName().equals(commandBean.getUserName())) {
            return ResultObject.apiError("err42");//未下达此命令
        }
        commandBean.setIsDel(1);
        if (dao.update(commandBean) > 0) {
            return ResultObject.ok("ok3");//删除成功
        }
        return ResultObject.apiError("error14");//删除失败
    }

    @RequestMapping(value = "/getCommandList")
    public Object getCommandList(
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "limit", required = false, defaultValue = "100") int size,
            String deviceCode) {
        int level = ControllerHelper.getInstance(dao).getLoginUserLevel();
        Pager pager = dao.createPager(page, size);
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        Cnd cnd;
        if (level < Constant.Define.ROLE_1) {
            cnd = Cnd.where("is_del", "=", "0");
        } else {
            cnd = Cnd.where("user_name", "=", userName).and("is_del", "=", "0");
        }
        if (!TextUtils.isEmpty(deviceCode)) {
            cnd.and("Ncode", "like", "%" + deviceCode + "%");
        }
        List<DeviceCommandBean> commandBeans = dao.query(DeviceCommandBean.class, cnd.desc("id"), pager);
        long count = ControllerHelper.getInstance(dao).getCount("command_to_device " + cnd);
        return ResultObject.okList(commandBeans, page, size, count);
    }

    @EnableOpLog
    @RequestMapping(value = "/sendCommand", method = RequestMethod.POST)
    public Object sendCommand(
            @RequestParam(value = "deviceNumber") String deviceNumber,
            @RequestParam(value = "devicePassword") String devicePassword,
            @RequestParam(value = "command") int command,
            @RequestParam(value = "value") String value,
            @RequestParam(value = "deviceType") int deviceType) {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        int level = ControllerHelper.getInstance(dao).getLoginUserLevel();
        DeviceBean deviceBean = dao.fetch(DeviceBean.class, deviceNumber);
        if (deviceBean == null) {
            return ResultObject.apiError("err31");//设备不存在
        }
        if (level > 0) {
            UserDeviceBean userDeviceBean = dao.fetch(UserDeviceBean.class, Cnd.where("Ncode", "=", deviceBean.getDeviceNumber()).and("user_name", "=", userName).and("is_del", "=", "0"));
            if (userDeviceBean == null) {
//                未绑定设备
                return ResultObject.apiError("err36");
            }
            if (!TextUtils.isEmpty(deviceBean.getPassword())) {
                if (TextUtils.isEmpty(devicePassword)) {
                    return ResultObject.apiError("err44");//请输入设备密码
                }
                if (!deviceBean.getPassword().equals(Encrypt.e(devicePassword))) {
                    return ResultObject.apiError("err25");//密码错误
                }
            }
        }
//        if (deviceBean.getDeviceType() != deviceType) {
////                       =设备类型错误
//            return ResultObject.apiError("err43");
//        }
        CommandTypeBean typeBean = dao.fetch(CommandTypeBean.class, Cnd.where("command", "=", command));
        if (typeBean == null) {
            return ResultObject.apiError("err45");//指令错误
        }
        log.info(typeBean.getName() + "  val = " + value);
        if (Constant.isRelayDevice(deviceType)) {
            //发送网络继电器控制
            if (1 == deviceBean.getOnLineState()) {//设备在线
                String relayOrder = "";
                String[] values = value.split("&");
                for (int i = 0; i < values.length; i++) {
                    String val = values[i];
                    if (val.length() % 2 != 0) {
                        return ResultObject.apiError("指令格式错误：" + val);
                    }
                    try {
                        int index = Integer.parseInt(val.substring(0, 2));
                        int order = Integer.parseInt(val.substring(2, 4));
                        if (index < 0 || index > 99 || order < 0 || order > 1) {
                            return ResultObject.apiError("err47");//指令配置错误
                        }
                    } catch (Exception e) {
                        return ResultObject.apiError("err48");//指令无法解析
                    }
                    relayOrder += val;
                }
                String res = SqlHelper.sendDeviceCommandByType(deviceNumber, relayOrder, userName, deviceBean.getDeviceType()) + "";
                if (Constant.Privatisation.UPDATE_LOCAL_RELAY_STATE) {
                    if (res.contains("success")) {
                        String sensorCode = deviceNumber + Integer.parseInt(value.substring(0, 2));
                        SensorTemplateBean sensorTemplateBean = dao.fetch(SensorTemplateBean.class, Cnd.where("sensor_code", "=", sensorCode));
                        sensorTemplateBean.setSensorData(value.substring(3, 4));
                        dao.update(sensorTemplateBean);
                        deviceBean.setTime(new Timestamp(System.currentTimeMillis()));
                        String data = deviceBean.getData();
                        if (TextUtils.isEmpty(data)) {
                            data = "关 | 关 | 关 | 关";
                        }
                        String[] datas = data.split(" | ");
                        for (int i = 0; i < datas.length; i++) {
                            System.out.println(i + ":" + datas[i]);
                        }
                        int size = value.length() / 4;
                        for (int i = 0; i < size; i++) {
                            String index = value.substring(i * 4, i * 4 + 2);
                            String vue = value.substring(i * 4 + 2, i * 4 + 4);
                            int indexOf = Integer.valueOf(index, 16) - 1;
                            int val = Integer.valueOf(vue);
                            int of = indexOf * 2;
                            if (of < datas.length) {
                                datas[of] = val == 1 ? "开" : "关";
                            }
                        }
                        data = "";
                        for (int i = 0; i < datas.length; i++) {
                            data += datas[i].replace("|", " | ");
                        }
                        deviceBean.setData(data);
                        dao.update(deviceBean);
                    } else if (res.contains("设备掉线") || res.contains("设备不在线")) {
                        deviceBean.setOnLineState(0);
                        dao.update(deviceBean, "^onLineState$");
                    }
                }
                return res;
            } else {
                return ResultObject.apiError("err49");//设备掉线
            }
        } else if (deviceType == Constant.DeviceType.DUST) {
            //修改大屏字幕显示
            if (1 == deviceBean.getOnLineState()) {//设备在线
                return SqlHelper.sendDeviceCommandByType(deviceNumber, value, userName, Constant.DeviceType.DUST);
            } else {
                return ResultObject.apiError("err49");//设备掉线
            }
        } else if (deviceType == Constant.DeviceType.WELL_COVER
//            添加智慧井盖指令
                || deviceType == Constant.DeviceType.NB) {
            //删除重复指令
            List<DeviceCommandBean> deviceCommandBeans = dao.query(DeviceCommandBean.class, Cnd.where("user_name", "=", userName)
                    .and("Ncode", "=", deviceNumber).and("command", "=", command)
                    .and("is_success", "=", "0").and("is_del", "=", "0"));
            for (int i = 0; i < deviceCommandBeans.size(); i++) {
                deviceCommandBeans.get(i).setIsDel(1);
                dao.update(deviceCommandBeans.get(i));
            }
            DeviceCommandBean deviceCommand = new DeviceCommandBean();
            deviceCommand.setDeviceNumber(deviceNumber);
            deviceCommand.setCommand(command);
            deviceCommand.setVal(value);
            deviceCommand.setDeviceType(deviceType);
            deviceCommand.setCreateTime(new Timestamp(System.currentTimeMillis()));
            deviceCommand.setUserName(userName);
            deviceCommand = dao.insert(deviceCommand);
            if (deviceCommand != null) {
                return ResultObject.ok("ok11").data(deviceCommand);//指令添加成功,等待下发
            } else {
                return ResultObject.apiError("err46");//指令添加失败
            }
        }

        return ResultObject.apiError("error10");//添加失败
    }

    /**
     * 批量下发指令
     */
    @EnableOpLog
    @RequestMapping(value = "deliveryCommands", method = RequestMethod.POST)
    public Object deliveryCommands(
            @RequestParam String deviceList,
            @RequestParam int command,
            @RequestParam String value,
            @RequestParam int deviceType) {

        if (TextUtils.isEmpty(deviceList)) {
            return ResultObject.apiError("err31");//设备不存在
        }
        String[] devices = deviceList.split(",");
        String userName = ControllerHelper.getLoginUserName();
        if (devices.length > 50) {
            return ResultObject.apiError("请分批下发");
        }
        for (int i = 0; i < devices.length; i++) {
            String deviceNumber = devices[i];
//            添加智慧井盖指令
            if (deviceType == Constant.DeviceType.WELL_COVER || deviceType == Constant.DeviceType.NB) {
                //删除重复指令
                Sql sql = Sqls.create("UPDATE command_to_device SET is_del= 1 WHERE user_name=@userName AND Ncode = @deviceNumber AND command = @command AND is_success=0 AND is_del =0");
                sql.setParam("userName", userName);
                sql.setParam("deviceNumber", deviceNumber);
                sql.setParam("command", command);
                dao.execute(sql);
                int updateCount = sql.getUpdateCount();
                log.info("删除重复：" + updateCount);
                DeviceCommandBean deviceCommand = new DeviceCommandBean();
                deviceCommand.setDeviceNumber(deviceNumber);
                deviceCommand.setCommand(command);
                deviceCommand.setVal(value);
                deviceCommand.setDeviceType(deviceType);
                deviceCommand.setCreateTime(new Timestamp(System.currentTimeMillis()));
                deviceCommand.setUserName(userName);
                if (dao.insert(deviceCommand) == null) {
                    return ResultObject.apiError("err34");//保存失败
                }
            }
        }

        return ResultObject.ok("ok2");//添加成功

    }

    /**
     * @param deviceNumber
     * @return
     */
    @RequestMapping(value = "/selDeviceSensorData", method = RequestMethod.POST)
    public Object selDeviceSensorData(
            @RequestParam(value = "deviceNumber") String deviceNumber) {

        DeviceBean deviceBean = dao.fetch(DeviceBean.class, deviceNumber);
        if (deviceBean == null) {
            return ResultObject.apiError("err24");//设备不存在
        }
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        List<UserDeviceBean> deviceBeans = dao.query(UserDeviceBean.class, Cnd.where("Ncode", "=", deviceNumber).and("user_name", "=", userName).and("is_del", "=", "0"));
        log.info("deviceBeans =" + deviceBeans.size());
        if (deviceBeans.size() == 0) {
            return ResultObject.apiError("err50");//未绑定此设备
        }
        List<SensorTemplateBean> templateBeans = dao.query(SensorTemplateBean.class, Cnd.where("sensor_ncode", "=", deviceNumber));
        log.info("模板templateBeans =" + templateBeans.size());
        if (templateBeans.size() == 0) {
            return ResultObject.apiError("error1");//未添加设备模板
        }
        List<SenorDataMode> senorDataModes = new ArrayList<>();
        if (Constant.isRelayDevice(deviceBean.getDeviceType())) {
            for (int i = 0; i < templateBeans.size(); i++) {
                SenorDataMode senorDataMode = new SenorDataMode();
                senorDataMode.setId(i);
                senorDataMode.setDataTime(deviceBean.getTime());
                senorDataMode.setName(templateBeans.get(i).getSensorName());
                senorDataMode.setTemplateId(templateBeans.get(i).getSensorCode());
                try {
                    senorDataMode.setValue(Double.parseDouble(templateBeans.get(i).getSensorData()));
                } catch (Exception e) {
                    log.info(e.toString());
                    senorDataMode.setValue(0);
                }
                senorDataMode.setUnit("");
                senorDataModes.add(senorDataMode);
            }
        } else {
            //最多显示一个月以内的数据
            Timestamp time = new Timestamp(System.currentTimeMillis() - (30 * 24 * 60 * 60 * 1000l));
            //查找所有的设备节点
            for (int i = 0; i < templateBeans.size(); i++) {
                Condition cnd = Cnd.where("sensor_code", "=", templateBeans.get(i).getSensorCode()).and("record_time", ">", time).desc("id");
                List<SensorDataBean> dataBeans = SplitTableHelper.queryForDate(SensorDataBean.class, cnd, time, null, 1, 1);
                if (dataBeans.size() == 0) {
                    log.error("设备节点缺少数据");
                    return ResultObject.apiError("err51");//等待设备上传数据
                } else {
                    SenorDataMode senorDataMode = new SenorDataMode();
                    senorDataMode.setId(i);
                    senorDataMode.setDataTime(dataBeans.get(0).getRecordTime());
                    senorDataMode.setName(templateBeans.get(i).getSensorName());
                    senorDataMode.setTemplateId(templateBeans.get(i).getSensorCode());
                    senorDataMode.setValue(dataBeans.get(0).getSensorValue());
                    senorDataMode.setUnit(dao.fetch(SensorTypeBean.class, templateBeans.get(i).getSensorType()).getUnit());
                    senorDataModes.add(senorDataMode);
                }
            }
        }

        if (senorDataModes.size() > 0) {
            return ResultObject.okList(senorDataModes).put("deviceType", deviceBean.getDeviceType());
        }

        return ResultObject.apiError("err52");//暂无数据
    }

    /**
     * 设备体检结果
     *
     * @param deviceNumber
     * @return
     */
    @RequestMapping(value = "/graphicsExamination", method = RequestMethod.POST)
    public Object graphicsExamination(@RequestParam(value = "deviceNumber") String deviceNumber) {
        DeviceBean deviceBean = deviceManageService.getDeviceBean(deviceNumber);

        if (deviceBean == null || deviceBean.getOnLineState() == 0) {
            return ResultObject.ok("ok8").data("score", 0)
                    //此处将上次登录时间
                    .data("lastLoginTime", Utils.getCurrentTimestamp());
        }
        //正常情况下最低80，最高99
        //random.nextInt(max) % (max - min + 1) + min;

        // 定义double变量
//        float max = 3.7f, min = 3.5f;
//        BigDecimal power = new BigDecimal(Math.random() * (max - min) + min);
        return ResultObject.ok("ok8")
                .data("score", new Random().nextInt(99) % 20 + 80);//80-99
//                .data("siginalIntensity", new Random().nextInt(60) % 11 + 50)//50-60
//                .data("powerSuply",power.setScale(2));//
    }

    /**
     * 图形化显示
     *
     * @param deviceNumber
     * @return
     */
    @RequestMapping(value = "/graphicsShowing", method = RequestMethod.POST)
    public Object graphicsShowing(
            @RequestParam(value = "deviceNumber") String deviceNumber) {
        DeviceBean deviceBean = dao.fetch(DeviceBean.class, deviceNumber);
        //--修改名称显示
        UserDeviceBean userDeviceBean = deviceManageService.selectByUserNameAndDeviceNumber(ControllerHelper.getLoginUserName(), deviceNumber);
        //--查到了就用用户自定义的名称-查不到就用network的
        if (userDeviceBean != null) {
            deviceBean.setName(userDeviceBean.getName());
        }
        if (deviceBean == null) {
            return ResultObject.apiError("err31");//设备不存在
        }
        SysUserBean sysUserBean = ControllerHelper.getInstance(dao).getLoginUser();
        if (sysUserBean.getLevel() > Constant.Define.ROLE_0) {
            List<UserDeviceBean> deviceBeans = dao.query(UserDeviceBean.class, Cnd.where("Ncode", "=", deviceNumber).and("user_name", "=", sysUserBean.getUserName()).and("is_del", "=", "0"));
            log.info("deviceBeans =" + deviceBeans.size());
            if (deviceBeans.size() == 0) {
                return ResultObject.apiError("err50");//未绑定此设备
            }
        }
        List<SensorTemplateBean> templateBeans = dao.query(SensorTemplateBean.class, Cnd.where("sensor_ncode", "=", deviceNumber));
        log.info("模板templateBeans =" + templateBeans.size());
        if (templateBeans.size() == 0) {
            return ResultObject.apiError("error1");//未添加设备模板
        }
        Timestamp timestamp = new Timestamp(System.currentTimeMillis() - (30 * 24 * 60 * 60 * 1000l));
        if (deviceBean.getCreatTime() != null && deviceBean.getCreatTime().getTime() > timestamp.getTime()) {
            timestamp = deviceBean.getCreatTime();
        }

        List<SenorDataMode> senorDataModes = new ArrayList<>();
        //查找所有的设备节点
        for (int i = 0; i < templateBeans.size(); i++) {

            Condition cnd = Cnd.where("record_time", ">", timestamp)
                    .and("sensor_code", "=", templateBeans.get(i).getSensorCode()).desc("id");
            List<SensorDataBean> dataBeans = SplitTableHelper.queryForDate(SensorDataBean.class, cnd, timestamp, null, 1, 1);
            if (dataBeans.size() == 0) {
                log.error("设备节点缺少数据");
                return ResultObject.apiError("err51");//等待设备上传数据
            } else {
                SensorTypeBean sensorTypeBean = dao.fetch(SensorTypeBean.class, templateBeans.get(i).getSensorType());
                if (sensorTypeBean == null) {
                    return ResultObject.apiError("err53");//未知传感器类型
                }
                SenorDataMode senorDataMode = new SenorDataMode();
                senorDataMode.setId(i);
                senorDataMode.setDataTime(dataBeans.get(0).getRecordTime());
                senorDataMode.setName(templateBeans.get(i).getSensorName());
                senorDataMode.setTemplateId(templateBeans.get(i).getSensorCode());
                senorDataMode.setValue(dataBeans.get(0).getSensorValue());
                senorDataMode.setMin(sensorTypeBean.getMin());
                senorDataMode.setMax(sensorTypeBean.getMax());
                senorDataMode.setRanges(sensorTypeBean.getRanges().split(","));
                senorDataMode.setUnit(sensorTypeBean.getUnit());
                senorDataMode.setMinorTicks(sensorTypeBean.getMinorTicks());
                senorDataModes.add(senorDataMode);
            }
        }
        if (senorDataModes.size() > 0) {
            return ResultObject.ok("ok8").data("sensor", senorDataModes).data("device", deviceBean);//查询成功
        }
        return ResultObject.apiError("err52");//暂无数据
    }


}
