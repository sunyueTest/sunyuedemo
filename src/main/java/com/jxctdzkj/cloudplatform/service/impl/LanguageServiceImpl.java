package com.jxctdzkj.cloudplatform.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jxctdzkj.cloudplatform.baidutTranslate.TransApi;
import com.jxctdzkj.cloudplatform.bean.LanguageBean;
import com.jxctdzkj.cloudplatform.config.ConfigMessageSource;
import com.jxctdzkj.cloudplatform.service.LanguageService;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.pager.Pager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.List;
import java.util.Locale;

@Slf4j
@Service
public class LanguageServiceImpl implements LanguageService {
    @Autowired
    Dao dao;

    @Autowired
    private ConfigMessageSource configMessageSource;

    //百度翻译开发账号
    private static final String APP_ID = "20191010000340355";
    //百度翻译开发账号密钥
    private static final String SECURITY_KEY = "LqmoljYSg1ajBlBTQAcD";

    /**
     * 查询国际化内容
     * unless = "#result==null" 如果redis没有缓存对应的信息才进行缓存。
     * @param code
     * @return
     */
    @Cacheable(value = "language", key = "#code", unless = "#result==null")
    @Override
    public LanguageBean findByCode(String code) {
        Cnd cnd = Cnd.where("code", "=", code);
        return dao.fetch(LanguageBean.class, cnd);
    }

    /**
     * 查询国际化列表
     * @param page
     * @param size
     * @param code
     * @return
     */
    @Override
    public ResultObject getLanguageList(int page, int size, String code) {
        Cnd cnd = Cnd.where("code", "like", "%"+code+"%");
        Pager pager = new Pager();
        pager.setPageNumber(page).setPageSize(size);
        List<LanguageBean> result = dao.query(LanguageBean.class, cnd, pager);
        int count = dao.query(LanguageBean.class, cnd).size();
        return ResultObject.ok().okList(result, pager.getPageNumber(), pager.getPageSize()).put("count", count);
    }

    /**
     * 删除数据
     * @param code
     * @return
     */
    @CacheEvict(value = "language",key = "#code")
    @Override
    public ResultObject delByCode(String code) {
        if(dao.delete(LanguageBean.class, code)>0){
            return ResultObject.ok();
        }else {
            Locale locale = LocaleContextHolder.getLocale();
            //返回删除失败对应的国际化文字
            return ResultObject.error(configMessageSource.getMessage("删除失败！", null, locale));
        }
    }

    /**
     * 根据code获取选中语言对应的展示文字
     * @param code
     * @return
     */
    @Override
    public String findLocalByCode(String code) {
        Locale locale = LocaleContextHolder.getLocale();
        return configMessageSource.getMessage(code, null, locale);
    }

    /**
     * 根据基础字段进行一键翻译
     * @param code
     * @return
     */
    @Override
    public ResultObject onekeyTranslateByCode(String code) {

        ResultObject resultObject = ResultObject.ok();

        TransApi api = new TransApi(APP_ID, SECURITY_KEY);
        if(!StringUtils.isEmpty(code)) {
            try {
                String result = api.getTransResult(code, "auto", "zh");
                JSONObject jsonObject = JSON.parseObject(result);
                JSONArray array =  jsonObject.getJSONArray("trans_result");
                int length=array.size();
                for(int i=0;i<length;i++){
                    com.alibaba.fastjson.JSONObject params=JSON.parseObject(array.getString(i));
                    String dst=params.getString("dst");
                    try {
                        //翻译后的中文内容
                        dst= URLDecoder.decode(dst,"utf-8");
                        resultObject.put("chinese", dst);
                    } catch (UnsupportedEncodingException e) {
                        e.printStackTrace();
                    }
                }
                Thread.sleep(1000); //1000 毫秒，也就是1秒.
            } catch(InterruptedException ex) {
                Thread.currentThread().interrupt();
            }

            try {
                String result = api.getTransResult(code, "auto", "en");
                JSONObject jsonObject = JSON.parseObject(result);
                JSONArray array =  jsonObject.getJSONArray("trans_result");
                int length=array.size();
                for(int i=0;i<length;i++){
                    com.alibaba.fastjson.JSONObject params=JSON.parseObject(array.getString(i));
                    String dst=params.getString("dst");
                    try {
                        //翻译后的英文内容
                        dst= URLDecoder.decode(dst,"utf-8");
                        resultObject.put("english", dst);
                    } catch (UnsupportedEncodingException e) {
                        e.printStackTrace();
                    }
                }
                Thread.sleep(10); //1000 毫秒，也就是1秒.
            } catch(InterruptedException ex) {
                Thread.currentThread().interrupt();
            }
        }
        return resultObject;
    }

    /**
     * 新增
     * @param language
     * @return
     */
    @Override
    public ResultObject addLanguage(LanguageBean language) {
        Locale locale = LocaleContextHolder.getLocale();

        if(StringUtils.isEmpty(language.getCode())) {
            //返回对应的错误信息提醒
            return ResultObject.error(configMessageSource.getMessage("基础字段不可为空！", null, locale));
        }else if(this.findByCode(language.getCode())!=null){
            //返回对应的错误信息提醒
            return ResultObject.error(configMessageSource.getMessage("基础字段是唯一值，不可以重复", null, locale));
        }
        dao.insert(language);
        return ResultObject.ok();
    }

    /**
     * 修改国际化内容
     * @param language
     * @return
     */
    @CacheEvict(value = "language",key = "#language.code")
    @Override
    public ResultObject updateLanguage(LanguageBean language) {
        Locale locale = LocaleContextHolder.getLocale();
        if(StringUtils.isEmpty(language.getCode())) {
            return ResultObject.error(configMessageSource.getMessage("修改的对象不存在！", null, locale));
        }
        LanguageBean oldLang = this.findByCode(language.getCode());
        if(oldLang==null){
            return ResultObject.error(configMessageSource.getMessage("修改的对象不存在！", null, locale));
        }

        language.setId(oldLang.getId());
        int delCount = dao.update(language);
        if(delCount < 1){
            return ResultObject.error(configMessageSource.getMessage("修改失败！", null, locale));
        }
        return ResultObject.ok();
    }
}
