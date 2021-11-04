package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.ColDefine;
import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Comment;
import org.nutz.dao.entity.annotation.Default;
import org.nutz.dao.entity.annotation.Index;
import org.nutz.dao.entity.annotation.Table;
import org.nutz.dao.entity.annotation.TableIndexes;

@Table("condition_config")
@TableIndexes({@Index(name = "condition_sensor_code", fields = {"sensorCode"}, unique = false)})
public class ConditionConfigBean extends DBVO {
    @Column
    private String name;

    @Column("user_name")
    private String userName;

    @Column
    private String expression;

    @Column
    @ColDefine(customType = "DECIMAL(10,2)")
    private double value;

    @Column("Ncode")
    @Comment("设备号")
    @ColDefine(notNull = true)
    private String deviceNumber;

    @Column("sensor_code")
    private String sensorCode;

    @Column
    @Default("0")
    private int state;

    @Column
    @Default("0")
    private int del;

    @Column("to_device")
    private String toDevice;

    @Column
    private String command;

    private String password;

    public String getDeviceNumber() {
        return deviceNumber;
    }

    public void setDeviceNumber(String deviceNumber) {
        this.deviceNumber = deviceNumber;
    }

    public int getDel() {
        return del;
    }

    public void setDel(int del) {
        this.del = del;
    }

    public String getToDevice() {
        return toDevice;
    }

    public void setToDevice(String toDevice) {
        this.toDevice = toDevice;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getCommand() {
        return command;
    }

    public void setCommand(String command) {
        this.command = command;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getExpression() {
        return expression;
    }

    public void setExpression(String expression) {
        this.expression = expression;
    }

    public double getValue() {
        return value;
    }

    public void setValue(double value) {
        this.value = value;
    }

    public String getSensorCode() {
        return sensorCode;
    }

    public void setSensorCode(String sensorCode) {
        this.sensorCode = sensorCode;
    }

    public int getState() {
        return state;
    }

    public void setState(int state) {
        this.state = state;
    }
}
