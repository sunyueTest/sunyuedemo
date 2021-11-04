package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Comment;
import org.nutz.dao.entity.annotation.Table;

import java.util.Date;

@Table("aquaculture_diseases")
public class AquacultureDiseasesBean extends DBVO{

    // 物种id
    @Column("species_id")
    private int speciesId;

    // 物种
    @Column("species")
    private String species;

    // 疾病类型id
    @Column("diseases_types_id")
    private String diseasesTypesId;

    // 疾病类型
    @Column("diseases_types")
    private String diseasesTypes;

    // 疾病名称
    @Column("diseases_name")
    private String diseasesName;

    // 疾病详情及预防措施
    @Column("diseases_content")
    private String diseasesContent;

    // 创建日期
    @Column("create_time")
    private Date createTime;

    // 行业类型 1-水产 2：农业
    @Column("industry_type")
    private String industryType;

    // 查看权限 0-所有角色可查看
    @Column("diseases_role")
    private String diseasesRole;

    @Comment("是否删除  0：不删除  1：删除")
    @Column("is_delete")
    private String isDelete;

    @Comment("创建人")
    @Column("user_name")
    private String userName;

    public String getIndustryType() {
        return industryType;
    }

    public void setIndustryType(String industryType) {
        this.industryType = industryType;
    }

    public String getDiseasesRole() {
        return diseasesRole;
    }

    public void setDiseasesRole(String diseasesRole) {
        this.diseasesRole = diseasesRole;
    }

    public String getDiseasesTypesId() {
        return diseasesTypesId;
    }

    public void setDiseasesTypesId(String diseasesTypesId) {
        this.diseasesTypesId = diseasesTypesId;
    }

    public int getSpeciesId() {
        return speciesId;
    }

    public void setSpeciesId(int speciesId) {
        this.speciesId = speciesId;
    }

    public String getSpecies() {
        return species;
    }

    public void setSpecies(String species) {
        this.species = species;
    }

    public String getDiseasesTypes() {
        return diseasesTypes;
    }

    public void setDiseasesTypes(String diseasesTypes) {
        this.diseasesTypes = diseasesTypes;
    }

    public String getDiseasesName() {
        return diseasesName;
    }

    public void setDiseasesName(String diseasesName) {
        this.diseasesName = diseasesName;
    }

    public String getDiseasesContent() {
        return diseasesContent;
    }

    public void setDiseasesContent(String diseasesContent) {
        this.diseasesContent = diseasesContent;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getIsDelete() {
        return isDelete;
    }

    public void setIsDelete(String isDelete) {
        this.isDelete = isDelete;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
}
