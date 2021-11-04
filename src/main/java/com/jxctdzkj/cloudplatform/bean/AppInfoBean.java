package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.ColDefine;
import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Name;
import org.nutz.dao.entity.annotation.Table;

/**
 * <pre>
 *     author  : FlySand
 *     e-mail  : 1156183505@qq.com
 *     time    : 2018/8/1.
 *     desc    :
 * </pre>
 */
@Table("app_info")
public class AppInfoBean extends DBVO {


    @Name
    @Column("app_name")
    private String appName;
    @Column("version_code")
    private String versionCode;
    /*-*
     * 更新提示
     */
    @Column("up_text")
    private String upText;
    /**
     * 0 不强制更新
     * 1 强制更新
     */
    @Column("is_update")
    private String isUpdate;
    @Column("down_link")
    @ColDefine(notNull = true, width = 1024)
    private String downLink;


    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }

    public String getVersionCode() {
        return versionCode;
    }

    public void setVersionCode(String versionCode) {
        this.versionCode = versionCode;
    }

    public String getUpText() {
        return upText;
    }

    public void setUpText(String upText) {
        this.upText = upText;
    }

    public String getIsUpdate() {
        return isUpdate;
    }

    public void setIsUpdate(String isUpdate) {
        this.isUpdate = isUpdate;
    }

    public String getDownLink() {
        return downLink;
    }

    public void setDownLink(String downLink) {
        this.downLink = downLink;
    }

    @Override
    public String toString() {
        return "AppInfoBean{" +
                "appName='" + appName + '\'' +
                ", versionCode='" + versionCode + '\'' +
                ", upText='" + upText + '\'' +
                ", isUpdate='" + isUpdate + '\'' +
                ", downLink='" + downLink + '\'' +
                '}';
    }
}
