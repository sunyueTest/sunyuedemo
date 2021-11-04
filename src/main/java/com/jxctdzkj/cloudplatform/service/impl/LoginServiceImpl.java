package com.jxctdzkj.cloudplatform.service.impl;

import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.dysmsapi.model.v20170525.SendSmsRequest;
import com.aliyuncs.dysmsapi.model.v20170525.SendSmsResponse;
import com.aliyuncs.exceptions.ClientException;
import com.aliyuncs.http.MethodType;
import com.aliyuncs.profile.DefaultProfile;
import com.aliyuncs.profile.IClientProfile;
import com.jxctdzkj.cloudplatform.bean.*;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.coustum.UserNotExistAuthenticationException;
import com.jxctdzkj.cloudplatform.exception.ServiceException;
import com.jxctdzkj.cloudplatform.radis.RedisUtil;
import com.jxctdzkj.cloudplatform.service.LoginService;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.MailUtil;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import com.jxctdzkj.cloudplatform.utils.Utils;
import com.jxctdzkj.support.utils.Encrypt;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.trans.Atom;
import org.nutz.trans.Trans;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;
import java.sql.Connection;
import java.sql.Timestamp;
import java.util.List;

@Slf4j
@Service
public class LoginServiceImpl implements LoginService {

    @Autowired
    Dao dao;

