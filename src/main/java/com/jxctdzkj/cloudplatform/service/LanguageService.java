package com.jxctdzkj.cloudplatform.service;

import com.jxctdzkj.cloudplatform.bean.LanguageBean;
import com.jxctdzkj.cloudplatform.utils.ResultObject;

public interface LanguageService {

    /**
     * 查询国际化内容
     * @param code
     * @return
     */
    LanguageBean findByCode(String code);

    /**
     * 查询国际化列表
     * @param page
     * @param size
     * @param code
     * @return
     */
    ResultObject getLanguageList(int page, int size, String code);

    /**
     * 删除数据
     * @param code
     * @return
     */
    ResultObject delByCode(String code);

    /**
     * 根据code获取选中语言对应的展示文字
     * @param code
     * @return
     */
    String findLocalByCode(String code);

    /**
     * 根据基础字段进行一键翻译
     * @param code
     * @return
     */
    ResultObject onekeyTranslateByCode(String code);

    /**
     * 新增
     * @param language
     * @return
     */
    ResultObject addLanguage(LanguageBean language);

    /**
     * 修改国际化内容
     * @param language
     * @return
     */
    ResultObject updateLanguage(LanguageBean language);
}
