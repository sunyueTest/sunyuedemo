package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.PageConfigBean;
import com.jxctdzkj.cloudplatform.bean.SysNoticeBean;
import com.jxctdzkj.cloudplatform.bean.SysUserBean;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.exception.ServiceException;
import com.jxctdzkj.cloudplatform.radis.RedisUtil;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import lombok.extern.slf4j.Slf4j;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.dao.sql.Sql;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <pre>
 *     @author  : FlySand
 *     @e-mail  : 1156183505@qq.com
 *     @time    : 2018/10/12.
 *     @desc    :
 * </pre>
 */
@Slf4j
@Controller
@RequestMapping({"home"})
public class HomeController {

    @Autowired
    Dao dao;

    @RequestMapping(value = "")
    public String index() {
        log.info("home");
        return "home";
    }

    //新增设备分布

    @RequestMapping(value = "deviceUser")
    public String indexDecvice() {
        log.info("home");
        return "homeDeviceByUser";
    }

//    @RequestMapping(value = "homePage")
//    public ModelAndView mclzHomePage(HttpServletRequest request) {
//        return new ModelAndView("mclzHomePage");
//    }
    @RequestMapping(value = "homePage")
    public ModelAndView homePage(HttpServletRequest request) {
        SysUserBean user = ControllerHelper.getInstance(dao).getLoginUser();
        //获取用户设备数、数据点数、触发器数、二级用户数
        Map<String, Object> model = new HashMap<>(8);
        if (user == null) {
            throw new ServiceException("用户未登录");
        }

        //获取用户设备数、数据点数、触发器数、二级用户数
        getStaticticalData(user, model);
        String lang = getCookie(Constant.COOKIE_LANG, request);
        //更新日志
        PageConfigBean bean;
        if (Constant.Redis.ENABLE) {
            bean = RedisUtil.getInstance().getSaveObject("PageConfigBean");
            if (bean == null) {
                bean = dao.fetch(PageConfigBean.class, Cnd.where("param", "=", "updateLog"));
                if (bean != null) {
                    RedisUtil.getInstance().saveObject("PageConfigBean", bean);
                    RedisUtil.getInstance().expire("PageConfigBean", 24 * 60 * 60 * 1000);
                }
            }
        } else {
            bean = dao.fetch(PageConfigBean.class, Cnd.where("param", "=", "updateLog"));
        }
        if (bean != null) {
            model.put("updateLog", "en".equals(lang) ? bean.getEnContent() : bean.getContent());
            //使用帮助
            bean = dao.fetch(PageConfigBean.class, Cnd.where("param", "=", "help"));
            model.put("help", "en".equals(lang) ? bean.getEnContent() : bean.getContent());
        } else {
            model.put("updateLog", "");
            model.put("help", "");
        }
        //系统通知。
        List<SysNoticeBean> list = dao.query(SysNoticeBean.class, Cnd.where("is_deleted", "=", "0"));
        model.put("notices", list);
        /**
         *获取app地址二维码
         */
        Sql sql = Sqls.create(" SELECT down_link FROM app_info where app_name= 'app'  ");
        sql.setCallback(Sqls.callback.str());
        dao.execute(sql);
        String appPath = sql.getString();
        model.put("appPath", appPath);
        //获取用户上次登陆时间
        model.put("lastLogin", user.getLastLoginTime());

        //用户等级
        model.put("level", user.getLevel());
        model.put("wechat_show", Constant.Privatisation.WECHAT_APPLET_SHOW);
        //dao.fetch(SysUserBean.class, Cnd.where("","",""));
        return new ModelAndView("homePage", "data", model);
    }


    @RequestMapping(value = "farmHomePage")
    public ModelAndView farmHomePage() {
        SysUserBean user = ControllerHelper.getInstance(dao).getLoginUser();
        //获取用户设备数、数据点数、触发器数、二级用户数
        Map<String, Object> model = new HashMap<>(8);
        if (user == null) {
            throw new ServiceException("用户未登录");
        }

        //获取用户设备数、数据点数、触发器数、二级用户数
        getStaticticalData(user, model);
        return new ModelAndView("farmHomePage", "data", model);
    }

    // 智慧公厕后台管理 home页
    @RequestMapping(value = "restroomHomePage")
    public ModelAndView restroomHomePage() {
        return new ModelAndView("restroomESB/restroomESBindex");
    }

    @RequestMapping(value = "getHelpEdit")
    public ModelAndView getHelpDetail(HttpServletRequest request) {
        String lang = getCookie(Constant.COOKIE_LANG, request);
        PageConfigBean bean = dao.fetch(PageConfigBean.class, Cnd.where("param", "=", "help"));
        if ("en".equals(lang)) {
            return new ModelAndView("helpEdit", "data", bean.getEnContent());
        } else {
            return new ModelAndView("helpEdit", "data", bean.getContent());
        }

    }

