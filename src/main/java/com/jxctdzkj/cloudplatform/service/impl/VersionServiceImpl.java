package com.jxctdzkj.cloudplatform.service.impl;

import com.jxctdzkj.cloudplatform.bean.CameraBean;
import com.jxctdzkj.cloudplatform.bean.ConditionConfigBean;
import com.jxctdzkj.cloudplatform.bean.SysUserBean;
import com.jxctdzkj.cloudplatform.bean.SysVersionConfigBean;
import com.jxctdzkj.cloudplatform.bean.TimedTaskManageBean;
import com.jxctdzkj.cloudplatform.bean.TriggerBean;
import com.jxctdzkj.cloudplatform.bean.UserDeviceBean;
import com.jxctdzkj.cloudplatform.bean.UserRoleBean;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.service.RoleManageService;
import com.jxctdzkj.cloudplatform.service.VersionService;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import com.jxctdzkj.cloudplatform.utils.ReturnObject;

import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;

import lombok.extern.slf4j.Slf4j;

/**
 * 免费版创建数量限制校验api（如免费版创建的设备数量不能超过20台...）
 */
@Service
@Slf4j
public class VersionServiceImpl implements VersionService {
    @Autowired
    RoleManageService roleManageService;

    @Autowired
    Dao dao;

    @Override
    public Integer getVersionIdByUserName(String userName) {
        return roleManageService.getUserRole(userName).getVersionId();
    }

    public UserRoleBean getUserRoleByUserName(String userName) {
        return dao.fetch(UserRoleBean.class, userName);
    }

    @Override
    public ResultObject updateUserVersion(Integer versionId) {
        //TODO
        return null;
    }

