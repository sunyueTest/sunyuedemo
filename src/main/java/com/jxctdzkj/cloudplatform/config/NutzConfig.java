package com.jxctdzkj.cloudplatform.config;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.jxctdzkj.cloudplatform.bean.CommandTypeBean;
import com.jxctdzkj.cloudplatform.bean.ConfigBean;
import com.jxctdzkj.cloudplatform.bean.DeviceBean;
import com.jxctdzkj.cloudplatform.bean.SysUserBean;
import com.jxctdzkj.cloudplatform.bean.SysUserInfoBean;
import com.jxctdzkj.cloudplatform.bean.SysUserLevel;
import com.jxctdzkj.cloudplatform.bean.SysVersionConfigBean;
import com.jxctdzkj.cloudplatform.bean.UserDeviceBean;
import com.jxctdzkj.cloudplatform.utils.FlieHttpUtil;
import com.jxctdzkj.cloudplatform.utils.Utils;
import com.jxctdzkj.cloudplatform.utils.WeCatQRCode;
import com.jxctdzkj.support.utils.TextUtils;

import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.util.Daos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.File;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 *     author  : FlySand
 *     e-mail  : 1156183505@qq.com
 *     time    : 2018/8/1.
 *     desc    :
 * </pre>
 */
@Slf4j
@Configuration
class NutzConfig {

    @Autowired
    Dao dao;

    @Bean
    public NutzConfig createTables() {
        //自动建表
        Daos.createTablesInPackage(dao, "BOOT-INF/classes/com/jxctdzkj/cloudplatform/bean/", false);
        Daos.createTablesInPackage(dao, "com.jxctdzkj.cloudplatform.bean", false);
        //检查字段
        Daos.migration(dao, "BOOT-INF/classes/com/jxctdzkj/cloudplatform/bean/", true, false, false);
        Daos.migration(dao, "com.jxctdzkj.cloudplatform.bean", true, false, false);
        //初始化version表
        initVersion();

        //检查用户等级表
//        checkUserLevel();
//        checkCommandType();
        //初始化用户等级
//        initUserLevel();
        //初始化设备
//        initDeviceExpiryTime();
        //修改经纬度
//        intLatLng();
//        initDeviceLatLng();
//        checkQrcode();
        if (Constant.Project.TRY_OUT) {
            new Timer().schedule(new TimerTask() {
                @Override
                public void run() {
                    log.error("试用到期");
                    System.exit(1);
                }
            }, 30 * 24 * 60 * 60 * 1000l);
        }
        return null;
    }

    private void initVersion() {
        SysVersionConfigBean freeVersion = dao.fetch(SysVersionConfigBean.class, Cnd.where("id", "=", 1));
        if (freeVersion == null) {
            freeVersion = new SysVersionConfigBean();
            freeVersion.setVersionId(1);
            freeVersion.setVersionName("免费版");
            freeVersion.setTriggerNum(10);
            freeVersion.setDeviceNum(20);
            freeVersion.setLevel2UserNum(3);
            freeVersion.setConfigurationNum(10);
            freeVersion.setTimerNum(10);
            freeVersion.setMonitorNum(8);
            if (dao.insert(freeVersion) != null) {
                log.info("免费版创建成功");
            }
        }
        SysVersionConfigBean proVersion = dao.fetch(SysVersionConfigBean.class, Cnd.where("id", "=", 2));
        if (proVersion == null) {
            proVersion = new SysVersionConfigBean();
            proVersion.setVersionId(2);
            proVersion.setVersionName("专业版");
            proVersion.setTriggerNum(30);
            proVersion.setDeviceNum(60);
            proVersion.setLevel2UserNum(10);
            proVersion.setConfigurationNum(30);
            proVersion.setTimerNum(30);
            proVersion.setMonitorNum(24);
            if (dao.insert(proVersion) != null) {
                log.info("专业版创建成功");
            }
        }
    }

    private void initDeviceLatLng() {
        List<DeviceBean> deviceBeans = dao.query(DeviceBean.class, null);
        for (int i = 0; i < deviceBeans.size(); i++) {
            DeviceBean deviceBean = deviceBeans.get(i);
            double lat = deviceBean.getLatitude();
            if (lat > deviceBean.getLongitude()) {
                deviceBean.setLatitude(deviceBean.getLongitude());
                deviceBean.setLongitude(lat);
                dao.update(deviceBean);
            }
        }
    }

