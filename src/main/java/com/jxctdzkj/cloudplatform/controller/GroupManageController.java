package com.jxctdzkj.cloudplatform.controller;

import com.google.common.collect.Maps;
import com.jxctdzkj.cloudplatform.bean.UserDeviceBean;
import com.jxctdzkj.cloudplatform.bean.UserGroupBean;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.opLog.EnableOpLog;
import com.jxctdzkj.cloudplatform.service.GroupManageService;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import com.jxctdzkj.cloudplatform.utils.ReturnObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.FieldFilter;
import org.nutz.dao.Sqls;
import org.nutz.dao.sql.Sql;
import org.nutz.trans.Atom;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Controller
@RequestMapping({"groupManage"})
public class GroupManageController {

    @Autowired
    Dao dao;

    @Autowired
    GroupManageService groupManageService;


    @RequestMapping(value = "")
    public String index() {
        return "groupList";
    }

    @RequestMapping("newGroupList")
    public String newGroupList() {
        return "newGroupList";
    }

    @RequestMapping(value = "/likeUserGroupList")
    @ResponseBody
    public ResultObject likeUserGroupList(String groupName) {
        Subject subject = SecurityUtils.getSubject();
        Object o = subject.getSession().getAttribute("user");
        String userName = o.toString();
        List<UserGroupBean> list = dao.query(UserGroupBean.class, Cnd.where("group_name", "like", "%" + groupName + "%").and("userName", "=", userName));
        return ResultObject.okList(list);
    }

    @RequestMapping(value = "/getGroupList")
    @ResponseBody
    public ReturnObject getGroupList() {
        ReturnObject result = new ReturnObject();
        Subject subject = SecurityUtils.getSubject();
        Object o = subject.getSession().getAttribute("user");
        String userName = o.toString();
        //????????????????????????????????????
        List<UserGroupBean> grouplist = groupManageService.getGroupList(userName);
        //???????????????
       /* UserGroupBean root = new UserGroupBean();
        root.setType(0);
        root.setpId(-1);
        root.setId(0);
        root.setName("?????????");
        root.setUserName(userName);
        grouplist.add(root);*/
        //????????????????????????
        /*List<UserDeviceBean> deviceList =  groupManageService.getGroupDeviceList(userName);*/

        //??????????????????
        // List<UserGroupBean> list = new ArrayList<UserGroupBean>();

      /*  for(UserDeviceBean device:deviceList){
            UserGroupBean group = new UserGroupBean();
            group.setType(1);
            group.setId(device.getId()+9999);
            group.setpId(device.getGroupId());
            group.setGroupName(device.getDeviceName());
            grouplist.add(group);
        }*/

        result.setCount(grouplist.size());
        result.setCode(0);
        result.setSuccess(true);
        result.setData(grouplist);
        return result;
    }

    @RequestMapping(value = "/getGroupDeviceDetail")
    public ModelAndView getGroupDeviceDetail(Integer id, String flag) {
        //List<UserDeviceBean> list =groupManageService.getGroupDeviceList(groupId);
        if ("edit".equals(flag) && id != null) {//????????????
            //??????????????????
            UserDeviceBean bean = groupManageService.getGroupDeviceById(id - 9999);
            return new ModelAndView("groupDeviceDetail", "data", bean);
        } else {
            return new ModelAndView("groupDeviceDetail", "data", new UserDeviceBean());
        }
    }

    @RequestMapping(value = "/getGroupDetail")
    public ModelAndView getGroupDetail(Integer id, String flag) {
        if ("edit".equals(flag) && id != null) {//????????????
            UserGroupBean bean = groupManageService.getGroupById(id);
            return new ModelAndView("groupDetail", "data", bean);
        } else {
            return new ModelAndView("groupDetail", "data", new UserGroupBean());
        }
    }
    @EnableOpLog
    @RequestMapping(value = "/submitGroup")
    @ResponseBody
    public ReturnObject submitGroup(Integer id, String flag, String groupName, Integer pId) {
        ReturnObject result = new ReturnObject();
        Subject subject = SecurityUtils.getSubject();
        Object o = subject.getSession().getAttribute("user");
        //????????????????????????????????????
        UserGroupBean bean = new UserGroupBean();
        bean.setGroupName(groupName);
        bean.setUserName(o.toString());
        bean.setpId(pId);
        if ("add".equals(flag)) {
            groupManageService.saveGroup(bean);
        } else if ("edit".equals(flag)) {
            bean.setId(id);
            groupManageService.updateGroup(bean);
        }
        result.setSuccess(true);
        return result;
    }

