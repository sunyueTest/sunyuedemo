package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Default;
import org.nutz.dao.entity.annotation.Table;

import java.sql.Timestamp;

@Table("timed_task_manage")
public class TimedTaskManageBean extends DBVO {

    // 任务名称
    @Column("task_name")
    private String taskName;

    // 设备编号
    @Column("device_number")
    private String deviceNumber;

    // 任务类型 1一次性任务 2每月任务 3每日任务
    @Column("task_type")
    private String taskType;

    // 年
    @Column("year")
    private Integer year;

    // 月
    @Column("month")
    private Integer month;

    // 日
    @Column("day")
    private Integer day;

    // 任务时间
    @Column("time")
    private String time;

    // 在一天当中是第多少秒
    @Column("seconds")
    private int seconds;

    // 指令
    @Column("command")
    private String command;

    // 创建时间
    @Column("create_time")
    private Timestamp createTime;

    // 创建人
    @Column("create_user")
    private String createUser;

    // 状态 1启用  0停用
    @Column("status")
    @Default("1")
    private String status;

    // 删除标识 1删除  0未删除
    @Column("delete_flag")
    @Default("0")
    private String deleteFlag;

    public int getSeconds() {
        return seconds;
    }

    public void setSeconds(int seconds) {
        this.seconds = seconds;
    }

    public String getDeleteFlag() {
        return deleteFlag;
    }

    public void setDeleteFlag(String deleteFlag) {
        this.deleteFlag = deleteFlag;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Timestamp getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Timestamp createTime) {
        this.createTime = createTime;
    }

    public String getCreateUser() {
        return createUser;
    }

    public void setCreateUser(String createUser) {
        this.createUser = createUser;
    }

    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public String getDeviceNumber() {
        return deviceNumber;
    }

    public void setDeviceNumber(String deviceNumber) {
        this.deviceNumber = deviceNumber;
    }

    public String getTaskType() {
        return taskType;
    }

    public void setTaskType(String taskType) {
        this.taskType = taskType;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    public Integer getDay() {
        return day;
    }

    public void setDay(Integer day) {
        this.day = day;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getCommand() {
        return command;
    }

    public void setCommand(String command) {
        this.command = command;
    }

    public TimedTaskManageBean(String taskName, String deviceNumber, String taskType, Integer year, Integer month, Integer day, String time, String command, Timestamp createTime, String createUser) {
        this.taskName = taskName;
        this.deviceNumber = deviceNumber;
        this.taskType = taskType;
        this.year = year;
        this.month = month;
        this.day = day;
        this.time = time;
        this.command = command;
        this.createTime = createTime;
        this.createUser = createUser;
    }

    public TimedTaskManageBean(){}
}