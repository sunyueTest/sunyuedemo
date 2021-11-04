package com.jxctdzkj.cloudplatform.bean;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import org.nutz.dao.entity.annotation.ColDefine;
import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Comment;
import org.nutz.dao.entity.annotation.Default;
import org.nutz.dao.entity.annotation.Index;
import org.nutz.dao.entity.annotation.Table;
import org.nutz.dao.entity.annotation.TableIndexes;

import java.sql.Timestamp;

import lombok.Data;

/**
 * <pre>
 *     @author  : FlySand
 *     @e-mail  : 1156183505@qq.com
 *     @time    : 2018/11/23.
 *     @desc    :
 * </pre>
 */
@Table("trigger_alarm")
@Comment("触发器列表")
@JsonIgnoreProperties(value = {"isDel"})
@TableIndexes({@Index(name = "trigger_userName", fields = {"userName"}, unique = false),
        @Index(name = "trigger_deviceNumber", fields = {"deviceNumber"}, unique = false)})
@Data
public class TriggerBean extends DBVO {
    @Column("trigger_name")
    String name;

    @Column("user_name")
    private String userName;

    @Column("Ncode")
    @Comment("设备号")
    private String deviceNumber;

    @Column("sensor_code")
    private String sensorCode;

    @Column
    @Comment("报警方式，email邮件，tel 短信，wx 微信")
    private String type;

    @Column
    @Comment("自定义推送地址")
    private String address;

    @Column
    @Default("0")
    @Comment("总报警次数")
    private long count;

    @Column("min_interval")
    @Default("600000")//单位ms 默认10分钟 ms 10*60*1000
    @Comment("最小报警间隔")
    private long minInterval = 600000;

    @Column
    @Default("0")//单位1分钟 10
    @Comment("报警持续时间")
    private long persist;

    @Column("start_time")
    @Default("00:00")//单位 MM:DD
    @Comment("报警推送开始时间段")
    private String startTime;

    @Column("end_time")
    @Default("00:00")//格式 MM:DD
    @Comment("报警推送结束时间段")
    private String endTime;

    @Column
    @Default("0")
    @Comment("处理状态 0关闭 1开启")
    @ColDefine(customType = "DECIMAL(1,0)")
    private float state;

    @Column("auto_close")
    @Default("1")
    @Comment("自动关闭 0关闭 1开启")
    @ColDefine(customType = "DECIMAL(1,0)")
    private float autoClose = 1;

    @Column
    @Comment("表达式")
    private String expression;

    @Column
    @Comment("处理结果")
    private String results;

    @Column("creat_time")
    private Timestamp creatTime;

    @Column("alarm_time")
    private Timestamp alarmTime;

    @ColDefine
    @Column("err_msg")
    private String errMsg;

    @Column("is_del")
    @Default("0")
    @Comment("是否删除")
    @ColDefine(customType = "DECIMAL(2,0)")
    private float isDel;

    @Column("group_id")
    @Default("0")
    private long groupId;

    @Column
    private double value;

}
