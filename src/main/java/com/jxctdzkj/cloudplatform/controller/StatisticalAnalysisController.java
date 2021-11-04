package com.jxctdzkj.cloudplatform.controller;


import com.jxctdzkj.cloudplatform.bean.AquaculturePondBean;
import com.jxctdzkj.cloudplatform.bean.SysUserBean;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import com.jxctdzkj.cloudplatform.utils.ReturnObject;
import lombok.extern.slf4j.Slf4j;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@Slf4j
@RequestMapping({"statisticalAnalysis"})
public class StatisticalAnalysisController {

    @Autowired
    Dao dao;


    /**
     * 根据当前用户获取所有池塘的存活率
     * @return
     */
    @RequestMapping(value = "getAquaculturePondByUser")
    @ResponseBody
    public Object statisticsRateOfSurvival(){
        Map<String, Object> map = new HashMap<>();
        List<String> pondNameList = new ArrayList<>();
        SysUserBean sysUserBean = ControllerHelper.getInstance(dao).getLoginUser();
        List<AquaculturePondBean> list = dao.query(AquaculturePondBean.class,
                Cnd.where("createUser","=", sysUserBean.getUserName())
                        .and("deleteFlag", "=", "0"));


        list.forEach(bean ->{
            pondNameList.add(bean.getPondName());
        } );
        map.put("pondNameList", pondNameList);
        map.put("data", list);
        return ResultObject.ok(map);
    }
}
