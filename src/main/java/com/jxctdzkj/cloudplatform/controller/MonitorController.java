package com.jxctdzkj.cloudplatform.controller;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.jxctdzkj.cloudplatform.bean.ConfigBean;
import com.jxctdzkj.cloudplatform.bean.DeviceBean;
import com.jxctdzkj.cloudplatform.bean.NetDevicedata;
import com.jxctdzkj.cloudplatform.bean.SensorDataBean;
import com.jxctdzkj.cloudplatform.bean.SensorTemplateBean;
import com.jxctdzkj.cloudplatform.bean.SysUserInfoBean;
import com.jxctdzkj.cloudplatform.bean.SystemTypeBean;
import com.jxctdzkj.cloudplatform.bean.TriggerHistoryBean;
import com.jxctdzkj.cloudplatform.bean.UserDeviceBean;
import com.jxctdzkj.cloudplatform.bean.UserGroupBean;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.radis.RedisUtil;
import com.jxctdzkj.cloudplatform.service.DeviceDataService;
import com.jxctdzkj.cloudplatform.service.DeviceManageService;
import com.jxctdzkj.cloudplatform.service.GroupManageService;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.PrivatisationUtils;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import com.jxctdzkj.cloudplatform.utils.ReturnObject;
import com.jxctdzkj.cloudplatform.utils.SplitTableHelper;
import com.jxctdzkj.support.utils.Encrypt;
import com.jxctdzkj.support.utils.Utils;

import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.dao.sql.Sql;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.sql.Timestamp;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequestMapping({"monitor"})
public class MonitorController {

    @Autowired
    Dao dao;

    @Autowired
    GroupManageService groupManageService;

    @Autowired
    DeviceManageService deviceManageService;

    @Autowired
    DeviceDataService deviceDataService;


    @RequestMapping("")
    public ModelAndView monitor() {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        SysUserInfoBean userInfo;

        int userLevel = ControllerHelper.getInstance(dao).getLoginUserLevel();
        if (userLevel > Constant.Define.ROLE_1) {
            String parentUser = ControllerHelper.getInstance(dao).getLoginUser().getParentUser();
            userInfo = dao.fetch(SysUserInfoBean.class, Cnd.where("user_name", "=", parentUser));
        } else {
            userInfo = dao.fetch(SysUserInfoBean.class, Cnd.where("user_name", "=", userName));
        }
        if (userInfo == null) {
            return index();
        }
        // ???????????????
        userInfo = PrivatisationUtils.setPrivatisationInfo(userInfo);

        if ("3".equals(userInfo.getSystemType())) {
            return toAquacultureScreenForLine();
        }

        if ("41".equals(userInfo.getSystemType())) {
            return new ModelAndView(iconYanAn());
        }
        if ("43".equals(userInfo.getSystemType())) {
            return new ModelAndView(lowNewYanAnfarm());
        }
        if ("44".equals(userInfo.getSystemType())) {
            return new ModelAndView(bestLowNewYanAnfarm());
        }
        if ("45".equals(userInfo.getSystemType())) {
            return new ModelAndView(yanAnNewB());
        }
        if ("48".equals(userInfo.getSystemType())) {
            return new ModelAndView(yanAnNewC());
        }
        //if (configure != null) {
        //    return new ModelAndView("configure/page", "bean", new Configure(configure));
        //}
        SystemTypeBean systemTypeBean = dao.fetch(SystemTypeBean.class, userInfo.getSystemType());
        if (systemTypeBean == null || "monitor".startsWith(systemTypeBean.getPath())) {
            return index();
        }
        //data.put("level",user.getLevel());
        return new ModelAndView("monitor/" + systemTypeBean.getPath(), "data", userInfo);
    }

