package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.AboutUsBean;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.dao.pager.Pager;
import org.nutz.dao.sql.Sql;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.sql.Timestamp;
import java.util.List;

@Controller
@RequestMapping("aboutUs")
public class AboutUsController {

    @Autowired
    Dao dao;

    @RequestMapping("")
    public String testInfo() {
        return "aboutUsFile/aboutUsList";
    }

    @ResponseBody
    @RequestMapping("getInfoList")
    public Object getInfoList(int page, int limit, String msg) {
        Cnd cnd = Cnd.where("1", "=", 1);
        if (StringUtils.isNotBlank(msg)) {
            cnd = cnd.and("message", "like", "%" + msg + "%");
        }
        List<AboutUsBean> list = dao.query(AboutUsBean.class, cnd.desc("id"), new Pager(page, limit));
        int count = dao.count(AboutUsBean.class, cnd);
        return ResultObject.okList(list, page, limit, count);
    }

    @RequestMapping("getMsg")
    public ModelAndView getMsg(String id) {
        return new ModelAndView("aboutUsFile/leaveMsg", "data", id);
    }

    @RequestMapping("getInfoById")
    @ResponseBody
    public ResultObject getInfoById(String id) {
        AboutUsBean test = dao.fetch(AboutUsBean.class, Cnd.where("id", "=", id));
        return ResultObject.ok().data(test);
    }

    @RequestMapping("updateState")
    @ResponseBody
    public ResultObject updateState(String id) {
        Sql sql = Sqls.create("update about_us set state ='已读' where id=@id");
        sql.params().set("id", id);
        dao.execute(sql);
        return ResultObject.ok();
    }

    //展示页面
    @RequestMapping("aboutUsWeb")
    public String aboutUs() {
        return "aboutUsFile/aboutUsWeb";
    }

    @RequestMapping("addInfo")
    @ResponseBody
    public ResultObject addInfo(AboutUsBean aboutUsBean) {
        Timestamp d = new Timestamp(System.currentTimeMillis());
        aboutUsBean.setDeliveryTime(d);
        aboutUsBean = dao.insert(aboutUsBean);
        return ResultObject.ok(aboutUsBean);
    }

}
