package com.jxctdzkj.cloudplatform.service.impl;

import com.jxctdzkj.cloudplatform.bean.SysRightsBean;
import com.jxctdzkj.cloudplatform.bean.SysRoleBean;
import com.jxctdzkj.cloudplatform.bean.UserRoleBean;
import com.jxctdzkj.cloudplatform.service.RightsService;

import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.dao.sql.Sql;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

@Service
public class RightsServiceImpl implements RightsService {

    @Autowired
    Dao dao;

    @Override
    public List<SysRightsBean> getMenus(int roleId) {

//        SELECT  distinct c.id id,c.url,c.cate,c.sort,c.parent_id,c.name,c.icon,c.en_name FROM sys_role_rights a , sys_user_role b,sys_rights c,sys_user d where a.role_id =b.role_id and a.rights_id= c.id and b.user_id=d.id and d.user_name ='A00008' and c.level= 2 and c.is_del=0 order by sort ,id
/*
        SELECT distinct c.id id,c.url,c.cate,c.parent_id,c.name,c.icon,c.en_name,c.sort
        FROM sys_role_rights a ,sys_rights c where a.role_id =19 and a.rights_id= c.id and c.level= 1 and c.is_del=0 order by c.sort ,c.id

SELECT distinct c.id id,c.url,c.cate,c.sort,c.parent_id,c.name,c.icon,c.en_name
 FROM sys_role_rights a , sys_rights c
 where a.role_id =19 and a.rights_id= c.id and c.level= 2 and c.is_del=0 order by sort,id


       */
        //获取一级菜单
//        Sql sql = Sqls.create(" SELECT  distinct c.id id,c.url,c.cate,c.parent_id,c.name,c.icon,c.en_name,c.sort FROM sys_role_rights a , sys_user_role b,sys_rights c,sys_user d where a.role_id =b.role_id and a.rights_id= c.id and b.user_id=d.id and d.user_name =@userName and c.level= @level and c.is_del=0 order by c.sort ,c.id  ");
        Sql sql = Sqls.create(" SELECT distinct c.id id,c.url,c.cate,c.parent_id,c.name,c.icon,c.en_name,c.sort FROM sys_role_rights a ,sys_rights c where a.role_id =@roleId and a.rights_id= c.id and c.level=@level and c.is_del=0 order by c.sort ,c.id");
//        sql.setCallback(Sqls.callback.entities());
//        sql.setEntity(dao.getEntity(SysRightsBean.class));
        sql.params().set("roleId", roleId);
        sql.params().set("level", 1);
//        dao.execute(sql);
        List<SysRightsBean> firstMenus = getBeanForSql(sql);
        //sql.getList(SysRightsBean.class);

        //获取二级菜单
        sql.params().set("roleId", roleId);
        sql.params().set("level", 2);
//        dao.execute(sql);
        List<SysRightsBean> secMenus = getBeanForSql(sql);// sql.getList(SysRightsBean.class);
        for (SysRightsBean firstRights : firstMenus) {
            List<SysRightsBean> sonMenus = new ArrayList<>();
            for (SysRightsBean secRights : secMenus) {
                if (((Long) secRights.getParentId()).equals(firstRights.getId())) {
                    sonMenus.add(secRights);
                }
            }
            firstRights.setSonMenus(sonMenus);
        }
        return firstMenus;
    }

    public List<SysRightsBean> getBeanForSql(Sql sql) {
        sql.setCallback((conn, rs, sql1) -> {
            List<SysRightsBean> list = new LinkedList<>();
            while (rs.next()) {
                SysRightsBean sysRightsBean = new SysRightsBean();
                sysRightsBean.setId(rs.getLong("id"));
                sysRightsBean.setUrl(rs.getString("url"));
                sysRightsBean.setCate(rs.getString("cate"));
                sysRightsBean.setParentId(rs.getLong("parent_id"));
                sysRightsBean.setIcon(rs.getString("icon"));
                sysRightsBean.setEnName(rs.getString("en_name"));
                sysRightsBean.setName(rs.getString("name"));
                list.add(sysRightsBean);
            }
            return list;
        });
        dao.execute(sql);
        return sql.getList(SysRightsBean.class);
    }

    @Override
    public List<String> getRights(String userName) {
        Sql sql = Sqls.create(" SELECT distinct c.url FROM sys_role_rights a , sys_user_role b,sys_rights c,sys_user d where a.role_id =b.role_id and a.rights_id= c.id and b.user_id=d.id and d.user_name =@userName and c.url is not null and c.url !=''   ");
        sql.setCallback(Sqls.callback.strList());
        sql.setEntity(dao.getEntity(SysRightsBean.class));
        sql.params().set("userName", userName);
        dao.execute(sql);
        return (List) sql.getResult();
    }

    @Override
    public List<String> getRealm(String userName) {
        Sql sql = Sqls.create(" SELECT DISTINCT c.url,c.name FROM sys_role_rights a ,sys_rights c WHERE (a.role_id =@roleId OR a.role_id = @adminRole) AND a.rights_id= c.id AND c.is_del=0 and LENGTH(trim(c.url)) > 0");
        UserRoleBean userRole = dao.fetch(UserRoleBean.class, Cnd.where("user_name", "=", userName));
        if (userRole != null) {
            sql.params().set("roleId", userRole.getRoleId());
            SysRoleBean roleBean = dao.fetch(SysRoleBean.class, userRole.getRoleId());
            if (roleBean == null) {
                return new ArrayList<>();
            }
            if (roleBean.getAdminRole() > 0) {//双重身份
                sql.params().set("adminRole", roleBean.getAdminRole());
            } else {
                sql.params().set("adminRole", userRole.getRoleId());
            }
        }
        sql.setCallback(Sqls.callback.strList());
        dao.execute(sql);
        return (List) sql.getResult();
    }

    @Override
    public List<SysRightsBean> getRightsList() {
        Sql sql = Sqls.create("select * from sys_rights where is_del=0 order by sort,id asc");
        sql.setCallback(Sqls.callback.entities());
        sql.setEntity(dao.getEntity(SysRightsBean.class));
        dao.execute(sql);
        return sql.getList(SysRightsBean.class);
    }

    @Override
    public List<SysRightsBean> selectAllToRight(Integer level) {
        //如果ID为空，pId为空，level不为空。根据分级查询菜单
        return dao.query(SysRightsBean.class, Cnd.where("level", "=", level).and("is_del", "=", 0).orderBy("sort,id", "asc"));
    }

    @Override
    public void insertRightForSonList(SysRightsBean s) {
        dao.insert(s);
    }

    @Override
    public List<SysRightsBean> fatherIdGetSonList(Integer id) {
        return dao.query(SysRightsBean.class, Cnd.where("parentId", "=", id).and("is_del", "=", 0).orderBy("sort,id", "asc"));
    }

    @Override
    public SysRightsBean getRightToId(Integer id) {
        return dao.fetch(SysRightsBean.class, id);
    }

    @Override
    public List<SysRightsBean> selectLikeToName(String name) {
        return dao.query(SysRightsBean.class, Cnd.where("name", "like", "%" + name + "%").and("is_del", "=", 0));
    }
}