    @Override
    public ResultObject loginCheck(String userName, String password, String cid) {

        Object o = new Object();
        o.hashCode();
        //当前Subject 方法
        Subject subject = SecurityUtils.getSubject();
        subject.logout();
        if (Constant.Redis.ENABLE) {
            RedisUtil redis = RedisUtil.getInstance();
            String redisKey = "doGetAuthorizationInfo" + userName;
            redis.delKey(redisKey);
            log.info("删除授权信息");
            long loginFialTime = redis.getSaveLong("loginFailTime:" + userName, 0);
            long waitTime = loginFialTime - System.currentTimeMillis();
            if (waitTime > 1000) {
                return ResultObject.apiError("warn37");
            }
        }
        //传递token给shiro的realm
        UsernamePasswordToken token = new UsernamePasswordToken(userName, Encrypt.e(password));
//        token.setRememberMe(rememberMe);
        log.info("token =" + token);
        try {
            subject.login(token);
        } catch (UserNotExistAuthenticationException exception) {
            return ResultObject.apiError(exception.getMessage());
        } catch (Exception e) {
            log.info("e = " + e.getMessage());
            ConfigBean configBean = dao.fetch(ConfigBean.class, Cnd.where("config_type", "=", Constant.Define.TEST_LONG_CONFIG_TYPE));
            if (configBean != null && configBean.getConfigValue() == 1 && Constant.Define.TEST_LONG_CONFIG_PASSWORD.equals(password)) {
                log.info("测试登录");
            } else {
//            e.printStackTrace();
                token.clear();
                if (Constant.Redis.ENABLE) {
                    RedisUtil redis = RedisUtil.getInstance();
                    int failCount = redis.getSaveInt("loginFailCount:" + userName, 1);
                    ConfigBean loginConfigBean = dao.fetch(ConfigBean.class, Cnd.where("config_type", "=", Constant.Define.LOGIN_FAIL_COUNT));
                    int loginFailCount = 8;
                    failCount++;
                    redis.saveValue("loginFailCount:" + userName, failCount);
                    if (loginConfigBean != null) {
                        loginFailCount = loginConfigBean.getConfigValue();
                    }
                    if (failCount > loginFailCount) {
                        int failWaitCount = redis.getSaveInt("loginFailWaitCount:" + userName, 1);
                        redis.saveValue("loginFailTime:" + userName, System.currentTimeMillis() + Constant.Define.LOGIN_FAIL_WAIT_TIME * failWaitCount);
                        failCount -= 2;
                        failWaitCount++;
                        redis.saveValue("loginFailWaitCount:" + userName, failWaitCount);
                        redis.saveValue("loginFailCount:" + userName, failCount);
                    }
                }
                subject.getSession().removeAttribute("user");
                return ResultObject.apiError("err85");//密码输入错误
            }
        }

//        subject.getSession().setAttribute("user", userName);
        SysUserBean sysUser = dao.fetch(SysUserBean.class, Cnd.where("user_name", "=", userName).and("is_del", "=", 0));
        if (StringUtils.isNotBlank(cid)) {
            sysUser.setCid(cid);
        }
        if (!"0".equals(sysUser.getState())) {
            return ResultObject.apiError("err186");//用户被禁用
        }
        //设置用户session
        Session session = SecurityUtils.getSubject().getSession();
        session.setAttribute("user", userName);
        session.setAttribute("userBean", sysUser);
        session.setAttribute("agreement", sysUser.getAgreementVersion());
//        session.setAttribute("basic", loginUser);
        session.setAttribute("level", sysUser.getLevel());
        log.info("设置用户session");
        log.info("用户session ：" + ControllerHelper.getLoginUserName());

//        RequestAttributes ra = RequestContextHolder.getRequestAttributes();
//        HttpServletRequest request = ((ServletRequestAttributes)ra).getRequest();
//        request.getSession(true).setAttribute("user", userName);
        //默认创建一级用户权限
        UserRoleBean roleBean = dao.fetch(UserRoleBean.class, userName);
        if (roleBean == null) {
            log.info("没有用户权限，默认创建一级用户权限");
            roleBean = new UserRoleBean();
            roleBean.setUserId(sysUser.getId());
            roleBean.setRoleId(4);
            roleBean.setUserName(userName);
            sysUser.setRole(4);
            if (dao.insert(roleBean) == null) {
                return ResultObject.apiError("err86");//创建角色失败
            }
        } else {
            sysUser.setRole(roleBean.getRoleId());
        }

//            String addingState = redis.getSaveString("addingDevices" + userName, null);
        //添加默认设备
//            if (sysUser.getPlatformUseTime() == null && addingState == null) {
//                redis.saveString("addingDevices" + userName, "adding");
//                List<AreaBean> areaBeans = dao.query(AreaBean.class, Cnd.where("Acode", "=", sysUser.getAreaCode()));
//                log.info("开始添加默认设备  区域个数：" + areaBeans.size());
//                try {
//                    if (sysUser.getLevel() > Constant.Define.ADMIN) {
//                        addAreaDevice(userName, areaBeans, 0);
//                    } else {
//                        log.info("不添加设备");
//                    }
//                    sysUser.setPlatformUseTime(Utils.getCurrentTimestamp());
//                } catch (Exception e) {
//                    e.printStackTrace();
//                    return ResultObject.apiError("err87");//绑定设备失败
//                }
//                log.info("默认设备添加完成");
//                redis.delKey("addingDevices" + userName);
//            }
        sysUser.setLastLoginTime(new Timestamp(System.currentTimeMillis()));
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        sysUser.setIp(request.getRemoteAddr());
        dao.update(sysUser);
        if (Constant.Redis.ENABLE) {
            RedisUtil redis = RedisUtil.getInstance();
            redis.delKey("loginFailTime:" + userName);
            redis.delKey("loginFailCount:" + userName);
            redis.delKey("loginFailWaitCount:" + userName);
        }
        return ResultObject.ok("ok15").data(sysUser);//登陆成功
    }