    public ModelAndView index() {
        //??????????????????
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        SysUserInfoBean userInfo;
        int userLevel = ControllerHelper.getInstance(dao).getLoginUserLevel();
        if (userLevel > Constant.Define.ROLE_1) {
            String parentUser = ControllerHelper.getInstance(dao).getLoginUser().getParentUser();
            userInfo = dao.fetch(SysUserInfoBean.class, Cnd.where("user_name", "=", parentUser));
        } else {
            userInfo = dao.fetch(SysUserInfoBean.class, Cnd.where("user_name", "=", userName));
        }
        if (null == userInfo) {
            userInfo = new SysUserInfoBean();
        }

        //????????????????????????????????????????????????????????????????????????
        Sql sql = Sqls.create(" SELECT * FROM trigger_alarm_history  a where exists (select b.ncode from sys_user_to_devcie b where a.ncode=b.ncode and a.user_name =b.user_name and b.user_name =@userName and is_del= 0 ) and a.is_del =0");
        sql.params().set("userName", userName);
        sql.setCallback(Sqls.callback.entities());
        sql.setEntity(dao.getEntity(TriggerHistoryBean.class));
        dao.execute(sql);
        List<TriggerHistoryBean> list = sql.getList(TriggerHistoryBean.class);
        //dao.query(TriggerHistoryBean.class,Cnd.where("user_name","=",userName).and("state","=",1).and("is_del","=",0).desc("alarm_time"),new Pager(1,20));
        // ???????????????
        userInfo = PrivatisationUtils.setPrivatisationInfo(userInfo);

        String company = StringUtils.isBlank(userInfo.getCompany()) ? "?????????????????????" : userInfo.getCompany();
        Map<String, Object> data = new HashMap<>(8);
        data.put("userInfo", userInfo);
        data.put("sysTime", System.currentTimeMillis());
        data.put("alarmList", list);
        data.put("company", company);
        //data.put("level",user.getLevel());
        return new ModelAndView("monitor", "data", data);
    }

    /**
     * ????????????2
     *
     * @return
     */
    @RequestMapping(value = "aquacultureScreenForLine")
    public ModelAndView toAquacultureScreenForLine() {
        HashMap<String, Object> map = new HashMap<>();

        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        SysUserInfoBean userInfoBean = dao.fetch(SysUserInfoBean.class, Cnd.where("user_name", "=", userName));
        if (userInfoBean == null) {
            userInfoBean = new SysUserInfoBean();
            userInfoBean.setUserName(userName);
            userInfoBean = dao.insert(userInfoBean);
        }

        // ????????????????????? ????????????
        map.put("interval_time", userInfoBean.getMonitorIntervalTime());

        // ??????????????????
        map.put("map_zoom", userInfoBean.getMapZoom());

        // ???????????? ????????????????????????
        if (userInfoBean != null) {

            // ???????????????
            userInfoBean = PrivatisationUtils.setPrivatisationInfo(userInfoBean);
            map.put("company", userInfoBean.getCompany());
        } else {
            // ????????????????????? "????????????"
            map.put("company", "????????????");
        }
        return new ModelAndView("monitor/aquacultureScreenForLine", "map", map);
    }

    @RequestMapping("/getTree")
    @ResponseBody
    public ReturnObject getTree() {
        ReturnObject result = new ReturnObject();
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        //???????????????????????????????????????????????????

        //List<UserGroupBean> rootList = groupManageService.getRootList(userName);
        //???????????????
        UserGroupBean root = new UserGroupBean();
        root.setType(0);
        root.setpId(-1);
        root.setId(0);
        root.setGroupName("?????????");
        root.setName("?????????");
        root.setUserName(userName);

        List<UserGroupBean> bodyList = groupManageService.getGroupList(userName);
        for (UserGroupBean b : bodyList) {
            b.setName(b.getGroupName());
        }
        List<UserDeviceBean> deviceList = groupManageService.getGroupDeviceList(userName);

        //List<UserGroupBean> otherList = new ArrayList<>();
        deviceList.forEach(device -> {
            UserGroupBean group = new UserGroupBean();
            group.setId(device.getId() + 9999);
            group.setGroupName(device.getDeviceName());
            group.setName(device.getDeviceName());
            group.setType(1);//????????????
            group.setpId(device.getGroupId());
            group.setDeviceNumber(device.getDeviceNumber());
            bodyList.add(group);
        });
        //bodyList.addAll(otherList);
        Map<String, String> map = Maps.newHashMapWithExpectedSize(bodyList.size());
        getChild(root, map, bodyList);
        result.setData(root.getChildren());
        return result;
    }

    private void getChild(UserGroupBean beanTree, Map<String, String> map, List<UserGroupBean> bodyList) {
        List<UserGroupBean> childList = Lists.newArrayList();
        bodyList.stream()
                .filter(c -> !map.containsKey(c.getId()))
                .filter(c -> c.getpId() == (beanTree.getId()))
                .forEach(c -> {
                    map.put(c.getId() + "", c.getpId() + "");
                    getChild(c, map, bodyList);
                    childList.add(c);
                });
        beanTree.setChildren(childList);
    }

