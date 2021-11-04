package com.jxctdzkj.cloudplatform.utils;

import com.jxctdzkj.cloudplatform.config.Constant;

import org.apache.http.message.BasicNameValuePair;
import org.nutz.dao.Cnd;

import java.util.ArrayList;
import java.util.List;

import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 *     @author  : FlySand
 *     @e-mail  : 1156183505@qq.com
 *     @time    : 2018/8/29.
 *     @desc    :
 * </pre>
 */
@Slf4j
public class SqlHelper {

    private static final String SECRET_KEY = "1BF9A78D";

    /**
     * 根据设备类型发送指令
     *
     * @param deviceNumber
     * @param command
     * @param userName
     * @param deviceType
     * @return
     */
    public static Object sendDeviceCommandByType(String deviceNumber, String command, String userName, int deviceType) {
        List<BasicNameValuePair> list = new ArrayList<>();
        list.add(new BasicNameValuePair("deviceNumber", deviceNumber));
        list.add(new BasicNameValuePair("secretKey", SECRET_KEY));
        list.add(new BasicNameValuePair("userName", userName));
        String cert = Long.toHexString(Long.parseLong(deviceNumber, 16) * 2 & 0xFFFF).toUpperCase();
        list.add(new BasicNameValuePair("cert", cert));

        if (deviceType == Constant.DeviceType.RELAY) {
            list.add(new BasicNameValuePair("hexData", command));
//            返回结果
            Object result = HttpClientUtil.httpPost(Constant.Url.COMMAND_URL, list);
            if (result != null) {
                return result;
            }
        } else if (deviceType == Constant.DeviceType.LORA_RELAY) {
            list.add(new BasicNameValuePair("hexData", command));
            Object result = HttpClientUtil.httpPost(Constant.Url.LORA_COMMAND_URL, list);
            if (result != null) {
                return result;
            }
        } else if (deviceType == Constant.DeviceType.DUST) {
            list.add(new BasicNameValuePair("body", command));
            Object result = HttpClientUtil.httpPost(Constant.Url.COMMAND_DUST_URL, list);
            if (result != null) {
                return result;
            }
        } else if (deviceType == Constant.DeviceType.LORA_WAN_RELAY) {
            list.add(new BasicNameValuePair("hexData", command));
            Object result = HttpClientUtil.httpPost(Constant.Url.LORA_WAN_COMMAND_URL, list);
            if (result != null) {
                return result;
            }
        }
        return ResultObject.apiError("fail");
    }

    public static Cnd getWhereOrCnd(String name, List<String> whreres) {
        Cnd cnd = null;
        for (int i = 0; i < whreres.size(); i++) {
            String temp = whreres.get(i);
            log.info("templete [" + i + "] = " + temp);
            if (i == 0) {
                cnd = Cnd.where(name, "=", temp);
            } else {
                cnd.or(name, "=", temp);
            }
        }
        return cnd;
    }

    public static Cnd getAndOrCnd(String name, Cnd cnd, List<String> whreres) {
        for (int i = 0; i < whreres.size(); i++) {
            String temp = whreres.get(i);
            log.info("templete [" + i + "] = " + temp);
            if (i == 0) {
                cnd.and(name, "=", temp);
            } else {
                cnd.or(name, "=", temp);
            }
        }
        return cnd;
    }
}
