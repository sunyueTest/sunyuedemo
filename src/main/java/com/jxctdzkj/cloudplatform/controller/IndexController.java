package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.SysRightsBean;
import com.jxctdzkj.cloudplatform.bean.SysRoleBean;
import com.jxctdzkj.cloudplatform.bean.SysUserBean;
import com.jxctdzkj.cloudplatform.bean.SysUserInfoBean;
import com.jxctdzkj.cloudplatform.bean.UserRoleBean;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.exception.ServiceException;
import com.jxctdzkj.cloudplatform.radis.RedisUtil;
import com.jxctdzkj.cloudplatform.service.LoginService;
import com.jxctdzkj.cloudplatform.service.RightsService;
import com.jxctdzkj.cloudplatform.service.RoleManageService;
import com.jxctdzkj.cloudplatform.service.UserService;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import com.jxctdzkj.cloudplatform.utils.ReturnObject;
import com.jxctdzkj.cloudplatform.utils.Utils;
import com.jxctdzkj.support.utils.Encrypt;
import com.jxctdzkj.support.utils.TextUtils;

import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.mail.MessagingException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping({"/index"})
public class IndexController extends BaseController {

    @Autowired
    LoginService loginService;

    @Autowired
    UserService userService;

    @Autowired
    RoleManageService roleManageService;

    @Autowired
    RightsService rightsService;

