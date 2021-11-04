package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.OpLogBean;
import com.jxctdzkj.cloudplatform.utils.ResultObject;

import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.pager.Pager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequestMapping({"opLog"})
@Controller
public class OpLogManageController {

    @Autowired
    Dao dao;

    @RequestMapping({""})
    public String index() {
        return "opLog/logList";
    }


    @RequestMapping({"getOpLogList"})
    @ResponseBody
    public Object getOpLogList(int page, int size, String name, String startDate, String endDate, String method) {
        Cnd cnd = Cnd.where("1", "=", 1);
        if (StringUtils.isNotBlank(name)) {
            cnd = cnd.and("user_name", "like", "%" + name + "%");
        }
        if (StringUtils.isNotBlank(startDate) && StringUtils.isNotBlank(endDate)) {
            cnd = cnd.and("op_time", ">=", startDate).and("op_time", "<=", endDate);
        }
        if (StringUtils.isNotBlank(method)) {
            cnd = cnd.and("method", "=", method);
        }
        List<OpLogBean> list = dao.query(OpLogBean.class, cnd.desc("id"), new Pager(page, size));
        int count = dao.count(OpLogBean.class, cnd);
        return ResultObject.okList(list, page, size, count);
    }

}
