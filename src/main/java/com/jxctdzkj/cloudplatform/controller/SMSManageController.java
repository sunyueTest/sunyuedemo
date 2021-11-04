package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.SendSMSBean;
import com.jxctdzkj.cloudplatform.bean.SystemTypeBean;
import com.jxctdzkj.cloudplatform.service.SystemTypeManageService;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.pager.Pager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.List;

@Slf4j
@RequestMapping({"smsInfo"})
@Controller
public class SMSManageController {

    @Autowired
    Dao dao;

    @RequestMapping({""})
    public String index() {
        return "smsInfo/smsList";
    }


    @RequestMapping({"getSmsList"})
    @ResponseBody
    public Object getSmsList(int page, int size, String tel) {
        Cnd cnd = Cnd.where("1", "=", 1);
        if (StringUtils.isNotBlank(tel)) {
            cnd = cnd.and("tel", "like", "%" + tel + "%");
        }
        List<SendSMSBean> list = dao.query(SendSMSBean.class, cnd, new Pager(page, size));
        int count = dao.count(SendSMSBean.class, cnd);
        return ResultObject.okList(list, page, size, count);
    }

}
