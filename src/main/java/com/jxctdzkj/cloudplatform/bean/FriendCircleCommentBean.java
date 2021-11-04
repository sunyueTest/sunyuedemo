package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;

import java.sql.Timestamp;

/**
 * 朋友圈评论信息
 */
@Table("t_friend_circle_comment")
public class FriendCircleCommentBean {
    @Id
    @Column
    private Integer id;

    @Column("user_name")
    private String userName;

    @Column("to_id")
    private Integer toId;//回复的评论id

    @Column("to_user")
    private String toUser;

    @Column
    private Integer fcmid;//发表的动态id

    @Column
    private String content;//评论内容

    @Column("create_time")
    private Timestamp createTime;


    public String getToUser() {
        return toUser;
    }

    public void setToUser(String toUser) {
        this.toUser = toUser;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Integer getFcmid() {
        return fcmid;
    }

    public void setFcmid(Integer fcmid) {
        this.fcmid = fcmid;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Timestamp getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Timestamp createTime) {
        this.createTime = createTime;
    }


    public Integer getToId() {
        return toId;
    }

    public void setToId(Integer toId) {
        this.toId = toId;
    }
}