    /**
     * ???????????????????????????
     *
     * @param deviceNumber
     * @return
     */
    @RequestMapping("/getSensorForMonth")
    @ResponseBody
    public ReturnObject getSensorForMonth(String deviceNumber) {
        return selSVGforData(new Timestamp(System.currentTimeMillis()), deviceNumber, 30, 24 * 1000 * 60 * 60);
    }

    /**
     * ??????24??????????????????
     *
     * @param deviceNumber
     * @return
     */

    @RequestMapping("/getSensorReport")
    @ResponseBody
    public ReturnObject getSensorReport(String deviceNumber) {
        return selSVGforData(new Timestamp(System.currentTimeMillis()), deviceNumber, 24, 1000 * 60 * 60);
    }

    /**
     * ?????????????????????
     * {
     * 1-??????PH:{sensorType:"62",data:[...]},
     * 2-?????????:{sensorType:"117",data:[...]},
     * 3-????????????:{sensorType:"111",data:[...]},
     * ...
     * }
     *
     * @param deviceNumber
     * @return
     */
    @RequestMapping("/getSensorReportNew")
    @ResponseBody
    public ReturnObject getSensorReportNew(String deviceNumber) {
        return deviceDataService.selDeviceData(new Timestamp(System.currentTimeMillis()), deviceNumber, 24, 1000 * 60 * 60);
    }


    /**
     * ?????????????????????????????????
     *
     * @param deviceNumber
     * @return
     */
    @RequestMapping("/getSensorCustomReport")
    @ResponseBody
    public ReturnObject getSensorCustomReport(String startTime, String endTime, String deviceNumber) {
        Timestamp start = null;
        try {
            start = Timestamp.valueOf(startTime);
        } catch (Exception e) {
            e.printStackTrace();
        }
        Timestamp end = null;
        try {
            end = Timestamp.valueOf(endTime);
        } catch (Exception e) {
            e.printStackTrace();
        }
        if (start == null || end == null || end.getTime() < start.getTime()) {
            ReturnObject returnObject = new ReturnObject();
            returnObject.setSuccess(false);
            returnObject.setMsg("????????????");
            return returnObject;
        }
        long et = (end.getTime() - start.getTime());
        log.info(Utils.getTimeFormatDay(et));
        int count = (int) (et / 24 / 60 / 60 / 1000l);
        if (count <= 0) {
            count = 1;
        }
        if (count > 30) {
            count = 30;
        }
        return selSVGforData(end, deviceNumber, count, 24 * 1000 * 60 * 60);
    }


    /**
     * @param deviceNumber
     * @param count        ??????
     * @param interval     ?????? ms
     * @return
     */
    private ReturnObject selSVGforData(Timestamp startTime, String deviceNumber, int count, long interval) {
        String shiroKey = "";
        if (Constant.Redis.ENABLE == true) {
            String startTimeKey = startTime == null ? "" : startTime.toString().substring(0, startTime.toString().lastIndexOf(":"));
            shiroKey = Encrypt.e(startTimeKey + deviceNumber + count + interval);
            log.info(shiroKey);
            ReturnObject returnObject = null;
            try {
                returnObject = RedisUtil.getInstance().getSaveObject(shiroKey);
                if (returnObject != null) {
                    log.info("???????????? ???" + returnObject);
                    return returnObject;
                }
            } catch (Exception e) {
                log.error(e.toString(), e);
            }
        }

        ReturnObject result = new ReturnObject();
        List<String> list = groupManageService.getSensorType(deviceNumber);
        int size = list.size();
        if (list == null || size == 0) {
            result.setMsg("err83");
            result.setSuccess(false);
            return result;
        }
        Map<String, Object> map = new HashMap<>();
        map.put("type", list);

        long currentTime = startTime.getTime();
        float[][] svg = new float[count][size];
        for (int i = 0; i < count; i++) {
            startTime = new Timestamp(currentTime - interval * (i + 1));
            Timestamp endTime = new Timestamp(currentTime - interval * i);
            Cnd cnd = Cnd.where("Drecord_time", ">", startTime).and("Drecord_time", "<", endTime).and("Dcode", "=", deviceNumber);
//            log.info("cnd:" + cnd.toString());
            List<NetDevicedata> selList = SplitTableHelper.queryForDate(NetDevicedata.class, cnd, startTime, endTime, 1, 10);
            for (NetDevicedata data : selList) {
//                log.info(i + ":" + data.getSensorData());
                String[] dataArr = data.getSensorData().split("\\|");
                for (int k = 0; k < dataArr.length; k++) {
                    if (list != null && size > k) {//????????????????????????
                        String[] sdataArr = dataArr[k].trim().split(" ");
                        float cur = 0;
                        try {
                            cur = Float.valueOf(sdataArr[0]);
                        } catch (Exception e) {
//                            log.error(e.toString());
                        }
                        svg[i][k] += cur;
                    }
                }
            }
            log.info("selList:" + selList.size());
            /*????????????*/
            if (selList.size() > 0) {
                for (int j = 0; j < size; j++) {
                    log.info(list.get(j) + " ?????????" + svg[i][j]);
                    svg[i][j] = svg[i][j] / selList.size();
                    log.info(list.get(j) + " ????????????" + svg[i][j]);
                }
            }
        }
//        ???????????? 23687419
        float[][] svgResult = new float[size][count];
        for (int i = 0; i < count; i++) {
            for (int j = 0; j < size; j++) {
                svgResult[j][i] = svg[i][j];
            }
        }
        for (int i = 0; i < size; i++) {
            List<String> svgList = new ArrayList<>();
            for (int k = count - 1; k >= 0; k--) {
                svgList.add(String.format("%.2f", svgResult[i][k]));
            }
            map.put(list.get(i), svgList);
        }
        result.setSuccess(true);
        result.setData(map);
        if (Constant.Redis.ENABLE == true) {
            RedisUtil.getInstance().saveObject(shiroKey, result);
            RedisUtil.getInstance().expire(shiroKey, 10 * 60 * 1000);//??????10??????
        }
        return result;
    }

