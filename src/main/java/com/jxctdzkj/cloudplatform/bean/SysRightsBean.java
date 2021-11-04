package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Default;
import org.nutz.dao.entity.annotation.Table;

import java.util.List;

@Table("sys_rights")
public class SysRightsBean extends DBVO {

    @Column()
    private String url;

    @Column()
    private String cate;

    @Column()
    private String name;

    @Column("parent_id")
    private long parentId;

    @Column()
    private String icon;

    @Column()
    private int level;

    @Column()
    private int sort;

    @Column("en_name")
    private String enName;

    @Default("0")
    @Column("is_del")
    private String isDel;

    private List<SysRightsBean> sonMenus;

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getCate() {
        return cate;
    }

    public void setCate(String cate) {
        this.cate = cate;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public long getParentId() {
        return parentId;
    }

    public void setParentId(long parentId) {
        this.parentId = parentId;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public int getSort() {
        return sort;
    }

    public void setSort(int sort) {
        this.sort = sort;
    }

    public String getEnName() {
        return enName;
    }

    public void setEnName(String enName) {
        this.enName = enName;
    }

    public String getIsDel() {
        return isDel;
    }

    public void setIsDel(String isDel) {
        this.isDel = isDel;
    }

    public List<SysRightsBean> getSonMenus() {
        return sonMenus;
    }

    public void setSonMenus(List<SysRightsBean> sonMenus) {
        this.sonMenus = sonMenus;
    }

    @Override
    public String toString() {
        return "SysRightsBean{" +
                "id='" + id + '\'' +
                ", url='" + url + '\'' +
                ", cate='" + cate + '\'' +
                ", name='" + name + '\'' +
                ", parentId=" + parentId +
                ", icon='" + icon + '\'' +
                ", level=" + level +
                ", sort=" + sort +
                ", enName='" + enName + '\'' +
                ", isDel='" + isDel + '\'' +
                ", sonMenus=" + sonMenus +
                '}';
    }
}
