package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.*;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.opLog.EnableOpLog;
import com.jxctdzkj.cloudplatform.service.RoleManageService;
import com.jxctdzkj.cloudplatform.service.UserService;
import com.jxctdzkj.cloudplatform.service.impl.VersionServiceImpl;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import com.jxctdzkj.cloudplatform.utils.ReturnObject;
import com.jxctdzkj.cloudplatform.utils.Utils;
import com.jxctdzkj.support.utils.Encrypt;
import com.jxctdzkj.support.utils.TextUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.sql.Timestamp;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

@Slf4j
@Controller
@RequestMapping({"userManage"})
public class UserManageController {

    @Autowired
    Dao dao;

    @Autowired
    UserService userService;

    @Autowired
    RoleManageService roleManageService;

    @Autowired
    VersionServiceImpl versionService;

    @RequestMapping({""})
    public String index() {
        return "userList";
    }

    /**
     * 跳转页面查询用户信息（因没有根据当前用户查询所有他下级用户信息接口，特意编写此页面及接口）
     *
     * @return
     * @User 李英豪
     */
    @RequestMapping({"userListTwo"})
    public String userList() {
        return "userListTwo";
    }

    @RequestMapping({"/getUserList"})
    @ResponseBody
    public ReturnObject getUserList(int page, int limit, String likeName) {
        ReturnObject result = new ReturnObject();
        //获取用户信息，如果是管理员，查询network表，否则查询sys_user_to_device表
        Subject subject = SecurityUtils.getSubject();
        Object o = subject.getSession().getAttribute("user");
        SysUserBean user = userService.getUserInfo(o.toString());
        if (user.getLevel() < 1) {//管理员      // 黄威修改 用户管理下不显示自己账户信息
            Cnd cnd = Cnd.where("is_del", "=", 0).and("level", ">=", user.getLevel()).and("user_name", "!=", user.getUserName());
            if (!TextUtils.isEmpty(likeName)) {
                cnd = (Cnd) cnd.and("user_name", "like", "%" + likeName + "%").asc("user_name");
            }
            List<SysUserBean> list = userService.getUserList(page, limit, cnd);
            result.setCount(userService.getUserCount(cnd));
            result.setData(list);
        } else {
            List<SysUserBean> list = userService.getCreateUserList(user.getUserName(), page, limit, likeName);
            result.setCount(userService.getCreateCount(user.getUserName()));
            result.setData(list);
        }

        result.setCode(0);
        return result;
    }

    /**
     * 查询该用户下所有他建的层级用户及子账户
     * @User 李英豪
     */
    @RequestMapping({"/getUserListTwo"})
    @ResponseBody
    public ReturnObject getUserListTwo(int page, int limit, String likeName) {
        ReturnObject result = new ReturnObject();
        //获取用户信息，如果是管理员，查询network表，否则查询sys_user_to_device表
        Subject subject = SecurityUtils.getSubject();
        Object o = subject.getSession().getAttribute("user");
        SysUserBean user = userService.getUserInfo(o.toString());
        if (user.getLevel() < 1) {//管理员      // 黄威修改 用户管理下不显示自己账户信息
            Cnd cnd = Cnd.where("is_del", "=", 0).and("level", ">=", user.getLevel()).and("user_name", "!=", user.getUserName());
            if (!TextUtils.isEmpty(likeName)) {
                cnd = (Cnd) cnd.and("user_name", "like", "%" + likeName + "%").asc("user_name");
            }
            List<SysUserBean> list = userService.getUserList(page, limit, cnd);
            result.setCount(userService.getUserCount(cnd));
            result.setData(list);
        } else {
            result=userService.getUserListTwo(user.getUserName(), page, limit, likeName);
        }

        result.setCode(0);
        return result;
    }

    @RequestMapping({"/getUserListForApp"})
    @ResponseBody
    public ResultObject getUserListForApp(int page, int limit) {
        ReturnObject res = getUserList(page, limit, null);
        if (res.getCode() == 0) {
            return ResultObject.okList((List<SysUserBean>) res.getData(), page, limit);
        } else {
            return ResultObject.apiError("err129");
        }
    }

    @RequestMapping({"/getUserDetail"})
    @ResponseBody
    public ModelAndView getUserDetail(Integer id) {
        if (id != null) {
            SysUserBean user = userService.getUserById(id);
            return new ModelAndView("userDetail", "user", user);
        } else {
            return new ModelAndView("userDetail", "user", new SysUserBean());
        }
    }

