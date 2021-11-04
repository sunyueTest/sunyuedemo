package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.SysVersionConfigBean;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.opLog.EnableOpLog;
import com.jxctdzkj.cloudplatform.service.VersionManageService;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import lombok.extern.slf4j.Slf4j;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@Slf4j
@RequestMapping({"versionManage"})
@Controller
public class VersionManageController {

    @Autowired
    Dao dao;

    @Autowired
    VersionManageService versionManageService;

    @RequestMapping({""})
    public String index() {
        return "versionList";
    }

//    @RequestMapping({"getVersionDetail"})
//    public ModelAndView getVersionDetail(int versionId) {
//        return new ModelAndView("versionList", "versionId", versionId);
//    }

    @RequestMapping({"getVersionList"})
    @ResponseBody
    public Object getVersionList() {
        List<SysVersionConfigBean> list = versionManageService.getVersionList();
        if (list == null) {
            return ResultObject.apiError("err109");
        }
        return ResultObject.okList(list);
    }


    @RequestMapping({"addOrUpdateVersionConfig"})
    @ResponseBody
    @EnableOpLog(Constant.ModifyType.SAVE)
    public Object addOrUpdateVersionConfig(SysVersionConfigBean version) {

        if (version.getId() > 0) {//修改
            SysVersionConfigBean bean = dao.fetch(SysVersionConfigBean.class, version.getId());
            if (bean == null) {
                return ResultObject.apiError("err110");
            }
            if (versionManageService.updateVersion(version) > 0) {
                return ResultObject.ok("ok4");//修改成功
            }
            return ResultObject.apiError("err112");//修改失败
        } else {//添加
            SysVersionConfigBean bean = dao.fetch(SysVersionConfigBean.class, Cnd.where("version_name", "=", version.getVersionName()));
            if (bean != null) {
                return ResultObject.apiError("err111");
            }
            return versionManageService.insertVersion(version);
        }
    }

    @RequestMapping({"deleteVersion"})
    @ResponseBody
    @EnableOpLog(Constant.ModifyType.DELETE)
    public Object deleteVersion(int id) {
        return versionManageService.deleteVersion(id);
    }

    @RequestMapping({"getVersionConfigDetail"})
    @ResponseBody
    public ModelAndView getVersionConfigDetail(Integer versionId) {
        System.out.println(versionId);
        if (versionId != null) {
            SysVersionConfigBean configBean = dao.fetch(SysVersionConfigBean.class, versionId);
            System.out.println(configBean);
            if (configBean != null) {
                return new ModelAndView("versionConfigDetail", "configBean", configBean);
            }
        }
        return new ModelAndView("versionConfigDetail", "configBean", new SysVersionConfigBean());
    }



}
