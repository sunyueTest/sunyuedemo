package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Comment;
import org.nutz.dao.entity.annotation.Default;
import org.nutz.dao.entity.annotation.Table;

@Table("new_aquaculture_trace_source_send")
public class NewAquacultureTraceSourceSendBean extends DBVO {

    @Comment("阶段信息")
    @Column
    private String present;

    @Comment("用户名")
    @Column("user_name")
    private String userName;

    @Comment("阶段信息简介")
    @Column("img_info")
    private String imgInfo;

    @Comment("图片途径")
    @Column("img_url")
    private String imgUrl;

    @Comment("图片数量")
    @Column("img_count")
    private Integer imgCount;

    @Column("send_id")
    private Integer sendId;

    @Comment("分类")
    @Column
    private Integer type;

    @Default("0")
    @Comment("溯源阶段")
    @Column
    private Integer stage;

    @Default("0")
    @Column("is_del")
    @Comment("是否已被删除")
    private Integer isDel;

    public String getPresent() {
        return present;
    }

    public void setPresent(String present) {
        this.present = present;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getImgInfo() {
        return imgInfo;
    }

    public void setImgInfo(String imgInfo) {
        this.imgInfo = imgInfo;
    }

    public String getImgUrl() {
        return imgUrl;
    }

    public void setImgUrl(String imgUrl) {
        this.imgUrl = imgUrl;
    }

    public Integer getImgCount() {
        return imgCount;
    }

    public void setImgCount(Integer imgCount) {
        this.imgCount = imgCount;
    }

    public Integer getSendId() {
        return sendId;
    }

    public void setSendId(Integer sendId) {
        this.sendId = sendId;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Integer getStage() {
        return stage;
    }

    public void setStage(Integer stage) {
        this.stage = stage;
    }

    public Integer getIsDel() {
        return isDel;
    }

    public void setIsDel(Integer isDel) {
        this.isDel = isDel;
    }

    @Override
    public String toString() {
        return "NewAquacultureTraceSourceSendBean{" +
                "id=" + id +
                ", present='" + present + '\'' +
                ", userName='" + userName + '\'' +
                ", imgInfo='" + imgInfo + '\'' +
                ", imgUrl='" + imgUrl + '\'' +
                ", imgCount=" + imgCount +
                ", sendId=" + sendId +
                ", type=" + type +
                ", stage=" + stage +
                ", isDel=" + isDel +
                '}';
    }
}