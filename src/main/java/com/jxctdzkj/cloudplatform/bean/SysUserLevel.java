package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Comment;
import org.nutz.dao.entity.annotation.Default;
import org.nutz.dao.entity.annotation.Name;
import org.nutz.dao.entity.annotation.Table;

/**
 * @Auther: TSF
 * @Date: 2018/7/19 14:18
 * @Description: 角色类
 */
@Table("sys_user_level")
public class SysUserLevel extends DBVO {
    @Column
    @Comment("名称")
    private String name;
    @Name
    @Column
    @Comment("级别")
    private String level;
    @Default("0")
    @Column("create_sub_account_num")
    @Comment("允许创建几个子用户")
    private int createSubAccountNum;
    @Column
    @Comment("备注")
    private String remark;

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }


    public int getCreateSubAccountNum() {
        return createSubAccountNum;
    }

    public void setCreateSubAccountNum(int createSubAccountNum) {
        this.createSubAccountNum = createSubAccountNum;
    }

    @Override
    public String toString() {
        return "SysRole{" +
                "name='" + name + '\'' +
                ", level='" + level + '\'' +
                ", createSubAccountNum=" + createSubAccountNum +
                ", remark='" + remark + '\'' +
                '}';
    }
}
