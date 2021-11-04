package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.*;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.radis.RedisUtil;
import com.jxctdzkj.cloudplatform.service.RoleManageService;
import com.jxctdzkj.cloudplatform.service.UserService;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import com.jxctdzkj.cloudplatform.utils.ReturnObject;
import com.jxctdzkj.cloudplatform.utils.Utils;
import com.jxctdzkj.support.utils.Encrypt;
import com.jxctdzkj.support.utils.TextUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.sql.Criteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <pre>
 *     author  : FlySand
 *     e-mail  : 1156183505@qq.com
 *     time    : 2018/7/28.
 *     desc    :
 * </pre>
 */
@Controller
@Slf4j
class BaseController {
    @Autowired
    Dao dao;

    @Autowired
    com.jxctdzkj.cloudplatform.service.RightsService rightsService;

    @Autowired
    RoleManageService roleManageService;

    @Autowired
    UserService userService;

    //
    @RequestMapping("/")
//    @ResponseBody
    public ModelAndView index(HttpServletRequest request) {
        return new ModelAndView("redirect:index");
    }

    @RequestMapping("/unauthorized")
    public String unauthorized() {
        //未授权页面
        return "unauthorized";
    }

    @RequestMapping("/register")
    public String register() {
        //注册
        return "register/register";
    }

    @RequestMapping("/fishRegister")
    public String fishRegister() {
        //注册
        return "register/fishRegister";
    }

