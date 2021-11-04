package com.jxctdzkj.cloudplatform.service;

import com.aliyuncs.exceptions.ClientException;
import com.jxctdzkj.cloudplatform.utils.ResultObject;

import javax.mail.MessagingException;

public interface LoginService {

//    ResultObject loginCheck(String userName, String password);

    ResultObject loginCheck(String userName, String password, String cid);

    void autoLogin(String userName, String password);

    void getEmailCode(String email) throws MessagingException;

    void SendSms(String tel)throws ClientException;
}
