package com.jxctdzkj.cloudplatform.bean;

import lombok.Data;
import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Comment;
import org.nutz.dao.entity.annotation.Default;
import org.nutz.dao.entity.annotation.Table;

import java.sql.Timestamp;

@Table("land_use")
@Data
public class LandUseBean extends DBVO {

    @Column("cultivated_area")
    @Comment("耕地面积")
    @Default("0")
    private Integer cultivatedArea;

    @Column("planted_area")
    @Comment("种植面积")
    @Default("0")
    private Integer plantedArea;

    @Column("year")
    @Comment("年份")
    private String year;

    @Column("farm_id")
    @Comment("农场id")
    private Long farmId;

    @Column("create_user")
    @Comment("创建者")
    private String createUser;

}