    private void intLatLng() {
        List<UserDeviceBean> userDeviceBeanList = dao.query(UserDeviceBean.class, null);
        for (int i = 0; i < userDeviceBeanList.size(); i++) {
            UserDeviceBean deviceBean = userDeviceBeanList.get(i);
            double lat = deviceBean.getLatitude();
            double lng = deviceBean.getLongitude();
//            if (lat < 30) {
//                while (lat < 30) {
//                    lat = new java.util.Random().nextInt(40);
//                }
//                deviceBean.setLatitude(lat);
//            }
//            if (lng<121){
//                while (lng < 120) {
//                    lng = new java.util.Random().nextInt(130);
//                }
//                deviceBean.setLongitude(lng);
//            }
//            dao.update(deviceBean);
            if (lat > deviceBean.getLongitude()) {
                deviceBean.setLatitude(lng);
                deviceBean.setLongitude(lat);
                dao.update(deviceBean);
            }

        }

    }

    private void initDeviceExpiryTime() {
        List<DeviceBean> deviceBeans = dao.query(DeviceBean.class, null);
        Timestamp timestamp = Utils.getCurrentTimestamp();
        for (DeviceBean deviceBean : deviceBeans) {
            if (deviceBean.getCreatTime() == null) {
                deviceBean.setCreatTime(timestamp);
                dao.update(deviceBean);
            }
        }

    }

    private void initUserLevel() {
        List<SysUserBean> userBeans = dao.query(SysUserBean.class, null);
        for (int i = 0; i < userBeans.size(); i++) {
            if (userBeans.get(i).getLevel() == 0) {
                userBeans.get(i).setLevel(1);
                dao.update(userBeans.get(i));
            }
        }

    }


    private void checkUserLevel() {
        SysUserLevel mainLevel = dao.fetch(SysUserLevel.class, "0");
        if (mainLevel == null) {
            mainLevel = new SysUserLevel();
            mainLevel.setName("系统管理员");
            mainLevel.setLevel(Constant.Define.ROLE_0 + "");
            if (dao.insert(mainLevel) != null) {
                log.info("系统管理员创建成功");
            }
        }
        SysUserLevel primaryUser = dao.fetch(SysUserLevel.class, "1");
        if (primaryUser == null) {
            primaryUser = new SysUserLevel();
            primaryUser.setName("一级用户");
            primaryUser.setLevel("1");
            primaryUser.setCreateSubAccountNum(5);
            if (dao.insert(primaryUser) != null) {
                log.info("一级用户创建成功");
            }
        }
        SysUserLevel secondaryUser = dao.fetch(SysUserLevel.class, "2");
        if (secondaryUser == null) {
            secondaryUser = new SysUserLevel();
            secondaryUser.setName("二级用户");
            secondaryUser.setLevel("2");
            if (dao.insert(secondaryUser) != null) {
                log.info("二级用户创建成功");
            }
        }

        //        测试登录
        ConfigBean configBean = dao.fetch(ConfigBean.class, Cnd.where("config_type", "=", Constant.Define.TEST_LONG_CONFIG_TYPE));
        if (configBean == null) {
            configBean = new ConfigBean();
            configBean.setConfigType(Constant.Define.TEST_LONG_CONFIG_TYPE);
            configBean.setConfigValue(0);
            configBean.setRemark("测试登录");
            if (dao.insert(configBean) != null) {
                log.info("测试登录配置成功");
            }
        }
        //        登录密码错误尝试次数
        ConfigBean loginConfigBean = dao.fetch(ConfigBean.class, Cnd.where("config_type", "=", Constant.Define.LOGIN_FAIL_COUNT));
        if (loginConfigBean == null) {
            loginConfigBean = new ConfigBean();
            loginConfigBean.setConfigType(Constant.Define.LOGIN_FAIL_COUNT);
            loginConfigBean.setConfigValue(3);
            loginConfigBean.setRemark("登录密码错误尝试次数");
            if (dao.insert(loginConfigBean) != null) {
                log.info("测试登录配置成功");
            }
        }
    }

