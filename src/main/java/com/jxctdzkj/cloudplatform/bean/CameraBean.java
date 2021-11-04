package com.jxctdzkj.cloudplatform.bean;

import lombok.Data;
import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Comment;
import org.nutz.dao.entity.annotation.Default;
import org.nutz.dao.entity.annotation.Table;

import java.sql.Timestamp;

/**
 * 萤石云 摄像头
 */
@Table("camera")
@Data
public class CameraBean extends DBVO {

    @Column
    private String name;

    @Column
    private String ncode;

    @Column
    private String serial;

    @Column("validate_code")
    private String validateCode;

    @Column
    private String flv;

    @Column
    private String flvHd;

    @Column
    private String hls;

    @Column
    private String hlsHd;

    @Column
    private String rtmp;

    @Column
    private String rtmpHd;

    @Column("user_name")
    private String userName;

    @Column
    private String appkey;

    @Column
    private String secret;

    @Column
    @Comment("海康摄像头通道号")
    @Default("1")
    private String channelNo;

    // 状态 1-删除 0-未删除
    @Column("delete_flag")
    @Default("0")
    private String deleteFlag;

    @Column("camera_type")
    @Default("1")
    private String cameraType;

    @Column("expire_time")
    @Comment("海康默认过期时间一个月，大华根据返回的接口进行设置")
    private Timestamp expireTime;


}
