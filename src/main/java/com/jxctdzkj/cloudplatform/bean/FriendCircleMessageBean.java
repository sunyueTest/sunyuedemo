package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;

import java.sql.Timestamp;
import java.util.List;

/**
 * 朋友圈发布的动态信息
 */
@Table("t_friend_circle_message")
public class FriendCircleMessageBean {
    @Id
    @Column
    private Integer id;

    @Column("user_name")
    private String userName;

    @Column
    private String content;

    @Column("like_count")
    private Integer likeCount;//点赞数

    @Column("top_three")
    private String topThree;//点赞前三人

    @Column
    private String picture;//动态中的图片，可以是多个，中间用，分隔

    @Column
    private String location;//暂时无用

    @Column("create_time")
    private Timestamp createTime;

    @Column
    private String type;

    private List<FriendCircleCommentBean>  commentList;

    public Integer getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(Integer likeCount) {
        this.likeCount = likeCount;
    }

    public String getTopThree() {
        return topThree;
    }

    public void setTopThree(String topThree) {
        this.topThree = topThree;
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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Timestamp getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Timestamp createTime) {
        this.createTime = createTime;
    }

    public List<FriendCircleCommentBean> getCommentList() {
        return commentList;
    }

    public void setCommentList(List<FriendCircleCommentBean> commentList) {
        this.commentList = commentList;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
