package com.jxctdzkj.cloudplatform.mail;

import com.jxctdzkj.support.utils.TextUtils;

import org.apache.commons.mail.EmailAttachment;
import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.HtmlEmail;

import java.util.List;

import lombok.extern.slf4j.Slf4j;

/**
 * 发送邮件Util
 */
@Slf4j
public class MailUtil {
    //邮箱
    private static String mailServerHost = "smtp.qq.com";
    private static String mailSenderAddress = "jxctdzkj@foxmail.com";
    private static String mailSenderNick = "精讯云";
    private static String mailSenderUsername = "jxctdzkj@foxmail.com";
    private static String mailSenderPassword = "eannaahklwsqebbg";

    /**
     * 发送 邮件方法 (Html格式，支持附件)
     *
     * @return void
     */
    public static void sendEmail(MailInfo mailInfo) {

        try {
            HtmlEmail email = new HtmlEmail();
            // 配置信息
            email.setHostName(mailServerHost);
            email.setFrom(mailSenderAddress, mailSenderNick);
            email.setAuthentication(mailSenderUsername, mailSenderPassword);
            email.setCharset("UTF-8");
            email.setSubject(mailInfo.getSubject());
            email.setHtmlMsg(mailInfo.getContent());
            email.setSSLOnConnect(true);
            email.setSmtpPort(587);
            // 添加附件
            List<EmailAttachment> attachments = mailInfo.getAttachments();
            if (null != attachments && attachments.size() > 0) {
                for (int i = 0; i < attachments.size(); i++) {
                    email.attach(attachments.get(i));
                }
            }

            // 收件人
            email.addTo(mailInfo.getToAddress());
            if (!TextUtils.isEmpty(mailInfo.getCcAddress())) {
                // 抄送人
                email.addCc(mailInfo.getCcAddress());
            }
            if (!TextUtils.isEmpty(mailInfo.getBccAddress())) {
                //邮件模板 密送人
                email.addBcc(mailInfo.getBccAddress());
            }
            log.info("send:" + email.send());
            log.info("收件人：" + mailInfo.getToAddress() + "   邮件发送成功！");
        } catch (EmailException e) {
            e.printStackTrace();
            log.error("收件人：" + mailInfo.getToAddress() + e.toString(), e);
        }

    }
}