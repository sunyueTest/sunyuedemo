package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.ColDefine;
import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Comment;
import org.nutz.dao.entity.annotation.Table;

import java.util.Date;

@Table("aquaculture_experts_diagnosis")
public class AquacultureExpertsDiagnosisBean extends DBVO {

    // 诊断品种
    @Column("species")
    @ColDefine(width = 500)
    private String species;

    // 养殖面积
    @Column("area")
    private String area;

    // 个体大小
    @Column("size")
    private String size;

    // 水深
    @Column("depth_of_water")
    private String depthOfWater;

    // 病情描述
    @Column("disease_content")
    private String diseaseContent;

    // 拍照
    @Column("diagnosis_pic")
    private String diagnosisPic;

    // 水环境描述
    @Column("water_content")
    private String waterContent;

    // 创建人
    @Column("create_user")
    private String createUser;

	@Comment("创建用户名")
    @Column("create_name")
    private String createName;

    // 创建时间
    @Column("create_time")
    private Date createTime;

    // 回答
    @Column("answer")
    private String answer;

    // 是否已回答 0-未回答  1-已回答
    @Column("answer_flag")
    private String answerFlag;

    // 专家id
    @Column("experts_id")
    private String expertsId;

    @Comment("专家名")
    @Column("experts_name")
    private String expertsName;

    // 回答时间
    @Column("answer_time")
    private Date answerTime;

    private String expertsPic;

    @Comment("用户评论")
    @Column("comment")
    @ColDefine(width = 500)
    private String comment;

    @Comment("分数")
    @Column("total_score")
    @ColDefine(customType = "DECIMAL(10,2)")
    private double totalScore;

    public String getExpertsName() {
        return expertsName;
    }

    public void setExpertsName(String expertsName) {
        this.expertsName = expertsName;
    }

    public String getExpertsPic() {
        return expertsPic;
    }

    public void setExpertsPic(String expertsPic) {
        this.expertsPic = expertsPic;
    }

    public String getAnswerFlag() {
        return answerFlag;
    }

    public void setAnswerFlag(String answerFlag) {
        this.answerFlag = answerFlag;
    }

    public String getSpecies() {
        return species;
    }

    public void setSpecies(String species) {
        this.species = species;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public String getDepthOfWater() {
        return depthOfWater;
    }

    public void setDepthOfWater(String depthOfWater) {
        this.depthOfWater = depthOfWater;
    }

    public String getDiseaseContent() {
        return diseaseContent;
    }

    public void setDiseaseContent(String diseaseContent) {
        this.diseaseContent = diseaseContent;
    }

    public String getDiagnosisPic() {
        return diagnosisPic;
    }

    public void setDiagnosisPic(String diagnosisPic) {
        this.diagnosisPic = diagnosisPic;
    }

    public String getWaterContent() {
        return waterContent;
    }

    public void setWaterContent(String waterContent) {
        this.waterContent = waterContent;
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

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public String getExpertsId() {
        return expertsId;
    }

    public void setExpertsId(String expertsId) {
        this.expertsId = expertsId;
    }

    public Date getAnswerTime() {
        return answerTime;
    }

    public void setAnswerTime(Date answerTime) {
        this.answerTime = answerTime;
    }

    public double getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(double totalScore) {
        this.totalScore = totalScore;
    }

    public String getCreateName() {
        return createName;
    }

    public void setCreateName(String createName) {
        this.createName = createName;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
