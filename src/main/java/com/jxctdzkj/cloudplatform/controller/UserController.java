package com.jxctdzkj.cloudplatform.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.jxctdzkj.cloudplatform.bean.SysUserBean;
import com.jxctdzkj.cloudplatform.bean.SysUserInfoBean;
import com.jxctdzkj.cloudplatform.bean.SysUserLevel;
import com.jxctdzkj.cloudplatform.bean.UserDeviceBean;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.opLog.EnableOpLog;
import com.jxctdzkj.cloudplatform.service.UserService;
import com.jxctdzkj.cloudplatform.utils.*;
import com.jxctdzkj.support.utils.Encrypt;
import com.jxctdzkj.support.utils.TextUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.session.Session;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.pager.Pager;
import org.nutz.trans.Atom;
import org.nutz.trans.Trans;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.sql.Connection;
import java.sql.Timestamp;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * <pre>
 *     author  : FlySand
 *     e-mail  : 1156183505@qq.com
 *     time    : 2018/7/31.
 *     desc    :
 * </pre>
 */
@Slf4j
@RestController
@RequestMapping({"user"})
public class UserController {
    @Autowired
    Dao dao;

    @Autowired
    UserService userService;

    /**
     * 注册一级用户
     */
    @RequestMapping(value = "register/main", method = RequestMethod.POST)
    public Object registerMainAccout(
            @RequestParam(value = "userName") String userName,
            @RequestParam(value = "password") String password,
            @RequestParam(value = "phone") String phone,
            @RequestParam(value = "code") String code) {
        log.info("userName =" + userName + "  password = " + password + "   phone =" + phone + "  code=" + code);
        if (Constant.Define.SYS_USER.equals(userName)) {
            log.info("系统用户不允许注册！");
            return ResultObject.apiError("用户已注册");
        }
        //校验
        Object result = CodeUtil.checkCode(phone, code);
        if (result != null) {
            return result;
        }
        SysUserBean user = new SysUserBean();
        user.setUserName(userName);
        user.setTel(phone);
        user.setCreatTime(new Timestamp(System.currentTimeMillis()));
        user.setPassword(Encrypt.e(password));
        user.setLevel(Constant.Define.ROLE_1);
        return createUser(user);
    }


    /**
     * 注册二级用户
     */
    @RequestMapping(value = "register/sub", method = RequestMethod.POST)
    public Object registerSubAccout(
            @RequestParam(value = "userName") String userName,
            @RequestParam(value = "password") String password) {
        log.info("userName =" + userName + "  password = " + password);
        if (Constant.Define.SYS_USER.equals(userName)) {
            log.info("系统用户不允许注册！");
            return ResultObject.apiError("用户已注册");
        }
        Session session = SecurityUtils.getSubject().getSession();
        String currentUser = session.getAttribute("user").toString();
        String level = session.getAttribute("level").toString();
        if (Integer.parseInt(level) > Constant.Define.ROLE_1) {
            return ResultObject.error(Constant.HttpState.NO_PERMISSION, "无操作权限");
        }
        //是否超出创建数量
        List<SysUserBean> userBeans = dao.query(SysUserBean.class, Cnd.where("parentUser", "=", currentUser).and("is_del", "=", 0));
        log.info("当前用户创建了：" + userBeans.size() + " 子个用户");
        SysUserLevel sysRole = dao.fetch(SysUserLevel.class, level);
        log.info("sysRole：" + sysRole);
        if (sysRole == null) {
            return ResultObject.error(Constant.HttpState.NO_PERMISSION);
        } else if (userBeans.size() >= sysRole.getCreateSubAccountNum()) {
            return ResultObject.apiError("最多可创建" + sysRole.getCreateSubAccountNum() + "个账户");
        }
        SysUserBean user = new SysUserBean();
        user.setUserName(userName);
        user.setPassword(Encrypt.e(password));
        user.setLevel(Constant.Define.ROLE_2);
        user.setCreatTime(new Timestamp(System.currentTimeMillis()));
        user.setParentUser(SecurityUtils.getSubject().getSession().getAttribute("user").toString());
        return createUser(user);
    }

