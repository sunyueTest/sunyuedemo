package com.jxctdzkj.cloudplatform.service.impl;

import com.jxctdzkj.cloudplatform.bean.*;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.exception.ServiceException;
import com.jxctdzkj.cloudplatform.service.UserService;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import com.jxctdzkj.cloudplatform.utils.ReturnObject;
import com.jxctdzkj.support.utils.TextUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.session.Session;
import org.nutz.dao.*;
import org.nutz.dao.pager.Pager;
import org.nutz.dao.sql.Sql;
import org.nutz.trans.Trans;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;


@Service
@Slf4j
public class UserServiceImpl implements UserService {

    @Autowired
    Dao dao;

    // 黄威修改 用户管理下不显示自己账户信息
    public List<SysUserBean> getCreateUserList(String userName, int page, int limit, String likeName) {
        Pager pager = dao.createPager(page, limit);
        Cnd cnd = Cnd.where("parentuser", "=", userName).and("is_del", "=", 0).and("user_name", "!=", userName);
        if (!TextUtils.isEmpty(likeName)) {
            cnd.and("user_name", "like", "%" + likeName + "%");
        }
        return dao.query(SysUserBean.class, cnd, pager);
    }

    /**
     * 查询该用户下所有他建的层级用户及子账户
     * @param userName
     * @param page
     * @param limit
     * @param likeName
     * @return
             * @User 李英豪
     */
    @Override
    public ReturnObject getUserListTwo(String userName, int page, int limit, String likeName) {
        Pager pager = dao.createPager(page, limit);
        String name=ControllerHelper.getLoginUserName();
        List<SysUserBean> list=dao.query(SysUserBean.class,Cnd.where("is_del","=",0).and("parent_account","like","%/"+name+"/%"),pager);
        int count=dao.count(SysUserBean.class,Cnd.where("is_del","=",0).and("parent_account","like","%/"+name+"/%"));
        ReturnObject result = new ReturnObject();
        result.setData(list);
        result.setCount(count);
        return result;
    }


    public List<SysUserBean> getUserList(int page, int limit, Condition cnd) {
        Pager pager = dao.createPager(page, limit);
        return dao.query(SysUserBean.class, cnd, pager);
    }

    @Override
    public SysUserBean getUserInfo(String userName) {
        return dao.fetch(SysUserBean.class, Cnd.where("user_name", "=", userName).and("is_del", "=", 0));
    }

    @Override
    public int getUserCount(Condition cnd) {
        Sql sql = Sqls.create(" SELECT count(1) from sys_user " + cnd);
        sql.setCallback(Sqls.callback.integer());
        dao.execute(sql);
        return sql.getInt();
    }

    @Override
    public long getCreateCount(String userName) {
        Sql sql = Sqls.create(" select count(1) from sys_user where parentuser =@userName ");
        sql.setCallback(Sqls.callback.integer());
        sql.params().set("userName", userName);
        dao.execute(sql);
        return sql.getInt();
    }

    @Override
    public SysUserBean getUserById(int id) {
        return dao.fetch(SysUserBean.class, id);
    }

    @Override
    public List<SysRoleBean> getRoleList(long userId) {
        Sql sql = Sqls.create(" select r.* from sys_role r left join sys_user_role u on r.id=u.role_id where u.user_id =@userId  ");
        sql.setCallback(Sqls.callback.entities());
        sql.setEntity(dao.getEntity(SysRoleBean.class));
        sql.params().set("userId", userId);
        dao.execute(sql);
        return sql.getList(SysRoleBean.class);
    }

    @Override
    public void insertUser(SysUserBean user) {
        try {
            //开启事务
            Trans.exec(() -> {
                SysUserInfoBean userInfoBean = new SysUserInfoBean();
//                Calendar c = Calendar.getInstance();
//                c.setTime(Utils.getCurrentTimestamp());
//                c.add(Calendar.DAY_OF_MONTH, Constant.ProjectBean.CUSTOMIZATION_TIME);
//                userInfoBean.setCustomizationFlag(new Timestamp(c.getTime().getTime()));
                userInfoBean.setUserName(user.getUserName());
                dao.insert(user);
                dao.insert(userInfoBean);
            });
        } catch (Exception e) {
            log.info(e.getMessage());
        }
    }

    @Override
    public void updateUser(SysUserBean user) {
        Sql sql = Sqls.create(" update sys_user set email=@email,tel=@tel,real_name=@realName where id =@id");
        sql.params().set("email", user.getEmail());
        sql.params().set("tel", user.getTel());
        sql.params().set("realName", user.getRealName());
        sql.params().set("id", user.getId());
        dao.execute(sql);
    }

