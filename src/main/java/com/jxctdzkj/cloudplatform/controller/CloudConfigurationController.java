package com.jxctdzkj.cloudplatform.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @Description
 * @Author chanmufeng
 * @Date 2019/7/29 10:19
 **/
@Controller
@RequestMapping("cloudConfiguration")
@Slf4j
public class CloudConfigurationController {
    @RequestMapping("")
    public String index() {
        return "cloudConfiguration/index";
    }

    @RequestMapping("goYunZutaiPage")
    public String go() {
        return "cloudConfiguration/goYunZutaiPage";
    }
}
