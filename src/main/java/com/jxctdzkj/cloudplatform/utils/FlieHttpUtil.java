package com.jxctdzkj.cloudplatform.utils;

import com.jxctdzkj.cloudplatform.config.Constant;

import org.apache.http.HttpEntity;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 *     @author  : FlySand
 *     @e-mail  : 1156183505@qq.com
 *     @time    : 2018/11/7.
 *     @desc    :
 * </pre>
 */
@Slf4j
public class FlieHttpUtil {


    public static String uploadFile(String uploadurl, MultipartFile file) {
        File f = null;
        try {
            String suffix = getExtensionName(file.getOriginalFilename());
            log.info("suffix:" + suffix);
            f = File.createTempFile("tmp", suffix);
            file.transferTo(f);
            f.deleteOnExit();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return uploadFile(uploadurl, f);
    }

    public static String uploadFile(String uploadurl, File file) {
        log.info("fileSize:" + file.length());
        if (file.length() > 1048576) {//
            throw new RuntimeException("文件大于1M");
        }
        HttpPost post = new HttpPost(uploadurl);
        FileBody bin = new FileBody(file);// 文件
        HttpEntity reqEntity = MultipartEntityBuilder.create()
                .addPart("file", bin).build();// 请求体. media为文件对于的key值
        post.setEntity(reqEntity);
        return executeRequest(post);
    }

    public static String deleteFile(String fileName) {
        HttpGet httpGet = new HttpGet(Constant.Url.FILE_DELETE_URL + "?fileName=" + fileName);
        return executeRequest(httpGet);
    }

    public static String executeRequest(HttpUriRequest request) {
        CloseableHttpClient client = HttpClients.createDefault();
        String responseContent = null; // 响应内容
        CloseableHttpResponse response = null;
        try {
            response = client.execute(request);
            int statusCode = response.getStatusLine().getStatusCode();
            System.out.println(statusCode);
            HttpEntity entity = response.getEntity();
            responseContent = EntityUtils.toString(entity, "UTF-8");
        } catch (ClientProtocolException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                if (response != null)
                    response.close();
            } catch (IOException e) {
                e.printStackTrace();
            } finally {
                try {
                    if (client != null)
                        client.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return responseContent;
    }


//    public static void main(String[] args) {
//        String result = uploadFile(Constant.Define.FILE_UPLOAD_URL, new File(
//                "c:/SangforServiceClient_2018827.log"));
//        System.out.println(result);
//    }

    /*
     * Java文件操作 获取文件扩展名
     *
     *  Created on: 2011-8-2
     *      Author: blueeagle
     */
    public static String getExtensionName(String filename) {
        if ((filename != null) && (filename.length() > 0)) {
            int dot = filename.lastIndexOf('.');
            if ((dot > -1) && (dot < (filename.length() - 1))) {
                return filename.substring(dot);
            }
        }
        return filename;
    }

    /*
     * Java文件操作 获取不带扩展名的文件名
     *
     *  Created on: 2011-8-2
     *      Author: blueeagle
     */
    public static String getFileNameNoEx(String filename) {
        if ((filename != null) && (filename.length() > 0)) {
            int dot = filename.lastIndexOf('.');
            if ((dot > -1) && (dot < (filename.length()))) {
                return filename.substring(0, dot);
            }
        }
        return filename;
    }
}