    @Override
    public void updateMyInfo(SysUserBean user) throws Exception {
        try {
            if (StringUtils.isNotBlank(user.getPassword())) {
                Sql sql = Sqls.create(" update sys_user set email=@email,tel=@tel,real_name=@realName,password=@password where id =@id");
                sql.params().set("email", user.getEmail());
                sql.params().set("tel", user.getTel());
                sql.params().set("password", user.getTel());
                sql.params().set("realName", user.getRealName());
                sql.params().set("id", user.getId());
                dao.execute(sql);
            } else {
                updateUser(user);
            }
        } catch (Exception e) {
            throw new ServiceException("信息更新失败");
        }
    }

    @Override
    public int deleteUser(int id) {
        SysUserBean user = dao.fetch(SysUserBean.class, id);
        user.setIsDel(1);
        return dao.update(user);
    }

    @Override
    public void insertUserRole(long userId, int roleId) {
        Sql sql = Sqls.create(" insert into sys_user_role (user_id,role_id) values (@userId,@roleId)");
        sql.params().set("userId", userId);
        sql.params().set("roleId", roleId);
        dao.execute(sql);
    }

    @Override
    public void clearUserRole(long userId) {
        Sql sql = Sqls.create(" delete from sys_user_role where user_id = @userId ");
        sql.params().set("userId", userId);
        dao.execute(sql);
    }

    @Override
    public ReturnObject updataUserRole(int role, String userName) {
        ReturnObject result = new ReturnObject();
        SysUserBean userBean = dao.fetch(SysUserBean.class, Cnd.where("user_name", "=", userName).and("is_del", "=", 0));
        if (userBean == null) {
            result.setMsg("err55");
            return result;
        }
        SysRoleBean roleBean = dao.fetch(SysRoleBean.class, role);
        if (roleBean == null) {
            result.setMsg("err84");
            return result;
        }
        userBean.setLevel(roleBean.getLevel());
        UserRoleBean userRoleBean = dao.fetch(UserRoleBean.class, userName);
        if (userRoleBean == null) {
            userRoleBean = new UserRoleBean();
            userRoleBean.setUserName(userName);
            userRoleBean.setUserId(userBean.getId());
            userRoleBean.setRoleId(role);
            dao.insert(userRoleBean);
            dao.update(userBean);
            result.setSuccess(true);
            result.setMsg("success");
            return result;
        }
        userRoleBean.setRoleId(role);
        if (dao.update(userRoleBean) > 0 && dao.update(userBean) > 0) {
            result.setSuccess(true);
            result.setMsg("success");
            return result;
        }

        result.setMsg("fail");
        return result;
    }

    @Override
    public ResultObject updataUserRoleNew(UserRoleBean bean, String customizationFlag, String parentUserName) throws ParseException {
        ResultObject result;

        if (bean.getId() == 0) {
            result = ResultObject.error("err55");
            return result;
        }

        SysRoleBean roleBean = dao.fetch(SysRoleBean.class, bean.getRoleId());
        if (roleBean == null) {
            result = ResultObject.error("err84");
            return result;
        }

        SysUserBean userBean = dao.fetch(SysUserBean.class, bean.getUserId());
        if (userBean == null) {
            result = ResultObject.error("err55");
            return result;
        }

        SysUserInfoBean userInfoBean = dao.fetch(SysUserInfoBean.class, Cnd.where("user_name", "=", userBean.getUserName()));
        if (userInfoBean == null) {
            SysUserInfoBean newUserInfoBean = new SysUserInfoBean();
            newUserInfoBean.setHomePageType(String.valueOf(bean.getIndexType()));
            newUserInfoBean.setUserName(userBean.getUserName());
            newUserInfoBean.setSystemType(String.valueOf(bean.getTypeId()));
            dao.insert(newUserInfoBean);
            userInfoBean = newUserInfoBean;
//            result.setMsg("err127");
//            return result;
        }

        //根据version获取相关配置
        int usefulLife = 30;

        if (Constant.Project.VERSION_CHECK) {
            SysVersionConfigBean versionConfigBean = dao.fetch(SysVersionConfigBean.class, bean.getVersionId());
            if (versionConfigBean == null) {
                result = ResultObject.error("err116");
                return result;
            }
            usefulLife = versionConfigBean.getUsefulLife();
        } else {
            //在不进行版本校验的情况下，版本默认为1
            bean.setVersionId(1);
        }

        UserRoleBean userRoleBean = dao.fetch(UserRoleBean.class, bean.getId());
        if (userRoleBean == null) {
            userRoleBean = new UserRoleBean();
            userRoleBean.setUserName(bean.getUserName());
            userRoleBean.setUserId(bean.getUserId());
            userRoleBean.setRoleId(bean.getRoleId());
            userRoleBean.setVersionId(bean.getVersionId());
            userRoleBean.setTypeId(bean.getTypeId());

            //根据version设置过期时间,从修改时间开始重置为一个使用周期
            if (Constant.Project.VERSION_CHECK) {
                resetExpireTime(usefulLife, userRoleBean);
            } else {
                //否则默认30天
                resetExpireTime(30, userRoleBean);
            }
            dao.insert(userRoleBean);

            //修改user表属性
            userBean.setRole(bean.getRoleId());
            userBean.setLevel(roleBean.getLevel());
            userBean.setParentUser(parentUserName);
            dao.update(userBean);

            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            Date date = sdf.parse(customizationFlag);
            userInfoBean.setCustomizationFlag(new Timestamp(date.getTime()));
            //修改user_info表属性
            userInfoBean.setHomePageType(String.valueOf(bean.getIndexType()));
            userInfoBean.setSystemType(String.valueOf(bean.getTypeId()));
            dao.update(userInfoBean);

            result = ResultObject.ok();
//            result.setMsg("success");
            return result;
        }

        userRoleBean.setRoleId(bean.getRoleId());
        userRoleBean.setVersionId(bean.getVersionId());
        userRoleBean.setIndexType(bean.getIndexType());
        userRoleBean.setTypeId(bean.getTypeId());
        //如果设置了截止时间，则直接进行设置,否则根据版本类型进行设置
        if (bean.getExpiryTime() != null) {
            userRoleBean.setExpiryTime(bean.getExpiryTime());
        } else {
            resetExpireTime(usefulLife, userRoleBean);
        }


        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date date = sdf.parse(customizationFlag);
        userInfoBean.setCustomizationFlag(new Timestamp(date.getTime()));
        userInfoBean.setHomePageType(String.valueOf(bean.getIndexType()));
        userInfoBean.setSystemType(String.valueOf(bean.getTypeId()));

        userBean.setRole(bean.getRoleId());
        userBean.setLevel(roleBean.getLevel());
        userBean.setParentUser(parentUserName);

        if (dao.update(userRoleBean) > 0 && dao.update(userBean) > 0 && dao.update(userInfoBean) > 0) {
            result = ResultObject.ok();
//            result.setMsg("success");
            return result;
        }

        result = ResultObject.error("fail");
        return result;
    }