    private void checkCommandType() {

        List<CommandTypeBean> typeBeans = new ArrayList<>();
        typeBeans.add(new CommandTypeBean(Constant.DeviceType.RELAY, 0, "继电器设置", "", 1));
        typeBeans.add(new CommandTypeBean(Constant.DeviceType.NB, 9, "采集间隔", "单位：10s", 10));
//        typeBeans.add(new CommandTypeBean(Constant.DeviceType.NB, 10, "上传间隔", "单位：10s", 10));
//        typeBeans.add(new CommandTypeBean(Constant.DeviceType.NB, 11, "触发上报", "0：不触发，1：触发", 1));
//        typeBeans.add(new CommandTypeBean(Constant.DeviceType.NB, 12, "温度触发上报上限值", "偏移量1个小数位", 10));
//        typeBeans.add(new CommandTypeBean(Constant.DeviceType.NB, 13, "温度触发上报下限值", "偏移量1个小数位", 10));
//        typeBeans.add(new CommandTypeBean(Constant.DeviceType.NB, 14, "湿度触发上报上限值", "偏移量1个小数位", 10));
//        typeBeans.add(new CommandTypeBean(Constant.DeviceType.NB, 15, "湿度触发上报下限值", "偏移量1个小数位", 10));
//        typeBeans.add(new CommandTypeBean(Constant.DeviceType.NB, 16, "温度", "偏移量1个小数位", 10));
//        typeBeans.add(new CommandTypeBean(Constant.DeviceType.NB, 17, "湿度", "偏移量1个小数位", 10));

        for (int i = 0; i < typeBeans.size(); i++) {
            if (dao.fetch(CommandTypeBean.class, Cnd.where("command", "=", typeBeans.get(i).getCommand())) == null) {
                dao.insert(typeBeans.get(i));
            }
        }

        //       nb 新设备联网入平台
        ConfigBean configBean = dao.fetch(ConfigBean.class, Cnd.where("config_type", "=", Constant.Define.NB_DEVIE_AUTO_REGISTER));
        if (configBean == null) {
            configBean = new ConfigBean();
            configBean.setConfigType(Constant.Define.NB_DEVIE_AUTO_REGISTER);
            configBean.setConfigValue(0);
            configBean.setRemark("NB新设备联网入平台");
            if (dao.insert(configBean) != null) {
                log.info("配置成功");
            }
        }
        ConfigBean configBean2 = dao.fetch(ConfigBean.class, Cnd.where("config_type", "=", Constant.Define.RELAY_DEVIE_AUTO_REGISTER));
        if (configBean2 == null) {
            configBean2 = new ConfigBean();
            configBean2.setConfigType(Constant.Define.RELAY_DEVIE_AUTO_REGISTER);
            configBean2.setConfigValue(0);
            configBean2.setRemark("网络继电器新设备联网入平台");
            if (dao.insert(configBean2) != null) {
                log.info("配置成功");
            }
        }
    }

    private void checkQrcode() {
        List<SysUserInfoBean> userInfoBeans = dao.query(SysUserInfoBean.class, Cnd.where("qrcode", "is", null));
        for (int i = 0; i < userInfoBeans.size(); i++) {
            SysUserInfoBean userInfoBean = userInfoBeans.get(i);
            //生成小程序二维码
            if (TextUtils.isEmpty(userInfoBean.getQrcode())) {
                try {
                    File qrcodeFile = WeCatQRCode.getInstance().getCode(userInfoBean.getUserName());
                    if (qrcodeFile != null) {
                        String uploadResult = FlieHttpUtil.uploadFile(Constant.Url.FILE_UPLOAD_URL, qrcodeFile);
                        log.info("uploadResult:" + uploadResult);
                        JSONObject request = JSON.parseObject(uploadResult);
                        String fileName = request.getJSONObject("data").getString("fileName");
                        if (TextUtils.isEmpty(fileName)) {
                            throw new RuntimeException("fileName  isEmpty");
                        }
                        log.info("fileName:" + fileName);
                        userInfoBean.setQrcode(Constant.Url.FILE_DOWNLOAD_PATH + fileName);
                        qrcodeFile.delete();
                    }
                    dao.update(userInfoBean);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

    }

}
