package com.jxctdzkj.cloudplatform.utils;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

import javax.servlet.http.HttpServletRequest;

/**
 * <pre>
 *     author  : FlySand
 *     e-mail  : 1156183505@qq.com
 *     time    : 2018/7/31.
 *     desc    :
 * </pre>
 */
public class Utils extends com.jxctdzkj.support.utils.Utils {


    public static void main(String... args) throws Exception {
        String a = "<!DOCTYPE html>\n" +
                "<html xmlns:th=\"http://www.thymeleaf.org\">\n" +
                "<html>\n" +
                "<head>\n" +
                "    <meta charset=\"utf-8\">\n" +
                "    <title></title>\n" +
                "    <meta name=\"renderer\" content=\"webkit\">\n" +
                "    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge,chrome=1\">\n" +
                "    <meta name=\"viewport\\\" th:href=\\\"@{/static/layui/css/layui.css}\\\" media=\\\"all\\\">\\n\" +\n" +
                "                \"    <link rel=\\\"stylesheet\\\" th:href=\\\"@t\" content=\"width=device-width, initial-scale=1, maximum-scale=1\">\n" +
                "    <link rel=\"stylesheet\" th:href=\"@{/static/layui/css/layui.css}\" media=\"all\">\n" +
                "    <link rel=\"stylesheet\" th:href=\"@{/static/layui/myicon/iconfont.css}\">\n" +
                "    <link rel=\"stylesheet\" th:href=\"@{/static/layui/myicon/iconfont.css}\">\n" +
                "    <link rel=\"stylesheet\" th:href=\"@{/static/layui/myicon/iconfont.css}\">\n" +
                "    <link rel=\"stylesheet\" th:href=\"@{/static/layui/myicon/iconfont.css}\">\n" +
                "    <link rel=\"stylesheet\" th:href=\"@{/static/layui/myicon/iconfont.css}\">\n" +
                "    <link rel=\"stylesheet\" th:href=\"@{/static/layui/myicon/iconfont.css}\">\n" +
                "    <link rel=\"stylesheet\" th:href=\"@{/static/layui/myicon/iconfont.css}\">\n" +
                "    <link rel=\"stylesheet\" th:href=\"@{/static/layui/myicon/iconfont.css}\">\n" +
                "    <link rel=\"stylesheet\" th:href=\"@{/static/layui/myicon/iconfont.css}\">\n" +
                "    <link rel=\"stylesheet\" th:href=\"@{/static/layui/myicon/iconfont.css}\">\n" +
                "    <link rel=\"stylesheet\" th:href=\"@{/static/layui/myicon/iconfont.css}\">\n" +
                "    <link rel=\"stylesheet\" th:href=\"@{/static/layui/myicon/iconfont.css}\">\n" +
                "    <link rel=\"stylesheet\" th:href=\"@{/static/layui/myicon/iconfont.css}\">\n" +
                "    <link rel=\"stylesheet\" th:href=\"@{/static/layui/myicon/iconfont.css}\">\n" +
                "    <link rel=\"stylesheet\" th:href=\"@{/static/css/farmCommon.css}\">\n" +
                "           " +
                "</script>";
        byte[] zip = a.getBytes();
        System.out.println("压缩前：" + a.length() + "  > " + zip.length);
        byte[] zz = zip(zip);
        System.out.println("压缩后：" + new String(zz).length() + "  > " + zz.length);
        System.out.println(new String(zz));
        byte[] unzip = unZip(zz);
        System.out.println("解压后：" + unzip.length + "  > " + new String(unzip));

    }


    public static String getRemoteHost(javax.servlet.http.HttpServletRequest request) {
        String ip = request.getHeader("x-forwarded-for");
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return "0:0:0:0:0:0:0:1".equals(ip) ? "127.0.0.1" : ip;
    }

    public static String getRemortIP(HttpServletRequest request) {
        if (request.getHeader("x-forwarded-for") == null) {
            return request.getRemoteAddr();
        }
        return request.getHeader("x-forwarded-for");
    }

    public static String getMacAddress(String ip) {
        NetworkInterface ne = null;
        try {
            ne = NetworkInterface.getByInetAddress(InetAddress.getByName(ip));
            byte[] mac = ne.getHardwareAddress();
            String mac_s = hexByte(mac[0]) + ":" +
                    hexByte(mac[1]) + ":" +
                    hexByte(mac[2]) + ":" +
                    hexByte(mac[3]) + ":" +
                    hexByte(mac[4]) + ":" +
                    hexByte(mac[5]);
            return mac_s;
        } catch (SocketException e) {
            e.printStackTrace();
        } catch (UnknownHostException e) {
            e.printStackTrace();
        }
        return "";
    }

    private static String hexByte(byte b) {
        String s = Integer.toHexString(b & 0xFF);
        if (s.length() == 1) {
            return "0" + s;
        } else {
            return s;
        }
    }

    /**
     * 获取当年年份
     *
     * @return
     */
    public static Integer getCurrentYear() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
        Date date = new Date();
        return Integer.valueOf(sdf.format(date));
    }

    public static int crc16(byte[] data) {
        int crc = 0xffff;
        int dxs = 0xa001;
        int hibyte;
        int sbit;
        for (int i = 0; i < data.length; i++) {
            hibyte = crc >> 8;
            crc = hibyte ^ data[i];
            for (int j = 0; j < 8; j++) {
                sbit = crc & 0x0001;
                crc = crc >> 1;
                if (sbit == 1)
                    crc ^= dxs;
            }
        }
        return crc & 0xffff;
    }

    public static long getUnixMilliseconds(String timestamp) throws ParseException {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date date = format.parse(timestamp);
        return date.getTime();
    }

    public static String getTimestampStr(long timestamp) {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); //设置格式
        return format.format(timestamp);
    }

    public static byte[] zip(byte[] data) {
        if (data.length < 1024) {
            return data;
        }
        byte[] b = null;
        try {
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            ZipOutputStream zip = new ZipOutputStream(bos);
            ZipEntry entry = new ZipEntry("~~~1.bmp");
            entry.setSize(data.length);//返回条目数据的未压缩大小；如果未知，则返回 -1。
            zip.putNextEntry(entry);// 开始写入新的 ZIP 文件条目并将流定位到条目数据的开始处
            zip.write(data);//将字节数组写入当前 ZIP 条目数据。
            zip.closeEntry();
            zip.close();
            b = bos.toByteArray();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return b;

    }

    public static byte[] unZip(byte[] data) {
        byte[] b = null;
        try {
            ByteArrayInputStream bis = new ByteArrayInputStream(data);
            ZipInputStream zip = new ZipInputStream(bis);
            while (zip.getNextEntry() != null) {
                byte[] buf = new byte[1024];
                int num = -1;
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                while ((num = zip.read(buf, 0, buf.length)) != -1) {
                    baos.write(buf, 0, num);
                }
                b = baos.toByteArray();
                baos.flush();
                baos.close();
            }
            zip.close();
            bis.close();
            return b == null ? data : b;
        } catch (Exception ex) {
            ex.printStackTrace();
            return data;
        }

    }
}
