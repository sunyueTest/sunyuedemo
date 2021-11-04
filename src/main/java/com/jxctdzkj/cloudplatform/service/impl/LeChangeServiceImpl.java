package com.jxctdzkj.cloudplatform.service.impl;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jxctdzkj.cloudplatform.bean.CameraBean;
import com.jxctdzkj.cloudplatform.bean.Ys7TokenBean;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.dahuaUtil.HttpSendSetParam;
import com.jxctdzkj.cloudplatform.exception.ServiceException;
import com.jxctdzkj.cloudplatform.service.LeChangeService;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.support.utils.TextUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class LeChangeServiceImpl implements LeChangeService {

    @Autowired
    Dao dao;

    @Override
    public String accessToken() {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        if (StringUtils.isBlank(userName)) {
            throw new ServiceException("用户未登录");
        }

        Ys7TokenBean ys7 = dao.fetch(Ys7TokenBean.class, Cnd.where("user_name", "=", userName).and("camera_type", "=", Constant.CameraType.DA_HUA));
        if (ys7 == null) {
            throw new ServiceException("请先绑定摄像头密钥");
        }

        if (ys7.getExpireTime() != null && ys7.getExpireTime().getTime() > System.currentTimeMillis() && !TextUtils.isEmpty(ys7.getAccessToken())) {
            return ys7.getAccessToken();
        }

        String method = "accessToken";
        JSONObject json = HttpSendSetParam.send(new HashMap<String, Object>(), method);
        JSONObject jsonResult = json.getJSONObject("result");
        String code = jsonResult.getString("code");
        if (!"0".equals(code)) {
            String msg = jsonResult.getString("msg");
            throw new ServiceException(msg);
        }
        JSONObject jsonData = jsonResult.getJSONObject("data");
        String token = jsonData.getString("accessToken");
        //设置大华的秘钥过期时间为7天
        ys7.setExpireTime(new Timestamp(System.currentTimeMillis() + 7 * 24 * 60 * 60 * 1000L));
        ys7.setAccessToken(token);
        try {
            dao.update(ys7);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return token;
    }

    @Override
    public void bindDevice(String deviceId, String code, String token) {
        String method = "bindDevice";
        Map params = new HashMap<String, Object>();
        params.put("deviceId", deviceId);
        params.put("code", code);
        params.put("token", token);
        JSONObject json = HttpSendSetParam.send(params, method);
        JSONObject jsonResult = json.getJSONObject("result");
        String resultCode = jsonResult.getString("code");
        if (!"0".equals(resultCode)) {
            String msg = jsonResult.getString("msg");
            log.error(msg);
            throw new ServiceException(msg);
        }
    }

    @Override
    public void unBindDevice(String deviceId, String token) {
        String method = "unBindDevice";
        Map params = new HashMap<String, Object>();
        params.put("deviceId", deviceId);
        params.put("token", token);
        JSONObject json = HttpSendSetParam.send(params, method);
        JSONObject jsonResult = json.getJSONObject("result");
        String resultCode = jsonResult.getString("code");
        if (!"0".equals(resultCode)) {
            String msg = jsonResult.getString("msg");
            log.error(msg);
            throw new ServiceException(msg);
        }
    }

    @Override
    public CameraBean getLiveStreamInfo(CameraBean cameraBean, String token) {
        //首先判断该摄像头信息是否过期，如果没有过期，从数据库直接读取信息;否则重新进行拉取，并更新数据库
        if (cameraBean.getExpireTime() != null && cameraBean.getExpireTime().getTime() > System.currentTimeMillis()) {
            return cameraBean;
        }

        String method = "getLiveStreamInfo";
        Map params = new HashMap<String, Object>();
        params.put("token", token);
        params.put("deviceId", cameraBean.getSerial());
        params.put("channelId", "0");
        JSONObject json = HttpSendSetParam.send(params, method);
        JSONObject jsonResult = json.getJSONObject("result");
        String resultCode = jsonResult.getString("code");
        if (!"0".equals(resultCode)) {
            String msg = jsonResult.getString("msg");
            log.error(msg);
            return null;
//            throw new ServiceException(msg);
        } else {
            JSONObject resultData = jsonResult.getJSONObject("data");
            JSONArray streamsArr = resultData.getJSONArray("streams");
            JSONObject hls = streamsArr.getJSONObject(0);
            cameraBean.setHlsHd(hls.getString("hls"));
            cameraBean.setExpireTime(new Timestamp(System.currentTimeMillis() + 7 * 24 * 60 * 60 * 1000L));
            try {
                dao.update(cameraBean);
            } catch (Exception e) {
                log.error(e.toString());
            }
            return cameraBean;
        }
    }

    @Override
    public String setDeviceSnap(String deviceId, String token) {
        String method = "setDeviceSnap";
        Map params = new HashMap<String, Object>();
        params.put("deviceId", deviceId);
        params.put("token", token);
        params.put("channelId", "0");
        params.put("encrypt", false);//是否加密
        JSONObject json = HttpSendSetParam.send(params, method);
        JSONObject jsonResult = json.getJSONObject("result");
        String resultCode = jsonResult.getString("code");
        if (!"0".equals(resultCode)) {
            String msg = jsonResult.getString("msg");
            log.error(msg);
            throw new ServiceException(msg);
        }
        JSONObject jsonData = jsonResult.getJSONObject("data");
        return jsonData.getString("url");
    }

    @Override
    public void controlPTZ(String deviceId, String token, String operation, Double h, Double v, Double z, String duration) {
        String method = "controlPTZ";
        Map params = new HashMap<String, Object>();
        params.put("deviceId", deviceId);
        params.put("channelId", "0");
        params.put("token", token);
        params.put("operation", operation);
        params.put("h", h);
        params.put("v", v);
        params.put("z", z);
        params.put("duration", duration);
        JSONObject json = HttpSendSetParam.send(params, method);
        JSONObject jsonResult = json.getJSONObject("result");
        String resultCode = jsonResult.getString("code");
        if (!"0".equals(resultCode)) {
            String msg = jsonResult.getString("msg");
            log.error(msg);
            throw new ServiceException(msg);
        }
    }

}
