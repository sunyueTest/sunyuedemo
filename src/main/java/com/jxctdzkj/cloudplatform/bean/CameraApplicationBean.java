package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Comment;
import org.nutz.dao.entity.annotation.Default;
import org.nutz.dao.entity.annotation.Table;

import lombok.Data;

/**
 * @Description 具体使用场景（渔业、农场、大棚）和摄像头一对多关系表
 * @Author chanmufeng
 * @Date 2019/7/29 17:29
 **/
@Table("camera_application")
@Data
public class CameraApplicationBean extends DBVO {

    @Column("app_id")
    @Comment("对应场景的id，例如农场id，池塘id等")
    private long appId;

    @Column("app_type")
    @Comment("使用场景的类型，详情参考Constant.CameraAppType")
    @Default("1")//默认是大棚
    private int appType;

    @Column("user_name")
    private String userName;

    @Column("camera_name")
    private String cameraName;

    /**
     * 该字段作为实际唯一绑定的唯一标识
     */
    @Column("camera_id")
    private long cameraId;

    /**
     * 序列号不再作为绑定的唯一表示，但仍然保留该字段，方便搜索查询使用
     */
    @Column
    private String serial;

    // 状态 1-删除 0-未删除
    @Column("is_del")
    @Default("0")
    private String isDel;

}
