package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.*;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.opLog.EnableOpLog;
import com.jxctdzkj.cloudplatform.service.impl.VersionServiceImpl;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import com.jxctdzkj.support.utils.DynamicCalculation;
import com.jxctdzkj.support.utils.Encrypt;
import com.jxctdzkj.support.utils.TextUtils;
import lombok.extern.slf4j.Slf4j;
import org.nutz.dao.Cnd;
import org.nutz.dao.Sqls;
import org.nutz.dao.pager.Pager;
import org.nutz.dao.sql.Sql;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.List;

/**
 * <pre>
 *     @author  : FlySand
 *     @e-mail  : 1156183505@qq.com
 *     @time    : 2018/11/24.
 *     @desc    :
 * </pre>
 */
@Slf4j
@Controller
@RequestMapping({"trigger"})
@RestController
public class TriggerController extends BaseController {
    @Autowired
    VersionServiceImpl versionService;

    /**
     * 添加触发
     */
    @EnableOpLog(Constant.ModifyType.SAVE)
    @RequestMapping(value = "addTrigger", method = RequestMethod.POST)
    public Object addTrigger(TriggerBean triggerBean, String sensorName, String password) {

        SysUserBean loginUserBean = ControllerHelper.getInstance(dao).getLoginUser();
        String userName = loginUserBean.getUserName();

        //首先判断当前用户拥有的触发器数是否超限
        ResultObject ro = versionService.checkVersionAuthority(userName, "trigger");
        if (ro.get("state").equals("failed")) {
            return ro;
        }
        boolean isAddAll = !TextUtils.isEmpty(sensorName);
        if (isAddAll) {
            if (TextUtils.isEmpty(triggerBean.getName())) {
                return ResultObject.apiError("warn11");//名称不能为空
            }
        } else {
            if (TextUtils.isEmpty(triggerBean.getSensorCode())) {
                return ResultObject.apiError("err70");//节点编号不能为空
            }
        }
        switch (triggerBean.getType()) {
            case Constant.TriggerType.EMAIL:
                String email = triggerBean.getAddress();
                if (TextUtils.isEmpty(email)) {
                    email = loginUserBean.getEmail();
                }
                if (TextUtils.isEmpty(email)) {
                    return ResultObject.apiError("err73");//请完善个人信息
                }
                if (!email.contains("@")) {
                    return ResultObject.apiError("err74");//邮箱地址错误
                }
                break;
            case Constant.TriggerType.TEL:
                String tel = triggerBean.getAddress();
                if (TextUtils.isEmpty(tel)) {
                    tel = loginUserBean.getTel();
                }
                if (TextUtils.isEmpty(tel)) {
                    return ResultObject.apiError("err73");//请完善个人信息
                }
                if (tel.length() < 11) {
                    return ResultObject.apiError("err75");//手机号错误
                }
                try {
                    Long.parseLong(tel);
                } catch (NumberFormatException e) {
                    return ResultObject.apiError("err75");//手机号错误
                }
                break;
            default:
                return ResultObject.apiError("err76");//推送类型错误
        }
        if (TextUtils.isEmpty(triggerBean.getExpression())) {
            return ResultObject.apiError("err77");//表达式不能为空
        }
        try {
            String result = DynamicCalculation.eval(triggerBean.getExpression().replace("value", "1.0")).toString();
            if (result.equalsIgnoreCase("true") || result.equalsIgnoreCase("false")) {
            } else {
                throw new RuntimeException("result:" + result);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResultObject.apiError("err78");//表达式错误
        }

        if (isAddAll) {//一键添加
            Sql sql = Sqls.create("select s.id,sensor_code,sensor_name,Ncode,device_name FROM sensor s,sys_user_to_devcie d where d.user_name=@userName and d.is_del=0   and d.Ncode=s.sensor_ncode and s.sensor_name = @sensorName and ( s.sensor_code not in  (SELECT sensor_code FROM trigger_alarm WHERE  user_name =@userName and is_del =0))");
            sql.params().set("userName", userName);
            sql.params().set("sensorName", sensorName);
            sql.setCallback((conn, rs, sql1) -> {
                int count = 0;
                while (rs.next()) {
                    log.info(rs.getString("Ncode"));
                    log.info(rs.getString("sensor_code"));
                    log.info(rs.getString("sensor_name"));
                    TriggerBean trigger = triggerBean;
                    trigger.setUserName(userName);
                    trigger.setDeviceNumber(rs.getString("sensor_code"));
                    trigger.setSensorCode(rs.getString("sensor_code"));
                    trigger.setCreatTime(new Timestamp(System.currentTimeMillis()));
                    trigger.setState(1);
                    if (dao.insert(trigger) != null) {
                        count++;
                    }
                }
                return count;
            });
            dao.execute(sql);
            int count = sql.getInt();
            log.info("count:" + count);
            return ResultObject.ok("ok2").data("count", count);//添加成功
        } else {
//            TriggerBean queryTriggerBean = dao.fetch(TriggerBean.class, Cnd.where("user_name", "=", userName).and("sensor_code", "=", triggerBean.getSensorCode()).and("isDel", "=", "0"));
//            if (queryTriggerBean != null) {
//                return ResultObject.apiError("err71");//重复添加
//            }
            SensorTemplateBean sensorTemplateBean = dao.fetch(SensorTemplateBean.class, triggerBean.getSensorCode());
            if (sensorTemplateBean == null) {
                return ResultObject.apiError("err72");//节点编号不存在
            }
            DeviceBean deviceBean = dao.fetch(DeviceBean.class, sensorTemplateBean.getSensorNcode());
            if (deviceBean == null) {
                return ResultObject.apiError("err24");//设备不存在
            }
            if (loginUserBean.getLevel() > Constant.Define.ROLE_0) {
                UserDeviceBean sysUserBean = dao.fetch(UserDeviceBean.class, Cnd.where("user_name", "=", userName).and("Ncode", "=", sensorTemplateBean.getSensorNcode()).and("isDel", "=", "0"));
                if (sysUserBean == null) {
                    return ResultObject.apiError("err50");//未绑定此设备
                }
                if (!TextUtils.isEmpty(deviceBean.getPassword()) && !deviceBean.getPassword().equals(Encrypt.e(password))) {
                    return ResultObject.apiError("err25");//密码错误
                }
            }
            triggerBean.setUserName(userName);
            triggerBean.setDeviceNumber(sensorTemplateBean.getSensorNcode());
            triggerBean.setCreatTime(new Timestamp(System.currentTimeMillis()));
            triggerBean.setState(1);

            //****************黄威修改**********************
            String deviceNumber = triggerBean.getDeviceNumber();
            if (deviceNumber != null) {

                UserDeviceBean device = dao.fetch(UserDeviceBean.class, Cnd.where("Ncode", "=", deviceNumber).and("user_name", "=", userName));
                if (device != null) {
                    long groupId = device.getGroupId();
                    triggerBean.setGroupId(groupId);
                }
            }
            //**************************************************
            if (dao.insert(triggerBean) != null) {
                return ResultObject.ok("ok2").data(triggerBean);//添加成功
            }
        }
        return ResultObject.apiError("error10");//添加失败
    }

    /**
     * 触发列表
     */
    @RequestMapping(value = "/triggerList", method = RequestMethod.GET)
    public Object getCommandList(
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "100") int size,
            String sensorCode) {
        Pager pager = dao.createPager(page, size);
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        Cnd cnd = Cnd.where("user_name", "=", userName).and("is_del", "=", "0");
        if (!TextUtils.isEmpty(sensorCode)) {
            cnd.and("sensor_code", "like", "%" + sensorCode + "%");
        }
        List<TriggerBean> commandBeans = dao.query(TriggerBean.class, cnd, pager);
        long count = ControllerHelper.getInstance(dao).getCount("trigger_alarm " + cnd);
        return ResultObject.okList(commandBeans, page, size, count);
    }

