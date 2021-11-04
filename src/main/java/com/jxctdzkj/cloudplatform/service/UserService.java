package com.jxctdzkj.cloudplatform.service;

import com.jxctdzkj.cloudplatform.bean.SysRoleBean;
import com.jxctdzkj.cloudplatform.bean.SysUserBean;
import com.jxctdzkj.cloudplatform.bean.SysUserInfoBean;
import com.jxctdzkj.cloudplatform.bean.UserRoleBean;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import com.jxctdzkj.cloudplatform.utils.ReturnObject;
import org.nutz.dao.Condition;

import java.text.ParseException;
import java.util.List;

public interface UserService {

    List<SysUserBean> getUserList(int page, int limit, Condition cnd);

    List<SysUserBean> getCreateUserList(String userName, int page, int limit, String likeName);

    /**
     * 查询该用户下所有他建的层级用户及子账户
     * @param userName
     * @param page
     * @param limit
     * @param likeName
     * @return
     * @User 李英豪
     */
    ReturnObject getUserListTwo(String userName, int page, int limit, String likeName);

    SysUserBean getUserInfo(String userName);

    int getUserCount(Condition cnd);

    SysUserBean getUserById(int id);

    List<SysRoleBean> getRoleList(long userId);

    void insertUser(SysUserBean user);

    void updateUser(SysUserBean user);

    int deleteUser(int id);

    void insertUserRole(long userId, int roleId);

    void clearUserRole(long userId);

    void updateMyInfo(SysUserBean user) throws Exception;

    long getCreateCount(String userName);

    ReturnObject updataUserRole(int role, String userName);


    ResultObject updataUserRoleNew(UserRoleBean bean, String customizationFlag,String parentUserName) throws ParseException;

    SysRoleBean getLoginUserRole();

    /**
     * 根据用户userName获取sysUserRole表信息
     * @User 李英豪
     */
    UserRoleBean findUserRoleBean(String userName)throws RuntimeException;

    /**
     * 农业政府平台企业停用，该企业客户一律不可登录
     * 农业政府平台企业停用，该企业客户可登录
     * 停用企业负责人，逻辑层调用新接口停用企业用户
     * updateEnterpriseState
     *
     * @param entperpriseId 企业Id
     * @param state        启用0 停用1
     * @User 李英豪
     */
    ResultObject updateUserInfoState(long entperpriseId, String state)throws RuntimeException;

    /**
     * 根据用户信息修改用户子级信息状态
     * @param list 用户所有信息
     * @return
     * @User 李英豪
     */
    void updateUserInfoChildState(List<SysUserInfoBean>list, String state)throws RuntimeException;

}
