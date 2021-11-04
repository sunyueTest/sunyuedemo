package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.DictItemBean;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import lombok.extern.slf4j.Slf4j;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Slf4j
@RequestMapping({"dictItem"})
@Controller
public class DictItemController {

    @Autowired
    Dao dao;

    @RequestMapping("getItem")
    @ResponseBody
    public ResultObject getItem(String key) {

        DictItemBean item=dao.fetch(DictItemBean.class, Cnd.where("dict_key","=",key));
        return ResultObject.ok().data(item);
    }

    @RequestMapping("getItemList")
    @ResponseBody
    public ResultObject getItems(String key) {
        List<DictItemBean> itemList=dao.query(DictItemBean.class, Cnd.where("dict_key","=",key));
        return ResultObject.ok().data(itemList);
    }

}