    @Override
    public ResultObject checkDeviceNum(UserRoleBean userRoleBean) {
        try {
            String userName = userRoleBean.getUserName();
            int versionId = userRoleBean.getVersionId() == null ? 1 : userRoleBean.getVersionId();

            if (versionId == 1) {
                //查询当前用户创建的设备数量
                int createdDeviceNum = dao.count(UserDeviceBean.class, Cnd.where("user_name", "=", userName).and("is_del", "=", 0));
                //查询当前用户的设备限制数
                SysVersionConfigBean configBean = dao.fetch(SysVersionConfigBean.class, versionId);
                log.info(userName + "已创建设备 " + createdDeviceNum + "  实际可以创建：" + configBean.getDeviceNum());
                if (configBean.getDeviceNum() <= createdDeviceNum) {
                    return ResultObject.apiError("err106/" + configBean.getDeviceNum());
                }
            } else {
                //其他版本如果过期
                if (!ifExpiredTime(userRoleBean)) {
                    userRoleBean.setVersionId(1);
                    dao.update(userRoleBean);

                    //查询当前用户创建的设备数量
                    int createdDeviceNum = dao.count(UserDeviceBean.class, Cnd.where("user_name", "=", userName).and("is_del", "=", 0));
                    //查询免费版设备限制数
                    SysVersionConfigBean configBean = dao.fetch(SysVersionConfigBean.class, 1);
                    //如果超出了免费版的数量限制，则弹出版本过期提醒
                    if (configBean.getDeviceNum() <= createdDeviceNum) {
                        return ResultObject.apiError("err108");
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();

            return ResultObject.apiError("err107");
        }
        //无限放权
        return ResultObject.ok();
    }

    @Override
    public ResultObject checkLevel2UserNum(UserRoleBean userRoleBean) {
        try {
            String userName = userRoleBean.getUserName();
            int versionId = userRoleBean.getVersionId() == null ? 1 : userRoleBean.getVersionId();

            if (versionId == 1) {
                //查询当前用户创建的二级用户数
                int createdLevel2UserNum = dao.count(SysUserBean.class, Cnd.where("parentuser", "=", userName));
                //查询当前用户的设备限制数
                SysVersionConfigBean configBean = dao.fetch(SysVersionConfigBean.class, versionId);
                log.info(userName + "已创建用户 " + createdLevel2UserNum + "  实际可以创建：" + configBean.getLevel2UserNum());
                if (configBean.getLevel2UserNum() <= createdLevel2UserNum) {
                    return ResultObject.apiError("err106/" + configBean.getLevel2UserNum());
                }
            } else {
                if (!ifExpiredTime(userRoleBean)) {
                    userRoleBean.setVersionId(1);
                    dao.update(userRoleBean);

                    //查询当前用户创建的二级用户数
                    int createdLevel2UserNum = dao.count(SysUserBean.class, Cnd.where("parentuser", "=", userName));
                    //查询当前用户的设备限制数
                    SysVersionConfigBean configBean = dao.fetch(SysVersionConfigBean.class, 1);

                    if (configBean.getLevel2UserNum() <= createdLevel2UserNum) {
                        return ResultObject.apiError("err108");
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();

            return ResultObject.apiError("err107");
        }

        return ResultObject.ok();
    }

    @Override
    public ResultObject checkMonitorNum(UserRoleBean userRoleBean) {

        try {
            String userName = userRoleBean.getUserName();
            int versionId = userRoleBean.getVersionId() == null ? 1 : userRoleBean.getVersionId();


            if (versionId == 1) {
                //查询当前用户创建的监视器个数
                int createdCameraNum = dao.count(CameraBean.class, Cnd.where("user_name", "=", userName));
                //查询当前用户的设备限制数
                SysVersionConfigBean configBean = dao.fetch(SysVersionConfigBean.class, versionId);
                log.info(userName + "已创建监视器 " + createdCameraNum + "  实际可以创建：" + configBean.getMonitorNum());
                if (configBean.getMonitorNum() <= createdCameraNum) {
                    return ResultObject.apiError("err106/" + configBean.getMonitorNum());
                }

            } else {
                if (!ifExpiredTime(userRoleBean)) {
                    userRoleBean.setVersionId(1);
                    dao.update(userRoleBean);
                    int createdCameraNum = dao.count(CameraBean.class, Cnd.where("user_name", "=", userName));
                    //查询当前用户的设备限制数
                    SysVersionConfigBean configBean = dao.fetch(SysVersionConfigBean.class, 1);

                    if (configBean.getMonitorNum() <= createdCameraNum) {
                        return ResultObject.apiError("err108");
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResultObject.apiError("err107");
        }
        return ResultObject.ok();
    }

    @Override
    public ResultObject checkConfigurationNum(UserRoleBean userRoleBean) {

        try {
            String userName = userRoleBean.getUserName();
            int versionId = userRoleBean.getVersionId() == null ? 1 : userRoleBean.getVersionId();

            if (versionId == 1) {
                //查询当前用户创建的组态个数
                int createdConfigurationNum = dao.count(ConditionConfigBean.class, Cnd.where("user_name", "=", userName).and("del", "=", 0));
                //查询当前用户的设备限制数
                SysVersionConfigBean configBean = dao.fetch(SysVersionConfigBean.class, versionId);
                log.info(userName + "已创建组态 " + createdConfigurationNum + "  实际可以创建：" + configBean.getConfigurationNum());
                if (configBean.getConfigurationNum() <= createdConfigurationNum) {
                    return ResultObject.apiError("err106/" + configBean.getConfigurationNum());
                }
            } else {
                if (!ifExpiredTime(userRoleBean)) {
                    userRoleBean.setVersionId(1);
                    dao.update(userRoleBean);
                    int createdConfigurationNum = dao.count(ConditionConfigBean.class, Cnd.where("user_name", "=", userName).and("del", "=", 0));
                    //查询当前用户的设备限制数
                    SysVersionConfigBean configBean = dao.fetch(SysVersionConfigBean.class, 1);
                    if (configBean.getConfigurationNum() <= createdConfigurationNum) {
                        return ResultObject.apiError("err108");
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResultObject.apiError("err107");
        }

        return ResultObject.ok();

    }

    /**
     * @param userRoleBean
     * @return
     */
    @Override
    public ResultObject checkTriggerNum(UserRoleBean userRoleBean) {
        try {
            String userName = userRoleBean.getUserName();
            int versionId = userRoleBean.getVersionId() == null ? 1 : userRoleBean.getVersionId();

            if (versionId == 1) {

                //查询当前用户创建的触发器个数
                int createdTriggerNum = dao.count(TriggerBean.class, Cnd.where("user_name", "=", userName).and("is_del", "=", 0));
                //查询当前用户的设备限制数
                SysVersionConfigBean configBean = dao.fetch(SysVersionConfigBean.class, versionId);
                log.info(userName + "已创建触发器 " + createdTriggerNum + "  实际可以创建：" + configBean.getTriggerNum());
                if (configBean.getTriggerNum() <= createdTriggerNum) {
                    return ResultObject.apiError("err106/" + configBean.getTriggerNum());
                }
            } else {
                if (!ifExpiredTime(userRoleBean)) {
                    userRoleBean.setVersionId(1);
                    dao.update(userRoleBean);
                    int createdTriggerNum = dao.count(TriggerBean.class, Cnd.where("user_name", "=", userName).and("is_del", "=", 0));
                    //查询当前用户的设备限制数
                    SysVersionConfigBean configBean = dao.fetch(SysVersionConfigBean.class, 1);

                    if (configBean.getTriggerNum() <= createdTriggerNum) {
                        return ResultObject.apiError("err108");
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResultObject.apiError("err107");
        }

        return ResultObject.ok();
    }

    @Override
    public ResultObject checkTimerTaskNum(UserRoleBean userRoleBean) {

        try {
            String userName = userRoleBean.getUserName();
            int versionId = userRoleBean.getVersionId() == null ? 1 : userRoleBean.getVersionId();

            if (versionId == 1) {

                //查询当前用户创建的定时任务个数
                int createdTimeTaskNum = dao.count(TimedTaskManageBean.class, Cnd.where("create_user", "=", userName).and("delete_flag", "=", 0));
                //查询当前用户的定时任务限制数
                SysVersionConfigBean configBean = dao.fetch(SysVersionConfigBean.class, versionId);
                log.info(userName + "已创建定时任务 " + createdTimeTaskNum + "  实际可以创建：" + configBean.getTimerNum());
                if (configBean.getTimerNum() <= createdTimeTaskNum) {
                    return ResultObject.apiError("err106/" + configBean.getTimerNum());
                }
            } else {
                if (!ifExpiredTime(userRoleBean)) {
                    userRoleBean.setVersionId(1);
                    dao.update(userRoleBean);
                    int createdTimeTaskNum = dao.count(TimedTaskManageBean.class, Cnd.where("create_user", "=", userName).and("delete_flag", "=", 0));
                    //查询当前用户的定时任务限制数
                    SysVersionConfigBean configBean = dao.fetch(SysVersionConfigBean.class, 1);

                    if (configBean.getTimerNum() <= createdTimeTaskNum) {
                        return ResultObject.apiError("err108");
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResultObject.apiError("err107");
        }
        return ResultObject.ok();
    }

    public ResultObject checkVersionAuthority(String userName, String config) {
        //查询配置是否开启版本校验
        if (!Constant.Project.VERSION_CHECK) {
            return ResultObject.ok();
        }

        UserRoleBean userRoleBean = getUserRoleByUserName(userName);
        if (userRoleBean == null) {
            return ResultObject.apiError("err102");
        }

        switch (config) {
            case "device"://设备数量
                return checkDeviceNum(userRoleBean);
            case "monitor":
                return checkMonitorNum(userRoleBean);
            case "user":
                return checkLevel2UserNum(userRoleBean);
            case "configuration":
                return checkConfigurationNum(userRoleBean);
            case "trigger":
                return checkTriggerNum(userRoleBean);
            case "timer":
                return checkTimerTaskNum(userRoleBean);

        }
        return ResultObject.ok();
    }

    /**
     * 适配返回类型为ReturnObject的接口
     *
     * @param userName
     * @param config
     * @return
     */
    public ReturnObject checkVersion(String userName, String config) {
        ReturnObject result = new ReturnObject();
        ResultObject ro = checkVersionAuthority(userName, config);

        if (ro.get("state").equals("failed")) {
            result.setSuccess(false);
            result.setMsg((String) ro.get("msg"));
        } else {
            result.setSuccess(true);
        }
        return result;
    }

    /**
     * 判断当前用户版本是否过期
     * 没有过期返回true，否则返回false
     *
     * @param userRoleBean
     * @return
     */
    public Boolean ifExpiredTime(UserRoleBean userRoleBean) {
        return userRoleBean.getExpiryTime().getTime() >= System.currentTimeMillis();
    }

}
