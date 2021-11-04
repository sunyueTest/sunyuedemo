package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.service.LoginService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import lombok.extern.slf4j.Slf4j;

/**
 * Created by cdyoue on 2016/10/21.
 * 登陆控制器
 */
@Controller
@Slf4j
public class LoginController {

    @Autowired
    LoginService loginService;


    @ResponseBody
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public Object login(
            @RequestParam(value = "userName") String userName,
            @RequestParam(value = "password") String password,
            String cid) {
        log.info("=========userName=" + userName + "   password =" + password + "    cid =" + cid);
        return loginService.loginCheck(userName, password, cid);
    }

    @ResponseBody
    @RequestMapping(value = "/testLogin", method = RequestMethod.GET)
    public Object testLogin(
            @RequestParam(value = "userName") String userName,
            @RequestParam(value = "password") String password,
            String cid) {
        return loginService.loginCheck(userName, password, cid);
    }


}
