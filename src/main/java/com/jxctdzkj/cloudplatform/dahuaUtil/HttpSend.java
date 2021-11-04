package com.jxctdzkj.cloudplatform.dahuaUtil;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.RequestEntity;
import org.apache.commons.httpclient.methods.StringRequestEntity;
import org.apache.commons.httpclient.params.HttpMethodParams;
import org.apache.commons.httpclient.protocol.Protocol;
import org.apache.commons.httpclient.protocol.ProtocolSocketFactory;
import org.apache.commons.io.IOUtils;

import java.io.InputStream;
import java.util.*;

@Slf4j
public class HttpSend {
    //乐橙域名
    private static String host = CONST.HOST;

    private static long time;

    //乐橙签名值，服务端用来做签名校验
    private static String sign;

    private static String ver = "1.0";

    private static String nonce = "169431af-9750-408d-a8ae-eb7d07f93c4e";

    private static String id = "12345";

    public static JSONObject HttpSendMethod(Map<String, Object> paramsMap, String method,String appId,String appSecret) {
        Map<String, Object> map = new HashMap<String, Object>();
        // 联调restful使用(CJ/220115)
        map = paramsInit(paramsMap,appId,appSecret);
        // 返回json
        JSONObject jsonObj = doPost(host + "/openapi/" + method, map);
        System.out.println("=============================");
        System.out.println("返回结果：" + jsonObj.toJSONString());
        return jsonObj;

    }

    public static JSONObject doPost(String url, Map<String, Object> map) {
        String json = JSON.toJSONString(map);
        ProtocolSocketFactory fcty = new MySecureProtocolSocketFactory();
        Protocol.registerProtocol("https", new Protocol("https", fcty, 8080));
        HttpClient client = new HttpClient();
        client.getParams().setParameter(HttpMethodParams.HTTP_CONTENT_CHARSET, "UTF-8");
        PostMethod method = new PostMethod(url);
        System.out.println(url);
        String restult = "";
        JSONObject jsonObject = new JSONObject();
        try {
            RequestEntity entity = new StringRequestEntity(json, "application/json", "UTF-8");
            method.setRequestEntity(entity);
            client.executeMethod(method);

            InputStream inputStream = method.getResponseBodyAsStream();
            restult = IOUtils.toString(inputStream, "UTF-8");
            jsonObject = JSONObject.parseObject(restult);
        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage(),e);
        } finally {
            method.releaseConnection();
        }
        return jsonObject;
    }

    protected static Map<String, Object> paramsInit(Map<String, Object> paramsMap,String appId,String appSecret) {
        Map<String, Object> map = new HashMap<String, Object>();
        time = System.currentTimeMillis() / 1000;
        //
        StringBuilder paramString = new StringBuilder();
        List<String> paramList = new ArrayList<String>();
        for (String key : paramsMap.keySet()) {
            String param = key + ":" + paramsMap.get(key);
            paramList.add(param);
        }
        /**
         * 为计算签名串，参数按照字母升序排列 第一步：计算“签名原始串 将params部分的deviceId、accessToken、userId、phone
         * 按字母升序排序，按逗号分割组成无空格字符串，并在字符串最后拼接time、nonce、appSecret， 第二步：计算MD5值
         */
        String[] params = paramList.toArray(new String[paramList.size()]);
        Arrays.sort(params);
        for (String param : params) {
            paramString.append(param).append(",");
        }
        paramString.append("time:").append(time).append(",");
        paramString.append("nonce:").append(nonce).append(",");
        paramString.append("appSecret:").append(appSecret);
        sign = null;
        // 计算MD5得值
        try {
            System.out.println("传入参数：" + paramString.toString().trim());
            System.out.println("sign值[" + paramString.toString().trim() + "]");
            sign = DigestUtils.md5Hex(paramString.toString().trim().getBytes("UTF-8"));
        } catch (Exception e) {
            e.printStackTrace();
        }
        Map<String, Object> systemMap = new HashMap<String, Object>();
        systemMap.put("ver", ver);
        systemMap.put("sign", sign);
        systemMap.put("appId", appId);
        systemMap.put("nonce", nonce);
        systemMap.put("time", time);
        map.put("system", systemMap);
        map.put("params", paramsMap);
        map.put("id", id);
        return map;
    }

    public static String getHost() {
        return host;
    }

    public static void setHost(String host) {
        HttpSend.host = host;
    }

    public static long getTime() {
        return time;
    }

    public static void setTime(long time) {
        HttpSend.time = time;
    }

    public static String getSign() {
        return sign;
    }

    public static void setSign(String sign) {
        HttpSend.sign = sign;
    }

    public static String getVer() {
        return ver;
    }

    public static void setVer(String ver) {
        HttpSend.ver = ver;
    }

    public static String getNonce() {
        return nonce;
    }

    public static void setNonce(String nonce) {
        HttpSend.nonce = nonce;
    }

    public static String getId() {
        return id;
    }

    public static void setId(String id) {
        HttpSend.id = id;
    }

}