    /**
     * 修改密码
     */
    @EnableOpLog
    @RequestMapping(value = "modifyPassword", method = RequestMethod.POST)
    public Object modifyPassword(@RequestParam(value = "oldPassword") String oldPassword,
                                 @RequestParam(value = "newPassword") String newPassword) {
       // SysUserBean sysUserBean =
        String userName = ControllerHelper.getLoginUserName();
        SysUserBean sysUserBean = dao.fetch(SysUserBean.class,Cnd.where("user_name","=",userName));
        if (sysUserBean == null) {
            return ResultObject.apiError("用户未注册");
        }
        if (TextUtils.isEmpty(oldPassword) || TextUtils.isEmpty(newPassword)) {
            return ResultObject.apiError("密码为空");
        }
        if (sysUserBean.getPassword().equals(Encrypt.e(oldPassword))) {
            sysUserBean.setPassword(Encrypt.e(newPassword));
            if (dao.update(sysUserBean) > 0) {
                SecurityUtils.getSubject().logout();
                return ResultObject.ok("修改成功").data(sysUserBean);
            } else {
                return ResultObject.apiError("修改失败");
            }
        }
        return ResultObject.apiError("密码错误");
    }

    /**
     * 重置一级用户密码
     */
    @EnableOpLog
    @RequestMapping(value = "resetPassword/main", method = RequestMethod.POST)
    public Object resetPassword(
            @RequestParam(value = "userName") String userName,
            @RequestParam(value = "newPassword") String newPassword,
            @RequestParam(value = "phone") String phone,
            @RequestParam(value = "code") String code) {
        int level = ControllerHelper.getInstance(dao).getLoginUserLevel();
        log.info("level=" + level);
        if (level > Constant.Define.ROLE_1) {
            log.info("二级用户不能修改自己的密码");
            return ResultObject.error(Constant.HttpState.NO_PERMISSION, "无操作权限");
        }
        SysUserBean loginUser = dao.fetch(SysUserBean.class, Cnd.where("user_name", "=", userName).and("is_del", "=", 0));
        if (loginUser == null) {
            return ResultObject.apiError("用户未注册!");
        }
        //校验code
        Object result = CodeUtil.checkCode(phone, code);
        if (result != null) {
            return result;
        }
        loginUser.setPassword(Encrypt.e(newPassword));
        loginUser.setTel(phone);
        dao.update(loginUser);
        return ResultObject.ok("重置成功");
    }

    /**
     * 重置二级用户密码
     */
    @EnableOpLog
    @RequestMapping(value = "resetPassword/sub", method = RequestMethod.POST)
    public Object resetSubPassword(
            @RequestParam(value = "userName") String userName,
            @RequestParam(value = "newPassword") String newPassword) {
        Session session = SecurityUtils.getSubject().getSession();
        String level = session.getAttribute("level").toString();
        log.info("level=" + level);
        if (Integer.parseInt(level) > Constant.Define.ROLE_1) {
            log.info("二级用户不能修改自己的密码");
            return ResultObject.error(Constant.HttpState.NO_PERMISSION, "无操作权限");
        }
        SysUserBean fUser = dao.fetch(SysUserBean.class, Cnd.where("user_name", "=", userName).and("is_del", "=", 0));
        if (fUser == null) {
            return ResultObject.apiError("用户未注册!");
        }
        if (fUser.getLevel() == Constant.Define.ROLE_1) {
            log.info("当前接口是重置二级用户的密码，一级用户不能修改密码");
            return ResultObject.error(Constant.HttpState.NO_PERMISSION, "无操作权限");
        }
        fUser.setPassword(Encrypt.e(newPassword));
        dao.update(fUser);
        return ResultObject.ok("重置成功");
    }

