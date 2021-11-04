package com.jxctdzkj.cloudplatform.utils;

import com.jxctdzkj.cloudplatform.config.Constant;

import java.util.Properties;

import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

public class MailUtil {
    /**
     * 发送邮件
     * @param to 给谁发
     * @param subject 发送主题
     * @param text 发送内容
     */
    public static void send_mail(String to,String subject,String text) throws MessagingException {
        if (Constant.Project.SEND_EMIL == false) {
            return;
        }
        //创建连接对象 连接到邮件服务器
        Properties properties = new Properties();
        //设置发送邮件的基本参数
        //发送邮件服务器
        properties.put("mail.smtp.host", "smtp.qq.com");
        //发送端口
        properties.put("mail.smtp.port", "587");
        properties.put("mail.smtp.auth", "true");


        System.out.println("邮件发送完成");
    }
}
