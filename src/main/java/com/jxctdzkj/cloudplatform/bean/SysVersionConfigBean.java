package com.jxctdzkj.cloudplatform.bean;

import lombok.Data;
import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Comment;
import org.nutz.dao.entity.annotation.Default;
import org.nutz.dao.entity.annotation.Table;

@Table("sys_version_config")
@Data
public class SysVersionConfigBean extends DBVO {

    @Column("version_name")
    @Comment("版本名称")
    private String versionName;

    @Column("useful_life")
    @Comment("使用有效期,默认30（天）")
    @Default("30")
    private Integer usefulLife;

    @Column("device_num")
    @Comment("限制的设备创建数量")
    private Integer deviceNum;

    @Column("monitor_num")
    @Comment("限制的监控器创建数量")
    private Integer monitorNum;

    @Column("level2_user_num")
    @Comment("限制的二级用户创建数量")
    private Integer level2UserNum;

    @Column("configuration_num")
    @Comment("限制的组态创建数量")
    private Integer configurationNum;

    @Column("trigger_num")
    @Comment("限制的触发器创建数量")
    private Integer triggerNum;

    @Column("timer_num")
    @Comment("限制的定时任务创建数量")
    private Integer timerNum;

    @Column("version_id")
    @Comment("版本id")
    private Integer versionId;

}
