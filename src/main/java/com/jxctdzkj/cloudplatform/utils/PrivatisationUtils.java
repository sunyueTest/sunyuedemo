package com.jxctdzkj.cloudplatform.utils;

import com.jxctdzkj.cloudplatform.bean.SysUserInfoBean;
import com.jxctdzkj.cloudplatform.config.Constant;

/**
 * 私有化部署部分配置
 * 2019年6月20日16:23:47 weihp
 */
public class PrivatisationUtils {

    /**
     * 更改用户配置
     * weihp 2019年6月20日16:23:52
     * @param userInfoBean
     * @return
     */
    public static SysUserInfoBean setPrivatisationInfo(SysUserInfoBean userInfoBean){
        if(Constant.Privatisation.PRIVATISATION){
            userInfoBean.setCompany(Constant.Privatisation.COMPANY_NAME);
            userInfoBean.setSystematic(Constant.Privatisation.SYSTEM_NAME);
            userInfoBean.setLogo(Constant.Privatisation.COMPANY_LOGO_URL);
        }
        return userInfoBean;
    }
}
