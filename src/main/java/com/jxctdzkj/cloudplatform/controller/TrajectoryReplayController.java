package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.DeviceBean;
import com.jxctdzkj.cloudplatform.bean.NetDevicedata;
import com.jxctdzkj.cloudplatform.bean.SensorTemplateBean;
import com.jxctdzkj.cloudplatform.bean.SysUserBean;
import com.jxctdzkj.cloudplatform.bean.UserDeviceBean;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import com.jxctdzkj.cloudplatform.utils.SplitTableHelper;

import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.Cnd;
import org.nutz.dao.Condition;
import org.nutz.dao.Dao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Timestamp;
import java.text.DecimalFormat;
import java.util.List;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping({"trajectoryReplay"})
public class TrajectoryReplayController {

    @Autowired
    Dao dao;

    // 获取设备信息
    @RequestMapping(value = "/getDeviceInfo")
    @ResponseBody
    public ResultObject getDeviceInfo(String deviceNumber) {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        Cnd cnd = Cnd.where("Ncode", "=", deviceNumber);
        if (!(userBean.getLevel() <= Constant.Define.ROLE_0)) {//系统管理员显示所有设备
            cnd.and("user_name", "=", userBean.getUserName());
        }
        UserDeviceBean userDeviceBean = dao.fetch(UserDeviceBean.class, cnd);
        return userDeviceBean != null ? ResultObject.ok(userDeviceBean) : ResultObject.apiError("fail");
    }

    // 获取设备信息
    @RequestMapping(value = "/getTrajectoryByDate")
    @ResponseBody
    public ResultObject getTrajectoryByDate(String ncode, String startDate, String endDate) {
        Timestamp fromTime;
        Timestamp toTime;
        try {
            fromTime = Timestamp.valueOf(startDate);
        } catch (Exception e) {
            fromTime = new Timestamp(System.currentTimeMillis() - 1000 * 60 * 60 * 24);
            log.warn(e.getMessage());
        }
        try {
            toTime = Timestamp.valueOf(endDate);
        } catch (Exception e) {
            toTime = new Timestamp(System.currentTimeMillis());
            log.warn(e.getMessage());
        }
        Condition cnd = Cnd.where("Drecord_time", ">", fromTime).and("Drecord_time", "<", toTime).and("Dcode", "=", ncode).desc("Did");
        DeviceBean deviceBean = dao.fetch(DeviceBean.class, ncode);
        if (deviceBean == null) {
            return ResultObject.apiError("fail");
        }
        List<NetDevicedata> devicedata = SplitTableHelper.queryForDate(NetDevicedata.class, cnd, fromTime, toTime, 1, 10);
        double[][] resultArr = new double[devicedata.size()][];
        for (int i = 0; i < devicedata.size(); i++) {
            resultArr[i] = getAnalysisData(deviceBean.getType(), devicedata.get(i).getSensorData());
        }
        return ResultObject.ok(resultArr);
    }

    // 格式化数据
    private double[] getAnalysisData(String type, String value) {
        double[] res = new double[2];
        if (StringUtils.isEmpty(value)) {
            res[0] = 0;
            res[1] = 1;
            return res;
        }
        String[] types = {};
        if (!StringUtils.isEmpty(type)) {
            types = type.split("/");
        }
        String[] datas = value.split("\\|");
        String data = "";
        for (int j = 0; j < datas.length; j++) {
            if (types[j].trim().equals("经度") || types[j].trim().equals("纬度")) {
                if (types.length > j) {
                    data += datas[j].replace(" ", "");
                } else {
                    data += datas[j];
                }
                if (j < datas.length - 1) {
                    data += ",";
                }
            }
        }
        res[0] = Double.parseDouble(data.split(",")[0]);
        res[1] = Double.parseDouble(data.split(",")[1]);
//        res[0] = transformation(data.split(",")[0]);
//        res[1] = transformation(data.split(",")[1]);
        return res;
    }

    static DecimalFormat decimalFormat = new DecimalFormat("#######0.00000");

    public static void main(String[] args) {
//
        // addMarker(118.161032, 24.403164);
        System.out.println(transformation(118.161032 + ""));//118.26695
        System.out.println(transformation(24.403164 + ""));//24.66755
    }

    /**
     * Gps 点装换
     * <p>
     * http://www.gpsspg.com/maps.htm
     *
     * @param s
     * @return
     */
    public static double transformation(String s) {
        try {
            int du = (int) Double.parseDouble(s);
            String d = s.substring(s.indexOf('.') + 1);
            String fen = d.substring(0, 2);
            String m = d.substring(2, 3);
            String ml = d.substring(3, d.length());
            double miao = Double.parseDouble(m + "." + ml);
            double fe = Double.parseDouble(fen) + (miao / 60);
            double duu = Double.parseDouble(decimalFormat.format((fe / 60) + du));
            log.info(s + " > " + duu);
            return duu;
        } catch (Exception e) {
            log.info(e.toString());
            return Double.parseDouble(s);
        }
//        CoordinateConverter converter  = new CoordinateConverter();
//// CoordType.GPS 待转换坐标类型
//        converter.from(CoordType.GPS);
//// sourceLatLng待转换坐标点 LatLng类型
//        converter.coord(sourceLatLng);
//// 执行转换操作
//        LatLng desLatLng = converter.convert();
    }

    // 检查设备是否有经纬度
    @RequestMapping(value = "/checkDeviceHasLonLat")
    @ResponseBody
    public ResultObject checkDeviceHasLonLat(String deviceNumber) {
        List<SensorTemplateBean> list = dao.query(SensorTemplateBean.class, Cnd.where("sensor_ncode", "=", deviceNumber));
        for (int i = 0; i < list.size(); i++) {
            SensorTemplateBean bean = list.get(i);
            if (bean.getSensorType() == 51 || bean.getSensorType() == 50) {
                return ResultObject.ok("success");
            }
        }
        return ResultObject.apiError("fail");
    }
}
