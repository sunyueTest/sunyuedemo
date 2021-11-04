package com.jxctdzkj.cloudplatform.bean;

import lombok.Data;
import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Comment;
import org.nutz.dao.entity.annotation.Default;
import org.nutz.dao.entity.annotation.Table;

import java.util.List;

/**
 * @Description
 * @Author chanmufeng
 * @Date 2019/9/9 14:58
 **/
@Table("enterprise")
@Data
public class EnterpriseBean extends DBVO {
    @Column("name")
    @Comment("企业名称")
    private String name;

    @Column("address")
    @Comment("企业地址")
    private String address;

    @Column("header")
    @Comment("负责人")
    private String header;

    @Column("tel")
    @Comment("联系电话")
    private String tel;

    @Column("ycoordinate")
    @Comment("经度")
    private double longitude;

    @Column("xcoordinate")
    @Comment("纬度")
    private double latitude;

    @Column("is_del")
    @Comment("是否删除")
    private byte isDel;

    @Comment("企业停用或恢复  0：启用状态 1：停用状态")
    @Column("state")
    @Default("0")
    private String state;

    //停用或启用（汉字）
    private String stateValue;

    private List<ProjectBean> projectBeanList;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getHeader() {
        return header;
    }

    public void setHeader(String header) {
        this.header = header;
    }

    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public byte getIsDel() {
        return isDel;
    }

    public void setIsDel(byte isDel) {
        this.isDel = isDel;
    }

    public List<ProjectBean> getProjectBeanList() {
        return projectBeanList;
    }

    public void setProjectBeanList(List<ProjectBean> projectBeanList) {
        this.projectBeanList = projectBeanList;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }
}
