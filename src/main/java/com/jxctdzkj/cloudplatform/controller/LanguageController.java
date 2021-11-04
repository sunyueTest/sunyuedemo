package com.jxctdzkj.cloudplatform.controller;

import com.alibaba.fastjson.JSONObject;
import com.jxctdzkj.cloudplatform.bean.LanguageBean;
import com.jxctdzkj.cloudplatform.service.LanguageService;
import com.jxctdzkj.cloudplatform.utils.ResultObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequestMapping(value = "language")
@Controller
public class LanguageController {

    @Autowired
    LanguageService languageService;

    @RequestMapping(value = "index")
    public String index() {
        return "language/index.html";
    }

    @RequestMapping(value = "add")
    public String add() {
        return "language/add.html";
    }

    @RequestMapping(value = "edit")
    public ModelAndView edit(@RequestParam(value = "code") String code) {
        ModelAndView mv = new ModelAndView();
        mv.addObject("lang", languageService.findByCode(code));
        mv.setViewName("language/edit.html");
        return mv;
    }

    /**
     * 用户选择的国际化语言存入Cookie
     * @param response
     * @param lang
     * @return
     */
    @RequestMapping(value = "setLanguage")
    public void setLanguage(HttpServletResponse response, HttpServletRequest httpServletRequest, @RequestParam(value = "lang") String lang) {
        Cookie cookie = new Cookie("lang", lang);
        response.addCookie(cookie);
    }

    /**
     * 查询列表
     * @param page
     * @param limit
     * @param code
     * @return
     */
    @RequestMapping(value = "getLanguageList")
    @ResponseBody
    public String getLanguageList(@RequestParam(value = "page") int page,
                                  @RequestParam(value = "limit") int limit,
                                  @RequestParam(value = "code") String code) {
        ResultObject result = languageService.getLanguageList(page, limit, code);
        return JSONObject.toJSON(result).toString();
    }

    /**
     * 删除数据
     * @param code
     * @return
     */
    @RequestMapping(value = "delByCode")
    @ResponseBody
    public String delByCode(@RequestParam(value = "code") String code) {
        ResultObject result = languageService.delByCode(code);
        return JSONObject.toJSON(result).toString();
    }

    /**
     * 根据code获取选中语言对应的展示文字
     * @param code
     * @return
     */
    @RequestMapping(value = "getlanguageVal")
    @ResponseBody
    public String getlanguageVal(@RequestParam(value = "code") String code) {
        return languageService.findLocalByCode(code);
    }

    /**
     * 根据基础字段进行一键翻译
     * @param code
     * @return
     */
    @RequestMapping(value = "onekeyByCode")
    @ResponseBody
    public String onekeyByCode(@RequestParam(value = "code") String code) {
        ResultObject result = languageService.onekeyTranslateByCode(code);
        return JSONObject.toJSON(result).toString();
    }

    /**
     * 新增
     * @param languageBean
     * @return
     */
    @RequestMapping(value = "addLanguage", method = RequestMethod.POST)
    @ResponseBody
    public String addLanguage(LanguageBean languageBean) {
        ResultObject result = languageService.addLanguage(languageBean);
        return JSONObject.toJSON(result).toString();
    }

    /**
     * 修改
     * @param languageBean
     * @return
     */
    @RequestMapping(value = "updateLanguage", method = RequestMethod.POST)
    @ResponseBody
    public String updateLanguage(LanguageBean languageBean) {
        ResultObject result = languageService.updateLanguage(languageBean);
        return JSONObject.toJSON(result).toString();
    }

}