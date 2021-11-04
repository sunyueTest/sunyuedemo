package com.jxctdzkj.cloudplatform.service;

import com.jxctdzkj.cloudplatform.bean.UserRoleBean;
import com.jxctdzkj.cloudplatform.utils.ResultObject;

/**
 * 用户版本控制(免费版/专业版)
 */
public interface VersionService {

    /**
     * 获取用户版本号
     *
     * @param userName
     * @return
     */
    Integer getVersionIdByUserName(String userName);

    /**
     * 更新用户的版本信息
     *
     * @param versionId
     * @return
     */
    ResultObject updateUserVersion(Integer versionId);

    /**
     * 判断设备数量是否超限
     * 返回值：
     * {
     *     state:[success | failed]
     *     data:{
     *         flag:[true | false]//操作是否符合当前版本（免费/专业）配置要求
     *         type:[1 | 2] //仅在flag为false时才有意义，1：表示免费版操作受制约 2：收费版到期
     *         num:10 //受限数量
     *     }
     * }
     * 下同
     * @param userRoleBean
     * @return
     */
    ResultObject checkDeviceNum(UserRoleBean userRoleBean);

    /**
     * 判断二级用户数量是否超限
     *
     * @param userRoleBean
     * @return
     */
    ResultObject checkLevel2UserNum(UserRoleBean userRoleBean);

    /**
     * 判断监控数量是否超限
     *
     * @param userRoleBean
     * @return
     */
    ResultObject checkMonitorNum(UserRoleBean userRoleBean);

    /**
     * 判断组态数量是否超限
     *
     * @param userRoleBean
     * @return
     */
    ResultObject checkConfigurationNum(UserRoleBean userRoleBean);

    /**
     * 判断触发器数量是否超限
     *
     * @param userRoleBean
     * @return
     */
    ResultObject checkTriggerNum(UserRoleBean userRoleBean);

    /**
     * 判断定时任务数量是否超限
     *
     * @param userRoleBean
     * @return
     */
    ResultObject checkTimerTaskNum(UserRoleBean userRoleBean);
}
