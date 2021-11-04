package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Comment;
import org.nutz.dao.entity.annotation.Default;
import org.nutz.dao.entity.annotation.Table;

import java.sql.Timestamp;

@Table("about_us")
public class AboutUsBean extends DBVO {

    @Column
    private String name;

    @Column
    private String email;

    @Column
    private String tel;

    @Column
    private String message;

    @Comment("发送时间")
    @Column("delivery_time")
    private Timestamp deliveryTime;

    @Default("未读")
    @Comment("状态")
    @Column
    private String state;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public CharSequence getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Timestamp getDeliveryTime() {
        return deliveryTime;
    }

    public void setDeliveryTime(Timestamp deliveryTime) {
        this.deliveryTime = deliveryTime;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    @Override
    public String toString() {
        return "testBean{" +
                "name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", tel=" + tel +
                ", message='" + message + '\'' +
                ", deliveryTime=" + deliveryTime +
                ", state='" + state + '\'' +
                ", id=" + id +
                '}';
    }
}