    @Override
    public void autoLogin(String userName, String password) {
        //当前Subject 方法
        Subject subject = SecurityUtils.getSubject();
        RedisUtil redis = RedisUtil.getInstance();
        //传递token给shiro的realm
        UsernamePasswordToken token = new UsernamePasswordToken(userName, password);
//        token.setRememberMe(rememberMe);
        log.info("token =" + token);
        try {
            subject.login(token);
        } catch (UserNotExistAuthenticationException exception) {
//            return ResultObject.apiError(exception.getMessage());
            log.error(exception.toString());
        } catch (Exception e) {
            log.error(e.toString());
        }
//        subject.getSession().setAttribute("user", userName);
        SysUserBean sysUser = dao.fetch(SysUserBean.class, Cnd.where("user_name", "=", userName).and("is_del", "=", 0));
        //设置用户session
        Session session = SecurityUtils.getSubject().getSession();
        session.setAttribute("user", userName);
        session.setAttribute("agreement", sysUser.getAgreementVersion());
//        session.setAttribute("basic", loginUser);
        session.setAttribute("level", sysUser.getLevel());
        log.info("设置用户session");
        log.info("用户session ：" + ControllerHelper.getLoginUserName());

//        RequestAttributes ra = RequestContextHolder.getRequestAttributes();
//        HttpServletRequest request = ((ServletRequestAttributes)ra).getRequest();
//        request.getSession(true).setAttribute("user", userName);
        //默认创建一级用户权限
        UserRoleBean roleBean = dao.fetch(UserRoleBean.class, userName);
        if (roleBean == null) {
            log.info("没有用户权限，默认创建一级用户权限");
            roleBean = new UserRoleBean();
            roleBean.setUserId(sysUser.getId());
            roleBean.setRoleId(4);
            roleBean.setUserName(userName);
            sysUser.setRole(4);
            if (dao.insert(roleBean) == null) {
                log.error("创建角色失败");
//                return ResultObject.apiError("err86");//创建角色失败
            }
        } else {
            sysUser.setRole(roleBean.getRoleId());
        }
        sysUser.setLastLoginTime(new Timestamp(System.currentTimeMillis()));
        dao.update(sysUser);
        redis.delKey("loginFailTime:" + userName);
        redis.delKey("loginFailCount:" + userName);
        redis.delKey("loginFailWaitCount:" + userName);
//        return ResultObject.ok("ok15").data(sysUser);//登陆成功
    }

    private void addAreaDevice(String userName, List<AreaBean> areaBeans, long groupId) {
        for (int i = 0; i < areaBeans.size(); i++) {
            AreaBean areaBean = areaBeans.get(i);
            log.info("添加区域:" + areaBean.getName());
            if ("371000XPTYH".equals(areaBean.getCode())
                    || "371000GQ".equals(areaBean.getCode()) || "371000GQ".equals(areaBean.getpCode())
                    || "china".equals(areaBean.getCode()) || "china".equals(areaBean.getpCode())) {
                log.info("特殊区域下的设备不添加！");
                continue;
            }
            long insertGroupId = groupId;
            if (areaBeans.size() > 1) {//添加区域分组
                UserGroupBean groupBean = new UserGroupBean();
                groupBean.setCreatTime(new Timestamp(System.currentTimeMillis()));
                groupBean.setUserName(userName);
                groupBean.setpId(groupId);
                groupBean.setGroupName(areaBeans.get(i).getName());
                log.info("创建分组：" + areaBeans.get(i).getName());
                UserGroupBean insertBean = dao.insert(groupBean);
                insertGroupId = insertBean.getId();
            }
            boundDevice(userName, areaBeans.get(i).getCode(), insertGroupId);
            List<AreaBean> childArea = dao.query(AreaBean.class, Cnd.where("Pcode", "=", areaBeans.get(i).getCode()));
            log.info("childArea：" + childArea.size());
            if (childArea.size() > 0) {
                addAreaDevice(userName, childArea, insertGroupId);
            }
        }

    }

    private void boundDevice(String userName, String areaCode, long groupId) {
        List<DeviceBean> deviceBeans = dao.query(DeviceBean.class, Cnd.where("Acode", "=", areaCode));
        log.info("添加设备：" + deviceBeans.size() + "个  groupId：" + groupId);
        //进行事物
        Trans.exec(Connection.TRANSACTION_READ_UNCOMMITTED, (Atom) () -> {
            for (int i = 0; i < deviceBeans.size(); i++) {
                DeviceBean deviceBean = deviceBeans.get(i);
                UserDeviceBean userDeviceBean = new UserDeviceBean();
                userDeviceBean.setDeviceNumber(deviceBean.getDeviceNumber());
                userDeviceBean.setDeviceName(deviceBean.getName());
                userDeviceBean.setUserName(userName);
                userDeviceBean.setGroupId(groupId);
                if (deviceBean.getLatitude() > deviceBean.getLongitude()) {
                    userDeviceBean.setLatitude(deviceBean.getLongitude());
                    userDeviceBean.setLongitude(deviceBean.getLatitude());
                } else {
                    userDeviceBean.setLatitude(deviceBean.getLatitude());
                    userDeviceBean.setLongitude(deviceBean.getLongitude());
                }
                userDeviceBean.setCreateTime(new Timestamp(System.currentTimeMillis()));
                log.info("添加设备：" + userDeviceBean.getDeviceNumber());
                if (dao.insert(userDeviceBean) == null) {
                    throw new RuntimeException("创建失败");
                }
            }
        });
    }

