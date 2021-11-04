package com.jxctdzkj.cloudplatform.bean;

import com.jxctdzkj.support.utils.TextUtils;

import org.nutz.dao.entity.annotation.*;

import java.sql.Timestamp;

@Table("device_qrcode")
public class DeviceQrcodeBean extends DBVO {

    @Name
    @Column()
    private String code;

    @ColDefine(notNull = true)
    @Column("device_number")
    private String deviceNumber;

    @Column("create_time")
    private Timestamp createTime;

    @Column("is_del")
    @Default("0")
    private Integer isDel;


    public Integer getIsDel() {
        return isDel;
    }

    public void setIsDel(Integer isDel) {
        this.isDel = isDel;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDeviceNumber() {
        if (!TextUtils.isEmpty(deviceNumber)) {
            return deviceNumber.toUpperCase();
        } else {
            return deviceNumber;
        }
    }

    public void setDeviceNumber(String deviceNumber) {
        if (!TextUtils.isEmpty(deviceNumber)) {
            this.deviceNumber = deviceNumber.toUpperCase();
        } else {
            this.deviceNumber = deviceNumber;

        }
    }

    public Timestamp getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Timestamp createTime) {
        this.createTime = createTime;
    }
}
