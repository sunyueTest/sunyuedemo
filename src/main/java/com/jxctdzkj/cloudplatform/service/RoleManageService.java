package com.jxctdzkj.cloudplatform.service;

import com.jxctdzkj.cloudplatform.bean.SysRightsBean;
import com.jxctdzkj.cloudplatform.bean.SysRoleBean;
import com.jxctdzkj.cloudplatform.bean.UserRoleBean;
import com.jxctdzkj.cloudplatform.utils.ResultObject;

import java.util.List;

public interface RoleManageService {

    List<SysRoleBean> getRoleList();

    List<SysRightsBean> getRightsList();

    int[] getRightsByRoleId(int roleId);

    void updateAuth(int roleId, String rights, String indexUrl, int childId);

    SysRoleBean getRoleDetail(int id);

    ResultObject updateRole(SysRoleBean role);

    ResultObject insertRole(SysRoleBean role);

    void deleteRole(int id);

    void addUserRole(UserRoleBean userRoleBean);

    UserRoleBean getUserRole(String userName);

}
