package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.ColDefine;
import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Comment;
import org.nutz.dao.entity.annotation.Default;
import org.nutz.dao.entity.annotation.Index;
import org.nutz.dao.entity.annotation.Table;
import org.nutz.dao.entity.annotation.TableIndexes;

import java.sql.Timestamp;

/**
 * <pre>
 *     @author  : FlySand
 *     @e-mail  : 1156183505@qq.com
 *     @time    : 2018/9/3.
 *     @desc    :
 * </pre>
 */
@Table("command_to_device")
@TableIndexes({@Index(name = "deviceNumber", fields = "deviceNumber", unique = false),
        @Index(name = "user_name", fields = "userName", unique = false)})
public class DeviceCommandBean extends DBVO {

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
    private int command;
    @Column
    @ColDefine(notNull = true)
    private String val;
    @Column("create_time")
    private Timestamp createTime;
    @Column("command_time")
    private Timestamp commandTime;
    @Column("is_success")
    @Default("0")
    private int isSuccess;
    @Column("is_del")
    @Default("0")
    private int isDel;

    public String getVal() {
        return val;
    }

    public void setVal(String val) {
        this.val = val;
    }

    public int getIsDel() {
        return isDel;
    }

    public void setIsDel(int isDel) {
        this.isDel = isDel;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public int getDeviceType() {
        return deviceType;
    }

    public void setDeviceType(int deviceType) {
        this.deviceType = deviceType;
    }

    public String getDeviceNumber() {
        return deviceNumber;
    }

    public void setDeviceNumber(String deviceNumber) {
        this.deviceNumber = deviceNumber;
    }

    public int getCommand() {
        return command;
    }

    public void setCommand(int command) {
        this.command = command;
    }

    public Timestamp getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Timestamp createTime) {
        this.createTime = createTime;
    }

    public Timestamp getCommandTime() {
        return commandTime;
    }

    public void setCommandTime(Timestamp commandTime) {
        this.commandTime = commandTime;
    }

    public int getIsSuccess() {
        return isSuccess;
    }

    public void setIsSuccess(int isSuccess) {
        this.isSuccess = isSuccess;
    }

    @Override
    public String toString() {
        return "DeviceCommand{" +
                "deviceNumber='" + deviceNumber + '\'' +
                ", command='" + command + '\'' +
                ", val='" + val + '\'' +
                ", createTime=" + createTime +
                ", commandTime=" + commandTime +
                ", isSuccess=" + isSuccess +
                ", id=" + id +
                '}';
    }
}