    /**
     * @param deviceNumber
     * @param count        ??????
     * @param interval     ?????? ms
     * @return
     */
    @ResponseBody
    @RequestMapping("selSVGforDataNew")
    public ReturnObject selSVGforDataNew(Timestamp startTime, String deviceNumber, int count, long interval) {
        String shiroKey = "";
        if (Constant.Redis.ENABLE == true) {
            String startTimeKey = startTime == null ? "" : startTime.toString().substring(0, startTime.toString().lastIndexOf(":"));
            shiroKey = Encrypt.e(startTimeKey + deviceNumber + count + interval + "selSVGforDataNew");
            log.info(shiroKey);
            ReturnObject returnObject = null;
            try {
                returnObject = RedisUtil.getInstance().getSaveObject(shiroKey);
                if (returnObject != null) {
                    log.info("???????????? ???" + returnObject);
                    return returnObject;
                }
            } catch (Exception e) {
                log.error(e.toString(), e);
            }
        }

        ReturnObject result = new ReturnObject();
        List<String> list = groupManageService.getSensorType(deviceNumber);
        int size = list.size();
        if (list == null || size == 0) {
            result.setMsg("err83");
            result.setSuccess(false);
            return result;
        }
        Map<String, Object> map = new HashMap<>();

        List<String> sensorTypeList = groupManageService.getSensorTypeId(deviceNumber);
        if (sensorTypeList == null || size == 0) {
            result.setMsg("err83");
            result.setSuccess(false);
            return result;
        }

        long currentTime = startTime.getTime();
        float[][] svg = new float[count][size];
        for (int i = 0; i < count; i++) {
            startTime = new Timestamp(currentTime - interval * (i + 1));
            Timestamp endTime = new Timestamp(currentTime - interval * i);
            Cnd cnd = Cnd.where("Drecord_time", ">", startTime).and("Drecord_time", "<", endTime).and("Dcode", "=", deviceNumber);
//            log.info("cnd:" + cnd.toString());
            List<NetDevicedata> selList = SplitTableHelper.queryForDate(NetDevicedata.class, cnd, startTime, endTime, 1, 10);
            for (NetDevicedata data : selList) {
//                log.info(i + ":" + data.getSensorData());
                String[] dataArr = data.getSensorData().split("\\|");
                for (int k = 0; k < dataArr.length; k++) {
                    if (list != null && size > k) {//????????????????????????
                        String[] sdataArr = dataArr[k].trim().split(" ");
                        float cur = 0;
                        try {
                            cur = Float.valueOf(sdataArr[0]);
                        } catch (Exception e) {
//                            log.error(e.toString());
                        }
                        svg[i][k] += cur;
                    }
                }
            }
            log.info("selList:" + selList.size());
            /*????????????*/
            if (selList.size() > 0) {
                for (int j = 0; j < size; j++) {
                    log.info(list.get(j) + " ?????????" + svg[i][j]);
                    svg[i][j] = svg[i][j] / selList.size();
                    log.info(list.get(j) + " ????????????" + svg[i][j]);
                }
            }
        }
//        ???????????? 23687419
        float[][] svgResult = new float[size][count];
        for (int i = 0; i < count; i++) {
            for (int j = 0; j < size; j++) {
                svgResult[j][i] = svg[i][j];
            }
        }
        for (int i = 0; i < size; i++) {
            List<String> svgList = new ArrayList<>();
            for (int k = count - 1; k >= 0; k--) {
                svgList.add(String.format("%.2f", svgResult[i][k]));
            }
            HashMap data = new HashMap();
            data.put("sensorType", sensorTypeList.get(i));
            data.put("data", svgList);
            map.put(list.get(i), data);
        }
        result.setSuccess(true);
        result.setData(map);
        if (Constant.Redis.ENABLE == true) {
            RedisUtil.getInstance().saveObject(shiroKey, result);
            RedisUtil.getInstance().expire(shiroKey, 10 * 60 * 1000);//??????10??????
        }
        return result;
    }