    /**
     * 修改用户信息
     */
    @EnableOpLog
    @RequestMapping(value = "updateUserInfo", method = RequestMethod.POST)
    public Object upSubUserInfo(
            @RequestParam(value = "userName") String userName,
            @RequestParam(value = "newPassword") String newPassword,
            @RequestParam(value = "realName") String realName,
            @RequestParam(value = "email") String email,
            @RequestParam(value = "tel") String tel) {
        SysUserBean userBean = dao.fetch(SysUserBean.class, Cnd.where("user_name", "=", userName).and("is_del", "=", 0));
        if (userBean == null) {
            return ResultObject.apiError("err55");//用户不存在
        }
        ControllerHelper helper = ControllerHelper.getInstance(dao);
        if (helper.getLoginUserLevel() < Constant.Define.ROLE_1 || helper.getLoginUserName().equals(userBean.getParentUser())) {
            if (!TextUtils.isEmpty(newPassword)) {
                userBean.setPassword(Encrypt.e(newPassword));
            }
            if (!TextUtils.isEmpty(realName)) {
                userBean.setRealName(realName);
            }
            if (!TextUtils.isEmpty(email)) {
                userBean.setEmail(email);
            }
            if (!TextUtils.isEmpty(tel)) {
                userBean.setTel(tel);
            }
            if (dao.update(userBean) > 0) {
                return ResultObject.ok("ok4").data(userBean);//修改成功
            }
        } else {
            return ResultObject.apiError("err102");//未管理此用户
        }

        return ResultObject.apiError("error17");//修改失败
    }

    /**
     * 创建用户
     *
     * @param sysUser
     * @return
     */
    private Object createUser(SysUserBean sysUser) {
        //查重
        SysUserBean loginUser = dao.fetch(SysUserBean.class, Cnd.where("user_name", "=", sysUser.getUserName()).and("is_del", "=", 0));
        if (loginUser != null) {
            return ResultObject.apiError("用户已注册!");
        }
        //创建用户
        SysUserBean createUser = dao.insert(sysUser);
        log.info("insert success");
        log.info("成功创建用户：" + createUser);
        CodeUtil.resetCode(createUser.getTel());

        return ResultObject.ok("注册成功").data(createUser);
    }

    /**
     * 删除二级用户
     */
    @EnableOpLog(Constant.ModifyType.DELETE)
    @RequestMapping(value = "delSubUser", method = RequestMethod.GET)
    public Object delSubUser(
            @RequestParam(value = "userName") String userName) {

        Session session = SecurityUtils.getSubject().getSession();
        String currentUser = session.getAttribute("user").toString();
        if (userName.equals(currentUser)) {
            log.info("不能删除自己");
            return ResultObject.apiError("当前登录用户不允许删除");
        }

        SysUserBean loginUser = dao.fetch(SysUserBean.class, currentUser);
        SysUserBean delUser = dao.fetch(SysUserBean.class, userName);
        if (delUser == null || delUser.getIsDel() == 1) {
            return ResultObject.apiError("用户已被删除");
        }
        if (loginUser.getLevel() > Constant.Define.ROLE_1) {
            log.info("二级用户不能删除用户");
            return ResultObject.error(Constant.HttpState.NO_PERMISSION, "无操作权限");
        }
        if (!delUser.getParentUser().equals(currentUser)) {
            log.info("不能删除别人的二级用户");
            return ResultObject.apiError("未管理此用户");
        }
        //进行事物删除
        try {
            Trans.exec(Connection.TRANSACTION_READ_UNCOMMITTED, (Atom) () -> {
                //删除用户
                delUser.setIsDel(1);
                if (dao.update(delUser) > 0) {
                    log.info("删除用户成功");
                }
                //删除用户绑定的设备
                List<UserDeviceBean> deviceBeans = dao.query(UserDeviceBean.class, Cnd.where("user_name", "=", userName));
                log.info("当前用户绑定" + deviceBeans.size() + "个设备");
                for (int i = 0; i < deviceBeans.size(); i++) {
                    UserDeviceBean userDeviceBean = deviceBeans.get(i);
                    userDeviceBean.setIsDel(1);
                    log.info("删除设备:" + userDeviceBean.getDeviceName() + "    DeviceNumber: " + userDeviceBean.getDeviceNumber());
                    if (dao.update(userDeviceBean) > 0) {
                        log.info("成功");
                    } else {
                        log.info("失败");
                        new RuntimeException("删除设备: " + userDeviceBean.getDeviceName() + "失败");
                    }
                }
            });
            return ResultObject.ok("删除成功");
        } catch (Exception e) {
            e.printStackTrace();
            log.error("Exception = " + e.getMessage());
        }
        return ResultObject.apiError("删除失败");
    }