    @RequestMapping(value = "")
    public ModelAndView index(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String userName = ControllerHelper.getLoginUserName();
        if (TextUtils.isEmpty(userName)) {
            return doLogin(request);
        }
        Map<String, Object> result = new HashMap<>();
        UserRoleBean userRole = roleManageService.getUserRole(userName);
        SysRoleBean roleBean = dao.fetch(SysRoleBean.class, userRole.getRoleId());
        int roleId = userRole.getRoleId();
        String from = request.getParameter("from");
        result.put("showReturn", false);
        if (userRole != null) {
            if ("admin".equals(from)) {//区分是否切换后台，一用户俩角色
                if (roleBean != null && roleBean.getAdminRole() > 0) {
                    roleId = roleBean.getAdminRole();
                    roleBean = dao.fetch(SysRoleBean.class, roleId);
                    result.put("showReturn", true);
                }
            } else if (userRole.getIndexType() == 2 && !"monitor".equals(from)) {
                return new ModelAndView("redirect:/monitor");
            }
        }
        //查询用户的权限菜单
        List<SysRightsBean> menus = rightsService.getMenus(roleId);
        Cookie[] cookies = request.getCookies();
        String language = "";
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                String name = cookie.getName();
                if (Constant.COOKIE_LANG.equals(name)) {
                    language = cookie.getValue();
                    break;
                }
            }
        }
        result.put("lang", language);
        result.put("menus", menus);
        // 开通(同意用户协议功能) 私有化部署(否)
        if (Constant.Privatisation.SHOW_USER_AGREEMENT) {
            try {
                Session session = SecurityUtils.getSubject().getSession();
                result.put("agreement", Constant.Define.AGREEMENT_VERSION > Integer.parseInt(session.getAttribute("agreement") + ""));
            } catch (Exception e) {
                result.put("agreement", false);
                log.error(e.toString(), e);
            }
        } else {
            result.put("agreement", false);
        }
        result.put("showUserAgreement", Constant.Privatisation.SHOW_USER_AGREEMENT);
        result.put("showHelpDocs", Constant.Privatisation.SHOW_HELP_DOCS);
        result.put("index", "index");
        result.put("helpUrl", Constant.Address.HELP_DOCS);
        if (Constant.Privatisation.PRIVATISATION) {
            result.put("showLogo", Constant.Privatisation.INDEX_LOGO_SHOW);
        } else {
            result.put("showLogo", true);
        }
        if (roleBean != null) {
            if (StringUtils.isNotBlank(roleBean.getIndexUrl()) && !("index_farm".equals(roleBean.getIndexUrl()))) {
                return new ModelAndView(roleBean.getIndexUrl(), "map", result);
            }
            result.put("index", roleBean.getIndexUrl());
        }
        return new ModelAndView("index", "map", result);
    }


    @RequestMapping(value = "login", method = RequestMethod.POST)
    @ResponseBody
    public ResultObject login(String userName, String password, String cid) {
        ResultObject object = loginService.loginCheck(userName, password, cid);
        return object;
    }

    @RequestMapping("getUserInfo")
    @ResponseBody
    public ResultObject getUserInfo() {
        SysUserInfoBean userInfoBean;
        try {
            String userName = ControllerHelper.getLoginUserName();
            userInfoBean = dao.fetch(SysUserInfoBean.class, userName);
            if (userInfoBean == null) {
                userInfoBean = new SysUserInfoBean();
                userInfoBean.setUserName(userName);
                dao.insert(userInfoBean);
            }
        } catch (Exception e) {
            return ResultObject.apiError("err129");
        }
        return ResultObject.ok(userInfoBean);
    }

    @RequestMapping(value = "register")
    @ResponseBody
    public ReturnObject register(String userName, String pwd, String email, String code) {
        ReturnObject result = new ReturnObject();
        //判断用户是否重复
        if (StringUtils.isBlank(userName)) {
            result.setSuccess(false);
            result.setMsg("err88");//用户名为空
            return result;
        }
        if (StringUtils.isBlank(pwd)) {
            result.setSuccess(false);
            result.setMsg("err89");//密码为空
            return result;
        }
        if (StringUtils.isBlank(email)) {//邮箱为空
            result.setSuccess(false);
            result.setMsg("err90");
            return result;
        }
        //验证 验证码
        //校验验证码
        Subject subject = SecurityUtils.getSubject();
        Object o = subject.getSession().getAttribute("validCode");
        if (o == null) {
            result.setSuccess(false);
            result.setMsg("err91");//验证码无效
            return result;
        }
        String[] arr = o.toString().split(":");
        long a = System.currentTimeMillis();
        long b = Long.parseLong(arr[1]);
        if (StringUtils.isBlank(code) || !code.equals(arr[0])) {
            result.setSuccess(false);
            result.setMsg("err92");//验证码不正确
            return result;
        } else if (a - b > 300000) {
            result.setSuccess(false);
            result.setMsg("err93");//验证码失效，请重新获取
            return result;
        }
        SysUserBean user = userService.getUserInfo(userName);
        if (user != null) {
            result.setSuccess(false);
            log.info("用户已注册");
            result.setMsg("err94");//用户已注册,请使用其他用户名
            return result;
        }
        user = new SysUserBean();
        user.setUserName(userName);
        user.setPassword(Encrypt.e(pwd));
        user.setChannel("118");
        user.setRegistInfo(email);
        user.setCreatTime(Utils.getCurrentTimestamp());

        if (StringUtils.isNotBlank(email) && email.indexOf("@") != -1) {
            user.setEmail(email);
        } else {
            user.setTel(email);
        }
        user.setLevel(1);//一级用户
        userService.insertUser(user);
        //分配一级用户的权限
        user = userService.getUserInfo(userName);
        UserRoleBean userRole = new UserRoleBean();
        userRole.setRoleId(4);
        userRole.setUserName(userName);
        userRole.setUserId(user.getId());
        //默认新注册用户为免费版用户
        userRole.setVersionId(1);
        //默认新注册用户某些功能的过期时间为一年
        Calendar calendar = new GregorianCalendar();
        Date date = new Date();
        calendar.setTime(date);
        calendar.add(calendar.YEAR, +1);//把日期往后增加一个月.整数往后推,负数往前移动
        userRole.setExpiryTime(new Timestamp(date.getTime()));

        roleManageService.addUserRole(userRole);
        result.setSuccess(true);
        return result;


    }

    @RequestMapping(value = "sendEmailCode")
    @ResponseBody
    public ReturnObject sendEmailCode(String param) {
        ReturnObject result = new ReturnObject();
        try {
            loginService.getEmailCode(param);
            result.setSuccess(true);
        } catch (MessagingException e) {
            e.printStackTrace();
            result.setMsg("err95");//验证码发送失败
            log.error(e.getMessage());
        } catch (Exception e) {
            result.setMsg(e.getMessage());
            log.error(e.getMessage());
        }
        return result;
    }

    @RequestMapping(value = "SendSms", method = RequestMethod.POST)
    @ResponseBody
    public ReturnObject SendSms(@RequestParam String param, @RequestHeader String token) {
        System.out.println(token);
        ReturnObject result = new ReturnObject();
        if ("eyJhbGciOiJIUzUxMiJ9".equals(token)) {
            try {
                long lastTime = RedisUtil.getInstance().getSaveLong(param, 0);
                if (System.currentTimeMillis() - lastTime < 60000) {
                    throw new RuntimeException("操作频繁");
                }
                RedisUtil.getInstance().saveLong(param, System.currentTimeMillis());
                loginService.SendSms(param);
                result.setSuccess(true);
            } catch (ServiceException e) {
                result.setMsg(e.getMessage());
                log.error(e.getMessage());
                RedisUtil.getInstance().delKey(param);
            } catch (Exception e) {
                result.setMsg("err96");//短信验证码发送失败
                log.error(e.getMessage());
            }
        }
        return result;
    }

}
