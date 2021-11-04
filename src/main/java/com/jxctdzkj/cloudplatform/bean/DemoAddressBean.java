package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Table;

import java.sql.Timestamp;

/**
 * 大屏演示地址配置
 */
@Table("demo_address")
public class DemoAddressBean extends DBVO {

    // 演示地址名称
    @Column("demo_name")
    private String demoName;

    // 地址
    @Column("address")
    private String address;

    // 演示图片
    @Column("img_url")
    private String imgUrl;

    // 创建人
    @Column("create_user")
    private String createUser;

    // 创建时间
    @Column("create_time")
    private Timestamp CreateTime;

    // 状态 1-启用 0-停用
    @Column("status")
    private String status;

    // 用户名
    @Column("user_name")
    private String userName;

    // 密码
    @Column("password")
    private String password;

    // 状态 1-删除 0-未删除
    @Column("deleteFlag")
    private String deleteFlag;

    //用于展示页面大屏排序
    @Column("sort")
    private String sort;

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getDeleteFlag() {
        return deleteFlag;
    }

    public void setDeleteFlag(String deleteFlag) {
        this.deleteFlag = deleteFlag;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDemoName() {
        return demoName;
    }

    public void setDemoName(String demoName) {
        this.demoName = demoName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getImgUrl() {
        return imgUrl;
    }

    public void setImgUrl(String imgUrl) {
        this.imgUrl = imgUrl;
    }

    public String getCreateUser() {
        return createUser;
    }

    public void setCreateUser(String createUser) {
        this.createUser = createUser;
    }

    public Timestamp getCreateTime() {
        return CreateTime;
    }

    public void setCreateTime(Timestamp createTime) {
        CreateTime = createTime;
    }

    public String getSort() {
        return sort;
    }

    public void setSort(String sort) {
        this.sort = sort;
    }
}
