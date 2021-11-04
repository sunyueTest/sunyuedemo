package com.jxctdzkj.cloudplatform.bean;


import lombok.Data;
import org.nutz.dao.entity.annotation.*;

import java.sql.Timestamp;

@Table("farm_info")
@Data
public class FarmInfoBean extends DBVO {

    // 图片地址
    @Column("img_url")
    private String imgUrl;

    // 农场名称
    @Column("farm_name")
    private String farmName;

    // 农场地址
    @Column("farm_address")
    private String farmAddress;

    // 联系方式
    @Column("tel")
    private String tel;

    // 种植作物
    @Column("crops")
    private String crops;

    // 摄像头编号
    @Column("camera_number")
    private String cameraNumber;

    // 继电器编号
    @Column("relay_number")
    private String relayNumber;

    // 经度
    @Column
    @ColDefine(customType = "DECIMAL(10,4)")
    private double longitude;

    // 维度
    @Column
    @ColDefine(customType = "DECIMAL(10,4)")
    private double latitude;

    // 创建人
    @Column("create_user")
    private String createUser;

    // 创建时间
    @Column("create_time")
    private Timestamp createTime;

    // 状态 1-删除 0-未删除
    @Column("delete_flag")
    @Default("0")
    private String deleteFlag;

    @Column("group_id")
    @Default("0")
    private long groupId;

    /**
     * 正常：0
     * 异常：1
     * 灌溉：2
     * 采摘：3
     * 施肥：4
     */
    @Column("status")
    @Comment("状态")
    @Default("0")
    private String status;

    @Column("x")
    @Comment("对应前端页面的农场坐标X值")
    @Default("0")
    private double x;

    @Column("y")
    @Comment("对应前端页面的农场坐标Y值")
    @Default("0")
    private double y;

    @Column("duration")
    @Comment("灌溉/施肥时长,单位分钟；采摘期天数，单位天")
    @Default("30")
    private String duration;

    @Column("irrigation_time")
    @Comment("开始灌溉/施肥时间")
    private Timestamp irrigationTime;

    @Column("lot_id")
    @Comment("农场对应地块id")
    private String lotId;

    @Column("lot_name")
    @Comment("农场对应地块名")
    private String lotName;

    @Column("type")
    @ColDefine(type = ColType.INT)
    @Comment("对应类型，具体参见Constant.FarmInfoType")
    @Default("0")
    private int type;

    @Column("sub_type")
    @ColDefine(type = ColType.INT)
    @Comment("对应类型之下的分类，例如：场景下的养殖场景0与加工场景1")
    @Default("0")
    private int subType;

    @Column("parent_id")
    @Comment("父id")
    @Default("0")
    private long parentId;

    @Column("remark")
    @Comment("农场的描述信息")
    private String remark;

    @Column("farm_user_name")
    @Comment("农场负责人")
    private String farmUserName;
}
