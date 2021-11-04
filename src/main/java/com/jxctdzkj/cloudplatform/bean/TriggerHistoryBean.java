package com.jxctdzkj.cloudplatform.bean;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import org.nutz.dao.entity.annotation.*;

import java.sql.Timestamp;

/**
 * <pre>
 *     @author  : FlySand
 *     @e-mail  : 1156183505@qq.com
 *     @time    : 2018/11/23.
 *     @desc    :
 * </pre>
 */
@Data
@Table("trigger_alarm_history")
@Comment("触发器列表")
@JsonIgnoreProperties(value = {"isDel"})
@TableIndexes({@Index(name = "trigger_history_userName", fields = {"userName"}, unique = false),
        @Index(name = "trigger_history_sensorCode", fields = {"sensorCode"}, unique = false)})
public class TriggerHistoryBean extends DBVO {
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
    @Comment("表达式")
    private String expression;

    @Column
    @Comment("处理结果")
    private String results;

    @Column("alarm_time")
    private Timestamp alarmTime;

    @Column("is_del")
    @Default("0")
    @Comment("是否删除")
    @ColDefine(customType = "DECIMAL(2,0)")
    private float isDel;

    @Column
    private double value;

    @Column("group_id")
    @Default("0")
    private long groupId;

}
