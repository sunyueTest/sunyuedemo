package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Default;
import org.nutz.dao.entity.annotation.Index;
import org.nutz.dao.entity.annotation.Table;
import org.nutz.dao.entity.annotation.TableIndexes;

import java.sql.Timestamp;

@Table("condition_config_history")
@TableIndexes({@Index(name = "condition_time", fields = {"time"}, unique = false),
        @Index(name = "condition_user_name", fields = {"userName"}, unique = false)})
public class ConditionConfigHistoryBean extends DBVO {

    @Column("user_name")
    private String userName;

    @Column
    private Timestamp time;

    @Column
    private String name;

    @Column
    private String expression;

    @Column("sensor_code")
    private String sensorCode;

    @Column("to_device")
    private String toDevice;

    @Column
    private String command;

    @Column
    private String result;

    @Column
    private String msg;

    @Column
    @Default("0")
    private int del;

    public String getToDevice() {
        return toDevice;
    }

    public void setToDevice(String toDevice) {
        this.toDevice = toDevice;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Timestamp getTime() {
        return time;
    }

    public void setTime(Timestamp time) {
        this.time = time;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getExpression() {
        return expression;
    }

    public void setExpression(String expression) {
        this.expression = expression;
    }

    public String getSensorCode() {
        return sensorCode;
    }

    public void setSensorCode(String sensorCode) {
        this.sensorCode = sensorCode;
    }

    public String getCommand() {
        return command;
    }

    public void setCommand(String command) {
        this.command = command;
    }

    public int getDel() {
        return del;
    }

    public void setDel(int del) {
        this.del = del;
    }
}
