package com.jxctdzkj.cloudplatform.bean;

import com.jxctdzkj.support.utils.Utils;
import lombok.Data;
import org.nutz.dao.entity.annotation.*;

import java.sql.Timestamp;

/**
 * @Description 基地
 * @Author chanmufeng
 * @Date 2019/9/5 10:03
 **/
@Table("base")
@Data
public class Base extends DBVO {
    @Column("project_id")
    @Comment("所属项目")
    private long ProjectId;

    @Column("name")
    @Comment("基地名称")
    private String name;

    @Column("type")
    @Comment("基地类型，如培训基地，示范基地，服务中心等")
    @ColDefine(type = ColType.INT)
    private int type;

    @Column("ycoordinate")
    @Comment("经度")
    private double longitude;

    @Column("xcoordinate")
    @Comment("纬度")
    private double latitude;

    @Column("create_user")
    @Comment("创建者")
    private String createUser;

    @Column("create_time")
    @Comment("创建时间")
    private Timestamp createTime = Utils.getCurrentTimestamp();


}
