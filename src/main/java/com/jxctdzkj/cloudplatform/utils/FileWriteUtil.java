package com.jxctdzkj.cloudplatform.utils;

import sun.misc.BASE64Encoder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.net.URLEncoder;

public class FileWriteUtil {

    public static void writeXls(HttpSession session, HttpServletResponse response, HttpServletRequest request, String fileName) throws Exception {
        //--设置响应类型
        response.setContentType(session.getServletContext().getMimeType("xls"));
        //--设置响应类型
        response.setContentType("application/vnd.ms-excel");
        //--设置响应头信息（附件形式	PS：以标题为蓝本，拼接扩展名
        String agent = request.getHeader("User-Agent");
        if (agent.contains("MSIE")) {
            // IE浏览器
            response.setHeader("Content-Disposition", "attachment; fileName="+ URLEncoder.encode(fileName, "utf-8"));
        } else if (agent.contains("Firefox")) {
            // 火狐浏览器
            BASE64Encoder base64Encoder = new BASE64Encoder();
            response.setHeader("Content-Disposition", "attachment; fileName="+ "=?utf-8?B?" + base64Encoder.encode(fileName.getBytes("utf-8")) + "?=");
        } else {
            // 其它浏览器
            response.setHeader("Content-Disposition", "attachment; fileName="+ URLEncoder.encode(fileName, "UTF-8"));
        }
    }
}
