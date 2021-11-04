package com.jxctdzkj.cloudplatform.utils;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.message.BasicNameValuePair;

import java.util.ArrayList;
import java.util.List;

/**
 * 百度翻译
 */
@Slf4j
public class TranslationUtils {

    public static final String BAI_DU_FAN_YI_APP_ID = "20190617000308066";
    public static final String BAI_DU_FAN_YI_SECRET_KEY = "vycpYkfKZ7X6lBon5y6N";
    // 源语言
    public static final String FROM = "auto";
    // 目标语言
    public static final String TO = "en";
    // 地址
    public static final String URL = "http://api.fanyi.baidu.com/api/trans/vip/translate";

    // 获取翻译
    public static String getTranslationStr(String queryStr) throws Exception {
        int salt = (int)(1+Math.random()*(10-1+1));
        String sign = getSign(queryStr, salt);
        List<BasicNameValuePair> params = new ArrayList<>();
        params.add(new BasicNameValuePair("q", queryStr));
        params.add(new BasicNameValuePair("from", FROM));
        params.add(new BasicNameValuePair("to", TO));
        params.add(new BasicNameValuePair("appid", BAI_DU_FAN_YI_APP_ID));
        params.add(new BasicNameValuePair("salt", String.valueOf(salt)));
        params.add(new BasicNameValuePair("sign", sign));
        String jsonString = HttpClientUtil.httpPost(URL, params);

        JSONObject jsonObject = JSONObject.parseObject(jsonString);
        String str1 = jsonObject.getString("trans_result");
        if(StringUtils.isBlank(str1)){
            return "";
        }
        JSONArray jArr = JSONArray.parseArray(str1);
        JSONObject jObj = jArr.getJSONObject(0);
        return jObj.getString("dst");
    }

    private static String getSign(String query, int salt){
        // appId + 翻译文字 + 随机数(整数) + secretKey
        return DigestUtils.md5Hex(BAI_DU_FAN_YI_APP_ID + query + salt + BAI_DU_FAN_YI_SECRET_KEY);
    }
}
