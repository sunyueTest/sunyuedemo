package com.jxctdzkj.cloudplatform.bean;

import lombok.Data;
import org.nutz.dao.entity.annotation.*;

import java.sql.Timestamp;

@Table("sys_user_order")
@Data
@Comment("用户预约专家")
public class SysUserOrderBean extends DBVO {

    @Column("order_title")
    @Comment("预约标题")
    private String orderTitle;

    @Column("order_user")
    @Comment("申请人账号")
    private String orderUser;

    @Column("order_name")
    @Comment("申请人名字")
    private String orderName;

    @Column("experts_id")
    @Comment("专家ID")
    private String expertsId;

    @Column("experts_name")
    @Comment("专家名称")
    private String expertsName;

    @Column("order_time")
    @Comment("预约时间")
    private Timestamp orderTime;

    @Column("is_order")
    @Default("0")
    @Comment("预约状态：0：待接收，1：已同意，2：已拒绝，3：已取消")
    private int isOrder;

    @Column("order_details")
    @Comment("预约详情")
    @ColDefine(type= ColType.TEXT)
    private String orderDetails;

    @Column("order_reply")
    @Comment("专家回复")
    private String orderReply;

    @Column("is_del")
    @Default("0")
    @Comment("是否删除")
    private int isDel;

    public String getOrderTitle() {
        return orderTitle;
    }

    public void setOrderTitle(String orderTitle) {
        this.orderTitle = orderTitle;
    }

    public String getOrderUser() {
        return orderUser;
    }

    public void setOrderUser(String orderUser) {
        this.orderUser = orderUser;
    }

    public String getOrderName() {
        return orderName;
    }

    public void setOrderName(String orderName) {
        this.orderName = orderName;
    }

    public String getExpertsId() {
        return expertsId;
    }

    public void setExpertsId(String expertsId) {
        this.expertsId = expertsId;
    }

    public String getExpertsName() {
        return expertsName;
    }

    public void setExpertsName(String expertsName) {
        this.expertsName = expertsName;
    }

    public Timestamp getOrderTime() {
        return orderTime;
    }

    public void setOrderTime(Timestamp orderTime) {
        this.orderTime = orderTime;
    }

    public int getIsOrder() {
        return isOrder;
    }

    public void setIsOrder(int isOrder) {
        this.isOrder = isOrder;
    }

    public String getOrderDetails() {
        return orderDetails;
    }

    public void setOrderDetails(String orderDetails) {
        this.orderDetails = orderDetails;
    }

    public int getIsDel() {
        return isDel;
    }

    public void setIsDel(int isDel) {
        this.isDel = isDel;
    }

    public String getOrderReply() {
        return orderReply;
    }

    public void setOrderReply(String orderReply) {
        this.orderReply = orderReply;
    }
}
