package com.jxctdzkj.cloudplatform.bean;

import lombok.Data;
import org.nutz.dao.entity.annotation.*;

import java.sql.Timestamp;

@Table("sys_user_role")
@Data
public class UserRoleBean extends DBVO {
    @Name
    @Column("user_name")
    private String userName;

    @Column("user_id")
    private long userId;

    @Column("role_id")
    private Integer roleId;

    @Column("version_id")
    @Comment("软件版本id(免费版/专业版)")
    @Default("1")//默认是免费版
    private Integer versionId;

    //0:精讯云管理界面
    //2：大屏
    @Column("index_type")
    @Comment("主页类型，0:精讯云管理界面 2：大屏")
    @Default("0")//默认是精讯云管理界面
    private Integer indexType;


    @Column("type_id")
    @Comment("对应大屏类型")
    @Default("0")//
    private Integer typeId;

    @Column("expiry_time")
    @Comment("账号过期时间。" +
            "如果当前版本为免费版，该字段无效；如果当前版本为收费版，该字段表示该版本的使用到期截止时间")
    private Timestamp expiryTime;
}
