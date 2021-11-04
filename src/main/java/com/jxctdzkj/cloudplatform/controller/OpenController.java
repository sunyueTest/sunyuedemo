package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.SecretKeyBean;
import com.jxctdzkj.cloudplatform.service.LoginService;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import com.jxctdzkj.cloudplatform.utils.Utils;
import com.jxctdzkj.support.utils.Encrypt;
import com.jxctdzkj.support.utils.TextUtils;

import org.nutz.dao.Cnd;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.sql.Timestamp;

import javax.servlet.http.HttpServletRequest;

import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 *     @author  : FlySand
 *     @e-mail  : 1156183505@qq.com
 *     @time    : 2019/3/5.
 *     @desc    :
 * </pre>
 */
@Slf4j
@Controller
@RequestMapping("developers")
public class OpenController extends BaseController {


    @Autowired
    LoginService loginService;

    //http://sennor.net/developers/toIndex?secretKey=7A21AD53D6BEB7B1&userName=fjtt&password=fjtt123456&type=index
//    http://localhost/developers/toIndex?secretKey=7A21AD53D6BEB7B1&userName=fjtt&password=fjtt123456&type=index

    /**
     * 免登陆直接调转页面 需要秘钥
     *
     * @param userName
     * @param password
     * @param secretKey
     * @param type
     * @param request
     * @return
     */
    @RequestMapping("toIndex")
    public Object index(@RequestParam String userName,
                        @RequestParam String password,
                        @RequestParam String secretKey,
                        @RequestParam String type,
                        HttpServletRequest request) {

        SecretKeyBean secretKeyBean = dao.fetch(SecretKeyBean.class, Cnd.where("secret_key", "=", secretKey)
                .and("user_name", "=", userName)
                .and("del", "=", "0"));
        if (secretKeyBean != null) {
            if (!"none".equals(secretKeyBean.getSanctionType())) {
                if (secretKeyBean.getExpiryTime() != null) {
                    if (secretKeyBean.getExpiryTime().getTime() - System.currentTimeMillis() < 0) {
                        log.info("使用时间到期");
//                        return goLogin(userName);
                        return "redirect:../doLogin";
                    }
                }
                if (secretKeyBean.getExpiryCount() > 0 && secretKeyBean.getExpiryCount() - secretKeyBean.getInterfaceUseCount() < 0) {
                    log.info("使用次数超限");
//                    return goLogin(userName);
                    return "redirect:../doLogin";
                }
            }
            try {
                String[] keys = secretKeyBean.getKeyType().split(",");
                for (int i = 0; i < keys.length; i++) {
                    if (keys[i].equals(type)) {
                        secretKeyBean.setLastUseTime(new Timestamp(System.currentTimeMillis()));
                        secretKeyBean.setInterfaceUseCount();
                        dao.update(secretKeyBean, "^lastUseTime|interfaceUseCount$");

                        return loginRedirect(userName, password, type);
                    }
                }
            } catch (Exception e) {
                log.error(e.toString(), e);
            }

        }
        return "redirect:../doLogin";
    }

    /**
     * 需要校验，免秘钥
     *
     * @param landfall
     * @return http://localhost/developers/landfall*-*zhhfgl2*-*123456*-*29120*-*index
     * http://localhost/developers/landfall*-*yangling*-*mode*-*320*-*unrestricted-toDapengFullScreen
     */
    @RequestMapping("/{landfall:.+}")
    public Object landfall(@PathVariable String landfall) {
        String[] path = landfall.split("\\*\\-\\*");
        if (path.length > 4) {
            String userName = path[1];
            String password = path[2];
            String crc = path[3];
            String modeUrl = path[4].replace("-", "/");
            log.info("landfall：" + userName + "  " + password + "  " + crc + "  " + modeUrl);
            String checkCrc = String.valueOf(Utils.crc16(Encrypt.e(userName + password + modeUrl).getBytes()));
            if (checkCrc.equals(crc)) {
                return loginRedirect(userName, password, modeUrl);
            } else {
                log.info("校验错误：" + crc + " 正确为：" + checkCrc);
            }
        } else {
            log.info("请求长度错误");
        }
        return "redirect:doLogin";
    }

    public String loginRedirect(String userName, String password, String modeUrl) {
        if (TextUtils.isEmpty(ControllerHelper.getLoginUserName())) {
            ResultObject resultObject = loginService.loginCheck(userName, password, null);
            if (resultObject.get("msg").equals("ok15")) {
                return "redirect:../" + modeUrl;
            }
            log.info("密码错误");
            return "redirect:doLogin";
        } else {
            return "redirect:../" + modeUrl;
        }
    }

    public static void main(String[] args) {
        String landfall = "http://sennor.net/developers/landfall*-*zhhfgl*-*123456*-*9408*-*index";
        String[] path = landfall.split("\\*\\-\\*");
        if (path.length > 4) {
            String userName = path[1];
            String password = path[2];
            String crc = path[3];
            String modeUrl = path[4].replace("-", "/");
            log.info("landfall：" + userName + "  " + password + "  " + crc + "  " + modeUrl);
            String checkCrc = String.valueOf(Utils.crc16(Encrypt.e(userName + password + modeUrl).getBytes()));
            if (checkCrc.equals(crc)) {
                System.out.println(crc);
            } else {
                log.info("校验错误：" + crc + " 正确为：" + checkCrc);
            }

        }
    }
}
