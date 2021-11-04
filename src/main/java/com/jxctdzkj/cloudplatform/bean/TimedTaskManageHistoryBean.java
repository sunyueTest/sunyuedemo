package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Table;

import java.sql.Timestamp;

@Table("timed_task_manage_history")
public class TimedTaskManageHistoryBean extends DBVO {
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

    // 指令
    @Column("command")
    private String command;

    // 任务执行时间
    @Column("task_time")
    private Timestamp taskTime;

    // 任务执行状态
    @Column("task_status")
    private String taskStatus;

    // 删除标识 1删除  0未删除
    @Column("delete_flag")
    private String deleteFlag;

    // 创建人
    @Column("create_user")
    private String createUser;

    // 任务执行记录
    @Column("task_record")
    private String task_record;

    public String getTask_record() {
        return task_record;
    }

    public void setTask_record(String task_record) {
        this.task_record = task_record;
    }

    public String getCreateUser() {
        return createUser;
    }

    public void setCreateUser(String createUser) {
        this.createUser = createUser;
    }

    public Timestamp getTaskTime() {
        return taskTime;
    }

    public void setTaskTime(Timestamp taskTime) {
        this.taskTime = taskTime;
    }

    public String getDeleteFlag() {
        return deleteFlag;
    }

    public void setDeleteFlag(String deleteFlag) {
        this.deleteFlag = deleteFlag;
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

    public String getTaskStatus() {
        return taskStatus;
    }

    public void setTaskStatus(String taskStatus) {
        this.taskStatus = taskStatus;
    }
}