    @RequestMapping(value = "saveHelpDetail")
    @ResponseBody
    public void saveHelpDetail(String content, HttpServletRequest request) {
        String lang = getCookie(Constant.COOKIE_LANG, request);
        String sqlStr = "";
        if ("en".equals(lang)) {
            sqlStr = " update page_config set en_content=@content where param = @param  ";
        } else {
            sqlStr = " update page_config set content=@content where param = @param  ";
        }
        Sql sql = Sqls.create(sqlStr);
        sql.params().set("content", content);
        sql.params().set("param", "help");
        dao.execute(sql);
    }

    @RequestMapping(value = "getUpdateLog")
    public ModelAndView getUpdateLog(HttpServletRequest request) {
        String lang = getCookie(Constant.COOKIE_LANG, request);
        PageConfigBean bean = dao.fetch(PageConfigBean.class, Cnd.where("param", "=", "updateLog"));
        if ("en".equals(lang)) {
            return new ModelAndView("updateLog", "data", bean.getEnContent());
        }
        return new ModelAndView("updateLog", "data", bean.getContent());
    }

    @RequestMapping(value = "saveUpdateLog")
    @ResponseBody
    public void saveUpdateLog(String content, HttpServletRequest request) {
        String lang = getCookie(Constant.COOKIE_LANG, request);
        String sqlStr = "";
        if ("en".equals(lang)) {
            sqlStr = " update page_config set en_content=@content where param = @param  ";
        } else {
            sqlStr = " update page_config set content=@content where param = @param  ";
        }
        Sql sql = Sqls.create(sqlStr);
        sql.params().set("content", content);
        sql.params().set("param", "updateLog");
        dao.execute(sql);
    }

    private String getCookie(String key, HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        String lang = "";
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                String name = cookie.getName();
                if (Constant.COOKIE_LANG.equals(name)) {
                    lang = cookie.getValue();
                    break;
                }
            }
        }
        return lang;
    }

    //获取用户设备数、数据点数、触发器数、二级用户数
    private void getStaticticalData(SysUserBean user, Map<String, Object> model) {
        String userName = user.getUserName();
        if (user.getLevel() < 1) {
            //用户设备数
            Sql sql = Sqls.create(" SELECT count(1) from network  ");
            sql.setCallback(Sqls.callback.integer());
            sql.params().set("userName", userName);
            dao.execute(sql);
            int deviceNum = sql.getInt();
            model.put("deviceNum", deviceNum);

            //数据点数
            Sql sql2 = Sqls.create(" SELECT count(1) FROM sensor ");
            sql2.setCallback(Sqls.callback.integer());
            sql2.params().set("userName", userName);
            dao.execute(sql2);
            int dataNum = sql2.getInt();
            model.put("dataNum", dataNum);
            //触发器数。
            Sql sql4 = Sqls.create(" SELECT count(1) FROM trigger_alarm  ");
            sql4.setCallback(Sqls.callback.integer());
            dao.execute(sql4);
            int trigNum = sql4.getInt();
            model.put("trigNum", trigNum);

            Sql sql3 = Sqls.create(" SELECT count(1) FROM sys_user where level =2  ");
            sql3.setCallback(Sqls.callback.integer());
            sql3.params().set("userName", userName);
            dao.execute(sql3);
            int accountNum = sql3.getInt();
            model.put("accountNum", accountNum);
        } else {
            //用户设备数
            Sql sql = Sqls.create(" SELECT count(1) from sys_user_to_devcie where user_name =@userName and is_del=0");
            sql.setCallback(Sqls.callback.integer());
            sql.params().set("userName", userName);
            dao.execute(sql);
            int deviceNum = sql.getInt();
            model.put("deviceNum", deviceNum);

            //数据点数
//            Sql sql2 = Sqls.create(" SELECT count(1) FROM sensor a where exists (select b.ncode from sys_user_to_devcie b where b.ncode =a.sensor_ncode and b.user_name =@userName and b.is_del=0)");
            Sql sql2 = Sqls.create("SELECT count(1) FROM sensor a ,sys_user_to_devcie b where  b.ncode =a.sensor_ncode and b.user_name =@userName and b.is_del=0 ");
            sql2.setCallback(Sqls.callback.integer());
            sql2.params().set("userName", userName);
            dao.execute(sql2);
            int dataNum = sql2.getInt();
            model.put("dataNum", dataNum);

            //触发器数。
            Sql sql4 = Sqls.create(" SELECT count(1) FROM trigger_alarm where user_name= @userName and is_del = 0 ");
            sql4.setCallback(Sqls.callback.integer());
            sql4.params().set("userName", userName);
            dao.execute(sql4);
            int trigNum = sql4.getInt();
            model.put("trigNum", trigNum);
            //二级用户数
            Sql sql3 = Sqls.create(" SELECT count(1) FROM sys_user where parentuser= @userName  ");
            sql3.setCallback(Sqls.callback.integer());
            sql3.params().set("userName", userName);
            dao.execute(sql3);
            int accountNum = sql3.getInt();
            model.put("accountNum", accountNum);
        }
    }
}
