package com.jxctdzkj.cloudplatform.service.impl;

import com.jxctdzkj.cloudplatform.bean.*;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.exception.ServiceException;
import com.jxctdzkj.cloudplatform.service.ConditionService;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.HttpClientUtil;
import com.jxctdzkj.cloudplatform.utils.ReturnObject;
import com.jxctdzkj.support.utils.DynamicCalculation;
import com.jxctdzkj.support.utils.Encrypt;
import com.jxctdzkj.support.utils.TextUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.message.BasicNameValuePair;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.dao.pager.Pager;
import org.nutz.dao.sql.Sql;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.script.ScriptException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static com.jxctdzkj.cloudplatform.config.Constant.isRelayDevice;

@Service
@Slf4j
public class ConditionServiceImpl implements ConditionService {

    @Autowired
    Dao dao;


    @Override
    public List<ConditionConfigBean> getConditionConfigList(int page, int limit, String sensorCode) {
        Pager pager = new Pager(page, limit);
        Cnd cnd = Cnd.where("del", "=", 0);
        if (!StringUtils.isEmpty(sensorCode)) {
            cnd = Cnd.where("sensor_code", "like", "%" + sensorCode + "%")
                    .and("del", "=", 0);
        }
        return dao.query(ConditionConfigBean.class, cnd, pager);
    }

    @Override
    public List<ConditionConfigBean> getConditionConfigList(String name, int page, int limit, String sensorCode) {
        Pager pager = new Pager(page, limit);
        Cnd cnd = Cnd.where("user_name", "=", name)
                .and("del", "=", 0);
        if (!StringUtils.isEmpty(sensorCode)) {
            cnd.and("sensor_code", "like", "%" + sensorCode + "%");
        }
        return dao.query(ConditionConfigBean.class, cnd, pager);
    }

    @Override
    public int getConditionListCount(String sensorCode) {
        Sql sql = Sqls.create(" select count(1) from condition_config where del=0 ");
        if (!StringUtils.isEmpty(sensorCode)) {
            sql.setCondition(Cnd.NEW()
                    .and("sensor_code", "like", "%" + sensorCode + "%"));
        }
//        sql.setCondition(Cnd.NEW().and("del", "=", 0));
        sql.setCallback(Sqls.callback.integer());
        dao.execute(sql);
        return sql.getInt();
    }

    @Override
    public int getConditionListCount(String userName, String sensorCode) {
        Sql sql = Sqls.create(" select count(1) from condition_config where user_name = '" + userName + "' AND del ='0'");
        if (!StringUtils.isEmpty(sensorCode)) {
            sql.setCondition(Cnd.NEW()
                    .and("sensor_code", "like", "%" + sensorCode + "%")
                    .and("del", "=", 0));
        }
        sql.setCallback(Sqls.callback.integer());
        dao.execute(sql);
        return sql.getInt();
    }

