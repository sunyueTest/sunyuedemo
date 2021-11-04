package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Comment;
import org.nutz.dao.entity.annotation.Default;
import org.nutz.dao.entity.annotation.Table;

import lombok.Data;

@Table("sys_role")
@Data
public class SysRoleBean extends DBVO {

    @Column
    private String name;

    @Column
    private String descr;

    @Column
    @Default("1")
    private int level;
    @Column
    @Default("1")
    private int enable = 1;

    @Column("child_id")
    @Default("5")
    @Comment("角色可创建的二级用户角色")
    private Integer childId = 5;

    @Column("index_url")
    private String indexUrl;

    @Default("4")
    @Column("admin_role")
    @Comment("用于切换后台管理界面")
    private int adminRole = 4;

}
