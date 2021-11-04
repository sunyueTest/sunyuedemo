package com.jxctdzkj.cloudplatform.service.impl;

import com.jxctdzkj.cloudplatform.bean.NetDevicedata;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.radis.RedisUtil;
import com.jxctdzkj.cloudplatform.service.DeviceDataService;
import com.jxctdzkj.cloudplatform.service.GroupManageService;
import com.jxctdzkj.cloudplatform.utils.ReturnObject;
import com.jxctdzkj.cloudplatform.utils.SplitTableHelper;
import com.jxctdzkj.support.utils.Encrypt;
import lombok.extern.slf4j.Slf4j;
import org.nutz.dao.Cnd;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Slf4j
@Service
public class DeviceDataServiceImpl implements DeviceDataService {

    @Autowired
    GroupManageService groupManageService;

    /**
     * @param deviceNumber
     * @param count        个数
     * @param interval     间隔 ms
     * @return
     */
    @Override
    public ReturnObject selDeviceData(Timestamp startTime, String deviceNumber, int count, long interval) {
        String shiroKey = "";
        if (Constant.Redis.ENABLE == true) {
            String startTimeKey = startTime == null ? "" : startTime.toString().substring(0, startTime.toString().lastIndexOf(":"));
            shiroKey = Encrypt.e(startTimeKey + deviceNumber + count + interval + "selSVGforDataNew");
            log.info(shiroKey);
            ReturnObject returnObject = null;
            try {
                returnObject = RedisUtil.getInstance().getSaveObject(shiroKey);
                if (returnObject != null) {
                    log.info("获取缓存 ：" + returnObject);
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
                    if (list != null && size > k) {//防止下标越界异常
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
            /*取平均值*/
            if (selList.size() > 0) {
                for (int j = 0; j < size; j++) {
                    log.info(list.get(j) + " 总值：" + svg[i][j]);
                    svg[i][j] = svg[i][j] / selList.size();
                    log.info(list.get(j) + " 平均值：" + svg[i][j]);
                }
            }
        }
//        重组数据 23687419
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
            RedisUtil.getInstance().expire(shiroKey, 10 * 60 * 1000);//缓存10分钟
        }
        return result;
    }

}
