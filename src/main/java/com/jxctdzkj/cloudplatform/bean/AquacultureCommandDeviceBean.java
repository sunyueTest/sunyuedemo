package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.*;

import java.util.Date;

@Table("aquaculture_command_to_device")
public class AquacultureCommandDeviceBean extends DBVO {

    @ColDefine(notNull = true)
    @Column("user_name")
    private String userName;
    /**
     * 设备号
     */
    @Column("Ncode")
    @ColDefine(notNull = true)
    private String deviceNumber;
    @Column("device_type")
    @Comment("设备类型")
    @Default("0")
    private int deviceType;
    @Column
    @ColDefine(notNull = true)
    private String command;
    @Column
    @ColDefine(notNull = true)
    private String val;
    @Column("command_time")
    private Date commandTime;
    @Column("is_success")
    @Default("0")
    private int isSuccess;
    @Column("is_del")
    @Default("0")
    private int isDel;
    @Column("sensor_code")
    private String sensorCode;

    private String sensorName;

    public String getSensorName() {
        return sensorName;
    }

    public void setSensorName(String sensorName) {
        this.sensorName = sensorName;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getDeviceNumber() {
        return deviceNumber;
    }

    public void setDeviceNumber(String deviceNumber) {
        this.deviceNumber = deviceNumber;
    }

    public int getDeviceType() {
        return deviceType;
    }

    public void setDeviceType(int deviceType) {
        this.deviceType = deviceType;
    }

    public String getCommand() {
        return command;
    }

    public void setCommand(String command) {
        this.command = command;
    }

    public String getVal() {
        return val;
    }

    public void setVal(String val) {
        this.val = val;
    }

    public Date getCommandTime() {
        return commandTime;
    }

    public void setCommandTime(Date commandTime) {
        this.commandTime = commandTime;
    }

    public int getIsSuccess() {
        return isSuccess;
    }

    public void setIsSuccess(int isSuccess) {
        this.isSuccess = isSuccess;
    }

    public int getIsDel() {
        return isDel;
    }

    public void setIsDel(int isDel) {
        this.isDel = isDel;
    }

    public String getSensorCode() {
        return sensorCode;
    }

    public void setSensorCode(String sensorCode) {
        this.sensorCode = sensorCode;
    }
}
