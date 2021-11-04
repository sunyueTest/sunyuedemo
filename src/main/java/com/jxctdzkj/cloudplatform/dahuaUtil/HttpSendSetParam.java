package com.jxctdzkj.cloudplatform.dahuaUtil;

import com.alibaba.fastjson.JSONObject;
import com.jxctdzkj.cloudplatform.bean.Ys7TokenBean;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.exception.ServiceException;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;

import java.util.Map;
import java.util.UUID;

@Slf4j
public class HttpSendSetParam extends HttpSend  {

    private static Dao dao=SpringContextUtil.getBean("dao",Dao.class);


    public static JSONObject send(Map<String, Object> paramMap, String method) {

        HttpSend.setHost(CONST.HOST + ":" + CONST.PORT);
        // super.setTime(time);
        HttpSend.setVer("1.0");
        HttpSend.setNonce(UUID.randomUUID().toString());
        HttpSend.setId("12345");
        String userName = ControllerHelper.getLoginUserName();
        if (StringUtils.isBlank(userName) || "null".equals(userName)) {
            throw new ServiceException("用户未登录");
        }
        Ys7TokenBean secret = dao.fetch(Ys7TokenBean.class, Cnd.where("user_name", "=", userName).and("camera_type", "=", Constant.CameraType.DA_HUA));
        if (null == secret) {
            throw new ServiceException("用户appSecret为空");
        }
        return HttpSendMethod(paramMap, method, secret.getAppkey(), secret.getSecret());
    }


}
