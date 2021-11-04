package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Table;

import java.util.Date;

@Table("aquaculture_pond")
public class AquaculturePondBean extends DBVO{

    // 池塘名称
    @Column("pond_name")
    private String pondName;

    // 创建时间
    @Column("create_time")
    private Date creatTime;

    // 创建人
    @Column("create_user")
    private String createUser;

    // 删除标识 0-未删除  1-已删除
    @Column("delete_flag")
    private String deleteFlag;

    // 产出量-总体重 (kg)
    @Column("out_put_amount")
    private String outputAmount;

    // 投放量-饲料 (kg)
    @Column("put_in_amount")
    private String putInAmount;

    // 最后投放时间
    @Column("last_put_in_time")
    private Date lastPutInTime;

    // 投放鱼苗量
    @Column("put_in_fry_amount")
    private String putInFryAmount;

    // 存活量
    @Column("survival_amount")
    private String survivalAmount;

    // 存活率 (存活量 / 投放鱼苗量 × 100%)
    @Column("rate_of_survival")
    private String rateOfSurvival;

    private String cameraSerial;

    //摄像头ID（因摄像头接口修改，原本根据摄像头编号查询好像不能用了）
    private long cameraId;

    public String getCameraSerial() {
        return cameraSerial;
    }

    public void setCameraSerial(String cameraSerial) {
        this.cameraSerial = cameraSerial;
    }

    public String getRateOfSurvival() {
        return rateOfSurvival;
    }

    public void setRateOfSurvival(String rateOfSurvival) {
        this.rateOfSurvival = rateOfSurvival;
    }

    public String getPutInFryAmount() {
        return putInFryAmount;
    }

    public void setPutInFryAmount(String putInFryAmount) {
        this.putInFryAmount = putInFryAmount;
    }

    public String getSurvivalAmount() {
        return survivalAmount;
    }

    public void setSurvivalAmount(String survivalAmount) {
        this.survivalAmount = survivalAmount;
    }

    public Date getLastPutInTime() {
        return lastPutInTime;
    }

    public void setLastPutInTime(Date lastPutInTime) {
        this.lastPutInTime = lastPutInTime;
    }

    public String getPondName() {
        return pondName;
    }

    public void setPondName(String pondName) {
        this.pondName = pondName;
    }

    public Date getCreatTime() {
        return creatTime;
    }

    public void setCreatTime(Date creatTime) {
        this.creatTime = creatTime;
    }

    public String getCreateUser() {
        return createUser;
    }

    public void setCreateUser(String createUser) {
        this.createUser = createUser;
    }

    public String getDeleteFlag() {
        return deleteFlag;
    }

    public void setDeleteFlag(String deleteFlag) {
        this.deleteFlag = deleteFlag;
    }

    public String getOutputAmount() {
        return outputAmount;
    }

    public void setOutputAmount(String outputAmount) {
        this.outputAmount = outputAmount;
    }

    public String getPutInAmount() {
        return putInAmount;
    }

    public void setPutInAmount(String putInAmount) {
        this.putInAmount = putInAmount;
    }

    public long getCameraId() {
        return cameraId;
    }

    public void setCameraId(long cameraId) {
        this.cameraId = cameraId;
    }
}
