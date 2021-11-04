package com.jxctdzkj.cloudplatform.config;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.LocaleResolver;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Locale;

@Component("localeResolver")
public class ConfigLocaleResolver implements LocaleResolver {
    @Override
    public Locale resolveLocale(HttpServletRequest httpServletRequest) {
        //默认展示的语言为中文简体
        Locale locale = Locale.SIMPLIFIED_CHINESE;

        //读取Cookie中用户选择的国际化类型
        Cookie[] cookies = httpServletRequest.getCookies();
        if(cookies != null) {
            for(Cookie cookie:cookies){
                if(cookie.getName().equals("lang") && !StringUtils.isEmpty(cookie.getValue())) {
                    if(cookie.getValue().endsWith("en_US")) {
                        //默认显示语言为英文
                        locale = Locale.ENGLISH;
                        break;
                    }else if(cookie.getValue().endsWith("zh_CN")){
                        //默认显示语言为中文
                        locale = Locale.SIMPLIFIED_CHINESE;
                        break;
                    }
                }
            }
        }
        return locale;
    }

    @Override
    public void setLocale(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Locale locale) {

    }
}