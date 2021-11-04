package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Comment;
import org.nutz.dao.entity.annotation.Default;
import org.nutz.dao.entity.annotation.Table;

import java.sql.Timestamp;

@Table("farm_crops")
public class FarmCropsBean extends DBVO {

    // 所属农场id
    @Column("farm_info_id")
    private String farmInfoId;

    // 作物名称
    @Column("crops_name")
    private String cropsName;

    // 作物编号
    @Column("crops_number")
    private String cropsNumber;

    // 土地编号
    @Column("land_number")
    private String landNumber;

    // 土地面积(亩)
    @Column("land_area")
    private String landArea;

    // 生长周期 (苗期/成长期/成熟期)
    //    @Column("growth_cycle")
    private String growthCycle;

    // 种植日期
    @Column("planting_date")
    private Timestamp plantingDate;

    // 收获日期
    @Column("harvest_date")
    private Timestamp harvestDate;

    // 种植天数
    private String plantingDays;

    // 总种植天数
    private String totalDays;

    // 创建人
    @Column("create_user")
    private String createUser;

    // 创建时间
    @Column("create_time")
    private Timestamp createTime;

    // 状态 1-删除 0-未删除
    @Column("delete_flag")
    private String deleteFlag;

    @Comment("种植数量")
    @Column("botany_num")
    @Default("0")
    private int botanyNum;

    @Comment("类型：动物1，植物0")
    @Column("type")
    private String type;

    @Comment("坐标X")
    @Column("coordinate_x")
    private String coordinateX;
    @Comment("坐标Y")
    @Column("coordinate_y")
    private String coordinateY;

    public String getTotalDays() {
        return totalDays;
    }

    public void setTotalDays(String totalDays) {
        this.totalDays = totalDays;
    }

    public String getDeleteFlag() {
        return deleteFlag;
    }

    public void setDeleteFlag(String deleteFlag) {
        this.deleteFlag = deleteFlag;
    }

    public String getFarmInfoId() {
        return farmInfoId;
    }

    public void setFarmInfoId(String farmInfoId) {
        this.farmInfoId = farmInfoId;
    }

    public String getCreateUser() {
        return createUser;
    }

    public void setCreateUser(String createUser) {
        this.createUser = createUser;
    }

    public Timestamp getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Timestamp createTime) {
        this.createTime = createTime;
    }

    public String getCropsName() {
        return cropsName;
    }

    public void setCropsName(String cropsName) {
        this.cropsName = cropsName;
    }

    public String getCropsNumber() {
        return cropsNumber;
    }

    public void setCropsNumber(String cropsNumber) {
        this.cropsNumber = cropsNumber;
    }

    public String getLandNumber() {
        return landNumber;
    }

    public void setLandNumber(String landNumber) {
        this.landNumber = landNumber;
    }

    public String getLandArea() {
        return landArea;
    }

    public void setLandArea(String landArea) {
        this.landArea = landArea;
    }

    public String getGrowthCycle() {
        return growthCycle;
    }

    public void setGrowthCycle(String growthCycle) {
        this.growthCycle = growthCycle;
    }

    public Timestamp getPlantingDate() {
        return plantingDate;
    }

    public void setPlantingDate(Timestamp plantingDate) {
        this.plantingDate = plantingDate;
    }

    public Timestamp getHarvestDate() {
        return harvestDate;
    }

    public void setHarvestDate(Timestamp harvestDate) {
        this.harvestDate = harvestDate;
    }

    public String getPlantingDays() {
        return plantingDays;
    }

    public void setPlantingDays(String plantingDays) {
        this.plantingDays = plantingDays;
    }

    public int getBotanyNum() {
        return botanyNum;
    }

    public void setBotanyNum(int botanyNum) {
        this.botanyNum = botanyNum;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCoordinateX() {
        return coordinateX;
    }

    public void setCoordinateX(String coordinateX) {
        this.coordinateX = coordinateX;
    }

    public String getCoordinateY() {
        return coordinateY;
    }

    public void setCoordinateY(String coordinateY) {
        this.coordinateY = coordinateY;
    }
}
