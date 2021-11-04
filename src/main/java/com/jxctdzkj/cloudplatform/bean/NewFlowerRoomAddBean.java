package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Table;

import java.sql.Timestamp;

@Table("flower_Room_Add")
public class NewFlowerRoomAddBean extends DBVO {

    @Column("class_time")
    private Timestamp classTime;

    private String productTime;

    @Column("user_name")
    private String userName;

    @Column("project_name")
    private String projectName;

    @Column("creat_user")
    private String creatUser;

    public Timestamp getClassTime() {
        return classTime;
    }

    public void setClassTime(Timestamp classTime) {
        this.classTime = classTime;
    }

    public String getProductTime() {
        return productTime;
    }

    public void setProductTime(String productTime) {
        this.productTime = productTime;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getProjectName() {
        return projectName;
    }

    public String getCreatUser() {
        return creatUser;
    }

    public void setCreatUser(String creatUser) {
        this.creatUser = creatUser;
    }

    public void setProjectName(String projectName) {


        this.projectName = projectName;
    }

    @Override
    public String toString() {
        return "NewFlowerRoomAddBean{" +
                "classTime=" + classTime +
                ", productTime='" + productTime + '\'' +
                ", userName='" + userName + '\'' +
                ", projectName='" + projectName + '\'' +
                ", creatUser='" + creatUser + '\'' +
                '}';
    }
}
