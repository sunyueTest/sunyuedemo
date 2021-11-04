package com.jxctdzkj.cloudplatform.service.impl;

import com.jxctdzkj.cloudplatform.bean.SysRightsBean;
import com.jxctdzkj.cloudplatform.bean.SysRoleBean;
import com.jxctdzkj.cloudplatform.bean.UserRoleBean;
import com.jxctdzkj.cloudplatform.service.RoleManageService;
import com.jxctdzkj.cloudplatform.utils.ResultObject;

import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.dao.sql.Sql;
import org.nutz.trans.Trans;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
public class RoleManageServiceImpl implements RoleManageService {
    @Autowired
    Dao dao;

    @Override
    public List<SysRoleBean> getRoleList() {
        return dao.query(SysRoleBean.class, Cnd.where("enable", "=", "1"));
    }

    @Override
    public List<SysRightsBean> getRightsList() {
        return dao.query(SysRightsBean.class, Cnd.where("is_del", "=", 0));
    }

    @Override
    public int[] getRightsByRoleId(int roleId) {
        Sql sql = Sqls.create("select rights_id from sys_role_rights where role_id =@roleId");
        sql.setCallback(Sqls.callback.ints());
        sql.params().set("roleId", roleId);
        dao.execute(sql);
        return (int[]) sql.getResult();
    }

    @Override
    public void updateAuth(int roleId, String rights, String indexUrl, int childId) {
        String arr[] = rights.split(",");
        Trans.exec(() -> {
            //删除角色下所有权限
            Sql sql = Sqls.create("delete from sys_role_rights where role_id =@roleId ");
            sql.params().set("roleId", roleId);
            dao.execute(sql);

            //修改角色记录
            SysRoleBean roleBean = dao.fetch(SysRoleBean.class, roleId);
            roleBean.setIndexUrl(indexUrl);
            roleBean.setChildId(childId);
            dao.update(roleBean);

            //添加权限到角色下
            for (String rightsId : arr) {
                //避免前端取消该角色的所有菜单导致的""插入的问题
                if (StringUtils.isBlank(rightsId)) {
                    continue;
                }
                Sql sql2 = Sqls.create("insert into  sys_role_rights (role_id,rights_id) values (@roleId,@rightsId)  ");
                sql2.params().set("roleId", roleId);
                sql2.params().set("rightsId", rightsId);
                dao.execute(sql2);
            }
        });
    }

    @Override
    public SysRoleBean getRoleDetail(int id) {
        return dao.fetch(SysRoleBean.class, id);
    }

    @Override
    public ResultObject updateRole(SysRoleBean role) {
        return dao.update(role) > 0 ? ResultObject.ok("success") : ResultObject.apiError("fail");

    }

    @Override
    public ResultObject insertRole(SysRoleBean role) {
        role.setLevel(1);
        return dao.insert(role) != null ? ResultObject.ok("success") : ResultObject.apiError("fail");
    }

    @Override
    public void deleteRole(int id) {
        dao.delete(SysRoleBean.class, id);
    }

    @Override
    public void addUserRole(UserRoleBean userRoleBean) {
        try {
            dao.insert(userRoleBean);
        } catch (Exception e) {
            e.printStackTrace();
            log.error(toString(), e);
        }
    }

    @Override
    public UserRoleBean getUserRole(String userName) {
        return dao.fetch(UserRoleBean.class, Cnd.where("user_name", "=", userName));
    }

}