    @Override
    public void saveConditionConfig(ConditionConfigBean condition) {
        //校验参数。
        // 校验sensorcode
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        if (StringUtils.isEmpty(userName)) {
//            throw new ServiceException("未登录");
            throw new ServiceException("err21");
        }
        condition.setUserName(userName);
        if (TextUtils.isEmpty(condition.getExpression()) || condition.getValue() == 0) {
            throw new ServiceException("err78");//表达式错误
        }
        if (TextUtils.isEmpty(condition.getToDevice())) {
            throw new ServiceException("err104");//联动设备号不能为空
        }
        if (TextUtils.isEmpty(condition.getSensorCode())) {
            throw new ServiceException("warn35");//请输入节点编号
        }
        if (condition.getSensorCode().contains(condition.getToDevice())) {
            throw new ServiceException("warn53");// 不能配置同一设备
        }

        if (ControllerHelper.getInstance(dao).getLoginUserLevel() > 0) {
            Sql sql = Sqls.create(" select * from sys_user_to_devcie a WHERE EXISTS ( select 1 from sensor b WHERE a.Ncode =b.sensor_ncode and b.sensor_code =@sensorCode ) and a.user_name =@userName ");
            sql.params().set("sensorCode", condition.getSensorCode());
            sql.params().set("userName", userName);
            sql.setCallback(Sqls.callback.entity());
            sql.setEntity(dao.getEntity(UserDeviceBean.class));
            dao.execute(sql);
            UserDeviceBean userDeviceBean = sql.getObject(UserDeviceBean.class);
            if (userDeviceBean == null) {
//                未绑定设备
                new ServiceException("err36");
            }
            if (userDeviceBean == null) {
//                throw new ServiceException("节点不存在");
                throw new ServiceException("err103");
            }
            DeviceBean deviceBean = dao.fetch(DeviceBean.class, userDeviceBean.getDeviceNumber());
            //校验密码
            String password = condition.getPassword();
            if (!TextUtils.isEmpty(deviceBean.getPassword())) {
                if (TextUtils.isEmpty(password)) {
                    new ServiceException("err44");//请输入设备密码
                }
                if (!deviceBean.getPassword().equals(Encrypt.e(password))) {
                    new ServiceException("err25");//密码错误
                }
            }

//            if (StringUtils.isNotBlank(password)) {
//                if (deviceBean.getPassword().equals(Encrypt.e(password))) {
////                    throw new ServiceException("密码错误");
//                    throw new ServiceException("err25");
//                }
//            }
            condition.setDeviceNumber(userDeviceBean.getDeviceNumber());
        } else {
            SensorTemplateBean sensor = dao.fetch(SensorTemplateBean.class, condition.getSensorCode());
            if (sensor == null) {
//                throw new ServiceException("节点不存在");
                throw new ServiceException("err103");
            }
            condition.setDeviceNumber(sensor.getSensorNcode());
        }
        try {
            String result = DynamicCalculation.eval("1" + condition.getExpression() + condition.getValue()).toString();
            if (result.equalsIgnoreCase("true") || result.equalsIgnoreCase("false")) {
            } else {
                throw new RuntimeException("result:" + result);
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new ServiceException("err78");//表达式错误
        }
        if (condition.getId() > 0) {
            condition.setState(1);
            dao.update(condition);
        } else {
//            ConditionConfigBean querybean = dao.fetch(ConditionConfigBean.class, Cnd.where("user_name", "=", user.getUserName()).and("sensor_code", "=", condition.getSensorCode()));
//            if (querybean != null) {
//                throw new ServiceException("此节点已添加过");
//            }
            condition.setState(1);
            dao.insert(condition);
        }
    }

    @Override
    public void updateState(int state, long id) {
        Sql sql = Sqls.create("update condition_config set state =@state where id =@id");
        sql.params().set("state", state);
        sql.params().set("id", id);
        dao.execute(sql);
    }

    @Override
    public ConditionConfigBean getCondition(long id) {
        return dao.fetch(ConditionConfigBean.class, id);
    }

    @Override
    public List<SensorTemplateBean> getSensorList(String ncode) {
        return getSensorTemplateBeans(ncode, "select * from sensor where sensor_ncode in (select b.Ncode from sys_user_to_devcie b WHERE b.Ncode=@ncode and b.user_name=@userName) ");
    }

    /**
     * 根据继电器编号，继电器ID查询继电器节点，以及对应节点的开启状态
     *
     * @param ncode 继电器编号
     * @param id    继电器ID
     * @return
     */
    @Override
    public List<SensorTemplateBean> getSensorListTwo(String ncode, long id)throws RuntimeException {
        DeviceBean deviceBean=dao.fetch(DeviceBean.class,Cnd.where("Ncode","=",ncode));
        if(deviceBean!=null){
            boolean isTrue=isRelayDevice(deviceBean.getDeviceType());
            if(!isTrue){
                throw new RuntimeException("err175");//此设备不属于继电器设备
            }
        }else{
            throw new RuntimeException("err50");
        }


        List<SensorTemplateBean> list = getSensorTemplateBeans(ncode, "select * from sensor where sensor_ncode in " +
                "(select b.Ncode from network b,sys_user_to_devcie c " +
                "   WHERE b.Ncode=@ncode and c.user_name=@userName and c.Ncode=b.Ncode and c.is_del='0' ) ");
        if (list != null && list.size() > 0) {
            TimedTaskManageBean bean = dao.fetch(TimedTaskManageBean.class, id);
            //获取对应节点开启关闭状态
            if (bean != null) {
                List<String> command = new ArrayList<>();
                int k = 0;
                //获取继电器设定的开关，进行拆分
                for (int j = 0; j < bean.getCommand().length() / 4; j++) {
                    command.add(bean.getCommand().substring(k, k + 4));
                    k = k + 4;
                }
                //将每个继电器开关赋值给对应的继电器节点
                for (int i = 0; i < list.size(); i++) {
                    for(int j=0;j<command.size();j++){
                        //转换获取定时任务中继电器的开关值，将前两位节点编号转换成数字
                        int num=Integer.parseInt(command.get(j).substring(0,2));
                        //如果当前循环的继电器的节点数等于任务中继电器的前两位数字，说明是该节点的继电器开关操作
                        if((i+1)==num){
                            list.get(i).setState(Integer.parseInt(command.get(j).substring(3, 4)));
                        }
                    }
//                    if (i < command.size()) {
//                        list.get(i).setState(Integer.parseInt(command.get(i).substring(3, 4)));
//                    }
                }
            }

        }else{
            throw new RuntimeException("err50");
        }
        return list;
    }


    private List<SensorTemplateBean> getSensorTemplateBeans(String ncode, String s) {
        if (StringUtils.isBlank(ncode)) {
            return null;
        }
        Sql sql;
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        //如果是总账户直接查询组态表不查询用户与设备表
        if (userBean.getLevel() <= 0) {
            sql = Sqls.create("select * from sensor where sensor_ncode=@ncode");
        } else {
            sql = Sqls.create(s);
            sql.params().set("userName", userBean.getUserName());
        }
        sql.params().set("ncode", ncode);
        sql.setCallback(Sqls.callback.entities());
        sql.setEntity(dao.getEntity(SensorTemplateBean.class));
        dao.execute(sql);
        return sql.getList(SensorTemplateBean.class);
    }

    @Override
    public List<SensorTemplateBean> getAquacultureSensorList(String ncode) {
        return getSensorTemplateBeans(ncode, "select * from sensor where sensor_ncode in (select b.nCode from sys_user_to_devcie b WHERE b.nCode=@ncode and b.user_name=@userName) ");
    }

    @Override
    public int getAquacultureSensorCount(String ncode) {
        Sql sql = Sqls.create("select count(1) from sensor where sensor_ncode in (select b.nCode from sys_user_to_devcie b WHERE b.nCode=@ncode and b.user_name=@userName) ");
        sql.params().set("ncode", ncode);
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        sql.params().set("userName", userName);

        sql.setCallback(Sqls.callback.integer());
        dao.execute(sql);
        return sql.getInt();
    }

    /**
     * 组态应用
     *
     * @param deviceNumber
     */
    @Override
    public void conditionTrigger(String deviceNumber, Map<String, SensorDataBean> conditionMap) {
        //根据设备查找匹配的触发规则。
        Sql sql = Sqls.create(" select b.* from sensor a ,condition_config b where a.sensor_ncode =@ncode and a.sensor_code=b.sensor_code  ");
        sql.params().set("ncode", deviceNumber);
        sql.setCallback(Sqls.callback.entities());
        sql.setEntity(dao.getEntity(ConditionConfigBean.class));
        dao.execute(sql);
        List<ConditionConfigBean> list = sql.getList(ConditionConfigBean.class);
        for (ConditionConfigBean condition : list) {

            //获取节点的实时数据
            String sensorCode = condition.getSensorCode();
            if (StringUtils.isBlank(condition.getCommand())) {
                log.error("节点:" + sensorCode + "指令为空");
                continue;
            }
            SensorDataBean sensorData = conditionMap.get(sensorCode);
            if (null == sensorData) {
                log.error("节点:" + sensorCode + "数据不存在");
                continue;
            }
            //根据节点的数据判断是否达到触发条件
            String eps = condition.getExpression();
            double value = condition.getValue();
            double sensorValue = sensorData.getSensorValue();
            boolean result = false;
            try {
                result = Boolean.parseBoolean(DynamicCalculation
                        .eval(sensorValue + eps + value).toString());
            } catch (ScriptException e) {
                log.error(e.getMessage(), e);
            }
            //对于达到触发条件的数据 ，执行预定义的指令。
            if (result) {
                String commands = condition.getCommand();
                String ncode = "";
                StringBuilder relayOrder = new StringBuilder();
                //解析指令。
                String[] arr = commands.split(",");
                for (String command : arr) {
                    String[] temp = command.split(":");
                    String code = temp[0];//节点编码
                    code = "0" + code.substring(code.length() - 1);
                    String sw = "0" + temp[1];//开关指令，0｜1
                    if (StringUtils.isBlank(ncode)) {
                        SensorTemplateBean s = dao.fetch(SensorTemplateBean.class, Cnd.where("sensor_code", "=", temp[0]));
                        ncode = s.getSensorNcode();
                    }
                    relayOrder.append(code).append(sw);
                    //记录指令
                    DeviceCommandBean deviceCommand = new DeviceCommandBean();
                    deviceCommand.setDeviceNumber(ncode);
                    deviceCommand.setCommand(1);
                    deviceCommand.setVal(sw);
                    deviceCommand.setDeviceType(2);//网络继电器
                    deviceCommand.setCreateTime(new Timestamp(System.currentTimeMillis()));
                    deviceCommand.setUserName(condition.getUserName());
                    dao.insert(deviceCommand);

                }
                //调用接口执行指令
                DeviceBean deviceBean = dao.fetch(DeviceBean.class, ncode);
                if (1 == deviceBean.getOnLineState()) {//设备在线
                    List<BasicNameValuePair> param = new ArrayList<>();
                    param.add(new BasicNameValuePair("deviceNumber", ncode));
                    param.add(new BasicNameValuePair("hexData", relayOrder.toString()));
                    HttpClientUtil.httpPost(Constant.Url.COMMAND_URL, param);
                }
            }
        }
    }

    @Override
    public ReturnObject delCondition(long id) {
        ReturnObject result = new ReturnObject();
        ConditionConfigBean configBean = dao.fetch(ConditionConfigBean.class, Cnd.where("id", "=", id).and("del", "=", 0));
        if (configBean == null) {
            result.setMsg("err80");//数据不存在
            return result;
        }
        configBean.setDel(1);
        configBean.setState(0);
        if (dao.update(configBean) > 0) {
            result.setSuccess(true);
            result.setMsg("success");
        } else {
            result.setMsg("error14");//删除失败
        }
        return result;
    }

    @Override
    public long getHistoryCount(String userName, String sensorCode) {
        Cnd cnd = Cnd.where("del", "=", 0);
        if (StringUtils.isNotBlank(sensorCode)) {
            cnd = cnd.and("sensor_code", "like", "%" + sensorCode + "%");
        }
        if (StringUtils.isNotBlank(userName)) {
            cnd = cnd.and("user_name", "=", userName);
        }
        return ControllerHelper.getInstance(dao).getCount("condition_config_history " + cnd.toString());
    }

    @Override
    public List<ConditionConfigHistoryBean> getHistoryList(Pager pager, String userName, String sensorCode) {
        Cnd cnd = Cnd.where("del", "=", 0);
        if (StringUtils.isNotBlank(sensorCode)) {
            cnd.and("sensor_code", "like", "%" + sensorCode + "%");
        }
        if (StringUtils.isNotBlank(userName)) {
            cnd.and("user_name", "=", userName);
        }
        return dao.query(ConditionConfigHistoryBean.class, cnd.desc("id"), pager);
    }

    @Override
    public void deleteHistory(Integer id) {
        Sql sql = Sqls.create("update condition_config_history set del=1 where id=@id");
        sql.params().set("id", id);
        dao.execute(sql);
    }
}