    @EnableOpLog
    @RequestMapping(value = "/submitGroupDevice")
    public void submitGroupDevice(Integer id, String flag, Integer groupId, String deviceNumber, String devicePassword, String deviceName) {
        Subject subject = SecurityUtils.getSubject();
        Object o = subject.getSession().getAttribute("user");

        //????????????????????????????????????
        String userName = o.toString();
        UserDeviceBean bean = new UserDeviceBean();
        bean.setGroupId(groupId);
        bean.setDeviceName(deviceName);
        bean.setDeviceNumber(deviceNumber);
        bean.setDevicePassword(devicePassword);
        bean.setUserName(userName);
        if ("add".equals(flag)) {
            groupManageService.saveGroupDevice(bean);
        } else if ("edit".equals(flag)) {
            bean.setId(id);
            groupManageService.updateGroupDevice(bean);
        }

    }

    @ResponseBody//??????
    @RequestMapping(value = "/deleteOperation")
    @EnableOpLog(Constant.ModifyType.DELETE)
    public void deleteOperation(Integer id, Integer type) {
        if (type == 1) {//???????????????
            UserDeviceBean bean = new UserDeviceBean();
            bean.setId(id - 9999);
            groupManageService.deleteGroupDevice(bean);
        } else {//?????????
            UserGroupBean bean = new UserGroupBean();
            bean.setId(id);
            groupManageService.deleteGroup(bean);
        }
    }

    /**
     * ?????????????????????ID????????????????????????????????????????????????,?????????????????????
     * @param id
     * @return ?????????:????????????/????????????,?????????????????????????????????????????????
     * @throws RuntimeException
     * @User ?????????
     */
    @ResponseBody//??????
    @RequestMapping(value = "/deleteOperation_Two")
    @EnableOpLog(Constant.ModifyType.DELETE)
    public ResultObject deleteOperation_Two(Integer id, Integer type) {
        String msg="";
        try {
            if (type == 1) {//???????????????
                UserDeviceBean bean = new UserDeviceBean();
                bean.setId(id - 9999);
                groupManageService.deleteGroupDevice(bean);
            } else {//?????????
                //????????????????????????????????????????????????????????????????????????
                 msg = groupManageService.getGroupDevice(id);
            }
        } catch (RuntimeException e) {
            msg="error14";
            log.error(e.toString(), e);
            return ResultObject.apiError(msg);
        }
        return ResultObject.ok(msg);
    }

    @EnableOpLog(Constant.ModifyType.DELETE)
    @RequestMapping({"newDeleteOperation"})
    @ResponseBody
    public ReturnObject deleteOperation(Integer id) {
        ReturnObject result = new ReturnObject();
        List<UserGroupBean> list = dao.query(UserGroupBean.class, Cnd.where("parent_id", "=", id));
        if (list != null && list.size() > 0) {
            result.setMsg("????????????????????????");
            result.setSuccess(false);
            return result;
        }
        dao.delete(UserGroupBean.class, id);
        result.setSuccess(true);
        return result;
    }

    @EnableOpLog
    @RequestMapping(value = "/upgrade")
    @ResponseBody
    public ReturnObject upgrade(UserGroupBean bean) {
        ReturnObject result = new ReturnObject();
        try {
            bean.setpId(0);
            FieldFilter.create(UserGroupBean.class, true).run(new Atom() {
                public void run() {
                    dao.update(bean);
                }
            });
            result.setSuccess(true);
        } catch (Exception e) {
            result.setSuccess(false);
            log.error(e.toString(), e);
        }
        return result;
    }

    @EnableOpLog
    @RequestMapping(value = "/updatePid")
    @ResponseBody
    public void updatePid(int id, int targetId) {
        //??????targetId?????????id??????????????????
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        List<UserGroupBean> bodyList = groupManageService.getGroupList(userName);
        Map<String, String> map = Maps.newHashMapWithExpectedSize(bodyList.size());
        List<String> childList = new ArrayList<>();
        getChild(id, map, bodyList, childList);
        boolean test = false;
        for (String child : childList) {
            if (child.equals(targetId + "")) {
                test = true;
                break;
            }
        }
        if (test) {
            Sql sql = Sqls.create(" select parent_id from sys_user_to_group where id = @id  ");
            sql.setCallback(Sqls.callback.integer());
            sql.params().set("id", id);
            dao.execute(sql);
            int pid = sql.getInt();
            Sql sql2 = Sqls.create(" update sys_user_to_group  set parent_id = @pid where  parent_id =@id ");
            sql2.params().set("id", id);
            sql2.params().set("pid", pid);
            dao.execute(sql2);
        }
        groupManageService.updatePid(id, targetId);

    }

    private void getChild(long id, Map<String, String> map, List<UserGroupBean> bodyList, List<String> childList) {
        bodyList.stream()
                .filter(c -> !map.containsKey(c.getId()))
                .filter(c -> c.getpId() == id)
                .forEach(c -> {
                    map.put(c.getId() + "", c.getpId() + "");
                    getChild(c.getId(), map, bodyList, childList);
                    childList.add(c.getId() + "");
                });
    }


}