    @RequestMapping("/getSensorData")
    @ResponseBody
    public ReturnObject getSensorData(String deviceNumber) {
        ReturnObject result = new ReturnObject();
        DeviceBean device = groupManageService.getDeviceData(deviceNumber);//network?????????
        List<String> list = groupManageService.getSensorType(deviceNumber);
        //String typeStr = device==null?null:device.getType();//
        if (list == null || list.size() == 0) {
            result.setSuccess(false);
            result.setMsg("err83");
            return result;
        }
        String dataStr = device.getData();
        //String[] typeArr=typeStr.split("/");
        String[] dataArr = dataStr.split("\\|");
        Map<String, Object> data = new HashMap<>();
        data.put("type", list);
        data.put("data", dataArr);
        result.setSuccess(true);
        result.setData(data);
        return result;

    }

    @RequestMapping("/getDeviceList")
    @ResponseBody
    public ReturnObject getDeviceList(
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "100") int size) {
        ReturnObject result = new ReturnObject();
        List<UserDeviceBean> data = deviceManageService.getDeviceStatic(page, size);
        result.setData(data);
        result.setLast(data.size() < size);
        result.setSuccess(true);
        return result;
    }

    @RequestMapping("/showHistory")
    public String showHistory() {
        return "historyGraphs";
    }

    @RequestMapping("/dataAnalysis")
    public Object dataAnalysis(@RequestParam String deviceNumber, RedirectAttributes attr) {
        attr.addFlashAttribute("deviceNumber", deviceNumber);
        return "redirect:dataAnalysisForDevice";
    }

    @RequestMapping("/dataAnalysisForDevice")
    public Object dataAnalysisForDevice() {
        return "dataAnalysis";
    }

    @RequestMapping("/getDeviceSelect")
    @ResponseBody
    public ReturnObject getDeviceSelect() {
        ReturnObject result = new ReturnObject();
        List<UserDeviceBean> list = deviceManageService.getDeviceSelect();
        result.setSuccess(true);
        result.setData(list);
        return result;
    }

    @RequestMapping("/getSensorSelect")
    @ResponseBody
    public ReturnObject getSensorSelect(String deviceNumber) {
        ReturnObject result = new ReturnObject();
        List<SensorTemplateBean> list = deviceManageService.getSensorSelect(deviceNumber);
        result.setSuccess(true);
        result.setData(list);
        return result;
    }

    @RequestMapping("/getHistoryData")
    @ResponseBody
    public ReturnObject getHistoryData(String sensorCode, Timestamp from, Timestamp to) {
        ReturnObject result = new ReturnObject();
        Map<String, Object> map = new HashMap<>(4);
        //sensorCode = "337250C422291";
        List<SensorDataBean> data = deviceManageService.getHistoryData(sensorCode, from, to);
        List<Object> x = new LinkedList<>();
        List<Object> y = new LinkedList<>();
        data.forEach(sensorDataBean -> {
            x.add(sensorDataBean.getRecordTime());
            DecimalFormat df = new DecimalFormat("#.00");
            y.add(df.format(sensorDataBean.getSensorValue()));
        });
        map.put("x", x);
        map.put("y", y);
        result.setData(map);
        result.setSuccess(true);
        return result;
    }

    @RequestMapping("/getDeviceReport")
    @ResponseBody
    public ReturnObject getDeviceReport() {
        ReturnObject result = new ReturnObject();
        Map<String, Object> data = deviceManageService.getDeviceReport();
        result.setSuccess(true);
        result.setData(data);
        return result;
    }

    @RequestMapping("/alarmHistory")
    public String alarmHistory() {

        return "alarmHistory";
    }

    /**
     * ????????????-??????????????????????????????-?????????????????????n?????????n?????????
     *
     * @param deviceNumber
     * @return
     */
    @RequestMapping("/getSensorDataByDayCount")
    @ResponseBody
    public ReturnObject getSensorDataByDayCount(String deviceNumber, int dayCount) {
        ReturnObject result = new ReturnObject();
        List<String> list = groupManageService.getSensorType(deviceNumber);
        if (list == null || list.size() == 0) {
            result.setMsg("err83");
            result.setSuccess(false);
            return result;
        }
        Map<String, Object> map = new HashMap<>();
        map.put("type", list);
        for (String type : list) {
            map.put(type, new ArrayList<String>());
        }

        List<NetDevicedata> data = groupManageService.getSensorDataByDayCount(deviceNumber, dayCount);
        for (NetDevicedata devicedata : data) {
            String[] dataArr = devicedata.getSensorData().split("\\|");
            for (int i = 0; i < dataArr.length; i++) {
                if (list != null && list.size() > i) {//????????????????????????
                    List<String> sdata = (List<String>) map.get(list.get(i));
                    String[] sdataArr = dataArr[i].trim().split(" ");
                    sdata.add(sdataArr[0]);
                }

            }
        }
        result.setData(map);
        return result;
    }


    /**
     * ????????????-??????????????????????????????-?????????????????????n?????????n?????????
     *
     * @param deviceNumber
     * @return
     */
    @RequestMapping("/getSensorDataByDayCountNew")
    @ResponseBody
    public ResultObject getSensorDataByDayCountNew(String deviceNumber, int dayCount) {
        List<String> list = groupManageService.getSensorType(deviceNumber);
        if (list == null || list.size() == 0) {
            return ResultObject.apiError("err83");
        }
        Map<String, Object> map = new HashMap<>();
        map.put("type", list);
        for (String type : list) {
            map.put(type, new ArrayList<String>());
        }

        List<NetDevicedata> data = groupManageService.getSensorDataByDayCount(deviceNumber, dayCount);
        for (NetDevicedata devicedata : data) {
            String[] dataArr = devicedata.getSensorData().split("\\|");
            for (int i = 0; i < dataArr.length; i++) {
                if (list != null && list.size() > i) {//????????????????????????
                    List<String> sdata = (List<String>) map.get(list.get(i));
                    String[] sdataArr = dataArr[i].trim().split(" ");
                    sdata.add(sdataArr[0]);
                }

            }
        }
        return ResultObject.ok().data(map);
    }

    /**
     * ????????????
     *
     * @return
     */
    @RequestMapping(value = "toAquacultureScreen")
    public ModelAndView toAquacultureScreen() {
        ConfigBean bean = dao.fetch(ConfigBean.class, Cnd.where("id", "=", 10));
        return new ModelAndView("aquaculture/aquacultureScreen", "interval_time", bean.getConfigValue());
    }

    /**
     * ???????????????????????????????????????
     *
     * @return
     */
    @RequestMapping(value = "iconYanAn")
    public String iconYanAn() {
        return "redirect:newYanAnfarm/index.html";
    }

    /**
     * ???????????????????????????????????????--?????????
     *
     * @return
     */
    @RequestMapping(value = "lowNewYanAnfarm")
    public String lowNewYanAnfarm() {
        return "redirect:lowNewYanAnfarm/index.html";
    }

    /**
     * ???????????????????????????????????????--?????????
     *
     * @return
     */
    @RequestMapping(value = "bestLowNewYanAnfarm")
    public String bestLowNewYanAnfarm() {
        return "redirect:bestLowNewYanAnfarm/index.html";
    }

    /**
     * ???????????????????????????????????????--??????
     *
     * @return
     */
    @RequestMapping(value = "yanAnNewB")
    public String yanAnNewB() {
        return "redirect:yanAnNewB/index.html";
    }

    /**
     * ???????????????????????????????????????--??????c
     *
     * @return
     */
    @RequestMapping(value = "yanAnNewC")
    public String yanAnNewC() {
        return "redirect:yanAnNewC/index.html";
    }

    /**
     * ????????????????????????????????????
     *
     * @return
     */
    @RequestMapping(value = "meteorologicalWarning")
    public ModelAndView meteorologicalWarning() {
        return new ModelAndView("monitor/meteorologicalWarning");
    }
}
