package com.jxctdzkj.cloudplatform.utils;

import com.jxctdzkj.cloudplatform.bean.DeviceBean;
import com.jxctdzkj.cloudplatform.bean.SysUserBean;
import com.jxctdzkj.cloudplatform.bean.UserDeviceBean;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.support.utils.TextUtils;

import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.session.Session;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.dao.sql.Sql;

import java.util.List;

import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 *     @author  : FlySand
 *     @e-mail  : 1156183505@qq.com
 *     @time    : 2018/8/29.
 *     @desc    :
 * </pre>
 */
@Slf4j
public class ControllerHelper {

    private Dao dao;
    private static ControllerHelper instance;

    private ControllerHelper(Dao dao) {
        this.dao = dao;
    }

    public static ControllerHelper getInstance(Dao dao) {
        if (instance == null) {
            synchronized (ControllerHelper.class) {
                if (instance == null) {
                    instance = new ControllerHelper(dao);
                }
            }
        }
        return instance;
    }

    public SysUserBean getLoginUser() {
        Session session = SecurityUtils.getSubject().getSession();
        SysUserBean sysUserBean = null;
        try {
            sysUserBean = (SysUserBean) session.getAttribute("userBean");
            log.info("userName =" + sysUserBean.getUserName());
        } catch (Exception e) {
            e.printStackTrace();
            String userName = session.getAttribute("user") == null ? "" : session.getAttribute("user") + "";
            log.info("userName =" + userName);
            if (StringUtils.isNotBlank(userName)) {
                sysUserBean = dao.fetch(SysUserBean.class, Cnd.where("user_name", "=", userName).and("is_del", "=", 0));
            }
        }
        if (sysUserBean == null) {
            SecurityUtils.getSubject().logout();
        }
        return sysUserBean;
    }

    public static String getLoginUserName() {
        Session session = SecurityUtils.getSubject().getSession();
        Object user = session.getAttribute("user");
        String userName = user == null ? "" : user.toString();
        log.info("userName =" + userName);
        return userName;
    }

    public Object checkDevice(DeviceBean deviceBean) {
        if (deviceBean == null) {
            return ResultObject.apiError("设备不存在");
        }
        Session session = SecurityUtils.getSubject().getSession();
        String userName = session.getAttribute("user").toString();
        log.info("userName =" + userName);
        List<UserDeviceBean> deviceBeans = dao.query(UserDeviceBean.class, Cnd.where("Ncode", "=", deviceBean.getDeviceNumber()).and("user_name", "=", userName).and("is_del", "=", "0"));
        if (deviceBeans.size() > 0) {
            if (!TextUtils.isEmpty(deviceBeans.get(0).getDevicePassword())
                    && !deviceBeans.get(0).getDevicePassword().equals(deviceBean.getPassword())) {
                return ResultObject.error(Constant.HttpState.PASSWORD_ERR, "绑定密码错误");
            }
        } else {
            return ResultObject.apiError("未绑定此设备");
        }
        return null;
    }

    public static int getLoginUserLevel() {
        try {
            Session session = SecurityUtils.getSubject().getSession();
            String level = session.getAttribute("level") + "";
            return Integer.parseInt(level);
        } catch (Exception e) {
            log.error(e.toString(), e);
            return 1;
        }
    }

    public long getCount(String tabName) {
        Sql sql = Sqls.create("SELECT count(1) FROM " + tabName);
        sql.setCallback(Sqls.callback.longValue());
        dao.execute(sql);
        return sql.getLong();
    }
}