    @RequestMapping({"/getRoleList"})
    @ResponseBody
    public ReturnObject getRoleList() {
        ReturnObject result = new ReturnObject();
        Subject subject = SecurityUtils.getSubject();
        Object o = subject.getSession().getAttribute("user");
        SysUserBean user = userService.getUserInfo(o.toString());
        List<SysRoleBean> roles = userService.getRoleList(user.getId());
        result.setData(roles);
        result.setCount(roles.size());
        result.setCode(0);
        return result;
    }

    @EnableOpLog(Constant.ModifyType.SAVE)
    @RequestMapping({"/saveUser"})
    @ResponseBody
    public ReturnObject saveUser(SysUserBean user) {
        ReturnObject result = new ReturnObject();
        if (user.getId() > 0) {//修改
            userService.updateUser(user);
        } else {//添加用户
            String userName = SecurityUtils.getSubject().getSession().getAttribute("user") + "";

            SysUserBean loginUser = userService.getUserInfo(userName);
            // 判断用户是否存在
            SysUserBean bean = userService.getUserInfo(user.getUserName());
            if (null != bean) {
                result.setSuccess(false);
                result.setMsg("err190");//用户名已存在
                return result;
            }
            if (null != loginUser.getParentAccount()) {
                user.setParentAccount(loginUser.getParentAccount() + userName + "/");
            }else{
                user.setParentAccount("/" + userName + "/");
            }

            UserRoleBean userRole = new UserRoleBean();
            //当前用户级别
            SysRoleBean roleBean = userService.getLoginUserRole();
//            if (loginUser.getLevel() < Constant.Define.ROLE_1) {//管理员创建一级用户
//                user.setLevel(1);
//                userRole.setRoleId(4);//一级用户权限
//            } else
            if (loginUser.getLevel() == Constant.Define.ROLE_2) {
                //这里做智慧农业多级用户适配，如果当前用户为智慧农业的二级用户，不受"二级用户不能增加子用户"的约束
                if (loginUser.getRole() == 17) {
                    user.setLevel(2);
                    userRole.setRoleId(17);
                } else {
                    result.setSuccess(false);
                    result.setMsg("二级用户不能增加子用户");
                    return result;
                }
            } else {
                //判断当前用户创建的下级用户数量是否超限
                ReturnObject ro = versionService.checkVersion(userName, "user");
                if (!ro.isSuccess()) return ro;

                //根据当前用户的角色创建相应下级角色用户
                System.out.println(roleBean);
                log.info("--------" + roleBean.getChildId());
                if (roleBean != null && roleBean.getChildId() != null) {
                    SysRoleBean sysRoleUser = dao.fetch(SysRoleBean.class, Cnd.where("id", "=", roleBean.getChildId()));
                    if (sysRoleUser != null) {
                        user.setLevel(sysRoleUser.getLevel());
                        userRole.setRoleId(roleBean.getChildId());//当前用户下级角色
                        user.setRole(roleBean.getChildId());
                    } else {
                        //默认创建二级用户
                        user.setLevel(2);
                        userRole.setRoleId(5);
                    }

                } else {
                    //默认创建二级用户
                    user.setLevel(2);
                    userRole.setRoleId(5);
                }
            }
            user.setPassword(Encrypt.e(user.getPassword()));
            //新增判断如果创建该用户的是管理员级别，此用户父级设为自己。&&李英豪//user.setParentUser(userName);
            if (roleBean.getLevel() < Constant.Define.ROLE_1) {
                user.setParentUser(user.getUserName());
            } else {
                user.setParentUser(userName);
            }
            user.setCreatTime(Utils.getCurrentTimestamp());
            //查重
            SysUserBean userBean = dao.fetch(SysUserBean.class, Cnd.where("user_name", "=", user.getUserName()).and("is_del", "=", "1"));
            if (userBean != null) {//重复创建
                user.setIsDel(0);
                user.setId(userBean.getId());
                dao.update(user);
            } else {
                userService.insertUser(user);
            }
            //分配权限
            user = userService.getUserInfo(user.getUserName());
            userRole.setUserName(user.getUserName());
            userRole.setUserId(user.getId());
            //默认新注册用户为免费版用户
            userRole.setVersionId(1);
            //默认新注册用户某些功能的过期时间为1年
            Calendar c = Calendar.getInstance();
            c.setTime(new Date());
            c.add(Calendar.YEAR, +1);
            Date d = c.getTime();
            userRole.setExpiryTime(new Timestamp(d.getTime()));
            roleManageService.addUserRole(userRole);
            result.setSuccess(true);
        }
        return result;
    }

