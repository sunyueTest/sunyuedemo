package com.jxctdzkj.cloudplatform.controller;

import com.alibaba.fastjson.JSON;
import com.jxctdzkj.cloudplatform.bean.AquacultureDiseasesBean;
import com.jxctdzkj.cloudplatform.bean.PageConfigBean;
import com.jxctdzkj.cloudplatform.bean.SysNoticeBean;
import com.jxctdzkj.cloudplatform.bean.SysUserBean;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.exception.ServiceException;
import com.jxctdzkj.cloudplatform.radis.RedisUtil;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.HttpUtilsNew;
import lombok.extern.slf4j.Slf4j;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.dao.sql.Sql;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
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

    @Autowired
    protected Environment env;

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
        //登录验证接口
        String account = env.getProperty("yun.zuotoujing.net.account");
        String password = env.getProperty("yun.zuotoujing.net.password");
        HashMap<String, String> map22 = new HashMap<String,String>();
        map22.put("account", account);
        map22.put("passwd", password);
        String s3 = HttpUtilsNew.doPost("http://yun.zuotoujing.net:8088/service-api-v3/wlx/user/03/login", map22);
        String data = JSON.parseObject(s3, HashMap.class).get("data").toString();
        String at = JSON.parseObject(data, HashMap.class).get("at").toString();
        String guid = JSON.parseObject(data, HashMap.class).get("guid").toString();
        String id = JSON.parseObject(data, HashMap.class).get("id").toString();

        //获取设备列表
        HashMap<String, String> map1 = new HashMap<String,String>();
        map1.put("uid", id);
        map1.put("at", at);
        map1.put("guid", guid);
        map1.put("resultFields", "{id,devAlias,id,termType,devAlias}");
        String s1 = HttpUtilsNew.doPost("http://yun.zuotoujing.net:8088/service-api-v3/wlx/data/03/devList", map1);
        String datas = JSON.parseObject(s1, HashMap.class).get("data").toString();
        List<Object> list =JSON.parseArray(datas);

        //添加分类详情列表
        List<AquacultureDiseasesBean> contentList = new ArrayList<AquacultureDiseasesBean>();
        for (Object object : list){
            AquacultureDiseasesBean bean = new AquacultureDiseasesBean();
            Map <String,Object> ret = (Map<String, Object>) object;//取出list里面的值转为map
            Object devAlias = ret.get("id");
            bean.setIds(ret.get("id").toString());
            bean.setSpeciesId(0);
            bean.setDiseasesName(ret.get("devAlias").toString());
            contentList.add(bean);
        }


        //用户设备数
        model.put("deviceNum", contentList.size());

        //数据点数
        model.put("dataNum", contentList.size()*120);
        //触发器数。
        Sql sql4 = Sqls.create(" SELECT count(1) FROM project  ");
        sql4.setCallback(Sqls.callback.integer());
        dao.execute(sql4);
        int trigNum = sql4.getInt();
        model.put("trigNum", trigNum);

        Sql sql3 = Sqls.create(" SELECT count(1) FROM sys_user  ");
        sql3.setCallback(Sqls.callback.integer());
        sql3.params().set("userName", userName);
        dao.execute(sql3);
        int accountNum = sql3.getInt();
        model.put("accountNum", accountNum);

    }
}
