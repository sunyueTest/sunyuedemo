package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;

import java.sql.Timestamp;

/**
 * 朋友圈点赞记录
 */
@Table("t_friend_circle_like")
public class FriendCircleLikeBean {

    @Id
    @Column
    private Integer id;

    @Column
    private Integer fcmid;//发表的动态id

    @Column("user_name")
    private String userName;//点赞人

    @Column("create_time")
    private Timestamp createTime;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getFcmid() {
        return fcmid;
    }

    public void setFcmid(Integer fcmid) {
        this.fcmid = fcmid;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Timestamp getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Timestamp createTime) {
        this.createTime = createTime;
    }
}
