package com.jxctdzkj.cloudplatform.bean;

import lombok.Data;
import org.nutz.dao.entity.annotation.*;

import java.sql.Timestamp;

@Table("reply")
@Data
@Comment("专家回复表")
public class ReplyBean extends DBVO {

    @Column("problem_id")
    @ColDefine(notNull = true)
    @Comment("问题表主键")
    private long problemId;

    @Column("reply_img1")
    @Comment("回复图片")
    private String replyImg1;

    @Column("reply_img2")
    @Comment("回复图片")
    private String replyImg2;

    @Column("create_time")
    @Comment("回复时间")
    private Timestamp createTime;

    @Column("create_user")
    @Comment("回复人账号")
    @ColDefine(notNull = true)
    private String createUser;

    @Column("experts_id")
    @Comment("专家ID")
    @ColDefine(notNull = true)
    private long expertsId;

    @Column("experts_name")
    @Comment("专家名称")
    @ColDefine(notNull = true)
    private String expertsName;

    @Column("identification")
    @Comment("点赞数：默认0")
    @Default("0")
    private int identification;

    @Column("disagree")
    @Comment("不认同：默认0")
    @Default("0")
    private int disagree;


    public long getProblemId() {
        return problemId;
    }

    public void setProblemId(long problemId) {
        this.problemId = problemId;
    }

    public String getReplyImg1() {
        return replyImg1;
    }

    public void setReplyImg1(String replyImg1) {
        this.replyImg1 = replyImg1;
    }

    public String getReplyImg2() {
        return replyImg2;
    }

    public void setReplyImg2(String replyImg2) {
        this.replyImg2 = replyImg2;
    }

    public Timestamp getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Timestamp createTime) {
        this.createTime = createTime;
    }

    public String getCreateUser() {
        return createUser;
    }

    public void setCreateUser(String createUser) {
        this.createUser = createUser;
    }

    public long getExpertsId() {
        return expertsId;
    }

    public void setExpertsId(long expertsId) {
        this.expertsId = expertsId;
    }

    public String getExpertsName() {
        return expertsName;
    }

    public void setExpertsName(String expertsName) {
        this.expertsName = expertsName;
    }

    public int getIdentification() {
        return identification;
    }

    public void setIdentification(int identification) {
        this.identification = identification;
    }

    public int getDisagree() {
        return disagree;
    }

    public void setDisagree(int disagree) {
        this.disagree = disagree;
    }
}