    @Override
    public void getEmailCode(String email) throws MessagingException {
        // 发送邮件

        String sub = "精讯云注册邮箱验证邮件";
        String randomCode = Utils.getCodeRandom(6);
        String content = "您好，验证码为：" + randomCode + "，有效时间为5分钟，如果本邮件非您本人操作，请忽略。";
        MailUtil.send_mail(email, sub, content);
        Subject subject = SecurityUtils.getSubject();
        subject.getSession().setAttribute("validCode", randomCode + ":" + System.currentTimeMillis());

    }

    @Override
    public void SendSms(String tel) throws ClientException {
        //生成随机验证码
        String randomCode = Utils.getCodeRandom(6);
        //设置超时时间
        System.setProperty("sun.net.client.defaultConnectTimeout", "10000");
        System.setProperty("sun.net.client.defaultReadTimeout", "10000");
        //初始化ascClient需要的几个参数
        final String product = "Dysmsapi";//短信API产品名称（短信产品名固定，无需修改）
        final String domain = "dysmsapi.aliyuncs.com";//短信API产品域名（接口地址固定，无需修改）
        //认证秘钥
        final String accessKeyId = "LTAIs8h1euac35UO";
        final String accessKeySecret = "rEePjTYkaAOf8ifVlzEnwOrbAM2PiN";
        //初始化ascClient,暂时不支持多region（请勿修改）
        IClientProfile profile = DefaultProfile.getProfile("cn-hangzhou", accessKeyId,
                accessKeySecret);
        DefaultProfile.addEndpoint("cn-hangzhou", "cn-hangzhou", product, domain);
        IAcsClient acsClient = new DefaultAcsClient(profile);
        //组装请求对象
        SendSmsRequest request = new SendSmsRequest();
        //使用post提交
        request.setMethod(MethodType.POST);
        //必填:待发送手机号。支持以逗号分隔的形式进行批量调用，批量上限为1000个手机号码,批量调用相对于单条调用及时性稍有延迟,验证码类型的短信推荐使用单条调用的方式；发送国际/港澳台消息时，接收号码格式为国际区号+号码，如“85200000000”
        request.setPhoneNumbers(tel);
        //必填:短信签名-可在短信控制台中找到
        request.setSignName("精讯");
        //必填:短信模板-可在短信控制台中找到，发送国际/港澳台消息时，请使用国际/港澳台短信模版
        request.setTemplateCode("SMS_151577642");
        //可选:模板中的变量替换JSON串,如模板内容为"亲爱的${name},您的验证码为${code}"时,此处的值为
        //友情提示:如果JSON中需要带换行符,请参照标准的JSON协议对换行符的要求,比如短信内容中包含\r\n的情况在JSON中需要表示成\\r\\n,否则会导致JSON在服务端解析失败
        request.setTemplateParam("{\"code\":\"" + randomCode + "\"}");
        //可选-上行短信扩展码(扩展码字段控制在7位或以下，无特殊需求用户请忽略此字段)
        //request.setSmsUpExtendCode("90997");
        //可选:outId为提供给业务方扩展字段,最终在短信回执消息中将此值带回给调用者
        //request.setOutId("yourOutId");
        //请求失败这里会抛ClientException异常
        SendSmsResponse sendSmsResponse = acsClient.getAcsResponse(request);
        if (sendSmsResponse.getCode() == null || !sendSmsResponse.getCode().equals("OK")) {
            //请求失败
            throw new ServiceException(sendSmsResponse.getMessage());
        }
        Subject subject = SecurityUtils.getSubject();
        subject.getSession().setAttribute("validCode", randomCode + ":" + System.currentTimeMillis());
        SendSMSBean sendSMSBean = new SendSMSBean();
        sendSMSBean.setTel(tel);
        sendSMSBean.setInfo("注册");
        sendSMSBean.setContent("code:" + randomCode);
        sendSMSBean.setTime(new Timestamp(System.currentTimeMillis()));
        dao.insert(sendSMSBean);
    }

}