    /**
     * 管理员/1级用户/二级用户创建新用户改版
     *
     * @param user
     * @User 李英豪
     */
    @EnableOpLog(Constant.ModifyType.SAVE)
    @RequestMapping({"/saveUserFromChildId"})
    @ResponseBody
    public ReturnObject saveUserFromChildId(SysUserBean user) {
        ReturnObject result = new ReturnObject();
        if (user.getId() > 0) {//修改
            userService.updateUser(user);
        } else {//添加用户
            String userName = SecurityUtils.getSubject().getSession().getAttribute("user") + "";

            SysUserBean loginUser = userService.getUserInfo(userName);
            // 判断用户是否存在
            SysUserBean bean = userService.getUserInfo(user.getUserName());
            if (null != bean) {
                result.setSuccess(false);
                result.setMsg("err190");//用户名已存在
                return result;
            }
            UserRoleBean userRole = new UserRoleBean();
            //根据当前用户的角色创建相应下级角色用户
            SysRoleBean roleBean = userService.getLoginUserRole();
            System.out.println(roleBean);

            if (loginUser.getLevel() < Constant.Define.ROLE_1) {//管理员创建一级用户
                user.setLevel(1);
                //查看是否当前账户角色拥有特殊子级角色
                if (roleBean.getChildId() != null && !"".equals(roleBean.getChildId())) {
                    userRole.setRoleId(roleBean.getChildId());
                    user.setRole(roleBean.getChildId());
                } else {
                    userRole.setRoleId(4);//一级用户权限
                }

            } else if (loginUser.getLevel() == Constant.Define.ROLE_2) {
                //这里做智慧农业多级用户适配，如果当前用户为智慧农业的二级用户，不受"二级用户不能增加子用户"的约束
                if (loginUser.getRole() == 17) {
                    user.setLevel(2);
                    userRole.setRoleId(17);
                } else {
                    result.setSuccess(false);
                    result.setMsg("二级用户不能增加子用户");
                    return result;
                }
            } else {
                //判断当前用户创建的下级用户数量是否超限
                ReturnObject ro = versionService.checkVersion(userName, "user");
                if (!ro.isSuccess()) return ro;
                log.info("--------" + roleBean.getChildId());
                if (roleBean != null && roleBean.getChildId() != null) {
                    user.setLevel(2);
                    userRole.setRoleId(roleBean.getChildId());//当前用户下级角色
                    user.setRole(roleBean.getChildId());
                } else {
                    //默认创建二级用户
                    user.setLevel(2);
                    userRole.setRoleId(5);
                }
            }
            user.setPassword(Encrypt.e(user.getPassword()));
            user.setParentUser(userName);
            user.setCreatTime(Utils.getCurrentTimestamp());
            //查重
            SysUserBean userBean = dao.fetch(SysUserBean.class, Cnd.where("user_name", "=", user.getUserName()).and("is_del", "=", "1"));
            if (userBean != null) {//重复创建
                user.setIsDel(0);
                user.setId(userBean.getId());
                dao.update(user);
            } else {
                userService.insertUser(user);
            }
            //分配权限
            user = userService.getUserInfo(user.getUserName());
            userRole.setUserName(user.getUserName());
            userRole.setUserId(user.getId());
            //默认新注册用户为免费版用户
            userRole.setVersionId(1);
            //默认新注册用户某些功能的过期时间为1年
            Calendar c = Calendar.getInstance();
            c.setTime(new Date());
            c.add(Calendar.YEAR, +1);
            Date d = c.getTime();
            userRole.setExpiryTime(new Timestamp(d.getTime()));
            roleManageService.addUserRole(userRole);
            result.setSuccess(true);
        }
        return result;
    }

    @RequestMapping({"/saveUserForApp"})
    @ResponseBody
    @EnableOpLog(Constant.ModifyType.SAVE)
    public ResultObject saveUserForApp(SysUserBean user) {
        ReturnObject res = saveUser(user);
        if (res.isSuccess()) {
            return ResultObject.ok("ok16");
        } else {
            return ResultObject.apiError(res.getMsg());
        }
    }


    @ResponseBody
    @RequestMapping({"/deleteUserForApp"})
    @EnableOpLog(Constant.ModifyType.DELETE)
    public Object deleteUserForApp(int id) {
        ReturnObject res = (ReturnObject) deleteUser(id);
        if (res.isSuccess()) {
            return ResultObject.ok();
        } else {
            return ResultObject.apiError("error14");
        }
    }

