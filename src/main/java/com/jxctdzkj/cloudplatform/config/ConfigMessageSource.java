package com.jxctdzkj.cloudplatform.config;

import com.jxctdzkj.cloudplatform.bean.LanguageBean;
import com.jxctdzkj.cloudplatform.service.LanguageService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.MessageSourceResolvable;
import org.springframework.context.NoSuchMessageException;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component("messageSource")
public class ConfigMessageSource implements MessageSource {

    @Autowired
    private LanguageService languageService;

    @Override
    public String getMessage(String code, Object[] args, String defaultMessage, Locale locale) {
        return getI18nMsg(code, locale, args);
    }

    @Override
    public String getMessage(String code, Object[] args, Locale locale) throws NoSuchMessageException {
        return getI18nMsg(code, locale, args);
    }

    @Override
    public String getMessage(MessageSourceResolvable resolvable, Locale locale) throws NoSuchMessageException {
        return getI18nMsg(resolvable.getCodes()[0], locale, resolvable.getArguments());
    }

    private String getI18nMsg(String code, Locale locale, Object... ags) {
        //基础语言为空，则返回空数据。
        if(StringUtils.isEmpty(code)) {
            return null;
        }

        //数据库中查询不到数据，则返回空数据。
        LanguageBean language = languageService.findByCode(code);
        if(language == null) {
            return null;
        }

        if(Locale.SIMPLIFIED_CHINESE.equals(locale) && !StringUtils.isEmpty(language.getChinese())) {
            return language.getChinese(); //返回中文的结果。
        }else if(Locale.ENGLISH.equals(locale) && !StringUtils.isEmpty(language.getEnglish())) {
            return language.getEnglish(); //返回英文的结果。
        }
        return null;
    }
}
