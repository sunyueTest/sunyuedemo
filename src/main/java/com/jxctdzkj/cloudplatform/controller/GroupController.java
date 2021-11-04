package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.SysUserBean;
import com.jxctdzkj.cloudplatform.bean.UserDeviceBean;
import com.jxctdzkj.cloudplatform.bean.UserGroupBean;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.opLog.EnableOpLog;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import com.jxctdzkj.support.utils.TextUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.dao.pager.Pager;
import org.nutz.dao.sql.Sql;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

/**
 * <pre>
 *     @author  : FlySand
 *     @e-mail  : 1156183505@qq.com
 *     @time    : 2018/9/25.
 *     @desc    :
 * </pre>
 */
@Slf4j
@RequestMapping({"group"})
@RestController
public class GroupController {
    @Autowired
    Dao dao;

    /**
     * 添加分组
     */
    @EnableOpLog(Constant.ModifyType.SAVE)
    @RequestMapping(value = "addGroup", method = RequestMethod.POST)
    public Object addGroup(UserGroupBean groupBean) {
        SysUserBean sysUserBean = ControllerHelper.getInstance(dao).getLoginUser();
        if (sysUserBean == null) {
            return ResultObject.apiError("err55");//用户不存在
        }
        if (TextUtils.isEmpty(groupBean.getGroupName())) {
            return ResultObject.apiError("warn11");//名称不能为空
        }
        groupBean.setCreatTime(new Timestamp(System.currentTimeMillis()));
        groupBean.setUserName(sysUserBean.getUserName());
        if (groupBean.getpId() > 0) {
            groupBean.setpId(groupBean.getId());
        }
        UserGroupBean insertBean = dao.insert(groupBean);
        if (insertBean == null) {
            return ResultObject.apiError("error10");//添加失败
        }

        return ResultObject.ok("ok2").data(insertBean);//添加成功
    }

    /**
     * 修改分组
     */
    @EnableOpLog
    @RequestMapping(value = "updateGroup", method = RequestMethod.POST)
    public Object selGroupList(UserGroupBean groupBean) {
        UserGroupBean fetchBean = dao.fetch(UserGroupBean.class, groupBean.getId());
        fetchBean.setpId(fetchBean.getpId());
        if (!TextUtils.isEmpty(groupBean.getGroupName())) {
            fetchBean.setGroupName(groupBean.getGroupName());
        }
        if (dao.update(fetchBean) > 0) {
            return ResultObject.ok("ok4").data(fetchBean);//修改成功
        }
        return ResultObject.apiError("error17");//修改失败
    }

    /**
     * 查询用户下的所有分组
     */
    @RequestMapping(value = "selGroupList", method = RequestMethod.GET)
    public Object selGroupList(@RequestParam(value = "userName",required = false,defaultValue = "") String userName) {
        // 黄威 扩展
        if(StringUtils.isNotBlank(userName)) {
            List<UserGroupBean> groupBeans = dao.query(UserGroupBean.class, Cnd.where("user_name", "=", userName).and("is_del", "=", "0"));
            return ResultObject.okList(groupBeans);
        }
        List<UserGroupBean> groupBeans = dao.query(UserGroupBean.class, Cnd.where("user_name", "=", ControllerHelper.getInstance(dao).getLoginUserName()).and("is_del", "=", "0"));
        return ResultObject.okList(groupBeans);
    }

    /**
     * 查询分组下的设备
     */
    @RequestMapping(value = "selDeviceForGroup", method = RequestMethod.GET)
    public Object selDeviceForGroup(
            @RequestParam(value = "id") long id,
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "1000") int size) {
        Pager pager = dao.createPager(page, size);
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        String userName = userBean.getUserName();
        List<UserDeviceBean> deviceBeans = new ArrayList<>();
        if (userBean.getLevel() <= Constant.Define.ROLE_0) {//系统管理员显示所有设备
            Sql sql = Sqls.create(" select ud.*, n.Nname from sys_user_to_devcie ud ,network n where ud.user_name =@userName and ud.Ncode=n.Ncode and ud.group_id=@groupId and ud.is_del = 0 ");
            sql.params().set("userName", userName);
            sql.params().set("groupId", id);
            sql.setCallback((conn, rs, sql1) -> {
                List<UserDeviceBean> list = new LinkedList<UserDeviceBean>();
                while (rs.next()) {
                    UserDeviceBean bean = new UserDeviceBean();
                    bean.setDeviceNumber(rs.getString("Ncode"));
                    bean.setId(rs.getLong("id"));
                    bean.setUserName(rs.getString("user_name"));
                    bean.setDevicePassword(rs.getString("Npassword"));
                    bean.setDeviceName(rs.getString("device_name"));
                    bean.setGroupId(rs.getInt("group_id"));
                    bean.setCreateTime(rs.getTimestamp("create_time"));
                    bean.setIsDel(rs.getInt("is_del"));
                    bean.setPondId(rs.getString("pond_id"));
                    bean.setLatitude(rs.getDouble("latitude"));
                    bean.setLongitude(rs.getDouble("longitude"));
                    list.add(bean);
                }
                return list;
            });
            sql.setPager(pager);
            dao.execute(sql);
            deviceBeans = sql.getList(UserDeviceBean.class);
        } else {
            deviceBeans = dao.query(UserDeviceBean.class, Cnd.where("user_name", "=", userName).and("group_id", "=", id).and("is_del", "=", "0"), pager);
        }
        return ResultObject.okList(deviceBeans, page, size);
    }

    /**
     * 根据设备号查询分组名称
     */
    @RequestMapping(value = "selDeviceToGroup", method = RequestMethod.GET)
    public Object selDeviceToGroup(@RequestParam(value = "deviceNumber") String deviceNumber) {

        UserDeviceBean userDeviceBean = dao.fetch(UserDeviceBean.class,
                Cnd.where("user_name", "=", ControllerHelper.getInstance(dao).getLoginUserName()).and("Ncode", "=", deviceNumber).and("is_del", "=", "0"));
        if (userDeviceBean == null) {
            return ResultObject.apiError("err50");//未绑定此设备
        }
        UserGroupBean userGroupBean = dao.fetch(UserGroupBean.class, Cnd.where("user_name", "=", ControllerHelper.getInstance(dao).getLoginUserName()).and("id", "=", userDeviceBean.getGroupId()));
        if (userGroupBean == null) {
            return ResultObject.apiError("err56");//分组不存在
        }
        return ResultObject.ok("ok8").data(userGroupBean);//查询成功
    }

}
