package com.jxctdzkj.cloudplatform.bean;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.jxctdzkj.support.utils.TextUtils;
import org.nutz.dao.entity.annotation.*;

import java.sql.Timestamp;

/**
 * <pre>
 *     author  : FlySand
 *     e-mail  : 1156183505@qq.com
 *     time    : 2018/8/2.
 *     desc    : 用户绑定的设备
 * </pre>
 */
@Comment("用户绑定的设备")
@Table("sys_user_to_devcie")
@JsonIgnoreProperties(value = {"isDel","devicePassword"})
@TableIndexes({@Index(name = "sys_user_to_devcie_user_name", fields = {"userName"}, unique = false),
        @Index(name = "sys_user_to_devcie_device_number", fields = {"deviceNumber"}, unique = false)})
public class UserDeviceBean extends DBVO {

    @Column("Ncode")
    private String deviceNumber;
    @Column("Npassword")
    private String devicePassword;
    @Column("user_name")
    private String userName;
    @Column("create_time")
    private Timestamp createTime;
    @Column("device_name")
    private String name;
    @Column
    @ColDefine(customType = "DECIMAL(10,4)")
    private double longitude;
    @Column
    @ColDefine(customType = "DECIMAL(10,4)")
    private double latitude;
    @Column("group_id")
    @Default("0")
    private long groupId;
    @Column("is_del")
    @Default("0")
    @Comment("是否删除")
    private int isDel;
    @Column("pond_id")
    private String pondId;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPondId() {
        return pondId;
    }

    public void setPondId(String pondId) {
        this.pondId = pondId;
    }

    public long getGroupId() {
        return groupId;
    }

    public void setGroupId(long groupId) {
        this.groupId = groupId;
    }

    public int getIsDel() {
        return isDel;
    }

    public void setIsDel(int isDel) {
        this.isDel = isDel;
    }


    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public String getDeviceName() {
        return name;
    }

    public void setDeviceName(String name) {
        this.name = name;
    }

    public String getDevicePassword() {
        return devicePassword;
    }

    public void setDevicePassword(String devicePassword) {
        this.devicePassword = devicePassword;
    }


    public String getDeviceNumber() {
        return deviceNumber;
    }

    public void setDeviceNumber(String deviceNumber) {
        if (!TextUtils.isEmpty(deviceNumber)) {
            this.deviceNumber = deviceNumber.toUpperCase();
        } else {
            this.deviceNumber = deviceNumber;
        }
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Timestamp getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Timestamp createTime) {
        this.createTime = createTime;
    }

    @Override
    public String toString() {
        return "UserDeviceBean{" +
                "id=" + id +
                ", name=" + name +
                ", deviceNumber=" + deviceNumber +
                ", devicePassword='" + devicePassword + '\'' +
                ", isDel='" + isDel + '\'' +
                ", userName='" + userName + '\'' +
                ", latitude='" + latitude + '\'' +
                ", longitude='" + longitude + '\'' +
                ", groupId='" + groupId + '\'' +
                ", createTime=" + createTime +
                '}';
    }
}
