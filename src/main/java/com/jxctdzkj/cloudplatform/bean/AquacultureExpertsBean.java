package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.*;

import java.util.Date;

@Table("aquaculture_experts")
public class AquacultureExpertsBean extends DBVO{

    // 中文姓名
    @Column("name")
    private String name;

    // 擅长鱼类
    @Column("good_at_fish")
    private String goodAtFish;

    // 身份证号码
    @Column("id_card_no")
    private String idCardNo;

    // 擅长病因
    @Column("good_at_disease")
    private String goodAtDisease;

    // 工作单位
    @Column("work_units")
    private String workUnits;

    // 职务
    @Column("position")
    private String position;

    // 手机号码
    @Column("phone_no")
    private String phoneNo;

    // 学历
    @Column("educational_background")
    private String educationalBackground;

    // 身份证正面
    @Column("id_card_pic_positive")
    private String idCardPicPositive;

    // 身份证反面
    @Column("id_card_pic_reverse")
    private String idCardPicReverse;

    // 资质证书
    @Column("certificate_pic")
    private String certificatePic;

    // 头像
    @Column("headPhoto_pic")
    private String headPhotoPic;

    // 创建人
    @Name
    @Column("create_user")
    private String createUser;

    // 创建时间
    @Column("create_time")
    private Date createTime;

    // 个人信息
    @Column("personal_info")
    @ColDefine(type= ColType.TEXT)
    private String personalInfo;

    // 是否删除  0：不删除  1：删除
    @Column("is_delete")
    private String isDelete;

    // 审核  0：未审核  1：审核通过 2：审核不通过
    @Column("examine")
    private String examine;

    @Comment("用户类型  0：农业 1：渔业")
    @Column("type")
    private String type;

    @Comment("总分数")
    @Column("total_score")
    @ColDefine(customType = "DECIMAL(10,2)")
    private double totalScore;

    @Comment("总评分次数")
    @Column("frequency")
    private int frequency;

    @Comment("专家在线或离线 0:离线，1：在线")
    @Column("online")
    @Default("0")
    private String onLine;

    public String getHeadPhotoPic() {
        return headPhotoPic;
    }

    public void setHeadPhotoPic(String headPhotoPic) {
        this.headPhotoPic = headPhotoPic;
    }

    public String getPersonalInfo() {
        return personalInfo;
    }

    public void setPersonalInfo(String personalInfo) {
        this.personalInfo = personalInfo;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getGoodAtFish() {
        return goodAtFish;
    }

    public void setGoodAtFish(String goodAtFish) {
        this.goodAtFish = goodAtFish;
    }

    public String getIdCardNo() {
        return idCardNo;
    }

    public void setIdCardNo(String idCardNo) {
        this.idCardNo = idCardNo;
    }

    public String getGoodAtDisease() {
        return goodAtDisease;
    }

    public void setGoodAtDisease(String goodAtDisease) {
        this.goodAtDisease = goodAtDisease;
    }

    public String getWorkUnits() {
        return workUnits;
    }

    public void setWorkUnits(String workUnits) {
        this.workUnits = workUnits;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getPhoneNo() {
        return phoneNo;
    }

    public void setPhoneNo(String phoneNo) {
        this.phoneNo = phoneNo;
    }

    public String getEducationalBackground() {
        return educationalBackground;
    }

    public void setEducationalBackground(String educationalBackground) {
        this.educationalBackground = educationalBackground;
    }

    public String getIdCardPicPositive() {
        return idCardPicPositive;
    }

    public void setIdCardPicPositive(String idCardPicPositive) {
        this.idCardPicPositive = idCardPicPositive;
    }

    public String getIdCardPicReverse() {
        return idCardPicReverse;
    }

    public void setIdCardPicReverse(String idCardPicReverse) {
        this.idCardPicReverse = idCardPicReverse;
    }

    public String getCertificatePic() {
        return certificatePic;
    }

    public void setCertificatePic(String certificatePic) {
        this.certificatePic = certificatePic;
    }

    public String getCreateUser() {
        return createUser;
    }

    public void setCreateUser(String createUser) {
        this.createUser = createUser;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getExamine() {
        return examine;
    }

    public void setExamine(String examine) {
        this.examine = examine;
    }

    public String getIsDelete() {
        return isDelete;
    }

    public void setIsDelete(String isDelete) {
        this.isDelete = isDelete;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public double getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(double totalScore) {
        this.totalScore = totalScore;
    }

    public int getFrequency() {
        return frequency;
    }

    public void setFrequency(int frequency) {
        this.frequency = frequency;
    }

    public String getOnLine() {
        return onLine;
    }

    public void setOnLine(String onLine) {
        this.onLine = onLine;
    }

}
