package com.jxctdzkj.cloudplatform.bean;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Comment;
import org.nutz.dao.entity.annotation.Default;
import org.nutz.dao.entity.annotation.Table;

import java.sql.Timestamp;

/**
 * <pre>
 *     @author  : FlySand
 *     @e-mail  : 1156183505@qq.com
 *     @time    : 2018/8/29.
 *     @desc    :
 * </pre>
 */
@Table("sensor_template")
@JsonIgnoreProperties(value={"isDel"})
public class TemplateBean extends DBVO {

    @Column
    private String name;
    @Column
    private String templates;
    @Column("create_user")
    private String createUser;
    @Column("creat_time")
    @Comment("创建时间")
    private Timestamp creatTime;
    @Column("is_del")
    @Default("0")
    private int isDel;

    private String flag;


    public String getFlag() {
        return flag;
    }

    public void setFlag(String flag) {
        this.flag = flag;
    }
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTemplates() {
        return templates;
    }

    public void setTemplates(String templates) {
        this.templates = templates;
    }

    public String getCreateUser() {
        return createUser;
    }

    public void setCreateUser(String createUser) {
        this.createUser = createUser;
    }

    public Timestamp getCreatTime() {
        return creatTime;
    }

    public void setCreatTime(Timestamp creatTime) {
        this.creatTime = creatTime;
    }

    public int getIsDel() {
        return isDel;
    }

    public void setIsDel(int isDel) {
        this.isDel = isDel;
    }

    @Override
    public String toString() {
        return "TemplateBean{" +
                "name='" + name + '\'' +
                ", templates='" + templates + '\'' +
                ", createUser='" + createUser + '\'' +
                ", creatTime=" + creatTime +
                ", isDel=" + isDel +
                ", id=" + id +
                '}';
    }
}
