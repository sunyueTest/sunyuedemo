package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.SysRightsBean;
import com.jxctdzkj.cloudplatform.bean.SysRoleBean;
import com.jxctdzkj.cloudplatform.bean.SysUserLevel;
import com.jxctdzkj.cloudplatform.bean.UserRoleBean;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.opLog.EnableOpLog;
import com.jxctdzkj.cloudplatform.service.RoleManageService;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import com.jxctdzkj.cloudplatform.utils.ReturnObject;

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

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequestMapping({"roleManage"})
@Controller
public class RoleManageController {

    @Autowired
    Dao dao;

    @Autowired
    RoleManageService roleManageService;

    @RequestMapping({""})
    public String index() {
        return "roleList";
    }


    @RequestMapping({"getAuthDetail"})
    public ModelAndView getAuthDetail(int roleId) {
        HashMap<String, Object> map = new HashMap<>();
        //获取当前角色信息
        SysRoleBean roleBean = dao.fetch(SysRoleBean.class, roleId);
        //获取所有角色信息
        List<SysRoleBean> roles = dao.query(SysRoleBean.class, null);
        map.put("roleBean", roleBean);
        map.put("roles", roles);
        return new ModelAndView("authList", "map", map);
    }

    @RequestMapping({"getRoleList"})
    @ResponseBody
    public ReturnObject getRoleList() {
        ReturnObject result = new ReturnObject();
        List<SysRoleBean> list = roleManageService.getRoleList();
        result.setCount(list.size());
        result.setData(list);
        result.setCode(0);
        return result;
    }


    @RequestMapping({"getRoleDetail"})
    public ModelAndView getRoleDetail(Integer roleId) {
        HashMap<String, Object> data = new HashMap<>();
        //搜索所有用户等级信息
        List<SysUserLevel> sysUserLevels = dao.query(SysUserLevel.class, null);
        data.put("levels", sysUserLevels);
        data.put("role", new SysRoleBean());

        if (roleId != null) {
            SysRoleBean role = roleManageService.getRoleDetail(roleId);
            data.put("role", role);
        }
        return new ModelAndView("roleDetail", "data", data);
    }

    @EnableOpLog(Constant.ModifyType.SAVE)
    @RequestMapping({"saveRole"})
    @ResponseBody
    public ResultObject saveRole(SysRoleBean role) {

        if (role.getId() > 0) {//修改
            return roleManageService.updateRole(role);
        } else {//添加
            return roleManageService.insertRole(role);
        }
    }

    @EnableOpLog(Constant.ModifyType.DELETE)
    @RequestMapping({"deleteRole"})
    @ResponseBody
    public void deleteRole(int id) {
        roleManageService.deleteRole(id);
    }

    @RequestMapping({"getAuthList"})
    @ResponseBody
    public ReturnObject getAuthList(int roleId) {
        ReturnObject result = new ReturnObject();
        Map<String, Object> map = new HashMap<>();
        List<SysRightsBean> list = roleManageService.getRightsList();
        int[] checkedId = roleManageService.getRightsByRoleId(roleId);
        map.put("list", list);
        map.put("checkedId", checkedId);
        result.setData(map);
        result.setSuccess(true);
        result.setCode(0);
        return result;
    }

    @EnableOpLog
    @RequestMapping({"updateAuth"})
    @ResponseBody
    public Object updateAuth(int roleId, String rights, String indexUrl, int childId) {
        ReturnObject result = new ReturnObject();
        roleManageService.updateAuth(roleId, rights, indexUrl, childId);
        result.setSuccess(true);
        result.setCode(0);
        return result;
    }


}