    /**
     * 删除触发
     */
    @EnableOpLog(Constant.ModifyType.DELETE)
    @RequestMapping(value = "/delTrigger", method = RequestMethod.POST)
    public Object delTrigger(@RequestParam(value = "id") long id) {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        TriggerBean queryTriggerBean = dao.fetch(TriggerBean.class, Cnd.where("user_name", "=", userName).and("id", "=", id).and("isDel", "=", "0"));
        if (queryTriggerBean == null) {
            return ResultObject.apiError("err79");//记录已删除
        }
        queryTriggerBean.setIsDel(1);
        if (dao.update(queryTriggerBean) > 0) {
            return ResultObject.ok("ok3");//删除成功
        }
        return ResultObject.apiError("error14");//删除失败
    }

    /**
     * 触发历史记录列表
     */
    @RequestMapping(value = "/triggerHistoryList", method = RequestMethod.GET)
    public Object triggerHistoryList(
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "100") int size,
            String sensorCode, String triggerName) {
        Pager pager = dao.createPager(page, size);
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        Cnd cnd = Cnd.where("user_name", "=", userName).and("is_del", "=", "0");
        if (!TextUtils.isEmpty(sensorCode)) {
            cnd.and("Ncode", "like", "%" + sensorCode + "%");
        }

        if (!TextUtils.isEmpty(triggerName)) {
            cnd.and("trigger_name", "=", triggerName);
        }
        List<TriggerHistoryBean> commandBeans = dao.query(TriggerHistoryBean.class, cnd.desc("id"), pager);
        long count = ControllerHelper.getInstance(dao).getCount("trigger_alarm_history " + cnd);
        return ResultObject.okList(commandBeans, page, size, count);
    }

    /**
     * 获取一定时间内触发历史记录列表
     * @User 李英豪
     */
    @RequestMapping(value = "/findTriggerTimeList", method = RequestMethod.GET)
    public Object findTriggerTimeList(
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "100") int size,
            String stateTime, String endTime, String sensorCode, String triggerName) {
        Pager pager = dao.createPager(page, size);
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        Cnd cnd = Cnd.where("user_name", "=", userName).and("is_del", "=", "0");
        if (!TextUtils.isEmpty(sensorCode)) {
            cnd.and("Ncode", "like", "%" + sensorCode + "%");
        }

        if (!TextUtils.isEmpty(triggerName)) {
            cnd.and("trigger_name", "=", triggerName);
        }
        if ((stateTime != null && !stateTime.equals(""))&&(endTime != null && !endTime.equals(""))) {
            cnd.and("alarm_time", "<", endTime).and("alarm_time", ">", stateTime);
        }
        List<TriggerHistoryBean> commandBeans = dao.query(TriggerHistoryBean.class, cnd.desc("id"), pager);
        long count = ControllerHelper.getInstance(dao).getCount("trigger_alarm_history " + cnd);
        return ResultObject.okList(commandBeans, page, size, count);
    }

    /**
     * 触发历史记录列表for 水产大屏
     */
    @RequestMapping(value = "/triggerHistoryListForAquacultureScreen", method = RequestMethod.GET)
    public ResultObject triggerHistoryListForAquacultureScreen() {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        List<TriggerHistoryBean> list = dao.query(TriggerHistoryBean.class,
                Cnd.where("user_name", "=", userName)
                        .and("is_del", "=", "0")
                        .orderBy("alarm_time", "desc"),
                new Pager(1, 10));
        return ResultObject.ok(list);
    }

    /**
     * 删除触发
     */
    @EnableOpLog(Constant.ModifyType.DELETE)
    @RequestMapping(value = "/delTriggerHistory", method = RequestMethod.POST)
    public Object delTriggerHistory(@RequestParam(value = "id") long id) {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        TriggerHistoryBean queryTriggerBean = dao.fetch(TriggerHistoryBean.class, Cnd.where("user_name", "=", userName).and("id", "=", id).and("isDel", "=", "0"));
        if (queryTriggerBean == null) {
            return ResultObject.apiError("err79");//记录已删除
        }
        queryTriggerBean.setIsDel(1);
        if (dao.update(queryTriggerBean) > 0) {
            return ResultObject.ok("ok3");//删除成功
        }
        return ResultObject.apiError("error14");//删除失败
    }

    /**
     * 修改报警状态
     */
    @EnableOpLog
    @RequestMapping(value = "changeState", method = RequestMethod.POST)
    public Object changeState(@RequestParam long id, @RequestParam int state) {
        TriggerBean triggerBean = dao.fetch(TriggerBean.class, id);
        if (triggerBean == null) {
            return ResultObject.apiError("err80");//数据不存在
        }
        if (state < 0 || state > 1) {
            return ResultObject.apiError("err81");//参数不合法
        }
        triggerBean.setState(state);
        if (dao.update(triggerBean, "^state$") > 0) {
            if (state == 0) {
                return ResultObject.ok("ok13");//关闭成功
            } else {
                return ResultObject.ok("ok14");//开启成功
            }
        }
        return ResultObject.apiError("err82");//设置失败
    }

    /**
     * 修改自动关闭状态
     */
    @EnableOpLog
    @RequestMapping(value = "autoClose", method = RequestMethod.POST)
    public Object autoClose(@RequestParam long id, @RequestParam int state) {
        TriggerBean triggerBean = dao.fetch(TriggerBean.class, id);
        if (triggerBean == null) {
            return ResultObject.apiError("err80");//数据不存在
        }
        if (state < 0 || state > 1) {
            return ResultObject.apiError("err81");//参数不合法
        }
        triggerBean.setAutoClose(state);
        if (dao.update(triggerBean, "^autoClose$") > 0) {
            if (state == 0) {
                return ResultObject.ok("ok13");//关闭成功
            } else {
                return ResultObject.ok("ok14");//开启成功
            }
        }
        return ResultObject.apiError("err82");//设置失败
    }

    /**
     * 一键开启/关闭
     */
    @EnableOpLog
    @RequestMapping(value = "toggle", method = RequestMethod.POST)
    public Object toggle(@RequestParam String type) {
        if (ControllerHelper.getLoginUserLevel() < Constant.Define.ROLE_1) {
            return ResultObject.apiError("暂不支持");
        }
        String userName = ControllerHelper.getLoginUserName();
        int state = 0;
        switch (type) {
            case "open":
                state = 1;
                break;
            case "close":
                break;
            default:
                return ResultObject.apiError("类型错误");
        }
        Sql sql = Sqls.create("UPDATE trigger_alarm SET state=@state where user_name=@user_name and is_del=0");
        sql.params().set("state", state);
        sql.params().set("user_name", userName);
        sql.setCallback(Sqls.callback.longValue());
        dao.execute(sql);
        long count = sql.getUpdateCount();
        log.info("count:" + count);
        return ResultObject.ok("success").data("count", count);
    }


    /**
     * 触发历史记录列表for 大棚大屏
     */
    @RequestMapping(value = "/triggerHistoryListForShelterScreen", method = RequestMethod.GET)
    @ResponseBody
    public ResultObject triggerHistoryListForShelterScreen() {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        List<TriggerHistoryBean> list = dao.query(TriggerHistoryBean.class,
                Cnd.where("user_name", "=", userName)
                        .and("is_del", "=", "0")
                        .and("state", "=", "0")
                        .orderBy("alarm_time", "desc"),
                new Pager(1, 20));
        return ResultObject.ok(list);
    }

    @RequestMapping(value = "/listTriggerBySensorCode", method = RequestMethod.GET)
    @ResponseBody
    public ResultObject listTriggerBySensorCode(@RequestParam String sensorCode) {
        List<TriggerBean> triggerBeans = dao.query(TriggerBean.class,
                Cnd.where("sensor_code", "=", sensorCode)
                        .and("is_del", "=", "0"));
        return ResultObject.okList(triggerBeans);
    }

}
