package com.jxctdzkj.cloudplatform.bean;

import lombok.Data;
import org.nutz.dao.entity.annotation.*;

import java.sql.Timestamp;

@Table("problem")
@Data
@Comment("农户问题表")
public class ProblemBean extends DBVO {

    @Column("problem")
    @ColDefine(notNull = true)
    @Comment("问题信息")
    private String problem;

    @Column("problem_img1")
    @Comment("问题图片")
    private String problemImg1;

    @Column("problem_img2")
    @Comment("问题图片")
    private String problemImg2;

    @Column("problem_img3")
    @Comment("问题图片")
    private String problemImg3;

    @Column("create_time")
//    @ColDefine(notNull = true)
    @Comment("提问时间")
    private Timestamp createTime;

    @Column("reply_id")
    @Default("0")
    @Comment("最佳答案:默认0 回复表主键")
    private long replyId;

    @Column("crop_category_id")
    @ColDefine(notNull = true)
    @Comment("类别表主键")
    private long cropCategoryId;

    @Column("create_user")
    @ColDefine(notNull = true)
    @Comment("创建人账号")
    private String createUser;

    @Column("create_name")
    @ColDefine(notNull = true)
    @Comment("创建人名字")
    private String createName;

    @Column("browse_num")
    @Default("0")
    @Comment("浏览次数：默认0")
    private int browseNum;

    public String getProblem() {
        return problem;
    }

    public void setProblem(String problem) {
        this.problem = problem;
    }

    public String getProblemImg1() {
        return problemImg1;
    }

    public void setProblemImg1(String problemImg1) {
        this.problemImg1 = problemImg1;
    }

    public String getProblemImg2() {
        return problemImg2;
    }

    public void setProblemImg2(String problemImg2) {
        this.problemImg2 = problemImg2;
    }

    public String getProblemImg3() {
        return problemImg3;
    }

    public void setProblemImg3(String problemImg3) {
        this.problemImg3 = problemImg3;
    }

    public Timestamp getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Timestamp createTime) {
        this.createTime = createTime;
    }

    public long getReplyId() {
        return replyId;
    }

    public void setReplyId(long replyId) {
        this.replyId = replyId;
    }

    public long getCropCategoryId() {
        return cropCategoryId;
    }

    public void setCropCategoryId(long cropCategoryId) {
        this.cropCategoryId = cropCategoryId;
    }

    public String getCreateUser() {
        return createUser;
    }

    public void setCreateUser(String createUser) {
        this.createUser = createUser;
    }

    public String getCreateName() {
        return createName;
    }

    public void setCreateName(String createName) {
        this.createName = createName;
    }

    public int getBrowseNum() {
        return browseNum;
    }

    public void setBrowseNum(int browseNum) {
        this.browseNum = browseNum;
    }
}
