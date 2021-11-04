package com.jxctdzkj.cloudplatform.bean;

import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.support.utils.Utils;
import lombok.ToString;
import org.nutz.dao.entity.annotation.*;

import java.sql.Timestamp;
import java.util.Calendar;

/**
 * <pre>
 *     @author  : FlySand
 *     @e-mail  : 1156183505@qq.com
 *     @time    : 2018/11/7.
 *     @desc    :
 * </pre>
 */
@Table("sys_user_info")
@ToString
public class SysUserInfoBean extends DBVO {

    @Name
    @Column("user_name")
    String userName;

    @Default("农服云")
    @Comment("系统名称")
    @Column("systematic")
    String systematic;

    @Comment("公司名称")
    @Column("company")
    @Default("中农服科技股份有限公司")
    String company;

    @Comment("logo")
    @Column("logo")
    String logo;

    @Comment("是否轮播")
    @Column("slideshow")
    int slideshow;

    @Comment("轮播间隔时间 毫秒")
    @Column("slideshow_time")
    int slideshowTime;

    @Column("login_path")
    private String loginPath;

    @Default("10")
    @Comment("短信剩余数量")
    @Column("sms_count")
    private int smsCount;

    @Default("0")
    @Comment("已发送数量")
    @Column("sms_send_num")
    private int smsSendCount;

    @Column("last_sms_time")
    private Timestamp lastSmsTime;

    @Column
    @Comment("小程序二维码")
    private String qrcode;

    @Default("0")
    @Comment("系统类型(大屏类型)")
    @Column("system_type")
    private String systemType;

    @Default("0")
    @Comment("主题类型")
    @Column("style")
    private int style;

    @Default("0")
    @Comment("系统设置 bit ")
    @Column("system_setting")
    private int systemSetting;

    @Default("600000")
    @Comment("大屏点移动间隔")
    @Column("monitor_interval_time")
    private int monitorIntervalTime = 600000;

    @Default("15")
    @Comment("大屏地图缩放级别")
    @Column("map_zoom")
    private int mapZoom;

    /**
     * 0是默认
     * 1隐藏小程序自定义，显示原来的
     * 2大屏
     */
    @Default("0")
    @Comment("主页显示类型")
    @Column("home_page_type")
    private String homePageType;

    /**
     * 目前用于中性管理是否可用
     */
    @Comment("中性管理到期时间 默认从注册日期开始180天")
    @Column("customization_flag")
    private Timestamp customizationFlag;

    /**
     * 农业政府平台企业表ID
     */
    @Comment("用户所属企业Id")
    @Column("entperprise_id")
    private long entperpriseId;

    public Timestamp getCustomizationFlag() {
        return customizationFlag;
    }

    public void setCustomizationFlag(Timestamp customizationFlag) {
        this.customizationFlag = customizationFlag;
    }

    public int getStyle() {
        return style;
    }

    public void setStyle(int style) {
        this.style = style;
    }

    public String getHomePageType() {
        return homePageType;
    }

    public void setHomePageType(String homePageType) {
        this.homePageType = homePageType;
    }

    public int getMapZoom() {
        return mapZoom;
    }

    public void setMapZoom(int mapZoom) {
        this.mapZoom = mapZoom;
    }

    public int getMonitorIntervalTime() {
        return monitorIntervalTime;
    }

    public void setMonitorIntervalTime(int monitorIntervalTime) {
        this.monitorIntervalTime = monitorIntervalTime;
    }

    public int getSystemSetting() {
        return systemSetting;
    }

    public void setSystemSetting(int systemSetting) {
        this.systemSetting = systemSetting;
    }

    public int getSmsSendCount() {
        return smsSendCount;
    }

    public void setSmsSendCount(int smsSendCount) {
        this.smsSendCount = smsSendCount;
    }

    public String getSystemType() {
        return systemType;
    }

    public void setSystemType(String systemType) {
        this.systemType = systemType;
    }

    public String getQrcode() {
        return qrcode;
    }

    public void setQrcode(String qrcode) {
        this.qrcode = qrcode;
    }

    public SysUserInfoBean() {
        this.smsCount = 10;
        Calendar c = Calendar.getInstance();
        c.setTime(Utils.getCurrentTimestamp());
        c.add(Calendar.DAY_OF_MONTH, Constant.Project.CUSTOMIZATION_TIME);
        this.customizationFlag = new Timestamp(c.getTime().getTime());
    }

    public Timestamp getLastSmsTime() {
        return lastSmsTime;
    }

    public void setLastSmsTime(Timestamp lastSmsTime) {
        this.lastSmsTime = lastSmsTime;
    }

    public int getSmsCount() {
        return smsCount;
    }


    public void setSmsCountReduce() {
        this.smsCount--;
    }

    public void setSmsCount(int smsCount) {
        this.smsCount = smsCount;
    }

    public String getLoginPath() {
        return loginPath;
    }

    public void setLoginPath(String loginPath) {
        this.loginPath = loginPath;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getSystematic() {
        return systematic;
    }

    public void setSystematic(String systematic) {
        this.systematic = systematic;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public int getSlideshow() {
        return slideshow;
    }

    public void setSlideshow(int slideshow) {
        this.slideshow = slideshow;
    }

    public int getSlideshowTime() {
        return slideshowTime;
    }

    public void setSlideshowTime(int slideshowTime) {
        this.slideshowTime = slideshowTime;
    }

    public long getEntperpriseId() {
        return entperpriseId;
    }

    public void setEntperpriseId(long entperpriseId) {
        this.entperpriseId = entperpriseId;
    }
}