    /**
     * 登录界面
     *
     * @return
     */
    @RequestMapping(value = "/doLogin")
    public ModelAndView doLogin(HttpServletRequest request) {
        //log.info("=========userName=" + userName + "   password =" + password);
        String name = "ManageSytem";
        //Proxy.newProxyInstance();
        String userType = null;
        String param = null;
        String demoUser = null;
        String demoPwd = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("doLogin".equals(cookie.getName())) {
                    param = cookie.getValue();
                } else if (Constant.USER_TYPE.equals(cookie.getName())) {
                    userType = cookie.getValue();
                } else if (Constant.DEMO_USER_NAME.equals(cookie.getName())) {
                    demoUser = cookie.getValue();
                } else if (Constant.DEMO_PASSWORD.equals(cookie.getName())) {
                    demoPwd = cookie.getValue();
                }
            }
        }
        String view = "login";
        HashMap<String, Object> map = new HashMap<>();
        if (StringUtils.isNotBlank(userType)) {
            switch (userType) {

                default:
                    view = "login";

            }
//            return new ModelAndView(view, "data", map);
        }

        // 如果演示用户信息不为空
        if (StringUtils.isNotBlank(demoUser) && StringUtils.isNotBlank(demoPwd)) {
            map.put("user", demoUser);
            map.put("pwd", demoPwd);
        } else {
            map.put("user", "");
            map.put("pwd", "");
        }

        if (StringUtils.isNotBlank(param)) {
            SysUserInfoBean userinfo = dao.fetch(SysUserInfoBean.class, Cnd.where("login_path", "=", param));
            if (userinfo != null) {
                name = userinfo.getSystematic();
            }
        }
        // 开通了私有化部署
        if (Constant.Privatisation.PRIVATISATION) {
            map.put("name", Constant.Privatisation.SYSTEM_NAME);
            map.put("registeredFunction", Constant.Privatisation.REGISTERED_FUNCTION);
        } else {
            map.put("name", name);
            map.put("registeredFunction", true);
        }

        return new ModelAndView(view, "data", map);
    }

    @RequestMapping("/login2")
    @ResponseBody
    public Object login2() {
        return ResultObject.error(Constant.HttpState.ERR_404, "login2");
    }

    @RequestMapping("html404")
    public Object html404() {
        return "/error/404";
    }

    @RequestMapping("/err404")
    @ResponseBody
    public Object err404() {
        return ResultObject.error(Constant.HttpState.ERR_404, "页面走丢了");
    }

    @RequestMapping("/err500")
    @ResponseBody
    public Object err500() {
        return ResultObject.error(Constant.HttpState.ERR_500, "系统维护中");
    }

    @RequestMapping("/noPermission")
    @ResponseBody
    public Object noPermission() {
        return ResultObject.error(Constant.HttpState.NO_PERMISSION, "无操作权限!");
    }

    @RequestMapping("/noLogin")
    @ResponseBody
    public Object noLogin() {
        return ResultObject.error(Constant.HttpState.NO_LOGIN, "请先登陆！");
    }


    @RequestMapping(value = "/getCode", method = RequestMethod.POST)
    @ResponseBody
    public Object getCode(@RequestParam(value = "phone") String phone) {

        if (phone.length() != 11) {
            //return ResultObject.apiError("请输入正确手机号");
            return ResultObject.apiError("error19");
        }
        RedisUtil redis = RedisUtil.getInstance();
        long saveTime = Long.valueOf(redis.getSaveString("time:" + phone, "0"));
        long currentTiem = System.currentTimeMillis();
        if (currentTiem - saveTime < 60000) {
            //return ResultObject.apiError("操作频繁，请1分钟后操作");
            return ResultObject.apiError("error20");
        }
        String code = Utils.getCodeRandom(4);
        redis.saveString("code:" + phone, code);
        redis.saveString("time:" + phone, System.currentTimeMillis() + "");
        log.info("code =" + code);
        //return ResultObject.ok("发送成功");
        return ResultObject.ok("ok5");
    }

    @RequestMapping(value = "/getUpdateInfo", method = RequestMethod.POST)
    @ResponseBody
    public Object getUpdateInfo(@RequestParam(value = "type") String type) {
        AppInfoBean appInfo = dao.fetch(AppInfoBean.class, type);

        if (appInfo == null)
            //return ResultObject.apiError("获取失败");
            return ResultObject.apiError("fail");

        return ResultObject.ok(appInfo);
    }

    @GetMapping("/loginState")
    @ResponseBody
    public Object loginState() {
        Object userName = SecurityUtils.getSubject().getSession().getAttribute("user");
        log.info("userName:" + userName);
        if (userName == null) {
            //return ResultObject.apiError("未登录");
            return ResultObject.apiError("err21");
        }
        //return ResultObject.ok("已登录");
        return ResultObject.ok("err22");
    }

    @GetMapping("/isLogin")
    @ResponseBody
    public ReturnObject isLogin() {
        ReturnObject result = new ReturnObject();
        result.setSuccess(true);
        Object userName = SecurityUtils.getSubject().getSession().getAttribute("user");
        log.info("userName:" + userName);
        if (userName == null) {
            //return ResultObject.apiError("未登录");
            result.setSuccess(false);
        }
        //return ResultObject.ok("已登录");
        return result;
    }

    @GetMapping("/logout")
    @ResponseBody
    public Object logout() {
        System.out.println("logout");
        try {
            Subject subject = SecurityUtils.getSubject();
            subject.logout();
            subject.getSession().removeAttribute("user");
        } catch (Exception e) {
            e.printStackTrace();
            //return ResultObject.apiError("退出失败");
            return ResultObject.apiError("err23");
        }

        //return ResultObject.ok("退出成功");
        return ResultObject.ok("ok6");
    }

    @RequestMapping("/sd")
    @ResponseBody
    public Object shutdown(String secretKey) {
        SysUserBean sysUserBean = ControllerHelper.getInstance(dao).getLoginUser();
        if (sysUserBean == null) {
            return ResultObject.apiError("Get the hell out of here");
        }
        if (sysUserBean.getLevel() != Constant.Define.ADMIN) {
            return ResultObject.apiError("fail ...");
        }
        if (!TextUtils.isEmpty(secretKey) && "9135417c7331cb7452764e4101a61aa3da3b4ab4".equals(Encrypt.md5AndSha(secretKey))) {
            System.exit(1);
        } else {
            return ResultObject.apiError("fail");
        }
        log.info("shutdown ...");
        return ResultObject.ok("shutdown success");
    }

    @RequestMapping("loginReset")
    @ResponseBody
    public Object loginReset(@RequestParam String userName) {
        RedisUtil redis = RedisUtil.getInstance();
        redis.delKey("loginFailTime:" + userName);
        redis.delKey("loginFailCount:" + userName);
        redis.delKey("loginFailWaitCount:" + userName);
        //return ResultObject.ok("重置成功");
        return ResultObject.ok("ok7");
    }

    /**
     * 获取农业管理下基地，中心，科研院所数量统计，类型ID
     *
     * @User 李英豪
     */
    @RequestMapping("baseCount")
    @ResponseBody
    public ResultObject baseCount() {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        if (StringUtils.isBlank(userBean.getUserName())) {
            return ResultObject.error("用户未登录");
        }
        try {
            List<BaseTypeBean> list = dao.query(BaseTypeBean.class, null);
            if (list.size() > 0) {
                int count = 0;
                List baseList = new ArrayList<>();
                Map<String, Object> map;
                for (BaseTypeBean baseTypeBean : list) {
                    //系统管理员可以查看所有基地
                    //企业管理员只能查看本企业的所有基地
                    Criteria cri = Cnd.cri();
                    if (userBean.getLevel() == Constant.Define.ROLE_1) {
                        cri.where().andInBySql("project_id", "SELECT id FROM project WHERE enterprise_id = (SELECT e.id FROM enterprise e,sys_user_info s WHERE e.name=s.company AND s.user_name = '%s')", userBean.getUserName());
                    } else if (userBean.getLevel() == Constant.Define.ROLE_2) {//普通用户只能查看自己创建的基地
                        cri.where().andEquals("create_user", userBean.getUserName());
                    }
                    cri.where().andEquals("type", baseTypeBean.getId());
                    map = new HashMap<>();
                    count = dao.count(Base.class, cri);
                    map.put("name", baseTypeBean.getName());
                    map.put("type", baseTypeBean.getId());
                    map.put("count", count);
                    baseList.add(map);
                }
                return ResultObject.ok().data("baseList", baseList);
            }
        } catch (Exception e) {
            return ResultObject.apiError("fail");
        }
        return ResultObject.ok();
    }

}
