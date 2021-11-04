package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.SysRightsBean;
import com.jxctdzkj.cloudplatform.bean.SysRoleBean;
import com.jxctdzkj.cloudplatform.bean.SystemTypeBean;
import com.jxctdzkj.cloudplatform.service.RoleManageService;
import com.jxctdzkj.cloudplatform.service.SystemTypeManageService;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import com.jxctdzkj.cloudplatform.utils.ReturnObject;
import lombok.extern.slf4j.Slf4j;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RequestMapping({"systemTypeManage"})
@Controller
public class SystemTypeManageController {

    @Autowired
    Dao dao;

    @Autowired
    SystemTypeManageService systemTypeManageService;

    @RequestMapping({""})
    public String index() {
        return "systemType/systemTypeList";
    }


    @RequestMapping({"getSystemTypeList"})
    @ResponseBody
    public Object getSystemTypeList(int page, int size, String name) {
        return systemTypeManageService.getSystemTypeList(page, size, name);
    }

    @RequestMapping("getSystemTypeDetail")
    public ModelAndView getSystemTypeDetail(Integer id) {
        //新建
        SystemTypeBean bean = new SystemTypeBean();
        HashMap data = new HashMap();
        if (id != null) {
            bean = dao.fetch(SystemTypeBean.class, Cnd.where("id", "=", id));
        }
        data.put("bean", bean);
        return new ModelAndView("systemType/addOrUpdate", "data", data);

    }

    @RequestMapping("saveSystemType")
    @ResponseBody
    public Object saveSystemType(SystemTypeBean bean) {
        try {
            return systemTypeManageService.saveOrUpdate(bean);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResultObject.apiError("fail");
        }
    }


}
