package com.jxctdzkj.cloudplatform.bean;

import lombok.Data;
import org.nutz.dao.entity.annotation.*;

import java.sql.Timestamp;

/**
 * <pre>
 *     @author  : chanmufeng
 *     @time    : 2019/11/29.
 *     @desc    : 一键报警历史记录
 * </pre>
 */
@Data
@Table("alarm_history")
@Comment("触发器列表")
public class AlarmHistoryBean extends DBVO {
    @Column("Ncode")
    @Comment("设备号")
    private String deviceNumber;

    @Column("alarm_time")
    private Timestamp alarmTime;

    @Column("user_name")
    private String userName;
}