    @EnableOpLog(Constant.ModifyType.DELETE)
    @ResponseBody
    @RequestMapping({"/deleteUser"})
    public Object deleteUser(int id) {
        log.info("id:" + id);
        ReturnObject result = new ReturnObject();
        //此处没有删除该用户创建的用户，也没有修改被创建的用户的父用户字段
        if (userService.deleteUser(id) > 0) {
            result.setSuccess(true);
        }
        userService.clearUserRole(id);
        return result;
    }

    @RequestMapping({"/assignRole"})
    public ModelAndView assignRole(String userName) {
        HashMap<String, Object> map = new HashMap<>();
        Cnd cnd = Cnd.where("user_name", "=", userName);
        //获取所有角色名称
        List<SysRoleBean> roles = dao.query(SysRoleBean.class, Cnd.where("enable", "=", "1"));
        //获取所有版本信息
        List<SysVersionConfigBean> versions = dao.query(SysVersionConfigBean.class, null);
        //获取所有大屏类型
        List<SystemTypeBean> monitors = dao.query(SystemTypeBean.class, null);

        UserRoleBean bean = dao.fetch(UserRoleBean.class, cnd);

        // 获取userInfo信息
        SysUserInfoBean userInfoBean = dao.fetch(SysUserInfoBean.class, cnd);
        if (userInfoBean != null) {
            // 配置默认中性管理到期时间
            if (userInfoBean.getCustomizationFlag() == null) {
                SysUserBean userBean = dao.fetch(SysUserBean.class, cnd);
                Calendar c = Calendar.getInstance();
                // 如果用户的创建时间不为空 到期时间为创建时间+180天
                if (userBean.getCreatTime() != null) {
                    c.setTime(userBean.getCreatTime());
                } else {
                    c.setTime(new Date());
                }
                c.add(Calendar.DAY_OF_MONTH, Constant.Project.CUSTOMIZATION_TIME);
                userInfoBean.setCustomizationFlag(new Timestamp(c.getTime().getTime()));
            }
        }

        map.put("userInfo", userInfoBean);
        map.put("roles", roles);
        map.put("versions", versions);
        map.put("userName", userName);
        map.put("monitors", monitors);
        map.put("curUserRole", bean);
        return new ModelAndView("assignRole", "data", map);
    }

    @RequestMapping({"/completeAssignRole"})
    @ResponseBody
    @EnableOpLog
    public ReturnObject completeAssignRole(String roles, long userId) {
        ReturnObject result = new ReturnObject();
        if (StringUtils.isNotBlank(roles) && userId > 0) {
            userService.clearUserRole(userId);
            String[] roleArr = roles.split(",");
            for (String role : roleArr) {
                int roleId = Integer.parseInt(role);
                userService.insertUserRole(userId, roleId);
            }
        }
        result.setSuccess(true);
        return result;
    }

    @EnableOpLog
    @RequestMapping({"/updataUserRole"})
    @ResponseBody
    public ReturnObject updataUserRole(int role, String userName) {
        return userService.updataUserRole(role, userName);
    }

    //新添加的接口，防止updateUserRole被使用，导致兼容性问题
    @EnableOpLog
    @RequestMapping({"/updataUserRoleNew"})
    @ResponseBody
    public ResultObject updataUserRoleNew(UserRoleBean bean, String customizationFlag, @RequestParam(value = "parentUserName", required = false, defaultValue = "") String parentUserName) {
        try {
            if (null != bean) {
                String userName = bean.getUserName();
                if (parentUserName != null && !"".equals(parentUserName)) {
                    SysUserBean userBean = dao.fetch(SysUserBean.class, Cnd.where("user_name", "=", parentUserName));
                    if (userBean == null) {
                        return ResultObject.apiError("err55");
                    }
                }
                SysUserBean userBean = dao.fetch(SysUserBean.class, Cnd.where("user_name", "=", userName));
                if (userBean != null) {
                    //获得没有修改之前的level等级
                    int oldLevel = userBean.getLevel();
                    //获得修改传来的level等级
                    Integer roleId = bean.getRoleId();
                    //通过角色id去查询修改后等级权限
                    SysRoleBean sysRoleBean = dao.fetch(SysRoleBean.class, Cnd.where("id", "=", roleId));
                    //获取父用户
                    String parentUser = userBean.getParentUser();
                    //查看父用户的level
                    SysUserBean parentUserBean = dao.fetch(SysUserBean.class, Cnd.where("parentuser", "=", parentUser));
                    if (sysRoleBean != null) {
                        //获取修改的后的level等级
                        int newLevel = sysRoleBean.getLevel();
                        //升级
                        if (oldLevel > newLevel) {
                            //说明是升级 如果是升级的话 判断是否跟老父用户的等级一样 相同的话 父用户改成自己
                            if (parentUserBean != null) {
                                int parentUserBeanLevel = parentUserBean.getLevel();
                                if (newLevel <= parentUserBeanLevel) {
                                    //如果用户升级后的级别比原本父用户的级别高
                                    // 父用户改成自己
                                    parentUserName = userName;
                                } else {
                                    parentUserName = parentUserBean.getUserName();

                                }

                            }

                        }
                        // 降级
                        else if (oldLevel < newLevel) {
                            if (parentUserName == null || "".equals(parentUserName)) {
                                parentUserName = parentUserBean.getUserName();
                            }
                        }
                        //平级转换
                        else {
                            parentUserName = parentUserBean.getUserName();
                        }

                    }

                }

            }
            return userService.updataUserRoleNew(bean, customizationFlag, parentUserName);
        } catch (Exception e) {
            return ResultObject.error();
        }
    }

