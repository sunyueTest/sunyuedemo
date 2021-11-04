package com.jxctdzkj.cloudplatform.bean;

import lombok.Data;
import org.nutz.dao.entity.annotation.*;

import java.sql.Timestamp;
import java.util.List;

/**
 * <pre>
 *     @author  : FlySand
 *     @e-mail  : 1156183505@qq.com
 *     @time    : 2018/9/25.
 *     @desc    :
 * </pre>
 */
@Table("sys_user_to_group")
@Comment("用户创建的区域")
@TableIndexes({@Index(name = "sys_user_to_group_user_name", fields = {"userName"}, unique = false),
        @Index(name = "sys_user_to_group_parent_id", fields = {"pId"}, unique = false)})
@Data
public class UserGroupBean extends DBVO {

    @Column("group_name")
    String groupName;
    @Column("user_name")
    String userName;
    @Default("0")
    @Column("parent_id")
    long pId;
    @Column("creat_time")
    Timestamp creatTime;

    List<UserGroupBean> children;

    @Column("is_del")
    @Default("0")
    @Comment("是否删除")
    private int isDel;



    private String name;
    private String deviceNumber;
    /**
     * 类型，1代表设备，其他代表节点
     */
    int type;

    public int getIsDel() {
        return isDel;
    }

    public void setIsDel(int isDel) {
        this.isDel = isDel;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public long getpId() {
        return pId;
    }

    public void setpId(long pId) {
        this.pId = pId;
    }

    public Timestamp getCreatTime() {
        return creatTime;
    }

    public void setCreatTime(Timestamp creatTime) {
        this.creatTime = creatTime;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public List<UserGroupBean> getChildren() {
        return children;
    }

    public void setChildren(List<UserGroupBean> children) {
        this.children = children;
    }

    public String getDeviceNumber() {
        return deviceNumber;
    }

    public void setDeviceNumber(String deviceNumber) {
        this.deviceNumber = deviceNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public UserGroupBean(String groupName, String userName, long pId, Timestamp creatTime) {
        this.groupName = groupName;
        this.userName = userName;
        this.pId = pId;
        this.creatTime = creatTime;
    }

    public UserGroupBean(){}
}