    @Override
    public SysRoleBean getLoginUserRole() {
        Session session = SecurityUtils.getSubject().getSession();
        String userName = session.getAttribute("user") + "";
        SysRoleBean roleBean = null;
        UserRoleBean userRoleBean = dao.fetch(UserRoleBean.class, Cnd.where("user_name", "=", userName));
        if (userRoleBean != null) {
            roleBean = dao.fetch(SysRoleBean.class, userRoleBean.getRoleId());
        }
        return roleBean;
    }

    private void resetExpireTime(int usefulLife, UserRoleBean userRole) {
        //根据version设置过期时间,从修改时间开始重置为一个使用周期
        Calendar c = Calendar.getInstance();
        c.setTime(new Date());
        c.add(Calendar.DATE, +usefulLife);
        Date d = c.getTime();
        userRole.setExpiryTime(new Timestamp(d.getTime()));
    }

    /**
     * 根据用户userName获取sysUserRole表信息
     *
     * @User 李英豪
     */
    public UserRoleBean findUserRoleBean(String userName) throws RuntimeException {
        UserRoleBean userRoleBean = new UserRoleBean();
        userRoleBean = dao.fetch(UserRoleBean.class, Cnd.where("user_name", "=", userName));
        return userRoleBean;
    }

    /**
     * 农业政府平台企业停用，该企业客户一律不可登录
     * 农业政府平台企业停用，该企业客户可登录
     * 停用企业负责人，逻辑层调用新接口停用企业用户
     * updateEnterpriseState
     *
     * @param entperpriseId 企业Id
     * @param state         启用0 停用1
     * @User 李英豪
     */
    @Override
    @Transactional
    public ResultObject updateUserInfoState(long entperpriseId, String state) throws RuntimeException {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        if (StringUtils.isBlank(userBean.getUserName())) {
            return ResultObject.error("用户未登录");
        }
        Sql sql = Sqls.create("update sys_user user set user.state=@state where user.user_name in(select info.user_name from sys_user_info info where info.entperprise_id=@entperpriseId)");
        sql.params().set("state", state).set("entperpriseId", entperpriseId);
        dao.execute(sql);
        /**
         * 调用新接口修改企业负责人创建的所有农户状态
         */
        List<SysUserInfoBean> list = dao.query(SysUserInfoBean.class, Cnd.where("entperprise_id", "=", entperpriseId));
        if (list != null && list.size() > 0) {
            updateUserInfoChildState(list, state);
        }
        return ResultObject.ok();
    }

    /**
     * 根据用户信息修改用户子级信息状态
     *
     * @param list 用户所有信息
     * @return
     * @User 李英豪
     */
    @Override
    @Transactional
    public void updateUserInfoChildState(List<SysUserInfoBean> list, String state) throws RuntimeException {
        if (list != null && list.size() > 0) {
            for (int i = 0; i < list.size(); i++) {
                Sql sql = Sqls.create("UPDATE sys_user SET state=@state WHERE parentuser=@parentUser");
                sql.params().set("state", state).set("parentUser", list.get(i).getUserName());
                dao.execute(sql);
            }
        }
    }
}
