package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.FarmInfoBean;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

/**
 * @Auther huangwei
 * @Date 2019/11/25
 **/
@Controller
@RequestMapping("town")
public class TownController {
    @Autowired
    Dao dao;


    // 新增-跳转
    @RequestMapping(value = "toAdd")
    public ModelAndView toAdd(@RequestParam(value = "type", required = false, defaultValue = "1") String type) {
        return new ModelAndView("farm/town/addOrUpdateHamlet", "bean", new FarmInfoBean()).addObject("type", type);
    }

    // 修改-跳转
    @RequestMapping(value = "toUpdate")
    public ModelAndView toUpdate(String id, @RequestParam(value = "type", required = false, defaultValue = "1") String type) {
       FarmInfoBean bean = dao.fetch(FarmInfoBean.class, Cnd.where("id", "=", id));
        return new ModelAndView("farm/town/addOrUpdateHamlet", "bean", bean).addObject("type", type);
    }



}
