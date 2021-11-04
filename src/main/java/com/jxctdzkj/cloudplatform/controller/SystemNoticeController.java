package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.SysNoticeBean;
import com.jxctdzkj.cloudplatform.utils.ReturnObject;
import lombok.extern.slf4j.Slf4j;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.dao.pager.Pager;
import org.nutz.dao.sql.Sql;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@Slf4j
@Controller
@RequestMapping({"systemNotice"})
public class SystemNoticeController {

    @Autowired
    Dao dao;

    @RequestMapping({""})
    public String index() {
        return "noticeConfigList";
    }

    @RequestMapping(value = "/getNoticeList")
    @ResponseBody
    public ReturnObject getNoticeList(int page, int limit,String title){
        ReturnObject result = new ReturnObject();
        Pager pager = dao.createPager(page, limit);
        List<SysNoticeBean> list =dao.query(SysNoticeBean.class,null,pager);
        Sql sql = Sqls.create(" SELECT count(1)  from sys_notice  ");
        sql.setCallback(Sqls.callback.integer());
        dao.execute(sql);
        int count = sql.getInt();
        result.setData(list);
        result.setCount(count);
        result.setCode(0);
        return result;
    }

    @RequestMapping({"/getDetail"})
    public ModelAndView getDetail(Integer id) {
        //TemplateBean temp =sensorTemplateSerivce
        SysNoticeBean bean = new SysNoticeBean();
        if (id != null) {
            bean = dao.fetch(SysNoticeBean.class,id);
            return new ModelAndView("noticeConfigDetail", "data", bean);
        }

        return new ModelAndView("noticeConfigDetail", "data", bean);
    }


    @RequestMapping({"/saveNotice"})
    @ResponseBody
    public ReturnObject saveNotice(String title, String url, Integer isDeleted,Integer id) {

        ReturnObject result = new ReturnObject();
        SysNoticeBean bean = new SysNoticeBean();
        bean.setTitle(title);
        bean.setUrl(url);
        bean.setIsDeleted(isDeleted);
        //新建还是编辑
        if (id!=null && id>0) {
            bean.setId(id);
            dao.update(bean);
        } else  {
            dao.insert(bean);
        }
        result.setSuccess(true);
        return result;
    }

}
