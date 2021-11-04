package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Table;

import java.util.Date;

/**
 * 水产养殖-鱼技服务-自助诊断-品类
 */
@Table("aquaculture_self_diagnosis")
public class AquacultureSelfDiagnosisBean extends DBVO{

    // 物种id
    @Column("species_id")
    private int speciesId;

    // 物种
    @Column("species")
    private String species;

    // 品种
    @Column("varieties")
    private String varieties;

    // 品种
    @Column("varieties_id")
    private int varietiesId;

    // 水质
    @Column("the_water_quality")
    private String theWaterQuality;

    // 水质id
    @Column("the_water_quality_id")
    private int theWaterQualityId;

    // 创建日期
    @Column("create_time")
    private Date createTime;

    // 查看权限 0-所有角色可查看
    @Column("diseases_role")
    private String diseasesRole;

    public int getVarietiesId() {
        return varietiesId;
    }

    public void setVarietiesId(int varietiesId) {
        this.varietiesId = varietiesId;
    }

    public int getTheWaterQualityId() {
        return theWaterQualityId;
    }

    public void setTheWaterQualityId(int theWaterQualityId) {
        this.theWaterQualityId = theWaterQualityId;
    }

    public String getVarieties() {
        return varieties;
    }

    public void setVarieties(String varieties) {
        this.varieties = varieties;
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

    public String getTheWaterQuality() {
        return theWaterQuality;
    }

    public void setTheWaterQuality(String theWaterQuality) {
        this.theWaterQuality = theWaterQuality;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getDiseasesRole() {
        return diseasesRole;
    }

    public void setDiseasesRole(String diseasesRole) {
        this.diseasesRole = diseasesRole;
    }
}