    @RequestMapping({"/myInfo"})
    public ModelAndView myInfo() {
        Subject subject = SecurityUtils.getSubject();
        Object o = subject.getSession().getAttribute("user");
        SysUserBean user = userService.getUserInfo(o.toString());
        return new ModelAndView("user/myInfo", "user", user);
    }

    /**
     * 复制一份个人信息页面给农业平台用
     * daihaonan
     */
    @RequestMapping({"/myInfofarming"})
    public ModelAndView myInfofarming() {
        Subject subject = SecurityUtils.getSubject();
        Object o = subject.getSession().getAttribute("user");
        SysUserBean user = userService.getUserInfo(o.toString());
        return new ModelAndView("user/myInfofarming", "user", user);
    }

    @EnableOpLog
    @RequestMapping({"/updateMyInfo"})
    @ResponseBody
    public void updateMyInfo(SysUserBean user) {
        Subject subject = SecurityUtils.getSubject();
        Object o = subject.getSession().getAttribute("user");
        if (o != null && o.toString().equalsIgnoreCase(user.getUserName())) {
            if (StringUtils.isNotBlank(user.getPassword())) {
                user.setPassword(Encrypt.e(user.getPassword()));
            }
            try {
                userService.updateMyInfo(user);
            } catch (Exception e) {
                log.error(e.toString());
            }
        }
    }

    @EnableOpLog
    @RequestMapping({"/updateMyInfoForApp"})
    @ResponseBody
    public ResultObject updateMyInfoForApp(SysUserBean user) {
        Subject subject = SecurityUtils.getSubject();
        Object o = subject.getSession().getAttribute("user");
        if (o != null && o.toString().equals(user.getUserName())) {
            if (StringUtils.isNotBlank(user.getPassword())) {
                user.setPassword(Encrypt.e(user.getPassword()));
            }
            try {
                userService.updateMyInfo(user);
            } catch (Exception e) {
                log.error(e.toString());
                return ResultObject.apiError("信息更新失败");
            }
            SysUserBean bean = dao.fetch(SysUserBean.class, Cnd.where("id", "=", user.getId()));
            if (bean != null) {
                return ResultObject.ok(bean);
            }
        }
        return ResultObject.apiError("未找到该用户信息");
    }

    @RequestMapping({"/updateMyPhoneNumber"})
    @ResponseBody
    @EnableOpLog
    public ResultObject updateMyPhoneNumber(String phoneNumber) {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        if (userBean != null) {
            userBean.setTel(phoneNumber);
            return dao.update(userBean) > 0 ? ResultObject.ok() : ResultObject.apiError("err128");
        }
        return ResultObject.apiError("err55");
    }

    @RequestMapping({"/updateUserCompany"})
    @ResponseBody
    @EnableOpLog
    public ResultObject updateUserCompany(@RequestParam String userName, @RequestParam String company, @RequestParam long enterpriseId) {
        SysUserInfoBean sysUserInfoBean = dao.fetch(SysUserInfoBean.class, Cnd.where("user_name", "=", userName));
        if (sysUserInfoBean != null) {
            sysUserInfoBean.setCompany(company);
            sysUserInfoBean.setEntperpriseId(enterpriseId);
            return dao.update(sysUserInfoBean) > 0 ? ResultObject.ok() : ResultObject.apiError("err185");
        }
        return ResultObject.apiError("err55");
    }


}