    /**
     * 删除用户绑定的设备
     */
    @EnableOpLog(Constant.ModifyType.DELETE)
    @RequestMapping(value = "delDevice", method = RequestMethod.POST)
    public Object delDevice(@RequestParam(value = "deviceNumber") String deviceNumer) {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        SysUserBean sysUserBean = dao.fetch(SysUserBean.class, userName);
        if (sysUserBean.getLevel() < 1) {
            return ResultObject.apiError("管理员不能删除设备");
        }
        List<UserDeviceBean> userDeviceBeans = dao.query(UserDeviceBean.class, Cnd.where("user_name", "=", userName).and("Ncode", "=", deviceNumer).and("is_del", "=", "0"));
        if (userDeviceBeans.size() == 0) {
            return ResultObject.apiError("未绑定此设备");
        } else {
            UserDeviceBean userDeviceBean = userDeviceBeans.get(0);
            userDeviceBean.setIsDel(1);
            if (dao.update(userDeviceBean) > 0) {
                return ResultObject.ok("删除成功");
            }
        }
        return ResultObject.apiError("删除失败");
    }

    /**
     * 查询一级用户下的所有二级用户
     */
    @RequestMapping(value = "selSubUserList", method = RequestMethod.POST)
    public Object selSubUserList(
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "100") int size) {
        Pager pager = dao.createPager(page, size);
        String userName = SecurityUtils.getSubject().getSession().getAttribute("user").toString();
        log.info("userName=" + userName);
        List<SysUserBean> loginUser = dao.query(SysUserBean.class, Cnd.where("parentuser", "=", userName).and("is_del", "=", 0), pager);
        return ResultObject.okList(loginUser, page, size);
    }

    /**
     * 修改中性
     */
    @EnableOpLog
    @RequestMapping(value = "upUserDetails", method = RequestMethod.POST)
    public Object upUserDetails(@RequestParam("systematic") String systematic, @RequestParam("company") String company,
                                @RequestParam("loginPath") String loginPath, MultipartFile file) {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        SysUserBean userBean = dao.fetch(SysUserBean.class, userName);
        if (userBean == null) {
            return ResultObject.apiError("err55");//用户不存在
        }
        boolean isInsert = false;
        SysUserInfoBean userInfoBean = dao.fetch(SysUserInfoBean.class, userName);
        if (userInfoBean == null) {
            isInsert = true;
            userInfoBean = new SysUserInfoBean();
            userInfoBean.setUserName(userName);
        }
        userInfoBean.setSystematic(systematic);
        userInfoBean.setCompany(company);

        //当登录页后缀不为空字符串的时候才进行如下处理
        if (StringUtils.isNotBlank(loginPath)) {
            if (loginPath.length() > 16) {
                return ResultObject.apiError("err97");//登录页后缀长度不能超过16
            }

            if (!loginPath.equals(userInfoBean.getLoginPath())) {
                SysUserInfoBean userinfo = dao.fetch(SysUserInfoBean.class, Cnd.where("login_path", "=", loginPath));
                if (userinfo != null) {
                    return ResultObject.apiError("err98");//后缀已被占用
                }

                userInfoBean.setLoginPath(loginPath);
            }
        } else {
            userInfoBean.setLoginPath(null);
        }

        //生成小程序二维码
        if (TextUtils.isEmpty(userInfoBean.getQrcode())) {
            try {
                File qrcodeFile = WeCatQRCode.getInstance().getCode(userName);
                if (qrcodeFile != null) {
                    String uploadResult = FlieHttpUtil.uploadFile(Constant.Url.FILE_UPLOAD_URL, qrcodeFile);
                    log.info("uploadResult :" + uploadResult);
                    JSONObject request = JSON.parseObject(uploadResult);
                    String fileName = request.getJSONObject("data").getString("fileName");
                    if (TextUtils.isEmpty(fileName)) {
                        throw new RuntimeException("fileName  isEmpty");
                    }
                    log.info("fileName:" + fileName);
                    userInfoBean.setQrcode(Constant.Url.FILE_DOWNLOAD_PATH + fileName);
                    qrcodeFile.delete();
                }
            } catch (Exception e) {
                e.printStackTrace();
                return ResultObject.apiError("err99");//二维码生成失败
            }
        }
        if (file != null) {
            try {
                setLogo(userInfoBean, file);
            } catch (Exception e) {
                e.printStackTrace();
                return ResultObject.apiError("err100");//文件上传失败
            }
        }
        if (isInsert) {
            if (dao.insert(userInfoBean) != null) {
                return ResultObject.ok("ok4").data(userInfoBean);//修改成功
            }
        } else {
            if (dao.update(userInfoBean) > 0) {
                return ResultObject.ok("ok4").data(userInfoBean);//修改成功
            }
        }
        return ResultObject.apiError("error17");//修改失败
    }

    @RequestMapping("updateLogo")
    @ResponseBody
    @EnableOpLog
    public ResultObject updateLogo(MultipartFile file) {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        SysUserBean userBean = dao.fetch(SysUserBean.class, userName);
        if (userBean == null) {
            return ResultObject.apiError("err55");//用户不存在
        }
        boolean isInsert = false;
        SysUserInfoBean userInfoBean = dao.fetch(SysUserInfoBean.class, userName);
        if (userInfoBean == null) {
            isInsert = true;
            userInfoBean = new SysUserInfoBean();
            userInfoBean.setUserName(userName);
        }

        if (file != null) {
            try {
                setLogo(userInfoBean, file);
            } catch (Exception e) {
                e.printStackTrace();
                return ResultObject.apiError("err100");//文件上传失败
            }
        }
        if (isInsert) {
            if (dao.insert(userInfoBean) != null) {
                return ResultObject.ok("ok4").data(userInfoBean);//修改成功
            }
        } else {
            if (dao.update(userInfoBean) > 0) {
                return ResultObject.ok("ok4").data(userInfoBean);//修改成功
            }
        }
        return ResultObject.apiError("error17");//修改失败
    }

    //设置logo
    private void setLogo(SysUserInfoBean userInfoBean, MultipartFile file) {
        String uploadResult = FlieHttpUtil.uploadFile(Constant.Url.FILE_UPLOAD_URL, file);
        log.info("uploadResult:" + uploadResult);
        JSONObject request = JSON.parseObject(uploadResult);
        String fileName = request.getJSONObject("data").getString("fileName");
        if (TextUtils.isEmpty(fileName)) {
            throw new RuntimeException("fileName  isEmpty");
        }
        log.info("fileName:" + fileName);
        String delFileName = userInfoBean.getLogo();
        if (!TextUtils.isEmpty(delFileName)) {
            int index = delFileName.lastIndexOf("/");
            if (index > 0) {
                delFileName = delFileName.substring(index + 1, delFileName.length());
            }
            log.info("del:" + delFileName);
            log.info(FlieHttpUtil.deleteFile(delFileName));
        }
        userInfoBean.setLogo(Constant.Url.FILE_DOWNLOAD_PATH + fileName);
    }

    /**
     * 查询用户详情
     */
    @RequestMapping(value = "selUserDetails", method = RequestMethod.POST)
    public Object selSubUserList() {
        //霍文博修改
//        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        String loginUserName = ControllerHelper.getLoginUserName();
        SysUserBean userBean = userService.getUserInfo(loginUserName);
        if (userBean != null) {
            SysUserInfoBean userInfoBean = null;
            if (userBean.getLevel() > Constant.Define.ROLE_1) {
                userInfoBean = dao.fetch(SysUserInfoBean.class, userBean.getParentUser());
            } else {
                userInfoBean = dao.fetch(SysUserInfoBean.class, userBean.getUserName());
            }

            if (userInfoBean == null) {
                userInfoBean = new SysUserInfoBean();
                userInfoBean.setUserName(userBean.getUserName());
                userInfoBean = dao.insert(userInfoBean);
            }
            if (TextUtils.isEmpty(userInfoBean.getQrcode())) {
                userInfoBean.setQrcode(Constant.Address.QRCODE);
            }
            // 如果userInfo的CustomizationFlag 为空 设值为注册时间的180天后
            if (userInfoBean.getCustomizationFlag() == null || StringUtils.isBlank(userInfoBean.getCustomizationFlag().toString())) {
                Calendar c = Calendar.getInstance();
                if (userBean.getCreatTime() != null) {
                    c.setTime(userBean.getCreatTime());
                } else {
                    c.setTime(new Date());
                }
                c.add(Calendar.DAY_OF_MONTH, Constant.Project.CUSTOMIZATION_TIME);
                userInfoBean.setCustomizationFlag(new Timestamp(c.getTime().getTime()));
                dao.update(userInfoBean);
            }
            // 私有化配置
            userInfoBean = PrivatisationUtils.setPrivatisationInfo(userInfoBean);
            return ResultObject.ok("ok8").data("user", userBean).data("info", userInfoBean);//查询成功
        }
        return ResultObject.apiError("err101");//查询失败
    }

    /**
     * 修改系统设置
     */
    @EnableOpLog
    @RequestMapping(value = "upSystemSetting", method = RequestMethod.POST)
    public Object upSystemSetting(@RequestParam int setting) {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        if (!TextUtils.isEmpty(userName)) {
            SysUserInfoBean userInfoBean = dao.fetch(SysUserInfoBean.class, userName);
            if (userInfoBean == null) {
                userInfoBean = new SysUserInfoBean();
                userInfoBean.setUserName(userName);
                userInfoBean.setSystemSetting(setting);
                dao.insert(userInfoBean);
                return ResultObject.ok("ok4").data("info", userInfoBean);//修改成功
            } else {
                userInfoBean.setSystemSetting(setting);
                if (dao.update(userInfoBean) > 0) {
                    return ResultObject.ok("ok4").data("info", userInfoBean);//修改成功
                }
            }
        }
        return ResultObject.apiError("error17");//修改失败
    }

    /**
     * 修改中性
     */
    @EnableOpLog
    @RequestMapping(value = "upSystemStyle", method = RequestMethod.POST)
    public Object upSystemStyle(@RequestParam("style") int style) {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        SysUserBean userDeviceBean = dao.fetch(SysUserBean.class, Cnd.where("user_name", "=", userName).and("is_del", "=", 0));
        if (userDeviceBean == null) {
            return ResultObject.apiError("err55");//用户不存在
        }
        SysUserInfoBean userInfoBean = dao.fetch(SysUserInfoBean.class, userName);
        if (userInfoBean != null) {
            userInfoBean.setStyle(style);
            if (dao.update(userInfoBean) > 0) {
                return ResultObject.ok("ok4").data("info", userInfoBean);//修改成功
            }
        } else {
            userInfoBean = new SysUserInfoBean();
            userInfoBean.setUserName(userName);
            userInfoBean.setStyle(style);
            dao.insert(userInfoBean);
            return ResultObject.ok("ok4").data("info", userInfoBean);//修改成功
        }
        return ResultObject.apiError("error17");//修改失败
    }

    /**
     * 查询用户信息
     */
    @RequestMapping(value = "selUserInfo", method = RequestMethod.POST)
    public Object selUserInfo() {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        if (!TextUtils.isEmpty(userName)) {
            SysUserInfoBean userInfoBean = dao.fetch(SysUserInfoBean.class, userName);
            if (userInfoBean == null) {
                userInfoBean = new SysUserInfoBean();
                userInfoBean.setUserName(userName);
                dao.insert(userInfoBean);
            }
            return ResultObject.ok("ok8").data(userInfoBean);//查询成功
        }
        return ResultObject.apiError("err101");//查询失败
    }
}
