package com.jxctdzkj.cloudplatform.bean;

import lombok.Data;
import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Comment;
import org.nutz.dao.entity.annotation.Table;

/**
 * @Description
 * @Author chanmufeng
 * @Date 2019/7/1 11:27
 **/
@Table("dynamic_table_values")
@Data
public class DynamicTableValuesBean extends DBVO {

    // 创建者
    @Column("user_name")
    private String userName;

    //对应的栏目id（sys_rights）
    @Column("right_id")
    private Integer rightId;

    @Comment("针对特定用户特定表的条目序列号")
    @Column("serial_num")
    private Integer serialNum;

    //第一列数据，下同，以此类推
    @Column("attr0")
    private String attr0;

    @Column("attr1")
    private String attr1;

    @Column("attr2")
    private String attr2;

    @Column("attr3")
    private String attr3;

    @Column("attr4")
    private String attr4;

    @Column("attr5")
    private String attr5;

    @Column("attr6")
    private String attr6;

    @Column("attr7")
    private String attr7;

    @Column("attr8")
    private String attr8;

    @Column("attr9")
    private String attr9;

    @Column("attr10")
    private String attr10;

    @Column("attr11")
    private String attr11;

    @Column("attr12")
    private String attr12;

    @Column("attr13")
    private String attr13;

    @Column("attr14")
    private String attr14;

    @Column("attr15")
    private String attr15;

    @Column("attr16")
    private String attr16;

    @Column("attr17")
    private String attr17;

    @Column("attr18")
    private String attr18;

    @Column("attr19")
    private String attr19;

}
