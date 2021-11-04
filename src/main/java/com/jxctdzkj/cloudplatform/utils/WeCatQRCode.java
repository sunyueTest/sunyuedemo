package com.jxctdzkj.cloudplatform.utils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.jxctdzkj.cloudplatform.config.Constant;

import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpStatus;
import org.apache.http.StatusLine;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import java.io.File;

import javax.imageio.stream.FileImageOutputStream;

import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 *     @author  : FlySand
 *     @e-mail  : 1156183505@qq.com
 *     @time    : 2019/2/19.
 *     @desc    :
 * </pre>
 */
@Slf4j
public class WeCatQRCode {

    private volatile static WeCatQRCode instance;
    private String accessToken;
    private long expiresIn;

    private CloseableHttpClient client = HttpClients.createDefault();

    private WeCatQRCode() {
        init();
    }

    /**
     * 初始化方法，获取保存 access_token
     */
    private void init() {
        HttpGet httpGet = new HttpGet("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + Constant.Define.WECHAT_APPID + "&secret=" + Constant.Define.WECHAT_SECRET);// 创建httpPost
        httpGet.setHeader("Content-Type", "application/x-www-form-urlencoded");
        try {
            CloseableHttpResponse response = client.execute(httpGet);
            StatusLine status = response.getStatusLine();
            int state = status.getStatusCode();
            if (state == HttpStatus.SC_OK) {
                HttpEntity responseEntity = response.getEntity();
                String jsonString = EntityUtils.toString(responseEntity);
                System.out.println(jsonString);
//                {"errcode":40013,"errmsg":"invalid appid hint: [FiJm4a00021501]"}
                JSONObject json = JSON.parseObject(jsonString);
                System.out.println(json);
                if ((json).containsKey("access_token")) {
                    accessToken = json.getString("access_token");
                    expiresIn = json.getLong("expires_in");
//                    long delayTime = (expiresIn - 600) * 1000;
//                    if (delayTime <= 0) {
//                        delayTime = 30000;
//                    }
//                    new Timer().schedule(new TimerTask() {
//                        @Override
//                        public void run() {
//                            init();
//                        }
//                    }, delayTime);
                } else {
                    accessToken = null;
                    log.error(json.toString());
                }
            } else {
                log.info("state:" + state);
            }
        } catch (Exception e) {
            log.error(e.toString(), e);
        }
    }

    private File initAndGetcode(String scene) {
        init();
        return getCode(scene);
    }

    public static WeCatQRCode getInstance() {
        if (instance == null) {
            synchronized (WeCatQRCode.class) {
                if (instance == null) {
                    instance = new WeCatQRCode();
                }
            }
        }
        return instance;
    }

    public File getCode(String scene) {
        try {
            if (StringUtils.isEmpty(accessToken)) {
                init();
            }
            String url = "https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=" + accessToken;
            String param = "{\"scene\":\"" + scene + "\",\"width\":300}";
            CloseableHttpClient client = HttpClients.createDefault();
            StringEntity entity = new StringEntity(param);
            entity.setContentType("application/json");//**必须的
            HttpPost post = new HttpPost(url);
            post.setEntity(entity);
            CloseableHttpResponse response;
            response = client.execute(post);
            int state = response.getStatusLine().getStatusCode();
            if (state == HttpStatus.SC_OK) {
                StatusLine status = response.getStatusLine();
                System.out.println(status);
                HttpEntity responseEntity = response.getEntity();
                byte[] data = EntityUtils.toByteArray(responseEntity);
                try {
                    String responseStr = new String(data);
                    if (responseStr.contains("access_token expired")) {
                        return initAndGetcode(scene);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
                File file = File.createTempFile("qrcode", ".jpeg");
                FileImageOutputStream imageOutput = new FileImageOutputStream(file);
                imageOutput.write(data, 0, data.length);
                imageOutput.close();
                System.out.println(file.getAbsolutePath());
                System.out.println(responseEntity);
                return file;
            } else {
                log.info("state:" + state);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

}
