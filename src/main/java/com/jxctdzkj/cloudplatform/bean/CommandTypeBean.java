package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Comment;
import org.nutz.dao.entity.annotation.Default;
import org.nutz.dao.entity.annotation.Table;

/**
 * <pre>
 *     @author  : FlySand
 *     @e-mail  : 1156183505@qq.com
 *     @time    : 2018/9/4.
 *     @desc    :
 * </pre>
 */
@Table("command_type")
public class CommandTypeBean extends DBVO {

    //    网络类型（0：UDP，1：COAP）
//    * 6	协议类型（0：JX，1：MODBUS）
//    * 7	采集间隔（单位：10s）
//    * 8	上传间隔（单位：10s）
//    * 9	触发上报（0：不触发，1：触发）
//    * 10	温度触发上报上限值（1个小数位）
//    * 11	温度触发上报下限值（1个小数位）
//    * 12	湿度触发上报上限值（1个小数位）
//    * 13	湿度触发上报下限值（1个小数位）
//    * 14	温度偏移量（1个小数位）
//    * 15	湿度偏移量（1个小数位）

    @Column
    @Comment("设备类型")
    @Default("0")
    private int deviceType;
    @Column
    String name;
    @Column
    @Comment("偏移量")
    private float offset;
    @Column
    int command;
    @Column
    String remark;

    @Column("en_name")
    private String enName;

    @Column("en_remark")
    private String enRemark;

    public CommandTypeBean() {
    }

    public CommandTypeBean(int deviceType, int command,String name, String remark,float offset) {
        this.command = command;
        this.name = name;
        this.remark = remark;
        this.deviceType = deviceType;
        this.offset = offset;
    }

    public String getEnName() {
        return enName;
    }

    public void setEnName(String enName) {
        this.enName = enName;
    }

    public String getEnRemark() {
        return enRemark;
    }

    public void setEnRemark(String enRemark) {
        this.enRemark = enRemark;
    }

    public double getOffset() {
        return offset;
    }

    public void setOffset(float offset) {
        this.offset = offset;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getDeviceType() {
        return deviceType;
    }

    public void setDeviceType(int deviceType) {
        this.deviceType = deviceType;
    }

    public int getCommand() {
        return command;
    }

    public void setCommand(int command) {
        this.command = command;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    @Override
    public String toString() {
        return "CommandTypeBean{" +
                "command='" + command + '\'' +
                ", remark='" + remark + '\'' +
                '}';
    }


}
